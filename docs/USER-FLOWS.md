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
