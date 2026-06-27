# Katalog, Fotoğraf ve Yorum Akışı

Appointment sonrası foto çekme, müşteri yorumu alma ve haftalık katalog üretimi.

---

## 1. Temel Akış

```
Appointment.status → completed
  → Berber modal: "Foto çek?"
    → EVET: Kamera → R2 → DB
    → HAYIR: kapat
  → Foto varsa:
    → Dükkan vitrinine düşer
    → WhatsApp yorum linki gider
    → Yorum gelirse fotoğrafa bağlanır
  → Cron: son 7 gün → katalog
```

---

## 2. Fotoğraf Yükleme (Storage)

Hedef: **Cloudflare R2** (S3 uyumlu)

### Akış:

1. Berber "Çek" → `navigator.mediaDevices.getUserMedia` ile kamera açılır
2. `canvas.toBlob('image/webp')` → webp = küçük boyut
3. `createServerFn` → `getPresignedUploadUrl` → R2'den imzalı URL
4. Blob imzalı URL'ye PUT (sunucuya uğramaz)

### Dosya yolu:

```
shops/{shopId}/gallery/{appointmentId}_{timestamp}.webp
```

### Prisma modeli:

```prisma
model ShopGalleryImage {
  id             String   @id @default(uuid(7))
  shopId         String
  appointmentId  String
  employeeId     String?
  imageKey       String
  caption        String?
  isApproved     Boolean  @default(true)

  deletedAt DateTime?
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt

  @@map("shop_gallery_images")
}
```

### Kısıtlar:

- Max 1 foto/appointment
- Sadece randevuyu yapan çalışan veya dükkan sahibi çekebilir
- Boyut limiti: 5MB (webp ile 200-500KB)

---

## 3. WhatsApp Yorum Linki

Foto yüklendiğinde **BullMQ job** kuyruğa atılır.

### Job: `sendReviewRequest`

- Worker: `features/appointment/appointment.worker.ts`
- Trigger: Foto R2'ye başarılı yükleme
- Delay: 30dk (müşteri evine varmış olsun)

### WhatsApp Template (Utility):

```
"Merhaba {ad}, {berber} bugünkü tıraşından foto paylaştı.
Görmek ve yorum yapmak için: {link}

Randevu Bende"
```

### Link:

```
https://randevubende.app/s/{shopSlug}/review/{appointmentId}
```

### Review sayfası:

- Foto büyük gösterim
- Yıldız rating (1-5)
- Yorum inputu + Gönder
- Login zorunlu değil (anonim + telefon doğrulama opsiyonel)

---

## 4. Haftalık Katalog (BullMQ Cron)

### Job: `generateWeeklyCatalog`

- Schedule: Her Pazartesi 03:00
- Worker: `features/catalog/catalog.worker.ts`
- Kapsam: Son 7 gün `ShopGalleryImage` kayıtları

### Katalog JSON (Redis cache):

```json
{
  "shopId": "...",
  "week": "2026-19",
  "year": 2026,
  "title": "Ahmet Usta - Mayıs 1. Hafta",
  "entries": [
    {
      "imageUrl": "https://cdn.../abc.webp",
      "caption": "Katlı güncel kesim",
      "employeeName": "Ahmet",
      "date": "2026-05-04",
      "reviews": [
        { "rating": 5, "comment": "Harika oldu", "customerName": "Mehmet" }
      ]
    }
  ]
}
```

### URL:

`/s/{shopSlug}/katalog/{yil}/{hafta}`

- SSG/ISR ile sunulur
- Her katalog ayrı URL → SEO

---

## 5. Feature Yapısı

```
src/features/catalog/
├── components/
│   ├── gallery-upload-modal.tsx    (foto çekme modalı)
│   ├── review-form.tsx             (yorum formu)
│   └── weekly-catalog.tsx          (katalog görüntüleyici)
├── catalog.schemas.ts
├── catalog.server.ts
├── catalog.functions.ts
├── catalog.queries.ts
├── catalog.jobs.ts                 (BullMQ producer)
├── catalog.worker.ts               (cron + worker)
└── catalog.types.ts
```

Foto yükleme için mevcut `storage` feature'ı kullanılır.

---

## 6. Özet Akış

```
Appointment.completed
  → gallery-upload-modal.tsx
    → canvas.toBlob('image/webp')
    → createServerFn → getPresignedUploadUrl
    → PUT to R2
    → createServerFn → DB.save (ShopGalleryImage)
  → BullMQ: sendReviewRequest (30dk delay)
    → WhatsApp API
  → Müşteri link → review sayfası
    → createServerFn → review.save
  → Cron (Pazartesi 03:00): generateWeeklyCatalog
    → 7 gün topla → JSON cache → sitede yayınla
```
