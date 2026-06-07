# Tipler (.types.ts) Standartları

Bu döküman, projedeki özellik (feature) tabanlı `.types.ts` dosyalarının hangi durumlarda kullanılacağını ve hangi durumlarda kullanılmayacağını belirler.

Projede Zod ve `z.infer` yapısı kullanıldığı için temel (core) veri modelleri zaten `[feature].schemas.ts` dosyasında tutulur ve oradan dışa aktarılır. Bu nedenle `.types.ts` dosyası her feature altında zorunlu değildir, sadece istisnai senaryolar için bir "Tipler Deposu" olarak kullanılmalıdır.

---

## NELER YASAK? (Anti-Bloat ❌)

1. **Zod'dan Gelen Veriyi Kopyalamak YASAKTIR:** `appointment.schemas.ts` içinde tanımlanmış bir `Appointment` tipini alıp, .types dosyası içinde `interface Appointment {...}` yazarak manuel tekrara (Hardcopy) girmek D.R.Y prensibine tamamen aykırıdır. Veri şekli (Shape) şemadan okunmalıdır.
2. **Component Prop Tipleri:** Sadece bir React bileşenini ilgilendiren Prop arabirimleri `.types.ts` dosyasına konulmamalı, doğrudan ilgili bileşenin kendi `.tsx` dosyasında kalmalıdır.
3. **Hook Paremetreleri:** Sadece bir kancayı ilgilendiren parametre nesneleri ilgili `use-hook.ts` dosyasında tutulmalıdır.

---

## `.types.ts` NE ZAMAN KULLANILIR? (Doğru Kullanım ✅)

### 1. Zod'u İlgilendirmeyen Saf Arayüzler (Pure Interfaces)
Çalışma zamanında (runtime) Zod ile doğrulanması gerekmeyen, sadece kod mimarisini, derleyiciyi ve geliştirici deneyimini ilgilendiren yapılandırma tipleri burada tutulur.

```typescript
// Kod içi servislere yönelik yapılandırma arayüzü (Zod ile alakası yok)
export interface AppointmentServiceConfig {
  timeoutMs: number;
  retryOnFail?: boolean;
}

// Düz TypeScript Union tipleri
export type CalendarViewMode = "day" | "week" | "month";
```

### 2. Dış Kütüphane (3rd Party) ve Prisma Tipleri
Dış kütüphanelerin kendi sağladığı karmaşık tipleri yeniden `z.object()` ile yazmak performansı düşürür. Bu 3. parti tipleri projenin kendi isimlendirmesine uydurmak (Type Alias) veya referanslamak için `.types.ts` kullanılır.

```typescript
import type { Prisma } from "@prisma/client";

// Prisma'nın ilişkili tablolarla kurduğu otomatik SQL tiplerini proje tipi olarak devralma
export type AppointmentWithRelations = Prisma.AppointmentGetPayload<{
  include: { customer: true; services: true };
}>;

// Dış API servislerinden (Iyzico vb) dönecek cevapları tip bağımlılığı olarak standartlaştırma
export interface PaymentGatewayResponse {
  transactionId: string;
  status: "success" | "failure";
}
```

### 3. Döngüsel Bağımlılık (Circular Dependency) Kırıcılar
Modüllerin birbirini kilitlemesini (Circular Ring) önlemek için, bağımsız ortak yapılar `.types.ts` dosyasından tip olarak aktarılır (`import type`).

### 4. İstisnai Klasör Yapısı (Type Directories)
Eğer bir feature içindeki tipler tek bir dosyada yönetilemeyecek kadar karmaşık hale gelirse `[feature].types.ts` dosyası yerine bir `types/` klasörü oluşturulabilir.

---

### Yapay Zeka (AI) İçin Geliştirici Kuralları:

1. **Zorunlu Değil Kuralı:** Yeni bir özellik oluşturulduğunda her klasörde otomatik boş bir `[feature].types.ts` oluşturmayın. Yalnızca bu sayfada belirtilen istisnalardan biri gerçekleşirse dosyayı yaratın.
2. **Type-Only Aktarımı (`import type`):** Başka dosyalardan tip aktarırken her zaman `import type { Model } from ...` (Type-Only Import) formatını kullanın. Bu sayede paketleyici bu satırları derleme kodundan siler ve sıfır-maliyet performansı korunur.
