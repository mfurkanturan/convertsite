<script lang="ts">
  import { onMount } from 'svelte';
  import Icon from './icon.svelte';
  import Button from './button.svelte';
  import { getCategories, getTools, normalizeSearch, searchableToolText, suggestedToolIds, type Category } from '../lib/tools';
  import { apiFor } from '../lib/api-client';
  import { useLocale, useUi } from '../i18n/context';
  export let category: Category = 'all';
  export let query = '';
  export let oncategory: (value: Category) => void;
  export let ontool: (id: string) => void;
  const locale = useLocale();
  const api = apiFor(locale);
  const text = useUi().grid;
  const tools = getTools(locale);
  const categories = getCategories(locale);
  const suggested = tools.filter((tool) => suggestedToolIds.includes(tool.id));
  let unavailableToolIds: Set<string> | undefined;
  onMount(() => {
    let active = true;
    void api.capabilities().then((policy) => {
      if (active) unavailableToolIds = new Set(tools.filter((tool) => !policy.enabledTools.includes(tool.id)).map((tool) => tool.id));
    }).catch(() => {});
    return () => { active = false; };
  });
  $: matching = tools.filter((tool) => (category === 'all' || tool.category === category) && searchableToolText(tool).includes(normalizeSearch(query)));
  $: byCategory = categories.filter((item) => item.id !== 'all' && (category === 'all' || category === item.id)).map((item) => ({
    ...item,
    tools: matching.filter((tool) => tool.category === item.id && (category !== 'all' || !suggestedToolIds.includes(tool.id))),
  })).filter((item) => item.tools.length > 0);
  $: showSuggested = category === 'all' && !query.trim();
  $: visibleCount = category === 'all' && !query.trim() ? tools.length : matching.length;
</script>

<section id="tools" class="scroll-mt-[96px] pt-[var(--section-space)]" aria-labelledby="tools-title">
  <div>
    <h2 id="tools-title" class="home-section-title">{text.title}</h2>
    <p class="mt-1.5 text-[15px] text-text-soft">{text.lead}</p>
  </div>
  <div class="mt-5 mb-5 flex items-center justify-between gap-4">
    <div class="-mx-1 flex min-w-0 gap-1 overflow-x-auto px-1 py-1 [scrollbar-width:none]" role="group" aria-label={useUi().topbar.categoriesNav}>
      {#each categories as item}
        <button class="filter-chip shrink-0 whitespace-nowrap text-sm" aria-pressed={category === item.id} onclick={() => oncategory(item.id)}>{item.label}</button>
      {/each}
    </div>
    <span class="shrink-0 text-sm text-text-muted max-sm:sr-only" aria-live="polite">{text.count(visibleCount)}</span>
  </div>
  {#if showSuggested}
    <div class="mb-9">
      <div class="mb-4 flex flex-wrap items-end justify-between gap-2">
        <div><h3 class="catalog-category-title text-text">{text.suggestedTitle}</h3><p class="mt-1 text-sm text-text-soft">{text.suggestedLead}</p></div>
      </div>
      <div class="grid grid-cols-4 gap-4 max-[1100px]:grid-cols-2 max-[640px]:grid-cols-1 max-[640px]:gap-3">
        {#each suggested as tool}
          <button aria-label={text.open(tool.name, unavailableToolIds?.has(tool.id))} data-tool-id={tool.id} data-unavailable={unavailableToolIds?.has(tool.id) || undefined} class="group tool-card tool-card--featured flex flex-col text-left disabled:cursor-not-allowed disabled:opacity-55 max-[640px]:min-h-0 max-[640px]:p-4" onclick={() => ontool(tool.id)}>
          <div class="flex w-full items-center"><span class="tool-icon" data-color={tool.color}><Icon name={tool.icon} size={20} /></span></div>
            <h4 class="mt-4 text-base font-semibold leading-snug tracking-[-0.01em] text-text group-hover:text-accent">{tool.name}</h4>
            <p class="mt-1 flex-1 text-sm leading-relaxed text-text-soft">{tool.description}</p>
            <span class="format-label mt-3">{tool.inputLabel} → {tool.output}</span>
            {#if unavailableToolIds?.has(tool.id)}<span class="mt-2 text-[13px] font-semibold text-warning">{text.unavailable}</span>{/if}
          </button>
        {/each}
      </div>
    </div>
  {/if}

  {#if query.trim()}
    <div class="grid grid-cols-3 gap-4 max-[1100px]:grid-cols-2 max-[640px]:grid-cols-1 max-[640px]:gap-3">
      {#each matching as tool}
        <button aria-label={text.open(tool.name, unavailableToolIds?.has(tool.id))} data-tool-id={tool.id} data-unavailable={unavailableToolIds?.has(tool.id) || undefined} class="group tool-card tool-card--standard flex flex-col text-left disabled:cursor-not-allowed disabled:opacity-55" onclick={() => ontool(tool.id)}>
          <div class="flex w-full items-center"><span class="tool-icon !h-10 !w-10" data-color={tool.color}><Icon name={tool.icon} size={20} /></span></div>
          <h3 class="catalog-title mt-3 text-text group-hover:text-accent">{tool.name}</h3>
          <p class="mt-1 flex-1 text-sm leading-relaxed text-text-soft">{tool.description}</p>
          <span class="format-label mt-3">{tool.inputLabel} → {tool.output}</span>
          {#if unavailableToolIds?.has(tool.id)}<span class="mt-2 text-[13px] font-semibold text-warning">{text.unavailable}</span>{/if}
        </button>
      {/each}
    </div>
  {:else}
    {#each byCategory as group}
      <section class="mb-9 last:mb-0" aria-labelledby="tools-category-{group.id}">
        <div class="mb-4 flex items-baseline gap-3"><h3 id="tools-category-{group.id}" class="catalog-category-title text-text">{group.label}</h3><span class="text-[13px] text-text-muted">{text.count(group.tools.length)}</span></div>
        <div class="tool-category-grid" data-count={group.tools.length}>
          {#each group.tools as tool}
            <button aria-label={text.open(tool.name, unavailableToolIds?.has(tool.id))} data-tool-id={tool.id} data-unavailable={unavailableToolIds?.has(tool.id) || undefined} class="group tool-card tool-card--compact flex items-start gap-3 text-left disabled:cursor-not-allowed disabled:opacity-55" onclick={() => ontool(tool.id)}>
              <span class="tool-icon !h-10 !w-10 shrink-0" data-color={tool.color}><Icon name={tool.icon} size={20} /></span>
              <span class="min-w-0 flex-1"><span class="catalog-title block text-text group-hover:text-accent">{tool.name}</span><span class="mt-1 block text-sm leading-relaxed text-text-soft">{tool.description}</span><span class="format-label mt-2 block text-text-muted">{tool.inputLabel} → {tool.output}</span>{#if unavailableToolIds?.has(tool.id)}<span class="mt-1 block text-[13px] font-semibold text-warning">{text.unavailable}</span>{/if}</span>
            </button>
          {/each}
        </div>
      </section>
    {/each}
  {/if}
  {#if matching.length === 0}
    <div class="flex flex-col items-center gap-3 rounded-card border border-border bg-surface px-5 py-12 text-center text-text-soft">
      <Icon name="search" size={30} />
      <h3 class="text-base font-semibold text-text">{text.emptyTitle}</h3>
      <p class="text-sm">{text.emptyText}</p>
      <Button variant="secondary" className="mt-2" onclick={() => { oncategory('all'); query = ''; }}>{text.clear}</Button>
    </div>
  {/if}
</section>
