<script lang="ts">
  import { onMount } from 'svelte';
  import Sidebar from './sidebar.svelte';
  import Topbar from './topbar.svelte';
  import Hero from './hero.svelte';
  import ToolGrid from './tool-grid.svelte';
  import HelpSection from './help-section.svelte';
  import ToolWorkspace from './tool-workspace.svelte';
  import Footer from './footer.svelte';
  import { tools, type Category, type Tool } from '../lib/tools';

  export let initialToolId: string | undefined = undefined;

  let category: Category = 'all';
  let query = '';
  let menuOpen = false;
  let activeTool: Tool | undefined = initialToolId ? tools.find((t) => t.id === initialToolId) : undefined;

  function setCategory(value: Category) {
    if (window.location.pathname !== '/' && window.location.pathname !== '') {
      window.location.href = '/#tools';
      return;
    }
    category = value;
    activeTool = undefined;
    menuOpen = false;
    history.replaceState(null, '', '#tools');
    requestAnimationFrame(() => document.getElementById('tools')?.scrollIntoView({ behavior: 'smooth', block: 'start' }));
  }

  function handleBack() {
    if (window.location.pathname !== '/' && window.location.pathname !== '') {
      window.location.href = '/';
      return;
    }
    setCategory('all');
  }

  function openTool(id: string) {
    if (window.location.pathname !== '/' && window.location.pathname !== '') {
      window.location.href = `/${id}`;
      return;
    }
    history.pushState(null, '', `#tool/${id}`);
    readLocation();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function readLocation() {
    if (window.location.hash) {
      activeTool = tools.find((tool) => `#tool/${tool.id}` === window.location.hash);
    } else if (initialToolId) {
      activeTool = tools.find((tool) => tool.id === initialToolId);
    }
    menuOpen = false;
  }

  function search(value: string) {
    query = value;
    if (activeTool) { activeTool = undefined; history.replaceState(null, '', '#tools'); }
    if (value) requestAnimationFrame(() => document.getElementById('tools')?.scrollIntoView({ behavior: 'smooth', block: 'start' }));
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

<div class="min-h-screen w-full flex flex-col min-w-0 bg-bg">
  <Topbar
    {query}
    {category}
    {menuOpen}
    current={activeTool?.name}
    oncategory={setCategory}
    onsearch={search}
    onmenu={() => menuOpen = !menuOpen}
  />
  <main id="main-content" class="mx-auto w-full max-w-[1240px] flex-1 px-6 sm:px-8 pt-8 max-[540px]:px-4 max-[540px]:pt-5">
    {#if activeTool}
      {#key activeTool.id}<ToolWorkspace tool={activeTool} onback={handleBack} />{/key}
      <slot />
    {:else}
      <Hero />
      <ToolGrid bind:query {category} oncategory={setCategory} ontool={openTool} />
    {/if}
    <HelpSection />
  </main>
  <Footer />
</div>
