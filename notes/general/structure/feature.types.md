# Tipler (.types.ts) Standartları

Bu döküman, projedeki özellik (feature) tabanlı `.types.ts` dosyalarının hangi durumlarda **KULLANILACAĞINI** ve hangi durumlarda **KULLANILMAYACAĞINI** belirler.

Projede Zod ve `z.infer` yapısı kullanıldığı için temel (core) veri modelleri zaten `[feature].schemas.ts` dosyasında tutulur ve oradan dışa aktarılır. Bu nedenle `.types.ts` dosyası her feature altında **zorunlu değildir**, aksine sadece istisnai senaryolar için bir "Tipler Deposu" olarak kullanılmalıdır.

---

## NELER YASAK? (Anti-Bloat ❌)

1. **Zod'dan Gelen Veriyi Kopyalamak YASAKTIR:** `appointment.schemas.ts` içinde tanımlanmış bir `Appointment` tipini alıp, .types dosyası içinde `interface Appointment {...}` yazarak manuel tekrara (Hardcopy) girmek D.R.Y prensibine tamamen aykırıdır. Veri şekli (Shape) şemadan okunmalıdır.
2. **Component Prop Tipleri:** Sadece bir React bileşenini ilgilendiren Prop interface'leri (Örn: `interface CardProps`) `.types.ts` dosyasına **konulmamalıdır**. Bunlar doğrudan ilgili bileşenin kendi `.tsx` dosyasında kalmalıdır.
3. **Hook Paremetreleri:** Sadece bir kancayı ilgilendiren parametre objeleri (Örn: `interface UseAppointmentProps`) ilgili `use-hook.ts` dosyasında tutulmalıdır.

---

## `.types.ts` NE ZAMAN KULLANILIR? (Doğru Kullanım ✅)

### 1. Zod'u İlgilendirmeyen Saf Arayüzler (Pure Interfaces)
Çalışma zamanında (runtime) Zod ile doğrulanması mantıksız olan, sadece kod mimarisini, derleyiciyi (Compiler) ve geliştirici deneyimini (DX) ilgilendiren yapılandırma tipleri burada tutulur.

```typescript
// Kod içi servislere yönelik yapılandırma arayüzü (Zod ile alakası yok)
export interface AppointmentServiceConfig {
  timeoutMs: number;
  retryOnFail?: boolean;
}

// Zod Enum yapmak için fazla basit/gereksiz olan düz Typescript Union tipler
export type CalendarViewMode = "day" | "week" | "month";
```

### 2. Dış Kütüphane (3rd Party) ve Prisma Tipleri
Projedeki Iyzico, WhatsApp veya Prisma gibi kütüphanelerin kendi sağladığı devasa (ve zaten kütüphane tarafından parse edilen) karmaşık tipleri yeniden z.object() ile yazmak performansı düşürür. Bu 3. parti tipleri projenin kendi isimlendirmesine uydurmak (Type Alias) veya referanslamak için `.types.ts` kullanılır.

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
Proje büyüdüğünde `User` dosyasındaki bir kurgu `Appointment` özelliklerine erişmek isterse, `Appointment` dosyası da `User`'ı çağırırsa birbirlerini kilitleyerek Typescript/Vite'i çökertirler. Bu durumlarda birbirlerini doğrulayan/kapsayan ortak bağımsız yapılar `.types.ts` aracı dosyasından aktarılarak (import type) ölümcül kilitlenme döngüsü (Circular Ring) kırılır.

---

### Yapay Zeka (AI) İçin Geliştirici Kuralları:

1. **Zorunlu Değil Kuralı:** Geliştirici sana "Yeni bir feature ayağa kaldır" dediğinde her klasörde refleks olarak boş bir `[feature].types.ts` oluşturma. Yalnızca bu sayfada belirtilen 3 istisnadan (3rd Party, Pure Interface, Circular Break) birisi gerçekleşirse bu dosyayı yarat!
2. **Type-Only Aktarımı (`import type`):** Başka dosyalardan `.types.ts` dizinine dışarıdan bir bileşen veya yapı referansı alırken ASLA standart import kullanma! Her zaman `import type { Model } from ...` (Type-Only Import) formatını kullan. Bu sayede paketleyici (Esbuild/Vite) bu satırları inşa kodundan siler ve sıfır-maliyet performansı korunur.
