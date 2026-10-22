import { AppError } from './error.js';
import type { Config } from './config.js';
import type { InputKind, FileKind, ToolId, ToolOptions } from '@convertsite/contracts';
export function engineClient(config: Config) {
  async function request(path: string, body: unknown, signal?: AbortSignal) {
    const timeout = AbortSignal.timeout(config.engineTimeoutMs);
    const response = await fetch(`${config.engineUrl}${path}`, {
      method: 'POST', headers: { authorization: `Bearer ${config.engineToken}`, 'content-type': 'application/json' },
      body: JSON.stringify(body), signal: signal ? AbortSignal.any([timeout, signal]) : timeout,
    }).catch(() => { throw new AppError('ENGINE_UNAVAILABLE', 'Belge motoruna ulaşılamadı.', 503); });
    if (!response.ok) {
      const value = await response.json().catch(() => null) as { error?: string } | null;
      const messages: Record<string, string> = {
        INVALID_DOCUMENT: 'Belge bozuk, şifreli veya desteklenmiyor.', UNSUPPORTED_FORMAT: 'Dosyada desteklenmeyen biçim, makro veya dış bağlantı var.',
        LIMIT_EXCEEDED: 'Belgenin sayfa, piksel veya çıktı boyutu sınırı aşıldı.', INVALID_OPTIONS: 'Sayfa aralığını ve işlem seçeneklerini kontrol et.',
        NO_TEXT: 'Metin bulunamadı. Taranmış PDF için OCR kullanabilir veya daha net bir görsel seçebilirsin.',
        NO_TABLES: 'PDF içinde aktarılabilir tablo bulunamadı. Taranmış tablolar bu araçta desteklenmiyor.',
        PROCESSING_TIMEOUT: 'Belge işleme süresi aşıldı. Daha küçük bir belgeyle yeniden dene.',
      };
      const code = response.status === 503 ? 'ENGINE_UNAVAILABLE' : value?.error && Object.hasOwn(messages, value.error) ? value.error : 'INVALID_DOCUMENT';
      throw new AppError(code, code === 'ENGINE_UNAVAILABLE' ? 'Belge motoru meşgul. Lütfen yeniden dene.' : messages[code], code === 'ENGINE_UNAVAILABLE' ? 503 : 422);
    }
    return response;
  }
  return {
    async inspect(id: string, kind: InputKind = 'pdf') {
      const response = await request('/inspect', { id, kind });
      const value: unknown = await response.json();
      if (!value || typeof value !== 'object' || !('pages' in value) || !Number.isSafeInteger(value.pages) || Number(value.pages) < 0) throw new AppError('INVALID_DOCUMENT', 'Belge doğrulanamadı.', 422);
      return Number(value.pages);
    },
    process: (tool: ToolId, inputs: { id: string; kind: InputKind }[], options: ToolOptions, signal: AbortSignal) => request(`/process/${tool}`, { inputs, options }, signal),
    async healthy() { try { return (await fetch(`${config.engineUrl}/health`, { signal: AbortSignal.timeout(2000) })).ok; } catch { return false; } },
  };
}
