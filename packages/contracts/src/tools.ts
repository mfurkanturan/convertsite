import { Type, type TObject } from '@sinclair/typebox';
export const toolIds = ['pdf-to-word','word-to-pdf','pdf-to-excel','excel-to-pdf','pdf-to-images','images-to-pdf','merge-pdf','edit-pdf-pages','compress-pdf','ocr'] as const;
export type ToolId = typeof toolIds[number];
export type InputKind = 'pdf' | 'docx' | 'xlsx' | 'jpg' | 'png';
export type FileKind = InputKind | 'zip' | 'txt';
export interface ToolOptions {
  format?: 'jpg' | 'png'; dpi?: 100 | 150; pages?: string;
  size?: 'a4' | 'image'; orientation?: 'portrait' | 'landscape';
  mode?: 'pdf' | 'zip'; rotation?: 0 | 90 | 180 | 270;
  language?: 'tur' | 'eng' | 'tur+eng'; sheets?: 'all' | 'first';
}
export interface ToolSpec { inputs: InputKind[]; min: number; max: number; maxPages: number; options: TObject; note: string }
const object = (properties = {}) => Type.Object(properties, { additionalProperties: false });
const pages = Type.Optional(Type.String({ maxLength: 250, pattern: '^$|^[1-9][0-9]*(?:-[1-9][0-9]*)?(?:\\s*,\\s*[1-9][0-9]*(?:-[1-9][0-9]*)?)*$' }));
const single = { min: 1, max: 1 };
export const toolSpecs: Record<ToolId, ToolSpec> = {
  'merge-pdf': { inputs: ['pdf'], min: 2, max: 20, maxPages: 300, options: object(), note: 'Dosya sırası çıktı sırasıdır.' },
  'compress-pdf': { inputs: ['pdf'], ...single, maxPages: 300, options: object(), note: 'Kayıpsız optimizasyon. Zaten optimize edilmiş dosyada boyut değişmeyebilir.' },
  'edit-pdf-pages': { inputs: ['pdf'], ...single, maxPages: 300, options: object({ pages, mode: Type.Optional(Type.Union([Type.Literal('pdf'), Type.Literal('zip')])), rotation: Type.Optional(Type.Union([Type.Literal(0), Type.Literal(90), Type.Literal(180), Type.Literal(270)])) }), note: 'Aralığı istediğin sırada yazabilirsin: 3, 1-2. Seçilmeyen sayfalar çıkarılır.' },
  'pdf-to-word': { inputs: ['pdf'], ...single, maxPages: 50, options: object(), note: 'Yazı biçimini, görselleri, tabloları ve sayfa yerleşimini korumaya çalışarak düzenlenebilir Word oluşturur. Karmaşık düzenlerde farklar olabilir; taranmış PDF için OCR kullan.' },
  'pdf-to-excel': { inputs: ['pdf'], ...single, maxPages: 50, options: object(), note: 'Algılanan tabloları ayrı Excel sayfalarına aktarır. Tablosuz veya taranmış belgeyi dönüştürmez.' },
  'word-to-pdf': { inputs: ['docx'], ...single, maxPages: 300, options: object(), note: 'DOCX belgesi LibreOffice ile işlenir; font ve sayfa düzeni farklılıkları olabilir.' },
  'excel-to-pdf': { inputs: ['xlsx'], ...single, maxPages: 300, options: object({ sheets: Type.Optional(Type.Union([Type.Literal('all'), Type.Literal('first')])) }), note: 'Çalışma sayfaları LibreOffice baskı düzeniyle PDF’ye aktarılır.' },
  'pdf-to-images': { inputs: ['pdf'], ...single, maxPages: 30, options: object({ pages, format: Type.Optional(Type.Union([Type.Literal('jpg'), Type.Literal('png')])), dpi: Type.Optional(Type.Union([Type.Literal(100), Type.Literal(150)])) }), note: 'Seçilen sayfalar JPG veya PNG olur. Birden fazla çıktı ZIP olarak indirilir. En fazla 30 sayfalık PDF.' },
  'images-to-pdf': { inputs: ['jpg', 'png'], min: 1, max: 20, maxPages: 20, options: object({ size: Type.Optional(Type.Union([Type.Literal('a4'), Type.Literal('image')])), orientation: Type.Optional(Type.Union([Type.Literal('portrait'), Type.Literal('landscape')])) }), note: 'Görsel sırası sayfa sırasıdır. Görsel başına en fazla 25 milyon piksel.' },
  ocr: { inputs: ['pdf', 'jpg', 'png'], ...single, maxPages: 20, options: object({ language: Type.Optional(Type.Union([Type.Literal('tur'), Type.Literal('eng'), Type.Literal('tur+eng')])) }), note: 'Türkçe/İngilizce düz metin çıkarır. Sayfa düzeni korunmaz; doğruluk belge kalitesine bağlıdır. En fazla 20 sayfalık PDF.' },
};
export const mimeTypes: Record<FileKind, string> = {
  pdf: 'application/pdf', docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', jpg: 'image/jpeg', png: 'image/png', zip: 'application/zip', txt: 'text/plain; charset=utf-8',
};
export const ToolIdSchema = Type.Union(toolIds.map((id) => Type.Literal(id)));
export const InputKindSchema = Type.Union(['pdf','docx','xlsx','jpg','png'].map((kind) => Type.Literal(kind)));
