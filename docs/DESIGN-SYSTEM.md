# Tasarım sistemi

Durum: Sprint 1 tasarım temeli uygulandı. Marka adı korundu ve işarette küçük bir iyileştirme yapıldı. Tasarım, hızlı ve anlaşılır belge işlemlerini destekler.

## Görsel yaklaşım

Açık zemin, belirgin tipografik hiyerarşi, sınırlı vurgu rengi ve geniş okunabilir alan kullanılır. Araç ekranında birincil eylem nettir. Dekoratif animasyonlar işlem durumunu taklit etmez; arayüzde teknik altyapı ayrıntıları gösterilmez.

## Başlangıç token'ları

Değerler tek kaynak olarak `apps/web/src/styles/tokens.css` içinde Tailwind `@theme` bloğunda tutulur; gerçek metin/zemin eşleşmeleri uygulamada kontrast kontrolünden geçer.

Hintçe arayüz Devanagari glifleri için Noto Sans Devanagari, Windows Nirmala UI ve Mangal sistem yazı tiplerini yedek zincirinde dener. Sora/Inter Devanagari karakter kapsamı sağlamaz; Hintçe başlıklarda Latin harfleri için kullanılan sıkı harf aralığı kaldırılır. Bu yazı tipleri bulunmadığında tarayıcı ve işletim sistemi yedeğine geçilir.

| Token | Değer | Kullanım |
| --- | --- | --- |
| background | #F8FAFC | Sayfa zemini |
| surface | #FFFFFF | Kart ve işlem paneli |
| text-primary | #0F172A | Ana metin |
| text-secondary | #475569 | Yardımcı metin |
| text-muted | #5B677A | Kontrastı artırılmış yardımcı metin |
| border | #E2E8F0 / #CBD5E1 | Ayırıcı ve kontrol sınırı |
| accent | #2563EB | Birincil eylem ve bağlantı |
| accent-strong | #1D4ED8 | Accent hover/basılı durum |
| success | #166534 | Başarı metni ve ikonu |
| warning | #92400E | Uyarı metni ve ikonu |
| danger | #B91C1C | Hata metni ve ikonu |
| tool-blue | #2563EB ve açık mavi zemin | Dönüştürme araçları |
| tool-purple | #7554A3 ve açık mor zemin | Sayfa düzenleme ve PDF organizasyonu |
| tool-violet | #6B4BB2 ve açık mor zemin | PDF şifreleme ve parola kaldırma |
| tool-teal | #167A78 ve açık turkuaz zemin | PDF sıkıştırma |
| tool-indigo | #4F60A4 ve açık indigo zemin | OCR araçları |
| focus | #1D4ED8 | Klavye odak halkası |

Renkler token olarak tanımlanır; bileşenlerde rastgele hex değerleri çoğaltılmaz. Durumlar renk yanında metin ve ikonla da anlatılır.

Global CSS sıfırlamaları `@layer base`, paylaşılan sınıflar (`.field`, `.tool-icon`, `.eyebrow`, `.filter-chip`) `@layer components` içinde tutulur. Katmansız kural yazılmaz; katmansız kurallar Tailwind utility'lerini (margin, border, font boyutu) ezer.

## Sprint 8: polish kuralları

