import { createServerFn } from '@tanstack/react-start';
import { getRequest } from '@tanstack/react-start/server';
import { auth } from '@/features/auth/auth.server';
import { prisma } from '@/features/database/lib/client.server';
import {
  AcceptInvitationSchema,
  CreateShopSchema,
  InviteEmployeeSchema,
  RejectInvitationSchema,
  RemoveEmployeeSchema,
  ShopIdParamSchema,
} from './shop.schemas';
import {
  createInvitationRecord,
  createShopRecord,
  createStaffProfile,
  findPendingInvitation,
  findUserByPhone,
  findUserMembership,
  getInvitationById,
  getInvitationsByPhone,
  getShopByOrgId,
  getShopWithMembers,
  getShopWithMembersBasic,
  markInvitationAccepted,
  markInvitationRejected,
  softDeleteStaffProfile,
} from './shop.server';

// --- Helper: get current session + raw request headers ---

async function getRequestContext() {
  const request = getRequest();
  const session = await auth.api.getSession({ headers: request.headers });
  return { session, headers: request.headers, auth };
}

// --- Create Shop ---

export const createShopFn = createServerFn({ method: 'POST' })
  .validator((data: unknown) => CreateShopSchema.parse(data))
  .handler(async ({ data }) => {
    const { session, headers, auth: authInstance } = await getRequestContext();
    if (!session?.user) throw new Error('Oturum bulunamadı');

    const slug = `${data.title.toLowerCase().replace(/\s+/g, '-')}-${Date.now().toString(36)}`;

    const org = await authInstance.api.createOrganization({
      headers,
      body: { name: data.title, slug },
    });

    try {
      const shop = await createShopRecord(org.id, data);
      await authInstance.api.setActiveOrganization({
        headers,
        body: { organizationId: org.id },
      });
      return { shopId: shop.id, organizationId: org.id };
    } catch (err) {
      // Shop creation failed — clean up the organization
      await authInstance.api.deleteOrganization({
        headers,
        body: { organizationId: org.id },
      });
      throw err;
    }
  });

// --- Invite Employee ---

export const inviteEmployeeFn = createServerFn({ method: 'POST' })
  .validator((data: unknown) => InviteEmployeeSchema.parse(data))
  .handler(async ({ data }) => {
    const { session } = await getRequestContext();
    if (!session?.user) throw new Error('Oturum bulunamadı');

    const shop = await getShopByOrgId(data.shopId);
    if (!shop) throw new Error('Dükkan bulunamadı');

    const membership = await findUserMembership(shop.organizationId, session.user.id);
    if (!membership || !['owner', 'manager'].includes(membership.role)) {
      throw new Error('Bu işlem için yetkiniz yok');
    }

    const existingPending = await findPendingInvitation(shop.id, data.phone);
    if (existingPending) throw new Error('Bu numara için zaten bekleyen bir davet var');

    const existingUser = await findUserByPhone(data.phone);
    if (existingUser) {
      const existingMember = await findUserMembership(shop.organizationId, existingUser.id);
      if (existingMember) throw new Error('Bu kullanıcı zaten bu dükkanın üyesi');
    }

    // Check + create atomically to prevent duplicate pending invitations
    const invitation = await prisma.$transaction(async (tx) => {
      const existing = await tx.shopInvitation.findFirst({
        where: { shopId: shop.id, phone: data.phone, status: 'pending' },
      });
      if (existing) throw new Error('Bu numara için zaten bekleyen bir davet var');

      return createInvitationRecord(
        {
          shopId: shop.id,
          organizationId: shop.organizationId,
          phone: data.phone,
          invitedById: session.user.id,
        },
        tx,
      );
    });

    return { id: invitation.id };
  });

// --- My Invitations ---

export const getMyInvitationsFn = createServerFn({ method: 'GET' }).handler(async () => {
  const { session } = await getRequestContext();
  if (!session?.user?.phoneNumber) return [];
  return getInvitationsByPhone(session.user.phoneNumber);
});

// --- Accept Invitation ---

