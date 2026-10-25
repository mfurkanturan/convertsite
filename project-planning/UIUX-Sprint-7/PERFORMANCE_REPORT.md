# Sprint 7 Performance Report

## Measurements

- Lighthouse mobile: Accessibility 100, Best Practices 96, SEO 100, Agentic Browsing 100. One console-error audit was triggered by HTTP 502 from the absent local API in the frontend-only preview; this is an environment limitation, not an API-backed production measurement.
- PDF.js was changed to lazy-load when a PDF thumbnail is requested. The app-shell client bundle moved from about 583 KB to about 164 KB in local build output; the approximately 420 KB PDF.js chunk and 1.23 MB worker are deferred and served locally. This reduces initial JavaScript while retaining preview functionality.
- PDF.js CMaps and standard fonts are copied from the installed dependency into ignored local public assets (~1.9 MB), avoiding runtime CDN dependency.
- Web Vitals (LCP/CLS/INP) and production RUM baselines were not measured. The local Lighthouse run is not a substitute for field data.

## Follow-up

Repeat Lighthouse with the API available, collect production field metrics after staged release, and compare p75 LCP/CLS/INP to the plan targets. Do not infer production performance from the bundle-size delta alone.
