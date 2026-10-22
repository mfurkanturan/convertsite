export type Locale = 'tr' | 'en';
export const locales: Locale[] = ['en', 'tr'];
export const defaultLocale: Locale = 'en';
export const siteUrl = 'https://doctorconverter.com';

// English lives at the root (/), Turkish lives under /tr.
export function localePath(locale: Locale, path = '/'): string {
  const clean = path.startsWith('/') ? path : `/${path}`;
  if (locale === 'en') return clean;
  return clean === '/' ? '/tr/' : `/tr${clean}`;
}
export function absoluteUrl(path: string): string {
  return new URL(path, siteUrl).toString();
}
export const ogLocale: Record<Locale, string> = { tr: 'tr_TR', en: 'en_US' };
export const htmlLang: Record<Locale, string> = { tr: 'tr', en: 'en' };

// Equivalent pages in each language; drives hreflang, the language switcher and the sitemap.
export interface Alternates { tr?: string; en?: string }

// Static pages that exist in both languages.
export const staticPairs: Alternates[] = [
  { en: '/', tr: '/tr/' },
  { en: '/use-cases/', tr: '/tr/kullanim/' },
  { en: '/privacy', tr: '/tr/gizlilik' },
  { en: '/terms', tr: '/tr/kullanim-sartlari' },
  { en: '/security', tr: '/tr/guvenlik' },
  { en: '/contact', tr: '/tr/iletisim' },
  { en: '/about', tr: '/tr/hakkimizda' },
];