- Öne çıkan rehber kartı gerçek senaryonun `steps` içeriğini iç içe kartlar olmadan yatay süreç şeridinde gösterir; adım başlıkları en az 15px, açıklamalar 14px'tir. Başlık/açıklama ve CTA geniş ekranda aynı satırı paylaşır, dar ekranda doğal biçimde alt alta geçer. Kart sabit yüksekliğe zorlanmaz; TR/EN metin uzunluğu yüksekliği belirler.
- Kategori listesinde masaüstü 3 gerçek sütun, iki/dört öğeli gruplar 2 sütun kullanır. 1100px ve altında 2, 640px ve altında 1 sütun olur. Eksik son satır aynı kart genişliğiyle soldan başlar; öğe sayısına özel ortalama veya sanal kolon yoktur.
- Araç kartlarının featured/standard/compact varyantları `.tool-card` temel sınır, radius, yüzey, hover ve focus durumlarını paylaşır; boy ve iç boşluklar yalnızca varyantla belirlenir. Kategori filtresinin seçili durumu `aria-pressed` ile renk ve font ağırlığıyla gösterilir.
- Dropzone varyantları tek dashed border ve radius standardını kullanır. Sürükleme ve klavye odağı aynı kontrollü accent durumunu gösterir.
- Metin/zemin renk oranları WCAG AA normal metin eşiği olan 4.5:1 ile kontrol edildi: muted #5B677A / background #F8FAFC = 5.48:1; secondary #475569 / background = 7.24:1; accent #2563EB / background = 4.94:1; accent-strong #1D4ED8 / white surface = 6.70:1. Bu token sonuçları her içerik kombinasyonunun manuel erişilebilirlik onayı yerine geçmez.
- Katalog formatı, kategori adedi, uygunluk durumu, rehber adımı ve footer alt bilgisi en az 13px'tir. Standart yardımcı açıklamalar 14px kalır; linkler hover yanında görünür klavye odağı taşır.
- Hero ana sayfada tek dosya alır. Çok dosyalı bir işlem gerekiyorsa kullanıcı aracı açıp diğer girdileri orada ekler; PDF birleştir ve görsel→PDF akışları korunur.
- Silme eylemi erişimi anında kapatır. Backend fiziksel temizlemeden önce 120 saniyelik süre uygular; worker temizliği periyodik çalışır ve aktif dosya kullanımı daha uzun bekletebilir. Bu UI metni `RETENTION_MINUTES`, `markDeleted`, cleanup aralığı ve dosya erişim testleriyle doğrulanır.

### Sprint 1 uygulama kararları

- Araç ikon renkleri araç başına rastgele seçilmez; dönüşüm, düzenleme, güvenlik, sıkıştırma ve OCR grupları sabit renkle kodlanır.
- Üst gezinme masaüstünde tüm araçlar, kullanım rehberleri ve güvenlik bağlantılarını sunar; dar ekranda erişilebilir menüye geçer.
- Araç araması etiketli combobox'tır. Ok tuşları önerilerde gezer, Enter seçer, Escape listeyi kapatır; eşleşme yoksa açıklayıcı durum gösterilir.
- Arama yazılırken araç sayfasından ana sayfaya yönlendirme yapılmaz. Araç yalnızca öneri seçildiğinde açılır.
- Logo işareti sadeleştirildi; isim ve mavi marka rengi korundu.

## Tipografi ve ölçüler

- Gövde metni 16px; satır yüksekliği yaklaşık 1.5. Yardımcı metin 13–14px altına inmez.
- Yazı tipi: self-host variable font. Gövde `Inter Variable`, başlıklar `Sora Variable`; ikisi latin-ext destekli (Türkçe glif). Harici font isteği yok.
- Tipografi ölçeği: 12, 14, 16, 20, 24, 32, 40px; mobilde başlıklar taşmaz.
- Boşluk ölçeği: 4, 8, 12, 16, 24, 32, 48, 64px.
- Köşe yarıçapları: kontrol 8px, kart ve panel 12px.
- Dış sayfa container’ı `--spacing-content: 1200px`; kullanılabilir masaüstü içerik 1136px. `.page-container`, navbar/ana içerik/footer için ortak 16/24/32px gutter kullanır. Okuma/ayarsız araç alanı 900px kalır.
- Etkileşim hedefleri yaklaşık en az 44×44px; klavye odak halkası belirgin.
- Araç ekranında açıklama ve durum metinleri 14px altına düşmez; ana gövde 16px kalır. Form kontrolleri 48px, küçük ikon eylemleri en az 44px yüksekliğinde olur.
- Dosya ekleme, ayar ve başlatma tek anlaşılır akışta sunulur; kullanıcıdan görünür olan dosya seçimini ikinci kez onaylaması istenmez.

