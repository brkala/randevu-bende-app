# Randevu Bende Altın Kurallar

## Hızlı
Site ve sistem çok hızlı açılmalı. Kullanıcı hiçbir yerde beklememeli. 

## Mobil Öncelik
Site ve sistem mobil öncelikli olmalı. Arayüzler mobil cihazlara göre tasarlanmalı.

## Kuaförlere Öncelik
Sistem kuaförlerin ihtiyaçlarına göre tasarlanmalı. Kuaförlerin iş akışını kolaylaştırmalı, onlara zaman kazandırmalı ve işlerini daha düzenli yapmalarına yardımcı olmalı fakat hiç bir terimde berber/saç kesimi vs olmamalı. Terimler bağımsız ve esnek olmalıdır. Aynı sistemi kurban bayramında kesim yapan bir kasap da kullanabilmelidir.

## Güvenilir ve Gerçekçi (Data Integrity & Soft Delete)
Sistemde geçmişe dönük alınan hiçbir aksiyon sonradan bozulmamalıdır. Örneğin; bir hizmetin fiyatı değiştiğinde veya hizmet silindiğinde, önceden o hizmet üzerinden alınmış randevuların fatura detayları veya patronun geçmiş ciro grafiği bozulmamalıdır. Veriler silinmez, gizlenir (Soft-Delete) ve randevu anındaki veriler (ücret, süre) faturaya kazınır (Snapshot).

## Sürtünmesiz Deneyim (Frictionless UX)
Müşteri bir kez doğrulama yaptıktan sonra işlemleri en az efor ile tamamlamalıdır. Müşteri rehberinde iletişim kaydı bulunan hesabın SMS vs. ile yorulmadan tek tıkla randevu oluşturabilmesi, bilgilerin oto-doldurulması gibi kolaylıklar önceliklidir. Sistem insanları bürokrasi ile değil, işlevsellik ile hızlandırmalıdır.

## Mahremiyet ve KVKK Uyumu (Privacy by Design)
Sistem, müşteri tarafında "Unutulma Hakkı"na yüzde yüz saygı duymalıdır. Özelleştirilmiş kara liste ve "telefon numarasını platformdan kalıcı silme / bloke etme" hakları her zaman şeffaf ve erişilebilir olmalı, asla ihlal edilmemelidir. 

## Kesin Sınırlandırılmış Hiyerarşi (Strict RBAC)
Roller arası yetkiler esnetilemez olmalıdır. Patronun bile yetkisinin kısıtlandığı durumlar (örneğin müşteri yorumunu doğrudan silememesi, şikayet etmesi) kurumsal algıyı korumak içindir. Şef, Çalışan, Müşteri ve Admin arasındaki erişim sınırları, "kimse görmemesi gereken veriyi veya butonu görmesin" mantığına göre tasarlanmalıdır.

## Gerçek Hayat Esnekliği (Edge-Case Ready)
Randevu sistemi dükkandaki gündelik kaosu kaldırabilmelidir. Walk-in (kapıdan son dakika giren müşteri), randevuya gelmeyen müşteri (No-Show), veya sadece 
belirli yetkinlikleri veren personel durumlarına anında cevap verecek manuel esneme payları dükkan sahibine ve çalışanlara tanınmalıdır.

## Sıfır Gürültü, Doğru Bildirim
Kullanıcılar (Patron, Çalışan, Müşteri) gereksiz bildirimlerle (spam) rahatsız edilmemelidir. Kilit anlar (Ödeme gününe 5 gün kala, randevu deaktif edildiğinde veya randevuya az kaldığında vb.) hedef kitleye sadece doğru ve tam zamanında haber verilmelidir. Sistem konuşkan değil, yerinde uyaran bir asistan olmalıdır.

## Az para çok iş
Sistem maliyetini olabildiğince düşük tutmalıdır. Bu durum müşterinin ödeyeceği fiyatları da etkileyecektir. Müşteriler için en uygun fiyatlı ve en iyi hizmeti sunmalıyız.

## Hedef herkes
Sistem sürümden kazanma mantığı ile çalışmalıdır. Mümkün olduğunca çok insana ulaşmalı ve onların hayatlarını kolaylaştırmalıyız. Bu nedenle sistemin arayüzü olabildiğince basit ve anlaşılır olmalıdır. Herkesin rahatlıkla kullanabileceği bir arayüz tasarlamalıyız. Tek dükkan mahalle berberinden 
birden fazla dükkanlı yoğun işletmelere kadar girmelidir.

## Müşteriye Yönelik Saldırıları Engelleme
Sisteme saldırma çabası olan kişileri olabildiğince engellemeliyiz. Başka insanların numaraları vs yazılabilir. Bot saldırıları yapılabilir. Bunları engellemek için her türlü yol mübahtır.
