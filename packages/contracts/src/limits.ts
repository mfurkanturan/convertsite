// Plain tool limits without schema runtime, so browser bundles can import them cheaply.
export const toolIds = ['pdf-to-word','word-to-pdf','pdf-to-excel','excel-to-pdf','pdf-to-images','images-to-pdf','merge-pdf','edit-pdf-pages','compress-pdf','ocr'] as const;
export type ToolId = typeof toolIds[number];
export type InputKind = 'pdf' | 'docx' | 'xlsx' | 'jpg' | 'png';
export interface ToolLimits { inputs: InputKind[]; min: number; max: number; maxPages: number; note: string }
const single = { min: 1, max: 1 };
export const toolLimits: Record<ToolId, ToolLimits> = {
  'merge-pdf': { inputs: ['pdf'], min: 2, max: 20, maxPages: 300, note: 'Dosya sırası çıktı sırasıdır.' },
  'compress-pdf': { inputs: ['pdf'], ...single, maxPages: 300, note: 'Kayıpsız optimizasyon. Zaten optimize edilmiş dosyada boyut değişmeyebilir.' },
  'edit-pdf-pages': { inputs: ['pdf'], ...single, maxPages: 300, note: 'Aralığı istediğin sırada yazabilirsin: 3, 1-2. Seçilmeyen sayfalar çıkarılır.' },
  'pdf-to-word': { inputs: ['pdf'], ...single, maxPages: 50, note: 'Yazı biçimini, görselleri, tabloları ve sayfa yerleşimini korumaya çalışarak düzenlenebilir Word oluşturur. Karmaşık düzenlerde farklar olabilir; taranmış PDF için OCR kullan.' },
  'pdf-to-excel': { inputs: ['pdf'], ...single, maxPages: 50, note: 'Algılanan tabloları ayrı Excel sayfalarına aktarır. Tablosuz veya taranmış belgeyi dönüştürmez.' },
  'word-to-pdf': { inputs: ['docx'], ...single, maxPages: 300, note: 'DOCX belgesi LibreOffice ile işlenir; font ve sayfa düzeni farklılıkları olabilir.' },
  'excel-to-pdf': { inputs: ['xlsx'], ...single, maxPages: 300, note: 'Çalışma sayfaları LibreOffice baskı düzeniyle PDF’ye aktarılır.' },
  'pdf-to-images': { inputs: ['pdf'], ...single, maxPages: 30, note: 'Seçilen sayfalar JPG veya PNG olur. Birden fazla çıktı ZIP olarak indirilir. En fazla 30 sayfalık PDF.' },
  'images-to-pdf': { inputs: ['jpg', 'png'], min: 1, max: 20, maxPages: 20, note: 'Görsel sırası sayfa sırasıdır. Görsel başına en fazla 25 milyon piksel.' },
  ocr: { inputs: ['pdf', 'jpg', 'png'], ...single, maxPages: 20, note: 'Türkçe/İngilizce düz metin çıkarır. Sayfa düzeni korunmaz; doğruluk belge kalitesine bağlıdır. En fazla 20 sayfalık PDF.' },
};
