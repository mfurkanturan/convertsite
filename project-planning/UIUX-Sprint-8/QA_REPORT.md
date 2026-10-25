# Sprint 08 — DoctorConverter Refinement & Product Polish

## Durum ve kanıt

Sprint 8 arayüz düzenlemeleri, dokümantasyon ve otomatik doğrulamalar tamamlandı. API sözleşmesi ve 16 araç kaydı değiştirilmedi.

- `pnpm check`: geçti. Import/katman sınırları geçti; Astro 54 dosyada 0 hata/uyarı/bilgi, Svelte 0 hata/uyarı.
- `pnpm build`: geçti; 105 statik sayfa üretildi.
- `pnpm test:e2e`: 156 testten 101 geçti, 55 proje/kapsam istisnası atlandı, başarısızlık yok. Chromium, mobil Chromium, Firefox, Safari WebKit, mobil Safari WebKit ve Edge projeleri dahil.
- Uygulama E2E paketi Chromium + mobil Chromium: 35 geçti, 1 mobil kısayol testi beklendiği gibi atlandı. Görsel matris yatay taşma kontrolü ve ekran görüntülerini kapsıyor.
- 16 araçta dosya seçimi/çalışma alanı smoke testi masaüstü ve mobil Chromium'da geçti.
- Arama, kategori filtresi, klavye arama kısayolu, combobox ve FAQ klavye kontrolleri Chromium'da 5/5 geçti.
- WCAG AA token kontrast ve katalog metadatası kontrolleri masaüstü ve mobil Chromium'da geçti.
- Gerçek API → kuyruk → worker → indirme/silme audit'i 16/16 araçta geçti. Gerçek worker tamamlanması, başka oturum erişim reddi, indirme, tarayıcı indirmesi, silme kabulü ve erişim kesilmesi her biri 16/16; silme gecikmesi sonrasında süresi dolmuş ama temizlenmemiş dosya sayısı 0. Kanıt `.qa/engine-audit/workflow.json` ve `cleanup.json` içindedir. Audit Docker projesi teardown edildi. Bu sonuçlar UI erişilebilirlik sertifikası değildir.

## Görev sonuçları

### DC-01 — Öne çıkan rehber kartı

- Karttaki iç içe kutular kaldırıldı; başlık/açıklama ile CTA masaüstünde aynı satırda, mobilde alt alta; üç adım yatay süreç şeridinde gösteriliyor. Adım başlığı 15–16px, açıklaması 14px. Sabit kart yüksekliği ve dekoratif önizleme kullanılmıyor.
- Son polish doğrulaması TR ve EN'de 1440/1024/768/390px ölçülerinde doğal içerik yüksekliğini, CTA görünürlüğünü, 3 adımı, yatay taşma olmamasını ve klavyeyle Enter navigasyonunu doğruladı.

### DC-02 — Araç kategorisi grid'leri

- 2/3/4/5/7 öğeli gruplar için dengeli sütunlar ve son satır yerleşimi eklendi. 5 öğeli grup 641–1100px tablet aralığında da 3+2 ortalı düzeni korur; diğer gruplar 1100px altında iki, tüm gruplar 640px altında tek sütuna geçer.
- Son polish doğrulaması TR ve EN'de 1440/1024/768/641/390px ölçülerinde 3+2 satır geometrisini ve taşma olmadığını ölçtü. 7 öğeli kategori mevcut ürün verisinde bulunmadığı için bu varyant uçtan uca test edilmiş sayılmaz.

### DC-03 — Hero dosya seçimi

- Ana sayfa tek dosya seçimini, çoklu dosya akışı ise ilgili araçta ek girdi eklemeyi kısa mikro metinle söylüyor; format listesi ve dosya limiti görünür kalıyor.
- Kanıt: ana sayfadaki tek dosyalı açıklama ve PDF birleştirme ekranındaki `multiple` girişi masaüstü/mobil tarayıcı matrisinde doğrulandı.

### DC-04 — Tipografi ve kontrast

- Yardımcı metin tokenı `#64748B` → `#5B677A` olarak koyulaştırıldı; yardımcı metin/metadata boyutları en az 13–14px'e çıkarıldı.
- Hesaplanan oranlar: muted/bg 5.48:1, secondary/bg 7.24:1, accent/bg 4.94:1, accent-strong/white 6.70:1.
- Kanıt: token kontrast ve metadata boyu Playwright ile ölçüldü; masaüstü, mobil Chromium ve tam browser suite geçti. Token ölçümü tüm gerçek içerik eşleşmelerinin manuel WCAG onayı değildir.

