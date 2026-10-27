# Dağıtım ve işletim

Bu belge yerel geliştirme akışını ve mevcut Render yerleşimini kapsar. 2026-10-26 itibarıyla `main` dalındaki `6a4586e` commit'i `doctorconverter-web` statik servisine başarıyla dağıtılmıştır; `doctorconverter-api` Render'da Docker web service olarak çalışır. Bu dağıtımın mevcut olması üretim kapasite, yedekleme/geri yükleme veya operasyon hazırlığının tamamlandığını kanıtlamaz.

## Canlı ortamın doğrulanmış durumu (2026-10-26)

- Render blueprint'inde `doctorconverter-web` ve `doctorconverter-api` var; Render kaynak listesinde ayrıca kullanıcı tarafından askıya alınmış eski `docly-api` servisi görünüyor. Bu hesaptaki kaynaklarda Render Postgres veritabanı görünmüyor. API'deki `DATABASE_URL` gizli ve elle girilmiş; sağlayıcı, yedek planı ve saklama süresi bu incelemede doğrulanamadı. Bu nedenle canlı DB için yedekleme açık kabul edilmemeli.
- API, Render Free planda 0,1 CPU / 512 MB RAM ile çalışıyor. Boşta kalınca uykuya geçiyor ve kalıcı disk yok. Aynı container içinde API, worker ve engine çalıştırıldığı için bu ortak kaynak sınırı kapasite riski oluşturur; yerel Compose servis limitleri canlıdaki kaynakları temsil etmez. Mevcut planı veya ücretli kaynağı değiştirmeden önce yük ve maliyet kararı gerekir.
- Render Metrics ekranında bu inceleme sırasında son 48 saat için kullanılabilir CPU/bellek grafiği verisi görünmedi. Grafikte veri olmaması kullanımın sıfır olduğunu göstermez. Render metrikleri panelde ayrıca izlenebilir; servis sağlıksızlaşması ve deploy hatası için çalışma alanı e-posta/Slack bildirimleri yapılandırılabilir.
- `DATA_DIR=/tmp/data` geçici alandır. Deploy/restart veya instance yaşam döngüsünde kalıcı belge depolama gibi değerlendirilmemelidir. PostgreSQL metadata yedeği ile geçici kullanıcı dosyalarının kopyasını aynı şey saymayın.

### Yedek ve geri yükleme prosedürü

1. Önce `DATABASE_URL` sağlayıcısını Render env değerini açmadan sağlayıcı panelinden belirle. Sağlayıcıda otomatik yedekleme, saklama süresi, PITR ve geri yükleme kısıtlarını kaydet. Şu anda bu bilgiler bilinmiyor.
2. Üretim metadata yedeği yalnızca uygulama tablolarını ve gerekli migration bilgisini kapsamalı; `/tmp/data` içindeki belge baytlarını arşive eklememeli. Uygulamanın süre/erişim politikasına göre dosya içerikleri geçicidir.
3. İlk geri yükleme denemesi üretime yazmayan ayrı bir veritabanı/branch üzerinde yapılmalı. Şema ve satır tutarlılığını doğruladıktan sonra API/worker bağlantısı izole ortamda denenmeli. Üretim veritabanının üzerine restore ancak hedef, zaman noktası, kesinti ve geri dönüş adımları ayrıca belirlenip onaylandıktan sonra yapılmalı.
4. Yerel `pg_dump` / `psql` hattının geçtiği, üretim yedekleme veya canlı restore'un doğrulandığı anlamına gelmez. Sağlayıcı bilinmeden canlı yedek/restore çalıştırılmamalıdır.

### İzleme ve uyarı kapsamı

