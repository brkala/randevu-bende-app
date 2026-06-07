# Database (Veritabanı) ve Multi-Tenant (İzolasyon) Kuralları

Randevu Bende projesi çoklu işletme (Multi-Tenant) mimarisine sahip SaaS platformudur; veri güvenliği ve izolasyon kritiktir.

## Veri Sızıntısı Tehlikesi
Filtresiz sorgu yapılması durumunda farklı dükkanların randevuları birbirine sızar.

## 1. Zorunlu `shopId` (Tenant) Filtresi
Prisma üzerindeki tüm okuma, güncelleme ve silme sorgularına oturumun ait olduğu işletme ID'si (`shopId`) eklenmelidir.

*❌ Yanlış (Veri sızdırır):*
```typescript
await prisma.customer.findUnique({
  where: { id: input.customerId }
});
```

*✅ Doğru (Güvenli):*
```typescript
await prisma.customer.findFirst({
  where: { 
    id: input.customerId, 
    shopId: session.user.shopId
  }
});
```

## 2. Prisma Client Extension (Row-Level Security)
İzolasyon hatalarını önlemek için Prisma başlatıcısı (`src/features/database/lib/client.server.ts`), Prisma **`$extends`** özelliğiyle Row-Level Security yapısına alınır.

### TanStack Start Middleware Akışı
`shopId` Prisma context'ine şu zincirle iletilir:

1. **Better Auth Middleware:** İstekte oturum doğrulanır ve `session.user.shopId` alınır.
2. **Dinamik Extension:** TanStack `createMiddleware` içinde her istek için anlık Prisma Client üretilir ve `$extends` ile tüm sorgulara otomatik `shopId` filtresi eklenir.
3. **Context Injection:** Bu istemci, TanStack Start `context` nesnesine `db` adıyla eklenir.

```typescript
// Örnek Middleware Mantığı
export const authMiddleware = createMiddleware().server(async ({ next }) => {
  const session = await getSession(); // Better Auth
  const tenantDb = globalDb.$extends({
    query: {
      $allModels: {
        async $allOperations({ model, args, query }) {
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
Geliştiriciler ve AI ajanları, `createServerFn` içinde global `prisma` istemcisini doğrudan kullanmamalı, daima `context.db` referansını çağırmalıdır.

> **Uyarı:** Bu kuralın tek istisnası Süper Admin paneli global istatistik sorgularıdır. Satıcı ve çalışan rotalarında bypass edilemez.

## 3. Yumuşak Silme (Soft-Delete) Mekanizması
Veriler fiziksel silinmez, `deletedAt` alanı kullanılarak gizlenir.

- **Otomatik Filtreleme:** Prisma Extension (`$extends`) ile tüm `find` sorguları otomatik olarak `deletedAt: null` filtresiyle sarmalanır.
- **Geliştirici Sorumluluğu:** Silme işlemlerinde `db.model.delete()` yerine `db.model.update({ data: { deletedAt: new Date() } })` kullanılmalıdır.
