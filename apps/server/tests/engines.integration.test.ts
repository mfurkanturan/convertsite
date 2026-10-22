import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { mkdtemp, readFile, writeFile, rm } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { randomUUID, createHash } from 'node:crypto';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { PDFDocument } from 'pdf-lib';
import type { FastifyInstance } from 'fastify';
import { mimeTypes, type InputKind, type ToolId, type ToolOptions, type JobView, type UploadedFile } from '@convertsite/contracts';
import { createContext, type Context } from '../src/bootstrap/context.js';
import { createHttpApp } from '../src/bootstrap/http-app.js';
import { fileCleanup } from '../src/modules/files/public.js';
import { multipart } from './pdf-fixture.js';

describe('all ten real engines', () => {
  let ctx: Context; let app: FastifyInstance; let directory: string;
  const owners = new Set<string>();
  const command = promisify(execFile);
  let sequence = 1;
  const clients = new Map<string, string>();
  beforeAll(async () => {
    directory = await mkdtemp(join(tmpdir(), 'docly-engine-test-'));
    await command('/opt/docly-python/bin/python', ['-B', 'tests/engine-fixtures.py', directory]);
    ctx = await createContext(); app = await createHttpApp(ctx, false); await app.ready();
  }, 30000);
  afterAll(async () => {
    if (ctx && owners.size) {
      const values = [...owners];
      const ids = (await ctx.pool.query<{id:string}>('SELECT id FROM jobs WHERE owner=ANY($1)', [values])).rows.map((job) => job.id);
      await ctx.pool.query("UPDATE jobs SET deleted=true,state='cancelled' WHERE owner=ANY($1)", [values]);
      await ctx.pool.query("UPDATE files SET status='deleted',expires_at=now()-interval '1 second' WHERE owner=ANY($1)", [values]);
      await fileCleanup(ctx.pool, ctx.storage, ctx.config.dataDir, (id) => ctx.jobs.usesFile(id, true))();
      await ctx.pool.query("DELETE FROM pgboss.job WHERE data->>'id'=ANY($1)", [ids]);
      await ctx.pool.query('DELETE FROM jobs WHERE owner=ANY($1)', [values]);
      await ctx.pool.query('DELETE FROM files WHERE owner=ANY($1)', [values]);
      await ctx.pool.query('DELETE FROM usage_accounts WHERE owner=ANY($1)', [values]);
    }
    await app?.close(); await ctx?.close();
    if (directory) await rm(directory, { recursive: true, force: true });
  });
  async function session() {
    const response = await app.inject('/api/capabilities');
    const value = response.headers['set-cookie'];
    const cookie = (Array.isArray(value) ? value[0] : value)!.split(';')[0];
    const sid = app.unsignCookie(decodeURIComponent(cookie.slice(cookie.indexOf('=') + 1))).value!;
    owners.add(createHash('sha256').update(sid).digest('hex'));
    clients.set(cookie, `127.1.0.${sequence++}`);
    return cookie;
  }
  async function upload(cookie: string, name: string, expected = 201) {
    const extension = name.split('.').at(-1) as InputKind;
    const part = multipart(await readFile(join(directory, name)), name, mimeTypes[extension]);
    const response = await app.inject({ method: 'POST', url: '/api/files', remoteAddress: clients.get(cookie), headers: { cookie, origin: ctx.config.origin, 'content-type': part.contentType }, payload: part.payload });
    expect(response.statusCode, response.body).toBe(expected);
    return response.json<UploadedFile>();
  }
  async function execute(tool: ToolId, names: string[], options: ToolOptions = {}, expectedState = 'succeeded') {
    const cookie = await session(); const ids = [];
    for (const name of names) ids.push((await upload(cookie, name)).id);
    const response = await app.inject({ method: 'POST', url: '/api/jobs', headers: { cookie, origin: ctx.config.origin }, payload: { tool, fileIds: ids, options, idempotencyKey: randomUUID() } });
    expect(response.statusCode, response.body).toBe(202);
    const job = response.json<JobView>(); await ctx.execute(job.id);
    const status = (await app.inject({ url: `/api/jobs/${job.id}`, headers: { cookie } })).json<JobView>();
    expect(status.state, JSON.stringify(status)).toBe(expectedState);
    const download = await app.inject({ url: `/api/jobs/${job.id}/download`, headers: { cookie } });
    if (expectedState === 'succeeded') expect(download.statusCode).toBe(200);
    else expect(download.statusCode).toBe(410);
    return { cookie, ids, job: status, download };
  }
  async function inspect(kind: string, bytes: Buffer) {
    const path = join(directory, `${randomUUID()}.${kind}`); await writeFile(path, bytes);
    return JSON.parse((await command('/opt/docly-python/bin/python', ['-B', 'tests/inspect-artifact.py', kind, path])).stdout);
  }
  async function pdfText(bytes: Buffer) {
    const path = join(directory, `${randomUUID()}.pdf`); await writeFile(path, bytes);
    return (await command('pdftotext', [path, '-'])).stdout;
  }
  it('exports PDF text and tables to a readable DOCX with Turkish characters', async () => {
    const result = await execute('pdf-to-word', ['table.pdf']);
    expect(result.job.resultKind).toBe('docx');
    const artifact = await inspect('docx', result.download.rawPayload);
    expect(artifact.text).toContain('İstanbul'); expect(artifact.text).toContain('Kalem');
  });
  it('preserves editable typography, images, columns and two-page layout after Word rendering', async () => {
    const result = await execute('pdf-to-word', ['layout.pdf']);
    const artifact = await inspect('docx', result.download.rawPayload);
    expect(artifact.text).toContain('Deniz Örnek');
    expect(artifact.text).toContain('example.com');
    expect(artifact.runs.some((run: {text:string;bold:boolean;size:number}) => run.text.includes('Deniz') && run.bold && run.size >= 23)).toBe(true);
    expect(artifact.runs.some((run: {italic:boolean}) => run.italic)).toBe(true);
    expect(artifact.images).toBe(1);
    expect(artifact.externalLinks).toBe(0);
    expect(artifact.sectionWidths[0]).toBeCloseTo(595.28, 0);
    await writeFile(join(directory, 'layout-result.docx'), result.download.rawPayload);
    const rendered = await execute('word-to-pdf', ['layout-result.docx']);
    const layout = await inspect('pdf', rendered.download.rawPayload);
    expect(layout.pages).toHaveLength(2);
    const original = await inspect('pdf', await readFile(join(directory, 'layout.pdf')));
    for (const [index, markers] of [[0, ['Deniz', 'Deneyim']], [1, ['Sol', 'Sağ']]] as const) {
      for (const marker of markers) {
        const source = original.pages[index].words.find((word: {text:string}) => word.text === marker);
        const target = layout.pages[index].words.find((word: {text:string}) => word.text === marker);
        expect(target, `Missing ${marker} on page ${index + 1}`).toBeDefined();
        expect(Math.abs(target.x0 - source.x0)).toBeLessThan(5);
        // PDF/Word font ascent differs: allow 7 mm vertically, while enforcing
        // the original page count, horizontal column placement and text styles.
        expect(Math.abs(target.top - source.top)).toBeLessThan(20);
      }
    }
    expect(await pdfText(rendered.download.rawPayload)).toContain('geliştirdi');
    expect(await pdfText(rendered.download.rawPayload)).toContain('example.com');
    expect(layout.pages[0].images).toHaveLength(1);
    expect(Math.abs(layout.pages[0].images[0].x0 - original.pages[0].images[0].x0)).toBeLessThan(2);
    expect(Math.abs(layout.pages[0].images[0].top - original.pages[0].images[0].top)).toBeLessThan(2);
  });
  it('exports detected tables to XLSX and keeps extracted formulas inert', async () => {
    const result = await execute('pdf-to-excel', ['table.pdf']);
    expect(result.job.resultKind).toBe('xlsx');
    const artifact = await inspect('xlsx', result.download.rawPayload);
    expect(artifact.cells).toContainEqual({ value: '=1+1', type: 's' });
    expect(artifact.cells.some((cell: {value:unknown}) => cell.value === 'Kalem')).toBe(true);
  });
  it('converts DOCX to a real PDF and preserves Turkish text', async () => {
    const result = await execute('word-to-pdf', ['document.docx']);
    expect((await PDFDocument.load(result.download.rawPayload)).getPageCount()).toBeGreaterThan(0);
    expect(await pdfText(result.download.rawPayload)).toContain('İstanbul');
  });
  it('exports all or only the first Excel worksheet according to options', async () => {
    const all = await execute('excel-to-pdf', ['workbook.xlsx'], { sheets: 'all' });
    const first = await execute('excel-to-pdf', ['workbook.xlsx'], { sheets: 'first' });
    expect((await PDFDocument.load(all.download.rawPayload)).getPageCount()).toBe(2);
    expect((await PDFDocument.load(first.download.rawPayload)).getPageCount()).toBe(1);
  });
  it('renders selected PDF pages into ordered PNGs in a ZIP', async () => {
    const result = await execute('pdf-to-images', ['pages.pdf'], { pages: '3,1', format: 'png', dpi: 100 });
    expect(result.job.resultKind).toBe('zip');
    const artifact = await inspect('zip', result.download.rawPayload);
    expect(artifact.members.map((item: {format:string}) => item.format)).toEqual(['PNG','PNG']);
    expect(artifact.members[0].width).toBeGreaterThan(artifact.members[1].width);
  });
  it('returns one JPEG directly for a single-page selection', async () => {
    const result = await execute('pdf-to-images', ['pages.pdf'], { pages: '2', format: 'jpg', dpi: 150 });
    expect(result.job.resultKind).toBe('jpg');
    expect((await inspect('jpg', result.download.rawPayload)).format).toBe('JPEG');
    expect(result.download.headers['content-type']).toContain('image/jpeg');
  });
  it('creates a landscape PDF from mixed PNG/JPG inputs', async () => {
    const result = await execute('images-to-pdf', ['text.png','text.jpg'], { size: 'a4', orientation: 'landscape' });
    const pdf = await PDFDocument.load(result.download.rawPayload);
    expect(pdf.getPageCount()).toBe(2); expect(pdf.getPages()[0].getWidth()).toBeGreaterThan(pdf.getPages()[0].getHeight());
  });
  it('reorders, removes and rotates PDF pages', async () => {
    const result = await execute('edit-pdf-pages', ['pages.pdf'], { pages: '3,1', rotation: 90, mode: 'pdf' });
    const pdf = await PDFDocument.load(result.download.rawPayload);
    expect(pdf.getPages().map((page) => page.getWidth())).toEqual([500,300]);
    expect(pdf.getPages().map((page) => page.getRotation().angle)).toEqual([90,90]);
  });
  it('splits the selected PDF pages into a ZIP', async () => {
    const result = await execute('edit-pdf-pages', ['pages.pdf'], { pages: '2,1', mode: 'zip' });
    const artifact = await inspect('zip', result.download.rawPayload);
    expect(artifact.members.map((item: {width:number}) => item.width)).toEqual([400,300]);
  });
  it('compresses losslessly without returning a larger PDF', async () => {
    const result = await execute('compress-pdf', ['table.pdf']);
    expect(result.download.rawPayload.length).toBeLessThanOrEqual((await readFile(join(directory,'table.pdf'))).length);
    expect(await pdfText(result.download.rawPayload)).toContain('İstanbul');
  });
  it.each([['text.png','tur'], ['scanned.pdf','tur+eng']] as const)('recognizes real text from %s', async (name, language) => {
    const result = await execute('ocr', [name], { language });
    expect(result.job.resultKind).toBe('txt');
    expect(result.download.rawPayload.toString('utf8')).toContain('MERHABA');
  });
  it('does not invent tables or text for unsupported PDF content', async () => {
    expect((await execute('pdf-to-excel', ['pages.pdf'], {}, 'failed')).job.error).toBe('NO_TABLES');
    expect((await execute('pdf-to-word', ['scanned.pdf'], {}, 'failed')).job.error).toBe('NO_TEXT');
    expect((await execute('edit-pdf-pages', ['pages.pdf'], { pages:'99' }, 'failed')).job.error).toBe('INVALID_OPTIONS');
  });
  it.each(['macro.docx','traversal.docx','external.xlsx','wide.png'])('rejects unsafe or oversized %s during inspection', async (name) => {
    await upload(await session(), name, 422);
  });
  it('rejects incompatible inputs and invalid options before queue admission', async () => {
    const cookie = await session(); const image = await upload(cookie, 'text.png');
    const response = await app.inject({ method:'POST', url:'/api/jobs', headers:{cookie,origin:ctx.config.origin}, payload:{tool:'pdf-to-word',fileIds:[image.id],idempotencyKey:randomUUID()} });
    expect(response.statusCode).toBe(415);
    const invalid = await app.inject({ method:'POST', url:'/api/jobs', headers:{cookie,origin:ctx.config.origin}, payload:{tool:'ocr',fileIds:[image.id],options:{language:'not-a-language'},idempotencyKey:randomUUID()} });
    expect(invalid.statusCode).toBe(400);
  });
});
