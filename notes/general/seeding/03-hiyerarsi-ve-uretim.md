# 3. Yaratım Hiyerarşisi (Parent-Child) ve Paylaşılan Veri

İlişkisel veritabanlarındaki "Foreign Key Constraint" hatalarını önlemek ve mantıksal veri bütünlüğünü korumak adına seed işlemlerinde **katı bir hiyerarşi** uygulanmalıdır.

## 1. Üretim Sırası (Parent'tan Child'a)
Seed fonksiyonları şu sırayı takip etmek ZORUNDADIR:
1. **Bağımsız / Kök (Core) Veriler:** Herhangi bir dış tabloya bağlı olmayanlar. (Örn: Roller, Enum muadili statüs tabloları, Sistem Parametreleri, Şehir/İlçe listesi).
2. **Kök Entiteler (Root Entities):** Veritabanının ana aktörleri (Örn: Kullanıcılar, İşletmeler/Şubeler).
3. **Bağlı Entiteler (Child Entities):** Tamamen üstteki nesnelerin ID'lerine muhtaç veriler. (Örn: Personeller, Hizmetler, ve en son Randevular).

## 2. Prod Seed'in Tüm Ortamlardaki Zorunlu Varlığı
Üretim ortamı (Prod) seeder kurgusu ("rollerin" veya "hizmet tiplerinin" oluşturulması gibi), sadece `NODE_ENV === 'production'` iken çalışacak demek **DEĞİLDİR.**
Sistem `development` veya `test` ortamında başlatılsa dahi, mock (sahte) datalar eklenebilmesi için önce temel "Prod Data" sistemde var olmalıdır. 

Ana `seed.ts` dağıtıcısı (dispatcher) tam olarak şu mantıkta çalışmalıdır:

```typescript
import { seedProductionData } from './seeds/prod-seed';
import { seedDevelopmentData } from './seeds/dev-seed';

async function main() {
  const env = process.env.NODE_ENV || 'development';
  console.log(`🌱 Seeding başlatıldı. Hedef Ortam: [${env}]`);

  // 1. ZORUNLU: Ortam ne olursa olsun Enum/Sabitler (Prod Data) içeri alınır!
  // Parent tablolardan başlanması kuralına uyulur.
  console.log('⚡ [Core] Sabit Enum ve Sistem Modelleri yazılıyor...');
  const coreData = await seedProductionData();

  // 2. ORTAMA BAĞLI OLARAK EKLENEN FAKE DATALAR
  if (env === 'development') {
    console.log('🛠 [Dev] Geliştirici mock verileri ekleniyor...');
    // Dev mocklar'ı root'ta üretilen coreData Id'lerine ihtiyaç duyabilir, argüman olarak iletilir.
    await seedDevelopmentData(coreData);
  } else if (env === 'test') {
    // await seedTestData(coreData);
  }

  console.log('🎉 Tüm Seeding İşlemleri Başarıyla Tamamlandı!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding sırasında ölümcül hata (Constraint vb):', e);
    process.exit(1);
  });
```

Bu kontrol mimarisi, hem kod tekrarını engeller hem de sistemin dev ve prod ortamlardaki "zorunlu veriler (enum tipli varsayılanlar)" bazında birbiriyle tutarlı kalmasını sağlar.
