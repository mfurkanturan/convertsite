<script lang="ts">
  import Icon from './icon.svelte';
  import Button from './button.svelte';
  import { useUi, useLocale } from '../i18n/context';
  import { formatBytes } from '../lib/file-selection';
  import type { ToolId } from '@convertsite/contracts';

  export let onselecttool: ((toolId: ToolId, file?: File) => void) | undefined = undefined;

  const locale = useLocale();
  const text = useUi().hero;

  let isDragging = false;
  let selectedFile: File | null = null;
  let fileInput: HTMLInputElement;

  const pdfActions: { id: ToolId; label: string; desc: string; icon: string }[] = locale === 'tr' ? [
    { id: 'pdf-to-word', label: 'Word’e Dönüştür', desc: 'Düzenlenebilir DOCX', icon: 'word' },
    { id: 'compress-pdf', label: 'PDF Sıkıştır', desc: 'Boyutu küçült', icon: 'compress' },
    { id: 'edit-pdf-pages', label: 'Sayfaları Sırala', desc: 'Düzenle / Döndür / Sil', icon: 'scissors' },
    { id: 'pdf-to-excel', label: 'Excel’e Aktar', desc: 'Tabloları çek', icon: 'excel' },
    { id: 'pdf-to-images', label: 'JPG / Görsel Yap', desc: 'Görsellere çevir', icon: 'image' },
    { id: 'page-numbers', label: 'Sayfa Numarası', desc: 'Numara bas', icon: 'layers' },
    { id: 'watermark-pdf', label: 'Filigran Ekle', desc: 'Metin bas', icon: 'scan' },
    { id: 'protect-pdf', label: 'PDF Şifrele', desc: 'Parola ile kilitle', icon: 'shield' },
  ] : [
    { id: 'pdf-to-word', label: 'PDF to Word', desc: 'Editable DOCX', icon: 'word' },
    { id: 'compress-pdf', label: 'Compress PDF', desc: 'Reduce file size', icon: 'compress' },
    { id: 'edit-pdf-pages', label: 'Organize Pages', desc: 'Reorder / Rotate / Split', icon: 'scissors' },
    { id: 'pdf-to-excel', label: 'PDF to Excel', desc: 'Extract tables', icon: 'excel' },
    { id: 'pdf-to-images', label: 'PDF to JPG', desc: 'Export as images', icon: 'image' },
    { id: 'page-numbers', label: 'Page Numbers', desc: 'Stamp numbers', icon: 'layers' },
    { id: 'watermark-pdf', label: 'Add Watermark', desc: 'Stamp text watermark', icon: 'scan' },
    { id: 'protect-pdf', label: 'Protect PDF', desc: 'Encrypt with password', icon: 'shield' },
  ];

  function handleDragOver(e: DragEvent) {
    e.preventDefault();
    isDragging = true;
  }

  function handleDragLeave() {
    isDragging = false;
  }

  function handleDrop(e: DragEvent) {
    e.preventDefault();
    isDragging = false;
    const file = e.dataTransfer?.files?.[0];
    if (file) processIncomingFile(file);
  }

  function handleFileInput(e: Event) {
    const target = e.target as HTMLInputElement;
    const file = target.files?.[0];
    if (file) processIncomingFile(file);
  }

  function processIncomingFile(file: File) {
    const ext = file.name.split('.').pop()?.toLowerCase() || '';

    if (ext === 'docx' || ext === 'doc') {
      routeToTool('word-to-pdf', file);
    } else if (ext === 'pptx' || ext === 'ppt') {
      routeToTool('pptx-to-pdf', file);
    } else if (ext === 'xlsx' || ext === 'xls') {
      routeToTool('excel-to-pdf', file);
    } else if (['jpg', 'jpeg', 'png', 'webp'].includes(ext)) {
      routeToTool('images-to-pdf', file);
    } else if (ext === 'pdf') {
      selectedFile = file;
    } else {
      selectedFile = file;
    }
  }

  function routeToTool(toolId: ToolId, file?: File) {
    if (onselecttool) {
      onselecttool(toolId, file || selectedFile || undefined);
    }
    selectedFile = null;
  }
</script>

