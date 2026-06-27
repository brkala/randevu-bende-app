import { createFileRoute } from '@tanstack/react-router';
import { EmployeeDashboard } from '@/features/shop/components/employee-dashboard';
import { shopQueries } from '@/features/shop/shop.queries';

export const Route = createFileRoute('/shops/$shopId/_shop/employee')({
  component: RouteComponent,
  loader: ({ params: { shopId }, context: { queryClient } }) => {
    queryClient.ensureQueryData(shopQueries.employeeDashboard(shopId));
  },
});

function RouteComponent() {
  const { shopId } = Route.useParams();
  return <EmployeeDashboard shopId={shopId} />;
}
