# DoctorConverter — UI/UX Yeniden Tasarım Sprint Planı

> **Belge türü:** Uygulanabilir ürün-tasarım ve frontend geliştirme backlog'u  
> **Kaynak:** 24 Ekim 2026 tarihli ana sayfa ekran görüntüsü ve bu görüntünün görsel incelemesi  
> **Kapsam:** Ana sayfa, global navigasyon, dosya yükleme deneyimi, araç kataloğu, araç detay ekranı şablonu, rehberler, güvenlik anlatımı, FAQ, footer, responsive/a11y/performance/SEO ve yayın öncesi kalite  
> **Durum:** Sprint 0–6 uygulandı; Sprint 7 yayın öncesi kalite kapıları ve görsel regresyon aşamasıdır.

## 0. Ürün hedefi ve çalışma ilkeleri

### Ana hedef
Kullanıcı, siteye geldikten sonra **ilk 5 saniyede** hangi işi yapabileceğini anlasın; dosya yüklemek veya uygun aracı bulmak için düşünmek zorunda kalmasın. Sayfa, tekrarlanan kartlardan oluşan anonim bir SaaS şablonu gibi değil, belge işleme amacı etrafında tasarlanmış bütünlüklü bir ürün gibi hissettirsin.

### Hedeflenen değişiklikler
- Tek tip 16 araç kartından, önceliklendirilmiş **Popüler Araçlar + Kategori Bazlı Tüm Araçlar** mimarisine geç.
- Hero'nun ana aksiyonunu **Dosya yükle / araç seç** etrafında merkezileştir.
- Rehberleri ikinci bir kart kataloğu olmaktan çıkarıp **editoryal** içerik bölümüne dönüştür.
- Birbirinin tekrarı olan güvenlik şeritleri ve kartlarını tek, **teknik olarak doğrulanmış** güven açıklamasında birleştir.
- Özgün bir tipografik, ikonografik ve mekânsal tasarım dili oluştur; renk değiştirmekle sınırlı kalma.
- Navigasyon, FAQ, footer ve mobil akışı sadeleştir.
- Yükleme, işleme, başarı, hata ve yeniden deneme durumlarını eksiksiz tanımla.
- Erişilebilirlik, performans, SEO ve analitik ölçümlemeyi geliştirme sürecinin parçası yap.

### Tasarım sınırları / yapılmayacaklar
- Sırf 'modern' görünsün diye neon, glow, 3D, yoğun gradient, büyük soyut illüstrasyon ve gereksiz hareket ekleme.
- Gerçekte doğrulanmamış **zero logs**, **100% lossless**, **RAM only**, **instant deletion**, **end-to-end encrypted** gibi iddiaları pazarlama metninde kesin gerçek olarak yazma.
- Aktif dönüşüm motorlarını, API sözleşmelerini, dosya limitlerini veya veri saklama kurallarını tasarım uğruna sessizce değiştirme.
- Hero'da birbiriyle yarışan birden fazla primary CTA kullanma.
- Her bölümü aynı üç sütunlu kart sistemiyle tasarlama.
- Yeni teknoloji bağımlılığı eklemeden önce mevcut teknoloji yığınını denetle.

### Başarı göstergeleri (başlangıç verileri toplanıp hedefler netleştirilecek)
- Ziyaretçiden **ilk anlamlı eyleme geçiş** oranı (dosya seçme veya araç açma) artmalı.
- Hero'dan ilk dosya seçimine kadar geçen medyan süre kısalmalı.
- Araç keşif akışında aranan araca erişmek için gereken etkileşim sayısı azalsın.
- Ana sayfadaki bağlantı tıklama dağılımı ve araç kullanım sıklığı izlenebilsin.
- Klavye ile sayfanın tamamı kullanılabilsin.
- Mobil/masaüstü tasarımlar yatay taşma olmadan çalışsın.
- Temel Web Vitals hedefleri: **LCP <= 2,5 sn**, **CLS <= 0,1**, **INP <= 200 ms** (gerçek kullanıcı verisinde 75. yüzdelik; mümkün olduğu ölçüde).
- Lighthouse erişilebilirlik skoru hedefi >= 95, ancak otomatik skor manuel a11y kontrolünün yerini tutmaz.
- 'AI slop' algısı değerlendirmesi kör iç tasarım incelemesinde düşsün; bu puan nesnel performans metriği değildir.

