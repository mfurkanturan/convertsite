# Yerel motor desteği

Durum: Kodda 16 araç kaydı vardır; kayıtlı olması aracın uçtan uca kullanılabilir veya kaliteli olduğunu kanıtlamaz. Tekrarlanabilir 120 senaryolu inceleme ve araç bazlı bulgular [ENGINE-AUDIT](ENGINE-AUDIT.md) içindedir. Geniş belge corpus'u, üretim kapasite testi ve tüm bozuk dosya çeşitleri için garanti verilmez. Harici API/AI dönüşüm servisi kullanılmaz.

Dil kapsamı motor türüne bağlıdır: OCR araçları seçili Tesseract dil modelini kullanır; diğer araçlar dil seçimi istemeyen, metin kodlaması/yerleşimi/glyph'leri işleyen dönüşüm veya PDF işlemleridir. Bu, 14 aracın her yazı sistemi için görsel doğrulama aldığı anlamına gelmez. Motor imajında Noto Core ve Noto CJK yedek fontları bulunur; yine de sonuç kaynak PDF'nin metin katmanına, fontlara ve dosya biçimi motorunun Unicode/font desteğine bağlıdır. OCR için Debian Bookworm `tesseract-ocr-all` paketinin sağladığı **123 dil modeli** (ve ayrı script modelleri) sunulur; her belge ve model için tanıma kalitesi ayrıca ölçülmelidir. Yeni dil modelleri paket güncellendiğinde dil listesi de güncellenmelidir.

| Araç | Motor | Destek / sınır |
| --- | --- | --- |
| PDF → Word | pdf2docx + PyMuPDF + python-docx | Düzenlenebilir metin, font boyutu/biçimi, görseller, tablo ve sütun yerleşimi yeniden kurulur; en fazla 50 sayfa. Karmaşık tasarım, eksik font ve taşan metinlerde birebir sonuç garantisi yoktur. OCR içermez; metinsiz tarama NO_TEXT verir. |
| Word → PDF | LibreOffice Writer | DOCX; font/yerleşim farkları olabilir. Makro/gömülü binary/dış bağlantı kabul edilmez. |
| PDF → Excel | pdfplumber + openpyxl | Çizgili tablolar; en az üç düzenli hizalı satırı olan çizgisiz tablolar; tanınan yatay birleştirmeler. Her tablo ayrı çalışma sayfasına; 50 sayfa. Tablosuz/taranmış tablo NO_TABLES. Hücreler formül çalıştırmayan metin olarak yazılır; 32767 karakteri aşan hücre açık limit hatası verir. Bu sınıflar sentetik audit fixture'larında üç tekrarla doğrulandı; geniş gerçek belge corpus'u değildir. |
| Excel → PDF | LibreOffice Calc | XLSX; tüm veya ilk çalışma sayfası. Baskı ayarları ve fontlar sonucu etkileyebilir. |
| PDF → JPG/PNG | Poppler | En fazla 30 sayfalık PDF; sayfa seçimi/sırası, 100/150 DPI, uzun kenar en fazla 3000 px. Çoklu çıktı ZIP. |
| JPG/PNG → PDF | Pillow + ReportLab | En fazla 20 görsel; A4 yön veya görsele göre sayfa. EXIF yönü uygulanır, şeffaflık beyaza basılır. |
| PDF birleştir | QPDF | En az 2 PDF; verilen sıra; toplam en fazla 300 sayfa. |
| PDF sayfa düzenle | QPDF | Sayfa sırası/aralık, seçilmeyeni çıkarma, döndürme; tek PDF veya sayfa başına ZIP. Görsel editör/küçük resimler henüz yok. |
| PDF sıkıştır | QPDF | Kayıpsız stream/object optimizasyonu. Boyut büyürse özgün baytlar döner; küçülme garantisi verilmez. |
| OCR | Tesseract + Poppler/Pillow | Kurulu Tesseract dil modellerinden bir veya en fazla iki model seçilebilir; TXT. PDF en fazla 20 sayfa. Görsel kalite/yön ve model sonucu etkiler; yerleşim korunmaz. |
| PDF → Aranabilir PDF (OCR) | Tesseract + PyMuPDF | Aynı dil modeli seçenekleriyle görünmez, seçilebilir/aranabilir metin katmanı ekler; en fazla 20 sayfa. Yerleşim ve görüntü korunur; doğruluk görüntü kalitesi/model desteğine bağlıdır. Metinli sayfalarda çift metin katmanı oluşabilir. |
| PowerPoint → PDF | LibreOffice Impress | PPTX gerçek slayt ilişkileriyle doğrulanır; en fazla 300 slayt. Sentetik üç slaytlık API → worker → indirme akışında gizli slayt varsayılan olarak PDF'e aktarılmaz. Görsel, tablo, grafik, farklı sayfa oranı ve PowerPoint referansı henüz kapsamlı ölçülmedi. |
| PDF şifrele | QPDF | AES-256; geçici parolalı çıktı doğru parolayla açılarak doğrulanır. Parola job options JSONB/kuyrukta tutulmaz; şifreli TTL secret olarak saklanır. |
| PDF parola kaldır | QPDF | Doğru parola verilmiş şifreli PDF doğrulanarak yüklenir; çıktı parolasız açılır. Yanlış/eksik parola reddedilir. |
| Sayfa numarası | PyMuPDF | Üç konum, `sayfa / toplam` metni; döndürülmüş sayfalarda görünür konum ayrıca incelenmeli. |
| Filigran | PyMuPDF | Gömülü DejaVuSans-Bold, 35° çapraz ve görünür alan ortalaması; sığmayan metin veya fontta olmayan glyph açıkça reddedilir. Sayfa aralığı seçimi yok; bağımsız piksel fark incelemesi eksik. |

