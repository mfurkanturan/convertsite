import { test, expect, type Page } from '@playwright/test';

test.skip(process.env.POSTHOG_E2E !== '1', 'Use the dedicated PUBLIC_POSTHOG_LOCAL=true development server.');

async function intercept(page: Page) {
  const events: { event: string; properties: Record<string, unknown> }[] = [];
  const requests: string[] = [];
  const module = { url: '' };
  page.on('request', request => { if (new URL(request.url()).pathname === '/src/lib/analytics.ts') module.url = request.url(); });
  await page.route(/https:\/\/[^/]*posthog\.com\//, async route => {
    const request = route.request();
    requests.push(request.url());
    const body = request.postData();
    if (body) {
      let payload;
      try { payload = JSON.parse(body); }
      catch {
        const data = new URLSearchParams(body).get('data');
        if (data) payload = JSON.parse(Buffer.from(data, 'base64').toString());
      }
      for (const event of Array.isArray(payload) ? payload : payload?.batch ?? [payload]) {
        if (event?.event) events.push(event);
      }
    }
    await route.fulfill({ status: 200, contentType: 'application/json', body: '{"status":1}' });
  });
  return { events, requests, module };
}

test('no PostHog requests before consent or after declining/reloading', async ({ page }) => {
  const capture = await intercept(page);
  await page.goto('/tr/pdf-to-word?password=PRIVATE_SENTINEL#PRIVATE_SENTINEL', { waitUntil: 'domcontentloaded' });
  await expect(page.getByRole('button', { name: 'Kabul et', exact: true })).toBeVisible();
  expect(capture.requests).toHaveLength(0);
  await page.getByRole('button', { name: 'Reddet', exact: true }).click();
  await page.reload();
  await expect(page.getByRole('button', { name: 'Çerez tercihleri', exact: true })).toBeVisible();
  expect(capture.requests).toHaveLength(0);
});

test('navigation and file-selection events contain only allowlisted, non-sensitive properties', async ({ page }) => {
  const capture = await intercept(page);
  await page.route('**/api/capabilities', route => route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({
    enabledTools: ['pdf-to-word', 'word-to-pdf', 'merge-pdf', 'compress-pdf', 'pdf-to-excel', 'excel-to-pdf', 'pptx-to-pdf', 'pdf-to-images', 'images-to-pdf', 'edit-pdf-pages', 'page-numbers', 'watermark-pdf', 'protect-pdf', 'unlock-pdf', 'ocr', 'pdf-to-pdf-ocr'],
    maxFileBytes: 10485760, maxFiles: 20, maxTotalBytes: 41943040, maxTotalPages: 300, retentionMinutes: 60,
  }) }));
  await page.goto('/tr/');
  await page.getByRole('button', { name: 'Kabul et', exact: true }).click();
  await expect.poll(() => capture.events.some(event => event.event === '$pageview')).toBe(true);
  const search = page.getByRole('combobox', { name: /Araç ara/ });
  await search.fill('excel');
  await expect.poll(() => capture.events.some(event => event.event === 'tool_search')).toBe(true);
  await search.fill('');
  await page.getByRole('group', { name: 'Araç kategorileri' }).getByRole('button', { name: 'Dönüştür' }).click();
  await expect.poll(() => capture.events.some(event => event.event === 'tool_filter')).toBe(true);
  await page.locator('#faq button[aria-controls]').first().click();
  await expect.poll(() => capture.events.some(event => event.event === 'faq_expand')).toBe(true);
  await page.locator('#guides a').filter({ hasText: 'Rehberi oku' }).first().evaluate(element => {
    element.addEventListener('click', event => event.preventDefault(), { once: true });
    (element as HTMLAnchorElement).click();
  });
  await expect.poll(() => capture.events.some(event => event.event === 'guide_open')).toBe(true);
  await page.locator('#tools button[data-tool-id="pdf-to-word"]').click();
  await expect.poll(() => capture.events.some(event => event.event === 'tool_open')).toBe(true);
  await page.locator('input[type="file"]').setInputFiles({ name: 'PRIVATE_SENTINEL.pdf', mimeType: 'application/pdf', buffer: Buffer.from('%PDF-1.4\n%%EOF') });
  await expect.poll(() => capture.events.some(event => event.event === 'file_selected')).toBe(true);
  const expected = ['tool_search', 'tool_filter', 'faq_expand', 'guide_open', 'tool_open', 'file_selected'];
  for (const name of expected) expect(capture.events.some(event => event.event === name)).toBe(true);
  const payload = JSON.stringify(capture.events);
  expect(payload).not.toContain('PRIVATE_SENTINEL');
  expect(payload).not.toMatch(/query|search_term|filename|file_name|options|password/i);
  const filter = capture.events.find(event => event.event === 'tool_filter')!;
  expect(filter.properties.category).toBe('convert');
  const selected = capture.events.find(event => event.event === 'file_selected')!;
  expect(selected.properties.tool).toBe('pdf-to-word');
  expect(selected.properties.file_count).toBe(1);
});

