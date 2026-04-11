# TanStack RPC Fonksiyonları (.functions.ts) Standartları

Bu döküman, İstemci (Client / UI / Component) üzerinden doğrudan çağrılabilen tip-güvenli sunucu uç noktalarının (Server Functions / RPC) `[feature].functions.ts` dosyalarında nasıl yapılandırılacağını belirler.

TanStack Start ekosisteminde Sunucu (Backend) ile İstemci (Frontend) arasındaki asıl köprü bu dosyalardaki `createServerFn` metoduyla kurulur.

## 1. İstemci Tarafından Tetiklenen İşlemler Şablonu (`createServerFn`)

UI bileşenlerinden (buton tıklaması, form gönderimi) veya Client Loader üzerinden çağrılabilir API endpointleri yazarken **Zod Validator** kuralı (%100 Tip Güvenliği için) mecburi tutulmuştur.

```typescript
import { createServerFn } from "@tanstack/react-start";
import { CreateAppointmentSchema } from "./appointment.schemas";
import { createAppointmentRecord } from "./appointment.server"; // Saf CRUD mantığı asıl server dosyasından gelir

// Post veya Get Tipi Belirtilir
export const createAppointmentFn = createServerFn({ method: "POST" })
  // 1. Kör Uçuş Engeli: Dış dünyadan (İstemciden) gelen "unknown/any" data zorunlu olarak Zod filtresine sokulur!
  .validator((data: unknown) => CreateAppointmentSchema.parse(data))
  
  // 2. (Varsa) Auth gibi middleware'leri bağlıyoruz
  // .middleware([authMiddleware])
  
  // 3. Execute katmanına geldiğinde "data", Zod tarafından tamamen filtrelenmiş (saf Type) olarak gelir.
  .handler(async ({ data /*, context */ }) => {
    
    // İş katmanı: Veritabanı işleminin kendisini (Prisma kodlarını) tekrar burada yazıp dosyayı şişirmek yerine (Bloat), 
    // işlemi ".server.ts" içindeki saf (pure) backend fonksiyonlarına pasla.
    const newRecordId = await createAppointmentRecord(data);

    return { 
      success: true, 
      id: newRecordId 
    };
  });
```

---

### Yapay Zeka (AI) İçin Geliştirici Kuralları:

1. **Katman Görevi:** `[feature].functions.ts` dosyası temelde bir *API Route (Köprü)* denetleyicisidir. İçerisinde uzun uzadıya 500 satırlık veritabanı (Prisma) mantıklarını (business logic) doldurup dosyayı şişirme. Sadece gelen veriyi Zod ile onayla (`.validator`) ve asıl Prisma operasyonu için veriyi `[feature].server.ts` içerisindeki temiz fonksiyonlara pasla.
2. **Kör Uçuş (Blind Data) Yasağı:** `createServerFn` oluştururken gelen dış dünyaktaki UI datalarını ASLA desteksiz okuyamazsın/kabul edemezsin. İstekten gelecek form girdileri veya URL parametreleri mutlaka `.validator()` fonksiyonunda `[feature].schemas.ts` içindeki bir Zod objesi ile filtrelenmelidir (`Schema.parse()`).
3. **Named Export:** Diğer tüm dosyalarda olduğu gibi `export default` kullanımı KESİNLİKLE YASAKTIR. Sadece `export const` kullan!
