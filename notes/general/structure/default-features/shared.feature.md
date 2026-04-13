# Shared Feature Mimarisi

"Sıfır Global" (Zero-Global) mimarimizin kalbinde yer alan, tüm projedeki diğer alt özelliklere hizmet veren **tek ortak araç** feature'ıdır. 

**ÖNEMLİ:** Projede `src/lib`, `src/utils`, `src/components`, `src/hooks` gibi bağımsız global klasörler açılması YASAKTIR. Her şey bir "feature" (özellik) klasörü altındadır. Projenin genelini ilgilendiren araçlar her zaman `src/features/shared/` dizininde konumlandırılır.

## Klasör Yapısı ve İçerik Yönetimi

- `features/shared/components/ui/`
  - Özel (Custom) UI Component'ler. Base UI vb. ile hazırlanmış, bütün projenin paylaştığı butonlar, kartlar, modallar veya özellik spesifik olmayan `CdnImage` gibi alt yapı bileşenleri burada durur. İsimlendirmelerde `kebab-case` kuralı geçerlidir.
- `features/shared/lib/`
  - Birden çok feature'ın ihtiyaç duyduğu ve defalarca kullanılacak *ortak araçları* (utils) barındırır. (Örnek: `cn.ts`, Tailwind class yönetimi biçimlendiricileri, global sabitler veya Regex tanımları gibi).
- `features/shared/hooks/`
  - İş modeline (Domain-specific) bağlı olmayan, fonksiyonel görevler üstlenen Hook yapıları barındırır. (`useWindowSize`, `useKeyboard`, `useClickOutside` vb).
- `features/shared/types/`
  - Proje bazında genel (örneğin Base Pagination modelleri vs.) TypeScript statik tipleri barındırır.

## Kirliliği Engelleme (Anti-Bloat) Kuralları
1. **İzolasyon Kuralı:** Eğer yazılan bir yardımcı fonksiyon (util), React kancası (hook) veya UI bileşeni sadece **tek bir domain/özellik** (örneğin sadece `appointment` süreci) için kullanılıyorsa, onu ASLA `shared` özelliği içine atmayın. Temiz mimaride o işin yeri direkt `features/appointment/lib` vs. içidir.
2. **Aptallık (Dumb) Testi:** `shared` klasörünün içindeki UI bileşenleri mümkün olduğunca "Aptal" (Dumb/Pure) olmalıdır. Sadece dışarıdan `props` alarak çalışmalı, kendi içinde kompleks bir veri çekme (Data Fetching / useQuery) ya da mutation işlemi yapmamalıdır. Veri işleme operasyonu üst katmandan, uyguladığı feature'dan gelmelidir.
