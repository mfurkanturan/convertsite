# İçerik incelemesi — 25 Ekim 2026

Bu belge yapılan düzenlemenin envanteridir. Kalıcı editoryal kuralların kaynağı [CONTENT-SEO-CHECKLIST](CONTENT-SEO-CHECKLIST.md), motor desteğinin kaynağı [ENGINE-SUPPORT](ENGINE-SUPPORT.md) ve [ENGINE-AUDIT](ENGINE-AUDIT.md) olarak kalır.

## Ortak / özel içerik ayrımı

| Sınıf | Kaynak | İncelenen alanlar | Sonuç |
| --- | --- | --- | --- |
| Ortak arayüz | `i18n/ui.ts`, ortak Svelte bileşenleri | Başlık, dosya seçimi, durum, hata, saklama, silme, CTA, footer | Aynı işlev aynı terimle anlatılır; genel SSS yalnızca ana sayfada |
| Araca özgü | `lib/tools.ts`, `lib/tool-settings.ts`, `i18n/ui.ts` | 16 araç × TR/EN ad, açıklama, eylem, destek notu ve alan etiketleri | Gerçek ayarı olmayan araçlarda çıktı sütunu kaldırıldı; tüm eylemler araç kimliğine bağlı |
| Araca özgü SEO | `lib/tool-seo.ts`, `lib/tool-seo-en.ts` | 32 başlık/meta/lead/adım/sonuç kontrolü/SSS kaydı | Genel özellik ve fayda kartları kaldırıldı; görünür içerik ve schema aynı kayıttan |
| Sayfaya özgü rehber | `lib/seo/scenarios-*` | 20 TR + 21 EN lead/meta, işlem adımları, özel SSS ve TR ek içerikler | Görev dili, sonuç kontrolü, kalıcı limitler yerine panel referansı; anahtar kelime rozetleri kaldırıldı |
| Sayfaya özgü kurumsal | Hakkında, iletişim, güvenlik, gizlilik, kullanım şartları | Her iki dilde toplam 10 sayfa | Hak/sorumluluk anlamı korunarak sade dil; sahte sistem durumu ve kesin yanıt süresi kaldırıldı |
| Ortak gezinme | Header/footer, rehber hub’ları, ana sayfa | İki dilde gezinme, bölüm başlıkları, içerik yoğunluğu | Tekrar eden başlık vurguları ve dekoratif yüzeyler azaltıldı |

## Araç kayıtları

Aşağıdaki her satır iki dilde katalog, doğrudan araç rotası ve ana sayfadan açılan aynı çalışma alanını kapsar. Ayrı SEO kaydı yalnızca doğrudan rotada bulunur.

| Kimlik | Türkçe başlık | İngilizce başlık |
| --- | --- | --- |
| `pdf-to-word` | PDF → Word | PDF to Word |
| `word-to-pdf` | Word → PDF | Word to PDF |
| `merge-pdf` | PDF birleştir | Merge PDF |
| `compress-pdf` | PDF sıkıştır | Compress PDF |
| `pdf-to-excel` | PDF → Excel | PDF to Excel |
| `excel-to-pdf` | Excel → PDF | Excel to PDF |
| `pptx-to-pdf` | PowerPoint → PDF | PowerPoint to PDF |
| `pdf-to-images` | PDF → JPG / PNG | PDF to JPG / PNG |
| `images-to-pdf` | JPG/PNG → PDF | JPG / PNG to PDF |
| `edit-pdf-pages` | PDF sayfalarını düzenle | Edit PDF pages |
| `page-numbers` | Sayfa numarası ekle | Add page numbers |
| `watermark-pdf` | Filigran ekle | Add watermark |
| `protect-pdf` | PDF şifrele | Encrypt PDF |
| `unlock-pdf` | PDF parolasını kaldır | Remove PDF password |
| `ocr` | Metin çıkar (OCR) | Extract text (OCR) |
| `pdf-to-pdf-ocr` | PDF’yi aranabilir yap (OCR) | Make PDF searchable (OCR) |

## Rehber kayıtları

Slug’lar ve mevcut karşılıklı dil eşleşmeleri korunur. Eşdeğeri olmayan sayfalara sahte hreflang eklenmez.

