# Sprint 7 Accessibility Report

## Automated and keyboard checks

- Chromium + mobile Chromium Playwright flows cover skip link, keyboard search/combobox, FAQ keyboard interaction and answer announcement, reduced-motion preference, labels, and route/footer destinations.
- Lighthouse mobile accessibility score: **100/100** in the recorded local run.
- Cross-browser E2E completed with no failed tests (77 passed overall); the automated assertions passed in the applicable projects. See `QA_REPORT.md` for project-specific skip details.
- WebKit on Windows does not expose Safari's keyboard-navigation preference used by the skip-link focus assertion; that platform-specific assertion is skipped. The skip link remains covered in Chromium.

## Limits

Automated checks do not replace manual VoiceOver, NVDA, or TalkBack testing. No physical iOS/Android device or screen-reader session was available. Contrast was not fully audited with a dedicated manual WCAG review; do not treat the Lighthouse score as WCAG conformance certification.
