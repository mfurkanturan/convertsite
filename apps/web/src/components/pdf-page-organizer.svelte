<script lang="ts">
  import { onMount } from 'svelte';
  import Icon from './icon.svelte';
  import { renderAllPdfPages, type PdfPagePreview } from '../lib/pdf-preview';
  import { useLocale } from '../i18n/context';

  export let file: File;
  export let disabled = false;
  export let onchangerange: (range: string, rotation: number) => void;
  export let onremovefile: (() => void) | undefined = undefined;

  const locale = useLocale();

  let loading = true;
  let pages: PdfPagePreview[] = [];
  let globalRotation = 0;

  // Drag and drop state
  let draggedIndex: number | null = null;
  let dragOverIndex: number | null = null;

  // Zoom / Quick preview modal
  let zoomPage: PdfPagePreview | null = null;

  onMount(async () => {
    await loadPages();
  });

  async function loadPages() {
    loading = true;
    try {
      pages = await renderAllPdfPages(file);
    } catch (e) {
      console.error('Failed to load pdf pages', e);
    } finally {
      loading = false;
      notifyChange();
    }
  }

  function notifyChange() {
    const range = pages.map((p) => p.pageNumber).join(', ');
    onchangerange(range, globalRotation);
  }

  function rotatePage(index: number) {
    if (disabled) return;
    pages[index].rotation = (pages[index].rotation + 90) % 360;
    pages = [...pages];
    notifyChange();
  }

  function movePage(index: number, direction: number) {
    if (disabled) return;
    const target = index + direction;
    if (target < 0 || target >= pages.length) return;
    const next = [...pages];
    [next[index], next[target]] = [next[target], next[index]];
    pages = next;
    notifyChange();
  }

  function removePage(index: number) {
    if (disabled || pages.length <= 1) return;
    pages = pages.filter((_, i) => i !== index);
    notifyChange();
  }

  function resetPages() {
    if (disabled) return;
    loadPages();
  }

  function handleDragStart(index: number, event: DragEvent) {
    if (disabled) return;
    draggedIndex = index;
    if (event.dataTransfer) {
      event.dataTransfer.effectAllowed = 'move';
      event.dataTransfer.setData('text/plain', String(index));
    }
  }

  function handleDragOver(index: number, event: DragEvent) {
    if (disabled || draggedIndex === null) return;
    event.preventDefault();
    if (event.dataTransfer) event.dataTransfer.dropEffect = 'move';
    dragOverIndex = index;
  }

  function handleDrop(index: number, event: DragEvent) {
    event.preventDefault();
    if (draggedIndex !== null && draggedIndex !== index) {
      const next = [...pages];
      const [item] = next.splice(draggedIndex, 1);
      next.splice(index, 0, item);
      pages = next;
      notifyChange();
    }
    draggedIndex = null;
    dragOverIndex = null;
  }

  function handleDragEnd() {
    draggedIndex = null;
    dragOverIndex = null;
  }
</script>

<svelte:window onkeydown={(e) => { if (e.key === 'Escape') zoomPage = null; }} />

