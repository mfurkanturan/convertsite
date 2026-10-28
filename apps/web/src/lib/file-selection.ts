import type { Tool } from './tools';
import type { UiDictionary } from '../i18n/ui';

// Local interface guard only; production policy must come from the API.
export const selectionMaxBytes = 20 * 1024 * 1024;
export const selectionMaxFiles = 20;

export function validateSelection(incoming: File[], current: File[], tool: Tool, text: UiDictionary['selection']): { files: File[]; error: string } {
  const allowed = tool.accept.split(',');
  if (incoming.some((file) => !allowed.some((extension) => file.name.toLowerCase().endsWith(extension)))) {
    return { files: current, error: text.wrongType(tool.inputLabel) };
  }
  if (incoming.some((file) => file.size === 0)) return { files: current, error: text.empty };
  if (incoming.some((file) => file.size > selectionMaxBytes)) return { files: current, error: text.tooBig };
  if (!tool.multiple && incoming.length > 1) return { files: current, error: text.single };
  const candidates = tool.multiple ? [...current, ...incoming] : incoming;
  const files = candidates.filter((file, index, list) => list.findIndex((other) => other.name === file.name && other.size === file.size && other.lastModified === file.lastModified) === index);
  if (files.length > selectionMaxFiles) return { files: current, error: text.tooMany };
  return { files, error: '' };
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
