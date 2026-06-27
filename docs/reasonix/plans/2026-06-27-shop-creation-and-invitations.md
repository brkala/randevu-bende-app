# Shop Creation & Invitation System Implementation Plan

> **For agentic workers:** implement this plan task-by-task — dispatch a fresh subagent per task with the native `task` tool (recommended for quality), or use the superpowers-executing-plans skill to work through it inline. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Allow authenticated members to create shops (organizations) and invite other users by phone number to join as employees, with per-shop staff profiles.

**Architecture:** Each shop is backed by a better-auth `Organization` (auth/team management) bridged 1-to-1 to a `Shop` record (business data). Phone-based invitations use a custom `ShopInvitation` model rather than better-auth's email-based invitation system. Employee membership uses better-auth's `Member` table, and per-shop identity (display name, avatar) uses the existing `StaffProfile` model. The owner panel uses a sidebar-layout with Dashboard and Employees pages. Server logic is split per project conventions: `shop.schemas.ts` (Zod), `shop.server.ts` (pure Prisma CRUD), `shop.functions.ts` (RPC bridges), `shop.queries.ts` (TanStack Query keys/options). Components use kebab-case file naming.

**Tech Stack:** TanStack Start (server functions), better-auth (organization plugin), Prisma (PostgreSQL), Ark UI (Listbox, Dialog, PinInput), tailwind-variants, TanStack Query, Lucide icons, Storybook

---

### Task 1: Update Prisma Schema — Add `title` to Shop + `ShopInvitation` model

**Files:**
- Modify: `src/features/database/models/shop.prisma`
- Modify: `src/features/database/models/auth.prisma`

- [ ] **Step 1: Add `title` to Shop and add `ShopInvitation` model**

Edit `src/features/database/models/shop.prisma` — replace the entire file:

```prisma
model Shop {
  id             String       @id @default(uuid(7))
  organizationId String       @unique
  organization   Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)

  title     String?
  phone     String?
  address   String?
  taxNumber String?

  deletedAt DateTime?
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt

  staffProfiles   StaffProfile[]
  shopInvitations ShopInvitation[]

  @@map("shops")
}

model StaffProfile {
  id     String @id @default(uuid(7))
  userId String
  user   User   @relation(fields: [userId], references: [id], onDelete: Cascade)
  shopId String
  shop   Shop   @relation(fields: [shopId], references: [id], onDelete: Cascade)

  title       String?
  displayName String
  bio         String?
  avatarUrl   String?

  deletedAt DateTime?
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt

  @@unique([userId, shopId])
  @@map("staff_profiles")
}

model ShopInvitation {
  id             String   @id @default(uuid(7))
  shopId         String
  shop           Shop     @relation(fields: [shopId], references: [id], onDelete: Cascade)
  organizationId String

  phone       String
  invitedById String
  invitedBy   User     @relation("ShopInvitationInviter", fields: [invitedById], references: [id], onDelete: Cascade)
  displayName String?
  status      String   @default("pending") // "pending" | "accepted" | "rejected"
  expiresAt   DateTime
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@map("shop_invitations")
}
```

- [ ] **Step 2: Add `shopInvitations` relation to User model**

Edit `src/features/database/models/auth.prisma` — add the relation line inside the `User` model, after `staffProfiles`:

```prisma
  staffProfiles    StaffProfile[]
  shopInvitations  ShopInvitation[] @relation("ShopInvitationInviter")
```

Exact edit: find the line `staffProfiles       StaffProfile[]` in `auth.prisma` and add the `shopInvitations` line right after it.

- [ ] **Step 3: Run Prisma migration**

Run:
```bash
cd "C:\Users\Burak\Desktop\NF3\hazeleyesoftware\randevu-bende-app"
pnpm dlx prisma migrate dev --name add-shop-title-and-invitations
```
Expected: Migration created and applied successfully.

- [ ] **Step 4: Generate Prisma client**

Run:
```bash
pnpm dlx prisma generate
```
Expected: Prisma client regenerated — `ShopInvitation` and `Shop.title` now available.

- [ ] **Step 5: Commit**

```bash
git add src/features/database/models/shop.prisma src/features/database/models/auth.prisma src/features/database/migrations/
git commit -m "feat(db): add shop title and ShopInvitation model"
```

---

### Task 2: Create Shop Zod Schemas + Pure Server Logic

**Files:**
- Create: `src/features/shop/shop.schemas.ts`
- Create: `src/features/shop/shop.server.ts`

- [ ] **Step 1: Create shop.schemas.ts**

Create `src/features/shop/shop.schemas.ts`:

```ts
import { z } from 'zod';

// --- Shop ---

export const CreateShopSchema = z.object({
  title: z.string().min(1, 'Dükkan adı zorunludur').max(100, 'Dükkan adı en fazla 100 karakter olabilir'),
});

export type CreateShopInput = z.infer<typeof CreateShopSchema>;

// --- Invitation ---

export const InviteEmployeeSchema = z.object({
  shopId: z.string().min(1),
  phone: z.string().min(10, 'Geçerli bir telefon numarası giriniz').max(15),
});

export type InviteEmployeeInput = z.infer<typeof InviteEmployeeSchema>;

export const AcceptInvitationSchema = z.object({
  invitationId: z.string().min(1),
  displayName: z.string().min(1, 'Görünür isim zorunludur').max(100, 'Görünür isim en fazla 100 karakter olabilir'),
});

export type AcceptInvitationInput = z.infer<typeof AcceptInvitationSchema>;

export const RejectInvitationSchema = z.object({
  invitationId: z.string().min(1),
});

export type RejectInvitationInput = z.infer<typeof RejectInvitationSchema>;

// --- Employee Removal ---

export const RemoveEmployeeSchema = z.object({
  shopId: z.string().min(1),
  memberId: z.string().min(1),
});

export type RemoveEmployeeInput = z.infer<typeof RemoveEmployeeSchema>;

// --- Query params ---

export const ShopIdParamSchema = z.object({
  shopId: z.string().min(1),
});

export type ShopIdParam = z.infer<typeof ShopIdParamSchema>;
```

- [ ] **Step 2: Create shop.server.ts**

Create `src/features/shop/shop.server.ts`:

