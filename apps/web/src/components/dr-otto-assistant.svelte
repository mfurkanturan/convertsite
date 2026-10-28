<script lang="ts">
  import { onMount, tick } from 'svelte';
  import type { Capabilities, ToolId } from '@convertsite/contracts';
  import type { Locale } from '../i18n/locales';
  import { localePath, localeRoutes } from '../i18n/locales';
  import { getTools } from '../lib/tools';
  import { apiFor } from '../lib/api-client';
  import { ottoCopy } from '../lib/dr-otto-help';
  import Icon from './icon.svelte';

  export let locale: Locale;
  const text = ottoCopy[locale];
  const finderIds: ToolId[] = ['pdf-to-word', 'word-to-pdf', 'merge-pdf', 'compress-pdf', 'ocr', 'pdf-to-md', 'edit-pdf-pages'];
  const tools = getTools(locale).filter((tool) => finderIds.includes(tool.id)).sort((a, b) => finderIds.indexOf(a.id) - finderIds.indexOf(b.id));
  const helpTools: Partial<Record<number, ToolId>> = { 1: 'pdf-to-word', 2: 'ocr', 3: 'compress-pdf' };
  const privacyHref = localePath(locale, localeRoutes[locale].privacy);
  const contactHref = localePath(locale, localeRoutes[locale].contact);
  let open = false;
  let section: 'home' | 'tools' | 'help' | 'privacy' | 'troubleshooting' = 'home';
  let policy: Capabilities | null = null;
  let blocked = false;
  let launcher: HTMLButtonElement;
  let panelHeading: HTMLHeadingElement;
  let controller: AbortController | undefined;

  async function show() {
    open = true; section = 'home'; policy = null;
    controller?.abort(); controller = new AbortController();
    const request = controller;
    void apiFor(locale).capabilities(request.signal).then((value) => { if (!request.signal.aborted) policy = value; }).catch(() => { if (!request.signal.aborted) policy = null; });
    await tick(); panelHeading?.focus();
  }
  function close(restore = true) {
    open = false; section = 'home'; controller?.abort();
    if (restore) void tick().then(() => launcher?.focus());
  }
  async function navigate(next: typeof section) {
    section = next; await tick(); panelHeading?.focus();
  }
  function keyboard(event: KeyboardEvent) { if (event.key === 'Escape' && open) { event.preventDefault(); close(); } }
  onMount(() => {
    const check = () => {
      blocked = !!document.querySelector('[role="dialog"], #analytics-preferences, #main-sidebar');
      if (blocked && open) close(false);
    };
    check();
    const observer = new MutationObserver(check);
    observer.observe(document.body, { childList: true, subtree: true });
    window.addEventListener('keydown', keyboard);
    return () => { observer.disconnect(); window.removeEventListener('keydown', keyboard); controller?.abort(); };
  });
</script>

{#if !blocked}
<div class="otto-assistant">
  {#if open}
    <section id="dr-otto-panel" class="otto-panel" aria-labelledby="dr-otto-title">
      <header class="otto-panel-header">
        <div><h2 id="dr-otto-title" tabindex="-1" bind:this={panelHeading}>Dr. Otto</h2><p>{text.subtitle}</p></div>
        <button type="button" class="otto-icon-button" aria-label={text.close} onclick={() => close()}><Icon name="close" size={19} /></button>
      </header>
      <div class="otto-panel-content">
        {#if section !== 'home'}<button type="button" class="otto-back" onclick={() => navigate('home')}><Icon name="back" size={16} />{text.back}</button>{/if}
        {#if section === 'home'}
          <p class="otto-welcome">{text.welcome}</p>
          <div class="otto-actions">
            <button type="button" onclick={() => navigate('tools')}>{text.actions[0]} <span aria-hidden="true">→</span></button>
            <button type="button" onclick={() => navigate('help')}>{text.actions[1]} <span aria-hidden="true">→</span></button>
            <button type="button" onclick={() => navigate('privacy')}>{text.actions[2]} <span aria-hidden="true">→</span></button>
            <button type="button" onclick={() => navigate('troubleshooting')}>{text.actions[3]} <span aria-hidden="true">→</span></button>
          </div>
        {:else if section === 'tools'}
          <h3>{text.actions[0]}</h3>
          {#if !policy}<p class="otto-note">{text.checking}</p>{/if}
          <ul class="otto-list">
            {#each tools as tool}
              <li><a href={localePath(locale, `/${tool.id}`)}>{tool.name}{#if policy && !policy.enabledTools.includes(tool.id)}<small>{text.unavailable}</small>{/if}<span aria-hidden="true">→</span></a></li>
            {/each}
          </ul>
        {:else if section === 'privacy'}
          <h3>{text.actions[2]}</h3>
          {#each text.privacy as paragraph}<p class="otto-paragraph">{paragraph}</p>{/each}
          <a class="otto-link" href={privacyHref}>{text.privacyLink} →</a>
        {:else}
          <h3>{section === 'help' ? text.actions[1] : text.actions[3]}</h3>
          {#each section === 'help' ? text.help : text.troubleshooting as item, index}
            <details class="otto-detail"><summary>{item[0]}</summary><p>{item[1]}</p>{#if section === 'help' && helpTools[index]}{@const linkedTool = getTools(locale).find((tool) => tool.id === helpTools[index])}{#if linkedTool}<a class="otto-link" href={localePath(locale, `/${linkedTool.id}`)}>{linkedTool.name} →</a>{/if}{/if}</details>
          {/each}
          {#if section === 'troubleshooting'}<a class="otto-link" href={contactHref}>{text.contact} →</a>{/if}
        {/if}
      </div>
    </section>
  {/if}
  <button bind:this={launcher} type="button" class="otto-launcher" aria-label={open ? text.close : text.launcher} aria-expanded={open} aria-controls="dr-otto-panel" onclick={() => open ? close() : show()}>
    <img src="/mascot/dr-otto-topbar-wave.webp" alt="" width="480" height="320" decoding="async" />
  </button>
</div>
{/if}
