# Altı araç için motor iyileştirme ve agent devir planı

Durum: Çalışma devam ediyor. Aşağıdaki kök nedenler ve ilk puanlar 23 Ekim 2026 başlangıç snapshot'ıdır; uygulama durumu daha sonra eklenen bu bölümde izlenir.

## Güncel uygulama ve ölçüm durumu — 24 Ekim 2026

Bu tablo yalnızca bu çalışma sırasında doğrulanan değişiklikleri kapsar. İlk audit baseline'ı ve `.qa/engine-audit-baseline-122e845` değiştirilmedi. Ara ölçümler ayrı, ignored `.qa/engine-audit-*` klasörlerinde tutulur; altı araçlık çalışma tamamlanmadan `ENGINE-AUDIT.md` üretilmiş final rapor gibi güncellenmez.

| Araç / iş | Durum | Son kanıt ve açık işler |
|---|---|---|
| PDF → Word değerlendiricisi | Düzeltildi | Tekrarlı kelimeler sıra ile eşleşiyor; döndürülmüş sayfa koordinatları normalize ediliyor. 7 test geçti. |
| PDF → Word motoru | Kısmi | Güncel ayrı audit'te 8 senaryo × 3 tekrar; 7 çıktı senaryosundan 6'sı tüm kontrolleri geçti, taranmış örnek 3/3 doğru `NO_TEXT` reddi. `layout` 0/3: içerik doğruluğu %99,358 (<%99,5) ve en büyük kelime sapması 19,09 pt (>5 pt). `layout` sayfa 1'de kaynak bölüm başlıkları 122 pt, Writer çıktısı 127 pt aralıklarla; başlık→ilk satır ve bölüm sonu boşlukları ayrı ayrı yaklaşık 2,45–2,55 pt fazla. Kaynak font DejaVuSans (hhea ascent/descent 1901/−483 of 2048); çıktı Carlito (1536/−512 of 2048). Bunlar tanı ölçümüdür, düzeltme kanıtı değildir. Microsoft Word ve manuel örtüşme kapıları ölçülmedi. |
| PDF → Excel | İlk sentetik corpus kapıları geçti | Çizgisiz tablo için düzenli hizalı text fallback; gerçek bbox'tan yatay merge; 32767 karakter üstü sessiz kesme yerine açık limit. Birleşik fixture gerçek span olarak düzeltildi. 4/4 çıktı ve 4/4 beklenen NO_TABLES sınıfı, üçer tekrar geçti; gerçek belge corpus'u ve uzun hücre sınırı örneği henüz yok. |
| Şifreleme / parola kaldırma | Kısmi | Gizli parola JSONB'den çıkarıldı, geçici şifreli job secret kullanılıyor; job payload'ı process argv yerine stdin ile Python'a aktarılıyor, QPDF parola çağrıları stdin/password-file kullanıyor. API → worker entegrasyonu Unicode/özel karakter, yanlış/eksik parola ve terminal secret temizliğiyle test edildi; worker maintenance terminal/expiry secret satırlarını süpürür. API→engine iç HTTP body'de parola hâlâ taşınır (body loglama kapalıdır). Eski options JSONB parolaları için migration/operasyon, anahtar rotasyonu ve daha geniş retry/expiry yaşam döngüsü doğrulaması açık. |
| PowerPoint → PDF | Kısmi | PPTX yüklemesi, dosya türü migration'ı, Impress imajı, ilişki tabanlı slayt sayımı ve 3 slaytlık API → worker → indirme test edildi; gizli slayt dışarı aktarılmıyor. Güncel sentetik kalite audit'inde master/layout/theme ilişkileri geçerli yeni üreticiyle 8 senaryo × 3 tekrar geçti; kontroller metin/slayt sayısıyla sınırlı. Görsel/tablo/grafik/oran/sınır corpus'u ve PowerPoint referansı yok. |
| Filigran | Uygulandı; kapsam ölçümü eksik | Gömülü DejaVu fontu, görünür alana göre yerleşim, rotation/cropbox ve sığmayan glyph retleri var. Sentetik entegrasyon kontrolleri geçiyor; ayrı tam audit ve görsel fark kanıtı eksik. |
| Genel doğrulama | Geçti (24 Ekim) | Secret sweep cleanup testinden sonra `pnpm check` temiz; `pnpm test` 54/54 geçti. Worker testten sonra yeniden başlatıldı. |

