# Docly — belge araçları

Astro + Svelte arayüzü ve modüler Fastify backend. **15 araç için yerel motor handler'ı kayıtlıdır:** QPDF, Poppler, LibreOffice, Tesseract ve Python belge/görsel adaptörleri. Kayıtlı olmak uçtan uca destek veya üretim kalitesi onayı değildir; özellikle PPTX, şifreleme ve parola kaldırma akışlarının engelleri [motor incelemesinde](docs/ENGINE-AUDIT.md) belgelenir.

## Yerel kurulum

Node.js 22.23.4 veya üzeri, pnpm 10.28.2 ve çalışan Docker gerekir. Repository kökünde:

```sh
pnpm install --frozen-lockfile
pnpm setup:local
pnpm infra:up
pnpm dev
```

Setup varsa `.env` dosyasını korur; yoksa rastgele yerel kimlik bilgileri üretir. `.env` ve `.data` Git dışında tutulur. Compose PostgreSQL, izole QPDF, migration, API, worker ve Caddy ağ geçidini başlatır.

- Web: http://127.0.0.1:4321/
- PDF birleştir: http://127.0.0.1:4321/#tool/merge-pdf
- Backend readiness: http://127.0.0.1:3001/api/health/ready

Tarayıcıda `localhost` yerine bu `127.0.0.1` adresini kullan; origin denetimi buna göre ayarlıdır. Astro `/api` isteklerini yerel gateway'e iletir. PostgreSQL ve motor host'a port açmaz.

## Kullanım ve sınırlar

Aracını aç, dosya ve seçeneklerini belirle, işlemi başlat. Gerçek yükleme, kuyruk/işleme, iptal, uygun biçimde indirme ve erken silme bulunur. Kabul edilen iş sekme kapansa da devam eder; aynı oturum ve sekmede geri dönünce araç başına son iş sorgulanır.

PDF → Word, yazı biçimi/boyutu, görseller, tablolar ve sütunları PDF geometrisinden yeniden kurarak düzenlenebilir DOCX üretir. Karmaşık yerleşimlerde birebir sonuç garantisi yoktur. PDF → Excel yalnızca algılanan tabloları çıkarır ve hücre metinlerini formül olarak çalıştırmaz. Taranmış belgeler için OCR kullanılır. Çoklu görseller ve bölünmüş sayfalar ZIP olabilir. DOCX/XLSX içindeki makro, gömülü binary ve dış bağlantılar reddedilir. PDF → Word bağımlılıklarının bakım/lisans bilgisi [ENGINE-SUPPORT](docs/ENGINE-SUPPORT.md) içindedir.

Geliştirme politikası: 10 MiB/dosya, toplam 40 MiB, 20 dosya / 300 sayfa, oturum başına 2 aktif iş ve 40 saklanan dosya; upload endpoint'inde IP başına 30 istek/saat. OCR en fazla 20, PDF → görsel 30, PDF → Word/Excel 50 sayfalık girdiyi işler. Görseller 25 milyon piksel/10000 kenar sınırındadır. Ağ (anahtarlı IP özeti) başına 60, küresel 400 silinmemiş dosya kaydında yükleme kabulü durur (MAX_CLIENT_FILES, MAX_GLOBAL_FILES). Bunlar üretim kapasite testiyle onaylanmış limitler değildir.

Varsayılan saklama 60 dakika. Erken silme erişimi hemen kapatır; fiziksel silme 120 saniyelik koruma süresinden sonra worker temizliğiyle gerçekleşir. Worker kapalıysa fiziksel temizlik bekler. Metadata içerik/orijinal dosya adı tutmaz; uzun vadeli metadata prune henüz yoktur.

## Kontroller ve işletim

```sh
pnpm check
pnpm test
pnpm build
pnpm infra:down
```

`check`: import sınırları ve server/web tip kontrolü. `test`: güncel backend imajı, gerçek PostgreSQL/pg-boss/QPDF ve sentetik PDF'lerle entegrasyon testleri. Test sırasında worker durur; runner sonunda tekrar başlatır ve yalnızca testin oluşturduğu oturum verilerini temizler.

Backend değişince `pnpm infra:up` ile yeniden build et. `infra:down` PostgreSQL volume'ünü silmez. Server container içinde TypeScript'i `tsx` ile çalıştırır; `build` server tip kontrolü ve web statik çıktısıdır.

## Kaynaklar

`apps/web`: frontend; `apps/server/src/modules`: files/jobs/usage/pdf-operations; `packages/contracts`: HTTP şemaları ve DTO'lar; `apps/server/migrations`: SQL; `infra` ve `compose.yaml`: yerel çalışma ortamı.

[API](docs/API.md), [veri modeli](docs/DATA-MODEL.md), [testler](docs/TESTING.md), [işletim](docs/DEPLOYMENT.md).

Görsel sayfa küçük resimleri/sürükleme editörü, karmaşık PDF yerleşimi koruma, üretim yük testi, metadata prune, shared rate limiting, CI workflow'ü ve üretim dağıtımı tamamlanmadı. Sayfa düzenleme aralık/sıra ve döndürme seçenekleriyle çalışır. Harici belge işleme sağlayıcısı kullanılmaz. Motor sınırları için [ENGINE-SUPPORT](docs/ENGINE-SUPPORT.md) dosyasına bak.
