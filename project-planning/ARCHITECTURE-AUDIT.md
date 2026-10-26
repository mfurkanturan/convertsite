# Mimari ve kod sağlığı başlangıç denetimi

Tarih: 2026-10-26  
Kapsam: repository yapısı, sahiplik/katman belgeleri, dosya boyutları ve dağıtım bilgisi. Bu bir statik ilk taramadır; tam dependency graph, runtime profiling veya tüm dosyaların satır satır incelemesi değildir.

## Özet puanlar

Puanlar 1 (yüksek risk/eksik) ile 5 (iyi kanıtlanmış) arasındadır. Mimari kaliteyi otomatik ölçen mutlak notlar değildir.

| Alan | Puan | Bulgular |
|---|---:|---|
| Katman ve modül tasarımı | 4/5 | Backend modülleri `files`, `jobs`, `usage`, `conversions`, `pdf-operations`, `ocr`; public sözleşme dosyaları var. Katman/import kontrolleri mevcut. |
| God file / god object riski | 4/5 | Backend kaynaklarında 250 satırı aşan dosya görünmedi; en büyüğü analytics repository 183 satır. Web'deki en uzun dosyalar içerik/i18n verisi; otomatik parçalama gerektirmez, sahiplik ve değişim sıklığı incelenmeli. |
| API/worker/engine çalışma ayrımı | 2/5 | Kodda ayrı entrypoint'ler var; Render'da API+worker+engine tek ücretsiz container'da, 0.1 CPU/512 MB ortak sınırla çalışıyor. |
| Gözlemlenebilirlik | 2/5 | `/api/health/ready` DB, engine, son 20 saniye worker heartbeat kontrolü yapıyor. Kuyruk yaşı, iş hata oranı ve cleanup gecikmesi metriği/uyarısı yok. |
| Kalite ve test kanıtı | 4/5 | Tip/import/build/Playwright ve gerçek DB/worker/motor entegrasyon akışları tanımlı; kapsam dışı ve açık başarısızlıklar TESTING'de belirtilmiş. |
| Üretim operasyon hazırlığı | 2/5 | Render çalışıyor fakat kapasite ve metrik geçmişi doğrulanmamış; dış DB sağlayıcısı, otomatik yedekleme/PITR ve üretim restore bilinmiyor. |

## Yapısal envanter

- Workspace: `apps/web` Astro/Svelte, `apps/server` Fastify/worker/engine, `packages/contracts` istemci-sunucu sözleşmeleri.
- Backend: giriş noktaları (`entrypoints`), bağımlılık kurma (`bootstrap`), modül içindeki application/domain/infrastructure/presentation katmanları ve platform adaptörleri ayrılmış.
- İş kuyruğu PostgreSQL/pg-boss kullanıyor; dosya baytları DB dışı özel depolamada kalıyor. HTTP dönüşümü doğrudan çalıştırmıyor.
- Frontend: sayfalar, ortak bileşenler, i18n, SEO içerik modülleri ve tasarım token'ları ayrılmış. SEO/i18n dosyaları uzun; veri kümelerinin bölünmesi editoryal sahiplik ve tüketim biçimiyle birlikte değerlendirilmelidir.
- İlk taramada `docs/SEO.md` yalnızca üç dili listeliyordu; uygulamadaki FR/HI rotaları ve sözlük kaynaklarıyla tutarsızlık aynı çalışmada düzeltildi.
- 16 araç kaydı var; ENGINE-SUPPORT / ENGINE-AUDIT kalite ve kullanılabilirlik kanıtı açısından ayrı tutuluyor. Kayıt sayısı eşit destek anlamına gelmiyor.

## Öncelikli işler

### P0 — Canlı çalışma güvenilirliği

1. Veritabanı sağlayıcısını gizli bağlantı değerini açmadan belirle; otomatik backup/PITR ve saklama süresini doğrula.
2. Render API+worker+engine birleşik servis için temsil edici yük testiyle CPU/RAM/restart ölç; ücretli plan veya servis ayrımı ancak maliyet ve mimari etkisi karşılaştırıldıktan sonra kararlaştırılsın.
3. `/api/health/ready` için dış izleme ve Render unhealthy/deploy bildirimlerini doğrula.

### P1 — Runtime işletim sinyalleri

1. Queue oldest age ve worker throughput/error sayacı.
2. Job sonuçları için araç bazında başarılı/başarısız süre ve kod agregaları; dosya adı, belge içeriği, parola veya sahiplik anahtarı olmadan.
3. Cleanup bekleyen dosya sayısı/en eski gecikme ve temizlik hata sayacı.
4. Bu ölçümleri doğruladıktan sonra gerçek trafik ve hata tabanına göre uyarı eşikleri.

