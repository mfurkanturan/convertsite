# DoctorConverter uzman ekibi

Bu dosya proje için önerilen uzmanlık dağılımını, sahiplik alanlarını ve çalışma anlaşmasını tanımlar. Uzmanlar ayrı kod sahipleri veya kalıcı sunucu süreçleri değildir; kanonik rol yönergeleri `docs/agent-roles/` altında tutulur. Her görevde bütün rollerin çağrılması gerekmez.

## Koordinasyon

Koordinatör kullanıcı isteğini kapsamlandırır, tek kaynak belgeleri kontrol eder, çakışan önerileri uzlaştırır, değişiklikleri uygular ve doğrulama durumunu raporlar. Uzman incelemeleri tavsiye üretir; kullanıcı kapsamı, repository talimatları ve mevcut uygulama kanıtı üstündür.

## Çatışma sırası

Roller çeliştiğinde sıra: (1) kullanıcı kapsamı ve `AGENTS.md`; (2) gizlilik, erişim kontrolü ve veri silme; (3) mimari sınırlar; (4) doğruluk (iddia, destek sınırı, test kanıtı); (5) kullanıcı deneyimi ve SEO; (6) kapsam kolaylığı. Süre/maliyet ile doğruluk çatışırsa doğruluk kazanır; bir kalite kapısının zorunlu mu bilgi amaçlı mı olacağı kullanıcı kararıdır, quality-ops yalnızca kanıtı ve kabul kriterini yazar. Çözülemeyen çatışma gerekçesiyle kullanıcıya götürülür; koordinatör sessizce seçmez.

## Şiddet ölçeği

- **Yüksek:** veri sızıntısı veya süre dolumu/erişim kontrolü ihlali, mimari sınır ihlali, kanıtsız destek iddiası, kullanıcıyı engelleyen akış hatası, geri alınamaz operasyon riski.
- **Orta:** doğrulanmamış ama makul risk (kapasite, eksik test, erişilebilirlik sorunu), tutarsız içerik veya hreflang.
- **Düşük:** okunabilirlik, tutarlılık, küçük içerik/stil sorunu.

## Roller

| Rol | Sorumluluk | Öncelikli kaynaklar |
|---|---|---|
| Mimari | Katman/modül sınırları, bağımlılık yönü, god file riski, modüler monolith kararları | `docs/ARCHITECTURE.md`, `docs/MODULES.md`, `docs/CODING-STANDARDS.md` |
| Backend ve belge işleme | API, jobs/files/usage sözleşmeleri, worker, motor adaptörleri, gizlilik ve kaynak sınırları | `docs/API.md`, `docs/DATA-MODEL.md`, `docs/FILE-PROCESSING.md`, `docs/ENGINE-SUPPORT.md` |
| Frontend ve kullanıcı deneyimi | Astro/Svelte sayfa akışları, erişilebilirlik, dil, SEO bileşenlerinin arayüzle ilişkisi | `docs/USER-FLOWS.md`, `docs/DESIGN-SYSTEM.md` |
| SEO ve analitik | Canonical/hreflang, içerik rotaları, Search Console ve izinli PostHog ölçümü | `docs/SEO.md`, `docs/POSTHOG.md`, `docs/CONTENT-SEO-CHECKLIST.md` |
| Kalite ve operasyon | Test kanıtı, CI, dağıtım, kapasite, izleme, yedekleme ve geri yükleme | `docs/TESTING.md`, `docs/DEPLOYMENT.md`, `docs/ROADMAP.md` |
| Koordinatör | Çok rollü görevleri kapsamlandırma, bulguları uzlaştırma, uygulama ve doğrulama raporu | Bu dosya, `AGENTS.md` |

Gizlilik/erişim/süre dolumu sahibi backend rolüdür; içerik ve iddia doğruluğu sahibi SEO ve analitik rolüdür. Mimari ve kalite/operasyon rolleri salt incelemedir; düzeltmeyi koordinatör veya sahip rol yapar. Bu politika tek başına teknik erişim kısıtı değildir. Bulgu önemleri yukarıdaki ölçekle verilir.

## Rol adları ve çağrı

| Rol | Ajan adı (`subagent_type`) |
|---|---|
| Mimari | `doctorconverter-architecture` |
| Backend ve belge işleme | `doctorconverter-backend` |
| Frontend ve kullanıcı deneyimi | `doctorconverter-frontend` |
| SEO ve analitik (içerik doğruluğu dahil) | `doctorconverter-seo-analytics` |
| Kalite ve operasyon | `doctorconverter-quality-ops` |
| Koordinatör | `doctorconverter-coordinator` |

İş türüne göre rol seç: worker retry ve fiziksel silme backend; modül sınırı mimari; araç sayfası frontend; hreflang SEO; CI hatası kalite; çok modüllü özellik koordinatör ve ilgili sahipler. Devirlerde hedef, dosya kapsamı, bağımlılıklar, çıktı, kabul ölçütü ve doğrulama yöntemini belirt. Gereksiz delegasyon yapma. Bağımsız salt incelemeler paralel olabilir; bağımlı görevler ve ortak dosyalar sıralanır. Alt ajan desteklenmiyorsa ilgili kanonik rolü ana oturumda sırayla uygula; bağımsız yürütme iddia etme.

## Çalışma anlaşması