### DC-05 — Güvenlik metinleri ve backend davranışı

- Türkçe/İngilizce gizlilik ve güvenlik metinleri API davranışına göre hizalandı: varsayılan saklama 60 dakika; silme erişimi anında kapatır; fiziksel temizleme için en az 120 saniyelik bekleme vardır ve temizlik worker tarafından periyodik yürütülür.
- Kanıt: `apps/server/src/platform/config.ts`, dosya deposundaki `markDeleted`/erişim sorguları, cleanup worker ve API silme cevabı incelendi; audit akışı silme sonrası erişim kesilmesini doğrular.

### DC-06 — Component varyasyonları

- Tool kartları ortak temel yüzey, kenarlık, radius, hover/focus ve seçili/kullanılamıyor durumlarını paylaşıyor; featured/standard/compact yalnız boyut ve boşlukları belirliyor. Dropzone'lar da tek görsel sınır ve focus/dragging davranışına bağlandı.
- Kanıt: E2E responsive katalog düzenini, kategori `aria-pressed` durumunu, arama/FAQ klavye etkileşimlerini ve dropzone çoklu dosya niteliğini kontrol etti; check ve build geçti. Her kartın hover/focus/unavailable varyantı için ayrı görsel durum testi eklenmedi.

### DC-07 — Responsive ve gerçek kullanım

- Playwright viewport'ları: ana sayfa 320/360/390/768/1024/1280/1440/1920px; araç, rehber ve güvenlik sayfaları 320/390/768/1440px. Masaüstü ve mobil cihaz profillerinde 16 aracın dosya seçimi/çalışma alanı açılması kontrol edildi.
- Gerçek worker audit'inde 16 araçtan her biri başarılı tamamlandı; aynı akışta başka oturum erişim reddi, çıktı indirme, silme kabulü ve silme sonrası erişim kesilmesi kontrolleri raporlandı.
- Kapsam sınırı: fiziksel iOS/Android cihazı, gerçek assistive technology/screen reader ve AdSense/gerçek prod uçtan uca testi yapılmadı.

## Final polish takip doğrulaması

- `pnpm check`: geçti; modül sınırı, server TypeScript, Astro ve Svelte kontrolleri hatasız.
- `pnpm build`: geçti; 105 statik sayfa üretildi.
- `pnpm exec playwright test e2e/app.spec.ts --project=chromium`: 19/19 geçti.
- Aynı E2E dosyasındaki rehber, kategori, kısa kopya ve hero akışları `mobile-chrome` profiliyle: 4/4 geçti.
- Bir ara koşu eski hero metnini bekleyen assertion nedeniyle 1 testte başarısız oldu; beklenti yeni kısa kopyaya güncellendikten sonra masaüstü ve mobil profillerinde geçti.

## Düzenlenen ana dosyalar

- `apps/web/src/components/home-guides.astro`, `home-guides-showcase.svelte`
- `apps/web/src/components/tool-grid.svelte`, `file-dropzone.svelte`, `tool-search.svelte`
- `apps/web/src/styles/global.css`, `tokens.css`
- `apps/web/src/i18n/ui.ts`; güvenlik/gizlilik sayfaları
- `e2e/app.spec.ts`, `e2e/visual-regression.spec.ts`
- `docs/DESIGN-SYSTEM.md`, `docs/USER-FLOWS.md`, `docs/TESTING.md`

## Bilinen sınırlar

- 55 atlanan E2E testi test konfigürasyonundaki proje/cihaz kapsamı istisnalarıdır; bunlar başarısız test olarak sayılmadı. Analitik izin testleri ayrıca opt-in'dir.
- Renk tokenı kontrastı ve otomatik klavye kontrolleri tam manuel erişilebilirlik denetiminin yerine geçmez.
- Dönüşüm motoru kalite/çıktı davranışında değişiklik yapılmadı; mevcut motor yeterliliği [ENGINE-AUDIT](../../docs/ENGINE-AUDIT.md) raporundaki sınırlar dahilindedir.
