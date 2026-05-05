# Time Feature (Varsayılan / Zorunlu)

Bu feature, uygulama genelindeki tüm tarih ve saat işlemlerinin merkezi otoritesidir. Tarihlerin yanlış formatlanmasını, dil hatalarını ve karmaşık `date-fns` importlarını engellemeyi hedefler.

## 1. Amaç
- **Merkezi Dil Yönetimi:** Her seferinde `locale: tr` geçmek yerine, önceden konfigüre edilmiş yardımcıları kullanmak.
- **Standart Formatlar:** Proje genelinde (Örn: "05 Mayıs 2024", "14:30") tutarlı tarih gösterimi.
- **Güvenli Hesaplama:** Randevu çakışmaları ve "Sarı Slot" hesaplamaları için test edilmiş yardımcı fonksiyonlar sunmak.

---

## 2. Klasör Yapısı (`src/features/time/`)

```text
src/features/time/
├── lib/
│   ├── format.ts         // Önceden tr konfigüre edilmiş format fonksiyonları
│   ├── calendar.ts       // Randevu takvimi için özel hesaplamalar (Sarı slotlar vb.)
│   └── utils.ts          // Saf date-fns sarmalayıcıları
└── time.types.ts         // Tarih aralıkları ve slot tipleri
```

---

## 3. Örnek Kullanım ve Standartlar

### A. Formatlama Yardımı (`lib/format.ts`)
`date-fns`'in `format` fonksiyonunu her zaman Türkçe dil desteğiyle sarmalayarak kullan:

```typescript
import { format as dfnsFormat } from "date-fns";
import { tr } from "date-fns/locale";

export const format = (date: Date | number, formatStr: string) => {
  return dfnsFormat(date, formatStr, { locale: tr });
};

// Sıklıkla kullanılan formatlar için hazır yardımcılar
export const formatShortDate = (date: Date) => format(date, "dd MMM yyyy"); // 05 May 2024
export const formatTime = (date: Date) => format(date, "HH:mm"); // 14:30
```

### B. Takvim Mantığı (`lib/calendar.ts`)
Randevu sistemi için kritik olan "Slot" mantığı burada yaşamalıdır:

```typescript
// Örn: Bir gün içindeki tüm 30 dakikalık boşlukları hesapla
export const generateSlots = (start: Date, end: Date, stepMinutes: number) => {
  // Hesaplama mantığı...
};
```

---

## 4. Yapay Zeka (AI) İçin Geliştirici Kuralları:

1. **Doğrudan Import Yasağı:** Projenin diğer feature'larında (Örn: `features/appointment`) doğrudan `date-fns`'in `format` fonksiyonunu import etme! Her zaman `features/time` içindeki sarmalanmış yardımcıları kullan.
2. **Türkçe Lokalizasyon:** Tüm tarih gösterimleri ve isimleri (Gün adları, ay adları) `date-fns/locale/tr` üzerinden geçmelidir.
3. **Zaman Dilimi (Timezone):** Sunucu ve istemci arasındaki zaman farklarını yönetmek için tüm tarihleri ISO formatında (`toISOString()`) sakla ve gösterim anında `features/time` yardımcılarıyla yerel saate çevir.
4. **Anti-Bloat:** Eğer çok spesifik bir tarih manipülasyonu sadece bir feature'ı ilgilendiriyorsa (Örn: Sadece istatistik grafiği), onu `time` feature'ına taşıma. Ancak genel bir format veya hesaplama ise `time` feature'ına ekle.
