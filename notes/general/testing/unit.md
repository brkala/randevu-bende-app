# Unit (Birim) Test Stratejisi

"Az para çok iş" (Hızlı geliştirme) kuralımız gereği Unit Test kullanım amacımız standart projelerden **farklıdır**.

## Kullanılacak Teknoloji: Vitest
Proje derleyicisi olarak zaten Vite kullandığı için, hız ve konfigurasyon uyumu sebebiyle **Vitest** kullanılacaktır. (Jest veya diğer motorlar entegre edilmeyecektir.)

## Unit Test Altın Kuralı (Sadece Saf Mantık)
Unit Test yazmak **SADECE** aşağıdaki koşullarda meşrudur:
1. **Zaman / Tarih Hesaplamaları:** Müşterinin seçtiği saatin dolu olup olmadığını (Overlapping) hesaplayan matematiksel fonksiyon.
2. **Finansal / Matematiksel İşlemler:** Sepetteki %15 indirimi, işletme komisyonunu veya Iyzico taksit tutarlarını hesaplayan fonksiyonlar.
3. **Saf İş Kuralları (Pure Business Logic):** İçinde dış bir API (`fetch`), Veritabanı bağlantısı (`prisma`) veya Arayüz Çizimi (`<button>`) barındırmayan her türlü çekirdek (Core) Javascript/Typescript "util" dosyaları.

> **ÖNEMLİ (AI Ajanları İçin):** İçerisinde `render()`, `@testing-library/react` veya `screen.getBy` geçen hiçbir Unit Test yazılamaz. DOM render işlemi Vitest ile YAPILMAYACAKTIR. Bu iş E2E testlerine (Playwright) aittir.

## Test Klasör Mimarisi ("Zero-Global" Uyumlu)
Uygulama kodları "Feature" (Özellik) bazlı parçalandığı için, saf mantık fonksiyonlarının Unit Test'leri de ayrı bir global `/tests` kasörüne atılmaz. **Test ettiği fonksiyonun tam yanına konur.**

```text
src/
└── features/
    └── appointment/
        ├── lib/
        │   ├── appointment-utils.ts         // Saf Tarih hesaplama fonksiyonu
        │   └── appointment-utils.test.ts    // Hemen yanında yer alan Vitest Dosyası
        └── appointment.schemas.ts
```
