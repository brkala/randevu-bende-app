# Frontend ve İş Mantığı (Business Logic) Standartları

Bu döküman; giriş kanalları, yetkilendirme akışı ve anonim randevu güvenliği kurallarını içerir.

## 1. Giriş Kanalları ve Yönlendirme
Sistem "Link Temelli" büyüme stratejisi izler.

- **QR ve Paylaşım Linkleri:** Müşteriler `randevubende.app/s/[dukkan-slug]` linkiyle doğrudan dükkan sayfasına gelir.
- **Query Karşılaması:** URL'de `?workerId=...` parametresi varsa, randevu ekranında o çalışan otomatik seçilir.
- **Genel Giriş:** Arama çubuğu veya "Yakınımdaki Mağazalar" üzerinden dükkan bulunabilir.

## 2. Kullanıcı Rolleri ve Üyelik Akışı
- **Müşteriler:** Kendi hesaplarını oluşturur (Better Auth).
- **Dükkan Sahipleri (Owners):** İşletme hesabı açar ve paket satın alır.
- **Çalışanlar (Staff/Workers):** Kendi başlarına üye olamaz. Dükkan sahipleri tarafından "E-posta veya Telefon" ile eklenir.
- **Süper Admin:** Veritabanında ayrı tabloda tutulur.

## 3. Anonim (Üye Olmadan) Randevu ve Güvenlik
Kullanıcı deneyimini hızlandırmak için üye olmadan randevu imkanı sunulur; sıkı güvenlik denetimine tabidir.

### SMS Doğrulama Mantığı:
- **Bilinen Numara:** Telefon numarası dükkan kayıtlarında varsa **SMS OTP istenmez**, randevu anında onaylanır.
- **Yeni Numara:** Numara dükkan için yeniyse, spam engellemek için **SMS OTP doğrulaması** zorunludur.

### Spam ve Bot Koruması:
- **CSRF Token:** Her form isteği benzersiz token ile korunur.
- **Honeypot Field:** Botların dolduracağı, kullanıcıların görmeyeceği gizli alanlar ile engelleme yapılır.
- **IP Başına Limit:** Aynı IP üzerinden günlük randevu sayısı (Örn: Max 3) kısıtlanır.
- **Rate Limiting:** Global `guvenlik.md` kuralları geçerlidir.

## 4. Süper Admin Panel Güvenliği
Süper admin paneline (`/admin/*` rotası) standart login ekranlarından ulaşılamaz.

- **Domain Tahsisi:** Süper admin paneli sadece `SUPERADMIN_DOMAIN` (Örn: `yonetim.randevubende.app`) üzerinden gelen isteklere yanıt verir.
- **Uygulama:** Middleware seviyesinde `request.headers.host` kontrolü yapılır. Domain eşleşmezse 404 döner.
