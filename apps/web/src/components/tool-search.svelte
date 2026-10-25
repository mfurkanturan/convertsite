<script lang="ts">
  import Icon from './icon.svelte';
  import { getTools, normalizeSearch, searchableToolText } from '../lib/tools';
  import { useLocale, useUi } from '../i18n/context';
  import { track } from '../lib/analytics';

  export let query = '';
  export let onsearch: (value: string) => void;
  export let ontool: (id: string) => void;

  const locale = useLocale();
  const text = useUi().topbar;
  const tools = getTools(locale);
  const listId = `tool-search-list-${locale}`;
  let focused = false;
  let activeIndex = -1;
  let searchActive = false;
  $: results = query.trim()
    ? tools.filter((tool) => searchableToolText(tool).includes(normalizeSearch(query))).slice(0, 6)
    : [];
  $: expanded = focused && query.trim().length > 0;
  $: activeId = activeIndex >= 0 && results[activeIndex] ? `tool-search-option-${results[activeIndex].id}` : undefined;

  function select(id: string) {
    onsearch('');
    focused = false;
    activeIndex = -1;
    ontool(id);
  }

  function search(value: string) {
    focused = true;
    if (value.trim() && !searchActive) { track('tool_search'); searchActive = true; }
    if (!value.trim()) searchActive = false;
    onsearch(value);
    activeIndex = -1;
  }

  function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'ArrowDown' && results.length) {
      event.preventDefault();
      activeIndex = (activeIndex + 1) % results.length;
    } else if (event.key === 'ArrowUp' && results.length) {
      event.preventDefault();
      activeIndex = activeIndex <= 0 ? results.length - 1 : activeIndex - 1;
    } else if (event.key === 'Enter' && expanded && results.length) {
      event.preventDefault();
      select(results[activeIndex >= 0 ? activeIndex : 0].id);
    } else if (event.key === 'Escape' && expanded) {
      event.preventDefault();
      focused = false;
      activeIndex = -1;
    }
  }
</script>

<div class="relative w-full max-w-[260px] min-w-0">
  <label class="top-search flex h-11 w-full items-center gap-2 rounded-lg border border-border bg-bg px-3 text-text-muted transition-colors focus-within:border-accent focus-within:bg-surface hover:border-border-strong">
    <Icon name="search" size={17} />
    <span class="visually-hidden">{text.searchLabel}</span>
    <input
      class="h-full min-w-0 flex-1 border-0 bg-transparent text-sm text-text outline-none placeholder:text-text-muted"
      type="search"
      value={query}
      oninput={(event) => search(event.currentTarget.value)}
      onfocus={() => focused = true}
      onblur={() => setTimeout(() => focused = false, 120)}
      onkeydown={handleKeydown}
      placeholder={text.searchPlaceholder}
      role="combobox"
      aria-autocomplete="list"
      aria-expanded={expanded}
      aria-controls={listId}
      aria-activedescendant={activeId}
    />
    {#if query}
      <button class="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-text-muted hover:bg-surface hover:text-text focus-visible:outline-offset-0" aria-label={text.clearSearch} onclick={() => { onsearch(''); searchActive = false; activeIndex = -1; }}>
        <Icon name="close" size={16} />
      </button>
    {:else}
      <kbd class="hidden rounded border border-border bg-surface px-1.5 font-sans text-[11px] text-text-muted sm:inline-block" aria-hidden="true">/</kbd>
    {/if}
  </label>
  <ul id={listId} role="listbox" aria-label={text.searchResults} hidden={!expanded} class="absolute right-0 top-[calc(100%+8px)] z-50 max-h-[min(70vh,420px)] w-[min(360px,calc(100vw-32px))] overflow-y-auto rounded-xl border border-border bg-surface p-1.5 shadow-float">
      {#if results.length}
        {#each results as tool, index}
          <li role="presentation">
            <button id="tool-search-option-{tool.id}" role="option" aria-selected={activeIndex === index} tabindex="-1" class="flex min-h-12 w-full items-center gap-3 rounded-lg px-2.5 text-left transition-colors {activeIndex === index ? 'bg-accent-soft text-text' : 'text-text-soft hover:bg-bg'}" onpointerdown={(event) => event.preventDefault()} onclick={() => select(tool.id)}>
              <span class="tool-icon !h-9 !w-9 !rounded-lg" data-color={tool.color}><Icon name={tool.icon} size={17} /></span>
              <span class="min-w-0 flex-1"><span class="block truncate text-sm font-semibold text-text">{tool.name}</span><span class="block truncate text-xs text-text-muted">{tool.inputLabel} → {tool.output}</span></span>
              <Icon name="arrow" size={15} />
            </button>
          </li>
        {/each}
      {:else if query.trim()}
        <li class="px-3 py-4 text-sm text-text-soft">{text.noSearchResults}</li>
      {/if}
  </ul>
  <span class="visually-hidden" aria-live="polite">{expanded ? (results.length ? text.searchResultCount(results.length) : text.noSearchResults) : ''}</span>
</div>
