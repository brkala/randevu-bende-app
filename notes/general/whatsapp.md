# 📱 WhatsApp Business API Entegrasyon Rehberi

Bu döküman, Randevu Bende projesinde Netgsm üzerinden alınan 0850 hat ile WhatsApp Business API (Meta Cloud API) kurulumunun uçtan uca nasıl yapılacağını açıklar.

---

## 🏗️ 1. Şirketleşme ve Meta Hazırlığı
WhatsApp API kullanabilmek için Meta'nın "Business" statüsünde bir işletme görmesi gerekir.

- **Vergi Levhası:** Şahıs şirketi veya Ltd.Şti. fark etmeksizin güncel bir vergi levhası gereklidir.
- **Meta Business Manager:** [business.facebook.com](https://business.facebook.com) üzerinden bir işletme hesabı açılmalı ve şirket bilgileri (adres, web sitesi, vergi numarası) girilmelidir.
- **İşletme Doğrulaması:** Meta bazen resmi belgelerin yüklenmesini isteyebilir. Bu süreç 1-3 gün sürebilir.

## 📞 2. Numara Tahsisi (Netgsm & Meta Bağlantısı)
Resmi bir duruş sergilemek için 0850'li numara Netgsm üzerinden alınır ve Meta'ya "taşınır" (teknik olarak Meta'ya tanıtılır).

1. **Netgsm'den Numara Al:** Tercihen akılda kalıcı bir 0850 numara satın al.
2. **Meta Panelinden Numara Ekle:** WhatsApp Business hesabına girip "Add Phone Number" de.
3. **Doğrulama (Voice Call):** 0850 numaralar SMS alamadığı için doğrulama yöntemini **"Voice Call"** (Sesli Arama) olarak seç.
4. **Netgsm Yönlendirme:** Eğer numara bir bulut santrale bağlıysa, Meta'nın aramasını karşılayabilmek için geçici olarak cep telefonuna yönlendir veya softphone ile hazır bekle.

## ⚙️ 3. Teknik Kurulum (Developer Portal)
[developers.facebook.com](https://developers.facebook.com) üzerinden bir Meta App oluşturulur.

- **Product:** "WhatsApp" ürünü eklenir.
- **Permanent Access Token:** Geçici tokenlar 24 saatte ölür. Meta System User oluşturarak **"Permanent Access Token"** alınmalı ve `.env` dosyasına `WHATSAPP_TOKEN` olarak girilmelidir.
- **Phone Number ID:** Mesajın hangi numaradan çıkacağını belirten ID (`WHATSAPP_PHONE_ID`).

## 📩 4. Mesaj Şablonları (Templates)
WhatsApp'ta müşteriye ilk mesajı (Outbound) fırlatabilmek için şablonların önceden Meta tarafından onaylanması gerekir.

### A. Authentication (OTP)
Giriş kodları için kullanılır.
- **Format:** "Randevu Bende giriş kodunuz: {{1}}."
- **Kategori:** Authentication

### B. Utility (Randevu Bilgisi)
Randevu onayları ve hatırlatmalar için kullanılır.
- **Format:** "Sayın {{1}}, {{2}} tarihindeki randevunuz onaylanmıştır. Konum: [Link]"
- **Butonlar:** "Randevuyu İptal Et", "Konuma Git" gibi butonlar eklenebilir.

## 💻 5. Kod Uygulama (Project Structure)
Projede `features/whatsapp` klasörü altında izole bir servis olarak kurgulanır.

```typescript
// src/features/whatsapp/lib/whatsapp-service.ts

export async function sendWhatsAppMessage(to: string, template: string, vars: string[]) {
  // fetch to https://graph.facebook.com/v19.0/${WHATSAPP_PHONE_ID}/messages
  // header: Authorization: Bearer ${WHATSAPP_TOKEN}
}
```

## 📉 6. Maliyet ve Optimizasyon
- **Ücret:** Türkiye için yaklaşık **~0,03 TL** (Utility) / **~0,23 TL** (Authentication).
- **Service Window:** Müşteri size yazarsa sonraki 24 saat boyunca ona mesaj atmak **ÜCRETSİZDİR**.
- **Loglama:** Her giden mesajın `message_id` değeri veritabanında saklanmalıdır (Delivery tracking için).

## 🧪 7. Geliştirme ve Test (Sihirli Kod & Güvenlik Kapısı)
E2E (Playwright) testlerinde ve yerel geliştirmede Meta bütçesini harcamamak için sisteme "Sihirli Kod" (Magic Code) mekanizması eklenir.

- **Mantık:** Eğer `.env` dosyasında `WHATSAPP_MAGIC_CODE` tanımlıysa (örneğin: `111222`), tüm numaralar için bu kod geçerli sayılır ve Meta API çağrılmaz.
- **Güvenlik Mimarisi (Gözetimli Erişim):**
    1. **Birim Fonksiyon:** Sadece `features/whatsapp` içindeki tek bir utility fonksiyonu (`isWhatsAppMagicCode`) bu kodu kontrol edebilir.
    2. **Biome Engelleyici:** `biome.json` içindeki `noProcessEnv` kuralı sayesinde, bu merkezi fonksiyon dışındaki hiçbir yerde `process.env` kullanılamaz.
    3. **Çift Kilit (Double Guard):** Kontrol yapılırken mutlaka `NODE_ENV !== 'production'` kontrolü de yapılmalıdır.

```typescript
// features/whatsapp/lib/whatsapp.utils.ts
export function isWhatsAppMagicCode(code: string) {
  // biome-ignore lint/nursery/noProcessEnv: Sadece bu merkezde izin verilir
  const magic = process.env.WHATSAPP_MAGIC_CODE;
  return process.env.NODE_ENV !== 'production' && magic && code === magic;
}
```

> [!CAUTION]
> Sihirli Kod'un canlı (Production) ortamdaki `.env` dosyasına girmesi KESİNLİKLE YASAKTIR. Build sırasında bu kontrol otomatik olarak elenmelidir.

---

> [!TIP]
> **Proje Sloganı:** "Az para çok iş." 
> WhatsApp'ın 2026 Türkiye tarifesiyle bu slogan artık bir zorunluluk değil, matematiksel bir gerçektir.
