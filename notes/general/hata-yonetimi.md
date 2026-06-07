# Hata Yönetimi (Error Handling) Standartları

Bu döküman; hataların backend'den istemciye kadar standart sözleşmeyle fırlatılıp UI üzerinde karşılanma kurallarını belirler.

---

## 1. Custom Error (Özel Hata) Sınıfı Fırlatmak

Sunucu (`.server.ts` veya `.functions.ts`) ortamında yaşanan mantık hataları, doğrulama başarısızlıkları veya yetki aşımları sessizce/null dönülerek veya kör bir `throw new Error("hata")` ile geçiştirilemez. Ortak `AppError` sınıfı kullanılarak doğru Status Code içeren fırlatmalar teşvik edilir.

```typescript
// Örn: features/shared/lib/errors.ts
export class AppError extends Error {
  constructor(
    public message: string, 
    public statusCode: number = 400,
    public internalCode?: string // Örn: "INSUFFICIENT_FUNDS"
  ) {
    super(message);
    this.name = "AppError"; // Tür güvenliği
  }
}

// features/appointment/appointment.server.ts
export const createAppointmentData = async (data) => {
  if (!user.isActive) {
    throw new AppError("Hesabınız aktif olmadığı için randevu alamazsınız.", 403, "USER_INACTIVE");
  }
}
```

---

## 2. İstemci (Frontend) Hata Yakalama ve Yönlendirme

Backend hataları veya Zod validasyon kırılmaları, React arayüzünde kullanıcı dilinde 2 yöntemle karşılanır:

1. **Route (Sayfa) Çökme Hataları:**
   Route dosyasındaki `loader` backend hatası nedeniyle prefetch atamazsa boş ekran gösterilmez. TanStack Router hatayı rotanın `errorComponent` veya `__root` sınırlarına yollar.
   
2. **Kullanıcı Etkileşimleri (Mutation) & Global Error Handler:**
   `useMutation` hook'larının `onError` kısmında tekrar tekrar `if/else` kullanmak yerine `features/shared/lib/errors.ts` içindeki merkezi `handleMutationError` aracı TanStack Query global `QueryClient` yapısına yedirilir.

```typescript
// 1. Merkezi Hata Yakalayıcı (features/shared/lib/errors.ts)
export const handleMutationError = (error: unknown) => {
  if (error instanceof AppError) {
    toast.error(error.message); // API hatasını bas
  } else {
    toast.error("İşlem sırasında beklenmeyen bir hata oluştu."); // Fallback
  }
};

// 2. Global Tanımlama (QueryClient başlatılan yer):
import { QueryClient, MutationCache } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  mutationCache: new MutationCache({
    onError: handleMutationError,
  }),
});
```

---

### Geliştirici Kuralları:

1. **Lokal `onError` Yasağı:** `useMutation` yazarken, özel bir durum yoksa `onError: (error) => toast.error(...)` şeklinde lokal handler yazmayın. Hatalar global `MutationCache` ile yönetilir.
2. **Sessiz Fesih / Log Yasağı:** Catch/Error bloklarında dönen hataları sessizce `console.error(err)` yapıp geçiştirmek yasaktır. Her yakalayıcı lokal veya global olarak ekrana (Toast/Alert) basılmalıdır.
3. **Teknik Jargon Filtresi:** Backend'den dönen veritabanı mesajlarını (`"Error: Prisma Unique Constraint on Field: Email"`) doğrudan ekranda göstermeyin. Hata metinleri insan dilinde ve yapıcı (**UX-Friendly**) olmalıdır.
4. **Type-Safe Hata:** Düz `throw new Error()` yerine `AppError` yapısını fırlatın. Böylece frontend tarafında TS tip kontrolü kırılmaz.
