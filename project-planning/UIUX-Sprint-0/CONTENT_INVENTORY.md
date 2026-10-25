# Sprint 0 — İçerik, bölüm ve araç envanteri

## Mevcut ana sayfa

| Sıra | Bölüm | Mevcut işlev / içerik | Karar |
|---:|---|---|---|
| 1 | Sticky header | Logo, kategori düğmeleri, araç araması, kullanım rehberi, dil seçici; mobil hamburger/yan menü | KORU + sadeleştir; güvenlik/gizlilik bağlantısının bulunurluğunu artır |
| 2 | Hero | “PDF ve Belgelerinizi Saniyeler İçinde Dönüştürün”, dosya seç/bırak ve seçilen PDF için sekiz öneri; ayrıca “Tüm Araçları İncele” CTA | DEĞİŞTİR; tek bir baskın görev/CTA, güvenilir kopya |
| 3 | Güven şeritleri | “Tam Gizlilik”, “Kayıpsız Motor”, “Otomatik İmha” | BİRLEŞTİR; teknik iddialar güncel kanıtla eşleşmiyor |
| 4 | 16 araç kataloğu | Aynı yoğunlukta 16 kart; 3 filtre kategorisi (Convert, Organize, Optimize); statik sıralama | DEĞİŞTİR; önerilen araçlar + kategori bazlı kompakt tam katalog |
| 5 | Ad slotu | Araç kartlarından sonra, rehberlerden önce; development placeholder | KORU, yalnızca yasal/gizlilik gereklilikleriyle ve iş akışından uzakta |
| 6 | Kullanım rehberleri | Highlight sekmesi + kategori sekmeleri + aynı görsel yoğunlukta altı kart | DEĞİŞTİR; 1 featured + 2 secondary + tüm rehberlere kısa link |
| 7 | Güvenlik/performans | 3 güven kartı ve ayrı gizlilik bandı | BİRLEŞTİR; yalnızca kanıtlı saklama/işleme özeti |
| 8 | FAQ | Dört soru/cevap | KORU + DÜZELT + genişlet |
| 9 | Footer | 16 araç, sekiz rehber, beş yasal/kurumsal link ve tekrar eden alt linkler | DEĞİŞTİR; 3–4 bağlantı grubu |

## Mevcut araç katalog taksonomisi

Repo apps/web/src/lib/tools.ts içinde 16 tool kaydı bulunuyor. Mevcut kategori seti Convert, Organize, Optimize; OCR araçları Optimize altına konmuş. Bu önerilen ürün taksonomisi doğrulanmış bir popülerlik gruplaması değildir.

| Kimlik | Mevcut ad (TR) | Girdi → çıktı | UI kategorisi |
|---|---|---|---|
| pdf-to-word | PDF → Word | PDF → DOCX | Dönüştür |
| word-to-pdf | Word → PDF | DOCX → PDF | Dönüştür |
| pdf-to-excel | PDF → Excel | PDF → XLSX | Dönüştür |
| excel-to-pdf | Excel → PDF | XLSX → PDF | Dönüştür |
| pptx-to-pdf | PowerPoint → PDF | PPTX → PDF | Dönüştür |
| pdf-to-images | PDF → JPG / PNG | PDF → JPG/PNG | Dönüştür |
| images-to-pdf | JPG / PNG → PDF | JPG/PNG → PDF | Dönüştür |
| merge-pdf | PDF birleştir | 2+ PDF → PDF | Düzenle |
| edit-pdf-pages | PDF sayfalarını düzenle | PDF → PDF/ZIP | Düzenle |
| page-numbers | Sayfa Numarası Ekle | PDF → PDF | Düzenle |
| watermark-pdf | Filigran Ekle | PDF → PDF | Düzenle |
| compress-pdf | PDF sıkıştır | PDF → PDF | Optimize et |
| protect-pdf | PDF Şifrele | PDF → PDF | Optimize et |
| unlock-pdf | PDF Şifresi Kaldır | Parolalı PDF → PDF | Optimize et |
| ocr | Metin çıkar (OCR) | PDF/JPG/PNG → TXT | Optimize et |
| pdf-to-pdf-ocr | PDF’yi aranabilir yap (OCR) | PDF → PDF | Optimize et |

Arama normalleştirilmiş ad/açıklamayı filtreler; “image to pdf”, “rotate”, “unlock” gibi alias/synonym sözlüğü görünmüyor. popular işareti birkaç araçta var ancak ana katalog tüm araçları tanımlı sırada aynı kart formatında gösteriyor. Mevcut analytics verisi “popüler” sıralamasını desteklemiyor.

## Güvenlik ve performans kopyası — teyit tablosu

| Konum | Görünen ifade / vaat | İçerik kararı |
|---|---|---|
| Hero altı kart | Tam gizlilik, hiçbir tarama/saklama yok | RAM-only değil; private disk ve metadata var. Daralt ve teyit et. |
| Hero altı kart | Kayıpsız motor, yüksek çözünürlüklü çıktı garantisi | Araçların hepsi için doğru değil. Kaldır; yalnızca araca özel doğrulanmış teknik sınırı göster. |
| Hero altı kart | Otomatik imha / işlem bittiği an tek tıkla silme | Erişim kapatma, fiziksel silme, otomatik expiry ayrı zamanlardır. Doğru süreyle yeniden yaz. |
| Ana sayfa FAQ | Word/Excel'e yüksek doğruluk, taramalı belge OCR'ı | PDF→Word/Excel için ölçüm bazlı sınırlamaları belirt; OCR düz TXT/aranabilir PDF farkını açıkla. |
| Güvenlik sayfası | RAM, zero permanent storage, hiç staff/third party erişemez, zero traces, 256-bit TLS | Operasyonel kanıt gerektirir; mevcut metinden mutlak ifadeleri kaldır. |
| Gizlilik sayfası | Sıfır kalıcı depolama, 60 dakika, derhal fiziksel silme, yalnızca Cloudflare analytics | Private disk, 120 saniye silme grace'i ve PostHog/AdSense ile çelişen yerleri düzelt. |
| Footer | Otomatik süre dolumu | Gerçek production RETENTION_MINUTES ve worker cleanup davranışına bağla. |
| Araç kartları | Dönüşüm saniyeler içinde, düzenlenebilir/yüksek kaliteli vb. | Hız/kaliteyi bütün araçlara genelleme; sınırlamayı upload'tan önce göster. |

## Rehber, FAQ, navigasyon ve hukuk içeriği

- Ana sayfa altı rehber kartı gösteriyor; rehber merkezi ve detay sayfaları statik SEO route'larıyla var.
- Header'da kategori, arama, kullanım rehberi ve dil seçimi var; güvenlik, FAQ ve politika sayfaları footer üzerinden bulunuyor.
- FAQ dört temel soru içeriyor; fiyat, dosya türü ve işleme/silme metinleri ürün belgeleriyle çapraz doğrulanmalı.
- Footer her aracı ve sekiz rehberi tek tek listeliyor; yasal bağlantılar ana footer gövdesi ve alt satırda tekrarlanıyor.
- Türkçe/İngilizce ana route, tool, guide ve yasal metinler var; iki dilde de claim tutarlılığı birlikte korunmalı.
