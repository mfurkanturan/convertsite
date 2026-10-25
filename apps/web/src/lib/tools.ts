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

const spanish: Record<ToolId, Pick<Tool, 'name' | 'description'>> = {
  'pdf-to-word': { name: 'PDF a Word', description: 'Convierte PDF con texto en documentos Word editables.' },
  'word-to-pdf': { name: 'Word a PDF', description: 'Convierte un documento DOCX a PDF.' },
  'merge-pdf': { name: 'Combinar PDF', description: 'Combina archivos PDF en el orden que elijas.' },
  'compress-pdf': { name: 'Comprimir PDF', description: 'Prueba a reducir el tamaño de un archivo PDF.' },
  'pdf-to-excel': { name: 'PDF a Excel', description: 'Exporta las tablas detectadas en un PDF a hojas de Excel.' },
  'excel-to-pdf': { name: 'Excel a PDF', description: 'Convierte hojas de cálculo XLSX a PDF.' },
  'pptx-to-pdf': { name: 'PowerPoint a PDF', description: 'Convierte una presentación PPTX a PDF.' },
  'pdf-to-images': { name: 'PDF a JPG o PNG', description: 'Exporta las páginas de un PDF como imágenes JPG o PNG.' },
  'images-to-pdf': { name: 'Imágenes a PDF', description: 'Combina imágenes JPG y PNG en un solo PDF.' },
  'edit-pdf-pages': { name: 'Organizar páginas PDF', description: 'Reordena, gira, divide o elimina páginas de un PDF.' },
  'page-numbers': { name: 'Añadir números de página', description: 'Añade el número y el total de páginas a un PDF.' },
  'watermark-pdf': { name: 'Añadir marca de agua', description: 'Añade una marca de agua de texto a las páginas de un PDF.' },
  'protect-pdf': { name: 'Proteger PDF', description: 'Establece una contraseña para abrir un PDF.' },
  'unlock-pdf': { name: 'Quitar contraseña de PDF', description: 'Quita la protección de un PDF si conoces su contraseña.' },
  ocr: { name: 'Extraer texto (OCR)', description: 'Extrae texto de un PDF o una imagen a un archivo TXT.' },
  'pdf-to-pdf-ocr': { name: 'Crear PDF buscable (OCR)', description: 'Añade una capa de texto seleccionable y buscable a un PDF escaneado.' },
};

const spanishAliases: Partial<Record<ToolId, string[]>> = {
  'pdf-to-word': ['convertir pdf a word', 'pdf a docx', 'pasar pdf a word'],
  'word-to-pdf': ['convertir word a pdf', 'docx a pdf'],
  'merge-pdf': ['combinar pdf', 'unir pdf', 'juntar pdf'],
  'compress-pdf': ['comprimir pdf', 'reducir tamaño pdf'],
  'pdf-to-excel': ['convertir pdf a excel', 'pdf a xlsx'],
  'excel-to-pdf': ['convertir excel a pdf', 'xlsx a pdf'],
  'pptx-to-pdf': ['powerpoint a pdf', 'pptx a pdf'],
  'pdf-to-images': ['pdf a jpg', 'pdf a png', 'pdf a imagen'],
  'images-to-pdf': ['jpg a pdf', 'png a pdf', 'fotos a pdf'],
  'edit-pdf-pages': ['dividir pdf', 'girar páginas pdf', 'organizar pdf'],
  'page-numbers': ['numerar páginas pdf', 'añadir números de página pdf'],
  'watermark-pdf': ['marca de agua pdf', 'añadir marca de agua'],
  'protect-pdf': ['proteger pdf', 'poner contraseña a pdf'],
  'unlock-pdf': ['quitar contraseña pdf', 'desbloquear pdf'],
  ocr: ['ocr pdf', 'extraer texto de imagen', 'imagen a texto'],
  'pdf-to-pdf-ocr': ['pdf buscable', 'hacer pdf buscable'],
};

export function localizedTools(locale: Locale): Tool[] {
  if (locale === 'tr') return tools;
  const copy = locale === 'es' ? spanish : english;
  return tools.map((tool) => ({ ...tool, ...copy[tool.id], ...(locale === 'es' ? { aliases: [...(tool.aliases ?? []), ...(spanishAliases[tool.id] ?? [])] } : {}) }));
}

export const getTools = localizedTools;

export function localizedCategories(locale: Locale): { id: Category; label: string; icon: string }[] {
  const labels = ui[locale].categories;
  return categories.map((cat) => ({ ...cat, label: labels[cat.id] }));
}

export const getCategories = localizedCategories;

export function normalizeSearch(value: string): string {
  return value.toLocaleLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/ı/g, 'i').replace(/[→/\\_-]+/g, ' ').replace(/[^\p{L}\p{N}]+/gu, ' ').trim().replace(/\s+/g, ' ');
}

export function searchableToolText(tool: Tool): string {
  const englishText = english[tool.id];
  const spanishText = spanish[tool.id];
  return normalizeSearch([
    tool.name,
    tool.description,
    tool.inputLabel,
    tool.output,
    ...(tool.aliases ?? []),
    ...(englishText ? [englishText.name, englishText.description] : []),
    ...(spanishText ? [spanishText.name, spanishText.description, ...(spanishAliases[tool.id] ?? [])] : []),
  ].join(' '));
}
