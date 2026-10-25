# Sprint 0 — Kanıta dayalı mevcut durum denetimi

Tarih: 24 Ekim 2026  
Repository HEAD: 74c1c03  
Yöntem: AGENTS.md ve belirtilen ürün, mimari, dosya işleme, UI, deployment, SEO ve analytics belgeleri okundu; Astro/Svelte kaynakları ve ilgili API/contract/engine dosyaları incelendi. Yerel ana sayfanın tam sayfa görüntüleri altı genişlikte kaydedildi. PostHog başlangıç dashboard'u önceki kullanıcı oturumunda açık olan aynı projede yenilendi ve okundu.

Bu çalışma yalnızca Sprint 0 audit'idir. UI ve dosya işleme kodu değiştirilmedi. Browser akışını uçtan uca çalıştırma, otomatik test, build, Lighthouse ve axe bu aşamada çalıştırılmadı.

## Özet

Ürün halihazırda Astro statik sayfaları, Svelte etkileşimleri ve Fastify API/worker tabanlı bir dosya işleme akışına sahip. Ana sayfada birden fazla başlangıç noktası (araçları incele ve dosya seç), 16 aynı yoğunlukta araç kartı, kategori filtreleri, arama, altı rehber kartı, güvenlik iddiaları, FAQ ve uzun footer yer alıyor.

En önemli tasarım engelleri:

1. Güvenlik ve kalite metinleri, uygulama kodu ve test belgeleriyle bazı noktalarda çelişiyor.
2. 16 aracın katalogda görünmesi, hepsinin güncel sürümde uçtan uca kalite onayı olduğu izlenimi verebilir. Kapsamlı motor raporu mevcut HEAD'den daha eski kod sürümlerini ölçmüş ve 16. aracı kapsamamış.
3. Yerel responsive ölçümünde ana sayfa 768 ve 1024 CSS px'te yatay belge taşması üretiyor.
4. Güncel PostHog örneklemi araç popülerliği veya huni performansı belirlemek için yeterli değil. Belgede kaydedildiği yazan özel funnel mevcut panelde görünmedi; yalnızca “Your starter dashboard” görüldü.

## S0-01 — Mevcut frontend ve route envanteri

- Framework: Astro 7 statik çıktı; Svelte 5 bileşenleri etkileşimli alanlarda hydrate ediliyor. Workspace TypeScript ve pnpm kullanıyor.
- Stil: Tailwind CSS v4; token kaynağı apps/web/src/styles/tokens.css; global ve component katmanları apps/web/src/styles/global.css içinde.
- Fontlar self-hosted Inter Variable ve Sora Variable. Harici font isteği beklenmiyor.
- Ana sayfa: İngilizce / ve /en/; Türkçe /tr/.
- Araç sayfaları: /tr/[tool] ve /en/[tool]. Çalışma alanı ana sayfada hash ile de açılabiliyor: #tool/{id}.
- Rehberler: Türkçe /tr/kullanim/ ve slug sayfaları; İngilizce /use-cases/ ve slug sayfaları.
- Yasal/bilgi sayfaları: Hakkımızda, güvenlik, gizlilik, kullanım şartları, iletişim; TR ve EN sürümleri mevcut.
- Başlıca etkileşim bileşenleri: hero.svelte, tool-grid.svelte, tool-workspace.svelte, file-dropzone.svelte, live-job.svelte, pdf-page-organizer.svelte, home-guides-showcase.svelte, help-section.svelte, topbar.svelte, sidebar.svelte.
- Tasarım breakpoint'leri bir tek standarda bağlı değil; 480, 540, 600, 640, 650, 760, 1024 ve 1100 px gibi eşikler var. Bu eşikler Sprint 1'de gözden geçirilmeli.
- Ana sayfanın HTML'inde skip link, landmark'lar ve bir H1 var. Arama için görünür label ve aria-label var. Rehber sekmelerinde tablist/tab rolleri var; tam klavye sekme deseni, ilişkili tabpanel ve ok tuşu davranışı kaynakta görünmüyor. Bu, otomatik veya manuel WCAG uygunluk sonucu değildir.

## S0-02 — Araç envanteri ve kalite kanıtının sınırı

