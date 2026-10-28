<script lang="ts">
  import { onMount, tick } from 'svelte';
  import Icon from './icon.svelte';
  import FileDropzone from './file-dropzone.svelte';
  import { useLocale, useUi } from '../i18n/context';
  import { formatBytes, selectionMaxBytes } from '../lib/file-selection';
  import { apiFor } from '../lib/api-client';
  import type { Capabilities, ToolId } from '@convertsite/contracts';

  export let onselecttool: ((toolId: ToolId, file?: File) => void) | undefined = undefined;

  const locale = useLocale();
  const ui = useUi();
  const text = ui.hero;
  const api = apiFor(locale);
  const quickDropAccept = '.pdf,.docx,.xlsx,.pptx,.jpg,.jpeg,.png';
  const toolByExtension: Partial<Record<string, ToolId>> = {
    docx: 'word-to-pdf',
    xlsx: 'excel-to-pdf',
    pptx: 'pptx-to-pdf',
    jpg: 'images-to-pdf',
    jpeg: 'images-to-pdf',
    png: 'images-to-pdf',
  };
  const pdfActions = [
    { id: 'pdf-to-word', key: 'word' },
    { id: 'pdf-to-excel', key: 'excel' },
    { id: 'pdf-to-images', key: 'images' },
    { id: 'compress-pdf', key: 'compress' },
    { id: 'edit-pdf-pages', key: 'organize' },
    { id: 'merge-pdf', key: 'merge' },
    { id: 'ocr', key: 'text' },
    { id: 'pdf-to-md', key: 'markdown' },
    { id: 'pdf-to-pdf-ocr', key: 'searchable' },
    { id: 'protect-pdf', key: 'protect' },
    { id: 'unlock-pdf', key: 'unlock' },
    { id: 'page-numbers', key: 'pageNumbers' },
    { id: 'watermark-pdf', key: 'watermark' },
  ] as const satisfies ReadonlyArray<{ id: ToolId; key: keyof typeof text.pdfActions }>;

  let selectedFile: File | null = null;
  let error = '';
  let policy: Capabilities | null = null;
  let policyLoaded = false;
  let selectionTitle: HTMLHeadingElement;
  $: fileLimit = policy?.maxFileBytes ?? selectionMaxBytes;
  $: availablePdfActions = policy ? pdfActions.filter((action) => policy!.enabledTools.includes(action.id)) : [];

  async function loadPolicy() {
    policyLoaded = false;
    try {
      policy = await api.capabilities();
    } catch {
      policy = null;
    } finally {
      policyLoaded = true;
    }
  }

  onMount(() => { void loadPolicy(); });

  function handleIncomingFiles(files: File[]) {
    if (files.length > 1) {
      error = text.oneFile;
      return;
    }
    if (files[0]) void processIncomingFile(files[0]);
  }

  async function processIncomingFile(file: File) {
    error = '';
    const extension = file.name.split('.').pop()?.toLowerCase() ?? '';
    if (extension !== 'pdf' && !toolByExtension[extension]) {
      error = text.invalidType;
      return;
    }
    if (file.size === 0) {
      error = text.emptyFile;
      return;
    }
    if (file.size > fileLimit) {
      error = text.tooLarge(formatBytes(fileLimit));
      return;
    }

    if (extension === 'pdf') {
      selectedFile = file;
      await tick();
      selectionTitle?.focus();
      return;
    }

    const tool = toolByExtension[extension];
    if (tool) routeToTool(tool, file);
  }

  function routeToTool(toolId: ToolId, file = selectedFile ?? undefined) {
    if (file) onselecttool?.(toolId, file);
    selectedFile = null;
    error = '';
  }

  async function clearSelectedFile() {
    selectedFile = null;
    await tick();
    document.getElementById('hero-file-picker')?.focus();
  }
</script>

