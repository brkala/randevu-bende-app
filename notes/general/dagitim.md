# Dağıtım (Deployment) ve Ortam Yönetimi

Randevu Bende projesi, Ubuntu 24.04 VPS üzerinde Docker/Traefik ile çalışır. Hatasız dağıtım için kurallara uyulmalıdır.

## 1. Çevre Değişkenleri (.env) Yönetimi
Kök dizindeki `.env` asla Git'e pushlanmaz. Bağımlılıkları belirten `.env.example` dosyası güncel tutulmalıdır.

### Önemli Değişken Grupları:
- **Altyapı:** `DATABASE_URL`, `REDIS_URL`, `PORT`
- **Auth:** `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`
- **Depolama:** `R2_ACCESS_KEY`, `R2_SECRET`, `R2_BUCKET`, `VITE_CDN_URL`
- **API:** `WHATSAPP_TOKEN`, `WHATSAPP_PHONE_ID`, `WHATSAPP_MAGIC_CODE`, `IYZICO_KEY`, `IYZICO_SECRET`
- **İzleme:** `SENTRY_DSN` (Prod için zorunlu)

## 2. Dağıtım Akışı (CI/CD)
Canlıya çıkış süreci:

1. **Test ve Lint:** GitHub Actions ile `gelistirme.md` üzerindeki kontroller (`pnpm review`) çalıştırılır. Başarısız testler dağıtımı engeller.
2. **Docker Build:** Uygulama, `.dockerignore` kurallarına göre optimize edilmiş Docker imajına dönüştürülür.
3. **Database Migration:** Canlıda imaj ayağa kalkmadan önce `prisma migrate deploy` ile şema güncellenir.
4. **Zero-Downtime:** Traefik ile yeni konteyner hazır olduğunda trafik kesintisiz aktarılır.

## 4. Merkezi Çevre Değişkeni Yönetimi (Security)
Güvenlik için `process.env` kullanımı sınırlandırılmıştır.
- **Biome Kısıtlaması:** `noProcessEnv` kuralı ile doğrudan `process.env` kullanımı engellenmiştir.
- **Merkezi Erişim:** Env değişkenleri `src/features/shared/lib/env.server.ts` içinde Zod ile doğrulanarak tipli obje olarak sunulur.
- **Client-Side Güvenliği:** Hassas verilerin (Örn: `WHATSAPP_TOKEN`) tarayıcıya sızmaması için `VITE_` ön ekiyle tanımlanmamasına dikkat edilmelidir.