export const acceptInvitationFn = createServerFn({ method: 'POST' })
  .validator((data: unknown) => AcceptInvitationSchema.parse(data))
  .handler(async ({ data }) => {
    const { session, headers, auth: authInstance } = await getRequestContext();
    if (!session?.user) throw new Error('Oturum bulunamadı');

    const invitation = await getInvitationById(data.invitationId);
    if (!invitation) throw new Error('Davet bulunamadı');
    if (invitation.expiresAt < new Date()) throw new Error('Davetin süresi dolmuş');
    if (invitation.phone !== session.user.phoneNumber) throw new Error('Bu davet size ait değil');

    // Prisma first — reversible if better-auth fails.
    let staffProfileId: string | null = null;
    try {
      await prisma.$transaction(async (tx) => {
        const result = await markInvitationAccepted(data.invitationId, data.displayName, tx);
        if (!result.count) throw new Error('Bu davet artık geçerli değil');

        const profile = await createStaffProfile(
          session.user.id,
          invitation.shopId,
          data.displayName,
          tx,
        );
        staffProfileId = profile.id;
      });

      await authInstance.api.addMember({
        headers,
        body: {
          organizationId: invitation.organizationId,
          userId: session.user.id,
          role: 'member',
        },
      });

      await authInstance.api.setActiveOrganization({
        headers,
        body: { organizationId: invitation.organizationId },
      });
    } catch (err) {
      // Undo Prisma changes if better-auth failed
      if (staffProfileId) {
        await prisma.staffProfile.update({
          where: { id: staffProfileId },
          data: { deletedAt: new Date() },
        });
      }
      await prisma.shopInvitation.updateMany({
        where: { id: data.invitationId, status: 'accepted' },
        data: { status: 'pending', displayName: null },
      });
      throw err;
    }

    return { success: true };
  });

// --- Reject Invitation ---

export const rejectInvitationFn = createServerFn({ method: 'POST' })
  .validator((data: unknown) => RejectInvitationSchema.parse(data))
  .handler(async ({ data }) => {
    const { session } = await getRequestContext();
    if (!session?.user) throw new Error('Oturum bulunamadı');

    const invitation = await getInvitationById(data.invitationId);
    if (!invitation) throw new Error('Davet bulunamadı');
    if (invitation.phone !== session.user.phoneNumber) throw new Error('Bu davet size ait değil');

    await markInvitationRejected(data.invitationId);

    return { success: true };
  });

// --- Get Shop Employees (for owner panel) ---

export const getShopEmployeesFn = createServerFn({ method: 'GET' })
  .validator((data: unknown) => ShopIdParamSchema.parse(data))
  .handler(async ({ data }) => {
    const { session } = await getRequestContext();
    if (!session?.user) throw new Error('Oturum bulunamadı');

    const shop = await getShopWithMembers(data.shopId);
    if (!shop) throw new Error('Dükkan bulunamadı');

    return {
      shop: { id: shop.id, title: shop.title },
      members: shop.organization.members,
      staffProfiles: shop.staffProfiles,
    };
  });

// --- Remove Employee ---

export const removeEmployeeFn = createServerFn({ method: 'POST' })
  .validator((data: unknown) => RemoveEmployeeSchema.parse(data))
  .handler(async ({ data }) => {
    const { session, headers, auth: authInstance } = await getRequestContext();
    if (!session?.user) throw new Error('Oturum bulunamadı');

    const shop = await getShopByOrgId(data.shopId);
    if (!shop) throw new Error('Dükkan bulunamadı');

    const membership = await findUserMembership(shop.organizationId, session.user.id);
    if (!membership || !['owner', 'manager'].includes(membership.role)) {
      throw new Error('Bu işlem için yetkiniz yok');
    }

    const memberToRemove = await prisma.member.findUnique({
      where: { id: data.memberId },
    });
    if (!memberToRemove) throw new Error('Üye bulunamadı');

    // Remove member first — if softDelete fails, membership is already gone but profile can be cleaned up later.
    await authInstance.api.removeMember({
      headers,
      body: {
        organizationId: shop.organizationId,
        memberIdOrEmail: data.memberId,
      },
    });

    await softDeleteStaffProfile(memberToRemove.userId, data.shopId);

    return { success: true };
  });

// --- Owner Dashboard ---

export const getShopDashboardFn = createServerFn({ method: 'GET' })
  .validator((data: unknown) => ShopIdParamSchema.parse(data))
  .handler(async ({ data }) => {
    const { session } = await getRequestContext();
    if (!session?.user) throw new Error('Oturum bulunamadı');

    const shop = await getShopWithMembersBasic(data.shopId);
    if (!shop) throw new Error('Dükkan bulunamadı');

    const owner = shop.organization.members.find((m) => m.role === 'owner');

    return {
      shop: { title: shop.title },
      ownerName: owner?.user.name ?? 'Bilinmeyen',
      memberCount: shop.organization.members.length,
    };
  });

// --- Employee Dashboard ---

export const getEmployeeDashboardFn = createServerFn({ method: 'GET' })
  .validator((data: unknown) => ShopIdParamSchema.parse(data))
  .handler(async ({ data }) => {
    const { session } = await getRequestContext();
    if (!session?.user) throw new Error('Oturum bulunamadı');

    const shop = await getShopWithMembers(data.shopId);
    if (!shop) throw new Error('Dükkan bulunamadı');

    return {
      shop: { title: shop.title },
      members: shop.organization.members.map((m) => ({
        id: m.id,
        role: m.role,
        user: m.user,
        profile: shop.staffProfiles.find((sp) => sp.userId === m.user.id),
      })),
    };
  });
