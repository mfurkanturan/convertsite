export type Locale = 'tr' | 'en' | 'es';
export const locales: Locale[] = ['en', 'es', 'tr'];
export const defaultLocale: Locale = 'en';
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
export const ogLocale: Record<Locale, string> = { tr: 'tr_TR', en: 'en_US', es: 'es_ES' };
export const htmlLang: Record<Locale, string> = { tr: 'tr', en: 'en', es: 'es' };

// Equivalent pages in each language; drives hreflang, the language switcher and the sitemap.
export interface Alternates { tr?: string; en?: string; es?: string }

// Static pages available in each localized route group.
export const staticPairs: Alternates[] = [
  { en: '/', tr: '/tr/', es: '/es/' },
  { en: '/use-cases/', tr: '/tr/kullanim/', es: '/es/casos-de-uso/' },
  { en: '/privacy', tr: '/tr/gizlilik', es: '/es/privacidad' },
  { en: '/terms', tr: '/tr/kullanim-sartlari', es: '/es/terminos' },
  { en: '/security', tr: '/tr/guvenlik', es: '/es/seguridad' },
  { en: '/contact', tr: '/tr/iletisim', es: '/es/contacto' },
  { en: '/about', tr: '/tr/hakkimizda', es: '/es/acerca-de' },
];
