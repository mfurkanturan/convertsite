import { readFile, writeFile } from 'node:fs/promises';
import { randomUUID } from 'node:crypto';
import { resolve } from 'node:path';

export async function lifecycle({ api, origin, root, compose, command }) {
  let rows = [];
  const filter = process.env.AUDIT_LIFECYCLE_FILTER;
  if (filter) { try { rows = JSON.parse(await readFile(resolve(root, 'lifecycle.json'), 'utf8')).filter(r => !r.name.includes(filter)); } catch { /* First run has no prior results. */ } }
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  const sql = text => compose('exec', '-T', 'postgres', 'psql', '-U', 'audit', '-d', 'audit', '-t', '-A', '-c', text).trim();
  async function client() {
    const first = await fetch(api + '/api/capabilities');
    const cookie = first.headers.getSetCookie().map(c => c.split(';')[0]).join('; ');
    return async (path, options = {}) => fetch(api + path, { ...options, headers: { cookie, origin, ...options.headers } });
  }
  async function job(call, tool, names, options = {}) {
    const ids = [];
    for (const name of names) {
      const form = new FormData(); form.append('file', new Blob([await readFile(resolve(root, 'corpus', name))], { type: 'application/pdf' }), name);
      const response = await call('/api/files', { method: 'POST', body: form });
      const result = await response.json(); if (response.status !== 201) throw new Error(`upload:${result.code}`); ids.push(result.id);
    }
    const response = await call('/api/jobs', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ tool, fileIds: ids, options, idempotencyKey: randomUUID() }) });
    const result = await response.json(); if (response.status !== 202) throw new Error(`job:${result.code}`);
    if (!/^[a-f0-9-]{36}$/.test(result.id)) throw new Error('Invalid audit job identifier');
    return result.id;
  }
  async function wait(call, id, predicate, timeout = 115000) {
    const started = Date.now();
    while (Date.now() - started < timeout) {
      const state = await call(`/api/jobs/${id}`).then(r => r.json());
      if (predicate(state)) return state;
      await sleep(200);
    }
    throw new Error('audit wait timed out');
  }
  async function test(name, fn) {
    if (filter && !name.includes(filter)) return;
    const started = Date.now();
    try { rows.push({ name, ...(await fn()), seconds: (Date.now() - started) / 1000 }); }
    catch (error) { rows.push({ name, passed: false, error: error.message, seconds: (Date.now() - started) / 1000 }); }
    await writeFile(resolve(root, 'lifecycle.json'), JSON.stringify(rows, null, 2)); console.log('LIFECYCLE', name, rows.at(-1).passed);
  }
  const terminal = s => ['succeeded', 'failed', 'cancelled'].includes(s.state);
  await test('two-concurrent-submissions-real-worker', async () => {
    const call = await client(); compose('stop', 'worker');
    try {
      const first = await job(call, 'merge-pdf', ['plain.pdf', 'pages.pdf']);
      const second = await job(call, 'merge-pdf', ['unicode.pdf', 'pages.pdf']);
      compose('start', 'worker');
      const states = await Promise.all([wait(call, first, terminal),wait(call, second, terminal)]);
      const outputs = Number(sql(`SELECT count(DISTINCT output_id) FROM jobs WHERE id IN ('${first}','${second}') AND state='succeeded'`));
      return { passed: states.every(s=>s.state==='succeeded') && outputs===2, states: states.map(s=>s.state), distinctOutputs: outputs };
    } finally { compose('start', 'worker'); }
  });
  await test('queued-cancel-and-worker-restart', async () => {
    compose('stop', 'worker');
    try {
      const call = await client(); const cancelled = await job(call, 'merge-pdf', ['plain.pdf', 'pages.pdf']);
      await call(`/api/jobs/${cancelled}/cancel`, { method: 'POST' });
      const state = await wait(call, cancelled, terminal);
      const resumed = await job(call, 'merge-pdf', ['plain.pdf', 'pages.pdf']);
      compose('start', 'worker');
      const completed = await wait(call, resumed, terminal);
      return { passed: state.state === 'cancelled' && completed.state === 'succeeded', cancelled: state.state, resumed: completed.state };
    } finally { compose('start', 'worker'); }
  });
  await test('expiry-access-and-physical-cleanup', async () => {
    const call = await client(); const id = await job(call, 'merge-pdf', ['plain.pdf', 'pages.pdf']);
    const state = await wait(call, id, terminal); if (state.state !== 'succeeded') throw new Error('No result for expiry test');
    // Only this disposable project's synthetic result is expired; no production database access.
    sql(`UPDATE jobs SET expires_at=now()-interval '1 second' WHERE id='${id}'; UPDATE files SET expires_at=now()-interval '1 second' WHERE id=(SELECT output_id FROM jobs WHERE id='${id}')`);
    const expired = await call(`/api/jobs/${id}`).then(r => r.json());
    const download = await call(`/api/jobs/${id}/download`);
    await sleep(6000);
    const purged = sql(`SELECT purged FROM files WHERE id=(SELECT output_id FROM jobs WHERE id='${id}')`);
    return { passed: !expired.resultAvailable && download.status === 410 && purged === 't', downloadStatus: download.status, purged };
  });
  await test('running-job-cancellation', async () => {
    const call = await client(); const id = await job(call, 'ocr', ['ocr-long.pdf'], { language: 'tur' });
    await wait(call, id, s => s.state === 'running' || terminal(s));
    await call(`/api/jobs/${id}/cancel`, { method: 'POST' });
    const state = await wait(call, id, terminal);
    await sleep(1500);
    return { passed: state.state === 'cancelled' && (await call(`/api/jobs/${id}/download`)).status !== 200, state: state.state };
  });
  await test('real-motor-timeout', async () => {
    compose('stop', 'worker');
    let temporary;
    try {
      const call = await client(); const id = await job(call, 'ocr', ['ocr-long.pdf'], { language: 'tur' });
      temporary = compose('run', '-d', '--no-deps', '-e', 'ENGINE_TIMEOUT_MS=1000', 'worker').trim();
      const state = await wait(call, id, terminal);
      return { passed: state.state === 'failed' && state.error === 'PROCESSING_TIMEOUT', state: state.state, error: state.error };
    } finally { if (temporary) command(['rm', '-f', temporary]); compose('start', 'worker'); }
  });
  await test('running-worker-kill-and-real-lease-recovery', async () => {
    const call = await client(); const id = await job(call, 'ocr', ['ocr-long.pdf'], { language: 'tur' });
    const running = await wait(call, id, s => s.state === 'running' || terminal(s));
    if (running.state !== 'running') throw new Error('Job completed before kill; recovery not measured');
    const initialAttempt = sql(`SELECT attempt FROM jobs WHERE id='${id}'`);
    compose('kill', '-s', 'SIGKILL', 'worker'); compose('start', 'worker');
    console.log('Waiting for actual 180-second queue lease recovery...');
    const completed = await wait(call, id, terminal, 300000);
    const finalAttempt = sql(`SELECT attempt FROM jobs WHERE id='${id}'`);
    return { passed: completed.state === 'succeeded' && initialAttempt !== finalAttempt, state: completed.state, attemptTokenChanged: initialAttempt !== finalAttempt };
  });
  return rows;
}
