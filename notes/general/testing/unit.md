# Unit (Birim) Test Stratejisi

"Az para çok iş" (Hızlı geliştirme) kuralı gereği Unit Test kullanım amacımız standart projelerden farklıdır.

## Kullanılacak Teknoloji: Vitest
Proje derleyicisi olarak Vite kullandığı için, hız ve konfigürasyon uyumu sebebiyle **Vitest** kullanılacaktır.

## Unit Test Altın Kuralı (Sadece Saf Mantık)
Unit Test yazmak **SADECE** aşağıdaki koşullarda meşrudur:
1. **Zaman / Tarih Hesaplamaları:** Müşterinin seçtiği saatin dolu olup olmadığını (Overlapping) hesaplayan matematiksel fonksiyonlar.
2. **Finansal / Matematiksel İşlemler:** İndirimleri, komisyonları veya taksit tutarlarını hesaplayan fonksiyonlar.
3. **Saf İş Kuralları (Pure Business Logic):** Dış API (`fetch`), Veritabanı bağlantısı (`prisma`) veya Arayüz Çizimi (`<button>`) barındırmayan her türlü çekirdek (Core) JavaScript/TypeScript "util" dosyaları.

> **ÖNEMLİ:** İçerisinde `render()`, `@testing-library/react` veya `screen.getBy` geçen hiçbir Unit Test yazılamaz. DOM render işlemi Vitest ile yapılmayacaktır. Bu iş E2E testlerine (Playwright) aittir.

## Test Klasör Mimarisi ("Zero-Global" Uyumlu)
Uygulama kodları "Feature" (Özellik) bazlı parçalandığı için, saf mantık fonksiyonlarının Unit Test'leri ayrı bir global klasöre atılmaz, **test ettiği fonksiyonun tam yanına konur**:

```text
src/
└── features/
    └── appointment/
        ├── lib/
        │   ├── appointment-utils.ts         // Saf Tarih hesaplama fonksiyonu
        │   └── appointment-utils.test.ts    // Hemen yanında yer alan Vitest Dosyası
        └── appointment.schemas.ts
```
