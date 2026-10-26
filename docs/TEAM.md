# DoctorConverter uzman ekibi

Bu dosya proje için önerilen uzmanlık dağılımını, sahiplik alanlarını ve çalışma anlaşmasını tanımlar. Uzmanlar ayrı kod sahipleri veya kalıcı sunucu süreçleri değildir; Codex görevlerinde kullanılacak rol yönergeleri yerel skill dosyalarında tutulur. Her görevde bütün rollerin çağrılması gerekmez.

## Koordinasyon

Koordinatör kullanıcı isteğini kapsamlandırır, tek kaynak belgeleri kontrol eder, çakışan önerileri uzlaştırır, değişiklikleri uygular ve doğrulama durumunu raporlar. Uzman incelemeleri tavsiye üretir; kullanıcı kapsamı, repository talimatları ve mevcut uygulama kanıtı üstündür.

## Roller

| Rol | Sorumluluk | Öncelikli kaynaklar |
|---|---|---|
| Mimari | Katman/modül sınırları, bağımlılık yönü, god file riski, modüler monolith kararları | `docs/ARCHITECTURE.md`, `docs/MODULES.md`, `docs/CODING-STANDARDS.md` |
| Backend ve belge işleme | API, jobs/files/usage sözleşmeleri, worker, motor adaptörleri, gizlilik ve kaynak sınırları | `docs/API.md`, `docs/DATA-MODEL.md`, `docs/FILE-PROCESSING.md`, `docs/ENGINE-SUPPORT.md` |
| Frontend ve kullanıcı deneyimi | Astro/Svelte sayfa akışları, erişilebilirlik, dil, SEO bileşenlerinin arayüzle ilişkisi | `docs/USER-FLOWS.md`, `docs/DESIGN-SYSTEM.md` |
| SEO ve analitik | Canonical/hreflang, içerik rotaları, Search Console ve izinli PostHog ölçümü | `docs/SEO.md`, `docs/POSTHOG.md`, `docs/CONTENT-SEO-CHECKLIST.md` |
| Kalite ve operasyon | Test kanıtı, CI, dağıtım, kapasite, izleme, yedekleme ve geri yükleme | `docs/TESTING.md`, `docs/DEPLOYMENT.md`, `docs/ROADMAP.md` |

## Çalışma anlaşması

1. Önce kullanıcı isteğini ve ilgili tek kaynak belgeleri oku; hedefi uygulanmış gerçek gibi sunma.
2. Mimari değerlendirmede ölçülebilir bulgu ver: dosya/alan, çağrı yönü, sorumluluk, risk ve kanıt.
3. İnceleme ile değişikliği ayır. Salt inceleme isteğinde kod değiştirme; uygulama isteğinde gerekli küçük ve ilişkili düzeltmeleri tamamla.
4. Birden fazla rolün çalışması gerekiyorsa önce ayrı bulgular topla, sonra koordine et; mükerrer altyapı ya da çelişen sahiplik üretme.
5. Dosya içeriği, sırlar veya kullanıcı verileri loglara, görevlere ya da analitiğe girmez. Gerçek belgeler fixture olarak eklenmez.
6. Etkilenen kontrolleri çalıştır ve yalnızca gerçekten çalıştırılmış olanı geçti diye bildir. Canlı ortamda geri döndürülemez veya maliyetli değişiklik yapma; kullanıcı yetkisi ve güvenli işlem planı gerekir.
7. Kalıcı mimari karar değişikliği ilgili tek kaynak belgeye yazılır; ekip kataloğu her ayrıntıyı kopyalamaz.

## Skill yönergeleri

Bu rollerin Codex'te yeniden keşfedilebilir yönergeleri `%USERPROFILE%/.codex/skills/doctorconverter-*` altındadır. Skill'ler aynı ürün kapsamı için yerel yardımcıdır; repository dosyaları ve AGENTS.md bağlayıcı proje kuralları olmaya devam eder.

## İlk ortak değerlendirme

Mevcut yapıda API, worker ve engine ayrı entrypoint'lere sahip; Render API servisi bunları tek container'da başlatıyor. Backend kaynak dosyalarının çoğu küçük; `analytics/infrastructure/repository.ts` 183 satırla backend'de en uzun ölçülen kaynak dosyası. Frontend'de `apps/web/src/lib/seo/scenarios-tr.ts` (663), `apps/web/src/i18n/ui.ts` (652), `apps/web/src/lib/seo/scenarios-en.ts` (649), `apps/web/src/lib/seo/scenarios-tr-deep.ts` (491) ve `apps/web/src/lib/tool-seo.ts` (324) uzun içerik/veri dosyalarıdır; satır sayısı tek başına god file kanıtı değildir.

İlk odaklar:

1. Uzun SEO/i18n veri kümelerinin üretim/yerelleştirme kaynak sınırlarını incele; davranış ve içerik doğrulamasını koruyarak gerekirse araç/kategori bazında böl.
2. Live Render yerleşiminde API, worker ve engine'in ortak 0.1 CPU / 512 MB sınırını kapasite riski olarak kabul et; üretim yük testi ve ayrı kaynak bütçesi kararı olmadan başarı iddiası verme.
3. Kuyruk yaşı, iş hata oranı ve fiziksel cleanup gecikmesi için gözlemlenebilirlik açığını kapatmayı planla; health readiness şu anda yalnızca DB, engine ve worker heartbeat sinyali sağlıyor.
4. Harici veritabanı sağlayıcısı/yedek kapsamı doğrulanmadan canlı yedek veya geri yükleme işlemi yapma.

Bu değerlendirme başlangıç envanteridir; ürün kodunun bu adımda değiştirilmesi anlamına gelmez.
