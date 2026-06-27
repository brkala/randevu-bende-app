import { createFileRoute, redirect } from '@tanstack/react-router';
import { match } from 'ts-pattern';

export const Route = createFileRoute('/shops/$shopId/_shop/')({
  beforeLoad: ({ context, params }) => {
    const ctx = context as { shopRole: string };
    const { shopRole: role } = ctx;
    const { shopId } = params;

    const rolePath = match(role)
      .with('owner', () => '/shops/$shopId/owner')
      .with('manager', () => '/shops/$shopId/manager')
      .otherwise(() => '/shops/$shopId/employee');

    throw redirect({ to: rolePath, params: { shopId } });
  },
});
