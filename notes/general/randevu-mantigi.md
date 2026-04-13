# Randevu Rezervasyon ve Çakışma Yönetimi

Bu döküman, sistemde aynı randevu saatinin iki kişi tarafından alınmasını engellemek ve sunucu yükünü (Websocket vb. kullanmadan) minimumda tutmak için kurgulanan stratejiyi içerir.

## 1. Geçici Kilitleme (Sarı Slot) Mekanizması
Müşteri bir saat dilimine tıkladığında, ödeme veya onay aşamasına geçmeden önce o saat dilimi sistem tarafından **Kısa Süreli (Temporary)** olarak rezerve edilir.

- **Teknoloji:** Bu işlem için veritabanı yorulmaz, **Redis** kullanılır.
- **İşlem:** Müşteri saate tıkladığı an bir TanStack `createServerFn` tetiklenir ve Redis'e `lock:shopId:date:time` anahtarıyla 5-10 dakikalık (TTL) bir kayıt atılır. Bu süre müşterinin iletişim bilgilerini girmesi ve formu onaylaması için yeterlidir.
- **Görünüm:** Diğer kullanıcılar randevu saatlerini listelediğinde; hem veritabanındaki gerçek randevulara hem de Redis'teki geçici kilitlere bakılır. Redis'te kilidi olan saatler arayüzde **"Sarı"** (İşlemde) olarak görünür ve tıklanamaz.

## 2. Çakışma Yönetimi (Conflict Handling)
Eğer iki kullanıcı aynı milisaniyede aynı saate tıklamayı başarırsa (veya sarı slot süresi biterken aynı anda submit ederlerse):

1. **Sunucu Tarafı (Server):** Nihai "Randevu Oluştur" fonksiyonu çalıştığında, veritabanı işlemi (Prisma Transaction) içinde saatin hala boş olduğu **son bir kez** kontrol edilir.
2. **İlk Gelen Kazanır:** Veritabanına kaydı ilk yazdıran randevuyu alır.
3. **Reddedilme ve Yönlendirme:** İkinci gelen kullanıcıya sunucu "Bu saat az önce doldu" hatası döner. 
4. **Frontend Refleksi:** Arayüz (TanStack Router) bu spesifik hatayı yakaladığında kullanıcıya bir Toast mesajı gösterir ve otomatik olarak kullanıcıyı **"Randevu Saat Seçimi"** ekranına geri yönlendirir.

## 3. Neden Bu Yöntem? (Mimari Karar)
- **Bottleneck Engeli:** Canlı bir WebSocket bağlantısı yüz binlerce kullanıcıda sunucuyu kilitleyebilir. Redis ve standart HTTP istekleri (TanStack Query) çok daha hafiftir.
- **Sürtünmesiz UX:** Kullanıcı form doldurma aşamasında saati rezerve kalır, ancak işlemi tamamlamazsa saat otomatik olarak (Redis TTL ile) diğer müşterilere geri açılır.
