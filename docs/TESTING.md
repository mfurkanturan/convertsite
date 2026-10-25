# Testler

## Motor kalite incelemesi

`pnpm audit:engines` ağsız, 1 CPU / 1024 MiB / 96 PID sınırında ayrı container'da 15 araç için sekizer senaryoyu üç kez çalıştırır. `pnpm audit:engines --performance-only` küçük/orta/sınıra yakın yüklerde ilk + beş tekrar ve iki eşzamanlı motor işlemini ölçer. İşlem başına CPU, child RSS yüksek su işareti, örneklenen disk kullanımı ve çıktı boyutu kaydedilir; container RSS toplamı veya gerçek donanım soğuk başlangıcı olarak sunulmaz.

`pnpm audit:workflow` güncel kodla `docly-audit:local` imajını build eder. Ayrı `docly-quality-audit` Compose projesinde geçici PostgreSQL, depolama, API, motor ve gerçek worker başlatır. Çalışan yerel frontend 4321 portunda olmalıdır; 4329 test geçidi multipart baytlarını bozmadan yalnızca bu API'ye yönlendirir. Chromium gerçek dosya seçme/başlatma/indirme/silme akışını çalıştırır; harici HTTPS istekleri engellenir. Sonunda yalnızca bu audit projesi ve volume'ü kaldırılır; geliştirme PostgreSQL/worker'ı durdurulmaz. Aynı audit runner'ını paralel başlatma.

Yaşam döngüsü kontrolleri gerçek worker ile kuyrukta iptal, yeniden başlama, kontrollü expiry, fiziksel silme, çalışan işte iptal, kısa timeout ve SIGKILL sonrası gerçek 180 saniyelik lease kurtarmayı kapsar. Timeout veya kurtarma testinin başarısızlığı rapora yazılır; test çalışması başarıyla tamamlandı diye ürün davranışı geçti sayılmaz.

Ham JSONL, ilk tekrar çıktıları ve görsel kanıtlar ignored `.qa/engine-audit/` altındadır. `pnpm audit:report` ölçümlerden [ENGINE-AUDIT](ENGINE-AUDIT.md) raporunu üretir. Beklenen NO_TEXT/NO_TABLES retleri başarılı dönüşüm sayılmaz. Görsel, içerik ve düzenlenebilirlik kapıları ayrı tutulur; eksik kontroller genel kalite onayı vermez. Microsoft Word, geniş gerçek belge corpus'u ve Render kapasitesi bu yerel testlerle onaylanmaz.

Karşılaştırmalı ara koşu gerektiğinde `node scripts/audit-engines.mjs --tools pdf-to-word pdf-to-excel --replace-tools --output-dir .qa/engine-audit-interim` kullanılabilir. Çıktı yolu `.qa/` altında doğrulanır; baseline `.qa/engine-audit/` korunur. Seçili araç raporu tam 120 senaryo raporuyla karıştırılmaz ve `report-engine-audit.mjs` bütünlük koruması kaldırılmaz.

15 araçlık audit'in izole regresyon koşusunda 2 dosyada 36 entegrasyon testi geçti (`.qa/engine-audit/regression.txt`). Bu sayım ölçüm sürümüne aittir; sonradan eklenen aranabilir PDF aracı için kanıt değildir. Audit değerlendiricisinin dört birim testi ayrıca geçti. 120 senaryo × üç tekrar ve 360 performans çağrısının bütünlüğü rapor üretiminde kontrol edilir; eksik/çift kayıt rapor üretimini durdurur. Bu sayımlar geniş belge corpus'u veya üretim kapasite onayı değildir.

`pnpm check` import/katman sınırlarını ve server/web tiplerini doğrular. Web tarafının `check` betiği ayrıca `check:i18n` çalıştırır: İspanyolca sözlükte İngilizce kopya kalmadığını, TR/EN anahtar eşleşmesini (`api.codes.*` hariç, çünkü TR sunucunun Türkçe mesajlarını kullanır) ve her İngilizce senaryonun İspanyolca bir karşılığı olduğunu doğrular. `pnpm build` server tip kontrolü ve Astro statik derlemesini yapar.

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

Audit'te gerçek SIGKILL sonrası pg-boss lease süresini bekleyen uzun kurtarma testi geçti. Kısa timeout testinde beklenen PROCESSING_TIMEOUT yerine ENGINE_UNAVAILABLE döndü; bu açık bulgudur. Kalan doğrulamalar: disk dolması/silme hatası fault injection, çoklu worker kapasitesi, backup/restore ve kapsamlı erişilebilirlik. Hızlı attempt kurtarma testi uzun process kill testi yerine sunulmaz.

