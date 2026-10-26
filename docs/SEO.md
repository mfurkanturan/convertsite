# SEO ve dil yapısı

Bu belge web uygulamasının arama motoru ve çok dilli yapısının tek kaynağıdır.

## Rotalar

| Sayfa | İngilizce | İspanyolca | Türkçe | Fransızca | Hintçe |
| --- | --- | --- | --- | --- | --- |
| Ana sayfa | `/` | `/es/` | `/tr/` | `/fr/` | `/hi/` |
| Araç sayfaları | `/<tool-id>` | `/es/<tool-id>` | `/tr/<tool-id>` | `/fr/<tool-id>` | `/hi/<tool-id>` |
| Rehber merkezi | `/use-cases/` | `/es/casos-de-uso/` | `/tr/kullanim/` | `/fr/guides/` | `/hi/upayog/` |
| Senaryo sayfaları | `/use-cases/<slug>` | `/es/casos-de-uso/<slug>` | `/tr/kullanim/<slug>` | `/fr/guides/<slug>` | `/hi/upayog/<slug>` |
| Yasal sayfalar | `/privacy`, `/terms`, `/security`, `/contact`, `/about` | `/es/privacidad`, `/es/terminos`, `/es/seguridad`, `/es/contacto`, `/es/acerca-de` | `/tr/gizlilik`, `/tr/kullanim-sartlari`, `/tr/guvenlik`, `/tr/iletisim`, `/tr/hakkimizda` | `/fr/confidentialite`, `/fr/conditions`, `/fr/securite`, `/fr/contact`, `/fr/a-propos` | `/hi/gopaniyata`, `/hi/upayog-sharten`, `/hi/suraksha`, `/hi/sampark`, `/hi/hamare-bare-mein` |

`/sitemap.xml` build sırasında aynı rota verisinden üretilir ve her URL için `hreflang` alternatiflerini içerir.

## İçerik kaynakları

- Arayüz metinleri: `apps/web/src/i18n/ui.ts` ana İngilizce/Türkçe sözlük tipini ve varsayılan sözlükleri tanımlar; `ui-es.ts`, `ui-fr.ts` ve `ui-hi.ts` yerelleştirilmiş sözlükleri sağlar. Bileşenler dili `i18n/context.ts` üzerinden alır.
- Araç sayfası içerikleri: `lib/tool-seo.ts` (TR), `lib/tool-seo-en.ts` (EN), `lib/tool-seo-es.ts` (ES), `lib/tool-seo-fr.ts` (FR), `lib/tool-seo-hi.ts` (HI).
- Senaryo (uzun kuyruk) sayfaları: `lib/seo/scenarios-tr*.ts`, `scenarios-en.ts`, `scenarios-es.ts`, `scenarios-fr.ts` ve `scenarios-hi.ts`. Her senaryo hedef aramaları (`queries`), gömülü aracı (`tool`), bölümleri, adımları, ipuçlarını ve SSS’yi tutar. `pair` diğer dildeki karşılığın slug’ıdır ve eşleşen rotalarda `hreflang` için kullanılır.
- Yapılandırılmış veri: `lib/seo/structured-data.ts` (Organization, WebSite, WebApplication, HowTo, FAQPage, BreadcrumbList, CollectionPage).

Yeni senaryo eklerken yalnızca gerçekten çevrilmiş eşdeğer sayfalar `pair` ile bağlanmalıdır; sayfa, rehber merkezi, araç sayfası bağlantıları ve sitemap bu veriden üretilir. Mevcut `check:i18n`, anahtar eşleşmelerini ve bazı EN→ES içerik kapsamını denetler; beş dilde her sayfanın tamamlandığını tek başına kanıtlamaz.

## Dil seçimi

Her sayfanın `<head>` bölümündeki küçük betik şu sırayı izler:

1. Ziyaretçinin dil değiştiriciyle yaptığı seçim (`localStorage: dc-locale`).
2. Tarayıcı dili (`navigator.languages`): `tr*` → Türkçe, `es*` → İspanyolca, `fr*` → Fransızca, `hi*` → Hintçe, `en*` → İngilizce.
3. Diğer dillerde Cloudflare ülkesi (`/cdn-cgi/trace`): TR/CY → Türkçe; ES ve İspanyolca konuşulan Amerika ülkeleri → İspanyolca; diğerleri → İngilizce.

İngilizce kök URL; diğer arayüzler `/es/`, `/tr/`, `/fr/` ve `/hi/` öneklerini kullanır. Açıkça bu öneklerden biriyle başlayan URL ziyaretçinin seçimi sayılır ve otomatik olarak başka dile çevrilmez. İngilizce kök URL'lerde dil seçimi kayıtlı tercih, tarayıcı dili ve son olarak ülke sinyalini kullanır. Site içi gezinmede (aynı host referrer) dil kendiliğinden değişmez. Arama motoru botları, headless tarayıcılar ve `navigator.webdriver` yönlendirilmez; her dil kendi URL'inde indekslenir. Yönlendirme aynı origin içinde yalnızca yol ile yapılır. Arayüz dili, OCR motorunun belge dili desteğiyle aynı şey değildir; OCR seçenekleri ve gerçek motor kapsamı araç paneli ile ENGINE-SUPPORT'tan doğrulanır.

## Search Console

`https://doctorconverter.com/sitemap.xml` Search Console’a gönderilmelidir. `robots.txt` sitemap adresini zaten bildirir.