`docs/ENGINE-AUDIT.md` başlangıç audit'inin generated raporudur ve elle güncellenmez. Yeni ölçümler 15 araç × 8 senaryo × 3 tekrar ve performans koşusu bütünlüğü tamamlanınca rapor script'iyle üretilmelidir.

## 1. Devralan agent için görev

PDF → Word, PDF → Excel, PDF şifreleme, PDF parola kaldırma, filigran ve PowerPoint → PDF araçlarını aşağıdaki sırayla iyileştir. Önce mevcut kanıtları koru, sonra küçük ve ayrı değişikliklerle ilerle. Her araçta doğrudan motor testine ek olarak gerçek API → kuyruk → worker → indirme akışını doğrula. Kullanıcı bu aşamada plan istedi; bu belgeyi hazırlamak motor değişikliği veya canlı dağıtım değildir.

Başlangıçta AGENTS.md ve docs/PRODUCT.md, ARCHITECTURE.md, MODULES.md, CODING-STANDARDS.md, FILE-PROCESSING.md, API.md, DATA-MODEL.md, TESTING.md ve DEPLOYMENT.md oku. Arayüz değişirse USER-FLOWS.md ve DESIGN-SYSTEM.md de okunmalı. Asıl ölçüm kaynağı [ENGINE-AUDIT](ENGINE-AUDIT.md); destek kaynağı [ENGINE-SUPPORT](ENGINE-SUPPORT.md).

Repository modüler monolith'tir. Dönüşüm HTTP isteğinde yapılmaz; domain'e motor/SQL/HTTP bağımlılığı eklenmez. Mevcut açık modül sözleşmeleri kullanılır. Araç başına handler korunur. Ortak doğrulama ve başlangıç dosyaları araçların bütün iş mantığını taşıyan koşul zincirlerine dönüştürülmez. Yeni mikroservis veya genel bir ikinci dönüşüm altyapısı kurma.

## 2. Kanıtların anlamı ve sürüm sınırı

| Araç | Ölçülen çıktı senaryoları | Doğru beklenen ret | Başlangıç sorunu |
|---|---:|---:|---|
| PDF → Word | 0/7 | 1/1 | 5 pt yerleşim kapısı hiçbir desteklenen örnekte geçmiyor; dönük sayfada başarılı görünen boş DOCX |
| PDF → Excel | 2/4 | 4/4 | Çizgisiz tabloda NO_TABLES; birleşik hücrede yapı/kritik sayı kaybı |
| PDF şifreleme | 0/8 | — | Şifrelenmiş ara çıktı üretilebiliyor, ortak çıktı kontrolü reddediyor |
| PDF parola kaldırma | 0/8 | — | Şifreli dosya yükleme/ortak giriş kontrolünde reddediliyor |
| Filigran | 4/8 | — | Türkçe karakterli dört örnekte görünür işaret doğru değil |
| PowerPoint → PDF | 0/8 | — | API'de 415, doğrudan motorda INVALID_DOCUMENT; Impress kurulu değil |

Her senaryo üç tekrar içerir. Bu oranlar genel kalite yüzdesi değildir. Beklenen ret, başarılı dönüşüm değildir. Word örneklerinin çoğunda metin korunmasına rağmen yerleşim kapısı geçmez. Genel tabloyu yükseltmek için eşik gevşetme, başarısız fixture'ı silme veya örneği sessizce destek dışına çıkarma.

İlk audit 15 aracı kapsar: 120 senaryo / 360 kalite çağrısı ve 360 performans çağrısı. Sonradan eklenen `pdf-to-pdf-ocr` 16. araçtır ve bu audit'te ölçülmedi. Ana motor snapshot'ı `122e845` commit'inde korunur; son OCR kelime hata ölçümü `9bb1b18` üzerindedir. Devralırken HEAD ve çalışma ağacını tekrar kontrol et; önceki testleri güncel kodun tamamına mal etme.

Ham kanıtlar ignored `.qa/engine-audit/` altında: results.jsonl, manifest.json, environment.json, performance.jsonl, workflow.json, lifecycle.json, supplement.json, candidates.json, regression.txt, ilk tekrar çıktıları ve görseller. Dosyalar başka makinede yoksa testleri yeniden üret; varmış gibi rapor yazma. Gerçek kullanıcı örnekleri `.qa/engine-real/` içinde yerel kalır; isimleri/içerikleri fixture, log veya Git'e girmez.

## 3. Çalışma sırası ve ortak hazırlık

