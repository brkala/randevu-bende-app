# 🗺️ Adım Adım Uygulama Yol Haritası

Bu döküman, "Randevu Bende" projesinin teknik iskeletinin kurulmasından canlıya çıkışına kadar izlenecek operasyonel adımları içerir. Bu bir kodlama rehberidir, kurulum adımları manuel veya asistan eşliğinde bu sırayla yapılmalıdır.

---

## 🏗️ 1. Aşama: İskeletin Kurulması (Scaffolding)
Her şeyden önce yazılımın üzerinde yükseleceği zemin hazırlanır.
- **TanStack Start Başlatma:** Proje TypeScript ve pnpm ile initialize edilir.
- **Lint & Format:** Biome kurulumu yapılır, `gelistirme.md` kuralları sisteme tanıtılır.
- **Dosya Hiyerarşisi:** `src/features` ve `src/routes` dizinleri Zero-Global mimarisine göre fiziksel olarak açılır.

## 2. Aşama: Altyapı Bileşenlerinin Eklenmesi
Uygulamanın ruhunu oluşturacak "İzole Edilmiş" altyapı servisleri kurulur.
- **Veritabanı (Prisma):** Şema oluşturulur, `shopId`, `Soft-Delete` ve Çalışan/Admin tablo ayrımları yapılır.
- **Depolama (Cloudflare R2):** Medya yükleme ve gösterme altyapısı kurulur.
- **Kimlik Doğrulama (Better Auth):** Müşteri ve Owner rollerine göre yetki sistemi kurulur. Çalışanların eklenme mantığı kurgulanır.
- **Süper Admin Güvenliği:** Domain bazlı (ENV) rota kısıtlama middleware'i hazırlanır.

## 3. Aşama: Çekirdek Randevu Motoru ve Güvenlik
Müşterinin dükkana ulaşma ve randevu alma "Flow"u kodlanır.
- **Link & QueryParam:** QR linklerinden gelen `workerId` parametresini yakalayan loader mantığı.
- **Anonim Randevu Akışı:** Telefon rehberi kontrolü (Bilinen numara bypass) ve SMS OTP entegrasyonu.
- **Bot Savunması:** Honeypot, CSRF ve IP bazlı randevu limiti katmanları.
- **Sarı Slot & Rezervasyon:** Redis tabanlı geçici kilitleme mantığı.

## 4. Aşama: Panellerin İnşası
Altyapı hazır olduktan sonra kullanıcıların göreceği "Arayüzler" (Paneller) yazılır.

### A. Müşteri (Rezervasyon) Paneli
- **Esnaf Listeleme:** QR ile gelmeyenler için dükkan bulma/arama ekranları.
- **Randevu Akışı:** Üye veya anonim olarak randevu tamamlama süreçleri.

### B. Esnaf/Dükkan Sahibi (Yönetim) Paneli
- **Takvim & Personel:** Dükkan sahibinin çalışan eklediği, maaş/mesai tanımı yaptığı ekranlar.

### C. Süper Admin (Sistem) Paneli
- **Spesifik Domain:** Sadece tanımlı domain üzerinden erişilebilen yönetim ekranı.

## 📧 5. Aşama: Bildirimler ve Dış Servisler
- **SMS & Email:** Randevu onay ve hatırlatma mesajları (NetGSM / Resend) asenkron workers (BullMQ) ile bağlanır.
- **Ödeme Entegrasyonu:** Dükkan sahiplerinden ücret tahsilatı için Iyzico abonelik akışı kurulur.

## 🚀 6. Aşama: Test ve Dağıtım (Deploy)
- **E2E Testler:** Kritik randevu akışları Playwright ile test edilir.
- **VPS Dağıtımı:** Dockerize edilen uygulama Ubuntu sunucuya (Traefik arkasına) taşınır.