Repo UI ve contract katmanında 16 ToolId listeliyor. /api/capabilities da toolIds listesini enabledTools olarak döndürüyor; UI'da kartlar önceden statik listeleniyor ve başlatma düğmesi capabilities yanıtına göre açılıyor. Bu kayıt/enable durumu kalite kanıtı değildir.

docs/ENGINE-AUDIT.md 15 araç için 120 senaryo ve 360 motor çağrısı raporluyor. Rapor kendi ölçümlerini 122e845 ve bazı OCR değişikliklerini 9bb1b18 ile ilişkilendiriyor; mevcut HEAD 74c1c03. Rapor pdf-to-pdf-ocr aracını açıkça kapsam dışında bırakıyor. Dolayısıyla bu tablo tarihsel ölçüm kanıtıdır, güncel HEAD için yeniden test edilmiş kalite puanı değildir.

| Araç | Kayıtlı iş | Tarihsel audit çıktısı kontrolü | Sprint 0 yorumu |
|---|---|---:|---|
| PDF → Word | PDF → DOCX | 0/7; 1 doğru ret | Yüksek risk. Yerleşim, dönük sayfa ve görünür kayıp metin iddialarını güncel sürümde yeniden ölç. |
| PDF → Excel | PDF → XLSX | 2/4; 4 doğru ret | Çizgisiz/birleşik tablo ve hücre doğruluğu için sınırlı kanıt. |
| OCR / metin çıkar | PDF/JPG/PNG → TXT | 6/7; 1 doğru ret | Kalan örnek başarısızlığı ve OCR kalite sınırları görünür olmalı. |
| PDF sıkıştır | PDF → PDF | 8/8 | Tarihsel sentetik set geçişi; genel küçülme garantisi yok. |
| PDF birleştir | PDF → PDF | 8/8 | Tarihsel sentetik set geçişi. |
| PDF sayfa düzenle | PDF → PDF/ZIP | 8/8 | Küçük resim editörü yok; gerçek kullanıcı akışı/kalite kapsamı ayrı tutulmalı. |
| PDF şifrele | PDF → şifreli PDF | 0/8 | Tarihsel audit başarısız; özellik ve UI vaadi yeni doğrulama olmadan onaylanmamalı. |
| PDF parola kaldır | şifreli PDF → PDF | 0/8 | Tarihsel audit girdiyi INVALID_DOCUMENT ile reddetmiş; parola durumlarını güncel kodda uçtan uca doğrula. |
| Sayfa numarası | PDF → PDF | 7/8 | Bir başarısız senaryo; döndürülmüş sayfa konumu ayrıca ölçülmeli. |
| Filigran | PDF → PDF | 4/8 | Türkçe glyph/konum için kalite riski. |
| PDF → JPG/PNG | PDF → raster görsel/ZIP | 8/8 | Tarihsel sentetik set; renk/kırpma ve geniş belge sınıfları tam onay değil. |
| JPG/PNG → PDF | Görseller → PDF | 7/7; 1 doğru ret | Tarihsel sentetik set. |
| Word → PDF | DOCX → PDF | 8/8 | Kaynak Office uygulaması referansı ve elle kırpılma/örtüşme eksik. |
| Excel → PDF | XLSX → PDF | 8/8 | Baskı düzeni ve kaynak uygulama referansı eksik. |
| PowerPoint → PDF | PPTX → PDF | 0/8, UNSUPPORTED_FORMAT | Tarihsel rapor ile mevcut destek/contract/Dockerfile arasında sürüm farkı var; güncel akış yeniden doğrulanmadan durum iddiası kurulamaz. |
| PDF'yi aranabilir yap (OCR) | PDF → OCR katmanlı PDF | 15 araçlık rapor dışında | Kayıtlı destek bilgisi var; bağımsız güncel kalite ölçümü yok. |

Mevcut belgeler arasındaki diğer fark: ENGINE-SUPPORT, PowerPoint için güncel akış ve Impress desteği anlatırken eski ENGINE-AUDIT UNSUPPORTED_FORMAT rapor ediyor. Mevcut infra/engine.Dockerfile Impress paketini kuruyor ve contracts PPTX'i izinli girdi sayıyor. Bu kod/doküman farkı muhtemel sürüm eskiliğini düşündürür; burada motor çalıştırılıp kanıtlanmadı.

