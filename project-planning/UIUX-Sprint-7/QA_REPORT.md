# Sprint 7 QA Report

Date: 2026-10-24. Scope: local frontend production preview, isolated local worker audit, and browser automation. No live deployment or production traffic was used.

## Evidence

- `pnpm check`: passed (import boundaries, server TypeScript, Astro/Svelte checks; 0 reported errors/warnings).
- `pnpm build` with local PostHog test configuration and a second clean default `pnpm build`: both passed; 105 static routes generated.
- `pnpm test:e2e`: **77 passed, 55 skipped, 0 failed** across desktop Chromium, mobile Chromium, Firefox, Safari WebKit, mobile Safari WebKit, and Windows Edge. Skips are project-specific exclusions (analytics is separately gated; file-selection smoke is Chromium-only; screenshot matrix is desktop Chromium-only; platform keyboard preferences are unavailable in WebKit).
- `pnpm audit:workflow`: all **16/16 tools** completed through the real browser → API → queue → worker → download/delete flow. For each tool, real worker completion, stranger denial, download, browser download, deletion acceptance, and access cutoff passed.
- Lifecycle checks: 5/6 passed, including two concurrent real jobs, queue cancellation/restart, expiry/physical purge, running-job cancellation, and SIGKILL/180-second lease recovery. The remaining timeout check is **invalidly configured**: it sets `ENGINE_TIMEOUT_MS` on a temporary worker, but the timeout is read by the API process; the API returned `ENGINE_UNAVAILABLE`. This result does not establish a product timeout defect. Re-run with the API configured at 1000 ms before using it as a gate.
- PostHog opt-in/privacy E2E: 7/7 passed in local Vite server; event properties checked against privacy allowlist.
- Responsive screenshots: 20 files at `.qa/uiux-sprint-7/screenshots/`; matrix covers homepage 320, 360, 390, 768, 1024, 1280, 1440, 1920 px and tool/guides/security 320, 390, 768, 1440 px. Screenshot outputs are local ignored QA artifacts.
- A visual comparison and difference image were generated against the closest prior catalog checkpoint: `.qa/uiux-sprint-7/screenshots/comparison-sprint3-sprint7-390.png` and `diff-reference-sprint3-sprint7-390.png`. Sprint 3 reference is 375 px wide and predates Sprint 4–6; it is a design-change illustration, **not** a pixel-regression baseline.

## Fixes found during QA

- A selected single-file workspace hid the dropzone and prevented replacing the file. The dropzone now remains available; focused Playwright coverage passed.
- PDF preview now lazy-loads PDF.js and serves its worker, CMaps, and standard fonts locally rather than requesting jsDelivr assets.
- Tool cards use their visible content for the accessible name rather than a manually truncated label.
- Quality workflow added for pull requests and pushes to `main`.

## Release gate

Local frontend gates and 16-tool user flows passed. The timeout assertion needs a corrected harness before it can be considered evidence. Physical iOS/Android devices, assistive-technology manual review, production deployment, and real-user baseline comparison were not performed in this local sprint, so this is not production release sign-off.
