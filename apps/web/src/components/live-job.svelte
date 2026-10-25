<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import type { Capabilities, JobView, ToolOptions } from '@convertsite/contracts';
  import type { Tool } from '../lib/tools';
  import { apiFor } from '../lib/api-client';
  import { track, trackOutcome } from '../lib/analytics';
  import { toolLimits as toolSpecs } from '@convertsite/contracts/limits';
  import { formatBytes } from '../lib/file-selection';
  import { getTools } from '../lib/tools';
  import { localePath } from '../i18n/locales';
  import { toolSeoMap } from '../lib/tool-seo';
  import { useLocale, useUi } from '../i18n/context';
  import Icon from './icon.svelte';
  import Button from './button.svelte';
  import InlineNotice from './inline-notice.svelte';
  export let files: File[];
  export let tool: Tool;
  export let options: ToolOptions = {};
  export let startDisabled = false;
  export let showOutput = false;
  export let busy = false;
  export let onclear: () => void;
  const locale = useLocale();
  const api = apiFor(locale);
  const text = useUi().job;
  const workspace = useUi().workspace;
  $: supportNote = workspace.tips[tool.id] ?? workspace.tips.default;
  const cancelledText = useUi().api.uploadCancelled;
  let policy: Capabilities | null = null;
  let job: JobView | null = null;
  let error = '';
  let phase = '';
  let progress = 0;
  let controller = new AbortController();
  let removed = false;
  let disposed = false;
  $: key = `docly.job.${tool.id}`;
  $: minimum = tool.id === 'merge-pdf' ? 2 : 1;
  $: totalInputBytes = files.reduce((total, file) => total + file.size, 0);
  $: nextTool = getTools(locale).find((candidate) => candidate.id === toolSeoMap[tool.id].relatedTools[0]);
  // Older capability responses may omit tool overrides; contract limits apply only after a policy response.
  $: limits = policy?.tools?.[tool.id] ?? { maxFiles: toolSpecs[tool.id].max, maxPages: toolSpecs[tool.id].maxPages, note: toolSpecs[tool.id].note };

  async function capabilities() {
    try { policy = await api.capabilities(); error = ''; }
    catch { error = text.backendDown; }
  }
  async function poll(id: string) {
    busy = true;
    try {
      while (!disposed && !controller.signal.aborted) {
        job = await api.job(id, controller.signal);
        if (['succeeded', 'failed', 'cancelled'].includes(job.state)) {
          trackOutcome(job.id, job.state === 'succeeded' ? 'conversion_completed' : job.state === 'failed' ? 'conversion_failed' : 'conversion_cancelled', { tool: tool.id });
          if (job.state === 'succeeded' || job.state === 'failed') {
            trackOutcome(job.id, job.state === 'succeeded' ? 'processing_success' : 'processing_error', { tool: tool.id });
          }
        }
        if (!['queued', 'running'].includes(job.state)) break;
        phase = job.state === 'queued' ? text.queued : text.processing;
        await new Promise((resolve) => setTimeout(resolve, document.hidden ? 4000 : 1000));
      }
    } catch { if (!disposed && !controller.signal.aborted) error = text.statusFailed; }
    finally { if (!disposed) { busy = false; phase = ''; } }
  }
  async function start() {
    if (!policy || files.length < minimum || busy) return;
    if (files.length > policy.maxFiles || files.some((file) => file.size > policy!.maxFileBytes) || files.reduce((n, file) => n + file.size, 0) > policy.maxTotalBytes) {
      error = text.serverLimit; return;
    }
    busy = true; error = ''; removed = false; job = null;
    track('processing_started', { tool: tool.id, file_count: files.length });
    controller = new AbortController();
    const uploaded: string[] = [];
    try {
      for (let index = 0; index < files.length; index++) {
        phase = text.uploading(index + 1, files.length);
        const item = await api.uploadFile(files[index], controller.signal, (value) => progress = Math.round(((index + value) / files.length) * 100), tool.id === 'unlock-pdf' ? String(options.password ?? '') : undefined);
        uploaded.push(item.id);
      }
      if (controller.signal.aborted || disposed) throw new Error(cancelledText);
      track('upload_completed', { tool: tool.id, file_count: uploaded.length });
      phase = text.queueing;
      job = await api.createJob({ tool: tool.id, fileIds: uploaded, options, idempotencyKey: crypto.randomUUID() });
      track('conversion_requested', { tool: tool.id, file_count: uploaded.length });
      sessionStorage.setItem(key, job.id);
      if (controller.signal.aborted) await api.cancel(job.id);
      await poll(job.id);
    } catch (cause) {
      if (!controller.signal.aborted && !disposed) track('client_error', { tool: tool.id, error_code: 'UPLOAD_OR_REQUEST_FAILED' });
      error = cause instanceof Error ? cause.message : text.cannotStart;
      if (!job) await Promise.allSettled(uploaded.map((id) => api.deleteFile(id)));
    } finally { busy = false; phase = ''; }
  }
  async function retryJob() {
    if (!job || busy || files.length < minimum) return;
    try {
      await api.deleteJob(job.id);
      sessionStorage.removeItem(key);
      job = null;
      removed = false;
      await start();
    } catch {
      error = text.retryFailed;
    }
  }
  async function cancel() {
    try { if (job) job = await api.cancel(job.id); else controller.abort(); }
    catch (cause) { error = cause instanceof Error ? cause.message : text.cannotCancel; }
  }
  async function remove() {
    if (!job) return;
    try { await api.deleteJob(job.id); track('files_deleted', { tool: tool.id }); sessionStorage.removeItem(key); job = null; removed = true; onclear(); }
    catch { error = text.deleteFailed; }
  }
  function startNewFile() {
    sessionStorage.removeItem(key);
    job = null;
    error = '';
    removed = false;
    onclear();
    requestAnimationFrame(() => document.getElementById('tool-file-picker')?.focus());
  }
  onMount(() => {
    void capabilities();
    const saved = sessionStorage.getItem(key) ?? (tool.id === 'merge-pdf' ? sessionStorage.getItem('docly.merge-job') : null);
    if (saved && /^[0-9a-f-]{36}$/.test(saved)) void poll(saved);
  });
  onDestroy(() => { disposed = true; controller.abort(); });
