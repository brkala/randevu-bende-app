# Yönlendirme ve Sayfalar (Routes & Routing) Standartları

Bu döküman, TanStack Router (Start) ile kullanılacak **Dosya-Tabanlı Yönlendirme (File-Based Routing)** sisteminin, projemizdeki `features` (özellik) mimarisiyle nasıl bütünleşmesi gerektiğini belirler.

TanStack projelerindeki tüm saf rotalar `app/routes/` veya mimari tercihe göre `src/routes/` altında tutulur.

## 1. Altın Kural: "Aptal Rotalar (Dumb Routes)"

Route dosyalarının (Örn: `routes/admin/appointments.tsx`) **içerisi ASLA ağır iş mantığı (business logic), state tanımları veya devasa JSX hiyerarşisi (UI) İÇEREMEZ!**

Route dosyaları mimaride sadece bir **"Kapsayıcı (Wrapper) ve Bağlayıcı"** roldedir. Orası bir mutfak değil, servis penceresidir. 

**DOĞRU route örneği:**
```tsx
import { createFileRoute } from '@tanstack/react-router'
import { AdminAppointmentLayout } from '@/features/admin-appointments/components/admin-appointment-layout'

export const Route = createFileRoute('/admin/appointments')({
  component: RouteComponent,
})

function RouteComponent() {
  return <AdminAppointmentLayout />
}
```

Eğer bir route dosyasının içinde doğrudan `<button>`, `<div>` veya UI elementleri ve bolca `useState` görüyorsanız, bu o geliştiricinin "Feature Temelli" yapıyı ihlal ettiğini gösterir (UI kodları `features` içine gitmelidir).

---

## 2. Loader ve Prefetching Kuralı (`loader`)

Proje **"Render-As-You-Fetch"** (Yüklerken Render Et) mantığıyla çalışır. Sayfa yüklenmeden önce ihtiyaç duyulan ilk ve kritik veriler, Route'un **loader** bölümünde TanStack Query yardımıyla çağrılmalıdır.

```typescript
import { createFileRoute } from '@tanstack/react-router'
import { appointmentQueries } from '@/features/appointment/appointment.queries'
import { userQueries } from '@/features/user/user.queries'

export const Route = createFileRoute('/appointments/$appointmentId')({
  loader: async ({ context: { queryClient }, params: { appointmentId } }) => {
    // Verileri Query Factory'den al. Eğer veri sırası (birinin cevabı diğerine argüman olmak) 
    // zorunda DEĞİLSE, şelale (waterfall) yaratmamak için DAİMA Promise.all kullanılarak paralel prefetch at!
    await Promise.all([
      queryClient.ensureQueryData(appointmentQueries.detail(appointmentId)),
      queryClient.ensureQueryData(userQueries.profile()),
    ])
  },
  component: AppointmentDetailLayout,
})
```

---

## 3. Güvenlik, Yönlendirme ve Middleware Dizilimi (`beforeLoad`)

Sayfaya girmeden önce yetki veya oturum sorgusu Route katmanında yapılmalıdır. Bu işlem UI katmanındaki bir `useEffect` içerisine yazılamaz. TanStack Router bunun için bir **Middleware (Ara Katman)** gibi çalışan `beforeLoad` kancasını sunar.

`beforeLoad`, en üst rotadan başlayıp ziyaret edilecek en alt rotaya doğru sırayla çalışır.

```typescript
import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/dashboard')({
  beforeLoad: async ({ context }) => {
    if (!context.auth.isAuthenticated) {
      throw redirect({
        to: '/login',
        search: {
          redirectUrl: '/admin/dashboard',
        },
      })
    }    
  },
  component: DashboardLayout,
})
```

---

### Yapay Zeka (AI) İçin Geliştirici Kuralları:

1. **Route Tembelliği Yasağı:** Route dosyasının içine girip tasarımlar yapmayın. Rota dosyasını açıp içine Layout componentini yazıp kapatın. Asıl tasarım kodunu `features/[özellik]/components/` içine yazın.
2. **Waterfall Yasak (Promise.all Şartı):** Loader içinde birden fazla sorgu çalışacaksa ve birbirine bağımlı değillerse, `await Promise.all([ ... ])` kullanarak paralel çalıştırın.
3. **Middleware Zinciri (`beforeLoad`):** Yönlendirmeler (redirection) React bileşenleri içinde değil, `beforeLoad` ile sunucuda veya istemcide pre-render aşamasında yapılmalıdır.