### P2 — Uzun frontend içerik dosyaları

1. `scenarios-tr.ts` ve `scenarios-en.ts` hangi tüketicilerce yüklendiğini ve tam içerik/rehber metadata sahipliğini izle.
2. Bölme yapılacaksa aynı public export'u ve slug/canonical/hreflang eşleşmelerini koruyan konu bazlı veri modülleri kullan.
3. `ui.ts` ana dil sözlüğünü mevcut i18n bağlamını bozmadan alt sözlüklere ayırma gereksinimini değerlendir; sadece satır sayısı nedeniyle değiştirme.

## Takip tablosu

Sahip sütunu kişi değil, `docs/TEAM.md` içindeki rolü gösterir. Kişi atamasını kullanıcı yapar. Her madde kapanmadan "tamamlandı" işaretlenmez.

| Madde | Sahip rol | Durum | Kapanış kanıtı |
|---|---|---|---|
| P0.1 Veritabanı sağlayıcısı, backup/PITR | Kalite ve operasyon | Açık | Sağlayıcı ekran görüntüsü veya yazılı ayar; saklama süresi; izole restore sonucu |
| P0.2 Birleşik servis yük testi | Kalite ve operasyon | Açık | CPU/RAM/restart ölçümü; maliyet ve servis ayrımı karşılaştırması |
| P0.3 Health izleme ve deploy bildirimi | Kalite ve operasyon | Açık | Dış izleme kaydı; Render bildirim ayarı |
| P1.1 Kuyruk yaşı ve son saat sayaçları | Backend ve belge işleme | Tamamlandı (PR #5) | `/api/admin/stats` → `queue`; geçici PostgreSQL'de doğrulandı, tam test çalıştırıldı |
| P1.2 Araç bazlı iş süresi | Backend ve belge işleme | Tamamlandı (PR #6) | `started_at`/`finished_at` (0007); ortalama ve p95 süre; 0007 öncesi işler dışarıda |
| P1.3 Cleanup gecikmesi ve hata sayacı | Backend ve belge işleme | Tamamlandı (PR #6, #8 bekliyor) | Bekleyen dosya sayısı ve en eski gecikme (#6); ardışık hata sayacı (#8, 0008 migrasyonu) |
| P1.4 Uyarı eşikleri | Kalite ve operasyon | Açık | Ölçülmüş taban verisine dayalı eşikler (P1.1–P1.3 bitmeden başlamaz) |
| P2.1–P2.2 İçerik dosyaları bölme | Frontend ve UX, SEO ve analitik | Açık | Public export ve slug/canonical/hreflang eşleşmesinin korunduğu kontrol |
| P2.3 UI sözlük ayrımı | Mimari, Frontend ve UX | Açık | Değerlendirme notu; satır sayısı tek başına gerekçe olmaz |

## Açık riskler ve sınırlar

- Render Metrics ekranı denetim sırasında son 48 saat için CPU/RAM verisi göstermedi; mevcut grafikten gerçek kullanım sonucu çıkarılamaz.
- `DATABASE_URL` secret olarak tutuluyor ve blueprint dışında elle girilmiş. Sağlayıcı veya yedekleme durumu bu denetimde doğrulanmadı.
- `/tmp/data` kalıcı disk değildir; belge içeriği kalıcı DB metadata yedeğine eklenmemelidir.
- Mevcut test belgesi, timeout sınıfı uyumsuzluğu ve disk dolması/çoklu worker/backup restore gibi açık test ihtiyaçları bildiriyor.
- Önceden var olan `file-list.svelte`, `icon.svelte` ve mimari/roadmap/stack dokümanı değişiklikleri korunmuştur; bu denetim bunları commit etmez.
- Graphify knowledge graph mevcut ve 1,622 node içeriyor. Mimari soruyla yapılan BFS sorgusu modül sınırları ve no-god-file kuralını buldu; ilişkiler heuristik olduğundan tam dependency audit yerine geçmez.

## Sonraki denetim geçişi

Önce P0 veri sağlayıcısı ve backup kanıtı netleştirilsin. Ardından yalnızca bir operasyon ölçüm dilimi seçilsin (queue oldest age + iş sonuç sayaçları başlangıç için). Sonrasında metrik eklenip gerçek yük altında doğrulansın; geniş çaplı dosya bölme/refactor bu ölçümlü önceliklerden sonra ele alınsın.
