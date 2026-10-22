<script lang="ts">
  import { brand } from '../lib/brand';
  export let href = '/';
</script>

<a {href} class="group inline-flex w-fit items-center gap-2.5 pl-1 text-[1.35rem] font-bold leading-none tracking-[-0.035em] text-text" aria-label={`${brand.name} ana sayfa`}>
  <span class="relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-[10px] bg-gradient-to-br from-blue-500 via-accent to-accent-strong text-white shadow-[0_4px_12px_rgba(37,99,235,0.28)] ring-1 ring-white/20 transition-transform duration-200 group-hover:scale-105">
    <svg viewBox="0 0 48 48" class="h-6 w-6 fill-none" aria-hidden="true">
      <path d="M13 10a2 2 0 0 1 2-2h12.5l8.5 8.5V36a2 2 0 0 1-2 2H15a2 2 0 0 1-2-2V10z" fill="#ffffff" fill-opacity="0.18" stroke="#ffffff" stroke-width="2.6" stroke-linejoin="round"/>
      <path d="M27.5 8v8.5H36" stroke="#ffffff" stroke-width="2.6" stroke-linejoin="round"/>
      <path d="M23.5 22.5v9M19 27h9" stroke="#ffffff" stroke-width="3.6" stroke-linecap="round"/>
    </svg>
  </span>
  <span class="truncate font-display font-bold text-text max-[480px]:hidden">Doctor<span class="text-accent font-extrabold">Converter</span></span>
</a>
