<script lang="ts">
  import Icon from './icon.svelte';
  import { brand } from '../lib/brand';
  export let href = '/';
</script>

<a {href} class="inline-flex w-fit items-center gap-2.5 pl-2.5 text-[1.9rem] font-bold leading-none tracking-[-0.06em] text-text" aria-label={`${brand.name} ana sayfa`}>
  <span class="flex h-10 w-9 items-center justify-center rounded-[11px] bg-accent text-white shadow-[0_5px_13px_rgba(37,99,235,0.16)]">
    <Icon name="file" size={25} />
  </span>
  <span>{brand.name}<span class="text-accent">.</span></span>
</a>
