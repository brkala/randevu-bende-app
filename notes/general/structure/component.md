# Bileşen (Component) Standartları

Bu döküman, UI bileşenlerini (components) oluştururken kullanılması gereken temel kalıpları (blueprints) içerir. 

## 1. Basit React Bileşeni Şablonu

Eğer varyantı olmayan basit bir React bileşeni isteniyorsa aşağıdaki standart kalıp kullanılır. Bileşen dışa aktarılırken `PascalCase` kullanılmalıdır (Ancak dosyanın adı kebab-case olmalıdır).

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

## 2. Tailwind Variants (tv) İle Bileşen Şablonu

Eğer yeni bir bileşen için **"Varyantları olsun"** veya **"Çok parçalı (Slots) olsun"** denirse, aşağıdaki Ark UI mimarisine uygun, `tailwind-variants` bazlı `Text` şablonu kullanılmalıdır:

```tsx
import * as React from "react";
import { tv, type VariantProps } from "tailwind-variants";

// 1. TV Tanımlaması (Slots ve Responsive desteği ile)
const textVariants = tv({
  base: "inline-block font-sans",
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
});

// 2. Prop Tanımlaması
export interface TextProps extends VariantProps<typeof textVariants> {
  as?: React.ElementType;
  className?: string;
  children?: React.ReactNode;
}

// 3. Bileşen Tanımlaması
export const Text = ({ className, color, size, as: Component = "span", children }: TextProps) => {
  return (
    <Component className={textVariants({ color, size, className })}>
      {children}
    </Component>
  );
};
```

---

## 3. Ladle Hikaye (Story) Şablonu (Sadece Temel UI Elemanları İçin)

Temel UI elemanları (`src/features/shared/components/ui/` altındakiler) için Ladle hikayeleri yazılmalıdır. Bu hikayeler dinamik `args` ve `argTypes` yapılandırmasını içermelidir:

```tsx
import type { Story } from "@ladle/react";
import { Button, type ButtonProps } from "./button";

export const Default: Story<ButtonProps> = ({ variant, size, fullWidth, ...props }) => {
  return (
    <Button variant={variant} size={size} fullWidth={fullWidth} {...props}>
      Button Text
    </Button>
  );
};

Default.args = {
  variant: "primary",
  size: "md",
  fullWidth: false,
};

Default.argTypes = {
  variant: {
    options: ["primary", "secondary", "outline", "ghost", "danger", "success"],
    control: { type: "select" },
  },
  size: {
    options: ["sm", "md", "lg"],
    control: { type: "select" },
  },
  fullWidth: {
    control: { type: "boolean" },
  },
};
```

### Yapay Zeka (AI) İçin Geliştirici Kuralları:
1. **Ref Kullanımı (React 19 Anti-Bloat):** React 19 standartlarına geçildiği için `forwardRef` kullanımı **TAMAMEN KALDIRILMIŞTIR**. `ref` normal bir prop olarak eklenmeli (`ref?: React.RefObject<HTMLDivElement>`) veya yayılmalıdır (`...props`). 
2. **Kalıtım ve Props:** Gerekmedikçe `React.HTMLAttributes`'i extend etmeyin ve default olarak `...props` yaymayın. Sadece ihtiyaç duyulan statik propları (örn: `className`, `children`, `title` vb.) tanımlayın.
3. **Dosya İçi Sıralama:** Alt bileşenler veya özel componentler dosyanın **en üst kısmına** yazılmalıdır. Ana componentin `tv` tanımlaması, interface'i ve asıl component dosyanın **en aşağısına** yerleştirilmelidir.
4. **Kullanım Limiti:** Varyant ihtimalleri sadece basit boolean'lardan ibaretse `tv` **kullanmayın** (`cn()` yeterlidir). Varyantlar boolean sınırını geçtiğinde veya çok parçalı (Slots) yapılarda `tailwind-variants` kullanın.
5. **Type-Safety:** `VariantProps<typeof ...>` kullanarak varyant özelliklerinin Type-Safe olmasını sağlayın.
6. **Ark UI Doğası:** Gereksiz Tailwind class'ları doldurarak kodu şişirmeyin, olabildiğince minimal base stiller verin.
7. **Dış Kaynak ve Ark UI Mimarisi:** İnteraktif bir UI elemanı (Örn: Dialog, Accordion) yaparken sıfırdan mantık yazmayın. Önce Ark UI dökümantasyonunu (`https://ark-ui.com/`) ve `notes/general/llms.md` içindeki `https://ark-ui.com/llms.txt` adresini tarayıp en güncel yapıyı entegre edin.
8. **İsimlendirme Bağlamı:** Yeni bileşen oluştururken bulunduğu `feature` klasörünün adından ilham alın (Örn: `appointment-card.tsx` / `AppointmentCard`).
9. **Paylaşılan Bileşenler:** Her yerde kullanılabilecek genel bir yapıdaysa bileşeni `features/shared/components` klasörüne yerleştirin.
10. **Dışa Aktarım (Named Exports):** Bileşenleri asla `export default` olarak dışa aktarmayın. Her zaman Named Export (`export const ComponentName = ...`) kullanın.
11. **TanStack Start Direktifleri:** Dosyaların tepesine `"use client"` basmayın.
12. **Ladle Hikayeleri:** `src/features/shared/components/ui/` altındaki temel UI bileşenleri için `.stories.tsx` dosyası oluşturularak `args` ve `argTypes` ile kontroller tanımlanmalıdır. Sayfa seviyesindeki veya karmaşık iş mantığı barındıran bileşenler için zorunlu değildir.
