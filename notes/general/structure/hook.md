# React Hook (Özel Kanca) Standartları

Bu döküman, projedeki Custom Hook yazım standartlarını ve temel mimari kalıpları içerir.

## 1. Rooks Kütüphanesi Kontrolü (Ön Şart)
Projeye yeni bir genel amaçlı (utility) hook eklenmeden önce **MUTLAKA** projede yüklü olan `rooks` kütüphanesi kontrol edilmelidir. `useOnClickOutside`, `useWindowSize`, `useDebounce`, `useLocalStorage` gibi yaygın işlevler varsa direkt `rooks` üzerinden import edilmelidir.

---

## 2. Standart Özel Kanca (Custom Hook) Şablonu

Bileşenlerden (components) iş mantığını (business logic) ayırmak (decoupling) için yazılan dosyalarda aşağıdaki şablon kullanılmalıdır.

```typescript
import * as React from "react";

// 1. Parametreler (Props) Obje Olarak Tiplendirilmelidir
export interface UseCounterProps {
  initialValue?: number;
  step?: number;
}

// 2. Her zaman Named Export kullanılır
export const useCounter = ({ initialValue = 0, step = 1 }: UseCounterProps = {}) => {
  const [count, setCount] = React.useState(initialValue);

  // 3. İç metodların referans sabitliği React Compiler tarafından otomatik sağlanır. useCallback YAZILMAZ!
  const increment = () => {
    setCount((prev) => prev + step);
  };

  const decrement = () => {
    setCount((prev) => prev - step);
  };

  // 4. İleride genişletilmesi kolay olsun diye Tuple [a, b] yerine Obje { a, b } döndürülür
  return {
    count,
    increment,
    decrement,
  };
};
```

### Yapay Zeka (AI) İçin Geliştirici Kuralları:

1. **Dosya İsimlendirmesi:** Hook dosyaları kesinlikle `use-` önekiyle ve `kebab-case` formatında adlandırılmalıdır (Örn: `use-appointment-form.ts`).
2. **Fonksiyon İsimlendirmesi:** İçerideki kanca fonksiyonu standart React kuralı gereği `camelCase` olmalıdır (Örn: `useAppointmentForm`).
3. **Dışa Aktarım (Named Export):** `export default hookAdı` KESİNLİKLE yasaktır! Her kanca Named Export (`export const ...`) ile dışarı çıkarılmalıdır.
4. **Parametre Tasarımı (Anti-Bloat):** Bir hook 2 veya daha fazla parametre alacaksa bunları fonksiyon içerisine tekil olarak dizmeyin, her zaman destructure edilebilen bir interface objesi yaratın.
5. **Dönüş Değeri (Return Object):** Kancaları tuple (dizi) yerine nesne olarak geri döndürün (`return { state, setState }`). Bu, ileride yeni alanlar eklendiğinde dizi sırasının bozulmasını engeller.
