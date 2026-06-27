# ts-pattern Kütüphanesi

Projeye `ts-pattern` (https://github.com/gvergnaud/ts-pattern) kütüphanesi eklenmiştir.

## Neden?

`ts-pattern`, TypeScript'te pattern matching yapmayı sağlayan hafif (3KB) bir kütüphanedir. Zincirleme ternary (`a ? b : c ? d : e`) veya `switch-case` yapılarının yerine exhaustive ve tip-güvenli bir alternatif sunar.

## Kullanım Kalıbı

```typescript
import { match } from 'ts-pattern';

const result = match(value)
  .with('case1', () => 'sonuç1')
  .with('case2', () => 'sonuç2')
  .otherwise(() => 'varsayılan');
```

## Temel Kurallar

1. **Exhaustive Matching:** `.with()` blokları tüm olası durumları kapsamalıdır. `.otherwise()` son çare olarak kullanılır.
2. **Tip Güvenliği:** `.with()` içindeki değer TypeScript tarafından otomatik olarak daraltılır (type narrowing).
3. **Ternary Zincirleri Yerine:** Üç veya daha fazla koşulu olan ternary zincirleri `match()` ile değiştirilmelidir.
4. **Switch-Case Yerine:** `switch-case` yapıları da `match()` ile değiştirilebilir. `match()` exhaustiveness kontrolü sağlar — unutulan bir `case` derleme hatası verir.
5. **Performans:** `ts-pattern` runtime'da `switch-case` ile aynı performansı gösterir. Sıfır ek yük.