## Sayfa düzenleri

### Ana sayfa

Hero'da somut görev başlığı, tek dosyalı hızlı bırakma/seçme alanı, sunucu politikasından gelen dosya limiti ve daha düşük ağırlıklı araçlara geçiş bağlantısı bulunur. PDF seçilirse yalnızca API tarafından etkin olan PDF işlemleri gösterilir; diğer kabul edilen dosya türleri ilgili araca taşınır. Dosya baytları işlem başlatılmadan yüklenmez. Hero altında Popüler Araçlar ve kategoriye göre katalog gelir. Arama yalnızca araçları filtreler; bulunmayan sonucu açıkça söyler.

#### Sprint 3 araç kataloğu

- Katalogdaki 16 araç **Dönüştür**, **Düzenle**, **Optimize et ve koru** ve **OCR** olarak gruplanır. OCR metin çıkarma ile aranabilir PDF ayrı işler olarak kalır.
- “Hızlı başlangıç / Quick start” bölümünde dört araç yer alır. Bunlar gerçek kullanım sıklığına göre sıralandığı kanıtlanmadığından “popüler” diye sunulmaz.
- Kart yoğunluğu amaca göre değişir: hızlı başlangıçta featured kart, aramada standard kart, kategori listesinde compact kart. Her kart başlık, kısa açıklama ve girdi → çıktı biçimini gösterir.
- Kategori filtreleri ve üst arama birlikte çalışır. Arama Türkçe/İngilizce adları ve JPG/JPEG/PNG, image-to-PDF, merge/combine gibi eşanlamlıları kapsar; eşleşme yoksa filtreleri temizleme eylemi sunulur.
- Kart tümüyle `<button>` olduğundan SPA içi araç açma eylemi tek semantik kontroldür; iç içe bağlantı veya düğme bulunmaz. Katalog API `enabledTools` listesinden kapalı araçları görünür biçimde işaretler; karta tıklama araç ekranındaki gerekçeyi açar. Hover, klavye odağı ve disabled görsel durumları tanımlıdır.
- Kategori filtresi geçici katalog görünümüdür ve `#tools` sayfa konumu kullanılır; kategori query parametresi eklenmedi. Araç açma için mevcut `#tool/{id}` rotası korunur.

### Araç sayfası

Araç adı ve açıklama → desteklenen girdiler/limitler → yükleyici → dosyalar ve ayarlar → birincil eylem → işlem durumu → sonuç alanı. Alt bölümde kısa kullanım açıklaması ve ilgili SSS bulunur. Ayarlar mobilde de işlem akışında erişilebilir kalır.

Uygulanan düzen: geniş ekranda (≥1024px) sol sütunda yükleyici, dosya listesi ve "İşlemi başlat" paneli; sağ sütunda yapışkan ayar paneli. Dar ekranda sıra yükleyici → dosyalar → ayarlar → başlat'tır. Dosya seçildikten sonra yükleyici kompakt satıra küçülür.

Sprint 4'te ana sayfa hızlı dosya alanı ve araç ekranı aynı `FileDropzone` bileşenini kullanır; `variant`, `accept`, `multiple` ve metin props'ları farklı akışları açıkça belirler. Multi-file araçlarda dosya sayacı, seçili toplam boyut ve API toplam limitleri gösterilir. Dosya sıralama drag-and-drop dışında klavye ile kullanılan yukarı/aşağı düğmeleriyle de mümkündür. Başarı ekranı gerçek çıktı dosya adını, türünü ve boyutunu verir; indirme, temizleyip yeni dosyaya başlama, erken silme ve yapılandırılmış ilgili sonraki araca gitme ayrı eylemlerdir.

Sprint 5 ana sayfa rehber vitrini editoryal hiyerarşi kullanır: geniş öne çıkan senaryo, iki yan rehber ve kompakt bağlantı listesi. Her öğe kendi senaryo grubunu, tamamlanmış başlığını ve açıklamasını gösterir; başlık/açıklama üç noktayla kesilmez. Araç sayfası rehberleri ile rehber içindeki araç bağlantıları iki yönlü dolaşım sağlar.