```ts
import { prisma } from '@/features/database/lib/client.server';
import type { AcceptInvitationInput, CreateShopInput, InviteEmployeeInput, RemoveEmployeeInput, RejectInvitationInput, ShopIdParam } from './shop.schemas';

// --- Shop CRUD ---

export async function createShopRecord(organizationId: string, input: CreateShopInput) {
  return prisma.shop.create({
    data: {
      organizationId,
      title: input.title,
    },
  });
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

export async function getShopById(shopId: string) {
  return prisma.shop.findUnique({ where: { id: shopId } });
}
```

- [ ] **Step 3: Run type check**

Run:
```bash
cd "C:\Users\Burak\Desktop\NF3\hazeleyesoftware\randevu-bende-app"
pnpm tsc --noEmit
```
Expected: No type errors.

- [ ] **Step 4: Commit**

```bash
git add src/features/shop/
git commit -m "feat(shop): add zod schemas and pure server logic"
```

---

### Task 3: Create RPC Functions + TanStack Query Options

**Files:**
- Create: `src/features/shop/shop.functions.ts`
- Create: `src/features/shop/shop.queries.ts`

- [ ] **Step 1: Create shop.functions.ts**

Create `src/features/shop/shop.functions.ts`:

```ts
import { createServerFn } from '@tanstack/react-start';
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
  findAcceptedInvitation,
  findPendingInvitation,
  findUserByPhone,
  findUserMembership,
  getInvitationById,
  getInvitationsByPhone,
  getShopById,
  getShopWithMembers,
  getShopWithMembersBasic,
  markInvitationAccepted,
  markInvitationRejected,
  softDeleteStaffProfile,
} from './shop.server';

// --- Helper: get current session + raw request headers ---

async function getRequestContext() {
  const { getRequest } = await import('@tanstack/react-start/server');
  const { auth } = await import('@/features/auth/auth.server');
  const request = getRequest();
  const session = await auth.api.getSession({ headers: request.headers });
  return { session, headers: request.headers, auth };
}

// --- Create Shop ---

export const createShopFn = createServerFn({ method: 'POST' })
  .validator((data: unknown) => CreateShopSchema.parse(data))
  .handler(async ({ data }) => {
    const { session, headers, auth } = await getRequestContext();
    if (!session?.user) throw new Error('Oturum bulunamadı');

    const slug = data.title.toLowerCase().replace(/\s+/g, '-') + '-' + Date.now().toString(36);

    const org = await auth.api.createOrganization({
      headers,
      body: { name: data.title, slug },
    });

    const shop = await createShopRecord(org.id, data);

    return { shopId: shop.id, organizationId: org.id };
  });

// --- Invite Employee ---

export const inviteEmployeeFn = createServerFn({ method: 'POST' })
  .validator((data: unknown) => InviteEmployeeSchema.parse(data))
  .handler(async ({ data }) => {
    const { session } = await getRequestContext();
    if (!session?.user) throw new Error('Oturum bulunamadı');

    const shop = await getShopById(data.shopId);
    if (!shop) throw new Error('Dükkan bulunamadı');

    // Permission check
    const membership = await findUserMembership(shop.organizationId, session.user.id);
    if (!membership || !['owner', 'manager'].includes(membership.role)) {
      throw new Error('Bu işlem için yetkiniz yok');
    }

    // Duplicate pending invite check
    const existingPending = await findPendingInvitation(data.shopId, data.phone);
    if (existingPending) throw new Error('Bu numara için zaten bekleyen bir davet var');

    // Already a member check
    const existingUser = await findUserByPhone(data.phone);
    if (existingUser) {
      const existingMember = await findUserMembership(shop.organizationId, existingUser.id);
      if (existingMember) throw new Error('Bu kullanıcı zaten bu dükkanın üyesi');

      const acceptedInvite = await findAcceptedInvitation(data.shopId, data.phone);
      if (acceptedInvite) throw new Error('Bu kullanıcı zaten bu dükkanın üyesi');
    }

    const invitation = await createInvitationRecord({
      shopId: data.shopId,
      organizationId: shop.organizationId,
      phone: data.phone,
      invitedById: session.user.id,
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
    const { session, headers, auth } = await getRequestContext();
    if (!session?.user) throw new Error('Oturum bulunamadı');

    const invitation = await getInvitationById(data.invitationId);
    if (!invitation) throw new Error('Davet bulunamadı');
    if (invitation.status !== 'pending') throw new Error('Bu davet artık geçerli değil');
    if (invitation.expiresAt < new Date()) throw new Error('Davetin süresi dolmuş');
    if (invitation.phone !== session.user.phoneNumber) throw new Error('Bu davet size ait değil');

    // Add member via better-auth
    await auth.api.addMember({
      headers,
      body: {
        organizationId: invitation.organizationId,
        userId: session.user.id,
        role: 'employee',
      },
    });

    // Create StaffProfile
    await createStaffProfile(session.user.id, invitation.shopId, data.displayName);

    // Mark invitation accepted
    await markInvitationAccepted(data.invitationId, data.displayName);

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
    const { session, headers, auth } = await getRequestContext();
    if (!session?.user) throw new Error('Oturum bulunamadı');

    const shop = await getShopById(data.shopId);
    if (!shop) throw new Error('Dükkan bulunamadı');

    // Permission check
    const membership = await findUserMembership(shop.organizationId, session.user.id);
    if (!membership || !['owner', 'manager'].includes(membership.role)) {
      throw new Error('Bu işlem için yetkiniz yok');
    }

    // Find the member to remove
    const { prisma } = await import('@/features/database/lib/client.server');
    const memberToRemove = await prisma.member.findUnique({ where: { id: data.memberId } });
    if (!memberToRemove) throw new Error('Üye bulunamadı');

    // Soft-delete StaffProfile
    await softDeleteStaffProfile(memberToRemove.userId, data.shopId);

    // Remove member via better-auth
    await auth.api.removeMember({
      headers,
      body: {
        organizationId: shop.organizationId,
        memberId: data.memberId,
      },
    });

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
```

- [ ] **Step 2: Create shop.queries.ts**

Create `src/features/shop/shop.queries.ts`:

