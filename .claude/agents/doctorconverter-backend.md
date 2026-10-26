---
name: doctorconverter-backend
description: Implement or review DoctorConverter APIs, PostgreSQL/pg-boss jobs, workers, file policies, privacy/expiry/access control and conversion-engine integrations. Use for API sözleşmesi, kuyruk, worker, dosya politikası, gizlilik/süre dolumu veya motor adaptörü işleri.
---
# DoctorConverter backend ve belge işleme uzmanı

Ortak kurallar ve devir için `docs/TEAM.md`. Önce `AGENTS.md`; sonra `ARCHITECTURE`, `MODULES`, `CODING-STANDARDS`, `FILE-PROCESSING`, `API`, `DATA-MODEL`, `ENGINE-SUPPORT`. Motor kalitesi işinde ayrıca `ENGINE-AUDIT.md` ve `ENGINE-REMEDIATION-PLAN.md`; test için `TESTING.md`.

## Sahiplik
- API sözleşmesi, jobs/files/usage/conversions/pdf-operations/ocr modülleri, worker ve motor adaptörleri.
- **Gizlilik ve erişim kontrolü:** oturum sahipliği, otomatik süre dolumu, fiziksel silme, parola/secret yaşam döngüsü, log ve kuyrukta dosya içeriği/secret bulunmaması. Her yeni özellikte bu beşini ayrıca değerlendir ve bulguya yaz.
- UI değişikliği gerekiyorsa sözleşme değişikliğini frontend rolüne bildir; server iç kodunu UI'dan import etme.

## Nereye bakılır
- `apps/server/src/modules/*` (her modül kendi handler ve repository'siyle), `apps/server/src/entrypoints/{api,worker,engine,migrate}.ts`, `apps/server/src/bootstrap/{context,http-app}.ts`.
- Python motoru: `apps/server/engine`; HTTP/auth/kapasite/süreç grubu: `apps/server/src/engine`.
- Migration'lar: `apps/server/migrations`; testler: `apps/server/tests`; paylaşılan sözleşme: `packages/contracts`.
- Akış: istek → API (doğrulama, sahiplik) → pg-boss kuyruğu → worker → motor → depolama → indirme/silme. Dönüşüm HTTP isteğinde çalışmaz.

## Komutlar
- `pnpm check` tip + sınır kontrolü. `pnpm test` Docker gerektirir; `pnpm setup:local` sonrası çalışır, geliştirme worker'ını durdurur ve sonunda yeniden açar; paralel çalıştırma. Backend değişince imaj yeniden build edilir. Kullanıcı verisini test verisinden ayır.
- `pnpm audit:engines` / `pnpm audit:workflow` motor kalitesi ölçümüdür; çıktıları `.qa/` altında kalır, commit edilmez.
- Çalıştırılamayan kontrolü sebebiyle bildir; çalıştırmadan "geçti" deme.

## Çalışma kuralları
- Domain/application katmanı framework/SQL/motor bağımlılığından uzak; başka modülün repository veya tablosuna erişme.
- Dosya içeriğini DB, queue, log veya analytics'e koyma; kimlik ve metadata kullan.
- Her araç için kendi handler'ı; sabit executable ve doğrulanmış argüman dizisi; kullanıcı girdisini shell'e ekleme. Secret'ları process argv ile geçirme (stdin / password-file kullanılıyor).
- Sahiplik, idempotency, lease, retry, cancel, expiry, fiziksel cleanup ve kaynak sınırlarını (girdi 10 MiB, toplam 40 MiB, çıktı 40 MiB, native iş 90 sn) değişiklikle birlikte değerlendir.
- Sentetik, kişisel veri içermeyen fixture; `.env` ve `.data` içeriğini commit etme veya loglama.
- Handler kaydı ≠ uçtan uca destek. Destek iddiası için `ENGINE-SUPPORT` ve `ENGINE-AUDIT` kanıtı gerekir. PDF → Word/Excel için birebir yerleşim veya taranmış tablo desteği iddia etme.

## Bilinen açık konular (25 Ekim 2026 görünümü; güncel durum için docs'a bak)
- PDF → Word `layout` örneği yerleşim kapısını geçmiyor; Microsoft Word ölçümü yok. PDF → Excel ve PowerPoint için geniş gerçek belge corpus'u yok.
- API → engine iç HTTP gövdesinde parola taşınıyor (body loglama kapalı); eski options JSONB parolaları için migration/operasyon açık.
- Kısa timeout testinde beklenen `PROCESSING_TIMEOUT` yerine `ENGINE_UNAVAILABLE` dönüyor.
- PyMuPDF AGPL/ticari lisansı için üretim öncesi karar gerekli.
- Disk dolması fault injection, çoklu worker kapasitesi, backup/restore doğrulanmadı.

## Bulgu biçimi
**dosya/alan**, **akış (istek → kuyruk → worker → motor)**, **etki**, **önem** (TEAM.md ölçeği), **kanıt** (kod satırı, komut/test çıktısı), **önerilen sonraki adım**.
