<script lang="ts">
  import { localePath, locales, type Locale } from '../i18n/locales';
  import { useUi } from '../i18n/context';
  export let alternates: Partial<Record<Locale, string>>;
  export let locale: Locale;
  const controls = useUi().controls.languagePicker;
  const languageNames: Record<Locale, string> = { en: 'English', es: 'Español', tr: 'Türkçe', hi: 'हिन्दी', fr: 'Français' };
  // An explicit choice outranks browser language and country detection on later visits.
  function remember(event: MouseEvent, target: Locale) {
    try { localStorage.setItem('dc-locale', target); } catch { /* storage unavailable */ }
    const tool = /^#tool\/([a-z0-9-]+)$/.exec(window.location.hash);
    if (tool && event.currentTarget instanceof HTMLAnchorElement) {
      event.currentTarget.href = localePath(target, `/${tool[1]}`);
    }
  }
</script>

<details class="language-picker relative shrink-0">
  <summary class="inline-flex h-11 cursor-pointer list-none items-center gap-1.5 rounded-lg border border-border px-2.5 text-sm font-semibold text-text-soft transition-colors hover:border-accent/40 hover:text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent" aria-label={controls.select} title={controls.title}>
    <svg viewBox="0 0 24 24" class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0-18"/></svg>
    {locale.toUpperCase()}
  </summary>
  <nav class="absolute right-0 top-full z-50 mt-2 min-w-40 rounded-lg border border-border bg-surface p-1.5 shadow-lg" aria-label={controls.available}>
    {#each locales as target}
      <a href={alternates[target] ?? localePath(target, '/')} hreflang={target} lang={target} aria-current={target === locale ? 'page' : undefined} onclick={(event) => remember(event, target)} class="flex min-h-10 items-center justify-between rounded-md px-3 text-sm text-text-soft transition-colors hover:bg-bg hover:text-accent" class:font-semibold={target === locale}>
        <span>{languageNames[target]}</span><span class="text-xs uppercase text-text-muted">{target}</span>
      </a>
    {/each}
  </nav>
</details>

<style>
  .language-picker summary::-webkit-details-marker { display: none; }
</style>