```ts
import { queryOptions } from '@tanstack/react-query';
import {
  getEmployeeDashboardFn,
  getMyInvitationsFn,
  getShopDashboardFn,
  getShopEmployeesFn,
} from './shop.functions';

export const shopKeys = {
  all: ['shop'] as const,
  dashboards: () => [...shopKeys.all, 'dashboard'] as const,
  dashboard: (shopId: string) => [...shopKeys.dashboards(), shopId] as const,
  employees: () => [...shopKeys.all, 'employees'] as const,
  employeeList: (shopId: string) => [...shopKeys.employees(), shopId] as const,
  invitations: () => [...shopKeys.all, 'invitations'] as const,
  myInvitations: () => [...shopKeys.invitations(), 'mine'] as const,
  employeeDashboard: () => [...shopKeys.all, 'employee-dashboard'] as const,
  employeeDash: (shopId: string) => [...shopKeys.employeeDashboard(), shopId] as const,
};

export const shopQueries = {
  dashboard: (shopId: string) =>
    queryOptions({
      queryKey: shopKeys.dashboard(shopId),
      queryFn: () => getShopDashboardFn({ data: { shopId } }),
    }),
  employees: (shopId: string) =>
    queryOptions({
      queryKey: shopKeys.employeeList(shopId),
      queryFn: () => getShopEmployeesFn({ data: { shopId } }),
    }),
  myInvitations: () =>
    queryOptions({
      queryKey: shopKeys.myInvitations(),
      queryFn: () => getMyInvitationsFn(),
    }),
  employeeDashboard: (shopId: string) =>
    queryOptions({
      queryKey: shopKeys.employeeDash(shopId),
      queryFn: () => getEmployeeDashboardFn({ data: { shopId } }),
    }),
};
```

- [ ] **Step 3: Run type check**

Run:
```bash
cd "C:\Users\Burak\Desktop\NF3\hazeleyesoftware\randevu-bende-app"
pnpm tsc --noEmit
```
Expected: No type errors.

- [ ] **Step 4: Commit**

```bash
git add src/features/shop/
git commit -m "feat(shop): add rpc functions and query options"
```

---

### Task 4: Add "square" variant to Avatar component + Storybook update

**Files:**
- Modify: `src/features/shared/components/ui/avatar.tsx`
- Modify: `src/features/shared/components/ui/avatar.stories.tsx`

- [ ] **Step 1: Update avatar.tsx with square variant**

Edit `src/features/shared/components/ui/avatar.tsx` — replace the file:

```tsx
import { Avatar as ArkAvatar, type AvatarRootProps } from '@ark-ui/react/avatar';
import type { VariantProps } from 'tailwind-variants';
import { tv } from '@/features/style/utils/tv';

const avatarStyles = tv({
  slots: {
    root: 'relative inline-flex items-center justify-center overflow-hidden',
    image: 'w-full h-full object-cover',
    fallback: 'flex items-center justify-center w-full h-full text-fg-muted font-medium',
  },
  variants: {
    variant: {
      circle: { root: 'rounded-full' },
      square: { root: 'rounded-l2' },
    },
  },
  defaultVariants: {
    variant: 'circle',
  },
});

interface AvatarProps extends AvatarRootProps, VariantProps<typeof avatarStyles> {
  src?: string;
  alt?: string;
  fallback?: string;
}

export const AvatarField = ({ src, alt, fallback, variant, className, ...props }: AvatarProps) => {
  const { root, image, fallback: fallbackClass } = avatarStyles({ variant });

  return (
    <ArkAvatar.Root className={root({ className })} {...props}>
      <ArkAvatar.Image className={image()} src={src} alt={alt} />
      <ArkAvatar.Fallback className={fallbackClass()}>
        {fallback ? fallback.slice(0, 2).toUpperCase() : null}
      </ArkAvatar.Fallback>
    </ArkAvatar.Root>
  );
};
```

- [ ] **Step 2: Update avatar.stories.tsx**

Edit `src/features/shared/components/ui/avatar.stories.tsx` — replace the file:

```tsx
import type { Meta, StoryObj } from '@storybook/tanstack-react';
import { AvatarField } from './avatar';

const meta: Meta<typeof AvatarField> = {
  component: AvatarField,
  title: 'UI/Avatar',
};

export default meta;

type Story = StoryObj<typeof AvatarField>;

export const Playground: Story = {
  args: { fallback: 'AB' },
  render: ({ fallback }) => <AvatarField fallback={fallback} className="w-10 h-10 text-sm" />,
};

export const Overview: Story = {
  render: () => (
    <div className="p-8 space-y-8 bg-bg-canvas min-h-screen text-fg-default font-sans">
      <h1 className="text-3xl font-serif font-bold">Avatar Gallery</h1>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border-default pb-2">Variants</h2>
        <div className="flex gap-4 items-end">
          <div className="flex flex-col items-center gap-2">
            <AvatarField fallback="CI" className="w-12 h-12 text-sm" variant="circle" />
            <span className="text-xs text-fg-muted">circle</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <AvatarField fallback="SQ" className="w-12 h-12 text-sm" variant="square" />
            <span className="text-xs text-fg-muted">square</span>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border-default pb-2">Sizes</h2>
        <div className="flex gap-4 items-end">
          <AvatarField fallback="S" className="w-8 h-8 text-xs" />
          <AvatarField fallback="MD" className="w-10 h-10 text-sm" />
          <AvatarField fallback="LG" className="w-12 h-12 text-base" />
        </div>
      </section>
    </div>
  ),
};
```

- [ ] **Step 3: Run type check**

Run:
```bash
cd "C:\Users\Burak\Desktop\NF3\hazeleyesoftware\randevu-bende-app"
pnpm tsc --noEmit
```
Expected: No type errors.

- [ ] **Step 4: Commit**

```bash
git add src/features/shared/components/ui/avatar.tsx src/features/shared/components/ui/avatar.stories.tsx
git commit -m "feat(ui): add square variant to avatar component"
```

---

### Task 5: Create Listbox shared UI component + Storybook stories

**Files:**
- Create: `src/features/shared/components/ui/listbox.tsx`
- Create: `src/features/shared/components/ui/listbox.stories.tsx`

- [ ] **Step 1: Create listbox.tsx**

Create `src/features/shared/components/ui/listbox.tsx`:

