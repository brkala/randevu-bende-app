import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';

interface MembershipEntry {
  organizationId: string;
  role: string;
  organization?: { slug?: string | null };
}

interface AuthWithOrgs {
  user: unknown;
  session?: { activeOrganizationId?: string | null };
  memberships?: MembershipEntry[];
}

export const Route = createFileRoute('/shops/$shopId/_shop')({
  beforeLoad: ({ context, params }) => {
    if (!context.auth?.user) {
      throw redirect({ to: '/login' });
    }

    const { shopId } = params;
    const auth = context.auth as AuthWithOrgs;

    // Check memberships (if available from Prisma augmentation)
    const memberships: MembershipEntry[] = auth.memberships ?? [];
    const membership = memberships.find(
      (m) => m.organization?.slug === shopId || m.organizationId === shopId,
    );

    // Fallback: check activeOrganizationId from session (set by setActiveOrganization)
    const activeOrgId = auth.session?.activeOrganizationId;
    const isActiveOrg = activeOrgId === shopId;

    if (!membership && !isActiveOrg) {
      throw redirect({ to: '/' });
    }

    const role = membership?.role ?? 'member';

    return {
      shopMembership: membership ?? { organizationId: shopId, role },
      shopRole: role as 'owner' | 'employee' | 'manager',
    };
  },
  component: RouteComponent,
});

function RouteComponent() {
  return <Outlet />;
}
