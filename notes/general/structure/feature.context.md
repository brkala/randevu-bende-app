# Context (Durum Yönetimi) Standartları

Bu döküman, çoklu bileşenler (components) arası derin prop aktarımını (Prop Drilling) engellemek amacıyla kullanılan React Context yapılarının, ait oldukları feature içindeki `contexts/` klasöründe nasıl oluşturulması gerektiğini belirler.

---

## 1. Ne Zaman Context Kullanılmalı? (Zorunlu Sorgu)

Yapay zeka asistanları veya geliştiriciler, durum yönetimi için Context tetiğine basmadan önce şu değerlendirmeyi yapmalıdır:

- **Veri Sunucudan (Backend/DB) geliyorsa:** Context **KULLANILMAZ!** Sunucudan gelen veriler için tek yetkili `TanStack Query`'dir.
- **Kısa Mesafeli İletişim:** Eğer veri sadece ebeveynden-çocuğa (Parent-to-Child) 1-2 kademe iniyorsa Context ile uğraşma, standart Prop'lar yeterlidir.
- **Doğru Kullanım Senaryosu:** Sadece istemciyi (UI) ilgilendiren, 3 ve üzeri alt bileşene dağıtılması gereken, çok adımlı sayfalar (Örn: Wizard/Step mekanizmaları), Filter bar durumları, kompleks etkileşimli yerel UI bütünlüklerinde Context kullanılır.

---

## 2. Güvenli Context Şablonu

Oluşturulan her context dosyası; **Context Tanımı**, **Provider (Sağlayıcı)** ve **Custom Consumer Hook** olmak üzere aynı dosyada 3 standart parçadan oluşmalıdır.

```typescript
import * as React from "react";

// 1. Tip Tanımlaması (State arayüzü)
interface AppointmentWizardState {
  currentStep: number;
  nextStep: () => void;
  prevStep: () => void;
}

// 2. Context'in Kendisi (Başlangıç değeri null olabilir çünkü Provider ile kullanılmak zorundadır)
const AppointmentWizardContext = React.createContext<AppointmentWizardState | null>(null);

// 3. Provider Bileşeni
export const AppointmentWizardProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentStep, setCurrentStep] = React.useState(1);

  const nextStep = () => setCurrentStep((p) => p + 1);
  const prevStep = () => setCurrentStep((p) => Math.max(1, p - 1));

  // 4. DİKKAT: React Compiler sayesinde useMemo veya useCallback KULLANMAYA GEREK YOKTUR!
  const value = {
    currentStep,
    nextStep,
    prevStep,
  };

  return (
    <AppointmentWizardContext.Provider value={value}>
      {children}
    </AppointmentWizardContext.Provider>
  );
};

// 5. Consumer Hook (Provider dışında çağırılırsa çökmeyi -undefined- yakalayan koruma!)
export const useAppointmentWizardContext = () => {
  const context = React.useContext(AppointmentWizardContext);
  if (!context) {
    throw new Error(
      "useAppointmentWizardContext must be used within an AppointmentWizardProvider"
    );
  }
  return context;
};
```

---

### Yapay Zeka (AI) İçin Geliştirici Kuralları:

1. **Dosya İsimlendirmesi:** Context dosyaları her zaman ait olduğu `feature` dizini altında, `contexts/` klasöründe yer alır. İsimlendirme formatı kebab-case olmalı ve sonu `.context.tsx` ile bitmelidir. (Örn: `appointment-wizard.context.tsx`).
2. **React Compiler İle Otomatik Memoization:** React Compiler kullanıldığı için `React.useMemo` veya `React.useCallback` **KULLANILMAMALIDIR**. Provider referans yenilenmesi ve tüm memoizasyon işlemleri statik analizle derleyici (compiler) tarafından otomatik olarak yönetilir. Kodu düz ve okunabilir bırak.
3. **Dışa Aktarım (Export) Kısıtlaması:** Geliştiricinin dış dünyada el ile hata yapma riski taşıyan `React.useContext(AppointmentWizardContext)` kodunu yazmasına EKRAN/API İZNİ VERME. Orijinal Context yapısını (`AppointmentWizardContext`) dışarıya export etme! Sadece `Provider` componentini ve Error korumalı `use...Context` kancasını dışa aktar (`export const useAppointmentWizardContext`).
4. **Veri Kirliliği Yanılgısı:** Projenin veya özelliğin her tarafında ulaşılabilen devasa "God Object" Context'ler yaratma! Contextleri sadece belli bir amaca (Örn: sadece o form büyücüsüne) özgü küçük ve kapsüle edilmiş parçalar halinde teklif et.
