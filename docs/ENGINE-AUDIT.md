# Motor kalite incelemesi — ölçülen başlangıç durumu

Üretildi: 2026-10-23T18:26:57.555Z. 120 senaryo, 360 çalıştırma. Motor davranışı bu incelemede değiştirilmedi.

Kapsam: onaylanan plandaki 15 araç. Daha sonra eklenen 16. araç `pdf-to-pdf-ocr` bu incelemeye dahil değildir. Ana ölçümler kalite altyapısının `122e845` commit’inde korunan motor koduyla yapılmıştır; son OCR kelime hata ölçümü `9bb1b18` üzerinde yenilenmiştir. Bu commit mevcut TXT OCR fonksiyonunu değiştirmeden ayrı aranabilir PDF handler’ı ekler. Önceki ölçümler yeni aracın veya tüm güncel sürümün doğrulaması olarak sunulmaz.

Son bütünlük kontrolü: 120 senaryonun her birinde üç ayrı tekrar; 15 × 3 yük düzeyinde altışar sıralı ve ikişer eşzamanlı çalıştırma, toplam 360 performans kaydı. Bunlar motor çağrısı sayılarıdır; başarısız çağrılar da dahildir. OCR için karakter doğruluğuna ek olarak kelime ekleme/silme/değiştirme hata oranı ölçüldü. Audit değerlendiricisinin dört birim testi geçti. İzole regresyon koşusunda iki suite / 36 test geçti; bunlar önceki ölçüm sürümüne aittir.

**“Geçen senaryo” yalnızca uygulanmış kontrolleri ifade eder; eksik görsel veya uygulama uyumluluğu kapıları varsa üretim kalitesi onayı değildir. Beklenen retler başarılı dönüşüm sayılmaz.**

| Araç | Üç tekrarı tamamlanan | Çıktı kontrolleri geçen | Doğru beklenen ret | API/worker | Medyan motor sn | Karar |
|---|---:|---:|---:|---|---:|---|
| pdf-to-word | 8/8 | 0/7 | 1/1 | succeeded | 1.31 | İyileştir / yerel alternatifle karşılaştır |
| pdf-to-excel | 8/8 | 2/4 | 4/4 | succeeded | 0.76 | İyileştir |
| ocr | 8/8 | 6/7 | 1/1 | succeeded | 1.16 | İyileştir |
| compress-pdf | 8/8 | 8/8 | 0/0 | succeeded | 0.92 | Kayıpsız motoru koru, kapsamı açıkla |
| merge-pdf | 8/8 | 8/8 | 0/0 | succeeded | 0.87 | Çalışan çekirdeği koru; eksik kapıları tamamla |
| edit-pdf-pages | 8/8 | 8/8 | 0/0 | succeeded | 1.24 | Çalışan çekirdeği koru; eksik kapıları tamamla |
| protect-pdf | 8/8 | 0/8 | 0/0 | failed | Çıktı yok | Desteği sınırla; çıktı kontrolünü düzelt |
| unlock-pdf | 8/8 | 0/8 | 0/0 | INVALID_DOCUMENT | Çıktı yok | Desteği sınırla; parola farkındalığı ekle |
| page-numbers | 8/8 | 7/8 | 0/0 | succeeded | 0.83 | Çalışan çekirdeği koru; eksik kapıları tamamla |
| watermark-pdf | 8/8 | 4/8 | 0/0 | succeeded | 0.83 | İyileştir |
| pdf-to-images | 8/8 | 8/8 | 0/0 | succeeded | 0.83 | Çalışan çekirdeği koru; eksik kapıları tamamla |
| images-to-pdf | 8/8 | 7/7 | 1/1 | succeeded | 0.81 | Çalışan çekirdeği koru; eksik kapıları tamamla |
| word-to-pdf | 8/8 | 8/8 | 0/0 | succeeded | 2.68 | Çalışan çekirdeği koru; eksik kapıları tamamla |
| excel-to-pdf | 8/8 | 8/8 | 0/0 | succeeded | 2.59 | Çalışan çekirdeği koru; eksik kapıları tamamla |
| pptx-to-pdf | 8/8 | 0/8 | 0/0 | UNSUPPORTED_FORMAT | Çıktı yok | Desteği sınırla; akış engellerini gider |

## Ortam ve ölçüm sınırları

Python 3.11.2; 1 CPU, 1024 MiB, 96 PID, ağsız doğrudan motor container’ı. Paket sürümleri: pdf2docx 0.5.13, PyMuPDF 1.26.7, pdfplumber 0.11.10, python-docx 1.2.0, openpyxl 3.1.5, Pillow 13.0.0, reportlab 5.0.1.

RSS wait4 yüksek su işaretidir; eşzamanlı süreç ağacının anlık toplamı değildir. Geçici çalışma alanı 50 ms aralıkla örneklenir. Tekrarlı performans testi fiziksel disk önbelleğinin soğuk olduğunu kanıtlamaz. Aynı fixture ile ölçeklenmemiş yükler near-limit kanıtı sayılmaz.

