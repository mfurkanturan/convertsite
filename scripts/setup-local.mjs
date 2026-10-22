import { randomBytes } from 'node:crypto';
import { mkdir, writeFile, readFile, appendFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
const root = new URL('../', import.meta.url);
const envFile = new URL('.env', root);
await mkdir(new URL('.data/files/', root), { recursive: true });
const existing = await readFile(envFile, 'utf8').catch((error) => { if (error.code === 'ENOENT') return null; throw error; });
if (existing === null) {
  const password = randomBytes(24).toString('hex');
  const token = randomBytes(32).toString('hex');
  const session = randomBytes(32).toString('hex');
  await writeFile(envFile, `POSTGRES_PASSWORD=${password}\nDATABASE_URL=postgres://docly:${password}@127.0.0.1:55432/docly\nENGINE_TOKEN=${token}\nSESSION_SECRET=${session}\nAPP_ORIGIN=http://127.0.0.1:4321\n`, { flag: 'wx', mode: 0o600 });
  console.log('Local .env created with generated credentials.');
} else if (!/^SESSION_SECRET=/m.test(existing)) {
  await appendFile(envFile, `${existing.endsWith('\n') ? '' : '\n'}SESSION_SECRET=${randomBytes(32).toString('hex')}\n`);
  console.log('Existing .env preserved; generated SESSION_SECRET added.');
} else console.log('Existing .env preserved.');
console.log(`Private data directory ready: ${fileURLToPath(new URL('.data/files/', root))}`);
