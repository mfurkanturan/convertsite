<script lang="ts">
  import { brand } from '../lib/brand';
  import { ui } from '../i18n/ui';
  import type { Locale } from '../i18n/locales';
  export let href = '/';
  export let locale: Locale = 'tr';
  export let inverse = false;
</script>

<a {href} class="group inline-flex w-fit items-center gap-2.5 text-[1.25rem] font-bold leading-none tracking-[-0.035em] text-text" aria-label={ui[locale].logoLabel(brand.name)}>
  <img src={inverse ? '/brand-mark-inverse.svg' : '/brand-mark.svg'} width="40" height="40" class="h-10 w-10 shrink-0" alt="" aria-hidden="true" />
  <span class="truncate font-display font-bold max-[480px]:hidden" style:color={inverse ? '#FFFFFF' : '#132047'}>Doctor<span style:color={inverse ? '#60A5FA' : '#1C7CCD'} class="font-bold">Converter</span></span>
</a>
