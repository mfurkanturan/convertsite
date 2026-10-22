export type Locale = 'tr' | 'en';
export const locales: Locale[] = ['tr', 'en'];
export const defaultLocale: Locale = 'tr';
export const siteUrl = 'https://doctorconverter.com';

// Turkish lives at the root, English under /en.
export function localePath(locale: Locale, path = '/'): string {
  const clean = path.startsWith('/') ? path : `/${path}`;
  if (locale === 'tr') return clean;
  return clean === '/' ? '/en/' : `/en${clean}`;
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
  { tr: '/', en: '/en/' },
  { tr: '/kullanim/', en: '/en/use-cases/' },
  { tr: '/gizlilik', en: '/en/privacy' },
  { tr: '/kullanim-sartlari', en: '/en/terms' },
  { tr: '/guvenlik', en: '/en/security' },
  { tr: '/iletisim', en: '/en/contact' },
];