| Dil | Slug | İncelenen başlık |
| --- | --- | --- |
| TR | `vize-final-notlari-birlestirme` | Vize ve Final Notlarını Tek PDF’te Birleştirme |
| TR | `ders-slayti-pdf-word-cevirme` | Ders Slaytlarını ve Notlarını PDF’ten Word’e Çevirme |
| TR | `odev-fotograflarini-pdf-yapma` | Ödev ve Sınav Kağıdı Fotoğraflarını PDF Yapma |
| TR | `tez-makale-pdf-word-cevirme` | Tez ve Makale PDF’ini Word’e Çevirme |
| TR | `uyap-pdf-boyutu-kucultme` | UYAP İçin PDF Dosya Boyutu Küçültme |
| TR | `dilekce-delil-listesi-birlestirme` | Dava Dilekçesi, Ekler ve Delil Listesini Tek PDF Yapma |
| TR | `taranmis-mahkeme-karari-metne-cevirme` | Taranmış Mahkeme Kararından ve Bilirkişi Raporundan Metin Kopyalama |
| TR | `vize-evraklari-tek-pdf-birlestirme` | Vize Başvuru Evraklarını Tek PDF’te Birleştirme |
| TR | `konsolosluk-dosya-boyutu-kucultme` | Konsolosluk ve Vize Sistemi İçin PDF Boyutu Küçültme |
| TR | `e-devlet-belgelerini-birlestirme` | e-Devlet Belgelerini Tek PDF’te Birleştirme |
| TR | `cv-pdf-boyutu-kucultme` | CV (Özgeçmiş) PDF Dosya Boyutunu Küçültme |
| TR | `eski-cv-word-cevirme` | Eski PDF CV’ni Word’e Çevirip Güncelleme |
| TR | `cv-diploma-sertifika-tek-pdf` | CV, Diploma ve Sertifikaları Tek PDF Yapma |
| TR | `word-cv-pdf-yapma` | Word CV’yi PDF’e Çevirme |
| TR | `banka-ekstresi-excel-aktarma` | Banka Hesap Ekstresini PDF’ten Excel’e Aktarma |
| TR | `pdf-fatura-excel-aktarma` | PDF Faturayı Excel’e Aktarma |
| TR | `e-arsiv-faturalari-birlestirme` | Aylık e-Arşiv ve e-Faturaları Tek PDF’te Birleştirme |
| TR | `pdf-sayfa-ayirma-dondurme` | PDF’ten Sayfa Ayırma, Silme ve Ters Sayfaları Döndürme |
| TR | `pdf-sayfalarini-jpg-yapma` | PDF Sayfalarını JPG veya PNG Görsele Çevirme |
| TR | `excel-teklif-bordro-pdf-yapma` | Excel Teklif, Fiyat Listesi ve Bordroyu PDF Yapma |
| EN | `combine-lecture-notes-for-exams` | Combine Lecture Slides and Notes into One PDF for Finals |
| EN | `lecture-slides-pdf-to-word` | Convert Lecture Slides and PDF Notes to Word |
| EN | `homework-photos-to-pdf` | Turn Homework Photos into One PDF |
| EN | `thesis-pdf-to-word` | Convert a Thesis or Research Paper PDF to Word |
| EN | `court-filing-pdf-compressor` | Compress PDFs for Court E-Filing Size Limits |
| EN | `merge-legal-exhibits` | Merge a Pleading and Its Exhibits into One PDF |
| EN | `scanned-document-to-text` | Copy Text from a Scanned PDF or Photo (OCR) |
| EN | `visa-application-documents-one-pdf` | Combine Visa Application Documents into One PDF |
| EN | `compress-pdf-for-visa-upload` | Compress PDFs for Visa and Government Upload Limits |
| EN | `compress-pdf-for-email` | Compress a PDF to Send by Email |
| EN | `compress-resume-under-2mb` | Reduce Your Resume PDF Size |
| EN | `edit-old-resume-pdf-in-word` | Edit an Old Resume PDF in Word |
| EN | `combine-resume-and-cover-letter` | Combine Your Resume, Cover Letter and Certificates into One PDF |
| EN | `resume-word-to-pdf` | Convert Your Word Resume to PDF |
| EN | `bank-statement-to-excel` | Convert a Bank Statement PDF to Excel |
| EN | `invoice-pdf-to-excel` | Convert Invoice PDFs to Excel |
| EN | `merge-monthly-invoices` | Merge Monthly Invoices and Receipts into One PDF |
| EN | `combine-tax-documents` | Combine Tax Documents into One PDF |
| EN | `extract-and-rotate-pdf-pages` | Extract, Delete and Rotate PDF Pages |
| EN | `pdf-pages-to-jpg-for-social` | Turn PDF Pages into JPG or PNG Images |
| EN | `excel-quote-to-pdf` | Convert an Excel Quote, Price List or Timesheet to PDF |

