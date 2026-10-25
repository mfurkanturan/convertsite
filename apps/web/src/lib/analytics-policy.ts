import { toolLimits } from '@convertsite/contracts/limits';

export const consentKey = 'dc-analytics-consent-v1';
export const eventNames = new Set(['$pageview', 'tool_viewed', 'tool_open', 'hero_upload_click', 'file_selected', 'tool_search',
  'tool_filter', 'processing_started', 'processing_success', 'processing_error', 'guide_open', 'faq_expand',
  'upload_completed', 'conversion_requested', 'conversion_completed', 'conversion_failed', 'conversion_cancelled', 'download_clicked', 'files_deleted', 'client_error']);
export interface AnalyticsProperties {
  tool?: string;
  category?: 'all' | 'convert' | 'organize' | 'optimize' | 'ocr';
  file_count?: number;
  error_code?: string;
}

// Only explicit primitives cross this boundary. Never accept File, options, JobView or Error objects.
export function safeProperties(input: AnalyticsProperties): Record<string, string | number> {
  const output: Record<string, string | number> = {};
  if (input.tool && Object.hasOwn(toolLimits, input.tool)) output.tool = input.tool;
  if (input.category && ['all', 'convert', 'organize', 'optimize', 'ocr'].includes(input.category)) output.category = input.category;
  if (Number.isInteger(input.file_count) && input.file_count! >= 1 && input.file_count! <= 20) output.file_count = input.file_count!;
  if (input.error_code && ['JOB_FAILED', 'UPLOAD_OR_REQUEST_FAILED', 'UNHANDLED_ERROR', 'UNHANDLED_REJECTION'].includes(input.error_code)) output.error_code = input.error_code;
  return output;
}
