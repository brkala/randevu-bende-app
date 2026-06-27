import { prisma } from '@/features/database/lib/client.server';
import type { CreateShopInput } from './shop.schemas';

// --- Shop CRUD ---

export async function createShopRecord(organizationId: string, input: CreateShopInput) {
  return prisma.shop.create({
    data: {
      organizationId,
      title: input.title,
    },
  });
}

export async function getShopById(shopId: string) {
  return prisma.shop.findUnique({ where: { id: shopId } });
}

export async function getShopByOrgId(organizationId: string) {
  return prisma.shop.findUnique({ where: { organizationId } });
}

// --- Invitation CRUD ---

interface CreateInvitationParams {
  shopId: string;
  organizationId: string;
  phone: string;
  invitedById: string;
}

export async function createInvitationRecord(params: CreateInvitationParams) {
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);

  return prisma.shopInvitation.create({
    data: {
      shopId: params.shopId,
      organizationId: params.organizationId,
      phone: params.phone,
      invitedById: params.invitedById,
      status: 'pending',
      expiresAt,
    },
  });
}

export async function findPendingInvitation(shopId: string, phone: string) {
  return prisma.shopInvitation.findFirst({
    where: { shopId, phone, status: 'pending' },
  });
}

export async function findAcceptedInvitation(shopId: string, phone: string) {
  return prisma.shopInvitation.findFirst({
    where: { shopId, phone, status: 'accepted' },
  });
}

export async function getInvitationById(invitationId: string) {
  return prisma.shopInvitation.findUnique({
    where: { id: invitationId },
    include: { shop: true },
  });
}

export async function getInvitationsByPhone(phone: string) {
  return prisma.shopInvitation.findMany({
    where: {
      phone,
      status: 'pending',
      expiresAt: { gt: new Date() },
    },
    include: {
      shop: { select: { title: true } },
      invitedBy: { select: { name: true } },
    },
    orderBy: { createdAt: 'desc' },
  });
}

export async function markInvitationAccepted(invitationId: string, displayName: string) {
  return prisma.shopInvitation.update({
    where: { id: invitationId },
    data: { status: 'accepted', displayName },
  });
}

export async function markInvitationRejected(invitationId: string) {
  return prisma.shopInvitation.update({
    where: { id: invitationId },
    data: { status: 'rejected' },
  });
}

// --- Membership Checks ---

export async function findUserMembership(organizationId: string, userId: string) {
  return prisma.member.findFirst({
    where: { organizationId, userId },
  });
}

export async function findUserByPhone(phone: string) {
  return prisma.user.findUnique({ where: { phoneNumber: phone } });
}

// --- Staff Profile ---

export async function createStaffProfile(userId: string, shopId: string, displayName: string) {
  return prisma.staffProfile.create({
    data: { userId, shopId, displayName },
  });
}

export async function softDeleteStaffProfile(userId: string, shopId: string) {
  return prisma.staffProfile.updateMany({
    where: { userId, shopId, deletedAt: null },
    data: { deletedAt: new Date() },
  });
}

// --- Employee / Dashboard Queries ---

export async function getShopWithMembers(shopId: string) {
  return prisma.shop.findUnique({
    where: { id: shopId },
    include: {
      organization: {
        include: {
          members: {
            include: {
              user: { select: { id: true, name: true, phoneNumber: true, image: true } },
            },
          },
        },
      },
      staffProfiles: {
        where: { deletedAt: null },
        include: {
          user: { select: { id: true, name: true, phoneNumber: true, image: true } },
        },
      },
    },
  });
}

export async function getShopWithMembersBasic(shopId: string) {
  return prisma.shop.findUnique({
    where: { id: shopId },
    include: {
      organization: {
        include: {
          members: {
            include: {
              user: { select: { id: true, name: true } },
            },
          },
        },
      },
    },
  });
}
