# İzleme, Hata Takibi ve Gözlem (Monitoring)

Canlı ortam (Production) sağlığını korumak ve hatalardan anında haberdar olmak için kurgulanan izleme mimarisidir.

## 1. Teknoloji Seçimi: Sentry (Cloud)
İstemci (Client) ve Sunucu (Server) hatalarını takip etmek için **Sentry Cloud (Ücretsiz Plan)** kullanılır.

**Neden?**
- Aylık 5.000 hataya kadar ücretsizdir.
- VPS kaynaklarını (RAM/CPU) tüketmeden harici platformda log tutar.

## 2. Ortam Kısıtlaması (SADECE Production)
Sentry entegrasyonu **KESİNLİKLE** sadece canlı ortamda (`NODE_ENV === 'production'`) aktif olmalıdır.

- **Development (Geliştirme):** Hatalar terminale ve tarayıcı konsoluna yazılmalı, Sentry'ye veri gönderilmemelidir.
- **Local:** Geliştiriciler yerelde Sentry DSN tanımlamak zorunda değildir.

## 3. Çalışma Prensibi ve Hata Yakalama
Sistem hataları `src/features/shared/lib/error-handling.ts` içindeki **AppError** yapısıyla yönetilir.

- **Otomatik Yakalama:** TanStack Start üzerindeki global Error Boundary ve middleware yapıları istisnaları otomatik Sentry'ye raporlar.
- **Manuel Raporlama:** Kritik iş mantığı hatalarında (Örn: Iyzico ödeme hatası) `Sentry.captureException(e)` ile manuel kayıt atılır.

## 4. Kullanıcı Mahremiyeti (PII)
Sentry'ye gönderilen raporlarda müşterilerin hassas verileri (Şifre, Kredi Kartı No, TCKN vb.) temizlenmelidir. Sentry üzerinde bu alanların maskelenmesi zorunludur.