Tarayıcı, yerel frontend üzerinden yalnızca ayrı audit API/worker/veritabanına yönlendirilir. Başarılı indirmeler, yabancı oturum erişimi ve erken silme kontrol edilir. Kontrollü expiry, çalışan worker SIGKILL/gerçek lease kurtarma ve timeout fault injection sonuçları aşağıda ayrıca verilir. Test sonucu yoksa bu davranış doğrulanmış sayılmaz.

Render tanımı API/motor/worker süreçlerini aynı container’da çalıştırır; yerel ölçümde bunlar ayrı container’lardır. Render bellek/CPU kapasitesi ve üretim yükü bu sonuçlardan çıkarılamaz.

Dönüşüm çalışma dizini 384 MiB tmpfs içindedir; kanıtlar ölçümden sonra host’a kopyalanır. Doğrudan Python audit container’ı `--init` ile orphan süreçleri toplar. Windows bind mount çalışma dizini ve PID 1 reaping problemi içeren ön koşular ham deney olarak ayrılmıştır; rapor tablosuna dahil edilmez.

Performans container’ında cgroup tepe belleği 1024 MiB, tepe süreç sayısı 38. Bellek olayları: low 0; high 0; max 3570; oom 0; oom_kill 0; oom_group_kill 0. 1024 MiB sınıra erişildi; OOM öldürmesi gözlenmedi. Bu değer tek bir araca mal edilemez ve tmpfs/cache belleğini de içerir. Kaynak payı konusunda daha düşük bellekli üretim ortamına garanti verilmez.

Doğrulanmayan kapsam: tüm belgelerde elle kırpılma/örtüşme kontrolü, Microsoft Word ve kaynak Office uygulamalarıyla karşılaştırma, PDF form/yer imi/açıklama/dijital imza koruması, ICC renk profilleri, her araçta tüm bozuk dosya ve sınır çeşitleri, fiziksel disk dolması/silme hatası, çoklu worker kapasitesi ve canlı Render yükü. Manuel ve uygulamaya özgü referans seti tamamlanmadığı için bunlar geçti sayılmadı; ilgili belge sınıflarının güven düzeyi sınırlıdır.

## Yaşam döngüsü sonuçları

- queued-cancel-and-worker-restart: **GEÇTİ**, 13.5 sn.
- expiry-access-and-physical-cleanup: **GEÇTİ**, 9.4 sn.
- running-job-cancellation: **GEÇTİ**, 3.2 sn, durum: cancelled.
- real-motor-timeout: **GEÇMEDİ**, 20.9 sn, hata: ENGINE_UNAVAILABLE, durum: failed.
- running-worker-kill-and-real-lease-recovery: **GEÇTİ**, 224.5 sn, durum: succeeded.
- two-concurrent-submissions-real-worker: **GEÇTİ**, 14.6 sn.

Performans kaydı yoksa kapasite veya optimizasyon kazanımı iddia edilmez. Alternatif motorlar çalıştırılmadığı sürece değişim önerisi bir aday değerlendirme kararıdır. Microsoft Word uyumluluğu LibreOffice render testiyle onaylanmaz.

## Öncelikli bulgular

- Yüksek: şifreleme ve parola kaldırmada ortak PDF doğrulama akışını parola farkındalığı ile yeniden tasarla; erişim ve kaynak sınırlarını koru.
- Yüksek: PPTX için frontend/sözleşme/API/kurulu LibreOffice bileşenleri arasındaki destek çelişkisini gider.
- Yüksek: PDF → Word’de sessiz içerik kaybı ve yerleşim hatalarını öncele.
- Orta: OCR yön/eğiklik, tablo yapısı ve Türkçe filigran için profil karşılaştırması yap.

Statik veri işleme bulgusu: `jobs` repository create metodu (repository.ts:54) seçenekleri doğrudan JSONB parametresi olarak kaydediyor; `ToolOptions.password` için ayrı bir gizli veri mekanizması yok. Parola araçlarını iyileştirmeden önce parolanın düz metin iş metadata’sında kalması giderilmeli. Audit yalnızca sentetik parola kullandı; gerçek kullanıcı parolası sorgulanmadı veya raporlanmadı.

## pdf-to-word

İyileştir / yerel alternatifle karşılaştır. Metin, kritik sayılar, 5 pt yerleşim ve düzenlenebilirlik ayrı kapılardır; tek bir geçer puanı yok.

Üç tekrarı tamamlanan senaryo: 8/8; çıktı kontrolleri geçen: 0/7; doğru beklenen ret: 1/1; tutarsız senaryo: 0; tepe child RSS: 139108 KiB.

Başarısızlıklar:

- pdf-to-word/plain: layout_5pt
- pdf-to-word/unicode: layout_5pt
- pdf-to-word/table: layout_5pt
- pdf-to-word/layout: content_accuracy, layout_5pt
- pdf-to-word/rotated: editable_text, content_accuracy, critical_numbers, layout_5pt
- pdf-to-word/multipage: layout_5pt
- pdf-to-word/landscape: layout_5pt

Ölçülmeyen kapılar: manual_clipping_overlap_review, Microsoft_Word_rendering.