---

## Sprint özeti ve bağımlılıklar

| Sprint | Odak | Süre (tahmini, tek geliştirici + AI destekli) | Öncelik | Çıkış koşulu |
|---|---|---:|---|---|
| 0 | Audit, bilgi mimarisi ve tasarım yönü | 2–3 iş günü | P0 | Onaylanmış içerik/akış haritası, bileşen ve gerçek iddia envanteri |
| 1 | Tasarım sistemi + marka karakteri + navbar | 3–5 iş günü | P0 | Tokenlar, temel bileşenler, navigasyon hazır |
| 2 | Hero + Quick File Drop + durum akışı | 3–5 iş günü | P0 | Ana eylem ve yükleme akışı kullanılabilir |
| 3 | Araç kataloğu + keşif/filtreleme | 4–6 iş günü | P0 | 16 araç düzgün gruplu, arama ve filtreler işlevsel |
| 4 | Araç detay şablonları + dönüşüm UX'i | 4–6 iş günü | P0 | Seçilen araçtan sonuç indirmeye kadar akış tamam |
| 5 | Rehberler + güvenlik bölümü | 3–5 iş günü | P1 | Özgün içerik ritmi ve doğrulanmış güven anlatısı |
| 6 | FAQ + footer + içerik / SEO / mikro kopya | 2–4 iş günü | P1 | İçerik hiyerarşisi, meta ve navigasyon tutarlı |
| 7 | Responsive, a11y, performans, regresyon, yayın | 4–6 iş günü | P0 | Kalite kapılarının tamamı geçti |

> **Tahmini takvim:** Bağımlılıklara ve mevcut kod tabanına göre yaklaşık 5–8 hafta. Bu süre taahhüt değildir. Responsive, a11y ve performans **her sprintte** uygulanır; Sprint 7 bunların son denetimidir.

---

## SPRINT 0 — Mevcut durumu anla, neyi koruyacağını belirle

**Amaç:** Kod görmeden varsayımsal yeniden yazım yapmamak. Ekranda görülen her modülün gerçek işlevini, veri kaynağını ve kullanıcı ihtiyacını doğrulamak.

### İş paketleri
- [ ] S0-01 — Mevcut route/page/component ağacını, stil altyapısını, fontları, ikon kütüphanelerini, tema tokenlarını ve responsive breakpoint'lerini çıkar.
- [ ] S0-02 — Mevcut 16 aracın isimlerini, formatlarını, işleme mekanizmasını, dosya limitlerini, çalışan/çalışmayan durumlarını ve kullanım önceliklerini envantere al.
- [ ] S0-03 — Mevcut hero, upload, güven kartları, tools, use-case guides, security, FAQ ve footer öğelerini `KORU / DEĞİŞTİR / BİRLEŞTİR / KALDIR` olarak işaretle.
- [ ] S0-04 — Kullanıcı görevlerini haritala: 'Dosyam var, ne yapacağımı biliyorum' / 'Dosyam var, hangi araç olduğunu bilmiyorum' / 'Aracı arıyorum' / 'Gizliliği merak ediyorum'.
- [ ] S0-05 — Bilgi mimarisi ve yeni sayfa sırasını çıkar: Header → Hero & upload → Popüler Araçlar → Kategoriye Göre Araçlar → Kullanım Rehberleri → Dosya Güvenliği → FAQ → Footer.
- [ ] S0-06 — Mevcut UX / görsel baseline'ı 360, 390, 768, 1024, 1440 ve 1920 px genişliklerde kaydet.
- [ ] S0-07 — Gerçek güvenlik mimarisini teknik sorumludan doğrula: işlem yeri (browser/server), geçici depolama, loglar, silinme zamanı, şifreleme, üçüncü taraf servisler.
- [ ] S0-08 — Uygun analitik altyapısı varsa mevcut tıklanma/araç kullanım verilerini çıkar; yoksa varsayım olduğunu işaretle ve ölçüm planı oluştur.
- [ ] S0-09 — 2–3 alternatif kompozisyon/wireframe üret; aynı renk paletiyle yapısal karşılaştırma yap; tek yön seç.

