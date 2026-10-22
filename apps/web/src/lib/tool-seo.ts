import type { ToolId } from '@convertsite/contracts';

export interface SeoStep {
  title: string;
  description: string;
}

export interface SeoFaq {
  question: string;
  answer: string;
}

export interface ToolSeoData {
  id: ToolId;
  title: string;
  metaTitle: string;
  metaDescription: string;
  h1: string;
  lead: string;
  keywords: string[];
  steps: SeoStep[];
  features: { title: string; desc: string; icon: string }[];
  faqs: SeoFaq[];
  relatedTools: ToolId[];
}

export const toolSeoMap: Record<ToolId, ToolSeoData> = {
  'pdf-to-word': {
    id: 'pdf-to-word',
    title: 'PDF to Word Dönüştürücü',
    metaTitle: 'PDF Word Dönüştürücü - Ücretsiz & Hızlı PDF to DOCX | DoctorConverter',
    metaDescription: 'Ücretsiz ve güvenli online PDF Word dönüştürücü. Paragraf yapısını, tabloları ve yazı tiplerini bozmadan saniyeler içinde düzenlenebilir DOCX elde edin.',
    h1: 'Online PDF to Word Dönüştürücü',
    lead: 'PDF belgelerinizi düzenlenebilir Microsoft Word (DOCX) dosyalarına anında dönüştürün. Yazı tipleri, tablolar ve sayfa düzeni maksimum hassasiyetle korunur.',
    keywords: ['pdf word dönüştürme', 'pdf to docx', 'ücretsiz pdf word çevirme', 'online pdf düzenleme'],
    steps: [
      { title: '1. PDF Dosyanızı Seçin', description: 'Cihazınızdaki PDF belgesini sürükleyip bırakın veya "Dosya Seç" butonuna tıklayarak yükleyin.' },
      { title: '2. Dönüştürmeyi Başlatın', description: 'Sistem belgenizin metin ve tablo yapısını otomatik olarak analiz eder ve DOCX formatına hazırlar.' },
      { title: '3. Word Belgenizi İndirin', description: 'İşlem tamamlandığında Word dosyanızı tek tıkla indirin. Dosyalarınız 60 dakika içinde sunucudan kalıcı olarak silinir.' }
    ],
    features: [
      { title: 'Orijinal Düzen Koruması', desc: 'Paragraflar, başlıklar ve sütunlar bozulmadan Microsoft Word ortamına aktarılır.', icon: 'layout' },
      { title: '%100 Ücretsiz & Kurulumsun', desc: 'Herhangi bir program indirmenize veya hesap açmanıza gerek yoktur.', icon: 'zap' },
      { title: 'Gizlilik ve Güvenlik', desc: 'Tüm iletim TLS 1.3 ile korunur; dosyalarınız 1 saat sonra otomatik imha edilir.', icon: 'shield' }
    ],
    faqs: [
      { question: 'PDF Word dönüştürme işlemi ücretsiz mi?', answer: 'Evet, DoctorConverter üzerindeki tüm dönüştürme araçları tamamen ücretsizdir ve herhangi bir üyelik gerektirmez.' },
      { question: 'Dönüştürülen Word dosyasında yazı tipleri bozulur mu?', answer: 'Gelişmiş dönüştürme motorumuz belge yapısını, stilleri ve tabloları mümkün olan en yüksek sadakatle korur.' },
      { question: 'Yüklediğim dosyalar güvende mi?', answer: 'Belgeleriniz güvenli sunucularımızda şifrelenmiş olarak işlenir ve dönüştürmeden 60 dakika sonra kalıcı olarak silinir. Kimseyle paylaşılmaz.' }
    ],
    relatedTools: ['word-to-pdf', 'pdf-to-excel', 'compress-pdf', 'ocr']
  },
  'word-to-pdf': {
    id: 'word-to-pdf',
    title: 'Word to PDF Dönüştürücü',
    metaTitle: 'Word PDF Dönüştürücü - Ücretsiz DOCX to PDF Çevirici | DoctorConverter',
    metaDescription: 'Microsoft Word (DOCX) belgelerinizi profesyonel ve her cihazda kusursuz görünen PDF formatına dönüştürün. Hızlı, kayıpsız ve ücretsiz.',
    h1: 'Online Word to PDF Dönüştürücü',
    lead: 'Word (DOCX) belgelerinizi tüm cihazlarda birebir aynı görünen, taşınabilir ve yazdırılabilir yüksek kaliteli PDF dosyalarına çevirin.',
    keywords: ['word pdf dönüştürme', 'docx to pdf', 'word pdf yapma', 'ücretsiz word pdf çevirici'],
    steps: [
      { title: '1. Word Belgenizi Yükleyin', description: 'DOCX dosyanızı sürükleyip bırakın veya cihazınızdan seçin.' },
      { title: '2. Otomatik Dönüştürün', description: 'Yazı tipleri, sayfa kenar boşlukları ve resimler optimize edilerek PDF motoruna aktarılır.' },
      { title: '3. PDF Dosyasını Alın', description: 'Kusursuz PDF belgenizi anında indirin ve dilediğiniz gibi paylaşın.' }
    ],
    features: [
      { title: 'Birebir Görsel Uyumluluk', desc: 'Sayfa düzeniniz, dipnotlarınız ve sayfa numaralarınız milimetrik doğrulukla PDF’ye işlenir.', icon: 'layout' },
      { title: 'Evrensel Paylaşım', desc: 'Oluşturulan PDF’ler telefon, tablet, Mac ve Windows’ta hatasız açılır.', icon: 'device' },
      { title: 'Anında İşlem', desc: 'Gelişmiş altyapımız sayesinde yüzlerce sayfalık Word dosyaları bile saniyeler içinde çevrilir.', icon: 'zap' }
    ],
    faqs: [
      { question: 'Word belgesindeki resimlerin kalitesi düşer mi?', answer: 'Hayır, görsel netliği korunarak yüksek çözünürlüklü vektör ve raster formatında PDF içine gömülür.' },
      { question: 'Mobil cihazlardan Word PDF dönüştürme yapabilir miyim?', answer: 'Evet, akıllı telefonunuz veya tabletinizin tarayıcısından hiçbir uygulama indirmeden dönüştürme yapabilirsiniz.' }
    ],
    relatedTools: ['pdf-to-word', 'merge-pdf', 'compress-pdf']
  },
  'merge-pdf': {
    id: 'merge-pdf',
    title: 'PDF Birleştirme',
    metaTitle: 'PDF Birleştirme - Birden Fazla PDF\'yi Tek Dosya Yap | DoctorConverter',
    metaDescription: 'Birden çok PDF dosyasını dilediğiniz sırada tek bir PDF belgesinde birleştirin. Kolay sürükle-bırak, hızlı ve tamamen ücretsiz.',
    h1: 'Online PDF Birleştirme Aracı',
    lead: 'Ayrı ayrı taranmış evrakları, raporları veya sunumları tek bir derli toplu PDF belgesinde birleştirin. Sıralamayı istediğiniz gibi belirleyin.',
    keywords: ['pdf birleştirme', 'pdf birleştir', 'pdf merge', 'iki pdfyi birleştirme', 'pdf dosyalarını birleştir'],
    steps: [
      { title: '1. PDF Dosyalarını Ekleyin', description: 'Birleştirmek istediğiniz 2 veya daha fazla PDF dosyasını seçin veya çalışma alanına sürükleyin.' },
      { title: '2. Sıralamayı Ayarlayın', description: 'Dosyaların belgedeki sırasını belirlemek için önizleme kartlarını dilediğiniz gibi düzenleyin.' },
      { title: '3. Birleştirip İndirin', description: '"Birleştir" butonuna basarak saniyeler içinde tek parça PDF belgenizi indirin.' }
    ],
    features: [
      { title: 'Sınırsız Sayfa Desteği', desc: 'Onlarca sayfadan oluşan büyük raporları bile kayıpsız şekilde tek belgede toplayın.', icon: 'layers' },
      { title: 'Esnek Sıralama', desc: 'Sayfa ve dosya sırasını kolayca sürükleyerek tam istediğiniz akışı oluşturun.', icon: 'sliders' },
      { title: 'Orijinal Çözünürlük', desc: 'Birleştirme sırasında sayfa kalitesinden ve çözünürlükten ödün verilmez.', icon: 'sparkles' }
    ],
    faqs: [
      { question: 'Kaç adet PDF dosyasını aynı anda birleştirebilirim?', answer: 'Tek seferde onlarca PDF dosyasını seçip dilediğiniz sırada tek belgede birleştirebilirsiniz.' },
      { question: 'Birleştirilen dosyalardaki yer imleri (bookmarks) korunur mu?', answer: 'Evet, standart PDF yapısı korunarak tüm sayfalar düzenli biçimde bağlanır.' }
    ],
    relatedTools: ['compress-pdf', 'edit-pdf-pages', 'pdf-to-word']
  },
  'compress-pdf': {
    id: 'compress-pdf',
    title: 'PDF Sıkıştırma (Boyut Küçültme)',
    metaTitle: 'PDF Boyut Küçültme - PDF Sıkıştırma Ücretsiz | DoctorConverter',
    metaDescription: 'Büyük PDF dosyalarının boyutunu kalite kaybı yaşamadan küçültün. E-posta ile gönderilebilir, web için optimize edilmiş hafif PDF\'ler oluşturun.',
    h1: 'Online PDF Boyutu Küçültme ve Sıkıştırma',
    lead: 'E-posta ek sınırlarına takılan veya web sitenizi yavaşlatan ağır PDF dosyalarınızı, okunabilirlikten ödün vermeden maksimum oranda sıkıştırın.',
    keywords: ['pdf sıkıştırma', 'pdf boyut küçültme', 'pdf boyutu düşürme', 'pdf compress', 'pdf mb küçültme'],
    steps: [
      { title: '1. Sıkıştırılacak PDF’yi Yükleyin', description: 'Boyutunu düşürmek istediğiniz PDF dosyasını araca yükleyin.' },
      { title: '2. Sıkıştırma Düzeyini Seçin', description: 'Önerilen akıllı sıkıştırma algoritması dosyanızı otomatik olarak optimize eder.' },
      { title: '3. Hafif PDF’nizi İndirin', description: 'Yüzde kaç tasarruf sağlandığını görün ve hafifletilmiş dosyanızı hemen indirin.' }
    ],
    features: [
      { title: '%80’e Varan Tasarruf', desc: 'Gereksiz metadata ve aşırı yüksek görsel çözünürlükleri elenerek devasa boyut düşüşü sağlanır.', icon: 'arrow-down' },
      { title: 'Okunabilir Metin Garantisi', desc: 'Metin keskinliği korunur; yazılar bulanıklaşmaz veya bozulmaz.', icon: 'eye' },
      { title: 'E-posta Uyumlu', desc: 'Gmail, Outlook gibi servislerin 25 MB ek sınırına takılmadan kolayca paylaşın.', icon: 'mail' }
    ],
    faqs: [
      { question: 'Sıkıştırma işlemi metin kalitesini bozar mı?', answer: 'Hayır, akıllı vektör optimizasyonumuz yalnızca gereksiz gömülü verileri ve aşırı çözünürlüklü fotoğrafları dengeler; metinler keskin kalır.' },
      { question: 'PDF sıkıştırma ne kadar sürer?', answer: 'Çoğu dosya 2-5 saniye içinde optimize edilir.' }
    ],
    relatedTools: ['merge-pdf', 'pdf-to-word', 'pdf-to-images']
  },
  'pdf-to-excel': {
    id: 'pdf-to-excel',
    title: 'PDF to Excel Dönüştürücü',
    metaTitle: 'PDF Excel Dönüştürücü - Ücretsiz PDF to XLSX Aktarma | DoctorConverter',
    metaDescription: 'PDF tablolarını, faturaları ve finansal raporları düzenlenebilir Microsoft Excel (XLSX) tablolarına dönüştürün. Hızlı, hatasız ve ücretsiz.',
    h1: 'Online PDF to Excel Dönüştürücü',
    lead: 'PDF belgelerinizdeki sayısal verileri, bilançoları ve karmaşık tabloları tek tek elle yazmak yerine doğrudan Excel tablosuna aktarın.',
    keywords: ['pdf excel dönüştürme', 'pdf to xlsx', 'pdf tablo aktarma', 'pdf excel yapma', 'online pdf excel çevirici'],
    steps: [
      { title: '1. PDF Dosyanızı Yükleyin', description: 'İçinde tablo veya liste bulunan PDF belgenizi yükleyin.' },
      { title: '2. Tablolar Algılansın', description: 'Akıllı motorumuz hücre sınırlarını, satırları ve sütunları tespit eder.' },
      { title: '3. Excel Belgenizi İndirin', description: 'Formüllere ve hesaplamalara hazır XLSX dosyanızı hemen kaydedin.' }
    ],
    features: [
      { title: 'Hücre Yapısını Koruma', desc: 'Satırlar, sütunlar ve sayı formatları düzenli hücrelere yerleştirilir.', icon: 'grid' },
      { title: 'Finans ve Muhasebe Dostu', desc: 'Fatura, banka ekstresi ve mali tabloları hızla işlenebilir veriye dönüştürün.', icon: 'calculator' },
      { title: 'Gizlilik Garantisi', desc: 'Hassas finansal belgeleriniz işlem bittikten sonra tamamen imha edilir.', icon: 'shield' }
    ],
    faqs: [
      { question: 'Çok sayfalı PDF belgelerindeki tablolar ayrı sayfalara mı aktarılır?', answer: 'Evet, sayfalar Excel çalışma kitabında düzenli ve ardışık şekilde listelenir.' },
      { question: 'Türkçe karakter desteği var mı?', answer: 'Evet, UTF-8 tam uyumludur; Türkçe karakterler ve para birimi sembolleri eksiksiz aktarılır.' }
    ],
    relatedTools: ['excel-to-pdf', 'pdf-to-word', 'ocr']
  },
  'excel-to-pdf': {
    id: 'excel-to-pdf',
    title: 'Excel to PDF Dönüştürücü',
    metaTitle: 'Excel PDF Dönüştürücü - Ücretsiz XLSX to PDF Çevirici | DoctorConverter',
    metaDescription: 'Microsoft Excel (XLSX) tablolarınızı profesyonel, sayfaya tam oturan PDF formatına dönüştürün. Hızlı ve kayıpsız.',
    h1: 'Online Excel to PDF Dönüştürücü',
    lead: 'Excel çalışma sayfalarınızı, tabloların sayfa sınırlarından taşmasını önleyen profesyonel PDF raporlarına çevirin.',
    keywords: ['excel pdf dönüştürme', 'xlsx to pdf', 'excel pdf yapma', 'tablo pdf çevir'],
    steps: [
      { title: '1. Excel Dosyanızı Seçin', description: 'Dönüştürmek istediğiniz XLSX tablosunu yükleyin.' },
      { title: '2. Sayfa Yerleşimi Optimize Edilsin', description: 'Geniş tablolar sayfa sınırlarına sığacak şekilde dengelenir.' },
      { title: '3. PDF Raporunuzu İndirin', description: 'Sunuma ve yazdırmaya hazır PDF belgenizi tek tıkla indirin.' }
    ],
    features: [
      { title: 'Taşmayan Tablolar', desc: 'Geniş hücreler otomatik olarak sayfa kenarlıklarına uyarlanır.', icon: 'layout' },
      { title: 'Baskıya Hazır', desc: 'Raporlarınızı ve mali cetvellerinizi doğrudan A4 çıktısı alınabilir hale getirir.', icon: 'printer' },
      { title: 'Hızlı ve Güvenli', desc: 'Kurulum gerektirmez, saniyeler içinde güvenle dönüştürülür.', icon: 'zap' }
    ],
    faqs: [
      { question: 'Gizli veya kilitli sütunlar PDF’e yansır mı?', answer: 'Görünür çalışma alanı standart sayfa görünümü olarak PDF’e işlenir.' }
    ],
    relatedTools: ['pdf-to-excel', 'word-to-pdf', 'compress-pdf']
  },
  'pdf-to-images': {
    id: 'pdf-to-images',
    title: 'PDF to JPG / PNG Dönüştürücü',
    metaTitle: 'PDF JPG Dönüştürücü - Sayfaları Görsele Çevir | DoctorConverter',
    metaDescription: 'PDF sayfalarını yüksek çözünürlüklü JPG veya PNG görsellerine dönüştürün. İster tek tek sayfalar, ister toplu ZIP indirme.',
    h1: 'Online PDF JPG / PNG Görsel Dönüştürücü',
    lead: 'PDF belgelerinizin sayfalarını yüksek çözünürlüklü görsel dosyalarına (JPG veya PNG) çevirin ve sosyal medyada veya sunumlarda kolayca paylaşın.',
    keywords: ['pdf jpg dönüştürme', 'pdf png çevirme', 'pdf fotoğrafa çevir', 'pdf resim yapma', 'pdf to image'],
    steps: [
      { title: '1. PDF Belgenizi Yükleyin', description: 'Resme dönüştürmek istediğiniz PDF dosyasını seçin.' },
      { title: '2. Sayfalar İşlensin', description: 'Her sayfa yüksek DPI ile bağımsız görsel formatına dönüştürülür.' },
      { title: '3. Görsellerinizi İndirin', description: 'Sayfaları tek tek veya tümünü tek bir ZIP arşivi olarak indirin.' }
    ],
    features: [
      { title: 'Yüksek DPI Netlik', desc: 'Metinler ve grafikler piksellenmeden net ve berrak şekilde görselleştirilir.', icon: 'sparkles' },
      { title: 'Toplu İndirme Kolaylığı', desc: 'Çok sayfalı belgeler tek bir ZIP dosyası halinde düzenli olarak paketlenir.', icon: 'archive' },
      { title: 'Mobil Uyumlu', desc: 'Oluşturulan fotoğrafları doğrudan galerinize kaydedebilir veya mesajla gönderebilirsiniz.', icon: 'device' }
    ],
    faqs: [
      { question: 'Görseller hangi formatta indirilir?', answer: 'Sayfalar standart yüksek uyumlu JPG veya şeffaflık destekli PNG olarak hazırlanır.' }
    ],
    relatedTools: ['images-to-pdf', 'compress-pdf', 'edit-pdf-pages']
  },
  'images-to-pdf': {
    id: 'images-to-pdf',
    title: 'JPG / PNG to PDF Dönüştürücü',
    metaTitle: 'JPG PNG to PDF Dönüştürücü - Resimleri PDF Yap | DoctorConverter',
    metaDescription: 'Fotoğraflarınızı, taranmış fişleri ve görselleri tek bir düzenli PDF dosyasında birleştirin. Hızlı, kaliteli ve ücretsiz.',
    h1: 'Online Görselleri PDF’ye Dönüştürme',
    lead: 'Telefonunuzdaki veya bilgisayarınızdaki JPG, PNG veya WebP görsellerini saniyeler içinde şık, tek bir PDF albümü veya dokümanı haline getirin.',
    keywords: ['jpg pdf dönüştürme', 'resimleri pdf yapma', 'png to pdf', 'fotoğrafı pdf yap', 'image to pdf'],
    steps: [
      { title: '1. Resimleri Seçin', description: 'Birden fazla fotoğrafı veya görseli sürükleyip bırakarak yükleyin.' },
      { title: '2. Sıralamayı Belirleyin', description: 'Fotoğrafların PDF içindeki sayfa sırasını dilediğiniz gibi düzenleyin.' },
      { title: '3. PDF Olarak İndirin', description: 'Tüm görseller tek bir A4 PDF dosyasında birleştirilerek indirilir.' }
    ],
    features: [
      { title: 'Otomatik Sayfa Hizalama', desc: 'Görseller standart dikey veya yatay sayfa düzenine en uygun şekilde yerleştirilir.', icon: 'layout' },
      { title: 'Toplu Yükleme', desc: 'Aynı anda onlarca fotoğrafı seçip tek belgede toplayabilirsiniz.', icon: 'layers' },
      { title: 'Orijinal Renk Profili', desc: 'Fotoğrafların renk dengesi ve canlılığı korunur.', icon: 'image' }
    ],
    faqs: [
      { question: 'Hangi görsel formatları destekleniyor?', answer: 'JPG, JPEG ve PNG formatındaki tüm popüler görseller desteklenmektedir.' }
    ],
    relatedTools: ['pdf-to-images', 'merge-pdf', 'compress-pdf']
  },
  'edit-pdf-pages': {
    id: 'edit-pdf-pages',
    title: 'PDF Sayfalarını Düzenle ve Ayır',
    metaTitle: 'PDF Sayfalarını Düzenle & Ayır - Sayfa Silme, Döndürme | DoctorConverter',
    metaDescription: 'PDF dosyanızdaki istenmeyen sayfaları silin, ters sayfaları döndürün veya sayfaları ayrı ayrı dosyalara bölün. Ücretsiz ve güvenli.',
    h1: 'Online PDF Sayfalarını Düzenleme ve Ayırma',
    lead: 'PDF belgelerinizdeki sayfaları tek tek kontrol edin. Sayfaları döndürün, gereksiz sayfaları silin veya dilediğiniz sayfaları yeni bir PDF olarak kaydedin.',
    keywords: ['pdf sayfa silme', 'pdf sayfa ayırma', 'pdf split', 'pdf döndürme', 'pdf düzenleme'],
    steps: [
      { title: '1. PDF Dosyanızı Ekleyin', description: 'Düzenlemek istediğiniz PDF belgesini yükleyin.' },
      { title: '2. Sayfaları Yönetin', description: 'Görsel sayfa önizlemeleri üzerinden sayfaları döndürün, silin veya ayırın.' },
      { title: '3. Yeni Belgenizi İndirin', description: 'Düzenlenmiş PDF dosyanızı hemen indirin.' }
    ],
    features: [
      { title: 'Görsel Küçük Resimler', desc: 'Her sayfayı küçük resim olarak görüp neyi sildiğinizi net olarak takip edin.', icon: 'eye' },
      { title: '90° ve 180° Döndürme', desc: 'Ters taranmış sayfaları tek tıkla doğru yöne çevirin.', icon: 'rotate' },
      { title: 'Hızlı Ayırma (Split)', desc: 'Büyük bir dosyanın yalnızca ihtiyacınız olan sayfalarını çekip alın.', icon: 'scissors' }
    ],
    faqs: [
      { question: 'Belirli bir sayfa aralığını ayırabilir miyim?', answer: 'Evet, ayırmak istediğiniz sayfaları seçerek bağımsız bir PDF olarak dışa aktarabilirsiniz.' }
    ],
    relatedTools: ['merge-pdf', 'compress-pdf', 'pdf-to-word']
  },
  'ocr': {
    id: 'ocr',
    title: 'PDF Metin Tanıma (OCR)',
    metaTitle: 'PDF OCR - Taranmış PDF ve Görselden Metin Çıkarma | DoctorConverter',
    metaDescription: 'Taranmış belgelerden, fotoğraflardan ve kilitli PDF\'lerden metinleri (OCR) çıkarın. Düzenlenebilir ve kopyalanabilir TXT veya Word elde edin.',
    h1: 'Online PDF ve Görsel Metin Çıkarma (OCR)',
    lead: 'Taranmış evraklar, kitap sayfaları veya resimlerdeki metinleri gelişmiş optik karakter tanıma (OCR) teknolojisiyle anında kopyalanabilir metne dönüştürün.',
    keywords: ['pdf ocr', 'resimden yazı kopyalama', 'fotoğraftan metin çıkarma', 'taranmış pdf metne çevirme', 'online ocr'],
    steps: [
      { title: '1. Belgenizi veya Görselinizi Yükleyin', description: 'Metin çıkarmak istediğiniz taranmış PDF veya resim dosyasını yükleyin.' },
      { title: '2. OCR Motoru Analiz Etsin', description: 'Optik karakter tanıma algoritması karakterleri ve satırları okur.' },
      { title: '3. Metni Kopyalayın veya İndirin', description: 'Çıkarılan metni doğrudan kopyalayın veya metin dosyası olarak indirin.' }
    ],
    features: [
      { title: 'Türkçe Karakter Desteği', desc: 'Ç, Ğ, İ, Ö, Ş, Ü gibi özel Türkçe karakterleri yüksek doğrulukla tanır.', icon: 'check' },
      { title: 'Taranmış Evrak Uyumu', desc: 'Eski ve taranmış belgelerdeki yazıları elle yeniden yazma zahmetinden kurtulun.', icon: 'scan' },
      { title: 'Sıfır Kurulum', desc: 'Karmaşık OCR programlarına gerek kalmadan tarayıcınızdan anında çalıştırın.', icon: 'zap' }
    ],
    faqs: [
      { question: 'Hangi dillerdeki metinler tanınabilir?', answer: 'Başta Türkçe ve İngilizce olmak üzere standart Latin alfabesini kullanan belgelerde yüksek doğruluk sağlar.' },
      { question: 'El yazısı destekleniyor mu?', answer: 'Basılı ve daktilo edilmiş belgelerde en yüksek başarıyı sağlar; net el yazılarında da kısmi sonuç verebilir.' }
    ],
    relatedTools: ['pdf-to-word', 'pdf-to-excel', 'pdf-to-images']
  }
};
