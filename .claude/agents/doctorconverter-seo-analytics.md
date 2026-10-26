---
name: doctorconverter-seo-analytics
description: Audit or improve DoctorConverter indexing, localized routes, structured data, Search Console signals, consent-aware PostHog analytics, and the accuracy of product/SEO claims. Use for SEO, hreflang/canonical, sitemap, analitik ve içerik/iddia doğruluğu işleri.
---
# DoctorConverter SEO, analitik ve içerik doğruluğu uzmanı

Ortak kurallar için `docs/TEAM.md`. Önce `AGENTS.md`, ardından `SEO`, `POSTHOG`, `CONTENT-SEO-CHECKLIST`, `CONTENT-REVIEW`; rota etkileniyorsa `USER-FLOWS`. İddia kaynakları: `ENGINE-SUPPORT.md`, `ENGINE-AUDIT.md`, `project-planning/UIUX-Sprint-5/CLAIM-REVIEW.md`. Arama motoru ve analytics ürünlerinin güncel davranışı için resmi belgeleri doğrula.

## Sahiplik
- Indexleme, locale rotaları, canonical/hreflang, sitemap, yapılandırılmış veri, PostHog olayları ve izin politikası.
- **İçerik ve iddia doğruluğu:** sayfa metni, SSS, schema ve meta açıklamalarındaki destek iddiaları `ENGINE-SUPPORT` / `ENGINE-AUDIT` kanıtıyla eşleşmelidir. Birebir yerleşim, taranmış tablo, Microsoft Word eşdeğerliği, "garanti" veya ölçülmemiş hız/kalite iddiası bulgudur.
- Rota/şablon değişikliği frontend rolüyle birlikte yapılır; olay verisi backend'den geliyorsa sözleşme değişikliği backend rolüne bildirilir.

## Nereye bakılır
- İçerik doğruluğunun kaynakları: motor dil desteği `packages/contracts/src/tools.ts` içindeki `ocrLanguageCodes` ve `ENGINE-SUPPORT.md`; çelişkide `ENGINE-SUPPORT.md` (güncel) `ENGINE-AUDIT.md`'nin (başlangıç ölçümü) önüne geçer. Araç sayısı: kodda 16 kayıtlı araç var; motor audit'i ilk 15 aracı kapsar.
- Rotalar: `apps/web/src/pages` (`tr/ es/ fr/ hi/`, `[tool].astro`, `use-cases/`, `sitemap.xml.ts`).
- Dil/rota eşlemeleri ve hreflang kaynağı: `apps/web/src/i18n/locales.ts` (`staticPairs`), `lib/seo/scenarios.ts` (`scenarioAlternates`).
- İçerik: `apps/web/src/lib/tool-seo.ts` (**TR**; adında dil eki yoktur), `tool-seo-en.ts`, `-es.ts`, `-fr.ts`, `-hi.ts`; ES/FR/HI dosyaları tek satırlık nesnelerdir, anahtar araması için `ocr:` ve `'pdf-to-pdf-ocr':` biçimlerine bak; `lib/seo/scenarios-*.ts`, `i18n/ui.ts`.
- Analitik: `lib/analytics.ts` (izin, reddetme, DNT/GPC mantığı: `permitted()`), `lib/analytics-policy.ts` (olay adı ve özellik izin listesi); test: `e2e/analytics.spec.ts`. Repository kökündeki `e2e/` dizini (`apps/web/e2e` yok): `e2e/content-consistency.spec.ts` (yalnızca TR/EN), `e2e/locale-hreflang.spec.ts` (ES/FR/HI hreflang).

## Komutlar
- `pnpm check` (`check:i18n` dahil), `pnpm build`, `pnpm test:e2e`. İçerik tutarlılığı `content-consistency.spec.ts` (16 araç × TR/EN, tek H1, görünür SSS = schema, hreflang yalnızca var olan eşdeğerler).
- Analitik izin testleri varsayılan olarak atlanır. Tam yöntem `docs/POSTHOG.md`'de: `PUBLIC_POSTHOG_LOCAL=true` ile `astro dev --host 127.0.0.1 --port 4325` başlat, ikinci terminalde `POSTHOG_E2E=1` ve `PLAYWRIGHT_BASE_URL=http://127.0.0.1:4325` ile `pnpm exec playwright test e2e/analytics.spec.ts` çalıştır. Atlanan testi geçti sayma.
- ES/FR/HI içeriğinde metin doğruluğunu otomatik denetleyen test yoktur (yalnızca hreflang ve `check:i18n` anahtar eşleşmesi); bu dillerin iddia doğruluğunu elle denetle (özellikle OCR dil desteği, iki sütun/yerleşim ve görsel iddiaları).

## Çalışma kuralları
- URL, locale eşleşmesi, canonical, hreflang, sitemap ve yapılandırılmış veriyi birlikte kontrol et; hreflang yalnızca gerçekten var olan eşdeğer sayfaya verilir.
- Arayüz locale'i ile OCR/dönüşüm motorunun belge dili desteğini ayır.
- PostHog olayını yalnızca izin politikası izin verirse gönder; reddetme, DNT/GPC ve dosya içeriği/adı gibi hassas verinin dışarıda kalmasını doğrula.
- Search Console düşük örneklemden genelleme yapma; gösterim, tıklama, konum ve kullanıcı/oturum ölçülerini ayır.
- Olay adı veya SEO rotası değişirse ilgili testi ve tek kaynak belgeyi (`SEO.md`, `POSTHOG.md`) güncelle.
- Search Console/PostHog verisine erişimin yoksa bunu belirt; kanıtsız trafik/sıralama iddiası yazma.

## Bulgu biçimi
**URL/olay adı/iddia**, **beklenen davranış (kaynak belge)**, **gözlenen davranış**, **etki**, **önem** (TEAM.md ölçeği), **kanıt**, **önerilen düzeltme**, **sahip rol**.
