# Zod Schema (.schemas.ts) Standartları

Bu döküman, projede veri doğrulama (validation) ve TanStack Form tiplendirmesi amacıyla kullanılan Zod kurallarının `[feature].schemas.ts` dosyalarında nasıl kodlanması gerektiğini belirler.

## 1. Temel Şema ve Tip (Type Inference) Şablonu

Projedeki yapı gereği, her modülün şeması kendi klasöründedir (Örn: `features/appointment/appointment.schemas.ts`). 
Zod şeması tanımlandığı an, hemen altında Type/Interface karşılığı `z.infer` ile dışa aktarılmalıdır. Orijinal type'ları elle Interface olarak tekrar yazmak yasaktır.

```typescript
import { z } from "zod";

// 1. Şemanın Tanımlanması (Değişken isminin sonu Schema kelimesiyle biter)
export const AppointmentSchema = z.object({
  id: z.string().uuid(),
  date: z.date(),
  patientName: z.string().min(2, "Name must be at least 2 characters"),
  status: z.enum(["PENDING", "CONFIRMED", "CANCELLED"]).default("PENDING"),
});

// 2. Typescript Tipinin Çıkartılması
export type Appointment = z.infer<typeof AppointmentSchema>;
```

---

## 2. Form ve DTO Şablonları (Omit / Pick)

Veritabanındaki ana objeyi, "Yeni Kayıt" (Create) veya "Güncelleme" (Update) gibi form/sayfa ekranlarında aynen kullanmayız (Çünkü form sırasında ID veya sunucu statüleri henüz belli değildir). 
Böyle bir durum için yeni bir şema açıp kuralları baştan teker teker yazmak **KESİNLİKLE YASAKTIR**. Daima orijinal şemadan `.omit()`, `.pick()` veya `.extend()` ile türetme yapılmalıdır.

```typescript
// BAŞARILI VE GÜVENLİ TÜRETME:
export const CreateAppointmentSchema = AppointmentSchema.omit({ 
  id: true,       // Yeni random ID sunucuda oluşturulacağı için attık
  status: true    // Yeni kayıt varsayılan PENDING olacağı için attık
});
export type CreateAppointmentInput = z.infer<typeof CreateAppointmentSchema>;

export const UpdateAppointmentSchema = AppointmentSchema.partial();
export type UpdateAppointmentInput = z.infer<typeof UpdateAppointmentSchema>;
```

---

## 3. Adım Adım Veri Toplama ve Çoklu Form (Wizard) Validasyonu

Sistemde adım adım (wizard stili) veri toplanması gerektiğinde, sürecin bir **UI Formu mu** yoksa **Arkaplan Mantığı (Business Logic) mı** olduğuna göre iki farklı yol izlenir:

### A. UI Formlarında Step-by-Step (Çok Adımlı) Validasyon
Bir UI formu adım adım ilerliyorsa, her bir ekran kullanıcının devam edebilmesi (ileri butonuna basabilmesi) için **kendi içinde izole olarak anında doğrulanmak (validate) zorundadır**. Her adım için ana şemadan `.pick()` ile bir "Adım Şeması (Step Schema)" çıkartılmalıdır.

```typescript
// Kişisel Bilgiler Ekranı Şeması
export const AppointmentCustomerStepSchema = CreateAppointmentSchema.pick({ patientName: true });

// Tarih Seçimi Ekranı Şeması
export const AppointmentTimeStepSchema = CreateAppointmentSchema.pick({ date: true });
```
*(TanStack Form ile bu step şemaları her ekranın kendi form kurgusunu/state'ini doğrular. Veriler başarıyla toplanıp en son sunucuya atılacağı zaman asıl birleştirilen JSON genel `CreateAppointmentSchema.parse()` işlemine sokulur.)*

### B. Business Logic (Backend/Fonksiyonel) İçin Builder Pattern Kullanımı
Eğer veri doğrudan ekrandan anlık toplanmıyor da, arkaplandaki iş mantığı döngülerinden, farklı endpointlerden veya servislerden parça parça bir araya getiriliyorsa, kodda `Partial<T>` kargaşalarından kaçınmak için `builder-pattern` kullanılmalıdır. Bu senaryoda obje ancak yapımı bitince onaydan geçmelidir:

```typescript
import { Builder } from "builder-pattern";

// Parça 1: Yetki servisinden gelen kod
const payloadDraft = Builder<CheckoutInput>()
  .userId("abc-123"); 

// Parça 2: Başka bir hesaplama sonrasında
payloadDraft.amount(500);

// Data tamamlandıktan sonra onay bas.
const finalData = CheckoutSchema.parse(payloadDraft.build());
```

---

### Yapay Zeka (AI) İçin Geliştirici Kuralları:

1. **İsimlendirme (Naming):** Zod şemalarının değişken isimleri mutlaka `Schema` kelimesiyle bitmelidir. Form/Wizard şemaları hazırlarken ASLA `Step1Schema`, `Step2Schema` gibi sayılar içeren tembel (bloat) isimlendirmeler kullanma! Bunun yerine amaca yönelik (semantic) `AppointmentCustomerStepSchema`, `AppointmentTimeStepSchema` gibi açıklayıcı (domain-specific) isimler türet. Type olarak çıkarttığın interface isimleri de aynı semantik mantıkla takısız ve yalın kalmalıdır (Örn: `type AppointmentTimeStep`, `type CreateReportInput`).
2. **Kopya Şema Üretimi (Anti-Bloat):** TanStack Form kurguları veya DTO objeleri için yeni bir tipe veya farklı bir şemaya ihtiyaç duyduğunda, proje içinde zaten yazılmış ana bir kural seti (modeli) varsa onu **asla klonlama**. Tek Tip Kuramı'na uyarak `Omit`, `Pick`, `Partial` fonksiyonlarıyla orijinal şemadan türet!
3. **Hata Mesajları:** Zod validasyon kuralları koyuyorsan (örn: `.min(1)`) mutlaka kullanıcıların göreceği "Error/ZodIssue" çıktılarını string karşılıklarıyla doldur (`z.string().min(1, "Burası boş bırakılamaz")` gibi).
4. **Veri Toplama Standartları (UI vs Logic):** "Çok adımlı (wizard/step)" bir kullanıcı UI formu tasarlanacaksa her adımda kullanıcıya hata göstermek (real-time validation) için Zod üzerinden `pick()` ile sadece o adıma ait alt şemalar üret ve kullanıcı deneyimini kopartma. Ancak form dışı arkaplan (backend/logic) işlemlerindeki bir payload "aşama aşama" oluşturulacaksa, belirsiz tip riskini önlemek için `Partial<T>` yerine `builder-pattern` kütüphanesinin `Builder<T>()` metoduna güven.
