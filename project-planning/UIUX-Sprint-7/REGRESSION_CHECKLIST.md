# Sprint 7 Regression Checklist

- [x] Homepage tool catalog, search, categories, and keyboard shortcut.
- [x] 320 px horizontal-overflow check.
- [x] Skip link and accessible search/FAQ keyboard flows in Chromium.
- [x] Local guide/footer destinations and reduced-motion behavior.
- [x] File selection and replacement in single-file tool flow.
- [x] File-selection smoke coverage for all 16 tool workspaces.
- [x] Responsive screenshot captures at the widths listed in `QA_REPORT.md`.
- [x] Sprint 3-to-7 visual comparison and difference artifact generated (illustrative only; not a matched regression baseline).
- [x] Full desktop/mobile/browser suite: 77 passed, 55 intentionally skipped, 0 failed.
- [x] Real-worker browser/API/queue/worker/download/delete flow for all 16 tools passed; 5/6 lifecycle checks passed.
- [ ] Correct and rerun timeout harness: `ENGINE_TIMEOUT_MS` must be set on API (current test only sets it on worker).
- [x] Clean default `pnpm build` without local PostHog testing flag.
- [ ] Manual iOS Safari/Android Chrome and screen-reader pass.
- [ ] Staged deployment and real-user baseline comparison (not performed).