1. Başlangıç snapshot'ı: çalışma ağacını incele; kullanıcıya ait değişiklikleri koru. Git revizyonu, motor kaynak hash'leri, Docker image ID, paket/font/native sürümlerini kaydet. Mevcut ölçümleri değiştirmeden ayrı bir karşılaştırma dizininde sakla.
2. Şifreleme ve parola kaldırmanın ortak doğrulama/gizli veri tasarımını çöz; bu iki araç güvenlik ve akış bakımından birlikte ele alınmalı.
3. PPTX kabulü ve imaj bileşenlerini düzelt; gerçek sunum referansını doğrula.
4. Filigranın font ve koordinat sorunlarını düzelt.
5. PDF → Word'de önce sessiz kaybı, ardından yerleşimi düzelt.
6. PDF → Excel'de çizgisiz tablo ve birleşik hücreyi düzelt.
7. Altı araçtan sonra bütün araçlarda ortak doğrulama/Office regresyonu ve yaşam döngüsü testleri çalıştır; destek belgesini yalnızca doğrulanan sınıflarla güncelle.

Audit script'leri sabit `.qa/engine-audit/` dizinine yazar. Önce baseline'ı korumadan çalıştırma. Karşılaştırma için mevcut runner'a doğrulanmış yerel çıktı dizini seçimi eklemek uygundur; ikinci runner altyapısı kurmak gerekmez. Her batch kendi sürüm/hash/seçenek metadata'sını taşımalı; eski ve yeni motor koşuları tek sürümmüş gibi birleştirilmemeli. Rapor üreticisi şu anda 120/360/360 bütünlük kontrolü yapıyor; yalnızca altı aracı koşunca bu şartı sessizce kaldırma. Ara raporu ayrı sun, finalde tam corpus çalıştır.

## 4. PDF şifreleme ve PDF parola kaldırma

### Doğrulanmış nedenler ve kod haritası

- `apps/server/engine/python/common.py`: `pdf_pages`, `qpdf --is-encrypted` için yalnızca 2 kodunu kabul ederek şifreli PDF'yi reddediyor. Bu davranış genel koruma politikasının parçası; bütün araçlar için kaldırılmamalı.
- `apps/server/engine/python/main.py`: her girdide seçenek/parola bağlamı olmadan `inspect_input` çağırıyor; bütün PDF çıktılarında yine parolasız `pdf_pages` kullanıyor. Şifreleme çıktısı burada reddediliyor; parola kaldırma handler'a ulaşamıyor.
- `apps/server/engine/python/validation.py`: PDF girişini `pdf_pages` ile denetliyor.
- `apps/server/engine/python/pdf_operations.py`: `protect_pdf` ve `unlock_pdf` QPDF çağrılarını yapıyor. Sentetik tanı testinde şifreli ara çıktı bilinen parolayla açılıyor; doğrudan QPDF decrypt başarılı. QPDF'yi değiştirmeden önce uygulama akışını düzelt.
- `apps/server/src/modules/files/application/upload-file.ts`: dosyayı ready yapmadan inspect ediyor. Yalnızca motor handler'ını düzeltmek gerçek yüklemeyi açmaz.
- `apps/server/src/modules/files/presentation/routes.ts`, `src/engine/http-app.ts`, `src/platform/engine-client.ts`: yükleme/inceleme bağlamının taşınacağı katmanlar.
- `apps/server/src/modules/jobs/infrastructure/repository.ts`: create sırasında options doğrudan JSONB'ye yazılıyor. `packages/contracts/src/tools.ts` içindeki `password` burada düz metin kalıyor.

### Uygulama adımları

