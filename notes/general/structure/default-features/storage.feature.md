# Storage (Medya ve Depolama) Özelliği

Resimler ve avatarlar doğrudan VPS diski yerine Cloudflare R2 (Object Storage) üzerinde barındırılır.

Storage altyapısı kendi feature klasöründe (`src/features/storage/`) yaşar.

## Yapısal Tasarım

```text
src/
└── features/
    └── storage/
        ├── lib/
        │   └── r2.client.ts      // AWS SDK (v3) ile S3Client'in başlatıldığı tek Merkez (Singleton).
        └── storage.utils.ts      // Bucket name, CDN config sabitlemelerini barındıran yapılar 
```

## Ortam ve Bucket Stratejisi (ÇOK ÖNEMLİ)

Canlı verinin güvenliği ve izolasyon için **her ortam kendi R2 Bucket'ına** bağlanır:
- **Production (Canlı) Bucket:** Sadece `ENV=production` ortamında kullanılır ve gerçek kullanıcı dosyalarını barındırır.
- **Development (Dev) Bucket:** `ENV=development` ortamında geliştiricinin yerel testleri için kullanılır.
- **Test Bucket:** `ENV=test` ortamında otomatik E2E (Playwright) testleri için kullanılır.

## Medya Tohumlama (Seed) Stratejisi
Veritabanını sahte verilerle doldururken görsel atamak için:
1. `prisma/seed-assets/` altında küçük boyutlu varsayılan (placeholder/örnek) görseller tutulur.
2. `prisma seed` komutu, `r2.client.ts` kullanarak bu klasördeki dosyaları ilgili ortama (Dev veya Test bucket'ı) yükler.
3. Yükleme tamamlandıktan sonra dönen R2 path anahtarları (örn: `avatars/fake-kuafor-1.jpg`), Faker nesnelerine atanarak veritabanına işlenir.

## Mimari Kurallar (Sunucu Bağımsız Yükleme - Pre-Signed URL)

Sunucu yükünü azaltmak için istemciden doğrudan yükleme yapılır:
1. İstemci tarafı dosya bilgilerini göndererek R2 yükleme isteğinde bulunur.
2. İlgili RPC fonksiyonu (`[feature].functions`), `storage` altındaki `r2.client` ile kısa ömürlü, kriptolu bir Yükleme URL'si (Pre-Signed URL) talep eder.
3. İstemci, aldığı bu URL üzerinden dosyayı doğrudan Cloudflare R2'ye `PUT`/`POST` eder.
4. Veritabanına (Prisma DB) asla tam URL kaydedilmez, sadece referans anahtar (`avatars/ahmet-123.jpg`) kaydedilir.

## Strapi Entegrasyonu
Strapi CMS üzerindeki yüklemeler de bu altyapıyı kullanır. `config/plugins.js` dosyasına `@strapi/provider-upload-s3` kurulup R2 bilgileri girilerek entegre edilir.

## Responsive (Duyarlı) Görsel Dağıtımı Teknolojisi

Görseller `features/shared/components/ui/cdn-image.tsx` bileşeniyle yönetilir.
- Tarayıcı genişliğine göre `srcset` ve `sizes` verilerini dinamik üretir.
- Resimleri arka planda Cloudflare Image Resizing modülüne yönlendirerek optimize eder.

Örnek kullanım: `<CdnImage fileKey={dbData.avatar_key} width={150} />`
