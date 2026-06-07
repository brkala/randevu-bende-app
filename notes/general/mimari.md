# Randevu Bende Alt Yapı / Mimari

# Fiziksel
Sistem VPS (Ubuntu 24.04 LTS) üzerinde çalışır.

# Dış Yazılımlar
## Docker
Sistem ve tüm dış servisler Docker ile çalışır.
## PostgresSQL
Veritabanı PostgreSQL'dir.
## PgBouncer
Veritabanı bağlantı yönetimi için kullanılır.
## Redis
OTP kodları ve geçici engellemeler (rate limit) için kullanılır. Cache olarak da kullanılabilir.
## StrapiCMS/Graphql / Headless
Ana site için kullanılır. Sistem yönlendirmeleri ve bilgi sunumu buradan yapılır.
## React Ana Site
Strapi tabanlı ana sitedir.
## Traefik
Reverse proxy olarak kullanılır.
## BullMQ
Zamanlanmış ve arka plan iş yükleri için kullanılır.
## WhatsApp Business API
Ana iletişim ve bildirim kanalıdır (Meta Cloud API).
## NetGSM (0850 Numara Sağlayıcı)
Resmi 0850 hattının tahsisi NetGSM üzerinden, mesajlaşma ise WhatsApp üzerinden yürütülür.
## Zoho Mail
Destek ve bilgi gelen kutuları için Zoho Mail kullanılır.
## Resend
Şifre sıfırlama, bildirim vb. otomatik e-postalar için kullanılır.
## Iyzico
İşletme abonelik ve kullanım ücreti tahsilatı için kullanılır. Müşterilerden ödeme alınmaz.
## Sentry (Monitoring)
Yalnızca canlı ortamda (Production) hata takibi için Sentry Cloud (Free Tier) kullanılır.
## Cloudflare R2 (Storage & CDN)
Egress maliyetsiz ve hızlı medya depolama çözümü olarak Cloudflare R2 (AWS S3 uyumlu) ve arkasında Image Resizing kullanılır.

# Yazılımın Kendisi
## typescript
Typescript ile yazılıp Node üzerinde çalışır.
## pnpm
Paket yöneticisidir.
## Çoklu Ortam
Linux ve Windows üzerinde geliştirilebilir (cross-env vb.).
## react
React kütüphanesi kullanılır.
## Tanstack Start
Uygulama Tanstack Start tabanlıdır.
## Tanstack Query
İstemci tarafı veri çekme işlemlerini yönetir.
## Tanstack Form
Form işlemlerini yönetir.
## Tanstack Table
Tablo işlemlerini yönetir.
## Tanstack Router
Yönlendirme (routing) işlemlerini yönetir.
## prisma
PostgreSQL ile haberleşmek için kullanılan ORM'dir.
## TailwindCSS
Stil yönetimi için kullanılır.
## Ark UI
Headless UI bileşenleri için kullanılır.
## biome
Kod formatlama ve linter aracıdır.
## lefthook
Commit öncesi kalite kapısı (Biome ve Type-check otomasyonu) olarak kullanılır.
## vite
Geliştirme sunucusudur.
## zod
Şema doğrulama (validation) kütüphanesidir.
## Better Auth
Üyelik ve yetkilendirme işlemleri için kullanılır.
## React Email
İşlemsel e-postaları React ve Tailwind ile yazıp uyumlu HTML çıktılarına dönüştürür.
## Playwright
Uçtan uca (E2E) testler ve UI testleri Playwright ile yazılır.
## Vitest
Sadece saf iş zekası testleri (pure functions) için hızlı birim test motoru olarak kullanılır.
## tailwind-variants
Çok parçalı bileşenler ve responsive varyant yönetimi için kullanılır.
## constate
Küçük kapsamlı state yönetimi (React Context sarmalayıcısı) için kullanılır.
## date-fns
Tarih ve saat hesaplamaları Türkçe yerelleştirmeyle (`tr`) `features/time` üzerinden yürütülür.
## rooks
Hazır React hook kütüphanesidir. Yeni hook yazmadan önce kontrol edilir.
## builder-pattern
Zod şemalarından parça parça nesne oluşturup doğrulamak için kullanılır.
## fakerjs
Test verileri ve seed operasyonları için Türkçe yerelleştirmeli (`fakerTR.seed(123)`) sahte veri üretir.
## AWS SDK (S3 / Storage)
Cloudflare R2 entegrasyonu için `@aws-sdk/client-s3` kütüphanesini barındırır, sunucuyu yormadan dosya transferi sağlar.
