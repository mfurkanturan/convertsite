# Sprint 4 — Araç detay sayfaları ve işlem akışı

**Durum:** Tamamlandı (arayüz ve içerik kapsamı)  
**Kapsam:** S4-01–S4-10  
**Tarih:** 2026-10-24

## Tamamlanan işler

- Bütün araç rotaları ortak başlık, açıklama, uygun yükleme alanı, ayar/limit bölümü, iş durumu ve yardım/içerik alanını kullanıyor. Sayfa düzenleyici ve çoklu dosya gibi özel ihtiyaçlar ayrı bileşenlerle korunuyor.
- Ana sayfa hero'su ve araç ekranları aynı `FileDropzone` bileşenini açık `variant`, dosya türü, çoklu seçim ve metin props'larıyla kullanıyor.
- Çok dosyalı seçimde ekleme, kaldırma, sürükleyerek veya klavye düğmeleriyle sıralama, dosya adedi, seçilen toplam boyut ve sunucu limitleri gösteriliyor. Sıralama/önizleme kontrollerinin hedef alanı en az 44 px.
- Job akışında yükleme, kuyruk, çalışma, başarı, hata, iptal, yeniden kontrol/yeniden deneme ve süre dolumu durumları var. Başarı ekranı dosya adı, biçim, boyut, indirme, yeni dosya, erken silme ve tanımlıysa ilgili sonraki araca bağlantı sunuyor.
- API hata sınıfları güvenli, anlaşılır kopyaya eşleniyor. Sayfa yenilemesinde aynı sekmedeki sessionStorage job kimliğiyle durum geri alınabiliyor; yerel dosya geri yüklenemediğinde yeniden seçme gerektiği açıklanıyor.
- Türkçe/İngilizce araç SEO metinlerinde yanlış limit ve doğrulanmamış kalite vaatleri düzeltildi. PDF birleştirme 20 dosya/300 sayfa/10 MiB dosya/40 MiB toplam sınırlarıyla, görsel→PDF JPG/PNG desteğiyle tutarlı hale getirildi. PDF→Word ile Office→PDF açıklamaları mevcut motor sınırlarını belirtiyor.
- İlgili tek kaynak belgeler `docs/USER-FLOWS.md` ve `docs/DESIGN-SYSTEM.md` içinde güncellendi.

## Kontrol kanıtı

- `pnpm check`: başarılı; boundary kontrolü geçti, Astro 53 dosyada 0 hata/uyarı/hint, Svelte 0 hata/uyarı.
- `pnpm build`: başarılı; API ve web build tamamlandı, 104 statik sayfa üretildi. Bilinen uyarılar: 500 kB üstü JavaScript chunk ve Node legacy build önerisi.
- `git diff --check`: başarılı; yalnızca Windows LF → CRLF bilgilendirmeleri çıktı.
- Chrome DevTools accessibility snapshot ile `/tr/merge-pdf` başlık hiyerarşisi, yükleme, limitler, araç bağlantıları ve FAQ incelendi; tek H1 doğrulandı.
- 390 px mobil emülasyonda belge genişliği 390 px; yatay taşma görülmedi. Klavyeyle Tab sırasının ilk kontrolleri ve arama kutusunda `:focus-visible` doğrulandı. Tarayıcı console error/warning kaydı yok.
- Başarı ekranının yeni ilgili araç linki kod ve build üzerinden doğrulandı; bu senaryoyu gösterecek gerçek conversion job çalıştırılmadı.
- Ekran görüntüsü kaydı, Chrome DevTools MCP dosya erişim kısıtı nedeniyle alınamadı.

## Sınırlar

- Gerçek yükleme → API → worker → indirme → silme uçtan uca dönüşümü bu UI/UX sprintinde çalıştırılmadı. Motor kalitesi ve canlı servis davranışı hakkında iddia yoktur.
- Önerilen sonraki araç, araç SEO yapılandırmasındaki ilk ilgili araca göre sunulur; kişiselleştirilmiş değildir.
- API total-byte limiti yetenek yanıtı gelene kadar görünmeyebilir; dosya başı ve araç limitleri başlangıçta ortak sözleşmeden gösterilir.
- Word/PDF görsel uyumluluğu motor, font ve kaynak düzenine bağlıdır; birebir görünüm garantisi verilmez.
