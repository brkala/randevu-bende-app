# AI Görev Yürütme Senaryoları (Playbook)

Bu döküman, yapay zeka asistanlarının (ve geliştiricilerin) genel geçer görev taleplerini alırken takip etmesi gereken **"Algoritmik Dosya Zincirini"** içerir. Bir görev geldiğinde hedefe en doğru mimariyle ulaşmak için rastgele değil, aşağıdaki sırayla ilerlenmelidir.

---

## ⚙️ Senaryo 1: Veritabanından Veri Okuma / Listeleme İsteği
**Kullanıcı Talebi:** *"Veritabanında bulunan üyeleri/randevuları ekrana listeleyen bir sistem kur."*

**Aksiyon Zinciri (Aşağıdan Yukarıya):**
1. **Schema Katmanı (`.schemas.ts`):** Önce UI'ye dönülecek verinin yapısını (DTO) Zod ile tanımla.
2. **Server Katmanı (`.server.ts`):** Prisma ORM'sini kullanarak DB'den verileri çeken salt iş mantığını yaz. Tip dönüşlerini Zod schema'ya bağla.
3. **Function Katmanı (`.functions.ts`):** `createServerFn` kullanarak Server'daki salt metodu Dış Dünyaya (Frontend RPC) bağla.
4. **Query Katmanı (`.queries.ts`):** Sayfanın cache yönetimi için TanStack Query option ve factory metodlarını tanımla.
5. **Router Katmanı (`routes/...tsx`):** Route dosyasını aç ve kullanıcı sayfaya varmadan önce `loader` içerisinde `ensureQueryData` yeteneğiyle veriyi önyükle (Prefetch).
6. **UI Katmanı (`components/list.tsx`):** Prefetch edilmiş veriyi `useQuery` ile saniyesinde ekrana bastıran Base UI / Tailwind componentini çiz.

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

## 🏗️ Senaryo 5: Kaba İnşaat (Özellik / Feature Oluştur Komutu)
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
2. **Kullanıcı Onayı İçin Bekleme Yasağı:** Dosyaların içi (importlar ve export taslak tipleri) hazırlandıktan sonra asistan KESİNLİKLE EYLEMİ DURDURUR.
3. **Soru Sorma Mecburiyeti:** Asistan kullanıcıya dönüp tam olarak şu soruyu sorar: 
   > *"Ait olduğumuz mimari kuralına göre [Özellik Adı] özelliğini ve iskelet dosyalarını başarıyla ürettim. Bir sonraki adım olarak bu dış unsurların toparlanacağı bir **Layout (Kapsayıcı) Bileşeni** ve onu internete açacağımız bir **TanStack Route (Aptal Rota)** oluşturmamı ister misiniz?"*
4. Eğer kullanıcıdan onay gelirse işlemi Route üzerinden devam ettirir.

---

## 🧹 Senaryo 6: Yeniden Yapılandırma ve Basitleştirme (Refactor / Anti-Bloat)
**Kullanıcı Talebi:** *"Bu componenti basitleştir"* veya *"Şu kodu refactor et"*

**Aksiyon Zinciri (Karmaşıklığa Göre Ayıklama):**
AI, "Basitleştir" komutunu aldığında doğrudan kod satırlarını ezerek daraltmaya veya silmeye çalışmaz. Solid prensiplerine (Zero-Global Mimarisine) dayanarak kodu karmaşıklığına göre 3 seviyede dışarıya (Extract) çıkartır:

1. **Seviye 1 (UI Karmaşıklığı):** Component'in JSX hiyerarşisi (div'ler ve stiller) çok kalabalık ancak iş mantığı yok denecek kadar azsa; asistan bu devasa arayüzü daha küçük alt-bileşenlere (Sub-components) ayırır. (Örn: Devasa `table.tsx` içinden `table-header.tsx` ve `table-row.tsx` çıkartıp `components/` klasörüne koyar).
2. **Seviye 2 (Mantık Karmaşıklığı):** Eğer Component içerisinde durmadan büyüyen fonksiyonlar, doğrulama (validation) süreçleri, `useState` ve UI'a ait olmayan iş eylemleri varsa; asistan bu mantıkları derhal söker ve `features/[özellik]/hooks/` içerisine atar. Component'i sadece `const { data, eylem } = useBilesenMantikHook()` çağıran bir aptal çiziciye (Dumb Renderer) dönüştürür.
3. **Seviye 3 (Domain Çöküşü - Son Çare):** Eğer asistan o UI componentinin kendi başına bambaşka bağlamlar, yığınla Context ihtiyacı veya sayfalar dolusu özel `type` gereksinimleri doğurduğunu fark ederse DÜZELTME YAPMAZ. Kullanıcıya dönüp **"Bu dosya artık bir component olmaktan çıktı. İzin verirseniz bu kodu `features/[yeni-özellik-adı]` isminde bağımsız bir Feature olarak ana klasöre çıkartıp mimarisini böleyim"** diye uyarır.

---

## 💾 Senaryo 7: Veritabanı Modeli (Prisma) Güncellemesi
**Kullanıcı Talebi:** *"Randevu tablosuna 'notlar' ve 'ucret' diye iki yeni alan ekleyelim."*

**Aksiyon Zinciri (Uçtan Uca Typings Senkronizasyonu):**
1. **Prisma Şeması:** İlk olarak projenin veritabanı iskeleti olan `schema.prisma` (varsa) dosyasını açıp ilgili modeli günceller. (Örn: `notlar String?`, `ucret Float`).
2. **Client Senkronizasyonu:** Kullanıcıdan bağımsız olarak arkaplanda derhal Prisma Client'i yeniden üretmeli/bildirmelidir.
3. **Zod Senkronizasyonu (KRİTİK):** Bu en önemli adımdır. Model güncellenir güncellenmez DERHAL ilgili feature'ın `[özellik].schemas.ts` dosyasına giderek Zod nesnelerini (`z.string().optional()`) yeni eklentilere göre revize eder. (Zod güncellenmezse, TanStack RPC `createServerFn.validator()` filtresi o alanları hırsız sanıp siler ve veritabanına boş kayıt atılır!)
4. **Form ve İstemci (Frontend):** UI katmanındaki Zod formunu günceller, yeni "Notlar" ve "Ücret" inputlarını çizer.
5. **Mutasyon:** Eğer TanStack Query tarafında eski bir önbellek (Cache) metodu varsa, güncellenen alanların patlamaması için gerekli kontrolleri ekler.

---

## 🗑️ Senaryo 8: Veri Silme (Güvenli CRUD) İşlemi
**Kullanıcı Talebi:** *"Kayıtlı randevuyu veya admin'i silebileceğimiz bir işlem yap."*

**Aksiyon Zinciri:**
1. **Zod Parametre Güvenliği (`.schemas.ts`):** Rastgele URL parametresi ile backend çökmemesi için sadece ID doğrulayan basit bir Zod Validation objesi (`DeleteRecordSchema = z.object({ id: z.string().uuid() })`) yazar.
2. **Server Stratejisi (`.server.ts`):** Prisma ile veritabanına `DELETE` sorgusu atmadan önce ilişkisel bir tablo olup olmadığını inceler. Gerekirse veriyi gerçekten silmek yerine **Soft-Delete** (Sadece `update { isActive: false }`) mi yapılması gerektiğini hesaba katar ve kodlar.
3. **TanStack Otoritesi (`.functions.ts`):** `createServerFn` üzerinden silme isteğini açarken, anonim misafirlerin (`Guest`) veya yetkisizlerin API'yi tetiklememesi için eğer Auth (Middleware) mekanizmamız varsa bunu guard olarak ekler.
4. **İyimser Silme (Optimistic Update):** Silme isteği başarılı olur olmaz kullanıcıyı bekletmemek için `feature.mutations.md` içindeki kurala uyar. API onayını beklemeden, butona tıklandığı ilk saniye kaydı tablodan silinmiş gibi UX yansıtması yapar. Eğer sunucu "Hayır silinemedi" derse, hata Toast'u fırlatıp arayüzü geri sarar (Rollback).
