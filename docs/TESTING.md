# Testler

## Motor kalite incelemesi

`pnpm audit:engines` ağsız, 1 CPU / 1024 MiB / 96 PID sınırında ayrı container'da 15 araç için sekizer senaryoyu üç kez çalıştırır. `pnpm audit:engines --performance-only` küçük/orta/sınıra yakın yüklerde ilk + beş tekrar ve iki eşzamanlı motor işlemini ölçer. İşlem başına CPU, child RSS yüksek su işareti, örneklenen disk kullanımı ve çıktı boyutu kaydedilir; container RSS toplamı veya gerçek donanım soğuk başlangıcı olarak sunulmaz.

`pnpm audit:workflow` güncel kodla `docly-audit:local` imajını build eder. Ayrı `docly-quality-audit` Compose projesinde geçici PostgreSQL, depolama, API, motor ve gerçek worker başlatır. Çalışan yerel frontend 4321 portunda olmalıdır; 4329 test geçidi multipart baytlarını bozmadan yalnızca bu API'ye yönlendirir. Chromium gerçek dosya seçme/başlatma/indirme/silme akışını çalıştırır; harici HTTPS istekleri engellenir. Sonunda yalnızca bu audit projesi ve volume'ü kaldırılır; geliştirme PostgreSQL/worker'ı durdurulmaz. Aynı audit runner'ını paralel başlatma.

Yaşam döngüsü kontrolleri gerçek worker ile kuyrukta iptal, yeniden başlama, kontrollü expiry, fiziksel silme, çalışan işte iptal, kısa timeout ve SIGKILL sonrası gerçek 180 saniyelik lease kurtarmayı kapsar. Timeout veya kurtarma testinin başarısızlığı rapora yazılır; test çalışması başarıyla tamamlandı diye ürün davranışı geçti sayılmaz.

Ham JSONL, ilk tekrar çıktıları ve görsel kanıtlar ignored `.qa/engine-audit/` altındadır. `pnpm audit:report` ölçümlerden [ENGINE-AUDIT](ENGINE-AUDIT.md) raporunu üretir. Beklenen NO_TEXT/NO_TABLES retleri başarılı dönüşüm sayılmaz. Görsel, içerik ve düzenlenebilirlik kapıları ayrı tutulur; eksik kontroller genel kalite onayı vermez. Microsoft Word, geniş gerçek belge corpus'u ve Render kapasitesi bu yerel testlerle onaylanmaz.

Son kalite düzeltmesinde 2 dosyada 33 entegrasyon testi geçti. Bu sayım sentetik örnekleri ve koruma sınırlarını kapsar; geniş belge corpus'u veya üretim kapasite onayı değildir.

`pnpm check` import/katman sınırlarını ve server/web tiplerini doğrular. `pnpm build` server tip kontrolü ve Astro statik derlemesini yapar.

Gerçek entegrasyon testleri için çalışan Docker gerekir:

```sh
pnpm setup:local
pnpm test
```

Runner güncel imajı build eder; DB/motor/migration/API'yi hazırlar. Geliştirme worker'ını durdurur; kontrollü iş yürütmeleriyle test eder ve finally yolunda tekrar başlatır. Aynı DB'de paralel test runner'ı açma.

Vitest ayrı geçici container'da gerçek PostgreSQL, pg-boss ve izole QPDF kullanır. pdf-lib yalnızca sentetik fixture üretimi ve sonucu bağımsız doğrulama içindir; uygulama motoru değildir. Gerçek belge commit edilmez. Teardown yalnızca testin oluşturduğu oturumları temizler; global truncate yoktur. Cache/token dosyaları geçici /tmp alanındadır.

Kontroller: gerçek yükleme/kuyruk/birleştirme/indirme, yeni API instance'ında kalıcılık, sayfa sırası, oturum izolasyonu, eşzamanlı idempotency, kuyruk hatasında rollback, kayıp COMMIT yanıtında sonucun korunması, iptal/attempt fencing, yarıda kalmış attempt kurtarma, format/şifre/boyut/sayfa sınırları, aktif iş kotası, erken silme/fiziksel temizlik ve terk edilmiş iş timeout'u.

Motor suite'i: Türkçe DOCX/PDF dönüşümü, PDF tablolarının XLSX'e aktarımı ve formül metninin inert kalması, Excel ilk/tüm sayfalar, PNG/JPG/ZIP çıktıları, karışık görsellerden PDF, sayfa sıralama/döndürme/bölme, kayıpsız sıkıştırma, gerçek PNG ve taranmış PDF OCR'ı. Makro/traversal/dış bağlantılı Office, aşırı görsel kenarı, uyumsuz giriş ve geçersiz seçenekler reddedilir. NO_TEXT/NO_TABLES/INVALID_OPTIONS durumlarında sahte çıktı oluşmadığı kontrol edilir.

PDF → Word kalite regresyonu kişisel veri içermeyen iki sayfalık tipografi/görsel/iki sütun fixture'ını işler. Düzenlenebilir metin, kalın/italik font, başlık boyutu, görselin varlığı ve dış hyperlink ilişkisinin kaldırılması denetlenir. Oluşan DOCX gerçek LibreOffice ile tekrar PDF'e çevrilir: iki sayfa kalması, başlık/sütun yatay konumları (5 pt), dikey konumları (font ascent farkı nedeniyle 20 pt) ve görsel konumu (2 pt) sınanır. Bu toleranslar birebir piksel eşitliği iddiası değildir. Kullanıcının örneği yalnızca ignored `.qa` alanında görsel olarak kontrol edilir; fixture veya kaynak koda eklenmez.

Kalan doğrulamalar: gerçek process kill sonrası pg-boss lease süresini bekleyen uzun test, disk dolması/silme hatası fault injection, çoklu worker kapasitesi, backup/restore ve kapsamlı erişilebilirlik. Attempt kurtarma testi uzun process kill testi yerine sunulmaz.

Kalıcı Playwright E2E suite'i `pnpm test:e2e` ile hem masaüstü hem mobil Chromium ortamında 16 senaryoyla (araç kartları, filtreler, kategori geçişi, klavye kısayolu, 320px sıfır yatay taşma, sentetik dosya seçimi/değiştirme ve seçenek doğrulama) çalıştırılır. CI iş akışı henüz kurulmamıştır.
