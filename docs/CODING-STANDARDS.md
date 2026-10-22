# Kodlama standartları

Amaç: Okunabilir, değiştirilebilir ve modül sınırları denetlenebilir kod. Mimari bağımlılık kuralları için [ARCHITECTURE](ARCHITECTURE.md), sorumluluk sahipliği için [MODULES](MODULES.md) esas alınır.

## Temel kurallar

- TypeScript strict kullan; `any` yerine `unknown` ve açık daraltma tercih et.
- Dış girdileri çalışma zamanında doğrula; TypeScript tipi tek başına güven sınırı değildir.
- İş kurallarında açık isimler ve küçük fonksiyonlar kullan; gereksiz sınıf oluşturma.
- UI durumu, taşıma DTO'su, domain tipi ve DB modeli farklı ihtiyaçlardır; tek tipe zorla birleştirme.
- Yapılandırmayı başlangıçta doğrula. Domain içinde `process.env` okuma.
- Saat, kimlik üretimi, depolama ve motor gibi dış etkileri gereken yerde port üzerinden geçir.
- İş kodunda framework dekoratörleri, servis locator veya gizli global bağımlılık kullanma.
- Yorumlar kodu tekrar etmek yerine kararın nedenini veya motor sınırlamasını açıklasın.

## İsimlendirme ve dosya düzeni

- Dosyalar `kebab-case`, tip/sınıflar `PascalCase`, değişken/fonksiyonlar `camelCase`.
- Araç kimlikleri PRODUCT içindeki kararlı kimliklerle eşleşir.
- Kullanım senaryosu tek davranış anlatır: `merge-pdf.ts`, `convert-word-to-pdf.ts`.
- Test dosyası sınadığı davranışa yakın tutulur; entegrasyon ve E2E testleri açıkça ayrılır.
- Bileşenler görünür sorumluluklara ayrılır: dosya listesi, ayar paneli, işlem durumu gibi.
- Ortaklaştırma yalnızca gerçekten paylaşılan sorumluluk için yapılır.

## No God File / No God Object

- Route dosyası SQL, motor komutu ve ürün kararı içermez.
- Handler bütün araçların mantığını taşımaz; her araç kendi davranışına sahiptir.
- `utils.ts`, `helpers.ts`, `common.ts`, `BaseService` gibi belirsiz depolar oluşturma.
- Başlangıç dosyası yalnızca kurar ve bağlar; işin nasıl yapılacağına karar vermez.
- Yaklaşık 250–300 kaynak satırını geçen dosyada sorumluluk incelemesi gerekir. Bu eşik otomatik parçalama emri değildir; üretilen dosyalar ve veri fixture'ları ayrıca değerlendirilir.
- Karmaşıklık ve dosya uzunluğu kuralları başlangıçta uyarı verebilir; katman ve modül import ihlalleri CI hatası olmalıdır.
- Aynı dosyada farklı değişiklik nedenleri birikiyorsa dosya küçük olsa bile sorumlulukları ayır.

## HTTP ve hata modeli

Şemalar geliştirici tarafından tanımlanır; kullanıcıdan gelen şema çalıştırılmaz. Controller yalnızca doğrulama, oturum bağlamını taşıma, kullanım senaryosu çağırma ve yanıt eşlemesi yapar.

Hata yanıtı hedefi: kararlı `code`, kullanıcıya uygun `message`, `requestId` ve yalnızca güvenli ayrıntılar. Örnek kodlar: `UNSUPPORTED_FORMAT`, `LIMIT_EXCEEDED`, `INVALID_DOCUMENT`, `PROCESSING_TIMEOUT`, `ENGINE_UNAVAILABLE`, `RESULT_EXPIRED`.

- Beklenen iş hataları ile beklenmeyen altyapı hatalarını ayır.
- Hataları yutup başarı döndürme; bütün hataları aynı mesajla gizleme.
- Stack trace, yerel yol, SQL, motor stderr içeriği veya gizli bilgi istemciye gitmez.
- Aynı hatayı her katmanda tekrar loglama; bağlam ekle ve uygun sınırda kaydet.
- Başka oturumun kaynağı için kaynağın varlığını ifşa etmeyen tutarlı yanıt kullan.

## Veri ve eşzamanlılık

- Her tabloyu sahibi olan modülün repository'si değiştirir.
- Migration olmadan üretim şeması değiştirilmez; otomatik şema eşitlemesi kullanılmaz.
- Dosya/motor/ağ işlemi sürerken veritabanı transaction'ı açık tutulmaz.
- İş tekrar çalışabilir kabul edilir; idempotency ve atomik durum geçişleri tasarlanır.
- Motor komutu sabit executable ve argüman dizisiyle çağrılır; shell interpolasyonu yapılmaz.
- Dosya adı, MIME veya istemcinin gönderdiği sayfa sayısına güvenilmez.

## Test yaklaşımı

| Katman / risk | Gerekli doğrulama |
| --- | --- |
| İş kuralı | Sayfa planı, seçenekler, durum geçişleri ve kota hesabı için birim testi |
| Adaptör | Gerçek PostgreSQL/kuyruk, private depolama ve seçilen motorla entegrasyon |
| Erişim | Farklı anonim oturumlar arasında durum/indirme/iptal/silme izolasyonu |
| Dayanıklılık | Worker sonlandırma, lease kaybı, tekrar deneme, iptal yarışı, süre dolumu |
| Kullanıcı akışı | Yükle → işle → indir; kritik hata ve klavye akışı için E2E |
| Dönüşüm kalitesi | Türkçe karakter, tablo, font ve sentetik tarama fixture'ları |

Sadece implementasyonu taklit eden veya görünür davranışa katkısı olmayan test yazma. Sırf coverage yüzdesi için test ekleme. Önemsiz, geri alınabilir metin/stil değişiklikleri için yeni test zorunlu değildir; uygun görsel/doğrudan kontrol yeterli olabilir.

## CI ve tamamlanma

Uygulama iskeleti kurulunca gerçek komutlar tanımlanır: format kontrolü, lint/import sınırları, server TypeScript kontrolü, Astro/Svelte kontrolü, ilgili testler ve build. Entegrasyon/E2E gerektiren değişiklikler bu işleri de çalıştırır.

Bir özellik; beklenen davranışı, hata davranışı, erişim sınırı, kaynak/silme etkileri ve gerekli belge güncellemesi tamamlandığında bitmiş sayılır. Geçmeyen veya çalıştırılmayan kontrol açıkça raporlanır.
