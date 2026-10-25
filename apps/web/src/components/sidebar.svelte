<script lang="ts">
  import Icon from './icon.svelte';
  import Logo from './logo.svelte';
  import { getCategories, getTools, suggestedToolIds, type Category } from '../lib/tools';
  import { brand } from '../lib/brand';
  import { useLocale, useUi } from '../i18n/context';
  import { localePath, localeRoutes } from '../i18n/locales';

  export let category: Category = 'all';
  export let open = false;
  export let oncategory: (value: Category) => void;
  export let ontool: (id: string) => void;
  export let onclose: () => void;
  const locale = useLocale();
  const ui = useUi();
  const text = ui.sidebar;
  const tools = getTools(locale);
  const categories = getCategories(locale);
  const legal = [[localeRoutes[locale].about, ui.links.about], [localeRoutes[locale].security, ui.links.security], [localeRoutes[locale].privacy, ui.links.privacy], [localeRoutes[locale].terms, ui.links.terms], [localeRoutes[locale].contact, ui.links.contact]];
</script>

{#if open}
  <button
    class="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm transition-opacity lg:hidden"
    aria-label={text.close}
    onclick={onclose}
  ></button>

  <aside
    id="main-sidebar"
    class="fixed inset-y-0 left-0 z-50 flex w-72 flex-col overflow-y-auto border-r border-border bg-surface px-5 pt-6 pb-6 shadow-2xl transition-transform duration-200 lg:hidden"
    aria-label={text.label}
  >
    <div class="flex items-center justify-between pb-4 border-b border-border">
      <Logo href={localePath(locale, '/')} {locale} />
      <button
        class="flex h-11 w-11 items-center justify-center rounded-lg text-text-muted hover:bg-bg hover:text-text transition-colors"
        aria-label={text.close}
        onclick={onclose}
      >
        <Icon name="close" size={18} />
      </button>
    </div>

    <p class="mt-6 mb-2 pl-2 text-xs font-bold tracking-wider uppercase text-text-muted">{text.categories}</p>
    <nav class="flex flex-col gap-1" aria-label={text.categoriesNav}>
      {#each categories as item}
        <button
          class="flex min-h-11 items-center gap-3 rounded-lg px-3 text-left text-sm transition-colors {category === item.id ? 'bg-accent-soft font-semibold text-accent' : 'text-text-soft hover:bg-bg hover:text-text'}"
          aria-current={category === item.id ? 'true' : undefined}
          onclick={() => { oncategory(item.id); onclose(); }}
        >
          <Icon name={item.icon} size={18} />
          <span>{item.label}</span>
          {#if item.id === 'all'}
            <span class="ml-auto rounded-md bg-surface px-1.5 py-0.5 text-xs font-semibold text-accent ring-1 ring-accent/15">{tools.length}</span>
          {/if}
        </button>
      {/each}
      <a class="flex min-h-11 items-center gap-3 rounded-lg px-3 text-sm text-text-soft hover:bg-bg hover:text-text" href={localePath(locale, localeRoutes[locale].guides)}><Icon name="info" size={18} /><span>{ui.topbar.useCases}</span></a>
    </nav>

    <p class="mt-6 mb-2 pl-2 text-xs font-bold tracking-wider uppercase text-text-muted">{text.frequent}</p>
    <nav class="flex flex-col gap-1" aria-label={text.popularNav}>
      {#each tools.filter((tool) => suggestedToolIds.includes(tool.id)) as tool}
        <button
          class="flex min-h-10 items-center gap-3 rounded-lg px-3 text-left text-sm text-text-soft transition-colors hover:bg-bg hover:text-text"
          onclick={() => { ontool(tool.id); onclose(); }}
        >
          <span class="tool-icon !h-7 !w-7 !rounded-md" data-color={tool.color}>
            <Icon name={tool.icon} size={15} />
          </span>
          <span class="truncate">{tool.name}</span>
        </button>
      {/each}
    </nav>

    <div class="mt-auto pt-6 border-t border-border">
      <div class="rounded-xl border border-border bg-gradient-to-br from-accent-soft/50 to-surface p-3.5">
        <span class="mb-1 flex items-center gap-2 text-accent">
          <Icon name="shield" size={18} />
          <strong class="text-xs font-bold text-text">{text.storageTitle}</strong>
        </span>
        <p class="text-xs text-text-soft">{text.storageText}</p>
      </div>
      <div class="mt-4 flex flex-col gap-2 text-xs text-text-muted">
        {#each legal as [href, label]}<a href={localePath(locale, href)} class="hover:text-accent transition-colors" onclick={onclose}>{label}</a>{/each}
      </div>
      <p class="mt-4 text-[11px] text-text-muted">© {brand.year} {brand.name}</p>
    </div>
  </aside>
{/if}