Her girdi en fazla 10 MiB, toplam 40 MiB; görseller en fazla 25 milyon piksel ve kenar başına 10000 px. Her çıktı en fazla 40 MiB. DOCX/XLSX ZIP açılımı 40 MiB / 2000 entry ile sınırlandırılır; symlink, traversal, şifreleme ve dış ilişkiler reddedilir. Native iş 90 saniyede sonlandırılır.

## Kaynak yerleşimi

- src/engine: HTTP/auth, kapasite sınırı, süreç grubu ve çıktı streaming.
- engine/python: ortak doğrulama, PDF işlemleri, görüntü dönüşümleri, metin/tablo çıkarma, Office ve OCR için ayrı dosyalar.
- conversions / pdf-operations / ocr modülleri: ayrı handler kayıtları.
- jobs: generic kuyruk/yaşam döngüsü; motor komutları burada bulunmaz.
- shared contracts: tool/input/options izin listesi, notlar ve MIME eşlemeleri.

## Temel bağımlılık kaynakları

PDF → Word, düz metin çıkarma yerine PDF koordinatlarından DOCX yerleşimi üretir. Calibri/Cambria için metrik uyumlu Carlito/Caladea fontları motor imajında bulunur; özgün fontlar lisanssız kopyalanmaz. Dış hyperlink ilişkileri kaldırılırken görünen metin ve biçim korunur. Word sayfası tek bir resme dönüştürülmez. Sentetik 8 senaryolu ayrı audit'te dönük sayfa, tablo ve basit yerleşim örnekleri üç tekrarda geçti; iki sütunlu `layout` örneği içerik ve konum hedeflerini geçmedi. PDF → Excel'de çizgisiz/merge davranışı sentetik audit ile ölçüldü; gerçek belge corpus'u değerlendirilmedi. Bu bulgular diğer araçlara veya gerçek belgelere kalite garantisi vermez.

Satır sonları korunur; metin düzenlenebilir kalır ancak Word'de yeniden akış doğal bir kaynak DOCX kadar esnek olmayabilir. Sütun geçişleri Word/Writer uyumu için açık column break ile yazılır. Kaynakla piksel içeriği eşleşen görseller sayfa koordinatlarına sabitlenir; kırpılmış, dönmüş veya dönüştürülmüş görseller eşleşmeyebilir. Karmaşık vektör tasarımları ve ikiden fazla sütun için kalite garantisi yoktur.

[pdf2docx](https://github.com/ArtifexSoftware/pdf2docx) MIT lisanslıdır; Artifex aktif bakımı bırakmıştır. Sabit sürüm ve yerleşim regresyon testi kullanılır. Bağımlılığı [PyMuPDF](https://pymupdf.readthedocs.io/en/latest/about.html#license-and-copyright) AGPL veya ticari lisanslıdır. Üretim dağıtımından önce projenin lisans modeliyle uyumu karara bağlanmalıdır; pdf2docx'in MIT olması PyMuPDF lisansını değiştirmez.

[LibreOffice CLI](https://help.libreoffice.org/latest/en-US/text/shared/guide/start_parameters.html), [pdfplumber](https://github.com/jsvine/pdfplumber), [Tesseract CLI](https://tesseract-ocr.github.io/tessdoc/Command-Line-Usage.html). Python üst seviye sürümleri engine/requirements.txt içinde sabittir. Native paket ve transitif Python bağımlılıklarının tam imaj pinleme/tedarik denetimi üretim hazırlığında yapılacaktır.
