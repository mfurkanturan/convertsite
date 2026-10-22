import type { Scenario } from './scenarios';

type Deep = Pick<Scenario, 'figures' | 'comparison'> & { sections: Scenario['sections']; tips?: string[]; faqs?: Scenario['faqs'] };

// En çok aranan 10 Türkçe senaryonun derinleştirilmiş içeriği; temel kayıtlara eklenir.
export const trDeep: Record<string, Deep> = {
  'uyap-pdf-boyutu-kucultme': {
    figures: [
      { src: 'compress-selected', alt: 'PDF sıkıştır aracında UYAP’a yüklenecek belgenin seçildiği ekran', caption: 'Belgeyi seç; dosya başına 10 MB ve 300 sayfa sınırı panelde görünür.' },
      { src: 'compress-result', alt: 'PDF sıkıştırma sonrası “Dosyan hazır” ekranı ve yeni dosya boyutu', caption: 'İşlem bitince yeni boyut gösterilir; “Sonucu indir” ile UYAP’a yükleyeceğin dosyayı al.' },
    ],
    comparison: {
      title: 'UYAP boyut sorununda hangi yöntem ne zaman işe yarar?',
      head: ['Yöntem', 'Ne zaman?', 'Kalite', 'Beklenen etki'],
      rows: [
        ['PDF sıkıştır (kayıpsız)', 'Word’den kaydedilmiş dilekçeler, karışık belgeler', 'Değişmez', 'Metin ağırlıklı dosyalarda belirgin küçülme'],
        ['Sayfaları bölmek', 'Büyük delil klasörleri, uzun bilirkişi raporları', 'Değişmez', 'Her parça sınırın altına iner'],
        ['Gereksiz sayfaları çıkarmak', 'Boş arka yüzler, tekrar eden kapaklar', 'Değişmez', 'Sayfa sayısı kadar küçülme'],
        ['Gri tonlamada yeniden taramak', 'Renkli taranmış evrak', 'Renk kaybolur, metin okunur kalır', 'Genellikle en büyük kazanç'],
        ['Word → PDF ile yeniden üretmek', 'Elinde Word aslı olan belgeler', 'En temiz sonuç', 'Taramaya göre çok daha küçük dosya'],
      ],
      note: 'Kayıpsız sıkıştırma içeriği değiştirmez; bu nedenle taranmış görüntülerden oluşan belgelerde etkisi sınırlıdır.',
    },
    sections: [
      { heading: 'Adım adım: UYAP’a yüklenmeyen dosyayı nasıl küçültürsün?', body: [
        'Önce dosyanın neden büyük olduğunu anla: Word’den “PDF olarak kaydet” ile üretilmiş bir dilekçe nadiren büyüktür. Asıl sorun genellikle telefonla çekilmiş veya renkli taranmış eklerdir. Belgeyi PDF sıkıştır aracına yükle ve sonuç ekranında yeni boyutu kontrol et.',
        'Boyut yeterince düşmediyse belge muhtemelen tamamen görüntülerden oluşuyordur. Bu durumda PDF sayfalarını düzenle aracında “1-40”, “41-80” gibi aralıklar yazarak belgeyi parçalara ayır. Her parça ayrı ek olarak yüklenebilir ve portal sınırının altında kalır.',
      ] },
      { heading: 'Avukatlar için pratik iş akışı', body: [
        'Dilekçeyi Word’de hazırla ve Word → PDF ile çevir. Taranmış ekleri ayrı ayrı sıkıştır. Ardından mahkemenin beklediği sırayla PDF birleştir aracında tek dosya yap veya portalın ek sayısı sınırına göre gruplar oluştur. Her adımın sonunda dosya boyutunu kontrol etmek, yükleme sırasında hata alma riskini azaltır.',
        'Dosya adlarını “Ek-1 Kira Sözleşmesi.pdf” gibi açıklayıcı vermek, hem senin hem kalemin dosyayı hızlı bulmasını sağlar. Birleştirmeden önce sayfa yönlerini kontrol et; ters taranmış sayfaları PDF sayfalarını düzenle aracındaki döndürme seçeneğiyle düzeltebilirsin.',
      ] },
      { heading: 'Büro tarayıcısını doğru ayarlamak', body: [
        'Boyut sorununu en baştan çözmenin yolu tarama ayarlarıdır. Metin belgeleri için 200–300 DPI çözünürlük ve gri tonlama genellikle yeterlidir; renkli tarama yalnızca renkli kaşe veya fotoğraf içeren sayfalarda gerekir. Çok sayfalı evrakı tek PDF olarak taramak yerine bölümler halinde taramak sonraki düzenlemeyi de kolaylaştırır.',
      ] },
      { heading: 'Gizlilik: müvekkil belgeleri nasıl korunur?', body: [
        'Yüklenen dosyalar yalnızca senin tarayıcı oturumundan erişilebilir, şifreli bağlantıyla aktarılır ve süre dolunca otomatik silinir. İşlem bittiğinde “Dosyaları sil” butonuna basarak erişimi hemen kapatabilirsin. Dosya içerikleri ve adları kayıt altına alınmaz.',
      ] },
    ],
    tips: [
      'İmza ve kaşe sayfalarını ayrıca kontrol et: kayıpsız sıkıştırma bunları değiştirmez ama yeniden tarama yaptıysan okunaklı olduklarından emin ol.',
      'Aynı belgeyi birden çok kez sıkıştırmak ek kazanç sağlamaz; ikinci denemede yöntemi değiştir (böl veya yeniden tara).',
    ],
    faqs: [
      { q: 'UYAP’ın dosya boyutu sınırı kaç MB?', a: 'Sınırlar portal ve işlem türüne göre değişebilir ve zamanla güncellenebilir. Güncel değeri yükleme ekranındaki uyarıdan kontrol et; bu rehberdeki yöntemler hangi sınır geçerli olursa olsun dosyayı küçültmeye yarar.' },
      { q: 'Sıkıştırılmış PDF’i UYAP kabul eder mi?', a: 'Evet. Sıkıştırma standart bir PDF üretir; içerik ve sayfa yapısı değişmez.' },
      { q: 'Birden çok eki tek seferde küçültebilir miyim?', a: 'PDF sıkıştır tek dosyayla çalışır. Ekleri önce PDF birleştir ile tek dosya yapıp sonra sıkıştırabilir veya her eki ayrı sıkıştırabilirsin.' },
    ],
  },
  'vize-final-notlari-birlestirme': {
    figures: [
      { src: 'merge-selected', alt: 'PDF birleştir aracında haftalık ders notları ve çıkmış sorular listelenmiş', caption: 'Haftalık notları ve çıkmış soruları ekle; ok tuşlarıyla sıralamayı düzenle.' },
      { src: 'merge-result', alt: 'Ders notları birleştirildikten sonra “Dosyan hazır” ekranı', caption: 'Birleştirme bitince tek PDF’i indir; dosyalar süre dolunca otomatik silinir.' },
    ],
    comparison: {
      title: 'Ders notlarını toplamanın yolları',
      head: ['Yöntem', 'Hız', 'Sıra kontrolü', 'Kurulum'],
      rows: [
        ['Online PDF birleştir', 'Saniyeler', 'Tam (ok tuşları)', 'Gerekmez'],
        ['Masaüstü PDF yazılımı', 'Hızlı', 'Tam', 'Genellikle ücretli lisans'],
        ['Notları tek tek yazdırmak', 'Yavaş', 'Elle', 'Yazıcı ve kağıt'],
        ['Telefonda ayrı dosyalarla çalışmak', 'Arama zor', 'Yok', 'Gerekmez'],
      ],
    },
    sections: [
      { heading: 'Sınav haftası için ideal not dosyası nasıl kurulur?', body: [
        'İyi bir sınav dosyası üç katmandan oluşur: haftalık ders slaytları, kendi tuttuğun notlar ve çıkmış sorular. Slaytları hafta sırasıyla, notlarını ilgili haftanın hemen arkasına, çıkmış soruları ise en sona koymak tekrar sırasında konudan soruya doğal bir akış sağlar.',
        'Birden çok ders için ayrı dosyalar oluştur. Tek bir dev dosya yerine ders başına bir PDF, telefonda ve tablette çok daha hızlı açılır ve arama sonuçları daha anlamlı olur.',
      ] },
      { heading: 'Tablette verimli çalışmak', body: [
        'Birleştirilmiş PDF’i GoodNotes, Notability veya Samsung Notes gibi uygulamalarda açarak slaytların üzerine el yazısıyla not alabilirsin. Tek dosya olduğu için tüm dönem boyunca aldığın notlar aynı yerde kalır ve sınav sabahı tek bir dosyayı açman yeter.',
        'Arama özelliği (Ctrl+F veya uygulamanın arama simgesi) birleştirilmiş dosyada çok daha değerlidir: bir kavramın geçtiği tüm haftaları tek aramada görürsün. Taranmış notlarda arama çalışmaz; bunlar için önce Metin çıkar (OCR) aracını kullan.',
      ] },
      { heading: 'Grup çalışması ve paylaşım', body: [
        'Ders arkadaşlarınla not paylaşırken tek bir PDF göndermek, WhatsApp grubunda onlarca dosyanın kaybolmasını önler. Dosya çok büyükse PDF sıkıştır aracıyla küçültüp e-posta veya mesajlaşma uygulamasının sınırına uygun hale getirebilirsin.',
      ] },
      { heading: 'Telefondan çekilen not fotoğrafları', body: [
        'Tahtanın veya defterin fotoğraflarını önce JPG → PDF aracıyla PDF’e çevir. Ardından bu PDF’i slaytlarla birlikte birleştir. Böylece fotoğraflar da ders dosyasının doğru haftasında yerini alır.',
      ] },
    ],
    tips: [
      'Her dönem başında ders başına bir klasör aç ve haftalık PDF’leri numaralı adlarla kaydet; sınav öncesi birleştirme bir dakika sürer.',
      'Kapak ve içindekiler sayfalarını PDF sayfalarını düzenle ile çıkararak dosyayı sadeleştir.',
    ],
    faqs: [
      { q: 'Farklı boyuttaki slaytlar birleşir mi?', a: 'Evet. Her sayfa kendi boyutunu korur; yatay slaytlar ile dikey A4 notlar aynı dosyada yer alabilir.' },
      { q: 'Birleştirilen dosyada yer imleri olur mu?', a: 'Kaynak dosyalardaki yer imleri her zaman aktarılmayabilir; aramayı ve sayfa numaralarını kullanmak en güvenilir yoldur.' },
      { q: '20’den fazla dosyam var, ne yapmalıyım?', a: 'Önce ilk 20 dosyayı birleştir, sonra kalanları ve ilk birleştirilmiş dosyayı tekrar birleştir. Toplam 300 sayfa sınırına dikkat et.' },
    ],
  },
  'cv-pdf-boyutu-kucultme': {
    figures: [
      { src: 'compress-selected', alt: 'PDF sıkıştır aracında CV dosyasının seçildiği ekran', caption: 'CV PDF’ini seç; sınırlar ve saklama süresi panelde görünür.' },
      { src: 'compress-result', alt: 'CV sıkıştırıldıktan sonra yeni dosya boyutunun gösterildiği ekran', caption: 'Sonuç ekranında yeni boyutu gör ve başvuru sitesine yükleyeceğin dosyayı indir.' },
    ],
    comparison: {
      title: 'CV dosyasını küçültme yöntemleri',
      head: ['Yöntem', 'Ne yapar?', 'Tasarım', 'Ne zaman seçilir?'],
      rows: [
        ['PDF sıkıştır', 'Belge yapısını kayıpsız optimize eder', 'Aynen kalır', 'İlk denenecek yöntem'],
        ['Word → PDF ile yeniden kaydetmek', 'Temiz, gereksiz verisiz PDF üretir', 'Word’deki gibi', 'Word aslı varsa'],
        ['Fotoğrafı küçültmek', 'Vesikalığın çözünürlüğünü düşürür', 'Fark edilmez', 'Fotoğraflı CV’lerde'],
        ['Sayfa çıkarmak', 'Gereksiz ek sayfaları kaldırır', 'Kısalır', 'CV 2 sayfayı aşıyorsa'],
      ],
    },
    sections: [
      { heading: 'Başvuru siteleri neden büyük CV’yi reddeder?', body: [
        'İş ilanı platformları ve şirketlerin aday takip sistemleri (ATS) her gün binlerce dosya işler ve sunucularını korumak için yükleme boyutunu sınırlar. Tasarım araçlarından dışa aktarılan, yüksek çözünürlüklü fotoğraf ve grafik içeren CV’ler bu sınırı kolayca aşar.',
        'Sınırın altında kalan, temiz bir PDF yalnızca yüklemeyi kolaylaştırmaz; işe alım uzmanının e-postasında da hızla açılır. Ağır bir dosya mobilde geç açılabilir ve ilk izlenimi olumsuz etkileyebilir.',
      ] },
      { heading: 'ATS dostu CV için dikkat edilecekler', body: [
        'Aday takip sistemleri CV’deki metni okuyarak anahtar kelime eşleştirmesi yapar. Bu yüzden CV’nin metin içeren bir PDF olması gerekir; tamamen görsel olarak dışa aktarılmış veya taranmış bir CV okunamayabilir. Sıkıştırma metni değiştirmez, ATS uyumluluğu korunur.',
        'Başlıkları standart tut (Deneyim, Eğitim, Beceriler), iki sütunlu karmaşık tasarımlarda bilgilerin okunma sırasını kontrol et ve dosya adına adını ekle: “Ad-Soyad-CV.pdf”.',
      ] },
      { heading: 'Fotoğraflı CV’de boyutu baştan düşürmek', body: [
        'CV’ye eklenecek vesikalık için 400×500 piksel yeterlidir. Telefonla çekilmiş 12 megapiksellik bir fotoğrafı doğrudan eklemek dosyayı megabaytlarca büyütür. Fotoğrafı eklemeden önce küçültmek, sıkıştırmadan çok daha büyük kazanç sağlar.',
      ] },
      { heading: 'CV’yi güncel tutmak', body: [
        'Elinde yalnızca PDF kalmışsa PDF → Word aracıyla düzenlenebilir hale getir, yeni deneyimlerini ekle ve Word → PDF ile yeniden kaydet. Bu akış hem güncel hem de küçük boyutlu bir CV üretir.',
      ] },
    ],
    tips: [
      'Aynı CV’nin hem Türkçe hem İngilizce sürümünü hazırla; uluslararası ilanlarda İngilizce sürümü kullan.',
      'Sertifika ve diplomaları CV dosyasına gömmek yerine istenirse ayrı ek olarak gönder.',
    ],
    faqs: [
      { q: 'CV’m kaç MB olmalı?', a: 'Platformların sınırları farklıdır; birkaç MB’ın altındaki bir PDF çoğu sitede sorunsuz yüklenir. Metin ağırlıklı bir CV genellikle 1 MB’ın çok altındadır.' },
      { q: 'Sıkıştırma sonrası CV bulanıklaşır mı?', a: 'Hayır. Kayıpsız optimizasyon kullanılır; yazılar ve fotoğraf aynı netlikte kalır.' },
      { q: 'Canva’dan indirdiğim CV’yi küçültebilir miyim?', a: 'Evet. Canva’dan PDF olarak indirdiğin dosyayı yükleyip sıkıştırabilirsin; yetmezse Canva’da “PDF Standart” seçeneğiyle yeniden indirmeyi de dene.' },
    ],
  },
  'banka-ekstresi-excel-aktarma': {
    figures: [
      { src: 'excel-selected', alt: 'PDF → Excel aracında banka hesap ekstresinin seçildiği ekran', caption: 'İnternet şubesinden indirdiğin ekstreyi seç (en fazla 50 sayfa).' },
      { src: 'excel-result', alt: 'Ekstre tablolarının Excel’e aktarıldığı sonuç ekranı', caption: 'Algılanan tablolar XLSX dosyasında ayrı sayfalar olarak gelir.' },
    ],
    comparison: {
      title: 'Ekstre verisini Excel’e almanın yolları',
      head: ['Yöntem', 'Hız', 'Hata riski', 'Not'],
      rows: [
        ['PDF → Excel aracı', 'Saniyeler', 'Düşük (dijital PDF’te)', 'Taranmış ekstrede çalışmaz'],
        ['Bankanın Excel/CSV dışa aktarımı', 'Hızlı', 'Çok düşük', 'Her banka sunmaz, dönem sınırlı olabilir'],
        ['Elle kopyala-yapıştır', 'Yavaş', 'Yüksek', 'Sütunlar kayabilir'],
        ['Elle yazmak', 'Çok yavaş', 'Çok yüksek', 'Sadece birkaç satır için'],
      ],
    },
    sections: [
      { heading: 'Ekstreyi Excel’e alınca neler yapabilirsin?', body: [
        'Aylık harcamalarını kategorilere ayırabilir, en çok harcama yaptığın yerleri görebilir ve bütçe planı yapabilirsin. Serbest çalışanlar ve küçük işletmeler için gelir-gider takibi, muhasebeciye düzenli rapor göndermek ve vergi döneminde belgeleri hazırlamak çok kolaylaşır.',
        'Kredi kartı ekstrelerinde taksitli işlemleri ayrı bir sütunla işaretleyip gelecek aylara yayılan ödemeleri takip edebilirsin.',
      ] },
      { heading: 'Excel’de tutar sütununu sayıya çevirmek', body: [
        'Aktarılan hücreler güvenlik için metin olarak gelir. Türk bankalarının ekstrelerinde tutarlar “1.234,56” biçimindedir. Tutar sütununu seçip Veri > Metni Sütunlara Dönüştür adımında ondalık ayırıcıyı virgül, binlik ayırıcıyı nokta olarak ayarlarsan değerler sayıya dönüşür.',
        'Alternatif olarak =SAYIYAÇEVİR(YERİNEKOY(YERİNEKOY(C2;".";"");",";".")) gibi bir formülle dönüşüm yapabilirsin; formül bölgesel ayarlarına göre küçük farklılık gösterebilir.',
      ] },
      { heading: 'Özet tablo ile harcama raporu', body: [
        'Açıklama sütunundan bir “Kategori” sütunu türet (Market, Fatura, Kira…), ardından Ekle > Özet Tablo ile kategorileri satıra, tutarı değere koy. Birkaç dakikada aylık harcama dağılımını gösteren bir rapor elde edersin.',
      ] },
      { heading: 'Birden çok ayı tek seferde işlemek', body: [
        'Aylık ekstreleri önce PDF birleştir ile tek dosyada topla, ardından PDF → Excel ile aktar. Her tablo ayrı sayfaya düşer; Excel’de sayfaları alt alta yapıştırarak yıllık tek bir tablo oluşturabilirsin. Toplam 50 sayfa sınırına dikkat et.',
      ] },
    ],
    tips: [
      'Önce bankanın internet şubesinde “Excel olarak indir” seçeneği var mı bak; varsa en temiz veri odur. Yoksa bu araç en hızlı alternatiftir.',
      'Ekstrelerde kişisel veriler bulunur; işlem bitince “Dosyaları sil” ile erişimi hemen kapat.',
    ],
    faqs: [
      { q: 'Hangi bankaların ekstreleri çalışır?', a: 'Banka adından bağımsız olarak, internet şubesinden indirilmiş ve metni seçilebilen PDF ekstrelerdeki tablolar algılanır. Tablo yapısı olmayan veya taranmış ekstrelerde sonuç alınamaz.' },
      { q: 'Tarih sütunu tarih olarak gelir mi?', a: 'Hücreler metin olarak aktarılır; Excel’de Metni Sütunlara Dönüştür ile tarih biçimine çevirebilirsin.' },
      { q: 'Kredi kartı ekstresi de olur mu?', a: 'Evet, işlem listesi tablo halinde olan kredi kartı ekstreleri de aktarılır.' },
    ],
  },
  'vize-evraklari-tek-pdf-birlestirme': {
    figures: [
      { src: 'merge-selected', alt: 'PDF birleştir aracında vize evraklarının sıralandığı ekran', caption: 'Evrakları konsolosluğun kontrol listesindeki sıraya göre diz.' },
      { src: 'merge-result', alt: 'Vize evrakları birleştirildikten sonra indirme ekranı', caption: 'Tek PDF’i indir; boyut sınırı varsa PDF sıkıştır ile küçült.' },
    ],
    comparison: {
      title: 'Vize başvurusunda evrak düzeni: tek dosya mı, kategori başına dosya mı?',
      head: ['Düzen', 'Ne zaman?', 'Avantaj', 'Dikkat'],
      rows: [
        ['Tek PDF', 'Sistem tek dosya istiyorsa veya e-postayla gönderiliyorsa', 'Kaybolan evrak olmaz', 'Boyut sınırını aşabilir'],
        ['Kategori başına PDF', 'Yükleme ekranı kategorilere ayrılmışsa', 'Her alan doğru belgeyi alır', 'Her kategoriyi ayrı birleştir'],
        ['Ayrı ayrı dosyalar', 'Sistem tek tek belge istiyorsa', 'Esnek', 'Dosya adları açıklayıcı olmalı'],
      ],
    },
    sections: [
      { heading: 'Schengen başvurusunda sık istenen belgeler', body: [
        'Ülkeye göre değişmekle birlikte genellikle şunlar istenir: başvuru formu, pasaportun kimlik sayfası ve önceki vizeler, biyometrik fotoğraf, seyahat sağlık sigortası, uçuş rezervasyonu, konaklama belgesi, son aylara ait banka hesap dökümü ve çalışma belgesi veya öğrenci belgesi. Güncel listeyi mutlaka başvuracağın ülkenin resmi kontrol listesinden doğrula.',
        'Kontrol listesini rehber alarak dosyalarını aynı sırayla numaralandırmak, birleştirme sırasında hata yapma ihtimalini ortadan kaldırır.',
      ] },
      { heading: 'Telefonla çekilen evrakları hazırlamak', body: [
        'Kağıt evrakları telefonla çekiyorsan düz bir zemin, gün ışığı ve tepeden çekim kullan. Fotoğrafları JPG → PDF aracında A4 sayfaya yerleştirip PDF’e çevir, ardından diğer PDF’lerle birleştir. Bu yöntem hem okunabilirliği hem de dosya boyutunu dengede tutar.',
      ] },
      { heading: 'Banka dökümü ve sigorta belgeleri', body: [
        'Banka dökümünde ıslak imza veya kaşe gerekiyorsa o sayfanın taranmış halinin de dosyada olduğundan emin ol. Sigorta poliçesinde seyahat tarihleri ve teminat tutarı ilk sayfada görünmelidir; poliçenin genel şartlar sayfaları isteniyorsa onları sona ekleyebilirsin.',
      ] },
      { heading: 'Kişisel verilerin güvenliği', body: [
        'Pasaport ve banka bilgileri hassas verilerdir. Dosyalar şifreli bağlantıyla aktarılır, yalnızca senin oturumundan erişilebilir ve süre dolunca otomatik silinir. İşini bitirdiğinde “Dosyaları sil” ile erişimi hemen kapatmanı öneririz.',
      ] },
    ],
    tips: [
      'Birleştirmeden önce her belgenin geçerlilik tarihini kontrol et; süresi dolmuş sigorta veya eski tarihli banka dökümü başvuruyu geciktirir.',
      'Randevu günü için birleştirilmiş PDF’in bir çıktısını da yanında bulundur.',
    ],
    faqs: [
      { q: 'VFS Global veya iDATA tek PDF kabul ediyor mu?', a: 'Başvuru merkezlerinin yükleme ekranları ülkeye ve döneme göre değişir. Ekran kategori istiyorsa her kategori için ayrı PDF hazırla; tek dosya istiyorsa tümünü birleştir.' },
      { q: 'Pasaportun tüm sayfalarını eklemeli miyim?', a: 'Genellikle kimlik sayfası ve önceki vizelerin bulunduğu sayfalar istenir. Kontrol listesinde yazanı esas al.' },
      { q: 'Birleştirdiğim dosya çok büyük oldu', a: 'PDF sıkıştır aracını dene; yetmezse renkli taranmış sayfaları gri tonlamada yeniden tara veya evrakları kategorilere böl.' },
    ],
  },
  'ders-slayti-pdf-word-cevirme': {
    figures: [
      { src: 'word-selected', alt: 'PDF → Word aracında ders notu PDF’inin seçildiği ekran', caption: 'Ders slaytını veya not PDF’ini seç; 50 sayfaya kadar desteklenir.' },
      { src: 'ocr-selected', alt: 'Metin çıkar (OCR) aracında belge dili seçimi', caption: 'Taranmış notlarda önce OCR ile metni çıkar; Türkçe dil paketi seçili gelir.' },
    ],
    comparison: {
      title: 'Ders notunu düzenlemenin yolları',
      head: ['Yöntem', 'Sonuç', 'Ne zaman?'],
      rows: [
        ['PDF → Word', 'Düzenlenebilir DOCX; tablo ve görseller korunur', 'Dijital (seçilebilir metinli) PDF’ler'],
        ['Metin çıkar (OCR)', 'Düz metin (TXT)', 'Fotokopiden taranmış notlar'],
        ['PDF üzerinde tablet notu', 'Orijinal PDF üstüne el yazısı', 'Sadece işaretleme yapılacaksa'],
        ['Elle yeniden yazmak', 'Tam kontrol', 'Çok kısa notlar'],
      ],
    },
    sections: [
      { heading: '“Kilitli” PDF ne demek?', body: [
        'Öğrencilerin “kilitli” dediği PDF’ler çoğunlukla üzerine yazılamayan, salt okunur belgelerdir. Bunlar PDF → Word ile düzenlenebilir hale gelir. Açılırken şifre isteyen (şifreli) PDF’ler ise farklıdır; bu dosyalar güvenlik nedeniyle işlenmez. Hocandan şifresiz sürümü istemek en doğru yoldur.',
      ] },
      { heading: 'Slayttan özet çıkarmak için öneriler', body: [
        'Word’e çevirdikten sonra Görünüm > Gezinti Bölmesi ile başlıklar arasında hızlıca dolaşabilirsin. Her slaytın başlığını ve en önemli iki maddesini yeni bir belgeye kopyalamak, bir saatlik dersi bir sayfalık özete dönüştürmenin en hızlı yoludur.',
        'Renkli vurgular kullan: tanımlar için sarı, formüller için yeşil, sınavda çıkma ihtimali yüksek konular için kırmızı. Word’de “Bul” ile tüm vurguları tek tek gezebilirsin.',
      ] },
      { heading: 'Sunum ağırlıklı slaytlarda ne beklemelisin?', body: [
        'Sunum programlarından PDF’e aktarılmış slaytlarda her slayt genellikle ayrı bir sayfa olur. Metin kutuları, görseller ve tablolar Word’e aktarılır; çok yoğun animasyonlu veya üst üste binen tasarımlarda bazı öğelerin yeri hafifçe kayabilir. İçerik korunur, yalnızca yerleşimi kontrol etmen gerekebilir.',
      ] },
      { heading: 'Notlarını ders arkadaşlarınla paylaşmak', body: [
        'Düzenlediğin özetleri Word → PDF ile tekrar PDF’e çevirerek herkesin aynı biçimde görmesini sağlayabilirsin. Birden çok dersin özetlerini PDF birleştir ile tek bir dönem dosyasında toplamak da mümkündür.',
      ] },
    ],
    tips: [
      'Uzun ders kitaplarını önce bölümlere ayırıp her bölümü ayrı çevirirsen hem sınırın altında kalırsın hem de dosyalar daha hızlı açılır.',
    ],
    faqs: [
      { q: 'Formüller ve semboller korunur mu?', a: 'Metin olarak yazılmış semboller korunur; görüntü olarak gömülü formüller görsel olarak gelir. Denklem yoğun sayfaları kontrol et.' },
      { q: 'Çeviri ne kadar sürer?', a: 'Birkaç sayfalık notlar genellikle saniyeler içinde, 50 sayfaya yakın belgeler biraz daha uzun sürede dönüştürülür.' },
    ],
  },
  'odev-fotograflarini-pdf-yapma': {
    figures: [
      { src: 'images-selected', alt: 'JPG → PDF aracında ödev sayfası fotoğraflarının sıralandığı ekran', caption: 'Fotoğrafları seç, sırala; sayfa boyutu ve yönünü ayarlardan belirle.' },
    ],
    comparison: {
      title: 'Ödevi dijital teslim etmenin yolları',
      head: ['Yöntem', 'Sonuç', 'Uygunluk'],
      rows: [
        ['JPG → PDF (bu araç)', 'Sıralı, tek PDF', 'Tüm ödev sistemleri'],
        ['Fotoğrafları tek tek yüklemek', 'Dağınık dosyalar', 'Sayfa karışma riski'],
        ['Tarayıcı uygulaması', 'Tek PDF', 'Uygulama kurulumu gerekir'],
        ['Fotokopi makinesinde taramak', 'Tek PDF', 'Makineye erişim gerekir'],
      ],
    },
    sections: [
      { heading: 'Okunaklı fotoğraf çekmenin 5 kuralı', body: [
        'Kağıdı koyu renkli düz bir zemine koy; kenarlar daha net ayrışır. Telefonu kağıda paralel tut, açılı çekim harfleri bozar. Gün ışığına yakın çalış, flaş parlama yapar. Gölgen kağıda düşmesin. Her sayfanın tamamının kadrajda olduğundan emin ol.',
        'Bu kurallara uyduğunda OCR gerektiren durumlarda bile metin çok daha doğru tanınır.',
      ] },
      { heading: 'Sayfa boyutu: A4 mü, görsele göre mi?', body: [
        'A4 seçeneği her fotoğrafı A4 sayfaya kenar boşluğuyla ortalar; çıktısı alınacak ödevler ve resmi teslimler için idealdir. “Görsele göre” seçeneği ise sayfayı fotoğrafın kendi oranında bırakır; ekranda okunacak çizimler ve diyagramlar için daha doğal görünür. Yatay çekilmiş sayfalar için sayfa yönünü yatay seç.',
      ] },
      { heading: 'Moodle, Teams ve Google Classroom’a yükleme', body: [
        'Ödev sistemleri genellikle tek dosya ve belirli bir boyut sınırı ister. Tek PDF hazırladıktan sonra dosya büyükse PDF sıkıştır ile küçült. Dosya adını “Ad-Soyad-Ödev3.pdf” şeklinde vermek öğretmeninin dosyanı kolay bulmasını sağlar.',
      ] },
    ],
    tips: [
      'Eksik sayfa teslim etmemek için PDF’i indirdikten sonra bir kez baştan sona kaydır.',
      'Birden çok derse ait ödevleri karıştırmamak için her ödevi ayrı PDF olarak hazırla.',
    ],
    faqs: [
      { q: 'Fotoğraflar sıkıştırılıp bulanıklaşır mı?', a: 'Görseller PDF’e yerleştirilir; telefon fotoğraflarının okunabilirliği korunur. Çok büyük dosyalarda sonradan PDF sıkıştır kullanabilirsin.' },
      { q: 'Ters duran fotoğraf ne olur?', a: 'Telefonun kaydettiği yön bilgisi kullanılır; yine de yan duran sayfa olursa PDF sayfalarını düzenle ile döndürebilirsin.' },
    ],
  },
  'tez-makale-pdf-word-cevirme': {
    figures: [
      { src: 'word-selected', alt: 'PDF → Word aracında tez bölümünün seçildiği ekran', caption: 'Tez bölümünü yükle; 50 sayfaya kadar tek seferde çevrilir.' },
    ],
    comparison: {
      title: 'Akademik PDF’ten Word’e geçiş: ne korunur, ne kontrol edilmeli?',
      head: ['Öğe', 'Sonuç', 'Kontrol önerisi'],
      rows: [
        ['Paragraf ve başlıklar', 'Korunur', 'Başlık stillerini Word’de yeniden uygula'],
        ['Tablolar', 'Düzenlenebilir Word tablosu', 'Birleştirilmiş hücreleri kontrol et'],
        ['Şekiller ve grafikler', 'Görsel olarak aktarılır', 'Konumlarını kontrol et'],
        ['İki sütunlu düzen', 'Sütun yapısı kurulur', 'Sütun geçişlerini kontrol et'],
        ['Denklemler', 'Görsel veya metin olarak', 'Gerekirse Word denklem aracıyla yeniden yaz'],
        ['Kaynakça', 'Düz metin', 'Kaynak yönetim programına yeniden aktar'],
      ],
    },
    sections: [
      { heading: 'Tezin Word dosyası kaybolduysa', body: [
        'Bilgisayar arızası, eski bir e-posta ekinde kalan son sürüm veya yalnızca kurum deposuna yüklenmiş PDF… Bu durumlarda tezi baştan yazmak yerine PDF’i Word’e çevirip düzenlemeye devam etmek haftalarca zaman kazandırır.',
      ] },
      { heading: 'Uzun tezleri bölümlere ayırmak', body: [
        'PDF → Word tek seferde 50 sayfaya kadar çalışır. Tezini PDF sayfalarını düzenle aracında bölüm sınırlarına göre ayır: Giriş ve Literatür (ör. 1-40), Yöntem (41-70), Bulgular ve Tartışma (71-120). Her bölümü ayrı çevirip Word’de Ekle > Nesne > Dosyadan Metin ile tek belgede birleştirebilirsin.',
        'Bölüm bazında çalışmak, danışmanından gelen düzeltmeleri de daha düzenli takip etmeni sağlar.',
      ] },
      { heading: 'Biçim kurallarına uyum', body: [
        'Enstitü yazım kılavuzları kenar boşlukları, yazı tipi, satır aralığı ve başlık numaralandırması için kesin kurallar koyar. Çeviri sonrasında Word’ün stil özelliğini kullanarak tüm başlıkları ve gövde metnini kılavuza uygun hale getirmek, tek tek biçimlendirmekten çok daha hızlıdır.',
      ] },
      { heading: 'Taranmış eski tezler', body: [
        'Kütüphane arşivlerinden alınan eski tezler genellikle taranmış görüntülerdir. Bunlarda PDF → Word metin üretmez; önce Metin çıkar (OCR) aracıyla metni al, sonra Word’e yapıştır.',
      ] },
    ],
    tips: [
      'Çevirdiğin bölümün kaynakçasını Zotero veya Mendeley gibi bir programa yeniden aktarırsan atıf biçimini tek tıkla değiştirebilirsin.',
    ],
    faqs: [
      { q: 'İntihal yazılımları dönüştürülmüş belgeyi farklı görür mü?', a: 'Dönüştürme metnin içeriğini değiştirmez; belge kendi metnin olarak kalır.' },
      { q: 'Dipnotlar sayfanın altında kalır mı?', a: 'Dipnot metinleri korunur; Word’ün otomatik dipnot alanına dönüşmeyebilir, gerekirse yeniden bağla.' },
    ],
  },
  'dilekce-delil-listesi-birlestirme': {
    figures: [
      { src: 'merge-legal', alt: 'PDF birleştir aracında dilekçe, delil listesi ve eklerin sıralandığı ekran', caption: 'Dilekçe, delil listesi ve ekleri mahkemenin beklediği sıraya diz.' },
      { src: 'merge-result', alt: 'Dilekçe ve ekleri birleştirildikten sonra indirme ekranı', caption: 'Tek PDF’i indir; UYAP sınırını aşarsa sıkıştır veya grupla.' },
    ],
    comparison: {
      title: 'Ek evrakı sunmanın yolları',
      head: ['Yöntem', 'Avantaj', 'Dezavantaj'],
      rows: [
        ['Tek PDF (dilekçe + ekler)', 'Hakim ve kalem için tek dosya, sıra sabit', 'Boyut sınırına takılabilir'],
        ['Gruplanmış PDF’ler', 'Sınırın altında kalır, düzen korunur', 'Birden çok yükleme gerekir'],
        ['Her ek ayrı dosya', 'Esnek', 'Ek sayısı sınırı ve karışıklık riski'],
      ],
    },
    sections: [
      { heading: 'Mahkeme ve icra dairelerinde beklenen sıra', body: [
        'Genel uygulamada dilekçe en başta yer alır; ardından vekaletname, delil listesi ve delil listesinde numaralandırılan ekler sırasıyla gelir. Ek numaraları ile dosyadaki sıranın birebir uyuşması, inceleme sırasında belge aramayı ortadan kaldırır.',
        'İcra takiplerinde takip talebi, dayanak belge ve vekaletname sırası benzer bir mantıkla kurulabilir.',
      ] },
      { heading: 'Word dilekçesini doğru PDF’e çevirmek', body: [
        'Dilekçeyi Word → PDF ile çevirmek, yazdırıp taramaya göre hem çok daha küçük hem de metni aranabilir bir dosya üretir. Islak imza gerekiyorsa yalnızca imza sayfasını tarayıp PDF sayfalarını düzenle ve PDF birleştir ile doğru konuma yerleştirebilirsin.',
      ] },
      { heading: 'Delil klasörünü düzenlemek', body: [
        'Birden çok taranmış belgeden oluşan delil klasörlerinde ters veya yan taranmış sayfalar sık görülür. Bunları PDF sayfalarını düzenle aracında döndürüp gereksiz boş sayfaları çıkardıktan sonra birleştirmek, hem dosyayı küçültür hem okumayı kolaylaştırır.',
      ] },
    ],
    tips: [
      'Birleştirmeden önce her ekin ilk sayfasına “Ek-1”, “Ek-2” ibaresi eklenmiş olması incelemeyi kolaylaştırır.',
      'Son dosyayı göndermeden önce sayfa sayısını delil listesindeki sayfa toplamıyla karşılaştır.',
    ],
    faqs: [
      { q: 'Birleştirilmiş dosyada sayfa numarası olur mu?', a: 'Araç sayfa numarası eklemez; kaynak belgelerdeki numaralar aynen kalır.' },
      { q: 'Müvekkil belgeleri sunucuda kalır mı?', a: 'Hayır. Dosyalar süre dolunca otomatik silinir ve “Dosyaları sil” ile erişim hemen kapanır.' },
    ],
  },
  'taranmis-mahkeme-karari-metne-cevirme': {
    figures: [
      { src: 'ocr-selected', alt: 'Metin çıkar (OCR) aracında taranmış karar ve dil seçimi', caption: 'Taranmış PDF’i seç ve belge dilini belirle; Türkçe varsayılandır.' },
    ],
    comparison: {
      title: 'Taranmış belgeden metin almanın yolları',
      head: ['Yöntem', 'Hız', 'Doğruluk', 'Not'],
      rows: [
        ['OCR (bu araç)', 'Saniyeler–dakikalar', 'Net taramada yüksek', 'Düz metin verir'],
        ['Elle yeniden yazmak', 'Çok yavaş', 'Dikkate bağlı', 'Uzun metinlerde hata riski'],
        ['PDF → Word', 'Hızlı', 'Taranmış belgede metin üretmez', 'Yalnızca dijital PDF için'],
      ],
    },
    sections: [
      { heading: 'OCR doğruluğunu artırmak', body: [
        'OCR’ın başarısı tarama kalitesine bağlıdır. 300 DPI, düz ve eğik olmayan sayfalar ve iyi kontrast en iyi sonucu verir. Fotokopinin fotokopisi gibi soluk belgelerde bazı karakterler yanlış tanınabilir; özellikle esas numaraları, tarihler ve para tutarlarını asıl belgeyle karşılaştır.',
        'Araç her sayfayı tanıma öncesinde otomatik kontrast iyileştirmesinden geçirir; yine de çok düşük çözünürlüklü görüntüler için yeniden tarama en etkili çözümdür.',
      ] },
      { heading: 'Uzun kararlarda yalnızca ilgili sayfalar', body: [
        'OCR tek seferde 20 sayfaya kadar çalışır. Gerekçeli kararın yalnızca hüküm veya gerekçe bölümüne ihtiyacın varsa, önce PDF sayfalarını düzenle ile bu sayfaları ayır. Bu hem süreyi kısaltır hem de çıktıyı daha kullanışlı hale getirir.',
      ] },
      { heading: 'Çıkan metni dilekçede kullanmak', body: [
        'OCR çıktısı düz metindir; sayfa düzeni ve biçimlendirme korunmaz. Alıntı yapacağın paragrafı kopyalayıp dilekçene yapıştır, ardından tırnak içine alarak kaynağını (mahkeme, esas ve karar numarası, tarih) belirt. Satır sonlarında oluşan gereksiz kırılmaları Word’de Bul ve Değiştir ile temizleyebilirsin.',
      ] },
    ],
    tips: [
      'Hem Türkçe hem İngilizce terim içeren belgelerde “Türkçe + İngilizce” seçeneği daha iyi sonuç verir.',
    ],
    faqs: [
      { q: 'Çıktı neden TXT?', a: 'OCR metni en evrensel biçimde verir; her programda açılır ve kolayca kopyalanır. Biçimli belge gerekiyorsa metni Word’e yapıştırarak düzenleyebilirsin.' },
      { q: 'Kaşe ve imzalar metne dönüşür mü?', a: 'Hayır, OCR yalnızca basılı yazıyı tanır; kaşe ve imzalar metne çevrilmez.' },
    ],
  },
};
