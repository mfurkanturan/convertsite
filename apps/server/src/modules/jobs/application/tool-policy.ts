import type { ToolSpec } from '@convertsite/contracts';
import type { FileRecord } from '../../files/public.js';
import { AppError } from '../../../platform/error.js';
export function inputPolicy(spec: ToolSpec) {
  return (files: FileRecord[]) => {
    if (files.length < spec.min || files.length > spec.max) throw new AppError('INVALID_REQUEST', 'Bu araç için dosya adedi uygun değil.', 400);
    if (files.some((file) => !spec.inputs.includes((file.kind ?? 'pdf') as typeof spec.inputs[number]))) throw new AppError('UNSUPPORTED_FORMAT', 'Seçilen dosya türü bu araç için uygun değil.', 415);
    if (files.reduce((total, file) => total + file.pages, 0) > spec.maxPages) throw new AppError('LIMIT_EXCEEDED', `Bu araç en fazla ${spec.maxPages} sayfa işler.`, 413);
  };
}
