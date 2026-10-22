<script lang="ts">
  import Icon from './icon.svelte';
  import FileDropzone from './file-dropzone.svelte';
  import FileList from './file-list.svelte';
  import LiveJob from './live-job.svelte';
  import InlineNotice from './inline-notice.svelte';
  import type { Tool } from '../lib/tools';
  import { validateSelection } from '../lib/file-selection';
  import { getSettings, requestOptions } from '../lib/tool-settings';
  import { useLocale, useUi } from '../i18n/context';
  export let tool: Tool;
  export let onback: () => void;
  // Landing pages put their own search-focused H1 above the tool.
  export let heading: { title: string; lead: string } | undefined = undefined;
  const locale = useLocale();
  const ui = useUi();
  const text = ui.workspace;
  let files: File[] = [];
  let error = '';
  let pageRange = '';
  let customInput = '';
  let selectedSettings: Record<string, string> = {};
  let busy = false;
  $: settings = getSettings(tool.id, locale);
  $: options = requestOptions(tool.id, selectedSettings, pageRange, locale, customInput);
  $: invalidPageRange = !!pageRange && !/^\d+(?:-\d+)?(?:\s*,\s*\d+(?:-\d+)?)*$/.test(pageRange);
  $: tip = text.tips[tool.id] ?? text.tips.default;
  $: hasPageRange = tool.id === 'edit-pdf-pages' || tool.id === 'pdf-to-images';
  $: hasCustom = tool.id === 'protect-pdf' || tool.id === 'unlock-pdf' || tool.id === 'watermark-pdf';
  $: hasSettings = settings.length > 0 || hasPageRange || hasCustom;

  function addFiles(incoming: File[]) {
    if (!incoming.length || busy) return;
    const result = validateSelection(incoming, files, tool, ui.selection);
    files = result.files; error = result.error;
  }

  function move(index: number, direction: number) {
    const next = [...files];
    [next[index], next[index + direction]] = [next[index + direction], next[index]];
    files = next;
  }
</script>

<section aria-labelledby="workspace-title">
  <button class="-ml-1 inline-flex min-h-11 items-center gap-2 rounded-lg px-1 text-sm text-text-soft transition-colors hover:text-accent" onclick={onback}><Icon name="back" size={17} /> {text.back}</button>
  <header class="mt-3 mb-7 flex items-center gap-5 max-[650px]:items-start max-[650px]:gap-4">
    <span class="tool-icon large max-[650px]:!h-12 max-[650px]:!w-12" data-color={tool.color}><Icon name={tool.icon} size={30} /></span>
    <div class="min-w-0">
      <h1 id="workspace-title" class="font-display text-[clamp(26px,3vw,34px)] font-semibold leading-tight tracking-[-0.02em] text-text">{heading?.title ?? tool.name}</h1>
      <p class="mt-1.5 text-base text-text-soft">{heading?.lead ?? tool.description}</p>
    </div>
  </header>

  <div class="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:grid-rows-[auto_1fr] max-[650px]:gap-4">
    <div class="min-w-0">
      {#if !busy}<FileDropzone {tool} compact={files.length > 0} onfiles={addFiles} />{/if}
      {#if error}<div class="mt-4"><InlineNotice variant="danger" role="alert">{error}</InlineNotice></div>{/if}
      {#if files.length}<FileList {files} disabled={busy} reorder={tool.multiple} onmove={move} onremove={(index) => { files = files.filter((_, position) => position !== index); }} />{/if}
    </div>

    <aside class="rounded-panel border border-border bg-surface p-6 max-[650px]:p-5 lg:sticky lg:top-24 lg:col-start-2 lg:row-span-2 lg:row-start-1" aria-labelledby="settings-title">
      <div class="flex items-center justify-between gap-3">
        <h2 id="settings-title" class="text-lg font-semibold text-text">{hasSettings ? text.settings : text.output}</h2>
        {#if hasSettings}<span class="rounded-md bg-bg px-2 py-0.5 text-xs font-medium text-text-muted ring-1 ring-border">{text.optional}</span>{/if}
      </div>
      {#if hasSettings}<p class="mt-1 text-sm text-text-soft">{text.defaults}</p>{/if}
      {#each settings as setting}
        <label for={setting.key} class="mt-5 mb-1.5 block text-sm font-medium text-text">{setting.label}</label>
        <select id={setting.key} disabled={busy} value={selectedSettings[setting.key] ?? setting.options[0].value} onchange={(event) => selectedSettings = { ...selectedSettings, [setting.key]: event.currentTarget.value }} class="field">{#each setting.options as option}<option value={option.value}>{option.label}</option>{/each}</select>
      {/each}
      {#if hasPageRange}
        <label for="page-range" class="mt-5 mb-1.5 block text-sm font-medium text-text">{text.pages}</label>
        <input id="page-range" disabled={busy} placeholder={text.pagesPlaceholder} bind:value={pageRange} aria-describedby={invalidPageRange ? 'page-range-error' : 'page-range-help'} aria-invalid={invalidPageRange} class="field" />
        {#if invalidPageRange}<small id="page-range-error" class="mt-2 block text-[13px] text-danger" role="alert">{text.pagesError}</small>
        {:else}<small id="page-range-help" class="mt-2 block text-[13px] leading-relaxed text-text-muted">{text.pagesHelp}</small>{/if}
      {/if}
      {#if tool.id === 'protect-pdf' || tool.id === 'unlock-pdf'}
        <label for="pdf-password" class="mt-5 mb-1.5 block text-sm font-medium text-text">
          {tool.id === 'protect-pdf' ? (locale === 'tr' ? 'Parola belirleyin' : 'Set password') : (locale === 'tr' ? 'Mevcut parola' : 'Current password')}
        </label>
        <input id="pdf-password" type="password" disabled={busy} placeholder={locale === 'tr' ? 'Şifrenizi yazın...' : 'Enter password...'} bind:value={customInput} class="field" />
      {/if}
      {#if tool.id === 'watermark-pdf'}
        <label for="pdf-watermark" class="mt-5 mb-1.5 block text-sm font-medium text-text">
          {locale === 'tr' ? 'Filigran metni' : 'Watermark text'}
        </label>
        <input id="pdf-watermark" type="text" disabled={busy} placeholder={locale === 'tr' ? 'Örn: GİZLİDİR veya TASLAK' : 'e.g. CONFIDENTIAL'} bind:value={customInput} class="field" />
      {/if}
      <div class="flex items-center justify-between text-sm text-text-soft {hasSettings ? 'mt-6 border-t border-border pt-5' : 'mt-3'}"><span>{text.outputFormat}</span><strong class="rounded-md bg-accent-soft px-2 py-1 text-[13px] font-semibold text-accent-strong">{tool.output}</strong></div>
    </aside>

    <div class="min-w-0 lg:col-start-1 lg:row-start-2">
      <LiveJob {files} {tool} {options} startDisabled={invalidPageRange} bind:busy onclear={() => { files = []; }} />
      <div class="mt-4 flex gap-3 rounded-card border border-border bg-surface p-4 text-text-soft">
        <span class="mt-0.5 shrink-0 text-accent"><Icon name="info" size={18} /></span>
        <p class="text-sm leading-relaxed"><strong class="font-semibold text-text">{text.know}</strong><br />{tip}</p>
      </div>
    </div>
  </div>
</section>
