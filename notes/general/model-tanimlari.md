# Randevu Bende Model Tanımları

Bu döküman üye tiplerini(Admin, Customer, Owner, Employee, Manager) içermese de bunlarda model olarak görülmelidir.
Bu tipleri görmek için [yetkiler.md](./yetkiler.md) dosyasına bakın.

**(Not: Tüm tablolarda varsayılan olarak `id`, `created_at` ve `updated_at` (oluşturulma/güncellenme tarihi) olduğu varsayılmıştır.)**

## Dükkan / Shop
- title
- description
- slug (URL dostu dükkan linki için, örn: /dukkan-adi)
- tax_number
- address
- phone
- logo
- owner_id
- is_active (Dükkanın sistemde aktif olup olmadığı - boolean)

## Dükkan Resimleri / Shop Images
- shop_id
- image (URL / Path)
- order (Resmin sırası - integer, örn: 1, 2, 3...)

## Dükkan Çalışma Saatleri / Shop Working Hours
- shop_id
- day (enum 7 days)
- start_time
- end_time
- is_closed (O gün dükkan kapalı mı? - boolean)

## Dükkan Tatil Günleri / Shop Holiday Days (Örn: Bayramlar)
- shop_id
- title (Tatil sebebi, örn: "Kurban Bayramı")
- start_datetime
- end_datetime

## Dükkan Ayarları / Shop Settings
- shop_id
- key (enum: randevu_araligi, onay_mekanizmasi vs.)
- value (json / string)

## Hizmet / Service
- shop_id
- title (Hizmet Adı, örn: Saç Kesimi)
- description
- duration_minutes (Süre - integer)
- price (Fiyat - decimal)
- is_active (Hizmeti kapatabilmek için - boolean)

## Çalışan Yetkinlikleri / Employee Service Pivot 
*(Hangi çalışan hangi hizmetleri verebiliyor)*
- employee_id (Çalışan User ID)
- service_id (Hizmet ID)
- is_active (Patron bu hizmeti çalışana sonradan kapatabilir - boolean)

## Müşteri Rehberi / Customer Directory (CRM)
- shop_id
- phone (Telefon)
- first_name
- last_name
- note (Dükkanın müşteriye özel notu, "Örn: Saç boyası 4 numara")

## Kara Liste / Blacklist
- shop_id (Sadece ilgili dükkanın kara listesi)
- phone (Engellenen Numara)
- reason (Engellenme Sebebi - text)

## Global Telefon Gizliliği / Global Opt-Out
*(Müşterinin numarasını sistemden tamamen silip bir daha eklenmemesini istediği ekran için)*
- phone (Sistemde hiçbir dükkan bu numarayı bir daha ekleyemez / mesaj atamaz)
- reason (İsteğe bağlı iptal sebebi)

## Randevu / Appointment
- shop_id
- customer_id (Kullanıcı girişliyse id'si, walk-in randevu ise null olabilir)
- employee_id (Randevuyu alacak çalışan)
- start_datetime 
- end_datetime (Seçilen hizmetlerin toplam süresine göre hesaplanır)
- status (enum: pending, approved, cancelled, completed, no_show[gelmedi])
- total_price (Randevu anındaki toplam fiyat buraya kazınır - decimal)
- customer_note (Müşterinin randevu alırken yazdığı not)
- internal_note (Sadece dükkan/çalışanın gördüğü not)

## Randevu Hizmetleri / Appointment Service Items 
*(Bir randevuda birden fazla hizmet alınabilir, örn: Saç + Sakal)*
- appointment_id
- service_id
- price (Hizmetin randevu alındığı anki fiyatı, sonradan sistemde fiyat değişirse faturayı bozmamak için)

## Değerlendirmeler / Reviews
- appointment_id
- shop_id
- employee_id
- customer_id
- rating (1-5 arası yıldız)
- comment (Müşterinin Yorumu)
- owner_reply (Patronun/Şefin Yorumu - Cevabı)
- is_flagged (Adminin incelemesi için dükkan tarafından şikayet edildi mi? - boolean)

## Çalışan Tatil Günleri / Employee Time Off (Vardiya / İzin)
- employee_id
- start_datetime
- end_datetime
- reason (Hastalık, Yıllık İzin vb.)

## Abonelik Planları / Subscription Plans (Sistem için)
- title (Örn: "Premium Plan", "Starter Plan")
- price (Aylık/Yıllık Ücret)
- features (json - Paket özellikleri)

## Dükkan Aboneliği / Shop Subscriptions
- shop_id
- plan_id
- start_date
- end_date
- status (enum: active, expired, cancelled)

## Bildirimler / Notifications
- user_id (Kime gönderildiği)
- title
- message
- type (enum: sms, in_app, email)
- is_read (Okundu mu? - boolean)
