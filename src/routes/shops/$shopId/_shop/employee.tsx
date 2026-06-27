import { createFileRoute } from '@tanstack/react-router';
import { EmployeeDashboard } from '@/features/shop/components/employee-dashboard';

export const Route = createFileRoute('/shops/$shopId/_shop/employee')({
  component: RouteComponent,
});

function RouteComponent() {
  const { shopId } = Route.useParams();
  return <EmployeeDashboard shopId={shopId} />;
}