HTTP kuyruğu: 0.05078 sn; worker teslimi: 2.910666 sn; tarayıcı akışı: 11.46 sn. Bunlar tek küçük belge örneğidir, servis p95 değeri değildir.

- content_accuracy: min 0.0000, maks 1.0000 (yalnızca ölçülebilen çıktılar).
- max_word_displacement_pt: min 9.1180, maks 76.7000 (yalnızca ölçülebilen çıktılar).

| Yük | Birim | Sıralı başarılı/deneme | Sıcak medyan sn | Tepe child RSS KiB | İki eşzamanlı başarılı/deneme |
|---|---:|---:|---:|---:|---:|
| small | 1 | 6/6 | 2.03 | 136092 | 2/2 |
| medium | 10 | 6/6 | 1.36 | 136456 | 2/2 |
| near | 49 | 6/6 | 2.48 | 138004 | 2/2 |

## pdf-to-excel

İyileştir. Çizgisiz ve birleşik tablolarda kapsamı netleştir; sayısal türler/formül güvenliği ve hücre yapısını ayrı doğrula.

Üç tekrarı tamamlanan senaryo: 8/8; çıktı kontrolleri geçen: 2/4; doğru beklenen ret: 4/4; tutarsız senaryo: 0; tepe child RSS: 139108 KiB.

Başarısızlıklar:

- pdf-to-excel/borderless: NO_TABLES
- pdf-to-excel/merged: cell_accuracy, critical_numbers

Ölçülmeyen kapılar: quality_gates_blocked_by_engine_failure.

HTTP kuyruğu: 0.546367 sn; worker teslimi: 0.707392 sn; tarayıcı akışı: 7.25 sn. Bunlar tek küçük belge örneğidir, servis p95 değeri değildir.

- cell_accuracy: min 0.5000, maks 1.0000 (yalnızca ölçülebilen çıktılar).

| Yük | Birim | Sıralı başarılı/deneme | Sıcak medyan sn | Tepe child RSS KiB | İki eşzamanlı başarılı/deneme |
|---|---:|---:|---:|---:|---:|
| small | 1 | 6/6 | 0.76 | 131188 | 2/2 |
| medium | 10 | 6/6 | 0.96 | 131188 | 2/2 |
| near | 49 | 6/6 | 1.11 | 131188 | 2/2 |

## ocr

İyileştir. Sabit 150 DPI ve PSM 3 yerine yön/eğiklik ve çözünürlük adaylarını aynı corpus ile karşılaştır.

Üç tekrarı tamamlanan senaryo: 8/8; çıktı kontrolleri geçen: 6/7; doğru beklenen ret: 1/1; tutarsız senaryo: 0; tepe child RSS: 130556 KiB.

Başarısızlıklar:

- ocr/rotate.png: ocr_accuracy

Ölçülmeyen kapılar: Runner kapsamındaki kapılar tamamlandı; genel üretim garantisi değildir.

HTTP kuyruğu: 0.46339 sn; worker teslimi: 1.710789 sn; tarayıcı akışı: 7.36 sn. Bunlar tek küçük belge örneğidir, servis p95 değeri değildir.

- character_accuracy: min 0.0000, maks 1.0000 (yalnızca ölçülebilen çıktılar).
- word_error_rate: min 0.0000, maks 1.0000 (yalnızca ölçülebilen çıktılar).

| Yük | Birim | Sıralı başarılı/deneme | Sıcak medyan sn | Tepe child RSS KiB | İki eşzamanlı başarılı/deneme |
|---|---:|---:|---:|---:|---:|
| small | 1 | 6/6 | 1.63 | 131188 | 2/2 |
| medium | 10 | 6/6 | 5.30 | 131188 | 2/2 |
| near | 19 | 6/6 | 8.97 | 131188 | 2/2 |

## compress-pdf

Kayıpsız motoru koru, kapsamı açıkla. Küçülmeme başarısızlık değildir; görüntü ağırlıklı belgeler için ayrı kayıplı profil ancak kalite onayından sonra değerlendirilmeli.

Üç tekrarı tamamlanan senaryo: 8/8; çıktı kontrolleri geçen: 8/8; doğru beklenen ret: 0/0; tutarsız senaryo: 0; tepe child RSS: 143792 KiB.

Uygulanmış kontrollerde başarısızlık gözlenmedi.

Ölçülmeyen kapılar: Runner kapsamındaki kapılar tamamlandı; genel üretim garantisi değildir.

HTTP kuyruğu: 0.076382 sn; worker teslimi: 0.776872 sn; tarayıcı akışı: 5.31 sn. Bunlar tek küçük belge örneğidir, servis p95 değeri değildir.

- size_ratio: min 0.9114, maks 0.9320 (yalnızca ölçülebilen çıktılar).

| Yük | Birim | Sıralı başarılı/deneme | Sıcak medyan sn | Tepe child RSS KiB | İki eşzamanlı başarılı/deneme |
|---|---:|---:|---:|---:|---:|
| small | 1 | 6/6 | 0.91 | 131188 | 2/2 |
| medium | 10 | 6/6 | 1.37 | 131188 | 2/2 |
| near | 299 | 6/6 | 3.00 | 131188 | 2/2 |

