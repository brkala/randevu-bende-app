# Email (E-Posta Yönetimi) Özelliği

Projemizde "Zaman" ve "Geliştirici Mutluluğu" kavramlarını desteklemek; uygulamadan atılan bildirim ve bültenlerin (Ödeme faturası, şifre değişikliği) Outlook veya Apple Mail gibi farklı render motoruna sahip istemcilerde kusursuz ve uyumlu gözükmesini sağlamak için kurgulanan iletişim merkezidir.

"Sıfır-Global" (Zero-Global) mimarimizde e-posta servisi tamamen yalıtılır ve `src/features/email/` özelliği altında yaşar.

## Temel Teknolojiler
- **Servis Sağlayıcı (Gönderim):** Resend API
- **Şablon Motoru (UI):** React Email (`@react-email/components`)
- **Gelen Kutusu (İnsanlar İçin):** Zoho Mail (Ücretsiz Kurumsal Mail planı ile)

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

HTML E-posta kodlaması web standartlarının (CSS/Grid/Flex) çok gerisinde olduğu için klasik olarak çok çirkin `<table>` kodlaması zorunludur. Ancak **Yapay Zeka asistanları ve Geliştiriciler ASLA eski nesil e-posta (HTML table) kodu YAZMAZ.**

1. Bütün şablonlar `features/email/templates` altında standart bir React Component'i statüsünde oluşturulur.
2. Tasarım için TailwindCSS ve React Email'in sunduğu özel `<Container>`, `<Row>`, `<Column>`, `<Text>` gibi "primitive" componentler modüler olarak kullanılır.
3. Component kullanılarak e-postaya ait "props"lar (Örn: `userName`, `shopName`) sisteme tip güvenli (Type-safe) şekilde yedirilir.
4. Gönderme esnasında, `render(<WelcomeEmail />)` fonksiyonu çağrılır ve kütüphane bütün modern Tailwind/React yapınızı Outlook ve türevlerinin dahi bozmadan okuyacağı hatasız "Inline-CSS Table" formlarına dönüştürüp Resend'e kargo için teslim eder.

## İletişim (Zoho Mail) Kuralı

Kurumsal `iletisim@randevubende.com` vs adreslerine gelen mailler uygulamanın değil, projenin ekibinin/yöneticilerin okuması gereken destek kayıtlarıdır. VPS'in yorulmaması (ve olası SPAM tehlikesi) gibi amaçlardan dolayı hiçbir mail trafiği projede tutulmaz. Özel iletişim mailleri ve DNS kayıtları (MX vb.) VPS dışında **Zoho Mail** aracılığıyla tamamen harici ve ücretsiz olarak yönetilir.
