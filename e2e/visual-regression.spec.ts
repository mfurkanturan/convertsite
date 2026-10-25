import { test, expect } from '@playwright/test';
import { mkdirSync } from 'node:fs';
import { join } from 'node:path';

const widths = [320, 360, 390, 768, 1024, 1280, 1440, 1920];
const screenshots = join(process.cwd(), '.qa', 'uiux-sprint-8', 'screenshots');

test('responsive screenshots and horizontal overflow matrix', async ({ page }) => {
  test.setTimeout(180_000);
  test.skip(test.info().project.name !== 'chromium', 'Visual artifact set is captured once in desktop Chromium');
  mkdirSync(screenshots, { recursive: true });
  for (const width of widths) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/tr/', { waitUntil: 'domcontentloaded' });
    await page.evaluate(() => document.fonts.ready);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow, `homepage horizontal overflow at ${width}px`).toBeLessThanOrEqual(0);
    await page.screenshot({ path: join(screenshots, `home-${width}.png`), fullPage: true });
  }

  const routeWidths = [320, 390, 768, 1440];
  const routes = [
    ['tool-pdf-to-word', '/tr/pdf-to-word'],
    ['guides', '/tr/kullanim/'],
    ['security', '/tr/guvenlik/'],
  ] as const;
  for (const [name, route] of routes) {
    for (const width of routeWidths) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(route, { waitUntil: 'domcontentloaded' });
      await page.evaluate(() => document.fonts.ready);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      expect(overflow, `${name} horizontal overflow at ${width}px`).toBeLessThanOrEqual(0);
      await page.screenshot({ path: join(screenshots, `${name}-${width}.png`), fullPage: true });
    }
  }
});
