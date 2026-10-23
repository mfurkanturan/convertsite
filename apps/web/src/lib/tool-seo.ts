import type { ToolId } from '@convertsite/contracts';

export interface SeoStep {
  title: string;
  description: string;
}

export interface SeoFaq {
  question: string;
  answer: string;
}

export interface SeoUseCase {
  title: string;
  tag: string;
  target: string;
  description: string;
  benefit: string;
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
  useCases?: SeoUseCase[];
}

export const toolSeoMap: Record<ToolId, ToolSeoData> = {
  'pdf-to-word': {
    id: 'pdf-to-word',
    title: 'PDF to Word Dönüştürücü',
    metaTitle: 'PDF Word Dönüştürücü - Ücretsiz & Hızlı PDF to DOCX | DoctorConverter',
    metaDescription: 'Ücretsiz ve güvenli online PDF Word dönüştürücü. Paragraf yapısını, tabloları ve yazı tiplerini bozmadan saniyeler içinde düzenlenebilir DOCX elde edin.',
    h1: 'Online PDF to Word Dönüştürücü',
    lead: 'PDF belgelerinizi düzenlenebilir Microsoft Word (DOCX) dosyalarına anında dönüştürün. Yazı tipleri, tablolar ve sayfa düzeni maksimum hassasiyetle korunur.',
    keywords: ['pdf word dönüştürme', 'pdf to docx', 'ücretsiz pdf word çevirme', 'online pdf düzenleme', 'cv worde çevirme', 'tez pdf word yapma'],
    steps: [
      { title: '1. PDF Dosyanızı Seçin', description: 'Cihazınızdaki PDF belgesini sürükleyip bırakın veya "Dosya Seç" butonuna tıklayarak yükleyin.' },
      { title: '2. Dönüştürmeyi Başlatın', description: 'Sistem belgenizin metin ve tablo yapısını otomatik olarak analiz eder ve DOCX formatına hazırlar.' },
      { title: '3. Word Belgenizi İndirin', description: 'İşlem tamamlandığında Word dosyanızı tek tıkla indirin. Dosyalarınız 60 dakika içinde sunucudan kalıcı olarak silinir.' }
    ],
    features: [
      { title: 'Orijinal Düzen Koruması', desc: 'Paragraflar, başlıklar ve sütunlar bozulmadan Microsoft Word ortamına aktarılır.', icon: 'layout' },
      { title: '%100 Ücretsiz & Kurulumsuz', desc: 'Herhangi bir program indirmenize veya hesap açmanıza gerek yoktur.', icon: 'zap' },
      { title: 'Gizlilik ve Güvenlik', desc: 'Tüm iletim TLS 1.3 ile korunur; dosyalarınız 1 saat sonra otomatik imha edilir.', icon: 'shield' }
    ],
    faqs: [
      { question: 'PDF Word dönüştürme işlemi ücretsiz mi?', answer: 'Evet, DoctorConverter üzerindeki tüm dönüştürme araçları tamamen ücretsizdir ve herhangi bir üyelik gerektirmez.' },
      { question: 'Dönüştürülen Word dosyasında yazı tipleri bozulur mu?', answer: 'Gelişmiş dönüştürme motorumuz belge yapısını, stilleri ve tabloları mümkün olan en yüksek sadakatle korur.' },
      { question: 'Yüklediğim dosyalar güvende mi?', answer: 'Belgeleriniz güvenli sunucularımızda şifrelenmiş olarak işlenir ve dönüştürmeden 60 dakika sonra kalıcı olarak silinir. Kimseyle paylaşılmaz.' }
    ],
    relatedTools: ['word-to-pdf', 'pdf-to-excel', 'compress-pdf', 'ocr'],
    useCases: [
      {
        title: 'Akademik Paper, Makale & Tez Düzenleme',
        tag: 'Akademi & Üniversite',
        target: 'Öğrenci & Araştırmacı',
        description: 'İki sütunlu akademik makaleleri ve araştırma raporlarını kaynakları ve dipnotları koruyarak Word ortamına taşıyın.',
        benefit: 'Tez ve ödevlerinizi sıfırdan yazmak yerine doğrudan düzenlemeye başlayın.'
      },
      {
        title: 'Özgeçmiş (CV) Güncelleme',
        tag: 'Kariyer & İK',
        target: 'İş Arayanlar',
        description: 'Eski PDF formatında kalmış özgeçmişinizi Word belgesine çevirerek yeni iş deneyimlerinizi kolayca ekleyin.',
        benefit: 'Tasarımı ve hizalaması kaymadan hızlıca güncel CV elde edin.'
      },
      {
        title: 'Sözleşme ve Hukuki Metin Revizyonu',
        tag: 'Hukuk & Kurumsal',
        target: 'Avukat & Şirketler',
        description: 'PDF formatında gelen sözleşme taslaklarını Word formatına çevirerek değişiklikleri takip modunda inceleyin.',
        benefit: 'Maddeler ve paragraflar üzerinde zahmetsizce düzenleme yapın.'
      }
    ]
  },
  'word-to-pdf': {
    id: 'word-to-pdf',
    title: 'Word to PDF Dönüştürücü',
    metaTitle: 'Word PDF Dönüştürücü - Ücretsiz DOCX to PDF Çevirici | DoctorConverter',
    metaDescription: 'Microsoft Word (DOCX) belgelerinizi profesyonel ve her cihazda kusursuz görünen PDF formatına dönüştürün. Hızlı, kayıpsız ve ücretsiz.',
    h1: 'Online Word to PDF Dönüştürücü',
    lead: 'Word (DOCX) belgelerinizi tüm cihazlarda birebir aynı görünen, taşınabilir ve yazdırılabilir yüksek kaliteli PDF dosyalarına çevirin.',
    keywords: ['word pdf dönüştürme', 'docx to pdf', 'word pdf yapma', 'ücretsiz word pdf çevirici', 'cv pdf yapma'],
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
    relatedTools: ['pdf-to-word', 'merge-pdf', 'compress-pdf'],
    useCases: [
      {
        title: 'İş Başvuruları İçin Kusursuz CV Hazırlığı',
        tag: 'Kariyer & İK',
        target: 'İş Arayanlar',
        description: 'Word’de hazırladığınız CV’yi PDF yaparak karşı tarafın bilgisayarında yazı tiplerinin kaymasını önleyin.',
        benefit: 'Her cihazda profesyonel ve kurumsal görünüm garantisi.'
      },
      {
        title: 'Ödev, Tez ve Proje Teslimi',
        tag: 'Eğitim & Üniversite',
        target: 'Öğrenciler',
        description: 'Dönem ödevlerinizi ve bitirme tezlerinizi baskıya ve dijital teslim sistemlerine tam uyumlu PDF yapın.',
        benefit: 'Baskı merkezinde sayfa kayması ve font eksikliği sürprizi yaşamayın.'
      }
    ]
  },
  'merge-pdf': {
    id: 'merge-pdf',
    title: 'PDF Birleştirme',
    metaTitle: 'PDF Birleştirme - Birden Fazla PDF\'yi Tek Dosya Yap | DoctorConverter',
    metaDescription: 'Birden çok PDF dosyasını dilediğiniz sırada tek bir PDF belgesinde birleştirin. Kolay sürükle-bırak, hızlı ve tamamen ücretsiz.',
    h1: 'Online PDF Birleştirme Aracı',
    lead: 'Ayrı ayrı taranmış evrakları, raporları veya sunumları tek bir derli toplu PDF belgesinde birleştirin. Sıralamayı istediğiniz gibi belirleyin.',
    keywords: ['pdf birleştirme', 'pdf birleştir', 'vize evrakları birleştirme', 'uyap pdf birleştir', 'ders slaytları tek pdf', 'fatura birleştirme'],
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
    relatedTools: ['compress-pdf', 'edit-pdf-pages', 'pdf-to-word'],
    useCases: [
      {
        title: 'Vize & Final Ders Slaytlarını Tek Belge Yapma',
        tag: 'Öğrenci & Akademi',
        target: 'Üniversite Öğrencileri',
        description: 'Haftalık 14 haftalık dağınık ders sunumlarını tek bir çalışma PDF’inde birleştirin.',
        benefit: 'Tek arama ile tüm sınav konularını tek dosyada hızla bulun.'
      },
      {
        title: 'Schengen & Konsolosluk Vize Başvuru Evrakları',
        tag: 'Vize & Yurt Dışı',
        target: 'Seyahat Edenler & Vize Başvurusu',
        description: 'Pasaport fotokopisi, uçak bileti, otel rezervasyonu ve banka hesap özetini tek bir PDF dosyasında toplayın.',
        benefit: 'VFS Global ve konsolosluk portallarına eksiksiz ve tek parça dosya yükleyin.'
      },
      {
        title: 'UYAP Dava ve Ek Delil Dosyaları',
        tag: 'Hukuk & Adliye',
        target: 'Avukatlar & Hukuk Büroları',
        description: 'Dava dilekçesi, vekaletname, dekontlar ve delil listesini adli standartlara uygun tek bir dosyada birleştirin.',
        benefit: 'UYAP Avukat Portal’a tek seferde derli toplu evrak yükleyin.'
      },
      {
        title: 'Aylık e-Arşiv / e-Fatura Muhasebe Paketleme',
        tag: 'Maliye & Muhasebe',
        target: 'İşletmeler & Muhasebeciler',
        description: 'Ay boyunca kesilen onlarca e-Fatura PDF’ini mali müşavirinize tek bir dosya halinde iletin.',
        benefit: 'E-postada dosya kalabalığını ve kaybolan evrak sorununu bitirin.'
      }
    ]
  },
  'compress-pdf': {
    id: 'compress-pdf',
    title: 'PDF Sıkıştırma (Boyut Küçültme)',
    metaTitle: 'PDF Boyut Küçültme - PDF Sıkıştırma Ücretsiz | DoctorConverter',
    metaDescription: 'Büyük PDF dosyalarının boyutunu kalite kaybı yaşamadan küçültün. E-posta ile gönderilebilir, web için optimize edilmiş hafif PDF\'ler oluşturun.',
    h1: 'Online PDF Boyutu Küçültme ve Sıkıştırma',
    lead: 'E-posta ek sınırlarına takılan veya web sitenizi yavaşlatan ağır PDF dosyalarınızı, okunabilirlikten ödün vermeden maksimum oranda sıkıştırın.',
    keywords: ['pdf sıkıştırma', 'pdf boyut küçültme', 'uyap pdf boyutu küçültme', 'vfs vize dosya boyutu', 'cv dosya boyutu küçültme', 'yök tez sıkıştırma'],
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
    relatedTools: ['merge-pdf', 'pdf-to-word', 'pdf-to-images'],
    useCases: [
      {
        title: 'UYAP Avukat Portal Dosya Boyutu Sınırı Aşma',
        tag: 'Hukuk & Adliye',
        target: 'Avukatlar',
        description: 'UYAP sisteminin kabul ettiği MB tavanına (10 MB vb.) takılan ağır dava dosyalarını metin netliğini bozmadan sıkıştırın.',
        benefit: 'Sistem hatası almadan evraklarınızı adliyeye saniyeler içinde gönderin.'
      },
      {
        title: 'Vize Başvurusu (VFS / TLSContact) Kota Uyumu',
        tag: 'Vize & Seyahat',
        target: 'Vize Başvurusu Yapanlar',
        description: 'Vize başvuru sitelerindeki 2 MB - 4 MB gibi katı yükleme kotalarına evraklarınızı kolayca sığdırın.',
        benefit: 'Randevu günü dosya boyutu yüzünden başvuru iptali riski yaşamayın.'
      },
      {
        title: 'Kariyer & İK CV / Portfolyo Yükleme',
        tag: 'Kariyer & İK',
        target: 'İş Arayanlar',
        description: 'Görsellerle ağırlaşmış 20 MB’lık portfolyo ve CV’nizi 2 MB altına düşürerek iş portallarına sorunsuz yükleyin.',
        benefit: 'Başvurunuz hızlı yüklensin, İK uzmanı belgenizi beklemeden açsın.'
      },
      {
        title: 'YÖK ve Üniversite Tez Yükleme Kotası',
        tag: 'Akademi & Enstitü',
        target: 'Yüksek Lisans & Doktora',
        description: 'Yüksek lisans ve doktora enstitülerinin tez yükleme MB sınırına uygun, hafifletilmiş PDF elde edin.',
        benefit: 'Teziniz yüksek kalitede arşivlensin, kota aşımı uyarısı almayın.'
      }
    ]
  },
  'pdf-to-excel': {
    id: 'pdf-to-excel',
    title: 'PDF to Excel Dönüştürücü',
    metaTitle: 'PDF Excel Dönüştürücü - Ücretsiz PDF to XLSX Aktarma | DoctorConverter',
    metaDescription: 'PDF tablolarını, faturaları ve finansal raporları düzenlenebilir Microsoft Excel (XLSX) tablolarına dönüştürün. Hızlı, hatasız ve ücretsiz.',
    h1: 'Online PDF to Excel Dönüştürücü',
    lead: 'PDF belgelerinizdeki sayısal verileri, bilançoları ve karmaşık tabloları tek tek elle yazmak yerine doğrudan Excel tablosuna aktarın.',
    keywords: ['pdf excel dönüştürme', 'pdf to xlsx', 'banka ekstresi excel aktarma', 'fatura excel çevir', 'bilanço excel yap'],
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
    relatedTools: ['excel-to-pdf', 'pdf-to-word', 'ocr'],
    useCases: [
      {
        title: 'Banka Hesap Ekstresi ve Kredi Kartı Analizi',
        tag: 'Finans & Muhasebe',
        target: 'Bireysel & İşletmeler',
        description: 'Banka hesap özetlerinizi Excel tablosuna aktararak harcamalarınızı kategorize edin veya pivot tablo oluşturun.',
        benefit: 'Saatlerce süren manuel veri girişini 3 saniyeye indirin.'
      },
      {
        title: 'Bilanço ve Mali Rapor Tabloları',
        tag: 'Muhasebe & Denetim',
        target: 'Mali Müşavirler & Denetçiler',
        description: 'PDF formatında sunulan gelir tablosu, mizan ve mali tabloları hesaplama yapılabilir hücrelere dökün.',
        benefit: 'Formüllerle anında analiz yapmaya başlayın.'
      }
    ]
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
    relatedTools: ['pdf-to-excel', 'word-to-pdf', 'compress-pdf'],
    useCases: [
      {
        title: 'Yönetim Sunumu ve Mali Cetvel Baskısı',
        tag: 'Kurumsal & Yönetim',
        target: 'Yöneticiler & Raporlayanlar',
        description: 'Excel’deki geniş bütçe ve satış tablolarını sayfa taşması olmadan şık A4 PDF formatında sunun.',
        benefit: 'Baskıda veya tablette mükemmel görünen profesyonel raporlama.'
      }
    ]
  },
  'pdf-to-images': {
    id: 'pdf-to-images',
    title: 'PDF to JPG / PNG Dönüştürücü',
    metaTitle: 'PDF JPG Dönüştürücü - Sayfaları Görsele Çevir | DoctorConverter',
    metaDescription: 'PDF sayfalarını yüksek çözünürlüklü JPG veya PNG görsellerine dönüştürün. İster tek tek sayfalar, ister toplu ZIP indirme.',
    h1: 'Online PDF JPG / PNG Görsel Dönüştürücü',
    lead: 'PDF belgelerinizin sayfalarını yüksek çözünürlüklü görsel dosyalarına (JPG veya PNG) çevirin ve sosyal medyada veya sunumlarda kolayca paylaşın.',
    keywords: ['pdf jpg dönüştürme', 'pdf png çevirme', 'pdf fotoğrafa çevir', 'sosyal medya pdf paylaşımı'],
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
    relatedTools: ['images-to-pdf', 'compress-pdf', 'edit-pdf-pages'],
    useCases: [
      {
        title: 'LinkedIn, Instagram & Web Sunum Görselleri',
        tag: 'Pazarlama & Sosyal Medya',
        target: 'İçerik Üreticileri & Ajanslar',
        description: 'PDF broşür veya infografik sayfalarını sosyal medyada doğrudan paylaşılabilir yüksek çözünürlüklü JPG/PNG yapın.',
        benefit: 'Takipçilerinizin belge indirmeden görsel olarak incelemesini sağlayın.'
      }
    ]
  },
  'images-to-pdf': {
    id: 'images-to-pdf',
    title: 'JPG / PNG to PDF Dönüştürücü',
    metaTitle: 'JPG PNG to PDF Dönüştürücü - Resimleri PDF Yap | DoctorConverter',
    metaDescription: 'Fotoğraflarınızı, taranmış fişleri ve görselleri tek bir düzenli PDF dosyasında birleştirin. Hızlı, kaliteli ve ücretsiz.',
    h1: 'Online Görselleri PDF’ye Dönüştürme',
    lead: 'Telefonunuzdaki veya bilgisayarınızdaki JPG, PNG veya WebP görsellerini saniyeler içinde şık, tek bir PDF albümü veya dokümanı haline getirin.',
    keywords: ['jpg pdf dönüştürme', 'resimleri pdf yapma', 'ödev fotoğraflarını pdf yap', 'fiş fotoğrafı pdf yap'],
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
    relatedTools: ['pdf-to-images', 'merge-pdf', 'compress-pdf'],
    useCases: [
      {
        title: 'Telefonla Çekilen Ödev & Soru Fotoğraflarını PDF Yapma',
        tag: 'Eğitim & Öğrenci',
        target: 'Öğrenciler & Veliler',
        description: 'Kamerayla parça parça çekilmiş defter sayfalarını ve ödev fotoğraflarını sıralı tek bir teslim PDF’i yapın.',
        benefit: 'Öğretmene onlarca fotoğraf yerine tek bir derli toplu evrak gönderin.'
      },
      {
        title: 'Masraf Fişi ve Harcama Makbuzları Dosyası',
        tag: 'Şirket & Muhasebe',
        target: 'Çalışanlar & Saha Ekipleri',
        description: 'İş seyahatinde çekilen taksi fişleri, yemek faturaları ve makbuz fotoğraflarını tek bir masraf formu PDF’inde toplayın.',
        benefit: 'Şirket muhasebesine onaylanabilir tek dosya iletin.'
      }
    ]
  },
  'edit-pdf-pages': {
    id: 'edit-pdf-pages',
    title: 'PDF Sayfalarını Düzenle ve Ayır',
    metaTitle: 'PDF Sayfa Ayırma, Silme, Döndürme | DoctorConverter',
    metaDescription: 'PDF dosyanızdaki istenmeyen sayfaları silin, ters sayfaları döndürün veya sayfaları ayrı ayrı dosyalara bölün. Ücretsiz ve güvenli.',
    h1: 'Online PDF Sayfalarını Düzenleme ve Ayırma',
    lead: 'PDF belgelerinizdeki sayfaları tek tek kontrol edin. Sayfaları döndürün, gereksiz sayfaları silin veya dilediğiniz sayfaları yeni bir PDF olarak kaydedin.',
    keywords: ['pdf sayfa silme', 'pdf sayfa ayırma', 'pdf split', 'pdf döndürme', 'ters taranmış pdf düzeltme'],
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
    relatedTools: ['merge-pdf', 'compress-pdf', 'pdf-to-word'],
    useCases: [
      {
        title: 'Ters Taranmış Resmi Evrakları Döndürme',
        tag: 'Ofis & Resmi İşler',
        target: 'Herkes',
        description: 'Tarayıcıdan yan veya baş aşağı çıkmış sayfaları tek tıkla 90° veya 180° çevirip doğru yöne getirin.',
        benefit: 'Yazdırırken veya ekranda okurken boyun bükme derdine son.'
      },
      {
        title: 'Kitap veya Sözleşmeden Sadece Gerekli Sayfaları Alma',
        tag: 'Eğitim & Hukuk',
        target: 'Öğrenci & Avukat',
        description: '200 sayfalık mevzuattan veya kitaptan yalnızca sınavda ya da davada gereken 5 sayfayı çekip yeni dosya yapın.',
        benefit: 'Gereksiz sayfalarla dosya boyutunu şişirmeyin.'
      }
    ]
  },
  'ocr': {
    id: 'ocr',
    title: 'PDF Metin Tanıma (OCR)',
    metaTitle: 'PDF OCR - Taranmış PDF ve Görselden Metin Çıkarma | DoctorConverter',
    metaDescription: 'Taranmış belgelerden, fotoğraflardan ve kilitli PDF\'lerden metinleri (OCR) çıkarın. Düzenlenebilir ve kopyalanabilir TXT veya Word elde edin.',
    h1: 'Online PDF ve Görsel Metin Çıkarma (OCR)',
    lead: 'Taranmış evraklar, kitap sayfaları veya resimlerdeki metinleri gelişmiş optik karakter tanıma (OCR) teknolojisiyle anında kopyalanabilir metne dönüştürün.',
    keywords: ['pdf ocr', 'resimden yazı kopyalama', 'fotoğraftan metin çıkarma', 'taranmış pdf metne çevirme', 'kitaptan yazı kopyalama'],
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
    relatedTools: ['pdf-to-word', 'pdf-to-excel', 'pdf-to-images'],
    useCases: [
      {
        title: 'Taranmış Kitap, Quiz & Test Sorularından Metin Kopyalama',
        tag: 'Eğitim & Öğretmenler',
        target: 'Öğretmenler & Öğrenciler',
        description: 'Basılı test kitapları veya ders notlarındaki soruları OCR ile dijital metne çevirip dijital sınav hazırlayın.',
        benefit: 'Soruları tek tek klavyeyle yazma zahmetine son verin.'
      },
      {
        title: 'Eski Mahkeme İlamları & Tensip Zabıtları',
        tag: 'Hukuk & Adliye',
        target: 'Avukat & Katip',
        description: 'Taranmış eski mahkeme kararlarından ve noter evraklarından paragrafları doğrudan kopyalayıp dilekçenize aktarın.',
        benefit: 'Hukuki emsal kararları saniyeler içinde dilekçenize ekleyin.'
      }
    ]
  },
  'pdf-to-pdf-ocr': {
    id: 'pdf-to-pdf-ocr',
    title: 'PDF’yi Aranabilir Yapma (OCR)',
    metaTitle: 'PDF Aranabilir Yapma - Taranmış PDF’e OCR Metin Katmanı Ekleme | DoctorConverter',
    metaDescription: 'Taranmış PDF’e aranabilir ve kopyalanabilir görünmez metin katmanı ekleyin. Sayfa düzeni korunur, PDF içinde arama yapılabilir.',
    h1: 'Taranmış PDF’i Aranabilir PDF’e Dönüştür (OCR)',
    lead: 'Taranmış evraklarınıza görünmez bir metin katmanı ekleyin; metni seçin, kopyalayın ve PDF içinde arayın. Görünüm ve sayfa düzeni aynen korunur.',
    keywords: ['pdf aranabilir yapma', 'taranmış pdf ocr', 'pdf metin katmanı ekleme', 'pdf arama yapılabilir hale getirme', 'taranmış pdf aranabilir pdf'],
    steps: [
      { title: '1. Taranmış PDF’inizi Yükleyin', description: 'Aranabilir yapmak istediğiniz taranmış PDF dosyasını yükleyin.' },
      { title: '2. OCR Metin Katmanı Eklesin', description: 'Motor her sayfayı okuyup görünmez, seçilebilir metin katmanını sayfa üzerine işler.' },
      { title: '3. Aranabilir PDF’i İndirin', description: 'Görünümü aynı kalan, artık içinde arama ve kopyalama yapılabilen PDF’i indirin.' }
    ],
    features: [
      { title: 'Yerleşim Korunur', desc: 'Görünmez metin katmanı eklenir; görüntü ve sayfa düzeni değişmez.', icon: 'layout' },
      { title: 'Arama & Kopyalama', desc: 'PDF içinde kelime arayın ve metni doğrudan seçip kopyalayın.', icon: 'scan' },
      { title: 'Türkçe Karakter Desteği', desc: 'Ç, Ğ, İ, Ö, Ş, Ü karakterleri yüksek doğrulukla tanınır.', icon: 'check' }
    ],
    faqs: [
      { question: 'Çıktıdaki görüntü değişir mi?', answer: 'Hayır. Eklenen metin katmanı görünmezdir; sayfa görünümü ve düzeni aynen korunur.' },
      { question: 'Hangi diller desteklenir?', answer: 'Türkçe, İngilizce veya ikisi birlikte seçilebilir.' }
    ],
    relatedTools: ['ocr', 'pdf-to-word', 'pdf-to-images'],
    useCases: [
      {
        title: 'Taranmış Arşiv Belgelerini Aranabilir Yapma',
        tag: 'Arşiv & Dijitalleştirme',
        target: 'Arşiv Sorumluları',
        description: 'Fiziksel olarak taranmış eski evrakları görünümü bozulmadan, PDF içinde arama yapılabilir hale getirin.',
        benefit: 'Yüzlerce sayfalık taranmış dosyada saniyeler içinde arama yapın.'
      },
      {
        title: 'Hukuk ve Mali Evrakta Hızlı Kelime Arama',
        tag: 'Hukuk & Finans',
        target: 'Avukat & Muhasebeci',
        description: 'Taranmış sözleşme ve belgeleri aranabilir PDF’e çevirip madde ve tutarları doğrudan bulun.',
        benefit: 'Elle sayfa çevirmek yerine belge içinde arama yaparak zaman kazanın.'
      }
    ]
  },
  'pptx-to-pdf': {
    id: 'pptx-to-pdf',
    title: 'PowerPoint to PDF Dönüştürücü',
    metaTitle: 'PowerPoint PDF Dönüştürücü - Ücretsiz PPTX to PDF | DoctorConverter',
    metaDescription: 'PowerPoint (PPTX) slaytlarınızı yazı tiplerini ve animasyon düzenini koruyarak evrensel PDF formatına dönüştürün. Hızlı ve ücretsiz.',
    h1: 'Online PowerPoint to PDF Dönüştürücü',
    lead: 'PowerPoint sunumlarınızı tüm telefon, tablet ve bilgisayarlarda tasarımı bozulmadan açılan profesyonel PDF dokümanlarına çevirin.',
    keywords: ['powerpoint pdf dönüştürme', 'pptx to pdf', 'slayt pdf yapma', 'sunumu pdf yap'],
    steps: [
      { title: '1. PPTX Sunumunu Yükleyin', description: 'Dönüştürmek istediğiniz PowerPoint slayt dosyasını seçin veya sürükleyin.' },
      { title: '2. Otomatik Dönüştürülsün', description: 'Sunum sayfaları LibreOffice motorumuz ile vektörel kalitede PDF’ye işlenir.' },
      { title: '3. PDF Dosyanızı İndirin', description: 'Tüm cihazlarda hatasız açılan PDF belgenizi tek tıkla indirin.' }
    ],
    features: [
      { title: 'Birebir Tasarım Uyumu', desc: 'Slayt düzeniniz, renkleriniz ve yazı tipleriniz tam isabetle korunur.', icon: 'layout' },
      { title: 'Mobil Uyumlu', desc: 'Sunumunuz telefon veya tablette PowerPoint yüklü olmasa bile açılır.', icon: 'device' },
      { title: 'Hızlı & Kurulumsun', desc: 'Saniyeler içinde tarayıcı üzerinden ücretsiz dönüştürün.', icon: 'zap' }
    ],
    faqs: [
      { question: 'Sunumdaki animasyonlar ne olur?', answer: 'PDF durağan bir belge formatı olduğu için slaytlar son halleriyle yüksek kaliteli sayfalara aktarılır.' }
    ],
    relatedTools: ['word-to-pdf', 'excel-to-pdf', 'pdf-to-word']
  },
  'protect-pdf': {
    id: 'protect-pdf',
    title: 'PDF Şifreleme (Parola Koyma)',
    metaTitle: 'PDF Şifreleme - Ücretsiz PDF Parola Koyma | DoctorConverter',
    metaDescription: 'Hassas PDF belgelerinizi güçlü 256-bit AES parola ile şifreleyin ve yetkisiz erişimlere karşı kilitleyin. Ücretsiz ve güvenli.',
    h1: 'Online PDF Şifreleme ve Güvenlik',
    lead: 'Maaş bordroları, sözleşmeler ve kişisel belgelerinizi güçlü şifreleme ile koruyun. Belgeyi yalnızca parolasını bilenler açabilir.',
    keywords: ['pdf şifreleme', 'pdf parola koyma', 'pdf kilitleme', 'pdf şifre koy'],
    steps: [
      { title: '1. PDF Dosyanızı Yükleyin', description: 'Şifrelemek istediğiniz PDF belgesini seçin.' },
      { title: '2. Parolanızı Belirleyin', description: 'Belgeyi korumak için güçlü bir şifre girin.' },
      { title: '3. Şifreli PDF’yi İndirin', description: 'Artık belgeniz 256-bit AES askeri düzeyde koruma altındadır.' }
    ],
    features: [
      { title: '256-bit AES Standart', desc: 'Uluslararası bankacılık ve güvenlik standartlarında en güçlü koruma.', icon: 'shield' },
      { title: 'Yetkisiz Erişime Son', desc: 'Parola olmadan belgenin içi hiçbir okuyucuda açılamaz.', icon: 'lock' },
      { title: 'Anında İşlem', desc: 'Belgeniz saniyeler içinde şifrelenir.', icon: 'zap' }
    ],
    faqs: [
      { question: 'Şifreyi unutursam kurtarabilir miyim?', answer: 'Güçlü şifreleme nedeniyle parolanızı bir yere not etmenizi öneririz; sunucularımız parolanızı asla kaydetmez.' }
    ],
    relatedTools: ['unlock-pdf', 'compress-pdf', 'merge-pdf']
  },
  'unlock-pdf': {
    id: 'unlock-pdf',
    title: 'PDF Şifresi Kaldırma',
    metaTitle: 'PDF Şifre Kaldırma - Korumalı PDF Kilidi Açma | DoctorConverter',
    metaDescription: 'Şifresini bildiğiniz PDF dosyalarından parolayı kalıcı olarak kaldırın ve kilitleri açın. Hızlı ve güvenli.',
    h1: 'Online PDF Şifresi Kaldırma ve Kilit Açma',
    lead: 'Her açılışta şifre soran belgelerinizin parolasını kalıcı olarak kaldırın ve rahatça paylaşın.',
    keywords: ['pdf şifre kaldırma', 'pdf kilit açma', 'pdf şifresi silme'],
    steps: [
      { title: '1. Kilitli PDF’yi Seçin', description: 'Parolasını kaldırmak istediğiniz PDF dosyasını yükleyin.' },
      { title: '2. Mevcut Şifreyi Girin', description: 'Belgenin mevcut şifresini onaylayın.' },
      { title: '3. Kilitsiz PDF’yi İndirin', description: 'Artık dosyanız şifresiz olarak açılacaktır.' }
    ],
    features: [
      { title: 'Kalıcı Kilit Açma', desc: 'Bir daha şifre girmek zorunda kalmadan belgenizi arşivleyin.', icon: 'unlock' },
      { title: 'Gizlilik Garantisi', desc: 'Parolanız ve belgeniz işlem biter bitmez sunucudan silinir.', icon: 'shield' },
      { title: 'Hızlı & Pratik', desc: 'Tek tıkla kilitsiz kopya elde edin.', icon: 'zap' }
    ],
    faqs: [
      { question: 'Bilmediğim bir şifreyi kırabilir mi?', answer: 'DoctorConverter yasal bir araçtır; yalnızca parolasını bildiğiniz dosyaların şifresini kaldırabilirsiniz.' }
    ],
    relatedTools: ['protect-pdf', 'merge-pdf', 'compress-pdf']
  },
  'page-numbers': {
    id: 'page-numbers',
    title: 'PDF Sayfa Numarası Ekleme',
    metaTitle: 'PDF Sayfa Numarası Ekleme - Ücretsiz & Hızlı | DoctorConverter',
    metaDescription: 'PDF sayfalarının altına veya üstüne otomatik sayfa numarası ekleyin. Tez, resmi evrak ve dava dosyaları için idealdir.',
    h1: 'Online PDF Sayfa Numarası Ekleme',
    lead: 'Raporlarınıza, sözleşmelerinize ve tezlerinize tek tıkla şık ve sıralı sayfa numaraları yerleştirin.',
    keywords: ['pdf sayfa numarası ekleme', 'pdf numaralandırma', 'pdf sayfa no koy'],
    steps: [
      { title: '1. PDF Dosyanızı Ekleyin', description: 'Numaralandırmak istediğiniz belgeyi yükleyin.' },
      { title: '2. Numaralandırma Başlasın', description: 'Sayfaların alt orta veya sağ köşesine numaralar işlensin.' },
      { title: '3. Numaralı PDF’yi İndirin', description: 'Baskıya ve teslime hazır belgenizi hemen indirin.' }
    ],
    features: [
      { title: 'Düzenli Numaralandırma', desc: 'Sayfa 1 / Toplam Sayfa formatında temiz görünüm.', icon: 'layers' },
      { title: 'Tez ve Adliye Uyumlu', desc: 'Akademik ve hukuki evrak teslim standartlarına tam uyum.', icon: 'check' },
      { title: 'Orijinal Düzen Korunur', desc: 'Mevcut yazılarınız veya grafikleriniz etkilenmez.', icon: 'layout' }
    ],
    faqs: [
      { question: 'Sayfa numarası nerede görünür?', answer: 'Varsayılan olarak sayfanın en alt orta kısmına okunabilir net bir formatta yerleştirilir.' }
    ],
    relatedTools: ['edit-pdf-pages', 'merge-pdf', 'watermark-pdf']
  },
  'watermark-pdf': {
    id: 'watermark-pdf',
    title: 'PDF Filigran Ekleme',
    metaTitle: 'PDF Filigran Ekleme - Metin Damgası Basma | DoctorConverter',
    metaDescription: 'PDF belgelerinizin üzerine GİZLİDİR, TASLAK veya dilediğiniz metin filigranını çapraz damga olarak basın. Hızlı ve ücretsiz.',
    h1: 'Online PDF Filigran ve Damga Ekleme',
    lead: 'Belgelerinizin izinsiz kullanımını önlemek için sayfaların üzerine yarı saydam metin filigranı ekleyin.',
    keywords: ['pdf filigran ekleme', 'pdf damga basma', 'pdf gizlidir yazısı', 'pdf watermark'],
    steps: [
      { title: '1. PDF Belgenizi Yükleyin', description: 'Filigran basmak istediğiniz PDF dosyasını seçin.' },
      { title: '2. Filigran Metnini Belirleyin', description: 'GİZLİDİR, TASLAK veya dilediğiniz bir metin girin.' },
      { title: '3. Filigranlı PDF’yi İndirin', description: 'Damgalanmış güvenli belgenizi tek tıkla indirin.' }
    ],
    features: [
      { title: 'Okunabilirliği Bozmaz', desc: 'Yarı saydam tasarımı sayesinde alttaki metinler rahatça okunmaya devam eder.', icon: 'eye' },
      { title: 'Telif ve Gizlilik Koruması', desc: 'Belgenizin taslak veya gizli olduğunu net biçimde belirtin.', icon: 'shield' },
      { title: 'Tüm Sayfalara Otomatik', desc: 'Yüzlerce sayfa bile olsa tek seferde uygulanır.', icon: 'zap' }
    ],
    faqs: [
      { question: 'Filigran sonradan kaldırılabilir mi?', answer: 'Filigran sayfanın grafik katmanına kalıcı olarak işlendiği için kolayca silinemez, güçlü koruma sağlar.' }
    ],
    relatedTools: ['page-numbers', 'protect-pdf', 'compress-pdf']
  }
};
