# Sprint 6 — FAQ, footer, content and SEO

**Status:** Completed for source and static-site scope  
**Scope:** S6-01–S6-09  
**Date:** 2026-10-24

## Completed

- Expanded Turkish and English home FAQs to cover price, accepted formats, processing path/location, retention/deletion, large files, failures, and output fidelity. Removed unsupported absolute conversion claims.
- Implemented a single-open FAQ accordion with native buttons, `aria-expanded`, persistent `aria-controls` targets, keyboard activation, visible focus and distinct open state.
- Reduced the footer to four short groups: four product-selected tools, three guide links plus the guide hub, three security/legal links, and contact/about/email.
- Fixed broken footer/sidebar language routes and language-switch targets. Fixed broken internal links found on the English security page and Turkish About page.
- Replaced remaining stale tool copy about exact fidelity, TLS version, fixed retention, fixed per-job merge caps, and unqualified free claims. Updated home metadata and the brand tool count.
- Added a bilingual-path 404 page with explanatory H1, working Turkish/English home links and `noindex`.
- Added the shared editorial and SEO checklist in `docs/CONTENT-SEO-CHECKLIST.md`; updated UI flow/design docs and sprint plan status.

## Validation

- `pnpm check`: passed; module boundaries passed, server TypeScript passed, Astro reported 0 errors/warnings/hints across 54 files, and Svelte reported 0 errors/warnings.
- `pnpm build`: passed; 105 static pages generated. Existing build advisories remain: a minified chunk exceeds 500 kB and the runtime notes a legacy build recommendation.
- Static output audit: 87 indexable HTML pages had exactly one H1, title, description and canonical; zero internal links pointed to missing static targets; zero anchors lacked text or an accessible label.
- Sitemap: 87 URLs, all with generated output targets. `robots.txt` points to the sitemap; both Open Graph images exist.
- Preview browser: 390 px viewport had no horizontal overflow; seven FAQ entries were present. Keyboard Enter opened/closed a question and updated `aria-expanded`; answer visibility and focus were confirmed.
- Turkish and English footer links were checked in preview and resolved to valid generated routes. The generated 404 returned HTTP 404, a clear H1, and `noindex, nofollow`.

## Boundaries

- Astro generates static 404 behavior. Host-specific 5xx error pages and redirect/CDN rules must be reviewed in the deployment platform.
- Source/build checks do not confirm Google indexing or live production SEO signals.
