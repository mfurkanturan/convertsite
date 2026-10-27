<script lang="ts">
  import { onDestroy, onMount } from 'svelte';
  import Icon from './icon.svelte';
  import type { PdfPagePreview } from '../lib/pdf-preview';
  import { useUi } from '../i18n/context';

  export let page: PdfPagePreview;
  export let onclose: () => void;
  // Element that opened the dialog; focus returns to it on close (Safari does not focus clicked buttons).
  export let opener: HTMLElement | null = null;

  const text = useUi().controls.organizer;
  const titleId = 'page-zoom-title';
  const fallbackOpener = document.activeElement instanceof HTMLElement ? document.activeElement : null;

  let dialog: HTMLDivElement;
  let closeButton: HTMLButtonElement;

  const focusableSelector = 'button:not([disabled]):not([tabindex="-1"]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

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
    const target = opener ?? fallbackOpener;
    if (target?.isConnected) target.focus();
  });
</script>

<div
  bind:this={dialog}
  class="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm"
  role="dialog"
  aria-modal="true"
  aria-labelledby={titleId}
  tabindex="-1"
  onkeydown={handleKeydown}
>
  <!-- Pointer-only backdrop dismiss; keyboard users close with Escape or the close button. -->
  <button type="button" class="fixed inset-0 cursor-default" tabindex="-1" aria-hidden="true" onclick={onclose}></button>
  <div class="relative z-10 flex max-h-[90vh] max-h-[90dvh] max-w-2xl flex-col overflow-hidden rounded-2xl border border-border bg-surface p-4 shadow-2xl">
    <div class="mb-3 flex items-center justify-between gap-3 border-b border-border pb-3">
      <strong id={titleId} class="text-sm font-semibold text-text">
        {text.preview} — #{page.pageNumber}
      </strong>
      <button
        bind:this={closeButton}
        type="button"
        class="flex h-11 w-11 shrink-0 items-center justify-center rounded-md text-text-muted transition-colors hover:bg-danger-soft hover:text-danger focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-focus"
        aria-label={text.close}
        title={text.close}
        onclick={onclose}
      >
        <Icon name="close" size={16} />
      </button>
    </div>
    <div class="flex flex-1 items-center justify-center overflow-auto rounded-lg bg-white p-2">
      <img
        src={page.dataUrl}
        alt={`${text.pageLabel} ${page.pageNumber}`}
        class="max-h-[70vh] max-h-[70dvh] max-w-full object-contain"
        style="transform: rotate({page.rotation}deg);"
      />
    </div>
  </div>
</div>
