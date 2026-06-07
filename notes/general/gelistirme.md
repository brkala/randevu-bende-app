# Geliştirme ve Katkı Yönergesi

Bu döküman; git ve kodlama kurallarını içerir.

## 1. Git Commit Kuralları (Conventional Commits)

Commit mesajları **İNGİLİZCE** yazılmalı ve [Conventional Commits](https://www.conventionalcommits.org/) standartlarını takip etmelidir.

**Format:** `<tip>(<kapsam>): <açıklama>`

- **feat:** Yeni özellik eklendiğinde. (`feat(auth): add google login`)
- **fix:** Hata düzeltildiğinde. (`fix(appointment): correct date calculation`)
- **refactor:** Özellik eklemeden veya hata düzeltmeden kod iyileştirildiğinde.
- **docs:** Sadece dökümantasyon değişikliğinde.
- **chore:** Yapılandırma dosyaları, paket bağımlılıkları güncellemeleri vb.
- **test:** Test ekleme veya mevcut testleri düzeltme.
- **style:** Biçimlendirme, boşluklar vb. değişiklikler.

---

## 2. Commit Öncesi Kontrol Listesi (Checklist)

Commit veya Pull Request öncesi aşağıdaki kontrollerden geçilmesi mecburidir:

1. **Biçimlendirme, Linting ve Tip Kontrolü:** Linter veya TypeScript hatası olmamalıdır.
   - **Otomasyon:** `lefthook` ile commit anında (pre-commit) otomatik gerçekleşir.
   - **AI Rolü:** AI asistanları manuel `biome check` veya `type-check` koşturmaz. Başarısız commit durumunda hataları düzeltmekle yükümlüdür.
   - **Manuel Kullanım:** Sadece debugging veya toplu refactor durumunda: `pnpm biome check --write` ve `pnpm type-check`.
2. **Birim Testleri (Unit Tests):** Vitest testleri geçmelidir.
   - İş mantığı (logic) içeren kodlar için test eklendiğinden emin olun.
   - `pnpm test` çalıştırılmalıdır.
4. **E2E Testleri (Gerekliyse):** Kritik akış değiştiyse Playwright testleri kontrol edilmelidir.
5. **Dökümantasyon Güncelliği:** Mimari karar veya yeni yapı kurulduysa `notes/` klasörü güncellenmelidir.

---

## 3. Asistan İnceleme Süreci (AI Review)

AI asistanından kod incelemesi istendiğinde, projenin standartlarına uygunluk denetlenir:

> [!IMPORTANT]
> **Hedef Dosyalar:** Sadece git'teki değişiklikleri inceler. Gerekirse import edilen dosyaları okur.
> **Sadece İnceleme:** AI **kod üzerinde düzenleme, ekleme veya silme yapmaz.** Sadece kodu analiz eder ve rapor sunar. Önerileri belirtir, kullanıcı onay vermeden kodu değiştirmez.

1. **Mimari Uyumluluk Kontrolü:**
   - **Zero-Global:** Kodlar ilgili `feature` altında mı? Global kaçamak var mı?
   - **Multi-Tenant:** DB sorgularında `context.db` ve `shopId` filtresi doğru mu?
   - **Performance:** React 19 kurallarına (Compiler uyumu) uyulmuş mu?

2. **Commit ve Mesaj Standartları:**
   - [Conventional Commits](https://www.conventionalcommits.org/) yapısına ve İngilizce kuralına uyulmuş mu?
