import { cp, mkdir } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const source = fileURLToPath(new URL('../apps/web/node_modules/pdfjs-dist', import.meta.url));
const destination = fileURLToPath(new URL('../apps/web/public/pdfjs', import.meta.url));
await mkdir(destination, { recursive: true });
for (const assetDirectory of ['cmaps', 'standard_fonts']) {
  await cp(join(source, assetDirectory), join(destination, assetDirectory), { recursive: true, force: true });
}
