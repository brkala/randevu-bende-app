# 1. Seeding Genel Yapısı ve Ortamlar (Environments)

Prisma Seed mekanizması, uygulamanın çalıştırıldığı ortama (`NODE_ENV`) bağlı olarak farklı veritabanı senaryoları türetmelidir. `prisma/seed.ts` dosyası devasa bir "bloat" (şişmiş ve okunması zor) yapıya dönüşmemeli; ana odak noktası her ortamın kendi senaryosunu başlatan bir kontrolcü (dispatcher) görevi görmesidir.

## Ortam (Environment) Senaryoları

1. **PROD (Production):** Sadece sistemin çalışması için %100 gerekli olan ana (core) verileri içerir. (Örn: Rol tanımları, veritabanından okunması gereken Enum muadili sabit ayarlar). Bu ortama **asla** rastgele müşteri veya sahte randevu eklenmez.
2. **DEV (Development):** Prod'daki temel verilere **ek olarak**, geliştiricinin UI/UX üzerinde çalışırken görebileceği düzeyde "gerçekçi ama sahte (faker)" veriler içerir. Önceden ayarlanmış (hardcoded) bir admin kullanıcısı, test yapılabilecek şubeler ve dolu/boş randevu takvimleri barındırır.
3. **TEST:** Otomatik testlerin veya CI süreçlerinin izole çalışabilmesi için özel veri kombinasyonları yaratır.

## Klasör Dağıtımı ve Modülerlik
Ana `prisma/seed.ts` dosyası, model oluşturma yığınından temizlenmiş olmalıdır. Model oluşturma ve asıl mantık şu yapıda alt dosyalara kırılır:
- `prisma/seeds/prod-seed.ts`
- `prisma/seeds/dev-seed.ts`
- `prisma/seeds/test-seed.ts`
- `prisma/seeds/builders/` (Obje yaratan Builder'ların tutulduğu yer)

## Bilgilendirici (Informative) Loglar
Seed süreci asla "sessiz çalışıp biten" veya her kayıtta "1 row inserted" diyen anlamsız bir log yığınından oluşmamalıdır. Ekrana, hangi gruptaki verinin basıldığı ve işlemin neresinde olunduğu açıkça yazılmalıdır:

```typescript
console.log('🌱 Seeding işlemi başlatıldı... Ortam:', process.env.NODE_ENV);
console.log('📦 [1/3] Sistem Enumları ve Rolleri (Prod) içeri aktarılıyor...');
// İşlem...
console.log('✅ Roller başarıyla oluşturuldu.');
console.log('🛠 [2/3] Geliştirme (Dev) verileri ekleniyor...');
```
