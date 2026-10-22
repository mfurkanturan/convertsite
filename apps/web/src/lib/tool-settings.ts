import type { ToolId, ToolOptions } from '@convertsite/contracts';
import type { Locale } from '../i18n/locales';
export interface Setting { key: keyof ToolOptions; label: string; options: { value: string; label: string }[] }
const choice = (value: string, label: string) => ({ value, label });
const settings: Record<Locale, Partial<Record<ToolId, Setting[]>>> = {
  tr: {
    'excel-to-pdf': [{ key: 'sheets', label: 'Çalışma sayfaları', options: [choice('all','Tüm çalışma sayfaları'), choice('first','İlk çalışma sayfası')] }],
    'pdf-to-images': [
      { key: 'format', label: 'Görsel biçimi', options: [choice('jpg','JPG'), choice('png','PNG')] },
      { key: 'dpi', label: 'Görsel kalitesi', options: [choice('100','Standart'), choice('150','Yüksek')] },
    ],
    'images-to-pdf': [
      { key: 'size', label: 'Sayfa boyutu', options: [choice('a4','A4'), choice('image','Görsele göre')] },
      { key: 'orientation', label: 'Sayfa yönü', options: [choice('portrait','Dikey'), choice('landscape','Yatay')] },
    ],
    'edit-pdf-pages': [
      { key: 'mode', label: 'Çıktı', options: [choice('pdf','Seçilen sayfalar tek PDF'), choice('zip','Sayfa başına PDF (ZIP)')] },
      { key: 'rotation', label: 'Seçilen sayfaları döndür', options: [choice('0','Döndürme'), choice('90','90° sağa'), choice('180','180°'), choice('270','90° sola')] },
    ],
    ocr: [{ key: 'language', label: 'Belge dili', options: [choice('tur','Türkçe'), choice('eng','İngilizce'), choice('tur+eng','Türkçe + İngilizce')] }],
  },
  en: {
    'excel-to-pdf': [{ key: 'sheets', label: 'Worksheets', options: [choice('all','All worksheets'), choice('first','First worksheet only')] }],
    'pdf-to-images': [
      { key: 'format', label: 'Image format', options: [choice('jpg','JPG'), choice('png','PNG')] },
      { key: 'dpi', label: 'Image quality', options: [choice('100','Standard'), choice('150','High')] },
    ],
    'images-to-pdf': [
      { key: 'size', label: 'Page size', options: [choice('a4','A4'), choice('image','Fit to image')] },
      { key: 'orientation', label: 'Orientation', options: [choice('portrait','Portrait'), choice('landscape','Landscape')] },
    ],
    'edit-pdf-pages': [
      { key: 'mode', label: 'Output', options: [choice('pdf','Selected pages as one PDF'), choice('zip','One PDF per page (ZIP)')] },
      { key: 'rotation', label: 'Rotate selected pages', options: [choice('0','No rotation'), choice('90','90° clockwise'), choice('180','180°'), choice('270','90° counter-clockwise')] },
    ],
    // English visitors mostly scan English documents, so English is the default here.
    ocr: [{ key: 'language', label: 'Document language', options: [choice('eng','English'), choice('tur','Turkish'), choice('tur+eng','Turkish + English')] }],
  },
};
export function getSettings(id: ToolId, locale: Locale = 'tr'): Setting[] { return settings[locale][id] ?? []; }
export function requestOptions(id: ToolId, selected: Record<string,string>, pages: string, locale: Locale = 'tr'): ToolOptions {
  const entries = getSettings(id, locale).map((setting) => {
    const value = selected[setting.key] ?? setting.options[0].value;
    return [setting.key, setting.key === 'dpi' || setting.key === 'rotation' ? Number(value) : value];
  });
  const result = Object.fromEntries(entries) as ToolOptions;
  if (id === 'edit-pdf-pages' || id === 'pdf-to-images') result.pages = pages.trim();
  return result;
}
