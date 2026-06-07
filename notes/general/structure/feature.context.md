# Feature Context Şablonu (constate ile)

Bu döküman, bir feature içindeki karmaşık state yönetimi için `constate` kütüphanesini kullanarak nasıl izole ve performanslı bir Context yapısı kurulacağını açıklar.

## 1. Neden constate?
- **Minimal Boilerplate:** `Provider` ve `useContext` kalıplarını tek satırda oluşturur.
- **Single Source of Truth:** Sadece bir custom hook yazarız, `constate` bunu otomatik olarak Context'e dönüştürür.
- **SSR Friendly:** React ağacına bağlı olduğu için TanStack Start (SSR) ile tam uyumludur.

---

## 2. Şablon Yapısı (Şablon: `appointment-wizard.context.tsx`)

```tsx
import { constate } from "constate";
import * as React from "react";

// 1. İş Mantığı Hook'u (Tüm state ve logic burada toplanır)
function useAppointmentWizard() {
  const [currentStep, setCurrentStep] = React.useState(1);

  const nextStep = () => setCurrentStep((p) => p + 1);
  const prevStep = () => setCurrentStep((p) => Math.max(1, p - 1));

  // DİKKAT: React Compiler sayesinde useMemo veya useCallback KULLANMAYA GEREK YOKTUR!
  return {
    currentStep,
    nextStep,
    prevStep,
  };
}

// 2. Constate ile Context'e Dönüştürme
export const [AppointmentWizardProvider, useAppointmentWizardContext] = constate(useAppointmentWizard);
```

---

## 3. Yapay Zeka (AI) İçin Geliştirici Kuralları:

1. **Dosya İsimlendirmesi:** Context dosyaları her zaman ilgili `feature` dizini içindeki `contexts/` klasöründe yer alır. İsimlendirme formatı kebab-case olmalı ve sonu `.context.tsx` ile bitmelidir. (Örn: `features/appointment/contexts/appointment-wizard.context.tsx`).
2. **React Compiler Uyumu:** `constate` içindeki hook'ta `React.useMemo` veya `React.useCallback` **KULLANILMAMALIDIR**. Tüm optimizasyonlar derleyici tarafından otomatik yapılır.
3. **Tek Kaynak (Single Hook):** Context'e eklenecek tüm mantığı önce saf bir hook (`useMyFeature`) olarak yaz, sonra `constate(...)` ile sarmala.
4. **Hata Yönetimi:** `constate` tarafından oluşturulan `use...Context` kancası, eğer bir `Provider` dışında çağrılırsa otomatik olarak hata fırlatır. Bu yüzden ek bir hata kontrolü yazmaya gerek yoktur.
5. **Dışa Aktarım:** Sadece `Provider` ve `use...Context` kancasını named export olarak dışa aktar.
6. **Küçük Parçalar:** Proje genelini etkileyen "dev" contextler yerine, her modüle (wizard, filters, sidebar vb.) özel küçük contextler oluşturmayı tercih et.