Playwright E2E suite `pnpm test:e2e` ile masaüstü Chromium, mobil Chromium, Firefox, Safari WebKit, mobil Safari WebKit ve Windows Edge projelerinde çalışır. Görsel matris masaüstü Chromium'da homepage 320/360/390/768/1024/1280/1440/1920 px ve tool/guides/security 320/390/768/1440 px ekran görüntüsü alır. 16 araca dosya seçimi smoke testi Chromium ve mobil Chromium'da çalışır. Sprint 8 kontrolleri TR ve EN ana sayfalarında rehber adımlarını ve doğal yüksekliği; 2/3/5 öğeli kategori ızgaralarını 1440/1024/768/641/390 px boyutlarında; öne çıkan rehber bağlantısının klavyeyle Enter navigasyonunu; tek dosyalı ana sayfa ve çok dosyalı araç girişini; yardımcı metin kontrastı/font boyutu ve kısa kopya koşullarını kapsar. Fiziksel cihaz ve ekran okuyucu denemesi otomatik Playwright doğrulamasına dahil değildir. Astro/Svelte hydration gerektiren kontroller adım öncesi uygulama kabuğunun hydrate olmasını bekler. Analitik izin testleri varsayılan olarak atlanır; yerel Vite sunucusunda `PUBLIC_POSTHOG_LOCAL=true`, `POSTHOG_E2E=1` ile ayrıca çalıştırılır. Görsel çıktılar ignored `.qa/uiux-sprint-8/screenshots/` altındadır.

GitHub Actions kalite iş akışı `.github/workflows/quality.yml` pull request ve `main` push'larında `pnpm check`, `pnpm build` ve Playwright testlerini çalıştırır. Uzak CI Linux'ta Edge/Safari gerçek tarayıcılarını veya fiziksel telefonları doğrulamaz. Playwright raporu/test sonuçları artifact olarak yüklenir.

`pnpm audit:workflow` web/API → queue → gerçek worker → download/delete akışını ve lifecycle senaryolarını izole Docker ortamında denetler. Bu, araç başına kullanıcı akışının motor desteğini kanıtlamaz; sonuçlar ve motor sınırlılıkları ilgili audit raporlarında değerlendirilir.

## Site genelinde içerik ve çalışma alanı regresyonu

`e2e/content-consistency.spec.ts` masaüstü Chromium’da 16 araç × TR/EN × 320/390/768/1440px matrisini, ayarlı/ayarsız panel ayrımını, tek H1 ve görünür FAQ/schema eşleşmesini kontrol eder. 41 rehber ve yerel statik sayfalar da aynı genişliklerde taşma, yerel başlık/meta ve yalnızca mevcut eşdeğerler için hreflang yönünden denetlenir.

Diğer senaryolar API erişilemiyorken varsayılan limitlerin aktif politika gibi görünmemesini, yeniden bağlantıyla özel 17 dakikalık politika alınmasını, dosyanın açık başlatma eyleminden önce gönderilmemesini, kuyruk/çalışma/sonuç/silme ve yenilemeyle geri alınan başarısız/iptal/süre dolumu ekranlarını sınar. Bu testlerde API yanıtları sentetiktir; motor dönüşümü, gerçek sahiplik veya fiziksel silme kanıtı değildir. Gerçek motor/erişim testlerinin kapsamı yukarıda değişmeden kalır.

Önce/sonra görsel inceleme `.qa/slop/`, mevcut genişlik ekran matrisi `.qa/uiux-sprint-8/screenshots/` altındadır. Test sonucu sayısı çalıştırılan proje ve filtreye göre raporlanmalıdır; atlanan tarayıcı veya analitik testleri geçmiş kabul edilmez.

## Görsel kalite sprintleri

`e2e/visual-quality.spec.ts` TR/EN ana sayfasını 320/360/390/768/1024/1440/1920px genişliklerde kontrol eder. Tek container hizası, başlık/kart ölçüleri, 16 benzersiz araç, kırpılmayan içerik, mobil 44px gezinme hedefleri, yerel dosya seçimi, drag/focus, yanlış tür/büyük dosya, tüm katalog navigasyonu ve dil değişimi sınanır. Geçerli dosya seçimi işlem başlatılmadan POST üretmemelidir.

`e2e/content-consistency.spec.ts` seçili araç ayarının TR/EN yardım metnini, reklam önizlemesinin yalnızca ana sayfada görünmesini, yasal bölüm bağlantılarının hedeflerini ve güvenlik işlem şeridinin dört adımını da doğrular.

%200 için 1440 fiziksel / 720 CSS piksel eşdeğer reflow, DPR 2 ile yakalanır. Bu otomatik ölçüm gerçek tarayıcı menüsündeki zoom veya fiziksel cihaz denemesi değildir. Önce/sonra görüntüler `.qa/visual-quality/before/` ve `after/`; hesaplanmış ölçüler `metrics.json`, görsel karşılaştırma `comparison.html` içindedir.

Mevcut kategori testi artık ortalanmış 6 sanal kolon yerine eşit kart genişliğini, sol hizalı satır başlangıçlarını ve gerçek 3/2/1 kolon davranışını kontrol eder. Beş işlem grubu renginin normal metin kontrastı mevcut kontrast testine eklendi. Ayrı lint komutu yoktur; `pnpm check` import sınırı ve tip kontrollerini içerir. Sprint sonuçları [VISUAL-QUALITY-SPRINTS](VISUAL-QUALITY-SPRINTS.md) içindedir.
