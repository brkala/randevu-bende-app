import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/shops/$shopId/_shop/')({
  beforeLoad: ({ context, params }) => {
    const ctx = context as { shopRole: string };
    const { shopRole: role } = ctx;
    const { shopId } = params;

    const rolePath =
      role === 'owner'
        ? '/shops/$shopId/owner'
        : role === 'manager'
          ? '/shops/$shopId/manager'
          : '/shops/$shopId/employee';

    throw redirect({ to: rolePath, params: { shopId } });
  },
});
