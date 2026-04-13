# Dağıtım (Deployment) ve Ortam Yönetimi

"Randevu Bende" projesi, Ubuntu 24.04 VPS üzerinde Docker/Traefik ikilisiyle çalışır. Süreçlerin hatasız ilerlemesi için aşağıdaki dağıtım ve ortam kurallarına uyulmalıdır.

## 1. Çevre Değişkenleri (.env) Yönetimi
Projenin kök dizininde bulunan `.env` dosyası asla Git'e pushlanmaz. Ancak projenin bağımlılıklarını belirten bir `.env.example` dosyası güncel tutulmalıdır.

### Önemli Değişken Grupları:
- **Altyapı:** `DATABASE_URL`, `REDIS_URL`, `PORT`
- **Auth:** `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`
- **Depolama:** `R2_ACCESS_KEY`, `R2_SECRET`, `R2_BUCKET`, `VITE_CDN_URL`
- **API:** `NETGSM_USER`, `NETGSM_PASS`, `IYZICO_KEY`, `IYZICO_SECRET`
- **İzleme:** `SENTRY_DSN` (Sadece prod'da zorunlu)

## 2. Dağıtım Akışı (CI/CD)
Projenin canlıya çıkış süreci şu adımları izler:

1. **Test ve Lint:** GitHub Actions (veya benzeri bir CI) üzerinden `gelistirme.md`'deki tüm kontroller (`pnpm review`) çalıştırılır. Testleri geçemeyen kod canlıya gidemez.
2. **Docker Build:** Uygulama, `.dockerignore` kurallarına uygun olarak optimize edilmiş bir Docker imajına dönüştürülür.
3. **Database Migration:** Canlı sunucuda imaj ayağa kalkmadan önce `prisma migrate deploy` komutu ile veritabanı şemaları güncellenir.
4. **Zero-Downtime:** Traefik sayesinde, yeni konteyner hazır olduğunda trafik eskisinden yenisine kesintisiz aktarılır.

## 3. Güvenlik Notu
Canlı sunucudaki (VPS) `.env` dosyası sadece SSH yetkisi olan yöneticiler tarafından görülebilir olmalıdır. Gizli anahtarlar asla kod içinde (hardcoded) veya loglarda (Sentry dahil) açık metin olarak paylaşılmamalıdır.
