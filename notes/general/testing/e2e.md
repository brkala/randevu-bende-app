# E2E (Uçtan Uca) Test Stratejisi

Projenin test yükünün (Test Coverage) **%90'ını** E2E testleri üstlenir. Sistemin çalışıp çalışmadığını anlamanın tek "gerçekçi" yolu, tıpkı bir insan gibi tarayıcıyı açıp butonlara basan bir simülasyondur.

## Kullanılacak Teknoloji: Playwright
Modern web standartlarına en uygun, hızlı ve CI/CD süreçlerinde sorunsuz çalışan teknoloji olduğu için E2E test motoru olarak **Playwright** seçilmiştir.

## E2E Altın Kuralı (UI Test Yasağı)
TanStack Start veya React ile oluşturulmuş UI (Arayüz) componentlerinin (Örneğin BaseUI Butonu, bir form, bir tablo) ekranda nasıl gözüktüğü veya "tıklandığında bir state'i tetikleyip tetiklemediği" ile alakalı **KESİNLİKLE BİRİM TESTİ (Unit Test) YAZILAMAZ**.
Bu sorumluluk tamamen Playwright'a (E2E) aittir.

**Senaryo Örneği:**
Bir kuaför randevu formunu test etmek istiyorsak:
* Yanlış: Jest/Vitest ile formu DOM'a render edip `getByText("Gönder")` aratmak.
* Doğru: Playwright ile `test("Kullanıcı randevu alabilmeli")` isimli bir senaryo yazılır, sayfa yüklenir, form doldurulur ve backend'e gönderildiği (E2E) doğrulanır.

## Test Klasör Mimarisi
E2E testleri, projenin kaynak kodundan (`src/`) tamamen izole bir şekilde kök dizinde yaşar:
```text
/
├── src/           // Uygulama Kodları (Feature based)
├── tests/
│   └── e2e/       
│       ├── auth/                 // Her feature'ın e2e senaryosu kendi alanındadır
│       │   └── login.spec.ts
│       └── appointment/
│           └── booking.spec.ts
```
