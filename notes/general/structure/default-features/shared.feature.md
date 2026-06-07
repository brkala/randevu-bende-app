# Shared Feature Mimarisi

Tüm projedeki diğer alt özelliklere hizmet veren **tek ortak araç** özelliğidir.

**ÖNEMLİ:** Projede `src/lib`, `src/utils`, `src/components`, `src/hooks` gibi bağımsız global klasörler açılması YASAKTIR. Her şey bir "feature" klasörü altındadır. Proje genelini ilgilendiren araçlar `src/features/shared/` dizininde konumlandırılır.

## Klasör Yapısı ve İçerik Yönetimi

- `features/shared/components/ui/`: Ark UI ile hazırlanmış, buton, kart, modal veya özellik spesifik olmayan `CdnImage` gibi alt yapı bileşenleri (kebab-case).
- `features/shared/lib/`: Birden çok feature'ın paylaştığı ortak araçlar (Örn: `cn.ts` sınıf birleştirici, regex tanımları vb.).
- `features/shared/hooks/`: İş modeline bağlı olmayan fonksiyonel kancalar (`useWindowSize`, `useClickOutside` vb.).
- `features/shared/types/`: Proje geneli TypeScript statik tipleri (Örn: sayfalama modelleri).

## Kirliliği Engelleme (Anti-Bloat) Kuralları
1. **İzolasyon Kuralı:** Eğer yazılan bir yardımcı fonksiyon, hook veya UI bileşeni sadece **tek bir domain/özellik** için kullanılıyorsa, onu ASLA `shared` içine atmayın. Temiz mimaride o işin yeri direkt `features/[özellik]/lib` vs. içidir.
2. **Aptallık (Dumb) Testi:** `shared` içindeki UI bileşenleri "Aptal" (Dumb/Pure) olmalıdır. Sadece dışarıdan `props` alarak çalışmalı, kendi içinde veri çekme veya mutation işlemi yapmamalıdır. Veri operasyonu üst katmandan gelmelidir.
