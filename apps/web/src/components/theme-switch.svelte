<script lang="ts">
  import { onMount } from 'svelte';
  import type { Locale } from '../i18n/locales';
  export let locale: Locale;
  const labels = {
    tr: { label: 'Tema', light: 'Açık', dark: 'Koyu', system: 'Sistem' },
    en: { label: 'Theme', light: 'Light', dark: 'Dark', system: 'System' },
    es: { label: 'Tema', light: 'Claro', dark: 'Oscuro', system: 'Sistema' },
    fr: { label: 'Thème', light: 'Clair', dark: 'Sombre', system: 'Système' },
    hi: { label: 'थीम', light: 'हल्की', dark: 'गहरी', system: 'सिस्टम' },
  };
  let preference = 'system';
  onMount(() => {
    const sync = () => { preference = document.documentElement.dataset.themePreference || 'system'; };
    sync();
    window.addEventListener('dc-theme-sync', sync);
    return () => window.removeEventListener('dc-theme-sync', sync);
  });
  function change(event: Event) {
    preference = (event.currentTarget as HTMLSelectElement).value;
    window.dispatchEvent(new CustomEvent('dc-theme-change', { detail: preference }));
  }
</script>
<label class="theme-switch">
  <span class="visually-hidden">{labels[locale].label}</span>
  <select aria-label={labels[locale].label} value={preference} onchange={change}>
    <option value="system">{labels[locale].system}</option>
    <option value="light">{labels[locale].light}</option>
    <option value="dark">{labels[locale].dark}</option>
  </select>
</label>
