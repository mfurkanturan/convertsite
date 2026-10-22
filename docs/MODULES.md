# Modül sınırları

Kullanıcıya sunulan 10 araç, 10 ayrı altyapı veya servis değildir. Ortak sorumluluklar aşağıdaki modüllerde toplanır.

## Sahiplik

| Modül | Sahip olduğu iş | Kavramsal veri sahipliği | Yapmaması gereken |
| --- | --- | --- | --- |
| files | Yükleme, doğrulama, özel depolama, erişim ve fiziksel temizleme | Dosya kaydı, yükleme durumu, boyut, checksum, saklama sonu | Dönüşüm veya iş kuyruğu yönetmek |
| jobs | İş kabulü, durum, dispatch, lease, tekrar deneme ve iptal | İş, giriş/çıkış referansları, deneme ve hata özeti | Motor komutlarını veya araç seçeneklerini uygulamak |
| conversions | Biçimler arası dönüşüm | İşlem seçeneklerinin semantiği ve motor yetenekleri; başlangıçta ayrı tablo gerekmez | Dosya sahipliği veya kuyruk tablosu yönetmek |
| pdf-operations | Birleştirme, sayfa düzenleme, sıkıştırma | Sayfa planı ve sıkıştırma kuralları; başlangıçta ayrı tablo gerekmez | Office dönüşümü veya OCR yapmak |
| ocr | Dil ve metin tanıma kuralları | OCR seçenekleri ve desteklenen diller; başlangıçta ayrı tablo gerekmez | Yerleşimi koruyan DOCX üretimini varsaymak |
| usage | Kullanım politikası ve kapasite rezervasyonu | Kota rezervasyonu, tüketim, politika sürümü | Dosya depolamak veya motor çalıştırmak |

Tablo isimleri ve indeksler DATA-MODEL hazırlanırken kesinleştirilir. Bu belge tablo tasarımı yerine sahiplik sınırını belirler.

## Araç ve handler eşlemesi

| Araç kimliği | Sahibi | Kullanım senaryosu |
| --- | --- | --- |
| pdf-to-word | conversions | ConvertPdfToWord |
| word-to-pdf | conversions | ConvertWordToPdf |
| pdf-to-excel | conversions | ConvertPdfToExcel |
| excel-to-pdf | conversions | ConvertExcelToPdf |
| pdf-to-images | conversions | RenderPdfToImages |
| images-to-pdf | conversions | ConvertImagesToPdf |
| merge-pdf | pdf-operations | MergePdf |
| edit-pdf-pages | pdf-operations | EditPdfPages |
| compress-pdf | pdf-operations | CompressPdf |
| ocr | ocr | ExtractText |

Benzer motoru kullanmaları ayrı kullanım senaryolarını tek büyük handler'a birleştirme nedeni değildir. Ortak düşük seviyeli motor çağrısı yeniden kullanılabilir.

## Açık sözleşmeler

İsimler hedef sözleşme örnekleridir; gerçek imzalar uygulama aşamasında dar tutulur.

- `files`: UploadFile, GetOwnedFileMetadata, AcquireInputLease, CommitOutput, RequestDeletion, SweepExpiredFiles.
- `jobs`: CreateJob, GetOwnedJob, RequestCancellation, ExecuteClaimedJob.
- `usage`: ReserveUsage, ConfirmUsage, ReleaseReservation, GetPolicy.
- Araç modülleri: araç tanımı, seçenek doğrulayıcısı ve işlem handler'ı.

`GetOwnedFileMetadata` gibi kullanıcı işlemleri oturum bağlamı gerektirir. Worker'a ayrılan dahili portlar yalnızca doğrulanmış iş bağlamıyla kullanılabilir; kullanıcı bu bağlamı serbestçe oluşturamaz.

## İletişim yönü

```text
HTTP → jobs → files
            → usage
            → ToolHandler portu

bootstrap → araç modüllerinin handler'larını porta bağlar
araç handler'ı → kendi motor portu
```

`jobs`, somut araç modüllerini import etmez. Handler kaydı bootstrap'ta kurulur. Araç modülleri `jobs` iç yapılarını import etmez. Handler'a girdi için dar kapsamlı çalışma alanı ve doğrulanmış seçenekler verilir; başarılı sonuçlar jobs tarafından files üzerinden kalıcılaştırılır.

## İş kabulü

1. İstek şeması doğrulanır; tool kimliği izin listesinden seçilir.
2. Handler'ın seçenek doğrulayıcısı çalışır; dosyaların sahipliği ve hazır olduğu kontrol edilir.
3. Kullanım rezervasyonu, iş kaydı ve kuyruk gönderimi atomik kabul sınırında tamamlanır.
4. Worker işi alır, dosya lease'lerini edinir, handler'ı çalıştırır.
5. Çıktı files modülüyle kaydedilir; iş durumu ve kullanım kaydı tamamlanır.
6. Hata/iptalde rezervasyon politikaya göre çözülür, geçici çıktılar kaldırılır.

Modüller ortak transaction'a kendi açık arayüzlerinden katılır; jobs başka modülün SQL'ini yazmaz. Harici motor ve dosya depolama çağrıları DB transaction'ını açık tutmaz.

## Ortak sözleşme sınırı

`packages/contracts` yalnızca JSON üzerinden taşınan DTO, hata kodu ve dış şemaları içerir. Domain entity, SQL modeli, depolama yolu ve gizli yapılandırma burada bulunmaz. UI, server kaynak kodunu doğrudan import etmez.

Yeni araç ekleme kontrolü: handler, girdi/çıktı politikası, desteklenen seçenekler, kaynak limitleri, fixture'lar, UI kaydı ve kullanılabilirlik bilgisi eklenmiş olmalıdır.
