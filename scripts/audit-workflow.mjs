import { spawnSync } from 'node:child_process';
import { randomBytes } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { chromium } from '@playwright/test';
import { createServer, request as proxyRequest } from 'node:http';
import { lifecycle } from './audit-lifecycle.mjs';

const root = resolve('.qa/engine-audit');
const project = 'docly-quality-audit';
const config = resolve('.qa/engine-audit/compose.json');
const api = 'http://127.0.0.1:3019';
const image = 'docly-audit:local';
const rows = [];
function command(args) {
  const result = spawnSync('docker', args, { encoding: 'utf8', shell: false, maxBuffer: 4 * 1024 * 1024 });
  if (result.status !== 0) throw new Error(`Docker command failed: ${args.slice(0, 3).join(' ')}: ${result.stderr?.slice(-800)}`);
  return result.stdout;
}
const compose = (...args) => command(['compose', '-p', project, '-f', config, ...args]);
const secret = () => randomBytes(32).toString('hex');
await mkdir(root, { recursive: true });
const env = { DATABASE_URL: 'postgres://audit:audit-isolated@postgres:5432/audit', ENGINE_TOKEN: secret(), SESSION_SECRET: secret(), ENGINE_URL: 'http://engine:3002', DATA_DIR: '/data', APP_ORIGIN: 'http://127.0.0.1:4329', API_HOST: '0.0.0.0', TRUST_PROXY_HOPS: '1', CLEANUP_INTERVAL_MS: '1000', RETENTION_MINUTES: '5' };
const backend = { image, environment: env, volumes: ['files:/data'], networks: ['private'], read_only: true, tmpfs: ['/tmp:size=33554432,mode=1777,noexec,nosuid'], cap_drop: ['ALL'], security_opt: ['no-new-privileges:true'], mem_limit: '256m', pids_limit: 48, stop_grace_period: '110s' };
await writeFile(config, JSON.stringify({ services: {
  postgres: { image: 'postgres:17.7-bookworm', environment: { POSTGRES_USER: 'audit', POSTGRES_PASSWORD: 'audit-isolated', POSTGRES_DB: 'audit' }, networks: ['private'], healthcheck: { test: ['CMD-SHELL', 'pg_isready -U audit -d audit'], interval: '2s', retries: 30 }, mem_limit: '256m' },
  engine: { ...backend, command: ['node', '--import', 'tsx', 'src/entrypoints/engine.ts'], environment: { ENGINE_TOKEN: env.ENGINE_TOKEN, ENGINE_HOST: '0.0.0.0' }, volumes: ['files:/data:ro'], tmpfs: ['/tmp:size=402653184,mode=1777,noexec,nosuid'], mem_limit: '1024m', cpus: 1, pids_limit: 96 },
  migrate: { ...backend, command: ['node', '--import', 'tsx', 'src/entrypoints/migrate.ts'], depends_on: { postgres: { condition: 'service_healthy' } } },
  api: { ...backend, command: ['node', '--import', 'tsx', 'src/entrypoints/api.ts'], depends_on: { migrate: { condition: 'service_completed_successfully' } } },
  gateway: { image: 'caddy:2.10.2-alpine', ports: ['127.0.0.1:3019:3001'], volumes: [`${resolve('infra/Caddyfile').replaceAll('\\','/')}:/etc/caddy/Caddyfile:ro`], networks: ['private','edge'], depends_on: ['api'] },
  worker: { ...backend, command: ['node', '--import', 'tsx', 'src/entrypoints/worker.ts'], depends_on: { migrate: { condition: 'service_completed_successfully' } } },
}, networks: { private: { internal: true }, edge: {} }, volumes: { files: {} } }, null, 2));
let browser;
const gateway = createServer((incoming, outgoing) => {
  const upstream = proxyRequest({ hostname: '127.0.0.1', port: incoming.url.startsWith('/api/') ? 3019 : 4321, path: incoming.url, method: incoming.method, headers: { ...incoming.headers, host: '127.0.0.1' } }, response => {
    outgoing.writeHead(response.statusCode, response.headers); response.pipe(outgoing);
  });
  upstream.on('error', () => { outgoing.writeHead(502); outgoing.end(); });
  incoming.pipe(upstream);
});
try {
  console.log('Building isolated audit image...');
  if (!process.env.AUDIT_SKIP_BUILD) command(['build', '-t', image, '-f', 'infra/engine.Dockerfile', '.']);
  compose('run', '--rm', '--no-deps', '--user', 'root', '--cap-add', 'CHOWN', '--entrypoint', 'chown', 'api', '1000:1000', '/data');
  compose('up', '-d', '--wait');
  await new Promise((resolve, reject) => { gateway.once('error', reject); gateway.listen(4329, '127.0.0.1', resolve); });
  for (let i = 0; i < 60; i++) {
    if (await fetch(api + '/api/health/ready').then(r => r.ok).catch(() => false)) break;
    await new Promise(r => setTimeout(r, 1000));
  }
  const queueColumns = compose('exec', '-T', 'postgres', 'psql', '-U', 'audit', '-d', 'audit', '-t', '-A', '-c', "SELECT column_name FROM information_schema.columns WHERE table_schema='pgboss' AND table_name='job'").trim().split(/\s+/);
  const column = candidates => candidates.find(name => queueColumns.includes(name));
  const created = column(['created_on', 'createdon']); const claimed = column(['started_on', 'startedon']); const completed = column(['completed_on', 'completedon']);
  browser = await chromium.launch({ headless: true });
  const cases = JSON.parse(await readFile(resolve(root, 'manifest.json'), 'utf8'));
  for (const tool of (process.env.AUDIT_LIFECYCLE_ONLY ? [] : [...new Set(cases.map(c => c.tool))])) {
    const scenario = cases.find(c => c.tool === tool && (tool !== 'pdf-to-excel' || c.inputs[0] === 'table.pdf'));
    const context = await browser.newContext({ locale: 'tr-TR', acceptDownloads: true });
    const page = await context.newPage();
    const row = { tool, uploads: [], jobs: [], checks: {}, unmeasured: [] };
    const started = Date.now();
    try {
      // No page/fixture is ever uploaded to a public origin.
      await page.route(/^https:\/\//, route => route.abort());
      page.on('response', async response => {
        if (response.request().method() !== 'POST') return;
        try {
          if (response.url().endsWith('/api/files')) row.uploads.push({ status: response.status(), body: await response.json() });
          if (response.url().endsWith('/api/jobs')) row.jobs.push({ status: response.status(), body: await response.json() });
        } catch { /* A response interrupted by navigation is reported by the workflow timeout. */ }
      });
      await page.goto(`${env.APP_ORIGIN}/tr/${tool}`, { waitUntil: 'networkidle' });
      await page.locator('input[type=file]').setInputFiles(scenario.inputs.map(name => resolve(root, 'corpus', name)));
      if (['protect-pdf', 'unlock-pdf'].includes(tool)) await page.locator('#pdf-password').fill('AuditSecret123');
      if (tool === 'watermark-pdf') await page.locator('#pdf-watermark').fill('GİZLİ ŞİRKET ÖĞÜT');
      const start = page.getByRole('button', { name: /^(Dönüştürmeyi başlat|PDF’leri birleştir)$/ });
      await start.waitFor(); await start.click({ timeout: 10000 });
      // The UI sends the requests; no context.execute or internal database job execution.
      for (let attempt = 0; attempt < 115; attempt++) {
        if (row.uploads.some(u => u.status !== 201) || row.jobs.some(j => j.status !== 202)) break;
        const accepted = row.jobs.find(j => j.status === 202)?.body;
        if (accepted) {
          const cookie = (await context.cookies()).map(c => `${c.name}=${c.value}`).join('; ');
          const status = await fetch(`${api}/api/jobs/${accepted.id}`, { headers: { cookie } }).then(r => r.json());
          if (['succeeded', 'failed', 'cancelled'].includes(status.state)) break;
        }
        await new Promise(r => setTimeout(r, 1000));
      }
      const cookies = await context.cookies();
      const cookie = cookies.map(c => `${c.name}=${c.value}`).join('; ');
      const job = row.jobs.find(j => j.status === 202)?.body;
      if (job) {
        const own = await fetch(`${api}/api/jobs/${job.id}`, { headers: { cookie } });
        const state = await own.json(); row.state = state.state; row.error = state.error;
        if (created && claimed && completed && /^[a-f0-9-]{36}$/.test(job.id)) {
          const timing = compose('exec', '-T', 'postgres', 'psql', '-U', 'audit', '-d', 'audit', '-t', '-A', '-c', `SELECT json_build_object('queueSeconds',EXTRACT(EPOCH FROM (${claimed}-${created})),'workerSeconds',EXTRACT(EPOCH FROM (${completed}-${claimed}))) FROM pgboss.job WHERE data->>'id'='${job.id}' ORDER BY ${created} DESC LIMIT 1`).trim();
          if (timing) row.queueTiming = JSON.parse(timing); else row.unmeasured.push('queue_record_missing');
        } else row.unmeasured.push('queue_timing_columns_unavailable');
        row.checks.real_worker_completed = state.state === 'succeeded';
        row.checks.stranger_denied = (await fetch(`${api}/api/jobs/${job.id}`)).status === 404;
        if (state.state === 'succeeded') {
          const download = await fetch(`${api}/api/jobs/${job.id}/download`, { headers: { cookie } });
          await writeFile(resolve(root, `browser-${tool}.${state.resultKind}`), Buffer.from(await download.arrayBuffer()));
          row.checks.download = download.ok;
          const readyLink = page.getByRole('link', { name: /Sonucu indir/ });
          await readyLink.waitFor({ state: 'visible', timeout: 10000 });
          const downloadEvent = page.waitForEvent('download'); await readyLink.click();
          const browserDownload = await downloadEvent;
          await browserDownload.saveAs(resolve(root, `browser-ui-${tool}.${state.resultKind}`));
          row.checks.browser_download = !(await browserDownload.failure());
          const deletionEvent = page.waitForResponse(r => r.request().method() === 'DELETE' && r.url().endsWith(`/api/jobs/${job.id}`));
          await page.getByRole('button', { name: 'Dosyaları sil', exact: true }).click();
          const deletion = await deletionEvent;
          row.checks.delete_accepted = deletion.status() === 202;
          row.checks.access_cut = (await fetch(`${api}/api/jobs/${job.id}/download`, { headers: { cookie } })).status !== 200;
        }
      } else { row.checks.upload_and_queue = false; row.error = row.uploads.find(u => u.status !== 201)?.body?.code ?? 'UI_DID_NOT_CREATE_JOB'; }
      await page.screenshot({ path: resolve(root, `browser-${tool}.png`), fullPage: true });
    } catch (error) { row.workflow_error = error.message.slice(0, 300); row.checks.workflow = false; }
    finally { row.seconds = (Date.now() - started) / 1000; rows.push(row); await writeFile(resolve(root, 'workflow.json'), JSON.stringify(rows, null, 2)); await context.close(); console.log(tool, row.state ?? row.error ?? row.workflow_error); }
  }
  if (!process.env.AUDIT_BROWSER_ONLY) await lifecycle({ api, origin: env.APP_ORIGIN, root, compose, command });
  if (process.env.AUDIT_REGRESSION) {
    compose('stop', 'worker');
    try {
      const output = compose('run', '--rm', '--no-deps', '-e', 'XDG_DATA_HOME=/tmp/vitest-data', 'worker', 'node', 'node_modules/vitest/vitest.mjs', 'run', '--testTimeout=30000', '--hookTimeout=30000', '--maxWorkers=1', '--no-file-parallelism', '--no-cache', '--fsModuleCachePath=/tmp/vitest-cache');
      await writeFile(resolve(root, 'regression.txt'), output);
      console.log('Isolated existing integration suite completed.');
    } finally { compose('start', 'worker'); }
  }
  await writeFile(resolve(root, 'worker.log'), compose('logs', '--no-color', 'worker'));
  console.log('Waiting for the isolated worker deletion grace period...');
  for (let i = 0; i < (process.env.AUDIT_LIFECYCLE_ONLY ? 0 : 13); i++) await new Promise(r => setTimeout(r, 10000));
  const cleanup = compose('exec', '-T', 'postgres', 'psql', '-U', 'audit', '-d', 'audit', '-t', '-A', '-c', "SELECT count(*) FROM files WHERE status='deleted' AND NOT purged AND expires_at < now()");
  await writeFile(resolve(root, 'cleanup.json'), JSON.stringify({ queryResult: cleanup.trim() }));
} finally {
  await browser?.close();
  gateway.closeAllConnections(); gateway.close();
  // Removes only the named disposable audit project's volume, never the development stack.
  compose('down', '--volumes');
}
