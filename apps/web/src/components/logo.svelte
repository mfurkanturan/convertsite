<script lang="ts">
  import Icon from './icon.svelte';
  import { brand } from '../lib/brand';
  export let href = '/';
</script>

<a {href} class="inline-flex w-fit items-center gap-2 pl-1 text-[1.4rem] font-bold leading-none tracking-[-0.04em] text-text" aria-label={`${brand.name} ana sayfa`}>
  <span class="flex h-9 w-8 shrink-0 items-center justify-center rounded-lg bg-accent text-white shadow-[0_4px_10px_rgba(37,99,235,0.2)]">
    <Icon name="file" size={20} />
  </span>
  <span class="truncate">Doctor<span class="text-accent">Converter</span></span>
</a>