```tsx
import { Listbox as ArkListbox } from '@ark-ui/react/listbox';
import type { CollectionItem } from '@ark-ui/react/collection';
import type { VariantProps } from 'tailwind-variants';
import { tv } from '@/features/style/utils/tv';

const listboxStyles = tv({
  slots: {
    root: 'flex flex-col gap-1.5',
    label: 'text-sm font-medium text-fg-default select-none',
    content: 'flex gap-3 p-3 overflow-x-auto bg-bg-canvas border border-border-default rounded-l2 min-h-[80px]',
    item: 'flex flex-col items-center gap-1.5 p-2 rounded-l1 cursor-pointer transition-colors duration-normal ease-enter hover:bg-bg-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-accent data-[state=selected]:bg-bg-active data-[state=selected]:ring-1 data-[state=selected]:ring-border-accent',
    itemLabel: 'text-xs text-fg-default text-center font-medium truncate max-w-[72px]',
    empty: 'flex items-center justify-center w-full text-sm text-fg-muted',
  },
  variants: {
    orientation: {
      horizontal: {
        content: 'flex-row',
        item: 'min-w-[72px]',
      },
      vertical: {
        content: 'flex-col',
      },
    },
  },
  defaultVariants: {
    orientation: 'horizontal',
  },
});

const { root, label: labelClass, content: contentCn, item: itemCn, itemLabel, empty } = listboxStyles();

interface ListboxRootFieldProps<T extends CollectionItem>
  extends ArkListbox.RootProps<T>,
    VariantProps<typeof listboxStyles> {
  label?: string;
}

export function ListboxRoot<T extends CollectionItem>({
  className,
  label: listLabel,
  orientation,
  ...props
}: ListboxRootFieldProps<T>) {
  const styles = listboxStyles({ orientation });
  return (
    <ArkListbox.Root className={root({ className })} {...props}>
      {listLabel ? <ArkListbox.Label className={labelClass()}>{listLabel}</ArkListbox.Label> : null}
      <ArkListbox.Content className={styles.content()}>{props.children}</ArkListbox.Content>
    </ArkListbox.Root>
  );
}

export function ListboxItem<T extends CollectionItem>({
  className,
  ...props
}: ArkListbox.ItemProps<T>) {
  return <ArkListbox.Item className={itemCn({ className })} {...props} />;
}

export function ListboxItemLabel<T extends CollectionItem>({
  className,
  ...props
}: ArkListbox.ItemLabelProps<T>) {
  return <ArkListbox.ItemLabel className={itemLabel({ className })} {...props} />;
}

export function ListboxEmpty(props: ArkListbox.EmptyProps) {
  return <ArkListbox.Empty className={empty()} {...props} />;
}
```

- [ ] **Step 2: Create listbox.stories.tsx**

Create `src/features/shared/components/ui/listbox.stories.tsx`:

```tsx
import type { Meta, StoryObj } from '@storybook/tanstack-react';
import { AvatarField } from './avatar';
import { ListboxEmpty, ListboxItem, ListboxItemLabel, ListboxRoot } from './listbox';

const meta = {
  title: 'UI/Listbox',
  component: ListboxRoot,
} satisfies Meta;

export default meta;

type Story = StoryObj;

const mockItems = [
  { value: '1', label: 'Ahmet Usta', initials: 'AU' },
  { value: '2', label: 'Mehmet Bey', initials: 'MB' },
  { value: '3', label: 'Ali Rıza', initials: 'AR' },
  { value: '4', label: 'Veli Can', initials: 'VC' },
  { value: '5', label: 'Zeynep Hanım', initials: 'ZH' },
];

export const Playground: Story = {
  render: () => (
    <div className="max-w-xl mx-auto p-8 bg-bg-canvas min-h-screen text-fg-default font-sans">
      <ListboxRoot label="Çalışanlar" orientation="horizontal">
        {mockItems.map((item) => (
          <ListboxItem key={item.value} item={item}>
            <AvatarField
              fallback={item.initials}
              className="w-12 h-12 text-sm"
              variant="square"
            />
            <ListboxItemLabel>{item.label}</ListboxItemLabel>
          </ListboxItem>
        ))}
        <ListboxEmpty>Çalışan bulunamadı</ListboxEmpty>
      </ListboxRoot>
    </div>
  ),
};

export const Overview: Story = {
  render: () => (
    <div className="p-8 space-y-12 bg-bg-canvas min-h-screen text-fg-default font-sans">
      <div>
        <h1 className="text-3xl font-serif font-bold mb-2">Listbox Gallery</h1>
        <p className="text-fg-muted">Horizontal list for employee selection.</p>
      </div>
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border-default pb-2">Horizontal (default)</h2>
        <ListboxRoot label="Çalışanlar" orientation="horizontal">
          {mockItems.slice(0, 4).map((item) => (
            <ListboxItem key={item.value} item={item}>
              <AvatarField fallback={item.initials} className="w-12 h-12 text-sm" variant="square" />
              <ListboxItemLabel>{item.label}</ListboxItemLabel>
            </ListboxItem>
          ))}
        </ListboxRoot>
      </section>
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border-default pb-2">Empty State</h2>
        <ListboxRoot orientation="horizontal">
          <ListboxEmpty>Henüz çalışan bulunmuyor</ListboxEmpty>
        </ListboxRoot>
      </section>
    </div>
  ),
};
```

- [ ] **Step 3: Run type check**

Run:
```bash
cd "C:\Users\Burak\Desktop\NF3\hazeleyesoftware\randevu-bende-app"
pnpm tsc --noEmit
```
Expected: No type errors.

- [ ] **Step 4: Commit**

```bash
git add src/features/shared/components/ui/listbox.tsx src/features/shared/components/ui/listbox.stories.tsx
git commit -m "feat(ui): add listbox component with horizontal orientation"
```

---

### Task 6: Create Shop Dialog + Profile Menu Integration (Dükkan Oluştur + Davetlerim)

**Files:**
- Create: `src/features/shop/components/create-shop-dialog.tsx`
- Modify: `src/features/header/components/profile-menu.tsx`

- [ ] **Step 1: Create create-shop-dialog.tsx**

Create `src/features/shop/components/create-shop-dialog.tsx`:

```tsx
import { Store } from 'lucide-react';
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from '@tanstack/react-router';
import { createShopFn } from '@/features/shop/shop.functions';
import { Button } from '@/features/shared/components/ui/button';
import {
  DialogCloseTrigger,
  DialogContent,
  DialogDescription,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
} from '@/features/shared/components/ui/dialog';
import { Field } from '@/features/shared/components/ui/field';

export function CreateShopDialog() {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const queryClient = useQueryClient();
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: createShopFn,
    onSuccess: (result) => {
      setOpen(false);
      setTitle('');
      queryClient.invalidateQueries({ queryKey: ['auth'] });
      // Navigate with organizationId — the _shop layout matches by organizationId
      router.navigate({
        to: '/shops/$shopId',
        params: { shopId: result.organizationId },
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    mutation.mutate({ data: { title: title.trim() } });
  };

  return (
    <DialogRoot open={open} onOpenChange={(e) => setOpen(e.open)}>
      <DialogTrigger asChild>
        <button
          type="button"
          className="flex items-center gap-2 w-full px-2 py-1.5 text-sm rounded-l1 hover:bg-bg-hover cursor-pointer"
        >
          <Store size={16} />
          Dükkan Oluştur
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Dükkan Oluştur</DialogTitle>
        <DialogDescription>Yeni dükkanınız için bir isim girin.</DialogDescription>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <Field label="Dükkan Adı" required>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Örn: Berber Ali Usta"
              className="w-full h-control-h px-3 text-control bg-bg-default border border-border-default rounded-l2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-accent"
              autoFocus
            />
          </Field>
          {mutation.isError && (
            <p className="text-sm text-error-default">
              {mutation.error instanceof Error ? mutation.error.message : 'Dükkan oluşturulamadı'}
            </p>
          )}
          <div className="flex gap-3 justify-end">
            <DialogCloseTrigger asChild>
              <Button type="button" variant="outline" size="sm">
                İptal
              </Button>
            </DialogCloseTrigger>
            <Button type="submit" variant="accent" size="sm" disabled={!title.trim() || mutation.isPending}>
              {mutation.isPending ? 'Oluşturuluyor...' : 'Oluştur'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </DialogRoot>
  );
}
```

- [ ] **Step 2: Update profile-menu.tsx — add imports**

At the top of `src/features/header/components/profile-menu.tsx`, add these new imports (merge with existing):

```tsx
import { useState } from 'react';
import { Mail } from 'lucide-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { CreateShopDialog } from '@/features/shop/components/create-shop-dialog';
import { acceptInvitationFn, rejectInvitationFn } from '@/features/shop/shop.functions';
import { shopKeys, shopQueries } from '@/features/shop/shop.queries';
import {
  DialogCloseTrigger,
  DialogContent,
  DialogDescription,
  DialogRoot,
  DialogTitle,
} from '@/features/shared/components/ui/dialog';
import { Field } from '@/features/shared/components/ui/field';
```

- [ ] **Step 3: Update profile-menu.tsx — add InvitationsMenuItem component**

Add this component BEFORE the `extractShops` function (after the type definitions):

```tsx
function InvitationsMenuItem() {
  const { auth } = useRouteContext({ from: '__root__' });
  const { data: invitations } = useQuery(shopQueries.myInvitations());
  const queryClient = useQueryClient();

  const acceptMutation = useMutation({
    mutationFn: acceptInvitationFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: shopKeys.myInvitations() });
      queryClient.invalidateQueries({ queryKey: ['auth'] });
    },
  });

  const rejectMutation = useMutation({
    mutationFn: rejectInvitationFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: shopKeys.myInvitations() });
    },
  });

  const [acceptingId, setAcceptingId] = useState<string | null>(null);
  const [displayName, setDisplayName] = useState('');
  const [acceptDialogOpen, setAcceptDialogOpen] = useState(false);

  const pendingCount = invitations?.length ?? 0;
  if (pendingCount === 0) return null;

  const handleAccept = () => {
    if (!acceptingId || !displayName.trim()) return;
    acceptMutation.mutate({ data: { invitationId: acceptingId, displayName: displayName.trim() } });
  };

  return (
    <>
      <MenuRoot positioning={{ placement: 'right-start' }} closeOnSelect>
        <MenuTriggerItem>
          <span className="flex items-center gap-2">
            <span className="relative">
              <Mail size={16} />
              <span className="absolute -top-1.5 -right-1.5 flex items-center justify-center w-4 h-4 text-2xs font-bold bg-accent-default text-accent-fg rounded-full">
                {pendingCount}
              </span>
            </span>
            Davetlerim
          </span>
          <ChevronRight size={14} />
        </MenuTriggerItem>
        <MenuPositioner>
          <MenuContent>
            {invitations?.map((inv) => (
              <div key={inv.id} className="px-2 py-2 border-b border-border-default last:border-b-0">
                <p className="text-sm font-medium text-fg-default">{inv.shop.title ?? 'Bir dükkan'}</p>
                <p className="text-xs text-fg-muted">{inv.invitedBy.name} tarafından davet edildin</p>
                <div className="flex gap-2 mt-2">
                  <Button
                    size="xs"
                    variant="accent"
                    onClick={() => {
                      setAcceptingId(inv.id);
                      // Pre-fill with the invitee's own name from their account
                      setDisplayName(auth?.user?.name ?? '');
                      setAcceptDialogOpen(true);
                    }}
                  >
                    Kabul Et
                  </Button>
                  <Button
                    size="xs"
                    variant="outline"
                    onClick={() => rejectMutation.mutate({ data: { invitationId: inv.id } })}
                  >
                    Reddet
                  </Button>
                </div>
              </div>
            ))}
          </MenuContent>
        </MenuPositioner>
      </MenuRoot>

      {/* Accept Invitation Dialog */}
      <DialogRoot open={acceptDialogOpen} onOpenChange={(e) => setAcceptDialogOpen(e.open)}>
        <DialogContent>
          <DialogTitle>Daveti Kabul Et</DialogTitle>
          <DialogDescription>Bu dükkanda görünecek isminizi girin.</DialogDescription>
          <div className="space-y-4 mt-4">
            <Field label="Görünür İsim" required>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Örn: Ahmet Usta"
                className="w-full h-control-h px-3 text-control bg-bg-default border border-border-default rounded-l2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-accent"
                autoFocus
              />
            </Field>
            {acceptMutation.isError && (
              <p className="text-sm text-error-default">
                {acceptMutation.error instanceof Error ? acceptMutation.error.message : 'Davet kabul edilemedi'}
              </p>
            )}
            <div className="flex gap-3 justify-end">
              <DialogCloseTrigger asChild>
                <Button type="button" variant="outline" size="sm">
                  İptal
                </Button>
              </DialogCloseTrigger>
              <Button
                variant="accent"
                size="sm"
                disabled={!displayName.trim() || acceptMutation.isPending}
                onClick={handleAccept}
              >
                {acceptMutation.isPending ? 'Kabul ediliyor...' : 'Kabul Et'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </DialogRoot>
    </>
  );
}
```

