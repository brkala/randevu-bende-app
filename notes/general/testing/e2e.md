# E2E (Uçtan Uca) Test Stratejisi

Projenin test yükünün (Test Coverage) **%90'ını** E2E testleri üstlenir. Sistemin çalıştığını doğrulamanın tek yolu, tarayıcıyı açıp butonlara basan bir simülasyondur.

## Kullanılacak Teknoloji: Playwright
Hızlı ve CI/CD süreçlerinde sorunsuz çalışan E2E test motoru olarak **Playwright** seçilmiştir.

## E2E Altın Kuralı (UI Test Yasağı)
TanStack Start veya React ile oluşturulmuş UI (Arayüz) bileşenlerinin (Örn: Buton, form, tablo) ekranda nasıl gözüktüğü veya tıklandığında bir state'i tetikleyip tetiklemediğiyle alakalı **KESİNLİKLE BİRİM TESTİ (Unit Test) YAZILAMAZ**. Bu sorumluluk tamamen Playwright'a (E2E) aittir.

**Senaryo Örneği:**
Bir kuaför randevu formunu test etmek için:
* Yanlış: Vitest ile formu DOM'a render edip `getByText("Gönder")` aratmak.
* Doğru: Playwright ile `test("Kullanıcı randevu alabilmeli")` senaryosu yazılır, sayfa yüklenir, form doldurulur ve backend'e gönderildiği (E2E) doğrulanır.

## Test Klasör Mimarisi
E2E testleri, projenin kaynak kodundan (`src/`) tamamen izole bir şekilde kök dizinde yaşar:
```text
/
├── src/           // Uygulama Kodları (Feature based)
├── tests/
│   └── e2e/       
│       ├── auth/                 // Her özelliğin e2e senaryosu kendi alanındadır
│       │   └── login.spec.ts
│       └── appointment/
│           └── booking.spec.ts
```

## Test Altyapısı ve Veritabanı
E2E testleri, geliştirme ortamından izole çalışır:

1.  **Özel Test Container'ı**: Docker üzerinde `postgres_test` (5433 portu) adında bağımsız bir veritabanı container'ı kullanılır.
2.  **Otomatik Sıfırlama**: Her test çalışmasından önce `pnpm test:e2e:db:reset` ile test veritabanı şeması sıfırlanır ve `test` ortamı için belirlenen tohum veriler (seed) yüklenir.
3.  **Çalıştırma Komutu**: Testler `pnpm test:e2e` komutu ile başlatılır. Bu komut, uygulamayı `NODE_ENV=test` modunda ayağa kaldırarak doğru veritabanına bağlanmasını garanti eder.

> [!IMPORTANT]
> Test dosyaları içinde `src` altındaki kodlara erişirken `@/` shorthand (alias) kullanılmalıdır.