UI kataloğundaki başlıklar/öneriler bazı araçlar için kesin kalite vaadi taşıyor. PDF→Word kartı “düzenlenebilir” DOCX derken ana sayfa güven şeritlerinde “yüksek çözünürlüklü çıktı garantisi” bulunuyor; genel sayfa “saniyeler içinde” dönüşüm diyor. Kopyalar araç bazındaki kalite/audit ve gerçek limits bilgisine bağlanmalı.

## S0-03 — Bölüm bazında ilk karar

| Mevcut parça | Karar | Gerekçe |
|---|---|---|
| Logo / marka | KORU | Marka tanınabilir; Sprint 0 rebrand gerekçesi göstermiyor. |
| Header, arama, dil seçici | KORU + İYİLEŞTİR | Mevcut ana yön bulma ve klavye arama kısayolu değerli. Güvenlik/referans bağlantısı bulunurluğu değerlendirilsin. |
| Hero ve Quick File Drop | DEĞİŞTİR | Bırakma/yükleme aksiyonu ürün merkezi olsun; mevcut “Tüm araçları incele” ve sağdaki “Dosya seç” iki ayrı primary ağırlıkta. |
| Hero altındaki üç güven kartı | BİRLEŞTİR | Teknik olarak doğrulanmamış/tekrarlanan iddialar var. Tek kısa ve kanıtlı veri işleme özeti kullan. |
| 16 araç kataloğu | DEĞİŞTİR | Hiçbir araç silinmesin; popüler/önerilen araçlar ve anlamlı kategoriler ayrışsın. Kullanım örneklemi popülerlik sıralaması için yetmiyor. |
| Rehber bölümü | BİRLEŞTİR + DEĞİŞTİR | İçerik korunmalı; sekmeli kategori + benzer altı kart kalabalığı editorial hiyerarşiyle sadeleşsin. |
| Güvenlik bölümü ve privacy bandı | BİRLEŞTİR / bazı metni KALDIR | Birbirini yineleyen güven vaatleri teknik gerçekle uyuşmuyor. Kanıtsız iddiaları yayından çıkar. |
| FAQ | KORU + DÜZELT | Kullanıcı ihtiyacı var; mevcut dört cevap güvenlik ve dönüşüm kalitesi konusunda yeniden yazılmalı ve kapsamı genişletilmeli. |
| Footer | DEĞİŞTİR | 16 araç + sekiz rehber ve tekrarlanan hukuki bağlantı bağlantı listesini uzatıyor. |
| Araç detay şablonu | KORU + İYİLEŞTİR | Başlık, yükleme, seçenek, durum ve sonuç gerçek akışa bağlı. Kalite sınırlamaları ve hata geri dönüşü daha erken görünmeli. |
| Ad slotu | KORU, yerleşim sınırını gözet | Kodda ana sayfada araçlardan sonra yer alıyor; işlem/indirme akışının içine taşınmamalı. |

## S0-04 — Kullanıcı görevleri

1. **Ne yapacağını biliyor:** araç araması, kategori, kart veya doğrudan araç URL'si ile açar; dosya seçer; seçenekleri tamamlar; işi başlatır; sonucu indirir/siler.
2. **Dosyası var, araç adını bilmiyor:** ana sayfada dosyayı bırakır/seçer. PDF için niyet seçenekleri gösterilir; Office ve görseller uzantıya göre araca yönlendirilir. Bilinmeyen tür için anlaşılır ret, seçenek ve geri dönüş davranışı ayrıca tasarlanmalı.
3. **Aracı bulmak istiyor:** navbar araması ve üç kategori (Dönüştür, Düzenle, Optimize et) arasında filtreler. OCR şu an Optimize altında; bağımsız OCR kategorisi yok. Arama sadece araç adı/açıklamasına bakıyor, eş anlamlı/alternatif terim haritası görünmüyor.
4. **Gizliliği ve kaliteyi anlamak istiyor:** hero güven şeritleri, FAQ ve gizlilik/güvenlik sayfalarına bakar. Mevcut metinler çelişki nedeniyle karar vermeye uygun değil.
5. **Hata yaşadı veya kaldığı yerden döndü:** tool ekranındaki job durumu, iptal, yeni deneme veya sonuç/süre dolumu durumlarını kullanır. Gerçek teknik hata mesajı kullanıcıya sabit hata kodu ile sadeleştirilir.

