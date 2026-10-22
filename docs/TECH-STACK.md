# Teknoloji kararları

Durum: Önerilen başlangıç altyapısı. Kesin sürümler kurulum tarihinde uyumluluk kontrolüyle seçilecek ve lockfile'a sabitlenecektir. Performans üstünlüğü henüz ölçülmüş değildir.

Frontend Astro 7.4.2, @astrojs/svelte 9.1.1, Svelte 5.57.2 ve TypeScript 6.0.3 ile kuruldu. Fastify, Drizzle, pg-boss ve Vitest vardır. 10 araç izole QPDF/Poppler/LibreOffice/Tesseract ve Python adaptörleriyle çalışır; ayrıntılar ENGINE-SUPPORT içindedir. Gerçek sürüm kaynağı manifestler/lockfile ve engine/requirements.txt'dir. Stil, Tailwind CSS v4 + `@theme` token'ları (kaynak: `apps/web/src/styles/tokens.css`) ile yazılır; ESLint/Prettier ve CI workflow'ü henüz yoktur. Import sınırı kontrolü ve gerçek DB/motor testleri vardır.

## Uygulama temeli

| Alan | Başlangıç kararı | Gerekçe / sınır |
| --- | --- | --- |
| Dil | TypeScript, strict mod | Uygulama ve istemci sözleşmelerinde ortak dil |
| Runtime | Kurulum tarihinde desteklenen Node.js LTS | Tek uygulama runtime'ı; native motorlar ayrı süreç |
| Paket yönetimi | pnpm workspace ve tek lockfile | web, server ve contracts arasında açık bağımlılıklar |
| Web | Astro, statik çıktı | Araç tanıtımları ve SEO sayfaları için düşük istemci yükü |
| Etkileşim | Svelte | Yükleyici, ayarlar, sayfa sıralama ve durum bileşenleri |
| Stil | Tailwind CSS + CSS değişkenleri | Ortak tasarım token'ları ve sınırlı bileşen sistemi |
| API | Fastify | Şema tabanlı doğrulama ve ince HTTP katmanı |
| HTTP şemaları | TypeBox + Fastify JSON Schema | Çalışma zamanı doğrulaması ve tiplerin aynı kaynaktan türemesi |
| Veritabanı | PostgreSQL | Metadata ve kalıcı iş kuyruğu |
| Veri erişimi | Drizzle ORM + sürümlü migration | SQL'e yakın veri erişimi; yalnızca infrastructure içinde |
| Kuyruk | pg-boss | İlk aşamada ayrı broker işletmeden PostgreSQL kullanımı |
| Log | Fastify/Pino tabanlı yapılandırılmış log | İstek/iş korelasyonu ve merkezi redaction |
| Test | Vitest, Playwright | İş kuralları, gerçek adaptör entegrasyonu ve kritik kullanıcı akışları |
| Kod denetimi | ESLint, Prettier, TypeScript kontrolü | Modül sınırları ve tutarlı kod |
| Dağıtım | Linux, Docker Compose, Caddy | Tek sunucuda anlaşılır başlangıç ve HTTPS |

Astro API sorumluluğu üstlenmez; statik web ve Fastify tek origin altında yayınlanır. SSR ancak somut ihtiyaç doğarsa ayrıca değerlendirilir.

## Dosya depolama

İlk geliştirmede ve tek sunuculu ilk dağıtımda private disk adaptörü kullanılabilir. API ve worker aynı özel volume'e erişir; worker'ın geçici alanı ayrıca sınırlanır. Kullanıcı dosya adları fiziksel yol olarak kullanılmaz.

Birden fazla sunucuya geçmeden önce S3 uyumlu nesne depolama adaptörü eklenir. API/worker'ın disk paylaşımı varmış gibi çalışacağı varsayılmaz. Presigned indirme kullanılırsa kısa süreli olmalı; erken silme sonrası önceden üretilmiş bağlantıların davranışı açıkça tasarlanmalıdır.

