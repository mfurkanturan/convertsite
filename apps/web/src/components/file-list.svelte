<script lang="ts">
  import { onDestroy } from 'svelte';
  import Icon from './icon.svelte';
  import { formatBytes } from '../lib/file-selection';
  import { renderPdfPage } from '../lib/pdf-preview';
  import { useUi, useLocale } from '../i18n/context';

  export let files: File[];
  export let onremove: (index: number) => void;
  export let onmove: (index: number, direction: number) => void;
  export let onreorder: ((from: number, to: number) => void) | undefined = undefined;
  export let reorder = false;
  export let disabled = false;

  const locale = useLocale();
  const text = useUi().files;

  // View mode: 'grid' (visual cards) or 'list' (compact table)
  let viewMode: 'grid' | 'list' = 'grid';

  // Drag and drop state
  let draggedIndex: number | null = null;
  let dragOverIndex: number | null = null;

  // Quick look preview modal
  let previewFile: File | null = null;
  let previewUrl: string | null = null;

  // Thumbnail cache for images and rendered PDFs
  let imageThumbnails = new Map<File, string>();
  let pdfThumbnails = new Map<File, string>();

  $: {
    // Generate previews for images and PDFs
    for (const file of files) {
      if (file.type.startsWith('image/') && !imageThumbnails.has(file)) {
        imageThumbnails.set(file, URL.createObjectURL(file));
      } else if (file.name.toLowerCase().endsWith('.pdf') && !pdfThumbnails.has(file)) {
        renderPdfPage(file, 1, 220).then((url) => {
          if (url) {
            pdfThumbnails.set(file, url);
            pdfThumbnails = pdfThumbnails;
          }
        });
      }
    }
  }

  function openPreview(file: File) {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    previewFile = file;
    previewUrl = URL.createObjectURL(file);
  }

  function closePreview() {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      previewUrl = null;
    }
    previewFile = null;
  }

  function handleDragStart(index: number, event: DragEvent) {
    if (disabled || !reorder) return;
    draggedIndex = index;
    if (event.dataTransfer) {
      event.dataTransfer.effectAllowed = 'move';
      event.dataTransfer.setData('text/plain', String(index));
    }
  }

  function handleDragOver(index: number, event: DragEvent) {
    if (disabled || !reorder || draggedIndex === null) return;
    event.preventDefault();
    if (event.dataTransfer) event.dataTransfer.dropEffect = 'move';
    dragOverIndex = index;
  }

  function handleDrop(index: number, event: DragEvent) {
    event.preventDefault();
    if (draggedIndex !== null && draggedIndex !== index) {
      if (onreorder) {
        onreorder(draggedIndex, index);
      } else {
        // Fallback using onmove step-by-step
        const diff = index - draggedIndex;
        onmove(draggedIndex, diff);
      }
    }
    draggedIndex = null;
    dragOverIndex = null;
  }

  function handleDragEnd() {
    draggedIndex = null;
    dragOverIndex = null;
  }

  onDestroy(() => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    for (const url of imageThumbnails.values()) {
      URL.revokeObjectURL(url);
    }
    imageThumbnails.clear();
  });
</script>

<svelte:window onkeydown={(e) => { if (e.key === 'Escape' && previewFile) closePreview(); }} />

