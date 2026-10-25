# Kullanıcı akışları

Kapsamın kaynağı: [PRODUCT](PRODUCT.md). Görsel kurallar: [DESIGN-SYSTEM](DESIGN-SYSTEM.md). Sunucu iş yaşam döngüsü: [FILE-PROCESSING](FILE-PROCESSING.md).

## Ortak akış

1. Kullanıcı ana sayfadaki karttan veya doğrudan araç bağlantısından gelir.
2. Araç adı, kabul edilen biçimler, gerçek limitler ve gizlilik bilgisi görünür.
3. Kullanıcı dosya seçer veya sürükleyip bırakır. Klavyeyle dosya seçimi de çalışır.
4. Tarayıcı temel biçim ve boyut kontrolü yapar; sunucu ayrıca doğrular.
5. Araç gerektiriyorsa kullanıcı dosyaları/sayfaları sıralar ve ayarları seçer.
6. Başlatma sırasında tek istek anahtarı üretilir; çift tıklama aynı işi çoğaltmaz.
7. Dosyalar yüklenir. Gerçek aktarım verisi varsa yükleme yüzdesi gösterilir.
8. Sunucu kabul ettikten sonra işlem kuyruğa girer; arayüz kuyruk ve işleme durumunu ayırır.
9. Sonuç hazır olduğunda çıktı adı, boyutu, indirme ve erken silme seçenekleri gösterilir.
10. Kullanıcı indirir; süresi dolunca indirme kapanır ve dosyalar temizlenir.

İlk sürümde durum sorgulama aralıklı HTTP istekleriyle yapılır; aralık sunucu tarafından yönlendirilebilir. Görünmeyen sekmelerde istek sıklığı azaltılır. İstemci bağlantısının kopması otomatik olarak iş iptali sayılmaz.

## Ana sayfadan hızlı dosya başlangıcı

- Hero dosya seçme alanı klavye ile kullanılabilen bir düğme ve sürükle-bırak bölgesidir. Ana sayfadan tek dosya alır: PDF, DOCX, XLSX, PPTX, JPG/JPEG veya PNG. Birden fazla dosya gerekiyorsa dosyayı aldıktan sonra uygun aracı açıp ek girdileri araç ekranında seçersin; ana sayfaya birden fazla dosya bırakılırsa dosyalar gönderilmez ve açıklayıcı hata gösterilir.
- Dosya başına sınır `GET /api/capabilities` cevabındaki `maxFileBytes` değerinden gösterilir. API erişilemiyorsa istemcinin 10 MB üst sınırı yalnızca yerel ön kontrol olarak kalır; iş başlatılamaz.
- Tarayıcı, dosyayı araca yönlendirmeden önce uzantıyı, sıfır bayt durumunu ve bilinen boyut sınırını kontrol eder. Geçersiz/çoklu dosya seçimi hata mesajı verir; dosya yüklenmez.
- PDF seçilince yalnızca API'nin `enabledTools` listesinde bulunan PDF eylemleri önerilir. Birleştirme seçeneği ikinci PDF gerektiğini açıkça belirtir; kullanıcı ikinci dosyayı araç ekranında ekler.
- DOCX, XLSX, PPTX ve görsel girdileri uzantılarına göre ilgili araca taşınır. Araç ekranı dosya adını, türünü, boyutunu ve kaldırma/yeni dosya seçme yolunu gösterir. Araca geçiş dosya baytlarını göndermez.
- Dosya baytları ancak kullanıcı araca gidip işlemi başlattığında yüklenir. API yükleme ilerlemesi ölçülebilir bayt aktarımına dayanır; işlem yüzdesi motor gerçek bir oran sağlamadıkça gösterilmez.
- Yükleme/işlem başarısız veya iptal edilirse kullanıcı aynı yerel dosyayla yeniden deneyebilir. Yeniden deneme önce eski işin erişimini kapatır, sonra yeni bir yükleme ve iş oluşturur.

## Araç kataloğunda keşif

- Katalog 16 kayıtlı aracı Dönüştür, Düzenle, Optimize et ve koru, OCR gruplarında gösterir; araç kartı kullanıcıyı mevcut SPA içi araç görünümüne açar.
- Dört “Önerilen / Suggested” aracı ürün kapsamı seçer. Bu sıralama kullanım analitiğinden türetilmiş popülerlik iddiası değildir.
- Kategori seçimi kart listesini daraltır. Arama kategoriyle birlikte çalışır; Türkçe/İngilizce araç adlarına ek olarak yaygın uzantı ve iş terimlerini tanır (ör. `jpg to pdf`, `image to pdf`, `merge pdf`).
- Eşleşme yoksa açık boş durum ve filtre/arama temizleme eylemi gösterilir. Arama sonuçları sayfa yenileme sonrası korunmaz; araç açılış hash rotası korunur.

