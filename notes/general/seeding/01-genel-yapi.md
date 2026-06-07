# 1. Seeding Genel Yapısı ve Ortamlar (Environments)

Prisma Seed mekanizması, `NODE_ENV` değerine göre farklı veritabanı senaryoları türetir. `src/features/database/seeds/seed.ts` şişmiş bir yapıya dönüşmemeli, ana odak noktası ortam senaryolarını başlatan bir kontrolcü (dispatcher) görevi görmesidir.

## Ortam (Environment) Senaryoları

1. **PROD (Production):** Sistemin çalışması için zorunlu ana verileri (Rol tanımları, enum vb.) içerir. Bu ortama **asla** rastgele müşteri veya sahte randevu eklenmez.
2. **DEV (Development):** Prod verilerine ek olarak, geliştirme ve UI/UX testi için gerçekçi sahte (faker) veriler içerir (Admin kullanıcısı, test şubeleri, randevu takvimleri).
3. **TEST:** Otomatik testlerin izole çalışması için DEV verilerini temel alır, ek ihtiyaçlar fixture'lar ile yönetilir.

## Klasör Dağıtımı ve Modülerlik
Ana `seed.ts` dosyası model oluşturma yığınından temizlenmelidir. Dosyalar şu şekilde bölünür:
- `src/features/database/seeds/prod-seed.ts`
- `src/features/database/seeds/dev-seed.ts`
- `src/features/database/seeds/builders/` (Obje üreten Builder'lar)

## Bilgilendirici (Informative) Loglar
Seed süreci sessiz çalışmamalı veya log yığını oluşturmamalıdır. Ekrana hangi gruptaki verinin basıldığı ve işlemin durumu net yazılmalıdır:

```typescript
console.log('🌱 Seeding işlemi başlatıldı... Ortam:', process.env.NODE_ENV);
console.log('📦 [1/3] Sistem Enumları ve Rolleri (Prod) içeri aktarılıyor...');
// İşlem...
console.log('✅ Roller başarıyla oluşturuldu.');
console.log('🛠 [2/3] Geliştirme (Dev) verileri ekleniyor...');
```

## Medya ve Görsel Tohumlama (Storage Seed)
Görselleri test edebilmek için "Storage Seed" konsepti kullanılır. `Dev` ve `Test` ortamları için R2 bulut sistemine sahte resimler yüklenip veritabanına sadece key'leri basılır.
**(ÖNEMLİ:** Detaylar için `notes/general/structure/default-features/storage.feature.md` içindeki *"Medya Tohumlama (Seed) Stratejisi"* başlığını inceleyin.)
