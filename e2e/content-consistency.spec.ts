import { test, expect, type Page } from '@playwright/test';
import { toolSeoMap } from '../apps/web/src/lib/tool-seo';
import { toolSeoMapEn } from '../apps/web/src/lib/tool-seo-en';
import { scenarios, scenarioPath, scenarioAlternates } from '../apps/web/src/lib/seo/scenarios';
import { staticPairs } from '../apps/web/src/i18n/locales';

const ids = Object.keys(toolSeoMap);
const withSettings = new Set(['excel-to-pdf', 'pdf-to-images', 'images-to-pdf', 'edit-pdf-pages', 'page-numbers', 'watermark-pdf', 'protect-pdf', 'unlock-pdf', 'ocr', 'pdf-to-pdf-ocr']);
const policy = { enabledTools: ids, maxFileBytes: 5242880, maxFiles: 12, maxTotalBytes: 20971520, maxTotalPages: 120, retentionMinutes: 17 };
async function mockPolicy(page: Page) {
  await page.route('**/api/capabilities', route => route.fulfill({ json: policy }));
}
async function hydrated(page: Page) {
  await expect(page.locator('astro-island[component-url$="/app-shell.svelte"][ssr]')).toHaveCount(0);
}
async function noOverflow(page: Page) {
  expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(0);
}

for (const locale of ['tr', 'en'] as const) {
  test(`${locale}: all 16 tools retain responsive controls and matching visible SEO content`, async ({ page }, info) => {
    test.skip(info.project.name !== 'chromium', 'Full route/width matrix runs once; browser interaction tests run separately.');
    test.setTimeout(180_000);
    await mockPolicy(page);
    for (const id of ids) {
      const data = (locale === 'tr' ? toolSeoMap : toolSeoMapEn)[id as keyof typeof toolSeoMap];
      await page.goto(`${locale === 'tr' ? '/tr' : ''}/${id}`);
      await hydrated(page);
      await expect(page.locator('h1')).toHaveCount(1);
      await expect(page.locator('h1')).toHaveText(data.h1);
      await expect(page.locator('aside[aria-labelledby="settings-title"]')).toHaveCount(withSettings.has(id) ? 1 : 0);
      await expect(page.locator('[aria-label="' + (locale === 'tr' ? 'Sınırlar' : 'Limits') + '"]')).toContainText(locale === 'tr' ? '17 dakika' : '17 minutes');
      await expect(page.locator('#how, #faq')).toHaveCount(0);
      const faq = page.locator('.editorial-faq').first();
      await faq.locator('summary').focus();
      await page.keyboard.press('Enter');
      await expect(faq).toHaveAttribute('open', '');
      await expect(faq.locator('p')).toHaveText(data.faqs[0].answer);
      const graph = JSON.parse(await page.locator('script[type="application/ld+json"]').innerText());
      const faqSchema = graph['@graph'].find((node: { '@type': string }) => node['@type'] === 'FAQPage');
      expect(faqSchema.mainEntity.map((item: { name: string }) => item.name)).toEqual(data.faqs.map(item => item.question));
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', `https://doctorconverter.com${locale === 'tr' ? '/tr' : ''}/${id}`);
      for (const width of [320, 390, 768, 1440]) {
        await page.setViewportSize({ width, height: 900 });
        await noOverflow(page);
        await expect(page.locator('#tool-file-picker')).toBeVisible();
      }
    }
  });
}