</script>

<section class="rounded-panel border border-border bg-surface p-6 max-[650px]:p-5" aria-labelledby="job-title" aria-busy={busy}>
  <div class="flex flex-wrap items-center justify-between gap-2"><h2 id="job-title" class="text-lg font-semibold text-text">{text.title}</h2>{#if showOutput}<p class="text-sm text-text-soft">{workspace.outputFormat}: <strong class="font-semibold text-text">{tool.output}</strong></p>{/if}</div>
  {#if policy}
  <ul class="mt-3 flex flex-wrap gap-2 text-[13px] text-text-soft" aria-label={text.limits}>
    <li class="rounded-md bg-bg px-2.5 py-1 ring-1 ring-border">{text.perFile(formatBytes(policy.maxFileBytes))}</li>
    <li class="rounded-md bg-bg px-2.5 py-1 ring-1 ring-border">{text.maxFiles(limits.maxFiles ?? policy.maxFiles)}</li>
    <li class="rounded-md bg-bg px-2.5 py-1 ring-1 ring-border">{text.pages(limits.maxPages ?? policy.maxTotalPages)}</li>
    {#if files.length}<li class="rounded-md bg-bg px-2.5 py-1 ring-1 ring-border">{text.selectedTotal(formatBytes(totalInputBytes))}</li>{/if}
    {#if policy}<li class="rounded-md bg-bg px-2.5 py-1 ring-1 ring-border">{text.totalLimit(formatBytes(policy.maxTotalBytes))}</li>{/if}
    <li class="rounded-md bg-bg px-2.5 py-1 ring-1 ring-border">{text.retention(policy.retentionMinutes)}</li>
  </ul>
  {:else if !error}<p class="mt-3 text-sm text-text-muted" role="status">{text.policyPending}</p>{/if}
  <p class="mt-4 text-sm leading-relaxed text-text-soft">{supportNote}</p>
  {#if error}<div class="mt-4"><InlineNotice variant="danger" role="alert">{error}</InlineNotice></div>{/if}
  {#if phase}
    <div class="mt-4 flex items-center gap-3 text-[15px] text-text-soft" role="status"><span class="h-5 w-5 shrink-0 animate-spin rounded-full border-2 border-border border-t-accent" aria-hidden="true"></span><span>{phase}</span></div>
    {#if !job}<label class="mt-3 mb-1.5 block text-[13px] text-text-soft" for="upload-progress">{text.uploadProgress(progress)}</label><progress id="upload-progress" class="h-2.5 w-full accent-accent" max="100" value={progress} aria-label={text.uploadAria} aria-valuetext={text.uploadValue(progress)}></progress>{/if}
  {/if}
  {#if job && !busy}
    <div class="mt-4 rounded-card border p-5 {job.state === 'succeeded' && job.resultAvailable ? 'border-success/25 bg-success-soft' : job.state === 'failed' ? 'border-danger/25 bg-danger-soft' : 'border-border bg-bg'}" aria-live="polite">
      {#if job.state === 'succeeded' && job.resultAvailable}<h3 class="flex items-center gap-2 text-lg font-semibold text-success"><Icon name="check" size={20} /> {text.ready}</h3><p class="mt-2 break-all text-sm font-medium text-text">{text.outputFile(`doctorconverter-${tool.id}.${(job.resultKind ?? 'pdf').toLowerCase()}`)}</p><p class="mt-1 text-sm leading-relaxed text-text-soft">{text.done} {job.resultKind?.toUpperCase() ?? tool.output}{job.resultSize !== undefined ? ` · ${formatBytes(job.resultSize)}` : ''}</p><div class="mt-4 flex flex-wrap gap-2"><Button href={api.downloadUrl(job.id)} download onclick={() => track('download_clicked', { tool: tool.id })}>{text.download} <Icon name="download" size={17} /></Button><Button variant="secondary" onclick={startNewFile}>{text.newFile}</Button><Button variant="secondary" onclick={remove}>{text.deleteFiles}</Button></div>{#if nextTool}<p class="mt-4 text-sm text-text-soft">{text.nextStep} <a class="font-semibold text-accent underline-offset-2 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent" href={localePath(locale, `/${nextTool.id}`)}>{nextTool.name}</a></p>{/if}
      {:else if job.state === 'cancelled'}<h3 class="text-lg font-semibold text-text">{text.cancelled}</h3>{#if files.length < minimum}<p class="mt-2 text-sm text-text-soft">{text.retryNeedsFile}</p>{/if}<div class="mt-3 flex flex-wrap gap-2"><Button variant="secondary" disabled={files.length < minimum} onclick={retryJob}>{text.retry}</Button><Button variant="secondary" onclick={remove}>{text.deleteJobFiles}</Button></div>
      {:else if job.state === 'failed'}<h3 class="text-lg font-semibold text-danger">{text.failed}</h3><p class="mt-1 text-sm leading-relaxed text-text-soft">{text.jobErrors[job.error ?? ''] ?? text.jobErrors.default}</p>{#if files.length < minimum}<p class="mt-2 text-sm text-text-soft">{text.retryNeedsFile}</p>{/if}<div class="mt-3 flex flex-wrap gap-2"><Button variant="secondary" disabled={files.length < minimum} onclick={retryJob}>{text.retry}</Button><Button variant="secondary" onclick={remove}>{text.deleteJobFiles}</Button></div>
      {:else if !job.resultAvailable && job.state === 'succeeded'}<h3 class="text-lg font-semibold text-text">{text.expired}</h3><p class="mt-1 text-sm leading-relaxed text-text-soft">{text.newJob}</p>
      {:else}<Button variant="secondary" onclick={() => { controller = new AbortController(); void poll(job!.id); }}>{text.recheck}</Button>{/if}
    </div>
  {/if}
  {#if removed}<div class="mt-4"><InlineNotice variant="info" role="status">{text.removed}</InlineNotice></div>{/if}
  {#if policy && !policy.enabledTools.includes(tool.id)}<p class="mt-4 rounded-lg border border-warning/20 bg-warning-soft px-3 py-2.5 text-sm text-warning" role="status">{text.toolUnavailable}</p>{/if}
  <div class="mt-5 flex flex-wrap items-center gap-x-4 gap-y-3">
    {#if busy}<Button variant="secondary" onclick={cancel}>{text.cancel}</Button>
    {:else if policy && policy.enabledTools.includes(tool.id)}<Button className="job-start max-[480px]:w-full" disabled={files.length < minimum || startDisabled} onclick={start}>{text.actions[tool.id]} <Icon name="arrow" size={18} /></Button>
    {:else if !policy}<Button variant="secondary" onclick={capabilities}>{text.checkConnection}</Button>{/if}
    {#if !busy && policy}<span class="text-sm text-text-muted">{files.length < minimum ? (minimum === 2 ? text.needTwo : text.needOne) : text.filesReady}</span>{/if}
  </div>
  <p class="mt-5 border-t border-border pt-4 text-[13px] leading-relaxed text-text-muted">{text.footnote}</p>
</section>
