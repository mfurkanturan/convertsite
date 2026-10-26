# PostHog kullanım ölçümü

23 Ekim 2026: PostHog EU, proje 318026. Bu entegrasyon ürün kullanımını ölçer; motorun çıktı kalitesini veya kesin kişi sayısını kanıtlamaz. Backend analytics modülü gerçek iş kayıtlarının kaynağı olmaya devam eder.

## Etkinleşme ve gizlilik

SDK yalnızca ziyaretçi açıkça izin verdikten sonra dinamik yüklenir. İlk tercihte ve reddetmede PostHog ağına istek yapılmaz. Alt bölümdeki Çerez tercihleri / Cookie preferences düğmesiyle geri çekilebilir. Tercih `dc-analytics-consent-v1` yerel depolama anahtarında tutulur; PostHog kimliği dosya erişim cookie'sinden ayrıdır. DNT/GPC sinyali varsa izin verilse bile toplama yapılmaz. Depolama erişilemezse kapalı kalır. Sekmeler arası tercih değişimi dinlenir; izin öncesi olaylar sonradan gönderilmek üzere biriktirilmez.

Bu tercih Google reklamları veya Cloudflare analitiği için bir CMP değildir. Mevcut reklam davranışı bu değişiklikte değiştirilmedi. PostHog'a yapılan isteklerin ağ adresini sağlayıcı görebilir; “hiç kişisel veri işlenmiyor” iddiası yoktur. Kullanıcı ve sağlayıcı gizlilik metinleri buna göre okunmalıdır.

Autocapture, session replay, heatmap, otomatik exception/performans, survey, product tour, conversation ve uzak feature flag yüklemesi kapalı. Tam Error Tracking stack trace entegrasyonu, feature flags, anket ve A/B testi bu aşamada etkinleştirilmedi. `client_error` yalnızca sabit hata kategorisidir; ham Error/message/stack göndermez. SDK'nın varsayılanlarıyla bu özellikleri sessizce açma.

`analytics-policy.ts` olay özelliklerini açık izin listesiyle filtreler. `analytics.ts` içindeki `before_send`, SDK zenginleştirmesini de yeniden filtreler: sorgu/hash/referrer, kampanya parametreleri, belge adı/içeriği, parola/seçenekler, job/file kimlikleri, API/download bağlantıları yoktur. URL olarak yalnızca statik canonical sayfanın yolu gönderilir. PostHog anonim kimliği, session/device kimlikleri ve sınırlı tarayıcı/ekran bilgileri gönderilebilir. Kişi profili üretimi kapalıdır. Anonim kimlik aynı insan olduğunun kanıtı değildir.

## Olay sözleşmesi

| Olay | Gerçek anlamı |
|---|---|
| `$pageview` | İzinli sayfa görüntülemesi; sorgu/hash yok |
| `tool_viewed` | Çalışma alanında açılan kayıtlı araç |
| `upload_completed` | Seçimdeki tüm dosyaların API tarafından kabul edilmesi |
| `conversion_requested` | API'nin job oluşturma isteğini kabul etmesi |
| `conversion_completed` | Tarayıcının job API'sinde succeeded gözlemlemesi |
| `conversion_failed` | Tarayıcının job API'sinde failed gözlemlemesi |
| `conversion_cancelled` | Tarayıcının job API'sinde cancelled gözlemlemesi |
| `download_clicked` | İndirme bağlantısına tıklama; diske kaydedilme kanıtı değil |
| `files_deleted` | Kullanıcının silme isteğinin kabulü; fiziksel silinme kanıtı değil |
| `client_error` | Sabit istemci hata kategorisi; ham hata veya belge bilgisi yok |

Özellikler: doğrulanmış tool ID, 1–20 file_count, sabit error_code, en/tr/es/hi/fr locale, development/production environment; locale HTML `lang` değerinin dil alt kodundan belirlenir. SDK izin listesi ayrıca kodda tanımlıdır. API sonucu hatalarında ham backend hata metni alınmaz. Sonuç olayı aynı job için tarayıcı sekmesinde yerel olarak tekilleştirilir; job kimliği dışarı taşınmaz.

