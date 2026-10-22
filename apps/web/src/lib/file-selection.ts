import type { Tool } from './tools';

// Local interface guard only; production policy must come from the API.
export const selectionMaxBytes = 10 * 1024 * 1024;
export const selectionMaxFiles = 20;

export function validateSelection(incoming: File[], current: File[], tool: Tool): { files: File[]; error: string } {
  const allowed = tool.accept.split(',');
  if (incoming.some((file) => !allowed.some((extension) => file.name.toLowerCase().endsWith(extension)))) {
    return { files: current, error: `Bu araç için ${tool.inputLabel} dosyası seçmelisin.` };
  }
  if (incoming.some((file) => file.size === 0)) return { files: current, error: 'Boş bir dosya seçilemez.' };
  if (incoming.some((file) => file.size > selectionMaxBytes)) return { files: current, error: 'Dosya başına en fazla 10 MB seçebilirsin.' };
  if (!tool.multiple && incoming.length > 1) return { files: current, error: 'Bu araç için tek bir dosya seç.' };
  const candidates = tool.multiple ? [...current, ...incoming] : incoming;
  const files = candidates.filter((file, index, list) => list.findIndex((other) => other.name === file.name && other.size === file.size && other.lastModified === file.lastModified) === index);
  if (files.length > selectionMaxFiles) return { files: current, error: 'En fazla 20 dosya seçebilirsin.' };
  return { files, error: '' };
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
