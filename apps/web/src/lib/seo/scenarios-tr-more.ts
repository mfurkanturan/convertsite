import type { Scenario } from './scenarios';

export const trMore: Record<string, Scenario['sections']> = {
  "uyap-pdf-boyutu-kucultme": [
    {
      "heading": "Sık yapılan hatalar",
      "body": [
        "En yaygın hata, Word’de hazırlanmış bir dilekçeyi önce yazdırıp sonra taramaktır. Bu yöntem hem dosyayı onlarca kat büyütür hem de metni aranamaz hale getirir. Dilekçeyi her zaman doğrudan PDF olarak kaydet; yalnızca ıslak imzalı sayfaları tara.",
        "İkinci yaygın hata, tüm ekleri tek bir dev PDF’te toplayıp sonra sınırla uğraşmaktır. Ekleri baştan mantıklı gruplara ayırmak (örneğin sözleşmeler, yazışmalar, faturalar) hem yükleme hem inceleme açısından daha düzenli bir dosya üretir.",
        "Üçüncü hata, dosyayı farklı araçlarla defalarca sıkıştırmaktır. Kayıpsız sıkıştırma ikinci kez uygulandığında ek kazanç sağlamaz; bunun yerine sayfa çıkarma veya yeniden tarama gibi farklı bir yönteme geç."
      ]
    },
    {
      "heading": "Taranmış belge mi, dijital PDF mi? Nasıl anlarsın?",
      "body": [
        "PDF’i aç ve bir kelimeyi fareyle seçmeyi dene. Metin seçilebiliyorsa belge dijitaldir ve sıkıştırma genellikle iyi sonuç verir. Hiçbir şey seçilemiyorsa belge taranmış görüntülerden oluşur; bu durumda bölme veya daha düşük çözünürlükte yeniden tarama daha etkilidir. Taranmış belgeden alıntı yapman gerekirse Metin çıkar (OCR) aracı metni düz yazıya dönüştürür."
      ]
    }
  ],
  "vize-final-notlari-birlestirme": [
    {
      "heading": "Hangi sırayla çalışmalı? Tekrar planı önerisi",
      "body": [
        "Sınavdan iki hafta önce birleştirilmiş dosyanı baştan sona bir kez hızlıca oku ve anlamadığın sayfaları not et. Bir hafta kala yalnızca işaretlediğin bölümlere ve çıkmış sorulara odaklan. Son iki günde ise çıkmış soruları süre tutarak çöz; dosyanın sonunda topladığın sorular burada en büyük yardımcın olur.",
        "Her çalışma oturumunun sonunda kaldığın sayfa numarasını not almak, tek dosyayla çalışmanın en büyük avantajıdır: bir sonraki oturumda doğrudan o sayfaya atlarsın."
      ]
    },
    {
      "heading": "Farklı kaynaklardan gelen PDF’ler",
      "body": [
        "Hocanın yüklediği slaytlar, kütüphaneden taranmış kitap bölümleri ve arkadaşlarının paylaştığı özetler farklı programlardan çıkmış olabilir. Birleştirme bu farklılıkları sorun etmez; her sayfa kendi boyutunu ve yönünü korur. Yalnızca şifreli PDF’ler birleştirilemez, bunların şifresiz kopyasını edinmen gerekir.",
        "Bir kaynağın yalnızca birkaç sayfası lazımsa, önce PDF sayfalarını düzenle ile o sayfaları ayır, sonra birleştir. Böylece dosyan gereksiz yere şişmez ve sınavda ihtiyacın olmayan sayfalar dikkatini dağıtmaz."
      ]
    }
  ],
  "cv-pdf-boyutu-kucultme": [
    {
      "heading": "Platformlara göre pratik öneriler",
      "body": [
        "LinkedIn “Kolay Başvuru” ve profil öne çıkanlar bölümü için tek sayfalık, metin ağırlıklı bir PDF kullanılabilir. Kariyer siteleri ve şirketlerin kendi başvuru formları genellikle tek dosya ister; bu durumda CV’yi küçültüp ön yazıyı formdaki metin alanına yazmak çoğu zaman daha etkilidir.",
        "E-postayla başvururken CV’yi ek olarak gönder ve e-posta gövdesine kısa bir ön yazı ekle. Büyük ekler bazı kurumsal e-posta sistemlerinde engellenebileceği için dosyanın küçük olması teslim edilme ihtimalini artırır."
      ]
    },
    {
      "heading": "Tasarımlı CV mi, sade CV mi?",
      "body": [
        "Grafik tasarım, mimarlık ve reklam gibi alanlarda görsel ağırlıklı bir CV avantaj sağlayabilir; bu durumda portfolyoyu ayrı bir bağlantı veya dosya olarak sunmak CV’nin hafif kalmasını sağlar. Finans, mühendislik ve kamu gibi alanlarda ise sade, iyi düzenlenmiş ve ATS uyumlu bir CV genellikle daha iyi performans gösterir.",
        "Hangisini seçersen seç, son dosyayı telefonda açıp kontrol et: işe alım uzmanlarının önemli bir kısmı başvuruları ilk kez mobilde görür."
      ]
    }
  ],
  "banka-ekstresi-excel-aktarma": [
    {
      "heading": "Serbest çalışanlar ve küçük işletmeler için kullanım",
      "body": [
        "Gelir ve giderlerini düzenli takip eden serbest çalışanlar, her ay ekstreyi Excel’e aktarıp gelirleri ve giderleri ayrı sütunlarda toplayarak basit bir nakit akışı tablosu oluşturabilir. Muhasebecine bu tabloyu ekstrelerle birlikte göndermek, dönem sonu işlemlerini hızlandırır ve gözden kaçan kalemleri azaltır.",
        "Birden fazla banka hesabın varsa her hesabın ekstresini ayrı sayfalara aktarıp bir özet sayfasında toplamları birleştirebilirsin."
      ]
    },
    {
      "heading": "Veri doğruluğunu kontrol etmek",
      "body": [
        "Aktarım sonrasında Excel’de tutar sütununun toplamını al ve ekstredeki dönem toplamıyla karşılaştır. Rakamlar uyuşuyorsa aktarım eksiksizdir. Sayfa geçişlerinde bölünen satırlar nadiren iki ayrı satır olarak gelebilir; açıklaması boş görünen satırları kontrol ederek bunları birleştirebilirsin.",
        "Hücreler metin olarak geldiği için Excel bazı hücrelerin köşesinde yeşil uyarı üçgeni gösterebilir; bu bir hata değil, verinin güvenlik amacıyla metin olarak aktarıldığının işaretidir."
      ]
    }
  ],
  "vize-evraklari-tek-pdf-birlestirme": [
    {
      "heading": "Öğrenci, çalışan ve emekli başvurularında farklar",
      "body": [
        "Öğrenciler genellikle öğrenci belgesi ve sponsor (aile) belgeleriyle başvurur; sponsorun banka dökümü ve çalışma belgesi de dosyaya eklenir. Çalışanlar işveren yazısı, maaş bordroları ve SGK hizmet dökümünü ekler. Emekliler ise emekli maaşı belgesi ve banka dökümüyle başvurur. Hangi grupta olursan ol, ek belgeleri ana evrakların arkasına mantıklı bir sırayla eklemek dosyayı okunur kılar."
      ]
    },
    {
      "heading": "Ret riskini azaltan dosya hazırlığı",
      "body": [
        "Eksik veya okunaksız belge, vize retlerinin ve ek belge taleplerinin en yaygın nedenlerindendir. Birleştirdikten sonra PDF’i baştan sona kaydırarak her sayfanın düz, eksiksiz ve okunaklı olduğunu kontrol et. Yabancı dilde istenen belgelerin tercümelerini aslının hemen arkasına yerleştirmek de memurun işini kolaylaştırır.",
        "Seyahat planındaki tarihlerin uçuş, otel ve sigorta belgelerinde tutarlı olduğundan emin ol; tutarsız tarihler ek soru veya ret sebebi olabilir."
      ]
    }
  ],
  "ders-slayti-pdf-word-cevirme": [
    {
      "heading": "Word’de çalışma düzeni",
      "body": [
        "Çevirdiğin dosyayı “ders-adi-hafta-3-not.docx” gibi açıklayıcı bir adla kaydet ve her hafta için ayrı belge tut. Dönem sonunda tüm haftalık özetleri tek bir belgede toplamak için Word’ün Ekle > Nesne > Dosyadan Metin özelliğini kullanabilirsin.",
        "Yorum özelliğini (Gözden Geçir > Yeni Açıklama) kullanarak anlamadığın yerleri işaretle; ders sonrası hocaya soracağın sorular böylece tek yerde toplanır."
      ]
    },
    {
      "heading": "Sık karşılaşılan durumlar",
      "body": [
        "Bazı slaytlarda metin yerine görsel olarak gömülü yazılar bulunur; bunlar Word’e görsel olarak gelir. Bu kısımların metnine ihtiyacın varsa ilgili sayfaları OCR aracından geçirebilirsin. Çok sayfalı tabloların sayfa geçişlerinde bölünmesi de normaldir; Word’de tabloyu birleştirerek düzeltebilirsin.",
        "Yazı tipleri bilgisayarında yüklü değilse benzer bir yazı tipiyle gösterilebilir. Bu içeriği etkilemez; dilersen tüm metni seçip tek bir yazı tipine çevirebilirsin."
      ]
    }
  ],
  "odev-fotograflarini-pdf-yapma": [
    {
      "heading": "Matematik ve çizim ödevleri için öneriler",
      "body": [
        "Kurşun kalemle yazılmış çözümler fotoğrafta soluk görünebilir. Mümkünse koyu kalem kullan veya önemli satırların üzerinden geç. Grafik ve geometri çizimlerinde sayfanın tamamını kadraja almak, ölçeğin ve etiketlerin okunmasını kolaylaştırır.",
        "Çok sayfalı ödevlerde her sayfanın üst köşesine sayfa numarası yazmak, fotoğrafları sıralarken hata yapmanı önler. Araçtaki ok tuşlarıyla sırayı kontrol ettikten sonra PDF’i oluştur."
      ]
    },
    {
      "heading": "Sınav kağıdı ve lab raporu teslimi",
      "body": [
        "Uzaktan sınavlarda süre kısıtlı olabilir; bu yüzden fotoğrafları çekmeden önce kağıtları sıraya koy ve tek seferde çek. Lab raporlarında ölçüm tabloları ve grafiklerin okunaklı olması önemlidir; bu sayfalar için “Görsele göre” seçeneği detayları daha büyük gösterir.",
        "Teslimden önce PDF’in boyutunu kontrol et. Bazı sistemler birkaç MB’ın üzerindeki dosyaları kabul etmez; gerekirse PDF sıkıştır aracını kullan."
      ]
    },
    {
      "heading": "Bilgisayardan taranmış görsellerle çalışmak",
      "body": [
        "Tarayıcıdan JPG veya PNG olarak kaydedilmiş sayfaları da aynı şekilde birleştirebilirsin. PNG dosyalar keskin çizgileri daha iyi korur, JPG dosyalar ise daha küçüktür. Her iki türü aynı PDF’te karıştırmak da mümkündür."
      ]
    }
  ],
  "tez-makale-pdf-word-cevirme": [
    {
      "heading": "Makale revizyonu ve hakem yorumları",
      "body": [
        "Dergiden gelen hakem yorumlarına yanıt verirken makalenin yalnızca PDF sürümü elindeyse, PDF → Word ile düzenlenebilir hale getirip değişiklikleri “Değişiklikleri İzle” açıkken yapabilirsin. Böylece editöre hangi bölümleri güncellediğini net biçimde gösteren bir revizyon dosyası hazırlamış olursun.",
        "İki sütunlu dergi formatındaki makaleleri çevirdikten sonra tek sütuna almak isteyebilirsin; Word’de Düzen > Sütunlar > Bir seçeneği bunu tek tıkla yapar."
      ]
    },
    {
      "heading": "Tez savunması ve sunuma hazırlık",
      "body": [
        "Savunma sunumu hazırlarken tezindeki tabloları ve şekilleri yeniden çizmek yerine Word’e çevrilmiş belgeden kopyalayabilirsin. Önemli bulgular tablosunu sunumuna doğrudan aktarmak hem zaman kazandırır hem de tez ile sunum arasındaki tutarlılığı korur.",
        "Son sürümü Word → PDF ile PDF’e dönüştür; göndermeden önce kenar boşluklarını ve sayfa sonlarını kontrol et."
      ]
    },
    {
      "heading": "Veri güvenliği ve yayımlanmamış çalışmalar",
      "body": [
        "Henüz yayımlanmamış çalışmalar hassas olabilir. Dosyalar yalnızca senin oturumundan erişilir, şifreli bağlantıyla aktarılır, eğitim verisi olarak kullanılmaz ve süre dolunca silinir. Dönüşüm bittiğinde “Dosyaları sil” ile erişimi hemen kapatabilirsin."
      ]
    }
  ],
  "dilekce-delil-listesi-birlestirme": [
    {
      "heading": "Arabuluculuk ve icra dosyaları",
      "body": [
        "Arabuluculuk başvurularında ve icra takiplerinde de aynı düzen işe yarar: başvuru dilekçesi veya takip talebi en başta, ardından vekaletname ve dayanak belgeler. Arabulucuya veya icra dairesine e-postayla gönderilecek dosyalarda tek PDF, eklerin kaybolmasını önler ve yazışma geçmişini sadeleştirir.",
        "Uzun soluklu dosyalarda her aşamanın belgelerini ayrı birleştirilmiş PDF’ler olarak saklamak, dosyanın geçmişini izlemeyi kolaylaştırır."
      ]
    },
    {
      "heading": "Büro içi standart oluşturmak",
      "body": [
        "Birden fazla avukat ve stajyerin çalıştığı bürolarda dosya adlandırma ve ek sıralama için basit bir standart belirlemek zaman kazandırır. Örneğin: “00” dilekçe, “01” vekaletname, “02” delil listesi, “03” ve sonrası ekler. Bu standart birleştirme aracında dosyaların doğru sırada listelenmesini de sağlar.",
        "Standart bir iş akışı; Word → PDF, ekleri tarama, sayfa düzenleme, birleştirme ve gerekirse sıkıştırma adımlarını kapsar. Her adım bu sitedeki ilgili araçla birkaç saniyede yapılabilir."
      ]
    },
    {
      "heading": "Son kontrol listesi",
      "body": [
        "Göndermeden önce şunları kontrol et: dilekçe ilk sayfada mı, tüm ekler delil listesindeki sırada mı, ters veya yan sayfa kaldı mı, imza sayfaları eksiksiz mi ve dosya boyutu portal sınırının altında mı? Bu beş soruya “evet” diyebiliyorsan dosyan hazırdır."
      ]
    }
  ],
  "taranmis-mahkeme-karari-metne-cevirme": [
    {
      "heading": "Hangi belgelerde işe yarar?",
      "body": [
        "Gerekçeli kararlar, bilirkişi raporları, tebligatlar, tutanaklar ve eski tarihli sözleşmeler genellikle taranmış olarak paylaşılır. Bu belgelerden alıntı yapmak, içtihat araştırması için not çıkarmak veya müvekkile özet hazırlamak gerektiğinde OCR, belgeyi elle yeniden yazmaktan çok daha hızlıdır.",
        "Fotoğrafı çekilmiş belgeler de desteklenir: telefonla çektiğin bir sayfanın JPG veya PNG görselini doğrudan yükleyebilirsin."
      ]
    },
    {
      "heading": "OCR çıktısını düzenlemek",
      "body": [
        "Düz metinde satır sonları taramadaki satırlara göre gelir. Word’de Bul ve Değiştir ile paragraf işaretlerini boşlukla değiştirerek satırları birleştirebilir, ardından gerçek paragraf aralarını yeniden ekleyebilirsin. Sayfalar arasında sayfa sonu işareti bulunur; bu sayede metinde hangi sayfadan alıntı yaptığını takip edebilirsin.",
        "Hukuki terimlerde ve özel isimlerde tanıma hataları olabilir; özellikle T.C. kimlik numarası, esas ve karar numaraları, tarih ve tutar gibi kritik bilgileri asıl belgeyle mutlaka karşılaştır."
      ]
    },
    {
      "heading": "Gizlilik ve mesleki sorumluluk",
      "body": [
        "Taranmış belgeler kişisel veri içerebilir. Dosyalar şifreli bağlantıyla aktarılır, yalnızca senin oturumundan erişilir ve süre dolunca otomatik silinir. Çıktıyı aldıktan sonra “Dosyaları sil” ile erişimi hemen kapatmanı öneririz."
      ]
    }
  ]
};