## merge-pdf

Çalışan çekirdeği koru; eksik kapıları tamamla. İçerik/yapısal sonuçlar ile görsel kontroller birlikte tamamlanmadan genel üretim onayı verilmez.

Üç tekrarı tamamlanan senaryo: 8/8; çıktı kontrolleri geçen: 8/8; doğru beklenen ret: 0/0; tutarsız senaryo: 0; tepe child RSS: 143792 KiB.

Uygulanmış kontrollerde başarısızlık gözlenmedi.

Ölçülmeyen kapılar: Runner kapsamındaki kapılar tamamlandı; genel üretim garantisi değildir.

HTTP kuyruğu: 0.034965 sn; worker teslimi: 0.668847 sn; tarayıcı akışı: 4.81 sn. Bunlar tek küçük belge örneğidir, servis p95 değeri değildir.


| Yük | Birim | Sıralı başarılı/deneme | Sıcak medyan sn | Tepe child RSS KiB | İki eşzamanlı başarılı/deneme |
|---|---:|---:|---:|---:|---:|
| small | 1 | 6/6 | 1.08 | 131188 | 2/2 |
| medium | 10 | 6/6 | 1.24 | 131188 | 2/2 |
| near | 296 | 6/6 | 4.40 | 131188 | 2/2 |

## edit-pdf-pages

Çalışan çekirdeği koru; eksik kapıları tamamla. İçerik/yapısal sonuçlar ile görsel kontroller birlikte tamamlanmadan genel üretim onayı verilmez.

Üç tekrarı tamamlanan senaryo: 8/8; çıktı kontrolleri geçen: 8/8; doğru beklenen ret: 0/0; tutarsız senaryo: 0; tepe child RSS: 143792 KiB.

Uygulanmış kontrollerde başarısızlık gözlenmedi.

Ölçülmeyen kapılar: Runner kapsamındaki kapılar tamamlandı; genel üretim garantisi değildir.

HTTP kuyruğu: 0.894566 sn; worker teslimi: 0.705897 sn; tarayıcı akışı: 5.72 sn. Bunlar tek küçük belge örneğidir, servis p95 değeri değildir.


| Yük | Birim | Sıralı başarılı/deneme | Sıcak medyan sn | Tepe child RSS KiB | İki eşzamanlı başarılı/deneme |
|---|---:|---:|---:|---:|---:|
| small | 1 | 6/6 | 0.82 | 131188 | 2/2 |
| medium | 10 | 6/6 | 0.98 | 131188 | 2/2 |
| near | 299 | 6/6 | 4.38 | 131188 | 2/2 |

## protect-pdf

Desteği sınırla; çıktı kontrolünü düzelt. Ortak pdf_pages kontrolü şifreli PDF reddediyor; doğru üretilen şifreli çıktının yayımlanmasını da engelleyebilir.

Üç tekrarı tamamlanan senaryo: 8/8; çıktı kontrolleri geçen: 0/8; doğru beklenen ret: 0/0; tutarsız senaryo: 0; tepe child RSS: 143792 KiB.

Başarısızlıklar:

- protect-pdf/plain: INVALID_DOCUMENT
- protect-pdf/unicode: INVALID_DOCUMENT
- protect-pdf/table: INVALID_DOCUMENT
- protect-pdf/borderless: INVALID_DOCUMENT
- protect-pdf/rotated: INVALID_DOCUMENT
- protect-pdf/multipage: INVALID_DOCUMENT
- protect-pdf/landscape: INVALID_DOCUMENT
- protect-pdf/merged: INVALID_DOCUMENT

Ölçülmeyen kapılar: quality_gates_blocked_by_engine_failure.

HTTP kuyruğu: 0.254889 sn; worker teslimi: 0.634755 sn; tarayıcı akışı: 4.58 sn. Bunlar tek küçük belge örneğidir, servis p95 değeri değildir.


| Yük | Birim | Sıralı başarılı/deneme | Sıcak medyan sn | Tepe child RSS KiB | İki eşzamanlı başarılı/deneme |
|---|---:|---:|---:|---:|---:|
| small | 1 | 0/6 | Çıktı yok | 131188 | 0/2 |
| medium | 10 | 0/6 | Çıktı yok | 131188 | 0/2 |
| near | 299 | 0/6 | Çıktı yok | 131188 | 0/2 |

## unlock-pdf

Desteği sınırla; parola farkındalığı ekle. Ortak girdi incelemesi şifreli PDF reddediyor; parola handler’a ulaşmadan akış kesiliyor.

Üç tekrarı tamamlanan senaryo: 8/8; çıktı kontrolleri geçen: 0/8; doğru beklenen ret: 0/0; tutarsız senaryo: 0; tepe child RSS: 143792 KiB.

Başarısızlıklar:

- unlock-pdf/plain: INVALID_DOCUMENT
- unlock-pdf/unicode: INVALID_DOCUMENT
- unlock-pdf/table: INVALID_DOCUMENT
- unlock-pdf/borderless: INVALID_DOCUMENT
- unlock-pdf/rotated: INVALID_DOCUMENT
- unlock-pdf/multipage: INVALID_DOCUMENT
- unlock-pdf/landscape: INVALID_DOCUMENT
- unlock-pdf/merged: INVALID_DOCUMENT