Bu istemci ölçümü sekme kapalıyken biten işleri kaçırabilir. Restore edilen eski job sonucu o anda gözlemlenebilir. Reklam engelleyici/ağ kesintisi olay kaybına neden olabilir. İş sayısını ve başarı oranını kesin hesaplamak için backend jobs istatistiğini kullan; PostHog funnel tam bir muhasebe kaydı değildir. Worker'dan bağımsız completion yayını ve sunucuya rıza taşıma bu dilime dahil değildir.

## Yapılandırma ve dağıtım

- `PUBLIC_POSTHOG_KEY`: herkese açık proje ingestion token'ı. Hesapta görülen token kodda varsayılan ve render.yaml içinde bulunur; kişisel yönetim anahtarı değildir. Başka proje token'ına build ortamından yönlendirilebilir.
- EU host sabit: `https://eu.i.posthog.com`; yanlış bölgeye veri yönlendiren serbest runtime URL'si yoktur.
- `PUBLIC_POSTHOG_ENABLED=false`: frontend'i yeniden build ederek entegrasyonu kapatır.
- `PUBLIC_POSTHOG_LOCAL=true`: yalnızca ayrı yerel test sunucusunda kullan. Yerelde varsayılan kapalı. Bu modda environment=development, sıkıştırma kapalı ve sentetik browser testleri için bot filtresi devre dışıdır. Render'da bu değişkeni açma.

Üretimde varsayılan domain'ler doctorconverter.com ve www.doctorconverter.com. Statik build içinde ayarlar derlenir; Render runtime env değişikliği tek başına mevcut statik dosyaları değiştirmez. Render Blueprint kullanılıyorsa render.yaml değerlerini uygula; mevcut manuel serviste build ortamını/rebuild'i kontrol et. Varsayılan public proje token'ı sayesinde env eklenmese de doğru domain'de izin sonrası bağlantı çalışır. Bu değişiklik kendiliğinden push veya dağıtım yapmaz.

Kendi makinesinde SDK/sunucu veritabanı kurmaya gerek yoktur. Ücretsiz plan için ödeme bilgisi eklemek gerekmez; ürünleri ve kotaları PostHog Billing ekranından izle. Kota dolduğunda olay kaybı olabilir; dönüşüm hizmetinin çalışması PostHog'a bağlı olmamalıdır.

## Test ve dashboard

Kurulum doğrulaması: PostHog onboarding ekranında gerçek SDK'dan gelen sentetik `tool_viewed` olayıyla “Installation complete” görüldü. Free plan seçildi; kart, davet veya ek veri kaynağı eklenmedi. Panelde autocapture/heatmap/web vitals kapatıldı, Session Replay reddedildi. Sentetik ve API'si mock olan yerel akış EU ingestion'dan üç HTTP 200 aldı (`.qa/posthog-live-smoke.json`); bu gerçek motor çalışması değildir. Analitik Playwright suite'i masaüstü ve mobilde 10/10 geçti; web check sıfır hata/uyarı, web build 104 sayfa ile geçti. Büyük chunk/PDF.js legacy uyarıları build'i engellemedi.

Başlangıç dashboard'u: [DoctorConverter paneli](https://eu.posthog.com/project/318026/dashboard/1050178). Dashboard varsayılanı `environment = production` olarak kaydedildi; canlıya dağıtım öncesinde boş görünmesi beklenir. Geliştirme olayları gerçek ziyaretçi trafiği gibi yorumlanmamalı.

Dashboard'daki başlangıç etkileşim hunisi `DoctorConverter — Dönüşüm akışı` olarak güncellendi ve kaydedildi: tool_viewed → upload_completed → conversion_requested → conversion_completed → download_clicked. Dönüşüm penceresi 30 dakika, sıralı adımlar ve anonim unique user sayımıdır; kesin tek job veya aynı araç işlemi eşleştirmesi değildir. Funnel'ın kendi kalıcı production filtresi de vardır. Diğer başlangıç template kartlarının bir kısmı (ör. referrer) kapalı toplama özelliklerine dayandığı için boş kalabilir; bunlar veri varmış gibi yorumlanmamalı.

