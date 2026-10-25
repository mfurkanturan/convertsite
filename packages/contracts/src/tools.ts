import { Type, type TObject } from '@sinclair/typebox';
import { toolIds, toolLimits, type ToolId, type InputKind, type ToolLimits } from './limits.js';
export { toolIds, toolLimits, type ToolId, type InputKind, type ToolLimits };
export type FileKind = InputKind | 'zip' | 'txt';

export const ocrLanguageCodes = ['eng','tur','hin','afr','amh','ara','asm','aze','aze_cyrl','bel','ben','bod','bos','bre','bul','cat','ceb','ces','chi_sim','chi_sim_vert','chi_tra','chi_tra_vert','chr','cos','cym','dan','deu','div','dzo','ell','enm','epo','est','eus','fao','fas','fil','fin','fra','frk','frm','fry','gla','gle','glg','grc','guj','hat','heb','hrv','hun','hye','iku','ind','isl','ita','ita_old','jav','jpn','jpn_vert','kan','kat','kat_old','kaz','khm','kir','kmr','kor','kor_vert','lao','lat','lav','lit','ltz','mal','mar','mkd','mlt','mon','mri','msa','mya','nep','nld','nor','oci','ori','pan','pol','por','pus','que','ron','rus','san','sin','slk','slv','snd','spa','spa_old','sqi','srp','srp_latn','sun','swa','swe','syr','tam','tat','tel','tgk','tha','tir','ton','uig','ukr','urd','uzb','uzb_cyrl','vie','yid','yor'] as const;

export interface ToolOptions {
  format?: 'jpg' | 'png'; dpi?: 100 | 150; pages?: string;
  size?: 'a4' | 'image'; orientation?: 'portrait' | 'landscape';
  mode?: 'pdf' | 'zip'; rotation?: 0 | 90 | 180 | 270;
  language?: string; sheets?: 'all' | 'first';
  password?: string;
  watermarkText?: string;
  pageNumberPosition?: 'bottom-center' | 'bottom-right' | 'top-right';
}

export interface ToolSpec extends ToolLimits { options: TObject }
const object = (properties = {}) => Type.Object(properties, { additionalProperties: false });
const pages = Type.Optional(Type.String({ maxLength: 250, pattern: '^$|^[1-9][0-9]*(?:-[1-9][0-9]*)?(?:\\s*,\\s*[1-9][0-9]*(?:-[1-9][0-9]*)?)*$' }));
const ocrLanguageCodesPattern = ocrLanguageCodes.join('|');
const ocrLanguage = Type.Optional(Type.String({ minLength: 3, maxLength: 40, pattern: `^(?:${ocrLanguageCodesPattern})(?:\\+(?:${ocrLanguageCodesPattern}))?$` }));

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
  ocr: object({ language: ocrLanguage }),
  'pdf-to-pdf-ocr': object({ language: ocrLanguage }),
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
