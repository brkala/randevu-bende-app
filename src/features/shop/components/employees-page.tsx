import { createListCollection } from '@ark-ui/react/collection';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { AvatarField } from '@/features/shared/components/ui/avatar';
import { Button } from '@/features/shared/components/ui/button';
import {
  ListboxEmpty,
  ListboxItem,
  ListboxItemLabel,
  ListboxRoot,
} from '@/features/shared/components/ui/listbox';
import { removeEmployeeFn } from '@/features/shop/shop.functions';
import { shopKeys, shopQueries } from '@/features/shop/shop.queries';
import { toaster } from '@/features/toast/toast';
import { InviteEmployeeDialog } from './invite-employee-dialog';

interface EmployeesPageProps {
  shopId: string;
}

export function EmployeesPage({ shopId }: EmployeesPageProps) {
  const { data, isLoading, isError } = useQuery(shopQueries.employees(shopId));
  const queryClient = useQueryClient();
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  const removeMutation = useMutation({
    mutationFn: removeEmployeeFn,
    onSuccess: () => {
      toaster.create({ title: 'Çalışan çıkarıldı', type: 'success' });
      setSelectedUserId(null);
      queryClient.invalidateQueries({ queryKey: shopKeys.employeeList(shopId) });
    },
    onError: (err) => {
      toaster.create({
        title: 'Hata',
        description: err instanceof Error ? err.message : 'Çalışan çıkarılamadı',
        type: 'error',
      });
    },
  });

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
        <p className="text-error-default">Çalışanlar yüklenemedi.</p>
      </div>
    );
  }

  const employeeItems = data.members
    .filter((m) => m.role !== 'owner')
    .map((m) => {
      const profile = data.staffProfiles.find((sp) => sp.userId === m.userId);
      return {
        value: m.userId,
        label: profile?.displayName ?? m.user.name ?? 'Bilinmeyen İsim',
        avatarUrl: profile?.avatarUrl ?? m.user.image ?? null,
        initials: (profile?.displayName ?? m.user.name ?? 'Bİ').slice(0, 2).toUpperCase(),
        memberId: m.id,
        role: m.role,
      };
    });

  const employeeCollection = createListCollection({ items: employeeItems });

  const selectedEmployee = employeeItems.find((e) => e.value === selectedUserId);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-fg-default">Çalışanlar</h1>
        <InviteEmployeeDialog shopId={shopId} />
      </div>

      <div className="mb-8">
        <ListboxRoot
          collection={employeeCollection}
          label="Çalışan Listesi"
          orientation="horizontal"
          data-testid="employees-listbox"
          value={selectedUserId ? [selectedUserId] : []}
          onValueChange={(details) => {
            setSelectedUserId(details.value[0] ?? null);
          }}
        >
          {employeeItems.length === 0 ? (
            <ListboxEmpty>Henüz çalışan bulunmuyor</ListboxEmpty>
          ) : (
            employeeItems.map((emp) => (
              <ListboxItem key={emp.value} item={{ value: emp.value, label: emp.label }}>
                <AvatarField
                  src={emp.avatarUrl ?? undefined}
                  fallback={emp.initials}
                  className="w-12 h-12 text-sm"
                  variant="square"
                />
                <ListboxItemLabel>{emp.label}</ListboxItemLabel>
              </ListboxItem>
            ))
          )}
        </ListboxRoot>
      </div>

      {selectedEmployee && (
        <div className="p-4 bg-bg-default border border-border-default rounded-l2 max-w-md">
          <h2 className="text-lg font-semibold text-fg-default mb-4">Çalışan Detayı</h2>
          <div className="flex items-center gap-4 mb-4">
            <AvatarField
              src={selectedEmployee.avatarUrl ?? undefined}
              fallback={selectedEmployee.initials}
              className="w-16 h-16 text-lg"
              variant="square"
            />
            <div>
              <p className="font-medium text-fg-default">{selectedEmployee.label}</p>
              <p className="text-sm text-fg-muted">
                {selectedEmployee.role === 'manager' ? 'Şef' : 'Çalışan'}
              </p>
            </div>
          </div>
          <Button
            variant="error"
            size="sm"
            disabled={removeMutation.isPending}
            onClick={() =>
              removeMutation.mutate({ data: { shopId, memberId: selectedEmployee.memberId } })
            }
          >
            {removeMutation.isPending ? 'Çıkarılıyor...' : 'Çalışanı Çıkar'}
          </Button>
        </div>
      )}
    </div>
  );
}
