import type { ToolId } from '@convertsite/contracts';
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

export function normalizeSearch(value: string): string {
  return value.toLocaleLowerCase('tr-TR').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/ı/g, 'i');
}
