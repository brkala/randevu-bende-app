# 2. Builder Pattern Aracı ve Zod Entegrasyonu ile Veri Üretimi

Seed yazarken, veya mock datalar oluştururken uzun uzadıya nesneler (object literals) yazmak yerine, projenin ana mimarisinde yer alan hazır `builder-pattern` paketi, `fakerTR` (Türkçe Lokalizasyon) ve `Zod` mimarisi birlikte ve uyum içinde kullanılacaktır.

## Temel Kurallar
1. Obje oluşturmak yerine **[builder-pattern](https://github.com/Vincent-Pang/builder-pattern)** kütüphanesinin `Builder<T>()` yapısı kullanılır.
2. Sahte veriler daima `@faker-js/faker` kütüphanesinin **Türkçe ayarı olan `fakerTR`** ile üretilmeli ve öngörülebilir test senaryoları için sabit bir seed (Örn: `fakerTR.seed(1234)`) atanmalıdır.
3. Builder tamamlanıp obje oluşturulduğunda (`build()`), bu obje direkt veritabanına veya fonsiyona GÖNDERİLMEZ. Mimari yapısı gereği, önce ait olduğu **Zod şemasından (Örn: `userSchema.parse()`) geçirilmek zorundadır**.

## Kullanım Şablonu (HOF ve Builder)

Her varlık (entity) için, dışarıya direkt önceden doldurulmuş (varsayılan) bir "Builder" dönen yardımcı HOF (Higher Order Function) yazılmalıdır.

```typescript
import { Builder } from 'builder-pattern';
import { fakerTR } from '@faker-js/faker';
import { type UserType } from '../schemas/user.schema';

fakerTR.seed(123); // Tekrar edilebilir, güvenli sahte veri üretimi

/**
 * createUserBuilder:
 * İçerisine önceden fakerTR verileri atanmış bir "Builder" döndürür.
 * Nesne tamamen Typesafe'dir (Builder<UserType>).
 */
export const createUserBuilder = () => {
  return Builder<UserType>()
    // 1. Varsayılan (Default) Değerler
    .email(fakerTR.internet.email())
    .password('vrs_hashed_password')
    .firstName(fakerTR.person.firstName())
    .lastName(fakerTR.person.lastName())
    .isActive(true)
    .roleId(''); // Parent tablo zorunluluğu, dışarıdan override edilmeli
};
```

## Seeding Sırasında Örnek Kullanım

Geliştirme (Dev) veya Test seed dosyaları, bu builder'ları çağırır, sadece gereken alanları ezer (override), veriyi inşa eder (build) ve veritabanına kaydetmeden önce Zod korumasından geçirir. Ana kod "su gibi" akmalıdır (Anti-Bloat).

```typescript
import { createUserBuilder } from './builders/user.builder';
import { userSchema } from '../schemas/user.schema';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function seedDevelopment(coreData) {
  console.log('👥 Admin kullanıcısı oluşturuluyor...');

  // 1. HOF ile Builder başlat, özel alanı ez ve oluştur (build)
  const mockAdminObj = createUserBuilder()
    .email('admin@randevubende.com')
    .roleId(coreData.adminRole.id) // Parent verisi giriliyor
    .build();

  // 2. MİMARİ KURAL: Zod Doğrulaması Şart!
  const validAdmin = userSchema.parse(mockAdminObj);

  // 3. Prisma ile veritabanına yaz
  const admin = await prisma.user.create({ data: validAdmin });
  console.log(`✅ Admin: ${admin.email} başarıyla eklendi.`);
}
```

Bu kurgu sayesinde; hem veritabanını "FakerTR" sahte verileriyle hatasız donatırsınız, hem de oluşturulan objelerin modelde (Zod vb.) değişen veya eksik kalan kısımları kod patlamadan (catch edilerek) erken uyarıyla tespit edilebilir.
