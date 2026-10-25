import type { ToolId } from '@convertsite/contracts';
import type { Locale } from '../i18n/locales';
import { ui } from '../i18n/ui';
export type Category = 'all' | 'convert' | 'organize' | 'optimize' | 'ocr';
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
  aliases?: string[];
}

export const categories: { id: Category; label: string; icon: string }[] = [
  { id: 'all', label: 'Tüm araçlar', icon: 'grid' },
  { id: 'convert', label: 'Dönüştür', icon: 'arrows' },
  { id: 'organize', label: 'Düzenle', icon: 'layers' },
  { id: 'optimize', label: 'Optimize et', icon: 'sparkles' },
  { id: 'ocr', label: 'OCR', icon: 'scan' },
];

// Suggested means useful entry points selected by product scope, not measured popularity.
export const suggestedToolIds: ToolId[] = ['pdf-to-word', 'word-to-pdf', 'merge-pdf', 'compress-pdf'];

export const tools: Tool[] = [
  { id: 'pdf-to-word', name: 'PDF → Word', description: 'Metin içeren PDF’leri düzenlenebilir Word belgesine dönüştür.', category: 'convert', icon: 'word', color: 'blue', accept: '.pdf', inputLabel: 'PDF', output: 'DOCX', aliases: ['pdf to word', 'pdf to docx', 'pdf yi worde çevir'] },
  { id: 'word-to-pdf', name: 'Word → PDF', description: 'DOCX belgeni PDF biçimine dönüştür.', category: 'convert', icon: 'pdf', color: 'blue', accept: '.docx', inputLabel: 'DOCX', output: 'PDF', aliases: ['word to pdf', 'docx to pdf'] },
  { id: 'merge-pdf', name: 'PDF birleştir', description: 'PDF dosyalarını seçtiğin sırayla tek belgede birleştir.', category: 'organize', icon: 'merge', color: 'purple', accept: '.pdf', inputLabel: 'PDF', output: 'PDF', multiple: true, aliases: ['merge pdf', 'combine pdf', 'join pdf', 'pdf merge'] },
  { id: 'compress-pdf', name: 'PDF sıkıştır', description: 'PDF dosyasının boyutunu küçültmeyi dene.', category: 'optimize', icon: 'compress', color: 'teal', accept: '.pdf', inputLabel: 'PDF', output: 'PDF', aliases: ['compress pdf', 'reduce pdf size', 'shrink pdf'] },
  { id: 'pdf-to-excel', name: 'PDF → Excel', description: 'PDF’te algılanabilen tabloları Excel çalışma sayfalarına aktar.', category: 'convert', icon: 'excel', color: 'blue', accept: '.pdf', inputLabel: 'PDF', output: 'XLSX', aliases: ['pdf to excel', 'pdf to xlsx', 'pdf table to excel'] },
  { id: 'excel-to-pdf', name: 'Excel → PDF', description: 'XLSX çalışma sayfalarını PDF biçimine dönüştür.', category: 'convert', icon: 'table', color: 'blue', accept: '.xlsx', inputLabel: 'XLSX', output: 'PDF', aliases: ['excel to pdf', 'xlsx to pdf', 'spreadsheet to pdf'] },
  { id: 'pptx-to-pdf', name: 'PowerPoint → PDF', description: 'PPTX sunumunu PDF dosyasına dönüştür.', category: 'convert', icon: 'presentation', color: 'blue', accept: '.pptx', inputLabel: 'PPTX', output: 'PDF', aliases: ['powerpoint to pdf', 'pptx to pdf', 'ppt to pdf'] },
  { id: 'pdf-to-images', name: 'PDF → JPG / PNG', description: 'PDF sayfalarını JPG veya PNG olarak dışa aktar.', category: 'convert', icon: 'image', color: 'blue', accept: '.pdf', inputLabel: 'PDF', output: 'JPG / PNG', aliases: ['pdf to jpg', 'pdf to png', 'pdf to image', 'pdf to images'] },
  { id: 'images-to-pdf', name: 'JPG/PNG → PDF', description: 'JPG ve PNG görsellerini tek PDF dosyasında birleştir.', category: 'convert', icon: 'images', color: 'blue', accept: '.jpg,.jpeg,.png', inputLabel: 'JPG, PNG', output: 'PDF', multiple: true, aliases: ['jpg to pdf', 'jpeg to pdf', 'png to pdf', 'image to pdf', 'images to pdf', 'photo to pdf'] },
  { id: 'edit-pdf-pages', name: 'PDF sayfalarını düzenle', description: 'PDF sayfalarını sırala, döndür, ayır veya kaldır.', category: 'organize', icon: 'scissors', color: 'purple', accept: '.pdf', inputLabel: 'PDF', output: 'PDF / ZIP', aliases: ['split pdf', 'rearrange pdf pages', 'rotate pdf pages', 'delete pdf pages', 'organize pdf'] },
  { id: 'page-numbers', name: 'Sayfa numarası ekle', description: 'PDF sayfalarına sayfa ve toplam sayfa numarası ekle.', category: 'organize', icon: 'layers', color: 'purple', accept: '.pdf', inputLabel: 'PDF', output: 'PDF', aliases: ['add page numbers', 'number pdf pages', 'pdf page numbering'] },
  { id: 'watermark-pdf', name: 'Filigran ekle', description: 'PDF sayfalarına metin filigranı ekle.', category: 'organize', icon: 'stamp', color: 'purple', accept: '.pdf', inputLabel: 'PDF', output: 'PDF', aliases: ['add watermark', 'watermark pdf', 'stamp pdf'] },
  { id: 'protect-pdf', name: 'PDF şifrele', description: 'PDF dosyasını açmak için parola belirle.', category: 'optimize', icon: 'shield', color: 'violet', accept: '.pdf', inputLabel: 'PDF', output: 'PDF', aliases: ['encrypt pdf', 'password protect pdf', 'lock pdf'] },
  { id: 'unlock-pdf', name: 'PDF parolasını kaldır', description: 'Parolasını bildiğin PDF’in parola korumasını kaldır.', category: 'optimize', icon: 'unlock', color: 'violet', accept: '.pdf', inputLabel: 'PDF', output: 'PDF', aliases: ['unlock pdf', 'remove pdf password', 'decrypt pdf'] },
  { id: 'ocr', name: 'Metin çıkar (OCR)', description: 'PDF veya görseldeki yazıyı TXT dosyasına çıkar.', category: 'ocr', icon: 'scan', color: 'indigo', accept: '.pdf,.jpg,.jpeg,.png', inputLabel: 'PDF, JPG, PNG', output: 'TXT', aliases: ['ocr', 'extract text', 'image to text', 'pdf to text', 'jpg to text'] },
  { id: 'pdf-to-pdf-ocr', name: 'PDF’yi aranabilir yap (OCR)', description: 'Taranmış PDF’e seçilebilir ve aranabilir metin katmanı ekle.', category: 'ocr', icon: 'scan', color: 'indigo', accept: '.pdf', inputLabel: 'PDF', output: 'PDF', aliases: ['searchable pdf', 'make pdf searchable', 'ocr pdf', 'searchable pdf ocr'] },
];

