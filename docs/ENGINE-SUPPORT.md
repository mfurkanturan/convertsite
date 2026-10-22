# Yerel motor desteği

Durum: İlk uygulama ve sentetik belge doğrulaması. Geniş belge corpus'u, üretim kapasite testi ve tüm bozuk dosya çeşitleri için garanti verilmez. Harici API/AI dönüşüm servisi kullanılmaz.

| Araç | Motor | Destek / sınır |
| --- | --- | --- |
| PDF → Word | pdf2docx + PyMuPDF + python-docx | Düzenlenebilir metin, font boyutu/biçimi, görseller, tablo ve sütun yerleşimi yeniden kurulur; en fazla 50 sayfa. Karmaşık tasarım, eksik font ve taşan metinlerde birebir sonuç garantisi yoktur. OCR içermez; metinsiz tarama NO_TEXT verir. |
| Word → PDF | LibreOffice Writer | DOCX; font/yerleşim farkları olabilir. Makro/gömülü binary/dış bağlantı kabul edilmez. |
| PDF → Excel | pdfplumber + openpyxl | Algılanan tablolar ayrı çalışma sayfasına; 50 sayfa. Tablosuz/taranmış tablo NO_TABLES. Hücreler formül çalıştırmayan metin olarak yazılır. |
| Excel → PDF | LibreOffice Calc | XLSX; tüm veya ilk çalışma sayfası. Baskı ayarları ve fontlar sonucu etkileyebilir. |
| PDF → JPG/PNG | Poppler | En fazla 30 sayfalık PDF; sayfa seçimi/sırası, 100/150 DPI, uzun kenar en fazla 3000 px. Çoklu çıktı ZIP. |
| JPG/PNG → PDF | Pillow + ReportLab | En fazla 20 görsel; A4 yön veya görsele göre sayfa. EXIF yönü uygulanır, şeffaflık beyaza basılır. |
| PDF birleştir | QPDF | En az 2 PDF; verilen sıra; toplam en fazla 300 sayfa. |
| PDF sayfa düzenle | QPDF | Sayfa sırası/aralık, seçilmeyeni çıkarma, döndürme; tek PDF veya sayfa başına ZIP. Görsel editör/küçük resimler henüz yok. |
| PDF sıkıştır | QPDF | Kayıpsız stream/object optimizasyonu. Boyut büyürse özgün baytlar döner; küçülme garantisi verilmez. |
| OCR | Tesseract + Poppler/Pillow | Türkçe/İngilizce/ikisi, TXT. PDF en fazla 20 sayfa. Görsel kalite/yön sonucu etkiler; yerleşim korunmaz. |

Her girdi en fazla 10 MiB, toplam 40 MiB; görseller en fazla 25 milyon piksel ve kenar başına 10000 px. Her çıktı en fazla 40 MiB. DOCX/XLSX ZIP açılımı 40 MiB / 2000 entry ile sınırlandırılır; symlink, traversal, şifreleme ve dış ilişkiler reddedilir. Native iş 90 saniyede sonlandırılır.

## Kaynak yerleşimi

- src/engine: HTTP/auth, kapasite sınırı, süreç grubu ve çıktı streaming.
- engine/python: ortak doğrulama, PDF işlemleri, görüntü dönüşümleri, metin/tablo çıkarma, Office ve OCR için ayrı dosyalar.
- conversions / pdf-operations / ocr modülleri: ayrı handler kayıtları.
- jobs: generic kuyruk/yaşam döngüsü; motor komutları burada bulunmaz.
- shared contracts: tool/input/options izin listesi, notlar ve MIME eşlemeleri.

## Temel bağımlılık kaynakları

PDF → Word, düz metin çıkarma yerine PDF koordinatlarından DOCX yerleşimi üretir. Calibri/Cambria için metrik uyumlu Carlito/Caladea fontları motor imajında bulunur; özgün fontlar lisanssız kopyalanmaz. Dış hyperlink ilişkileri kaldırılırken görünen metin ve biçim korunur. Word sayfası tek bir resme dönüştürülmez. PDF → Excel tablo çıkarma davranışı ayrıca değerlendirilir; Word iyileştirmesi diğer dokuz araç için kalite garantisi değildir.

Satır sonları korunur; metin düzenlenebilir kalır ancak Word'de yeniden akış doğal bir kaynak DOCX kadar esnek olmayabilir. Sütun geçişleri Word/Writer uyumu için açık column break ile yazılır. Kaynakla piksel içeriği eşleşen görseller sayfa koordinatlarına sabitlenir; kırpılmış, dönmüş veya dönüştürülmüş görseller eşleşmeyebilir. Karmaşık vektör tasarımları ve ikiden fazla sütun için kalite garantisi yoktur.

[pdf2docx](https://github.com/ArtifexSoftware/pdf2docx) MIT lisanslıdır; Artifex aktif bakımı bırakmıştır. Sabit sürüm ve yerleşim regresyon testi kullanılır. Bağımlılığı [PyMuPDF](https://pymupdf.readthedocs.io/en/latest/about.html#license-and-copyright) AGPL veya ticari lisanslıdır. Üretim dağıtımından önce projenin lisans modeliyle uyumu karara bağlanmalıdır; pdf2docx'in MIT olması PyMuPDF lisansını değiştirmez.

[LibreOffice CLI](https://help.libreoffice.org/latest/en-US/text/shared/guide/start_parameters.html), [pdfplumber](https://github.com/jsvine/pdfplumber), [Tesseract CLI](https://tesseract-ocr.github.io/tessdoc/Command-Line-Usage.html). Python üst seviye sürümleri engine/requirements.txt içinde sabittir. Native paket ve transitif Python bağımlılıklarının tam imaj pinleme/tedarik denetimi üretim hazırlığında yapılacaktır.