test('all guide and static routes preserve one heading, readable structure and localized metadata', async ({ page }, info) => {
  test.skip(info.project.name !== 'chromium', 'Static route audit runs once.');
  test.setTimeout(180_000);
  await mockPolicy(page);
  for (const locale of ['tr', 'en'] as const) {
    const guidePaths = scenarios[locale].map(item => scenarioPath(locale, item.slug));
    const paths = [...staticPairs.map(pair => pair[locale]!), ...guidePaths];
    for (const path of paths) {
      const response = await page.goto(path);
      expect(response?.status(), path).toBe(200);
      await expect(page.locator('h1')).toHaveCount(1);
      await expect(page.locator('html')).toHaveAttribute('lang', locale);
      await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', /.+/);
      const scenario = scenarios[locale].find(item => scenarioPath(locale, item.slug) === path);
      const alternates = scenario ? scenarioAlternates(locale, scenario) : staticPairs.find(pair => pair[locale] === path)!;
      for (const language of ['tr', 'en'] as const) {
        const alternate = page.locator(`link[rel="alternate"][hreflang="${language}"]`);
        await expect(alternate).toHaveCount(alternates[language] ? 1 : 0);
        if (alternates[language]) await expect(alternate).toHaveAttribute('href', `https://doctorconverter.com${alternates[language]}`);
      }
      if (guidePaths.includes(path)) {
        const headings = await page.locator('article > section > h2').allTextContents();
        expect(headings.slice(0, 2)).toEqual(locale === 'tr' ? ['Kullanım adımları', 'Sonucu kontrol et'] : ['Steps', 'Check the result']);
        await expect(page.locator('article')).not.toContainText(locale === 'tr' ? 'Bu sayfa şu aramalar için hazırlandı' : 'This page was built for');
      }
      for (const width of [320, 390, 768, 1440]) {
        await page.setViewportSize({ width, height: 900 });
        await noOverflow(page);
      }
    }
  }
});

test('unreachable API never presents fallback limits as active policy and retries with live values', async ({ page }) => {
  let reachable = false;
  await page.route('**/api/capabilities', route => reachable ? route.fulfill({ json: policy }) : route.fulfill({ status: 503, json: {} }));
  await page.goto('/pdf-to-word');
  await expect(page.getByRole('alert')).toContainText('No files were sent');
  await expect(page.getByRole('list', { name: 'Limits' })).toHaveCount(0);
  await expect(page.locator('button.job-start')).toHaveCount(0);
  reachable = true;
  await page.getByRole('button', { name: 'Check connection' }).click();
  await expect(page.getByRole('list', { name: 'Limits' })).toContainText('17 minutes');
  await expect(page.getByRole('list', { name: 'Limits' })).toContainText('Up to 1 file');
  await expect(page.getByRole('button', { name: 'Convert to Word', exact: true })).toBeDisabled();
});

test('tool settings explain the selected output in Turkish and English', async ({ page }) => {
  for (const locale of ['tr', 'en'] as const) {
    await page.goto(`${locale === 'tr' ? '/tr' : ''}/pdf-to-images`);
    await hydrated(page);
    await expect(page.locator('#setting-help-format')).toContainText(locale === 'tr' ? 'Fotoğraf ve küçük dosyalar' : 'For photos and smaller files');
    await page.locator('#format').selectOption('png');
    await expect(page.locator('#setting-help-format')).toContainText(locale === 'tr' ? 'Metin ve keskin kenarlar' : 'For text and sharp edges');
    await page.locator('#dpi').selectOption('150');
    await expect(page.locator('#setting-help-dpi')).toContainText(locale === 'tr' ? 'Daha fazla ayrıntı' : 'More detail');
  }
});

test('ad placement preview is confined to the home page, and legal navigation targets real sections', async ({ page }) => {
  await page.goto('/tr/');
  await expect(page.locator('aside[data-ad-placement="home-after-tools"]')).toHaveCount(1);
  await expect(page.locator('aside[data-ad-placement="home-after-tools"]')).toHaveAttribute('aria-label', 'Reklam alanı önizlemesi');
  await page.goto('/tr/pdf-to-word');
  await expect(page.locator('aside[data-ad-placement]')).toHaveCount(0);

  for (const [path, navLabel] of [['/tr/gizlilik', 'Sayfa bölümleri'], ['/tr/kullanim-sartlari', 'Sayfa bölümleri'], ['/privacy', 'On this page'], ['/terms', 'On this page']] as const) {
    await page.goto(path);
    const nav = page.getByRole('navigation', { name: navLabel });
    await expect(nav).toBeVisible();
    const links = await nav.locator('a').evaluateAll(nodes => nodes.map(node => node.getAttribute('href')));
    for (const href of links) await expect(page.locator(href!)).toBeAttached();
  }

  for (const path of ['/tr/guvenlik', '/security']) {
    await page.goto(path);
    await expect(page.locator('.processing-rail li')).toHaveCount(4);
  }
});