## Ekran durumları

| Durum | Kullanıcının gördüğü | Kullanılabilir eylem |
| --- | --- | --- |
| Boş | Desteklenen türler ve dosya seçimi | Dosya seç |
| Dosyalar seçildi | Dosya listesi, boyutlar, ayarlar | Kaldır, sırala, başlat |
| Yükleniyor | Aktarım durumu | Yüklemeyi iptal et |
| Kuyrukta | İşlemin sırada olduğu bilgisi | İptal iste |
| İşleniyor | Mevcut aşama; yalnızca motor sağlıyorsa yüzde | İptal iste |
| İptal ediliyor | İptal isteğinin uygulandığı bilgisi | Bekle |
| Tamamlandı | Sonuç ve sona erme bilgisi | İndir, erken sil, yeni işlem |
| Başarısız | Anlaşılır neden ve uygulanabilir öneri | Dosya/ayar değiştir, yeniden başlat |
| Süresi doldu / silindi | Sonucun artık bulunmadığı bilgisi | Yeni işlem |

Motor gerçek ilerleme sağlamıyorsa sahte yüzde veya tahmini sıra numarası gösterilmez. Birden fazla indirme gerekiyorsa ZIP hazırlama da işlem tamamlanmadan biter.

## Araçlara özel etkileşim

| Araç | Gerekli etkileşim |
| --- | --- |
| PDF → Word | Tek PDF; yerleşim değişebileceği bilgisi |
| Word → PDF | Tek DOCX; desteklenmeyen öğeler için açıklama |
| PDF → Excel | Tek PDF; tablo odaklı çıktı açıklaması |
| Excel → PDF | Tek XLSX; yalnızca doğrulanmış baskı/sayfa seçenekleri |
| PDF → görsel | JPG/PNG seçimi, sayfa aralığı, sınırlandırılmış kalite/çözünürlük |
| Görsel → PDF | Görsel sırası, sayfa boyutu, yön ve sığdırma |
| Birleştirme | PDF dosyalarını sıralama; en az iki girdi |
| Sayfa düzenleme | Küçük resimler, seçme, silme, taşıma, 90 derece adımlarla döndürme; en az bir çıktı sayfası |
| Sıkıştırma | Gerçekte desteklenen profil; sonuçta önceki/sonraki boyut |
| OCR | Türkçe/İngilizce dil seçimi ve TXT çıktısı açıklaması |

Sayfa küçük resimleri oluşturma işlemi de kaynak sınırlarına tabidir. Önizleme oluşturulurken tam çözünürlüklü tüm sayfalar tarayıcı belleğine alınmaz.

## Sprint 4 araç ekranı ve iş devamlılığı

- Ana sayfa ve araç ekranı aynı `FileDropzone` bileşenini kullanır; hero tek dosya hızlı başlangıç varyantı, araç ekranı tekli/çoklu araç varyantıdır. Kabul edilen dosya türü ve çoklu seçim davranışı açık props ile verilir.
- Çoklu dosya seçimi, ekleme/kaldırma ve sırayı sürükleme veya erişilebilir yukarı/aşağı düğmeleriyle değiştirme sunar. Seçili dosya sayısı, her dosya limiti ve sunucudan gelen toplam bayt sınırı görünür; seçilen toplam bayt ayrıca gösterilir.
- Sonuç ekranı API'nin indirme başlığındaki dosya adı kuralıyla eşleşen adı, gerçek çıktı türü ve boyutu gösterir. İndirme, yeni dosyayla devam etme ve erişimi erken silme ayrı eylemlerdir; ayrıca araç için tanımlıysa ilgili bir sonraki araca bağlantı verir. Yeni dosya eylemi eski işi/dosyaları hemen silmez; bunlar sunucu saklama süresi dolana kadar arka planda kalır ve geçerli iş erişim politikası uygulanır.
- Kuyruk/çalışma durumu ve job kimliği aynı sekmenin `sessionStorage` alanında tutulur. Sekme yenilenince iş kimliğiyle durum tekrar okunur ve dosyalar yeniden yüklenmez. Tarayıcıdaki yerel kaynak dosyalar geri yüklenemez; iş başarısız/iptal olmuş ve kaynak yoksa kullanıcıdan dosyaları yeniden seçmesi istenir.
- `NO_TEXT`, `NO_TABLES`, `INVALID_OPTIONS`, `WRONG_PASSWORD`, `INVALID_DOCUMENT`, `UNSUPPORTED_FORMAT`, `LIMIT_EXCEEDED`, `PROCESSING_TIMEOUT`, `ENGINE_UNAVAILABLE` ve kapasite hataları güvenli, eyleme dönük kullanıcı mesajlarıyla eşlenir. Ham motor stderr'i arayüze gösterilmez.
- Araç URL'leri Türkçe/İngilizce statik rota, sayfaya özel title/description/H1, breadcrumb, yapılandırılmış veri, kullanım rehberi ve ilgili araç bağlantılarını korur. Araç kopyası, dokümante edilmiş girdi/çıktı ve limitleri aşan sınırsız, birebir veya kayıpsız kalite vaadi kullanmamalıdır.