Kendi/test trafiği gerçek kullanıcıdan PostHog anonim kimliğiyle tek başına ayırt edilemez. Bu nedenle bilinmeyen bir kimliği iç trafik diye dışlama. `environment=development` filtresi yalnızca yerel geliştirme olaylarını ayırır; üretim alan adındaki site sahibi testlerini otomatik tanımaz. Dışlama veya IP tabanlı filtre ancak sahiplik ve kullanılan mekanizma doğrulandıktan sonra, veri minimizasyonu değerlendirilerek yapılmalıdır. Dashboard sayıları yalnızca analitik izni veren ve tarayıcı engeline takılmayan ziyaretçileri kapsar.

Özel yerel sunucu: PowerShell'de `$env:PUBLIC_POSTHOG_LOCAL='true'; pnpm --filter @convertsite/web exec astro dev --host 127.0.0.1 --port 4325`.

İkinci terminalde `$env:POSTHOG_E2E='1'; $env:PLAYWRIGHT_BASE_URL='http://127.0.0.1:4325'; pnpm exec playwright test e2e/analytics.spec.ts`. Bu suite PostHog ağını yerelde intercept eder; sentetik denemeler dışarı gitmez. Reddetme/yenileme, izin/geri çekme, query ve unsafe property sızıntısı, DNT/GPC, beş arayüz dilinde locale, API başarı/başarısızlık sonucu ve tekrar sonuç sayımını test eder. API dönüşüm sonuçları fixture'dır; gerçek motor E2E testinin yerine geçmez.

Panelde production filtresiyle başlangıç dashboard'u:

1. `$pageview` trendi, günlük toplam ve anonim distinct ID sayısı.
2. Kaydedilmiş beş adımlı funnel; ihtiyaç oldukça tool kırılımı eklenebilir. Mevcut pencere 30 dakika; bu ayar tek oturum veya tek job garantisi değildir.
3. `conversion_failed` sayısı tool kırılımı; client_error kategorileri ayrı grafikte.
4. Mobil/masaüstü ve en/tr/es/hi/fr kırılımları. İlk sürüm referrer/UTM toplamadığı için kanal ilişkilendirmesi vaat edilmez.

Gerçek PostHog doğrulamasında yalnızca sentetik development olayları gönder; ziyaretçi belgeleriyle test etme. Üretim dashboard'unda `environment = production` filtresini sabitle. Feature flag veya replay'i panelden seçmek, güvenlik nedeniyle kapalı SDK ayarlarını açmaz; yeni özellik ayrıca kod/test ve gizlilik değerlendirmesi ister.

## Canlıya alma kontrolü — 26 Ekim 2026

- Canlı panoda son 30 günde 1 anonim aktif kullanıcı, son 7 günde 7 oturum ve 52 sayfa görüntülemesi göründü. Bunlar yalnızca analitik izni veren ve engelleyiciye takılmayan ziyaretçilerdir; kesin toplam trafik veya dönüşüm sayısı değildir.
- Son 7 günlük Activity akışında aynı anonim kimliğin kısa sürede Türkçe ve İspanyolca sayfaları dolaştığı görülüyor. Bu, site testi olabilir; kimlik anonim olduğu için sahibini kanıtlamaz. Activity ve Persons ekranlarındaki “Filter out internal and test users” anahtarı kapalıydı. `environment = production` filtresi yerel geliştirme olaylarını ayırır, canlı sitedeki manuel testleri ayırmaz. Sahipliği doğrulanmayan kimlikleri filtreleme ve IP tabanlı dışlama ekleme.
- Canlı İspanyolca sayfa görüntülemesinde `/es/...` URL'si için `locale=en` görüldü. Bu, mevcut canlı build'in düzeltme öncesi olduğunu gösterir. Kaynaktaki locale düzeltmesi beş dil için yerel yakalamalı testte doğrulandı; dağıtımdan sonra her dilde yeni bir sayfa görüntüleme olayının `locale` değerini kontrol et. Eski olaylar geriye dönük düzeltilmez.
- Canlıya alma öncesi geçişte test olayları PostHog'a gönderilmez. Dağıtım sonrası yalnızca yeni olayların dil özelliklerini kontrol et; dosya veya iş verisiyle test etme.

Resmi kaynaklar: [Astro kurulumu](https://posthog.com/docs/libraries/astro), [SDK ayarları](https://posthog.com/docs/libraries/js/config), [funnel](https://posthog.com/docs/product-analytics/funnels), [ücretsiz kotalar](https://posthog.com/pricing).
