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

1. **Biçimlendirme, Linting ve Tip Kontrolü:** Kodda linter veya TypeScript hatası olmamalıdır.
   - **Otomasyon:** Bu kontrol `lefthook` tarafından commit anında otomatik (pre-commit) gerçekleştirilir.
   - **AI Rolü:** AI asistanları commit öncesi manuel olarak `biome check` veya `type-check` koşturmaz. Başarısız commit durumunda hataları düzeltmekle yükümlüdür.
   - **Manuel Kullanım:** Sadece debugging veya toplu refactor durumlarında: `pnpm biome check --write` ve `pnpm type-check`.
2. **Birim Testleri (Unit Tests):** Mevcut ve yeni eklenen birim testleri (Vitest) pass etmelidir.
   - İş mantığı (logic) içeren kodlar için testlerin yanına eklendiğinden emin olun.
   - `pnpm test` komutu çalıştırılmalıdır.
4. **E2E Testleri (Gerekliyse):** Eğer kritik bir akış değiştirildiyse ilgili Playwright testleri kontrol edilmelidir.
5. **Dökümantasyon Güncelliği:** Eğer bir mimari karar veya yeni bir yapı kurulduysa `notes/` klasörü güncellenmelidir.

---

## 3. Asistan İnceleme Süreci (AI Review)

Benden veya başka bir AI asistandan kod incelemesi (review) istendiğinde, aşağıdaki adımlar sırasıyla gerçekleştirilerek kodun projenin mimari ve teknik standartlara uygunluğu denetlenir:

> [!IMPORTANT]
> **Hedef Dosyalar:** Sadece git'te yapılan değişiklikleri inceler. Yapılan dosyaların içinde import edilen dosyaların da anlam kazanmak için okunması gerekiyorsa sadece gerekli olanları okur.
> **Sadece İnceleme:** İnceleme (review) talebi aldığında AI **kesinlikle kod üzerinde bir düzenleme, ekleme veya silme yapmaz.** Sadece mevcut kodu okur, analiz eder ve aşağıdaki checklist'e göre rapor sunar. Eğer bir düzeltme gerekiyorsa bunu sadece öneri olarak belirtir, kullanıcı onay vermeden kodu değiştirmez.

1. **Mimari Uyumluluk Kontrolü:**
   - **Zero-Global:** Kodlar ilgili `feature` klasörü altında mı? Global kaçamak yapılmış mı?
   - **Multi-Tenant:** DB sorgularında `context.db` ve `shopId` filtresi doğru kurgulanmış mı?
   - **Performance:** React 19 kurallarına (Compiler uyumu) sadık kalınmış mı?

2. **Commit ve Mesaj Standartları:**
   - [Conventional Commits](https://www.conventionalcommits.org/) yapısına ve İngilizce dil kuralına uyulmuş mu?
