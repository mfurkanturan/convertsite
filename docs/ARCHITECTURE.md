# Mimari

## Hedef yapı

Tek repository ve ortak sürümle geliştirilen modüler monolith. Web, API ve worker aynı sürümden dağıtılır. API ve worker ayrı süreçlerde çalışır; iş modülleri bağımsız servisler olarak çoğaltılmaz.

Statik web dosyaları ters proxy üzerinden, API aynı origin altında `/api` yolundan sunulur. İlk sürümde Astro statik üretim kullanır. Worker yalnızca doğrulanmış işleri işler; dosya dönüşümleri HTTP isteğinin ömrüne bağlanmaz.

```text
Tarayıcı → Caddy → Statik web
                 → API → PostgreSQL (metadata + kuyruk)
                       → Özel dosya depolama

Worker → Kuyruk → İş modülü → Motor adaptörü → İzole motor işlemi
                          → Özel dosya depolama
```

Motor yardımcı container'ı gerekiyorsa bu altyapı bağımlılığıdır. Uygulamanın ürün kuralları motor container'ına taşınmaz.

## Katmanlar ve bağımlılık yönü

```text
presentation ─────► application ─────► domain
infrastructure ───► application / domain
bootstrap ────────► somut adaptörleri bağlar
```

- **Domain:** İş kuralları, değer tipleri ve geçerli iş durumları. Gerekmedikçe sınıf kullanılmaz.
- **Application:** Kullanım senaryoları, ihtiyaç duyduğu portlar ve iş akışları. Fastify, SQL veya motor paketi import etmez.
- **Infrastructure:** Portların veritabanı, depolama, kuyruk ve motor uygulamaları.
- **Presentation:** HTTP şemaları, sahiplik bilgisinin taşınması, durum kodları ve kullanıcıya uygun hata dönüşümü.
- **Bootstrap:** Modüllerin ve bağımlılıkların kurulumu. Karar veren iş kodu içermez.

Arayüzler onları tüketen katmanda tanımlanır. Kullanılmayan soyutlama, genel base repository ve her işlem için zorunlu entity yaratılmaz.

## Önerilen kod yerleşimi

Dizinler uygulanmıştır; aşağıdaki ağaç özet yerleşimi gösterir (alt dizinlerin tamamı değildir).

```text
apps/
  web/                         # Astro + Svelte arayüzü
  server/
    src/
      entrypoints/             # API, worker, engine ve migrate başlangıç noktaları
      bootstrap/               # Bağımlılık bağlama
      engine/                  # Motor HTTP kapısı, kapasite sınırı, süreç grubu
      modules/
        analytics/
        files/
        jobs/
        conversions/
        pdf-operations/
        ocr/
        usage/
      platform/                # Config, bağlantılar, log ve süreç yardımcıları
packages/
  contracts/                   # İstemciye açık DTO ve şemalar
docs/
```

Her modülde ihtiyaç duyulan katmanlar açılır. Boş klasör ağacını doldurmak için kod üretilmez. `platform`, ortak iş kurallarının veya rastgele yardımcı fonksiyonların deposu olamaz.

## Modüller arası iletişim

- Her modülün dış yüzeyi açıkça tanımlanmış `public.ts` üzerinden sunulur.
- Başka modülün repository'si, ORM modeli, motor adaptörü veya tablosu kullanılmaz.
- Modül sözleşmeleri sade veri tipleri taşır; HTTP request veya ORM nesnesi taşımaz.
- Döngüsel import yasaktır. İşlem sırası ve yönleri [MODULES](MODULES.md) içinde tanımlıdır.
- Worker handler eşlemesi bootstrap'ta yapılır; yeni araç için merkezi dev koşul zinciri oluşturulmaz.
- İlk sürümde uygulama içi açık çağrılar ve kuyruk yeterlidir. Genel event bus zorunlu değildir.

## Veri ve işlem sınırları

Tek PostgreSQL kullanılır; tablo sahipliği modül bazında korunur. Dosya baytları özel depolamada tutulur. Kuyruk yükünde yalnızca iş kimliği gibi küçük referanslar bulunur.

İş kaydı ve kuyruğa ekleme, uyumlu ortak PostgreSQL transaction'ı içinde tamamlanır. Seçilen pg-boss/ORM sürümlerinde bu garanti entegrasyon testiyle kanıtlanır. Sağlanamıyorsa aynı transaction'da yazılan outbox ve tekrar güvenli yayıncı kullanılır; iki bağımsız yazım bırakılmaz.

Dosya yüklemesi transaction içinde yapılmaz. Yükleme tamamlandıktan sonra iş girdisi olmaya uygun duruma geçer. Kuyruğa alınamayan sahipsiz girdiler temizleme politikasıyla kaldırılır.

## Kimlik ve erişim

Anonim oturum güvenli, HttpOnly cookie ile temsil edilir; üretimde Secure ve uygun SameSite ayarları uygulanır. Değişiklik yapan isteklerde origin/CSRF kontrolleri bulunur. İş kimliği tek başına yetki vermez.

API durum, indirme, önizleme, iptal ve silmede sahipliği doğrular. Depolama anahtarı veya dahili dosya yolu istemciye açılmaz. Üyelik ileride bu sahiplik modeline eklenir.

## Hata ve işletim modeli

- Beklenen hatalar kararlı uygulama kodlarıyla taşınır; stack trace kullanıcıya verilmez.
- İstek ve iş kimlikleriyle yapılandırılmış log tutulur; dosya içeriği loglanmaz.
- API liveness ve readiness ayrılır; worker'ın heartbeat ve kuyruğun bekleme süresi izlenir.
- Kapanışta yeni iş alımı durur; devam eden işler süre sınırı içinde bitirilir veya lease mekanizmasıyla kurtarılır.
- Aynı sürüm API/worker uyumu ve migration sırası dağıtım belgesinde tanımlanır.

## Mevcut çalışma biçimi

API, worker ve engine ayrı entrypoint'lere sahiptir. Yerel Compose bu süreçleri ayrı servislerde çalıştırır. Mevcut Render yerleşiminde web ve API ayrı servislerdir; API container'ı migration, engine ve worker süreçlerini birlikte başlatır. Render'da worker/engine için bağımsız ölçekleme veya ayrı kaynak bütçesi varsayılmamalıdır. Dağıtım ayrıntıları ve açık operasyon işleri [DEPLOYMENT](DEPLOYMENT.md) içindedir.

## Mimari kabul şartları

Domain/application katmanlarında dış teknoloji import'u bulunmaması, modül içlerine izinsiz erişimin engellenmesi, worker yeniden başladığında işin kurtarılması ve oturumlar arası dosya erişiminin reddedilmesi otomatik kontrollerle doğrulanır.
