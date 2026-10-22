<script lang="ts">
  import Icon from './icon.svelte';
  export let query = '';
  export let menuOpen = false;
  export let current: string | undefined = undefined;
  export let onmenu: () => void;
  export let onsearch: (value: string) => void;
</script>

<header class="sticky top-0 z-20 flex h-[72px] items-center gap-4 border-b border-border bg-surface/95 px-10 backdrop-blur-md max-[1180px]:px-7 max-[540px]:h-16 max-[540px]:gap-2 max-[540px]:px-4">
  <button class="-ml-2 flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-text-soft transition-colors hover:bg-accent-soft hover:text-accent lg:hidden" aria-label="Menüyü aç" aria-expanded={menuOpen} aria-controls="main-sidebar" onclick={onmenu}><Icon name="menu" /></button>
  <nav class="flex min-w-0 items-center gap-2 text-sm text-text-muted max-sm:hidden" aria-label="Konum">
    <span class="shrink-0">Çalışma alanı</span><Icon name="chevron" size={14} />
    <strong class="truncate font-medium text-text" aria-current="page">{current ?? 'Araçlar'}</strong>
  </nav>
  <div class="ml-auto flex min-w-0 items-center gap-3 max-sm:flex-1">
    <label class="top-search flex h-11 w-64 min-w-0 items-center gap-2 rounded-lg border border-border bg-bg px-3 text-text-muted transition-colors focus-within:border-accent focus-within:bg-surface hover:border-border-strong max-sm:w-full">
      <Icon name="search" size={17} />
      <input class="h-full min-w-0 flex-1 border-0 bg-transparent text-sm text-text outline-none placeholder:text-text-muted" type="search" value={query} oninput={(event) => onsearch(event.currentTarget.value)} placeholder="Bir araç ara…" aria-label="Araç ara" />
      <kbd class="rounded border border-border bg-surface px-1.5 font-sans text-xs text-text-muted max-sm:hidden" aria-hidden="true">/</kbd>
    </label>
    <span class="flex shrink-0 items-center gap-1.5 rounded-md border border-border bg-bg px-2.5 py-1.5 text-xs font-medium text-text-soft max-md:hidden"><span class="h-1.5 w-1.5 rounded-full bg-accent"></span>Geliştirme</span>
  </div>
</header>