**Teslimatlar:** `AUDIT.md`, `INFORMATION_ARCHITECTURE.md`, `CONTENT_INVENTORY.md`, `DESIGN_DIRECTION.md`, ekran görüntüsü baseline'ı.

**Kabul kriterleri:** 16 aracın tamamı envanterde; her bölüm için karar var; doğrulanmamış güvenlik iddiaları işaretli; seçilmiş wireframe var; kritik üretim işlevlerine dokunulmuyor.

---

## SPRINT 1 — Design system, özgün kimlik ve navbar

**Amaç:** 'Pastel ikon + beyaz kart + border' şablonunu sistematik ama tekdüze olmayan bir görsel dile dönüştürmek.

### İş paketleri
- [ ] S1-01 — Renk tokenlarını tanımla: ana mavi, koyu metin, muted text, arka plan, surface, border, focus, success, warning, error. Mevcut markanın mavisini korumak varsayılan karar olsun.
- [ ] S1-02 — Tipografi ölçeğini oluştur: hero, H1–H3, body, caption, label. Gövde okunurluğunu iyileştir; bütün küçük yazıları optik olarak kontrol et.
- [ ] S1-03 — 4/8 px ritimli spacing ve grid sistemi; içerik max-width, section aralıkları, farklı yoğunluk kuralları.
- [ ] S1-04 — Border/radius/shadow politikası belirle; bütün bölümlerde aynı kart dekorasyonunu kullanma.
- [ ] S1-05 — İkon kategorisi standardı: dönüşüm, düzenleme, güvenlik, OCR vb. için anlamlı ve tutarlı ikonlar; renk yalnızca kategori veya durum ifade ettiğinde değişsin.
- [ ] S1-06 — Button, input, combobox/search, tabs, chips, cards, accordion, upload zone, toast, dialog, loading, empty state bileşenlerinin görünüm ve durumlarını tanımla.
- [ ] S1-07 — Logo için evrimsel iyileştirme yap: mevcut marka tanınırlığını bozmayacak ikon ve kelime işareti düzeni. **Not:** Gerçek marka rehberi varsa ona uy; gereksiz rebrand yapma.
- [ ] S1-08 — Header'ı iş odaklı düzenle: Tool Categories / All Tools / Guides / Security (gerçek ürün taksonomisine göre). 'AI tools' yalnızca gerçekten ayrı bir ürün kategorisiyse birincil menüde olsun.
- [ ] S1-09 — Aramayı klavye ile erişilebilir yap: açık etiket, öneriler, sonuç yok mesajı, Escape ile kapatma, Enter ile seçim.
- [ ] S1-10 — Sticky header gerekiyorsa yer ve davranış testini yap; hero alanını baskılamasın.

**Teslimatlar:** `DESIGN_TOKENS.md`, güncellenmiş shared UI bileşenleri, header, tasarım ekranları.

**Kabul kriterleri:** WCAG AA kontrast prensipleri karşılanıyor; odak halkası görünür; 320–1920 px'te header taşmıyor; en az 3 farklı bölüm kompozisyonu aynı sistem içinde tasarlanabiliyor; ikon renkleri rastgele değil.

---

## SPRINT 2 — Hero, yükleme ve ilk kullanım deneyimi

**Amaç:** Hero yalnızca tanıtıcı değil, ürünü hemen kullanılabilir kılan alan olsun.

