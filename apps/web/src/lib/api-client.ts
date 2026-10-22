import type { Capabilities, CreateJob, JobView, UploadedFile } from '@convertsite/contracts';
async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`/api${path}`, { ...options, credentials: 'same-origin', headers: { ...(options.body ? { 'content-type': 'application/json' } : {}), ...options.headers } });
  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new Error(body?.message ?? 'Sunucuya ulaşılamadı. Backend bağlantısını kontrol et.');
  }
  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}
export const api = {
  capabilities: () => request<Capabilities>('/capabilities'),
  createJob: (body: CreateJob) => request<JobView>('/jobs', { method: 'POST', body: JSON.stringify(body) }),
  job: (id: string, signal?: AbortSignal) => request<JobView>(`/jobs/${id}`, { signal }),
  cancel: (id: string) => request<JobView>(`/jobs/${id}/cancel`, { method: 'POST' }),
  deleteJob: (id: string) => request<{ status: string }>(`/jobs/${id}`, { method: 'DELETE' }),
  deleteFile: (id: string) => request<void>(`/files/${id}`, { method: 'DELETE' }),
};
export function uploadFile(file: File, signal: AbortSignal, progress: (value: number) => void): Promise<UploadedFile> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    const abort = () => xhr.abort();
    xhr.open('POST', '/api/files');
    xhr.withCredentials = true; xhr.timeout = 60000;
    xhr.upload.onprogress = (event) => { if (event.lengthComputable) progress(event.loaded / event.total); };
    xhr.onload = () => {
      signal.removeEventListener('abort', abort);
      try {
        const result = JSON.parse(xhr.responseText);
        if (xhr.status < 200 || xhr.status >= 300) reject(new Error(result.message ?? 'Dosya yüklenemedi.'));
        else resolve(result as UploadedFile);
      } catch { reject(new Error('Sunucu yanıtı okunamadı.')); }
    };
    xhr.onerror = xhr.ontimeout = () => { signal.removeEventListener('abort', abort); reject(new Error('Dosya yüklenemedi. Bağlantını kontrol et.')); };
    xhr.onabort = () => { signal.removeEventListener('abort', abort); reject(new Error('Yükleme iptal edildi.')); };
    signal.addEventListener('abort', abort, { once: true });
    if (signal.aborted) { reject(new Error('Yükleme iptal edildi.')); return; }
    const form = new FormData(); form.append('file', file); xhr.send(form);
  });
}
