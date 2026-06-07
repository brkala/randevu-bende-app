# AI Görev Yürütme Senaryoları (Playbook)

Bu döküman, yapay zeka asistanlarının (ve geliştiricilerin) görev taleplerini alırken takip etmesi gereken **"Algoritmik Dosya Zincirini"** içerir. Bir görev geldiğinde hedefe en doğru mimariyle ulaşmak için aşağıdaki sırayla ilerlenmelidir.

---

## ⚙️ Senaryo 1: Veritabanından Veri Okuma / Listeleme İsteği
**Kullanıcı Talebi:** *"Veritabanında bulunan üyeleri/randevuları ekrana listeleyen bir sistem kur."*

**Aksiyon Zinciri (Aşağıdan Yukarıya):**
1. **Schema Katmanı (`.schemas.ts`):** Önce UI'ye dönülecek verinin yapısını (DTO) Zod ile tanımla.
2. **Server Katmanı (`.server.ts`):** Prisma ORM'sini kullanarak DB'den verileri çeken salt iş mantığını yaz. Tip dönüşlerini Zod schema'ya bağla.
3. **Function Katmanı (`.functions.ts`):** `createServerFn` kullanarak Server'daki salt metodu Dış Dünyaya (Frontend RPC) bağla.
4. **Query Katmanı (`.queries.ts`):** Sayfanın cache yönetimi için TanStack Query option ve factory metodlarını tanımla.
5. **Router Katmanı (`routes/...tsx`):** Route dosyasını aç ve kullanıcı sayfaya varmadan önce `loader` içerisinde `ensureQueryData` yeteneğiyle veriyi önyükle (Prefetch).
6. **UI Katmanı (`components/list.tsx`):** Prefetch edilmiş veriyi `useQuery` ile saniyesinde ekrana bastıran Ark UI / Tailwind componentini çiz.

---

## 📝 Senaryo 2: Veri Oluşturma / Güncelleme (Form) İsteği
**Kullanıcı Talebi:** *"Admin panelinden yeni bir kullanıcı/randevu ekleme formu yapalım."*

**Aksiyon Zinciri:**
1. **Schema Katmanı (`.schemas.ts`):** Kullanıcının dolduracağı formun güvenlik sınırlarını `z.object` form şeması ile yaz.
2. **Server Katmanı (`.server.ts`):** DB'ye INSERT/UPDATE yapacak Prisma fonksiyonlarını oluştur. İçeride mantık hatası varsa `.server.ts` içerisinde *AppError* fırlat.
3. **Function Katmanı (`.functions.ts`):** `createServerFn` oluştur, `.validator(FormSchema)` diyerek Zod filtresini Router'a tak ki kötü veri içeri geçemesin.
4. **Mutation Katmanı (`hooks/use-create-[isim].ts`):** Arayüze gömmeden önce mutasyonu kendi hook dosyasına yaz. `onSuccess` evresinde Listeyi invalidate (Cache silme) etmeyi ve Toast mesajı atmayı Unutma.
5. **UI Katmanı (`components/form.tsx`):** Zod onaylı Tanstack Form'u ekrana entegre et, sadece `mutate()` komutunu çağır.

---

## 🛡️ Senaryo 3: Bileşen Yükünün (Bloat) Engellenmesi İsteği
**Kullanıcı Talebi:** *"Bu tabloda sadece aktifleri, tarihe göre ve isme göre dinamik filtreleyen geniş bir UX yapalım."*

**Aksiyon Zinciri:**
1. AI, gidip `list.tsx` içine 50 satırlık `useState` ve `useEffect` yığamaz!
2. Derhal `features/[özellik]/hooks/use-table-filters.ts` diye izole bir kanca (Custom Hook) oluşturulur. Tüm arama, filtreleme, sıralama state'leri bu obje içerisine atılır.
3. Component (UI) `const { searchTerm, setSearchTerm, filteredData } = useTableFilters(data)` şeklinde bu hook'u tüketir ve arayüz "Kukla" (Dumb component) olarak basit ve temiz kalır.

---

## 🚀 Senaryo 4: Sıfırdan Yeni Sayfa / Özellik (Feature) İnşası
**Kullanıcı Talebi:** *"Adminler için randevu listeleme sayfası yapalım. Henüz detaylı veritabanına girmeye gerek yok, kaba taslak (basic) listelensin yeter."*

