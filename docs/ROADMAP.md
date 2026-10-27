# Geliştirme yol haritası

Bu plan süre tahmini değildir. Önce frontend, sonra ortak backend ve 10 araç için yerel motorlar eklendi. Sentetik motor testleri geçti; geniş corpus kalite/kapsam denemeleri ve üretim hazırlığı sürüyor.

## Aşama 0 — Ürün ve motor doğrulaması

Çıktılar:

- PRODUCT içindeki kapsam ve açık karar listesinin gözden geçirilmesi.
- Türkçe karakter, tablo, çok sütun, font, uzun belge ve sentetik taramalardan oluşan referans kümesi.
- PDF → Word/Excel, Office → PDF, PDF rasterizasyonu, OCR ve sıkıştırma için motor karşılaştırması.
- Motor bazında kalite, süre, en yüksek bellek, disk, lisans/dağıtım koşulları ve varsa işlem maliyeti kaydı.

Geçiş koşulu: İlk yayın kapsamındaki her araç için gerçek motor yolu belli; kabul edilmeyen araçlar açıkça devre dışı. Kalite gerektiren iki yönlü dönüşümün otomatik olarak kusursuz olduğu varsayılmıyor.

## Aşama 1 — Uygulama iskeleti ve sınırlar

Çıktılar:

- pnpm workspace, web/server/contracts yapısı ve sürüm sabitleme.
- Fastify API, worker giriş noktası, PostgreSQL ve migration altyapısı.
- Yapılandırma doğrulama, yapılandırılmış log ve health kontrolleri.
- Katman/modül import kuralları ve CI kontrolleri.
- Gerçek kurulum komutlarını içeren README ve güncellenmiş AGENTS.
- İlk veri modeli ve migration/transaction planı.

Geçiş koşulu: Temiz ortamda kurulum/build çalışıyor; katman ihlali CI'da yakalanıyor; API ve worker aynı sürümden başlıyor.

## Aşama 2 — PDF birleştirme ile dikey dilim

Çıktılar:

- Anonim oturum, private yükleme, dosya doğrulama ve sahiplik.
- İş oluşturma/idempotency, kuyruk ve atomik kabul.
- İzole QPDF yürütmesi, sonuç doğrulama ve indirme.
- Temel araç sayfası, dosya sıralama ve işlem durumu.
- İptal, erken silme, süre dolumu ve artık dosya temizleme.

Geçiş koşulu: İki PDF yüklenip sıralı sonuç indiriliyor. Çift başlatma, başka oturumdan erişim, worker yeniden başlama ve otomatik temizlik doğrulanıyor. Bu dilimde yalnızca mutlu yol yeterli değil.

## Aşama 3 — Ortak PDF ve görsel araçları

Sıra: sayfa düzenleme → görselden PDF → PDF'den görsel → sıkıştırma. Motor adayları Aşama 0 sonuçlarına göre kullanılır.

Çıktılar: yeni handler'lar, sınırlandırılmış önizleme, çoklu çıktı ZIP'i, araç bazlı seçenekler ve fixture'lar.

Geçiş koşulu: Her araç ortak jobs/files/usage altyapısını kullanıyor; motor kodu route veya UI'ya sızmıyor; boyut ve sayfa sınırları gerçek çıktı üzerinde doğrulanıyor.

## Aşama 4 — Office ve OCR

Sıra: Word → PDF, Excel → PDF, OCR. PDF → Word/Excel kalite kapısını geçen motorlarla eklenir.

Çıktılar: font/dil verileri sabitlenmiş motor imajları, motor başına eşzamanlılık bütçesi, süre aşımı ve tekrar deneme politikası.

Geçiş koşulu: Türkçe karakterler ve referans belgeler kontrol edildi; desteklenmeyen özellikler kullanıcıya doğru anlatılıyor; dış sağlayıcı kullanılıyorsa veri işleme ve maliyet kararı kaydedildi.

## Aşama 5 — Ürün arayüzü ve içerik

Temel tasarım sistemi daha önce uygulanır; bu aşamada bütün araçlarda tutarlılık tamamlanır.

Çıktılar: ana sayfa, araç araması, 10 araç sayfası, gerçek kullanılabilirlik durumları, mobil/klavye düzenlemeleri, açıklamalar, SSS ve gizlilik/kullanım metinleri.