<div class="mt-4 rounded-panel border border-border bg-surface p-4 sm:p-5" role="region" aria-label="PDF Sayfa Düzenleyici">
  <!-- Header Bar -->
  <div class="flex items-center justify-between pb-3.5 border-b border-border/80 flex-wrap gap-2.5">
    <div class="flex items-center gap-2 flex-wrap">
      <strong class="font-semibold text-text text-sm sm:text-base">
        {locale === 'tr' ? 'PDF Sayfaları' : locale === 'es' ? 'Páginas del PDF' : 'PDF Pages'}
      </strong>
      <span class="rounded-full bg-accent-soft px-2.5 py-0.5 text-xs font-semibold text-accent">
        {pages.length} {locale === 'tr' ? 'Sayfa' : locale === 'es' ? 'páginas' : 'Pages'}
      </span>
      <span class="text-xs text-text-muted hidden sm:inline">
        • {locale === 'tr' ? 'Sürükleyerek veya oklarla sırayı değiştir' : locale === 'es' ? 'Arrastra o usa las flechas para cambiar el orden' : 'Drag or use arrows to reorder'}
      </span>
    </div>

    <div class="flex items-center gap-2">
      {#if pages.length > 0}
        <button
          type="button"
          class="text-xs font-medium text-text-muted hover:text-accent transition-colors px-2 py-1 rounded hover:bg-bg border border-border/60"
          onclick={resetPages}
          title={locale === 'tr' ? 'Varsayılan sayfa sırasına geri dön' : locale === 'es' ? 'Restablecer el orden original' : 'Reset to original order'}
        >
          {locale === 'tr' ? 'Sırayı Sıfırla' : locale === 'es' ? 'Restablecer orden' : 'Reset Order'}
        </button>
      {/if}

      {#if onremovefile}
        <button
          type="button"
          class="text-xs font-medium text-danger hover:text-danger-strong transition-colors px-2 py-1 rounded hover:bg-danger-soft border border-border/60"
          onclick={onremovefile}
          title={locale === 'tr' ? 'Dosyayı kaldır ve yenisini seç' : locale === 'es' ? 'Quitar el archivo y elegir otro' : 'Remove file'}
        >
          {locale === 'tr' ? 'Dosyayı Değiştir' : locale === 'es' ? 'Cambiar archivo' : 'Change File'}
        </button>
      {/if}
    </div>
  </div>

  {#if loading}
    <!-- Loading skeleton -->
    <div class="py-12 flex flex-col items-center justify-center text-center">
      <div class="h-8 w-8 animate-spin rounded-full border-3 border-accent border-t-transparent mb-3"></div>
      <p class="text-sm font-medium text-text">
        {locale === 'tr' ? 'PDF sayfalarının önizlemeleri yükleniyor...' : locale === 'es' ? 'Cargando vistas previas de las páginas del PDF…' : 'Rendering PDF page previews...'}
      </p>
      <p class="text-xs text-text-muted mt-1">
        {locale === 'tr' ? 'Sayfalar taranıp küçük resimler hazırlanıyor' : locale === 'es' ? 'Preparando miniaturas de las páginas' : 'Extracting pages into visual thumbnails'}
      </p>
    </div>
  {:else if pages.length === 0}
    <div class="py-10 text-center text-text-muted text-sm">
      {locale === 'tr' ? 'Sayfa bulunamadı veya PDF yüklenemedi.' : locale === 'es' ? 'No se encontraron páginas o no se pudo cargar el PDF.' : 'No pages found or could not load PDF.'}
    </div>
  {:else}
    <!-- Pages Drag & Drop Grid -->
    <div class="mt-4 grid grid-cols-1 min-[520px]:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
      {#each pages as page, index}
        {@const isDragged = draggedIndex === index}
        {@const isOver = dragOverIndex === index}
        <div
          role="listitem"
          class="group relative flex flex-col justify-between rounded-xl border bg-bg p-2 transition-all duration-150 select-none {isDragged ? 'opacity-30 scale-95 border-dashed border-accent' : isOver ? 'border-accent ring-2 ring-accent/40 scale-[1.03]' : 'border-border/80 hover:border-accent hover:shadow-sm'}"
          draggable={!disabled}
          ondragstart={(e) => handleDragStart(index, e)}
          ondragover={(e) => handleDragOver(index, e)}
          ondrop={(e) => handleDrop(index, e)}
          ondragend={handleDragEnd}
        >
          <!-- Top badge and quick actions -->
          <div class="flex items-center justify-between mb-1.5 px-0.5">
            <span class="flex h-5 items-center justify-center rounded-md bg-accent-soft px-1.5 text-[11px] font-bold text-accent border border-accent/20 tabular-nums">
              #{index + 1}
            </span>

            <div class="flex items-center gap-0.5">
              <!-- Rotate button -->
              <button
                type="button"
                class="flex h-11 w-11 items-center justify-center rounded-md text-text-muted hover:bg-accent-soft hover:text-accent transition-colors focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-focus"
                title={locale === 'tr' ? '90° Döndür' : locale === 'es' ? 'Girar 90°' : 'Rotate 90°'}
                onclick={() => rotatePage(index)}
              >
                <svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/></svg>
              </button>

              <!-- Zoom / Preview button -->
              <button
                type="button"
                class="flex h-11 w-11 items-center justify-center rounded-md text-text-muted hover:bg-accent-soft hover:text-accent transition-colors focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-focus"
                title={locale === 'tr' ? 'Büyüt' : locale === 'es' ? 'Ampliar' : 'Zoom'}
                onclick={() => zoomPage = page}
              >
                <svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg>
              </button>

              <!-- Delete / Remove page -->
              <button
                type="button"
                class="flex h-11 w-11 items-center justify-center rounded-md text-text-muted hover:bg-danger-soft hover:text-danger transition-colors focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-focus disabled:opacity-30"
                title={locale === 'tr' ? 'Sayfayı kaldır' : locale === 'es' ? 'Quitar página' : 'Remove page'}
                disabled={disabled || pages.length <= 1}
                onclick={() => removePage(index)}
              >
                <Icon name="close" size={13} />
              </button>
            </div>
          </div>

          <!-- Page Canvas Image -->
          <button
            type="button"
            class="relative flex h-36 sm:h-44 w-full items-center justify-center rounded-lg border border-border/60 bg-white overflow-hidden cursor-grab active:cursor-grabbing p-1"
            onclick={() => zoomPage = page}
            title={locale === 'tr' ? 'Sürükleyerek sırasını değiştir' : locale === 'es' ? 'Arrastrar para cambiar el orden' : 'Drag to reorder'}
          >
            <img
              src={page.dataUrl}
              alt={`Sayfa ${page.pageNumber}`}
              class="h-full w-full object-contain transition-transform duration-200"
              style="transform: rotate({page.rotation}deg);"
            />

            <!-- Drag overlay hint on hover -->
            <div class="absolute inset-0 bg-black/15 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <span class="text-[10px] font-semibold text-white bg-black/70 px-2.5 py-1 rounded-full backdrop-blur-xs shadow">
                {locale === 'tr' ? 'Sürükle' : locale === 'es' ? 'Arrastrar' : 'Drag'}
              </span>
            </div>
          </button>

          <!-- Bottom: Reorder arrows & Original Page Number -->
          <div class="mt-2 flex items-center justify-between px-0.5">
            <span class="text-[10px] font-medium text-text-muted">
              {locale === 'tr' ? 'Orijinal:' : locale === 'es' ? 'Original:' : 'Orig:'} #{page.pageNumber}
            </span>

            <div class="flex items-center gap-1">
              <button
                type="button"
                class="flex h-11 w-11 items-center justify-center rounded bg-surface hover:bg-accent-soft hover:text-accent text-text-muted border border-border/60 disabled:opacity-30 transition-colors focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-focus"
                disabled={disabled || index === 0}
                title={locale === 'tr' ? 'Sola / Başa taşı' : locale === 'es' ? 'Mover a la izquierda' : 'Move left'}
                onclick={() => movePage(index, -1)}
              >
                <svg class="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="15 18 9 12 15 6"/></svg>
              </button>
              <button
                type="button"
                class="flex h-11 w-11 items-center justify-center rounded bg-surface hover:bg-accent-soft hover:text-accent text-text-muted border border-border/60 disabled:opacity-30 transition-colors focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-focus"
                disabled={disabled || index === pages.length - 1}
                title={locale === 'tr' ? 'Sağa / Sona taşı' : locale === 'es' ? 'Mover a la derecha' : 'Move right'}
                onclick={() => movePage(index, 1)}
              >
                <svg class="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg>
              </button>
            </div>
          </div>
        </div>
      {/each}
    </div>
  {/if}
</div>

<!-- ZOOM PREVIEW MODAL -->
{#if zoomPage}
  <div
    class="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm"
    role="dialog"
    aria-modal="true"
  >
    <button type="button" class="fixed inset-0 cursor-default" aria-label="Kapat" onclick={() => zoomPage = null}></button>
    <div class="relative z-10 flex max-h-[90vh] max-w-2xl flex-col rounded-2xl border border-border bg-surface shadow-2xl overflow-hidden p-4">
      <div class="flex items-center justify-between pb-3 border-b border-border mb-3">
        <strong class="text-sm font-semibold text-text">
          {locale === 'tr' ? 'Sayfa Önizlemesi' : locale === 'es' ? 'Vista previa de la página' : 'Page Preview'} — #{zoomPage.pageNumber}
        </strong>
        <button
          type="button"
          class="h-7 w-7 rounded-md flex items-center justify-center text-text-muted hover:text-danger hover:bg-danger-soft transition-colors"
          onclick={() => zoomPage = null}
        >
          <Icon name="close" size={16} />
        </button>
      </div>
      <div class="flex-1 overflow-auto flex items-center justify-center bg-white rounded-lg p-2">
        <img
          src={zoomPage.dataUrl}
          alt={`Sayfa ${zoomPage.pageNumber}`}
          class="max-h-[70vh] max-w-full object-contain"
          style="transform: rotate({zoomPage.rotation}deg);"
        />
      </div>
    </div>
  </div>
{/if}
