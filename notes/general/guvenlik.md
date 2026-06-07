# Güvenlik, Rate-Limiting ve WAF Özellikleri

Müşteriye Yönelik Saldırıları Engelleme prensibi gereği, maddi kayba yol açabilecek public API rotalarında sıkı kısıtlamalar kurgulanır.

## 1. Hedefli API Sınırlandırması (Rate-Limiting)
Aşağıdaki TanStack Server Fonksiyonları (`createServerFn`) KESİNLİKLE Rate-Limiter sarmalayıcısı (Wrapper) olmadan canlıya alınamaz:
- `sendOtpWhatsApp` (Telefona giriş kodu gönderme)
- `verifyOtp` (Kodu doğrulama)
- `createAppointment` (Dışarıdan anonim/ziyaretçi randevusu girme)

## 2. Redis Temelli Kısıtlama Mimarisi (Upstash/Redis)
Bot saldırılarını NodeJS sunucusunu kilitlemeden savuşturmak için Rate Limit işlemi bellek tabanlı (In-Memory / Redis) yapılmak zorundadır:

**Örnek Kurallar:**
*   **IP Adresi Kuralı:** Bir IP adresi son 1 dakika içinde en fazla 3 OTP (WhatsApp) isteği atabilir. Bir IP adresi günlük en fazla **3 başarılı randevu** alabilir. Limiti aşanın sonraki istekleri 15 dakika boyunca **Redis Level**'de reddedilir.
*   **Honeypot & CSRF:** Üye olmadan alınan randevu formlarında, görünmez form alanları (Honeypot) ve her istekte değişen CSRF token doğrulaması zorunludur.
*   **Telefon Numarası Kuralı:** Farksız IP'lerden dağıtık saldırı gelse bile, belirli bir Telefon Numarası ardışık çok istek atarsa numara geçici kara listeye alınır.

## 3. Reverse Proxy (Traefik WAF) Savunması
Traefik; kötü niyetli User-Agent'ları, Postman botlarını veya dDOS çöp isteklerini NodeJS (RandevuBende API) seviyesine ulaşmadan TCP seviyesinde engellemek üzere yapılandırılır.

## Yapay Zeka (AI) İçin Geliştirme Yönergesi
Bir OTP doğrulama veya dışarıya açık ödeme senaryosu yazarken:
1. `params` (Telefon numarası, TCKN vs) ile Zod doğrulaması kur.
2. DB sorgusuna geçmeden önce veritabanını yormamak için Redis-Limiter sorgusunu yap.

## 4. Çevre Değişkeni Güvenliği (Environment Secrets)
Kod içinde sihirli kodlar veya API anahtarları açıkta bırakılmaz.
- **Birim Kontrol:** Hassas kontroller (Örn: `isWhatsAppMagicCode`) tek bir utility fonksiyon aracılığıyla ve mutlaka `NODE_ENV !== 'production'` şartıyla yapılır.
- **Linter Guard:** Biome `noProcessEnv` kuralı ile sırlar "Merkezi Gateway" dışında hiçbir yerde okunamaz.
