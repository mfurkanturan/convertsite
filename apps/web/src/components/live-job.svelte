<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import type { Capabilities, JobView, ToolOptions } from '@convertsite/contracts';
  import type { Tool } from '../lib/tools';
  import { api, uploadFile } from '../lib/api-client';
  import { formatBytes } from '../lib/file-selection';
  import Icon from './icon.svelte';
  import Button from './button.svelte';
  import InlineNotice from './inline-notice.svelte';
  export let files: File[];
  export let tool: Tool;
  export let options: ToolOptions = {};
  export let startDisabled = false;
  export let busy = false;
  export let onclear: () => void;
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
  $: limits = policy?.tools?.[tool.id];

  async function capabilities() {
    try { policy = await api.capabilities(); error = ''; }
    catch { error = 'Backend bağlantısı hazır değil. Dosyalar gönderilmedi.'; }
  }
  async function poll(id: string) {
    busy = true;
    try {
      while (!disposed && !controller.signal.aborted) {
        job = await api.job(id, controller.signal);
        if (!['queued', 'running'].includes(job.state)) break;
        phase = job.state === 'queued' ? 'İşlemin kuyrukta…' : 'Belgen işleniyor…';
        await new Promise((resolve) => setTimeout(resolve, document.hidden ? 4000 : 1000));
      }
    } catch { if (!disposed && !controller.signal.aborted) error = 'Durum alınamadı. Tekrar kontrol edebilirsin.'; }
    finally { if (!disposed) { busy = false; phase = ''; } }
  }
  async function start() {
    if (!policy || files.length < minimum || busy) return;
    if (files.length > policy.maxFiles || files.some((file) => file.size > policy!.maxFileBytes) || files.reduce((n, file) => n + file.size, 0) > policy.maxTotalBytes) {
      error = 'Dosya adedi veya boyutu sunucu sınırını aşıyor.'; return;
    }
    busy = true; error = ''; removed = false; job = null;
    controller = new AbortController();
    const uploaded: string[] = [];
    try {
      for (let index = 0; index < files.length; index++) {
        phase = `${index + 1}/${files.length} dosya yükleniyor ve doğrulanıyor…`;
        const item = await uploadFile(files[index], controller.signal, (value) => progress = Math.round(((index + value) / files.length) * 100));
        uploaded.push(item.id);
      }
      if (controller.signal.aborted || disposed) throw new Error('Yükleme iptal edildi.');
      phase = 'İşlem kuyruğa alınıyor…';
      job = await api.createJob({ tool: tool.id, fileIds: uploaded, options, idempotencyKey: crypto.randomUUID() });
      sessionStorage.setItem(key, job.id);
      if (controller.signal.aborted) await api.cancel(job.id);
      await poll(job.id);
    } catch (cause) {
      error = cause instanceof Error ? cause.message : 'İşlem başlatılamadı.';
      if (!job) await Promise.allSettled(uploaded.map((id) => api.deleteFile(id)));
    } finally { busy = false; phase = ''; }
  }
  async function cancel() {
    try { if (job) job = await api.cancel(job.id); else controller.abort(); }
    catch (cause) { error = cause instanceof Error ? cause.message : 'İptal edilemedi.'; }
  }
  async function remove() {
    if (!job) return;
    try { await api.deleteJob(job.id); sessionStorage.removeItem(key); job = null; removed = true; onclear(); }
    catch { error = 'Silme isteği alınamadı. Yeniden dene.'; }
  }
  onMount(() => {
    void capabilities();
    const saved = sessionStorage.getItem(key) ?? (tool.id === 'merge-pdf' ? sessionStorage.getItem('docly.merge-job') : null);
    if (saved && /^[0-9a-f-]{36}$/.test(saved)) void poll(saved);
  });
  onDestroy(() => { disposed = true; controller.abort(); });
</script>

