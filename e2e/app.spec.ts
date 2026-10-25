import { test, expect } from '@playwright/test';

const toolIds = [
  'pdf-to-word', 'word-to-pdf', 'merge-pdf', 'compress-pdf', 'pdf-to-excel', 'excel-to-pdf', 'pptx-to-pdf',
  'pdf-to-images', 'images-to-pdf', 'edit-pdf-pages', 'page-numbers', 'watermark-pdf', 'protect-pdf', 'unlock-pdf', 'ocr', 'pdf-to-pdf-ocr',
];

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

async function mockCapabilities(page: import('@playwright/test').Page) {
  await page.route('**/api/capabilities', route => route.fulfill({
    status: 200,
    contentType: 'application/json',
    body: JSON.stringify({ enabledTools: toolIds, maxFileBytes: 10485760, maxFiles: 20, maxTotalBytes: 41943040, maxTotalPages: 300, retentionMinutes: 60 }),
  }));
}

async function waitForAppHydration(page: import('@playwright/test').Page) {
  await expect(page.locator('astro-island[component-url$="/app-shell.svelte"][ssr]')).toHaveCount(0);
}

test.describe('DoctorConverter Arayüz & Navigasyon Doğrulamaları', () => {
  test.beforeEach(async ({ page }) => mockCapabilities(page));
  test('Ana sayfa yüklenmeli ve 16 araç kartı görünmeli', async ({ page }) => {
    await page.goto('/tr/');
    await expect(page).toHaveTitle(/DoctorConverter/);
    await expect(page.locator('#hero-title')).toBeVisible();

    const toolCards = page.locator('#tools button[data-tool-id]');
    await expect(toolCards).toHaveCount(16);
  });

  test('TR and EN guide composition stays content-sized and usable at desktop, tablet and mobile widths', async ({ page }) => {
    for (const locale of [{ path: '/tr/', steps: 'Rehber adımları', target: /\/tr\/kullanim\// }, { path: '/', steps: 'Guide steps', target: /\/use-cases\// }]) {
      for (const width of [1440, 1024, 768, 390]) {
        await page.setViewportSize({ width, height: 900 });
        await page.goto(locale.path);
        const featured = page.locator('#guides > div > a').first();
        await expect(featured).toBeVisible();
        const steps = featured.locator(`ol[aria-label="${locale.steps}"] li`);
        await expect(steps).toHaveCount(3);
        expect(await steps.first().locator('h4').evaluate(node => parseFloat(getComputedStyle(node).fontSize))).toBeGreaterThanOrEqual(15);
        expect(await steps.first().locator('p').evaluate(node => parseFloat(getComputedStyle(node).fontSize))).toBeGreaterThanOrEqual(14);
        await expect(featured.locator(':scope > div > span').last()).toBeVisible();
        await expect(featured).not.toHaveCSS('min-height', '300px');
        expect(await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)).toBeLessThanOrEqual(0);
        const sideCards = page.locator('#guides > div > div > a');
        await expect(sideCards).toHaveCount(2);
        const rects = await sideCards.evaluateAll(nodes => nodes.map(node => {
          const rect = node.getBoundingClientRect();
          return { top: rect.top, left: rect.left };
        }));
        expect(Math.abs(rects[0].top - rects[1].top) < 2).toBe(width > 640);
      }

      await page.setViewportSize({ width: 1440, height: 900 });
      await page.goto(locale.path);
      const featured = page.locator('#guides > div > a').first();
      await featured.focus();
      await expect(featured).toBeFocused();
      await page.keyboard.press('Enter');
      await expect(page).toHaveURL(locale.target);
    }
  });

  test('category grids keep equal-width left-aligned rows on desktop, tablet and mobile', async ({ page }) => {
    for (const path of ['/tr/', '/']) {
      await page.goto(path);
      await waitForAppHydration(page);
      for (const width of [1440, 1024, 768, 641, 390]) {
        await page.setViewportSize({ width, height: 900 });
        const groups = await page.locator('.tool-category-grid').evaluateAll(nodes => nodes.map(node => {
          const rect = node.getBoundingClientRect();
          return { count: Number((node as HTMLElement).dataset.count), left: rect.left,
            cards: Array.from(node.children).map(child => { const r = child.getBoundingClientRect(); return { left: r.left, top: Math.round(r.top), width: r.width }; }) };
        }));
        expect(groups.map(group => group.count)).toEqual([5, 3, 2, 2]);
        for (const group of groups) {
          const expectedColumns = width <= 640 ? 1 : width <= 1100 || group.count === 2 ? 2 : 3;
          const firstRow = group.cards.filter(card => card.top === group.cards[0].top);
          expect(firstRow).toHaveLength(expectedColumns);
          for (const card of group.cards) expect(Math.abs(card.width - group.cards[0].width)).toBeLessThanOrEqual(1);
          const rowStarts = group.cards.filter((card, index) => !index || card.top !== group.cards[index - 1].top);
          for (const start of rowStarts) expect(Math.abs(start.left - group.left)).toBeLessThanOrEqual(1);
        }
        expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(0);
      }
    }
  });

  test('TR and EN helper copy is concise while preserving upload and deletion facts', async ({ page }) => {
    for (const locale of [
      { path: '/tr/', hero: 'Tek dosya. Çoklu dosya için aracı aç.', guide: 'Yaygın belge işleri için araçlar.', security: 'Süre dolunca temizlenir. Silme erişimi hemen kapatır; temizlik en erken 2 dakika sonra yapılır.' },
      { path: '/', hero: 'One file. Open a tool to add more.', guide: 'Tools for common document tasks.', security: 'Files are cleaned up after expiry. Deletion closes access at once; cleanup starts after 2 minutes or more.' },
    ]) {
      await page.goto(locale.path);
      await expect(page.locator('#hero-drop-help')).toContainText(locale.hero);
      await expect(page.locator('#hero-drop-formats')).toBeVisible();
      await expect(page.locator('#tools').getByText(locale.guide, { exact: true })).toBeVisible();
      await expect(page.locator('#how ol li').nth(3)).toContainText(locale.security);
      expect((await page.locator('#how ol li').nth(3).innerText()).length).toBeLessThan(130);
    }
  });

  test('hero explains one-file selection and where to add files for multi-file tools', async ({ page }) => {
    await page.goto('/tr/');
    await expect(page.getByRole('region', { name: 'Dosyanı bırak, işlemine başla.' })).toContainText('işlemi başlat ve sonucu indir');
    await expect(page.getByRole('region', { name: 'Dosyanı buraya bırak' })).toContainText('Tek dosya. Çoklu dosya için aracı aç.');
    await page.goto('/tr/#tool/merge-pdf');
    await expect(page.locator('input[type="file"]')).toHaveAttribute('multiple', '');
  });

  test('small text and link color tokens meet WCAG AA contrast on their light surfaces', async ({ page }) => {
    await page.goto('/tr/');
    const ratios = await page.evaluate(() => {
      const style = getComputedStyle(document.documentElement);
      const rgb = (token: string) => style.getPropertyValue(token).trim().match(/[0-9a-f]{2}/gi)!.map((part) => parseInt(part, 16) / 255).map((channel) => channel <= .04045 ? channel / 12.92 : ((channel + .055) / 1.055) ** 2.4);
      const luminance = (token: string) => { const [r, g, b] = rgb(token); return .2126 * r + .7152 * g + .0722 * b; };
      const contrast = (foreground: string, background: string) => {
        const a = luminance(foreground); const b = luminance(background);
        return (Math.max(a, b) + .05) / (Math.min(a, b) + .05);
      };
      return [
        contrast('--color-text-soft', '--color-bg'),
        contrast('--color-text-muted', '--color-bg'),
        contrast('--color-accent', '--color-bg'),
        contrast('--color-accent-strong', '--color-surface'),
        ...['blue', 'purple', 'violet', 'teal', 'indigo'].map(color => contrast(`--color-tool-${color}`, '--color-bg')),
      ];
    });
    for (const ratio of ratios) expect(ratio).toBeGreaterThanOrEqual(4.5);
    expect(ratios[1]).toBeGreaterThanOrEqual(5.4);
    const metadataSize = await page.locator('.tool-card--compact .text-text-muted').first().evaluate((node) => parseFloat(getComputedStyle(node).fontSize));
    expect(metadataSize).toBeGreaterThanOrEqual(13);
  });

  test('Araç arama filtresi doğru çalışmalı', async ({ page }) => {
    await page.goto('/tr/');
    await waitForAppHydration(page);
    const searchInput = page.getByRole('combobox', { name: /Araç ara/ });
    await searchInput.fill('Excel');
    await searchInput.dispatchEvent('input');

    const toolCards = page.locator('#tools button[data-tool-id]');
    await expect(toolCards).toHaveCount(2);
  });

  test('Kategori filtreleme doğru çalışmalı', async ({ page }) => {
    await page.goto('/tr/');
    await waitForAppHydration(page);
    const convertBtn = page.getByRole('group', { name: 'Araç kategorileri' }).getByRole('button', { name: 'Dönüştür' });
    await convertBtn.click();
    await expect(convertBtn).toHaveAttribute('aria-pressed', 'true');

    const toolCards = page.locator('#tools button[data-tool-id]');
    await expect(toolCards).toHaveCount(7); // 7 convert aracı
  });

  test('Klavye kısayolu "/" aramaya odaklanmalı', async ({ page, isMobile }) => {
    test.skip(isMobile, 'Mobilde kbd "/" kısayolu gösterilmez');
    await page.goto('/tr/');
    await waitForAppHydration(page);
    // Sayfanın hydration'ı tamamlanıp event listener eklenene kadar bekle
    await page.locator('body').click();
    await page.keyboard.press('Slash');
    const searchInput = page.locator('.top-search input');
    await expect(searchInput).toBeFocused();
  });

  test('Yatay taşma (horizontal overflow) olmamalı (Mobil 320px)', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 700 });
    await page.goto('/tr/');
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow).toBeLessThanOrEqual(0);
  });

  test('skip link klavyeyle ana içeriğe eriştirir', async ({ page }) => {
    test.skip(/webkit/.test(test.info().project.name), 'Windows Playwright WebKit does not expose Safari keyboard-navigation preferences');
    await page.goto('/tr/');
    await page.keyboard.press('Tab');
    const skip = page.locator('a[href="#main-content"]').first();
    await expect(skip).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(page.locator('#main-content')).toBeInViewport();
  });

  test('search combobox etiketli ve menü klavyeyle kullanılabilir', async ({ page }) => {
    await page.goto('/tr/');
    await waitForAppHydration(page);
    const search = page.getByRole('combobox', { name: /Araç ara/ });
    await search.fill('excel');
    await expect(page.locator('#tools button[data-tool-id]')).toHaveCount(2);
    await search.press('Escape');
  });

  test('FAQ düğmesi klavyeyle açılır ve cevabı duyurur', async ({ page }) => {
    await page.goto('/tr/#faq');
    await waitForAppHydration(page);
    const faq = page.locator('#faq button[aria-controls]').first();
    await expect(faq).toBeVisible();
    await faq.focus();
    await page.keyboard.press('Enter');
    await expect(faq).toHaveAttribute('aria-expanded', 'true');
    const answerId = await faq.getAttribute('aria-controls');
    await expect(page.locator(`#${answerId}`)).toBeVisible();
  });

  test('rehber ve footer yerel, çalışan hedeflere bağlanır', async ({ page }) => {
    await page.goto('/tr/');
    await expect(page.locator('#guides')).toBeVisible();
    const links = await page.locator('footer a[href^="/"]').evaluateAll(nodes => nodes.map(node => (node as HTMLAnchorElement).href));
    expect(links.length).toBeGreaterThan(5);
    const origin = new URL(page.url()).origin;
    for (const href of links) expect(new URL(href).origin).toBe(origin);
  });

  test('reduced-motion tercihi etkileşimleri çalışmaz hale getirmez', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/tr/');
    await expect(page.locator('#tools button[data-tool-id]')).toHaveCount(16);
    expect(await page.evaluate(() => matchMedia('(prefers-reduced-motion: reduce)').matches)).toBe(true);
  });
});

