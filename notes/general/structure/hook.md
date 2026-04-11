# React Hook (Özel Kanca) Standartları

Bu döküman, yapay zeka asistanlarının (ve geliştiricilerin) projede yeni bir Custom Hook yazarken kullanması gereken temel mimari kalıpları (blueprints) içerir.

## 1. Rooks Kütüphanesi Kontrolü (Ön Şart)
Projeye yeni bir genel amaçlı (utility) hook eklenmeden önce **MUTLAKA** projede yüklü olan `rooks` kütüphanesi kontrol edilmelidir. 
Örneğin; `useOnClickOutside`, `useWindowSize`, `useDebounce`, `useLocalStorage` gibi yaygın web işlevlerini sıfırdan yazarak (reinventing the wheel) projeyi çöplüğe çevirmeyin. Varsa direkt `rooks` üzerinden importlayın.

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

  // 3. İç metodlar gereksiz re-render'ı önlemek için useCallback ile sarmalanır
  const increment = React.useCallback(() => {
    setCount((prev) => prev + step);
  }, [step]);

  const decrement = React.useCallback(() => {
    setCount((prev) => prev - step);
  }, [step]);

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
3. **Dışa Aktarım (Named Export):** Tıpkı componentlerdeki gibi `export default hookAdı` KESİNLİKLE yasaktır! Her kanca Named Export (`export const ...`) ile dışarı çıkarılmalıdır.
4. **Parametre Tasarımı (Anti-Bloat):** Bir hook 2 veya daha fazla parametre alacaksa bunları fonksiyon içerisine tekil olarak (`const useA = (id, name, age) => ...`) DİZME. Her zaman destructure edilebilen bir interface objesi yarat (`export interface UseAProps {...}`).
5. **Dönüş Değeri (Return Object):** Sadece spesifik olarak belirtilmediyse (ve çok basit değilse), kancaları `[state, setState]` dizisi (tuple) yerine Obje olarak geri döndür (`return { state, setState }`). Bu, ileride kancaya yeni bir özellik eklendiğinde array sırasını bozup diğer bağlı bileşenleri patlatmamızı engeller.
