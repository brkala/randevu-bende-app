# 3. Yaratım Hiyerarşisi (Parent-Child) ve Paylaşılan Veri

İlişkisel veritabanlarındaki "Foreign Key Constraint" hatalarını önlemek ve mantıksal veri bütünlüğünü korumak adına seed işlemlerinde **katı bir hiyerarşi** uygulanmalıdır.

## 1. Üretim Sırası (Parent'tan Child'a)
Seed fonksiyonları şu sırayı takip etmek ZORUNDADIR:
1. **Bağımsız / Kök (Core) Veriler:** Herhangi bir dış tabloya bağlı olmayanlar (Roller, Enum muadilleri, Sistem Parametreleri, Şehir/İlçe listesi).
2. **Kök Entiteler (Root Entities):** Veritabanının ana aktörleri (Kullanıcılar, İşletmeler/Şubeler).
3. **Bağlı Entiteler (Child Entities):** Üstteki nesnelerin ID'lerine muhtaç veriler (Personeller, Hizmetler, ve en son Randevular).

## 2. Prod Seed'in Tüm Ortamlardaki Zorunlu Varlığı
Üretim ortamı (Prod) seeder kurgusu (roller vb.), sadece `NODE_ENV === 'production'` iken çalışmaz. Sistem `development` veya `test` ortamında başlatılsa dahi, mock datalar eklenebilmesi için önce temel "Prod Data" sistemde var olmalıdır. 

Ana `seed.ts` dağıtıcısı şu mantıkta çalışmalıdır:

```typescript
import { seedProductionData } from './prod-seed';
import { seedDevelopmentData } from './dev-seed';

async function main() {
  const env = process.env.NODE_ENV || 'development';
  console.log(`🌱 Seeding başlatıldı. Hedef Ortam: [${env}]`);

  // 1. ZORUNLU: Ortam ne olursa olsun Enum/Sabitler (Prod Data) içeri alınır!
  console.log('⚡ [Core] Sabit Enum ve Sistem Modelleri yazılıyor...');
  const coreData = await seedProductionData();

  // 2. ORTAMA BAĞLI OLARAK EKLENEN FAKE DATALAR
  if (env === 'development' || env === 'test') {
    console.log('🛠 [Dev/Test] Geliştirici/Test mock verileri ekleniyor...');
    // Dev/Test mocklar'ı root'ta üretilen coreData Id'lerine ihtiyaç duyabilir, argüman olarak iletilir.
    await seedDevelopmentData(coreData);
  }

  console.log('🎉 Tüm Seeding İşlemleri Başarıyla Tamamlandı!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding sırasında ölümcül hata (Constraint vb):', e);
    process.exit(1);
  });
```
