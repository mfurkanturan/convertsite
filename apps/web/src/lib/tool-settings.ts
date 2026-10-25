import type { ToolId, ToolOptions } from '@convertsite/contracts';
import type { Locale } from '../i18n/locales';
export interface SettingOption { value: string; label: string; help: string }
export interface Setting { key: keyof ToolOptions; label: string; options: SettingOption[] }
const choice = (value: string, label: string, help: string): SettingOption => ({ value, label, help });
const settings: Record<Locale, Partial<Record<ToolId, Setting[]>>> = {
  tr: {
    'excel-to-pdf': [{ key: 'sheets', label: 'Çalışma sayfaları', options: [choice('all','Tüm çalışma sayfaları','Dosyadaki tüm çalışma sayfalarını PDF’e aktarır.'), choice('first','İlk çalışma sayfası','Yalnızca ilk çalışma sayfasını PDF’e aktarır.')] }],
    'pdf-to-images': [
      { key: 'format', label: 'Görsel biçimi', options: [choice('jpg','JPG','Fotoğraf ve küçük dosyalar için; sıkıştırma ayrıntı kaybına yol açabilir.'), choice('png','PNG','Metin ve keskin kenarlar için; dosyalar daha büyük olabilir.')] },
      { key: 'dpi', label: 'Görsel kalitesi', options: [choice('100','Standart','Daha düşük çözünürlük, genellikle daha küçük çıktı dosyası.'), choice('150','Yüksek','Daha fazla ayrıntı, genellikle daha büyük çıktı dosyası.')] },
    ],
    'images-to-pdf': [
      { key: 'size', label: 'Sayfa boyutu', options: [choice('a4','A4','Görselleri A4 boyutunda sayfalara yerleştirir.'), choice('image','Görsele göre','Her sayfanın boyutunu görselin ölçülerine uyarlar.')] },
      { key: 'orientation', label: 'Sayfa yönü', options: [choice('portrait','Dikey','Sayfaları dikey yönde oluşturur.'), choice('landscape','Yatay','Sayfaları yatay yönde oluşturur.')] },
    ],
    'edit-pdf-pages': [
      { key: 'mode', label: 'Çıktı', options: [choice('pdf','Seçilen sayfalar tek PDF','Seçtiğin sayfaları tek bir PDF dosyasında birleştirir.'), choice('zip','Sayfa başına PDF (ZIP)','Her seçili sayfayı ayrı PDF yapıp ZIP içinde verir.')] },
      { key: 'rotation', label: 'Seçilen sayfaları döndür', options: [choice('0','Döndürme','Sayfaların mevcut yönünü korur.'), choice('90','90° sağa','Seçilen sayfaları saat yönünde 90° çevirir.'), choice('180','180°','Seçilen sayfaları yarım tur çevirir.'), choice('270','90° sola','Seçilen sayfaları saat yönünün tersine 90° çevirir.')] },
    ],
    'page-numbers': [
      { key: 'pageNumberPosition', label: 'Numara konumu', options: [choice('bottom-center','Alt orta','Numarayı her sayfanın alt orta kısmına ekler.'), choice('bottom-right','Alt sağ','Numarayı her sayfanın alt sağ kısmına ekler.'), choice('top-right','Üst sağ','Numarayı her sayfanın üst sağ kısmına ekler.')] },
    ],
    ocr: [{ key: 'language', label: 'Belge dili', options: [choice('tur','Türkçe','Türkçe karakter ve sözcükleri tanımak için.'), choice('eng','İngilizce','İngilizce sözcükleri tanımak için.'), choice('tur+eng','Türkçe + İngilizce','İki dilin birlikte bulunduğu belgeler için.')] }],
    'pdf-to-pdf-ocr': [{ key: 'language', label: 'Belge dili', options: [choice('tur','Türkçe','Türkçe karakter ve sözcükleri tanımak için.'), choice('eng','İngilizce','İngilizce sözcükleri tanımak için.'), choice('tur+eng','Türkçe + İngilizce','İki dilin birlikte bulunduğu belgeler için.')] }],
  },
  en: {
    'excel-to-pdf': [{ key: 'sheets', label: 'Worksheets', options: [choice('all','All worksheets','Exports every worksheet in the file to PDF.'), choice('first','First worksheet only','Exports only the first worksheet to PDF.')] }],
    'pdf-to-images': [
      { key: 'format', label: 'Image format', options: [choice('jpg','JPG','For photos and smaller files; compression may lose detail.'), choice('png','PNG','For text and sharp edges; files may be larger.')] },
      { key: 'dpi', label: 'Image quality', options: [choice('100','Standard','Lower resolution, usually a smaller output file.'), choice('150','High','More detail, usually a larger output file.')] },
    ],
    'images-to-pdf': [
      { key: 'size', label: 'Page size', options: [choice('a4','A4','Places images on A4 pages.'), choice('image','Fit to image','Sets each page to the image dimensions.')] },
      { key: 'orientation', label: 'Orientation', options: [choice('portrait','Portrait','Creates pages in portrait orientation.'), choice('landscape','Landscape','Creates pages in landscape orientation.')] },
    ],
    'edit-pdf-pages': [
      { key: 'mode', label: 'Output', options: [choice('pdf','Selected pages as one PDF','Combines selected pages into one PDF file.'), choice('zip','One PDF per page (ZIP)','Creates a separate PDF for each selected page and returns a ZIP.')] },
      { key: 'rotation', label: 'Rotate selected pages', options: [choice('0','No rotation','Keeps the pages in their current orientation.'), choice('90','90° clockwise','Turns selected pages 90° clockwise.'), choice('180','180°','Turns selected pages halfway around.'), choice('270','90° counter-clockwise','Turns selected pages 90° counter-clockwise.')] },
    ],
    'page-numbers': [
      { key: 'pageNumberPosition', label: 'Number position', options: [choice('bottom-center','Bottom center','Places the number at the bottom center of each page.'), choice('bottom-right','Bottom right','Places the number at the bottom right of each page.'), choice('top-right','Top right','Places the number at the top right of each page.')] },
    ],
    ocr: [{ key: 'language', label: 'Document language', options: [choice('eng','English','For recognizing English words.'), choice('tur','Turkish','For recognizing Turkish characters and words.'), choice('tur+eng','Turkish + English','For documents that contain both languages.')] }],
    'pdf-to-pdf-ocr': [{ key: 'language', label: 'Document language', options: [choice('eng','English','For recognizing English words.'), choice('tur','Turkish','For recognizing Turkish characters and words.'), choice('tur+eng','Turkish + English','For documents that contain both languages.')] }],
  },
};
export function getSettings(id: ToolId, locale: Locale = 'tr'): Setting[] { return settings[locale][id] ?? []; }
export function requestOptions(id: ToolId, selected: Record<string,string>, pages: string, locale: Locale = 'tr', customText?: string): ToolOptions {
  const entries = getSettings(id, locale).map((setting) => {
    const value = selected[setting.key] ?? setting.options[0].value;
    return [setting.key, setting.key === 'dpi' || setting.key === 'rotation' ? Number(value) : value];
  });
  const result = Object.fromEntries(entries) as ToolOptions;
  if (id === 'edit-pdf-pages' || id === 'pdf-to-images') result.pages = pages.trim();
  if (id === 'protect-pdf' || id === 'unlock-pdf') result.password = (customText || '').trim();
  if (id === 'watermark-pdf') result.watermarkText = (customText || 'CONFIDENTIAL').trim();
  return result;
}
