# Ürün kapsamı

Durum: İlk planlama temeli. Bu belge hedef davranışı tanımlar; çalışan ürün bulunduğu anlamına gelmez.

## Amaç ve kullanıcı

Kullanıcının PDF, Word, Excel ve görseller üzerindeki yaygın işlemleri kurulum gerektirmeden tamamlamasını sağlamak. İlk hedef kitle, günlük belge işleri yapan bireyler, öğrenciler ve küçük ekiplerdir.

Temel vaat: Aracını seç, dosyanı yükle, işlemi tamamla ve sonucu indir. Dönüşüm kalitesiyle ilgili gerçek sınırlar işlemden önce görünür olmalıdır.

## İlk sürümdeki 10 araç

| Kimlik | Araç | İlk sürüm kapsamı | Çıktı |
| --- | --- | --- | --- |
| pdf-to-word | PDF → Word | Metin tabanlı tek PDF, en fazla 50 sayfa; font, görsel, tablo ve sütun yerleşimini yeniden kuran düzenlenebilir çıktı; birebir garanti yok | DOCX |
| word-to-pdf | Word → PDF | Tek DOCX; eski DOC biçimi sonraki kapsam | PDF |
| pdf-to-excel | PDF → Excel | Metin tabanlı PDF içindeki tablolar; taranmış tablolar sonraki kapsam | XLSX |
| excel-to-pdf | Excel → PDF | Tek XLSX; çalışma sayfası ve baskı alanı davranışı motor denemesinde doğrulanır | PDF |
| pdf-to-images | PDF → JPG / PNG | Sayfa seçimi ve çıktı formatı | Tek görsel veya çoklu çıktı için ZIP |
| images-to-pdf | JPG / PNG → PDF | Birden fazla görseli sırala, sayfa boyutu ve yön seç | PDF |
| merge-pdf | PDF birleştir | En az iki PDF, kullanıcı tarafından belirlenen dosya sırası | PDF |
| edit-pdf-pages | PDF böl ve sayfa düzenle | Sayfa seç, sil, sırala, döndür; tek PDF veya sayfa başına dosya | PDF veya ZIP |
| compress-pdf | PDF sıkıştır | Kayıpsız optimizasyon; kayıplı profil yalnızca doğrulanmış motorla | PDF |
| ocr | OCR / metin çıkar | PDF, JPG veya PNG; kurulu Tesseract dil modellerinden en fazla iki seçim; düz metin çıkarma | UTF-8 TXT |

OCR (metin çıkar) aracı yalnızca düz metin üretir; aranabilir PDF için ayrı `pdf-to-pdf-ocr` aracı kullanılır. OCR dili arayüz dilinden bağımsızdır; kurulu Tesseract modellerinden en fazla iki tanesi seçilebilir. Motor modeli bulunmayan dilleri veya tüm belgelerde aynı doğruluğu garanti etmez. Özgün yerleşimi koruyan Word üretimi ilk sürümde söz verilmez. PDF → Word ve PDF → Excel araçları, kalite kapısını geçmeden halka açık olarak etkinleştirilmez. Kullanılamayan araç işlem kabul etmez ve çalışıyormuş gibi gösterilmez.

## Güncel kayıtlı envanter

Yukarıdaki ilk 10 araca ek olarak `pptx-to-pdf`, `protect-pdf`, `unlock-pdf`, `page-numbers`, `watermark-pdf`, `pdf-to-pdf-ocr` ve `pdf-to-md` handler'ları ve arayüz kayıtları eklenmiştir; toplam 17 araç kaydı vardır. Bu kayıtlar destek veya kalite onayı değildir. PPTX yükleme, şifreli girdi/çıktı doğrulaması ve Türkçe filigran gibi mevcut engeller [ENGINE-SUPPORT](ENGINE-SUPPORT.md) ve ölçüm sonuçları [ENGINE-AUDIT](ENGINE-AUDIT.md) içinde izlenir. İlk sürüm varsayımları geçmiş kapsamı anlatır; uygulanmış destek için API davranışı ve bu kanıtlar esas alınır.

## İlk sürüm için çalışma varsayımları

Bu varsayımlar tasarım ve geliştirme başlangıcı içindir; geri döndürülemez ürün kararı değildir.