1. PDF inceleme sonucunu yalnızca sayfa sayısından ibaret bırakma: şifreleme bilgisi, doğrulanabilir yapı ve parola gereksinimi ayrı kavramlar olmalı. Ortak düşük seviyeli inceleme yeniden kullanılabilir; hangi aracın şifreli dosyayı kabul ettiği application politikasında kalmalı.
2. Önerilen yükleme akışı: yalnızca parola kaldırma akışında isteğe bağlı parola ile izole inceleme. Parola bu istekte kalıcı metadata'ya yazılmaz. Doğru parola ile yapı, sayfa ve kaynak sınırları doğrulanmadan dosya ready yapılmaz. Genel yükleme/parolasız inspect davranışı ve diğer araçların şifreli girdi reddi korunur. Bunun için amaç bağlamı/API sözleşmesi ve istemci akışı değişebilir; API ve erişim politikası birlikte belgelenmeli.
3. Alternatif olan “şifreli dosyayı doğrulamadan ready yap, sonra dene” uygulanmamalı. Karantina/pending modeli seçilecekse ayrı durum, erişim ve quota yaşam döngüsü gerekir; sırf 422'yi aşmak için doğrulamayı atlama. Şifreli içerikte mevcut zararlı içerik taramasının neyi kontrol edebildiğini ayrıca belirle; geçemediği kontrolü geçti sayma.
4. Şifreleme çıktısını bilinen parola ile izole açıp yapı/sayfa sayısını doğrula; ayrıca gerçekten şifreli olduğunu bağımsız QPDF ile denetle. Parola kaldırma çıktısını parolasız açıp şifresiz olduğunu doğrula. Yanlış parola ile bozuk PDF aynı hata kategorisine otomatik düşmemeli.
5. Job seçeneklerinden parolayı kalıcı JSONB yazımından önce ayır. Worker tekrar denemeleri için gerekiyorsa mevcut altyapı içinde TTL'li, erişimi dar, şifreli gizli veri referansı kullan; şifreleme anahtarı DB'den ayrı yapılandırılır. Gizli veri bağlantısını jobs açık sözleşmesi taşır; başka modül tablosuna doğrudan erişim yoktur. Yalnızca RAM'de tutup restart/retry'ı bozma.
6. Kuyruğa yalnızca job kimliği; yanıtlara/loglara/telemetriye parola veya şifreli gizli veri gövdesi koyma. İdempotency/request hash'inde parolayı tahmin etmeye elverişli düz veya salt'sız türev bırakma; gerekiyorsa anahtarlı bir yöntem ve anahtar yaşam döngüsü tasarla.
7. Mevcut QPDF parolaları komut argümanlarında görünüyor; ana Python payload'ı da argv ile taşınıyor. Gizli verinin HTTP → worker → motor → native süreç hattını incele. Kurulu sürümün resmi olarak desteklediği stdin/korumalı geçici dosya kanalı seçilmeli; shell komutu ve kullanıcı kontrollü executable oluşturulmamalı. Geçici dosya seçilirse dar izin, finally temizliği, restart/expiry süpürmesi gerekir.
8. Tamamlama, başarısızlık, iptal, expiry ve kalıcı vazgeçmede gizli veriyi temizle; retry sürerken erken temizleme yapma. Eski JSONB parolalarının giderilmesi için ayrı migration/operasyon planı hazırla; mevcut kuyruktaki işleri ve backup'ları hesaba kat. Gerçek parolaları teşhis amacıyla sorgulama veya çıktı verme.
9. Kullanıcıya anlaşılır parola hatası için mevcut hata sözleşmesini kontrol et; yeni enum gerekiyorsa contracts/API/UI çevirilerini birlikte güncelle. Stack trace, QPDF stderr veya gizli veri içeren mesaj döndürme.

### Kabul testleri

- Her araçta mevcut sekiz örnek × üç tekrar; bağımsız QPDF doğrulaması, sayfa sayısı ve render/text içerik koruması.
- Doğru/yanlış/boş parola; Türkçe ve özel karakterli parola; bozuk ve sınır aşan şifreli girdi. Sahip parolası/kullanıcı parolası ve izin davranışı açıkça belirlenip test edilmeli; hak/izin garantisi uydurulmamalı.
- Şifreli dosyaya diğer araçlardan erişim reddi; başka oturumun dosyasına/gizli verisine erişim reddi.
- API yükleme → job → gerçek worker → indirme; restart/retry, iptal, expiry, fiziksel dosya ve gizli veri temizliği.
- Testin bildiği sentetik parola literal'i job JSON, API yanıtı, kuyruk payload'ı ve yakalanan loglarda bulunmamalı. Testlerde gerçek parola kullanılmaz.

## 5. PowerPoint → PDF

### Nedenler ve kod haritası

- `packages/contracts/src/limits.ts` ve `tools.ts` PPTX'i tanıyor; disk imzasında da ZIP kontrolü var.
- `apps/server/src/modules/files/presentation/routes.ts`: yerel tür izin listesi `pdf/docx/xlsx/jpg/png`; PPTX yok. Gerçek yükleme 415 UNSUPPORTED_FORMAT veriyor.
- `infra/engine.Dockerfile`: mevcut ölçüm imajında LibreOffice Impress yok. Render'ın gerçek build Dockerfile'ı ve compose build tanımı ayrıca bulunup güncellenmeli; tek Dockerfile'ın bütün ortamları kapsadığı varsayılmamalı.
- `apps/server/engine/python/office_conversions.py`: ortak `office_to_pdf`, çıktı üretilmeyince INVALID_DOCUMENT dönüyor. Bu hata tek başına dosyanın bozuk olduğunu kanıtlamaz.
- `validation.py::inspect_office`: PPTX gerekli dosyalarını/güvenlik sınırlarını inceliyor; fakat Office için 0 sayfa döndürüyor. PPTX slayt sayısı limitinin gerçek girişte uygulanması ayrıca ele alınmalı.

