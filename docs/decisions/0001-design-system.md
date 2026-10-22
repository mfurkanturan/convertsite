# 0001 — Tasarım sistemi ve görsel yeniden kurgulama

Durum: Kabul edildi
Tarih: 2026-10-22

## Bağlam

Frontend (Astro + Svelte) elle yazılmış CSS ile kurulmuştu. Renk, aralık ve tipografi değerleri bileşenlerde sabit hex ve magic number olarak çoğaltılmıştı; `DESIGN-SYSTEM.md`'deki token'lar kodla çelişiyordu. `shell.css`, `workspace.css` ve `live-job.css` dosyalarının sonunda aynı seçicileri büyüten ikinci bir "Readable type scale" bloğu vardı. Marka adı ve nihai görsel kimlik açık karardı.

## Kararlar

1. **Stil altyapısı:** Tailwind CSS v4 + `@tailwindcss/vite`. Token'lar `@theme` içinde tek kaynak olarak tanımlanır; bileşenler utility sınıfları kullanır, sabit hex çoğaltılmaz. Bu, `TECH-STACK.md`'deki hedef ("Tailwind CSS + CSS değişkenleri") ile uyumludur.
2. **Token mimarisi:** `src/styles/tokens.css` tek doğru kaynak. Semantik renk (bg/surface/text/text-soft/text-muted/border/accent/success/warning/danger), 10 araç rengi (`--color-tool-*` + `-soft`), radius (`control/card/panel`) ve shadow ölçeği burada tutulur.
3. **Tipografi:** Self-host variable font. Gövde `Inter Variable`, başlıklar `Sora Variable`; her ikisi latin-ext destekli (Türkçe glif). `@fontsource-variable/*` paketlerinden içe aktarılır; ayrı harici font isteği yok. Açık tema dışında dark mode yok.
4. **Marka:** Marka adı (geçici "docly") ve logo açık karar olarak kalır. Ad, slogan ve üst veriler `src/lib/brand.ts` içinde tek noktada; wordmark `Logo.svelte` içinde. Ad değişince bu iki dosya güncellenir.
5. **Accent paleti:** `#2563eb` (accent) / `#1d4ed8` (accent-strong). `DESIGN-SYSTEM.md`'deki eski `#1d4ed8` accent önerisi güncellendi.
6. **Göç stratejisi:** Ekran ekran kademeli göç. Taşınan ekranın eski CSS dosyası silinir; arada çift kaynak bırakılmaz. Her adım `pnpm check && pnpm build` ile doğrulanır; görsel doğrulama sentetik UI durumlarıyla yapılır (motor çalıştırmaya gerek yok).

## Sonuç

Tek token kaynağı, marka-agnostik markalama ve tipografi ölçeği kuruldu. Eski CSS dosyaları Sprint 1-3'te ekranlar taşındıkça kaldırılır.

## Kabul

Uygulayan: tasarım kurgusu. Onay bekleyen ayrı karar yok.
