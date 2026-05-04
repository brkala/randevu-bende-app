# 1. Seeding Genel Yapısı ve Ortamlar (Environments)

Prisma Seed mekanizması, uygulamanın çalıştırıldığı ortama (`NODE_ENV`) bağlı olarak farklı veritabanı senaryoları türetmelidir. `src/features/database/seeds/seed.ts` dosyası devasa bir "bloat" (şişmiş ve okunması zor) yapıya dönüşmemeli; ana odak noktası her ortamın kendi senaryosunu başlatan bir kontrolcü (dispatcher) görevi görmesidir.

## Ortam (Environment) Senaryoları

1. **PROD (Production):** Sadece sistemin çalışması için %100 gerekli olan ana (core) verileri içerir. (Örn: Rol tanımları, veritabanından okunması gereken Enum muadili sabit ayarlar). Bu ortama **asla** rastgele müşteri veya sahte randevu eklenmez.
2. **DEV (Development):** Prod'daki temel verilere **ek olarak**, geliştiricinin UI/UX üzerinde çalışırken görebileceği düzeyde "gerçekçi ama sahte (faker)" veriler içerir. Önceden ayarlanmış (hardcoded) bir admin kullanıcısı, test yapılabilecek şubeler ve dolu/boş randevu takvimleri barındırır.
3. **TEST:** Otomatik testlerin izole çalışabilmesi için DEV ortamındaki gerçekçi verileri temel alır; ek ihtiyaçlar fixture'lar ile yönetilir.

## Klasör Dağıtımı ve Modülerlik
Ana `src/features/database/seeds/seed.ts` dosyası, model oluşturma yığınından temizlenmiş olmalıdır. Model oluşturma ve asıl mantık şu yapıda alt dosyalara kırılır:
- `src/features/database/seeds/prod-seed.ts`
- `src/features/database/seeds/dev-seed.ts`
- `src/features/database/seeds/builders/` (Obje yaratan Builder'ların tutulduğu yer)

## Bilgilendirici (Informative) Loglar
Seed süreci asla "sessiz çalışıp biten" veya her kayıtta "1 row inserted" diyen anlamsız bir log yığınından oluşmamalıdır. Ekrana, hangi gruptaki verinin basıldığı ve işlemin neresinde olunduğu açıkça yazılmalıdır:

```typescript
console.log('🌱 Seeding işlemi başlatıldı... Ortam:', process.env.NODE_ENV);
console.log('📦 [1/3] Sistem Enumları ve Rolleri (Prod) içeri aktarılıyor...');
// İşlem...
console.log('✅ Roller başarıyla oluşturuldu.');
console.log('🛠 [2/3] Geliştirme (Dev) verileri ekleniyor...');
```

## Medya ve Görsel Tohumlama (Storage Seed)
Projede kayıtları sadece salt metin olarak değil, görsel (resim) objelerle gerçeğe uygun şekilde test edebilmek için "Storage Seed" konsepti kullanılır. 
Bu işlem (`Dev` ve `Test` ortamları için) R2 bulut sistemine sahte resimlerin yüklenip veritabanına sadece key'lerinin basılması esasına dayanır.
**(ÖNEMLİ:** Ortamların bucket izolasyonları ve resim limit kuralları için mutlaka `notes/general/structure/default-features/storage.feature.md` dökümanındaki *"Medya Tohumlama (Seed) Stratejisi"* başlığını inceleyin.)
