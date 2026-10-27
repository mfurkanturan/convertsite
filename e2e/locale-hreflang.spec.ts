import { test, expect } from '@playwright/test';
import { scenarios, scenarioPath, scenarioAlternates } from '../apps/web/src/lib/seo/scenarios';
import { staticPairs } from '../apps/web/src/i18n/locales';

const languages = ['tr', 'en', 'es', 'fr', 'hi'] as const;

// hreflang must only point at equivalents that really exist; content-consistency.spec.ts covers TR/EN only.
for (const locale of ['es', 'fr', 'hi'] as const) {
  test(`${locale}: guide and static pages publish hreflang only for existing equivalents`, async ({ page }, info) => {
    test.skip(info.project.name !== 'chromium', 'Route matrix runs once.');
    test.setTimeout(180_000);

    const guidePaths = scenarios[locale].map(item => ({ path: scenarioPath(locale, item.slug), scenario: item }));
    const pages = [
      ...staticPairs.filter(pair => pair[locale]).map(pair => ({ path: pair[locale]!, alternates: pair as Record<string, string | undefined> })),
      ...guidePaths.map(({ path, scenario }) => ({ path, alternates: scenarioAlternates(locale, scenario) as Record<string, string | undefined> })),
    ];

    for (const { path, alternates } of pages) {
      const response = await page.goto(path);
      expect(response?.status(), path).toBe(200);
      await expect(page.locator('html')).toHaveAttribute('lang', locale);
      for (const language of languages) {
        const link = page.locator(`link[rel="alternate"][hreflang="${language}"]`);
        const expected = alternates[language];
        // A page with a single language version publishes no alternates at all.
        const published = Object.values(alternates).filter(Boolean).length > 1;
        await expect(link, `${path} ${language}`).toHaveCount(expected && published ? 1 : 0);
        if (expected && published) await expect(link).toHaveAttribute('href', `https://doctorconverter.com${expected}`);
      }
    }
  });
}
