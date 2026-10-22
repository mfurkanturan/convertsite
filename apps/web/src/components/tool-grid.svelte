<script lang="ts">
  import Icon from './icon.svelte';
  import Button from './button.svelte';
  import { getCategories, getTools, normalizeSearch, type Category } from '../lib/tools';
  import { useLocale, useUi } from '../i18n/context';
  export let category: Category = 'all';
  export let query = '';
  export let oncategory: (value: Category) => void;
  export let ontool: (id: string) => void;
  const locale = useLocale();
  const text = useUi().grid;
  const tools = getTools(locale);
  const categories = getCategories(locale);
  $: filtered = tools.filter((tool) => (category === 'all' || tool.category === category) && normalizeSearch(`${tool.name} ${tool.description}`).includes(normalizeSearch(query)));
</script>

<section id="tools" class="scroll-mt-[96px] pt-12 max-[600px]:pt-9" aria-labelledby="tools-title">
  <div>
    <h2 id="tools-title" class="font-display text-[clamp(22px,2.2vw,28px)] font-semibold tracking-[-0.02em] text-text">{text.title}<span class="text-accent">.</span></h2>
    <p class="mt-1.5 text-[15px] text-text-soft">{text.lead}</p>
  </div>
  <div class="mt-5 mb-5 flex items-center justify-between gap-4">
    <div class="-mx-1 flex min-w-0 gap-1 overflow-x-auto px-1 py-1 [scrollbar-width:none]" role="group" aria-label={useUi().topbar.categoriesNav}>
      {#each categories as item}
        <button class="flex min-h-10 shrink-0 items-center whitespace-nowrap rounded-lg border px-3.5 text-sm transition-colors {category === item.id ? 'border-accent/25 bg-accent-soft font-semibold text-accent-strong' : 'border-border bg-surface text-text-soft hover:border-border-strong hover:text-text'}" aria-pressed={category === item.id} onclick={() => oncategory(item.id)}>{item.label}</button>
      {/each}
    </div>
    <span class="shrink-0 text-sm text-text-muted max-sm:sr-only" aria-live="polite">{text.count(filtered.length)}</span>
  </div>
  <div class="grid grid-cols-3 gap-4 max-[1100px]:grid-cols-2 max-[640px]:grid-cols-1 max-[640px]:gap-3">
    {#each filtered as tool}
      <button class="group flex flex-col rounded-card border border-border/90 bg-surface p-5 text-left transition-all duration-150 hover:-translate-y-0.5 hover:border-accent hover:shadow-card max-[640px]:p-4 cursor-pointer" onclick={() => ontool(tool.id)} aria-label={text.open(tool.name)}>
        <div class="flex items-center justify-between">
          <span class="tool-icon" data-color={tool.color}><Icon name={tool.icon} size={22} /></span>
          <span class="rounded bg-bg px-2 py-0.5 text-[11px] font-mono font-semibold text-text-muted border border-border/70">{tool.output}</span>
        </div>
        <h3 class="mt-3.5 text-[15px] sm:text-base font-semibold tracking-[-0.01em] text-text group-hover:text-accent transition-colors">{tool.name}</h3>
        <p class="mt-1 text-sm leading-relaxed text-text-soft line-clamp-2">{tool.description}</p>
        <div class="mt-auto flex items-center justify-between pt-3.5 border-t border-border/50 text-xs">
          <span class="text-text-muted font-medium">
            {tool.inputLabel} → {tool.output}
          </span>
          <span class="flex items-center gap-1 font-semibold text-accent transition-transform group-hover:translate-x-0.5">
            <span>{locale === 'tr' ? 'Başla' : 'Open'}</span>
            <Icon name="arrow" size={13} />
          </span>
        </div>
      </button>
    {/each}
  </div>
  {#if filtered.length === 0}
    <div class="flex flex-col items-center gap-3 rounded-card border border-border bg-surface px-5 py-12 text-center text-text-soft">
      <Icon name="search" size={30} />
      <h3 class="text-base font-semibold text-text">{text.emptyTitle}</h3>
      <p class="text-sm">{text.emptyText}</p>
      <Button variant="secondary" className="mt-2" onclick={() => { oncategory('all'); query = ''; }}>{text.clear}</Button>
    </div>
  {/if}
</section>