### Çözüm ve kabul

1. Route'ta ikinci bir tür listesi sürdürmek yerine mevcut shared contracts üzerinden doğrulanmış kabul politikasını kullan. MIME, uzantı, ZIP imzası ve içerik yapısı birlikte doğrulanmalı; tüm ZIP'leri PPTX kabul etme.
2. Gerçek yerel ve dağıtım imajına gerekli Impress paketini ekle; fontları sabitle ve imajı yeniden build et. Startup/readiness veya izole smoke testi motor yeteneği yokken destek varmış gibi görünmesini önlemeli.
3. Dosyadaki rastgele slide XML sayısını saymak yerine presentation ilişkileriyle gerçek slayt sırasını/sayısını doğrula. Gizli slaytların çıktı politikası belirlenmeli ve belgelendirilmeli. Girdi/çıktı limitleri worker'da korunmalı.
4. Sentetik PPTX üreticisinin gerçekten geçerli sunum oluşturduğunu bağımsız LibreOffice açılışıyla doğrula. Eksik Impress ölçülen bir neden; bütün INVALID_DOCUMENT sonuçlarının tek nedeni olduğu henüz kanıtlanmadı.
5. En az sekiz geçerli örnek: Türkçe font, çoklu slayt/sıra, görsel, tablo, şekil/grafik, farklı oranlar, gizli slayt, sınıra yakın sunum. Statik PDF'de animasyon/video ve makrolar için kapsam açık olsun; aktif içerik çalıştırılmaz.
6. Üç tekrar, doğru slayt/sayfa sayısı, metin ve görünür nesneler, kırpılma ve font kontrolü; LibreOffice referansı ve imkan varsa PowerPoint referansı ayrı belirtilmeli. Word/Excel → PDF ortak handler regresyonları da geçmeli.
7. Bozuk ZIP, dış bağlantı, makro/embedded payload, ZIP bombası ve limit aşımı retlerini koru. API'den gerçek PPTX yükleme → worker → indirme akışı tamamlanmadan destek açıldı denmemeli.

## 6. Filigran

### Nedenler

`apps/server/engine/python/pdf_operations.py::watermark_pdf` yerleşik `helv` kullanıyor; Türkçe glyph'ler korunmuyor. Sabit 38/44 pt, kaba başlangıç noktası ve genel exception fallback'i var. Fallback'in `insert_textbox` dönüş değeri kontrol edilmiyor; metin sığmasa bile dosya başarılı dönebilir. Ana ölçümde Türkçe dört örnek başarısız; bağımsız görünür metin/yerleşim ek kontrolü de bunu destekliyor. Döndürülmüş sayfa koordinatları ve uzun metin ayrıca test edilmeli; bunlar henüz tüm varyantlarıyla doğrulanmış değil.

### Çözüm ve kabul

1. İmajda lisansı uygun, Türkçe glyph kapsamı doğrulanmış fontu açık bir path ile kullan ve çıktıya göm. Aynı imajda bulunan fontu tercih et; örtük fallback'e güvenme. Desteklenmeyen glyph için sessiz bozulma yerine tanımlı davranış.
2. Filigran çizimini PDF şifreleme/sayfa işlemleri dosyasını büyütmeden sorumluluğuna ait küçük bir modüle ayır. Handler kaydını koru.
3. CropBox/MediaBox ve rotation/derotation dönüşümlerini dikkate al. Metin genişliği, döndürülmüş bounding box, güvenli kenar payı ve yazı boyutu birlikte hesaplanmalı. Uzun metin için küçültme/satır kırma sınırı deterministik olsun; sığmıyorsa açık hata.
4. Geniş `except Exception` ile kontrolsüz ikinci çizim yerine beklenen hata/sığmama durumunu yönet; font kaynağı ve PDF belge handle'ları finally/context manager ile kapanmalı.
5. Türkçe `İ ı Ş ş Ğ ğ Ü ü Ö ö Ç ç`, İngilizce, uzun metin, küçük sayfa, yatay sayfa, 90/180/270° rotation ve cropbox örnekleri. Metin boşluğu/uzunluk/denetim karakteri seçenek doğrulaması korunmalı.
6. Mevcut sekiz örnek × üç tekrar; bağımsız metin çıkarımı ve görünür render ile yazının tamamı, konumu, sayfa kapsamı, taşmama ve kaynak içeriğin okunabilirliği kontrol edilmeli. Sadece PDF metin katmanında var olması geçer sayılmaz.

