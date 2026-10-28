# API — ilk backend dilimi

Kod sözleşmesinin kaynağı `packages/contracts/src/index.ts` ve tools.ts. OpenAPI üretimi henüz eklenmedi. Tarayıcı aynı origin altındaki `/api` yolunu kullanır. 17 araç kimliği ve araca özel options şeması kayıtlıdır. Akış engelleri ve kalite sonuçları ENGINE-AUDIT içinde izlenir.

## Erişim ve hata modeli

İlk istek imzalı HttpOnly anonim oturum cookie'si verir. Path `/api`, SameSite Strict; üretim modunda Secure. Sahiplik cookie'den türetilir; iş UUID'si yetki vermez. Başka oturumun kaynağı 404 döner.

Değişiklik yapan isteklerin Origin değeri APP_ORIGIN ile eşleşmelidir; eksik origin de reddedilir. CORS izni yoktur. Cache-Control private/no-store kullanılır. Hatalar `code`, Türkçe `message`, `requestId` taşır; SQL, stack, motor stderr'i ve disk yolu dönmez.

| Yöntem / yol | İşlev | Başarı |
| --- | --- | --- |
| GET /api/capabilities | Etkin araçlar ve gerçek sınırlar | 200 |
| GET /api/health/live | Süreç sağlığı | 200 |
| GET /api/health/ready | DB, motor ve son 20 saniyede worker heartbeat'i | 200 / 503 |
| GET /api/admin/stats | Yönetici özeti: `queue` (kuyruk sayıları, en eski bekleyen iş yaşı, son bir saatte başarı/hata) ve araç bazlı sayaçlar ve başarılı işlerin ortalama/p95 süresi (`avgSucceededSeconds`, `p95SucceededSeconds`); `cleanup` (süresi dolmuş ama fiziksel silinmemiş dosya sayısı, en eski gecikme ve ardışık bakım hatası sayısı); yalnızca `x-admin-key` başlığı kabul edilir (sorgu parametresi kabul edilmez) ve `ADMIN_SECRET` tanımlı olmalıdır; tanımlı değilse uç nokta kapalıdır | 200 / 401 |
| POST /api/files | Multipart tek `file` alanı; türe özel gerçek doğrulama | 201 |
| DELETE /api/files/:id | İşe bağlanmamış girdinin silme talebi | 204 |
| POST /api/jobs | Araç, dosyalar ve seçeneklerle iş kabulü | 202 |
| GET /api/jobs/:id | Durum ve sonuç kullanılabilirliği | 200 |
| POST /api/jobs/:id/cancel | Kuyruktaki/çalışan işi iptal | 200 |
| GET /api/jobs/:id/download | Sahip olunan sonuç; doğru MIME ve dosya uzantısı | 200 |
| DELETE /api/jobs/:id | Erişimi kes, işi/dosyaları silme için işaretle | 202 |

Yükleme cevabı `id`, `size`, `pages`, `expiresAt`, `kind`. PDF/DOCX/XLSX/PPTX/JPG/JPEG/PNG kabul edilir. Uzantı, MIME ve imza eşleşmesi yanında izole yapısal kontrol gerekir. Şifreli PDF, parola verilmeden veya yanlış parola ile reddedilir. Multipart yüklemeye isteğe bağlı `password` alanı eklenebilir (asıl kullanım `unlock-pdf` akışıdır); route alanı dosya türüne bakmadan kabul eder, yalnızca şifreli PDF doğrulamasında kullanır ve dosya metadata'sına kaydetmez. Makrolu/dış bağlantılı/gömülü binary içeren Office, arşiv yol ihlalleri ve büyük görseller reddedilir. Office sayfa sayısı yüklemede gerçek slayt/çalışma sayfası adedi değildir; PDF çıktısı oluştuğunda sayfa sayısı belirlenir.

İş oluşturma gövdesi:

```json
{
  "tool": "merge-pdf",
  "fileIds": ["11111111-1111-4111-8111-111111111111", "22222222-2222-4222-8222-222222222222"],
  "idempotencyKey": "33333333-3333-4333-8333-333333333333"
}
```

Girdi sırası çıktı sırasıdır. En az iki farklı dosya gerekir. Aynı oturum/anahtar/içerik aynı işi döndürür; farklı içerik veya silinmiş iş 409 verir. Bir yükleme tek canlı işe bağlanabilir; yeni işlemde yeniden yüklenir.

JobView: `id`, `tool`, `state`, `error`, `resultAvailable`, `expiresAt`, `createdAt`; sonuç hazırsa `resultKind` ve `resultSize` da döner. State: queued/running/succeeded/failed/cancelled. Süresi dolan başarılı iş succeeded kalır; resultAvailable false olur.

Options alanı araç bazında doğrulanır. Örnekler: PDF → görsel `{format:"png",dpi:150,pages:"3,1-2"}`; sayfa düzenleme `{pages:"3,1",rotation:90,mode:"pdf"}`; OCR `{language:"tur+eng"}`; görsel → PDF `{size:"a4",orientation:"landscape"}`; Excel → PDF `{sheets:"first"}`. Parola, `protect-pdf` / `unlock-pdf` iş seçeneklerinde kabul edilir; işin `options` JSONB alanına değil TTL'li şifreli gizli veri kaydına yazılır. Diğer araçlarda bilinmeyen alan/değer reddedilir. Idempotency özeti anahtarlı HMAC'tir.

PDF → Excel'de NO_TABLES, metin çıkarılamıyorsa NO_TEXT, belge dışında sayfa seçiminde INVALID_OPTIONS kararlı iş hata kodlarıdır; güvenilir tablo bulunamazsa boş veya uydurulmuş çıktı üretilmez. Parola hatası WRONG_PASSWORD döner. Çıktı PDF/DOCX/XLSX/JPG/PNG/ZIP/TXT olabilir.

Silme 202 cevabı fiziksel silmenin bittiği anlamına gelmez; `physicalDeletionGraceSeconds=120` döner. Erişim anında kapanır. İptal sonrası worker motor bağlantısını keser; atomik state/attempt kontrolü sonuç yayımlamayı engeller.

Hatalar: 400 şema, 403 origin, 404 sahiplik, 409 çakışma, 410 sonuç hazır değil/süresi doldu, 413 limit, 415 format, 422 bozuk/şifreli PDF, 429 kullanım limiti (oturum veya ağ başına), 503 motor erişimi veya küresel depolama kapasitesi (CAPACITY_EXCEEDED). DB ve kuyruk kabulü birlikte commit/rollback olur.
