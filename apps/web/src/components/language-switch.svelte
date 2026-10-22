<script lang="ts">
  import { ui } from '../i18n/ui';
  import { useLocale } from '../i18n/context';
  import type { Locale } from '../i18n/locales';
  export let href: string;
  // Explicit locale lets layouts outside AppShell (legal pages) use the switch too.
  export let locale: Locale | undefined = undefined;
  const current: Locale = locale ?? useLocale();
  const target: Locale = current === 'tr' ? 'en' : 'tr';
  const text = ui[current];
  // An explicit choice outranks browser language and country detection on later visits.
  function remember() { try { localStorage.setItem('dc-locale', target); } catch { /* storage unavailable */ } }
</script>

<a {href} hreflang={target} lang={target} onclick={remember} class="inline-flex h-10 shrink-0 items-center gap-1.5 rounded-lg border border-border px-2.5 text-sm font-semibold text-text-soft transition-colors hover:border-accent/40 hover:text-accent" aria-label={`${text.switchShort} – ${text.switchTo}`} title={text.switchTo}>
  <svg viewBox="0 0 24 24" class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/></svg>
  {text.switchShort}
</a>
