<script lang="ts">
  import { onMount } from 'svelte';
  import Icon from './icon.svelte';
  import Logo from './logo.svelte';
  import { categories, tools, type Category } from '../lib/tools';
  import { brand } from '../lib/brand';
  export let category: Category = 'all';
  export let open = false;
  export let oncategory: (value: Category) => void;
  export let ontool: (id: string) => void;
  export let onclose: () => void;
  let isMobile = false;
  onMount(() => {
    const media = window.matchMedia('(max-width: 1023px)');
    const sync = () => { isMobile = media.matches; };
    sync();
    media.addEventListener('change', sync);
    return () => media.removeEventListener('change', sync);
  });
</script>

{#if open}
  <button class="fixed inset-0 z-30 bg-slate-900/40 lg:hidden" aria-label="Menüyü kapat" onclick={onclose}></button>
{/if}
<aside id="main-sidebar" class="fixed inset-y-0 left-0 z-40 flex w-60 flex-col overflow-y-auto border-r border-border bg-surface px-4 pt-6 pb-4 transition-transform duration-200 max-lg:-translate-x-full max-lg:shadow-float {open ? 'max-lg:translate-x-0' : ''}" inert={isMobile && !open} aria-label="Ana menü">
  <Logo />
  <p class="mt-2 mb-8 pl-2.5 text-xs tracking-[0.04em] text-text-muted">Belgelerin için daha fazlası</p>

  <p class="mb-2 pl-3 text-xs font-semibold tracking-[0.08em] text-text-muted">ÇALIŞMA ALANI</p>
  <nav class="flex flex-col gap-0.5" aria-label="Kategoriler">
    {#each categories as item}
      <button class="flex min-h-11 items-center gap-3 rounded-lg px-3 text-left text-sm transition-colors {category === item.id ? 'bg-accent-soft font-semibold text-accent-strong' : 'text-text-soft hover:bg-bg hover:text-text'}" aria-current={category === item.id ? 'true' : undefined} onclick={() => oncategory(item.id)}>
        <Icon name={item.icon} size={19} /><span>{item.label}</span>
        {#if item.id === 'all'}<span class="ml-auto rounded-md bg-surface px-1.5 py-0.5 text-xs font-semibold text-accent-strong ring-1 ring-accent/15">{tools.length}</span>{/if}
      </button>
    {/each}
  </nav>

  <div class="mx-3 my-5 h-px bg-border"></div>

  <p class="mb-2 pl-3 text-xs font-semibold tracking-[0.08em] text-text-muted">SIK KULLANILANLAR</p>
  <nav class="flex flex-col gap-0.5" aria-label="Sık kullanılan araçlar">
    {#each tools.filter((tool) => tool.popular) as tool}
      <button class="flex min-h-11 items-center gap-3 rounded-lg px-3 text-left text-sm text-text-soft transition-colors hover:bg-bg hover:text-text" onclick={() => ontool(tool.id)}>
        <span class="tool-icon !h-7 !w-7 !rounded-md" data-color={tool.color}><Icon name={tool.icon} size={16} /></span>{tool.name}
      </button>
    {/each}
  </nav>

  <div class="mt-auto pt-6">
    <div class="rounded-card border border-border bg-gradient-to-br from-accent-soft/70 to-surface p-4">
      <span class="mb-2 flex items-center gap-2 text-accent"><Icon name="shield" size={20} /><strong class="text-sm font-semibold text-text">Önce senin gizliliğin</strong></span>
      <p class="text-[13px] leading-relaxed text-text-soft">Dosyaların özel depolanır, süreleri dolunca temizlenir.</p>
      <a href="#privacy" class="mt-2 inline-flex min-h-8 items-center gap-1.5 text-[13px] font-medium text-accent hover:text-accent-strong" onclick={onclose}>Daha fazla bilgi <Icon name="arrow" size={14} /></a>
    </div>
    <a class="mt-2 flex min-h-11 items-center gap-2 rounded-lg px-3 text-[13px] text-text-soft transition-colors hover:bg-bg hover:text-text" href="#faq" onclick={onclose}><Icon name="help" size={18} /> Yardım ve SSS <span class="ml-auto flex"><Icon name="chevron" size={15} /></span></a>
    <p class="mt-2 pl-3 text-xs text-text-muted">© {brand.year} {brand.name} · Geliştirme</p>
  </div>
</aside>
