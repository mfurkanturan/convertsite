import type { Capabilities, CreateJob, JobView, UploadedFile } from '@convertsite/contracts';
import type { Locale } from '../i18n/locales';
import { ui } from '../i18n/ui';

const API_BASE = (import.meta.env.PUBLIC_API_URL || '').replace(/\/$/, '');

function getUrl(path: string): string {
  return `${API_BASE}/api${path}`;
}

// The API answers in Turkish; other locales map the stable error code instead.
function message(locale: Locale, body: { code?: string; message?: string } | null, fallback: string): string {
  const text = ui[locale].api;
  if (locale === 'tr') return body?.message ?? fallback;
  return (body?.code && text.codes[body.code]) || fallback;
}

export function apiFor(locale: Locale) {
  const text = ui[locale].api;
  async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
    const response = await fetch(getUrl(path), {
      ...options,
      credentials: 'include',
      headers: { ...(options.body ? { 'content-type': 'application/json' } : {}), ...options.headers }
    });
    if (!response.ok) {
      const body = await response.json().catch(() => null);
      throw new Error(message(locale, body, text.unreachable));
    }
    if (response.status === 204) return undefined as T;
    return response.json() as Promise<T>;
  }
  return {
    capabilities: (signal?: AbortSignal) => request<Capabilities>('/capabilities', { signal }),
    createJob: (body: CreateJob) => request<JobView>('/jobs', { method: 'POST', body: JSON.stringify(body) }),
    job: (id: string, signal?: AbortSignal) => request<JobView>(`/jobs/${id}`, { signal }),
    cancel: (id: string) => request<JobView>(`/jobs/${id}/cancel`, { method: 'POST' }),
    deleteJob: (id: string) => request<{ status: string }>(`/jobs/${id}`, { method: 'DELETE' }),
    deleteFile: (id: string) => request<void>(`/files/${id}`, { method: 'DELETE' }),
    downloadUrl: (jobId: string) => getUrl(`/jobs/${jobId}/download`),
    uploadFile(file: File, signal: AbortSignal, progress: (value: number) => void, password?: string): Promise<UploadedFile> {
      return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        const abort = () => xhr.abort();
        xhr.open('POST', getUrl('/files'));
        xhr.withCredentials = true;
        xhr.timeout = 60000;
        xhr.upload.onprogress = (event) => { if (event.lengthComputable) progress(event.loaded / event.total); };
        xhr.onload = () => {
          signal.removeEventListener('abort', abort);
          try {
            const result = JSON.parse(xhr.responseText);
            if (xhr.status < 200 || xhr.status >= 300) reject(new Error(message(locale, result, text.uploadFailed)));
            else resolve(result as UploadedFile);
          } catch { reject(new Error(text.badResponse)); }
        };
        xhr.onerror = xhr.ontimeout = () => { signal.removeEventListener('abort', abort); reject(new Error(text.uploadNetwork)); };
        xhr.onabort = () => { signal.removeEventListener('abort', abort); reject(new Error(text.uploadCancelled)); };
        signal.addEventListener('abort', abort, { once: true });
        if (signal.aborted) { reject(new Error(text.uploadCancelled)); return; }
        const form = new FormData(); if (password) form.append('password', password); form.append('file', file); xhr.send(form);
      });
    },
  };
}