test('hero upload intent is recorded without reading the selected file', async ({ page }) => {
  const capture = await intercept(page);
  await page.route('**/api/capabilities', route => route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ enabledTools: [], maxFileBytes: 10485760, maxFiles: 20, maxTotalBytes: 41943040, maxTotalPages: 300, retentionMinutes: 60 }) }));
  await page.goto('/tr/');
  await page.getByRole('button', { name: 'Kabul et', exact: true }).click();
  await expect.poll(() => capture.events.some(event => event.event === '$pageview')).toBe(true);
  const chooserEvent = page.waitForEvent('filechooser');
  await page.getByRole('button', { name: 'Dosya seç', exact: true }).click();
  const chooser = await chooserEvent;
  await chooser.setFiles({ name: 'PRIVATE_SENTINEL.pdf', mimeType: 'application/pdf', buffer: Buffer.from('%PDF-1.4\n%%EOF') });
  await expect.poll(() => capture.events.some(event => event.event === 'hero_upload_click')).toBe(true);
  await expect.poll(() => capture.events.some(event => event.event === 'file_selected')).toBe(true);
  expect(JSON.stringify(capture.events)).not.toContain('PRIVATE_SENTINEL');
});

test('consent permits sanitized events; revocation stops capture', async ({ page }) => {
  const capture = await intercept(page);
  await page.goto('/tr/pdf-to-word?password=PRIVATE_SENTINEL');
  await page.getByRole('button', { name: 'Kabul et', exact: true }).click();
  await expect.poll(() => capture.events.some(e => e.event === '$pageview'), { timeout: 20000 }).toBe(true);
  const sentBeforeRevocation = await page.evaluate(async url => {
    // Exercise the real application's privacy boundary with deliberately unsafe runtime input.
    const analytics = await import(/* @vite-ignore */ url);
    const sent = analytics.track('upload_completed', { tool: 'pdf-to-word', file_count: 1, password: 'PRIVATE_SENTINEL', filename: 'PRIVATE_SENTINEL.pdf', options: { password: 'PRIVATE_SENTINEL' } });
    analytics.track('unexpected_PRIVATE_SENTINEL', {});
    return sent;
  }, capture.module.url);
  expect(sentBeforeRevocation).toBe(true);
  await expect.poll(() => capture.events.some(e => e.event === 'upload_completed'), { timeout: 15000 }).toBe(true);
  expect(JSON.stringify(capture.events)).not.toContain('PRIVATE_SENTINEL');
  const upload = capture.events.find(e => e.event === 'upload_completed')!;
  expect(upload.properties.tool).toBe('pdf-to-word');
  expect(upload.properties.file_count).toBe(1);
  expect(upload.properties.environment).toBe('development');
  await page.getByRole('button', { name: 'Çerez tercihleri', exact: true }).click();
  await page.getByRole('button', { name: 'Reddet', exact: true }).click();
  const count = capture.events.length;
  const sent = await page.evaluate(async url => {
    const analytics = await import(/* @vite-ignore */ url);
    return analytics.track('download_clicked', { tool: 'pdf-to-word' });
  }, capture.module.url);
  expect(sent).toBe(false);
  await page.reload();
  await expect(page.getByRole('button', { name: 'Çerez tercihleri', exact: true })).toBeVisible();
  expect(capture.events.length).toBe(count);
});

