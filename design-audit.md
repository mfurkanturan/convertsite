# DoctorConverter görsel kalite incelemesi

Tarih: 25 Ekim 2026. Bu inceleme, önceki içerik sadeleştirmesinden sonraki çalışan kaynak kodunu ve TR/EN tarayıcı görüntülerini esas alır. Mevcut çalışma ağacı korunur. Bu çalışma ana sayfa görsel kalitesini ve ortak bileşenlerin diğer sayfalara etkisini kapsar; API, worker, araç kimlikleri ve URL’ler değişmez.

## Sprint 0: Mevcut yapı

```text
pages/index.astro + pages/tr/index.astro
└─ AppLayout (SEO head, self-hosted fonts, ortak CSS)
   ├─ AppShell (Svelte, locale context, hash navigation)
   │  ├─ Sidebar + Topbar (Logo, ToolSearch, LanguageSwitch)
   │  ├─ Hero → FileDropzone
   │  ├─ ToolGrid → mevcut Icon / tool-card / categories
   │  ├─ HomeGuides → HomeGuidesShowcase
   │  └─ HelpSection (4 adım, saklama açıklaması, genel FAQ)
   └─ SiteFooter → AnalyticsConsent
```

- Veri: 16 kimlik ve kategori `lib/tools.ts`; ortak UI `i18n/ui.ts`; TR/EN rota/alternatifleri `i18n/locales.ts`; rehberler `lib/seo/scenarios-*` kaynaklarından gelir.
- Ana sayfa kartları mevcut `#tool/{id}` navigasyonunu kullanır. Doğrudan EN `/{id}`, TR `/tr/{id}` rotaları ayrı statik landing page’lerdir; bunlar aynı ToolWorkspace’i kullanır. Quick Start dört önerilen araçtır; ölçülmüş popülerlik değildir. Ana sayfada dört önerilen + 12 diğer kart, benzersiz toplam 16 araç vardır.
- Inter Variable gövde, Sora Variable başlık; latin-ext yerel fontlar. Ağırlıklar çoğunlukla 500/600/700, logo içinde 800 kullanır.
- Ana container 1240px; uygulamada 16/24/32px yatay padding, footer’da 16/32px, ayrı doküman header’ında tekrar eden 1240px tanımı vardır.
- Breakpoint’ler 540/600/640/650/768/1024/1100/1101px arasında dağılmıştır. İşlevsel panel breakpoint’leri korunmalı, katalogdaki sayıya özel grid istisnaları sadeleştirilmelidir.
- Radius 8/12/16px; kart gölgesi 0 6px 20px, floating yüzey gölgesi 0 12px 30px. Normal araç kartı hover’da gölge ekler. Birincil Button farklı, doğrudan yazılmış bir gölge kullanır.

## Bulgu ve öncelikler

| Öncelik | Bulgu | Etkilenen yer | Karar |
| --- | --- | --- | --- |
| P0 | Kompakt araç başlıkları 14px; açıklamayla aynı ölçekte | ToolGrid | Başlık 15–16px / 600, açıklama 14px / 1.5, metadata 13px |
| P0 | Beşli grid alt satırı 6 sanal kolonla ortalanır; tablette de 3+2 zorlanır | global.css | Masaüstü 3 sol hizalı, tablet 2, mobil 1 gerçek kolon; iki öğe 2 kolon |
| P0 | Container / gutter sayıları farklı bileşenlerde tekrar edilir | AppShell, Topbar, footer, doküman header | Tek 1200px dış container; masaüstü 1136px kullanılabilir içerik, 16/24/32px gutter |
| P0 | Araç ikonlarının renkleri bazı küçük kontrollerde pastel ve düşük ağırlıklı | tool-card, icon mapping | Koyu işlem grubu renkleri; katalogda yüzeysiz kompakt ikon, Quick Start’ta ince belge çerçevesi |
| P1 | Hero başlığında üst margin ve dar satır aralığı; upload ile ağırlık dengesi zayıf | Hero, FileDropzone | 32–48px ölçek, 1.12 line-height; doğrudan container hizası, daha belirgin dropzone border |
| P1 | H2’ler 20–28px ve farklı line-height kullanır | tools/guides/how/faq | Ortak 24–28px / 600 / 1.25 başlık sınıfı |
| P1 | Rehber featured/secondary başlıkları ve numaralar aynı ritmi paylaşmıyor | HomeGuidesShowcase | Featured doğal yükseklik, belirgin numara, iki editoryal yan içerik, daha net link alanları |
| P1 | Süreç satırlarının küçük numaraları metinde kayboluyor; FAQ chevron’ları gereksiz daireli | HelpSection | İnce bağlantılı numara işaretleri; sade 20px chevron ve açık durum çizgisi |
| P1 | PowerPoint ve Excel aynı ikon; parola kaldırma sparkles, filigran scan kullanıyor | tools.ts, icon.svelte | Var olan Lucide ailesinden anlamlı presentation/unlock/stamp ikonları |
| P2 | Footer bazı linkleri 32px yüksekliğinde; ortak hover/active kuralları dağınık | footer, Button | Mobilde ≥44px hedef; kısa 160ms renk/sınır geçişi, reduced-motion korunur |

