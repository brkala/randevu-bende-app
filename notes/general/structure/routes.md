# Yönlendirme ve Sayfalar (Routes & Routing) Standartları

Bu döküman, TanStack Router (Start) ile kullanılacak **Dosya-Tabanlı Yönlendirme (File-Based Routing)** sisteminin, projemizdeki `features` (özellik) mimarisiyle nasıl bütünleşmesi gerektiğini belirler.

TanStack projelerindeki tüm saf rotalar `app/routes/` veya mimari tercihe göre `src/routes/` altında tutulur.

## 1. Altın Kural: "Aptal Rotalar (Dumb Routes)"

Route dosyalarının (Örn: `routes/admin/appointments.tsx`) **içerisi ASLA ağır iş mantığı (business logic), state tanımları veya 500 satırlık devasa JSX hiyerarşisi (UI) İÇEREMEZ!**

Route dosyaları mimaride sadece bir **"Kapsayıcı (Wrapper) ve Bağlayıcı"** roldedir. Orası bir mutfak değil, servis penceresidir. 

**DOĞRU route örneği:**
```tsx
import { createFileRoute } from '@tanstack/react-router'
// İşi yapan asıl bileşeni (Feature) çağırıyoruz
import { AdminAppointmentLayout } from '@/features/admin-appointments/components/admin-appointment-layout'

export const Route = createFileRoute('/admin/appointments')({
  component: RouteComponent,
})

function RouteComponent() {
  // Sıfır karmaşa, sayfa sadece Layout'u render ediyor
  return <AdminAppointmentLayout />
}
```

Eğer bir route dosyasının içinde doğrudan `<button>`, `<div>` veya UI elementleri ve bolca `useState` görüyorsanız, bu o geliştiricinin "Feature Temelli" yapıyı ihlal ettiğini gösterir (UI kodları `features` içine gitmelidir).

---

## 2. Loader ve Prefetching Kuralı (`loader`)

`feature.queries.md` dökümanında belirtildiği üzere; proje **"Render-As-You-Fetch"** (Yüklerken Render Et) mantığıyla çalışır. Route dosyasında bileşen ekrana çizilmeden hemen önce ihtiyaç duyulan ilk ve kritik veriler, Route'un **mutlaka** `loader` bölümünde TanStack Query yardımıyla çağrılmalıdır.

```typescript
import { createFileRoute } from '@tanstack/react-router'
import { appointmentQueries } from '@/features/appointment/appointment.queries'
import { userQueries } from '@/features/user/user.queries'

export const Route = createFileRoute('/appointments/$appointmentId')({
  // Sayfa yüklenmeden önce çalışır! (Server/Client bağımsız prefetch)
  loader: async ({ context: { queryClient }, params: { appointmentId } }) => {
    // Verileri Query Factory'den al. Eğer veri sırası (birinin cevabı diğerine argüman olmak) 
    // zorunda DEĞİLSE, şelale (waterfall) yaratmamak için DAİMA Promise.all kullanılarak paralel prefetch at!
    await Promise.all([
      queryClient.ensureQueryData(appointmentQueries.detail(appointmentId)),
      queryClient.ensureQueryData(userQueries.profile()),
    ])
  },
  component: AppointmentDetailLayout, // Features dizininden gelir
})
```

---

## 3. Güvenlik, Yönlendirme ve Middleware Dizilimi (`beforeLoad`)

Sayfaya girmeden önce kullanıcının "Giriş Yapmış Mı?" (Auth Status) veya "Yetkisi Var Mı?" (RBAC) sorgusu Route katmanında yapılmalıdır. Bu işlem UI katmanındaki bir `useEffect` içerisine YAZILAMAZ. TanStack Router bunun için bir **Middleware (Ara Katman)** zinciri gibi çalışan `beforeLoad` kancasını sunar.

Route hiyerarşisinde `beforeLoad`, en üst rotadan (`__root.tsx`) başlayıp ziyaret edilecek en alt rotaya doğru sırayla çalışır. Bu yapı, NextJS'teki middleware dosyasına veya Express.js'teki guard mantığına tekabül eder.

```typescript
import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/dashboard')({
  // Sayfa/Loader başlamadan önce yetki kilidini kontrol eder
  beforeLoad: async ({ context }) => {
    if (!context.auth.isAuthenticated) {
      // Eğer yetki yoksa derhal login sayfasına sepetle
      throw redirect({
        to: '/login',
        search: {
          redirectUrl: '/admin/dashboard', // Geri döneceği yer
        },
      })
    }    
  },
  component: DashboardLayout,
})
```

---

### Yapay Zeka (AI) İçin Geliştirici Kuralları:

1. **Route Tembelliği Yasağı:** Birisi "Admin için bir Dashboard sayısı oluştur" dediğinde o Route dosyasının (Örn: `routes/admin/index.tsx`) içine girip 300 satırlık Tailwind tasarımı kurgulama. Route'u aç, içine `<AdminDashboardLayout />` yazıp kapat. Sonra git ilgili CSS ve Mantığı `features/admin-dashboard/components/` içine inşa et.
2. **Waterfall Yasak (Promise.all Şartı):** Router'ı tasarlarken component'in ihtiyaç duyduğu API beslemelerini (Fetch) `loader` içine alıyorsun. Ancak birden fazla sorgu çalışacaksa ve birinin sonucu diğerini bağlamıyorsa, alt alta sıralı `await` yazarak projeyi yavaşlatma (sıralı şelale efekti). Hepsini mutlak surette `await Promise.all([ ... ])` içine atarak paralel (eşzamanlı) çalışmaya zorla.
3. **Middleware Zinciri (`beforeLoad`):** Redirection (Yönlendirme) işlemleri asla sayfa içi React componentlerinde (`navigate({ to: ... })` vs) yapılmaz. Component ayağa kalkmadan önce `beforeLoad` (Router'ın Middleware Katmanı) ile sunucudan veya istemciden engellenmeli veya sekmelidir. Üst ana rotadaki `beforeLoad` kodunun, iç içe (nested) tüm alt rotaları koruyan bir middleware olduğu unutulmamalıdır.
