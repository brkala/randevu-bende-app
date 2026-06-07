# Proje Klasör ve Bileşen (Component) Mimarisi

Bu döküman, TailwindCSS kullanılan model bazlı (Tanstack Start vb.) projelerimiz için geçerli olan klasör yapısı ve dosya isimlendirme kurallarını içerir.

## Features Klasör Yapısı

Her bir bağımsız özellik (feature), `src/features/` dizini altında kendi klasörüne sahip olmalıdır. Örnek olarak `appointment` özelliğinin yapısı aşağıdaki gibi yapılandırılmalıdır:

```text
src/
└── features/
    ├── shared/                              // [VARSAYILAN / ZORUNLU] Tüm uygulamaya hizmet eden ortak yapılar
    │   ├── components/                      // Ark UI / Ortak Butonlar / Modallar (ui/)
    │   ├── lib/                             // Ortak araçlar (Örn: cn.ts)
    │   └── hooks/                           // useKeyboard vb. global hooklar
    │
    ├── auth/                                // Global kimlik yönetimi (Core system) de bir Feature olarak yaşar!
    │   ├── lib/                             // Better Auth çekirdek ayarları ve client başlatıcısı
    │   └── hooks/                           // useSession, useSignIn gibi auth hook'ları
    │
    ├── database/                            // Veritabanı (Prisma) başlatıcısı için dahi izole bir feature.
    │   └── lib/                             // prisma.client.ts
    │
    └── appointment/                         // İş alanına özgü (Domain-specific) standart feature örneği
        ├── components/                      // UI ve görsel React bileşenleri
        │   ├── appointment-card.tsx         // Kebab-case adlı React bileşenleri
        │   ├── appointment-form.tsx
        │   └── appointment-list.tsx
        ├── contexts/                        // React Context yapıları ve state yönetimi
        │   ├── appointment-form.context.tsx // Forma özel state'i yöneten context
        │   └── appointment-list.context.tsx // Listeye özel state'i yöneten context
        ├── hooks/                           // Custom (Özel) React Hook'ları
        │   └── use-appointment-form.ts      // Modüle özgü mantıkları barındıran hook'lar
        ├── lib/                             // Sadece bu özelliğe (feature) özel yardımcı araçlar
        │   ├── appointment-utils.ts         // Feature içi tarih hesaplama vs.
        │   └── constants.ts                 // Feature içi statik veriler
        ├── appointment.functions.ts         // createServerFn() RPC API köprüleri
        ├── appointment.queries.ts           // Tanstack Query Option Key Fabrikaları
        ├── appointment.schemas.ts           // Zod gibi form ve veri validasyon şemaları
        ├── appointment.server.ts            // DB/Prisma CRUD Sunucu taraflı metodları
        ├── appointment.jobs.ts              // [YENİ] BullMQ Kuyruk ekleme/tanımlama (Producer)
        ├── appointment.worker.ts            // [YENİ] BullMQ İş işleyicileri (Processor)
        └── appointment.types.ts             // TypeScript statik verileri, tipler ve arayüzler
```

## Temel Kurallar

1. **Bileşenler Klasörü (Components):** 
   - Tailwind CSS kullanılacağı için `.module.css` veya bağımsız CSS dosyalarına ihtiyaç yoktur.
   - Her React bileşeni ayrı bir klasöre konmak yerine, doğrudan `components/` dizini içinde `.tsx` dosyaları olarak yer almalıdır.

2. **İsimlendirme (Naming Conventions):**
   - Yeni oluşturulacak tüm bileşen dosya isimleri kesinlikle **kebab-case** formatında olmalıdır (Örnek: `appointment-card.tsx`).
   - Kodun içindeki React bileşeni dışa aktarılırken standart olan `PascalCase` kuralına uyulmalıdır (`export const AppointmentCard = ...`).

3. **Context Yönetimi (Contexts):**
   - Özelliklerin büyümesiyle birlikte birden fazla context ihtiyacı doğabileceği için, bunları özellik bazında `contexts/` klasörü içerisinde topluyoruz.
   - Context dosyaları, kebab-case kuralına ve `.context.tsx` uzantısına uyacak şekilde yapılandırılmalıdır (`appointment-list.context.tsx` gibi).

4. **Hook Yönetimi (Hooks):**
   - Özelliğe (feature) ait React hook'ları (`use-...`) `hooks/` klasörü altında toplanmalıdır.
   - Dosya isimlendirmeleri kebab-case formatında (`use-appointment-form.ts` gibi) olmalıdır.

5. **Klasörün Dolmasını Engellemek (Anti-Bloat):**
   - `shared` feature klasörü hariç bir klasörde çok fazla dosya oluşursa, dikey dilimleme (Vertical Slicing) uygulanarak alt domain mantığıyla yeni bir feature klasörüne bölünmelidir.
   - Ana componentin çok fazla direkt alt bileşeni birikiyorsa yeni bir alt-feature klasörü oluşturulmalıdır.
   - Ana component dışındaki alt componentlerden herhangi biri çok fazla hook veya iş mantığı içermeye başlarsa, o componentin aslında kendine ait bağımsız bir domaini (feature klasörü) olmalıdır.
   - Hedef; dizinde `feature` sayısını yatayda geniş, dikeyde klasör derinliğini az tutmaktır. Örneğin tüm admin ekranlarını tek bir "admin" feature'ı altına hapsetmektense şöyle parçalanmalıdır:
      - `features/admin-dashboard/`
      - `features/admin-appointments/`
      - `features/admin-navigation/`

6. **İzole Araçlar (Sıfır Global - Zero Global):**
   - Projenin `src/` dizini altında global bir özellik/çöplük barındırmak (Örn: `src/lib`, `src/utils` klasörleri) **TAMAMEN YASAKTIR**. Her şey bir "Feature" olarak tasarlanmalıdır (`features/auth/`, `features/database/` vb.).
   - Yazılan bir fonksiyon veya araç birden fazla domain'i ilgilendiriyorsa `features/shared/lib/` içine atılır.
   - Sadece tek bir özelliğe has işlemler yapılıyorsa o özelliğin altına (`features/[özellik]/lib/`) atılır.