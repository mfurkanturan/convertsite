import type { ToolId, ToolOptions } from '@convertsite/contracts';
export interface Setting { key: keyof ToolOptions; label: string; options: { value: string; label: string }[] }
const choice = (value: string, label: string) => ({ value, label });
const settings: Partial<Record<ToolId, Setting[]>> = {
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
};
export function getSettings(id: ToolId): Setting[] { return settings[id] ?? []; }
export function requestOptions(id: ToolId, selected: Record<string,string>, pages: string): ToolOptions {
  const entries = getSettings(id).map((setting) => {
    const value = selected[setting.key] ?? setting.options[0].value;
    return [setting.key, setting.key === 'dpi' || setting.key === 'rotation' ? Number(value) : value];
  });
  const result = Object.fromEntries(entries) as ToolOptions;
  if (id === 'edit-pdf-pages' || id === 'pdf-to-images') result.pages = pages.trim();
  return result;
}