- API `GET /api/health/live` süreç liveness'ını verir. `GET /api/health/ready`, veritabanı sorgusunu, motor sağlık kontrolünü ve son 20 saniyedeki worker heartbeat'ini denetler; hazır değilse 503 döner. Dış izleme bu endpoint'i düzenli sorgulamalı; Render'ın “service becomes unhealthy” bildirimi etkin olmalı.
- Worker en fazla 5 saniyede bir heartbeat yazar. Bu, API readiness için sinyaldir; kuyruk yaşı metriği veya iş başarı oranı alarmı değildir. Worker yalnızca genel bakım hatasını logluyor; dosya temizliğinin gecikmesi ve art arda iş hataları için ölçüm/uyarı şu an uygulamada bulunmuyor.
- Render API Metrics'te CPU ve bellek, HTTP istek hacmi, deploy ve uygulama logları incelenmeli. Kaynakta sürekli yüksek kullanım, OOM/restart veya 5xx artışı kapasite/uygulama incelemesi başlatmalı. Kesin eşikler trafik ve normal çalışma ölçümü toplandıktan sonra seçilmeli; henüz doğrulanmış alarm eşikleri yok.
- Önerilen ilk uygulama dışı uyarılar: `/api/health/ready` art arda kontrollerde başarısız; Render servis unhealthy/deploy failure; bellek uzun süre %85 üstü veya CPU uzun süre limite yakın; 5xx oranında belirgin artış. Kuyruk yaşı ve cleanup gecikmesi için alarm eklemeden önce bu metrikleri uygulamada üretmek gerekir.
- Bu incelemede hiçbir alarm, DB yedeği, restore, plan veya canlı ayarı değiştirilmedi.

Render'da web ve API ayrı servislerdir. API servisi başlangıçta migration'ı çalıştırır, ardından engine ve worker süreçlerini aynı container içinde başlatır; yerel Compose ise migration, API, worker ve engine'i ayrı servislerde çalıştırır. Bu nedenle yerel kaynak sınırları Render'da ayrı ölçeklenebilir servisler olarak uygulanmış değildir.

Canlı deploy sonrasında servis sağlık durumu ve son commit Render panosundan doğrulanmalıdır. Bu belgeye yazılan commit, dağıtım zamanı için durum kaydıdır; sonraki dağıtımlarda yenilenmelidir.

Başlatma: Docker → `pnpm install --frozen-lockfile` → `pnpm setup:local` → `pnpm infra:up` → `pnpm dev`. Hazır olma `/api/health/ready` ile kontrol edilir. Backend kaynak değişikliğinde imajı yeniden build et. Migration servisi API/worker'dan önce biter.

Kapatma: `pnpm infra:down`; PostgreSQL volume'ü korunur. Volume silme kurulum/güncelleme adımı değildir. Teşhis için `docker compose ps` ve servis logları kullanılır; `.env` değerleri paylaşılmaz.

## İzolasyon

- Gateway yalnızca host 127.0.0.1:3001 üzerinde açık; DB ve motor host portu açmaz.
- PostgreSQL private database ağında; engine ayrı private ağda, internet rotası ve DB ağı olmadan çalışır.
- API/worker gerekli private ağlara, gateway yalnızca API ağına bağlanır.
- Engine root olmayan kullanıcı, read-only rootfs/girdi volume'ü, tmpfs, cap_drop ALL ve no-new-privileges kullanır.
- Engine 1024 MiB / 1 CPU / 96 PID ve 384 MiB geçici alanla sınırlıdır. Child süreç grubu CPU/adres alanı/çıktı/açık dosya limitleriyle çalışır. Zaman aşımı/iptalde Python ve native çocukları aynı süreç grubuyla sonlandırılır.
- API/worker ayrı 256 MiB container'lardır. Docker socket paylaşılmaz.
- Motor varsayılan olarak yalnızca loopback'i dinler; compose'daki ayrı engine container'ı private ağında `ENGINE_HOST=0.0.0.0` ile açılır. Motor girdileri `DATA_DIR` (yoksa `/data`) altından okur; mutlak yol olmalıdır.
- Motor sabit executable/argüman dizisi ve UUID anahtarları kullanır; kullanıcı adı/yolu shell'e girmez. İç çağrılar rastgele secret ister.

## Politika ve yapılandırma