## 7. PDF → Word

### Nedenler ve mevcut yetenek

- `apps/server/engine/python/word_conversion.py`: PyMuPDF ile kaynakta herhangi bir metin olup olmadığına bakıyor; pdf2docx dönüşümünden sonra sayfa bazında anlamlı/editable çıktı kaybını denetlemiyor. Bu yüzden dönük metinli kaynak boş DOCX üretebiliyor.
- Aynı dosyada `remove_external_links`; `word_layout.py` içinde explicit column break ve anchored image düzeltmeleri var. Bunları körlemesine kaldırma: dış ilişkiler ve Writer uyumluluğu için mevcut regresyonların nedeni bunlar.
- Basit örneklerde normalize metin %100 olabiliyor, fakat yaklaşık 9 pt ve üzerinde yerleşim farkları var. Tablo örneğinde en büyük konum farkı yaklaşık 76,7 pt; iki sütun örneği metin sırası kapısını da geçmiyor. Bunlar ayrı hatalar.
- Audit koordinat ölçümü kelime eşleştirmesine dayanıyor. Tekrarlı kelimelerde yanlış eşleşme riskini kontrol et; test değerlendiricisindeki hata kanıtlanırsa önce onu düzelt, eşik düşürerek motoru geçirme.

### Çözüm adımları

1. En küçük dönük sayfa fixture'ıyla kaybın pdf2docx okuma, sayfa rotation, içerik matrisi, OOXML veya LO render aşamasından hangisinde olduğunu izole et. PDF `/Rotate` ve içerik akışındaki dönüş ayrı testler olsun.
2. Gerekirse çalışma kopyasında sayfa koordinatlarını normalize et; metin vektörlerini ve görselleri koru. Sayfayı resme çevirip DOCX'e koymak düzenlenebilirlik şartını karşılamaz. Normalize dönüşümü anchored image koordinatlarıyla tutarlı olmalı.
3. Çıktıda kaynak metinli sayfanın sessizce kaybolmasını engelleyen sınırlandırılmış kontrol ekle. Sabit global kelime sayısı kıyasını kusursuzlük kanıtı sayma; boş çıktı/kritik kayıp açık hata olmalı. İşlem başarı yanıtı yalnızca dosya oluştu diye verilmemeli.
4. Basit sayfada font ascent/baseline, paragraf öncesi/sonrası boşluk, satır aralığı, bölüm marjı ve OOXML birim dönüşümlerini tek tek ölç. Kaynak ve çıktıdan bbox eşleştirmesi yap; tekrarlı kelimeleri sayfa/sıra/bağlamla ayır.
5. Tablo ve sütun akışını basit sayfadan ayrı düzelt. Mantıksal okuma sırası kaynaktaki geometrik satır sırasıyla aynı olmayabilir; sentetik fixture'ın ilan edilmiş beklenen okuma sırası esas alınmalı.
6. Kaynakta farklı sayfa boyutları, fontlar, görseller ve mixed text/scanned sayfa davranışını açıkla. Taranmış PDF için bu işte otomatik OCR veya aranabilir PDF handler'ını DOCX dönüşümüymüş gibi kullanma; mevcut NO_TEXT sınırı korunur.
7. Mevcut motorla hedefler sağlanamıyorsa aynı sentetik corpus üzerinde yerel/açık kaynak aday için ayrı karar kaydı hazırla. Lisans, bağımlılık, bakım ve maliyeti resmi kaynaklardan o tarihte kontrol et. Ölçülmemiş alternatifin daha iyi olduğunu iddia etme; üretime sessiz motor değişimi yapma.

### Kabul testleri

- Mevcut yedi çıktı örneği + taranmış negatif örnek, üçer tekrar; ayrıca 90/180/270° ve karışık sayfa yönleri regresyonu.
- Desteklenen temiz belgelerde normalize metin ≥%99,5; kritik sayı/alanlarda tam doğruluk. Düzenlenebilir Word metni, doğru sayfa sayısı, temel blok konumu hedefi ≤5 pt, kırpılma/örtüşme olmaması.
- Kaynak / LibreOffice round-trip / fark PNG; başarısız en kötü sayfaların elle incelemesi. MS Word testi yapılmadıysa uyumluluk onayı verme.
- OOXML güvenli açılış, dış ilişkilerin kaldırılması ve font/görsel/sütun mevcut regresyonları korunmalı. Gerçek örnek sadece yerel ve Git dışında kullanılabilir.