### İş paketleri
- [ ] S2-01 — Jenerik 'Convert, Edit & Secure Your Documents in Seconds' başlığını somut, kısa, fayda odaklı bir başlığa değiştir; 2–3 mikro kopya alternatifi test et.
- [ ] S2-02 — Birincil CTA'yı dosya seçme / bırakma eylemine bağla. Araçları görme ikincil text link veya daha düşük görsel ağırlıkta olsun.
- [ ] S2-03 — Quick File Drop'u hero'nun ürün merkezi haline getir; sürükle-bırak alanı belirgin ve gerçekten çalışır olsun.
- [ ] S2-04 — Kabul edilen formatları, tekil/multi-file limitlerini, boyut limitini gerçek sistemle tutarlı göster.
- [ ] S2-05 — Yükleme sonrası niyet seçimi: dosya tipine uygun 'Ne yapmak istiyorsun?' seçenekleri; kullanıcı bir araçtan gelmişse seçili aracı koru.
- [ ] S2-06 — Drag over, dragging, selected, validating, incompatible format, too large, upload progress, processing, success, failed, canceled, retry durumlarını tasarla.
- [ ] S2-07 — Gerçek dosya durumunda dosya adı, tipi, boyutu ve kaldır/değiştir aksiyonlarını erişilebilir biçimde göster.
- [ ] S2-08 — Güven mesajını tek bir kısa ve doğrulanmış cümlede sun; üç ayrı trust kartı tekrarlama.
- [ ] S2-09 — Mobilde dropzone, başlık ve CTA sıralamasını göreve göre optimize et; katlanma çizgisine aşırı bağımlı olma.
- [ ] S2-10 — Kullanıcının dosyayı seçtikten sonra ne olacağını önceden anlatan tek satırlık açıklama ekle.

**Teslimatlar:** Yeni hero, üretim upload component'i, tüm durum ekranları, mobil/masaüstü senaryoları.

**Kabul kriterleri:** Hem buton hem sürükle-bırak dosya seçtiriyor; klavye ile yüklenebiliyor; hatalı format ve boyutlarda eyleme dönük geri bildirim var; araçtan başlayan akış kaybolmuyor; tek net primary CTA var.

---

## SPRINT 3 — Tools kataloğu: 16 aynı kart yerine anlamlı keşif

**Amaç:** Kullanıcının popüler işlemleri hızlı bulması ve bütün araçları ezberlemek zorunda kalmaması.

### İş paketleri
- [x] S3-01 — Mevcut 16 aracı Convert, Organize, Optimize & Protect ve OCR kategorilerine ayır; OCR/aranabilir PDF ayrımını koru.
- [x] S3-02 — Dört hızlı başlangıç aracı göster; gerçek kullanım ölçümü doğrulanmadığı için bunları “Önerilen / Suggested” diye adlandır.
- [x] S3-03 — Kalan araçları kategori başlıkları altında daha kompakt listede sun.
- [x] S3-04 — Featured hızlı başlangıç, standard arama sonucu, compact kategori aracı biçimlerini ayır.
- [x] S3-05 — All / Convert / Organize / Optimize & Protect / OCR filtrelerini çalıştır. Filtre URL eşlemesini değerlendirdik; görünüm filtresi geçici, `#tools` sayfa konumu için kullanılıyor ve araç paneli `#tool/{id}` rotasıyla çakışmaması için kategori query parametresi eklenmedi.
- [x] S3-06 — Türkçe/İngilizce adlar ve alternatif terimlerle arama; `jpg to pdf`, `image to pdf`, `merge pdf` eşleşmeleri ve sonuç yok ekranı.
- [x] S3-07 — Araç başlığı, kısa açıklama ve net girdi → çıktı formatı; tekrar eden alt eylem satırı kaldırıldı.
- [x] S3-08 — Kartlar iç içe kontrol içermeyen `<button>` eylemleri; klavye odağı, hover ve disabled görünüm kuralları.
- [x] S3-09 — Araçları kategori gruplarına ayırıp tek kartlı genel katalog son satırı sorununu kaldır.
- [x] S3-10 — Araç adları ve format etiketleri tutarlılaştırıldı (ör. `JPG/PNG → PDF`).

**Teslimatlar:** Yeni katalog, kategoriler, filtre ve arama, tool card variant'ları, route bağlantıları.

**Kabul kriterleri:** Mevcut 16 araçtan hiçbiri kaybolmuyor; popüler araçlara masaüstünde ilk anlamlı kaydırma öncesi ya da kısa kaydırmayla ulaşılıyor; tüm filtreler ve arama çalışıyor; klavye ile kullanılabiliyor; aynı kart şablonu monotonluğu giderilmiş.

---

## SPRINT 4 — Araç detay sayfaları ve işlem akışı

**Amaç:** Ana sayfadaki değişiklik, araca giriş sonrasında daha kötü veya tutarsız deneyim oluşturmamalı.

