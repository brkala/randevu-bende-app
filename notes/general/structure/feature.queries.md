# TanStack Query ve Veri Akışı (.queries.ts) Standartları

Bu döküman, İstemci tarafındaki veri durumunu (Client State & Data Fetching) yöneten TanStack Query `[feature].queries.ts` dosyalarının standartlarını belirler.

TanStack Query (v5) ile birlikte, React componentleri içerisine dağınık bir şekilde `useQuery` ve iç içe `queryKey` yazmak projeyi yönetilemez hale getirir ve Cache (önbellek) patlatma sorunlarına (Invalidation hatalarına) neden olur. Bu nedenle tüm sorgu anahtarları ve bağımlılık kurguları (`queryOptions`) sadece bu dosyalarda tanımlanmalıdır.

---

## 1. Query Key Factory (Anahtar Fabrikası) Şablonu

Verileri önbellekten silebilmek veya güncelleyebilmek için uygulamanın her yerinde anahtarların aynı dizilişte (Örn: `["appointment", "detail", "1"]`) olması şarttır. Bu dökümanda manuel Array yazımı yasaklanmış olup; her feature için aşağıdaki hiyerarşik **Key Factory** kurgusu standartlaştırılmıştır.

```typescript
// 1. Her özelliğin (feature) ana bir KeyFactory'si olmalıdır
export const appointmentKeys = {
  all: ["appointment"] as const,
  lists: () => [...appointmentKeys.all, "list"] as const,
  list: (filters: string) => [...appointmentKeys.lists(), { filters }] as const,
  details: () => [...appointmentKeys.all, "detail"] as const,
  detail: (id: string) => [...appointmentKeys.details(), id] as const,
};
```

---

## 2. Query Options (TanStack v5) Şablonu

Veriyi getirecek olan asıl metot (genellikle `.functions.ts` içerisindeki `createServerFn` uç noktası), TanStack'in modern `queryOptions()` yardımcısıyla birleştirilerek tam bir konfigürasyon objesi (Object Definition) olarak dışarı aktarılmalıdır. Orijinal UI Component'in içine herhangi bir fetch mantığı girmemelidir.

```typescript
import { queryOptions } from "@tanstack/react-query";
import { getAppointmentByIdFn } from "./appointment.functions"; // RPC API Köprümüz

// 2. Tüm sorguları barındıran Options Objesi
export const appointmentQueries = {
  
  detail: (id: string) => 
    queryOptions({
      queryKey: appointmentKeys.detail(id),
      // Mimaride fonksiyonlar (.functions.ts) üzerinden veriyi talep ediyoruz (RPC)
      queryFn: () => getAppointmentByIdFn({ data: { id } }), 
      staleTime: 1000 * 60 * 5, // Örnek config: Veri 5 dakika taze kalır
    }),
};
```

---

### Yapay Zeka (AI) İçin Geliştirici Kuralları:

1. **Inline QueryKey Yasağı:** Hiçbir React UI bileşeni (`.tsx`) veya Hook (`use-hook.ts`) içinde `useQuery({ queryKey: ["random"] })` formatında el ile Hard-Coded (sabit) string anahtarları/arrayleri KULLANMA. Olası bir Cache Invalidation (Mutasyonlar sırasında veriyi tazeleme) kısmında yazım hatası yaşanırsa proje patlar. Daima `[feature].queries.ts` içindeki `appointmentKeys` benzeri Factory yapısını kullan.
2. **`queryOptions` Zorunluluğu:** Bir sayfaya ait query'ler, bir React Hook'u (`export const useList = () => useQuery(...)`) olarak değil; Typescript tarafında (özellikle React bileşen iskeleti dışında da çağırılabilmesi için) TanStack v5 standardı olan `queryOptions()` fonksiyonuyla sarmalanmış basit nesneler (Objects) olarak tutulmalıdır.
3. **RPC Mimarisi ve İletişimi:** `queryFn` içerisinde veri talep edilecekse asla gidip veritabanı dosyasına doğrudan vurulamaz. Veri her zaman bir önceki kurallarda yazılmış olan API köprüsüne (`[feature].functions.ts`) talep/istek atılarak (`createServerFn`) alınır.
4. **Tutarlı İsimlendirme:** Key fabrikası `özellikAdıKeys` (Örn: `userKeys`); Seçenek fabrikası ise `özellikAdıQueries` (Örn: `userQueries`) olmalı ve içeriği her zaman `detail`, `list` gibi standart hiyerarşik fiiller barındırmalıdir.
5. **Router Loader (Prefetch) Önceliği:** Sayfa ilk açıldığında ekranda görünmesi zorunlu olan (initial load) kritik verileri, React bileşeninin içine girip `useQuery` ile ilk defa çekerek kullanıcıyı boş ekranda veya Spinner'da bekletme (Kötü UX / Waterfall). Bu tarz ilk yükleme verilerini **mutlaka TanStack Router'ın `loader` fonksiyonu içerisinde** `queryClient.ensureQueryData(özellikQueries.detail(id))` veya `prefetchQuery` kullanarak önceden sunucuda yüklet (Prefetch). Sayfa altındaki component içindeki `useQuery` sadece önceden yüklenmiş bu taze veriyi senkron olarak okumalıdır.