Ölçülmeyen kapılar: quality_gates_blocked_by_engine_failure.


| Yük | Birim | Sıralı başarılı/deneme | Sıcak medyan sn | Tepe child RSS KiB | İki eşzamanlı başarılı/deneme |
|---|---:|---:|---:|---:|---:|
| small | 1 | 0/6 | Çıktı yok | 131188 | 0/2 |
| medium | 10 | 0/6 | Çıktı yok | 131188 | 0/2 |
| near | 299 | 0/6 | Çıktı yok | 131188 | 0/2 |

## page-numbers

Çalışan çekirdeği koru; eksik kapıları tamamla. İçerik/yapısal sonuçlar ile görsel kontroller birlikte tamamlanmadan genel üretim onayı verilmez.

Üç tekrarı tamamlanan senaryo: 8/8; çıktı kontrolleri geçen: 7/8; doğru beklenen ret: 0/0; tutarsız senaryo: 0; tepe child RSS: 143792 KiB.

Başarısızlıklar:

- page-numbers/rotated: all_page_numbers

Ölçülmeyen kapılar: number_position_geometry.

HTTP kuyruğu: 1.497196 sn; worker teslimi: 0.72667 sn; tarayıcı akışı: 4.46 sn. Bunlar tek küçük belge örneğidir, servis p95 değeri değildir.

İlk tekrara ait bağımsız piksel/yerleşim ek kontrolleri: 7/8. Başarısız örnekler: page-numbers/rotated. Bu ek ölçüm üç tekrarın yerini almaz.


| Yük | Birim | Sıralı başarılı/deneme | Sıcak medyan sn | Tepe child RSS KiB | İki eşzamanlı başarılı/deneme |
|---|---:|---:|---:|---:|---:|
| small | 1 | 6/6 | 0.98 | 131188 | 2/2 |
| medium | 10 | 6/6 | 1.03 | 131188 | 2/2 |
| near | 299 | 6/6 | 2.99 | 131188 | 2/2 |

## watermark-pdf

İyileştir. Yerleşik Helvetica ile Unicode/Türkçe metin ve sayfa dönüşleri doğrulanmalı.

Üç tekrarı tamamlanan senaryo: 8/8; çıktı kontrolleri geçen: 4/8; doğru beklenen ret: 0/0; tutarsız senaryo: 0; tepe child RSS: 143792 KiB.

Başarısızlıklar:

- watermark-pdf/unicode: all_watermarks
- watermark-pdf/borderless: all_watermarks
- watermark-pdf/multipage: all_watermarks
- watermark-pdf/merged: all_watermarks

Ölçülmeyen kapılar: watermark_position_geometry.

HTTP kuyruğu: 0.0583 sn; worker teslimi: 0.809923 sn; tarayıcı akışı: 4.73 sn. Bunlar tek küçük belge örneğidir, servis p95 değeri değildir.

İlk tekrara ait bağımsız piksel/yerleşim ek kontrolleri: 4/8. Başarısız örnekler: watermark-pdf/unicode, watermark-pdf/borderless, watermark-pdf/multipage, watermark-pdf/merged. Bu ek ölçüm üç tekrarın yerini almaz.


| Yük | Birim | Sıralı başarılı/deneme | Sıcak medyan sn | Tepe child RSS KiB | İki eşzamanlı başarılı/deneme |
|---|---:|---:|---:|---:|---:|
| small | 1 | 6/6 | 0.88 | 131188 | 2/2 |
| medium | 10 | 6/6 | 0.88 | 131188 | 2/2 |
| near | 299 | 6/6 | 2.68 | 131188 | 2/2 |

## pdf-to-images

Çalışan çekirdeği koru; eksik kapıları tamamla. İçerik/yapısal sonuçlar ile görsel kontroller birlikte tamamlanmadan genel üretim onayı verilmez.

Üç tekrarı tamamlanan senaryo: 8/8; çıktı kontrolleri geçen: 8/8; doğru beklenen ret: 0/0; tutarsız senaryo: 0; tepe child RSS: 143792 KiB.

Uygulanmış kontrollerde başarısızlık gözlenmedi.

Ölçülmeyen kapılar: raster_content_color_review.

HTTP kuyruğu: 0.609511 sn; worker teslimi: 0.682539 sn; tarayıcı akışı: 4.56 sn. Bunlar tek küçük belge örneğidir, servis p95 değeri değildir.

İlk tekrara ait bağımsız piksel/yerleşim ek kontrolleri: 8/8. Başarısız örnekler: yok. Bu ek ölçüm üç tekrarın yerini almaz.


| Yük | Birim | Sıralı başarılı/deneme | Sıcak medyan sn | Tepe child RSS KiB | İki eşzamanlı başarılı/deneme |
|---|---:|---:|---:|---:|---:|
| small | 1 | 6/6 | 1.23 | 131188 | 2/2 |
| medium | 10 | 6/6 | 2.41 | 131188 | 2/2 |
| near | 29 | 6/6 | 7.16 | 131188 | 2/2 |

