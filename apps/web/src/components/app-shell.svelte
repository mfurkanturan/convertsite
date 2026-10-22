<script lang="ts">
  import { onMount } from 'svelte';
  import Sidebar from './sidebar.svelte';
  import Topbar from './topbar.svelte';
  import Hero from './hero.svelte';
  import ToolGrid from './tool-grid.svelte';
  import HelpSection from './help-section.svelte';
  import ToolWorkspace from './tool-workspace.svelte';
  import { tools, type Category, type Tool } from '../lib/tools';

  let category: Category = 'all';
  let query = '';
  let menuOpen = false;
  let activeTool: Tool | undefined;

  function setCategory(value: Category) {
    category = value;
    activeTool = undefined;
    menuOpen = false;
    history.replaceState(null, '', '#tools');
    requestAnimationFrame(() => document.getElementById('tools')?.scrollIntoView({ behavior: 'smooth', block: 'start' }));
  }

  function openTool(id: string) {
    history.pushState(null, '', `#tool/${id}`);
    readLocation();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function readLocation() {
    activeTool = tools.find((tool) => `#tool/${tool.id}` === window.location.hash);
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
<div class="min-w-0 lg:pl-60"><Topbar {query} {menuOpen} current={activeTool?.name} onsearch={search} onmenu={() => menuOpen = !menuOpen} />
  <main id="main-content" class="mx-auto max-w-[1200px] px-10 pt-8 max-[1180px]:px-7 max-[540px]:px-4 max-[540px]:pt-5">
    {#if activeTool}
      {#key activeTool.id}<ToolWorkspace tool={activeTool} onback={() => setCategory('all')} />{/key}
    {:else}
      <Hero />
      <ToolGrid bind:query {category} oncategory={setCategory} ontool={openTool} />
    {/if}
    <HelpSection />
  </main>
</div>