**Aksiyon Zinciri (Hızlı Üretim Formülü):**
1. **Feature Tespiti ve Üretimi:** Projede `features/admin-appointments/` var mı kontrol et. Yoksa Zero-Global kuralına (Vertical Slicing) uyarak bu özelliği tüm alt klasörleriyle (components, hooks, schemas vb.) yoktan var et.
2. **Sahte Veri (Mocking):** Eğer kullanıcı henüz detaylı veritabanı istemediyse, `.server.ts` içerisine hızlı bir sahte dizi (dummy array) döndüren kaba taslak metotlar yaz. Bunu yine `.functions.ts` ile dışarı aç.
3. **Sıfırdan Route (Rotalama):** `app/routes/admin/appointments/index.tsx` dosyasını oluştur. **"Aptal Rota"** kurallarını hatırla: Route'un içine Asla UI yazma! Route dosyasının içine sadece `loader` (Prefetch) mantığını yerleştir ve Ana Componenti render et.
4. **UI İskeleti:** Gerçek arayüzü `features/admin-appointments/components/admin-appointment-list.tsx` içine git ve Tailwind CSS ile sade, temiz bir liste tasarımı kodu bloklayarak Route'a bağla. İşlem tamamdır! Başlangıç omurgası oturmuş olur.

---

## 5. Aşama: Kaba İnşaat (Özellik / Feature Oluştur Komutu)
**Kullanıcı Talebi:** *"Yeni bir özellik oluştur: [Özellik Adı]"*

**Aksiyon Zinciri (Salt İskelet Kurulumu):**
Kullanıcı spesifik olarak otonom ajandan veya asistandan yeni bir özellik (Feature) talep ettiğinde asistan **kod yazmaya veya backend mantıkları uydurmaya çalışmaz**, sadece projenin Zero-Global kurallarına uygun boş dosyalarını (Boilerplate) üretir.

1. **Hiyerarşinin Yaratılması:** `features/[özellik-adı]/` dizinini ve içine standart yapıyı şablon olarak bırakır:
   - `components/` (dizin)
   - `hooks/` (dizin)
   - `contexts/` (dizin)
   - `lib/` (dizin - opsiyonel)
   - `[özellik-adı].server.ts`
   - `[özellik-adı].functions.ts`
   - `[özellik-adı].queries.ts`
   - `[özellik-adı].schemas.ts`
   - `[özellik-adı].types.ts`
2. **Kullanıcı Onayı İçin Bekleme Yasağı:** Dosyaların içi hazırlandıktan sonra asistan KESİNLİKLE EYLEMİ DURDURUR.
3. **Soru Sorma Mecburiyeti:** Asistan kullanıcıya dönüp tam olarak şu soruyu sorar: 
   > *"Mimarimize göre [Özellik Adı] özelliğini ve iskelet dosyalarını başarıyla ürettim. Bir sonraki adım olarak bu dış unsurların toparlanacağı bir **Layout (Kapsayıcı) Bileşeni** ve onu internete açacağımız bir **TanStack Route (Aptal Rota)** oluşturmamı ister misiniz?"*
4. Eğer kullanıcıdan onay gelirse işlemi Route üzerinden devam ettirir.

---

## 6. Aşama: Yeniden Yapılandırma ve Basitleştirme (Refactor / Anti-Bloat)
**Kullanıcı Talebi:** *"Bu componenti basitleştir"* veya *"Şu kodu refactor et"*

**Aksiyon Zinciri (Karmaşıklığa Göre Ayıklama):**
AI, "Basitleştir" komutunu aldığında doğrudan kod satırlarını ezerek daraltmaya veya silmeye çalışmaz. Solid prensiplerine (Zero-Global Mimarisine) dayanarak kodu karmaşıklığıma göre 3 seviyede dışarıya (Extract) çıkartır:

