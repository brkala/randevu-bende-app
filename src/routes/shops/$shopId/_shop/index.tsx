import { createFileRoute, redirect } from '@tanstack/react-router';

interface ShopContext {
  shopRole: string;
  params: { shopId: string };
}

export const Route = createFileRoute('/shops/$shopId/_shop/')({
  beforeLoad: ({ context }) => {
    const ctx = context as unknown as ShopContext;
    const { shopRole: role } = ctx;
    const { shopId } = ctx.params;

    const rolePath =
      role === 'owner'
        ? '/shops/$shopId/owner'
        : role === 'manager'
          ? '/shops/$shopId/manager'
          : '/shops/$shopId/employee';

    throw redirect({ to: rolePath, params: { shopId } });
  },
});