## images-to-pdf

Çalışan çekirdeği koru; eksik kapıları tamamla. İçerik/yapısal sonuçlar ile görsel kontroller birlikte tamamlanmadan genel üretim onayı verilmez.

Üç tekrarı tamamlanan senaryo: 8/8; çıktı kontrolleri geçen: 7/7; doğru beklenen ret: 1/1; tutarsız senaryo: 0; tepe child RSS: 130648 KiB.

Uygulanmış kontrollerde başarısızlık gözlenmedi.

Ölçülmeyen kapılar: image_orientation_color_crop_review.

HTTP kuyruğu: 0.225064 sn; worker teslimi: 0.741505 sn; tarayıcı akışı: 4.59 sn. Bunlar tek küçük belge örneğidir, servis p95 değeri değildir.

İlk tekrara ait bağımsız piksel/yerleşim ek kontrolleri: 7/7. Başarısız örnekler: yok. Bu ek ölçüm üç tekrarın yerini almaz.


| Yük | Birim | Sıralı başarılı/deneme | Sıcak medyan sn | Tepe child RSS KiB | İki eşzamanlı başarılı/deneme |
|---|---:|---:|---:|---:|---:|
| small | 1 | 6/6 | 1.34 | 131188 | 2/2 |
| medium | 10 | 6/6 | 1.65 | 131188 | 2/2 |
| near | 19 | 6/6 | 2.43 | 131188 | 2/2 |

## word-to-pdf

Çalışan çekirdeği koru; eksik kapıları tamamla. İçerik/yapısal sonuçlar ile görsel kontroller birlikte tamamlanmadan genel üretim onayı verilmez.

Üç tekrarı tamamlanan senaryo: 8/8; çıktı kontrolleri geçen: 8/8; doğru beklenen ret: 0/0; tutarsız senaryo: 0; tepe child RSS: 216232 KiB.

Uygulanmış kontrollerde başarısızlık gözlenmedi.

Ölçülmeyen kapılar: manual_clipping_overlap_review, source_application_reference.

HTTP kuyruğu: 0.710638 sn; worker teslimi: 2.857848 sn; tarayıcı akışı: 7.58 sn. Bunlar tek küçük belge örneğidir, servis p95 değeri değildir.


| Yük | Birim | Sıralı başarılı/deneme | Sıcak medyan sn | Tepe child RSS KiB | İki eşzamanlı başarılı/deneme |
|---|---:|---:|---:|---:|---:|
| small | 1 | 6/6 | 3.48 | 216104 | 2/2 |
| medium | 10 | 6/6 | 3.70 | 216192 | 2/2 |
| near | 299 | 6/6 | 2.87 | 216128 | 2/2 |

## excel-to-pdf

Çalışan çekirdeği koru; eksik kapıları tamamla. İçerik/yapısal sonuçlar ile görsel kontroller birlikte tamamlanmadan genel üretim onayı verilmez.

Üç tekrarı tamamlanan senaryo: 8/8; çıktı kontrolleri geçen: 8/8; doğru beklenen ret: 0/0; tutarsız senaryo: 0; tepe child RSS: 216392 KiB.

Uygulanmış kontrollerde başarısızlık gözlenmedi.

Ölçülmeyen kapılar: print_layout_reference, manual_clipping_overlap_review, source_application_reference.

HTTP kuyruğu: 0.424937 sn; worker teslimi: 2.975608 sn; tarayıcı akışı: 7.52 sn. Bunlar tek küçük belge örneğidir, servis p95 değeri değildir.


| Yük | Birim | Sıralı başarılı/deneme | Sıcak medyan sn | Tepe child RSS KiB | İki eşzamanlı başarılı/deneme |
|---|---:|---:|---:|---:|---:|
| small | 1 | 6/6 | 2.95 | 216232 | 2/2 |
| medium | 10 | 6/6 | 3.71 | 216292 | 2/2 |
| near | 299 | 6/6 | 8.55 | 881068 | 2/2 |

## pptx-to-pdf

Desteği sınırla; akış engellerini gider. API yükleme izin listesi PPTX kabul etmiyor; imajda Impress açıkça kurulmamış.

Üç tekrarı tamamlanan senaryo: 8/8; çıktı kontrolleri geçen: 0/8; doğru beklenen ret: 0/0; tutarsız senaryo: 0; tepe child RSS: 216132 KiB.

Başarısızlıklar:

- pptx-to-pdf/office-0: INVALID_DOCUMENT
- pptx-to-pdf/office-1: INVALID_DOCUMENT
- pptx-to-pdf/office-2: INVALID_DOCUMENT
- pptx-to-pdf/office-3: INVALID_DOCUMENT
- pptx-to-pdf/office-4: INVALID_DOCUMENT
- pptx-to-pdf/office-5: INVALID_DOCUMENT
- pptx-to-pdf/office-6: INVALID_DOCUMENT
- pptx-to-pdf/office-7: INVALID_DOCUMENT

