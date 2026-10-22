import type { ToolId } from '@convertsite/contracts';
import type { Locale } from '../i18n/locales';
import { ui } from '../i18n/ui';
export type Category = 'all' | 'convert' | 'organize' | 'optimize';
export interface Tool {
  id: ToolId;
  name: string;
  description: string;
  category: Exclude<Category, 'all'>;
  icon: string;
  color: string;
  accept: string;
  inputLabel: string;
  output: string;
  multiple?: boolean;
  popular?: boolean;
}

export const categories: { id: Category; label: string; icon: string }[] = [
  { id: 'all', label: 'Tüm araçlar', icon: 'grid' },
  { id: 'convert', label: 'Dönüştür', icon: 'arrows' },
  { id: 'organize', label: 'Düzenle', icon: 'layers' },
  { id: 'optimize', label: 'Optimize et', icon: 'sparkles' },
];

export const tools: Tool[] = [
  { id: 'pdf-to-word', name: 'PDF → Word', description: 'PDF belgelerini düzenlenebilir Word dosyalarına dönüştür.', category: 'convert', icon: 'word', color: 'blue', accept: '.pdf', inputLabel: 'PDF', output: 'DOCX', popular: true },
  { id: 'word-to-pdf', name: 'Word → PDF', description: 'Word belgelerini kolayca paylaşılabilir PDF dosyalarına çevir.', category: 'convert', icon: 'pdf', color: 'coral', accept: '.docx', inputLabel: 'DOCX', output: 'PDF' },
  { id: 'merge-pdf', name: 'PDF birleştir', description: 'Birden fazla PDF’yi istediğin sırayla tek belgede bir araya getir.', category: 'organize', icon: 'merge', color: 'violet', accept: '.pdf', inputLabel: 'PDF', output: 'PDF', multiple: true, popular: true },
  { id: 'compress-pdf', name: 'PDF sıkıştır', description: 'PDF dosyanın boyutunu küçült, paylaşmayı kolaylaştır.', category: 'optimize', icon: 'compress', color: 'mint', accept: '.pdf', inputLabel: 'PDF', output: 'PDF', popular: true },
  { id: 'pdf-to-excel', name: 'PDF → Excel', description: 'PDF içindeki tabloları çalışabileceğin Excel dosyalarına aktar.', category: 'convert', icon: 'excel', color: 'green', accept: '.pdf', inputLabel: 'PDF', output: 'XLSX' },
  { id: 'excel-to-pdf', name: 'Excel → PDF', description: 'Tablolarını ve çalışma sayfalarını PDF olarak paylaş.', category: 'convert', icon: 'table', color: 'teal', accept: '.xlsx', inputLabel: 'XLSX', output: 'PDF' },
  { id: 'pdf-to-images', name: 'PDF → JPG / PNG', description: 'PDF sayfalarını yüksek kaliteli görsellere dönüştür.', category: 'convert', icon: 'image', color: 'amber', accept: '.pdf', inputLabel: 'PDF', output: 'JPG / PNG' },
  { id: 'images-to-pdf', name: 'JPG / PNG → PDF', description: 'Görsellerini sırala ve tek bir PDF dosyasında topla.', category: 'convert', icon: 'images', color: 'pink', accept: '.jpg,.jpeg,.png', inputLabel: 'JPG, PNG', output: 'PDF', multiple: true },
  { id: 'edit-pdf-pages', name: 'PDF sayfalarını düzenle', description: 'Sayfaları ayır, yeniden sırala, döndür veya kaldır.', category: 'organize', icon: 'scissors', color: 'purple', accept: '.pdf', inputLabel: 'PDF', output: 'PDF / ZIP' },
  { id: 'ocr', name: 'Metin çıkar (OCR)', description: 'Taranmış belgeler ve görsellerdeki metni kullanılabilir hale getir.', category: 'optimize', icon: 'scan', color: 'indigo', accept: '.pdf,.jpg,.jpeg,.png', inputLabel: 'PDF, JPG, PNG', output: 'TXT' },
];

const english: Record<ToolId, Pick<Tool, 'name' | 'description'>> = {
  'pdf-to-word': { name: 'PDF to Word', description: 'Turn PDF documents into editable Word files.' },
  'word-to-pdf': { name: 'Word to PDF', description: 'Convert Word documents into easy-to-share PDFs.' },
  'merge-pdf': { name: 'Merge PDF', description: 'Combine several PDFs into one document in the order you choose.' },
  'compress-pdf': { name: 'Compress PDF', description: 'Reduce your PDF file size for easier sharing and uploads.' },
  'pdf-to-excel': { name: 'PDF to Excel', description: 'Extract tables from PDFs into Excel files you can work with.' },
  'excel-to-pdf': { name: 'Excel to PDF', description: 'Share spreadsheets and worksheets as PDF.' },
  'pdf-to-images': { name: 'PDF to JPG / PNG', description: 'Turn PDF pages into high-quality images.' },
  'images-to-pdf': { name: 'JPG / PNG to PDF', description: 'Order your images and collect them in a single PDF.' },
  'edit-pdf-pages': { name: 'Edit PDF pages', description: 'Split, reorder, rotate or remove pages.' },
  ocr: { name: 'Extract text (OCR)', description: 'Make text in scanned documents and images usable.' },
};

export function getTools(locale: Locale): Tool[] {
  return locale === 'tr' ? tools : tools.map((tool) => ({ ...tool, ...english[tool.id] }));
}
export function getCategories(locale: Locale) {
  return categories.map((item) => ({ ...item, label: ui[locale].categories[item.id] }));
}

export function normalizeSearch(value: string): string {
  return value.toLocaleLowerCase('tr-TR').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/ı/g, 'i');
}
