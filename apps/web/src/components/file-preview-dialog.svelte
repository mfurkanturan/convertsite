<script lang="ts">
  import { onDestroy } from 'svelte';
  import Icon from './icon.svelte';
  import { formatBytes } from '../lib/file-selection';
  import { useUi } from '../i18n/context';

  export let file: File;
  export let onclose: () => void;

  const controls = useUi().controls.fileList;
  const previewUrl = URL.createObjectURL(file);

  onDestroy(() => URL.revokeObjectURL(previewUrl));
</script>

<svelte:window onkeydown={(event) => { if (event.key === 'Escape') onclose(); }} />

<div
  class="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-3 sm:p-6 backdrop-blur-sm"
  role="dialog"
  aria-modal="true"
  aria-label={controls.preview}
>
  <button
    type="button"
    class="fixed inset-0 cursor-default"
    aria-label={controls.closeButton}
    onclick={onclose}
  ></button>

  <div class="relative z-10 flex h-full max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-2xl">
    <div class="flex items-center justify-between border-b border-border bg-bg/60 px-5 py-3.5">
      <div class="flex min-w-0 items-center gap-2.5">
        <span class="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-accent-soft text-accent">
          <Icon name="file" size={16} />
        </span>
        <div class="min-w-0">
          <h3 class="max-w-md truncate text-sm font-semibold text-text sm:max-w-xl" title={file.name}>
            {file.name}
          </h3>
          <span class="text-xs text-text-muted">{formatBytes(file.size)}</span>
        </div>
      </div>

      <button
        type="button"
        class="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-surface text-text-muted transition-colors hover:border-danger hover:text-danger"
        onclick={onclose}
        title={controls.close}
      >
        <Icon name="close" size={16} />
      </button>
    </div>

    <div class="flex flex-1 items-center justify-center overflow-auto bg-bg/40 p-4">
      {#if file.name.toLowerCase().endsWith('.pdf')}
        <iframe
          src={previewUrl}
          title={file.name}
          class="h-full min-h-[60vh] w-full rounded-xl border border-border/80 bg-white shadow-inner"
        ></iframe>
      {:else if file.type.startsWith('image/')}
        <img
          src={previewUrl}
          alt={file.name}
          class="max-h-[75vh] max-w-full rounded-xl object-contain shadow-md"
        />
      {:else}
        <div class="p-8 text-center">
          <span class="mb-3 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-accent-soft text-accent">
            <Icon name="file" size={32} />
          </span>
          <p class="text-sm font-medium text-text">{controls.unsupported}</p>
          <p class="mt-1 text-xs text-text-muted">{file.name} ({formatBytes(file.size)})</p>
        </div>
      {/if}
    </div>

    <div class="flex items-center justify-between border-t border-border bg-bg/40 px-5 py-3 text-xs text-text-muted">
      <span>{controls.closeHint}</span>
      <button
        type="button"
        class="rounded-md border border-border bg-surface px-3 py-1 font-semibold text-text hover:border-accent"
        onclick={onclose}
      >
        {controls.closeButton}
      </button>
    </div>
  </div>
</div>
