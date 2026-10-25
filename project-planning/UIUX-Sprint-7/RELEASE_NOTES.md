# Sprint 7 Release Notes (candidate)

## Included

- Responsive visual regression coverage and expanded browser automation.
- Accessibility checks for navigation, search, FAQ, reduced motion, and tool entry flows.
- Privacy-safe PostHog event coverage, respecting consent and Do Not Track.
- Lazy, local PDF.js assets to reduce initial JavaScript and avoid preview CDN requests.
- Single-file replacement flow fix.
- GitHub Actions quality gate for pull requests and `main` pushes.

## Rollout and rollback

This is a release candidate; no deployment has been made. Use the hosting provider's previous successful deployment/revision as the rollback target. Deploy to staging first, verify readiness and one synthetic conversion per supported tool, then promote gradually. Compare error rate, processing success, LCP/CLS/INP, and PostHog consented aggregates with the pre-release baseline. Revert to the prior revision if conversion errors rise, output regressions appear, or resource use exceeds existing limits. Confirm the rollback with a synthetic upload/download and cleanup check.

## Open release gates

Await final automated browser and real-worker audit results. Physical-device, assistive-technology, and production-baseline checks remain outside the local environment and must be completed before claiming those validations.