## 8. PDF → Excel

### Nedenler

`apps/server/engine/python/text_conversions.py::pdf_to_excel` yalnızca varsayılan `page.extract_tables()` kullanıyor; çizgisiz tablo için alternatif strateji yok. Çıkan satır listesi doğrudan hücrelere yazılıyor, birleşik hücre span geometrisi taşınmıyor. Metin temizliği 32000 karakterde sessiz kesiyor; uzun hücre içerik kaybı ayrıca test edilmeli. Tüm değerler bilinçli olarak string ve formüller inert; bu güvenlik özelliği korunmalı.

Mevcut ruled ve çok sayfalı finansal tablo örnekleri geçiyor. Birleşik hücrede kritik değer kaybı var. Text-strategy aday koşuları tablo bulabiliyor; bir şeyin tablo algılanması doğru hücre eşleştirmesi kanıtı değildir. Dört NO_TABLES negatif örneğini zorla tabloya çevirme.

### Çözüm adımları

1. Gerekli çıkarım sorumluluklarını küçük modüllere ayır: tablo adayı bulma, geometriden satır/sütun/span kurma, hücre içeriği normalizasyonu ve XLSX yazımı. Tek dev profil/koşul dosyası oluşturma.
2. Çizgili tablo stratejisini koru; yeterli tablo kanıtı yoksa sınırlı bir text-alignment stratejisi dene. Sütun hizası, satır sürekliliği ve başlık yapısıyla deterministik seçim yap; sıradan paragrafı başarılı tablo sayma.
3. Birleşik hücrede bbox ilişkilerinden span çıkar; üst-sol hücre değerini koru, kapsanan hücrelerde veri kaybetme. Çıktıda merge uygulanacaksa gerçek geometriye dayanmalı; çok satırlı metin ile çok satırlı tablo hücresini ayır.
4. Tarih, Türkçe ondalık, negatif sayı, para birimi ve baştaki sıfırlar korunmalı. Bu dilimde otomatik sayı/tarih türü tahmini zorunlu değil; değer kaybına neden olacak cast ekleme. Formül benzeri içerik kesinlikle çalıştırılabilir formüle dönüştürülmez.
5. Çok sayfalı tablo için mevcut sheet politikasını açık tut; otomatik birleştirme gerekiyorsa ayrı seçenek/karar ve tekrar eden başlık testleri gerekir. Sessizce farklı tabloları birleştirme.
6. Uzun hücre için sessiz kesme yerine açık limit davranışı veya kayıpsız tanımlı bölme kararı; kontrol karakteri temizliği ile görünür içerik silmeyi ayır.
7. Mevcut 100000 hücre / 100 sütun / 20000 satır ve belge/süre/bellek limitleri korunmalı. Çok sayıda profil denemesiyle süreyi sınırsız büyütme; güvenilir tablo yoksa açık NO_TABLES.

### Kabul testleri

- Mevcut sekiz senaryo × üç tekrar; çizgisiz, birleşik, çok sayfalı, tarih/ondalık/başta sıfır ve uzun hücre regresyonları eklenir.
- Hücre metni ≥%99, satır/sütun eşleşmesi ≥%98, kritik sayılar tam doğru. Kaymış/kaybolmuş kritik değer başarısızdır; sheet oluşması başarı değildir.
- XLSX bağımsız okuyucuyla açılmalı; metin düzenlenebilir olmalı; formül benzeri değerler string kalmalı; dış ilişki/makro oluşmamalı.
- Desteksiz taranmış tabloyu çıktı üretmiş gibi gösterme; OCR/tablo rekonstrüksiyonu bu kapsamda ayrıca kararlaştırılmadı.

## 9. Doğrulama, kaynak sınırları ve raporlama

Mevcut komutlar (önce scripts içeriğini ve test ortamını oku):

```sh
node scripts/audit-engines.mjs --tools protect-pdf unlock-pdf --replace-tools
node scripts/audit-engines.mjs --tools pptx-to-pdf watermark-pdf pdf-to-word pdf-to-excel --replace-tools
node scripts/audit-engines.mjs
node scripts/audit-engines.mjs --performance-only
node scripts/audit-engines.mjs --supplement
node scripts/audit-workflow.mjs
node scripts/report-engine-audit.mjs
pnpm check
pnpm build
```