Güvenlik anlatımı kart tekrarına dönüşmez. Numaralı süreç satırı dosya seçimi, yükleme/doğrulama, worker sonucu ve saklama/silme adımlarını gösterir. Ayrı, kısa saklama notu API'nin gerçek süresini referans eder ve güvenlik/gizlilik politikalarına bağlanır. “Silme isteği” ile fiziksel temizlik; uygulama oturumu ile hosting/analitik/reklam sağlayıcıları görsel ve metinsel olarak ayrılır.

Sprint 6 footer'ı dört kısa gezinme grubuna ayırır: önerilen araçlar, kaynaklar, güvenlik/yasal belgeler ve iletişim. Araç kataloğunun 16 bağlantısı footer'da yinelenmez; yalnızca ürünce seçilmiş dört başlangıç aracı yer alır. Ana sayfa FAQ'si `aria-expanded` ve `aria-controls` kullanan klavyeyle çalıştırılabilir düğme akordeonudur; açık durumda yanıt görünür, satır zemini ve ikon yönü değişir.

`LiveJob` durumu kuyrukta/işleniyor/tamamlandı/iptal/başarısız/süresi doldu durumlarını ayırır. Sonuç adı, gerçek format ve bayt boyutu gösterilir; indirme, yeni dosyayla devam etme ve erken silme ayrı eylemlerdir. Yenilemeden sonra job kimliği aynı sekme `sessionStorage`'ından geri alınır; yerel dosyalar geri yüklenmediği için retry gerektiğinde yeniden seçim açıklanır.

İlk reklam alanı ana sayfada araç kartlarından sonra ve kullanım rehberlerinden önce yer alır. Google AdSense reklam birimi kimlikleri ayarlanana kadar placeholder yalnızca geliştirme önizlemesinde görünür; kimlikler olmadan production'da boş alan bırakılmaz. Araç çalışma/indirme akışının içine, açılır pencere olarak veya sabit mobil yüzeyde reklam konmaz. Zorunlu üyelik penceresi ve dikkat dağıtan promosyon alanı kullanılmaz. Reklam entegrasyonunu yayına almadan önce gizlilik açıklaması ve gerekli bölgesel onay akışı tamamlanmalıdır. Marka ve footer metinleri ürün kararlarıyla tamamlanır.

## Ortak bileşenler

| Bileşen | Gerekli durumlar |
| --- | --- |
| ToolCard | Normal, hover, focus, kullanılamıyor |
| FileDropzone | Boş, sürükleme, seçili dosya, doğrulama hatası; yükleme/işleme/sonuç LiveJob içinde |
| FileList | Dosya bilgisi, kaldırma, sıralama |
| PageGrid | Yükleniyor, sayfa seçili, döndürülmüş, küçük resim hatası |
| SettingsPanel | Varsayılan, doğrulama hatası, devre dışı |
| Button | Normal, hover, focus, loading, disabled |
| JobStatus | Yükleniyor, kuyrukta, işleniyor, tamamlandı, iptal, hata, yeniden deneme |
| ResultPanel | Hazır, indiriliyor, siliniyor, süresi doldu |
| InlineNotice | Bilgi, başarı, uyarı, hata |

Bileşenlerde iş kuralları kopyalanmaz; sunucunun araç yetenekleri ve politika verisi kullanılır. Birincil eylem metni somut olur: “PDF'leri birleştir”, “Word'e dönüştür”, “Sonucu indir”.

## Erişilebilirlik