Ölçülmeyen kapılar: quality_gates_blocked_by_engine_failure.


| Yük | Birim | Sıralı başarılı/deneme | Sıcak medyan sn | Tepe child RSS KiB | İki eşzamanlı başarılı/deneme |
|---|---:|---:|---:|---:|---:|
| small | 1 | 0/6 | Çıktı yok | 216148 | 0/2 |
| medium | 10 | 0/6 | Çıktı yok | 216352 | 0/2 |
| near | 299 | 0/6 | Çıktı yok | 216228 | 0/2 |

## Görsel inceleme ve yerel iyileştirme adayları

PDF → Word plain/layout örneklerinin kaynak ve LibreOffice render görüntüleri incelendi: ana içerik görünür kalıyor, ancak satır aralıkları ve dikey konumlar değişiyor. Rotated örneğinin render çıktısı boş; bu sessiz veri kaybıdır. Diğer belgelere bu sınırlı görsel inceleme üzerinden genel onay verilmedi.

İlk adaylar mevcut açık kaynak araçların profilleridir: OCR için 300 DPI ve yön/eğiklik işleme; pdfplumber için çizgisiz tabloda text stratejisi; filigran için gömülü Unicode font; Office için eksik bileşen ve parola farkındalığı. Aday ölçümü olmadan kalite/hız kazanımı iddia edilmez.

### Ölçülen profil adayları

- OCR text.png / baseline: üç tekrarda en düşük karakter doğruluğu 100.00%, medyan 0.268 sn.
- OCR text.png / scale-300: üç tekrarda en düşük karakter doğruluğu 100.00%, medyan 0.336 sn.
- OCR text.png / orientation: üç tekrarda en düşük karakter doğruluğu 100.00%, medyan 0.397 sn.
- OCR blur.png / baseline: üç tekrarda en düşük karakter doğruluğu 100.00%, medyan 0.209 sn.
- OCR blur.png / scale-300: üç tekrarda en düşük karakter doğruluğu 100.00%, medyan 0.409 sn.
- OCR blur.png / orientation: üç tekrarda en düşük karakter doğruluğu 100.00%, medyan 0.385 sn.
- OCR skew.png / baseline: üç tekrarda en düşük karakter doğruluğu 100.00%, medyan 0.208 sn.
- OCR skew.png / scale-300: üç tekrarda en düşük karakter doğruluğu 97.56%, medyan 0.319 sn.
- OCR skew.png / orientation: üç tekrarda en düşük karakter doğruluğu 100.00%, medyan 0.374 sn.
- OCR rotate.png / baseline: üç tekrarda en düşük karakter doğruluğu 0.00%, medyan 0.205 sn.
- OCR rotate.png / scale-300: üç tekrarda en düşük karakter doğruluğu 0.00%, medyan 0.394 sn.
- OCR rotate.png / orientation: üç tekrarda en düşük karakter doğruluğu 100.00%, medyan 0.409 sn.
- OCR small.png / baseline: üç tekrarda en düşük karakter doğruluğu 97.56%, medyan 0.200 sn.
- OCR small.png / scale-300: üç tekrarda en düşük karakter doğruluğu 100.00%, medyan 0.292 sn.
- OCR small.png / orientation: üç tekrarda en düşük karakter doğruluğu 97.56%, medyan 0.384 sn.
- PDF → Excel table.pdf / baseline: 1 tablo algılandı; algılama tek başına doğruluk onayı değildir.
- PDF → Excel table.pdf / text-strategy: 1 tablo algılandı; algılama tek başına doğruluk onayı değildir.
- PDF → Excel borderless.pdf / baseline: 0 tablo algılandı; algılama tek başına doğruluk onayı değildir.
- PDF → Excel borderless.pdf / text-strategy: 1 tablo algılandı; algılama tek başına doğruluk onayı değildir.
- PDF → Excel merged.pdf / baseline: 1 tablo algılandı; algılama tek başına doğruluk onayı değildir.
- PDF → Excel merged.pdf / text-strategy: 1 tablo algılandı; algılama tek başına doğruluk onayı değildir.
- protect-pdf / native-diagnostic: {"tool":"protect-pdf","profile":"native-diagnostic","encrypted_artifact_written":true,"known_password_opens_artifact":true,"note":"A valid intermediate artifact does not mean the application published a successful result."}
- unlock-pdf / native-diagnostic: {"tool":"unlock-pdf","profile":"native-diagnostic","native_decryption_success":true}
- pptx-to-pdf / package-diagnostic: {"tool":"pptx-to-pdf","profile":"package-diagnostic","impress_installed":false}

Üretim profilinde değişiklik yapılmadı. Tek belgede kazanan profil, tüm belge sınıfları için seçilmedi; %20 performans hedefi kalite kapılarından bağımsız bir kabul değildir.

Aday kararı: yön profili dönük OCR örneğinde karakter doğruluğunu %0’dan %100’e çıkardı; süre yaklaşık iki katına çıktı. 300 DPI küçük yazıda %97,56’dan %100’e çıktı, fakat eğik örnekte %100’den %97,56’ya düştü. Bu nedenle tüm girdilere tek profil uygulamak yerine belge sınıfına göre seçim ayrıca doğrulanmalı. Çizgisiz tabloda algılama artışı, hücre/başlık ve kritik sayı kapıları tamamlanmadan kabul edilmemeli.