Bu komutları körlemesine arka arkaya çalıştırma. `--replace-tools` eski kayıtları değiştirir; yalnızca baseline korunduktan sonra kullan. Performans koşusuyla başka ağır testleri aynı anda çalıştırma. Yeni negatif/parola testleri 120 senaryonun dışına eklenirse manifest/rapor sayımları açık kapsam tanımıyla güncellenmeli; başarısız testler sayımdan çıkarılmamalı.

`audit-workflow.mjs` güncel audit imajını build eder; ayrı Compose projesi/DB/volume ile gerçek worker akışını çalıştırır. Yerel frontend 4321 portunda hazır olmalı. `AUDIT_REGRESSION=1` seçeneği izole entegrasyon koşusu içindir; mevcut script davranışını doğrula. Geliştirme DB'sini kullanan genel `pnpm test` komutunu aynı anda çalıştırma. Backend/native paket değişince ilgili imajlar yeniden build edilmeden sonuçları yeni koda mal etme.

Başlangıç yaşam döngüsü: 6 testten 5'i geçti. Kısa timeout'ta PROCESSING_TIMEOUT yerine ENGINE_UNAVAILABLE var. Ayrı bir açık bulgudur; altı motor düzeldi diye kapatma. Gerçek SIGKILL/180 sn lease kurtarma geçti; attempt UUID'dir, sayısal sayaç gibi kıyaslama. Eşzamanlı iki job, iptal, sahiplik, expiry ve fiziksel temizleme tekrar kontrol edilmeli.

Performans başlangıç ortamı 1 CPU / 1024 MiB / 96 PID / 384 MiB tmpfs. Container bellek tepe değeri 1024 MiB sınırına ulaştı, OOM kill yoktu; tmpfs/cache dahil. `wait4` child RSS eşzamanlı süreç ağacının toplamı değildir. Aynı imaj/font/corpus ve aynı donanımda küçük/orta/sınıra yakın belgeyle ilk + beş sıcak tekrar ve iki eşzamanlı iş kıyaslanmalı. Kaliteyi bozan hız kazanımı kabul edilmez. %20 hız/bellek hedefi henüz sağlanmış değildir. Yerel ayrık container ölçümü Render'ın tek container kapasite garantisi değildir.

Her araç tamamlandığında teslim et:

- Değişen neden ve kod; çözümün hangi belge sınıfını iyileştirdiği.
- Önce/sonra ayrı içerik, görünüm, düzenlenebilirlik, ret ve API sonuçları; üç tekrar tutarlılığı.
- En kötü örneğin kaynak/çıktı/fark görselleri; runtime/paket/font ve git/hash metadata'sı.
- Süre/CPU/RSS/geçici alan/çıktı boyutu; çözülemeyen ve çalıştırılamayan kapıların nedeni.
- ENGINE-SUPPORT ve ilgili tek kaynak sözleşme belgeleri; güvenlik değişikliklerinde API, DATA-MODEL, FILE-PROCESSING, DEPLOYMENT.

Audit raporu script ile üretilir; yalnızca üretilmiş Markdown'ı elle değiştirip sonraki üretimde kaybetme. Planın tamamlanması altı araç için kabul testlerinin ve gerçek kullanıcı akışının geçmesi veya kalan desteğin açıkça sınırlandırılmasıyla değerlendirilir; 100/100 rakamı tek başına üretim onayı değildir. Commit/push/canlı dağıtım bu plan belgesinin hazırlanmasına dahil değildir.

## 10. Diğer agent'a verilecek kısa başlangıç mesajı

> `docs/ENGINE-REMEDIATION-PLAN.md` dosyasını ve AGENTS.md'yi oku. Bu plandaki altı motorun iyileştirmesini uygula. Önce mevcut audit baseline'ını koru ve sürüm/kod durumunu doğrula. Şifreleme/parola kaldırmada ortak doğrulama ve parola gizliliğinden başla; ardından PPTX, filigran, PDF → Word ve PDF → Excel sırasıyla ilerle. Test eşiklerini düşürme; gerçek API/worker akışı ve bağımsız çıktı kontrolleri olmadan tamamlandı deme. Kullanıcı belgelerini Git'e koyma, mevcut kullanıcı değişikliklerini koru ve sonucu ölçülmüş önce/sonra bulgularıyla raporla.