1. Önce kullanıcı isteğini ve ilgili tek kaynak belgeleri oku; hedefi uygulanmış gerçek gibi sunma.
2. Mimari değerlendirmede ölçülebilir bulgu ver: dosya/alan, çağrı yönü, sorumluluk, risk ve kanıt.
3. İnceleme ile değişikliği ayır. Salt inceleme isteğinde kod değiştirme; uygulama isteğinde gerekli küçük ve ilişkili düzeltmeleri tamamla.
4. Birden fazla rolün çalışması gerekiyorsa önce ayrı bulgular topla, sonra koordine et; mükerrer altyapı ya da çelişen sahiplik üretme.
5. Dosya içeriği, sırlar veya kullanıcı verileri loglara, görevlere ya da analitiğe girmez. Gerçek belgeler fixture olarak eklenmez.
6. Etkilenen kontrolleri çalıştır ve yalnızca gerçekten çalıştırılmış olanı geçti diye bildir. Canlı ortamda geri döndürülemez veya maliyetli değişiklik yapma; kullanıcı yetkisi ve güvenli işlem planı gerekir.
7. Kalıcı mimari karar değişikliği ilgili tek kaynak belgeye yazılır; ekip kataloğu her ayrıntıyı kopyalamaz.

## Platformlar ve izinler

Kanonik yönergeler yalnızca docs/agent-roles/doctorconverter-*.md altındadır. .claude/agents/, .codex/agents/ ve .gemini/agents/ yalnız ilgili rolü yüklemeyi isteyen ince adaptörlerdir. Diğer ortamlarda AGENTS.md, bu belge ve seçilen rolü açıkça okut. Kullanıcı klasöründeki eski doctorconverter skill kopyaları kanonik değildir.

- Claude Code: proje ajanları; /agents ile kontrol et. Mimari ve kalite adaptörleri Read, Grep, Glob ile sınırlıdır; shell yoktur.
- Codex: proje .codex/agents/*.toml tanımları desteklenen sürümlerde keşfedilir. Politika salt okuma için teknik garanti değildir; izinler üst oturumdan gelir.
- Gemini CLI: GEMINI.md proje kurallarını içe alır; /agents ve /agents reload ile ajanları yönet. İnceleme rollerinde read_file, grep_search, glob listelenir. Alt ajanlar başka alt ajan çağıramaz; koordinasyonu ana oturum yapar.
- Cursor kök AGENTS.md desteği sunar. GitHub Copilot için .github/agents/ ince adaptörleri vardır; agent desteği yüzeye göre değişir. Copilot CLI alt ajanları proje kurallarını varsayılan olarak devralmayabilir, adaptör ilgili dosyaları okumayı ister; çalışma zamanı doğrulanmalıdır. Cline ve Windsurf için sürüm ve yapılandırmaya göre proje yönergelerini doğrula; otomatik rol keşfi varsayma. Genel yöntem: AGENTS.md, TEAM ve ilgili rolü açıkça oku.

Politika, araç kısıtı ve ortam/sandbox kısıtı farklıdır; hiçbir adaptör secret veya üretim izni vermez. Keşif, sözdizimi doğrulaması ve gerçek ajan çalışması farklı kanıtlardır. Sürüm ve yapılandırmayı kontrol et; erişilemeyen kaynakları ve doğrulanmamış yetenekleri raporla.

## Kabul ve raporlama

Güncel kod, yapılandırma, gözlenen test, tarihli audit, politika, plan ve varsayımı ayır. Anlamlı bulguda alan, önem, kanıt, etki, öneri, sahip, doğrulama ve durumu belirt; küçük görevlerde uzun rapor zorunlu değildir. İş bitiminde uygulananlar, doğrulananlar, kısmen doğrulananlar, engeller, ertelenenler ve kullanıcı kararlarını bildir. Belge ile kod çelişkisini kanıtla; sessizce çözülmüş sayma.

## İlk ortak değerlendirme

Bu bölümdeki satır sayıları ve kapasite rakamları 25 Ekim 2026 ölçümüdür; kullanmadan önce yeniden ölç.

Mevcut yapıda API, worker ve engine ayrı entrypoint'lere sahip; Render API servisi bunları tek container'da başlatıyor. Backend kaynak dosyalarının çoğu küçük; `analytics/infrastructure/repository.ts` 251 satırla (27 Ekim 2026 ölçümü) backend'de en uzun ölçülen kaynak dosyası. Frontend'de `apps/web/src/lib/seo/scenarios-tr.ts` (663), `apps/web/src/i18n/ui.ts` (652), `apps/web/src/lib/seo/scenarios-en.ts` (649), `apps/web/src/lib/seo/scenarios-tr-deep.ts` (491) ve `apps/web/src/lib/tool-seo.ts` (324) uzun içerik/veri dosyalarıdır; satır sayısı tek başına god file kanıtı değildir.

İlk odaklar:

1. Uzun SEO/i18n veri kümelerinin üretim/yerelleştirme kaynak sınırlarını incele; davranış ve içerik doğrulamasını koruyarak gerekirse araç/kategori bazında böl.
2. Live Render yerleşiminde API, worker ve engine'in ortak 0.1 CPU / 512 MB sınırını kapasite riski olarak kabul et; üretim yük testi ve ayrı kaynak bütçesi kararı olmadan başarı iddiası verme.
3. Kuyruk ve cleanup ölçümleri yönetici API’sinde bulunur; dashboard ve otomatik alarm kanıtını ayrıca doğrula. Health readiness DB, engine ve worker heartbeat kapsamındadır.
4. Harici veritabanı sağlayıcısı/yedek kapsamı doğrulanmadan canlı yedek veya geri yükleme işlemi yapma.

Bu değerlendirme başlangıç envanteridir; ürün kodunun bu adımda değiştirilmesi anlamına gelmez.