### İş paketleri
- [x] S4-01 — Tüm araçlara uygulanan temel sayfa şablonu: başlık + kısa vaat + uygun upload + seçenekler + işlem sonucu + yardım.
- [x] S4-02 — Tek dosyalı, çok dosyalı, sayfa düzenlemeli, çıktı ayarlı ve OCR'li araçlar için gerektiğinde ayrı kompozisyon varyantları oluştur; her şeyi tek generik form içine sıkıştırma.
- [x] S4-03 — Dosya yükleme bileşenini hero ve detay sayfasında paylaş; davranış farklarını explicit props ile yönet.
- [x] S4-04 — Multi-file işlemlerde dosya ekle/çıkar/sırala, sıra değiştir, toplam dosya sayısı ve limitlerini göster.
- [x] S4-05 — İşleme durumlarında işlem sürüyor, bekleniyor, tamamlandı, başarısız oldu, iptal edildi ve tekrar dene akışlarını kapsa.
- [x] S4-06 — Çıktı durumunda dosya adı/formatı/boyutu, indirme, yeni dosyayla devam et ve mümkünse bir sonraki uygun işlemi göster.
- [x] S4-07 — Korumalı PDF, hatalı/bozuk dosya, şifre hatası, okunamayan görüntü, işlenemeyen sayfa gibi gerçek hata sınıflarını anlaşılır metinlerle eşleştir.
- [x] S4-08 — Kullanıcının yanlışlıkla ayrılması / işlem iptali / yeniden başlatılması durumundaki veri kaybı ve durum saklama stratejisini belirle.
- [x] S4-09 — Her aracın temel SEO başlığı, açıklaması, H1, internal links ve ilgili yardım içeriği tutarlı olsun.
- [x] S4-10 — Klavye/screen reader ile işlem başlatma, ilerleme ve sonuçların anlaşılır sunulduğunu doğrula (`aria-live` vb. gerektiğinde).

**Teslimatlar:** En az her araç tipi için bir doğrulanmış şablon, bütün araç route'larıyla entegrasyon, hata/success durumları.

**Kabul kriterleri:** Her mevcut araç açılabiliyor; mevcut işlevler bozulmadı; upload → seçenek → işlem → indir akışı tamam; başarısızlık mesajı eylem içeriyor; teknik API kontratları korunmuş.

---

## SPRINT 5 — Use-case guides ve gerçek güven açıklaması

**Amaç:** Alt bölümde başka bir kart ızgarası yerine içerik değeri ve güvenilirlik üretmek.

### İş paketleri
- [x] S5-01 — Rehber bölümünü **1 büyük öne çıkan içerik + 2 yan içerik + küçük bağlantı listesi** olarak yeniden kurgula; cihazlara göre kompozisyon değişsin.
- [x] S5-02 — Öğrenci, hukuk, vize, ofis, İK, finans/muhasebe içeriklerini gerçek kullanım senaryosuna göre isimlendir; boş 'category' rozetleriyle doldurma.
- [x] S5-03 — Uzun başlıklarda kontrollü satır sayısı, kısa ve tamamlanmış açıklama, anlamlı 'Read guide' bağlantısı kullan; belirsiz üç noktalı kesmeleri azalt.
- [x] S5-04 — Her rehberi ilgili dönüşüm aracıyla bağla; linkler iki yönlü (rehber ↔ araç) olabilir.
- [x] S5-05 — Hero altında ayrı trust kartlarını ve aşağıdaki tekrar güvenlik kartlarını içerik açısından birleştir.
- [x] S5-06 — Güvenlik mimarisini gerçekle eşleyen süreç anlatımı oluştur: yükleme → işleme → sonuç → saklama/silme. Sunucu veya tarayıcı aşamalarını doğru isimlendir.
- [x] S5-07 — Her iddiayı `verified / needs proof / remove` olarak etiketle; doğrulanmayan mutlak cümleleri yayınlama.
- [x] S5-08 — Privacy Policy ve güvenlik açıklaması arasında çelişki var mı kontrol et; veri saklama sürelerini tutarlı yaz.
- [x] S5-09 — Bu bölümde yeni kart grid'i yerine süreç şeması, kısa kanıt blokları, teknik metin ve anlamlı linkler kullan.

**Teslimatlar:** Editoryal rehber modülü, güvenlik anlatımı, içerik-iddia kontrol tablosu.

