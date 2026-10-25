# Sprint 5 — Use-case guides and factual trust content

**Status:** Completed (content and interface scope)  
**Scope:** S5-01–S5-09  
**Date:** 2026-10-24

## Completed

- Rebuilt the home guide showcase as one featured guide, two supporting guides and a compact scenario link list. The featured and support guides represent student, legal and finance workflows; the compact links surface visa, career and office scenarios. Group labels come from each guide’s real scenario group.
- Removed the category-tab/card-catalog pattern from the home guide showcase. Titles and descriptions are shown in full, and links have clear “Read guide / Rehberi oku” text.
- Preserved two-way navigation: guide pages include the relevant tool workspace and tool links; tool SEO pages list related use-case guides.
- Replaced repeated generic “security guarantee” cards with a numbered process explanation: file choice → upload and validation → worker processing/result → configured expiry or delete request. Added direct links to the security and privacy pages.
- Updated Turkish and English security/privacy pages to distinguish private temporary file storage from application metadata, API access closure from background physical cleanup, default retention from active configured retention, and product conversion from network/analytics/advertising providers.
- Verified current live domain HTML on 2026-10-24 contains the Cloudflare Insights beacon in addition to the AdSense loader. Updated copy to disclose Cloudflare Web Analytics, consent-gated PostHog EU and homepage AdSense as separate processing paths.
- Updated About pages to reflect the current 16-tool interface and removed “no ads”/instant physical deletion claims.
- Reworked tool SEO copy for unverified layout fidelity, OCR certainty, compression savings, third-party portal limits, PDF permission enforcement, watermark protection and password recovery/retention claims.
- Added a status-based claim register at `project-planning/UIUX-Sprint-5/CLAIM-REVIEW.md` and updated the authoritative UI flow/design-system docs.

## Validation

- `pnpm check`: passed; module boundary checks passed, Astro reported 0 errors/warnings/hints and Svelte reported 0 errors/warnings.
- `pnpm build`: passed; 104 static pages generated. Build emitted the existing large-chunk advisory (>500 kB) and a Node legacy-build advisory; neither failed the build.
- Browser review at 390 px: the Turkish home guide showcase rendered one featured guide, two supporting guides and three scenario links (7 links total); no old tab controls remained and document width was 375 px, so there was no horizontal overflow. Browser console had 0 errors/warnings.
- The initially running preview served stale markup; restarting the Astro dev server updated it to the current source before browser verification.
- `git diff --check`: passed; only line-ending conversion warnings were reported by Git for existing edited text files.
- Live-domain verification used a GET of `https://doctorconverter.com/tr/` and observed the Cloudflare Insights script; no analytics data was submitted.

## Boundaries and follow-up

- Source and local app behavior do not prove the production container/volume configuration, backup lifecycle or physical deletion latency; the claim register marks these as **needs proof**.
- Cloudflare beacon presence is verified, but account-side collection/retention details and jurisdiction-specific ad consent requirements need review before stronger statements or policy changes.
- No real user files, conversion outputs or personal data were used in this sprint.