1. **Seviye 1 (UI Karmaşıklığı):** Component'in JSX hiyerarşisi çok kalabalık ancak iş mantığı yok denecek kadar azsa; asistan bu devasa arayüzü daha küçük alt-bileşenlere (Sub-components) ayırır. (Örn: Devasa `table.tsx` içinden `table-header.tsx` ve `table-row.tsx` çıkartıp `components/` klasörüne koyar).
2. **Seviye 2 (Mantık Karmaşıklığı):** Eğer Component içerisinde durmadan büyüyen fonksiyonlar, doğrulama (validation) süreçleri, `useState` ve UI'a ait olmayan iş eylemleri varsa; asistan bu mantıkları derhal söker ve `features/[özellik]/hooks/` içerisine atar. Component'i sadece `const { data, eylem } = useBilesenMantikHook()` çağıran bir aptal çiziciye (Dumb Renderer) dönüştürür.
3. **Seviye 3 (Domain Çöküşü - Son Çare):** Eğer asistan o UI componentinin kendi başına bambaşka bağlamlar, yığınla Context ihtiyacı veya sayfalar dolusu özel `type` gereksinimleri doğurduğunu fark ederse DÜZELTME YAPMAZ. Kullanıcıya dönüp **"Bu dosya artık bir component olmaktan çıktı. İzin verirseniz bu kodu `features/[yeni-özellik-adı]` isminde bağımsız bir Feature olarak ana klasöre çıkartıp mimarisini böleyim"** diye uyarır.

---

## 7. Aşama: Veritabanı Modeli (Prisma) Güncellemesi
**Kullanıcı Talebi:** *"Randevu tablosuna 'notlar' ve 'ucret' diye iki yeni alan ekleyelim."*

**Aksiyon Zinciri (Uçtan Uca Typings Senkronizasyonu):**
1. **Prisma Şeması:** İlk olarak projenin veritabanı iskeleti olan `schema.prisma` dosyasını açıp ilgili modeli günceller. (Örn: `notlar String?`, `ucret Float`).
2. **Zod Senkronizasyonu (KRİTİK):** Model güncellenir güncellenmez DERHAL ilgili feature'ın `[özellik].schemas.ts` dosyasına giderek Zod nesnelerini (`z.string().optional()`) yeni eklentilere göre revize eder. (Zod güncellenmezse, TanStack RPC `createServerFn.validator()` filtresi o alanları hırsız sanıp siler ve veritabanına boş kayıt atılır!)
3. **Form ve İstemci (Frontend):** UI katmanındaki Zod formu güncellenir, yeni inputlar eklenir.
4. **Mutasyon:** Eğer TanStack Query tarafında eski bir önbellek (Cache) metodu varsa, güncellenen alanların patlamaması için gerekli kontrolleri ekler.

---

## 8. Aşama: Veri Silme (Güvenli CRUD) İşlemi
**Kullanıcı Talebi:** *"Kayıtlı randevuyu veya admin'i silebileceğimiz bir işlem yap."*

**Aksiyon Zinciri:**
1. **Zod Parametre Güvenliği (`.schemas.ts`):** Rastgele URL parametresi ile backend çökmemesi için sadece ID doğrulayan basit bir Zod Validation objesi (`DeleteRecordSchema = z.object({ id: z.string().uuid() })`) yazar.
2. **Server Stratejisi (`.server.ts`):** Prisma ile veritabanına `DELETE` sorgusu atmadan önce ilişkisel bir tablo olup olmadığını inceler. Gerekirse veriyi gerçekten silmek yerine **Soft-Delete** (Sadece `update { isActive: false }`) mi yapılması gerektiğini hesaba katar ve kodlar.
3. **TanStack Otoritesi (`.functions.ts`):** `createServerFn` üzerinden silme isteğini açarken yetkisizlerin API'yi tetiklememesi için eğer Auth (Middleware) mekanizmamız varsa bunu guard olarak ekler.
4. **İyimser Silme (Optimistic Update):** Silme isteği başarılı olur olmaz kullanıcıyı bekletmemek için `mutasyon-kurallari.md` içindeki kurala uyar. API onayını beklemeden, butona tıklandığı ilk saniye kaydı tablodan silinmiş gibi UX yansıtması yapar. Eğer sunucu hata verirse, hata Toast'u fırlatıp arayüzü geri sarar (Rollback).

---

## 9. Aşama: Sahte Veri (Mock) ve Veritabanı Seed İşlemleri
**Kullanıcı Talebi:** *"Geliştirme için 10 adet rastgele atanmış müşteri veya randevu verisi üretelim."*

