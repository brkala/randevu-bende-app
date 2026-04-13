# Storage (Medya ve Depolama) Özelliği

Projemizde "Mobil Öncelik" ve "Hız" (Altın Kurallar) şartlarını desteklemek için dosyalar, resimler ve avatarlar doğrudan projenin çalıştığı ana sunucuya (VPS diski) YÜKLENMEZ. Medya depolaması ve servisi için CDN gücü ve "Sıfır Dışarı Veri Çıkışı (Egress)" maliyeti avantajından dolayı **Cloudflare R2** (AWS S3 uyumlu Object Storage) teknoloji olarak belirlenmiştir.

"Sıfır-Global" (Zero-Global) mimarimizde altyapılar (Veritabanı gibi) izole edildiği için, Storage altyapısı da  kendi feature klasörüne `src/features/storage/` taşınır.

## Yapısal Tasarım

```text
src/
└── features/
    └── storage/
        ├── lib/
        │   └── r2.client.ts      // AWS SDK (v3) ile S3Client'in başlatıldığı tek Merkez. (Singleton Mode mantığı)
        └── storage.utils.ts      // Bucket name, CDN config sabitlemelerini barındıran yapılar 
```

## Ortam ve Bucket Stratejisi (ÇOK ÖNEMLİ)

Canlı verinin güvenliği ve geliştirme sürecindeki tam izolasyon için **her ortam kendi R2 Bucket'ına** bağlanmak zorundadır:
- **Production (Canlı) Bucket:** Sadece `ENV=production` ortamında kullanılır ve yalnızca gerçek müşteri / kuaför resimlerini barındırır.
- **Development (Dev) Bucket:** `ENV=development` ortamında kullanılır. Geliştiricinin kendi bilgisayarındaki testleri için kullanılır.
- **Test Bucket:** `ENV=test` ortamında kullanılır. CI/CD süreçleri veya otomatik E2E (Playwright vs.) test ortamları için geçicidir.

## Medya Tohumlama (Seed) Stratejisi
`fakerjs` ve builder-pattern ile veritabanını (Prisma) sahte verilerle doldururken, bu işletmelere "görsel" de atanması gerekir. Bu işlem için:
1. Projede `prisma/seed-assets/` adında sadece ufak boyutlu varsayılan (placeholder/örnek) avatarların ve logoların bulunduğu bir klasör tutulur.
2. `prisma seed` komutu çalıştığında, tohumlama motoru önce `features/storage/lib/r2.client.ts` kullanarak bu klasördeki dosyaları bulut üzerindeki **ilgili ortama (Dev veya Test bucket'ına)** yükler.
3. Yükleme tamamlandıktan sonra dönen R2 path anahtarları (örn: `avatars/fake-kuafor-1.jpg`), Faker objelerine atanarak veritabanına işlenir. 
*(Not: Bu operasyon için ileride `pnpm run seed:assets` isminde harici bir script command da oluşturulabilir, ikisi de onaylı mimari yaklaşımdır).*

## Mimari Kurallar (Sunucu Bağımsız Yükleme - Pre-Signed URL)

Uygulamanın bant genişliğini israf etmemek için işlem akışı şu şekildedir:
1. **İstemek:** İstemci tarafı (Müşteri veya Kuaför arayüzü) resmi direkt `createServerFn`'e yollamaz. Sadece dosya bilgilerini atıp bir R2 isteğinde bulunur.
2. **İmzalanmış Link Üretmek:** Hedef özellik (örn. `features/hairdresser/hairdresser.functions`), `storage` feature'ından `r2.client`'i import ederek kısa ömürlü ve kriptolu bir (AWS v3 S3 SDK üzerinden) Yükleme URL'si talep eder.
3. **Buluta Yollamak:** İstemci, aldığı bu URL üzerinden dosyayı doğrudan Cloudflare'in bulutuna `PUT` veya `POST` eylemiyle kaydeder.
4. **Referans Almak:** Veritabanına(Prisma DB'ye) ASLA "https://cdn...." şeklinde uzun bir adres kaydedilmez. Kayıt, taşıma kolaylığı için sadece anahtar (`avatars/ahmet-123.jpg`) bazlıdır.

## Strapi Entegrasyonu
Strapi platformu ile oluşturulan Admin panelindeki veri yükleme işlemleri de bu altyapıyı paylaşır.
Bu, Strapi'nin `config/plugins.js` ayarlarına **`@strapi/provider-upload-s3`** paketini kurup R2 referans anahtarlarının girilmesi (region: "auto", endpoint: "accountid.r2.cloudflarestorage.com") şeklinde izole olarak halledilir.

## Responsive (Duyarlı) Görsel Dağıtımı Teknolojisi

Sistemdeki görseller HTML `img` tag'i yerine, geliştirilmiş `features/shared/components/ui/cdn-image.tsx` kullanılarak yönetilir.

**Bu bileşenin en önemli özellikleri;**
1. Tarayıcı genişliğine göre `srcset` ve `sizes` verilerini dinamik (320w, 640w gibi) üretmesi.
2. Resimleri arka planda Cloudflare Image Resizing modülüne sevk edip cihaz dostu en verimli formata getirmesidir.

Örnek Bir İşlem: 
`<CdnImage fileKey={dbData.avatar_key} width={150} />` şeklinde verilirse, akıllı arka plan optimizasyonu direkt resme 150px formüle eden URL'yi çakar, React ve AI ajanları bu optimizasyonu tek hamlede kurallar dahilinde bitirmiş olur.
