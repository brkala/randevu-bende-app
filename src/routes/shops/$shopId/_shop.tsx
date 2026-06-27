import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';

interface MembershipEntry {
  organizationId: string;
  role: string;
  organization?: { slug?: string | null };
}

interface AuthWithOrgs {
  user: unknown;
  memberships?: MembershipEntry[];
}

export const Route = createFileRoute('/shops/$shopId/_shop')({
  beforeLoad: ({ context, params }) => {
    if (!context.auth?.user) {
      throw redirect({ to: '/login' });
    }

    const { shopId } = params;
    const authWithOrgs = context.auth as AuthWithOrgs;
    const memberships: MembershipEntry[] = authWithOrgs.memberships ?? [];
    const membership = memberships.find(
      (m: MembershipEntry) => m.organization?.slug === shopId || m.organizationId === shopId,
    );

    if (!membership) {
      throw redirect({ to: '/' });
    }

    return {
      shopMembership: membership,
      shopRole: membership.role as 'owner' | 'employee' | 'manager',
    };
  },
  component: RouteComponent,
});

function RouteComponent() {
  return <Outlet />;
}
