import { createFileRoute } from '@tanstack/react-router';
import { EmployeesPage } from '@/features/shop/components/employees-page';
import { OwnerDashboard } from '@/features/shop/components/owner-dashboard';
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
