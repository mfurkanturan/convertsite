# Sprint 3 — Araç kataloğu ve keşif

**Durum:** Tamamlandı  
**Kapsam:** S3-01–S3-10  
**Tarih:** 2026-10-24

## Tamamlanan işler

- 16 aracın tamamı **Dönüştür (7)**, **Düzenle (4)**, **Optimize et ve koru (3)**, **OCR (2)** gruplarına ayrıldı. OCR ile aranabilir PDF araçları ayrı tutuldu.
- Dört hızlı başlangıç aracı üstte featured kartlarla sunuluyor. Gerçek kullanım sıklığı verisiyle doğrulanmadığından “popüler” yerine “Önerilen / Suggested” adı kullanılıyor.
- Kalan araçlar kategori başlıkları altında daha kompakt kartlarla gösteriliyor; arama sonuçları orta yoğunlukta kart kullanıyor. Her kartta ad, kısa açıklama ve girdi → çıktı biçimi var.
- Beş kategori filtresi aramayla birlikte çalışıyor. Filtre görünümü `#tools`, araç görünümü mevcut `#tool/{id}` hash rotasıyla çalışıyor. Kategori query parametresi eklenmedi; filtre geçici sayfa görünümü, arama durumu da URL paylaşımı gerektirmeyen katalog durumu olarak değerlendirildi.
- Arama Türkçe/İngilizce adları ve dosya/iş terimleri eşanlamlılarını kapsıyor: `jpg to pdf`, `image to pdf`, `merge pdf`, `xlsx to pdf` vb. Sonuç yok durumu filtreleri temizleme eylemi sunuyor.
- Tüm kartlar iç içe tıklanabilir öğe içermeyen semantik `<button>` eylemleri. Hover, görünür klavye odağı ve disabled görünümü var. Katalog API `enabledTools` politikasını okuyup kapalı araçları işaretler; karta tıklamak kullanıcıyı neden/yardım bilgisinin bulunduğu araç ekranına götürür.
- Footer ve mobil menüde ölçülmemiş “popüler/sık kullanılan” iddiaları “Araçlar / Önerilen araçlar” olarak düzeltildi.

## Kontrol kanıtı

- `pnpm check` başarılı: modül sınırları geçti; Astro 53 dosyada 0 hata/uyarı; Svelte 0 hata/uyarı.
- `pnpm build` başarılı: 104 statik sayfa üretildi. Vite mevcut 500 kB üstü JavaScript chunk uyarısını verdi.
- Playwright ile yerel `http://127.0.0.1:4322/tr/` üzerinde OCR filtresinin iki aracı gösterdiği, `image to pdf`, `jpg to pdf` ve `merge pdf` aramalarının doğru aracı bulduğu kontrol edildi.
- 390 px görünümünde yatay taşma yok; katalog toplamı 16 araç. Kategori gruplarında önerilen kartlar üst bölümde tutulduğundan kalan kart adetleri sırasıyla 5/3/2/2.
- Ekran görüntüleri: [katalog — 1440 px](screens/catalog-1440.png), [katalog — 390 px](screens/catalog-390.png).

## Bilinçli sınırlar

- Önerilen araç sıralaması analitik ölçüme dayanmıyor; kullanımı ölçülmüş gibi sunulmuyor.
- Arama veya kategori filtresi yenileme/link paylaşımı sonrası geri yüklenmiyor. Bu sprintte araç yönlendirme hash'i ve mevcut SPA akışı korundu.
- API yetenek isteği başarısızsa katalog uygunluk durumunu bilinmiyor sayar ve araçları gizlemez; gerçek işlem başlatma uygunluğu araç çalışma ekranında tekrar API `enabledTools` bilgisiyle kontrol edilir.
- Bu sprintte dönüşüm motorları veya backend işleyişi değiştirilmedi.
