# Ajan çalışma kuralları

Bu repository, PDF ve ofis dosyası araçları sunan bir web uygulaması içindir. Hedef mimari, aynı kod tabanından çalışan API ve worker süreçlerine sahip modüler monolith'tir.

## Önce okunacaklar

- Ürün kapsamı: [PRODUCT](docs/PRODUCT.md)
- Bağımlılık ve katman kuralları: [ARCHITECTURE](docs/ARCHITECTURE.md)
- Modül sahipliği ve sözleşmeler: [MODULES](docs/MODULES.md)
- Kodlama ve doğrulama kuralları: [CODING-STANDARDS](docs/CODING-STANDARDS.md)
- Dosya veya worker değişikliklerinde: [FILE-PROCESSING](docs/FILE-PROCESSING.md)
- Arayüz değişikliklerinde: [USER-FLOWS](docs/USER-FLOWS.md) ve [DESIGN-SYSTEM](docs/DESIGN-SYSTEM.md)
- Teknoloji ve aşama seçimlerinde: [TECH-STACK](docs/TECH-STACK.md) ve [ROADMAP](docs/ROADMAP.md)
- Uzman rolleri ve sahiplik: [TEAM](docs/TEAM.md). Rol yönergeleri `.claude/agents/doctorconverter-*.md` dosyalarındadır; Claude Code bunları otomatik kullanır, diğer araçlar ilgili alandaki dosyayı açıp izler.

## Zorunlu sınırlar

1. Önce mevcut yapıyı incele; aynı sorumluluğu taşıyan ikinci bir altyapı oluşturma.
2. Domain koduna framework, HTTP, SQL, dosya sistemi veya dönüşüm motoru bağımlılığı ekleme.
3. İş kurallarını route, UI bileşeni, başlangıç dosyası veya kuyruk callback'i içine koyma.
4. Başka bir modülün iç dosyalarına veya tablolarına doğrudan erişme. Yalnızca açık modül sözleşmesini kullan.
5. Dosya içeriğini veritabanına, kuyruğa veya loglara koyma. Kimlik ve gerekli metadata kullan.
6. Dönüşümü HTTP isteği içinde çalıştırma. Kaynakları sınırlanmış worker üzerinden yürüt.
7. Kullanıcı girdisiyle shell komutu oluşturma. Sabit executable ve doğrulanmış argüman dizisi kullan.
8. Her yeni araç için kendi handler'ını oluştur; bütün araçları yöneten dev servis veya koşul zinciri büyütme.
9. Gerçek belgeleri fixture olarak commit etme; sentetik, kişisel veri içermeyen örnekler kullan.
10. Gereksiz katman, bağımlılık, genel amaçlı base class veya mikroservis ekleme.

## İşin tamamlanması

- Etkilenen davranışa uygun kontrolleri çalıştır; çalıştırılamayanları sebebiyle bildir.
- Test veya build çalıştırmadan geçtiğini söyleme.
- Geçici çözüm, desteklenmeyen dosya türü ve motor sınırlamalarını açıkça bildir.
- Davranış veya mimari karar değiştiğinde ilgili tek kaynak belgeyi güncelle.
- Otomatik süre dolumu ve erişim kontrolünü yeni özellikte de koru.

## Komutlar ve mevcut durum

Yerel frontend önizlemesi `apps/web` altında kuruludur. Repository kökünde `pnpm install`, `pnpm dev`, `pnpm check`, `pnpm build` ve build sonrasında `pnpm preview` kullanılır. Kurulum ve sınırlar için [README](README.md) dosyasını oku.

Backend ilk dilimi apps/server altındadır. `pnpm setup:local`, `pnpm infra:up`, `pnpm test`, `pnpm infra:down` yerel Docker akışıdır. Backend değişince imajı yeniden build et. Test sırasında worker durur ve sonunda yeniden açılır; kullanıcı verilerini test verilerinden ayır.

16 araç için yerel motor handler'ı kayıtlıdır; kayıt uçtan uca destek kanıtı değildir. Destek/kalite sınırları docs/ENGINE-SUPPORT.md, ölçülen bulgular docs/ENGINE-AUDIT.md içindedir. Gerçek yüklemede API politikasını esas al. Dosya türü ve seçenekler shared contracts üzerinden doğrulanır. PDF → Word/Excel için birebir yerleşim veya taranmış tablo desteği iddia etme. .env ve .data içeriğini commit etme veya loglama. API, DATA-MODEL, TESTING ve DEPLOYMENT belgelerini ilgili değişiklikte oku.

Ürün varsayımları ve açık kararlar PRODUCT içinde, teknik adaylar TECH-STACK içinde tutulur. Belgelerdeki hedefler, uygulanmış özellik kanıtı değildir.
