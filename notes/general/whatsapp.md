# 📱 WhatsApp Business API Entegrasyon Rehberi

Bu döküman, Netgsm üzerinden alınan 0850 hat ile WhatsApp Business API (Meta Cloud API) kurulumunun uçtan uca nasıl yapılacağını açıklar.

---

## 🏗️ 1. Şirketleşme ve Meta Hazırlığı
WhatsApp API için Meta'nın Business statüsünde bir işletme görmesi gerekir.

- **Vergi Levhası:** Güncel bir vergi levhası gereklidir.
- **Meta Business Manager:** [business.facebook.com](https://business.facebook.com) üzerinden işletme hesabı açılmalı ve şirket bilgileri girilmelidir.
- **İşletme Doğrulaması:** Gerekli belgelerin Meta'ya yüklenmesi gerekebilir. Süreç 1-3 gün sürer.

## 📞 2. Numara Tahsisi (Netgsm & Meta Bağlantısı)
Resmiyet için 0850 numara Netgsm üzerinden alınır ve Meta'ya tanıtılır.

1. **Netgsm'den Numara Al:** Tercihen akılda kalıcı 0850 numara satın al.
2. **Meta Panelinden Numara Ekle:** WhatsApp Business hesabına girip "Add Phone Number" adımı seçilir.
3. **Doğrulama (Voice Call):** 0850 numaralar SMS alamadığından doğrulama yöntemi **"Voice Call"** (Sesli Arama) olarak seçilir.
4. **Netgsm Yönlendirme:** Meta aramasını karşılayabilmek için hat geçici olarak cep telefonuna yönlendirilir veya softphone ile beklenir.

## ⚙️ 3. Teknik Kurulum (Developer Portal)
[developers.facebook.com](https://developers.facebook.com) üzerinde Meta App oluşturulur.

- **Product:** WhatsApp ürünü eklenir.
- **Permanent Access Token:** Meta System User oluşturularak kalıcı token alınır, `.env` içinde `WHATSAPP_TOKEN` olarak saklanır.
- **Phone Number ID:** Mesajın çıkacağı numarayı belirten ID'dir (`WHATSAPP_PHONE_ID`).

## 📩 4. Mesaj Şablonları (Templates)
WhatsApp üzerinden müşteriye ilk mesajı gönderebilmek için şablonların önceden Meta tarafından onaylanması şarttır.

### A. Authentication (OTP)
Giriş kodları için:
- **Format:** "Randevu Bende giriş kodunuz: {{1}}."
- **Kategori:** Authentication

### B. Utility (Randevu Bilgisi)
Randevu onay ve hatırlatmaları için:
- **Format:** "Sayın {{1}}, {{2}} tarihindeki randevunuz onaylanmıştır. Konum: [Link]"
- **Butonlar:** İptal etme veya haritaya gitme butonları eklenebilir.

## 💻 5. Kod Uygulama (Project Structure)
Projede `features/whatsapp` klasörü altında izole servis olarak kurgulanır.

```typescript
// src/features/whatsapp/lib/whatsapp-service.ts
export async function sendWhatsAppMessage(to: string, template: string, vars: string[]) {
  // fetch to https://graph.facebook.com/v19.0/${WHATSAPP_PHONE_ID}/messages
  // header: Authorization: Bearer ${WHATSAPP_TOKEN}
}
```

## 📉 6. Maliyet ve Optimizasyon
- **Ücret:** Türkiye için yaklaşık **~0,03 TL** (Utility) / **~0,23 TL** (Authentication).
- **Service Window:** Müşteri size yazdıktan sonraki 24 saat boyunca gönderilen mesajlar **ÜCRETSİZDİR**.
- **Loglama:** Her giden mesajın `message_id` değeri veritabanında saklanır.

## 🧪 7. Geliştirme ve Test (Sihirli Kod)
E2E testlerinde ve yerel geliştirmede Meta bütçesini harcamamak için "Sihirli Kod" (Magic Code) kullanılır.

- **Mantık:** `.env` dosyasında `WHATSAPP_MAGIC_CODE` tanımlıysa (örn: `111222`), Meta API çağrılmaz ve bu kod geçerli sayılır.
- **Güvenlik Mimarisi:**
    1. **Birim Fonksiyon:** Sadece `features/whatsapp` altındaki `isWhatsAppMagicCode` fonksiyonu bu kodu kontrol edebilir.
    2. **Biome Engelleyici:** `biome.json` içindeki `noProcessEnv` kuralı gereğince bu merkez dışındaki yerlerde `process.env` kullanılamaz.
    3. **Çift Kilit:** Kontrolde `NODE_ENV !== 'production'` şartı da aranmalıdır.

```typescript
// features/whatsapp/lib/whatsapp.utils.ts
export function isWhatsAppMagicCode(code: string) {
  // biome-ignore lint/nursery/noProcessEnv: Sadece bu merkezde izin verilir
  const magic = process.env.WHATSAPP_MAGIC_CODE;
  return process.env.NODE_ENV !== 'production' && magic && code === magic;
}
```

> [!CAUTION]
> Sihirli Kod'un canlı (Production) ortamdaki `.env` dosyasına girmesi YASAKTIR.

---

> [!TIP]
> **Proje Sloganı:** "Az para çok iş." 
> WhatsApp'ın 2026 Türkiye tarifesiyle bu slogan bir zorunluluktur.
