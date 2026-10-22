<script lang="ts">
  import Icon from './icon.svelte';
  import Button from './button.svelte';
  import type { Tool } from '../lib/tools';
  import { useUi } from '../i18n/context';
  export let tool: Tool;
  export let compact = false;
  export let onfiles: (files: File[]) => void;
  const text = useUi().dropzone;
  let input: HTMLInputElement;
  let dragging = false;
  function receive(event: DragEvent) {
    event.preventDefault(); dragging = false;
    if (event.dataTransfer) onfiles(Array.from(event.dataTransfer.files));
  }
</script>

<div class="flex rounded-panel border-2 border-dashed bg-surface transition-colors {dragging ? 'border-accent bg-accent-soft/50' : 'border-accent/30 hover:border-accent/50'} {compact ? 'items-center gap-4 px-5 py-4 max-[480px]:flex-col max-[480px]:items-stretch max-[480px]:text-center' : 'min-h-[280px] flex-col items-center justify-center px-5 py-10 text-center'}" role="region" aria-label={text.region} ondragover={(event) => { event.preventDefault(); dragging = true; }} ondragleave={() => dragging = false} ondrop={receive}>
  {#if compact}
    <span class="flex h-11 w-11 shrink-0 items-center justify-center rounded-card bg-accent-soft text-accent max-[480px]:hidden"><Icon name="upload" size={22} /></span>
    <div class="min-w-0 flex-1">
      <h2 class="text-[15px] font-semibold text-text">{tool.multiple ? text.addMore : text.replace}</h2>
      <p class="text-sm text-text-soft">{text.dragOrPick} · {tool.inputLabel}</p>
    </div>
    <Button variant="secondary" onclick={() => input.click()}><Icon name="plus" size={17} /> {tool.multiple ? text.add : text.pick}</Button>
  {:else}
    <div class="mb-5 flex h-16 w-16 items-center justify-center rounded-panel bg-accent-soft text-accent"><Icon name="upload" size={30} /></div>
    <h2 class="text-xl font-semibold tracking-[-0.01em] text-text">{tool.multiple ? text.dropMany : text.dropOne}</h2>
    <p class="mt-1.5 text-[15px] text-text-soft">{text.orPick}</p>
    <Button className="mt-5" onclick={() => input.click()}><Icon name="plus" size={17} /> {tool.multiple ? text.pickMany : text.pick}</Button>
    <p class="mt-5 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-[13px] text-text-muted">
      <span class="rounded bg-bg px-1.5 py-0.5 font-medium text-text-soft ring-1 ring-border">{tool.inputLabel}</span>
      <span class="flex items-center gap-1"><Icon name="lock" size={14} /> {text.sentOnStart}</span>
    </p>
  {/if}
  <input class="visually-hidden" tabindex="-1" type="file" bind:this={input} accept={tool.accept} multiple={tool.multiple} aria-label={text.inputLabel(tool.inputLabel)} onchange={(event) => { onfiles(Array.from(event.currentTarget.files ?? [])); event.currentTarget.value = ''; }} />
</div>
