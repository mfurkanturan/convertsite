import { brand } from '../brand';
import { absoluteUrl, localePath, siteUrl, type Locale } from '../../i18n/locales';
import { ui } from '../../i18n/ui';
import type { ToolSeoData } from '../tool-seo';
import type { Scenario } from './scenarios';

const lang = (locale: Locale) => (locale === 'tr' ? 'tr-TR' : 'en-US');
const websiteId = `${siteUrl}/#website`;
const orgId = `${siteUrl}/#organization`;

function crumbs(items: [string, string][]) {
  return { '@type': 'BreadcrumbList', itemListElement: items.map(([name, path], index) => ({ '@type': 'ListItem', position: index + 1, name, item: absoluteUrl(path) })) };
}
function app(name: string, description: string, url: string, locale: Locale) {
  return {
    '@type': 'WebApplication', name, url, description, inLanguage: lang(locale),
    applicationCategory: 'UtilitiesApplication', operatingSystem: 'Any', browserRequirements: 'Requires JavaScript',
    isAccessibleForFree: true, offers: { '@type': 'Offer', price: '0', priceCurrency: locale === 'tr' ? 'TRY' : 'USD' },
    publisher: { '@id': orgId },
  };
}
const faqPage = (faqs: { q: string; a: string }[]) => ({
  '@type': 'FAQPage', mainEntity: faqs.map((faq) => ({ '@type': 'Question', name: faq.q, acceptedAnswer: { '@type': 'Answer', text: faq.a } })),
});

export function homeGraph(locale: Locale) {
  const url = absoluteUrl(localePath(locale, '/'));
  return { '@context': 'https://schema.org', '@graph': [
    { '@type': 'Organization', '@id': orgId, name: brand.name, url: siteUrl, logo: absoluteUrl('/favicon.svg'), email: 'destek@doctorconverter.com' },
    { '@type': 'WebSite', '@id': websiteId, url: siteUrl, name: brand.name, inLanguage: ['tr-TR', 'en-US'], publisher: { '@id': orgId } },
    app(brand.name, ui[locale].hero.lead, url, locale),
    faqPage(ui[locale].help.questions.map((item) => ({ q: item.title, a: item.text }))),
  ] };
}

export function toolGraph(locale: Locale, data: ToolSeoData, path: string) {
  const url = absoluteUrl(path);
  return { '@context': 'https://schema.org', '@graph': [
    { '@type': 'WebPage', '@id': `${url}#webpage`, url, name: data.metaTitle, description: data.metaDescription, inLanguage: lang(locale), isPartOf: { '@id': websiteId } },
    crumbs([[ui[locale].seo.home, localePath(locale, '/')], [data.title, path]]),
    app(`${brand.name} – ${data.title}`, data.metaDescription, url, locale),
    { '@type': 'HowTo', name: ui[locale].seo.howTo(data.title), step: data.steps.map((step, index) => ({ '@type': 'HowToStep', position: index + 1, name: step.title.replace(/^\d+\.\s*/, ''), text: step.description })) },
    faqPage(data.faqs.map((faq) => ({ q: faq.question, a: faq.answer }))),
  ] };
}

export function scenarioGraph(locale: Locale, scenario: Scenario, path: string, hubPath: string) {
  const url = absoluteUrl(path);
  return { '@context': 'https://schema.org', '@graph': [
    { '@type': 'WebPage', '@id': `${url}#webpage`, url, name: scenario.metaTitle, description: scenario.metaDescription, inLanguage: lang(locale), isPartOf: { '@id': websiteId }, keywords: scenario.queries.join(', ') },
    crumbs([[ui[locale].seo.home, localePath(locale, '/')], [ui[locale].seo.hubTitle, hubPath], [scenario.title, path]]),
    { '@type': 'HowTo', name: scenario.title, description: scenario.lead, inLanguage: lang(locale), step: scenario.steps.map((step, index) => ({ '@type': 'HowToStep', position: index + 1, name: step.title, text: step.text })) },
    faqPage(scenario.faqs),
  ] };
}

export function hubGraph(locale: Locale, path: string, items: { name: string; path: string }[]) {
  return { '@context': 'https://schema.org', '@graph': [
    crumbs([[ui[locale].seo.home, localePath(locale, '/')], [ui[locale].seo.hubTitle, path]]),
    { '@type': 'CollectionPage', url: absoluteUrl(path), name: ui[locale].seo.hubTitle, inLanguage: lang(locale), isPartOf: { '@id': websiteId },
      mainEntity: { '@type': 'ItemList', itemListElement: items.map((item, index) => ({ '@type': 'ListItem', position: index + 1, name: item.name, url: absoluteUrl(item.path) })) } },
  ] };
}
