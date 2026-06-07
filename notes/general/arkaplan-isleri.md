# Arka Plan İşleri ve Kuyruk (BullMQ) Mimarisi

Zamanlanmış görevler (Cron) veya uzun süren işlemler (SMS gönderimi, raporlama vb.), ana NodeJS sunucusunun yanıt hızını düşürmemek için BullMQ ile arka planda yönetilir.

## 1. "Sıfır Global" (Zero-Global) Yaklaşımı
İş (Job) mantığı tek bir klasörde toplanmaz. Her iş, hizmet ettiği özelliğin (Feature) içine gömülerek dikey dilimlenir.

## 2. Dosya Yapısı ve Görev Paylaşımı
Bir özellik (feature) içinde kuyruk yapıları şu dosyalarla yönetilir:

- `[özellik].jobs.ts` (Producer): Kuyruğa iş ekleyen, iş isimlerini ve veri tiplerini tanımlayan dosyadır. UI veya Server Function'lar bu dosyayı çağırarak işi sıraya atar.
- `[özellik].worker.ts` (Processor/Worker): Kuyruktaki işi alıp asıl işlemi (Örn: SMS gönderme API tetikleme) gerçekleştiren dosyadır.

**Örnek (src/features/appointment/):**
- `appointment.jobs.ts`: "24 saat kala hatırlatıcı kur" komutu.
- `appointment.worker.ts`: Vakti geldiğinde hatırlatıcıyı çalıştıran motor.

## 3. Bağlantı Yönetimi
Tüm özelliklerdeki Worker'lar aynı Redis bağlantısını paylaşmalıdır. Redis bağlantı ayarları merkezi olarak `features/shared/lib/redis.ts` (veya ilgili DB feature'ı) üzerinden tek bir instance olarak çekilir.

## 4. Hata Yönetimi
Arka planda patlayan bir iş sunucuyu çökertmemelidir.
- Her `@Processor` içinde `try-catch` bloğu zorunludur.
- Kritik hatalar (Örn: Email API'sinin yanıt vermemesi) Sentry'ye (`captureException`) raporlanmalıdır.
- BullMQ'nun `attempts` (yeniden deneme) özelliği 3 katlı olarak yapılandırılmalıdır.