<section class="rounded-panel border border-border bg-surface p-6 shadow-card max-[650px]:p-5" aria-labelledby="job-title" aria-busy={busy}>
  <h2 id="job-title" class="text-lg font-semibold text-text">İşlemi başlat</h2>
  {#if policy}
    <ul class="mt-3 flex flex-wrap gap-2 text-[13px] text-text-soft" aria-label="Sınırlar">
      <li class="rounded-md bg-bg px-2.5 py-1 ring-1 ring-border">Dosya başına {formatBytes(policy.maxFileBytes)}</li>
      <li class="rounded-md bg-bg px-2.5 py-1 ring-1 ring-border">En fazla {limits?.maxFiles ?? policy.maxFiles} dosya</li>
      <li class="rounded-md bg-bg px-2.5 py-1 ring-1 ring-border">{limits?.maxPages ?? policy.maxTotalPages} sayfa</li>
      <li class="rounded-md bg-bg px-2.5 py-1 ring-1 ring-border">{policy.retentionMinutes} dakika saklanır</li>
    </ul>
  {/if}
  {#if limits?.note}<p class="mt-3 text-sm leading-relaxed text-text-soft"><strong class="font-semibold text-text">Destek sınırı:</strong> {limits.note}</p>{/if}
  {#if error}<div class="mt-4"><InlineNotice variant="danger" role="alert">{error}</InlineNotice></div>{/if}
  {#if phase}
    <div class="mt-4 flex items-center gap-3 text-[15px] text-text-soft" role="status"><span class="h-5 w-5 shrink-0 animate-spin rounded-full border-2 border-border border-t-accent" aria-hidden="true"></span><span>{phase}</span></div>
    {#if !job}<label class="mt-3 mb-1.5 block text-[13px] text-text-soft" for="upload-progress">Yükleme: %{progress}</label><progress id="upload-progress" class="h-2.5 w-full accent-accent" max="100" value={progress} aria-label="Dosya aktarımı" aria-valuetext={`Yüzde ${progress}`}></progress>{/if}
  {/if}
  {#if job && !busy}
    <div class="mt-4 rounded-card border p-5 {job.state === 'succeeded' && job.resultAvailable ? 'border-success/25 bg-success-soft' : job.state === 'failed' ? 'border-danger/25 bg-danger-soft' : 'border-border bg-bg'}" aria-live="polite">
      {#if job.state === 'succeeded' && job.resultAvailable}<h3 class="flex items-center gap-2 text-lg font-semibold text-success"><Icon name="check" size={20} /> Dosyan hazır.</h3><p class="mt-1 text-sm leading-relaxed text-text-soft">İşlem tamamlandı. {job.resultKind?.toUpperCase() ?? tool.output}{job.resultSize ? ` · ${formatBytes(job.resultSize)}` : ''}</p><div class="mt-4 flex flex-wrap gap-2"><Button href={`/api/jobs/${job.id}/download`} download>Sonucu indir <Icon name="down" size={17} /></Button><Button variant="secondary" onclick={remove}>Dosyaları sil</Button></div>
      {:else if job.state === 'cancelled'}<h3 class="text-lg font-semibold text-text">İşlem iptal edildi.</h3><div class="mt-3"><Button variant="secondary" onclick={remove}>İşlem dosyalarını sil</Button></div>
      {:else if job.state === 'failed'}<h3 class="text-lg font-semibold text-danger">İşlem tamamlanamadı.</h3><p class="mt-1 text-sm leading-relaxed text-text-soft">{job.error === 'NO_TABLES' ? 'PDF içinde aktarılabilir tablo bulunamadı. Taranmış tablolar desteklenmiyor.' : job.error === 'NO_TEXT' ? 'Metin bulunamadı. Daha net bir görsel veya OCR aracını deneyebilirsin.' : job.error === 'INVALID_OPTIONS' ? 'Sayfa aralığı belgenin sınırları dışında. Seçenekleri kontrol et.' : job.error === 'LIMIT_EXCEEDED' ? 'Belge veya çıktı sınırı aşıldı. Daha küçük bir belge seç.' : 'Motor işlemi tamamlayamadı. Dosyalarını kontrol edip yeniden deneyebilirsin.'}</p><div class="mt-3"><Button variant="secondary" onclick={remove}>İşlem dosyalarını sil</Button></div>
      {:else if !job.resultAvailable && job.state === 'succeeded'}<h3 class="text-lg font-semibold text-text">Sonucun süresi dolmuş.</h3><p class="mt-1 text-sm leading-relaxed text-text-soft">Yeni bir işlem başlatabilirsin.</p>
      {:else}<Button variant="secondary" onclick={() => { controller = new AbortController(); void poll(job!.id); }}>Durumu yeniden kontrol et</Button>{/if}
    </div>
  {/if}
  {#if removed}<div class="mt-4"><InlineNotice variant="info" role="status">Dosyalara erişim kapatıldı. Fiziksel silme 2 dakikalık bekleme süresinden sonra arka planda tamamlanır.</InlineNotice></div>{/if}
  <div class="mt-5 flex flex-wrap items-center gap-x-4 gap-y-3">
    {#if busy}<Button variant="secondary" onclick={cancel}>İptal et</Button>
    {:else if policy && policy.enabledTools.includes(tool.id)}<Button className="max-[480px]:w-full" disabled={files.length < minimum || startDisabled} onclick={start}>{tool.id === 'merge-pdf' ? 'PDF’leri birleştir' : 'Dönüştürmeyi başlat'} <Icon name="arrow" size={18} /></Button>
    {:else if !policy}<Button variant="secondary" onclick={capabilities}>Bağlantıyı kontrol et</Button>{/if}
    {#if !busy && policy}<span class="text-sm text-text-muted">{files.length < minimum ? `${minimum === 2 ? 'En az 2 dosya' : 'Bir dosya'} seçtiğinde başlatabilirsin.` : 'Dosyaların hazır.'}</span>{/if}
  </div>
  <p class="mt-5 border-t border-border pt-4 text-[13px] leading-relaxed text-text-muted">İşlem için yüklenen dosyalar süreli saklanır ve süre dolunca temizlenir. Sayfayı kapatsan da sunucunun kabul ettiği işlem sürer.</p>
</section>
