import { test, expect, type Page } from '@playwright/test';

// Synthetic one-page PDF; no real document is used as a fixture.
function minimalPdf() {
  const content = 'BT /F1 18 Tf 72 720 Td (E2E fixture) Tj ET';
  const objects = [
    '<< /Type /Catalog /Pages 2 0 R >>',
    '<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
    '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>',
    '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>',
    `<< /Length ${Buffer.byteLength(content)} >>\nstream\n${content}\nendstream`,
  ];
  let pdf = '%PDF-1.4\n';
  const offsets = [0];
  for (let i = 0; i < objects.length; i++) {
    offsets.push(Buffer.byteLength(pdf));
    pdf += `${i + 1} 0 obj\n${objects[i]}\nendobj\n`;
  }
  const xref = Buffer.byteLength(pdf);
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  for (const offset of offsets.slice(1)) pdf += `${String(offset).padStart(10, '0')} 00000 n \n`;
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF\n`;
  return Buffer.from(pdf);
}

const pngFixture = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jg1sAAAAASUVORK5CYII=', 'base64');

async function openWorkspace(page: Page, tool: string) {
  await page.route('**/api/capabilities', route => route.fulfill({
    json: { enabledTools: [tool], maxFileBytes: 10485760, maxFiles: 20, maxTotalBytes: 41943040, maxTotalPages: 300, retentionMinutes: 60 },
  }));
  await page.goto(`/tr/#tool/${tool}`);
  await expect(page.locator('astro-island[component-url$="/app-shell.svelte"][ssr]')).toHaveCount(0);
}

const insideDialog = (page: Page) => page.evaluate(() => !!document.activeElement?.closest('[role="dialog"]'));

test.describe('Dosya önizleme penceresi', () => {
  test('odak pencereye taşınır, Tab pencerede kalır, Escape odağı tetikleyiciye geri verir', async ({ page }) => {
    await openWorkspace(page, 'images-to-pdf');
    await page.locator('input[type="file"]').setInputFiles({ name: 'resim-1.png', mimeType: 'image/png', buffer: pngFixture });

    const trigger = page.locator('button[aria-label$=": resim-1.png"]').first();
    await expect(trigger).toBeVisible();
    await trigger.focus();
    await trigger.click();

    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    await expect(dialog).toHaveAttribute('aria-labelledby', 'file-preview-title');
    await expect(dialog.getByRole('heading', { name: 'resim-1.png' })).toBeVisible();
    expect(await insideDialog(page)).toBe(true);

    for (let i = 0; i < 4; i++) {
      await page.keyboard.press('Tab');
      expect(await insideDialog(page), `Tab ${i + 1}`).toBe(true);
    }
    await page.keyboard.press('Shift+Tab');
    expect(await insideDialog(page)).toBe(true);

    await page.keyboard.press('Escape');
    await expect(dialog).toHaveCount(0);
    await expect(trigger).toBeFocused();
  });

  test('PDF önizlemesi kapat düğmesiyle kapanır ve dosya adı erişilebilir ad olarak kullanılır', async ({ page }) => {
    await openWorkspace(page, 'pdf-to-word');
    await page.locator('input[type="file"]').setInputFiles({ name: 'belge.pdf', mimeType: 'application/pdf', buffer: minimalPdf() });

    await page.locator('button[aria-label$=": belge.pdf"]').first().click();
    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    await dialog.getByRole('button').first().click();
    await expect(dialog).toHaveCount(0);
  });
});
