<script lang="ts">
  import { onMount } from 'svelte';
  import { analyticsAvailable, analyticsConsent, setAnalyticsConsent, syncAnalytics, pageViewed, track } from '../lib/analytics';
  import { consentKey } from '../lib/analytics-policy';
  export let locale: 'tr' | 'en';
  let available = false;
  let open = false;
  const tr = locale === 'tr';
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
  <button class="min-h-11 rounded-md px-2 text-xs text-text-soft underline hover:text-accent" onclick={() => open = !open} aria-expanded={open} aria-controls="analytics-preferences">{tr ? 'Analitik tercihleri' : 'Analytics preferences'}</button>
  {#if open}
    <section id="analytics-preferences" aria-labelledby="analytics-title" class="fixed bottom-3 left-3 right-3 z-50 mx-auto max-w-xl rounded-panel border border-border bg-surface p-5 text-left shadow-card">
      <h2 id="analytics-title" class="text-base font-semibold text-text">{tr ? 'İsteğe bağlı kullanım ölçümü' : 'Optional usage analytics'}</h2>
      <p class="mt-2 text-sm leading-relaxed text-text-soft">{tr ? 'İzninle hangi araçların kullanıldığını ve işlemlerin nerede aksadığını PostHog ile ölçeriz. Dosya adı, belge içeriği ve parola gönderilmez. Reddetsen de bütün araçları kullanabilirsin.' : 'With your permission, PostHog measures tool usage and where processing gets stuck. File names, document contents and passwords are excluded. All tools work if you decline.'}</p>
      <a class="mt-2 inline-block text-sm text-accent underline" href={tr ? '/tr/gizlilik' : '/privacy'}>{tr ? 'Gizlilik politikası' : 'Privacy policy'}</a>
      <div class="mt-4 flex flex-wrap gap-3">
        <button class="min-h-11 rounded-control border border-border-strong bg-surface px-4 text-sm font-semibold text-text" onclick={() => choose(false)}>{tr ? 'Reddet' : 'Decline'}</button>
        <button class="min-h-11 rounded-control border border-border-strong bg-surface px-4 text-sm font-semibold text-text" onclick={() => choose(true)}>{tr ? 'Analitiğe izin ver' : 'Allow analytics'}</button>
      </div>
    </section>
  {/if}
{/if}
