import { test, expect, type Page } from '@playwright/test';
import { mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { toolSeoMap } from '../apps/web/src/lib/tool-seo';

const ids = Object.keys(toolSeoMap);
const widths = [320, 360, 390, 768, 1024, 1440, 1920];
const artifactDir = join(process.cwd(), '.qa', 'visual-quality', 'after');
async function ready(page: Page) {
  await expect(page.locator('astro-island[component-url$="/app-shell.svelte"][ssr]')).toHaveCount(0);
  await page.evaluate(() => document.fonts.ready);
}
async function policy(page: Page) {
  await page.addInitScript(() => localStorage.setItem('dc-analytics-consent-v1', 'rejected'));
  await page.route('**/api/capabilities', route => route.fulfill({ json: { enabledTools: ids, maxFileBytes: 10485760, maxFiles: 20, maxTotalBytes: 41943040, maxTotalPages: 300, retentionMinutes: 60 } }));
}
async function fits(page: Page) {
  expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth), page.url()).toBeLessThanOrEqual(0);
}

test('TR/EN home visual matrix: typography, container alignment, touch targets and all required widths', async ({ page }, info) => {
  test.skip(info.project.name !== 'chromium', 'Capture and full viewport matrix run once.');
  test.setTimeout(180_000);
  mkdirSync(artifactDir, { recursive: true });
  await policy(page);
  for (const locale of ['tr', 'en']) {
    for (const width of widths) {
      await page.setViewportSize({ width, height: 1000 });
      await page.goto(locale === 'tr' ? '/tr/' : '/');
      await ready(page);
      await fits(page);
      const cards = page.locator('#tools [data-tool-id]');
      await expect(cards).toHaveCount(16);
      expect(new Set(await cards.evaluateAll(nodes => nodes.map(node => node.getAttribute('data-tool-id')))).size).toBe(16);
      const sizes = await page.locator('.home-section-title').evaluateAll(nodes => nodes.map(node => parseFloat(getComputedStyle(node).fontSize)));
      expect(sizes.length).toBe(4);
      for (const size of sizes) expect(size).toBeGreaterThanOrEqual(24);
      const titleSize = await page.locator('.tool-card--compact .catalog-title').first().evaluate(node => parseFloat(getComputedStyle(node).fontSize));
      expect(titleSize).toBeGreaterThanOrEqual(15);
      const containers = await page.locator('header > .page-container, main.page-container, footer > .page-container').evaluateAll(nodes => nodes.map(node => {
        const r = node.getBoundingClientRect(); const c = getComputedStyle(node);
        return { left: r.left + parseFloat(c.paddingLeft), right: r.right - parseFloat(c.paddingRight) };
      }));
      expect(containers).toHaveLength(3);
      for (const item of containers) {
        expect(Math.abs(item.left - containers[0].left)).toBeLessThan(1);
        expect(Math.abs(item.right - containers[0].right)).toBeLessThan(1);
      }
      if (width <= 390) {
        const targets = await page.locator('footer nav a, #faq button, #hero-file-picker').evaluateAll(nodes => nodes.map(node => node.getBoundingClientRect().height));
        for (const height of targets) expect(height).toBeGreaterThanOrEqual(44);
      }
      const truncated = await page.locator('#tools [data-tool-id], #guides h3, #guides p').evaluateAll(nodes => nodes.filter(node => {
        const c = getComputedStyle(node); return c.textOverflow === 'ellipsis' || c.getPropertyValue('-webkit-line-clamp') !== 'none';
      }).length);
      expect(truncated).toBe(0);
      await page.screenshot({ path: join(artifactDir, `home-${locale}-${width}.png`), fullPage: true });
    }
  }
});