Dosya yönlendirme notu: hero file input yalnızca PDF/DOCX/XLSX/PPTX/JPG/JPEG/PNG kabul niteliği taşır; sürükle bırak event'i ise uzantıyı ayrıca doğrulamadan .doc, .ppt, .xls, .webp değerlerini araçlara yönlendirebiliyor. Paylaşılan contract/API bu eski formatları kabul listesinde göstermiyor. Sprint 2'de her iki giriş yolu aynı kabul/ret doğrulamasından geçirilmeli.

## S0-06 — Görsel baseline ve responsive ölçüm

Tam sayfa screenshot'ları [baseline klasöründe](baseline/); yerel TR ana sayfa, 24 Ekim 2026, 900px viewport yüksekliği ve 4322 yerel preview URL'si ile çekildi.

| Viewport genişliği | documentElement clientWidth | scrollWidth | Yatay taşma | Sayfa yüksekliği (px) |
|---:|---:|---:|---|---:|
| 360 | 345 | 345 | Yok | 9416 |
| 390 | 375 | 375 | Yok | 9287 |
| 768 | 753 | 777 | **24 px** | 5810 |
| 1024 | 1009 | 1058 | **49 px** | 4896 |
| 1440 | 1425 | 1425 | Yok | 4565 |
| 1920 | 1905 | 1905 | Yok | 4565 |

Client width ile scroll width farkı dikey scrollbar alanını dışarıda bırakır. 768 ve 1024'teki fark gerçek yatay document overflow'dur. DOM incelemesinde footer'daki destek e-posta bağlantısı bulunduğu grid kolonunun sağ sınırını aşıyor; rehber kategori sekmeleri ayrıca kendi yatay kaydırma alanında taşar. Gelecek sprint bu öğelerin hangi kısmının sayfa taşmasına neden olduğunu düzeltip aynı ölçümle yeniden kontrol etmelidir. Bu audit'te hiçbir CSS değiştirilmedi.

360px tam sayfa ekran görüntüsü yaklaşık 9.4k px uzunluğunda; tek sütundaki 16 aracın, altı rehber kartının ve bilgi bloklarının dikey maliyeti belirgin. Bu sadece görsel baseline'dır; görev tamamlama süresi veya kullanılabilirlik testi yapılmadı.

## S0-07 — Güvenlik ve mahremiyet iddia envanteri

Uygulama belgeleri, local kod ve web kopyası karşılaştırıldı. Üretim sunucusu/Cloudflare/Render log ve disk ayarları bu işte incelenmedi. Bu nedenle dağıtımın gerçek konfigürasyonunu belgelediği varsayılmamalı.

