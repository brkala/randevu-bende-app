# Randevu Bende Alt Yapı / Mimari

# Fiziksel
Sistem şu anda bir VPS üzerinde çalışmakta. Bu VPS üzerinde Ubuntu 24.04 LTS işletim sistemi kurulu. 

# Dış Yazılımlar
## Docker
  Sistem diğer dış yazılımlar ve yazılımın kendisi de dahil olmak üzere Docker ile çalışır.
## PostgresSQL
  Sistem veritabanı olarak PostgresSQL kullanmakta. Burada PostgreSQL'in bütün nimetlerinden faydalanmakta yarar var.
## PgBouncer
  Sistem veritabanı bağlantılarını yönetmek için PgBouncer kullanmakta. 
## Redis
  Sistem kısa zamanlı yasaklamalar ve otp kodları için redis kullanmakta. Redis cache olarakta kullanılabilir.
## StrapiCMS/Graphql/ Headless
  Sistem ana site için StrapiCMS kullanmakta. Sistem'in kendisine yönlendirilme buradan yapılacak. Aynı zamanda ana site sistemden bilgi çekip sunabilir.
## React Ana Site
  Strapi kullanılarak geliştirilmiş olan ana site.
## Traefik
  Sistem reverse proxy olarak Traefik kullanmakta.
## BullMQ 
  Sistem zaman ile yapılması gereken iş yükleri için BullMQ kullanmakta.
## NetGSM
  Sistem SMS hizmetleri için NetGSM kullanmakta.
## Zoho Mail
  Sistem, "Az para çok iş" hedefine uygun olarak kurumsal gelen kutusu yönetimi (insan odaklı destek veya bilgi mailleri vb.) için Zoho Mail altyapısını kullanmaktadır.
## Resend
  Sistem uygulamadan fırlatılacak otomatik ve işlemsel e-postalar (Şifre sıfırlama, bildirim vs.) için Resend sistemini kullanır.
## Iyzico
  Sistem, işletme sahiplerinden (Owners) abonelik veya kullanım ücreti tahsil etmek için Iyzico kullanmaktadır. Müşteriler randevu alırken herhangi bir ödeme yapmazlar.
## Sentry (Monitoring)
  Sistem sadece canlı ortamda (Production) çalışmak üzere, gerçek zamanlı hata takibi ve uygulama izleme için Sentry Cloud (Free Tier) kullanmaktadır.
## Cloudflare R2 (Storage & CDN)
  Sistem, "Mobil Öncelik" ve "Hız" hedefleri doğrultusunda, sıfır dışarı veri çıkışı (Egress) maliyeti ve yüksek CDN hızı nedeniyle medya/dosya depolama çözümü olarak Cloudflare R2 (AWS S3 Uyumlu) kullanmaktadır. Görsel gösterimi için arkasında Cloudflare Image Resizing bulunur.

# Yazılımın Kendisi
## typescript
Yazılım Typescript ile yazılıp Node üzerinde çalışmakta.
## pnpm
Yazılım paket yöneticisi olarak Pnpm kullanmakta.
## Çoklu Ortam
Yazılım cross-env gibi paketleri yükleyerek hem linux hem de windows üzerinde geliştirilebilmeli.
## react
Yazılım React kullanacak.
## Tanstack Start
Yazılımın kendisi Tanstack Start kullanılarak geliştirilmekte.
## Tanstack Query
Yazılım clientside veri çekmek için Tanstack Query kullanmakta.
## Tanstack Form
Yazılım formlar için Tanstack Form kullanmakta.
## Tanstack Table
Yazılım tablo işlemleri için Tanstack Table kullanmakta.
## Tanstack Router
Yazılım routing işlemleri için Tanstack Router kullanmakta.
## prisma
Yazılım PostgreSQL ile haberleşmek için Prisma kullanmakta.
## TailwindCSS
Yazılım TailwindCSS ile geliştirilmekte.
## Base UI
Yazılım UI bileşenleri için Base UI kullanmakta.
## biome
Yazılım formatlama ve linter için Biome kullanmakta.
## vite
Yazılım geliştirme süreci için Vite kullanmakta.
## zod
Yazılım schema validasyonu için Zod kullanmakta.
## Better Auth
Yazılım yetkilendirme ve üyelik işlemleri için Better Auth kullanmakta.
## React Email
Yazılım giden işlemler (transactional) ve bildirim e-postalarında eski tip HTML yapıları (nested tables vb.) ile uğraşmamak için `React Email` ve `Tailwind` kullanmaktadır. Yazılımcı mailleri React objesi gibi yazar, kütüphane bunları en eski e-posta istemcilerinin (Outlook vs) bile eksiksiz okuyabileceği hatasız HTML çıktılarına otomatik transpile eder.
## Playwright
Yazılım test yükünün %90'ını üstlenen uçtan uca (E2E) kullanıcı senaryoları (örn: Randevu alma akışı) için Playwright kullanmaktadır. TanStack Start yapısıyla uyumlu olarak UI testi sorumluluğu sadece Playwright'a aittir.
## Vitest
Yazılım sadece ve sadece saf iş zekasını (Para hesaplama, saat çakışması bulma gibi pure-functions) saniyenin binde biri hızında test etmek için Vitest kullanmaktadır. DOM testleri kesinlikle bu motorla yazılmaz.
## cva
Birden fazla variant'ı olan componentler için CVA kullanmakta.
## rooks
Yazılım [Rooks](https://github.com/imbhargav5/rooks) kullanmakta. Buradaki hazır hooklar yeni hooklar yazmadan önce mutlaka kontrol edilmeli.
## builder-pattern
Yazılım [builder-pattern](https://github.com/Vincent-Pang/builder-pattern) kullanmakta. Bir zod şemasından obje oluşturulurken eğer obje parça parça oluşturulacaksa bu pattern kullanılmalı ve daha sonra build edilen obje zod şeması ile doğrulanmalı.
## fakerjs
Yazılım sahte veri üretimi için `@faker-js/faker` kullanmakta. Proje dil ve coğrafyası gereği her zaman Türkçe lokalizasyon (`fakerTR`) import edilmeli ve test tutarlılığı açısından seed operasyonları için `fakerTR.seed(123)` vb. ile sabit rastgelelik ayarlanmalıdır.
## AWS SDK (S3 / Storage Özelliği)
Yazılım, Cloudflare R2 entegrasyonu için izole bir "storage" mantığı (*Zero-Global*) içinde `@aws-sdk/client-s3` kütüphanesini barındırır. Dosya sınırlandırmaları (Pre-Signed URL) burada yapılandırılır ve sunucunun dosya transferi ile asla yorulmaması garanti altına alınır.
