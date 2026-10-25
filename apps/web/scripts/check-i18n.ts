// Guards the Spanish and Turkish content against silent English fallbacks.
// ui-es.ts starts from the English dictionary, so a missing translation would
// otherwise ship English text without any type error.
import { ui } from '../src/i18n/ui.ts';
import { scenarios } from '../src/lib/seo/scenarios.ts';

type Leaf = { path: string; value: unknown };

function leaves(object: Record<string, unknown>, prefix = ''): Leaf[] {
  return Object.entries(object).flatMap(([key, value]) => {
    const path = prefix ? `${prefix}.${key}` : key;
    if (value && typeof value === 'object' && !Array.isArray(value)) return leaves(value as Record<string, unknown>, path);
    return [{ path, value }];
  });
}

// Values that are intentionally identical in every language.
const sharedValues = new Set(['OCR']);
const sharedPaths = [/\.icon$/, /^workspace\.tips\.default$/, /^help\.titleB$/];
// Turkish keeps the server's own Turkish error messages, so these codes stay empty in tr.
const serverMessagePath = /^api\.codes\./;
const turkishOnly = /[ğĞşŞıİ]/;

const failures: string[] = [];
const en = new Map(leaves(ui.en).map((leaf) => [leaf.path, leaf.value]));
const tr = new Map(leaves(ui.tr).map((leaf) => [leaf.path, leaf.value]));
const es = new Map(leaves(ui.es).map((leaf) => [leaf.path, leaf.value]));

for (const [path, enValue] of en) {
  const esValue = es.get(path);
  if (typeof enValue === 'function') {
    if (typeof esValue !== 'function' || esValue.length !== enValue.length) failures.push(`es: ${path} has a different function signature`);
    continue;
  }
  const exempt = sharedPaths.some((pattern) => pattern.test(path)) || enValue === '' || sharedValues.has(enValue as string);
  if (!exempt && esValue === enValue) failures.push(`es: ${path} is still the English text`);
  if (esValue === undefined) failures.push(`es: ${path} is missing`);
  if (!serverMessagePath.test(path) && !tr.has(path)) failures.push(`tr: ${path} is missing`);
}

for (const [path, value] of es) {
  if (typeof value === 'string' && turkishOnly.test(value)) failures.push(`es: ${path} contains Turkish characters`);
}

const enSlugs = new Set(scenarios.en.map((scenario) => scenario.slug));
const esPairs = new Set(scenarios.es.map((scenario) => scenario.pair));
const esSlugs = scenarios.es.map((scenario) => scenario.slug);

for (const scenario of scenarios.es) {
  if (!scenario.pair || !enSlugs.has(scenario.pair)) failures.push(`es scenario ${scenario.slug} does not pair with an en scenario`);
}
for (const slug of enSlugs) {
  if (!esPairs.has(slug)) failures.push(`en scenario ${slug} has no Spanish page`);
}
for (const slug of new Set(esSlugs)) {
  if (esSlugs.filter((item) => item === slug).length > 1) failures.push(`es scenario slug ${slug} is duplicated`);
}

if (failures.length) {
  console.error(failures.join('\n'));
  process.exitCode = 1;
} else {
  console.log('Spanish and Turkish content coverage passed.');
}
