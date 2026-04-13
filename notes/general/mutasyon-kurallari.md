# TanStack Mutasyonları (.mutations) Standartları

Bu döküman, verilerin sunucu tarafında oluşturulması (Create), güncellenmesi (Update) ve silinmesi (Delete) işlemleri sırasında İstemci (Frontend) tarafındaki yönetimi standardize eder. 

Veri getirmek (fetching) için `[feature].queries.ts` kullanılırken, veriyi değiştirmek için genellikle `[feature].mutations.ts` veya dağınık olacaksa `hooks/use-[eylem]-mutation.ts` dosyaları tercih edilir.

## 1. Standart Mutasyon Şablonu (Kayıt / Silme İşlemleri)

Başarılı bir mutasyon, İstemci önbelleğini eskitmeli (Cache Invalidation) ve kullanıcıya mutlaka UI bağlamında geri bildirim (Toast) vermelidir. UI componentini `try/catch` blokları ve bol `useState` logiği ile kirletmek YASAKTIR. Bu işleri hook/mutation bloğu halleder.

```typescript
// Örn: features/appointment/hooks/use-create-appointment.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createAppointmentFn } from "../appointment.functions"; // RPC Api
import { appointmentKeys } from "../appointment.queries"; // Key Fabrikası
// import { toast } from "@/features/shared/components/ui/toast"; 

export const useCreateAppointment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    // 1. İşlem Tanımı (Zod onayından geçen tipe sahip olmalıdır)
    mutationFn: async (data: CreateAppointmentInput) => {
      // TanStack RPC fırlatılır
      return await createAppointmentFn({ data });
    },
    
    // 2. İşlem Başarılı Olduğunda
    onSuccess: (result) => {
      toast.success("Randevu başarıyla sisteme eklendi!");
      
      // ÇOK KRİTİK: Listeleme sayfasındaki veri bayatladı (yeni randevu var)!
      // Bunu otomatik fark edip API'nin güncel tabloyu çekmesini sağlayan tetikleyici:
      queryClient.invalidateQueries({ queryKey: appointmentKeys.lists() });
    },
    
    // 3. İşlem İçeride/Sunucuda Patladığında
    onError: (error) => {
      // Kullanıcıya mutlaka mantıklı bir mesaj ver.
      toast.error(error.message || "Sistemde bir hata oluştu, tekrar deneyin.");
    }
  });
};
```

---

## 2. Optimistic Update (İyimser Güncelleme) Şablonu

Beğeni butonu (Like), Sepete Ekleme, Switch (Aç/Kapat) veya sürükle bırak gibi hızın kusursuz hissettirmesi gerektiği yerlerde; API cevabı beklenmeden İstemci Önbelleği (Cache) anında modifiye edilerek arayüz anında güncellenir. Sunucudan hata çıkarsa veri eski haline geri sarılır (Rollback).

```typescript
// Örn: features/appointment/hooks/use-cancel-appointment.ts
useMutation({
  mutationFn: cancelAppointmentFn,
  
  // Fonksiyon tetiklendiği AN (Daha API gitmeden önce)
  onMutate: async (idToCancel) => {
    // 1. Var olan o işlemi iptal edelim ki çakışmasın
    await queryClient.cancelQueries({ queryKey: appointmentKeys.lists() });

    // 2. Önceki verinin (Cache) yedeğini al (Rollback için)
    const previousAppointments = queryClient.getQueryData(appointmentKeys.lists());

    // 3. Cache'i İYİMSER bir şekilde modifiye et (Sanki işlem çoktan başarılı olmuş gibi)
    // - UI burada inanılmaz hızlı cevap verir! -
    queryClient.setQueryData(appointmentKeys.lists(), (old: any) => {
      return old.map(app => app.id === idToCancel ? { ...app, status: 'CANCELLED' } : app);
    });

    // İptal (Hata) anında geri alınabilmesi için yedeği dön
    return { previousAppointments };
  },
  
  // API Gerçekte başaramaz ve hata fırlatırsa:
  onError: (err, idToCancel, context) => {
    toast.error("İptal işlemi başarısız oldu.");
    // Cache'i OnMutate aşamasında aldığımız Orijinal/Eski yedeğe çevir (Rollback!)
    queryClient.setQueryData(appointmentKeys.lists(), context?.previousAppointments);
  },
  
  // API başarılı da olsa başarsız da olsa sonunda listeyi yine de doğrula
  onSettled: () => {
    queryClient.invalidateQueries({ queryKey: appointmentKeys.lists() });
  },
});
```

---

### Yapay Zeka (AI) İçin Geliştirici Kuralları:

1. **Zorunlu Invalidation (Cache Temizliği):** Veritabanında (Backend) veri ekleme, silme veya modifiye işlemi yapan BÜTÜN mutasyonlar; `onSuccess` evresinde EKSİKSİZ şekilde o veriye ait `[feature].queries.ts` dizinindeki Key Factory yardımıyla listeleri (Örn: `appointmentKeys.lists()`) temizlemelidir (`invalidateQueries`). Bunu unutursan uygulama yeni veriyi ekrana çizmez (UX ölümüdür).
2. **Kör `console.log()` Yasağı:** Catch/Error bloklarında dönen hataları sadece `console.log/error` yapıp bırakmak proje kurallarına YASAKTIR. Son kullanıcı konsolu bilmez. Her hata mutlaka `toast`, `alert` veya `Alert Component` üzerinden UI diline (İnsan diline) çevrilmelidir.
3. **Component İçi Spagetti Yasağı:** Yukarıdaki (Try/catch, OnSuccess Toast bildirimleri vs) mantıkları asla gidip `appointment-card.tsx` içindeki JSX arasına `const sumbitData = async () => {}` olarak yazma! Kod bloğunu kendi hook dosyasına çıkart ve UI componentini "Aptal/Dumb Renderer" olarak sakla. Sadece tıklandığında `mutate()` komutunu ateşlesin.
