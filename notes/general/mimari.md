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
## Iyzico
  Sistem ödeme işlemleri için Iyzico kullanmakta.

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
## cva
Birden fazla variant'ı olan componentler için CVA kullanmakta.
## rooks
Yazılım [Rooks](https://github.com/imbhargav5/rooks) kullanmakta. Buradaki hazır hooklar yeni hooklar yazmadan önce mutlaka kontrol edilmeli.
## builder-pattern
Yazılım [builder-pattern](https://github.com/Vincent-Pang/builder-pattern) kullanmakta. Bir zod şemasından obje oluşturulurken eğer obje parça parça oluşturulacaksa bu pattern kullanılmalı ve daha sonra build edilen obje zod şeması ile doğrulanmalı.
