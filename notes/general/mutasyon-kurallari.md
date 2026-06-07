# TanStack Mutasyonları (.mutations) Standartları

Bu döküman; verilerin sunucuda oluşturulması, güncellenmesi ve silinmesi sırasında İstemci (Frontend) tarafındaki yönetimi standardize eder. 

Veriyi değiştirmek için `[feature].mutations.ts` veya `hooks/use-[eylem]-mutation.ts` dosyaları tercih edilir.

## 1. Standart Mutasyon Şablonu

Başarılı bir mutasyon İstemci önbelleğini eskitmeli (Cache Invalidation) ve kullanıcıya UI bağlamında geri bildirim (Toast) vermelidir. UI bileşenini `try/catch` blokları ve `useState` mantığıyla kirletmek yasaktır; bu işleri hook/mutation bloğu halleder.

```typescript
// Örn: features/appointment/hooks/use-create-appointment.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createAppointmentFn } from "../appointment.functions"; // RPC Api
import { appointmentKeys } from "../appointment.queries"; // Key Fabrikası

export const useCreateAppointment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateAppointmentInput) => {
      return await createAppointmentFn({ data });
    },
    onSuccess: (result) => {
      toast.success("Randevu başarıyla sisteme eklendi!");
      queryClient.invalidateQueries({ queryKey: appointmentKeys.lists() });
    },
    onError: (error) => {
      toast.error(error.message || "Sistemde bir hata oluştu, tekrar deneyin.");
    }
  });
};
```

---

## 2. Optimistic Update (İyimser Güncelleme) Şablonu

Sepete Ekleme, Switch (Aç/Kapat) veya sürükle-bırak gibi hızın ön planda olduğu yerlerde, API cevabı beklenmeden İstemci Önbelleği (Cache) anında güncellenir. Hata durumunda veri eski haline geri sarılır (Rollback).

```typescript
// Örn: features/appointment/hooks/use-cancel-appointment.ts
useMutation({
  mutationFn: cancelAppointmentFn,
  onMutate: async (idToCancel) => {
    await queryClient.cancelQueries({ queryKey: appointmentKeys.lists() });
    const previousAppointments = queryClient.getQueryData(appointmentKeys.lists());
    
    queryClient.setQueryData(appointmentKeys.lists(), (old: any) => {
      return old.map(app => app.id === idToCancel ? { ...app, status: 'CANCELLED' } : app);
    });

    return { previousAppointments };
  },
  onError: (err, idToCancel, context) => {
    toast.error("İptal işlemi başarısız oldu.");
    queryClient.setQueryData(appointmentKeys.lists(), context?.previousAppointments);
  },
  onSettled: () => {
    queryClient.invalidateQueries({ queryKey: appointmentKeys.lists() });
  },
});
```

---

### Geliştirici Kuralları:

1. **Zorunlu Invalidation (Cache Temizliği):** Veri değiştiren bütün mutasyonlar, `onSuccess` evresinde Key Factory yardımıyla ilgili listeleri temizlemelidir (`invalidateQueries`). Aksi takdirde yeni veri ekranda görünmez.
2. **Kör `console.log()` Yasağı:** Hataları sadece `console.log/error` yapıp bırakmak yasaktır. Her hata mutlaka `toast`, `alert` veya `Alert Component` üzerinden ekrana yansıtılmalıdır.
3. **Bileşen İçi Spagetti Yasağı:** Değişiklik ve hata yönetim mantığını JSX bileşeni içine yazmayın. Kod bloğunu kendi hook dosyasına çıkartın ve UI bileşenini sadece `mutate()` komutunu ateşleyecek şekilde sade tutun.
