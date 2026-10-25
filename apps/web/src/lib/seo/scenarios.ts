import type { ToolId } from '@convertsite/contracts';
import type { Alternates, Locale } from '../../i18n/locales';
import { localePath } from '../../i18n/locales';
import { trScenarios } from './scenarios-tr';
import { enScenarios } from './scenarios-en';
import { trDeep } from './scenarios-tr-deep';
import { trMore } from './scenarios-tr-more';

export type ScenarioGroup = 'student' | 'legal' | 'visa' | 'career' | 'finance' | 'office';

// One long-tail landing page: a real task people search for, solved with an embedded tool.
export interface Scenario {
  slug: string;
  /** Slug of the equivalent page in the other language, for hreflang. */
  pair?: string;
  group: ScenarioGroup;
  /** Tool embedded at the top of the page. */
  tool: ToolId;
  /** Every tool the workflow touches, for internal links. */
  tools: ToolId[];
  title: string;
  metaTitle: string;
  metaDescription: string;
  lead: string;
  /** Search terms used in metadata, not rendered as page content. */
  queries: string[];
  sections: { heading: string; body: string[] }[];
  steps: { title: string; text: string }[];
  tips: string[];
  faqs: { q: string; a: string }[];
  /** Real UI screenshots from /public/guides, shown after the first section. */
  figures?: { src: string; alt: string; caption: string }[];
  /** Side-by-side comparison of approaches, rendered as a table. */
  comparison?: { title: string; head: string[]; rows: string[][]; note?: string };
}

// Intrinsic sizes of the captured screenshots, so pages reserve space and avoid layout shift.
export const figureSize: Record<string, [number, number]> = {
  'merge-selected': [1176, 913], 'merge-result': [1176, 1089], 'merge-legal': [1176, 913],
  'compress-selected': [1176, 775], 'compress-result': [1176, 951], 'word-selected': [1176, 821],
  'excel-selected': [1176, 775], 'excel-result': [1176, 951], 'images-selected': [1176, 913], 'ocr-selected': [1176, 821],
};

export const groupLabels: Record<Locale, Record<ScenarioGroup, string>> = {
  tr: { student: 'Öğrenci & sınav', legal: 'Hukuk & UYAP', visa: 'Vize & resmi işlemler', career: 'İK & kariyer', finance: 'Muhasebe & finans', office: 'Ofis & günlük işler' },
  en: { student: 'Students & exams', legal: 'Legal & court filing', visa: 'Visa & official forms', career: 'Jobs & resumes', finance: 'Accounting & finance', office: 'Office & everyday tasks' },
};
export const groupOrder: ScenarioGroup[] = ['student', 'legal', 'visa', 'career', 'finance', 'office'];

// Long-form additions extend the base records instead of repeating them.
function deepen(base: Scenario[], deep: typeof trDeep): Scenario[] {
  return base.map((item) => {
    const extra = deep[item.slug];
    if (!extra) return item;
    return { ...item, sections: [...item.sections, ...extra.sections, ...(trMore[item.slug] ?? [])], tips: [...item.tips, ...(extra.tips ?? [])],
      faqs: [...item.faqs, ...(extra.faqs ?? [])], figures: extra.figures, comparison: extra.comparison };
  });
}

export const scenarios: Record<Locale, Scenario[]> = { tr: deepen(trScenarios, trDeep), en: enScenarios };
export const scenarioBase: Record<Locale, string> = { tr: '/kullanim/', en: '/use-cases/' };

export function scenarioPath(locale: Locale, slug: string): string {
  return localePath(locale, `${scenarioBase[locale]}${slug}`);
}

export function scenarioAlternates(locale: Locale, scenario: Scenario): Alternates {
  const other: Locale = locale === 'tr' ? 'en' : 'tr';
  const result: Alternates = { [locale]: scenarioPath(locale, scenario.slug) };
  if (scenario.pair && scenarios[other].some((item) => item.slug === scenario.pair)) result[other] = scenarioPath(other, scenario.pair);
  return result;
}

/** Same group first, then pages sharing a tool. */
export function relatedScenarios(locale: Locale, scenario: Scenario, limit = 4): Scenario[] {
  const others = scenarios[locale].filter((item) => item.slug !== scenario.slug);
  const score = (item: Scenario) => (item.group === scenario.group ? 2 : 0) + (item.tools.some((tool) => scenario.tools.includes(tool)) ? 1 : 0);
  return others.map((item) => ({ item, s: score(item) })).filter(({ s }) => s > 0).sort((a, b) => b.s - a.s).slice(0, limit).map(({ item }) => item);
}

export function scenariosForTool(locale: Locale, tool: ToolId): Scenario[] {
  return scenarios[locale].filter((item) => item.tools.includes(tool));
}
