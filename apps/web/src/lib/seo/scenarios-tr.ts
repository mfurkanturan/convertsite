import type { Scenario } from './scenarios';

export const trScenarios: Scenario[] = [
  {
    "slug": "vize-final-notlari-birlestirme",
    "pair": "combine-lecture-notes-for-exams",
    "group": "student",
    "tool": "merge-pdf",
    "tools": ["merge-pdf", "compress-pdf", "edit-pdf-pages"],
    "title": "Vize ve Final Notlarını Tek PDF’te Birleştirme",
    "metaTitle": "Vize ve Final Notlarını Tek PDF’te Birleştirme | DoctorConverter",
    "metaDescription": "Haftalık ders notlarını, slaytları ve çıkmış soruları seçtiğin sırayla tek PDF’te topla.",
    "lead": "Haftalık ders notlarını, slaytları ve çıkmış soruları seçtiğin sırayla tek PDF’te topla.",
    "queries": ["vize final notları birleştirme", "ders notlarını tek pdf yapma", "ders slaytları tek pdf", "pdf notları birleştirme", "çıkmış sorular pdf birleştirme", "sınav notları tek dosya"],
    "sections": [
      {
        "heading": "Sınav haftası neden tek PDF?",
        "body": [
          "Her hafta ayrı yüklenen slaytlar, WhatsApp grubundan gelen notlar ve çıkmış sorular telefonda ve bilgisayarda dağınık durur. Tek bir PDF ile tabletinde baştan sona okuyabilir, arama (Ctrl+F) ile konuyu bulabilir ve tek dosyayı yazdırabilirsin.",
          "Birleştirirken dosya sırasını sen belirlersin: önce 1. hafta, sonra 2. hafta… Çıkmış soruları sona ekleyebilirsin."
        ]
      },
      {
        "heading": "Çok büyük olursa ne yapmalı?",
        "body": [
          "Bir dönemin tüm slaytları büyük bir dosya olabilir. Birleştirdikten sonra PDF sıkıştır aracıyla boyutu küçültebilir, gereksiz sayfaları (kapak, boş sayfa, tekrar eden slaytlar) PDF sayfalarını düzenle aracıyla çıkarabilirsin."
        ]
      }
    ],
    "steps": [
      { "title": "Notlarını seç", "text": "Haftalık PDF notlarını ve slaytlarını yukarıdaki alana sürükle; araç panelindeki dosya limitini kontrol et." },
      { "title": "Sırayı düzenle", "text": "Ok tuşlarıyla haftaları doğru sıraya koy, çıkmış soruları en sona al." },
      { "title": "Birleştir ve indir", "text": "“PDF’leri birleştir”e bas, tek dosyalık sınav notunu indir." }
    ],
    "tips": [
      "Dosya adlarını “01-hafta.pdf, 02-hafta.pdf” gibi numaralandırırsan sıralama çok daha hızlı olur.",
      "Telefonla çektiğin not fotoğrafları için önce JPG → PDF aracını kullan, sonra birleştir.",
      "Araç panelindeki toplam sayfa sınırını aşan notları bölümler halinde işle."
    ],
    "faqs": [
      { "q": "Kaç dosyayı birleştirebilirim?", "a": "Güncel dosya, boyut ve sayfa limitleri araç panelinde sunucudan alınarak gösterilir. İşleme başlamadan önce bu değerleri kontrol et." },
      { "q": "Slaytların sırası bozulur mu?", "a": "Hayır. Çıktıdaki sayfa sırası listede belirlediğin dosya sırasını izler." },
      { "q": "Telefonda kullanabilir miyim?", "a": "Evet. Site mobil tarayıcıda çalışır; uygulama indirmen gerekmez." }
    ]
  },
  {
    "slug": "ders-slayti-pdf-word-cevirme",
    "pair": "lecture-slides-pdf-to-word",
    "group": "student",
    "tool": "pdf-to-word",
    "tools": ["pdf-to-word", "ocr", "merge-pdf"],
    "title": "Ders Slaytlarını ve Notlarını PDF’ten Word’e Çevirme",
    "metaTitle": "Ders Slaytlarını ve Notlarını PDF’ten Word’e Çevirme | DoctorConverter",
    "metaDescription": "Metin içeren ders slaytlarını ve PDF notlarını Word’e aktar; sonucu kontrol edip kendi notlarını ekle.",
    "lead": "Metin içeren ders slaytlarını ve PDF notlarını Word’e aktar; sonucu kontrol edip kendi notlarını ekle.",
    "queries": ["ders slaytlarını worde çevirme", "pdf notları word yapma", "düzenlenemeyen pdf worde çevirme", "kilitli pdf slaytları worde çevirme", "ders notu pdf düzenleme", "slayt pdf word dönüştürme"],
    "sections": [
      {
        "heading": "Neden Word’e çevirmeli?",
        "body": [
          "PDF notlarını Word’e aktararak düzenleyebilirsin. Word’e çevirdiğinde başlıkları kendi özetine kopyalayabilir, gereksiz kısımları silebilir, renkli vurgular ve açıklamalar ekleyebilirsin.",
          "Dönüştürücü yazı biçimlerini, tabloları, görselleri ve sütunları yeniden kurarak düzenlenebilir bir DOCX üretir. Yoğun tasarımlarda metin, tablo ve yerleşim hataları olabilir; sonucu kaynakla karşılaştır."
        ]
      },
      {
        "heading": "Taranmış (fotokopi) notlar için",
        "body": ["Fotokopiden taranmış notlarda seçilebilir metin yoktur. Bu durumda önce Metin çıkar (OCR) aracıyla yazıyı metne dönüştür, ardından Word’e yapıştırarak düzenle."]
      }
    ],
    "steps": [
      { "title": "PDF’i yükle", "text": "Ders slaytını veya not PDF’ini seç (güncel sayfa limiti araç panelindedir)." },
      { "title": "Dönüştür", "text": "“Word’e dönüştür”e bas; yazı, tablo ve görseller DOCX’e aktarılır." },
      { "title": "Word’de çalış", "text": "İndirdiğin dosyayı Word veya Google Docs’ta açıp notlarını ekle." }
    ],
    "tips": [
      "Şifre ile korunan PDF’ler açılamaz; hocandan şifresiz sürümünü iste.",
      "Uzun ders kitaplarını bölümlere ayırıp (PDF sayfalarını düzenle) her bölümü ayrı çevir.",
      "Sunum odaklı slaytlarda her slayt genellikle ayrı bir sayfa olarak gelir; özet için başlıkları kopyalamak en hızlısıdır."
    ],
    "faqs": [
      { "q": "“Kilitli” PDF’leri açabilir mi?", "a": "Üzerine yazılamayan, salt okunur PDF’leri Word’e çevirebilirsin. Açılış şifresiyle korunan (şifreli) PDF’ler ise desteklenmez." },
      { "q": "Türkçe karakterler bozulur mu?", "a": "Türkçe karakterler desteklenir. Kaynak yazı tipi ve kodlama sonucu etkileyebilir; ç, ğ, ı, ö, ş, ü karakterlerini kontrol et." },
      { "q": "Kaç sayfaya kadar çevrilir?", "a": "Güncel dosya, boyut ve sayfa limitleri araç panelinde sunucudan alınarak gösterilir. İşleme başlamadan önce bu değerleri kontrol et." },
      { "q": "Çıktıyı Google Docs’ta açabilir miyim?", "a": "Evet, DOCX dosyası Google Docs, Pages ve LibreOffice ile de açılır." }
    ]
  },
  {
    "slug": "odev-fotograflarini-pdf-yapma",
    "pair": "homework-photos-to-pdf",
    "group": "student",
    "tool": "images-to-pdf",
    "tools": ["images-to-pdf", "compress-pdf", "merge-pdf"],
    "title": "Ödev ve Sınav Kağıdı Fotoğraflarını PDF Yapma",
    "metaTitle": "Ödev ve Sınav Kağıdı Fotoğraflarını PDF Yapma | DoctorConverter",
    "metaDescription": "Ödev fotoğraflarını sırala ve teslim etmek için tek PDF oluştur.",
    "lead": "Ödev fotoğraflarını sırala ve teslim etmek için tek PDF oluştur.",
    "queries": ["ödev fotoğraflarını pdf yapma", "telefondan çekilen fotoğrafları pdf yapma", "el yazısı ödev pdf", "jpg pdf birleştirme", "sınav kağıdı fotoğraf pdf", "moodle ödev pdf yükleme"],
    "sections": [
      {
        "heading": "Öğretmenler neden PDF ister?",
        "body": [
          "Tek tek fotoğraf göndermek sayfaların karışmasına ve eksik teslimlere yol açar. Tek PDF; sayfa sırası sabit, açması kolay ve tüm sistemlerin kabul ettiği bir formattır.",
          "Görselden PDF aracı fotoğrafları A4 sayfaya ortalar veya görselin kendi boyutunu korur; yatay çekilmiş sayfalar için yatay sayfa seçebilirsin."
        ]
      }
    ],
    "steps": [
      { "title": "Fotoğrafları seç", "text": "JPG veya PNG fotoğraflarını seç; güncel dosya limitini panelden kontrol et." },
      { "title": "Sırala ve ayarla", "text": "Sayfa sırasını düzenle, A4 veya görsel boyutunu ve sayfa yönünü seç." },
      { "title": "PDF’i indir", "text": "Tek PDF’i indir ve ödev sistemine yükle." }
    ],
    "tips": [
      "Fotoğrafları gün ışığında, kağıdı düz bir zemine koyarak ve tepeden çek; gölge okunabilirliği düşürür.",
      "Telefon dikey çekilmiş fotoğrafları otomatik döndürür; yan duran sayfa olursa sonra PDF sayfalarını düzenle ile çevirebilirsin.",
      "Dosya çok büyük olursa PDF sıkıştır aracını dene."
    ],
    "faqs": [
      { "q": "Görsel başına sınır var mı?", "a": "Güncel dosya, boyut ve sayfa limitleri araç panelinde sunucudan alınarak gösterilir. İşleme başlamadan önce bu değerleri kontrol et." },
      { "q": "Sayfalar A4 olur mu?", "a": "Varsayılan A4’tür. İstersen “Görsele göre” seçerek her sayfayı fotoğraf boyutunda bırakabilirsin." }
    ]
  },
  {
    "slug": "tez-makale-pdf-word-cevirme",
    "pair": "thesis-pdf-to-word",
    "group": "student",
    "tool": "pdf-to-word",
    "tools": ["pdf-to-word", "edit-pdf-pages", "ocr"],
    "title": "Tez ve Makale PDF’ini Word’e Çevirme",
    "metaTitle": "Tez ve Makale PDF’ini Word’e Çevirme | DoctorConverter",
    "metaDescription": "Tez veya makalenin metin içeren PDF’ini Word’e aktar. Tablo, denklem ve sayfa düzenini kaynakla karşılaştır.",
    "lead": "Tez veya makalenin metin içeren PDF’ini Word’e aktar. Tablo, denklem ve sayfa düzenini kaynakla karşılaştır.",
    "queries": ["tez worde çevirme", "tez pdf word yapma", "makale pdf word çevirme", "proje raporu pdf word", "akademik pdf düzenleme", "iki sütunlu pdf word"],
    "sections": [
      {
        "heading": "Akademik belgelerde neler korunur?",
        "body": [
          "Başlıklar, paragraflar, tablolar ve görseller DOCX içinde yeniden kurulmaya çalışılır. İki sütunlu düzenler ve dipnotlar kaynakla aynı görünmeyebilir.",
          "Denklem yoğun sayfalarda ve özel yazı tiplerinde farklılıklar olabilir; çevirdikten sonra bu bölümleri kontrol etmeni öneririz."
        ]
      },
      {
        "heading": "Sayfa limitini aşan tezler",
        "body": ["PDF → Word için güncel sayfa sınırını araç panelinden kontrol et. Uzun tezleri PDF sayfalarını düzenle aracıyla bölümlere ayırıp (ör. 1-45, 46-90) parça parça çevirebilirsin."]
      }
    ],
    "steps": [
      { "title": "Bölümü ayır (gerekirse)", "text": "Paneldeki sayfa limitini aşan belgeleri önce bölüm aralıklarına ayır." },
      { "title": "Word’e çevir", "text": "PDF’i seç ve “Word’e dönüştür”e bas." },
      { "title": "Kontrol et", "text": "Tablo ve denklem bölümlerini gözden geçir, düzenlemeye devam et." }
    ],
    "tips": ["Taranmış eski tezlerde önce OCR ile metni çıkar.", "Word’e aktardıktan sonra başlık stillerini (Başlık 1, 2) uygularsan içindekiler tablosunu otomatik oluşturabilirsin."],
    "faqs": [
      { "q": "Kaynakça ve dipnotlar korunur mu?", "a": "Metin olarak korunur. Word’ün otomatik kaynakça alanlarına dönüşmez; düz metin olarak gelir." },
      { "q": "Tablolar Word tablosu olur mu?", "a": "Evet, algılanan tablolar düzenlenebilir Word tablosu olarak aktarılır." }
    ]
  },
  {
    "slug": "uyap-pdf-boyutu-kucultme",
    "pair": "court-filing-pdf-compressor",
    "group": "legal",
    "tool": "compress-pdf",
    "tools": ["compress-pdf", "edit-pdf-pages", "merge-pdf"],
    "title": "UYAP İçin PDF Dosya Boyutu Küçültme",
    "metaTitle": "UYAP İçin PDF Dosya Boyutu Küçültme | DoctorConverter",
    "metaDescription": "UYAP’a yüklemeden önce PDF’in boyutunu küçültmeyi dene; yetmezse sayfalara göre böl.",
    "lead": "UYAP’a yüklemeden önce PDF’in boyutunu küçültmeyi dene; yetmezse sayfalara göre böl.",
    "queries": ["uyap dosya boyutu küçültme", "uyap pdf mb düşürme", "uyap evrak boyut sınırı", "uyap pdf yüklenmiyor", "avukat portal pdf küçültme", "dilekçe pdf boyutu küçültme"],
    "sections": [
      {
        "heading": "UYAP’ta boyut sorunu neden çıkar?",
        "body": [
          "Taranmış delil klasörleri, yüksek çözünürlükte kaydedilmiş fotoğraflar ve birden fazla belgenin birleştirilmesi PDF’i hızla büyütür. Portal belirli bir boyutun üzerindeki dosyaları kabul etmez.",
          "PDF sıkıştır aracı dosyanın iç yapısını optimize eder; görsellerin çözünürlüğünü düşürmez. Boyut azalması belgeye bağlıdır ve garanti edilmez."
        ]
      },
      {
        "heading": "Sıkıştırma yetmezse: parçalara böl",
        "body": [
          "Taranmış, görsel ağırlıklı belgelerde kayıpsız sıkıştırmanın etkisi sınırlıdır. Bu durumda PDF sayfalarını düzenle aracıyla belgeyi “1-40” ve “41-80” gibi aralıklara bölüp ayrı ekler halinde yükleyebilirsin.",
          "Mümkünse belgeyi taramak yerine Word’den doğrudan PDF olarak kaydet (Word → PDF); bu yöntem çok daha küçük dosyalar üretir."
        ]
      }
    ],
    "steps": [
      { "title": "PDF’i yükle", "text": "UYAP’a yüklenmeyen dilekçe, ek veya delil PDF’ini seç." },
      { "title": "Sıkıştır", "text": "“PDF’yi sıkıştır”a bas ve çıktı boyutunu kontrol et." },
      { "title": "Gerekirse böl", "text": "Hâlâ büyükse sayfa aralıklarıyla parçalara ayır ve ayrı yükle." }
    ],
    "tips": [
      "Tarayıcı ayarlarında 200–300 DPI ve gri tonlama seçmek taranmış evrakın boyutunu baştan küçültür.",
      "Birden çok eki tek PDF yapmak yerine portalın izin verdiği ek sayısına göre bölmek yükleme hatalarını azaltır.",
      "Şifreli PDF’ler işlenemez; korumayı kaldırılmış sürümü kullan."
    ],
    "faqs": [
      { "q": "Sıkıştırma belgenin okunurluğunu bozar mı?", "a": "Araç görsellerin çözünürlüğünü düşürmeden dosya yapısını optimize eder. Metin, imza görüntüsü ve barkodları çıktıda kontrol et." },
      { "q": "Dosya küçülmedi, neden?", "a": "Belge zaten optimize edilmişse veya tamamen taranmış görüntülerden oluşuyorsa küçülme sınırlı olur. Bu durumda belgeyi bölmeyi dene." },
      { "q": "En fazla kaç sayfa işlenir?", "a": "Güncel dosya, boyut ve sayfa limitleri araç panelinde sunucudan alınarak gösterilir. İşleme başlamadan önce bu değerleri kontrol et." }
    ]
  },
  {
    "slug": "dilekce-delil-listesi-birlestirme",
    "pair": "merge-legal-exhibits",
    "group": "legal",
    "tool": "merge-pdf",
    "tools": ["merge-pdf", "compress-pdf", "word-to-pdf"],
    "title": "Dava Dilekçesi, Ekler ve Delil Listesini Tek PDF Yapma",
    "metaTitle": "Dava Dilekçesi, Ekler ve Delil Listesini Tek PDF Yapma | DoctorConverter",
    "metaDescription": "Dilekçeyi, delil listesini ve ekleri ihtiyacın olan sırayla tek PDF’te birleştir.",
    "lead": "Dilekçeyi, delil listesini ve ekleri ihtiyacın olan sırayla tek PDF’te birleştir.",
    "queries": ["dava dilekçesi ve delil listesi birleştirme", "ek evrak tek pdf", "dilekçe ekleri birleştirme", "vekaletname dilekçe birleştirme", "hukuk pdf birleştirme", "icra takip evrak birleştirme"],
    "sections": [
      {
        "heading": "Sıralama neden önemli?",
        "body": [
          "Hakim ve kalemin dosyayı rahat incelemesi için dilekçenin ardından delil listesi ve ekler numara sırasıyla gelmelidir. PDF birleştirmede çıktı sırası, listede belirlediğin sıradır.",
          "Word’de hazırladığın dilekçeyi önce Word → PDF ile çevir, ardından taranmış eklerle birleştir."
        ]
      }
    ],
    "steps": [
      { "title": "Belgeleri ekle", "text": "Dilekçe, vekaletname, delil listesi ve ekleri seç." },
      { "title": "Ek sırasını kur", "text": "Ek-1, Ek-2… sırasına göre dosyaları yukarı/aşağı taşı." },
      { "title": "Birleştir", "text": "Tek PDF’i indir; büyükse PDF sıkıştır ile küçült." }
    ],
    "tips": ["Dosya adlarına “00-dilekce, 01-vekaletname, 02-ek1” gibi ön ek vermek sıralamayı kolaylaştırır.", "Birleştirilmiş dosya UYAP sınırını aşarsa ekleri gruplar halinde birleştir."],
    "faqs": [
      { "q": "Islak imzalı taranmış sayfalar korunur mu?", "a": "Evet. Birleştirme sayfaları değiştirmez; imza ve kaşe görüntüleri aynen kalır." },
      { "q": "Word dilekçeyi doğrudan ekleyebilir miyim?", "a": "Önce Word → PDF aracıyla PDF’e çevir, sonra birleştir." },
      { "q": "Kaç belge birleştirilebilir?", "a": "Güncel dosya, boyut ve sayfa limitleri araç panelinde sunucudan alınarak gösterilir. İşleme başlamadan önce bu değerleri kontrol et." }
    ]
  },
  {
    "slug": "taranmis-mahkeme-karari-metne-cevirme",
    "pair": "scanned-document-to-text",
    "group": "legal",
    "tool": "ocr",
    "tools": ["ocr", "pdf-to-word", "edit-pdf-pages"],
    "title": "Taranmış Mahkeme Kararından ve Bilirkişi Raporundan Metin Kopyalama",
    "metaTitle": "Taranmış Mahkeme Kararından ve Bilirkişi Raporundan Metin Kopyalama | DoctorConverter",
    "metaDescription": "Taranmış karar veya rapordan OCR ile metin çıkar. Alıntı yapmadan önce metni aslıyla karşılaştır.",
    "lead": "Taranmış karar veya rapordan OCR ile metin çıkar. Alıntı yapmadan önce metni aslıyla karşılaştır.",
    "queries": ["taranmış mahkeme kararından metin kopyalama", "taranmış pdf metin kopyalama", "bilirkişi raporu metne çevirme", "türkçe ocr", "resimdeki yazıyı metne çevirme", "pdf metin seçilemiyor"],
    "sections": [
      {
        "heading": "OCR ne işe yarar?",
        "body": [
          "Taranmış belgeler aslında resimdir; içindeki yazı seçilemez ve aranamaz. OCR (optik karakter tanıma) bu görüntülerdeki yazıyı düz metne çevirir.",
          "Türkçe, İngilizce veya iki dil birlikte seçilebilir. Çıktı düz metin (TXT) dosyasıdır; sayfa düzeni korunmaz ama metni istediğin yere yapıştırabilirsin."
        ]
      }
    ],
    "steps": [
      { "title": "Belgeyi yükle", "text": "Taranmış PDF’i veya fotoğrafı seç; güncel sayfa limitini panelden kontrol et." },
      { "title": "Dili seç", "text": "Belge dilini Türkçe, İngilizce veya ikisi olarak belirle." },
      { "title": "Metni al", "text": "TXT dosyasını indir, ilgili bölümü kopyala." }
    ],
    "tips": [
      "Uzun kararlarda yalnızca ihtiyacın olan sayfaları PDF sayfalarını düzenle ile ayırıp OCR’a ver.",
      "Eğik veya düşük çözünürlüklü taramalar doğruluğu düşürür; mümkünse 300 DPI tarama kullan.",
      "Alıntı yapmadan önce sayı ve tarihleri asıl belgeyle karşılaştır."
    ],
    "faqs": [
      { "q": "Türkçe karakterleri tanır mı?", "a": "Evet, Türkçe dil paketi kullanılır; ç, ğ, ı, ş gibi harfler tanınır." },
      { "q": "El yazısını okur mu?", "a": "OCR basılı metin için tasarlanmıştır; el yazısında doğruluk düşüktür." },
      { "q": "Kaç sayfa işlenir?", "a": "Güncel dosya, boyut ve sayfa limitleri araç panelinde sunucudan alınarak gösterilir. İşleme başlamadan önce bu değerleri kontrol et." }
    ]
  },
  {
    "slug": "vize-evraklari-tek-pdf-birlestirme",
    "pair": "visa-application-documents-one-pdf",
    "group": "visa",
    "tool": "merge-pdf",
    "tools": ["merge-pdf", "images-to-pdf", "compress-pdf"],
    "title": "Vize Başvuru Evraklarını Tek PDF’te Birleştirme",
    "metaTitle": "Vize Başvuru Evraklarını Tek PDF’te Birleştirme | DoctorConverter",
    "metaDescription": "Başvuruda istenen belgeleri belirtilen sırayla tek PDF’te birleştir.",
    "lead": "Başvuruda istenen belgeleri belirtilen sırayla tek PDF’te birleştir.",
    "queries": ["vfs global vize evrakları birleştirme", "vize evrakları tek pdf", "pasaport ve otel rezervasyonu tek pdf", "schengen vize evrak pdf", "konsolosluk evrak birleştirme", "idata evrak pdf"],
    "sections": [
      {
        "heading": "Online vize başvurusunda doğru dosya düzeni",
        "body": [
          "Pek çok başvuru merkezi evrakları kategoriler halinde ve belirli bir sırayla yüklemeni ister. Kategori başına tek PDF hazırlamak hem yükleme sınırlarına uymayı hem de memurun belgeyi hızlı incelemesini sağlar.",
          "Fotoğrafla çektiğin belgeleri önce JPG → PDF ile çevir, ardından diğer PDF’lerle birleştir."
        ]
      },
      {
        "heading": "Önerilen sıra",
        "body": [
          "Başvuru formu → pasaport sayfaları → seyahat sağlık sigortası → uçuş rezervasyonu → konaklama → banka dökümü → işveren veya okul yazısı. Konsolosluğun kontrol listesinde farklı bir sıra varsa ona uy."
        ]
      }
    ],
    "steps": [
      { "title": "Evrakları topla", "text": "PDF evrakları seç; fotoğraf olanları önce PDF’e çevir." },
      { "title": "Kontrol listesine göre sırala", "text": "Konsolosluğun istediği sıraya göre dosyaları diz." },
      { "title": "Birleştir ve kontrol et", "text": "Tek PDF’i indir; boyut sınırı varsa PDF sıkıştır ile küçült." }
    ],
    "tips": [
      "Her kategori için ayrı PDF isteniyorsa her kategoriyi kendi içinde birleştir.",
      "Banka dökümünde kaşe ve imza sayfasının da dosyada olduğundan emin ol.",
      "Dosya adını “Ad-Soyad-Kategori.pdf” biçiminde vermek karışıklığı önler."
    ],
    "faqs": [
      { "q": "Fotoğraf ve PDF’i birlikte birleştirebilir miyim?", "a": "Önce fotoğrafları JPG → PDF ile PDF’e çevir, sonra tüm PDF’leri birleştir." },
      { "q": "Dosya boyutu limiti aşılırsa?", "a": "Konsolosluk dosya boyutu küçültme rehberindeki adımları izle: önce sıkıştır, gerekirse kategorilere böl." }
    ]
  },
  {
    "slug": "konsolosluk-dosya-boyutu-kucultme",
    "pair": "compress-pdf-for-visa-upload",
    "group": "visa",
    "tool": "compress-pdf",
    "tools": ["compress-pdf", "edit-pdf-pages", "images-to-pdf"],
    "title": "Konsolosluk ve Vize Sistemi İçin PDF Boyutu Küçültme",
    "metaTitle": "Konsolosluk ve Vize Sistemi İçin PDF Boyutu Küçültme | DoctorConverter",
    "metaDescription": "PDF’i sıkıştırmayı dene. Sonuç büyük kalırsa gereksiz sayfaları çıkar veya belgeyi böl.",
    "lead": "PDF’i sıkıştırmayı dene. Sonuç büyük kalırsa gereksiz sayfaları çıkar veya belgeyi böl.",
    "queries": ["konsolosluk dosya boyutu sınırı", "vize evrak boyutu küçültme", "vfs dosya boyutu küçültme", "pdf mb düşürme", "vize başvurusu pdf yüklenmiyor", "pdf küçültme online"],
    "sections": [
      {
        "heading": "Boyutu büyüten ne?",
        "body": [
          "Telefonla yüksek çözünürlükte çekilip PDF’e çevrilen evraklar ve tarayıcıdan renkli taranan banka dökümleri genellikle büyük olur.",
          "Önce PDF sıkıştır ile kayıpsız optimizasyon dene. Yetmezse belgeden gereksiz sayfaları (boş arka yüzler, reklam sayfaları) PDF sayfalarını düzenle ile çıkar."
        ]
      }
    ],
    "steps": [
      { "title": "PDF’i yükle", "text": "Sınırı aşan evrakı seç." },
      { "title": "Sıkıştır", "text": "Optimize et ve yeni boyutu kontrol et." },
      { "title": "Gerekirse sayfa çıkar", "text": "Gereksiz sayfaları kaldırarak boyutu daha da düşür." }
    ],
    "tips": ["Evrakı yeniden PDF’e çevirirken “Görsele göre” yerine A4 seçmek sayfaları standart boyuta getirir.", "Taramayı gri tonlamada yapmak renkli taramaya göre çok daha küçük dosya üretir."],
    "faqs": [
      { "q": "Kalite düşer mi?", "a": "Görsellerin çözünürlüğü düşürülmez; çıktıdaki yazı ve damgaları kontrol et." },
      { "q": "Neden hiç küçülmedi?", "a": "Belge tamamen yüksek çözünürlüklü görüntülerden oluşuyorsa kayıpsız yöntem sınırlı kazanç sağlar; sayfa çıkarmayı veya daha düşük çözünürlükte yeniden taramayı dene." }
    ]
  },
  {
    "slug": "e-devlet-belgelerini-birlestirme",
    "group": "visa",
    "tool": "merge-pdf",
    "tools": ["merge-pdf", "compress-pdf", "pdf-to-images"],
    "title": "e-Devlet Belgelerini Tek PDF’te Birleştirme",
    "metaTitle": "e-Devlet Belgelerini Tek PDF’te Birleştirme | DoctorConverter",
    "metaDescription": "Başvuruda istenen e-Devlet belgelerini tek PDF’te topla; kaynak dosyaları da sakla.",
    "lead": "Başvuruda istenen e-Devlet belgelerini tek PDF’te topla; kaynak dosyaları da sakla.",
    "queries": ["e-devlet belgelerini birleştirme", "barkodlu belge pdf birleştirme", "adli sicil ikametgah tek pdf", "sgk hizmet dökümü pdf", "burs başvuru evrak birleştirme", "e-devlet pdf küçültme"],
    "sections": [
      {
        "heading": "Barkod ve doğrulama korunur",
        "body": ["Birleştirme işlemi sayfaların içeriğine dokunmaz; e-Devlet barkodu ve doğrulama kodu aynen kalır. Kurum, belgeyi barkodla yine doğrulayabilir."]
      }
    ],
    "steps": [
      { "title": "Belgeleri indir", "text": "e-Devlet’ten belgeleri PDF olarak kaydet." },
      { "title": "Birleştir", "text": "Başvurunun istediği sırayla dosyaları birleştir." },
      { "title": "Gönder", "text": "Tek PDF’i e-posta veya başvuru sistemiyle ilet." }
    ],
    "tips": ["Belgelerin geçerlilik tarihine dikkat et; bazı kurumlar son 1 ay içinde alınmış belge ister.", "Kurum JPG istiyorsa PDF → JPG aracıyla sayfaları görsele çevirebilirsin."],
    "faqs": [
      { "q": "Barkod doğrulaması bozulur mu?", "a": "Hayır, sayfalar değiştirilmeden birleştirilir." },
      { "q": "Kaç belge eklenebilir?", "a": "Güncel dosya, boyut ve sayfa limitleri araç panelinde sunucudan alınarak gösterilir. İşleme başlamadan önce bu değerleri kontrol et." }
    ]
  },
  {
    "slug": "cv-pdf-boyutu-kucultme",
    "pair": "compress-resume-under-2mb",
    "group": "career",
    "tool": "compress-pdf",
    "tools": ["compress-pdf", "word-to-pdf", "edit-pdf-pages"],
    "title": "CV (Özgeçmiş) PDF Dosya Boyutunu Küçültme",
    "metaTitle": "CV (Özgeçmiş) PDF Dosya Boyutunu Küçültme | DoctorConverter",
    "metaDescription": "CV PDF’inin boyutunu küçültmeyi dene ve sonucu başvuru sitesinin limitiyle karşılaştır.",
    "lead": "CV PDF’inin boyutunu küçültmeyi dene ve sonucu başvuru sitesinin limitiyle karşılaştır.",
    "queries": ["cv dosya boyutu küçültme", "cv pdf küçültme", "kariyer.net cv yükleme boyutu", "linkedin cv pdf boyutu", "özgeçmiş pdf mb düşürme", "cv 2 mb altına düşürme"],
    "sections": [
      {
        "heading": "CV’ler neden büyük olur?",
        "body": [
          "Yüksek çözünürlüklü vesikalık fotoğraf, Canva gibi araçlardan dışa aktarılan grafik öğeler ve gömülü yazı tipleri CV dosyasını büyütür.",
          "PDF sıkıştır aracı belge yapısını kayıpsız optimize eder. Word kaynağın varsa yeniden PDF oluşturup boyutları karşılaştırabilirsin."
        ]
      }
    ],
    "steps": [
      { "title": "CV’ni yükle", "text": "Özgeçmiş PDF’ini seç." },
      { "title": "Sıkıştır", "text": "Optimize et ve yeni boyutu gör." },
      { "title": "Başvur", "text": "Küçülen PDF’i başvuru sitesine yükle." }
    ],
    "tips": [
      "CV’ye eklediğin fotoğrafı yerleştirmeden önce küçült; 400×500 piksel yeterlidir.",
      "İki sayfayı geçen CV’lerde gereksiz sayfaları PDF sayfalarını düzenle ile çıkarabilirsin.",
      "Dosya adını “Ad-Soyad-CV.pdf” yapmak işe alım uzmanının işini kolaylaştırır."
    ],
    "faqs": [
      { "q": "CV tasarımı bozulur mu?", "a": "Araç görsellerin çözünürlüğünü düşürmez. Göndermeden önce düzeni, yazı tiplerini ve renkleri kontrol et." },
      { "q": "ATS (aday takip sistemi) okuyabilir mi?", "a": "Metin içeren PDF’ler ATS tarafından okunur; sıkıştırma metni değiştirmez." }
    ]
  },
  {
    "slug": "eski-cv-word-cevirme",
    "pair": "edit-old-resume-pdf-in-word",
    "group": "career",
    "tool": "pdf-to-word",
    "tools": ["pdf-to-word", "word-to-pdf"],
    "title": "Eski PDF CV’ni Word’e Çevirip Güncelleme",
    "metaTitle": "Eski PDF CV’ni Word’e Çevirip Güncelleme | DoctorConverter",
    "metaDescription": "Eski CV PDF’ini Word’e aktar; düzenini kontrol ederek deneyim ve bilgilerini güncelle.",
    "lead": "Eski CV PDF’ini Word’e aktar; düzenini kontrol ederek deneyim ve bilgilerini güncelle.",
    "queries": ["eski cv'yi worde çevirme", "pdf cv düzenleme", "özgeçmiş pdf word", "cv pdf word dönüştürme", "pdf özgeçmiş güncelleme", "canva cv word yapma"],
    "sections": [
      {
        "heading": "Güncelle, sonra yine PDF yap",
        "body": ["PDF → Word ile tablolu ve iki sütunlu CV düzenleri yeniden kurulur. Değişikliklerini yaptıktan sonra Word → PDF ile başvurulara hazır, düzgün bir PDF üret."]
      }
    ],
    "steps": [
      { "title": "PDF CV’yi çevir", "text": "Özgeçmiş PDF’ini Word’e dönüştür." },
      { "title": "Güncelle", "text": "Yeni deneyim ve becerilerini ekle." },
      { "title": "Tekrar PDF yap", "text": "Word → PDF ile son halini kaydet." }
    ],
    "tips": ["Tasarım araçlarında hazırlanmış CV’lerde metin kutuları Word’de ayrı kutu olarak gelebilir; içerikleri kutu içinde düzenle."],
    "faqs": [
      { "q": "Fotoğrafım korunur mu?", "a": "Evet, görseller Word belgesine aktarılır." },
      { "q": "Yazı tipim yoksa ne olur?", "a": "Bilgisayarında olmayan yazı tipleri benzer bir yazı tipiyle değiştirilebilir; dilersen Word’de tek tıkla değiştirebilirsin." }
    ]
  },
  {
    "slug": "cv-diploma-sertifika-tek-pdf",
    "pair": "combine-resume-and-cover-letter",
    "group": "career",
    "tool": "merge-pdf",
    "tools": ["merge-pdf", "images-to-pdf", "compress-pdf"],
    "title": "CV, Diploma ve Sertifikaları Tek PDF Yapma",
    "metaTitle": "CV, Diploma ve Sertifikaları Tek PDF Yapma | DoctorConverter",
    "metaDescription": "Başvuru tek dosya istiyorsa CV, ön yazı, diploma ve sertifikaları birleştir.",
    "lead": "Başvuru tek dosya istiyorsa CV, ön yazı, diploma ve sertifikaları birleştir.",
    "queries": ["cv ve sertifikaları tek dosya yapma", "diploma ve cv birleştirme", "transkript cv birleştirme", "ön yazı ve cv tek pdf", "iş başvurusu evrak birleştirme", "staj başvurusu pdf birleştirme"],
    "sections": [
      {
        "heading": "Doğru sıra ilk izlenimi belirler",
        "body": ["Önerilen sıra: ön yazı → CV → diploma → transkript → sertifikalar → referans mektupları. Telefonla çektiğin sertifika fotoğraflarını önce JPG → PDF ile çevir."]
      }
    ],
    "steps": [
      { "title": "Belgeleri seç", "text": "CV ve ek belgeleri yükle." },
      { "title": "Sırala", "text": "Ön yazı ve CV’yi en başa al." },
      { "title": "Birleştir", "text": "Tek PDF’i indir ve başvuruya ekle." }
    ],
    "tips": ["Birleştirilmiş dosya büyük olursa PDF sıkıştır ile küçült."],
    "faqs": [
      { "q": "Sertifika fotoğraflarını ekleyebilir miyim?", "a": "Önce JPG → PDF ile PDF’e çevir, sonra birleştir." },
      { "q": "Kaç belge eklenebilir?", "a": "Güncel dosya, boyut ve sayfa limitleri araç panelinde sunucudan alınarak gösterilir. İşleme başlamadan önce bu değerleri kontrol et." }
    ]
  },
  {
    "slug": "word-cv-pdf-yapma",
    "pair": "resume-word-to-pdf",
    "group": "career",
    "tool": "word-to-pdf",
    "tools": ["word-to-pdf", "compress-pdf", "merge-pdf"],
    "title": "Word CV’yi PDF’e Çevirme",
    "metaTitle": "Word CV’yi PDF’e Çevirme | DoctorConverter",
    "metaDescription": "DOCX CV’ni PDF’e dönüştür; göndermeden önce yazı tiplerini ve sayfa sonlarını kontrol et.",
    "lead": "DOCX CV’ni PDF’e dönüştür; göndermeden önce yazı tiplerini ve sayfa sonlarını kontrol et.",
    "queries": ["word cv pdf yapma", "özgeçmiş word pdf çevirme", "docx pdf çevirme", "cv pdf olarak kaydetme", "word pdf dönüştürme ücretsiz"],
    "sections": [
      {
        "heading": "Neden PDF gönderilmeli?",
        "body": ["DOCX dosyası alıcının bilgisayarındaki Word sürümüne ve yazı tiplerine göre farklı görünebilir. PDF sayfa düzenini sabitler; dönüştürülmüş dosyayı göndermeden önce kontrol et."]
      }
    ],
    "steps": [
      { "title": "DOCX’i yükle", "text": "CV Word dosyanı seç." },
      { "title": "PDF’e çevir", "text": "“PDF’e dönüştür”e bas." },
      { "title": "Kontrol et", "text": "PDF’i açıp sayfa sonlarını gözden geçir." }
    ],
    "tips": ["Makro içeren (.docm) veya dış bağlantılı belgeler desteklenmez; normal .docx olarak kaydet."],
    "faqs": [
      { "q": "Yazı tiplerim değişir mi?", "a": "Yaygın yazı tipleri korunur; nadir yazı tiplerinde benzer bir yazı tipi kullanılabilir." },
      { "q": ".doc dosyası olur mu?", "a": "Şu an .docx desteklenir; eski .doc dosyasını Word’de .docx olarak kaydedebilirsin." }
    ]
  },
  {
    "slug": "banka-ekstresi-excel-aktarma",
    "pair": "bank-statement-to-excel",
    "group": "finance",
    "tool": "pdf-to-excel",
    "tools": ["pdf-to-excel", "merge-pdf", "ocr"],
    "title": "Banka Hesap Ekstresini PDF’ten Excel’e Aktarma",
    "metaTitle": "Banka Hesap Ekstresini PDF’ten Excel’e Aktarma | DoctorConverter",
    "metaDescription": "Dijital banka ekstresindeki algılanabilen tabloları Excel’e aktar; tutarları kaynakla karşılaştır.",
    "lead": "Dijital banka ekstresindeki algılanabilen tabloları Excel’e aktar; tutarları kaynakla karşılaştır.",
    "queries": ["banka hesap ekstresi excel aktarma", "kredi kartı ekstresi excel", "pdf hesap dökümü excel", "banka ekstresi pdf excel çevirme", "hesap hareketleri excel", "pdf tablo excel aktarma"],
    "sections": [
      {
        "heading": "Hangi ekstreler çalışır?",
        "body": [
          "İnternet şubesinden indirilen, metni seçilebilen (dijital) PDF ekstrelerdeki tablolar algılanır ve her tablo ayrı bir Excel sayfasına aktarılır.",
          "Kağıttan taranmış ekstrelerde tablo algılanamaz; bu durumda OCR ile metni çıkarabilirsin. Hücre değerleri metin olarak aktarılır, formül çalıştırılmaz."
        ]
      },
      {
        "heading": "Excel’de sonraki adımlar",
        "body": ["Tutar sütununu sayıya çevirmek için Veri > Metni Sütunlara Dönüştür veya DEĞER() işlevini kullan. Ardından Özet Tablo ile kategori bazlı harcama raporu oluşturabilirsin."]
      }
    ],
    "steps": [
      { "title": "Ekstreyi yükle", "text": "Bankadan indirdiğin PDF ekstreyi seç (güncel sayfa limiti araç panelindedir)." },
      { "title": "Excel’e aktar", "text": "Tablolar algılanır ve XLSX dosyasına aktarılır." },
      { "title": "Analiz et", "text": "Excel’de filtrele, sırala, topla." }
    ],
    "tips": [
      "Aylık ekstreleri önce PDF birleştir ile tek dosya yapıp tek seferde aktarabilirsin (araç panelindeki sayfa sınırını kontrol et).",
      "Şifreli ekstreler işlenemez; bankanın şifresiz indirme seçeneğini kullan."
    ],
    "faqs": [
      { "q": "Taranmış ekstreler çalışır mı?", "a": "Hayır. Tablolar yalnızca dijital PDF’lerde algılanır; taranmış belgede metin için OCR kullan." }
    ]
  },
  {
    "slug": "pdf-fatura-excel-aktarma",
    "pair": "invoice-pdf-to-excel",
    "group": "finance",
    "tool": "pdf-to-excel",
    "tools": ["pdf-to-excel", "merge-pdf"],
    "title": "PDF Faturayı Excel’e Aktarma",
    "metaTitle": "PDF Faturayı Excel’e Aktarma | DoctorConverter",
    "metaDescription": "PDF faturadaki algılanabilen kalem tablolarını Excel’e aktar; miktar ve tutarları kontrol et.",
    "lead": "PDF faturadaki algılanabilen kalem tablolarını Excel’e aktar; miktar ve tutarları kontrol et.",
    "queries": ["pdf fatura excel yapma", "e-fatura excel aktarma", "fatura kalemleri excel", "pdf tablo excel çevirme", "e-arşiv fatura excel", "irsaliye pdf excel"],
    "sections": [
      {
        "heading": "Ne aktarılır?",
        "body": ["Algılanabilen kalem tabloları ve tablo şeklindeki toplam alanları aktarılır. Tablo dışındaki serbest metinler (adres, not) aktarılmaz."]
      }
    ],
    "steps": [
      { "title": "Faturayı yükle", "text": "PDF faturayı seç." },
      { "title": "Excel’e aktar", "text": "Kalem tabloları XLSX’e çıkarılır." },
      { "title": "Muhasebeleştir", "text": "Verileri muhasebe tablonla birleştir." }
    ],
    "tips": ["Birden çok faturayı önce PDF birleştir ile tek dosyada topla, sonra tek seferde aktar."],
    "faqs": [
      { "q": "Tablo bulunamadı hatası alıyorum", "a": "Fatura taranmış bir görüntüyse veya tablo çizgisiz serbest düzendeyse algılama başarısız olabilir." }
    ]
  },
  {
    "slug": "e-arsiv-faturalari-birlestirme",
    "pair": "merge-monthly-invoices",
    "group": "finance",
    "tool": "merge-pdf",
    "tools": ["merge-pdf", "compress-pdf", "pdf-to-excel"],
    "title": "Aylık e-Arşiv ve e-Faturaları Tek PDF’te Birleştirme",
    "metaTitle": "Aylık e-Arşiv ve e-Faturaları Tek PDF’te Birleştirme | DoctorConverter",
    "metaDescription": "Aylık faturaları ve makbuzları tarih sırasıyla tek PDF’te birleştir.",
    "lead": "Aylık faturaları ve makbuzları tarih sırasıyla tek PDF’te birleştir.",
    "queries": ["aylık e-arşiv faturaları birleştirme", "e-fatura pdf birleştirme", "muhasebeciye fatura gönderme", "fatura pdf birleştirme", "gider fişleri pdf", "fiş fotoğrafı pdf"],
    "sections": [
      {
        "heading": "Ay sonu düzeni",
        "body": ["Faturaları tarih sırasıyla birleştirmek muhasebecinin kontrolünü hızlandırır. Kağıt fişleri telefonla çekip JPG → PDF ile ekleyebilirsin."]
      }
    ],
    "steps": [
      { "title": "Faturaları seç", "text": "Ayın e-arşiv/e-fatura PDF’lerini yükle." },
      { "title": "Tarihe göre sırala", "text": "Dosyaları tarih sırasına koy." },
      { "title": "Birleştir", "text": "Tek PDF’i muhasebecine gönder." }
    ],
    "tips": ["Dosya sayısı limitini aşan faturaları gruplar halinde birleştir; toplam sayfa ve boyut sınırlarını da kontrol et."],
    "faqs": [
      { "q": "Fatura geçerliliği etkilenir mi?", "a": "Yeni bir PDF üretilir. Birleştirilmiş dosya, özgün dosyaların ve varsa elektronik imzalarının yerini tutmaz; orijinalleri sakla." }
    ]
  },
  {
    "slug": "pdf-sayfa-ayirma-dondurme",
    "pair": "extract-and-rotate-pdf-pages",
    "group": "office",
    "tool": "edit-pdf-pages",
    "tools": ["edit-pdf-pages", "merge-pdf", "compress-pdf"],
    "title": "PDF’ten Sayfa Ayırma, Silme ve Ters Sayfaları Döndürme",
    "metaTitle": "PDF’ten Sayfa Ayırma, Silme ve Ters Sayfaları Döndürme | DoctorConverter",
    "metaDescription": "İhtiyacın olan PDF sayfalarını seç, sırala veya döndür; sonucu yeni dosya olarak indir.",
    "lead": "İhtiyacın olan PDF sayfalarını seç, sırala veya döndür; sonucu yeni dosya olarak indir.",
    "queries": ["pdf sayfa ayırma", "pdften sayfa silme", "pdf sayfa döndürme", "ters taranmış pdf düzeltme", "pdf her sayfayı ayrı kaydetme", "pdf sayfa sırası değiştirme"],
    "sections": [
      {
        "heading": "Sayfa aralığı nasıl yazılır?",
        "body": [
          "“3, 1-2” yazarsan çıktı 3. sayfa, ardından 1 ve 2. sayfalardan oluşur; yazmadığın sayfalar çıkarılır. Döndürme seçeneği seçilen sayfalara uygulanır.",
          "“Sayfa başına PDF (ZIP)” seçeneği her sayfayı ayrı PDF dosyası olarak verir."
        ]
      }
    ],
    "steps": [
      { "title": "PDF’i yükle", "text": "Düzenlenecek belgeyi seç." },
      { "title": "Sayfaları yaz", "text": "Örn. 5-8 veya 3, 1-2; gerekiyorsa döndürmeyi seç." },
      { "title": "İndir", "text": "Tek PDF veya ZIP olarak al." }
    ],
    "tips": ["Ters taranmış birkaç sayfa için yalnızca o sayfaları seçip 180° döndür, sonra PDF birleştir ile asıl belgeye yerleştir."],
    "faqs": [
      { "q": "Orijinal dosyam değişir mi?", "a": "Hayır, yeni bir dosya üretilir." },
      { "q": "Kaç sayfalık belge işlenir?", "a": "Güncel dosya, boyut ve sayfa limitleri araç panelinde sunucudan alınarak gösterilir. İşleme başlamadan önce bu değerleri kontrol et." }
    ]
  },
  {
    "slug": "pdf-sayfalarini-jpg-yapma",
    "pair": "pdf-pages-to-jpg-for-social",
    "group": "office",
    "tool": "pdf-to-images",
    "tools": ["pdf-to-images", "edit-pdf-pages"],
    "title": "PDF Sayfalarını JPG veya PNG Görsele Çevirme",
    "metaTitle": "PDF Sayfalarını JPG veya PNG Görsele Çevirme | DoctorConverter",
    "metaDescription": "PDF sayfalarını JPG veya PNG olarak dışa aktar. Çoklu sayfalar ZIP olarak indirilir.",
    "lead": "PDF sayfalarını JPG veya PNG olarak dışa aktar. Çoklu sayfalar ZIP olarak indirilir.",
    "queries": ["pdf jpg yapma", "pdf sayfasını resme çevirme", "pdf instagram paylaşma", "pdf png çevirme", "menü pdf jpg", "sunum sayfası görsel yapma"],
    "sections": [
      {
        "heading": "JPG mi PNG mi?",
        "body": ["Fotoğraf ağırlıklı sayfalar için JPG daha küçük dosya verir. Metin, logo ve keskin çizgiler için PNG daha nettir. “Yüksek” kalite 150 DPI ile daha detaylı görsel üretir."]
      }
    ],
    "steps": [
      { "title": "PDF’i yükle", "text": "PDF’i seç; güncel sayfa limitini araç panelinden kontrol et." },
      { "title": "Biçim ve sayfa seç", "text": "JPG/PNG ve kaliteyi seç; istersen sayfa aralığı yaz." },
      { "title": "İndir", "text": "Tek görsel veya ZIP arşivini indir." }
    ],
    "tips": ["Instagram için yalnızca kapak sayfasını istiyorsan sayfa alanına “1” yaz."],
    "faqs": [
      { "q": "Kaç sayfa çevrilebilir?", "a": "Güncel dosya, boyut ve sayfa limitleri araç panelinde sunucudan alınarak gösterilir. İşleme başlamadan önce bu değerleri kontrol et." },
      { "q": "Çıktı neden ZIP?", "a": "Birden fazla sayfa seçtiğinde tüm görseller tek ZIP dosyasında indirilir." }
    ]
  },
  {
    "slug": "excel-teklif-bordro-pdf-yapma",
    "pair": "excel-quote-to-pdf",
    "group": "office",
    "tool": "excel-to-pdf",
    "tools": ["excel-to-pdf", "merge-pdf", "compress-pdf"],
    "title": "Excel Teklif, Fiyat Listesi ve Bordroyu PDF Yapma",
    "metaTitle": "Excel Teklif, Fiyat Listesi ve Bordroyu PDF Yapma | DoctorConverter",
    "metaDescription": "Excel teklifini, fiyat listesini veya bordronu PDF’e aktar; sütunları ve sayfa sonlarını kontrol et.",
    "lead": "Excel teklifini, fiyat listesini veya bordronu PDF’e aktar; sütunları ve sayfa sonlarını kontrol et.",
    "queries": ["excel pdf yapma", "excel teklif pdf gönderme", "fiyat listesi pdf", "bordro excel pdf", "puantaj pdf çevirme", "xlsx pdf dönüştürme"],
    "sections": [
      {
        "heading": "Hangi sayfalar aktarılır?",
        "body": ["Tüm çalışma sayfalarını veya yalnızca ilk sayfayı PDF’e aktarabilirsin. Sayfa düzeni Excel’deki yazdırma ayarlarına göre oluşur."]
      }
    ],
    "steps": [
      { "title": "XLSX’i yükle", "text": "Excel dosyanı seç." },
      { "title": "Sayfaları seç", "text": "Tüm sayfalar veya ilk sayfa." },
      { "title": "PDF’i gönder", "text": "Çıktıyı müşterine ilet." }
    ],
    "tips": ["Excel’de Sayfa Düzeni > Sığdır ayarını “1 sayfa genişliğinde” yapmak taşan sütunları önler."],
    "faqs": [
      { "q": "Makrolu dosya olur mu?", "a": "Makro, gömülü nesne veya dış bağlantı içeren dosyalar güvenlik nedeniyle reddedilir." }
    ]
  }
];
