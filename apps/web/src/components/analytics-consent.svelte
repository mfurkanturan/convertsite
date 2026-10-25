<script lang="ts">
  import { onMount } from 'svelte';
  import { analyticsAvailable, analyticsConsent, setAnalyticsConsent, syncAnalytics, pageViewed, track } from '../lib/analytics';
  import { consentKey } from '../lib/analytics-policy';
  import { localePath, localeRoutes, type Locale } from '../i18n/locales';
  import { ui } from '../i18n/ui';
  export let locale: Locale;
  let available = false;
  let open = false;
  const text = ui[locale].controls.consent;
  const privacyHref = localePath(locale, `${localeRoutes[locale].privacy}#cookies`);
  function choose(accepted: boolean) { setAnalyticsConsent(accepted); open = false; }
  onMount(() => {
    available = analyticsAvailable();
    open = available && analyticsConsent() === null;
    void syncAnalytics();
    const storage = (event: StorageEvent) => { if (event.key === consentKey || event.key === null) { open = analyticsConsent() === null; void syncAnalytics(); } };
    const error = () => track('client_error', { error_code: 'UNHANDLED_ERROR' });
    const rejection = () => track('client_error', { error_code: 'UNHANDLED_REJECTION' });
    window.addEventListener('storage', storage);
    window.addEventListener('error', error);
    window.addEventListener('unhandledrejection', rejection);
    document.addEventListener('astro:page-load', pageViewed);
    return () => {
      window.removeEventListener('storage', storage); window.removeEventListener('error', error);
      window.removeEventListener('unhandledrejection', rejection); document.removeEventListener('astro:page-load', pageViewed);
    };
  });
</script>

{#if available}
  <button class="min-h-11 rounded-md px-2 text-xs text-text-soft underline hover:text-accent" onclick={() => open = !open} aria-expanded={open} aria-controls="analytics-preferences">{text.preferences}</button>
  {#if open}
    <section id="analytics-preferences" aria-labelledby="analytics-title" class="fixed bottom-3 left-3 right-3 z-50 mx-auto max-w-xl rounded-panel border border-border bg-surface p-5 text-left shadow-card">
      <h2 id="analytics-title" class="text-base font-semibold text-text">{text.title}</h2>
      <p class="mt-2 text-sm leading-relaxed text-text-soft">{text.description}</p>
      <p class="mt-2 text-xs leading-relaxed text-text-soft">{text.scope}</p>
      <a class="mt-2 inline-block text-sm text-accent underline" href={privacyHref}>{text.privacy}</a>
      <div class="mt-4 flex flex-wrap gap-3">
        <button class="min-h-11 rounded-control border border-border-strong bg-surface px-4 text-sm font-semibold text-text" onclick={() => choose(false)}>{text.decline}</button>
        <button class="min-h-11 rounded-control border border-border-strong bg-surface px-4 text-sm font-semibold text-text" onclick={() => choose(true)}>{text.accept}</button>
      </div>
    </section>
  {/if}
{/if}
