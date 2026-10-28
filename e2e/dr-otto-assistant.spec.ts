import { test, expect } from '@playwright/test';

const ids = ['pdf-to-word', 'word-to-pdf', 'merge-pdf', 'compress-pdf', 'ocr', 'pdf-to-md', 'edit-pdf-pages'];

test.beforeEach(async ({ page }) => {
  await page.route('**/api/capabilities', route => route.fulfill({ json: { enabledTools: ['word-to-pdf'], maxFileBytes: 10000000, maxFiles: 20, maxTotalBytes: 40000000, maxTotalPages: 300, retentionMinutes: 60 } }));
});

test('assistant opens, describes unavailable tools and restores focus', async ({ page }) => {
  await page.goto('/tr/');
  await expect(page.locator('astro-island[component-url*="dr-otto-assistant"][ssr]')).toHaveCount(0);
  const launcher = page.getByRole('button', { name: 'Dr. Otto yardımcısını aç' });
  await launcher.focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('#dr-otto-panel')).toBeVisible();
  await page.getByRole('button', { name: 'Doğru aracı bul' }).click();
  await expect(page.locator('.otto-list a')).toHaveCount(7);
  await expect(page.locator('.otto-list a').first()).toContainText('Şu anda kullanılamıyor');
  await expect(page.locator('.otto-list a').nth(1)).not.toContainText('Şu anda kullanılamıyor');
  await page.keyboard.press('Escape');
  await expect(page.locator('#dr-otto-panel')).toHaveCount(0);
  await expect(launcher).toBeFocused();
});

test('tool finder retains locale and mobile panel fits', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 800 });
  for (const locale of ['tr', 'es', 'fr', 'hi']) {
    await page.goto(`/${locale}/`);
    await expect(page.locator('astro-island[component-url*="dr-otto-assistant"][ssr]')).toHaveCount(0);
    await page.locator('.otto-launcher').click();
    await page.locator('.otto-actions button').first().click();
    const links = page.locator('.otto-list a');
    await expect(links).toHaveCount(ids.length);
    for (let i = 0; i < ids.length; i++) await expect(links.nth(i)).toHaveAttribute('href', `/${locale}/${ids[i]}`);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    const box = await page.locator('#dr-otto-panel').boundingBox();
    expect(box && box.x >= 0 && box.x + box.width <= 320).toBe(true);
  }
});

test('assistant yields to the mobile menu', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/tr/');
  await expect(page.locator('astro-island[component-url*="dr-otto-assistant"][ssr]')).toHaveCount(0);
  await page.locator('.otto-launcher').click();
  await page.locator('button[aria-controls="main-sidebar"]').click();
  await expect(page.locator('#main-sidebar')).toBeVisible();
  await expect(page.locator('.otto-assistant')).toHaveCount(0);
  await page.keyboard.press('Escape');
  await expect(page.locator('.otto-launcher')).toBeVisible();
});

test('assistant yields to a real file preview dialog', async ({ page }) => {
  await page.goto('/tr/#tool/images-to-pdf');
  await expect(page.locator('astro-island[component-url$="/app-shell.svelte"][ssr]')).toHaveCount(0);
  await expect(page.locator('astro-island[component-url*="dr-otto-assistant"][ssr]')).toHaveCount(0);
  const image = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jg1sAAAAASUVORK5CYII=', 'base64');
  await page.locator('input[type="file"]').setInputFiles({ name: 'test.png', mimeType: 'image/png', buffer: image });
  await page.locator('button[aria-label$=": test.png"]').first().click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await expect(page.locator('.otto-assistant')).toHaveCount(0);
  await page.keyboard.press('Escape');
  await expect(page.locator('.otto-launcher')).toBeVisible();
});
