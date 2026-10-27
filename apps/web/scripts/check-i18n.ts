// Guards every interface dictionary and guide locale against silent fallbacks.
// Spanish and Hindi start from English so missing translations otherwise ship
// without a type error.
import { ui } from '../src/i18n/ui.ts';
import { scenarios } from '../src/lib/seo/scenarios.ts';
import { toolSeoMapHi } from '../src/lib/tool-seo-hi.ts';
import { toolSeoMapFr } from '../src/lib/tool-seo-fr.ts';
import { toolIds } from '@convertsite/contracts';

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
// controls.organizer.pageLabel is "Page" in both English and French.
const sharedPaths = [/\.icon$/, /^workspace\.tips\.default$/, /^help\.titleB$/, /^controls\.organizer\.pageLabel$/];
// Turkish keeps the server's own Turkish error messages, so these codes stay empty in tr.
const serverMessagePath = /^api\.codes\./;
const turkishOnly = /[ğĞşŞıİ]/;

const failures: string[] = [];
const en = new Map(leaves(ui.en).map((leaf) => [leaf.path, leaf.value]));
const tr = new Map(leaves(ui.tr).map((leaf) => [leaf.path, leaf.value]));
const es = new Map(leaves(ui.es).map((leaf) => [leaf.path, leaf.value]));
const hi = new Map(leaves(ui.hi).map((leaf) => [leaf.path, leaf.value]));
const fr = new Map(leaves(ui.fr).map((leaf) => [leaf.path, leaf.value]));

for (const [path, enValue] of en) {
  const esValue = es.get(path);
  const hiValue = hi.get(path);
  const frValue = fr.get(path);
  if (typeof enValue === 'function') {
    if (typeof esValue !== 'function' || esValue.length !== enValue.length) failures.push(`es: ${path} has a different function signature`);
    if (typeof frValue !== 'function' || frValue.length !== enValue.length) failures.push(`fr: ${path} has a different function signature`);
    continue;
  }
  const exempt = sharedPaths.some((pattern) => pattern.test(path)) || enValue === '' || sharedValues.has(enValue as string);
  if (!exempt && esValue === enValue) failures.push(`es: ${path} is still the English text`);
  if (esValue === undefined) failures.push(`es: ${path} is missing`);
  if (!serverMessagePath.test(path) && !tr.has(path)) failures.push(`tr: ${path} is missing`);
  if (typeof enValue === 'function') {
    if (typeof hiValue !== 'function' || hiValue.length !== enValue.length) failures.push(`hi: ${path} has a different function signature`);
    continue;
  }
  if (hiValue === undefined) failures.push(`hi: ${path} is missing`);
  if (!exempt && hiValue === enValue) failures.push(`hi: ${path} is still the English text`);
  if (frValue === undefined) failures.push(`fr: ${path} is missing`);
  if (!exempt && frValue === enValue) failures.push(`fr: ${path} is still the English text`);
}

for (const [path, value] of es) {
  if (typeof value === 'string' && turkishOnly.test(value)) failures.push(`es: ${path} contains Turkish characters`);
}

const enSlugs = new Set(scenarios.en.map((scenario) => scenario.slug));
const esPairs = new Set(scenarios.es.map((scenario) => scenario.pair));
const esSlugs = scenarios.es.map((scenario) => scenario.slug);
const hiPairs = new Set(scenarios.hi.map((scenario) => scenario.pair).filter((pair): pair is string => pair !== undefined));
const hiSlugs = scenarios.hi.map((scenario) => scenario.slug);
const frPairs = new Set(scenarios.fr.map((scenario) => scenario.pair).filter((pair): pair is string => pair !== undefined));
const frSlugs = scenarios.fr.map((scenario) => scenario.slug);

for (const scenario of scenarios.es) {
  if (!scenario.pair || !enSlugs.has(scenario.pair)) failures.push(`es scenario ${scenario.slug} does not pair with an en scenario`);
}
for (const slug of enSlugs) {
  if (!esPairs.has(slug)) failures.push(`en scenario ${slug} has no Spanish page`);
}
for (const slug of new Set(esSlugs)) {
  if (esSlugs.filter((item) => item === slug).length > 1) failures.push(`es scenario slug ${slug} is duplicated`);
}
for (const scenario of scenarios.hi) {
  if (!scenario.pair || !enSlugs.has(scenario.pair)) failures.push(`hi scenario ${scenario.slug} does not pair with an en scenario`);
}
for (const slug of new Set(hiSlugs)) {
  if (hiSlugs.filter((item) => item === slug).length > 1) failures.push(`hi scenario slug ${slug} is duplicated`);
}
for (const scenario of scenarios.fr) {
  if (!scenario.pair || !enSlugs.has(scenario.pair)) failures.push(`fr scenario ${scenario.slug} does not pair with an en scenario`);
}
for (const slug of new Set(frSlugs)) {
  if (frSlugs.filter((item) => item === slug).length > 1) failures.push(`fr scenario slug ${slug} is duplicated`);
}
for (const [id, data] of Object.entries(toolSeoMapHi)) {
  if (data.id !== id) failures.push(`hi tool SEO key ${id} does not match its id`);
  if (!data.title || !data.metaTitle || !data.metaDescription || !data.lead || !data.steps.length || !data.faqs.length) failures.push(`hi tool SEO ${id} is incomplete`);
}
for (const id of toolIds) {
  if (!(id in toolSeoMapHi)) failures.push(`hi tool SEO is missing ${id}`);
}
for (const slug of hiPairs) {
  if (!enSlugs.has(slug)) failures.push(`hi guide points to missing English guide ${slug}`);
}
for (const [id, data] of Object.entries(toolSeoMapFr)) {
  if (data.id !== id) failures.push(`fr tool SEO key ${id} does not match its id`);
  if (!data.title || !data.metaTitle || !data.metaDescription || !data.lead || !data.steps.length || !data.faqs.length) failures.push(`fr tool SEO ${id} is incomplete`);
}
for (const id of toolIds) {
  if (!(id in toolSeoMapFr)) failures.push(`fr tool SEO is missing ${id}`);
}
for (const slug of frPairs) {
  if (!enSlugs.has(slug)) failures.push(`fr guide points to missing English guide ${slug}`);
}

if (failures.length) {
  console.error(failures.join('\n'));
  process.exitCode = 1;
} else {
  console.log(`Turkish, English, Spanish, Hindi and French interface coverage passed. Hindi/French tool SEO covers ${toolIds.length} tools; ${scenarios.hi.length} Hindi guides and ${scenarios.fr.length} French guides are paired with English pages.`);
}
