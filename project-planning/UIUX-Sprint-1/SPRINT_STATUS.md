# UI/UX Sprint 1 — Durum

Durum: Tamamlandı.

## Tamamlanan işler

- Semantic renk ve focus tokenları, tipografi ölçüleri, 4px tabanlı spacing yaklaşımı, radius/shadow değerleri tek tema kaynağında düzenlendi.
- Araç ikon renkleri beş anlamlı gruba sabitlendi: dönüşüm, sayfa düzenleme, PDF güvenliği, sıkıştırma ve OCR.
- Header masaüstünde Tüm araçlar / Kullanım rehberleri / Güvenlik bağlantılarını, dar ekranda menüyü sunacak şekilde yeniden düzenlendi.
- Yan çekmece breakpoint'i header ile eşitlendi; ortak kontrollerin hedef yüksekliği en az 44px oldu.
- Footer destek e-postasının dar tablet genişliklerinde oluşturduğu yatay taşma giderildi.
- Arama `ToolSearch` bileşenine ayrıldı; Türkçe karakter normalizasyonu, sonuç önerileri, sonuç yok durumu, temizleme, ok tuşları, Enter ve Escape eklendi.
- Araç sayfasında arama yazmak artık sayfayı değiştirmiyor; seçim araca gider.
- Logo işareti hafifçe sadeleştirildi; marka adı/mavi kimlik korundu.
- `DESIGN-SYSTEM.md` ve `DESIGN_TOKENS.md` kararları uygulamayla hizalandı.

## Doğrulama

`pnpm check` geçti: modül sınırı, TypeScript, Astro ve Svelte kontrollerinde 0 hata ve 0 uyarı.

`pnpm build` geçti ve 104 statik sayfa üretildi. Vite, mevcut büyük JavaScript parçası için 500kB üstü uyarısı verdi; Sprint 1 değişiklikleri için derlemeyi durdurmadı.

Yerel Chrome ile 320, 360, 390, 768, 1024, 1440 ve 1920px genişlikler ölçüldü. Bu genişliklerin hepsinde header kendi sınırları içinde kaldı ve belge yatay taşmadı. Kaydırma sonrası sticky header üstte kaldı. Araç sayfasındaki aramada yazarken URL değişmedi; ArrowDown + Enter öneriyi seçti, Escape listeyi kapattı ve sonraki yazımda liste tekrar açıldı. Mobil ve masaüstü tam sayfa görüntüleri `screens/` içindedir.

## Kapsam dışı / açık

- Hero ve araç kataloğunun görsel kompozisyonu değiştirilmedi.
- Bu sprint tüm sayfalar için WCAG 2.2 AA sertifikası veya tam erişilebilirlik garantisi vermez.
- Büyük JS parçası için Vite uyarısı mevcut; optimizasyon Sprint 4 performans kapsamına bırakıldı.