## Sprint 5 rehber ve güven anlatımı

- Ana sayfadaki rehber vitrini bir öne çıkan gerçek kullanım senaryosu, hukuk/finans alanlarından iki destek rehberi ve vize/kariyer/ofis için kısa bağlantı listesinden oluşur. Kategori rozetleri her senaryonun gerçek grubunu gösterir; sekmeli ikinci bir kart kataloğu kullanılmaz.
- Her senaryo sayfası üstte ilgili aracı açar ve içeriğinde kullandığı araçlara bağlantı verir. Araç SEO sayfaları da o araçla ilgili rehberleri listeler; rehber ↔ araç yolları iki yönlüdür.
- Dosya işleme açıklaması tarayıcıda seçim → işlem başlatılınca yükleme → imza/boyut/yapısal doğrulama → private geçici depolama → metadata/iş kimliğiyle kuyruk → worker/motor → aynı oturumdan sonuç → yapılandırılmış süre dolumu veya silme sırasını anlatır.
- Saklama varsayılanı 60 dakikadır; yapılandırılabilir ve araç ekranında API’den gelen etkin süre gösterilir. Silme isteği erişimi hemen kapatır; fiziksel temizleme arka planda tamamlanır.
- Güven açıklamaları uygulama kontrolleriyle sınırlıdır. Üretimdeki container/volume ayarı, sağlayıcı yedekleri, gerçek silme gecikmesi ve analitik sağlayıcı ayarları koddan kanıtlanmadıkça garanti olarak sunulmaz.
- Cloudflare Web Analytics canlı alan adında kenar yapılandırmasıyla eklenir; PostHog ürün analitiği açık rıza sonrası yüklenir; ana sayfa AdSense’i bunlardan bağımsızdır. PostHog tercihi Cloudflare veya Google reklamlarını kapatmaz.
- Güvenlik, gizlilik, hakkında ve araç SEO copy'sindeki ölçülebilir iddiaların durumları `project-planning/UIUX-Sprint-5/CLAIM-REVIEW.md` içinde tutulur. Doğrulanmayan fiziksel silme, “RAM only”, end-to-end TLS ve birebir dönüşüm vaatleri yayınlanmaz.

## Sprint 6 içerik ve gezinme

- Ana sayfa FAQ'si ücret, desteklenen biçimler, işleme yolu/konumu, saklama, dosya boyutu, hata ve dönüşüm kalitesini cevaplar; Türkçe ve İngilizce soru kümeleri aynı kapsamı taşır.
- Ana sayfa SSS satırları `aria-expanded` ve `aria-controls` kullanan düğme akordeonudur. Araç ve rehber SSS’si native `<details>`/`<summary>` kullanır. Her iki tür klavyeyle açılır/kapanır ve görünür odak taşır.
- Footer dört kısa grup kullanır: araçlar, kaynaklar, güvenlik/yasal ve iletişim. Araç grubunda ürünce seçilmiş dört araç bulunur; tüm katalog yinelenmez.
- İçerik ve SEO yayın ölçütlerinin tek kaynağı [CONTENT-SEO-CHECKLIST](CONTENT-SEO-CHECKLIST.md) belgesidir.

## Hatalar ve geri dönüş

- Yanlış biçim: Kabul edilen uzantıları ve düzeltme yolunu göster.
- Büyük dosya / fazla sayfa: Gerçek limiti göster; yükleme öncesinde biliniyorsa erken durdur.
- Bozuk veya şifreli belge: Sebebi güvenli bir mesajla açıkla; şifre toplama akışı açma.
- Bağlantı kesilmesi: Otomatik tekrarın sınırını belirt; aynı yüklemeyi/işi kontrolsüz çoğaltma.
- Motor zaman aşımı: İşlemin tamamlanamadığını bildir; dosyayı küçültme veya yeniden deneme öner.
- Kullanım sınırı: Yeniden denemenin ne zaman mümkün olacağını sunucu verisiyle göster.
- Motor devre dışı: İşlem başlatmayı kapat ve kullanılabilirlik bilgisini göster.
- Sıkıştırma yarar sağlamadı: Dosyanın zaten optimize olabileceğini söyle; boyutu büyüten çıktıyı başarı olarak sunma.

