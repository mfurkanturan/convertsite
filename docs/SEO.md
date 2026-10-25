# SEO ve dil yapısı

Bu belge web uygulamasının arama motoru ve çok dilli yapısının tek kaynağıdır.

## Rotalar

| Sayfa | İngilizce | İspanyolca | Türkçe |
| --- | --- | --- |
| Ana sayfa | `/` | `/es/` | `/tr/` |
| Araç sayfaları | `/<tool-id>` | `/es/<tool-id>` | `/tr/<tool-id>` |
| Rehber merkezi | `/use-cases/` | `/es/casos-de-uso/` | `/tr/kullanim/` |
| Senaryo sayfaları | `/use-cases/<slug>` | `/es/casos-de-uso/<slug>` | `/tr/kullanim/<slug>` |
| Yasal sayfalar | `/privacy`, `/terms`, `/security`, `/contact`, `/about` | `/es/privacidad`, `/es/terminos`, `/es/seguridad`, `/es/contacto`, `/es/acerca-de` | `/tr/gizlilik`, `/tr/kullanim-sartlari`, `/tr/guvenlik`, `/tr/iletisim`, `/tr/hakkimizda` |

`/sitemap.xml` build sırasında aynı rota verisinden üretilir ve her URL için `hreflang` alternatiflerini içerir.

## İçerik kaynakları

- Arayüz metinleri: `apps/web/src/i18n/ui.ts` (TR/EN ve İspanyolca sözlük yardımcısı `ui-es.ts`). Bileşenler dili `i18n/context.ts` üzerinden alır.
- Araç sayfası içerikleri: `lib/tool-seo.ts` (TR), `lib/tool-seo-en.ts` (EN) ve `lib/tool-seo-es.ts` (ES).
- Senaryo (uzun kuyruk) sayfaları: `lib/seo/scenarios-tr*.ts`, `scenarios-en.ts` ve `scenarios-es.ts`. Her senaryo hedef aramaları (`queries`), gömülü aracı (`tool`), bölümleri, adımları, ipuçlarını ve SSS’yi tutar. `pair` diğer dildeki karşılığın slug’ıdır ve eşleşen rotalarda `hreflang` için kullanılır.
- Yapılandırılmış veri: `lib/seo/structured-data.ts` (Organization, WebSite, WebApplication, HowTo, FAQPage, BreadcrumbList, CollectionPage).

Yeni İngilizce senaryo eklemek için ilgili dil dosyasına kayıt eklemek yeterlidir; sayfa, rehber merkezi, araç sayfası bağlantıları, footer ve sitemap otomatik güncellenir. Her İngilizce senaryonun `scenarios-es.ts` içinde `pair` ile eşleşen bir İspanyolca kaydı olmalıdır; `apps/web` içindeki `check:i18n` bunu doğrular.

## Dil seçimi

Her sayfanın `<head>` bölümündeki küçük betik şu sırayı izler:

1. Ziyaretçinin dil değiştiriciyle yaptığı seçim (`localStorage: dc-locale`).
2. Tarayıcı dili (`navigator.languages`): `tr*` → Türkçe, `es*` → İspanyolca, `en*` → İngilizce.
3. Diğer dillerde Cloudflare ülkesi (`/cdn-cgi/trace`): TR/CY → Türkçe; ES ve İspanyolca konuşulan Amerika ülkeleri → İspanyolca; diğerleri → İngilizce.

İngilizce kök URL’ler, İspanyolca `/es/` ve Türkçe `/tr/` öneki kullanılır. Açıkça `/es/` veya `/tr/` ile başlayan URL’ler ziyaretçinin seçimi sayılır ve otomatik olarak başka dile çevrilmez. İngilizce URL’lerde dil seçimi kayıtlı tercihe, tarayıcı diline ve son olarak ülkeye bakar. Site içi gezinmede (aynı host referrer) dil kendiliğinden değişmez. Arama motoru botları, headless tarayıcılar ve `navigator.webdriver` hiçbir zaman yönlendirilmez; her dil kendi URL’inde indekslenir. Yönlendirme aynı origin içinde yalnızca yol ile yapılır. OCR motoru şu an İngilizce ve Türkçe tanımayı destekler; İspanyolca arayüz bu yeteneği varmış gibi göstermez.

## Search Console

`https://doctorconverter.com/sitemap.xml` Search Console’a gönderilmelidir. `robots.txt` sitemap adresini zaten bildirir.