test.describe('Docly Çalışma Alanı & Dosya Etkileşimi', () => {
  test.beforeEach(async ({ page }) => mockCapabilities(page));
  test('PDF birleştirme aracına gidilmeli ve dosya seçimi listelenmeli', async ({ page }) => {
    await page.goto('/tr/#tool/merge-pdf');
    await expect(page.locator('#workspace-title')).toHaveText('PDF birleştir');

    const file1 = {
      name: 'belge-1.pdf',
      mimeType: 'application/pdf',
      buffer: minimalPdf(),
    };
    const file2 = {
      name: 'belge-2.pdf',
      mimeType: 'application/pdf',
      buffer: minimalPdf(),
    };

    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles([file1, file2]);

    // Seçilen dosya satırları (başlık hariç her dosya için bir satır)
    const fileItems = page.locator('[role="group"][aria-label="Seçilen dosyalar"]');
    await expect(fileItems.getByText('belge-1.pdf', { exact: true })).toBeVisible();
    await expect(fileItems.getByText('belge-2.pdf', { exact: true })).toBeVisible();

    // Başlat butonu aktif olmalı
    const startButton = page.getByRole('button', { name: 'PDF’leri birleştir' });
    await expect(startButton).toBeEnabled({ timeout: 15000 });
  });

  test('Tek dosyalı araçta dosya değiştirilebilmeli', async ({ page }) => {
    await page.goto('/tr/#tool/pdf-to-word');
    await expect(page.locator('#workspace-title')).toHaveText('PDF → Word');

    const file1 = {
      name: 'ilk-belge.pdf',
      mimeType: 'application/pdf',
      buffer: minimalPdf(),
    };
    const file2 = {
      name: 'yeni-belge.pdf',
      mimeType: 'application/pdf',
      buffer: minimalPdf(),
    };

    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles([file1]);

    const fileItems = page.locator('[role="group"][aria-label="Seçilen dosyalar"]');
    await expect(fileItems.getByText('ilk-belge.pdf', { exact: true })).toBeVisible();

    // Yeni dosya seçildiğinde eskisinin yerini almalı
    await fileInput.setInputFiles([file2]);
    await expect(fileItems.getByText('yeni-belge.pdf', { exact: true })).toBeVisible();
    await expect(fileItems.getByText('ilk-belge.pdf', { exact: true })).toHaveCount(0);
  });

  test('Geçersiz sayfa aralığında hata uyarısı çıkmalı ve başlat butonu devre dışı kalmalı', async ({ page }) => {
    await page.goto('/tr/#tool/pdf-to-images');
    await waitForAppHydration(page);

    const file = {
      name: 'ornek.pdf',
      mimeType: 'application/pdf',
      buffer: minimalPdf(),
    };
    await page.locator('input[type="file"]').setInputFiles([file]);
    const startButton = page.getByRole('button', { name: 'Görselleri oluştur' });
    await expect(startButton).toBeEnabled();

    const pageRangeInput = page.locator('#page-range');
    await pageRangeInput.fill('gecersiz-aralik');

    await expect(page.locator('#page-range-error')).toBeVisible();
    await expect(startButton).toBeDisabled();

    // Düzeltildiğinde
    await pageRangeInput.fill('1-3, 5');
    await expect(page.locator('#page-range-error')).not.toBeVisible();
    await expect(startButton).toBeEnabled({ timeout: 15000 });
  });
});

