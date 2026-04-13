# İzleme, Hata Takibi ve Gözlem (Monitoring)

Sistemin canlı ortamdaki (Production) sağlığını korumak ve oluşan hatalardan (bugs) anında haberdar olmak için kurgulanan izleme mimarisidir.

## 1. Teknoloji Seçimi: Sentry (Cloud)
Uygulamanın hem İstemci (Client) hem de Sunucu (Server) tarafındaki hatalarını takip etmek için **Sentry Cloud (Ücretsiz Plan)** kullanılır. 

**Neden?**
- "Az para çok iş" prensibine uygun olarak aylık 5.000 hataya kadar ücretsizdir.
- VPS kaynaklarını (RAM/CPU) tüketmeden harici bir platformda log tutar.

## 2. Ortam Kısıtlaması (SADECE Production)
Sentry entegrasyonu **KESİNLİKLE** sadece canlı ortamda (`NODE_ENV === 'production'`) aktif olmalıdır.

- **Development (Geliştirme):** Hatalar doğrudan terminale ve tarayıcı konsoluna yazılmalı, Sentry'ye veri gönderilmemelidir. Bu, hem kota israfını önler hem de geliştirme hızını artırır.
- **Local:** Geliştiriciler kendi bilgisayarlarında Sentry DSN anahtarını tanımlamak zorunda değildir.

## 3. Çalışma Prensibi ve Hata Yakalama
Sistemdeki hatalar `src/features/shared/lib/error-handling.ts` içerisinde tanımlanan **AppError** yapısı üzerinden yönetilir. 

- **Otomatik Yakalama:** TanStack Start üzerinde kurulu olan global Error Boundary ve middleware yapıları, yakaladıkları istisnaları (exceptions) otomatik olarak Sentry'ye raporlar.
- **Manuel Raporlama:** Eğer kritik bir iş mantığı hatası (Örn: Iyzico ödeme başarısız ama müşteri bakiyesi düştü gibi ekstrem durumlar) oluşursa, uygulama çökmese bile `Sentry.captureException(e)` ile manuel kayıt atılır.

## 4. Kullanıcı Mahremiyeti (PII)
Sentry'ye gönderilen hata raporlarında, müşterilerin hassas verileri (Şifre, Kredi Kartı No, TCKN vb.) **kesinlikle** temizlenmelidir (Scrubbing). Sentry yapılandırmasında bu alanların maskelenmesi zorunludur.
