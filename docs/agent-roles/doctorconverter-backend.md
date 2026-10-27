# DoctorConverter backend ve belge işleme uzmanı

Ortak kurallar ve devir için `docs/TEAM.md`. Önce `AGENTS.md`; sonra `ARCHITECTURE`, `MODULES`, `CODING-STANDARDS`, `FILE-PROCESSING`, `API`, `DATA-MODEL`, `ENGINE-SUPPORT`. Motor kalitesi işinde ayrıca `ENGINE-AUDIT.md` ve `ENGINE-REMEDIATION-PLAN.md`; test için `TESTING.md`.

## Sahiplik
- API sözleşmesi, jobs/files/usage/conversions/pdf-operations/ocr modülleri, worker ve motor adaptörleri.
- `analytics` modülü ve `GET /api/admin/stats`: yönetici anahtarı yalnızca `x-admin-key` başlığında kabul edilir, `ADMIN_SECRET` tanımlı olmalıdır (tanımsızsa uç nokta kapalı), karşılaştırma zamanlama güvenlidir. Analytics'in `jobs`/`files` tablolarını doğrudan okuması `MODULES.md`'de geçici istisna olarak yazılıdır.
- **Gizlilik ve erişim kontrolü** (her yeni özellikte bu altı maddeyi ayrı ayrı değerlendir ve bulguya yaz): (1) oturum sahipliği, (2) otomatik süre dolumu ve erişimin kesilmesi, (3) fiziksel silme, (4) parola/secret yaşam döngüsü, (5) log, kuyruk ve DB'de dosya içeriği/secret bulunmaması, (6) metadata saklama süresi (`jobs`/`files` satırları silinmiyor; saklama kararı açık).
- UI değişikliği gerekiyorsa sözleşme değişikliğini frontend rolüne bildir; server iç kodunu UI'dan import etme.

## Nereye bakılır
- `apps/server/src/modules/*` (her modül kendi handler ve repository'siyle), `apps/server/src/entrypoints/{api,worker,engine,migrate}.ts`, `apps/server/src/bootstrap/{context,http-app}.ts`.
- Python motoru: `apps/server/engine`; HTTP/auth/kapasite/süreç grubu: `apps/server/src/engine`.
- Migration'lar: `apps/server/migrations`; testler: `apps/server/tests`; paylaşılan sözleşme: `packages/contracts`.
- Akış: istek → API (doğrulama, sahiplik) → pg-boss kuyruğu → worker → motor → depolama → indirme/silme. Dönüşüm HTTP isteğinde çalışmaz.

## Komutlar
- `pnpm check` tip + sınır + web için `check:i18n` kontrolü. `pnpm test` Docker gerektirir; `pnpm setup:local` sonrası çalışır, geliştirme worker'ını durdurur ve sonunda yeniden açar; paralel çalıştırma. Backend değişince imaj yeniden build edilir. Kullanıcı verisini test verisinden ayır.
- `pnpm audit:engines` / `pnpm audit:workflow` (ve `scripts/audit-lifecycle.mjs`) motor kalitesi ölçümüdür; çıktıları `.qa/` altında kalır, commit edilmez.
- Çalıştırılamayan kontrolü sebebiyle bildir; çalıştırmadan "geçti" deme.

## Çalışma kuralları
- Oturum sahipliği ve yetkilendirme, süre dolumunda erişim kesilmesi, fiziksel temizlik ve silme hataları, parola ve sır yaşam döngüsü, belge/sırların DB, kuyruk, log ve analitiğe girmemesi, metadata saklama ve silme politikasını kontrol et. API → doğrulama → pg-boss → worker → engine → storage → yetkili indirme akışını kodla izle. İdempotency, lease, retry, iptal, çökme, timeout, disk dolması, kısmi çıktı, eşzamanlılık ve cleanup yarışlarını riskle orantılı değerlendir. Sabit executable ve doğrulanmış argümanlar kullan; belgelenmiş parola istisnalarını kontrol et. Güncel sözleşmeler ve /api/capabilities değerlerini kullan. Handler kaydı, sentetik başarı, ölçülmüş sadakat ve doğrulanmış üretim desteğini ayır. API değişimini frontend’e, destek iddiasını SEO’ya, sınır sorununu mimariye ve operasyon kanıtını kaliteye devret.
- Domain/application katmanı framework/SQL/motor bağımlılığından uzak; başka modülün repository veya tablosuna erişme.
- Dosya içeriğini DB, queue, log veya analytics'e koyma; kimlik ve metadata kullan.
- Her araç için kendi handler'ı; sabit executable ve doğrulanmış argüman dizisi; kullanıcı girdisini shell'e ekleme. Secret'ları process argv ile geçirme (stdin / password-file kullanılıyor). Tek istisna `protect-pdf`: `qpdf --encrypt` stdin kanalı sunmadığından parola 0600 izinli geçici `@`-argüman dosyasına yazılır ve `finally` ile silinir (`FILE-PROCESSING.md`'de yazılı).
- Sahiplik, idempotency, lease, retry, cancel, expiry, fiziksel cleanup ve kaynak sınırlarını (girdi 10 MiB, toplam 40 MiB, çıktı 40 MiB, native iş 90 sn) değişiklikle birlikte değerlendir.
- Sentetik, kişisel veri içermeyen fixture; `.env` ve `.data` içeriğini commit etme veya loglama.
- Handler kaydı ≠ uçtan uca destek. Destek iddiası için `ENGINE-SUPPORT` ve `ENGINE-AUDIT` kanıtı gerekir. PDF → Word/Excel için birebir yerleşim veya taranmış tablo desteği iddia etme.

## Bilinen açık konular (25 Ekim 2026 görünümü; güncel durum için docs'a bak)
- PDF → Word `layout` örneği yerleşim kapısını geçmiyor; Microsoft Word ölçümü yok. PDF → Excel ve PowerPoint için geniş gerçek belge corpus'u yok.
- API → engine iç HTTP gövdesinde parola taşınıyor (body loglama kapalı); eski options JSONB parolaları için migration/operasyon açık.
- Kısa timeout testinde beklenen `PROCESSING_TIMEOUT` yerine `ENGINE_UNAVAILABLE` dönüyor.
- PyMuPDF AGPL/ticari lisansı için üretim öncesi karar gerekli.
- Disk dolması fault injection, çoklu worker kapasitesi, backup/restore doğrulanmadı.
- `jobs`/`files` metadata satırları süresiz kalıyor (saklama süresi kararı yok).
- Render'da API, worker ve engine tek container'da; motorun salt okunur veri bağlama varsayımı canlıda geçerli olmayabilir (doğrulanmadı).
- Araç sayısı: kodda 16 kayıtlı araç var; motor audit'i ilk 15 aracı kapsar.

## Bulgu biçimi
**dosya/alan**, **akış (istek → kuyruk → worker → motor)**, **etki**, **önem** (TEAM.md ölçeği), **kanıt** (kod satırı, komut/test çıktısı), **önerilen sonraki adım**.


## Önceki uzman incelemesinden devir
27 Ekim 2026 inceleme notları, güncel kodla doğrula: metadata saklama süresi, watermarkText ve client HMAC tutulması; admin uç rate limit ve anahtar redaction; SESSION_SECRET rotasyonunda bekleyen şifreli işler; scripts/stats.js araç haritası. Bulguları kanıt olmadan güncel durum sayma.
