# React Mimarisi ve Kuralları (React Compiler & React 19)

Bu proje **React 19** ve **React Compiler** (Hybrid: Oxc + Babel) ile çalışır.

> [!IMPORTANT]
> Projede **React Compiler** AKTİFTİR. Vite 8 uyumlu hibrit yapı (OXC + Babel) sayesinde manuel memoization yapılmasına kesinlikle ihtiyaç yoktur.

## 1. Manuel Memoization (Optimizasyon) Yasak!
React Compiler bileşenleri ve hook'ları analiz ederek nerede referans sabit tutulacağını ve memoization yapılacağını **otomatik** belirler.
- `useMemo`, `useCallback` ve `React.memo` **KESİNLİKLE KULLANILMAYACAKTIR**.
- Kodunuzu düz JavaScript şeklinde yazın, optimizasyonları Compiler gerçekleştirir.

## 2. React Hook Kurallarına Sıkı Sıkıya Bağlılık
Compiler'ın hatasız çalışması için linter ve hook kurallarına tam uyulmalıdır:
- Hook'ları her zaman fonksiyonun **en üst seviyesinde** çağırın (koşul, döngü veya iç fonksiyonlarda çağırmayın).
- Hook'ları sadece React bileşenlerinden veya özel (custom) hook'lardan çağırın.

## 3. Render Sırasında Yan Etki (Side-Effect) Yasak
React bileşen fonksiyonları "saf" (pure) kalmalıdır:
- Render aşamasında state değiştirmek, harici API isteği atmak veya DOM'a müdahale etmek yasaktır.
- Yan etkiler `useEffect`, event handler'lar (onClick vb.) veya form action'ları içerisinde yönetilmelidir.

## 4. Değişmezlik (Immutability) İlkesi
React statelerini güncellerken var olan nesneyi veya diziyi doğrudan mutasyona uğratmayın. Referansların değişmesi (yeni obje/array üretimi) elzemdir.
- Güncellemelerde spread operatörü (`...`), `.map()`, `.filter()` gibi immutable yöntemler kullanın.

## 5. React 19 Temel Yenilikleri
- **Ref Artık Normal Prop:** Bileşenlere `ref` geçirmek için `forwardRef` kullanımına gerek yoktur, normal prop olarak alınabilir. `forwardRef` kullanılmamalıdır.
- **`use` Hook'u:** `<Context.Provider>` yerine doğrudan `<Context>` kullanılabilir. Değer okurken `use(MyContext)` tercih edilebilir.
- **Yeni Form Yapıları:** `useActionState` ve `useFormStatus` gibi hook'lar sunucu aksiyonları için kullanılabilir.