## Motor adayları ve karar kapıları

| İhtiyaç | Aday | Karar kapısı |
| --- | --- | --- |
| DOCX/XLSX → PDF | İzole LibreOffice CLI | Fontlar, baskı alanı, Türkçe karakter, süre ve bellek testi |
| Office motorunu HTTP ile sarmalama | İhtiyaç halinde Gotenberg | CLI'ya göre işletim faydası ve ek kaynak maliyeti |
| PDF birleştirme/bölme/döndürme | QPDF | Sayfa sırası, döndürme, bozuk belge ve çıktı bütünlüğü |
| PDF sıkıştırma | Önce QPDF kayıpsız profil; kayıplı motor ayrıca seçilir | Boyut/kalite karşılaştırması; her PDF'nin küçüleceği varsayılmaz |
| OCR | Tesseract ve PDF için ayrı rasterizer | Türkçe/İngilizce doğruluk, DPI ve süre/bellek sınırları |
| PDF rasterizasyonu / görsel → PDF | Poppler + Pillow/ReportLab seçildi | Sentetik örnekler doğrulandı; geniş corpus ve kapasite ölçümü sürüyor |
| PDF → DOCX | pdf2docx + PyMuPDF + python-docx | Koordinat, font, görsel, tablo ve sütun analiziyle düzenlenebilir DOCX; birebir garanti yok. Bakım ve lisans koşulları ENGINE-SUPPORT içinde |
| PDF → XLSX | pdfplumber + openpyxl | Algılanan tabloları aktarır; taranmış tablolar desteklenmez |

Gotenberg, PDF → Word/Excel sorununu tek başına çözen bir motor olarak kabul edilmez. OCR motoru da özgün tablo ve sayfa düzenini otomatik olarak geri kurma garantisi sağlamaz.

Motorlar application içindeki dar portların arkasında bulunur. Sağlayıcı değiştirmek HTTP route ve domain kurallarını değiştirmemelidir. Harici API otomatik veya gizli fallback olarak devreye alınmaz.

## Başlangıçta eklenmeyecek bileşenler

Redis, RabbitMQ, Kafka, Kubernetes, Elasticsearch, ayrı auth servisi, mikroservisler ve ikinci web framework'ü başlangıç için gerekli değildir. Gereksinim veya ölçüm oluşursa karar kaydıyla değerlendirilir.

## Sürüm ve tedarik disiplini

- Runtime ve paket sürümleri birbiriyle doğrulanır; lockfile commit edilir.
- Motor sürümü, font paketi ve OCR dil verileri tekrar üretilebilir biçimde sabitlenir.
- Container etiketleri üretimde belirsiz `latest` olarak bırakılmaz.
- Motor dağıtım/lisans koşulları yayından önce kontrol edilip karar kaydına yazılır.
- Yeni bağımlılık mevcut aracın çözemediği somut bir ihtiyaçla gerekçelendirilir.
- Güvenlik ve sürüm güncellemeleri uyumluluk kontrolleriyle uygulanır.

## Resmî kaynaklar

- [Astro islands](https://docs.astro.build/en/concepts/islands/)
- [Astro framework bileşenleri](https://docs.astro.build/en/guides/framework-components/)
- [Fastify doğrulama ve serileştirme](https://fastify.dev/docs/latest/Reference/Validation-and-Serialization/)
- [Drizzle dokümantasyonu](https://orm.drizzle.team/docs/overview)
- [pg-boss](https://github.com/timgit/pg-boss)
- [Gotenberg Office → PDF](https://gotenberg.dev/docs/convert-with-libreoffice/convert-to-pdf)
- [QPDF](https://qpdf.readthedocs.io/)
- [Tesseract](https://tesseract-ocr.github.io/tessdoc/)
- [Adobe PDF dışa aktarma](https://experienceleague.adobe.com/en/docs/acrobat-services-learn/tutorials/pdfservices/exportpdf)