const english: Record<ToolId, Pick<Tool, 'name' | 'description'>> = {
  'pdf-to-word': { name: 'PDF to Word', description: 'Convert text-based PDFs into editable Word documents.' },
  'word-to-pdf': { name: 'Word to PDF', description: 'Convert a DOCX document to PDF.' },
  'merge-pdf': { name: 'Merge PDF', description: 'Combine PDF files in the order you choose.' },
  'compress-pdf': { name: 'Compress PDF', description: 'Try to reduce a PDF file’s size.' },
  'pdf-to-excel': { name: 'PDF to Excel', description: 'Export detected PDF tables to Excel worksheets.' },
  'excel-to-pdf': { name: 'Excel to PDF', description: 'Convert XLSX worksheets to PDF.' },
  'pptx-to-pdf': { name: 'PowerPoint to PDF', description: 'Convert a PPTX presentation to PDF.' },
  'pdf-to-images': { name: 'PDF to JPG / PNG', description: 'Export PDF pages as JPG or PNG images.' },
  'images-to-pdf': { name: 'JPG / PNG to PDF', description: 'Combine JPG and PNG images into one PDF.' },
  'edit-pdf-pages': { name: 'Edit PDF pages', description: 'Reorder, rotate, split or remove PDF pages.' },
  'page-numbers': { name: 'Add page numbers', description: 'Add the page number and total page count to a PDF.' },
  'watermark-pdf': { name: 'Add watermark', description: 'Add a text watermark to PDF pages.' },
  'protect-pdf': { name: 'Encrypt PDF', description: 'Set a password required to open a PDF.' },
  'unlock-pdf': { name: 'Remove PDF password', description: 'Remove protection from a PDF whose password you know.' },
  ocr: { name: 'Extract text (OCR)', description: 'Extract text from a PDF or image into a TXT file.' },
  'pdf-to-pdf-ocr': { name: 'Make PDF searchable (OCR)', description: 'Add selectable, searchable text to a scanned PDF.' },
};

export function localizedTools(locale: Locale): Tool[] {
  if (locale === 'tr') return tools;
  return tools.map((tool) => ({ ...tool, ...english[tool.id] }));
}

export const getTools = localizedTools;

export function localizedCategories(locale: Locale): { id: Category; label: string; icon: string }[] {
  const labels = ui[locale].categories;
  return categories.map((cat) => ({ ...cat, label: labels[cat.id] }));
}

export const getCategories = localizedCategories;

export function normalizeSearch(value: string): string {
  return value.toLocaleLowerCase('tr-TR').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/ı/g, 'i').replace(/[→/\\_-]+/g, ' ').replace(/[^\p{L}\p{N}]+/gu, ' ').trim().replace(/\s+/g, ' ');
}

export function searchableToolText(tool: Tool): string {
  const englishText = english[tool.id];
  return normalizeSearch([
    tool.name,
    tool.description,
    tool.inputLabel,
    tool.output,
    ...(tool.aliases ?? []),
    ...(englishText ? [englishText.name, englishText.description] : []),
  ].join(' '));
}
