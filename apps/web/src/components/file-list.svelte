<script lang="ts">
  import { onDestroy } from 'svelte';
  import Icon from './icon.svelte';
  import FilePreviewDialog from './file-preview-dialog.svelte';
  import { formatBytes } from '../lib/file-selection';
  import { renderPdfPage } from '../lib/pdf-preview';
  import { useUi } from '../i18n/context';

  export let files: File[];
  export let onremove: (index: number) => void;
  export let onmove: (index: number, direction: number) => void;
  export let onreorder: ((from: number, to: number) => void) | undefined = undefined;
  export let reorder = false;
  export let disabled = false;

  const ui = useUi();
  const text = ui.files;
  const controls = ui.controls.fileList;

  // View mode: 'grid' (visual cards) or 'list' (compact table)
  let viewMode: 'grid' | 'list' = 'grid';

  // Drag and drop state
  let draggedIndex: number | null = null;
  let dragOverIndex: number | null = null;

  // The dialog owns its own preview URL and releases it when closed.
  let previewFile: File | null = null;
  let previewOpener: HTMLElement | null = null;

  // Thumbnail cache for images and rendered PDFs
  let imageThumbnails = new Map<File, string>();
  let pdfThumbnails = new Map<File, string>();

  $: {
    const activeFiles = new Set(files);

    for (const [file, url] of imageThumbnails) {
      if (!activeFiles.has(file)) {
        URL.revokeObjectURL(url);
        imageThumbnails.delete(file);
      }
    }
    for (const file of pdfThumbnails.keys()) {
      if (!activeFiles.has(file)) pdfThumbnails.delete(file);
    }
    if (previewFile && !activeFiles.has(previewFile)) previewFile = null;

    // Generate previews for images and PDFs
    for (const file of files) {
      if (file.type.startsWith('image/') && !imageThumbnails.has(file)) {
        imageThumbnails.set(file, URL.createObjectURL(file));
      } else if (file.name.toLowerCase().endsWith('.pdf') && !pdfThumbnails.has(file)) {
        renderPdfPage(file, 1, 220).then((url) => {
          if (url) {
            if (files.includes(file)) {
              pdfThumbnails.set(file, url);
              pdfThumbnails = pdfThumbnails;
            }
          }
        });
      }
    }
  }

  function openPreview(file: File, event?: Event) {
    previewOpener = event?.currentTarget instanceof HTMLElement ? event.currentTarget : null;
    previewFile = file;
  }

  function closePreview() {
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
    for (const url of imageThumbnails.values()) {
      URL.revokeObjectURL(url);
    }
    imageThumbnails.clear();
    pdfThumbnails.clear();
  });
</script>

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
          ({controls.reorder})
        </span>
      {/if}
    </div>

    <!-- Grid vs List toggle -->
    <div class="flex items-center gap-1 rounded-lg border border-border bg-bg p-0.5">
      <button
        type="button"
        class="flex h-11 w-11 items-center justify-center rounded-md text-xs transition-colors focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-focus {viewMode === 'grid' ? 'bg-surface text-accent font-semibold shadow-2xs' : 'text-text-muted hover:text-text'}"
        aria-label={controls.grid}
        aria-pressed={viewMode === 'grid'}
        title={controls.gridTitle}
        onclick={() => viewMode = 'grid'}
      >
        <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
      </button>
      <button
        type="button"
        class="flex h-11 w-11 items-center justify-center rounded-md text-xs transition-colors focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-focus {viewMode === 'list' ? 'bg-surface text-accent font-semibold shadow-2xs' : 'text-text-muted hover:text-text'}"
        aria-label={controls.list}
        aria-pressed={viewMode === 'list'}
        title={controls.listTitle}
        onclick={() => viewMode = 'list'}
      >
        <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
      </button>
    </div>
  </div>

  {#if viewMode === 'grid'}
    <!-- VISUAL DRAG & DROP CARDS GRID -->
    <div class="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4" role="list">
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
                aria-label={`${controls.previewFile}: ${file.name}`}
                title={controls.previewFile}
                onclick={(event) => openPreview(file, event)}
              >
                <svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
              </button>

              <!-- Remove button -->
              <button
                type="button"
                class="flex h-11 w-11 items-center justify-center rounded-md text-text-muted hover:bg-danger-soft hover:text-danger transition-colors focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-focus disabled:opacity-40"
                aria-label={text.remove(file.name)}
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
            onclick={(event) => openPreview(file, event)}
            aria-label={`${controls.preview}: ${file.name}`}
            title={controls.clickPreview}
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
                <span class="rounded bg-danger-soft px-1.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-danger mb-1.5">
                  PDF
                </span>
                <div class="w-12 space-y-1 opacity-40">
                  <div class="h-1 bg-text rounded-full w-full"></div>
                  <div class="h-1 bg-text rounded-full w-4/5 mx-auto"></div>
                  <div class="h-1 bg-text rounded-full w-3/4 mx-auto"></div>
                </div>
                <span class="mt-2 text-[11px] text-text-muted font-medium">
                  {controls.loading}
                </span>
              </div>
            {:else}
              <!-- Document icon placeholder -->
              <div class="flex flex-col items-center justify-center p-2 text-text-muted">
                <Icon name="file" size={26} />
                <span class="mt-1 text-[11px] font-semibold uppercase">{file.name.split('.').pop()}</span>
              </div>
            {/if}

            <!-- Drag grip indicator on hover -->
            {#if reorder}
              <div class="absolute inset-x-0 bottom-0 py-1 bg-gradient-to-t from-black/20 to-transparent flex justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <span class="text-[11px] font-medium text-white/90 bg-black/50 px-1.5 py-0.5 rounded">
                  {controls.drag}
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
            <button type="button" class="block truncate text-sm font-medium text-text text-left hover:text-accent w-full" title={file.name} onclick={(event) => openPreview(file, event)}>
              {file.name}
            </button>
            <span class="mt-0.5 block text-[12px] text-text-muted">{formatBytes(file.size)}</span>
          </div>

          <!-- Preview eye button -->
          <button
            type="button"
              class="flex h-11 w-11 shrink-0 items-center justify-center rounded-md text-text-muted hover:bg-accent-soft hover:text-accent transition-colors focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-focus"
            aria-label={`${controls.preview}: ${file.name}`}
            title={controls.preview}
            onclick={(event) => openPreview(file, event)}
          >
            <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
          </button>

          {#if reorder}
            <button
              type="button"
              class="flex h-11 w-11 shrink-0 items-center justify-center rounded-md text-text-soft transition-colors hover:bg-accent-soft hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-focus disabled:opacity-40"
              aria-label={text.up(file.name)}
              disabled={disabled || index === 0}
              onclick={() => onmove(index, -1)}
            >
              <Icon name="up" size={15} />
            </button>
            <button
              type="button"
              class="flex h-11 w-11 shrink-0 items-center justify-center rounded-md text-text-soft transition-colors hover:bg-accent-soft hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-focus disabled:opacity-40"
              aria-label={text.down(file.name)}
              disabled={disabled || index === files.length - 1}
              onclick={() => onmove(index, 1)}
            >
              <Icon name="down" size={15} />
            </button>
          {/if}

          <button
            type="button"
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
{#if previewFile}
  <FilePreviewDialog file={previewFile} opener={previewOpener} onclose={closePreview} />
{/if}
