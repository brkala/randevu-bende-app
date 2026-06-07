# Email (E-Posta Yönetimi) Özelliği

Uygulamadan atılan e-postaların (Ödeme faturası, şifre değişikliği vb.) tüm e-posta istemcilerinde uyumlu gözükmesini sağlamak için kurgulanan iletişim merkezidir.

E-posta servisi tamamen yalıtılır ve `src/features/email/` özelliği altında yaşar.

## Temel Teknolojiler
- **Servis Sağlayıcı (Gönderim):** Resend API
- **Şablon Motoru (UI):** React Email (`@react-email/components`)
- **Gelen Kutusu (Destek):** Zoho Mail (Ücretsiz Kurumsal Mail planı)

## Yapısal Tasarım

```text
src/
└── features/
    └── email/
        ├── templates/
        │   ├── welcome-email.tsx            // React Email ve Tailwind ile yazılan modern Şablon
        │   └── appointment-cancel-email.tsx 
        ├── lib/
        │   └── resend.client.ts            // Resend API'sinin başlatıldığı tek yer
        └── email.functions.ts               // Mail gönderme tetiği (Diğer feature'ların çağıracağı RPC)
```

## Mimari Kurallar (React Email Kullanımı)

Geliştiriciler ve AI asistanları e-posta gönderim şablonları için asla eski nesil HTML/table kodlaması yazmaz.

1. Bütün şablonlar `features/email/templates` altında standart React bileşeni olarak oluşturulur.
2. Tasarım için TailwindCSS ve React Email'in sunduğu `<Container>`, `<Row>`, `<Column>`, `<Text>` gibi hazır bileşenler kullanılır.
3. Gönderim esnasında `render(<Template />)` fonksiyonu çağrılır; kütüphane React kodunu Outlook vb. istemcilerle uyumlu Inline-CSS HTML formatına dönüştürüp Resend API'sine iletir.

## İletişim (Zoho Mail) Kuralı

Kurumsal e-posta adreslerine (`iletisim@randevubende.com` vb.) gelen destek ve iletişim mailleri VPS dışında **Zoho Mail** aracılığıyla tamamen harici ve ücretsiz yönetilir. Sunucu üzerinde posta kutusu barındırılmaz.
