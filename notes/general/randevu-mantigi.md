# Randevu Rezervasyon ve Çakışma Yönetimi

Bu döküman, aynı randevu saatinin iki kişi tarafından alınmasını engelleme ve sunucu yükünü minimumda tutma stratejisini içerir.

## 1. Geçici Kilitleme (Sarı Slot) Mekanizması
Müşteri bir saat dilimine tıkladığında, o saat dilimi sistem tarafından **Kısa Süreli (Temporary)** olarak rezerve edilir.

- **Teknoloji:** Bu işlem için veritabanı yerine **Redis** kullanılır.
- **İşlem:** Saate tıklandığı an TanStack `createServerFn` tetiklenir ve Redis'e `lock:shopId:date:time` anahtarıyla 5-10 dakikalık (TTL) kayıt atılır. Bu süre formun onaylanması için yeterlidir.
- **Görünüm:** Randevu saatleri listelenirken veritabanındaki randevulara ve Redis kilitlerine bakılır. Kilitli saatler arayüzde **"Sarı"** (İşlemde) görünür ve tıklanamaz.

## 2. Çakışma Yönetimi (Conflict Handling)
İki kullanıcı aynı anda aynı saati submit etmeye çalışırsa:

1. **Sunucu Kontrolü:** "Randevu Oluştur" çalışırken, veritabanı işlemi (Prisma Transaction) içinde saatin boş olduğu **son kez** kontrol edilir.
2. **İlk Gelen Kazanır:** Veritabanına kaydı ilk yazdıran randevuyu alır.
3. **Reddedilme:** İkinci kullanıcıya sunucu "Bu saat az önce doldu" hatası döner. 
4. **Frontend Refleksi:** Arayüz (TanStack Router) hatayı yakalar, Toast gösterir ve kullanıcıyı **Randevu Saat Seçimi** ekranına yönlendirir.

## 3. Neden Bu Yöntem? (Mimari Karar)
- **Darboğaz Engeli:** Canlı WebSocket bağlantısı yüksek trafikte sunucuyu yorabilir. Redis ve HTTP istekleri (TanStack Query) daha hafiftir.
- **Sürtünmesiz UX:** Form doldurulurken saat rezerve kalır, işlem tamamlanmazsa (Redis TTL ile) diğer müşterilere otomatik geri açılır.