test('job UI retains explicit start, queue, processing, result and deletion states', async ({ page }) => {
  let uploaded = 0;
  let read = 0;
  let releaseQueue = false;
  let releaseProcessing = false;
  let deleted = false;
  const job = { id: '22222222-2222-4222-8222-222222222222', tool: 'pdf-to-word', state: 'queued', resultAvailable: false, expiresAt: '2099-01-01T00:00:00Z', createdAt: '2026-10-25T00:00:00Z' };
  await page.route('**/api/**', async route => {
    const path = new URL(route.request().url()).pathname;
    if (path.endsWith('/capabilities')) return route.fulfill({ json: policy });
    if (path.endsWith('/files')) {
      uploaded++;
      return route.fulfill({ status: 201, json: { id: '11111111-1111-4111-8111-111111111111', pages: 1, size: 20, kind: 'pdf', expiresAt: job.expiresAt } });
    }
    if (route.request().method() === 'DELETE') { deleted = true; return route.fulfill({ status: 202, json: { status: 'deleted' } }); }
    if (route.request().method() === 'POST') return route.fulfill({ status: 202, json: job });
    read++;
    const state = !releaseQueue ? 'queued' : !releaseProcessing ? 'running' : 'succeeded';
    return route.fulfill({ json: { ...job, state, resultAvailable: state === 'succeeded', resultKind: 'docx', resultSize: 1234 } });
  });
  await page.goto('/tr/pdf-to-word');
  await hydrated(page);
  await page.locator('input[type="file"]').setInputFiles({ name: 'synthetic.pdf', mimeType: 'application/pdf', buffer: Buffer.from('%PDF-1.4\n%%EOF') });
  expect(uploaded).toBe(0);
  await page.getByRole('button', { name: 'Word’e dönüştür', exact: true }).click();
  await expect(page.getByRole('status')).toContainText('İşlemin kuyrukta');
  expect(uploaded).toBe(1);
  expect(read).toBeGreaterThan(0);
  releaseQueue = true;
  await expect(page.getByRole('status')).toContainText('Belgen işleniyor');
  releaseProcessing = true;
  await expect(page.getByRole('heading', { name: 'Dosyan hazır.' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Sonucu indir' })).toHaveAttribute('href', /\/download$/);
  await expect(page.getByText('Çıktı dosyası: doctorconverter-pdf-to-word.docx', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Dosyaları sil', exact: true }).click();
  expect(deleted).toBe(true);
  await expect(page.getByRole('link', { name: 'Sonucu indir' })).toHaveCount(0);
  await expect(page.locator('[role="status"]')).toContainText('erişim');
});

for (const state of ['failed', 'cancelled', 'expired'] as const) {
  test(`restored job shows ${state} without requesting another upload`, async ({ page }) => {
    const id = '22222222-2222-4222-8222-222222222222';
    await page.addInitScript(id => sessionStorage.setItem('docly.job.pdf-to-word', id), id);
    await mockPolicy(page);
    await page.route(`**/api/jobs/${id}`, route => route.fulfill({ json: { id, tool: 'pdf-to-word', state: state === 'expired' ? 'succeeded' : state, resultAvailable: false, error: 'NO_TEXT', createdAt: '2026-10-25T00:00:00Z', expiresAt: '2026-10-25T00:01:00Z' } }));
    await page.goto('/pdf-to-word');
    const heading = state === 'failed' ? 'The job could not be completed.' : state === 'cancelled' ? 'Job cancelled.' : 'Your result has expired.';
    await expect(page.getByRole('heading', { name: heading, exact: true })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Download result' })).toHaveCount(0);
  });
}