## Yerel gerçek belge karşılaştırması

Kullanıcının önceden paylaştığı örnek yalnızca ağsız, Git dışında tutulan yerel alanda yeniden işlendi. Yeni çıktıda normalize metin ve kritik sayı kontrolleri, düzenlenebilir metin ve sayfa sayısı geçti; 5 pt yerleşim kapısı geçmedi. Önceki DOCX ile metin karşılaştırması da yapıldı. Çok sütunlu belgede geometrik ve mantıksal okuma sırası farklı olabildiğinden eski/yeni dizi doğruluğu genel kalite yüzdesine dönüştürülmedi. Bu tek örnek genelleştirilmez; belge adı, metni ve çıktıları rapora eklenmedi. Microsoft Word üzerinde elle kontrol yapılmadı.

## Önceliklendirilmiş uygulama ve yeniden doğrulama

1. Yüksek — Şifreleme/parola kaldırma ve parola saklama: parola farkındalığı olan giriş/çıkış doğrulaması, güvenli gizli veri yaşam döngüsü. Yeniden kabul: sekizer senaryo üçer kez; doğru/yanlış parola, bağımsız QPDF kontrolü ve gerçek API akışı geçmeli.
2. Yüksek — PDF → Word: dönük sayfada başarılı görünen boş çıktı ve yerleşim kaymaları. Yeniden kabul: desteklenen belgelerde ≥%99,5 normalize metin, kritik sayılarda tam doğruluk, düzenlenebilir metin, sayfa sayısı ve 5 pt konum; ayrıca elle kırpılma/örtüşme kontrolü.
3. Yüksek — PPTX: yükleme izinleri ve Impress bileşeni birlikte düzeltilmeli. Yeniden kabul: sekiz sentetik sunumda API → worker → indirme; kaynak uygulama referansıyla slayt sayısı/metin/yerleşim.
4. Yüksek — Timeout: gerçek süre aşımında ENGINE_UNAVAILABLE yerine doğru hata ve kaynak temizliği. Yeniden kabul: aynı kısa timeout fault testi, iptal ve lease kurtarma regresyonları birlikte geçmeli.
5. Orta — PDF → Excel: çizgisiz/birleşik hücreler için profil seçimi. Yeniden kabul: hücre ≥%99, satır/sütun ≥%98, kritik sayılar tam; inert formül metni korunmalı.
6. Orta — OCR yön/çözünürlük: tek profile geçmeden aynı corpus üzerinde CER/WER ve üç tekrar. Temiz ≥%98 / bozulmuş ≥%95 karakter hedefi; iyileşen dönük örnek diğer sınıfları bozmamalı.
7. Orta — Türkçe filigran ve döndürülmüş sayfa numarası: gömülü font/koordinat düzeltmesi. Yeniden kabul: sekizer senaryoda görünür metin, konum ve sayfa sınırları.
8. Sonraki kapsam — Çalışan çekirdekleri koru; eksik görsel/Office referans ve PDF özellik koruma kapılarını tamamla. Hız/bellek adayı aynı kalite kapılarıyla karşılaştırılmalı; medyan süre veya tepe bellekte %20 hedefi henüz kanıtlanmış bir kazanım değildir.

Upstream kaynakları (23 Ekim 2026 kontrolü): [pdf2docx bakım durumu](https://github.com/ArtifexSoftware/pdf2docx/discussions/374), [pdf2docx MIT lisansı](https://pdf2docx.readthedocs.io/en/latest/license.html), [PyMuPDF lisansı](https://pymupdf.readthedocs.io/en/latest/license.html), [Tesseract kalite önerileri](https://tesseract-ocr.github.io/tessdoc/ImproveQuality.html), [pdfplumber tablo stratejileri](https://github.com/jsvine/pdfplumber#extracting-tables), [QPDF kapsamı](https://qpdf.readthedocs.io/en/stable/overview.html). pdf2docx için Artifex aktif bakımı bırakmıştır; PyMuPDF lisans yükümlülükleri ayrı incelenmelidir. Bu rapor hukuki uygunluk onayı değildir.

## Yeniden üretim ve kanıtlar

`node scripts/audit-engines.mjs` 120 senaryoyu üçer kez çalıştırır. `node scripts/audit-engines.mjs --performance-only` performans kaydını üretir. `node scripts/audit-workflow.mjs` ayrı Docker projesinde tarayıcı/worker akışını çalıştırır ve sonunda yalnızca bu geçici projeyi kaldırır. `node scripts/report-engine-audit.mjs` raporu günceller.

Ham sonuçlar, ilk tekrar çıktıları, kaynak/çıktı/fark PNG’leri, tarayıcı ekranları ve ortam bilgisi ignored `.qa/engine-audit/` altındadır. Fixture üreticileri sentetiktir; gerçek kullanıcı belgeleri rapora veya Git’e eklenmez.
