# Geliştirme ve Katkı Yönergesi

Bu döküman, projenin kod kalitesini korumak ve ekip (veya AI asistanları) arasındaki uyumu sağlamak için uyulması gereken git ve kodlama kurallarını içerir.

## 1. Git Commit Kuralları (Conventional Commits)

Commit mesajları her zaman **İNGİLİZCE** yazılmalıdır ve [Conventional Commits](https://www.conventionalcommits.org/) standartlarını takip etmelidir.

**Format:** `<tip>(<kapsam>): <açıklama>`

- **feat:** Yeni bir özellik eklendiğinde. (`feat(auth): add google login`)
- **fix:** Bir hata düzeltildiğinde. (`fix(appointment): correct date calculation`)
- **refactor:** Özellik eklemeden veya hata düzeltmeden kod iyileştirildiğinde.
- **docs:** Sadece dökümantasyon değişikliğinde.
- **chore:** Yapılandırma dosyaları, paket bağımlılıkları güncellemeleri vb.
- **test:** Test ekleme veya mevcut testleri düzeltme.
- **style:** Kodun anlamını etkilemeyen (boşluklar, biçimlendirme vb.) değişiklikler.

---

## 2. Commit Öncesi Kontrol Listesi (Checklist)

Bir commit atılmadan veya Pull Request açılmadan önce aşağıdaki kontrollerin **TAMAMINDAN** geçilmesi mecburidir:

1. **Biçimlendirme ve Linting:** Kodda hiçbir linter hatası olmamalıdır.
   - `pnpm biome check --write` komutu çalıştırılmalıdır.
2. **Tip Güvenliği (Type-Check):** Projede hiçbir TypeScript hatası bulunmamalıdır.
   - `pnpm type-check` (veya `tsc --noEmit`) komutu başarılı olmalıdır.
3. **Birim Testleri (Unit Tests):** Mevcut ve yeni eklenen birim testleri (Vitest) pass etmelidir.
   - `pnpm test` komutu çalıştırılmalıdır.
4. **E2E Testleri (Gerekliyse):** Eğer kritik bir akış değiştirildiyse ilgili Playwright testleri kontrol edilmelidir.
5. **Dökümantasyon Güncelliği:** Eğer bir mimari karar veya yeni bir yapı kurulduysa `notes/` klasörü güncellenmelidir.

---

## 3. Asistan İnceleme Süreci (AI Review)

Benden veya başka bir AI asistandan kod incelemesi (review) istendiğinde, aşağıdaki adımlar sırasıyla gerçekleştirilerek kodun projenin mimari ve teknik standartlara uygunluğu denetlenir:

1. **Otomatik Kontroller (Tooling):**
   - **Biome:** `pnpm biome check .` (Linter ve Formatter hataları).
   - **TypeScript:** `pnpm type-check` (Tip hataları).
   - **Unit Tests:** `pnpm test` (Birim testleri).

2. **Mimari Uyumluluk Kontrolü:**
   - **Zero-Global:** Kodlar ilgili `feature` klasörü altında mı? Global kaçamak yapılmış mı?
   - **Multi-Tenant:** DB sorgularında `context.db` ve `shopId` filtresi doğru kurgulanmış mı?
   - **Performance:** React 19 kurallarına (Compiler uyumu) sadık kalınmış mı?

3. **Commit ve Mesaj Standartları:**
   - [Conventional Commits](https://www.conventionalcommits.org/) yapısına ve İngilizce dil kuralına uyulmuş mu?