<div class="mt-4 rounded-panel border border-border bg-surface p-4 sm:p-5" role="group" aria-label={text.selected}>
  <!-- Header with count and view switcher -->
  <div class="flex items-center justify-between pb-3.5 border-b border-border/80">
    <div class="flex items-center gap-2">
      <strong class="font-semibold text-text text-sm sm:text-base">{text.selected}</strong>
      <span class="rounded-full bg-accent-soft px-2.5 py-0.5 text-xs font-semibold text-accent">
        {files.length}
      </span>
      {#if reorder}
        <span class="hidden sm:inline-block text-xs text-text-muted">
          ({locale === 'tr' ? 'Sıralamak için kartları sürükle veya okları kullan' : 'Drag cards to reorder'})
        </span>
      {/if}
    </div>

    <!-- Grid vs List toggle -->
    <div class="flex items-center gap-1 rounded-lg border border-border bg-bg p-0.5">
      <button
        type="button"
        class="flex h-11 w-11 items-center justify-center rounded-md text-xs transition-colors focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-focus {viewMode === 'grid' ? 'bg-surface text-accent font-semibold shadow-2xs' : 'text-text-muted hover:text-text'}"
        aria-label={locale === 'tr' ? 'Kart görünümü' : 'Grid view'}
        aria-pressed={viewMode === 'grid'}
        title={locale === 'tr' ? 'Görsel Kart Görünümü' : 'Visual Grid View'}
        onclick={() => viewMode = 'grid'}
      >
        <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
      </button>
      <button
        type="button"
        class="flex h-11 w-11 items-center justify-center rounded-md text-xs transition-colors focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-focus {viewMode === 'list' ? 'bg-surface text-accent font-semibold shadow-2xs' : 'text-text-muted hover:text-text'}"
        aria-label={locale === 'tr' ? 'Liste görünümü' : 'List view'}
        aria-pressed={viewMode === 'list'}
        title={locale === 'tr' ? 'Kompakt Liste Görünümü' : 'Compact List View'}
        onclick={() => viewMode = 'list'}
      >
        <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
      </button>
    </div>
  </div>

  {#if viewMode === 'grid'}
    <!-- VISUAL DRAG & DROP CARDS GRID -->
    <div class="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
      {#each files as file, index}
        {@const isImage = file.type.startsWith('image/')}
        {@const isPdf = file.name.toLowerCase().endsWith('.pdf')}
        {@const isDragged = draggedIndex === index}
        {@const isOver = dragOverIndex === index}
        <div
          role="listitem"
          class="group relative flex flex-col justify-between rounded-xl border bg-bg p-2.5 sm:p-3 transition-all duration-150 select-none {isDragged ? 'opacity-40 scale-95 border-dashed border-accent' : isOver ? 'border-accent ring-2 ring-accent/30 scale-[1.02]' : 'border-border/80 hover:border-accent/60 hover:shadow-sm'}"
          draggable={reorder && !disabled}
          ondragstart={(e) => handleDragStart(index, e)}
          ondragover={(e) => handleDragOver(index, e)}
          ondrop={(e) => handleDrop(index, e)}
          ondragend={handleDragEnd}
        >
          <!-- Top badge and actions -->
          <div class="flex items-center justify-between gap-1 mb-2">
            <span class="flex h-5 w-5 items-center justify-center rounded-full bg-surface text-[11px] font-bold text-text-muted border border-border/70 tabular-nums">
              {index + 1}
            </span>

            <div class="flex items-center gap-1">
              <!-- Quick look / Preview button -->
              <button
                type="button"
                class="flex h-11 w-11 items-center justify-center rounded-md text-text-muted hover:bg-accent-soft hover:text-accent transition-colors focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-focus"
                title={locale === 'tr' ? 'Tam sayfa incele' : 'Preview file'}
                onclick={() => openPreview(file)}
              >
                <svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
              </button>

              <!-- Remove button -->
              <button
                type="button"
                class="flex h-11 w-11 items-center justify-center rounded-md text-text-muted hover:bg-danger-soft hover:text-danger transition-colors focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-focus disabled:opacity-40"
                title={text.remove(file.name)}
                {disabled}
                onclick={() => onremove(index)}
              >
                <Icon name="close" size={13} />
              </button>
            </div>
          </div>

          <!-- Document / Thumbnail canvas container -->
          <button
            type="button"
            class="relative flex h-28 sm:h-32 w-full items-center justify-center rounded-lg border border-border/50 bg-surface overflow-hidden cursor-pointer group-hover:border-accent/40 transition-colors"
            onclick={() => openPreview(file)}
            title={locale === 'tr' ? 'Önizlemek için tıkla' : 'Click to preview'}
          >
            {#if isImage && imageThumbnails.has(file)}
              <img
                src={imageThumbnails.get(file)}
                alt={file.name}
                class="h-full w-full object-cover transition-transform group-hover:scale-105"
              />
            {:else if isPdf && pdfThumbnails.has(file)}
              <img
                src={pdfThumbnails.get(file)}
                alt={file.name}
                class="h-full w-full object-contain p-1.5 transition-transform group-hover:scale-105 bg-white"
              />
            {:else if isPdf}
              <!-- Realistic PDF page loading placeholder -->
              <div class="flex flex-col items-center justify-center text-center p-2">
                <span class="rounded bg-rose-500/10 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-rose-600 mb-1.5">
                  PDF
                </span>
                <div class="w-12 space-y-1 opacity-40">
                  <div class="h-1 bg-text rounded-full w-full"></div>
                  <div class="h-1 bg-text rounded-full w-4/5 mx-auto"></div>
                  <div class="h-1 bg-text rounded-full w-3/4 mx-auto"></div>
                </div>
                <span class="mt-2 text-[10px] text-text-muted font-medium">
                  {locale === 'tr' ? 'Yükleniyor...' : 'Loading...'}
                </span>
              </div>
            {:else}
              <!-- Document icon placeholder -->
              <div class="flex flex-col items-center justify-center p-2 text-text-muted">
                <Icon name="file" size={26} />
                <span class="mt-1 text-[10px] font-semibold uppercase">{file.name.split('.').pop()}</span>
              </div>
            {/if}

            <!-- Drag grip indicator on hover -->
            {#if reorder}
              <div class="absolute inset-x-0 bottom-0 py-1 bg-gradient-to-t from-black/20 to-transparent flex justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <span class="text-[9px] font-medium text-white/90 bg-black/50 px-1.5 py-0.5 rounded">
                  {locale === 'tr' ? 'Taşı' : 'Drag'}
                </span>
              </div>
            {/if}
          </button>

          <!-- File details -->
          <div class="mt-2 text-left">
            <strong class="block truncate text-xs font-semibold text-text" title={file.name}>
              {file.name}
            </strong>
            <span class="block text-[11px] text-text-muted">
              {formatBytes(file.size)}
            </span>
          </div>
        </div>
      {/each}
    </div>
  {:else}
    <!-- COMPACT LIST VIEW -->
    <div class="divide-y divide-border">
      {#each files as file, index}
        <div class="flex items-center gap-2.5 py-3 max-[650px]:gap-1.5">
          <span class="w-6 shrink-0 text-[13px] tabular-nums text-text-muted max-[650px]:hidden">
            {String(index + 1).padStart(2, '0')}
          </span>

          <!-- Thumbnail or icon -->
          <div class="h-9 w-9 shrink-0 rounded-lg border border-border/60 bg-bg overflow-hidden flex items-center justify-center">
            {#if file.type.startsWith('image/') && imageThumbnails.has(file)}
              <img src={imageThumbnails.get(file)} alt="" class="h-full w-full object-cover" />
            {:else if file.name.toLowerCase().endsWith('.pdf') && pdfThumbnails.has(file)}
              <img src={pdfThumbnails.get(file)} alt="" class="h-full w-full object-contain p-0.5 bg-white" />
            {:else}
              <span class="text-accent"><Icon name="file" size={18} /></span>
            {/if}
          </div>

          <div class="min-w-0 flex-1">
            <button type="button" class="block truncate text-sm font-medium text-text text-left hover:text-accent w-full" title={file.name} onclick={() => openPreview(file)}>
              {file.name}
            </button>
            <span class="mt-0.5 block text-[12px] text-text-muted">{formatBytes(file.size)}</span>
          </div>

          <!-- Preview eye button -->
          <button
            type="button"
              class="flex h-11 w-11 shrink-0 items-center justify-center rounded-md text-text-muted hover:bg-accent-soft hover:text-accent transition-colors focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-focus"
            title={locale === 'tr' ? 'Önizle' : 'Preview'}
            onclick={() => openPreview(file)}
          >
            <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
          </button>

          {#if reorder}
            <button
              class="flex h-11 w-11 shrink-0 items-center justify-center rounded-md text-text-soft transition-colors hover:bg-accent-soft hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-focus disabled:opacity-40"
              aria-label={text.up(file.name)}
              disabled={disabled || index === 0}
              onclick={() => onmove(index, -1)}
            >
              <Icon name="up" size={15} />
            </button>
            <button
              class="flex h-11 w-11 shrink-0 items-center justify-center rounded-md text-text-soft transition-colors hover:bg-accent-soft hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-focus disabled:opacity-40"
              aria-label={text.down(file.name)}
              disabled={disabled || index === files.length - 1}
              onclick={() => onmove(index, 1)}
            >
              <Icon name="down" size={15} />
            </button>
          {/if}

          <button
            class="flex h-11 w-11 shrink-0 items-center justify-center rounded-md text-text-muted transition-colors hover:bg-danger-soft hover:text-danger focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-focus disabled:opacity-40"
            aria-label={text.remove(file.name)}
            {disabled}
            onclick={() => onremove(index)}
          >
            <Icon name="close" size={16} />
          </button>
        </div>
      {/each}
    </div>
  {/if}
</div>

<!-- FULLSCREEN QUICK LOOK MODAL -->
{#if previewFile && previewUrl}
  <div
    class="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-3 sm:p-6 backdrop-blur-sm"
    role="dialog"
    aria-modal="true"
    aria-label="Dosya Önizlemesi"
  >
    <!-- Backdrop dismiss -->
    <button
      type="button"
      class="fixed inset-0 cursor-default"
      aria-label="Kapat"
      onclick={closePreview}
    ></button>

    <!-- Modal Box -->
    <div class="relative z-10 flex h-full max-h-[90vh] w-full max-w-4xl flex-col rounded-2xl border border-border bg-surface shadow-2xl overflow-hidden">
      <!-- Modal Header -->
      <div class="flex items-center justify-between border-b border-border px-5 py-3.5 bg-bg/60">
        <div class="flex items-center gap-2.5 min-w-0">
          <span class="flex h-7 w-7 items-center justify-center rounded-lg bg-accent-soft text-accent shrink-0">
            <Icon name="file" size={16} />
          </span>
          <div class="min-w-0">
            <h3 class="truncate text-sm font-semibold text-text max-w-md sm:max-w-xl" title={previewFile.name}>
              {previewFile.name}
            </h3>
            <span class="text-xs text-text-muted">{formatBytes(previewFile.size)}</span>
          </div>
        </div>

        <button
          type="button"
          class="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-surface text-text-muted hover:border-danger hover:text-danger transition-colors"
          onclick={closePreview}
          title={locale === 'tr' ? 'Kapat (Esc)' : 'Close (Esc)'}
        >
          <Icon name="close" size={16} />
        </button>
      </div>

      <!-- Modal Body (Viewer) -->
      <div class="flex-1 overflow-auto p-4 flex items-center justify-center bg-bg/40">
        {#if previewFile.name.toLowerCase().endsWith('.pdf')}
          <!-- Native In-Browser High-Res PDF Viewer -->
          <iframe
            src={previewUrl}
            title={previewFile.name}
            class="h-full min-h-[60vh] w-full rounded-xl border border-border/80 bg-white shadow-inner"
          ></iframe>
        {:else if previewFile.type.startsWith('image/')}
          <!-- Image Viewer -->
          <img
            src={previewUrl}
            alt={previewFile.name}
            class="max-h-[75vh] max-w-full rounded-xl object-contain shadow-md"
          />
        {:else}
          <!-- Other File Info Placeholder -->
          <div class="text-center p-8">
            <span class="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-accent-soft text-accent mb-3">
              <Icon name="file" size={32} />
            </span>
            <p class="text-sm font-medium text-text">
              {locale === 'tr' ? 'Bu dosya türü için tarayıcı içi canlı önizleme desteklenmiyor.' : 'Direct preview is not available for this file type.'}
            </p>
            <p class="text-xs text-text-muted mt-1">
              {previewFile.name} ({formatBytes(previewFile.size)})
            </p>
          </div>
        {/if}
      </div>

      <!-- Modal Footer -->
      <div class="flex items-center justify-between border-t border-border px-5 py-3 bg-bg/40 text-xs text-text-muted">
        <span>{locale === 'tr' ? 'Kapatmak için Esc tuşuna bas veya dışarıya tıkla' : 'Press Esc or click outside to close'}</span>
        <button
          type="button"
          class="rounded-md bg-surface px-3 py-1 font-semibold text-text border border-border hover:border-accent transition-colors"
          onclick={closePreview}
        >
          {locale === 'tr' ? 'Kapat' : 'Close'}
        </button>
      </div>
    </div>
  </div>
{/if}
