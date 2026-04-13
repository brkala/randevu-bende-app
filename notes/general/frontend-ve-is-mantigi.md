# Frontend ve İş Mantığı (Business Logic) Standartları

Bu döküman, projenin giriş kanalları, kullanıcı yetkilendirme akışı ve anonim randevu güvenliği ile ilgili spesifik kuralları içerir.

## 1. Giriş Kanalları ve Yönlendirme
Sistem "Link Temelli" bir büyüme stratejisi izler.

- **QR ve Paylaşım Linkleri:** Müşteriler genellikle `randevubende.app/s/[dukkan-slug]` gibi linklerle doğrudan dükkan sayfasına gelir.
- **Query Karşılaması:** Eğer URL'de `?workerId=...` parametresi varsa, randevu ekranında o çalışan otomatik olarak seçili gelir.
- **Genel Giriş:** Link ile gelmeyen kullanıcılar ana sayfadaki bannerlar, arama çubuğu veya "Yakınımdaki Mağazalar" üzerinden dükkan bulabilir.

## 2. Kullanıcı Rolleri ve Üyelik Akışı
- **Müşteriler:** Kendi hesaplarını oluşturabilir (Better Auth).
- **Dükkan Sahipleri (Owners):** İşletme hesabı açabilir ve paket satın alabilir.
- **Çalışanlar (Staff/Workers):** Kendi başlarına üye olamazlar. Sadece dükkan sahipleri tarafından "E-posta veya Telefon" ile sisteme dahil edilirler.
- **Süper Admin:** Veritabanında tamamen ayrı bir tabloda tutulur.

## 3. Anonim (Üye Olmadan) Randevu ve Güvenlik
Kullanıcı deneyimini hızlandırmak için üye olmadan randevu alma imkanı sunulur; ancak bu durum sıkı güvenlik denetimlerine tabidir.

### SMS Doğrulama Mantığı:
- **Bilinen Numara:** Eğer girilen telefon numarası, dükkanın daha önceki kayıtlarında/rehberinde mevcutsa **SMS OTP istenmez**, randevu anında onaylanır.
- **Yeni Numara:** Numara dükkan için yeniyse, spam engellemek adına **SMS OTP doğrulaması** zorunludur.

### Spam ve Bot Koruması:
Anonim formlarda aşağıdaki katmanlar "Honeypot" prensibiyle çalışır:
- **CSRF Token:** Her form isteği benzersiz bir token ile korunur.
- **Honeypot Field:** Botların dolduracağı ancak kullanıcıların görmeyeceği gizli alanlar ile otomatik engelleme yapılır.
- **IP Başına Limit:** Aynı IP adresi üzerinden gün içinde alınabilecek randevu sayısı (Örn: Max 3) kısıtlanır.
- **Rate Limiting:** Global `guvenlik.md` kuralları geçerlidir.

## 4. Süper Admin Panel Güvenliği
Süper admin paneline erişim (`/admin/*` rotası), standart dükkan veya müşteri login ekranlarından ulaşılamaz.

- **Domain Tahsisi:** Süper admin paneli sadece `SUPERADMIN_DOMAIN` (Örn: `yonetim.randevubende.app`) üzerinden gelen isteklere yanıt verir.
- **Uygulama:** Middleware seviyesinde `request.headers.host` kontrolü yapılır. Domain eşleşmezse rota 404 döner.
