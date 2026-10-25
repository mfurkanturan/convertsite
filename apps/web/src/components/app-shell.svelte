<script lang="ts">
  import { onMount } from 'svelte';
  import Sidebar from './sidebar.svelte';
  import Topbar from './topbar.svelte';
  import Hero from './hero.svelte';
  import ToolGrid from './tool-grid.svelte';
  import HelpSection from './help-section.svelte';
  import ToolWorkspace from './tool-workspace.svelte';
  import { getTools, type Category, type Tool } from '../lib/tools';
  import { provideLocale } from '../i18n/context';
  import { localePath, type Locale } from '../i18n/locales';
  import { track } from '../lib/analytics';

  export let initialToolId: string | undefined = undefined;
  export let locale: Locale = 'tr';
  // Page-specific H1 for tool and use-case landing pages.
  export let heading: { title: string; lead: string } | undefined = undefined;
  export let switchAlternates: Partial<Record<Locale, string>> = {};
  provideLocale(locale);
  const tools = getTools(locale);
  const home = localePath(locale, '/');

  let category: Category = 'all';
  let query = '';
  let menuOpen = false;
  let stagedFile: File | undefined = undefined;
  let activeTool: Tool | undefined = initialToolId ? tools.find((t) => t.id === initialToolId) : undefined;
  $: currentSwitchAlternates = activeTool
    ? { en: `/${activeTool.id}`, tr: `/tr/${activeTool.id}`, es: `/es/${activeTool.id}` }
    : switchAlternates;
  const onHome = () => window.location.pathname === home || window.location.pathname === home.replace(/\/$/, '') || window.location.pathname === '';

  function setCategory(value: Category) {
    track('tool_filter', { category: value });
    if (!onHome()) {
      window.location.href = `${home}#tools`;
      return;
    }
    category = value;
    activeTool = undefined;
    stagedFile = undefined;
    menuOpen = false;
    history.replaceState(null, '', '#tools');
    requestAnimationFrame(() => document.getElementById('tools')?.scrollIntoView({ behavior: 'smooth', block: 'start' }));
  }

  function handleBack() {
    stagedFile = undefined;
    if (!onHome()) {
      window.location.href = home;
      return;
    }
    setCategory('all');
  }

  function openTool(id: string) {
    track('tool_open', { tool: id });
    if (!onHome()) {
      window.location.href = localePath(locale, `/${id}`);
      return;
    }
    history.pushState(null, '', `#tool/${id}`);
    readLocation();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function openToolWithFile(id: string, file?: File) {
    stagedFile = file;
    openTool(id);
  }

  function readLocation() {
    if (window.location.hash.startsWith('#tool/')) {
      activeTool = tools.find((tool) => `#tool/${tool.id}` === window.location.hash);
    } else if (initialToolId) {
      activeTool = tools.find((tool) => tool.id === initialToolId);
    } else {
      activeTool = undefined;
    }
    menuOpen = false;
  }

  function search(value: string) {
    query = value;
    if (activeTool && onHome()) { activeTool = undefined; history.replaceState(null, '', '#tools'); }
    if (value && onHome()) requestAnimationFrame(() => document.getElementById('tools')?.scrollIntoView({ behavior: 'smooth', block: 'start' }));
  }

  onMount(() => {
    readLocation();
    const shortcut = (event: KeyboardEvent) => {
      if (event.key === '/' && !(event.target instanceof HTMLInputElement) && !(event.target instanceof HTMLTextAreaElement)) {
        event.preventDefault();
        document.querySelector<HTMLInputElement>('.top-search input')?.focus();
      }
      if (event.key === 'Escape') menuOpen = false;
    };
    window.addEventListener('hashchange', readLocation);
    window.addEventListener('popstate', readLocation);
    window.addEventListener('keydown', shortcut);
    return () => {
      window.removeEventListener('hashchange', readLocation);
      window.removeEventListener('popstate', readLocation);
      window.removeEventListener('keydown', shortcut);
    };
  });
</script>

<Sidebar {category} open={menuOpen} oncategory={setCategory} ontool={openTool} onclose={() => menuOpen = false} />

<div class="w-full flex flex-col min-w-0 bg-bg">
  <Topbar
    {query}
    {menuOpen}
    switchAlternates={currentSwitchAlternates}
    current={activeTool?.name}
    onsearch={search}
    ontool={openTool}
    onmenu={() => menuOpen = !menuOpen}
  />
  <main id="main-content" class="page-container flex-1 pt-8 max-[540px]:pt-5">
    {#if activeTool}
      {#key activeTool.id}<ToolWorkspace tool={activeTool} initialFile={stagedFile} onback={handleBack} heading={activeTool.id === initialToolId ? heading : undefined} />{/key}
      <slot />
    {:else}
      <Hero onselecttool={openToolWithFile} />
      <ToolGrid bind:query {category} oncategory={setCategory} ontool={openTool} />
      <slot name="home" />
    {/if}
    <HelpSection compact={!!activeTool} />
  </main>
</div>