Geçiş koşulu: Boş, yükleme, kuyruk, iptal, hata, sonuç ve süre dolumu durumları bütün etkin araçlarda anlaşılır. Desteklenmeyen araç işlem kabul etmiyor.

## Aşama 6 — Kapasite ve yayın hazırlığı

Çıktılar:

- Eşzamanlı karma belge yük testi; API ve worker kaynak bütçeleri.
- Kesin kullanım limitleri, timeout'lar, saklama süresi ve temizleme aralığı.
- Kuyruk yaşı, motor hatası, disk ve silme gecikmesi izleme eşikleri.
- Üretim yapılandırması, HTTPS, migration sırası ve geri alma planı.
- Metadata yedekleme/geri yükleme denemesi ve geçici dosya yedekleme politikasının doğrulanması.
- Erişim izolasyonu, dosya türü kontrolleri ve motor sandbox doğrulaması.

Geçiş koşulu: Açık yayın engelleri kapalı, geri yükleme denenmiş, kritik akışlar geçiyor, gerçek limitler kullanıcıya yansıyor ve devre dışı motorlar kontrollü davranıyor.

## Başlangıç ilerleme durumu

- [x] 10 temel planlama belgesi hazırlandı.
- [x] Astro + Svelte yerel frontend önizlemesi hazırlandı; 10 araç ekranı ve dosya/ayar seçimi eklendi.
- [x] Fastify, PostgreSQL/Drizzle, pg-boss, özel depolama ve izole QPDF ilk dilimi kuruldu.
- [x] PDF birleştirme için gerçek yükleme, durum, iptal, indirme ve silme frontend'e bağlandı.
- [x] Import sınırı denetimi ve gerçek DB/motor entegrasyon testleri eklendi.
- [x] 10 araç için yerel motor adaptörleri, türe özel doğrulama, seçenekler ve dinamik indirme biçimleri eklendi.
- [ ] Ürün varsayımları ve açık kararlar kesinleştirildi.
- [ ] Motor denemeleri yapıldı.
- [x] Uygulama iskeleti kuruldu.
- [x] PDF birleştirme normal akışı uçtan uca tamamlandı; kalan dayanıklılık kontrolleri TESTING içinde listelidir.
- [x] 10 aracın yerel motorları sentetik belge kontrollerinden geçti.
- [ ] Geniş belge corpus'u ve üretim kapasite kontrolleri tamamlandı.
- [ ] Yayın hazırlığı tamamlandı.

## Gerektiğinde üretilecek belgeler

| Belge | Tetikleyici | Tek kaynak sorumluluğu |
| --- | --- | --- |
| README.md | İskelet kurulumu | Gerçek kurulum ve çalıştırma |
| docs/API.md / üretilen OpenAPI | İlk endpoint sözleşmesi | HTTP taşıma sözleşmesi; aynı şema elle çoğaltılmaz |
| docs/DATA-MODEL.md | İlk migration öncesi | Tablolar, indeksler, ilişkiler ve veri sahipliği uygulaması |
| docs/TESTING.md | Test altyapısı kurulumu | Test ortamı ve gerçek komutlar |
| docs/DEPLOYMENT.md | İlk dağıtım öncesi | Yapılandırma, migration, yedekleme ve geri alma |
| docs/decisions/NNNN-konu.md | Önemli teknik karar | Bağlam, seçenekler, karar, sonuç ve kabul durumu |

README, API, DATA-MODEL, TESTING ve DEPLOYMENT belgeleri oluşturuldu. Üretilen OpenAPI ve karar kayıtları henüz yoktur. Web ve API Render'a dağıtılmıştır; bu, Aşama 6'daki kapasite, operasyon ve yedekleme kabul koşullarının tamamlandığı anlamına gelmez. Yerel yedek/geri yükleme denemesi vardır; otomatik üretim yedeklemesi ve üretim rollback otomasyonu yoktur.

## Değişiklik yönetimi

Kapsam değişirse önce PRODUCT, bağımlılık değişirse ARCHITECTURE/MODULES, teknoloji değişirse TECH-STACK güncellenir. Önemli teknik karar ayrı karar kaydıyla gerekçelendirilir. ROADMAP yalnızca aşama ve tamamlanma durumunu taşır; diğer belgelerin içeriğini kopyalamaz.
