# Sprint 2 — Dosya seçimi ve işlem başlangıcı

**Durum:** Tamamlandı  
**Kapsam:** S2-01–S2-10  
**Tarih:** 2026-10-24

## Tamamlanan işler

- **S2-01 — Hero metni:** Ana sayfa başlığı ve açıklaması dosya dönüştürme amacını açıkça anlatıyor. Alternatif metinler gerçek kullanıcı deneyiyle ölçülmedi; bu nedenle kazanan varyant iddiası yok.
- **S2-02 — Birincil dosya seçimi:** Dosya seçme ve sürükleyip bırakma ana başlangıç eylemi oldu. Ana sayfada tek dosya kabul ediliyor; birden fazla dosya bırakıldığında açık hata veriliyor.
- **S2-03 — Hızlı başlangıç:** Dosya seçimi, PDF için niyet/araç seçimine; tanınan diğer formatlar için uygun araca yönlendiriyor.
- **S2-04 — Tür ve boyut tutarlılığı:** Seçici, motor API'sinin sunduğu izinli türlerle sınırlandırıldı; desteklenmeyen/eski uzantılar ve boş dosyalar reddediliyor. Doğrulama sırasında `/api/capabilities` 10 MiB dosya sınırı ve etkin araç listesini bildirdi. Bu değerler istemcide sabit ürün gerçeği olarak kopyalanmıyor.
- **S2-05 — PDF niyet seçimi:** Yalnızca API'de etkin görünen PDF araçları sunuluyor. PDF → Word/Excel, görsel dışa aktarma, sıkıştırma, düzenleme, OCR, koruma/parola kaldırma, sayfa numarası ve filigran yönleri yer alıyor. Birleştirme seçeneği en az iki PDF gerektiğini belirtiyor.
- **S2-06 — Durumlar ve devam:** Sürükleme, seçili dosya, geçersiz dosya, iş ilerlemesi, başarı, hata ve iptal akışları görünür. Başarısız/iptal edilmiş iş yerel dosya hâlâ mevcutsa yeniden denenebiliyor; yeni yüklemeden önce eski iş erişimi kapatılıyor.
- **S2-07 — Dosya kontrolü:** Seçilen dosyanın adı, türü ve boyutu gösteriliyor; kullanıcı dosyayı kaldırabiliyor veya değiştirebiliyor.
- **S2-08 — Güven mesajı:** Dosyanın yalnızca işlem başlatıldığında yüklendiği doğru biçimde belirtiliyor.
- **S2-09 — Duyarlı arayüz:** Ana sayfa akışı küçük telefonlardan geniş masaüstü görünümüne kadar taşma olmadan kontrol edildi.
- **S2-10 — İşlem açıklaması ve erişilebilirlik:** PDF araçlarının ne yaptığı açıklanıyor; klavye ile seçim/yönlendirme, canlı durum bildirimi, hata duyurusu ve dosya seçimi sonrası başlık odağı ele alındı.

## Kontrol kanıtı

- `pnpm check` başarılı: mimari sınır kontrolü, Astro 53 dosyada hata/uyarı olmadan kontrol ve Svelte kontrolü hatasız.
- `pnpm build` başarılı: 104 statik rota üretildi. Vite, 500 kB üzeri JavaScript chunk uyarısı verdi; bu Sprint 2 işlevlerini engellemedi ve sonraki performans iyileştirmesinde ele alınmalı.
- Yerel tarayıcıda 320, 360, 390, 768, 1024, 1440 ve 1920 px genişlikleri kontrol edildi; yatay taşma görülmedi.
- Sentetik dosyalarla `.doc` uzantısının reddi, çoklu dosya bırakma hatası, 10 MiB üzeri dosya hatası, PDF araç menüsü ve araç rotasına geçiş kontrol edildi.
- Dosya seçimi ve araç seçimi sonrasında `/api/files` yükleme isteği oluşmadı. Bu, seçimin dosyayı yerelde tuttuğunu ve yüklemenin işlem başlatılana kadar başlamadığını doğruladı.
- Ekran görüntüleri: [ana sayfa — 390 px](screens/home-390.png), [ana sayfa — 1440 px](screens/home-1440.png), [PDF araçları — 390 px](screens/pdf-actions-390.png), [PDF araçları — 1440 px](screens/pdf-actions-1440.png).

## Kapsam sınırı

Bu sprintte gerçek bir dosyanın yüklenmesi ve motor dönüşümünün uçtan uca kalite doğrulaması yapılmadı. Tarayıcı kontrolü seçim, doğrulama ve yönlendirmeyi sentetik dosyalarla kanıtlıyor; dönüşüm motoru kalitesi veya gerçek kullanıcı davranışı hakkında sonuç çıkarmıyor. Mevcut motor destek sınırları geçerlidir.

## Değişen ana dosyalar

- `apps/web/src/components/hero.svelte`
- `apps/web/src/components/live-job.svelte`
- `apps/web/src/components/tool-workspace.svelte`
- `apps/web/src/i18n/ui.ts`
- `docs/USER-FLOWS.md`
- `docs/DESIGN-SYSTEM.md`
