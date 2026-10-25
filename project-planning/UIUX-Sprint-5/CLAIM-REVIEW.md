# Claim review — Sprint 5

**Reviewed:** 2026-10-24  
**Scope:** Homepage use-case showcase, shared file-processing/security copy, TR/EN security and privacy pages, tool SEO copy where it made security, quality, retention or provider claims.

## Status key

- **verified** — supported by application code, a current product document, or direct live-domain observation.
- **needs proof** — depends on production account/container/storage configuration or a test not available in source; do not present as a categorical guarantee.
- **remove** — contradicted by implementation, too absolute, or not supportable. The public wording is removed or replaced with a bounded statement.

## Claim register

| Claim / topic | Status | Evidence and action |
|---|---|---|
| The browser does not upload selected files until processing starts | verified | `live-job.svelte` uploads on `start()`; file picker only stages files. Public process flow says so. |
| File bytes are stored in private temporary storage; database/queue carry metadata and references | verified | `FILE-PROCESSING.md`, file/job modules and data model; privacy/security copy distinguishes content from metadata. |
| File/job access is tied to the signed anonymous session and owner checks | verified | `http-security.ts`, files/jobs routes; session cookie expires after 24 hours. |
| Retention is configurable, defaults to 60 minutes, and the API value appears in the tool panel | verified | `config.ts` accepts 5–1440 minutes, defaults to 60; capabilities response feeds `live-job.svelte`. Copy no longer hard-codes 60 as universal. |
| A delete request immediately closes application access; physical cleanup is asynchronous | verified | file deletion marks the item unavailable and sets cleanup grace; `FILE-PROCESSING.md` documents worker/cleanup behavior. Copy distinguishes access closure from physical removal. |
| Conversion content is not sent to an external conversion/AI API | verified | Local engine adapter and worker architecture; no remote conversion API is configured. Hosting, CDN, analytics and advertising traffic are separately disclosed. |
| PostHog product analytics loads only after consent; file names/content/password/job IDs are excluded | verified | `analytics-consent.svelte`, analytics policy and `POSTHOG.md`; privacy copy explains scope and limits. |
| Cloudflare Web Analytics is present on the live domain | verified | Direct HTML response from `https://doctorconverter.com/tr/` on 2026-10-24 contained Cloudflare Insights `beacon.min.js`; privacy/security pages disclose the edge-injected service. Detailed account-side collection/retention settings were not inspected. |
| Google AdSense can load on the home page and is independent of PostHog preference | verified | Live homepage response and `ad-slot.astro`; both privacy languages describe conditional ad loading and separate controls. |
| Production engine container has the documented network, filesystem and resource isolation | needs proof | `DEPLOYMENT.md` describes the validated local Docker setup and explicitly says public production deployment is not verified. Public copy avoids production sandbox certification claims. |
| Physical deletion always completes at an exact time across production storage/backups | needs proof | Application cleanup is scheduled, but provider lifecycle/backups and live production deletion latency have not been independently verified. Copy states asynchronous cleanup without a precise guarantee. |
| Cloudflare Web Analytics cookie/profile/retention details | needs proof | Live beacon presence is confirmed; current Cloudflare account settings and provider-specific retention were not audited. Copy points to Cloudflare/provider policies and does not assert cookie/profile behavior. |
| “Zero persistent storage”, “RAM only”, “no archive anywhere” | remove | Contradicted by private temporary disk/object storage and metadata persistence. Replaced with precise temporary-storage/database distinction. |
| “Files are physically deleted instantly/permanently”, “staff or any third party can never view them” | remove | Cannot be guaranteed by code; provider and operational access exist, and physical cleanup is asynchronous. Removed from privacy/security/about and tool pages. |
| “End-to-end TLS” or a specific 256-bit TLS claim | remove | HTTPS/TLS protects transport; it is not end-to-end encryption. Exact negotiated cipher was not established. Copy says HTTPS/TLS only where applicable. |
| PDF↔Office conversions are pixel-identical, error-free, perfect, or work equally for every document | remove | Contradicted by engine support and audit findings. Tool copy describes reconstruction and known variations; no global quality percentage is claimed. |
| OCR is instant/high-accuracy for any scan | remove | Accuracy depends on image quality/orientation; output is TXT or searchable text layer as documented. Replaced with bounded copy. |
| PDF encryption prevents copying/printing in every reader; forgotten password can be recovered or is never retained | remove | AES-256 output is supported, but reader permission enforcement varies. Password secret is protected and temporary for the job, not a recoverable credential. Copy now states this. |
| A watermark prevents unauthorized use/copying | remove | Watermark is a visual page mark, not access control. Public text says so. |
| Compression always yields a target size reduction or fixed percentage | remove | QPDF lossless optimization may not reduce a file and returns source if output grows. Percent/portal-target claims removed. |
| External portal limits (UYAP/VFS/job portal) are fixed values | remove | Limits change by provider and workflow. No hard-coded third-party quota is promised; guides tell users to check the current portal limit. |

## Follow-up before public rollout changes

- Verify production container/storage configuration and deletion latency before publishing stronger isolation or physical-erasure guarantees.
- Review Cloudflare account analytics settings and applicable ad/analytics consent requirements with the domain owner/legal reviewer; this implementation does not change ad consent behavior.
- Revisit external service limits when those services change; keep limits out of static claims unless sourced and dated.
