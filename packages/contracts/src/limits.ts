// Plain tool limits without schema runtime, so browser bundles can import them cheaply.
export const toolIds = [
  'pdf-to-word',
  'word-to-pdf',
  'pdf-to-excel',
  'excel-to-pdf',
  'pdf-to-md',
  'pdf-to-images',
  'images-to-pdf',
  'merge-pdf',
  'edit-pdf-pages',
  'compress-pdf',
  'ocr',
  'pdf-to-pdf-ocr',
  'pptx-to-pdf',
  'protect-pdf',
  'unlock-pdf',
  'page-numbers',
  'watermark-pdf',
] as const;

export type ToolId = typeof toolIds[number];
export type InputKind = 'pdf' | 'docx' | 'xlsx' | 'pptx' | 'jpg' | 'png';
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
  'pdf-to-md': { inputs: ['pdf'], ...single, maxPages: 50, note: 'Metin içeren PDF’i Markdown’a çevirir; başlık, liste, tablo ve linkler korunur. Görseller küçültülmüş WebP olarak ZIP içinde ayrıca verilir. Taranmış PDF için OCR kullan; satır içi görsel yerleşimi korunmaz.' },
  'pdf-to-images': { inputs: ['pdf'], ...single, maxPages: 30, note: 'Seçilen sayfalar JPG veya PNG olur. Birden fazla çıktı ZIP olarak indirilir. En fazla 30 sayfalık PDF.' },
  'images-to-pdf': { inputs: ['jpg', 'png'], min: 1, max: 20, maxPages: 20, note: 'Görsel sırası sayfa sırasıdır. Görsel başına en fazla 25 milyon piksel.' },
  ocr: { inputs: ['pdf', 'jpg', 'png'], ...single, maxPages: 20, note: 'Kurulu Tesseract modellerinden en fazla iki dil seçerek düz metin çıkar. Sayfa düzeni korunmaz; doğruluk belge kalitesine ve dile bağlıdır. En fazla 20 sayfalık PDF.' },
  'pdf-to-pdf-ocr': { inputs: ['pdf'], ...single, maxPages: 20, note: 'Seçtiğin Tesseract dilleriyle taranmış PDF sayfalarına aranabilir metin katmanı ekler. Yerleşim korunur; doğruluk görüntü kalitesine ve dile bağlıdır. En fazla 20 sayfalık PDF.' },
  'pptx-to-pdf': { inputs: ['pptx'], ...single, maxPages: 300, note: 'PowerPoint sunumu LibreOffice ile işlenerek yüksek kaliteli PDF’ye dönüştürülür.' },
  'protect-pdf': { inputs: ['pdf'], ...single, maxPages: 300, note: 'PDF belgesine güçlü 256-bit AES şifreleme uygular. Belgeyi açmak için belirlediğiniz parola gerekecektir.' },
  'unlock-pdf': { inputs: ['pdf'], ...single, maxPages: 300, note: 'Şifresini bildiğiniz korumalı PDF belgesinin parolasını kaldırarak kilitsiz PDF oluşturur.' },
  'page-numbers': { inputs: ['pdf'], ...single, maxPages: 300, note: 'Tüm sayfalara düzenli sayfa numarası ekler. Resmi evrak ve tez teslimleri için uygundur.' },
  'watermark-pdf': { inputs: ['pdf'], ...single, maxPages: 300, note: 'Sayfalara belirlediğiniz metin filigranını basar. Taslak veya gizli belgeler için idealdir.' },
};
