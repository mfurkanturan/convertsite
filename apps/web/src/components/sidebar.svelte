<script lang="ts">
  import Icon from './icon.svelte';
  import Logo from './logo.svelte';
  import { categories, tools, type Category } from '../lib/tools';
  import { brand } from '../lib/brand';

  export let category: Category = 'all';
  export let open = false;
  export let oncategory: (value: Category) => void;
  export let ontool: (id: string) => void;
  export let onclose: () => void;
</script>

{#if open}
  <!-- Backdrop -->
  <button
    class="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm transition-opacity md:hidden"
    aria-label="Menüyü kapat"
    onclick={onclose}
  ></button>

  <!-- Slide-Over Drawer -->
  <aside
    id="main-sidebar"
    class="fixed inset-y-0 left-0 z-50 flex w-72 flex-col overflow-y-auto border-r border-border bg-surface px-5 pt-6 pb-6 shadow-2xl transition-transform duration-200 md:hidden"
    aria-label="Mobil menü"
  >
    <div class="flex items-center justify-between pb-4 border-b border-border">
      <Logo />
      <button
        class="flex h-9 w-9 items-center justify-center rounded-lg text-text-muted hover:bg-bg hover:text-text transition-colors"
        aria-label="Menüyü kapat"
        onclick={onclose}
      >
        <Icon name="close" size={18} />
      </button>
    </div>

    <!-- Kategoriler -->
    <p class="mt-6 mb-2 pl-2 text-xs font-bold tracking-wider uppercase text-text-muted">Kategoriler</p>
    <nav class="flex flex-col gap-1" aria-label="Mobil kategoriler">
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
    </nav>

    <!-- Sık Kullanılan Araçlar -->
    <p class="mt-6 mb-2 pl-2 text-xs font-bold tracking-wider uppercase text-text-muted">Sık Kullanılanlar</p>
    <nav class="flex flex-col gap-1" aria-label="Popüler araçlar">
      {#each tools.filter((tool) => tool.popular) as tool}
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

    <!-- Alt Güvenlik & Telif -->
    <div class="mt-auto pt-6 border-t border-border">
      <div class="rounded-xl border border-border bg-gradient-to-br from-accent-soft/50 to-surface p-3.5">
        <span class="mb-1 flex items-center gap-2 text-accent">
          <Icon name="shield" size={18} />
          <strong class="text-xs font-bold text-text">Sıfır Kalıcı Depolama</strong>
        </span>
        <p class="text-xs text-text-soft">Dosyalarınız 60 dakika içinde otomatik imha edilir.</p>
      </div>
      <div class="mt-4 flex flex-col gap-2 text-xs text-text-muted">
        <a href="/guvenlik" class="hover:text-accent transition-colors" onclick={onclose}>Güvenlik Mimarisi</a>
        <a href="/gizlilik" class="hover:text-accent transition-colors" onclick={onclose}>Gizlilik Politikası</a>
        <a href="/kullanim-sartlari" class="hover:text-accent transition-colors" onclick={onclose}>Kullanım Şartları</a>
        <a href="/iletisim" class="hover:text-accent transition-colors" onclick={onclose}>İletişim & Destek</a>
      </div>
      <p class="mt-4 text-[11px] text-text-muted">© {brand.year} {brand.name}</p>
    </div>
  </aside>
{/if}
