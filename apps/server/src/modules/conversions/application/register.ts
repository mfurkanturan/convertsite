import type { ToolId } from '@convertsite/contracts';
import type { ToolHandler } from '../../jobs/public.js';
export function conversionHandlers(factory: (tool: ToolId) => ToolHandler): [ToolId, ToolHandler][] {
  return [
    ['pdf-to-word', factory('pdf-to-word')], ['word-to-pdf', factory('word-to-pdf')],
    ['pdf-to-excel', factory('pdf-to-excel')], ['excel-to-pdf', factory('excel-to-pdf')],
    ['pdf-to-images', factory('pdf-to-images')], ['images-to-pdf', factory('images-to-pdf')],
  ];
}
