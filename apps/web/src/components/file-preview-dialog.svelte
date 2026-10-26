<script lang="ts">
  import { onDestroy, onMount } from 'svelte';
  import Icon from './icon.svelte';
  import { formatBytes } from '../lib/file-selection';
  import { useUi } from '../i18n/context';

  export let file: File;
  export let onclose: () => void;
  // Element that opened the dialog; focus returns to it on close (Safari does not focus clicked buttons).
  export let opener: HTMLElement | null = null;

  const controls = useUi().controls.fileList;
  const previewUrl = URL.createObjectURL(file);
  const titleId = 'file-preview-title';
  const fallbackOpener = document.activeElement instanceof HTMLElement ? document.activeElement : null;

  let dialog: HTMLDivElement;
  let closeButton: HTMLButtonElement;

  const focusableSelector = 'button:not([disabled]):not([tabindex="-1"]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), iframe, [tabindex]:not([tabindex="-1"])';

  function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      event.stopPropagation();
      onclose();
      return;
    }
    if (event.key !== 'Tab') return;

    const items = Array.from(dialog.querySelectorAll<HTMLElement>(focusableSelector));
    if (items.length === 0) {
      event.preventDefault();
      return;
    }
    const first = items[0];
    const last = items[items.length - 1];
    const active = document.activeElement;
    if (event.shiftKey && (active === first || !dialog.contains(active))) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && (active === last || !dialog.contains(active))) {
      event.preventDefault();
      first.focus();
    }
  }

  onMount(() => closeButton.focus());

  onDestroy(() => {
    URL.revokeObjectURL(previewUrl);
    const target = opener ?? fallbackOpener;
    if (target?.isConnected) target.focus();
  });
</script>

<div
  bind:this={dialog}
  class="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-3 sm:p-6 backdrop-blur-sm"
  role="dialog"
  aria-modal="true"
  aria-labelledby={titleId}
  tabindex="-1"
  onkeydown={handleKeydown}
>
  <!-- Pointer-only backdrop dismiss; keyboard users close with Escape or the buttons. -->
  <button
    type="button"
    class="fixed inset-0 cursor-default"
    tabindex="-1"
    aria-hidden="true"
    onclick={onclose}
  ></button>

  <div class="relative z-10 flex h-full max-h-[90vh] max-h-[90dvh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-2xl">
    <div class="flex items-center justify-between gap-3 border-b border-border bg-bg/60 px-5 py-3.5">
      <div class="flex min-w-0 items-center gap-2.5">
        <span class="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-accent-soft text-accent">
          <Icon name="file" size={16} />
        </span>
        <div class="min-w-0">
          <h2 id={titleId} class="truncate text-sm font-semibold text-text" title={file.name}>
            {file.name}
          </h2>
          <span class="text-xs text-text-muted">{formatBytes(file.size)}</span>
        </div>
      </div>

      <button
        bind:this={closeButton}
        type="button"
        class="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-border bg-surface text-text-muted transition-colors hover:border-danger hover:text-danger focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-focus"
        onclick={onclose}
        aria-label={controls.closeButton}
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
          class="h-full min-h-[60vh] min-h-[60dvh] w-full rounded-xl border border-border/80 bg-white shadow-inner"
        ></iframe>
      {:else if file.type.startsWith('image/')}
        <img
          src={previewUrl}
          alt={file.name}
          class="max-h-[75vh] max-h-[75dvh] max-w-full rounded-xl object-contain shadow-md"
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

    <div class="flex items-center justify-between gap-3 border-t border-border bg-bg/40 px-5 py-3 text-xs text-text-muted">
      <span class="max-sm:hidden">{controls.closeHint}</span>
      <button
        type="button"
        class="min-h-11 rounded-md border border-border bg-surface px-4 font-semibold text-text hover:border-accent focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-focus max-sm:w-full"
        onclick={onclose}
      >
        {controls.closeButton}
      </button>
    </div>
  </div>
</div>