## Kontrast ve görsel başlangıç

- Mevcut normal muted #5B677A / #F8FAFC yaklaşık 5.48:1; secondary ve mavi link token’ları mevcut AA testindedir. Metinleri açarak kontrast düşürmek yerine mevcut kontrast korunacak.
- İkonlar yeni koyu grup renkleriyle en az 3:1; küçük metin olarak kullanıldıklarında 4.5:1 hedeflenir. Opacity ile araç kullanılabilirliği anlatmak yerine açık durum metni korunur.
- 320px başlangıç örneğinde H1 30px/700, H2’ler 22px/600, FAQ 20px/600, kompakt araç başlığı 14px/600 ölçüldü. Bu eşit olmayan ölçek hiyerarşinin ana sorunudur.
- Başlangıç TR/EN ekranları 320/360/390/768/1024/1440/1920px için `.qa/visual-quality/before/` altında kaydedildi. `metrics.json` hesaplanmış font değerlerini ve taşma ölçümlerini içerir. Görsel seçim politikası sentetik capabilities yanıtıdır; çalışan dönüşüm motoru kanıtı değildir.

## Uygulanacak tokenlar

- Container 1200px; page gutter 16px → 24px → 32px.
- H1 clamp(32px, 4vw, 48px), H2 clamp(24px, 2.2vw, 28px), kategori 18px, kart 15px, gövde 16px, açıklama 14px, metadata 13px.
- Section ritmi 40px mobil / 56px masaüstü; başlık-içerik 24px; kart gap 16px, padding 20px featured / 16px compact.
- Mevcut kontrol/kart radius 8/12px korunur; geniş panel 12px’e bağlanır. Hareket süresi 160ms; dekoratif hover hareketi ve normal kart gölgesi yok.
- Mavi/beyaz kimlik, fontlar ve ana renk #2563EB korunur. Ek font, ikon paketi, dekoratif görsel, gradient veya yeni bağımlılık eklenmez.

## Sprint sırası ve etki sınırı

1. Ortak tokenlar, container ve başlık ölçüleri. Katalog geometri değişikliği Sprint 3’te.
2. Hero / dropzone; dosya seçimi ve gönderim zamanına dokunulmaz.
3. Katalog geometri ve kart hiyerarşisi; sayıya özel CSS kaldırılır, mevcut grid testi yeni sol hiza kararını denetler.
4. Featured rehber, iki yan rehber ve kompakt linkler.
5. Dört süreç adımı, FAQ ve footer.
6. Anlamlı ikonlar, format işaretleri ve kısa etkileşim durumları.
7. İki dil, bütün istenen genişlikler, %200 reflow, 16 araç navigasyonu ve ortak sayfa regresyonu; önce/sonra görsel inceleme.

Sprint raporları `docs/VISUAL-QUALITY-SPRINTS.md` içinde tutulur. Her sprintin görsel ve teknik doğrulaması kaydedilir; final testleri gerçek motor başarısı olarak sunulmaz.