- İngilizce arayüz kök URL'de; Türkçe `/tr/`, İspanyolca `/es/`, Fransızca `/fr/` ve Hintçe `/hi/` altında sunulur. OCR'ın desteklediği belge dilleri arayüz dillerinden bağımsızdır ve motor imajında kurulu Tesseract modellerine göre belirlenir.
- Üyeliksiz kullanım; anonim ziyaretçi için güvenli sunucu oturumu ve işlem sahipliği.
- Araç başına bir işlem oluşturma; çok dosyalı girdi yalnızca ilgili aracın gerektirdiği yerde.
- PDF sıkıştırmada her dosyanın küçüleceği garanti edilmez.
- PDF → Word/Excel sonuçlarında yazı tipi, tablo ve sayfa düzeni değişebilir.
- Şifreli PDF, parola kaldırma, makrolu Office dosyaları ve keyfi URL'den dosya alma ilk sürüm dışında.
- Yükleme boyutu, sayfa sayısı, dosya adedi, çözünürlük ve günlük kullanım sınırları yapılandırılabilir olur; sayısal değerler yük testinden sonra belirlenir.
- İlk sürümde tarayıcı kapanınca işlem sunucuda devam edebilir; aynı geçerli oturumdan geri dönülürse durum okunabilir.

## Kapsam dışında

Ödeme, abonelik, kullanıcı hesabı, kalıcı belge arşivi, e-imza, ortak düzenleme, herkese açık paylaşım bağlantıları, mobil uygulama ve üçüncü taraf geliştirici API'si.

## Gizlilik ve veri ilkeleri

- Dosyalar herkese açık dizinde tutulmaz; her okuma, indirme ve silme işleminde sahiplik doğrulanır.
- Dosyalar otomatik silinir. Saklama süresi konfigürasyondan gelir ve kullanıcıya gerçek değer gösterilir.
- Kullanıcıya erken silme seçeneği sunulur; silme tamamlanmadan tamamlandı mesajı gösterilmez.
- Belge metni, orijinal dosya adı ve indirme yetkisi veren değerler analitik veya loglara gönderilmez.
- Harici motor kullanılacaksa gönderilen veriler, sağlayıcı ve saklama davranışı yayından önce belirlenir ve gizlilik metninde açıklanır.
- Geçici belgeler kalıcı yedek kapsamına varsayılan olarak alınmaz. Metadata yedeği ile belge saklama politikası ayrı tanımlanır.

## Kalite ve başarı ölçütleri

| Alan | Ölçüm | Kabul yaklaşımı |
| --- | --- | --- |
| İşlev | Geçerli girdiden beklenen türde açılabilir çıktı | Yayınlanan her araç için zorunlu |
| Dönüşüm kalitesi | Türkçe karakter, tablo, font ve düzen kaybı | Sentetik referans kümesinde araç bazlı rapor |
| Performans | Yükleme, kuyruk ve işleme süresi ayrı ayrı; p50/p95 | Belge boyutu ve motor bazında ölç; hedefi kapasite denemesinde belirle |
| Güvenilirlik | Yeniden başlama, tekrar deneme ve iptal davranışı | Mükerrer sonuç ve sahipsiz kalıcı dosya oluşmamalı |
| Gizlilik | Oturumlar arası erişim ve süresi dolan dosyaların silinmesi | Yetkisiz erişim reddedilmeli; silme gecikmesi izlenmeli |
| Kullanılabilirlik | Mobil ve klavyeyle temel akış | Yükleme, hata, durum ve indirme tamamlanabilmeli |

## Yayından önce kapanacak ürün kararları

1. Araç bazlı sayısal limitler ve aşım mesajları.
2. Dosya saklama süresi, silme denetim sıklığı ve tamamlanabilecek en uzun işlem süresi.
3. PDF → Word/Excel motorlarının kalite ve maliyet kabulü.
4. Harici işleme varsa sağlayıcı, veri bölgesi ve veri işleme koşulları.
5. Marka adı, alan adı ve kullanıcıya sunulacak gizlilik/kullanım metinleri.

Kabul edilmemiş kararlar uygulamada sessizce kesinleştirilmez. Geçici geliştirme değerleri üretim için onaylanmış değer olarak sunulmaz.