- Hedef WCAG 2.2 AA; tamamlandığı ancak gerçek kontrollerle söylenir.
- Bütün kontroller etiketli, odak sırası anlamlı ve yalnızca klavyeyle kullanılabilir olur.
- Sürükle-bırak dışında dosya seçme ve yukarı/aşağı taşıma butonları bulunur.
- İşlem durumu uygun live region ile bildirilir; her polling yanıtı tekrar okunmaz.
- Hata, ilgili alanla ilişkilendirilir; yalnızca toast'a bırakılmaz.
- Reduced-motion tercihi uygulanır; animasyon anlamın tek taşıyıcısı olmaz.
- Diyalog gerekiyorsa odağı yönetir ve kapanınca tetikleyiciye geri verir.
- 320px genişlikte ana iş akışı yatay kaydırma gerektirmemeli; uzun dosya adları kontrollü kırpılır ve erişilebilir tam ad korunur.

## Arayüz performansı ve kabul

Statik alanlara gereksiz hydration eklenmez. Önizleme kodu yalnızca ihtiyaç duyan araçlarda yüklenir. Görsellerin boyutları ayrılır; sayfa değişimi ve sonuç görünmesi gereksiz yerleşim sıçraması yaratmaz.

Kabul kontrolü: mobil/masaüstü düzen, klavye akışı, kontrast, uzun Türkçe metinler, boş/hata/yükleme/sonuç durumları ve düşük bağlantı davranışı. Her yeni tasarım durumunun motor çalıştırması gerekmez; sentetik UI verileriyle de incelenebilir.

## Site genelinde sadeleştirme — 25 Ekim 2026

- Marka, fontlar ve renk token’ları korunur. Mavi vurgu eylem, bağlantı ve seçili durum içindir; başlığın ikinci yarısını veya noktasını süslemek için kullanılmaz.
- Etkileşimli dosya/ayar/işlem yüzeyleri kart olabilir. SEO açıklaması, rehber adımları, ilgili bağlantılar ve SSS; iç içe kart yerine düz metin, liste ve ayırıcı kullanır.
- Araç/rehber içeriği 900px okuma genişliğini paylaşır. Ana sayfa kataloğu ve gerçek ayar içeren çalışma alanları daha geniş kalabilir.
- Ana sayfa hero’sunda dekoratif degrade ve dış kart kaldırıldı; dosya seçme alanının sınırı korunur. Rehber vitrininin ikincil öğeleri düz liste düzenidir.
- Araç sayfasında genel yardım süreci ve genel SSS tekrarlanmaz; güvenlik/gizlilik bağlantıları kısa gezinmede kalır. Genel SSS ana sayfadadır.
- Rehber ve yasal sayfa header’ı uygulamayla aynı 1200px dış container hizasını, 72px masaüstü / 64px dar ekran yüksekliğini ve skip link davranışını kullanır.
- Footer dört kısa gezinme grubunu korur; mobilde iki, masaüstünde dört sütundur. Kaynaklar yalnızca SSS ve rehber hub’ına bağlanır; uzun araç/rehber listesi ve tekrar eden yasal alt menü eklenmez.

Araç sayfasında en fazla dört ilgili rehber gösterilir; öncelik ana aracı aynı olan senaryolardadır. Diğer rehberlere hub bağlantısından erişilir.

## Görsel kalite temeli — 25 Ekim 2026

- H1 hero’da `--text-hero` (32–48px), H2’ler `.home-section-title` (24–28px/600/1.25), kategori 18px/600, araç başlığı 15px/600, featured araç 16px/600, açıklama 14px ve metadata 13px kullanır. Hero gövdesi 43ch ile sınırlıdır; satır kırılımı metin uzunluğuna göre doğal kalır.
- Bölüm ritmi `--section-space` ile mobil 40px / masaüstü 56px; kartlar 16px gap, featured 20px ve compact 16px iç boşluk kullanır. Katalog hover’ı gölge/hareket yerine sınır ve yüzey değiştirir.
- İşlem grubu renkleri koyu ve anlamlıdır. Kompakt katalog ikonunun pastel kutusu yoktur; Quick Start ikonu ince belge çerçevesindedir. Workspace’in mevcut grup yüzeyleri korunur. PowerPoint/presentation, filigran/stamp ve parola kaldırma/unlock aynı Lucide ailesindedir.
- Dropzone sınırı `--color-upload-border: #8492A6`; drag-over ve focus-within ana maviyle görünür. PDF seçimindeki yeşil işaret yalnızca yerel dosyanın seçildiğini belirtir; dosya hâlâ işlem başlatılmadan gönderilmez.
- Featured rehberin 01/02/03 adımları ince üst çizgili numara işaretidir. İkincil rehberler düz editoryal içerik olarak kalır; üç kısa senaryo bağlantısı masaüstünde üç gerçek sütundur.
- FAQ sorusu 16px/600, chevron 20px’tir; açık durumda sol sınır ve zemin değişir. Footer gezinme hedefleri en az 44px, kolonlar mobil 2 / masaüstü 4’tür.
- Ortak Button geçişi 160ms; normal primary gölgesi yoktur. Disabled anchor, href ve tab sırasıyla da kapatılır. Reduced-motion tüm bu geçişleri durdurur. Navbar düz beyazdır; blur/glass efekti kullanılmaz.