<section class="border-b border-border" aria-labelledby="hero-title">
  <div class="hero-layout">
    <div class="min-w-0">

      <h1 id="hero-title" class="hero-title">
        {text.titleA}<br />{text.titleB}
      </h1>
      <p class="hero-description">{text.lead}</p>
      <a href="#tools" class="hero-link">
        {text.cta}<Icon name="arrow" size={16} />
      </a>
    </div>

    <div class="min-w-0">
      {#if selectedFile}
        <section class="rounded-panel border border-border-strong bg-surface p-5 sm:p-6" aria-labelledby="pdf-actions-title">
          <div class="flex items-start gap-3 border-b border-border pb-4">
            <span class="flex h-11 w-11 shrink-0 items-center justify-center rounded-card bg-danger-soft font-bold text-danger">PDF</span>
            <div class="min-w-0 flex-1">
              <p class="mb-1 flex items-center gap-1.5 text-[13px] font-medium text-success" role="status"><Icon name="check" size={15} />{text.fileSelected}</p>
              <h2 id="pdf-actions-title" bind:this={selectionTitle} tabindex="-1" class="text-base font-semibold text-text">{text.choosePdfAction}</h2>
              <p class="mt-1 truncate text-sm text-text-soft" title={selectedFile.name}>{selectedFile.name}</p>
              <p class="text-[13px] text-text-muted">PDF · {formatBytes(selectedFile.size)}</p>
            </div>
          </div>

          {#if !policyLoaded}
            <p class="mt-4 rounded-lg bg-bg px-3 py-3 text-sm text-text-soft" role="status">{text.checkingActions}</p>
          {:else if !policy}
            <div class="mt-4 rounded-lg border border-warning/20 bg-warning-soft px-3 py-3 text-sm text-warning" role="alert">
              <p>{text.actionsUnavailable}</p>
              <button type="button" class="mt-2 inline-flex min-h-11 items-center font-semibold underline underline-offset-2" onclick={() => void loadPolicy()}>{text.checkAgain}</button>
            </div>
          {:else if availablePdfActions.length === 0}
            <p class="mt-4 rounded-lg bg-bg px-3 py-3 text-sm text-text-soft" role="status">{text.noAvailableActions}</p>
          {:else}
            <ul class="mt-4 grid grid-cols-1 gap-2 min-[480px]:grid-cols-2" aria-label={text.choosePdfAction}>
              {#each availablePdfActions as action}
                {@const actionText = text.pdfActions[action.key]}
                <li>
                  <button
                    type="button"
                    class="flex min-h-[58px] w-full items-start gap-2.5 rounded-lg border border-border px-3 py-3 text-left transition-colors hover:border-accent/50 hover:bg-accent-soft/50 focus-visible:outline-offset-1"
                    onclick={() => routeToTool(action.id)}
                  >
                    <span class="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-accent-soft text-accent"><Icon name={actionText.icon} size={17} /></span>
                    <span class="min-w-0"><span class="block text-sm font-semibold leading-snug text-text">{actionText.label}</span><span class="mt-0.5 block text-[13px] leading-snug text-text-muted">{actionText.desc}</span></span>
                  </button>
                </li>
              {/each}
            </ul>
          {/if}

          <div class="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-border pt-3">
            <button type="button" class="inline-flex min-h-11 items-center rounded-lg px-3 text-sm font-medium text-text-soft hover:bg-bg hover:text-text" onclick={() => document.getElementById('hero-file-picker')?.click()}>{text.changeFile}</button>
            <button type="button" class="inline-flex min-h-11 items-center gap-1.5 rounded-lg px-3 text-sm font-medium text-danger hover:bg-danger-soft" onclick={clearSelectedFile}><Icon name="close" size={15} />{text.removeFile}</button>
          </div>
        </section>
      {:else}
        <FileDropzone
          variant="hero"
          accept={quickDropAccept}
          multiple={false}
          title={text.dropTitle}
          description={policy ? text.dropSub(formatBytes(fileLimit)) : text.policyPending}
          buttonLabel={text.dropPick}
          draggingLabel={text.dragActive}
          formats={['PDF', 'DOCX', 'XLSX', 'PPTX', 'JPG', 'PNG']}
          formatsLabel={text.fileFormats}
          buttonId="hero-file-picker"
          onfiles={handleIncomingFiles}
        />
      {/if}

      <p class="mt-3 flex items-center justify-center gap-2 text-center text-[13px] text-text-soft" role="note">
        <Icon name="lock" size={15} /><span>{text.uploadLater}</span>
      </p>
      {#if error}<p class="mt-3 rounded-lg border border-danger/20 bg-danger-soft px-3 py-2.5 text-sm text-danger" role="alert">{error}</p>{/if}
    </div>
  </div>
</section>
