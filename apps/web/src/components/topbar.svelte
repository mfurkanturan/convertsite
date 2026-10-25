<script lang="ts">
  import Icon from './icon.svelte';
  import Logo from './logo.svelte';
  import LanguageSwitch from './language-switch.svelte';
  import ToolSearch from './tool-search.svelte';
  import { useLocale, useUi } from '../i18n/context';
  import { localePath } from '../i18n/locales';

  export let query = '';
  export let menuOpen = false;
  export let current: string | undefined = undefined;
  export let switchHref: string | undefined = undefined;
  export let onmenu: () => void;
  export let onsearch: (value: string) => void;
  export let ontool: (id: string) => void;

  const locale = useLocale();
  const text = useUi().topbar;
  const homeHref = `${localePath(locale, '/')}#tools`;
  const guidesHref = localePath(locale, locale === 'tr' ? '/kullanim/' : '/use-cases/');
  const securityHref = localePath(locale, locale === 'tr' ? '/guvenlik' : '/security');
</script>

<header class="sticky top-0 z-30 w-full border-b border-border bg-surface">
  <div class="page-container flex h-[72px] items-center gap-3 max-[540px]:h-16">
    <div class="flex min-w-0 shrink-0 items-center gap-4 xl:gap-7">
      <Logo href={localePath(locale, '/')} {locale} />
      {#if current}
        <nav class="hidden items-center gap-2 text-sm text-text-muted xl:flex" aria-label={text.location}>
          <span class="max-w-40 truncate font-semibold text-text" aria-current="page">{current}</span>
        </nav>
      {/if}
    </div>

    <nav class="hidden min-w-0 flex-1 items-center justify-center gap-1 lg:flex" aria-label={text.categoriesNav}>
      <a href={homeHref} class="inline-flex min-h-11 items-center rounded-lg px-3 text-sm font-medium transition-colors hover:bg-bg hover:text-accent">{text.allTools}</a>
      <a href={guidesHref} class="inline-flex min-h-11 items-center rounded-lg px-3 text-sm font-medium transition-colors hover:bg-bg hover:text-accent">{text.useCases}</a>
      <a href={securityHref} class="inline-flex min-h-11 items-center rounded-lg px-3 text-sm font-medium transition-colors hover:bg-bg hover:text-accent">{text.security}</a>
    </nav>

    <div class="ml-auto flex min-w-0 flex-1 items-center justify-end gap-2 sm:gap-3 lg:ml-0 lg:flex-initial">
      <ToolSearch {query} onsearch={onsearch} ontool={ontool} />
      {#if switchHref}<LanguageSwitch href={switchHref} />{/if}
      <button
        class="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-border text-text-soft transition-colors hover:bg-accent-soft hover:text-accent lg:hidden"
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
