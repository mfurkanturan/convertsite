import { getContext, setContext } from 'svelte';
import type { Locale } from './locales';
import { ui } from './ui';

const key = Symbol('locale');
// AppShell provides the page locale once; components read it instead of threading props.
export function provideLocale(locale: Locale) { setContext(key, locale); }
export function useLocale(): Locale { return getContext<Locale | undefined>(key) ?? 'tr'; }
export function useUi() { return ui[useLocale()]; }
