import { useQuery } from '@tanstack/react-query';
import { shopQueries } from '@/features/shop/shop.queries';

interface OwnerDashboardProps {
  shopId: string;
}

export function OwnerDashboard({ shopId }: OwnerDashboardProps) {
  const { data, isLoading, isError } = useQuery(shopQueries.dashboard(shopId));

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
        <p className="text-error-default">Dükkan bilgileri yüklenemedi.</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-fg-default mb-6">Dashboard</h1>
      <div className="grid gap-4">
        <div className="p-4 bg-bg-default border border-border-default rounded-l2">
          <p className="text-sm text-fg-muted">Dükkan Adı</p>
          <p
            className="text-lg font-semibold text-fg-default"
            data-testid="owner-dashboard-shop-title"
          >
            {data.shop.title ?? 'İsimsiz Dükkan'}
          </p>
        </div>
        <div className="p-4 bg-bg-default border border-border-default rounded-l2">
          <p className="text-sm text-fg-muted">Sahibi</p>
          <p className="text-lg font-semibold text-fg-default">{data.ownerName}</p>
        </div>
        <div className="p-4 bg-bg-default border border-border-default rounded-l2">
          <p className="text-sm text-fg-muted">Üye Sayısı</p>
          <p className="text-lg font-semibold text-fg-default">{data.memberCount}</p>
        </div>
      </div>
    </div>
  );
}
