# Yerel işletim

Bu belge doğrulanan yerel geliştirme ortamını anlatır. İnternete açık üretim dağıtımı yapılmadı.

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

Setup `.env` oluşturur, mevcut dosyayı korur; eksikse ENGINE_TOKEN'dan ayrı `SESSION_SECRET` ekler (cookie imzası ve IP özeti anahtarı). API `TRUST_PROXY_HOPS` kadar proxy hop'una güvenir; compose'da Caddy için 1, varsayılan 0 (X-Forwarded-For yok sayılır). `CLIENT_IP_HEADER` (örn. `cf-connecting-ip`) ayarlıysa ve geçerli IP içeriyorsa istemci IP'si bu başlıktan alınır; yalnızca istemcinin taklit edemeyeceği, kenar proxy'nin yazdığı başlık için kullanılır. API her farklı proxy başlık biçimini (adres değil, yalnızca sayı ve başlık adları) bir kez, en fazla 5 kez loglar. Motor aynı anda 2 dosya inceler, en fazla 16 isteği sırada bekletir. Compose DB servis adresini environment üzerinden verir. APP_ORIGIN ve tarayıcı adresi eşleşmelidir. Aktif yerel adres 127.0.0.1:4321.

Motor genel üst sınırı 20 dosya / 300 sayfa / 40 MiB çıktı; araca özel daha düşük sayfa sınırları ENGINE-SUPPORT içinde. Tek girdi üst sınırı 10 MiB. Toplam native görev süresi 90 saniye, worker istemcisi 95 saniye; kuyruk lease'i 180 saniye ve API/worker kapanma toleransı 110 saniyedir. Yükseltme kapasite testi gerektirir.

Ana sayfadaki AdSense slotu, yerelde repository kökündeki `.env` veya Render web servisinin build ortamında `PUBLIC_ADSENSE_CLIENT` (`ca-pub-...`) ve `PUBLIC_ADSENSE_SLOT_HOME_AFTER_TOOLS` (sayısal reklam birimi kimliği) birlikte tanımlandığında etkinleşir. Render için herkese açık bu iki değer `render.yaml` içinde tanımlıdır; statik web build'ine dahil olurlar ve gizli anahtar değildir. Doğrulama için publisher kodu `PUBLIC_ADSENSE_CLIENT` ayarlı tüm sayfalara eklenir. Google kodu canlı domaine erişince AdSense Sites ekranında doğrulamayı ve inceleme talebini tamamla. Reklam gösterimi, Google site onayından sonra başlar. Gerekli gizlilik ve çerez bilgilendirmesini koru. Geliştirme önizlemesinde kimlikler yoksa yer tutucu görünür; production build'de boş slot yayımlanmaz.

Worker temizliği periyodiktir. Worker durursa expiry erişimi yine keser; fiziksel temizlik bekler. Silme talebi 120 saniyelik koruma süresi sonrası uygulanır. İş ve dosya süresi ayrı kavramlardır.

## Üretim öncesi

PostHog EU kullanım ölçümü için kurulum, build değişkenleri ve izin davranışı [POSTHOG](POSTHOG.md) içinde tanımlıdır. Üretimde yalnızca doctorconverter.com/www üzerinde ve ziyaretçi izin verdiğinde çalışır. `PUBLIC_POSTHOG_ENABLED=false` ile yeniden build edilerek kapatılabilir; `PUBLIC_POSTHOG_LOCAL=true` Render'da açılmamalıdır. Public ingestion token yönetim anahtarı değildir. Bu istemci ölçümü backend iş istatistiğinin yerine geçmez.

TLS/alan adı, secret rotasyonu, imaj digest pinleme, kaynak/disk kapasitesi, alarm eşikleri, paylaşılan rate limiting, metadata prune, backup/restore denemesi ve migration geri alma/ileri düzeltme prosedürü tamamlanmalıdır. `docly-backend:local` bir üretim pinleme stratejisi değildir.

PostgreSQL volume'ü metadata, .data/files geçici belge içerir. Geçici belgeler yedek politikasına sessizce dahil edilmez. Yerel ortamda `pg_dump` ve `psql` restore boru hattı (app_migrations, files, jobs, usage_accounts, worker_heartbeats tabloları) başarıyla doğrulanmıştır; otomatik zamanlanmış yedekleme veya üretim rollback otomasyonu henüz uygulanmadı.
