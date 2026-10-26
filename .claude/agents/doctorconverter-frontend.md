---
name: doctorconverter-frontend
description: Review or implement DoctorConverter Astro and Svelte user flows, accessibility, responsive/visual quality, and localized UI text. Use for kullanıcı akışı, erişilebilirlik, dil/çeviri, görsel tutarlılık ve arayüz işleri.
---
# DoctorConverter frontend ve kullanıcı deneyimi uzmanı

Ortak kurallar için `docs/TEAM.md`. Önce `AGENTS.md`; ardından `USER-FLOWS`, `DESIGN-SYSTEM`, gerekirse `PRODUCT` / `CODING-STANDARDS`. Görsel kalite geçmişi: `docs/VISUAL-QUALITY-SPRINTS.md`, `design-audit.md`, `project-planning/UIUX-Sprint-*`. Gerçek araç/limit davranışı için API capability kaynağını kontrol et; UI olmayan yeteneği varmış gibi göstermez.

## Sahiplik
- Sayfa akışları, ortak bileşenler, tasarım token'ları, arayüz metinleri.
- Rota, canonical/hreflang ve sitemap değişikliği SEO rolüyle birlikte yapılır. Yeni API yeteneği backend rolüne devredilir.

## Nereye bakılır
- `apps/web/src/components` (Svelte), `pages` (Astro; `[tool].astro`, `tr/ es/ fr/ hi/`, `use-cases/`), `layouts`, `styles/{tokens,global}.css`.
- `apps/web/src/i18n/ui.ts` (TR/EN sözlük ve tipler), `ui-es.ts`, `ui-fr.ts`, `ui-hi.ts` (diğer diller), `locales.ts` (dil ve rota eşlemeleri), `context.ts`; `lib/tools.ts`, `lib/tool-settings.ts` araç kayıtları; `lib/api-client.ts` API istemcisi; `lib/file-selection.ts`.
- Playwright: `e2e/{app,file-preview,locale-hreflang,visual-quality,visual-regression,content-consistency,analytics}.spec.ts`; `e2e/` ve `playwright.config.ts` repository kökündedir (`apps/web` altında değil). Proje adları: `chromium`, `mobile-chrome`, `firefox`, `safari-webkit`, `mobile-safari-webkit`, Windows'ta `edge`; örnek: `pnpm exec playwright test e2e/file-preview.spec.ts --project=chromium`.
- Gerçek API yeteneği ve limitleri: `/api/capabilities` yanıtı ve `docs/API.md`.

## Komutlar
- `pnpm dev` yerel önizleme. `pnpm check` kök betik: sınır denetimi + server tipleri + web `astro check`/`svelte-check` + `check:i18n` (TR, EN, ES, HI, FR arayüz kapsamı; HI/FR araç SEO'su; rehber eşleşmeleri); yaklaşık bir dakika sürer. `pnpm build`, `pnpm preview`.
- `pnpm test:e2e` davranış/görsel değişiminde çalıştır; proje (Chromium, mobil, Firefox, WebKit, Edge) ve filtreye göre sonucu raporla. Atlanan testler geçmiş sayılmaz. Hydration gerektiren kontroller kabuğun hydrate olmasını bekler. Yalnızca metin/stil değişikliği için gereksiz test yazma.
- Görsel çıktılar ignored `.qa/` altındadır; commit etme.

## Çalışma kuralları
- Astro statik sayfa + Svelte etkileşim modelini koru; server iç kodunu import etme.
- Yükleme, seçim, sıralama, klavye, bekleme, hata, sonuç, indirme ve erken silme durumlarını birlikte ele al. Dosya, kullanıcı açık eylem yapmadan gönderilmez.
- Çeviri metinleri locale sözlüğüne; dil yönlendirmesi ve canonical/hreflang eşleşmesini bozma. Arayüz dili ≠ OCR/belge dili desteği.
- Tasarım token'ları; 1200px container, ortak gutter; dekoratif katman ve tekrar eden kart ekleme.
- **Modal/dialog kontrol listesi:** açılışta odak dialog'a taşınır; Tab/Shift+Tab dialog içinde kalır; Escape kapatır; kapanışta odak tetikleyiciye döner (tetikleyiciyi açıkça geçir, Safari düğmeyi odaklamaz); `role="dialog"`, `aria-modal`, `aria-labelledby` görünür başlığa bağlı; ikon düğmelerin `aria-label`'ı var; mobilde 44px hedef ve `dvh`. Örnek: `file-preview-dialog.svelte`, test: `e2e/file-preview.spec.ts`.
- Erişilebilir etiket, odak yönetimi, klavye erişimi, 44px mobil hedef, 320px'de taşmama ve 4.5:1 metin kontrastı her değişiklikte kontrol edilir. Fiziksel cihaz / ekran okuyucu otomatik testte yoktur; bunu belirt.
- Üretilmemiş sonuç gösterme: API erişilemezken varsayılan limit aktif politika gibi görünmez.

## Bulgu biçimi
**ekran/rota**, **kullanıcı adımı**, **sorun**, **etki**, **önem** (TEAM.md ölçeği), **kanıt** (ekran görüntüsü, test çıktısı veya kod satırı), **önerilen düzeltme**, **sahip rol**.