test('Do Not Track prevents collection even when consent was accepted', async ({ page }) => {
  const capture = await intercept(page);
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'doNotTrack', { get: () => '1' });
    localStorage.setItem('dc-analytics-consent-v1', 'accepted');
  });
  await page.goto('/tr/pdf-to-word');
  await expect(page.getByRole('button', { name: 'Çerez tercihleri', exact: true })).toBeVisible();
  expect(capture.requests).toHaveLength(0);
});

for (const state of ['succeeded', 'failed'] as const) {
  test(`real UI reports ${state} API result without filenames, errors or job identifiers`, async ({ page }) => {
    const capture = await intercept(page);
    const id = '22222222-2222-4222-8222-222222222222';
    const job = { id, tool: 'pdf-to-word', state, error: state === 'failed' ? 'PRIVATE_SENTINEL' : null,
      resultAvailable: state === 'succeeded', resultKind: 'docx', resultSize: 1234,
      expiresAt: '2099-01-01T00:00:00Z', createdAt: '2026-10-23T00:00:00Z' };
    await page.route('**/api/**', async route => {
      const path = new URL(route.request().url()).pathname;
      const data = path.endsWith('/capabilities') ? { enabledTools: ['pdf-to-word'], maxFileBytes: 10485760,
        maxFiles: 20, maxTotalBytes: 41943040, maxTotalPages: 300, retentionMinutes: 60 }
        : path.endsWith('/files') ? { id: '11111111-1111-4111-8111-111111111111', pages: 1, size: 50, kind: 'pdf', expiresAt: job.expiresAt }
        : route.request().method() === 'DELETE' ? { status: 'deleted' } : job;
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(data) });
    });
    await page.goto('/tr/pdf-to-word', { waitUntil: 'domcontentloaded' });
    await page.getByRole('button', { name: 'Kabul et', exact: true }).click();
    await expect.poll(() => capture.events.some(e => e.event === '$pageview')).toBe(true);
    await page.locator('input[type="file"]').setInputFiles({ name: 'PRIVATE_SENTINEL.pdf', mimeType: 'application/pdf', buffer: Buffer.from('%PDF-1.4\n%%EOF') });
    await page.getByRole('button', { name: 'Word’e dönüştür', exact: true }).click();
    const outcome = state === 'succeeded' ? 'conversion_completed' : 'conversion_failed';
    const privacyOutcome = state === 'succeeded' ? 'processing_success' : 'processing_error';
    await expect.poll(() => capture.events.filter(e => e.event === outcome).length).toBe(1);
    await expect.poll(() => capture.events.filter(e => e.event === privacyOutcome).length).toBe(1);
    expect(capture.events.some(e => e.event === 'processing_started')).toBe(true);
    for (const event of ['upload_completed', 'conversion_requested']) expect(capture.events.some(e => e.event === event)).toBe(true);
    await page.reload({ waitUntil: 'domcontentloaded' });
    await expect(page.getByRole('button', { name: 'Çerez tercihleri', exact: true })).toBeVisible();
    await expect.poll(() => capture.events.filter(e => e.event === '$pageview').length).toBe(2);
    expect(capture.events.filter(e => e.event === outcome)).toHaveLength(1);
    expect(JSON.stringify(capture.events)).not.toContain('PRIVATE_SENTINEL');
    expect(JSON.stringify(capture.events)).not.toContain(id);
  });
}
