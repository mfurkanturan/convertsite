import { Type, type TObject } from '@sinclair/typebox';
import { toolIds, toolLimits, type ToolId, type InputKind, type ToolLimits } from './limits.js';
export { toolIds, toolLimits, type ToolId, type InputKind, type ToolLimits };
export type FileKind = InputKind | 'zip' | 'txt';

export interface ToolOptions {
  format?: 'jpg' | 'png'; dpi?: 100 | 150; pages?: string;
  size?: 'a4' | 'image'; orientation?: 'portrait' | 'landscape';
  mode?: 'pdf' | 'zip'; rotation?: 0 | 90 | 180 | 270;
  language?: 'tur' | 'eng' | 'tur+eng'; sheets?: 'all' | 'first';
  password?: string;
  watermarkText?: string;
  pageNumberPosition?: 'bottom-center' | 'bottom-right' | 'top-right';
}

export interface ToolSpec extends ToolLimits { options: TObject }
const object = (properties = {}) => Type.Object(properties, { additionalProperties: false });
const pages = Type.Optional(Type.String({ maxLength: 250, pattern: '^$|^[1-9][0-9]*(?:-[1-9][0-9]*)?(?:\\s*,\\s*[1-9][0-9]*(?:-[1-9][0-9]*)?)*$' }));

const options: Record<ToolId, TObject> = {
  'merge-pdf': object(),
  'compress-pdf': object(),
  'edit-pdf-pages': object({ pages, mode: Type.Optional(Type.Union([Type.Literal('pdf'), Type.Literal('zip')])), rotation: Type.Optional(Type.Union([Type.Literal(0), Type.Literal(90), Type.Literal(180), Type.Literal(270)])) }),
  'pdf-to-word': object(),
  'pdf-to-excel': object(),
  'word-to-pdf': object(),
  'excel-to-pdf': object({ sheets: Type.Optional(Type.Union([Type.Literal('all'), Type.Literal('first')])) }),
  'pdf-to-images': object({ pages, format: Type.Optional(Type.Union([Type.Literal('jpg'), Type.Literal('png')])), dpi: Type.Optional(Type.Union([Type.Literal(100), Type.Literal(150)])) }),
  'images-to-pdf': object({ size: Type.Optional(Type.Union([Type.Literal('a4'), Type.Literal('image')])), orientation: Type.Optional(Type.Union([Type.Literal('portrait'), Type.Literal('landscape')])) }),
  ocr: object({ language: Type.Optional(Type.Union([Type.Literal('tur'), Type.Literal('eng'), Type.Literal('tur+eng')])) }),
  'pptx-to-pdf': object(),
  'protect-pdf': object({ password: Type.String({ minLength: 1, maxLength: 64 }) }),
  'unlock-pdf': object({ password: Type.Optional(Type.String({ maxLength: 64 })) }),
  'watermark-pdf': object({ watermarkText: Type.String({ minLength: 1, maxLength: 80 }) }),
  'page-numbers': object({ pageNumberPosition: Type.Optional(Type.Union([Type.Literal('bottom-center'), Type.Literal('bottom-right'), Type.Literal('top-right')])) }),
};

export const toolSpecs = Object.fromEntries(toolIds.map((id) => [id, { ...toolLimits[id], options: options[id] }])) as Record<ToolId, ToolSpec>;

export const mimeTypes: Record<FileKind, string> = {
  pdf: 'application/pdf',
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  jpg: 'image/jpeg',
  png: 'image/png',
  zip: 'application/zip',
  txt: 'text/plain; charset=utf-8',
};

export const ToolIdSchema = Type.Union(toolIds.map((id) => Type.Literal(id)));
export const InputKindSchema = Type.Union(['pdf','docx','xlsx','pptx','jpg','png'].map((kind) => Type.Literal(kind)));