**Kabul kriterleri:** Rehberler tools grid'inin kopyası değil; her rehberden ilgili araca gidiliyor; hiçbir doğrulanmamış güvenlik vaadi yok; güven anlatımı görsel olarak kolay taranabiliyor.

---

## SPRINT 6 — FAQ, footer, içerik temizliği ve SEO

**Amaç:** Son bölümlerde okunabilirlik ve güveni artırmak, sayfanın 'link deposu' gibi bitmesini engellemek.

### İş paketleri
- [x] S6-01 — FAQ maliyet, biçimler, işleme yolu/konumu, silme, büyük dosya, hata ve sonuç kalitesini kapsayacak şekilde TR/EN genişletildi.
- [x] S6-02 — Native details/summary klavye davranışı korundu; yanıt ilişkisi, focus ve açık/kapalı görünüm iyileştirildi, tarayıcıdan doğrulandı.
- [x] S6-03 — Footer dört anlamlı gruba indirildi; 16 araç yerine ürünce önerilen dört araç gösteriliyor.
- [x] S6-04 — Telif, e-posta, iletişim ve yasal link hedefleri statik rotalarla karşılaştırıldı ve tarayıcıda kontrol edildi.
- [x] S6-05 — Önerilen araç ve gerçek kullanım örneği adlandırmaları UI, footer ve rehber bağlantılarında tutarlı hale getirildi.
- [x] S6-06 — Build rotalarında tek H1, başlık sırası ve anlamlı erişilebilir link adları denetlendi; 404 için açıklayıcı başlık ve ana sayfa yolları eklendi.
- [x] S6-07 — Title/description, canonical, hreflang, sitemap, robots, Open Graph, favicon ve 404 denetlendi; eksik 404 eklendi.
- [x] S6-08 — Desteklenmeyen ücretsiz/kalite/güvenlik/sınır vaatleri ve anlamsız popülerlik iddiaları düzeltildi; ana sayfa metadata'sı güncellendi.
- [x] S6-09 — TR/EN FAQ ve footer eşlendi; canonical/hreflang/dil menüsü kaynakları denetlendi, responsive taşma kontrolü yapıldı.

**Teslimatlar:** Güncel FAQ, sade footer, [içerik stili ve SEO kontrol listesi](../docs/CONTENT-SEO-CHECKLIST.md).

**Kabul kriterleri:** Ölü link yok; bütün politikalar gerçek uygulamayla uyumlu; mobilde footer okunabilir; FAQ erişilebilir; sayfa içerik tekrarı belirgin biçimde azaltılmış.

---

## SPRINT 7 — Kalite kapıları, görsel regresyon, yayın

**Amaç:** Görsel yönden farklı ama işlevsel yönden kırık ürün yayınlamamak.

### İş paketleri
- [x] S7-01 — 320/360/390/768/1024/1280/1440/1920 px görünüm matrisi, ekran görüntüleri ve görsel karşılaştırma üretildi; önceki Sprint 3 görüntüsü eşleşmiş regression baseline değildir.
- [x] S7-02 — Chrome/Chromium, Firefox, Safari WebKit, mobil emülasyonlar ve Windows Edge otomasyon matrisi çalıştı. Fiziksel iOS/Android cihaz testi yapılmadı.
- [x] S7-03 — Klavye, skip link, arama, FAQ, reduced-motion ve temel erişilebilir ad testleri geçti. Lighthouse erişilebilirlik skoru 100; ekran okuyucu ve tam manuel kontrast denetimi yapılmadı.
- [x] S7-04 — Bundle/PDF.js lazy-load ve Lighthouse raporu üretildi. Yerel API kapalıyken console-error audit 502 verdi; LCP/CLS/INP saha metriği ölçülmedi. Ayrıntı `project-planning/UIUX-Sprint-7/PERFORMANCE_REPORT.md`.
- [x] S7-05 — 16 aracın gerçek browser→API→queue→worker→download/delete akışı geçti. Lifecycle kontrollerinden 5/6 geçti; altıncı timeout ölçümü yanlış süreçte yapılandırıldığı için geçersiz sayıldı ve yeniden test gerektiriyor. Ayrıntı `project-planning/UIUX-Sprint-7/QA_REPORT.md`.
- [x] S7-06 — Header, arama, filtre, kategori, rehber/footer, FAQ ve araç seçimi akışlarının otomatik testleri geçti.
- [x] S7-07 — Mobil/masaüstü ekranları ve Sprint 3 görsel karşılaştırması incelendi; önceki ekran görüntüsü aynı sürüm/viewport tabanı olmadığı için piksel regresyonu olarak kullanılmadı.
- [x] S7-08 — Gizlilik allowlist'i, izin/DNT davranışı ve belirtilen 10 event için e2e testleri geçti; 7/7 analytics testi başarılı.
- [x] S7-09 — Kademeli yayın ve rollback talimatı `project-planning/UIUX-Sprint-7/RELEASE_NOTES.md` içine yazıldı. Staging/üretim yayını ve gerçek kullanım baseline kıyası yapılmadı.
- [x] S7-10 — Değişiklik sırasında bulunan tek dosya değiştirme açığı düzeltildi; PDF.js ilk yükü tembelleştirildi ve yerel varlıklara taşındı. Kapsamlı ölü CSS/bağımlılık temizliği ayrıca doğrulanmadı.

