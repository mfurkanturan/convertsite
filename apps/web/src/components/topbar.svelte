<script lang="ts">
  import Icon from './icon.svelte';
  import Logo from './logo.svelte';
  import LanguageSwitch from './language-switch.svelte';
  import { getCategories, type Category } from '../lib/tools';
  import { useLocale, useUi } from '../i18n/context';
  import { localePath } from '../i18n/locales';

  export let query = '';
  export let menuOpen = false;
  export let category: Category = 'all';
  export let current: string | undefined = undefined;
  export let switchHref: string | undefined = undefined;
  export let onmenu: () => void;
  export let oncategory: (cat: Category) => void;
  export let onsearch: (value: string) => void;
  const locale = useLocale();
  const text = useUi().topbar;
  const categories = getCategories(locale);
</script>

<header class="sticky top-0 z-30 w-full border-b border-border bg-surface/95 backdrop-blur-md transition-colors">
  <div class="mx-auto flex h-[72px] max-w-[1240px] items-center justify-between gap-3 px-4 sm:px-8 max-[540px]:h-16">
    <!-- Brand Logo & Desktop Nav -->
    <div class="flex items-center gap-4 lg:gap-8 shrink-0 min-w-0">
      <Logo href={localePath(locale, '/')} {locale} />

      {#if !current}
        <nav class="hidden md:flex items-center gap-1 text-sm font-medium" aria-label={text.categoriesNav}>
          {#each categories as item}
            <button
              class="rounded-lg px-3 py-1.5 transition-colors {category === item.id ? 'bg-accent-soft font-semibold text-accent' : 'text-text-soft hover:bg-bg hover:text-text'}"
              aria-pressed={category === item.id}
              onclick={() => oncategory(item.id)}
            >
              {item.label}
            </button>
          {/each}
        </nav>
      {:else}
        <nav class="hidden sm:flex items-center gap-2 text-sm text-text-muted" aria-label={text.location}>
          <button class="hover:text-accent transition-colors" onclick={() => oncategory('all')}>{text.tools}</button>
          <Icon name="chevron" size={14} />
          <strong class="font-semibold text-text">{current}</strong>
        </nav>
      {/if}
    </div>

    <!-- Right Controls: Search, Guides, Language, Mobile Hamburger -->
    <div class="flex items-center gap-2 sm:gap-3 flex-1 justify-end min-w-0">
      <label class="top-search flex h-10 w-full max-w-[260px] min-w-0 items-center gap-2 rounded-lg border border-border bg-bg px-2.5 sm:px-3 text-text-muted transition-colors focus-within:border-accent focus-within:bg-surface hover:border-border-strong">
        <Icon name="search" size={16} />
        <input
          class="h-full min-w-0 flex-1 border-0 bg-transparent text-sm text-text outline-none placeholder:text-text-muted"
          type="search"
          value={query}
          oninput={(event) => onsearch(event.currentTarget.value)}
          placeholder={text.searchPlaceholder}
          aria-label={text.searchLabel}
        />
        <kbd class="hidden sm:inline-block rounded border border-border bg-surface px-1.5 font-sans text-[11px] text-text-muted" aria-hidden="true">/</kbd>
      </label>

      <a href={localePath(locale, locale === 'tr' ? '/kullanim/' : '/use-cases/')} class="hidden lg:inline-flex items-center rounded-lg px-3 py-2 text-sm font-medium text-text-soft hover:bg-bg hover:text-accent transition-colors shrink-0">{text.useCases}</a>

      {#if switchHref}<LanguageSwitch href={switchHref} />{/if}

      <button
        class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-border text-text-soft transition-colors hover:bg-accent-soft hover:text-accent md:hidden"
        aria-label={text.openMenu}
        aria-expanded={menuOpen}
        aria-controls="main-sidebar"
        onclick={onmenu}
      >
        <Icon name="menu" size={20} />
      </button>
    </div>
  </div>
</header>
