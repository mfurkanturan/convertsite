import { ocrLanguageCodes, type ToolId, type ToolOptions } from '@convertsite/contracts';
import type { Locale } from '../i18n/locales';
export interface SettingOption { value: string; label: string; help: string }
export interface Setting { key: keyof ToolOptions; label: string; options: SettingOption[]; multiple?: boolean }
const choice = (value: string, label: string, help: string): SettingOption => ({ value, label, help });
function languageName(code: string, locale: string): string {
  const normalized = code.startsWith('script/') ? code.slice(7).replaceAll('_', ' ') : code.replaceAll('_', '-');
  try {
    const name = new Intl.DisplayNames([locale], { type: 'language' }).of(normalized);
    if (name && name !== normalized) return `${name} (${code})`;
  } catch { /* Script-only traineddata codes have no BCP 47 display name. */ }
  return `${code.startsWith('script/') ? 'Script' : 'Language'}: ${normalized}`;
}
function ocrSettings(locale: string, translated: { label: string; help: string }): Setting[] {
  return [{ key: 'language', label: translated.label, multiple: true, options: ocrLanguageCodes
    .map((code) => choice(code, languageName(code, locale), `${translated.help} (${code})`)) }];
}
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
  },
  es: {
    'excel-to-pdf': [{ key: 'sheets', label: 'Hojas de cálculo', options: [choice('all','Todas las hojas','Exporta todas las hojas del archivo a PDF.'), choice('first','Solo la primera hoja','Exporta únicamente la primera hoja a PDF.')] }],
    'pdf-to-images': [
      { key: 'format', label: 'Formato de imagen', options: [choice('jpg','JPG','Para fotografías y archivos más pequeños; la compresión puede perder detalle.'), choice('png','PNG','Para texto y bordes nítidos; los archivos pueden ocupar más espacio.')] },
      { key: 'dpi', label: 'Calidad de imagen', options: [choice('100','Estándar','Menor resolución y, normalmente, archivos más pequeños.'), choice('150','Alta','Más detalle y, normalmente, archivos más grandes.')] },
    ],
    'images-to-pdf': [
      { key: 'size', label: 'Tamaño de página', options: [choice('a4','A4','Coloca las imágenes en páginas A4.'), choice('image','Ajustar a la imagen','Adapta cada página a las dimensiones de la imagen.')] },
      { key: 'orientation', label: 'Orientación', options: [choice('portrait','Vertical','Crea páginas en orientación vertical.'), choice('landscape','Horizontal','Crea páginas en orientación horizontal.')] },
    ],
    'edit-pdf-pages': [
      { key: 'mode', label: 'Formato de salida', options: [choice('pdf','Páginas seleccionadas en un PDF','Combina las páginas seleccionadas en un solo PDF.'), choice('zip','Un PDF por página (ZIP)','Crea un PDF por cada página seleccionada y los incluye en un ZIP.')] },
      { key: 'rotation', label: 'Girar páginas seleccionadas', options: [choice('0','Sin giro','Mantiene la orientación actual.'), choice('90','90° a la derecha','Gira las páginas seleccionadas 90° en sentido horario.'), choice('180','180°','Gira las páginas media vuelta.'), choice('270','90° a la izquierda','Gira las páginas seleccionadas 90° en sentido antihorario.')] },
    ],
    'page-numbers': [{ key: 'pageNumberPosition', label: 'Posición del número', options: [choice('bottom-center','Abajo, centrado','Coloca el número en el centro del pie de página.'), choice('bottom-right','Abajo, a la derecha','Coloca el número en la esquina inferior derecha.'), choice('top-right','Arriba, a la derecha','Coloca el número en la esquina superior derecha.')] }],
  },
  hi: {
    'excel-to-pdf': [{ key: 'sheets', label: 'वर्कशीट', options: [choice('all','सभी वर्कशीट','फ़ाइल की सभी वर्कशीट को PDF में निर्यात करता है।'), choice('first','केवल पहली वर्कशीट','केवल पहली वर्कशीट को PDF में निर्यात करता है।')] }],
    'pdf-to-images': [
      { key: 'format', label: 'छवि फ़ॉर्मैट', options: [choice('jpg','JPG','फ़ोटो और छोटी फ़ाइलों के लिए; संपीड़न से विवरण कम हो सकता है।'), choice('png','PNG','टेक्स्ट और स्पष्ट किनारों के लिए; फ़ाइल बड़ी हो सकती है।')] },
      { key: 'dpi', label: 'छवि गुणवत्ता', options: [choice('100','मानक','कम रिज़ॉल्यूशन और आम तौर पर छोटी आउटपुट फ़ाइल।'), choice('150','उच्च','अधिक विवरण और आम तौर पर बड़ी आउटपुट फ़ाइल।')] },
    ],
    'images-to-pdf': [
      { key: 'size', label: 'पृष्ठ का आकार', options: [choice('a4','A4','छवियों को A4 पृष्ठों पर रखता है।'), choice('image','छवि के अनुसार','हर पृष्ठ का आकार छवि के माप के अनुसार रखता है।')] },
      { key: 'orientation', label: 'पृष्ठ की दिशा', options: [choice('portrait','पोर्ट्रेट','पृष्ठों को लंबवत बनाता है।'), choice('landscape','लैंडस्केप','पृष्ठों को क्षैतिज बनाता है।')] },
    ],
    'edit-pdf-pages': [
      { key: 'mode', label: 'आउटपुट', options: [choice('pdf','चुने हुए पृष्ठ एक PDF में','चुने हुए पृष्ठों को एक PDF फ़ाइल में जोड़ता है।'), choice('zip','हर पृष्ठ की अलग PDF (ZIP)','हर चुने हुए पृष्ठ की अलग PDF बनाकर ZIP में देता है।')] },
      { key: 'rotation', label: 'चुने हुए पृष्ठ घुमाएँ', options: [choice('0','न घुमाएँ','पृष्ठों की मौजूदा दिशा बनाए रखता है।'), choice('90','90° दाएँ','चुने हुए पृष्ठों को घड़ी की दिशा में 90° घुमाता है।'), choice('180','180°','चुने हुए पृष्ठों को आधा घुमाता है।'), choice('270','90° बाएँ','चुने हुए पृष्ठों को घड़ी की उलटी दिशा में 90° घुमाता है।')] },
    ],
    'page-numbers': [{ key: 'pageNumberPosition', label: 'संख्या की जगह', options: [choice('bottom-center','नीचे बीच में','हर पृष्ठ के नीचे बीच में संख्या रखता है।'), choice('bottom-right','नीचे दाएँ','हर पृष्ठ के नीचे दाएँ संख्या रखता है।'), choice('top-right','ऊपर दाएँ','हर पृष्ठ के ऊपर दाएँ संख्या रखता है।')] }],
  },
  fr: {
    'excel-to-pdf': [{ key: 'sheets', label: 'Feuilles de calcul', options: [choice('all','Toutes les feuilles','Exporte toutes les feuilles du classeur en PDF.'), choice('first','Première feuille uniquement','Exporte uniquement la première feuille en PDF.')] }],
    'pdf-to-images': [
      { key: 'format', label: 'Format de l’image', options: [choice('jpg','JPG','Pour les photos et les fichiers plus légers ; la compression peut réduire les détails.'), choice('png','PNG','Pour le texte et les contours nets ; les fichiers peuvent être plus volumineux.')] },
      { key: 'dpi', label: 'Qualité de l’image', options: [choice('100','Standard','Résolution plus faible et fichier généralement plus léger.'), choice('150','Élevée','Plus de détails et fichier généralement plus volumineux.')] },
    ],
    'images-to-pdf': [
      { key: 'size', label: 'Format de page', options: [choice('a4','A4','Place les images sur des pages A4.'), choice('image','Adapté à l’image','Adapte chaque page aux dimensions de l’image.')] },
      { key: 'orientation', label: 'Orientation', options: [choice('portrait','Portrait','Crée des pages en orientation portrait.'), choice('landscape','Paysage','Crée des pages en orientation paysage.')] },
    ],
    'edit-pdf-pages': [
      { key: 'mode', label: 'Sortie', options: [choice('pdf','Pages sélectionnées dans un PDF','Réunit les pages sélectionnées dans un PDF.'), choice('zip','Un PDF par page (ZIP)','Crée un PDF par page sélectionnée et les regroupe dans un ZIP.')] },
      { key: 'rotation', label: 'Pivoter les pages sélectionnées', options: [choice('0','Aucune rotation','Conserve l’orientation actuelle.'), choice('90','90° à droite','Pivote les pages de 90° dans le sens horaire.'), choice('180','180°','Pivote les pages d’un demi-tour.'), choice('270','90° à gauche','Pivote les pages de 90° dans le sens antihoraire.')] },
    ],
    'page-numbers': [{ key: 'pageNumberPosition', label: 'Position du numéro', options: [choice('bottom-center','En bas, au centre','Place le numéro au centre du bas de chaque page.'), choice('bottom-right','En bas à droite','Place le numéro en bas à droite de chaque page.'), choice('top-right','En haut à droite','Place le numéro en haut à droite de chaque page.')] }],
  },
};
export function getSettings(id: ToolId, locale: Locale = 'tr'): Setting[] {
  if (id === 'ocr' || id === 'pdf-to-pdf-ocr') {
    const labels = {
      tr: { label: 'Belge dilleri (en fazla 2)', help: 'Kurulu Tesseract dillerinden en fazla ikisini seç. İkinci dili seçmek için Ctrl (Mac’te ⌘) tuşunu basılı tut.' },
      en: { label: 'Document languages (up to 2)', help: 'Choose up to two installed Tesseract languages. Hold Ctrl (⌘ on Mac) to select a second language.' },
      es: { label: 'Idiomas del documento (hasta 2)', help: 'Elige hasta dos idiomas instalados de Tesseract. Mantén Ctrl (⌘ en Mac) para elegir el segundo.' },
      fr: { label: 'Langues du document (2 maximum)', help: 'Choisissez jusqu’à deux langues Tesseract installées. Maintenez Ctrl (⌘ sur Mac) pour choisir la seconde.' },
      hi: { label: 'दस्तावेज़ की भाषाएँ (अधिकतम 2)', help: 'इंस्टॉल किए गए Tesseract में से दो भाषाएँ चुनें। दूसरी भाषा चुनने के लिए Ctrl (Mac पर ⌘) दबाए रखें।' },
    };
    return ocrSettings(locale, labels[locale]);
  }
  return settings[locale][id] ?? [];
}
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
