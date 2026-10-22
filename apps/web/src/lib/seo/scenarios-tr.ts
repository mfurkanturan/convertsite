import type { Scenario } from './scenarios';

// Türkiye'deki uzun kuyruk aramalar için senaryo sayfaları. Her sayfa gerçek bir işi ve onu çözen aracı hedefler.
export const trScenarios: Scenario[] = [
  // ——— Öğrenci & sınav ———
  {
    slug: 'vize-final-notlari-birlestirme',
    pair: 'combine-lecture-notes-for-exams',
    group: 'student',
    tool: 'merge-pdf',
    tools: ['merge-pdf', 'compress-pdf', 'edit-pdf-pages'],
    title: 'Vize ve Final Notlarını Tek PDF’te Birleştirme',
    metaTitle: 'Vize Final Notları Birleştirme – Ders Notlarını Tek PDF Yap (Ücretsiz)',
    metaDescription: 'Haftalık ders notlarını, slaytları ve çıkmış soruları sınav öncesi tek PDF’te birleştir. Sırayı sen belirle, üyeliksiz ve ücretsiz indir.',
    lead: 'Dönem boyunca biriken haftalık notları, hoca slaytlarını ve çıkmış soruları tek dosyada topla; sınav haftası dosya aramakla vakit kaybetme.',
    queries: ['vize final notları birleştirme', 'ders notlarını tek pdf yapma', 'ders slaytları tek pdf', 'pdf notları birleştirme', 'çıkmış sorular pdf birleştirme', 'sınav notları tek dosya'],
    sections: [
      { heading: 'Sınav haftası neden tek PDF?', body: [
        'Her hafta ayrı yüklenen slaytlar, WhatsApp grubundan gelen notlar ve çıkmış sorular telefonda ve bilgisayarda dağınık durur. Tek bir PDF ile tabletinde baştan sona okuyabilir, arama (Ctrl+F) ile konuya anında atlayabilir ve tek dosyayı yazdırabilirsin.',
        'Birleştirirken dosya sırasını sen belirlersin: önce 1. hafta, sonra 2. hafta… En sona çıkmış soruları eklemek tekrar için ideal bir düzen sağlar.',
      ] },
      { heading: 'Çok büyük olursa ne yapmalı?', body: [
        'Bir dönemin tüm slaytları büyük bir dosya olabilir. Birleştirdikten sonra PDF sıkıştır aracıyla boyutu küçültebilir, gereksiz sayfaları (kapak, boş sayfa, tekrar eden slaytlar) PDF sayfalarını düzenle aracıyla çıkarabilirsin.',
      ] },
    ],
    steps: [
      { title: 'Notlarını seç', text: 'Haftalık PDF notlarını ve slaytlarını yukarıdaki alana sürükle; en fazla 20 dosya ekleyebilirsin.' },
      { title: 'Sırayı düzenle', text: 'Ok tuşlarıyla haftaları doğru sıraya koy, çıkmış soruları en sona al.' },
      { title: 'Birleştir ve indir', text: '“PDF’leri birleştir”e bas, tek dosyalık sınav notunu indir.' },
    ],
    tips: [
      'Dosya adlarını “01-hafta.pdf, 02-hafta.pdf” gibi numaralandırırsan sıralama çok daha hızlı olur.',
      'Telefonla çektiğin not fotoğrafları için önce JPG → PDF aracını kullan, sonra birleştir.',
      'Toplam sayfa sınırı 300’dür; daha büyük arşivleri dersi ikiye bölerek birleştir.',
    ],
    faqs: [
      { q: 'Kaç dosyayı birleştirebilirim?', a: 'Tek seferde en fazla 20 PDF ve toplam 300 sayfa birleştirebilirsin. Dosya başına sınır 10 MB’tır.' },
      { q: 'Slaytların sırası bozulur mu?', a: 'Hayır. Çıktıdaki sayfa sırası, listede belirlediğin dosya sırasıyla birebir aynıdır.' },
      { q: 'Notlarım başkalarıyla paylaşılır mı?', a: 'Hayır. Dosyalar yalnızca senin oturumundan erişilebilir ve süre dolunca otomatik silinir; istersen işlem sonrası hemen silebilirsin.' },
      { q: 'Telefonda kullanabilir miyim?', a: 'Evet. Site mobil tarayıcıda çalışır; uygulama indirmen gerekmez.' },
    ],
  },
  {
    slug: 'ders-slayti-pdf-word-cevirme',
    pair: 'lecture-slides-pdf-to-word',
    group: 'student',
    tool: 'pdf-to-word',
    tools: ['pdf-to-word', 'ocr', 'merge-pdf'],
    title: 'Ders Slaytlarını ve Notlarını PDF’ten Word’e Çevirme',
    metaTitle: 'Ders Slaytı PDF’i Word’e Çevirme – Düzenlenemeyen Notları Düzenle',
    metaDescription: 'Düzenlenemeyen ders slaytlarını ve PDF notlarını Word’e çevir; kendi özetini çıkar, not ekle. Ücretsiz, üyeliksiz PDF Word dönüştürücü.',
    lead: 'Hocanın paylaştığı “kilitli görünen”, yani üzerine yazılamayan PDF notlarını düzenlenebilir Word belgesine çevir; altını çiz, özet çıkar, kendi notlarını ekle.',
    queries: ['ders slaytlarını worde çevirme', 'pdf notları word yapma', 'düzenlenemeyen pdf worde çevirme', 'kilitli pdf slaytları worde çevirme', 'ders notu pdf düzenleme', 'slayt pdf word dönüştürme'],
    sections: [
      { heading: 'Neden Word’e çevirmeli?', body: [
        'PDF okumak için harikadır ama üzerinde çalışmak için değil. Word’e çevirdiğinde başlıkları kendi özetine kopyalayabilir, gereksiz kısımları silebilir, renkli vurgular ve açıklamalar ekleyebilirsin.',
        'Dönüştürücü yazı biçimlerini, tabloları, görselleri ve sütunları yeniden kurarak düzenlenebilir bir DOCX üretir. Çok yoğun tasarımlı slaytlarda küçük kaymalar olabilir; metin ve yapı korunur.',
      ] },
      { heading: 'Taranmış (fotokopi) notlar için', body: [
        'Fotokopiden taranmış notlarda seçilebilir metin yoktur. Bu durumda önce Metin çıkar (OCR) aracıyla yazıyı metne dönüştür, ardından Word’e yapıştırarak düzenle.',
      ] },
    ],
    steps: [
      { title: 'PDF’i yükle', text: 'Ders slaytını veya not PDF’ini seç (en fazla 50 sayfa).' },
      { title: 'Dönüştür', text: '“Dönüştürmeyi başlat”a bas; yazı, tablo ve görseller DOCX’e aktarılır.' },
      { title: 'Word’de çalış', text: 'İndirdiğin dosyayı Word veya Google Docs’ta açıp notlarını ekle.' },
    ],
    tips: [
      'Şifre ile korunan PDF’ler açılamaz; hocandan şifresiz sürümünü iste.',
      'Uzun ders kitaplarını bölümlere ayırıp (PDF sayfalarını düzenle) her bölümü ayrı çevir.',
      'Sunum odaklı slaytlarda her slayt genellikle ayrı bir sayfa olarak gelir; özet için başlıkları kopyalamak en hızlısıdır.',
    ],
    faqs: [
      { q: '“Kilitli” PDF’leri açabilir mi?', a: 'Üzerine yazılamayan, salt okunur PDF’leri Word’e çevirebilirsin. Açılış şifresiyle korunan (şifreli) PDF’ler ise desteklenmez.' },
      { q: 'Türkçe karakterler bozulur mu?', a: 'Hayır. ç, ğ, ı, ö, ş, ü gibi karakterler Word belgesinde korunur.' },
      { q: 'Kaç sayfaya kadar çevrilir?', a: 'PDF → Word için tek dosyada 50 sayfaya kadar destek vardır.' },
      { q: 'Çıktıyı Google Docs’ta açabilir miyim?', a: 'Evet, DOCX dosyası Google Docs, Pages ve LibreOffice ile de açılır.' },
    ],
  },
  {
    slug: 'odev-fotograflarini-pdf-yapma',
    pair: 'homework-photos-to-pdf',
    group: 'student',
    tool: 'images-to-pdf',
    tools: ['images-to-pdf', 'compress-pdf', 'merge-pdf'],
    title: 'Ödev ve Sınav Kağıdı Fotoğraflarını PDF Yapma',
    metaTitle: 'Ödev Fotoğraflarını PDF Yapma – Telefondan Çekilen Sayfaları Tek PDF',
    metaDescription: 'El yazısı ödevlerini ve kağıt sayfaları telefonla çek, JPG/PNG fotoğrafları sıralayıp tek PDF yap. Online ödev teslimi için ücretsiz.',
    lead: 'El yazısıyla çözdüğün ödevi telefonla çek, fotoğrafları doğru sırayla tek PDF’e çevir ve Moodle, Teams veya e-posta ile teslim et.',
    queries: ['ödev fotoğraflarını pdf yapma', 'telefondan çekilen fotoğrafları pdf yapma', 'el yazısı ödev pdf', 'jpg pdf birleştirme', 'sınav kağıdı fotoğraf pdf', 'moodle ödev pdf yükleme'],
    sections: [
      { heading: 'Öğretmenler neden PDF ister?', body: [
        'Tek tek fotoğraf göndermek sayfaların karışmasına ve eksik teslimlere yol açar. Tek PDF; sayfa sırası sabit, açması kolay ve tüm sistemlerin kabul ettiği bir formattır.',
        'Görselden PDF aracı fotoğrafları A4 sayfaya ortalar veya görselin kendi boyutunu korur; yatay çekilmiş sayfalar için yatay sayfa seçebilirsin.',
      ] },
    ],
    steps: [
      { title: 'Fotoğrafları seç', text: 'JPG veya PNG fotoğraflarını seç; en fazla 20 görsel.' },
      { title: 'Sırala ve ayarla', text: 'Sayfa sırasını düzenle, A4 veya görsel boyutunu ve sayfa yönünü seç.' },
      { title: 'PDF’i indir', text: 'Tek PDF’i indir ve ödev sistemine yükle.' },
    ],
    tips: [
      'Fotoğrafları gün ışığında, kağıdı düz bir zemine koyarak ve tepeden çek; gölge okunabilirliği düşürür.',
      'Telefon dikey çekilmiş fotoğrafları otomatik döndürür; yan duran sayfa olursa sonra PDF sayfalarını düzenle ile çevirebilirsin.',
      'Dosya çok büyük olursa PDF sıkıştır aracını dene.',
    ],
    faqs: [
      { q: 'iPhone HEIC fotoğrafları destekleniyor mu?', a: 'Şu an JPG ve PNG desteklenir. iPhone’da Ayarlar > Kamera > Biçimler bölümünden “En Uyumlu” seçersen fotoğraflar JPG olarak kaydedilir.' },
      { q: 'Görsel başına sınır var mı?', a: 'Her görsel en fazla 10 MB ve 25 milyon piksel olabilir; telefon fotoğrafları rahatça bu sınırın altındadır.' },
      { q: 'Sayfalar A4 olur mu?', a: 'Varsayılan A4’tür. İstersen “Görsele göre” seçerek her sayfayı fotoğraf boyutunda bırakabilirsin.' },
    ],
  },
  {
    slug: 'tez-makale-pdf-word-cevirme',
    pair: 'thesis-pdf-to-word',
    group: 'student',
    tool: 'pdf-to-word',
    tools: ['pdf-to-word', 'edit-pdf-pages', 'ocr'],
    title: 'Tez ve Makale PDF’ini Word’e Çevirme',
    metaTitle: 'Tez PDF Word’e Çevirme – Makale ve Ödevleri Düzenlenebilir Yap',
    metaDescription: 'Tez, makale ve proje raporlarını PDF’ten Word’e çevir; tablo, görsel ve sütun yapısını koruyarak düzenlemeye devam et. Ücretsiz PDF to DOCX.',
    lead: 'Elinde yalnızca PDF’i kalmış tez taslağını, makaleni veya proje raporunu Word’e çevir; baştan yazmadan düzenlemeye devam et.',
    queries: ['tez worde çevirme', 'tez pdf word yapma', 'makale pdf word çevirme', 'proje raporu pdf word', 'akademik pdf düzenleme', 'iki sütunlu pdf word'],
    sections: [
      { heading: 'Akademik belgelerde neler korunur?', body: [
        'Başlık hiyerarşisi, paragraflar, tablolar, şekiller ve iki sütunlu makale düzeni yeniden kurulur. Böylece kaynakça, dipnot ve tablo içeriklerini kopyala-yapıştır ile kaybetmezsin.',
        'Denklem yoğun sayfalarda ve özel yazı tiplerinde farklılıklar olabilir; çevirdikten sonra bu bölümleri kontrol etmeni öneririz.',
      ] },
      { heading: '50 sayfadan uzun tezler', body: [
        'PDF → Word tek seferde 50 sayfaya kadar çalışır. Uzun tezleri PDF sayfalarını düzenle aracıyla bölümlere ayırıp (ör. 1-45, 46-90) parça parça çevirebilirsin.',
      ] },
    ],
    steps: [
      { title: 'Bölümü ayır (gerekirse)', text: '50 sayfadan uzun belgeleri önce sayfa aralığıyla parçalara ayır.' },
      { title: 'Word’e çevir', text: 'PDF’i yükleyip dönüştürmeyi başlat.' },
      { title: 'Kontrol et', text: 'Tablo ve denklem bölümlerini gözden geçir, düzenlemeye devam et.' },
    ],
    tips: [
      'Taranmış eski tezlerde önce OCR ile metni çıkar.',
      'Word’e aktardıktan sonra başlık stillerini (Başlık 1, 2) uygularsan içindekiler tablosunu otomatik oluşturabilirsin.',
    ],
    faqs: [
      { q: 'Kaynakça ve dipnotlar korunur mu?', a: 'Metin olarak korunur. Word’ün otomatik kaynakça alanlarına dönüşmez; düz metin olarak gelir.' },
      { q: 'Tablolar Word tablosu olur mu?', a: 'Evet, algılanan tablolar düzenlenebilir Word tablosu olarak aktarılır.' },
      { q: 'Tezim gizli kalır mı?', a: 'Dosya yalnızca senin oturumundan erişilir, eğitim verisi olarak kullanılmaz ve süre dolunca silinir.' },
    ],
  },
  // ——— Hukuk & UYAP ———
  {
    slug: 'uyap-pdf-boyutu-kucultme',
    pair: 'court-filing-pdf-compressor',
    group: 'legal',
    tool: 'compress-pdf',
    tools: ['compress-pdf', 'edit-pdf-pages', 'merge-pdf'],
    title: 'UYAP İçin PDF Dosya Boyutu Küçültme',
    metaTitle: 'UYAP PDF Boyutu Küçültme – UYAP Dosya MB Düşürme (Ücretsiz)',
    metaDescription: 'UYAP Avukat Portal’a yüklenmeyen büyük PDF’leri küçült. Dilekçe, ek ve delilleri sıkıştır, gerekirse parçalara böl. Üyeliksiz, ücretsiz.',
    lead: 'UYAP’a evrak yüklerken “dosya boyutu çok büyük” uyarısı mı aldın? PDF’i sıkıştır, olmazsa sayfaları parçalara ayırıp ayrı ek olarak yükle.',
    queries: ['uyap dosya boyutu küçültme', 'uyap pdf mb düşürme', 'uyap evrak boyut sınırı', 'uyap pdf yüklenmiyor', 'avukat portal pdf küçültme', 'dilekçe pdf boyutu küçültme'],
    sections: [
      { heading: 'UYAP’ta boyut sorunu neden çıkar?', body: [
        'Taranmış delil klasörleri, yüksek çözünürlükte kaydedilmiş fotoğraflar ve birden fazla belgenin birleştirilmesi PDF’i hızla büyütür. Portal belirli bir boyutun üzerindeki dosyaları kabul etmez.',
        'PDF sıkıştır aracı belgenin iç yapısını yeniden düzenler ve sıkıştırır; içerik ve okunabilirlik kaybı olmaz. Metin tabanlı PDF’lerde (Word’den çıktı alınmış dilekçeler) belirgin küçülme sağlar.',
      ] },
      { heading: 'Sıkıştırma yetmezse: parçalara böl', body: [
        'Taranmış, görsel ağırlıklı belgelerde kayıpsız sıkıştırmanın etkisi sınırlıdır. Bu durumda PDF sayfalarını düzenle aracıyla belgeyi “1-40” ve “41-80” gibi aralıklara bölüp ayrı ekler halinde yükleyebilirsin.',
        'Mümkünse belgeyi taramak yerine Word’den doğrudan PDF olarak kaydet (Word → PDF); bu yöntem çok daha küçük dosyalar üretir.',
      ] },
    ],
    steps: [
      { title: 'PDF’i yükle', text: 'UYAP’a yüklenmeyen dilekçe, ek veya delil PDF’ini seç.' },
      { title: 'Sıkıştır', text: 'Tek tıkla optimize et; yeni boyutu sonuç ekranında gör.' },
      { title: 'Gerekirse böl', text: 'Hâlâ büyükse sayfa aralıklarıyla parçalara ayır ve ayrı yükle.' },
    ],
    tips: [
      'Tarayıcı ayarlarında 200–300 DPI ve gri tonlama seçmek taranmış evrakın boyutunu baştan küçültür.',
      'Birden çok eki tek PDF yapmak yerine portalın izin verdiği ek sayısına göre bölmek yükleme hatalarını azaltır.',
      'Şifreli PDF’ler işlenemez; korumayı kaldırılmış sürümü kullan.',
    ],
    faqs: [
      { q: 'Sıkıştırma belgenin okunurluğunu bozar mı?', a: 'Hayır. Kayıpsız optimizasyon kullanılır; metin, imza görüntüleri ve barkodlar aynen kalır.' },
      { q: 'Dosya küçülmedi, neden?', a: 'Belge zaten optimize edilmişse veya tamamen taranmış görüntülerden oluşuyorsa küçülme sınırlı olur. Bu durumda belgeyi bölmeyi dene.' },
      { q: 'Müvekkil belgeleri güvende mi?', a: 'Dosyalar yalnızca senin oturumundan erişilir, süre dolunca otomatik silinir ve işlem bitince “Dosyaları sil” ile hemen silebilirsin.' },
      { q: 'En fazla kaç sayfa işlenir?', a: 'PDF sıkıştırmada 300 sayfaya ve 10 MB’a kadar dosyalar desteklenir.' },
    ],
  },
  {
    slug: 'dilekce-delil-listesi-birlestirme',
    pair: 'merge-legal-exhibits',
    group: 'legal',
    tool: 'merge-pdf',
    tools: ['merge-pdf', 'compress-pdf', 'word-to-pdf'],
    title: 'Dava Dilekçesi, Ekler ve Delil Listesini Tek PDF Yapma',
    metaTitle: 'Dilekçe ve Delil Listesi Birleştirme – Ek Evrakları Tek PDF Yap',
    metaDescription: 'Dava dilekçesi, vekaletname, delil listesi ve ekleri doğru sırayla tek PDF’te birleştir. UYAP ve e-posta gönderimi için ücretsiz PDF birleştirme.',
    lead: 'Dilekçe, vekaletname, delil listesi ve numaralı ekleri mahkemenin beklediği sırayla tek dosyada topla; dosya karışıklığını önle.',
    queries: ['dava dilekçesi ve delil listesi birleştirme', 'ek evrak tek pdf', 'dilekçe ekleri birleştirme', 'vekaletname dilekçe birleştirme', 'hukuk pdf birleştirme', 'icra takip evrak birleştirme'],
    sections: [
      { heading: 'Sıralama neden önemli?', body: [
        'Hakim ve kalemin dosyayı rahat incelemesi için dilekçenin ardından delil listesi ve ekler numara sırasıyla gelmelidir. PDF birleştirmede çıktı sırası, listede belirlediğin sıradır.',
        'Word’de hazırladığın dilekçeyi önce Word → PDF ile çevir, ardından taranmış eklerle birleştir.',
      ] },
    ],
    steps: [
      { title: 'Belgeleri ekle', text: 'Dilekçe, vekaletname, delil listesi ve ekleri seç.' },
      { title: 'Ek sırasını kur', text: 'Ek-1, Ek-2… sırasına göre dosyaları yukarı/aşağı taşı.' },
      { title: 'Birleştir', text: 'Tek PDF’i indir; büyükse PDF sıkıştır ile küçült.' },
    ],
    tips: [
      'Dosya adlarına “00-dilekce, 01-vekaletname, 02-ek1” gibi ön ek vermek sıralamayı kolaylaştırır.',
      'Birleştirilmiş dosya UYAP sınırını aşarsa ekleri gruplar halinde birleştir.',
    ],
    faqs: [
      { q: 'Islak imzalı taranmış sayfalar korunur mu?', a: 'Evet. Birleştirme sayfaları değiştirmez; imza ve kaşe görüntüleri aynen kalır.' },
      { q: 'Word dilekçeyi doğrudan ekleyebilir miyim?', a: 'Önce Word → PDF aracıyla PDF’e çevir, sonra birleştir.' },
      { q: 'Kaç belge birleştirilebilir?', a: 'Tek seferde 20 dosya ve toplam 300 sayfa.' },
    ],
  },
  {
    slug: 'taranmis-mahkeme-karari-metne-cevirme',
    pair: 'scanned-document-to-text',
    group: 'legal',
    tool: 'ocr',
    tools: ['ocr', 'pdf-to-word', 'edit-pdf-pages'],
    title: 'Taranmış Mahkeme Kararından ve Bilirkişi Raporundan Metin Kopyalama',
    metaTitle: 'Taranmış PDF’ten Metin Kopyalama – Mahkeme Kararı OCR (Türkçe)',
    metaDescription: 'Taranmış mahkeme kararı, bilirkişi raporu ve tebligatlardan Türkçe metni OCR ile çıkar; dilekçende alıntı yap. Ücretsiz online OCR.',
    lead: 'Fotokopi veya tarayıcıdan gelen kararlarda metin seçilemiyor mu? OCR ile Türkçe metni çıkar, gerekçeyi dilekçene kopyala.',
    queries: ['taranmış mahkeme kararından metin kopyalama', 'taranmış pdf metin kopyalama', 'bilirkişi raporu metne çevirme', 'türkçe ocr', 'resimdeki yazıyı metne çevirme', 'pdf metin seçilemiyor'],
    sections: [
      { heading: 'OCR ne işe yarar?', body: [
        'Taranmış belgeler aslında resimdir; içindeki yazı seçilemez ve aranamaz. OCR (optik karakter tanıma) bu görüntülerdeki yazıyı düz metne çevirir.',
        'Türkçe, İngilizce veya iki dil birlikte seçilebilir. Çıktı düz metin (TXT) dosyasıdır; sayfa düzeni korunmaz ama metni istediğin yere yapıştırabilirsin.',
      ] },
    ],
    steps: [
      { title: 'Belgeyi yükle', text: 'Taranmış PDF’i (en fazla 20 sayfa) veya fotoğrafı seç.' },
      { title: 'Dili seç', text: 'Belge dilini Türkçe, İngilizce veya ikisi olarak belirle.' },
      { title: 'Metni al', text: 'TXT dosyasını indir, ilgili bölümü kopyala.' },
    ],
    tips: [
      'Uzun kararlarda yalnızca ihtiyacın olan sayfaları PDF sayfalarını düzenle ile ayırıp OCR’a ver.',
      'Eğik veya düşük çözünürlüklü taramalar doğruluğu düşürür; mümkünse 300 DPI tarama kullan.',
      'Alıntı yapmadan önce sayı ve tarihleri asıl belgeyle karşılaştır.',
    ],
    faqs: [
      { q: 'Türkçe karakterleri tanır mı?', a: 'Evet, Türkçe dil paketi kullanılır; ç, ğ, ı, ş gibi harfler tanınır.' },
      { q: 'El yazısını okur mu?', a: 'OCR basılı metin için tasarlanmıştır; el yazısında doğruluk düşüktür.' },
      { q: 'Kaç sayfa işlenir?', a: 'OCR tek seferde 20 sayfaya kadar PDF işler.' },
    ],
  },
  // ——— Vize & resmi işlemler ———
  {
    slug: 'vize-evraklari-tek-pdf-birlestirme',
    pair: 'visa-application-documents-one-pdf',
    group: 'visa',
    tool: 'merge-pdf',
    tools: ['merge-pdf', 'images-to-pdf', 'compress-pdf'],
    title: 'Vize Başvuru Evraklarını Tek PDF’te Birleştirme',
    metaTitle: 'Vize Evrakları Birleştirme – Pasaport, Otel, Uçak Tek PDF (VFS Global)',
    metaDescription: 'Schengen ve diğer vize başvuruları için pasaport, otel rezervasyonu, uçak bileti, banka dökümü ve sigortayı tek PDF yap. VFS Global yüklemesine hazır.',
    lead: 'Pasaport fotokopisi, otel rezervasyonu, uçuş bileti, banka hesap dökümü ve seyahat sağlık sigortasını konsolosluğun istediği sırayla tek dosyada topla.',
    queries: ['vfs global vize evrakları birleştirme', 'vize evrakları tek pdf', 'pasaport ve otel rezervasyonu tek pdf', 'schengen vize evrak pdf', 'konsolosluk evrak birleştirme', 'idata evrak pdf'],
    sections: [
      { heading: 'Online vize başvurusunda doğru dosya düzeni', body: [
        'Pek çok başvuru merkezi evrakları kategoriler halinde ve belirli bir sırayla yüklemeni ister. Kategori başına tek PDF hazırlamak hem yükleme sınırlarına uymayı hem de memurun belgeyi hızlı incelemesini sağlar.',
        'Fotoğrafla çektiğin belgeleri önce JPG → PDF ile çevir, ardından diğer PDF’lerle birleştir.',
      ] },
      { heading: 'Önerilen sıra', body: [
        'Başvuru formu → pasaport sayfaları → seyahat sağlık sigortası → uçuş rezervasyonu → konaklama → banka dökümü → işveren veya okul yazısı. Konsolosluğun kontrol listesinde farklı bir sıra varsa ona uy.',
      ] },
    ],
    steps: [
      { title: 'Evrakları topla', text: 'PDF evrakları seç; fotoğraf olanları önce PDF’e çevir.' },
      { title: 'Kontrol listesine göre sırala', text: 'Konsolosluğun istediği sıraya göre dosyaları diz.' },
      { title: 'Birleştir ve kontrol et', text: 'Tek PDF’i indir; boyut sınırı varsa PDF sıkıştır ile küçült.' },
    ],
    tips: [
      'Her kategori için ayrı PDF isteniyorsa her kategoriyi kendi içinde birleştir.',
      'Banka dökümünde kaşe ve imza sayfasının da dosyada olduğundan emin ol.',
      'Dosya adını “Ad-Soyad-Kategori.pdf” biçiminde vermek karışıklığı önler.',
    ],
    faqs: [
      { q: 'Evraklarım güvende mi?', a: 'Pasaport gibi kişisel belgeler yalnızca senin oturumundan erişilir, süre dolunca otomatik silinir; işlem sonrası hemen de silebilirsin.' },
      { q: 'Fotoğraf ve PDF’i birlikte birleştirebilir miyim?', a: 'Önce fotoğrafları JPG → PDF ile PDF’e çevir, sonra tüm PDF’leri birleştir.' },
      { q: 'Dosya boyutu limiti aşılırsa?', a: 'Konsolosluk dosya boyutu küçültme rehberindeki adımları izle: önce sıkıştır, gerekirse kategorilere böl.' },
    ],
  },
  {
    slug: 'konsolosluk-dosya-boyutu-kucultme',
    pair: 'compress-pdf-for-visa-upload',
    group: 'visa',
    tool: 'compress-pdf',
    tools: ['compress-pdf', 'edit-pdf-pages', 'images-to-pdf'],
    title: 'Konsolosluk ve Vize Sistemi İçin PDF Boyutu Küçültme',
    metaTitle: 'Vize Evrak Boyutu Küçültme – Konsolosluk Dosya Boyutu Sınırı Aşma',
    metaDescription: 'Vize başvuru sistemine yüklenmeyen büyük PDF evrakları küçült. Konsolosluk dosya boyutu sınırına uymak için sıkıştır ve böl. Ücretsiz.',
    lead: 'Başvuru sistemi “dosya çok büyük” mü diyor? Evrakı sıkıştır, gerekirse gereksiz sayfaları çıkar ve sınırın altına indir.',
    queries: ['konsolosluk dosya boyutu sınırı', 'vize evrak boyutu küçültme', 'vfs dosya boyutu küçültme', 'pdf mb düşürme', 'vize başvurusu pdf yüklenmiyor', 'pdf küçültme online'],
    sections: [
      { heading: 'Boyutu büyüten ne?', body: [
        'Telefonla yüksek çözünürlükte çekilip PDF’e çevrilen evraklar ve tarayıcıdan renkli taranan banka dökümleri genellikle büyük olur.',
        'Önce PDF sıkıştır ile kayıpsız optimizasyon dene. Yetmezse belgeden gereksiz sayfaları (boş arka yüzler, reklam sayfaları) PDF sayfalarını düzenle ile çıkar.',
      ] },
    ],
    steps: [
      { title: 'PDF’i yükle', text: 'Sınırı aşan evrakı seç.' },
      { title: 'Sıkıştır', text: 'Optimize et ve yeni boyutu kontrol et.' },
      { title: 'Gerekirse sayfa çıkar', text: 'Gereksiz sayfaları kaldırarak boyutu daha da düşür.' },
    ],
    tips: [
      'Evrakı yeniden PDF’e çevirirken “Görsele göre” yerine A4 seçmek sayfaları standart boyuta getirir.',
      'Taramayı gri tonlamada yapmak renkli taramaya göre çok daha küçük dosya üretir.',
    ],
    faqs: [
      { q: 'Kalite düşer mi?', a: 'Hayır, kayıpsız optimizasyon kullanılır; yazılar ve damgalar aynen okunur.' },
      { q: 'Neden hiç küçülmedi?', a: 'Belge tamamen yüksek çözünürlüklü görüntülerden oluşuyorsa kayıpsız yöntem sınırlı kazanç sağlar; sayfa çıkarmayı veya daha düşük çözünürlükte yeniden taramayı dene.' },
    ],
  },
  {
    slug: 'e-devlet-belgelerini-birlestirme',
    group: 'visa',
    tool: 'merge-pdf',
    tools: ['merge-pdf', 'compress-pdf', 'pdf-to-images'],
    title: 'e-Devlet Belgelerini Tek PDF’te Birleştirme',
    metaTitle: 'e-Devlet Belgeleri Birleştirme – Barkodlu Belgeleri Tek PDF Yap',
    metaDescription: 'Adli sicil, ikametgah, öğrenci belgesi, SGK dökümü gibi e-Devlet barkodlu belgelerini tek PDF’te birleştir. İş ve okul başvuruları için ücretsiz.',
    lead: 'İş, burs veya okul başvurusunda istenen adli sicil kaydı, yerleşim yeri belgesi, öğrenci belgesi ve SGK hizmet dökümünü tek dosyada gönder.',
    queries: ['e-devlet belgelerini birleştirme', 'barkodlu belge pdf birleştirme', 'adli sicil ikametgah tek pdf', 'sgk hizmet dökümü pdf', 'burs başvuru evrak birleştirme', 'e-devlet pdf küçültme'],
    sections: [
      { heading: 'Barkod ve doğrulama korunur', body: [
        'Birleştirme işlemi sayfaların içeriğine dokunmaz; e-Devlet barkodu ve doğrulama kodu aynen kalır. Kurum, belgeyi barkodla yine doğrulayabilir.',
      ] },
    ],
    steps: [
      { title: 'Belgeleri indir', text: 'e-Devlet’ten belgeleri PDF olarak kaydet.' },
      { title: 'Birleştir', text: 'Başvurunun istediği sırayla dosyaları birleştir.' },
      { title: 'Gönder', text: 'Tek PDF’i e-posta veya başvuru sistemiyle ilet.' },
    ],
    tips: [
      'Belgelerin geçerlilik tarihine dikkat et; bazı kurumlar son 1 ay içinde alınmış belge ister.',
      'Kurum JPG istiyorsa PDF → JPG aracıyla sayfaları görsele çevirebilirsin.',
    ],
    faqs: [
      { q: 'Barkod doğrulaması bozulur mu?', a: 'Hayır, sayfalar değiştirilmeden birleştirilir.' },
      { q: 'Kaç belge eklenebilir?', a: 'Tek seferde 20 dosyaya kadar birleştirebilirsin.' },
    ],
  },
  // ——— İK & kariyer ———
  {
    slug: 'cv-pdf-boyutu-kucultme',
    pair: 'compress-resume-under-2mb',
    group: 'career',
    tool: 'compress-pdf',
    tools: ['compress-pdf', 'word-to-pdf', 'edit-pdf-pages'],
    title: 'CV (Özgeçmiş) PDF Dosya Boyutunu Küçültme',
    metaTitle: 'CV Dosya Boyutu Küçültme – Kariyer.net ve LinkedIn İçin CV PDF Küçült',
    metaDescription: 'İş başvuru sitelerine yüklenmeyen büyük CV PDF’ini küçült. Fotoğraflı ve tasarımlı özgeçmişleri sıkıştır; Kariyer.net, LinkedIn, e-posta için ücretsiz.',
    lead: 'Fotoğraflı, tasarımlı CV’n başvuru sitesine yüklenmiyor mu? PDF’i sıkıştır, gerekirse Word’den yeniden çıktı al ve boyutu düşür.',
    queries: ['cv dosya boyutu küçültme', 'cv pdf küçültme', 'kariyer.net cv yükleme boyutu', 'linkedin cv pdf boyutu', 'özgeçmiş pdf mb düşürme', 'cv 2 mb altına düşürme'],
    sections: [
      { heading: 'CV’ler neden büyük olur?', body: [
        'Yüksek çözünürlüklü vesikalık fotoğraf, Canva gibi araçlardan dışa aktarılan grafik öğeler ve gömülü yazı tipleri CV dosyasını büyütür.',
        'PDF sıkıştır aracı belge yapısını kayıpsız optimize eder. Word’de hazırladığın CV’yi “Word → PDF” ile yeniden üretmek çoğu zaman en küçük sonucu verir.',
      ] },
    ],
    steps: [
      { title: 'CV’ni yükle', text: 'Özgeçmiş PDF’ini seç.' },
      { title: 'Sıkıştır', text: 'Optimize et ve yeni boyutu gör.' },
      { title: 'Başvur', text: 'Küçülen PDF’i başvuru sitesine yükle.' },
    ],
    tips: [
      'CV’ye eklediğin fotoğrafı yerleştirmeden önce küçült; 400×500 piksel yeterlidir.',
      'İki sayfayı geçen CV’lerde gereksiz sayfaları PDF sayfalarını düzenle ile çıkarabilirsin.',
      'Dosya adını “Ad-Soyad-CV.pdf” yapmak işe alım uzmanının işini kolaylaştırır.',
    ],
    faqs: [
      { q: 'CV tasarımı bozulur mu?', a: 'Hayır, kayıpsız optimizasyon kullanılır; düzen, yazı tipi ve renkler aynı kalır.' },
      { q: 'ATS (aday takip sistemi) okuyabilir mi?', a: 'Metin içeren PDF’ler ATS tarafından okunur; sıkıştırma metni değiştirmez.' },
    ],
  },
  {
    slug: 'eski-cv-word-cevirme',
    pair: 'edit-old-resume-pdf-in-word',
    group: 'career',
    tool: 'pdf-to-word',
    tools: ['pdf-to-word', 'word-to-pdf'],
    title: 'Eski PDF CV’ni Word’e Çevirip Güncelleme',
    metaTitle: 'Eski CV’yi Word’e Çevirme – PDF Özgeçmişi Düzenlenebilir Yap',
    metaDescription: 'Word dosyası kaybolmuş PDF CV’ni Word’e çevir; yeni deneyimlerini ekle, tasarımı koruyarak güncelle ve tekrar PDF yap. Ücretsiz.',
    lead: 'Elinde sadece PDF’i kalmış eski özgeçmişini Word’e çevir; baştan yazmadan yeni işini, sertifikalarını ve becerilerini ekle.',
    queries: ["eski cv'yi worde çevirme", 'pdf cv düzenleme', 'özgeçmiş pdf word', 'cv pdf word dönüştürme', 'pdf özgeçmiş güncelleme', 'canva cv word yapma'],
    sections: [
      { heading: 'Güncelle, sonra yine PDF yap', body: [
        'PDF → Word ile tablolu ve iki sütunlu CV düzenleri yeniden kurulur. Değişikliklerini yaptıktan sonra Word → PDF ile başvurulara hazır, düzgün bir PDF üret.',
      ] },
    ],
    steps: [
      { title: 'PDF CV’yi çevir', text: 'Özgeçmiş PDF’ini Word’e dönüştür.' },
      { title: 'Güncelle', text: 'Yeni deneyim ve becerilerini ekle.' },
      { title: 'Tekrar PDF yap', text: 'Word → PDF ile son halini kaydet.' },
    ],
    tips: [
      'Tasarım araçlarında hazırlanmış CV’lerde metin kutuları Word’de ayrı kutu olarak gelebilir; içerikleri kutu içinde düzenle.',
    ],
    faqs: [
      { q: 'Fotoğrafım korunur mu?', a: 'Evet, görseller Word belgesine aktarılır.' },
      { q: 'Yazı tipim yoksa ne olur?', a: 'Bilgisayarında olmayan yazı tipleri benzer bir yazı tipiyle değiştirilebilir; dilersen Word’de tek tıkla değiştirebilirsin.' },
    ],
  },
  {
    slug: 'cv-diploma-sertifika-tek-pdf',
    pair: 'combine-resume-and-cover-letter',
    group: 'career',
    tool: 'merge-pdf',
    tools: ['merge-pdf', 'images-to-pdf', 'compress-pdf'],
    title: 'CV, Diploma ve Sertifikaları Tek PDF Yapma',
    metaTitle: 'CV ve Sertifikaları Tek Dosya Yapma – Diploma, Transkript Birleştirme',
    metaDescription: 'Özgeçmiş, ön yazı, diploma, transkript ve sertifikaları iş başvurusu için tek PDF’te birleştir. Tek dosya yükleme izni olan siteler için ideal.',
    lead: 'Başvuru sitesi tek dosya mı kabul ediyor? CV’ni, ön yazını, diplomanı, transkriptini ve sertifikalarını tek PDF’te topla.',
    queries: ['cv ve sertifikaları tek dosya yapma', 'diploma ve cv birleştirme', 'transkript cv birleştirme', 'ön yazı ve cv tek pdf', 'iş başvurusu evrak birleştirme', 'staj başvurusu pdf birleştirme'],
    sections: [
      { heading: 'Doğru sıra ilk izlenimi belirler', body: [
        'Önerilen sıra: ön yazı → CV → diploma → transkript → sertifikalar → referans mektupları. Telefonla çektiğin sertifika fotoğraflarını önce JPG → PDF ile çevir.',
      ] },
    ],
    steps: [
      { title: 'Belgeleri seç', text: 'CV ve ek belgeleri yükle.' },
      { title: 'Sırala', text: 'Ön yazı ve CV’yi en başa al.' },
      { title: 'Birleştir', text: 'Tek PDF’i indir ve başvuruya ekle.' },
    ],
    tips: ['Birleştirilmiş dosya büyük olursa PDF sıkıştır ile küçült.'],
    faqs: [
      { q: 'Sertifika fotoğraflarını ekleyebilir miyim?', a: 'Önce JPG → PDF ile PDF’e çevir, sonra birleştir.' },
      { q: 'Kaç belge eklenebilir?', a: 'Tek seferde 20 dosya ve toplam 300 sayfa.' },
    ],
  },
  {
    slug: 'word-cv-pdf-yapma',
    pair: 'resume-word-to-pdf',
    group: 'career',
    tool: 'word-to-pdf',
    tools: ['word-to-pdf', 'compress-pdf', 'merge-pdf'],
    title: 'Word CV’yi PDF’e Çevirme',
    metaTitle: 'Word CV PDF Yapma – Özgeçmişi DOCX’ten PDF’e Çevir (Ücretsiz)',
    metaDescription: 'Word’de hazırladığın CV’yi her cihazda aynı görünen PDF’e çevir. İş başvurularında düzen kaymasını önle. Ücretsiz DOCX to PDF.',
    lead: 'İşe alım uzmanının bilgisayarında CV’nin kaymasını istemiyorsan Word dosyasını PDF olarak gönder.',
    queries: ['word cv pdf yapma', 'özgeçmiş word pdf çevirme', 'docx pdf çevirme', 'cv pdf olarak kaydetme', 'word pdf dönüştürme ücretsiz'],
    sections: [
      { heading: 'Neden PDF gönderilmeli?', body: [
        'DOCX dosyası alıcının bilgisayarındaki Word sürümüne ve yazı tiplerine göre farklı görünebilir. PDF ise sayfa düzenini sabitler ve tüm cihazlarda aynı görünür.',
      ] },
    ],
    steps: [
      { title: 'DOCX’i yükle', text: 'CV Word dosyanı seç.' },
      { title: 'PDF’e çevir', text: 'Dönüştürmeyi başlat.' },
      { title: 'Kontrol et', text: 'PDF’i açıp sayfa sonlarını gözden geçir.' },
    ],
    tips: ['Makro içeren (.docm) veya dış bağlantılı belgeler desteklenmez; normal .docx olarak kaydet.'],
    faqs: [
      { q: 'Yazı tiplerim değişir mi?', a: 'Yaygın yazı tipleri korunur; nadir yazı tiplerinde benzer bir yazı tipi kullanılabilir.' },
      { q: '.doc dosyası olur mu?', a: 'Şu an .docx desteklenir; eski .doc dosyasını Word’de .docx olarak kaydedebilirsin.' },
    ],
  },
  // ——— Muhasebe & finans ———
  {
    slug: 'banka-ekstresi-excel-aktarma',
    pair: 'bank-statement-to-excel',
    group: 'finance',
    tool: 'pdf-to-excel',
    tools: ['pdf-to-excel', 'merge-pdf', 'ocr'],
    title: 'Banka Hesap Ekstresini PDF’ten Excel’e Aktarma',
    metaTitle: 'Banka Ekstresi Excel’e Aktarma – PDF Hesap Dökümünü Excel Yap',
    metaDescription: 'Banka hesap ekstresi ve kredi kartı dökümündeki tabloları PDF’ten Excel’e aktar; harcamaları filtrele, topla, muhasebeleştir. Ücretsiz.',
    lead: 'İnternet şubesinden indirdiğin PDF hesap dökümündeki işlem tablolarını Excel’e aktar; tarih, açıklama ve tutarları filtrele, topla.',
    queries: ['banka hesap ekstresi excel aktarma', 'kredi kartı ekstresi excel', 'pdf hesap dökümü excel', 'banka ekstresi pdf excel çevirme', 'hesap hareketleri excel', 'pdf tablo excel aktarma'],
    sections: [
      { heading: 'Hangi ekstreler çalışır?', body: [
        'İnternet şubesinden indirilen, metni seçilebilen (dijital) PDF ekstrelerdeki tablolar algılanır ve her tablo ayrı bir Excel sayfasına aktarılır.',
        'Kağıttan taranmış ekstrelerde tablo algılanamaz; bu durumda OCR ile metni çıkarabilirsin. Hücre değerleri metin olarak aktarılır, formül çalıştırılmaz.',
      ] },
      { heading: 'Excel’de sonraki adımlar', body: [
        'Tutar sütununu sayıya çevirmek için Veri > Metni Sütunlara Dönüştür veya DEĞER() işlevini kullan. Ardından Özet Tablo ile kategori bazlı harcama raporu oluşturabilirsin.',
      ] },
    ],
    steps: [
      { title: 'Ekstreyi yükle', text: 'Bankadan indirdiğin PDF ekstreyi seç (en fazla 50 sayfa).' },
      { title: 'Excel’e aktar', text: 'Tablolar algılanır ve XLSX dosyasına aktarılır.' },
      { title: 'Analiz et', text: 'Excel’de filtrele, sırala, topla.' },
    ],
    tips: [
      'Aylık ekstreleri önce PDF birleştir ile tek dosya yapıp tek seferde aktarabilirsin (50 sayfa sınırına dikkat).',
      'Şifreli ekstreler işlenemez; bankanın şifresiz indirme seçeneğini kullan.',
    ],
    faqs: [
      { q: 'Taranmış ekstreler çalışır mı?', a: 'Hayır. Tablolar yalnızca dijital PDF’lerde algılanır; taranmış belgede metin için OCR kullan.' },
      { q: 'Formüller güvenli mi?', a: 'Evet. Hücreler metin olarak aktarılır, PDF’ten gelen hiçbir formül çalıştırılmaz.' },
      { q: 'Bilgilerim saklanır mı?', a: 'Dosya yalnızca senin oturumundan erişilir ve süre dolunca otomatik silinir.' },
    ],
  },
  {
    slug: 'pdf-fatura-excel-aktarma',
    pair: 'invoice-pdf-to-excel',
    group: 'finance',
    tool: 'pdf-to-excel',
    tools: ['pdf-to-excel', 'merge-pdf'],
    title: 'PDF Faturayı Excel’e Aktarma',
    metaTitle: 'PDF Fatura Excel Yapma – e-Fatura Kalemlerini Excel’e Aktar',
    metaDescription: 'PDF e-fatura ve e-arşiv faturalarındaki kalem tablolarını Excel’e aktar; ürün, miktar ve tutarları hesapla. Ücretsiz PDF to Excel.',
    lead: 'Tedarikçi faturalarındaki ürün, miktar, birim fiyat ve KDV tablolarını Excel’e aktararak elle yazma zahmetinden kurtul.',
    queries: ['pdf fatura excel yapma', 'e-fatura excel aktarma', 'fatura kalemleri excel', 'pdf tablo excel çevirme', 'e-arşiv fatura excel', 'irsaliye pdf excel'],
    sections: [
      { heading: 'Ne aktarılır?', body: [
        'Faturadaki kalem tablosu ve tablo şeklindeki toplam alanları algılanır. Tablo dışındaki serbest metinler (adres, not) aktarılmaz.',
      ] },
    ],
    steps: [
      { title: 'Faturayı yükle', text: 'PDF faturayı seç.' },
      { title: 'Excel’e aktar', text: 'Kalem tabloları XLSX’e çıkarılır.' },
      { title: 'Muhasebeleştir', text: 'Verileri muhasebe tablonla birleştir.' },
    ],
    tips: ['Birden çok faturayı önce PDF birleştir ile tek dosyada topla, sonra tek seferde aktar.'],
    faqs: [
      { q: 'Tablo bulunamadı hatası alıyorum', a: 'Fatura taranmış bir görüntüyse veya tablo çizgisiz serbest düzendeyse algılama başarısız olabilir.' },
    ],
  },
  {
    slug: 'e-arsiv-faturalari-birlestirme',
    pair: 'merge-monthly-invoices',
    group: 'finance',
    tool: 'merge-pdf',
    tools: ['merge-pdf', 'compress-pdf', 'pdf-to-excel'],
    title: 'Aylık e-Arşiv ve e-Faturaları Tek PDF’te Birleştirme',
    metaTitle: 'e-Arşiv Fatura Birleştirme – Aylık Faturaları Tek PDF Yap',
    metaDescription: 'Ay sonunda muhasebeciye göndermek için e-arşiv ve e-faturaları, gider makbuzlarını tek PDF’te birleştir. Ücretsiz ve üyeliksiz.',
    lead: 'Ay boyunca biriken e-arşiv faturalarını, gider makbuzlarını ve fişleri muhasebecine tek dosyada gönder.',
    queries: ['aylık e-arşiv faturaları birleştirme', 'e-fatura pdf birleştirme', 'muhasebeciye fatura gönderme', 'fatura pdf birleştirme', 'gider fişleri pdf', 'fiş fotoğrafı pdf'],
    sections: [
      { heading: 'Ay sonu düzeni', body: [
        'Faturaları tarih sırasıyla birleştirmek muhasebecinin kontrolünü hızlandırır. Kağıt fişleri telefonla çekip JPG → PDF ile ekleyebilirsin.',
      ] },
    ],
    steps: [
      { title: 'Faturaları seç', text: 'Ayın e-arşiv/e-fatura PDF’lerini yükle.' },
      { title: 'Tarihe göre sırala', text: 'Dosyaları tarih sırasına koy.' },
      { title: 'Birleştir', text: 'Tek PDF’i muhasebecine gönder.' },
    ],
    tips: ['20’den fazla fatura için iki parti halinde birleştirip sonra iki dosyayı birleştir.'],
    faqs: [
      { q: 'Fatura geçerliliği etkilenir mi?', a: 'Hayır, sayfalar değiştirilmeden birleştirilir; ancak resmi saklama yükümlülüğü için orijinal dosyaları da sakla.' },
    ],
  },
  // ——— Ofis & günlük işler ———
  {
    slug: 'pdf-sayfa-ayirma-dondurme',
    pair: 'extract-and-rotate-pdf-pages',
    group: 'office',
    tool: 'edit-pdf-pages',
    tools: ['edit-pdf-pages', 'merge-pdf', 'compress-pdf'],
    title: 'PDF’ten Sayfa Ayırma, Silme ve Ters Sayfaları Döndürme',
    metaTitle: 'PDF Sayfa Ayırma ve Döndürme – Sayfa Silme, Sıralama (Ücretsiz)',
    metaDescription: 'PDF’ten istediğin sayfaları ayır, gereksiz sayfaları sil, ters taranmış sayfaları döndür veya her sayfayı ayrı PDF yap. Ücretsiz online.',
    lead: 'Uzun bir belgeden yalnızca imzalı sayfayı mı lazım? Ters taranmış sayfaları mı düzeltmek istiyorsun? Sayfa aralığını yaz, gerisini bırak.',
    queries: ['pdf sayfa ayırma', 'pdften sayfa silme', 'pdf sayfa döndürme', 'ters taranmış pdf düzeltme', 'pdf her sayfayı ayrı kaydetme', 'pdf sayfa sırası değiştirme'],
    sections: [
      { heading: 'Sayfa aralığı nasıl yazılır?', body: [
        '“3, 1-2” yazarsan çıktı 3. sayfa, ardından 1 ve 2. sayfalardan oluşur; yazmadığın sayfalar çıkarılır. Döndürme seçeneği seçilen sayfalara uygulanır.',
        '“Sayfa başına PDF (ZIP)” seçeneği her sayfayı ayrı PDF dosyası olarak verir.',
      ] },
    ],
    steps: [
      { title: 'PDF’i yükle', text: 'Düzenlenecek belgeyi seç.' },
      { title: 'Sayfaları yaz', text: 'Örn. 5-8 veya 3, 1-2; gerekiyorsa döndürmeyi seç.' },
      { title: 'İndir', text: 'Tek PDF veya ZIP olarak al.' },
    ],
    tips: ['Ters taranmış birkaç sayfa için yalnızca o sayfaları seçip 180° döndür, sonra PDF birleştir ile asıl belgeye yerleştir.'],
    faqs: [
      { q: 'Orijinal dosyam değişir mi?', a: 'Hayır, yeni bir dosya üretilir.' },
      { q: 'Kaç sayfalık belge işlenir?', a: '300 sayfaya kadar PDF’ler desteklenir.' },
    ],
  },
  {
    slug: 'pdf-sayfalarini-jpg-yapma',
    pair: 'pdf-pages-to-jpg-for-social',
    group: 'office',
    tool: 'pdf-to-images',
    tools: ['pdf-to-images', 'edit-pdf-pages'],
    title: 'PDF Sayfalarını JPG veya PNG Görsele Çevirme',
    metaTitle: 'PDF’i JPG Yapma – Sayfaları Instagram, WhatsApp İçin Görsele Çevir',
    metaDescription: 'PDF sayfalarını yüksek kaliteli JPG veya PNG görsele çevir; sunum, menü, broşür ve afişleri Instagram, WhatsApp ve web sitesinde paylaş.',
    lead: 'Menü, broşür, sunum veya afiş PDF’ini sosyal medyada paylaşılabilir görsellere çevir; tek sayfa doğrudan JPG, çok sayfa ZIP olarak gelir.',
    queries: ['pdf jpg yapma', 'pdf sayfasını resme çevirme', 'pdf instagram paylaşma', 'pdf png çevirme', 'menü pdf jpg', 'sunum sayfası görsel yapma'],
    sections: [
      { heading: 'JPG mi PNG mi?', body: [
        'Fotoğraf ağırlıklı sayfalar için JPG daha küçük dosya verir. Metin, logo ve keskin çizgiler için PNG daha nettir. “Yüksek” kalite 150 DPI ile daha detaylı görsel üretir.',
      ] },
    ],
    steps: [
      { title: 'PDF’i yükle', text: 'En fazla 30 sayfalık PDF’i seç.' },
      { title: 'Biçim ve sayfa seç', text: 'JPG/PNG ve kaliteyi seç; istersen sayfa aralığı yaz.' },
      { title: 'İndir', text: 'Tek görsel veya ZIP arşivini indir.' },
    ],
    tips: ['Instagram için yalnızca kapak sayfasını istiyorsan sayfa alanına “1” yaz.'],
    faqs: [
      { q: 'Kaç sayfa çevrilebilir?', a: 'En fazla 30 sayfalık PDF’ler desteklenir.' },
      { q: 'Çıktı neden ZIP?', a: 'Birden fazla sayfa seçtiğinde tüm görseller tek ZIP dosyasında indirilir.' },
    ],
  },
  {
    slug: 'excel-teklif-bordro-pdf-yapma',
    pair: 'excel-quote-to-pdf',
    group: 'office',
    tool: 'excel-to-pdf',
    tools: ['excel-to-pdf', 'merge-pdf', 'compress-pdf'],
    title: 'Excel Teklif, Fiyat Listesi ve Bordroyu PDF Yapma',
    metaTitle: 'Excel’i PDF Yapma – Teklif, Fiyat Listesi ve Bordroyu PDF’e Çevir',
    metaDescription: 'Excel teklif formunu, fiyat listesini veya puantaj/bordro tablosunu müşteriye gönderilebilir PDF’e çevir. Tüm sayfalar veya yalnızca ilk sayfa.',
    lead: 'Excel dosyasını müşteriye gönderdiğinde formüller ve sütun genişlikleri bozulmasın; teklifini PDF olarak paylaş.',
    queries: ['excel pdf yapma', 'excel teklif pdf gönderme', 'fiyat listesi pdf', 'bordro excel pdf', 'puantaj pdf çevirme', 'xlsx pdf dönüştürme'],
    sections: [
      { heading: 'Hangi sayfalar aktarılır?', body: [
        'Tüm çalışma sayfalarını veya yalnızca ilk sayfayı PDF’e aktarabilirsin. Sayfa düzeni Excel’deki yazdırma ayarlarına göre oluşur.',
      ] },
    ],
    steps: [
      { title: 'XLSX’i yükle', text: 'Excel dosyanı seç.' },
      { title: 'Sayfaları seç', text: 'Tüm sayfalar veya ilk sayfa.' },
      { title: 'PDF’i gönder', text: 'Çıktıyı müşterine ilet.' },
    ],
    tips: ['Excel’de Sayfa Düzeni > Sığdır ayarını “1 sayfa genişliğinde” yapmak taşan sütunları önler.'],
    faqs: [
      { q: 'Makrolu dosya olur mu?', a: 'Makro, gömülü nesne veya dış bağlantı içeren dosyalar güvenlik nedeniyle reddedilir.' },
    ],
  },
];
