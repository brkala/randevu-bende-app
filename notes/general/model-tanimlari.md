# Randevu Bende Model Tanımları

Bu döküman yetkilendirme modelleri dışındaki şemaları tanımlar. Yetkiler için [yetkiler.md](./yetkiler.md) dosyasına bakın.

**(Not: Tüm tablolarda varsayılan olarak `id`, `created_at` ve `updated_at` mevcuttur.)**

## Dükkan / Shop
- title
- description
- slug (Dükkan URL linki, örn: /dukkan-adi)
- tax_number
- address
- phone
- logo
- owner_id
- is_active (boolean)

## Dükkan Resimleri / Shop Images
- shop_id
- image (URL / Path)
- order (Görsel sırası - integer)

## Dükkan Çalışma Saatleri / Shop Working Hours
- shop_id
- day (enum 7 days)
- start_time
- end_time
- is_closed (boolean)

## Dükkan Tatil Günleri / Shop Holiday Days (Örn: Bayramlar)
- shop_id
- title (Tatil sebebi, örn: "Kurban Bayramı")
- start_datetime
- end_datetime

## Dükkan Ayarları / Shop Settings
- shop_id
- key (enum: randevu_araligi, onay_mekanizmasi vb.)
- value (json / string)

## Hizmet / Service
- shop_id
- title (Hizmet Adı, örn: Saç Kesimi)
- description
- duration_minutes (Süre - integer)
- price (Fiyat - decimal)
- is_active (boolean)

## Çalışan Yetkinlikleri / Employee Service Pivot
*(Çalışan-Hizmet eşleşmesi)*
- employee_id (Çalışan User ID)
- service_id (Hizmet ID)
- is_active (boolean)

## Müşteri Rehberi / Customer Directory (CRM)
- shop_id
- phone (Telefon)
- first_name
- last_name
- note (Dükkana özel müşteri notu)

## Kara Liste / Blacklist
- shop_id (Dükkana özel kara liste)
- phone (Engellenen Numara)
- reason (Engellenme Sebebi - text)

## Global Telefon Gizliliği / Global Opt-Out
*(Müşteri numarasının sistemden tamamen çıkarılması)*
- phone (Numaraya hiçbir dükkan ekleme yapamaz veya mesaj gönderemez)
- reason (İptal sebebi)

## Randevu / Appointment
- shop_id
- customer_id (Kullanıcı girişliyse id, walk-in ise null)
- employee_id (Çalışan)
- start_datetime
- end_datetime (Hizmet sürelerine göre hesaplanır)
- status (enum: pending, approved, cancelled, completed, no_show)
- total_price (Randevu anındaki toplam fiyat - decimal)
- customer_note (Müşteri notu)
- internal_note (Dükkan/Çalışan özel notu)

## Randevu Hizmetleri / Appointment Service Items
*(Randevudaki hizmet kalemleri)*
- appointment_id
- service_id
- price (Fatura doğruluğu için randevu anındaki anlık fiyat)

## Değerlendirmeler / Reviews
- appointment_id
- shop_id
- employee_id
- customer_id
- rating (1-5 yıldız)
- comment (Müşteri Yorumu)
- owner_reply (İşletme Cevabı)
- is_flagged (Şikayet edildi mi? - boolean)

## Çalışan Tatil Günleri / Employee Time Off (Vardiya / İzin)
- employee_id
- start_datetime
- end_datetime
- reason (Hastalık, Yıllık İzin vb.)

## Abonelik Planları / Subscription Plans (Sistem için)
- title (Örn: "Premium Plan")
- price (Abonelik Ücreti)
- features (json - Paket özellikleri)

## Dükkan Aboneliği / Shop Subscriptions
- shop_id
- plan_id
- start_date
- end_date
- status (enum: active, expired, cancelled)

## Bildirimler / Notifications
- user_id (Alıcı)
- title
- message
- type (enum: sms, in_app, email)
- is_read (boolean)
