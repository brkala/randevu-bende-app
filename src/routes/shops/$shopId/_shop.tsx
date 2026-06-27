import { createFileRoute, notFound, Outlet, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/shops/$shopId/_shop')({
  beforeLoad: ({ context, params }) => {
    if (!context.auth?.user) throw redirect({ to: '/login' });

    const membership = context.auth.memberships.find(
      (m) => m.organization?.slug === params.shopId || m.organizationId === params.shopId,
    );
    if (!membership) throw notFound();

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
