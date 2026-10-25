export type Locale = 'tr' | 'en' | 'es' | 'hi';
export const locales: Locale[] = ['en', 'es', 'tr', 'hi'];
export const defaultLocale: Locale = 'en';
export const localeRoutes: Record<Locale, { guides: string; security: string; privacy: string; terms: string; about: string; contact: string }> = {
  en: { guides: '/use-cases/', security: '/security', privacy: '/privacy', terms: '/terms', about: '/about', contact: '/contact' },
  es: { guides: '/casos-de-uso/', security: '/seguridad', privacy: '/privacidad', terms: '/terminos', about: '/acerca-de', contact: '/contacto' },
  tr: { guides: '/kullanim/', security: '/guvenlik', privacy: '/gizlilik', terms: '/kullanim-sartlari', about: '/hakkimizda', contact: '/iletisim' },
  hi: { guides: '/upayog/', security: '/suraksha', privacy: '/gopaniyata', terms: '/upayog-sharten', about: '/hamare-bare-mein', contact: '/sampark' },
};
export const siteUrl = 'https://doctorconverter.com';

// English lives at the root (/); other languages use their ISO language path.
export function localePath(locale: Locale, path = '/'): string {
  const clean = path.startsWith('/') ? path : `/${path}`;
  if (locale === 'en') return clean;
  const prefix = `/${locale}`;
  return clean === '/' ? `${prefix}/` : `${prefix}${clean}`;
}
export function absoluteUrl(path: string): string {
  return new URL(path, siteUrl).toString();
}
export const ogLocale: Record<Locale, string> = { tr: 'tr_TR', en: 'en_US', es: 'es_ES', hi: 'hi_IN' };
export const htmlLang: Record<Locale, string> = { tr: 'tr', en: 'en', es: 'es', hi: 'hi' };

// Equivalent pages in each language; drives hreflang, the language switcher and the sitemap.
export interface Alternates { tr?: string; en?: string; es?: string; hi?: string }

// Static pages available in each localized route group.
export const staticPairs: Alternates[] = [
  { en: '/', tr: '/tr/', es: '/es/', hi: '/hi/' },
  { en: '/use-cases/', tr: '/tr/kullanim/', es: '/es/casos-de-uso/', hi: '/hi/upayog/' },
  { en: '/privacy', tr: '/tr/gizlilik', es: '/es/privacidad', hi: '/hi/gopaniyata' },
  { en: '/terms', tr: '/tr/kullanim-sartlari', es: '/es/terminos', hi: '/hi/upayog-sharten' },
  { en: '/security', tr: '/tr/guvenlik', es: '/es/seguridad', hi: '/hi/suraksha' },
  { en: '/contact', tr: '/tr/iletisim', es: '/es/contacto', hi: '/hi/sampark' },
  { en: '/about', tr: '/tr/hakkimizda', es: '/es/acerca-de', hi: '/hi/hamare-bare-mein' },
];
