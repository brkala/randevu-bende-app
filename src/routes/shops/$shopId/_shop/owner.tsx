import { createFileRoute } from '@tanstack/react-router';
import { EmployeesPage } from '@/features/shop/components/employees-page';
import { OwnerDashboard } from '@/features/shop/components/owner-dashboard';
import { OwnerLayout } from '@/features/shop/components/owner-layout';
import { shopQueries } from '@/features/shop/shop.queries';

export const Route = createFileRoute('/shops/$shopId/_shop/owner')({
  component: RouteComponent,
  validateSearch: (search: Record<string, unknown>) => ({
    tab: (search.tab as string) ?? 'dashboard',
  }),
  loader: ({ params: { shopId }, context: { queryClient } }) => {
    queryClient.ensureQueryData(shopQueries.dashboard(shopId));
    queryClient.ensureQueryData(shopQueries.employees(shopId));
  },
});

function RouteComponent() {
  const { shopId } = Route.useParams();
  const { tab } = Route.useSearch();
  const navigate = Route.useNavigate();

  const setTab = (newTab: string) => {
    navigate({ search: { tab: newTab } });
  };

  const content =
    tab === 'employees' ? <EmployeesPage shopId={shopId} /> : <OwnerDashboard shopId={shopId} />;

  return (
    <OwnerLayout shopId={shopId} currentTab={tab} onTabChange={setTab}>
      {content}
    </OwnerLayout>
  );
}
