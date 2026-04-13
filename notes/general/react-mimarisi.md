# React Mimarisi ve Kuralları (React Compiler & React 19)

Bu proje **React 19** ve **React Compiler** (Babel/Vite eklentisi) ile güçlendirilmiştir. Bu nedenle modern React standartlarına ve kurallarına harfiyen uyulmalı, eski alışkanlıklardan kaçınılmalıdır. React Compiler projede aktif olduğu için manuel optimizasyon yöntemlerine kesinlikle ihtiyaç yoktur.

## 1. Manuel Memoization (Optimizasyon) Yasak!
React Compiler tüm komponentlerinizi ve hook'larınızı statik olarak analiz eder, nerelerde referansların sabit tutulması ve `memoization` yapılması gerektiğini **otomatik** olarak belirler ve derler.
- `useMemo`, `useCallback` ve `React.memo` hook'ları projede **KESİNLİKLE KULLANILMAYACAKTIR**.
- Kodunuzu doğrudan düz JavaScript gibi yazın, bırakın performans ve render optimizasyonunu Compiler yapsın.

## 2. React Hook Kurallarına Sıkı Sıkıya Bağlılık
React Compiler'ın kodu anlayabilmesi ve hatasız optimize edebilmesi için Hook kurallarına ve Linter uyarılarına koşulsuz şartsız uyulmalıdır:
- Hook'ları her zaman fonksiyonun **en üst seviyesinde** çağırın (koşullar, döngüler veya iç içe fonksiyonların içinde DEĞİL).
- Hook'ları sadece React fonksiyonel bileşenlerinden veya özel (custom) Hook'ların içinden çağırın.

## 3. Render Sırasında Yan Etki (Side-Effect) Yasak
React fonksiyonları tamamen "saf" (pure) kalmalıdır. Compiler'ın güvenle çalışabilmesi için:
- Bileşen render edildiği sırada state değiştirmek, harici API'ye istek atmak veya DOM'u manüple etmek yasaktır.
- Yan etkiler (side effects) mutlaka `useEffect`, event handler'lar (onClick vs.) veya form action'ları içerisinde yönetilmelidir.

## 4. Değişmezlik (Immutability) İlkesi
React statelerini güncellerken var olan veriyi doğrudan değiştirmeyin (mutate etmeyin). React Compiler'ın state değişikliklerini algılayabilmesi için referansların değişmesi (yeni obje/array oluşturulması) elzemdir.
- Objeler veya diziler üzerinde değişiklik yaparken spread operatörü (`...`), `.map()`, `.filter()` gibi immutable geri dönüşlü yöntemleri kullanın veya immutable kütüphanelerden destek alın.

## 5. React 19 Temel Yenilikleri
- **Ref Artık Normal Bir Prop:** Bileşenlere `ref` geçirmek için `forwardRef` kullanımına gerek kalmamıştır. Normal prop gibi `ref` alınabilir. `forwardRef` koda eklenmemelidir!
- **`use` Hook'u:** `<Context.Provider>` yerine doğrudan `<Context>` bileşen sarmalaması yapılabilir. Değer okurken ise `useContext(MyContext)` yerine `use(MyContext)` tercih edilebilir (İhtiyaca göre promises için de kullanılabilir).
- **Yeni Form Yapıları:** `useActionState`, `useFormStatus` gibi yeni Hook'lar, var olan TanStack yapısıyla entegre veya paralel bir şekilde (sunucu aksiyonları için) kullanılabilir durumda, mimari standartlar gerektirirse kullanılabilir (bknz: `mutasyon-kurallari.md`).
