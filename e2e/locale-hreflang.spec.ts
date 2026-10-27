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

// Compare generated HTML with the sitemap, including singleton, partial and five-language groups where present.
test('HTML and sitemap publish reciprocal existing equivalents with canonical URLs', async ({ page, request }, info) => {
  test.skip(info.project.name !== 'chromium', 'Route matrix runs once.');
  test.setTimeout(180_000);
  const xml = await (await request.get('/sitemap.xml')).text();
  const entries = await page.evaluate((text) => {
    const doc = new DOMParser().parseFromString(text, 'application/xml');
    return Array.from(doc.getElementsByTagName('url')).map(node => ({
      loc: node.getElementsByTagName('loc')[0].textContent!,
      links: Array.from(node.getElementsByTagNameNS('http://www.w3.org/1999/xhtml', 'link')).map(link => [link.getAttribute('hreflang'), link.getAttribute('href')]),
    }));
  }, xml);
  const byUrl = new Map(entries.map(entry => [entry.loc, Object.fromEntries(entry.links)]));
  const groups = [
    ...staticPairs,
    ...languages.flatMap(locale => scenarios[locale].map(item => scenarioAlternates(locale, item))),
  ];
  const sizes = groups.map(group => Object.values(group).filter(Boolean).length);
  expect(sizes).toContain(1);
  expect(sizes).toContain(5);
  const examples = [...new Set(sizes)].map(size => groups.find(group => Object.values(group).filter(Boolean).length === size));
  for (const group of examples) {
    const available = Object.entries(group!).filter(([, path]) => path) as [string, string][];
    const fallback = group!.en ?? group!.es ?? group!.tr;
    const expected = Object.fromEntries(available.length > 1 ? [...available.map(([lang, path]) => [lang, 'https://doctorconverter.com' + path]), ...(fallback ? [['x-default', 'https://doctorconverter.com' + fallback]] : [])] : []);
    for (const [, path] of available) {
      const url = 'https://doctorconverter.com' + path;
      expect(byUrl.get(url), path).toEqual(expected);
      expect((await page.goto(path))?.status(), path).toBe(200);
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', url);
      const actual = await page.locator('link[rel="alternate"][hreflang]').evaluateAll(nodes => Object.fromEntries(nodes.map(node => [node.getAttribute('hreflang'), node.getAttribute('href')])));
      expect(actual, path).toEqual(expected);
    }
  }
});