İptal isteği anında tamamlandı sayılmaz. Sunucu tamamlanmış sonuçla iptal yarışını çözer; arayüz sunucunun son durumunu esas alır.

## Kabul senaryoları

1. Mobil kullanıcı DOCX seçip PDF sonucunu indirebilir.
2. Klavye kullanıcısı iki PDF'yi butonlarla sıralayıp birleştirebilir.
3. Çift başlatma tıklaması tek iş oluşturur.
4. Başka oturumun iş kimliğiyle durum, önizleme veya çıktı alınamaz.
5. İş sürerken sekme yenilenirse geçerli oturumla durum geri yüklenir; dosyalar tekrar yüklenmez.
6. İptal, hata ve süre dolumu durumlarının her biri anlaşılır bir son ekrana ulaşır.
7. Motor yüzdesi yokken belirsiz ilerleme göstergesi erişilebilir biçimde çalışır.
8. Erken silmeden sonra yeni indirme yetkisi üretilemez; silme tamamlanınca kullanıcı bilgilendirilir.

## Ortak ve araca özgü içerik — 25 Ekim 2026

- 16 aracın TR/EN görünümleri aynı çalışma alanı ve iş yaşam döngüsünü kullanır. Ayarsız araç tek sütundur; gerçek ayarlar masaüstünde sağ panelde, mobilde başlatmadan önce görünür.
- Birincil eylem mevcut i18n sözlüğündeki araç kimliğiyle seçilir. Genel “Dönüştürmeyi başlat” yerine yapılan iş söylenir; teknik API ve araç seçenekleri değişmez.
- Güncel limit ve saklama süresi ancak başarılı capabilities yanıtından sonra gösterilir. Bağlantı yokken yerel ön kontroller sunucu politikası gibi sunulmaz; bağlantıyı yeniden kontrol etme eylemi bulunur.
- Destek notu her araç için iki dilde başlatma panelinde bir kez görünür. Ayrı “Bilmen gerekenler” kartı ve yalnızca Türkçe sunucu notu tekrarı kaldırıldı.
- Araç alt içeriği kullanım adımları → sonuç kontrolü → ilgili rehberler → araca özgü SSS → ilgili araçlar sırasındadır. Görünür adımlar/SSS mevcut yapılandırılmış verinin de kaynağıdır.
- Rehberde gömülü araçtan sonra kullanım adımları ve sonuç kontrolü gelir; arama anahtar kelimeleri sayfa içi rozetler olarak gösterilmez. Genel ücret, oturum ve saklama SSS’si rehberlerde çoğaltılmaz.
- Silme isteğinin erişimi kapatması ve fiziksel temizliğin arka planda tamamlanması ayrımı korunur. Bu çalışma API/worker davranışını değiştirmez.

## Görsel kalite iyileştirmesi

- Quick Start ve kategoriler toplam 16 benzersiz aracı göstermeye devam eder; önerilen dörtlü kategori altında ikinci kez listelenmez. Filtre/arama sonuçları aynı veri kaynağını kullanır. Son katalog satırları soldan başlar.
- PDF yerel olarak seçildiğinde “Dosya seçildi” durumu ve sonraki işlem seçenekleri görünür. Durum yükleme başarısı anlamına gelmez. Dar ekranda işlem adları kesilmez; tek sütuna geçebilir.
- Ortak container, Button, ikon ve durum kuralları ana sayfa ile araçlarda paylaşılır. Route, API, seçenekler, erişim, iptal ve saklama/silme davranışı bu görsel çalışma kapsamında değişmez.
- Ayar açılır menüsünün seçili değeri, aynı iki dilli ayar kaydından gelen kısa açıklamayla anlatılır; açıklama form alanına erişilebilir biçimde bağlanır. Seçenek değerleri ve API sözleşmesi aynıdır.
- İşlem panelindeki etkin saklama süresi tek yerde kalır. Alt not yalnızca kabul edilen işin sayfa kapansa da sürebileceğini belirtir.
- Ana sayfa reklam önizlemesi ana sayfa içeriğinde kalır; araç çalışma alanı ve doğrudan araç rotalarında görünmez.
- Güvenlik sayfası dosyanın dört gerçek yaşam döngüsü aşamasını özetler. Gizlilik ve şartlar sayfalarında bölüm bağlantıları içerik başlıklarına gider; yasal metin değiştirilmez.
- Hata bildirimi için araç, tarayıcı, adımlar, yaklaşık tarih/saat ve hata metni istenir; belge eki, dosya içeriği, parola veya kişisel bilgi istenmez.
