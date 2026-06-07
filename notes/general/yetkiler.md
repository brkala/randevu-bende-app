# Randevu Bende Yetkiler

## Admin / Yönetici
- Authenticator ile panele giriş yapar.
- Bütün dükkanları görebilir, OTP ile dükkan sahibi veya personel olarak giriş yapabilir.
- Müşteri listesini ve faturaları görebilir, sistem raporu alabilir.
- Manuel abonelik ekleyebilir/düzenleyebilir.
- Hesapları dondurabilir, OTP ile kalıcı bilgi silebilir.
- İçerik yönetim sistemini (CMS) kullanabilir.

## Customer / Müşteri
- Giriş yapabilir, kişisel bilgilerini (ad, soyad, telefon, gmail, e-posta, şifre) düzenleyebilir.
- Telefon numarası onaylandıktan veya dükkan müşteri rehberinde kayıtlıysa SMS doğrulamasız randevu alabilir.
- Randevu ekranında bilgileri otomatik doldurulur, randevu geçmişini ve bildirimleri görür.
- Kendi randevusunu iptal edebilir, iptal durumunda bildirim alır.
- Dükkan kara listesindeyse randevu alamaz.
- OTP ile telefon numarasını sistemden tamamen silebilir veya bir daha eklenmemesini (opt-out) sağlayabilir.

## Owner / Sahip
- Abonelik satın alabilir, iptal edebilir, fatura ve bildirimleri görebilir.
- Çalışan ekleyebilir (e-posta/telefon ile), deaktif edebilir, bilgilerini düzenleyebilir.
- Dükkan bilgilerini ve fotoğraflarını (kırpılmış en fazla 6 adet) düzenleyebilir.
- Randevuları görebilir, ekleyebilir, iptal edebilir.
- Dükkan çalışma saatlerini ve tatil günlerini belirleyebilir.
- Randevu ve kronometre ön aralıklarını (15 dk, 30 dk vb.) ve iptal süresini ayarlayabilir.
- Dükkanı kapatıp hesabı kesebilir, günlük rapor ve istatistikleri görebilir.
- Sosyal medya hesaplarını ekleyebilir.
- Hizmet ekleyebilir (ad, süre, fiyat), soft-delete ile silebilir veya düzenleyebilir (klonlama ve eskiyi soft-delete ile).
- Çalışan profiline göre hizmetleri kısıtlayabilir.
- Ödeme süreçleri için son 5 gün kala ve son gün olmak üzere iki kez bildirim alır.
- Yorumlara yanıt yazabilir veya uygunsuz yorumları rapor edebilir.
- Kara listeye numara ekleyip kaldırabilir.
- Müşteri rehberine numara ekleyebilir, düzenleyebilir ve silebilir.

## Employee / Çalışan
- Sadece Sahip tarafından oluşturulabilir.
- Kişisel bilgilerini (ad, soyad, profil resmi) değiştirebilir.
- Kendi randevusunu ekleyebilir, iptal edebilir, takvimde görebilir.
- Kronometreyi başlatabilir, durdurabilir ve sıfırlayabilir.
- Kendi gün sonunu görebilir.
- Belirli gün ve saatleri kendisi için randevuya kapatabilir.
- Müşteri rehberine kendi eklediği numaraları ekleyebilir, düzenleyebilir ve silebilir.

## Manager / Şef
- Çalışan yetkilerinin tümüne sahiptir.
- Diğer çalışanların saat, gün ve randevularını düzenleyebilir.
- Kara listeye numara ekleyebilir.
- Müşteri rehberinde Sahip ile aynı yetkilere sahiptir.
- Dükkan gününü kapatabilir, gün sonlarını görebilir.
