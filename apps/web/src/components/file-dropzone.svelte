<script lang="ts">
  import Icon from './icon.svelte';
  import Button from './button.svelte';
  import type { Tool } from '../lib/tools';
  import { useUi } from '../i18n/context';
  import { track } from '../lib/analytics';
  export let tool: Tool | undefined = undefined;
  export let compact = false;
  export let variant: 'tool' | 'hero' = 'tool';
  export let accept = '';
  export let multiple: boolean | undefined = undefined;
  export let title = '';
  export let description = '';
  export let buttonLabel = '';
  export let draggingLabel = '';
  export let formats: string[] = [];
  export let formatsLabel = '';
  export let buttonId = '';
  export let onfiles: (files: File[]) => void;
  const text = useUi().dropzone;
  let input: HTMLInputElement;
  let dragging = false;
  $: resolvedAccept = accept || tool?.accept || '';
  $: resolvedMultiple = multiple ?? tool?.multiple ?? false;

  function handleDragLeave(event: DragEvent) {
    const next = event.relatedTarget;
    if (next instanceof Node && event.currentTarget instanceof HTMLElement && event.currentTarget.contains(next)) return;
    dragging = false;
  }

  function receive(event: DragEvent) {
    event.preventDefault(); dragging = false;
    if (event.dataTransfer) selectFiles(Array.from(event.dataTransfer.files));
  }

  function selectFiles(files: File[]) {
    if (!files.length) return;
    track('file_selected', { tool: tool?.id, file_count: files.length });
    onfiles(files);
  }
</script>

<div
  class="file-dropzone flex {variant === 'hero' ? 'min-h-[270px] flex-col items-center justify-center px-5 py-7 text-center sm:min-h-[290px] sm:px-7' : compact ? 'items-center gap-4 px-5 py-4 max-[480px]:flex-col max-[480px]:items-stretch max-[480px]:text-center' : 'min-h-[280px] flex-col items-center justify-center px-5 py-10 text-center'}"
  data-dragging={dragging}
  role="region"
  aria-label={variant === 'hero' ? (title || text.region) : text.region}
  aria-describedby={variant === 'hero' ? 'hero-drop-help hero-drop-formats' : undefined}
  ondragenter={(event) => { event.preventDefault(); dragging = true; }}
  ondragover={(event) => { event.preventDefault(); if (event.dataTransfer) event.dataTransfer.dropEffect = 'copy'; dragging = true; }}
  ondragleave={handleDragLeave}
  ondrop={receive}
>
  {#if variant === 'hero'}
    <span class="flex h-12 w-12 items-center justify-center rounded-card bg-accent-soft text-accent"><Icon name="upload" size={27} /></span>
    <h2 class="mt-4 text-lg font-semibold text-text">{dragging ? (draggingLabel || title) : title}</h2>
    <p id="hero-drop-help" class="mt-1 max-w-sm text-sm text-text-soft">{description}</p>
    <button
      id={buttonId || undefined}
      type="button"
      class="mt-5 inline-flex min-h-12 items-center justify-center gap-2 rounded-control bg-accent px-5 text-[15px] font-semibold text-white transition-colors hover:bg-accent-strong focus-visible:outline-offset-4"
      onclick={() => { track('hero_upload_click'); input.click(); }}
    ><Icon name="plus" size={18} />{buttonLabel}</button>
    <p id="hero-drop-formats" class="mt-4 flex flex-wrap items-center justify-center gap-x-2.5 gap-y-1 text-[13px] text-text-muted">
      <span class="visually-hidden">{formatsLabel}:</span>
      {#each formats as format}<span class="format-label">{format}</span>{/each}
    </p>
    <span class="visually-hidden" aria-live="polite">{dragging ? (draggingLabel || title) : ''}</span>
  {:else if compact}
    <span class="flex h-11 w-11 shrink-0 items-center justify-center rounded-card bg-accent-soft text-accent max-[480px]:hidden"><Icon name="upload" size={22} /></span>
    <div class="min-w-0 flex-1">
      <h2 class="text-[15px] font-semibold text-text">{tool?.multiple ? text.addMore : text.replace}</h2>
      <p class="text-sm text-text-soft">{text.dragOrPick} · {tool?.inputLabel}</p>
    </div>
    <Button id={buttonId || 'tool-file-picker'} variant="secondary" onclick={() => input.click()}><Icon name="plus" size={17} /> {tool?.multiple ? text.add : text.pick}</Button>
  {:else}
    <div class="tool-drop-content">
    <div class="tool-drop-art" aria-hidden="true">
      <img class="tool-drop-mascot" src={`/mascot/tools/${tool?.id}.webp`} alt="" width="600" height="480" loading="lazy" decoding="async" />
    </div>
    <div class="tool-drop-copy">
    <div class="mb-5 flex h-16 w-16 items-center justify-center rounded-panel bg-accent-soft text-accent max-[480px]:hidden"><Icon name="upload" size={30} /></div>
    <h2 class="text-xl font-semibold tracking-[-0.01em] text-text">{tool?.multiple ? text.dropMany : text.dropOne}</h2>
    <p class="mt-1.5 text-[15px] text-text-soft">{text.orPick}</p>
    <Button id={buttonId || 'tool-file-picker'} className="mt-5" onclick={() => input.click()}><Icon name="plus" size={17} /> {tool?.multiple ? text.pickMany : text.pick}</Button>
    <p class="mt-5 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-[13px] text-text-muted">
      <span class="rounded bg-bg px-1.5 py-0.5 font-medium text-text-soft ring-1 ring-border">{tool?.inputLabel}</span>
      <span class="flex items-center gap-1"><Icon name="lock" size={14} /> {text.sentOnStart}</span>
    </p>
    </div>
    </div>
  {/if}
  <input class="visually-hidden" tabindex="-1" type="file" bind:this={input} accept={resolvedAccept} multiple={resolvedMultiple} aria-label={text.inputLabel(tool?.inputLabel ?? formatsLabel)} onchange={(event) => { selectFiles(Array.from(event.currentTarget.files ?? [])); event.currentTarget.value = ''; }} />
</div>