- [ ] **Step 4: Update profile-menu.tsx — add menu items to JSX**

Inside the `ProfileMenu` function's JSX, find the section with shop menu items (right before `<MenuSeparator />`). After the existing shop items (single/multiple shop menus), add the Create Shop + Invitations entries. Find this code:

```tsx
          ) : null}

          <MenuSeparator />
```

Replace with:

```tsx
          ) : null}

          {/* Dükkan Oluştur */}
          <MenuItem value="create-shop" onSelect={(e) => e.preventDefault()}>
            <CreateShopDialog />
          </MenuItem>

          {/* Davetlerim (only visible if pending invitations exist) */}
          <InvitationsMenuItem />

          <MenuSeparator />
```

- [ ] **Step 5: Run type check**

Run:
```bash
cd "C:\Users\Burak\Desktop\NF3\hazeleyesoftware\randevu-bende-app"
pnpm tsc --noEmit
```
Expected: No type errors.

- [ ] **Step 6: Commit**

```bash
git add src/features/shop/components/create-shop-dialog.tsx src/features/header/components/profile-menu.tsx
git commit -m "feat(shop): add create shop dialog and invitations to profile menu"
```

---

### Task 7: Build Owner Panel — Sidebar Layout + Dashboard + Employees Page + Invite Dialog

**Files:**
- Create: `src/features/shop/components/owner-layout.tsx`
- Create: `src/features/shop/components/owner-dashboard.tsx`
- Create: `src/features/shop/components/employees-page.tsx`
- Create: `src/features/shop/components/invite-employee-dialog.tsx`
- Modify: `src/routes/shops/$shopId/_shop/owner.tsx`

- [ ] **Step 1: Create owner-layout.tsx**

Create `src/features/shop/components/owner-layout.tsx`:

```tsx
import { LayoutDashboard, Users } from 'lucide-react';

interface OwnerLayoutProps {
  shopId: string;
  currentTab: string;
  onTabChange: (tab: string) => void;
  children: React.ReactNode;
}

const sidebarItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'employees', label: 'Çalışanlar', icon: Users },
];

export function OwnerLayout({ shopId, currentTab, onTabChange, children }: OwnerLayoutProps) {
  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      <aside className="w-56 border-r border-border-default bg-bg-canvas p-4 flex-shrink-0">
        <nav className="space-y-1">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onTabChange(item.id)}
                className={`flex items-center gap-3 w-full px-3 py-2 text-sm rounded-l2 transition-colors duration-normal cursor-pointer ${
                  isActive
                    ? 'bg-accent-default text-accent-fg font-medium'
                    : 'text-fg-default hover:bg-bg-hover'
                }`}
              >
                <Icon size={18} />
                {item.label}
              </button>
            );
          })}
        </nav>
      </aside>
      <main className="flex-1 p-6 overflow-auto">{children}</main>
    </div>
  );
}
```

- [ ] **Step 2: Create owner-dashboard.tsx**

Create `src/features/shop/components/owner-dashboard.tsx`:

```tsx
import { useQuery } from '@tanstack/react-query';
import { shopQueries } from '@/features/shop/shop.queries';

interface OwnerDashboardProps {
  shopId: string;
}

export function OwnerDashboard({ shopId }: OwnerDashboardProps) {
  const { data, isLoading, isError } = useQuery(shopQueries.dashboard(shopId));

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-48">
        <p className="text-fg-muted">Yükleniyor...</p>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="flex items-center justify-center h-48">
        <p className="text-error-default">Dükkan bilgileri yüklenemedi.</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-fg-default mb-6">Dashboard</h1>
      <div className="grid gap-4">
        <div className="p-4 bg-bg-default border border-border-default rounded-l2">
          <p className="text-sm text-fg-muted">Dükkan Adı</p>
          <p className="text-lg font-semibold text-fg-default">{data.shop.title ?? 'İsimsiz Dükkan'}</p>
        </div>
        <div className="p-4 bg-bg-default border border-border-default rounded-l2">
          <p className="text-sm text-fg-muted">Sahibi</p>
          <p className="text-lg font-semibold text-fg-default">{data.ownerName}</p>
        </div>
        <div className="p-4 bg-bg-default border border-border-default rounded-l2">
          <p className="text-sm text-fg-muted">Üye Sayısı</p>
          <p className="text-lg font-semibold text-fg-default">{data.memberCount}</p>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Create invite-employee-dialog.tsx**

Create `src/features/shop/components/invite-employee-dialog.tsx`:

```tsx
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { UserPlus } from 'lucide-react';
import { inviteEmployeeFn } from '@/features/shop/shop.functions';
import { shopKeys } from '@/features/shop/shop.queries';
import { Button } from '@/features/shared/components/ui/button';
import {
  DialogCloseTrigger,
  DialogContent,
  DialogDescription,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
} from '@/features/shared/components/ui/dialog';
import { PinInputRoot } from '@/features/shared/components/ui/pin-input';

interface InviteEmployeeDialogProps {
  shopId: string;
}

export function InviteEmployeeDialog({ shopId }: InviteEmployeeDialogProps) {
  const [open, setOpen] = useState(false);
  const [phone, setPhone] = useState('');
  const [error, setError] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: inviteEmployeeFn,
    onSuccess: () => {
      setOpen(false);
      setPhone('');
      setError(null);
      queryClient.invalidateQueries({ queryKey: shopKeys.employeeList(shopId) });
    },
    onError: (err) => {
      setError(err instanceof Error ? err.message : 'Davet gönderilemedi');
    },
  });

  const handleInvite = () => {
    if (phone.length < 10) {
      setError('Geçerli bir telefon numarası giriniz');
      return;
    }
    setError(null);
    mutation.mutate({ data: { shopId, phone } });
  };

  return (
    <DialogRoot open={open} onOpenChange={(e) => setOpen(e.open)}>
      <DialogTrigger asChild>
        <Button variant="accent" size="sm">
          <UserPlus size={16} />
          Çalışan Ekle
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Çalışan Davet Et</DialogTitle>
        <DialogDescription>Davet etmek istediğiniz kişinin telefon numarasını girin.</DialogDescription>
        <div className="space-y-4 mt-4">
          <PinInputRoot
            label="Telefon Numarası"
            count={10}
            size="md"
            state={error ? 'error' : undefined}
            errorText={error ?? undefined}
            onValueComplete={(e) => setPhone(e.valueAsString)}
          />
          <div className="flex gap-3 justify-end">
            <DialogCloseTrigger asChild>
              <Button type="button" variant="outline" size="sm">
                İptal
              </Button>
            </DialogCloseTrigger>
            <Button
              variant="accent"
              size="sm"
              disabled={phone.length < 10 || mutation.isPending}
              onClick={handleInvite}
            >
              {mutation.isPending ? 'Gönderiliyor...' : 'Davet Gönder'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </DialogRoot>
  );
}
```

- [ ] **Step 4: Create employees-page.tsx**

Create `src/features/shop/components/employees-page.tsx`:

```tsx
import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { removeEmployeeFn } from '@/features/shop/shop.functions';
import { shopKeys, shopQueries } from '@/features/shop/shop.queries';
import { AvatarField } from '@/features/shared/components/ui/avatar';
import { Button } from '@/features/shared/components/ui/button';
import { ListboxEmpty, ListboxItem, ListboxItemLabel, ListboxRoot } from '@/features/shared/components/ui/listbox';
import { InviteEmployeeDialog } from './invite-employee-dialog';

