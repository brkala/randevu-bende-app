# Bileşen (Component) Standartları

Bu döküman, yapay zeka asistanlarının (ve geliştiricilerin) UI bileşenlerini (components) oluştururken kullanması gereken temel kalıpları (blueprints) içerir. 

## 1. Basit React Bileşeni Şablonu

Eğer sadece basit, işlevsel ve varyantı olmayan bir React bileşeni isteniyorsa aşağıdaki standart, sade (bloatsız) kalıp kullanılır. Bileşen dışa aktarılırken `PascalCase` kullanılmalıdır (Ancak dosyanın adı kebab-case olmalıdır).

```tsx
import * as React from "react";
import { cn } from "../utils/cn"; 

export interface SimpleCardProps {
  title?: string;
  className?: string;
  children?: React.ReactNode;
}

export const SimpleCard = ({ className, title, children }: SimpleCardProps) => {
  return (
    <div className={cn("rounded-lg border shadow-sm", className)}>
      {title && <h3 className="font-semibold">{title}</h3>}
      <div className="p-4">{children}</div>
    </div>
  );
};
```

---

## 2. CVA (Class Variance Authority) İle Bileşen Şablonu

Eğer yeni bir bileşen istenirken **"CVA olsun"** veya **"Varyantları olsun"** denirse, aşağıdaki Base UI mimarisine uygun, gereksiz framework classlarından arındırılmış (minimum bloat) `Text` şablonu baz alınmalıdır:

```tsx
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../utils/cn";

// 1. CVA Tanımlaması (Çok sade, sadece gerekli varyantlar)
const textVariants = cva(
  "inline-block font-sans", 
  {
    variants: {
      color: {
        primary: "text-blue-600 dark:text-blue-400",
        secondary: "text-gray-600 dark:text-gray-400",
        danger: "text-red-600 dark:text-red-400",
      },
      size: {
        sm: "text-sm",
        base: "text-base",
        lg: "text-lg",
      }
    },
    defaultVariants: {
      color: "primary",
      size: "base"
    },
  }
);

// 2. Prop Tanımlaması (Sadece spesifik proplar + Polymorphic as + CVA propları)
export interface TextProps extends VariantProps<typeof textVariants> {
  as?: React.ElementType; // İstediğimiz HTML semantiğine (span, p, h1) çevirebilmek için
  className?: string;
  children?: React.ReactNode;
}

// 3. Bileşen Tanımlaması
export const Text = ({ className, color, size, as: Component = "span", children }: TextProps) => {
  return (
    <Component className={cn(textVariants({ color, size, className }))}>
      {children}
    </Component>
  );
};
```

### Yapay Zeka (AI) İçin Geliştirici Kuralları:
1. **Ref Kullanımı (React 19 Anti-Bloat):** React 19 standartlarına geçildiği için `forwardRef` kullanımı **TAMAMEN KALDIRILMIŞTIR**. Kullanıcı bileşen için "Ref desteği olan" dese bile asla `forwardRef` sarmalaması (wrapper) kullanma. Gerekirse `ref`'i sadece arayüze (interface) normal bir prop olarak ekle (`ref?: React.RefObject<HTMLDivElement>`) veya yay (`...props`). 
2. **Kalıtım ve Props (Anti-Bloat):** Özellikle istenmediği sürece `React.HTMLAttributes`'i extend etme ve kod içine default olarak `...props` yayma (spread). Sadece açıkça ihtiyaç duyduğun statik propları (örn: `className`, `children`, `title` vs.) tiplendir.
3. **Dosya İçi Sıralama (File Structure):** Aynı dosya içinde alt bileşen (sub-component) veya dışarıya kapalı private bir component oluşturulacaksa, bunlar dosyanın **en üst kısmına** (importların hemen altına) yazılmalıdır. Ana componentin CVA tanımlaması, arayüzü (interface) ve asıl (export edilen) component dosyanın **en aşağısına** yerleştirilmelidir.
4. **CVA Kullanım Limiti:** Eğer bileşendeki varyant ihtimalleri sadece basit boolean'lardan ibaretse (`isActive`, `isSelected` vb. iki durumlu), CVA **kullanma** (Bunun için ternary veya cn() yeterlidir). Ancak varyant ihtimalleri boolean sınırını geçtiğinde, yani 3 veya daha fazla seçenek barındırdığında (örn: `size: "sm" | "base" | "lg"`, `variant: "primary" | "secondary" | "danger"`) mimari gereği kesinlikle CVA kullan.
5. **CVA Type-Safety:** `VariantProps<typeof ...>` kullanarak varyant özelliklerinin tamamen Type-Safe olduğundan emin ol.
6. **BaseUI Doğası:** Esnek yapıya (headless/polymorphic) uyum sağlamak için gereksiz Tailwind class'ları doldurarak (bloat) kodu şişirme! Olabildiğince "minimal base" stiller ver.
7. **Dış Kaynak ve Base UI Mimarisi:** Senden standart, interaktif bir UI elementi yapman istenirse (Örn: "Bana bir Collapsible/Accordion/Dialog yap"), sıfırdan state veya headless mantık yazmaya kalkma. Mutlaka önce interneti ve [https://base-ui.com/react/components](https://base-ui.com/react/components) adresini tara (veya ilgili componentin alt linkini bul). Base UI dökümantasyonundaki en güncel yapıyı al ve projeye o şekilde entegre et (wrap et).
8. **İsimlendirme Bağlamı (Contextual Naming):** Yeni bir bileşen (component) oluştururken, bulunduğu `feature` (özellik) klasörünün adından ve bağlamından mutlaka ilham al. Geliştirici sadece "Card" dediyse bile, eğer o an `features/appointment/` klasöründe çalışıyorsan geliştiriciye `appointment-card.tsx` (AppointmentCard) gibi çok daha iyi ve domain'e uygun spesifik isimler öner.
9. **Paylaşılan Bileşenler (Shared Feature Uyarı):** Senden istenen bileşen projenin her yerinde, pek çok farklı feature içinde kullanılabilecek genel bir yapıdaysa (Örn: standart Button, Modal wrapper vs.), doğrudan işlem yapmak yerine geliştiriciyi uyar: "Bu genel bir bileşen, mimari bütünlük için bunun `features/shared/components` klasörüne konulması daha doğru olur." şeklinde yönlendirme yap.
10. **Dışa Aktarım (Named Exports):** Bileşenleri veya kodları asla `export default ComponentName` olarak dışa aktarma! Her zaman Named Export (`export const ComponentName = ...`) kuralına sadık kal. Bu, proje genelindeki import refactoring tutarlılığını korur.
11. **TanStack Start Direktifleri ("use client" / "use server"):** Klasik Next.js alışkanlıklarıyla dosyaların en tepesine kafana göre `"use client"` basma! TanStack Start'ın render mimarisi kendi kurallarına sahiptir. Mimari açıkça gerektirmedikçe bu Next.js direktiflerini koda sokuşturmaktan kaçın.
