# Veri modeli

Gerçek şemanın kaynağı `apps/server/migrations` altındaki SQL dosyalarıdır. Runner advisory lock altında sıralı migration'ları uygular; app_migrations kimlikleri tekrar uygulanmayı engeller.

| Tablo | Sahibi | Veri |
| --- | --- | --- |
| files | files | UUID, owner hash, client (yüklemede ağın anahtarlı IP özeti), kind, size/pages, pending/ready/deleted, expiry, purged |
| jobs | jobs | UUID, owner, tool/state, options JSONB, sıralı input_ids, output_id, idempotency key/hash, attempt, error, deleted, tarihler, `started_at` ve `finished_at` (0007 öncesi işlerde boş; süre metriklerinde dışarıda kalır) |
| job_secrets | jobs | İşe bağlı AES-256-GCM şifreli geçici parola ve expiry; başarılı/başarısız/iptal/süre dolumu/maintenance temizliğinde silinir |
| usage_accounts | usage | Owner başına active_jobs |
| worker_heartbeats | işletim | Worker adı ve son görülme |
| app_migrations | işletim | Uygulanan sürümler |
| pgboss şeması | pg-boss | Kalıcı teslim ve tekrar kayıtları |

Dosya baytları DB veya kuyruğa girmez. Disk adı geriye uyumluluk için hâlâ UUID.pdf olsa da bayt türü kind alanından belirlenir; bu uzantı kullanıcıya sunulmaz. Orijinal ad saklanmaz. Kuyruk yalnızca job UUID'si taşır. Owner imzalı anonim oturumun SHA-256 özetidir. 0003 migration'ı eski kayıtlara pdf kind ve boş options atar.

## Atomik kabul

Usage satırını kilitle → idempotency kontrolü → files açık portuyla girdileri kilitle → boyut/sayfa/kullanım kontrolü → kota rezervasyonu → girdi süresini koru → jobs ve pg-boss kaydı → commit.

Drizzle repository ve pg-boss executeSql adaptörü aynı pg client transaction'ını kullanır. Kuyruk hatasında iş/kota rollback'i entegrasyon testindedir. PDF parolası yalnızca job_secrets içinde şifreli tutulur; kuyruk yalnızca iş UUID'sini taşır ve worker tamamlanınca/başarısız olunca/iptal edilince temizlenir.

Her worker denemesi yeni attempt alır. Çıktı önce özel diske yazılır, sonra yalnızca hâlâ running olan aynı attempt sonucu yayımlar. İptal/expiry/yeni attempt eski sonucu engeller. Kota yalnızca başarılı koşullu bitişte bir kez bırakılır.

Files deleted erişimi keser; purged fiziksel temizliği ayrı izler. Silme/expiry taraması indekslidir. Jobs `(owner,idempotency_key)` unique anahtarı, owner/expiry/input dizisi indeksleri ve output foreign key'i vardır.

Input'lar ilk dilimde UUID dizisidir; ayrı ilişki tablosu/foreign key henüz yoktur. Uygulama transaction'ları referansları korur. Uzun vadeli metadata prune ve checksum alanı henüz eklenmedi. Dosya içerikleri metadata'da bulunmaz.

## Geçici PDF parolaları ve eski metadata

Yeni işler parolayı `jobs.options` içine yazmaz. `job_secrets` içindeki ciphertext SESSION_SECRET'tan türetilen anahtarla AES-256-GCM şifrelenir; TTL worker maintenance tarafından da süpürülür. Kuyruk kaydı yalnızca iş UUID'sidir. SESSION_SECRET rotasyonundan önce parola bekleyen işler tamamlanmalı veya iptal edilmelidir; aksi halde ciphertext çözülemez.

`0005_job_secrets.sql` eski `jobs.options.password` değerlerini otomatik silmez. Böyle bir metadata varsa üretim temizliği ayrı operasyon olarak yapılmalıdır: değerleri seçmeden yalnızca eşleşen satır sayısını ölç; önceki uygulamadan kalan queued/running ve pg-boss retry durumlarını belirle; bekleyen parola işlerini güvenli biçimde tamamla/iptal et; ardından ileri migration ile `options = options - 'password'` uygula ve yalnızca kalan alan sayısını doğrula. Eski DB yedekleri migration ile değişmez; erişimleri ve saklama süreleri ayrıca ele alınmalı, gerçek parola değerleri teşhis çıktısına alınmamalıdır.