test('16 araçta dosya seçme ve iş alanı açılma smoke testi', async ({ page }) => {
  test.skip(!['chromium', 'mobile-chrome'].includes(test.info().project.name), 'Dosya giriş matrisi Chromium projelerinde çalışır');
  await mockCapabilities(page);
  const extensionByTool: Record<string, string> = {
    'pdf-to-word': 'pdf', 'word-to-pdf': 'docx', 'merge-pdf': 'pdf', 'compress-pdf': 'pdf', 'pdf-to-excel': 'pdf',
    'excel-to-pdf': 'xlsx', 'pptx-to-pdf': 'pptx', 'pdf-to-images': 'pdf', 'images-to-pdf': 'png',
    'edit-pdf-pages': 'pdf', 'page-numbers': 'pdf', 'watermark-pdf': 'pdf', 'protect-pdf': 'pdf', 'unlock-pdf': 'pdf', 'ocr': 'png', 'pdf-to-pdf-ocr': 'pdf',
  };
  await page.goto('/tr/');
  await waitForAppHydration(page);
  for (const toolId of toolIds) {
    const card = page.locator(`#tools button[data-tool-id="${toolId}"]`);
    await card.click();
    await expect(page.locator('#workspace-title')).toBeVisible();
    const extension = extensionByTool[toolId];
    const input = page.locator('input[type="file"]');
    const buffer = extension === 'pdf' ? minimalPdf() : extension === 'png' ? pngFixture : Buffer.from('synthetic file fixture');
    await input.setInputFiles({ name: `fixture.${extension}`, mimeType: extension === 'pdf' ? 'application/pdf' : extension === 'png' ? 'image/png' : `application/${extension}`, buffer });
    if (toolId === 'edit-pdf-pages') {
      await expect(page.getByRole('region', { name: 'PDF Sayfa Düzenleyici' })).toContainText('1 Sayfa');
    } else {
      await expect(page.locator('[role="group"][aria-label="Seçilen dosyalar"]')
        .getByText(`fixture.${extension}`, { exact: true })).toBeVisible();
    }
    await page.goto('/tr/');
    await waitForAppHydration(page);
  }
});
