# Güvenlik, Rate-Limiting ve WAF Özellikleri

Projenin "Altın Kuralları" arasında yer alan "Müşteriye Yönelik Saldırıları Engelleme" prensibi gereği, özellikle WhatsApp (WhatsApp Business API) gibi maddi kayba (Bütçe tükenmesine) yol açabilecek public API rotalarında sıkı kısıtlamalar kurgulanır.

## 1. Hedefli API Sınırlandırması (Rate-Limiting)
Aşağıdaki TanStack Server Fonksiyonları (`createServerFn`) KESİNLİKLE bir Rate-Limiter sarmalayıcısı (Wrapper) olmadan canlıya alınamaz:
- `sendOtpWhatsApp` (Telefona giriş kodu gönderme)
- `verifyOtp` (Kodu doğrulama)
- `createAppointment` (Dışarıdan anonim/ziyaretçi randevusu girme)

## 2. Redis Temelli Kısıtlama Mimarisi (Upstash/Redis)
Sistem zaten `mimari.md` gereğince Redis barındırmaktadır. Herhangi bir bot saldırısını NodeJS sunucusunu kilitlemeden savuşturmak için Rate Limit işlemi bellek tabanlı (In-Memory / Redis) yapılmak zorundadır:

**Örnek Kurallar:**
*   **Aynı IP Adresi Kuralı:** Bir IP adresi son 1 dakika içinde en fazla 3 defa OTP (WhatsApp) isteği atabilir. Ayrıca bir IP adresi gün içinde en fazla **3 adet başarılı randevu** alabilir. Limiti aşan IP'nin sonraki istekleri 15 dakika boyunca **Redis Level**'de reddedilir.
*   **Honeypot & CSRF:** Üye olmadan alınan randevu formlarında bot saldırılarını engellemek için görünmez form alanları (Honeypot) ve her istekte değişen CSRF token doğrulaması zorunludur.
*   **Aynı Telefon Numarası Kuralı:** Sistem farksız IP'lerden dağıtık bir saldırı alsa bile, spesifik bir Telefon Numarası ardışık şekilde çok kez istek atarsa, numara geçici kara listeye alınır. (Müşteri rahatsız edilmemeli kuralı).

## 3. Reverse Proxy (Traefik WAF) Savunması
Proje mimarisinde yer alan Traefik, sadece gelen HTTP isteklerini yönlendirmek için (Proxy) değil; bilinen kötü niyetli User-Agent'ları, Postman botlarını veya dDOS tarzı yüksek miktardaki çöp istekleri NodeJS (RandevuBende API) seviyesine hiç ulaştırmadan TCP seviyesinde çöpe atmak için yapılandırılır.

## Yapay Zeka (AI) İçin Geliştirme Yönergesi
Bir OTP doğrulama veya dışarıya açık ödeme senaryosu yazarken:
1. İlk önce `params` (Telefon numarası, TCKN vs) ile Zod doğrulaması kur.
2. DB sorgusuna ("Bu numara üye mi?" vs) GEÇMEDEN ÖNCE veritabanını yormamak için Redis-Limiter sorgunu yap.
## 4. Çevre Değişkeni Güvenliği (Environment Secrets)
Kodun içinde "Sihirli Kodlar" veya API anahtarları gibi sırlar asla doğrudan açıkta bırakılmaz.
- **Birim Kontrol:** Hassas kontroller (Örn: `isWhatsAppMagicCode`) sadece tek bir utility fonksiyon aracılığıyla ve mutlaka `NODE_ENV !== 'production'` şartıyla yapılır.
- **Linter Guard:** Biome `noProcessEnv` kuralı ile sırlar "Merkezi Gateway" dışında hiçbir yerde okunamaz.