**Aksiyon Zinciri (Builder & Zod Boru Hattı):**
1. **Mimari Referans Kontrolü:** Önce `notes/general/seeding/` klasöründeki standartları (Env kuralları, Hiyerarşi) hatırla. `seed.ts` dosyasına bodoslama bin satırlık Prisma insertleri YAZMA!
2. **Builder (HOF) Üretimi:** Veritabanına yazılacak model için (örn: `User`) `builder-pattern` paketi ve `fakerTR` kullanarak bir `createUserBuilder()` fonksiyonu üret (Bkz: 02-builder-pattern.md) ve `prisma/seeds/builders/` içine kaydet.
3. **Zod Validasyonu (Zorunlu Katman):** Üretilen builder nesnesini `.build()` ile ayağa kaldırdıktan sonra doğrudan Prisma'ya GÖNDERME. Daima ilgili Zod şemasından (`userSchema.parse()`) geçir.
4. **Ortama Göre Seed (Dispatch):** Üretilen veriyi mock olduğu için `dev-seed.ts` dosyasına dahil et ve Parent-Child hiyerarşi sırasına (Önce dükkan, sonra müşteri, sonra randevu) mutlak saygı duy!

---

## 10. Aşama: Birim (Unit) Test Yazma İsteği
**Kullanıcı Talebi:** *"Bu özellik için unit test yazalım."* veya *"Bu componenti test edelim."*

**Aksiyon Zinciri (Vitest Sınır İhlali Kalkanı):**
1. **Reddetme / Kapsam Kontrolü (KRİTİK):** Kullanıcı bir UI Bileşeni (örn: `<Button>`, `<AppointmentForm>` vb.) için DOM tabanlı bir Unit Test (Vitest/Jest) veya `@testing-library/react` render isteği verirse BUNU DERHAL REDDET. `notes/general/testing/unit.md` kurallarını hatırlatıp *"Mimari kurallarımız gereği UI kodlarına Unit test yazamayız. Bu iş yükü tamamen Playwright'a (E2E) aittir. İzin verirseniz bu bileşenin bağlı olduğu akışa E2E senaryosu yazayım"* diye uyar ve alternatif üret.
2. **Kabul Edilebilir Kapsam (Saf JS/TS):** Kullanıcının testi sadece ve sadece saf iş zekasını (Örn: İndirim yüzdesi hesaplayan matematiksel fonksiyon, tarih çarpışması hesaplayan pure function) içeriyorsa bu talebi kabul et ve göreve başla.
3. **Konumlandırma (Sıfır-Global):** Vitest kurgusunu yazarken testi global bir klasöre YÜKLEME. Test dosyasını, dikey dilimleme mimarisi gereği tam test ettiği fonksiyonun yanına (`features/[ozellik]/lib/hesapla.test.ts`) yerleştir.

---

## 11. Aşama: Kullanıcı Senaryosu (E2E) Testi İstemi
**Kullanıcı Talebi:** *"Bir müşterinin randevu alma veya kayıt olma akışını test etmeliyiz."*

**Aksiyon Zinciri (Playwright Entegrasyonu):**
1. Playwright kurallarını referans al (`testing/e2e.md`).
2. Sadece görünüm testi değil, kullanıcının tam geçiş (Flow) senaryosunu zihninde kurgula: Sayfa açılır -> URL test edilir -> Dükkan bulunur -> Selectbox seçilir -> Form submit edilir -> API backend onayı test edilir.
3. Oluşturulacak e2e dosyasını (`.spec.ts`) `tests/e2e/[ozellik-adi]/ilgili-senaryo.spec.ts` içerisine yerleştir ve kurguyu tamamla.

---

## 12. Aşama: Kod İncelemesi (Review) İstemi
**Kullanıcı Talebi:** *"Şu dosyayı incele"*, *"Kodu review et"* veya *"Mimariye uygun mu kontrol et"*

**Aksiyon Zinciri (Review Protokolü):**
1. **Döküman Referansı:** Derhal `notes/general/gelistirme.md` dosyasındaki **3. Asistan İnceleme Süreci (AI Review)** bölümüne git.
2. **Sınırlandırma (ÖNEMLİ):** İnceleme sırasında kullanıcı aksini özellikle belirtmedikçe KESİNLİKLE kodda bir değişiklik yapma, sadece analizi raporla.
3. **Analiz Basamakları:** `gelistirme.md` içerisindeki checklist'i sırasıyla işlet ve sonucu madde madde kullanıcıya sun.
