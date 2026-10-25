# Sprint 0 — Tasarım yönü

## Kompozisyon alternatifleri

### A. Araç kataloğu önce

Mevcut ana sayfa yapısını koruyup araç listesini önce popüler/önerilen ve sonra kategorilere ayırır; hero daha küçük kalır.

- Artısı: Mevcut kullanıcıların araç keşfi ve SEO düzenine yakın; düşük gezinme değişikliği.
- Eksisi: Dosyası elinde olan kullanıcı için ilk iş yine araç aramak; upload ürünün temel görevi olarak geri planda kalır.

### B. Dosya işlemi önce

Hero'da birincil eylem dosya bırakma/seçme olur. Tür algılandıktan sonra uygun ve doğrulanmış işlemler önerilir. Tanımlı araç kullanıcıları arama ve “Tüm araçlar” linkiyle doğrudan kataloğa ulaşır. Katalog önerilen araçları ve anlamlı kategorileri ayırır.

- Artısı: “Dosyam var” görevinin ilk adımını doğrudan sunar; mevcut Quick File Drop yatırımını kullanır.
- Eksisi: Yanlış veya desteklenmeyen türde dosya seçildiğinde açık hata/öneri akışı şarttır; çok sayıda işlem seçeneğiyle kullanıcıyı boğmamak gerekir.

### C. Rehber ve kullanım senaryosu önce

Hero sonrasında öğrenci, muhasebe, vize ve hukuk gibi rehber/kullanım senaryoları görünür; araçlar senaryoların içinden keşfedilir.

- Artısı: Aracın adını bilmeyen kullanıcıyı anlatımla yönlendirir ve içerik pazarlamasına alan açar.
- Eksisi: Ana ürün işi dosyayı hemen işlemek; içerik ağırlığı ilk eylemi geciktirebilir ve mevcut analitik rehber kullanımını ölçmüyor.

## Önerilen yön: B — dosya işlemi önce, A'nın keşif unsurlarıyla

Hero'yu ana işlem başlatma yüzeyi yap; dosya seçmeyi tek görsel primary CTA olarak kur, araç kataloğunu ikincil bir keşif yolu tut. PDF için sınırlı intent seçimleri; diğer formatlar için API/contract'ta gerçekten desteklenen araçlara açık yönlendirme yap. Ürün motor kalite sınırlamasını her araç sayfasında işlemden önce görünür kıl.

Ardından:

1. 4–6 **Önerilen araç** göster; PostHog örneklemi büyüyene kadar “Popüler” demek yerine editoryal öneri olarak adlandır.
2. 16 aracın tamamını Convert / Organize / Optimize / OCR gibi görev temelli gruplandır. Kayıtlı özellik kaybolmasın.
3. Arama alias'larını ve gerçek Türkçe/İngilizce kullanıcı terimlerini destekle.
4. Rehberleri 1 büyük içerik + 2 ikincil içerik + tüm rehberlere kısa yol olarak düzenle.
5. Güvenlik alanında tek bir teknik süreç göster; kanıtlanmamış “RAM-only / anında imha / zero logs” iddiaları kullanma.
6. Footer'ı ürün, rehber, güvenlik/yasal ve iletişim olarak sadeleştir.

## Görsel dil ilkeleri

- Mevcut marka mavisini, okunabilir type scale'ı ve kendi kendine barındırılan fontları koru; Sprint 0'da rebrand gerekçesi çıkmadı.
- Neon, yoğun gradient, dekoratif 3D ve gereksiz hareket kullanma.
- Araç işlevlerini yalnızca renk/ikonla ayırma; başlık, format ve durum metni daima görünür kalsın.
- Her bölümün bilgi yoğunluğuna uygun farklı yerleşimi olsun; her şey aynı 3 kolonlu karta dönmesin.
- 320px'te işlem akışında yatay kaydırma olmasın; kategori/tab gibi bilerek kayan alanlar kendi sınırlarında kalmalı.
- Tipografi, spacing, focus ve renk token'ları merkezi dosyadan yönetilmeye devam etsin.

## UI kararının dayandığı gözlemler

- Ana sayfada yükleme alanı var; fakat sol CTA “Tüm Araçları İncele”, sağ panel “Dosya Seç” ve seçilmiş PDF'nin ayrı intent matrisi olarak üç ayrı giriş odağı oluşuyor.
- Katalogda 16 kart aynı öncelikte. Ekran görüntüsünde masaüstünde 3 sütun, 1 kartlık son satır; 360px'te katalog 16 dikey kart olarak akıyor.
- OCR ayrı kategori değil; optimize altına konmuş.
- Mevcut araçların kalite ve destek kanıtı eşit değil; “önerilen” etiketi kalite onayı olmamalı.
- 768 ve 1024 viewport'ta yatay belge taşması ölçüldü; Sprint 1/7 kabul ölçütünde yeniden ölçülmeli.
- Mevcut analitik örneklemi gerçek popülerlik iddiasını desteklemiyor.

Bu yön Sprint 0 tasarım önerisidir; uygulama veya Sprint 1 onayı değildir.
