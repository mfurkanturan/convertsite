<script lang="ts">
  import { onMount } from 'svelte';
  import { analyticsAvailable, analyticsConsent, setAnalyticsConsent, syncAnalytics, pageViewed, track } from '../lib/analytics';
  import { consentKey } from '../lib/analytics-policy';
  export let locale: 'tr' | 'en' | 'es';
  let available = false;
  let open = false;
  const tr = locale === 'tr';
  const es = locale === 'es';
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
  <button class="min-h-11 rounded-md px-2 text-xs text-text-soft underline hover:text-accent" onclick={() => open = !open} aria-expanded={open} aria-controls="analytics-preferences">{tr ? 'Çerez tercihleri' : es ? 'Preferencias de cookies' : 'Cookie preferences'}</button>
  {#if open}
    <section id="analytics-preferences" aria-labelledby="analytics-title" class="fixed bottom-3 left-3 right-3 z-50 mx-auto max-w-xl rounded-panel border border-border bg-surface p-5 text-left shadow-card">
      <h2 id="analytics-title" class="text-base font-semibold text-text">{tr ? 'Çerez tercihlerin' : es ? 'Tus preferencias de cookies' : 'Your cookie preferences'}</h2>
      <p class="mt-2 text-sm leading-relaxed text-text-soft">{tr ? 'İzninle, site kullanımını anlamak ve sorunları belirlemek için isteğe bağlı analitik depolama kullanırız. Dosya adı, belge içeriği ve parola ölçüme dahil edilmez. Reddetsen de tüm araçları kullanabilirsin. Tercihini daha sonra değiştirebilirsin.' : es ? 'Con tu permiso, usamos almacenamiento analítico opcional para entender el uso del sitio y detectar problemas. No incluimos nombres de archivo, contenido de documentos ni contraseñas. Puedes usar todas las herramientas si lo rechazas y cambiar tu elección más tarde.' : 'With your permission, we use optional analytics storage to understand site usage and identify problems. File names, document contents and passwords are excluded. All tools work if you decline, and you can change your choice later.'}</p>
      <p class="mt-2 text-xs leading-relaxed text-text-soft">{tr ? 'Bu tercih yalnızca isteğe bağlı kullanım ölçümünü yönetir; zorunlu oturum depolamasını, reklamları veya ağ sağlayıcısının ölçümünü değiştirmez.' : es ? 'Esta opción solo controla la medición analítica opcional. No cambia el almacenamiento necesario para la sesión, los anuncios ni las mediciones del proveedor de red.' : 'This choice controls optional usage analytics only; it does not change essential session storage, advertising or measurement by the network provider.'}</p>
      <a class="mt-2 inline-block text-sm text-accent underline" href={tr ? '/tr/gizlilik#cerezler' : es ? '/es/privacidad#cookies' : '/privacy#cookies'}>{tr ? 'Çerezler ve gizlilik hakkında' : es ? 'Información sobre cookies y privacidad' : 'About cookies and privacy'}</a>
      <div class="mt-4 flex flex-wrap gap-3">
        <button class="min-h-11 rounded-control border border-border-strong bg-surface px-4 text-sm font-semibold text-text" onclick={() => choose(false)}>{tr ? 'Reddet' : es ? 'Rechazar' : 'Decline'}</button>
        <button class="min-h-11 rounded-control border border-border-strong bg-surface px-4 text-sm font-semibold text-text" onclick={() => choose(true)}>{tr ? 'Kabul et' : es ? 'Aceptar' : 'Accept'}</button>
      </div>
    </section>
  {/if}
{/if}
