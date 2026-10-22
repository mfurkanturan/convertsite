import type { ToolId } from '@convertsite/contracts';
import type { ToolHandler } from '../../jobs/public.js';
export function pdfOperationHandlers(factory: (tool: ToolId) => ToolHandler): [ToolId, ToolHandler][] {
  return [['merge-pdf', factory('merge-pdf')], ['compress-pdf', factory('compress-pdf')], ['edit-pdf-pages', factory('edit-pdf-pages')]];
}
