# Organizasyon, Roller ve Güvenlik Mimarisi

Bu döküman, kullanıcı türlerinin, işletme hesaplarının ve Süper Admin yapısının "Better Auth" ve "Prisma" üzerinde kurgulanma detaylarını ve güvenlik prensiplerini içerir.

## 1. Better Auth ve Rol Yönetimi

Sistem B2B (Multi-Tenant) yapısında olduğundan, yetkilendirme süreçleri **Better Auth Organization** eklentisiyle yönetilir.

-   **Müşteri (Customer):** Standart kullanıcılardır. Sadece `User` tablosunda kayıtlıdırlar. Herhangi bir `Organization` üyesi olmadıklarından müşteri paneli ve favoriler ekranını kullanırlar.
-   **Dükkan Sahibi (Owner):** Abonelik başlattığında Better Auth üzerinde bir `Organization` oluşturulur ve kullanıcı bu yapının sahibi (Owner) olur.
-   **Çalışan / Personel (Worker):** Kendi kendilerine kayıt olamazlar. Dükkan sahibi tarafından davet edilerek ilgili `Organization`'a `Member` rolüyle eklenirler. Sadece kendi organizasyon verilerini görürler.

## 2. "Kimlik Kartı" ve "Yaka Kartı" Ayrımı (Profil İzolasyonu)

Global kimlik ile çalışılan dükkandaki unvan ve yetki ayrılmıştır. Auth tablolarını kirletmemek için ayrı iş mantığı tablosu kullanılır.

-   **Kimlik Kartı (`User` Tablosu):** E-posta, şifre ve gerçek isim gibi global, değişmeyen bilgiler tutulur.
-   **Yaka Kartı (`StaffProfile` Tablosu):** Personelin dükkanda görünecek adı (Ahmet Usta), unvanı (Kıdemli Berber), biyografisi ve dükkana özel avatarı tutulur. 
    -   *Kural:* `StaffProfile` tablosu `userId` ve `shopId` ile çapraz referanslıdır (`@@unique([userId, shopId])`).

## 3. Dükkan (Shop) Tablosu Köprüsü

Better Auth `Organization` tablosu sadece yetki ve ekip yönetimi için kullanılır. Dükkan adresi, çalışma saatleri vb. veriler auth tablolarına eklenmez.

-   **Mimari:** Prisma'da `Organization` tablosu ile birebir (1-to-1) ilişkili bağımsız bir `Shop` tablosu oluşturulur (`Shop.organizationId = Organization.id`).

## 4. Süper Admin İzolasyonu

Süper Admin, standart kullanıcı hiyerarşisinin dışındadır.

-   **Bağımsız Tablo:** Süper admin bilgileri `User` veya `Organization` tablolarında tutulmaz. Veritabanında ayrı bir `SuperAdmin` tablosunda barındırılır.
-   **Domain ve Rota İzolasyonu:** Süper admin paneline normal ekranlardan erişilemez. Sadece `.env` içerisindeki `SUPERADMIN_DOMAIN` (Örn: `yonetim.randevubende.app`) üzerinden gelen isteklere yanıt verir.

## 5. Frontend Kod Güvenliği ve Sızıntı Gerçeği

TanStack Start monolith yapıda olduğundan, router manifest dosyası incelenerek statik `/admin` JS dosyaları indirilebilir. Bu durumun güvenlik açığı oluşturmaması için:

> **FRONTEND KODUNDA ASLA SECRET (GİZLİ BİLGİ) TUTULMAZ!**
> İstemci dosyaları boş buton ve formlardan ibarettir. 
> Güvenliğin kalbi **Backend'dir (Server Functions)**. Her kritik işlem (Örn: kullanıcı silme) sunucu tarafında Session ve SuperAdmin kontrolleriyle (403 Forbidden) denetlenir.