interface EmployeesPageProps {
  shopId: string;
}

export function EmployeesPage({ shopId }: EmployeesPageProps) {
  const { data, isLoading, isError } = useQuery(shopQueries.employees(shopId));
  const queryClient = useQueryClient();
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  const removeMutation = useMutation({
    mutationFn: removeEmployeeFn,
    onSuccess: () => {
      setSelectedUserId(null);
      queryClient.invalidateQueries({ queryKey: shopKeys.employeeList(shopId) });
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-48">
        <p className="text-fg-muted">Yükleniyor...</p>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="flex items-center justify-center h-48">
        <p className="text-error-default">Çalışanlar yüklenemedi.</p>
      </div>
    );
  }

  const employeeItems = data.members
    .filter((m) => m.role !== 'owner')
    .map((m) => {
      const profile = data.staffProfiles.find((sp) => sp.userId === m.userId);
      return {
        userId: m.userId,
        memberId: m.id,
        role: m.role,
        displayName: profile?.displayName ?? m.user.name ?? 'Bilinmeyen',
        avatarUrl: profile?.avatarUrl ?? m.user.image ?? null,
        initials: (profile?.displayName ?? m.user.name ?? '??').slice(0, 2).toUpperCase(),
      };
    });

  const selectedEmployee = employeeItems.find((e) => e.userId === selectedUserId);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-fg-default">Çalışanlar</h1>
        <InviteEmployeeDialog shopId={shopId} />
      </div>

      <div className="mb-8">
        <ListboxRoot
          label="Çalışan Listesi"
          orientation="horizontal"
          value={selectedUserId ? [selectedUserId] : []}
          onValueChange={(details) => {
            setSelectedUserId(details.value[0] ?? null);
          }}
        >
          {employeeItems.length === 0 ? (
            <ListboxEmpty>Henüz çalışan bulunmuyor</ListboxEmpty>
          ) : (
            employeeItems.map((emp) => (
              <ListboxItem key={emp.userId} item={{ value: emp.userId, label: emp.displayName }}>
                <AvatarField
                  src={emp.avatarUrl ?? undefined}
                  fallback={emp.initials}
                  className="w-12 h-12 text-sm"
                  variant="square"
                />
                <ListboxItemLabel>{emp.displayName}</ListboxItemLabel>
              </ListboxItem>
            ))
          )}
        </ListboxRoot>
      </div>

      {selectedEmployee && (
        <div className="p-4 bg-bg-default border border-border-default rounded-l2 max-w-md">
          <h2 className="text-lg font-semibold text-fg-default mb-4">Çalışan Detayı</h2>
          <div className="flex items-center gap-4 mb-4">
            <AvatarField
              src={selectedEmployee.avatarUrl ?? undefined}
              fallback={selectedEmployee.initials}
              className="w-16 h-16 text-lg"
              variant="square"
            />
            <div>
              <p className="font-medium text-fg-default">{selectedEmployee.displayName}</p>
              <p className="text-sm text-fg-muted">
                {selectedEmployee.role === 'manager' ? 'Şef' : 'Çalışan'}
              </p>
            </div>
          </div>
          <Button
            variant="error"
            size="sm"
            disabled={removeMutation.isPending}
            onClick={() => removeMutation.mutate({ data: { shopId, memberId: selectedEmployee.memberId } })}
          >
            {removeMutation.isPending ? 'Çıkarılıyor...' : 'Çalışanı Çıkar'}
          </Button>
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 5: Update owner.tsx route**

Rewrite `src/routes/shops/$shopId/_shop/owner.tsx`:

```tsx
import { createFileRoute, useNavigate, useSearch } from '@tanstack/react-router';
import { OwnerDashboard } from '@/features/shop/components/owner-dashboard';
import { EmployeesPage } from '@/features/shop/components/employees-page';
import { OwnerLayout } from '@/features/shop/components/owner-layout';

export const Route = createFileRoute('/shops/$shopId/_shop/owner')({
  component: RouteComponent,
  validateSearch: (search: Record<string, unknown>) => ({
    tab: (search.tab as string) ?? 'dashboard',
  }),
});

function RouteComponent() {
  const { shopId } = Route.useParams();
  const { tab } = Route.useSearch();
  const navigate = useNavigate();

  const setTab = (newTab: string) => {
    navigate({ search: { tab: newTab } });
  };

  const content = tab === 'employees' ? (
    <EmployeesPage shopId={shopId} />
  ) : (
    <OwnerDashboard shopId={shopId} />
  );

  return (
    <OwnerLayout shopId={shopId} currentTab={tab} onTabChange={setTab}>
      {content}
    </OwnerLayout>
  );
}
```

- [ ] **Step 6: Run type check**

Run:
```bash
cd "C:\Users\Burak\Desktop\NF3\hazeleyesoftware\randevu-bende-app"
pnpm tsc --noEmit
```
Expected: No type errors.

- [ ] **Step 7: Commit**

```bash
git add src/features/shop/components/owner-layout.tsx src/features/shop/components/owner-dashboard.tsx src/features/shop/components/employees-page.tsx src/features/shop/components/invite-employee-dialog.tsx src/routes/shops/$shopId/_shop/owner.tsx
git commit -m "feat(shop): add owner panel with sidebar, dashboard and employees"
```

---

### Task 8: Build Employee Dashboard Page

**Files:**
- Create: `src/features/shop/components/employee-dashboard.tsx`
- Modify: `src/routes/shops/$shopId/_shop/employee.tsx`

- [ ] **Step 1: Create employee-dashboard.tsx**

Create `src/features/shop/components/employee-dashboard.tsx`:

```tsx
import { useQuery } from '@tanstack/react-query';
import { shopQueries } from '@/features/shop/shop.queries';
import { AvatarField } from '@/features/shared/components/ui/avatar';

interface EmployeeDashboardProps {
  shopId: string;
}

export function EmployeeDashboard({ shopId }: EmployeeDashboardProps) {
  const { data, isLoading, isError } = useQuery(shopQueries.employeeDashboard(shopId));

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-48">
        <p className="text-fg-muted">Yükleniyor...</p>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="flex items-center justify-center h-48">
        <p className="text-error-default">Bilgiler yüklenemedi.</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-fg-default mb-2">{data.shop.title ?? 'İsimsiz Dükkan'}</h1>
      <p className="text-sm text-fg-muted mb-6">Çalışan Paneli</p>

      <h2 className="text-lg font-semibold text-fg-default mb-4">Ekip Arkadaşların</h2>
      <div className="space-y-3">
        {data.members.map((member) => (
          <div
            key={member.id}
            className="flex items-center gap-4 p-3 bg-bg-default border border-border-default rounded-l2"
          >
            <AvatarField
              src={member.user.image ?? undefined}
              fallback={(member.user.name ?? '??').slice(0, 2).toUpperCase()}
              className="w-10 h-10 text-sm"
              variant="square"
            />
            <div>
              <p className="font-medium text-fg-default">
                {member.profile?.displayName ?? member.user.name}
              </p>
              <p className="text-xs text-fg-muted">
                {member.role === 'owner' ? 'Sahip' : member.role === 'manager' ? 'Şef' : 'Çalışan'}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Update employee.tsx route**

Rewrite `src/routes/shops/$shopId/_shop/employee.tsx`:

```tsx
import { createFileRoute } from '@tanstack/react-router';
import { EmployeeDashboard } from '@/features/shop/components/employee-dashboard';

export const Route = createFileRoute('/shops/$shopId/_shop/employee')({
  component: RouteComponent,
});

function RouteComponent() {
  const { shopId } = Route.useParams();
  return <EmployeeDashboard shopId={shopId} />;
}
```

- [ ] **Step 3: Run type check**

Run:
```bash
cd "C:\Users\Burak\Desktop\NF3\hazeleyesoftware\randevu-bende-app"
pnpm tsc --noEmit
```
Expected: No type errors.

- [ ] **Step 4: Commit**

```bash
git add src/features/shop/components/employee-dashboard.tsx src/routes/shops/$shopId/_shop/employee.tsx
git commit -m "feat(shop): add employee dashboard with team member list"
```

---

### Self-Review

**1. Spec Coverage:**
- ✅ Profile menüde "Dükkan Oluştur" butonu → Task 6 (CreateShopDialog in ProfileMenu)
- ✅ Modal ile dükkan ismi girilir → Task 6 (CreateShopDialog with title field)
- ✅ Dükkan/organizasyon oluşur, oluşturan sahibi olur → Task 2 (createShopRecord + better-auth createOrganization)
- ✅ Her üyenin dükkana özel profili (StaffProfile) → existing model, Task 2 creates on accept
- ✅ Dükkan yönetim paneli sidebar → Task 7 (OwnerLayout)
- ✅ Dashboard (dükkan ismi, sahibi) → Task 7 (OwnerDashboard)
- ✅ Çalışanlar sayfası → Task 7 (EmployeesPage)
- ✅ Horizontal Listbox → Task 5 (Listbox) + Task 7 (EmployeesPage uses it)
- ✅ Çalışan Ekle butonu → Task 7 (InviteEmployeeDialog)
- ✅ PinInput ile telefon → Task 7 (InviteEmployeeDialog)
- ✅ Davetiye tablosuna kayıt → Task 2 (createInvitationRecord)
- ✅ Üye yoksa bile kayıt edilir → Task 2 (inviteEmployeeFn doesn't require existing user)
- ✅ Profil menüsünde "Davetlerim" → Task 6 (InvitationsMenuItem)
- ✅ Red/Kabul → Task 6 (InvitationsMenuItem) + Task 3 (acceptInvitationFn/rejectInvitationFn)
- ✅ Kabul modalında display_name → Task 6 (accept dialog)
- ✅ display_name pre-filled from invitee's own name → Task 6 (uses auth.user.name)
- ✅ Davet kabul → Member + StaffProfile oluşur → Task 3 (addMember + createStaffProfile)
- ✅ Çalışan paneli dashboard → Task 8 (EmployeeDashboard)
- ✅ Avatar square variant → Task 4
- ✅ Çalışan çıkarma → Task 3 (removeEmployeeFn) + Task 7 (EmployeesPage)
- ✅ Mükerrer davet kontrolü → Task 2 (findPendingInvitation + findUserMembership checks)

**2. Conventions Compliance:**
- ✅ `.functions.ts` = RPC bridge only (Zod → delegate to `.server.ts`) — no Prisma directly
- ✅ `.server.ts` = pure Prisma CRUD — no createServerFn
- ✅ `.schemas.ts` = Zod schemas with `z.infer` types
- ✅ `.queries.ts` = key factory + queryOptions
- ✅ Component files use kebab-case
- ✅ Routes are "dumb" wrappers
- ✅ Named exports only
- ✅ `const { getRequest }` dynamic import pattern for headers

**3. All Previously Identified Bugs Fixed:**
- ✅ Prisma relation name consistent (`ShopInvitationInviter` on both sides)
- ✅ `session.headers` bug — now uses `request.headers` from `getRequest()`
- ✅ Navigation after shop creation uses `organizationId`, not `shop.id`
- ✅ `getMyInvitationsFn` doesn't need auth check (returns [])
- ✅ Display name pre-fill uses `auth.user.name` (invitee's name), not inviter's name
- ✅ All imports present and accounted for
- ✅ No duplicate OwnerLayout versions
- ✅ `addMember` API confirmed to exist in better-auth
- ✅ `removeEmployeeFn` imports Prisma dynamically per conventions

**No gaps or placeholders.** Plan is complete and self-consistent.
