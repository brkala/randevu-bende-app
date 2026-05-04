# Database (Veritabanı) ve Multi-Tenant (İzolasyon) Kuralları

"Randevu Bende" projesi B2B (Çoklu İşletme / Multi-Tenant) mimarisine sahip bir SaaS platformudur. Bu nedenle veri güvenliği ve işletme izolasyonu en üst düzey (KRİTİK) kuraldır.

## Veri Sızıntısı Tehlikesi
Bir yapay zeka asistanı veya geliştirici, veritabanından randevu listesi çekerken sadece `prisma.appointment.findMany()` komutunu yazarsa, **Sistemdeki A kuaförünün müşterileri, B kuaförünün ekranında gözükür.** Bu bir KVKK ihlali ve veri sızıntısıdır.

## 1. Zorunlu `shopId` (Tenant) Filtresi
Prisma üzerinden yapılan **TÜM** veri çekme (read), güncelleme (update) ve silme (delete) sorgularına, sorguyu yapan oturumun (Session) ait olduğu işletme ID'si (`shopId` veya `tenantId`) zorunlu olarak eklenmelidir.

*❌ Yanlış (Veri sızdırır):*
```typescript
await prisma.customer.findUnique({
  where: { id: input.customerId }
});
```

*✅ Doğru (Sadece o işletmenin müşterisiyse getirir):*
```typescript
await prisma.customer.findFirst({
  where: { 
    id: input.customerId, 
    shopId: session.user.shopId // Güvenlik Kalkanı
  }
});
```

## 2. Prisma Client Extension (Gelişmiş İzolasyon)
Sistemin insan (veya AI) hatasına kurban gitmemesi için, Prisma başlatıcısı (`src/features/database/lib/client.server.ts`), Prisma'nın **`$extends`** özelliği kullanılarak Row-Level Security (Satır Bazlı Güvenlik) yapısına sokulmalıdır. 

### TanStack Start Middleware Akışı
`shopId` bilgisinin Prisma context'ine nasıl besleneceği şu zincir üzerinden gerçekleşir:

1. **Better Auth Middleware:** Her istekte kullanıcının oturumu doğrulanır ve `session.user.shopId` elde edilir.
2. **Dinamik Extension:** TanStack `createMiddleware` içerisinde, her istek için anlık (on-the-fly) bir Prisma Client üretilir. Bu istemci, `$extends` ile tüm sorgulara otomatik olarak o anki `shopId` filtresini enjekte eder.
3. **Context Injection:** Bu sarmalanmış (bounded) istemci, TanStack Start'ın `context` objesine `db` adıyla eklenir.

```typescript
// Örnek Middleware Mantığı
export const authMiddleware = createMiddleware().server(async ({ next }) => {
  const session = await getSession(); // Better Auth
  const tenantDb = globalDb.$extends({
    query: {
      $allModels: {
        async $allOperations({ model, args, query }) {
          // Modelde shopId varsa zorla ekle
          args.where = { ...args.where, shopId: session.user.shopId };
          return query(args);
        }
      }
    }
  });
  return next({ context: { db: tenantDb } });
});
```

### Kullanım Kuralı (KRİTİK)
Geliştiriciler ve AI ajanları, `createServerFn` içerisinde asla global `prisma` istemcisini doğrudan import etmemelidir. Daima `context.db` referansını kullanmalıdır. Bu sayede izolasyon bypass edilemez hale gelir.

> **Uyarı:** Bu kuralın esnediği / by-pass edilebildiği tek senaryo, sistemdeki mutlak yöneticilerin (Süper Admin) istatistikleri okuduğu global sorgulardır. Normal satıcı (Kuaför) ve çalışan (Personel) rotalarında izolasyon bypass edilemez.

## 3. Yumuşak Silme (Soft-Delete) Mekanizması
"Altın Kurallar" gereği sistemde veriler fiziksel olarak silinmez, `isDeleted` veya `deletedAt` alanları kullanılarak gizlenir.

- **Otomatik Filtreleme:** Tıpkı `shopId` izolasyonunda olduğu gibi, Prisma Extension (`$extends`) kullanılarak tüm `find` sorguları otomatik olarak `deletedAt: null` filtresiyle sarmalanır.
- **Geliştirici Sorumluluğu:** Geliştiriciler veriyi silmek istediklerinde `db.model.delete()` yerine `db.model.update({ data: { deletedAt: new Date() } })` metodunu kullanmalıdır. Extension, silinmiş verilerin kazara listelenmesini otomatik olarak engeller.
