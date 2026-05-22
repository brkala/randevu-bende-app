# Organizasyon, Roller ve Güvenlik Mimarisi

Bu döküman, Randevu Bende platformundaki kullanıcı türlerinin, işletme hesaplarının ve Süper Admin yapısının "Better Auth" ve "Prisma" üzerinde nasıl kurgulandığını ve uygulamanın güvenlik prensiplerini içerir.

## 1. Better Auth ve Rol Yönetimi

Sistemimiz B2B (Multi-Tenant) yapısında olduğu için, yetkilendirme süreçleri **Better Auth Organization** eklentisi kullanılarak yönetilecektir.

-   **Müşteri (Customer):** Sisteme üye olan standart kullanıcılardır. Sadece `User` tablosunda kayıtları bulunur. Hiçbir `Organization`'a üye (Member) olmadıkları için müşteri paneli ve favoriler ekranını kullanırlar.
-   **Dükkan Sahibi (Owner):** Bir abonelik başlattığında Better Auth üzerinden bir `Organization` oluşturulur ve kullanıcı bu organizasyonun `Owner`'ı olur.
-   **Çalışan / Personel (Worker):** Kendi kendilerine kayıt olamazlar. Dükkan sahibi panelden davet ettiğinde, ilgili `Organization`'a `Member` rolüyle eklenirler. Yönetim (Infra) paneline eriştiklerinde sadece bağlı oldukları organizasyonun verilerini görürler.

## 2. "Kimlik Kartı" ve "Yaka Kartı" Ayrımı (Profil İzolasyonu)

Bir kişinin global kimliği ile çalıştığı dükkandaki yetkisi ve unvanı birbirinden farklıdır. Bu nedenle Better Auth'un auth tablolarını kirletmemek için ayrı bir iş mantığı (Business Logic) tablosu kurgulanmıştır.

-   **Kimlik Kartı (`User` Tablosu):** E-posta, şifre ve gerçek isim burada tutulur. Bu bilgiler globaldir, değişmez.
-   **Yaka Kartı (`StaffProfile` Tablosu):** Bir personelin X dükkanında görünecek olan adı (Örn: "Ahmet Usta"), o dükkandaki unvanı (Örn: "Kıdemli Berber"), biyografisi ve o dükkana özel avatarı burada tutulur. 
    -   *Kural:* `StaffProfile` tablosu `userId` ve `shopId` ile çapraz referanslıdır (`@@unique([userId, shopId])`). Bir kişi farklı dükkanlarda farklı unvanlara sahip olabilir.

## 3. Dükkan (Shop) Tablosu Köprüsü

Better Auth'un oluşturduğu `Organization` tablosu sadece **yetki ve ekip yönetimi** için kullanılacaktır. Dükkanın adresi, vergi numarası, randevuları, çalışma saatleri gibi iş mantığı verileri asla Better Auth tablolarına eklenmeyecektir.

-   **Mimari:** Prisma'da `Organization` tablosu ile birebir (1-to-1) ilişkili bağımsız bir `Shop` tablosu oluşturulacaktır. (`Shop.organizationId = Organization.id`)
-   Böylece auth sistemi ile iş mantığı sistemi birbirinden tamamen izole kalır.

## 4. Süper Admin İzolasyonu

Süper Admin (Sistem Yöneticisi), "Müşteri, Patron, Çalışan" hiyerarşisinin tamamen dışındadır. 

-   **Bağımsız Tablo:** Süper adminlerin bilgileri `User` tablosunda veya herhangi bir `Organization`'da **TUTULMAYACAKTIR**. Güvenlik gereği veritabanında tamamen ayrı bir `SuperAdmin` tablosunda barındırılacaktır.
-   **Domain ve Rota İzolasyonu:** Süper admin paneline normal dükkan/müşteri girişlerinden erişilemez. Sadece `.env` dosyasında belirlenen `SUPERADMIN_DOMAIN` (Örn: `yonetim.randevubende.app`) üzerinden gelen isteklere yanıt verir.
-   Bu yapı, standart kullanıcı akışında bulunabilecek bir zafiyetin tüm sistemi riske atmasını (Blast Radius) engeller.

## 5. Frontend Kod Güvenliği ve Sızıntı Gerçeği

TanStack Start tek bir monolith proje olduğu için (Code-Splitting kullanılsa dahi) bir saldırgan ana sayfadayken, router manifest dosyasını inceleyerek statik `/admin` JS dosyalarını indirebilir. 

Bu durum modern SPA mimarilerinde beklenen bir durumdur. Bunun bir güvenlik açığına dönüşmemesi için **Altın Kural:**

> **FRONTEND KODUNDA ASLA SECRET (GİZLİ BİLGİ) TUTULMAZ!**
> İndirilen JS dosyaları sadece boş butonlar ve formlardan (Aptal Vitrin) ibarettir.
> Güvenliğin kalbi **Backend'dir (Server Functions)**. Tıklanan bir "Kullanıcıyı Sil" butonuna karşılık API tarafında kullanıcının Session'ı ve SuperAdmin tablosunda olup olmadığı mutlak suretle denetlenmelidir (403 Forbidden). Frontend'in koruması sadece UX içindir, asıl güvenlik arka plandadır.
