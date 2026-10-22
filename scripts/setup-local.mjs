import { randomBytes } from 'node:crypto';
import { mkdir, writeFile, access } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
const root = new URL('../', import.meta.url);
await mkdir(new URL('.data/files/', root), { recursive: true });
try { await access(new URL('.env', root)); console.log('Existing .env preserved.'); }
catch {
  const password = randomBytes(24).toString('hex');
  const token = randomBytes(32).toString('hex');
  await writeFile(new URL('.env', root), `POSTGRES_PASSWORD=${password}\nDATABASE_URL=postgres://docly:${password}@127.0.0.1:55432/docly\nENGINE_TOKEN=${token}\nAPP_ORIGIN=http://127.0.0.1:4321\n`, { flag: 'wx', mode: 0o600 });
  console.log('Local .env created with generated credentials.');
}
console.log(`Private data directory ready: ${fileURLToPath(new URL('.data/files/', root))}`);
