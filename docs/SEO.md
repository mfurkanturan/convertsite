# SEO ve dil yapısı

Bu belge web uygulamasının arama motoru ve çok dilli yapısının tek kaynağıdır.

## Rotalar

| Sayfa | Türkçe (kök) | İngilizce |
| --- | --- | --- |
| Ana sayfa | `/` | `/en/` |
| Araç sayfaları | `/<tool-id>` | `/en/<tool-id>` |
| Rehber merkezi | `/kullanim/` | `/en/use-cases/` |
| Senaryo sayfaları | `/kullanim/<slug>` | `/en/use-cases/<slug>` |
| Yasal sayfalar | `/gizlilik`, `/kullanim-sartlari`, `/guvenlik`, `/iletisim` | `/en/privacy`, `/en/terms`, `/en/security`, `/en/contact` |

`/sitemap.xml` build sırasında aynı rota verisinden üretilir ve her URL için `hreflang` alternatiflerini içerir.

## İçerik kaynakları

- Arayüz metinleri: `apps/web/src/i18n/ui.ts` (TR/EN). Bileşenler dili `i18n/context.ts` üzerinden alır.
- Araç sayfası içerikleri: `lib/tool-seo.ts` (TR) ve `lib/tool-seo-en.ts` (EN).
- Senaryo (uzun kuyruk) sayfaları: `lib/seo/scenarios-tr.ts` ve `lib/seo/scenarios-en.ts`. Her senaryo hedef aramaları (`queries`), gömülü aracı (`tool`), bölümleri, adımları, ipuçlarını ve SSS’yi tutar. `pair` diğer dildeki karşılığın slug’ıdır ve `hreflang` için kullanılır.
- Yapılandırılmış veri: `lib/seo/structured-data.ts` (Organization, WebSite, WebApplication, HowTo, FAQPage, BreadcrumbList, CollectionPage).

Yeni senaryo eklemek için ilgili dil dosyasına kayıt eklemek yeterlidir; sayfa, rehber merkezi, araç sayfası bağlantıları, footer ve sitemap otomatik güncellenir.

## Dil seçimi

Her sayfanın `<head>` bölümündeki küçük betik şu sırayı izler:

1. Ziyaretçinin dil değiştiriciyle yaptığı seçim (`localStorage: dc-locale`).
2. Tarayıcı dili (`navigator.languages`): `tr*` → Türkçe, `en*` → İngilizce.
3. Diğer dillerde Cloudflare ülkesi (`/cdn-cgi/trace`): TR/CY → Türkçe, diğerleri → İngilizce.

Site içi gezinmede (aynı host referrer) dil kendiliğinden değişmez. Arama motoru botları, headless tarayıcılar ve `navigator.webdriver` hiçbir zaman yönlendirilmez; her dil kendi URL’inde indekslenir. Yönlendirme aynı origin içinde yalnızca yol ile yapılır.

## Search Console

`https://doctorconverter.com/sitemap.xml` Search Console’a gönderilmelidir. `robots.txt` sitemap adresini zaten bildirir.