**Teslimatlar:** `QA_REPORT.md`, `ACCESSIBILITY_REPORT.md`, `PERFORMANCE_REPORT.md`, screenshot diff, regression checklist, release notes.

**Kabul kriterleri:** P0/P1 hata yok; 16 araç için smoke test yeşil; yatay taşma yok; temel a11y akışları geçiyor; gerçek iddia doğrulama tamam; performans iyileşmeleri/bilinen sınırlılıklar belgelenmiş; rollback uygulanabilir.

---

## Bölüm bazlı dönüşüm haritası

| Mevcut parça | Karar | Hedef |
|---|---|---|
| Navbar | Yeniden düzenle | Daha net navigasyon, kullanışlı arama ve dil kontrolü |
| Logo | Evrimsel iyileştir | Daha ayırt edici, fakat tanınabilir marka |
| Hero copy | Yeniden yaz | Somut fayda + tek primary CTA |
| Quick File Drop | Büyüt ve zenginleştir | Gerçek ürün aksiyonu, durumları eksiksiz |
| Hero altı 3 güven kartı | Kaldır/birleştir | Kısa, doğrulanmış bir güven sinyali |
| Tools 16 eş kart | Yeniden yapılandır | Popüler araçlar + kategoriye göre katalog |
| Araç kartları | Variantlaştır | Featured, standard, compact ve anlamlı format |
| Kategori filtreleri | İşlevselleştir | Arama ve filtre tam çalışsın |
| Rehberler 6 benzer kart | Editoryal yeniden tasarla | Büyük featured hikâye + farklı yoğunluklar |
| Security 3 kart | Birleştir/kanıtla | Gerçek veri işleme süreci ve teknik doğruluk |
| FAQ | Koru, geliştir | Basit, erişilebilir accordion, doğru sorular |
| Footer | Sadeleştir | Kısa, bulunabilir bağlantılar |
| Tipografi | İyileştir | Daha okunabilir body ve belirgin hiyerarşi |
| Renk sistemi | Kurallaştır | Rastgele pastel yerine semantik kullanım |
| Responsive | Bütün sprintlerde uygula | Mobil öncelikli yerleşim |
| SEO ve performans | Doğrula ve iyileştir | Ölçülebilir kalite |

## Öncelikli tasarım kararları / ürün kuralları

1. **Birincil kullanıcı görevi** PDF/dosya işlemi yapmak; bu sebeple hero yükleme alanı, genel bir pazarlama CTA'sından daha önemli.
2. **Bütün araçlar kaybolmayacak**; yalnızca görsel öncelikleri ve keşfedilme yolları değişecek.
3. **Kategoriye göre renk** anlamlı olabilir; sırf her kart farklı görünsün diye ikon renkleri çeşitlendirilmeyecek.
4. **Güvenlik gerçekliği** kod/altyapı ve politikalarla doğrulanmadan yayınlanmayacak.
5. **Tüm section'lar aynı kart yüzeyini kullanmayacak**; kompozisyon farkı içerik türüyle açıklanmalı.
6. **Araç sayfası akışı** ana sayfa makeover'ının ayrılmaz parçası; ana sayfada yeni upload akışı varsa araca sorunsuz taşınmalı.
7. **Mobil önce düşün**; karmaşık masaüstü kompozisyonu yalnızca daraltma yoluyla mobil yapılmayacak.
8. **Anlamlı hareket**: hover, focus, loading, progress; yalnızca dekoratif hareketten kaçın.

