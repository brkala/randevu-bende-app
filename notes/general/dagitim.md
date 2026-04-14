# Dağıtım (Deployment) ve Ortam Yönetimi

"Randevu Bende" projesi, Ubuntu 24.04 VPS üzerinde Docker/Traefik ikilisiyle çalışır. Süreçlerin hatasız ilerlemesi için aşağıdaki dağıtım ve ortam kurallarına uyulmalıdır.

## 1. Çevre Değişkenleri (.env) Yönetimi
Projenin kök dizininde bulunan `.env` dosyası asla Git'e pushlanmaz. Ancak projenin bağımlılıklarını belirten bir `.env.example` dosyası güncel tutulmalıdır.

### Önemli Değişken Grupları:
- **Altyapı:** `DATABASE_URL`, `REDIS_URL`, `PORT`
- **Auth:** `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`
- **Depolama:** `R2_ACCESS_KEY`, `R2_SECRET`, `R2_BUCKET`, `VITE_CDN_URL`
- **API:** `WHATSAPP_TOKEN`, `WHATSAPP_PHONE_ID`, `WHATSAPP_MAGIC_CODE`, `IYZICO_KEY`, `IYZICO_SECRET`
- **İzleme:** `SENTRY_DSN` (Sadece prod'da zorunlu)

## 2. Dağıtım Akışı (CI/CD)
Projenin canlıya çıkış süreci şu adımları izler:

1. **Test ve Lint:** GitHub Actions (veya benzeri bir CI) üzerinden `gelistirme.md`'deki tüm kontroller (`pnpm review`) çalıştırılır. Testleri geçemeyen kod canlıya gidemez.
2. **Docker Build:** Uygulama, `.dockerignore` kurallarına uygun olarak optimize edilmiş bir Docker imajına dönüştürülür.
3. **Database Migration:** Canlı sunucuda imaj ayağa kalkmadan önce `prisma migrate deploy` komutu ile veritabanı şemaları güncellenir.
4. **Zero-Downtime:** Traefik sayesinde, yeni konteyner hazır olduğunda trafik eskisinden yenisine kesintisiz aktarılır.

## 4. Merkezi Çevre Değişkeni Yönetimi (Security)
Güvenlik zaafiyetlerini önlemek için `process.env` kullanımı sınırlanmıştır.
- **Biome Kısıtlaması:** `noProcessEnv` kuralı ile projenin her yerinde doğrudan `process.env` kullanımı engellenmiştir.
- **Merkezi Erişim:** Tüm env değişkenleri sadece `src/features/shared/lib/env.server.ts` gibi merkezi bir dosyada Zod ile doğrulanarak dışarıya (Typed object olarak) sunulur.
- **Client-Side Güvenliği:** Vite/Start üzerinde hassas verilerin (Örn: `WHATSAPP_TOKEN`) tarayıcıya sızmaması için ASLA `VITE_` ön ekiyle tanımlanmamasına dikkat edilmelidir.
