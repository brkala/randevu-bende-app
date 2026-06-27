import { useQuery } from '@tanstack/react-query';
import { AvatarField } from '@/features/shared/components/ui/avatar';
import { shopQueries } from '@/features/shop/shop.queries';

interface EmployeeDashboardProps {
  shopId: string;
}

export function EmployeeDashboard({ shopId }: EmployeeDashboardProps) {
  const { data, isLoading, isError } = useQuery(shopQueries.employeeDashboard(shopId));

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-48">
        <p className="text-fg-muted">Yükleniyor...</p>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="flex items-center justify-center h-48">
        <p className="text-error-default">Bilgiler yüklenemedi.</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1
        className="text-2xl font-bold text-fg-default mb-2"
        data-testid="employee-dashboard-shop-title"
      >
        {data.shop.title ?? 'İsimsiz Dükkan'}
      </h1>
      <p className="text-sm text-fg-muted mb-6">Çalışan Paneli</p>

      <h2 className="text-lg font-semibold text-fg-default mb-4">Ekip Arkadaşların</h2>
      <div className="space-y-3">
        {data.members.map((member) => (
          <div
            key={member.id}
            className="flex items-center gap-4 p-3 bg-bg-default border border-border-default rounded-l2"
          >
            <AvatarField
              src={member.user.image ?? undefined}
              fallback={(member.user.name ?? '??').slice(0, 2).toUpperCase()}
              className="w-10 h-10 text-sm"
              variant="square"
            />
            <div>
              <p className="font-medium text-fg-default">
                {member.profile?.displayName ?? member.user.name}
              </p>
              <p className="text-xs text-fg-muted">
                {member.role === 'owner' ? 'Sahip' : member.role === 'manager' ? 'Şef' : 'Çalışan'}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
