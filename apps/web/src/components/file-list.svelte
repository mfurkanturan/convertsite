<script lang="ts">
  import Icon from './icon.svelte';
  import { formatBytes } from '../lib/file-selection';
  import { useUi } from '../i18n/context';
  export let files: File[];
  export let onremove: (index: number) => void;
  export let onmove: (index: number, direction: number) => void;
  export let reorder = false;
  export let disabled = false;
  const text = useUi().files;
</script>

<div class="mt-4 rounded-panel border border-border bg-surface px-4" role="group" aria-label={text.selected}>
  <div class="flex items-center justify-between py-3.5 text-sm">
    <strong class="font-semibold text-text">{text.selected}</strong>
    <span aria-live="polite" aria-atomic="true" class="text-[13px] text-text-muted">{text.count(files.length)}</span>
  </div>
  {#each files as file, index}
    <div class="flex items-center gap-2.5 border-t border-border py-3 max-[650px]:gap-1.5">
      <span class="w-6 shrink-0 text-[13px] tabular-nums text-text-muted max-[650px]:hidden">{String(index + 1).padStart(2, '0')}</span>
      <span class="flex shrink-0 rounded-lg bg-accent-soft p-2 text-accent"><Icon name="file" size={20} /></span>
      <div class="min-w-0 flex-1">
        <strong class="block truncate text-sm font-medium text-text" title={file.name}>{file.name}</strong>
        <span class="mt-0.5 block text-[13px] text-text-muted">{formatBytes(file.size)}</span>
      </div>
      {#if reorder}
        <button class="flex h-11 w-11 shrink-0 items-center justify-center rounded-md text-text-soft transition-colors hover:bg-accent-soft hover:text-accent disabled:opacity-40 max-[650px]:h-10 max-[650px]:w-10" aria-label={text.up(file.name)} disabled={disabled || index === 0} onclick={() => onmove(index, -1)}><Icon name="up" size={16} /></button>
        <button class="flex h-11 w-11 shrink-0 items-center justify-center rounded-md text-text-soft transition-colors hover:bg-accent-soft hover:text-accent disabled:opacity-40 max-[650px]:h-10 max-[650px]:w-10" aria-label={text.down(file.name)} disabled={disabled || index === files.length - 1} onclick={() => onmove(index, 1)}><Icon name="down" size={16} /></button>
      {/if}
      <button class="flex h-11 w-11 shrink-0 items-center justify-center rounded-md text-text-muted transition-colors hover:bg-danger-soft hover:text-danger disabled:opacity-40 max-[650px]:h-10 max-[650px]:w-10" aria-label={text.remove(file.name)} {disabled} onclick={() => onremove(index)}><Icon name="close" size={17} /></button>
    </div>
  {/each}
</div>