| Web'de görünen iddia | Kod/belgedeki karşılık | İlk karar |
|---|---|---|
| “Dosyalar diske kalıcı yazılmadan ... RAM'de işlenir.” | disk-storage.ts içeriği private disk alanına akışla yazar; .data içerik alanı deployment belgesinde belirtilir. Uzun süreli arşiv olmadığını anlatmak başka, RAM-only demek başkadır. | **KALDIR / doğru süreçle yeniden yaz.** |
| “İşlem bittiği an ... anında imha” / manuel silme anında | Files modülü yeni erişimi keser; fiziksel silme API'si 120 saniye grace bildirir ve dosya kaydı da 120 sn sonrasına alınır. | **KALDIR / erişim kapanması ile fiziksel silme arasındaki farkı açıkla.** |
| “En geç 60 dakikada silinir.” | Uygulama varsayılan RETENTION_MINUTES 60; fiziksel cleanup worker'a bağlı. Üretim konfigürasyonu ve sağlayıcı kopyaları/backup burada doğrulanmadı. | **Operasyonel süreyi production'da teyit et, sonra koşullu açıkla.** |
| “Veriler üçüncü taraflarla paylaşılmaz.” | Dosya işleme motorları yerel/açık kaynak; ancak hosting/edge sağlayıcıları trafiği işler; consent sonrası PostHog, ana sayfada AdSense de yüklenebilir. Dosya içeriğinin bu analitik/reklam SDK'larına gönderilmemesi ayrı doğru sınırdır. | **Genel mutlak ifade KALDIR; dosya içeriği/metadata ve servis telemetrisi ayrımını açıkla.** |
| “256-bit TLS” | Uygulama arkasında HTTPS/TLS iddiası; TLS cipher/mimari değil edge/production ayarı tarafından belirlenir. | **Deploy/edge sahibi teyit etmeden bit uzunluğu iddiası yazma.** |
| “No document archives / zero permanent storage” | Uygulama geçici dosyaları private volume'e yazar, süre sonunda siler; veritabanı metadata taşır. Yedek ve sağlayıcı saklama davranışları ayrı politika ister. | **“Arşiv servisi değil” şeklinde daralt; sıfır kalıcı kopya iddiası için operasyonel kanıt gerekir.** |
| “No staff or third party can view documents.” | Code path private storage + session ownership uygular; personel/operasyon erişimi, host shell'i ve backup erişimi yalnızca uygulama kodundan kanıtlanamaz. | **KALDIR veya erişim politikasını operasyonel olarak doğrula.** |
| “No AI models.” | Kod/engine support yerel QPDF/LibreOffice/PyMuPDF/Tesseract vb. motorları listeliyor; harici AI dönüşüm servisi yok. Hosting/analitik servisleri yine vardır. | **Kapsamı “dosya dönüşümünde üçüncü taraf AI servisi kullanmıyoruz” diye daralt; code audit ile tekrar doğrula.** |

Bu masaüstü kod denetimi güvenlik sertifikasyonu değildir. Açık dosya depolama, saklama, TLS ve operatör erişimi konuları product/legal metnini yayınlamadan önce operasyon sahibiyle teyit edilmeli.

## S0-08 — Analitik ve ölçüm

- PostHog EU dashboard 318026, 24 Ekim 2026 tarihinde yenilendi. environment = production filtresi açık.
- Panelde görünen: son 30 gün 1 aktif anonim kullanıcı; son 7 gün 1 session ve 3 pageview. Bu “kesin 1 kişi” değildir; izin, DNT/GPC, engelleyici ve farklı tarayıcı/cihazların etkisi vardır.
- Bu hacim araç popülerliği, dönüşüm oranı veya A/B kararı için yeterli değildir.
- Panelde yalnızca “Your starter dashboard” bulundu; docs/POSTHOG.md içinde tarif edilen “DoctorConverter — Dönüşüm akışı” özel funnel dashboard listesinde görünmedi. Bu UI kanıtı, funnel hiç oluşturulmadığını kanıtlamaz; farklı dashboard/insight olarak saklanmış olabilir. PostHog dokümanında canlı sayfaya uygun güncelleme gerekir.
- Mevcut kodda tool_viewed, upload_completed, conversion_requested, conversion_completed, conversion_failed, conversion_cancelled, download_clicked, files_deleted, client_error ve $pageview izin listesinde. Dosya adı/içeriği gönderilmiyor; anonimliğin kişi kanıtı olmadığı belgelenmiş.
- Planlanan hero_upload_click, file_selected, tool_search, tool_filter, guide_open, faq_expand gibi keşif event'leri kodda görünmüyor. Yeni event'ler gizlilik allowlist'i ve event anlam sözleşmesiyle birlikte tasarlanmalı.
- Job sayısı ve iş başarı oranı için backend analytics kaydı PostHog funnel'ından daha uygun kaynak; istemci sekmesi kapanınca completion kaçabilir.

## Sınırlar ve açık doğrulamalar

- Bu çalışma mevcut UI'nin kod/doküman envanteridir; araçların yeniden çalıştırıldığı kalite testi değildir.
- Üretim deploy konfigürasyonu, Cloudflare analytics ve gerçek ziyaretçi dosya akışları incelenmedi.
- Screen reader, yalnızca klavye, renk kontrastı, Lighthouse, INP/LCP/CLS ve tarayıcı matrisi testi bu Sprint 0 sırasında yapılmadı.
- Kullanılabilirlik çalışması veya kullanıcı görüşmesi yapılmadı.
- Mevcut UI için 16 araçta tarayıcıdan gerçek dosya → API → worker → indirme akışının tekrar doğrulaması yapılmadı.
