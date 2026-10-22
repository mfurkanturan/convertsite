import type { APIRoute } from 'astro';
import { toolIds } from '@convertsite/contracts';
import { absoluteUrl, staticPairs, type Alternates, type Locale } from '../i18n/locales';
import { scenarios, scenarioAlternates } from '../lib/seo/scenarios';

// Built from the same route data as the pages, so every URL carries its hreflang alternates.
const entries: { alternates: Alternates; priority: string }[] = [
  ...staticPairs.map((pair, index) => ({ alternates: pair, priority: index === 0 ? '1.0' : index === 1 ? '0.8' : '0.4' })),
  ...toolIds.map((id) => ({ alternates: { en: `/${id}`, tr: `/tr/${id}` }, priority: '0.9' })),
  ...(['tr', 'en'] as Locale[]).flatMap((locale) => scenarios[locale].map((scenario) => ({ alternates: scenarioAlternates(locale, scenario), priority: '0.8' }))),
];

export const GET: APIRoute = () => {
  const lastmod = new Date().toISOString().slice(0, 10);
  const seen = new Set<string>();
  const urls: string[] = [];
  for (const { alternates, priority } of entries) {
    const links = (Object.entries(alternates) as [Locale, string][]).filter(([, path]) => path);
    const xDefault = alternates.en ?? alternates.tr;
    for (const [, path] of links) {
      if (seen.has(path)) continue;
      seen.add(path);
      const alt = links.length > 1
        ? [...links.map(([lang, href]) => `<xhtml:link rel="alternate" hreflang="${lang}" href="${absoluteUrl(href)}"/>`), `<xhtml:link rel="alternate" hreflang="x-default" href="${absoluteUrl(xDefault!)}"/>`].join('')
        : '';
      urls.push(`<url><loc>${absoluteUrl(path)}</loc><lastmod>${lastmod}</lastmod><priority>${priority}</priority>${alt}</url>`);
    }
  }
  const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urls.join('\n')}\n</urlset>\n`;
  return new Response(body, { headers: { 'content-type': 'application/xml; charset=utf-8' } });
};
