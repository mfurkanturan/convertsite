import { test, expect } from '@playwright/test';

test.describe('DoctorConverter Arayüz & Navigasyon Doğrulamaları', () => {
  test('Ana sayfa yüklenmeli, başlık ve 10 araç kartı görünmeli', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/DoctorConverter/);
    await expect(page.locator('#hero-title')).toBeVisible();

    const toolCards = page.locator('#tools button[aria-label$="aracını aç"]');
    await expect(toolCards).toHaveCount(10);
  });

  test('Araç arama filtresi doğru çalışmalı', async ({ page }) => {
    await page.goto('/');
    const searchInput = page.locator('input[aria-label="Araç ara"]');
    await searchInput.fill('Excel');
    await searchInput.dispatchEvent('input');

    const toolCards = page.locator('#tools button[aria-label$="aracını aç"]');
    await expect(toolCards).toHaveCount(2);
  });

  test('Kategori filtreleme doğru çalışmalı', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    const convertBtn = page.getByRole('group', { name: 'Araç kategorileri' }).getByRole('button', { name: 'Dönüştür' });
    await convertBtn.click();
    await expect(convertBtn).toHaveAttribute('aria-pressed', 'true');

    const toolCards = page.locator('#tools button[aria-label$="aracını aç"]');
    await expect(toolCards).toHaveCount(6); // 6 convert aracı
  });

  test('Klavye kısayolu "/" aramaya odaklanmalı', async ({ page, isMobile }) => {
    test.skip(isMobile, 'Mobilde kbd "/" kısayolu gösterilmez');
    await page.goto('/');
    // Sayfanın hydration'ı tamamlanıp event listener eklenene kadar bekle
    await page.waitForLoadState('networkidle');
    await page.locator('body').click();
    await page.keyboard.press('Slash');
    const searchInput = page.locator('.top-search input');
    await expect(searchInput).toBeFocused();
  });

  test('Yatay taşma (horizontal overflow) olmamalı (Mobil 320px)', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 700 });
    await page.goto('/');
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow).toBeLessThanOrEqual(0);
  });
});

test.describe('Docly Çalışma Alanı & Dosya Etkileşimi', () => {
  test('PDF birleştirme aracına gidilmeli ve dosya seçimi listelenmeli', async ({ page }) => {
    await page.goto('/#tool/merge-pdf');
    await expect(page.locator('#workspace-title')).toHaveText('PDF birleştir');

    const file1 = {
      name: 'belge-1.pdf',
      mimeType: 'application/pdf',
      buffer: Buffer.from('%PDF-1.4\n1 0 obj\n<<>>\nendobj\ntrailer\n<<>>\n%%EOF'),
    };
    const file2 = {
      name: 'belge-2.pdf',
      mimeType: 'application/pdf',
      buffer: Buffer.from('%PDF-1.4\n1 0 obj\n<<>>\nendobj\ntrailer\n<<>>\n%%EOF'),
    };

    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles([file1, file2]);

    // Seçilen dosya satırları (başlık hariç her dosya için bir satır)
    const fileItems = page.locator('[role="group"][aria-label="Seçilen dosyalar"] .min-w-0 strong');
    await expect(fileItems).toHaveCount(2);
    await expect(fileItems.nth(0)).toHaveText('belge-1.pdf');
    await expect(fileItems.nth(1)).toHaveText('belge-2.pdf');

    // Başlat butonu aktif olmalı
    const startButton = page.getByRole('button', { name: 'PDF’leri birleştir' });
    await expect(startButton).toBeEnabled();
  });

  test('Tek dosyalı araçta dosya değiştirilebilmeli', async ({ page }) => {
    await page.goto('/#tool/pdf-to-word');
    await expect(page.locator('#workspace-title')).toHaveText('PDF → Word');

    const file1 = {
      name: 'ilk-belge.pdf',
      mimeType: 'application/pdf',
      buffer: Buffer.from('%PDF-1.4\n%%EOF'),
    };
    const file2 = {
      name: 'yeni-belge.pdf',
      mimeType: 'application/pdf',
      buffer: Buffer.from('%PDF-1.4\n%%EOF'),
    };

    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles([file1]);

    const fileItems = page.locator('[role="group"][aria-label="Seçilen dosyalar"] .min-w-0 strong');
    await expect(fileItems).toHaveCount(1);
    await expect(fileItems.first()).toHaveText('ilk-belge.pdf');

    // Yeni dosya seçildiğinde eskisinin yerini almalı
    await fileInput.setInputFiles([file2]);
    await expect(fileItems).toHaveCount(1);
    await expect(fileItems.first()).toHaveText('yeni-belge.pdf');
  });

  test('Geçersiz sayfa aralığında hata uyarısı çıkmalı ve başlat butonu devre dışı kalmalı', async ({ page }) => {
    await page.goto('/#tool/pdf-to-images');

    const file = {
      name: 'ornek.pdf',
      mimeType: 'application/pdf',
      buffer: Buffer.from('%PDF-1.4\n%%EOF'),
    };
    await page.locator('input[type="file"]').setInputFiles([file]);

    const pageRangeInput = page.locator('#page-range');
    await pageRangeInput.fill('gecersiz-aralik');

    await expect(page.locator('#page-range-error')).toBeVisible();
    const startButton = page.getByRole('button', { name: 'Dönüştürmeyi başlat' });
    await expect(startButton).toBeDisabled();

    // Düzeltildiğinde
    await pageRangeInput.fill('1-3, 5');
    await expect(page.locator('#page-range-error')).not.toBeVisible();
    await expect(startButton).toBeEnabled();
  });
});