<section class="relative overflow-hidden rounded-panel border border-border bg-gradient-to-br from-accent-soft/80 via-surface to-surface shadow-sm" aria-labelledby="hero-title">
  <div class="grid lg:grid-cols-[1.1fr_0.9fr] items-center gap-8 p-6 sm:p-10">
    <!-- Left Column: Title & Trust -->
    <div class="min-w-0">
      <span class="inline-flex items-center gap-2 rounded-full bg-accent-soft px-3 py-1 text-xs font-semibold text-accent border border-accent/20">
        <span class="h-1.5 w-1.5 rounded-full bg-accent animate-pulse"></span>
        {text.eyebrow}
      </span>

      <h1 id="hero-title" class="mt-4 font-display text-[clamp(28px,3.5vw,44px)] font-bold leading-[1.12] tracking-[-0.03em] text-text">
        {text.titleA}<br />
        <span class="text-accent">{text.titleB}</span>
      </h1>

      <p class="mt-3.5 max-w-lg text-[15px] sm:text-base leading-relaxed text-text-soft">
        {text.lead}
      </p>

      <div class="mt-6 flex flex-wrap items-center gap-4">
        <Button href="#tools" className="whitespace-nowrap font-medium">{text.cta} <Icon name="arrow" size={17} /></Button>
        <span class="flex items-center gap-1.5 text-xs sm:text-sm font-medium text-text-muted">
          <span class="text-success"><Icon name="check" size={16} /></span>
          {text.noSignup}
        </span>
      </div>
    </div>

    <!-- Right Column: Universal Fast Dropzone -->
    <div class="min-w-0">
      <input
        type="file"
        class="hidden"
        bind:this={fileInput}
        accept=".pdf,.docx,.xlsx,.pptx,.jpg,.jpeg,.png"
        onchange={handleFileInput}
      />

      {#if selectedFile && selectedFile.name.toLowerCase().endsWith('.pdf')}
        <!-- PDF Action Matrix Sheet -->
        <div class="rounded-2xl border border-accent/40 bg-surface p-5 shadow-lg relative animate-in fade-in zoom-in-95 duration-200">
          <div class="flex items-center justify-between pb-3 border-b border-border mb-3.5">
            <div class="flex items-center gap-2.5 min-w-0">
              <span class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-rose-500/10 text-rose-600 font-bold text-xs">
                PDF
              </span>
              <div class="min-w-0">
                <strong class="block truncate text-xs sm:text-sm font-semibold text-text" title={selectedFile.name}>
                  {selectedFile.name}
                </strong>
                <span class="block text-[11px] text-text-muted">{formatBytes(selectedFile.size)}</span>
              </div>
            </div>

            <button
              type="button"
              class="h-7 w-7 rounded-lg flex items-center justify-center text-text-muted hover:text-danger hover:bg-danger-soft transition-colors"
              title={locale === 'tr' ? 'Vazgeç' : 'Cancel'}
              onclick={() => selectedFile = null}
            >
              <Icon name="close" size={15} />
            </button>
          </div>

          <p class="text-xs font-semibold uppercase tracking-wider text-text-muted mb-2.5">
            {locale === 'tr' ? 'Ne yapmak istersiniz?' : 'What would you like to do?'}
          </p>

          <div class="grid grid-cols-2 gap-2">
            {#each pdfActions as action}
              <button
                type="button"
                class="flex flex-col items-start rounded-xl border border-border/70 bg-bg p-2.5 text-left transition-all hover:border-accent hover:bg-accent-soft/30 hover:scale-[1.01] group cursor-pointer"
                onclick={() => routeToTool(action.id)}
              >
                <div class="flex items-center gap-1.5 text-xs font-bold text-text group-hover:text-accent">
                  <Icon name={action.icon} size={14} />
                  <span>{action.label}</span>
                </div>
                <span class="mt-0.5 text-[10px] text-text-muted truncate w-full">{action.desc}</span>
              </button>
            {/each}
          </div>
        </div>
      {:else}
        <!-- Universal Drag & Drop Card -->
        <button
          type="button"
          aria-label={text.dropTitle}
          class="relative flex w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed p-7 sm:p-9 text-center transition-all duration-200 cursor-pointer bg-surface/80 hover:bg-surface {isDragging ? 'border-accent bg-accent-soft/40 scale-[1.02] shadow-md ring-2 ring-accent/30' : 'border-border/80 hover:border-accent/60 hover:shadow-sm'}"
          ondragover={handleDragOver}
          ondragleave={handleDragLeave}
          ondrop={handleDrop}
          onclick={() => fileInput.click()}
        >
          <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-accent-soft text-accent mb-3 shadow-xs transition-transform group-hover:scale-110">
            <Icon name="upload" size={24} />
          </div>

          <strong class="text-sm sm:text-base font-semibold text-text">
            {text.dropTitle}
          </strong>

          <p class="mt-1 text-xs sm:text-[13px] text-text-muted max-w-[260px]">
            {text.dropSub}
          </p>

          <span class="mt-3.5 inline-flex items-center gap-1.5 rounded-lg bg-accent px-3.5 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-accent-strong transition-colors">
            {text.dropPick}
          </span>

          <!-- Format chips -->
          <div class="mt-4 flex flex-wrap items-center justify-center gap-1.5 opacity-80">
            <span class="rounded bg-bg px-1.5 py-0.5 text-[10px] font-semibold text-text-muted border border-border/70">PDF</span>
            <span class="rounded bg-bg px-1.5 py-0.5 text-[10px] font-semibold text-text-muted border border-border/70">Word</span>
            <span class="rounded bg-bg px-1.5 py-0.5 text-[10px] font-semibold text-text-muted border border-border/70">PowerPoint</span>
            <span class="rounded bg-bg px-1.5 py-0.5 text-[10px] font-semibold text-text-muted border border-border/70">Excel</span>
            <span class="rounded bg-bg px-1.5 py-0.5 text-[10px] font-semibold text-text-muted border border-border/70">JPG / PNG</span>
          </div>
        </button>
      {/if}
    </div>
  </div>
</section>

<!-- 3 Architecture Trust Pillars -->
<ul class="mt-4 grid grid-cols-3 gap-3 max-[760px]:grid-cols-1 max-[760px]:gap-2" aria-label={text.highlights}>
  {#each text.features as item}
    <li class="flex items-center gap-3 rounded-card border border-border bg-surface px-4 py-3">
      <span class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent-soft text-accent"><Icon name={item.icon} size={18} /></span>
      <span class="min-w-0 leading-snug"><strong class="block text-sm font-semibold text-text">{item.title}</strong><span class="block text-[13px] text-text-muted">{item.text}</span></span>
    </li>
  {/each}
</ul>