## İddia ve tutarlılık kararları

- RAM-only, sıfır iz, uçtan uca TLS ve tüm dönüşümlerde kayıpsız/birebir sonuç iddiası yoktur. Yapısal PDF optimizasyonu ile Word/Excel yerleşim dönüşümü ayrı anlatılır.
- PDF → Word seçilebilir metin gerektirir. OCR’nin TXT çıktısı otomatik olarak yerleşimi koruyan Word çıktısı gibi sunulmaz. PDF → Excel taranmış tablo desteği iddia etmez.
- Sıkıştırmanın sonucu dosyaya bağlıdır; kesin boyut veya “2 MB altına iner” sözü kaldırıldı. Eski slug uyumluluk için korunur.
- Güncel limit/saklama süresi yalnızca başarılı API yanıtıyla görünür. İstemcinin yerel seçim korumaları API politikasından ayrı kalır.
- Silme isteği erişimi kapatır; fiziksel temizliğin tamamlandığı iddia edilmez. Mevcut 2 dakikalık bekleme ve aktif kullanım ayrımı güvenlik/gizlilikte korunur.
- İletişim sayfası canlı sağlık verisi olmadan “aktif/operasyonel” rozeti veya kanıtlanmamış 24 saat yanıt garantisi göstermez.
- Yeni içerik dönüşüm motoru, API, schema migration veya erişim politikası değişikliği getirmez.

## Görsel inceleme ve doğrulama

Önce/sonra ekranları ve ayrıntılı yerel metin karşılaştırması ignored `.qa/slop/` altında tutulur. Bunlar motor kalitesi veya canlı hizmet sertifikası değildir. Kontrol kapsamı [TESTING](TESTING.md) içinde açıklanır.

## Bu düzenlemede çalıştırılan kontroller

25 Ekim 2026, yerel Windows ortamı:

| Kontrol | Sonuç |
| --- | --- |
| `pnpm check` | Import sınırları ve server/web tip kontrolleri geçti; 0 hata / 0 uyarı |
| `pnpm build` | Server kontrolü ve 105 statik web sayfasının derlenmesi geçti |
| Mevcut arayüz testleri, Chromium + mobil Chromium | 37 geçti, 1 mevcut mobil kısayol atlaması |
| Arayüz ve durum testleri, Firefox + masaüstü/mobil WebKit + Edge | 89 geçti, 23 platform/kapsam atlaması |
| İçerik/rota/genişlik ve görsel matris, Chromium + mobil Chromium | 14 geçti, 4 tekrar kapsamı atlaması |
| Analitik izin ve veri temizleme, Chromium + mobil Chromium | Sentetik anahtar ve yakalanan PostHog istekleriyle 14 geçti |
| Son footer düzeninden sonra gezinme ve görsel matris | 2 geçti |
| Son rehber-listesi düzeninden sonra 32 araç rotası | 2 geçti |

Ana koşular toplam 154 başarılı test çalıştırması ve 28 açık atlama içerir; son iki odaklı tekrar ayrıca 4 başarılı çalıştırmadır. Atlanan matrisler diğer projede tekrar edilmez; Windows WebKit klavye tercihleri ve mobil kısayol atlamaları mevcut test kurallarıdır. Fiziksel iOS cihaz veya ekran okuyucu onayı verilmez.

Görsel incelemede ana sayfa, ayarsız araç, ayarlı araç, iki dosyalı birleştirme, sayfa düzenleyici, OCR, rehber hub’ı ve kurumsal sayfa durumları incelendi. Banka ekstresi rehberindeki uzun Excel formülünün mobil taşması metin kırılmasıyla giderildi. Önce/sonra ve seçili sentetik dosya ekranları `.qa/slop/` altındadır.

Backend/motor kodu değişmediğinden Docker entegrasyon ve motor audit’i yeniden çalıştırılmadı. Sentetik API testleri gerçek dönüşüm, erişim izolasyonu veya fiziksel silme kanıtı olarak sunulmaz. Yerel önizleme normal analitik ayarlarıyla tekrar başlatıldı. Yayın yapılmadı.