Gerekçe ve sprint bazlı kanıtlar: [design-audit](../design-audit.md), [VISUAL-QUALITY-SPRINTS](VISUAL-QUALITY-SPRINTS.md).

## Ürün imzası ve çalışma alanı açıklamaları

- Bölüm başlıklarındaki iki tonlu kısa çizgi, dosya → işlem → sonuç akışını temsil eden küçük bir marka işaretidir. Yeni renk veya font kullanmaz; kart, gölge ya da animasyon oluşturmaz.
- Güvenlik sayfasındaki işlem şeridi bu akışı tarayıcı seçimi → doğrulama → geçici işleme → erişim kapanması olarak özetler. Teknik ayrıntılar aşağıdaki bölümlerde kalır.
- Katalog kartlarında araç adı ve işlev farkı, format çiftinden önce okunur. Girdi/çıktı biçimi yararlı seçim bilgisi olarak kalır; ikincil tipografide gösterilir.
- Ana sayfa hero’su dosya seçme → uygun aracı açma → işlemi başlatma → sonucu indirme adımlarını tek kısa yönergede anlatır; çoklu dosyada ilgili araç kullanımı ayrıca belirtilir.
- Gerçek ayarların seçili değeri kısa, yerelleştirilmiş ve sonuç odaklı açıklanır. Açıklama ilgili form alanına `aria-describedby` ile bağlanır; gerçek motor davranışı veya kalite garantisi eklemez.
- Ayarsız araçlarda çıktı biçimi işlem başlığında ikincil kalır. Etkin saklama limiti tek kez gösterilir; alt not yalnızca kabul edilmiş işin sayfa kapansa da sürebileceğini söyler.
- Reklam kimlikleri yokken görünen yer tutucu yalnızca ana sayfa araç kataloğundan sonra bulunur; çalışma alanına eklenmez. Yapılandırılmış reklamın yerleşimi ve gizlilik koşulları değişmez.
- Logo işareti, kullanıcı tarafından sağlanan yeni DoctorConverter tasarımına göre belge köşesi ve dönüşüm yönünü birleştirir. Yatay wordmark aynı marka adını ve mavi/lacivert ayrımını korur; ortak Logo bileşeni header ve footer'da kullanılır.

- Footer zemini marka laciverti (#132047), başlıklar beyaz, bağlantılar #CBD5E1 ve vurgu #60A5FA kullanır. Koyu zeminde ortak logonun beyaz/mavi varyantı gösterilir; analitik tercih panelinin açık yüzeyi korunur.

## Tema tercihi

Yumuşak grafit koyu tema token'ları sayfa zemini için #181A1F, yüzey için #252830, ana metin için #F1F2F5 ve mavi vurgu için #8BB4FF kullanır. Durum ve araç renklerinin koyu yüzeyler için ayrı değerleri vardır; belge önizlemeleri beyaz kalır. Üst çubuktaki Açık/Koyu/Sistem seçimi dc-theme anahtarında tarayıcıya kaydedilir. Varsayılan Sistem cihaz tercihini izler; depolama kullanılamıyorsa sistem tercihi kullanılır.
