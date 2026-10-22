import { readdir, readFile } from 'node:fs/promises';
import { resolve, dirname, relative, sep } from 'node:path';
const root = resolve('apps/server/src');
const violations = [];
async function scan(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = resolve(directory, entry.name);
    if (entry.isDirectory()) { await scan(path); continue; }
    if (!path.endsWith('.ts')) continue;
    const text = await readFile(path, 'utf8');
    const source = relative(root, path).split(sep).join('/');
    const own = source.match(/^modules\/([^/]+)\//)?.[1];
    for (const match of text.matchAll(/(?:from\s+|import\s*\()['"]([^'"]+)['"]/g)) {
      const dependency = match[1];
      if (/\/(domain|application)\//.test(source) && /^(node:|fastify|@fastify|pg$|pg-boss|drizzle-orm)/.test(dependency)) violations.push(`${source}: forbidden technology import ${dependency}`);
      if (!dependency.startsWith('.')) continue;
      const target = relative(root, resolve(dirname(path), dependency)).split(sep).join('/');
      const other = target.match(/^modules\/([^/]+)\//)?.[1];
      if (other && other !== own && !target.endsWith('/public.js')) violations.push(`${source}: module internals ${dependency}`);
      if (/\/(domain|application)\//.test(source) && /\/(infrastructure|presentation)\//.test(target)) violations.push(`${source}: inverted layer dependency ${dependency}`);
    }
  }
}
await scan(root);
if (violations.length) { console.error(violations.join('\n')); process.exitCode = 1; }
else console.log('Module and layer import boundaries passed.');
