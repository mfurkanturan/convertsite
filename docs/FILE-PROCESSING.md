# Dosya işleme ve yaşam döngüsü

Ürün davranışı: [PRODUCT](PRODUCT.md). Bu belge yüklemeden fiziksel silmeye kadar sunucu sorumluluklarını tanımlar.

## Dosya kabulü

1. Oturum ve kullanım politikası doğrulanır.
2. Yükleme, private staging alanına akış halinde alınır; tüm dosya belleğe okunmaz.
3. Aktarım sırasında gerçek bayt sayısı sınırlandırılır; yarım yüklemeler temizlenir.
4. Uzantı, bildirilen MIME ve dosya imzası karşılaştırılır; tür bazlı yapısal inceleme uygulanır.
5. PDF sayfa sayısı, görsel piksel sayısı ve Office arşivinin açılmış boyutu gibi ek sınırlar kontrol edilir.
6. Bozuk, şifreli, desteklenmeyen veya limit aşan girdiler reddedilir. Tek istisna, kullanıcı parolasıyla doğrulanan `unlock-pdf` yüklemesidir; doğru parola ve yapısal sınırlar doğrulanmadan dosya ready olmaz.
7. Hazır dosya için rastgele depolama anahtarı, sahiplik, tür, boyut, checksum ve süre bilgisi kaydedilir.

Yapısal inceleme ve küçük resim üretimi de güvenilmeyen dosya işler; izole, süre/bellek sınırlandırılmış süreçlerde çalışır. DOCX/XLSX içindeki ZIP açılımı için dosya adedi ve toplam açılmış boyut sınırı bulunur. ZIP girdileri işletim sistemi yollarına serbestçe çıkarılmaz.

## İş durumları

```text
queued → running → succeeded
                 → failed
                 → retry-wait → queued
queued → cancelled
running → cancelling → cancelled
```

Durum geçişleri koşullu güncellemelerle korunur. Kuyruk teslimi ile işin tamamlanması aynı şey değildir. Worker'ın lease/heartbeat bilgisi kaybolduğunda iş kurtarma politikası uygulanır.

Dosyanın `expired` veya `deleted` olması işin geçmişteki başarı bilgisini değiştirmez. API, iş durumu ile sonucun kullanılabilirliğini ayrı alanlarda döndürür. Çıktı süresi dolmuş başarılı iş indirilemez.

## Worker yürütmesi

- Kuyruk girdisi iş kimliğidir; belgenin kendisi veya kullanıcı denetimli komut içermez.
- Worker işin geçerli olduğunu ve lease sahipliğini doğrular.
- Girdiler için aktif kullanım lease'i edinilir; temizlik çalışan işi yarıda bırakmaz.
- Her deneme ayrı geçici çalışma alanı kullanır. Çıktı önce geçici alana yazılır ve doğrulanır.
- Motor kapalı ağ, ayrıcalıksız kullanıcı, sınırlı CPU/bellek/PID, disk kotası ve zaman aşımıyla çalıştırılır; gerekli harici API bağlantısı yalnızca ilgili adaptöre açılır.
- Container'a Docker socket veya host'un genel dosya sistemi verilmez. Uygulama içinden keyfi container komutu çalıştırılmaz.
- Çıktı boyutu, dosya adedi, türü ve temel açılabilirliği doğrulanır.
- Geçerli lease ile sonuç kalıcılaştırılır; ardından başarılı durum yayımlanır.
- Her bitiş yolunda geçici alanlar ve dosya lease'leri serbest bırakılır.
- PDF parolası job options/kuyruk payload'ına konmaz; job modülünde şifreli ve expiry'li tutulur, worker'ın Python motor sürecine payload olarak `stdin` üzerinden aktarılır. QPDF parola gerektiren çağrılar parolayı argv yerine stdin/password-file kanalından alır. Tek istisna `protect-pdf`: `qpdf --encrypt` stdin kanalı sunmadığından parola iş dizinindeki 0600 izinli geçici bir `@`-argüman dosyasına yazılır ve her bitiş yolunda silinir; süreç zorla sonlandırılırsa motorun iş dizini temizliği dosyayı kaldırır.

İzolasyonun nasıl sağlandığı motor adaptörünün dağıtım tasarımında kanıtlanır. Basit child process çağrısı tek başına sandbox sayılmaz. Office/OCR gibi motorlar aynı host kaynaklarını kontrolsüz paylaşamaz.

## Eşzamanlılık ve kapasite