## Global Definition of Done (her sprint için)

- [ ] Masaüstü ve mobil ekranları hazır; 360/390/768/1440 px kontrolleri yapılmış.
- [ ] Bileşen erişilebilir adı, klavye desteği, focus görünürlüğü ve boş/hata durumlarını kapsıyor.
- [ ] Eski işlevler ve route'lar korunmuş; değişiklikler regression testleriyle doğrulanmış.
- [ ] Türkçe/İngilizce kopya, dosya formatı etiketleri ve güvenlik iddiaları tutarlı.
- [ ] Kod tekrarı ve stil tokenları gözden geçirilmiş.
- [ ] Ekran görüntüsü / component demo ve kısa değişiklik özeti eklenmiş.
- [ ] Eski/yeni görsel karşılaştırması yapılmış; kararlar rastgele değil gerekçeli.
- [ ] Bilinen eksikler ve yapılmayanlar raporlanmış.

## Agent ile uygulama protokolü

### Çalışmaya başlama komutu

```text
DoctorConverter projesinde UI/UX sprint planını uygulayacağız.
Önce ekli DoctorConverter_UIUX_Sprint_Plani.md dosyasını ve mevcut repository'yi incele.
Yalnızca Sprint 0'ı yürüt. Mevcut frontend framework, route/component düzeni, stil sistemi, 16 aracın gerçek akışları, güvenlik iddialarının kod/altyapı karşılıkları ve responsive sorunları için kanıtlı envanter hazırla.
Bu aşamada çalışan üretim işlevlerini değiştirme. Eksik veri veya doğrulanamayan iddiaları 'belirsiz' olarak işaretle, uydurma.
Sprint 0 sonunda audit, bilgi mimarisi, iş paketleri ve seçilen tasarım yönünü dosyalar halinde hazırla; uygulama değişikliklerine ancak Sprint 1'de başla.
```

### Sprintleri çalıştırma kuralı

```text
DoctorConverter sprint planına göre yalnızca Sprint N'i uygula.
Önce bu sprintin mevcut kodla ilişkili görevlerini doğrula, ardından değişiklikleri küçük adımlarla gerçekleştir.
Her adımda mevcut dosya işlemeyi/API akışını bozma; responsive, erişilebilirlik, yükleme ve hata durumlarını da tamamla.
Sprintin sonunda: (1) değişen dosyalar (2) tamamlanan görev ID'leri (3) test/kanıt (4) bilinçli ertelenenler (5) Sprint N kabul kriterleri sonuçlarını raporla.
Sprint N+1'e otomatik geçme.
```

### Önerilen takip dosyaları

```text
project-planning/
├── DoctorConverter_UIUX_Sprint_Plani.md
├── AUDIT.md
├── INFORMATION_ARCHITECTURE.md
├── CONTENT_INVENTORY.md
├── DESIGN_DIRECTION.md
├── DESIGN_TOKENS.md
├── SPRINT_STATUS.md
├── QA_REPORT.md
├── ACCESSIBILITY_REPORT.md
└── PERFORMANCE_REPORT.md
```

## Son kapsam sınırı

Bu plan bir **ekran görüntüsüne dayanarak** hazırlanmıştır. Gerçek repo, framework, maliyet, süre, teknik güvenlik mimarisi ve analitik veriler görülmedi. Sprint 0 bunları belirler; dolayısıyla iş paketlerinin sayısı, sırası ve süreleri audit sonucunda revize edilebilir. Ana sayfa dışındaki araç sayfası şablonları, ana sayfadaki upload ve navigasyon vaatlerinin çalışması için kapsama dahil edilmiştir. Araç motorlarını sıfırdan yazmak, altyapı değiştirmek veya güvenlik sertifikasyonu yapmak bu tasarım sprintlerinin kapsamı değildir.