test('hero selection stays local, drag/focus states remain visible and all action labels wrap', async ({ page }) => {
  await policy(page);
  let uploads = 0;
  page.on('request', request => { if (request.method() === 'POST' && /\/api\//.test(request.url())) uploads++; });
  for (const locale of ['tr', 'en']) {
    await page.goto(locale === 'tr' ? '/tr/' : '/');
    await ready(page);
    await page.setViewportSize({ width: 360, height: 900 });
    const dropzone = page.locator('.file-dropzone');
    await dropzone.dispatchEvent('dragenter');
    await expect(dropzone).toHaveAttribute('data-dragging', 'true');
    await dropzone.dispatchEvent('dragleave');
    await expect(dropzone).toHaveAttribute('data-dragging', 'false');
    await page.locator('#hero-file-picker').focus();
    await expect(dropzone).toHaveCSS('border-top-color', 'rgb(37, 99, 235)');
    await page.locator('input[type="file"]').setInputFiles({ name: 'synthetic.pdf', mimeType: 'application/pdf', buffer: Buffer.from('%PDF-1.4\n%%EOF') });
    await expect(page.getByRole('status')).toContainText(locale === 'tr' ? 'Dosya seçildi' : 'File selected');
    expect(uploads).toBe(0);
    await expect(page.locator('#pdf-actions-title')).toBeFocused();
    const actualActions = page.locator('section[aria-labelledby="pdf-actions-title"] ul button');
    await expect(actualActions).toHaveCount(12);
    expect(await actualActions.evaluateAll(nodes => nodes.some(node => node.scrollWidth > node.clientWidth))).toBe(false);
    await fits(page);
    await actualActions.first().click();
    await expect(page).toHaveURL(/#tool\/pdf-to-word$/);
    await expect(page.locator('#workspace-title')).toBeVisible();
    expect(uploads).toBe(0);
  }
});

test('hero errors remain explicit for unsupported and oversized files', async ({ page }) => {
  await policy(page);
  await page.goto('/tr/');
  await ready(page);
  const input = page.locator('input[type=file]');
  await input.setInputFiles({ name: 'synthetic.exe', mimeType: 'application/octet-stream', buffer: Buffer.from('synthetic') });
  await expect(page.getByRole('alert')).toContainText('Bu dosya biçimi desteklenmiyor');
  await input.setInputFiles({ name: 'synthetic.pdf', mimeType: 'application/pdf', buffer: Buffer.alloc(10485761) });
  await expect(page.getByRole('alert')).toContainText('sınırını aşıyor');
  await expect(page.locator('#hero-file-picker')).toBeVisible();
});

test('all 16 catalog entries retain navigation and locale switching', async ({ page }, info) => {
  test.skip(!['chromium', 'mobile-chrome'].includes(info.project.name), 'Full catalog navigation runs on desktop/mobile Chromium.');
  test.setTimeout(120_000);
  await policy(page);
  for (const path of ['/tr/', '/']) {
    for (const id of ids) {
      await page.goto(path);
      await ready(page);
      await page.locator(`#tools [data-tool-id="${id}"]`).click();
      await expect(page).toHaveURL(new RegExp(`#tool/${id}$`));
      await expect(page.locator('#workspace-title')).toBeVisible();
    }
  }
  await page.goto('/tr/');
  await ready(page);
  await page.locator('header a[hreflang="en"]').click();
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await ready(page);
  await page.locator('header a[hreflang="tr"]').click();
  await expect(page.locator('html')).toHaveAttribute('lang', 'tr');
});

test('200 percent equivalent desktop reflow remains usable in both languages', async ({ browser }, info) => {
  test.skip(info.project.name !== 'chromium', 'Equivalent 1440 physical / 720 CSS pixel reflow is captured once.');
  const context = await browser.newContext({ baseURL: process.env.PLAYWRIGHT_BASE_URL || 'http://127.0.0.1:4321', viewport: { width: 720, height: 450 }, deviceScaleFactor: 2 });
  const page = await context.newPage();
  await policy(page);
  for (const locale of ['tr', 'en']) {
    await page.goto(locale === 'tr' ? '/tr/' : '/');
    await ready(page);
    await fits(page);
    await expect(page.locator('#hero-file-picker')).toBeVisible();
    await page.getByRole('group', { name: locale === 'tr' ? 'Araç kategorileri' : 'Tool categories' }).getByRole('button').last().click();
    await expect(page.locator('#tools [data-tool-id]')).toHaveCount(2);
    await page.screenshot({ path: join(artifactDir, `reflow-200-${locale}.png`), fullPage: true });
  }
  await context.close();
});
