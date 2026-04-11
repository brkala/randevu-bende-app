# Sunucu İşlemleri (.server.ts) Standartları

Bu döküman, projedeki salt (pure) sunucu tabanlı arka plan iş mantığının, veritabanı sorgularının ve harici API çağrılarının `[feature].server.ts` dosyalarında nasıl kodlanması gerektiğini belirler.

## `.server.ts` Dosyasının Rolü

Klasör hiyerarşisinde belirlediğimiz kural gereği, `[feature].server.ts` dosyaları **ASLA** doğrudan istemci (Client / UI) tarafından çağrılmaz ve kendilerini Frontend'e açan RPC (`createServerFn`) metodları İÇERMEZ. İstemcinin erişebileceği o API köprüleri `[feature].functions.ts` içinde barındırılır.

`.server.ts` dosyaları sadece şu alanlar tarafından çağrılabilir:
1. Diğer `.server.ts` dosyaları.
2. `.functions.ts` içindeki RPC handler'ları.
3. Veya Background Worker (BullMQ vb.) içindeki süreçler.

---

### Şablon: Saf Sunucu Mantığı (Internal Server Logic)

Bu katmanda TanStack Start spesifikasyonları yerine Prisma Client ve saf Typescript metodları yer alır.

```typescript
import { prisma } from "../../lib/prisma/client";
import type { CreateAppointmentInput } from "./appointment.schemas"; 

// İstemciye AÇIK DEĞİLDİR. RPC sarmalayıcısı (createServerFn) yoktur!
export const getAppointmentDetailsById = async (id: string) => {
  const appointment = await prisma.appointment.findUnique({
    where: { id },
    include: { 
      user: true,
      services: true
    } 
  });

  if (!appointment) {
    throw new Error("Kayıt bulunamadı."); // İş mantığı kuralı
  }
  
  return appointment;
};

// Bu metot sonradan .functions.ts içindeki bir RPC handler'a bağlanacaktır.
// Argüman tipi olarak otomatik olarak .schemas.ts içindeki Zod type'ını kullanıyoruz!
export const createAppointmentRecord = async (data: CreateAppointmentInput) => {
  // Prisma ekleme işlemleri...
  return "random-id";
}
```

---

### Yapay Zeka (AI) İçin Geliştirici Kuralları:

1. **RPC Kullanımı Yasaktır:** İstemcinin (React UI) gidip bir butona tıklandığında doğrudan tetikleyebileceği bir sunucu fonksiyonu yazıyorsan, bunu ASLA bu (.server.ts) dosyasına yazma! O kod `[feature].functions.ts` dosyasına gitmeli ve `createServerFn` ile sarmalanmalıdır. Bu dosya sadece dahili veritabanı işlerine bakar.
2. **Erişim İhlali (Client Leak):** Bu dosya katı bir NodeJS/Sunucu ortamıdır. Buraya UI dünyasına ait ortam değişkenleri, `window`, `document`, React kancaları (`useEffect`) dahil hiçbir konsept dışarıdan import edilemez.
3. **Prisma Şartı:** Veritabanına ait işlemler (CRUD vb) mutlaka proje içerisindeki **Prisma Client** altyapısından çıkarılmalıdır. Düz SQL query'ler yazmaya kalkışma.
4. **Named Export:** Her metod `export const` stiliyle tanımlanır. `export default` kullanılamaz.
5. **Parametre Tipleri (D.R.Y):** Saf backend fonksiyonlarına girilecek olan CRUD verilerinin Typescript modellerini hiçbir zaman manuel yazma (`interface CreateArgs {...} `). Parametreler doğrudan `.schemas.ts`'ten çıkma `z.infer` yapıları olmalıdır. Böylece Zod modeline bir alan eklendiğinde `.server.ts` kodunuz da otomatik olarak Typescript uyarısı fırlatır.
