import type { ToolId } from '@convertsite/contracts';
import type { ToolHandler } from '../../jobs/public.js';
export function ocrHandlers(factory: (tool: ToolId) => ToolHandler): [ToolId, ToolHandler][] {
  return [['ocr', factory('ocr')], ['pdf-to-pdf-ocr', factory('pdf-to-pdf-ocr')]];
}