API ve motorlar için kaynak bütçesi ayrılır. Worker eşzamanlılığı motor sınıfına göre yapılandırılır; OCR ile basit PDF birleştirme aynı maliyet varsayımıyla çalıştırılmaz.

Kota ve işlem sınırları en az şu boyutları kapsar: yükleme baytı, toplam girdi, PDF sayfası, görsel pikseli, çıktı baytı/adedi, geçici disk kullanımı, işlem süresi, kuyruğun maksimum yaşı ve oturum başına aktif iş sayısı.

Kuyruk kapasitesi dolunca yeni işler kontrollü reddedilir. Sayısal sınırlar motor denemesi ve yük testinden çıkarılır; sunucu politikası istemciye doğru gösterilir.

## Tekrar deneme ve idempotency

- İş oluşturma anahtarı oturum ve istek içeriğiyle ilişkilendirilir. Aynı anahtar/farklı içerik reddedilir.
- Geçici ağ veya süreç hataları sınırlı sayıda, artan beklemeyle yeniden denenebilir.
- Geçersiz belge, desteklenmeyen tür ve kalıcı seçenek hataları otomatik denenmez.
- Her denemenin çıktı alanı ayrıdır; yalnızca geçerli lease sahibi sonucu yayımlayabilir.
- Eski worker'ın geç tamamlanan çıktısı fencing/koşullu tamamlanma kontrolüyle reddedilir.
- Dış sağlayıcının desteklediği idempotency kullanılır; aksi halde tekrarın ek maliyet yaratabileceği hesaba katılır.
- Kuyruk kütüphanesinin garantileri uygulamadaki dış etkilerin yalnızca bir kez gerçekleştiğini varsaymak için yeterli değildir.

## İptal ve silme

Kuyruktaki iş atomik olarak iptal edilir. Çalışan işte iptal bayrağı yazılır, motor süreç ağacı durdurulur ve geçici çıktılar kaldırılır. Başarı/iptal yarışı sunucudaki atomik durum geçişiyle çözülür.

Erken silme isteği geldiğinde yeni erişim hemen kapatılır. Aktif iş varsa iptal istenir; dosya lease'i bırakıldıktan sonra fiziksel silme tamamlanır. UI, silme talebi ile tamamlanan fiziksel silmeyi ayırır. İndirmeye başlamış bir bağlantıdaki baytların geri alınamayacağı dikkate alınır.

## Süre dolumu ve temizlik

- Bütün yüklemeler için sonlu bir son kullanım zamanı vardır; iş almayan dosyalar da buna dahildir.
- Kabul edilen işte girdilerin koruma süresi, en uzun kuyruk ve çalışma süresini kapsayacak şekilde hesaplanır; sınırsız uzatılmaz.
- Sonuçların saklama süresi başarı anından hesaplanır; başarısız/iptal edilmiş iş girdileri ayrıca belirlenen kısa temizleme politikasına tabidir.
- Temizlik, sona ermiş dosyaları işaretler, aktif lease'i kontrol eder ve fiziksel silmeyi tekrar güvenli biçimde yürütür.
- Yetim geçici klasörler, tamamlanmamış yüklemeler ve DB kaydı olmayan nesneler uzlaştırma işiyle bulunur.
- Nesne depolama lifecycle kuralı ek korumadır; uygulamanın erişim kesme ve silme sorumluluğunun yerine geçmez.
- Fiziksel silme gecikmeleri ölçülür. Sağlayıcının sakladığı kopyalar ve yedekler ayrı politika gerektirir.

## İndirme ve gözlem

İndirme akışında oturum, sahiplik, iş başarısı, dosya kullanılabilirliği ve süre kontrol edilir. Güvenli Content-Disposition dosya adı kullanılır; yanıtlar private/no-store politikasıyla sunulur. Büyük çıktı uygulama belleğine tamamen alınmaz.

Log/metric alanları: iş ve istek kimliği, araç, motor sürümü, süreler, bayt/sayfa sayısı, deneme sayısı ve güvenli hata kodu. Belge içeriği, orijinal ad, cookie, token ve imzalı URL loglanmaz. Kuyruk gecikmesi, başarısızlık, disk doluluğu ve silme gecikmesi izlenir.

## Zorunlu dayanıklılık kontrolleri

Worker kill/restart, lease kaybı, eşzamanlı iptal/tamamlanma, disk dolması, bozuk çıktı, yarım yükleme, tekrar teslim ve silme başarısızlığı test edilir. Başarı ölçütü: yetkisiz erişim yok, mükerrer yayımlanan çıktı yok, kayıp iş sessizce kalmıyor ve artık dosyalar temizleniyor.