Setup `.env` oluşturur, mevcut dosyayı korur; eksikse ENGINE_TOKEN'dan ayrı `SESSION_SECRET` ekler (cookie imzası ve IP özeti anahtarı). Geçici job secret anahtarı SESSION_SECRET'tan türetilir; bu değerin rotasyonu, bekleyen şifreli job secret'larının çözülememesine yol açabilir. Rotasyondan önce bekleyen parola işleri bitirilmeli/iptal edilmeli, eski anahtar geri dönüş planı uygulanmalıdır. API `TRUST_PROXY_HOPS` kadar proxy hop'una güvenir; compose'da Caddy için 1, varsayılan 0 (X-Forwarded-For yok sayılır). `CLIENT_IP_HEADER` (örn. `cf-connecting-ip`) ayarlıysa ve geçerli IP içeriyorsa istemci IP'si bu başlıktan alınır; yalnızca istemcinin taklit edemeyeceği, kenar proxy'nin yazdığı başlık için kullanılır. API her farklı proxy başlık biçimini (adres değil, yalnızca sayı ve başlık adları) bir kez, en fazla 5 kez loglar. Motor aynı anda 2 dosya inceler, en fazla 16 isteği sırada bekletir. Compose DB servis adresini environment üzerinden verir. APP_ORIGIN ve tarayıcı adresi eşleşmelidir. Aktif yerel adres 127.0.0.1:4321.

Motor genel üst sınırı 20 dosya / 300 sayfa / 40 MiB çıktı; araca özel daha düşük sayfa sınırları ENGINE-SUPPORT içinde. Tek girdi üst sınırı 10 MiB. Toplam native görev süresi 90 saniye, worker istemcisi 95 saniye; kuyruk lease'i 180 saniye ve API/worker kapanma toleransı 110 saniyedir. Yükseltme kapasite testi gerektirir.

Ana sayfadaki AdSense slotu, yerelde repository kökündeki `.env` veya Render web servisinin build ortamında `PUBLIC_ADSENSE_CLIENT` (`ca-pub-...`) ve `PUBLIC_ADSENSE_SLOT_HOME_AFTER_TOOLS` (sayısal reklam birimi kimliği) birlikte tanımlandığında etkinleşir. Render için herkese açık bu iki değer `render.yaml` içinde tanımlıdır; statik web build'ine dahil olurlar ve gizli anahtar değildir. Doğrulama için publisher kodu `PUBLIC_ADSENSE_CLIENT` ayarlı tüm sayfalara eklenir. Google kodu canlı domaine erişince AdSense Sites ekranında doğrulamayı ve inceleme talebini tamamla. Reklam gösterimi, Google site onayından sonra başlar. Gerekli gizlilik ve çerez bilgilendirmesini koru. Geliştirme önizlemesinde kimlikler yoksa yer tutucu görünür; production build'de boş slot yayımlanmaz.

Worker temizliği periyodiktir. Worker durursa expiry erişimi yine keser; fiziksel temizlik bekler. Silme talebi 120 saniyelik koruma süresi sonrası uygulanır. İş ve dosya süresi ayrı kavramlardır.

## Üretim öncesi

PostHog EU kullanım ölçümü için kurulum, build değişkenleri ve izin davranışı [POSTHOG](POSTHOG.md) içinde tanımlıdır. Üretimde yalnızca doctorconverter.com/www üzerinde ve ziyaretçi izin verdiğinde çalışır. `PUBLIC_POSTHOG_ENABLED=false` ile yeniden build edilerek kapatılabilir; `PUBLIC_POSTHOG_LOCAL=true` Render'da açılmamalıdır. Public ingestion token yönetim anahtarı değildir. Bu istemci ölçümü backend iş istatistiğinin yerine geçmez.

Kalan üretim işleri: secret rotasyonu için prosedür, imaj digest pinleme, kaynak kapasite testi, alarm eşiklerini gerçek metriklerle belirleme, paylaşılan rate limiting, metadata prune, sağlayıcıya uygun yedek/izole restore denemesi ve migration geri alma/ileri düzeltme prosedürü. TLS/alan adı Render dağıtımında yapılandırılmış olsa da periyodik doğrulanmalıdır. `docly-backend:local` bir üretim pinleme stratejisi değildir.

PostgreSQL volume'ü metadata, .data/files geçici belge içerir. Geçici belgeler yedek politikasına sessizce dahil edilmez. Yerel ortamda `pg_dump` ve `psql` restore boru hattı (app_migrations, files, jobs, usage_accounts, worker_heartbeats tabloları) başarıyla doğrulanmıştır; otomatik zamanlanmış yedekleme veya üretim rollback otomasyonu henüz uygulanmadı.
