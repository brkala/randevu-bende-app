# Hata Yönetimi (Error Handling) Standartları

Bu döküman uygulamanın Backend (Prisma / API sunucusu) katmanından İstemci (Frontend / UI / Toast) katmanına kadar uzanan süreçte oluşabilecek hataların (Exceptions / Errors) nasıl standart bir sözleşme ile fırlatılıp, UI üzerinde güvenle karşılanacağını belirler.

---

## 1. Custom Error (Özel Hata) Sınıfı Fırlatmak

Sunucu (`.server.ts` veya `.functions.ts`) ortamında yaşanan mantık hataları, doğrulama başarısızlıkları veya yetki aşımları hiçbir zaman "sessizce/null dönülerek" veya kör bir `throw new Error("hata var")` stringi ile geçiştirilemez. 

Projeye eklenecek ortak bir `AppError` sınıfı kullanılarak (Type-Safe şekilde) ve doğru Status Code içeren fırlatmalar teşvik edilir.

```typescript
// Örn: features/shared/lib/errors.ts (Custom Error Catcher Yapısı)
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

// features/appointment/appointment.server.ts - İş mantığında güvenli fırlatma
export const createAppointmentData = async (data) => {
  if (!user.isActive) {
    // 1. Zenginleştirilmiş Özel Hata Gönderimi
    throw new AppError("Hesabınız aktif olmadığı için randevu alamazsınız.", 403, "USER_INACTIVE");
  }
}
```

---

## 2. İstemci (Frontend) Hata Yakalama ve Global Yönlendirme

Backend'den dönen hatalar veya İstemcideki Zod validasyon kırılmaları, React arayüzünde "Kullanıcı diline yansıyarak" 2 farklı metodla karşılanır:

1. **Route (Sayfa) Çökme Hataları:**
   Eğer Route dosyasındaki `loader` (sayfayı render etmeden önce çekilen data - *bkz. routes.md*) backend patladığı için prefetch atamadıysa; boş ekran gösterilmez. TanStack Router bu hatayı derhal o rotanın `errorComponent` veya `__root` error sınırlarına yollar.
   
2. **Kullanıcı Etkileşimleri (Mutation) & Global Error Handler (Varsayılan):**
   Bir butona basıldığında veya form gönderildiğinde dönen hataları her `useMutation` hook'unun `onError` kısmında tekrar tekrar `if/else` ile karşılamak Kod Tekrarıdır (D.R.Y İhlali). Bunun yerine `features/shared/lib/errors.ts` içinde merkezi bir `handleMutationError` aracı oluşturulmalı ve bu araç *mutlak suretle* TanStack Query'nin global olarak başlatıldığı yere (QueryClient) varsayılan (default) işlem olarak yedirilmelidir.

```typescript
// 1. Merkezi Hata Yakalayıcı (features/shared/lib/errors.ts)
export const handleMutationError = (error: unknown) => {
  if (error instanceof AppError) {
    toast.error(error.message); // Kendi tasarımımız olan API hatasını bas
  } else {
    toast.error("İşlem sırasında beklenmeyen bir hata oluştu."); // Prisma çöküşü vs (Fallback)
  }
};

// 2. Global Olarak Tanımlanması (Projenin `QueryClient` başlatıldığı yeri bul):
import { QueryClient, MutationCache } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  // Global Mutasyon Ayarları
  mutationCache: new MutationCache({
    // Artık projedeki hiçbir useMutation'a manuel 'onError' eklemek zorunda değiliz!
    onError: handleMutationError,
  }),
});
```

---

### Yapay Zeka (AI) İçin Geliştirici Kuralları:

1. **Manuel `onError` Yasağı:** Bir feature içinde `useMutation` yazıyorken, eğer çok özel spesifik bir durum yoksa asistan refleks olarak `onError: (error) => toast.error(...)` şeklindeki blokları KULLANMAMALIDIR. Tüm hatalar Global `MutationCache` tarafından yakalanıp yönetilir. Sadece o işlemde toast haricinde bir modülü kapattırmak vs gerekiyorsa lokal `onError` ezilebilir.
2. **Sessiz Fesih / Log Yasağı:** Catch/Error bloklarında dönen bütün hataları projenin geliştirme aşamasındayken sessizce `console.error(err)` yapıp geçiştirmek YASAKTIR. Konsola yansıyan her log, son kullanıcının gözünde aslında "Boş veya takılı kalmış bir sayfa" demektir. Her yakalayıcı (handler) mutlaka lokal veya global olarak UI'da (Toast/Alert) ekrana basılmalıdır.
3. **Teknik Jargon Filtresi:** Geliştiricilerin backend API'lerinden dönebilecek korkunç veritabanı mesajlarını (`"Error: Prisma Unique Constraint on Field: Email"`) doğrudan ekranda göstermesini engelle! Error metinleri her zaman insan/kullanıcı dilinde hedeflenmiş ve yapıcı (**UX-Friendly**) olmalıdır.
3. **Type-Safe Hata:** Fonksiyon kurarken/önerirken düz bir `throw new Error()` kullanmak yerine uygulamanın ortak referansına uygun API Error mimarilerini (`AppError`) fırlatmaya zorla. Bu sayede hata objesi Frontend'e vardığında TS Type Checking kırılmaz.
