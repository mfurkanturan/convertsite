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
    ocr: [{ key: 'language', label: 'Idioma del documento', options: [choice('eng','Inglés','Para reconocer palabras en inglés.'), choice('tur','Turco','Para reconocer caracteres y palabras en turco.'), choice('tur+eng','Turco e inglés','Para documentos que contienen ambos idiomas.')] }],
    'pdf-to-pdf-ocr': [{ key: 'language', label: 'Idioma del documento', options: [choice('eng','Inglés','Para reconocer palabras en inglés.'), choice('tur','Turco','Para reconocer caracteres y palabras en turco.'), choice('tur+eng','Turco e inglés','Para documentos que contienen ambos idiomas.')] }],
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
    // OCR engine currently supports English and Turkish only; do not offer Hindi here.
    ocr: [{ key: 'language', label: 'दस्तावेज़ की भाषा', options: [choice('eng','अंग्रेज़ी','अंग्रेज़ी शब्द पहचानने के लिए।'), choice('tur','तुर्की','तुर्की अक्षर और शब्द पहचानने के लिए।'), choice('tur+eng','तुर्की + अंग्रेज़ी','दोनों भाषाओं वाले दस्तावेज़ों के लिए।')] }],
    'pdf-to-pdf-ocr': [{ key: 'language', label: 'दस्तावेज़ की भाषा', options: [choice('eng','अंग्रेज़ी','अंग्रेज़ी शब्द पहचानने के लिए।'), choice('tur','तुर्की','तुर्की अक्षर और शब्द पहचानने के लिए।'), choice('tur+eng','तुर्की + अंग्रेज़ी','दोनों भाषाओं वाले दस्तावेज़ों के लिए।')] }],
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
