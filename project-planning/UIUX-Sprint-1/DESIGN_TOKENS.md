# Sprint 1 — Tasarım tokenları ve ortak arayüz

Durum: Uygulandı; yerel doğrulama devam ediyor.

Tek gerçek token kaynağı `apps/web/src/styles/tokens.css` dosyasıdır. Bu not, Sprint 1 kararlarını ve kullanım anlamlarını kaydeder.

## Renk ve anlam

| Kullanım | Token / değer | Karar |
| --- | --- | --- |
| Sayfa zemini | `bg` / `#F8FAFC` | Açık, sakin zemin |
| Kart ve paneller | `surface` / `#FFFFFF` | İçerik yüzeyleri |
| Ana metin | `text` / `#0F172A` | Başlıklar ve temel metin |
| İkincil metin | `text-soft` / `#475569` | Açıklamalar |
| Yardımcı metin | `text-muted` / `#64748B` | İkincil etiketler; küçük metin kontrastı ayrıca kontrol edilmeli |
| Kenarlık | `border`, `border-strong` | Kontroller ve ayırıcılar |
| Marka / eylem | `accent` / `#2563EB`, `accent-strong` / `#1D4ED8` | Mavi marka çizgisi korunur |
| Klavye odağı | `focus` / `#1D4ED8` | 3px belirgin dış halka |
| Başarı / uyarı / hata | `success`, `warning`, `danger` | Metin ve ikonla birlikte kullanılır |

Araç işaretleri araç türüne göre sabitlenmiştir: dönüştürme mavi, düzenleme mor, güvenlik menekşe, sıkıştırma turkuaz, OCR indigo. Renk tek başına bilgi taşımaz; araç adı ve ikonu görünür kalır.

## Ölçü ve tipografi

- Gövde 16px ve 1.5 satır yüksekliği.
- Yardımcı metin için 13px alt sınırı; çoğu açıklama 14px veya üzeri.
- Boşluklar 4px tabanlı ritme dayanır; proje bileşenleri 8/12/16/24/32/48px değerlerini kullanır.
- Kontrol/kart/panel köşeleri sırasıyla 8/12/16px.
- Dokunma hedefleri header, filtre, dil ve menü kontrollerinde en az 44px yüksekliğe çıkarıldı.
- İçerik sarmalayıcılarının üst sınırı 1240px.

## Ortak durumlar

- `ToolSearch`: etiketli combobox, öneri listesi, aktif seçenek, boş sonuç, temizleme ve klavye etkileşimleri.
- `filter-chip`: normal, hover, seçili (`aria-pressed`) ve klavye odağı.
- `field`, `Button`, kartlar, yükleme/sonuç panelleri mevcut ortak sınıflarını ve semantik durumlarını kullanmayı sürdürür.
- Azaltılmış hareket tercihi global CSS ile korunur.

## Gezinti ve logo

Geniş görünümde üst barda Tüm araçlar, Kullanım rehberleri ve Güvenlik bağlantıları; küçük görünümde 44px menü düğmesi ve yan çekmece bulunur. Arama tüm sayfalarda yazma sırasında sayfa değiştirmez; sonuç seçilince araca gider. Marka ismi ve mavi renk korunarak belge/ek işareti sadeleştirilmiştir.

## Kontrast notu

Beyaz yüzey üzerinde ölçülen kontrast: ana metin `#0F172A` 17.85:1, ikincil metin `#475569` 7.58:1, yardımcı metin `#64748B` 4.76:1, vurgu `#2563EB` 5.17:1, koyu vurgu/odak `#1D4ED8` 6.70:1. Bu eşleşmeler normal metin için WCAG AA 4.5:1 eşiğini geçer. Ölçüm tüm sayfalardaki tüm renk/zımın eşleşmelerinin denetlendiği anlamına gelmez; kapsamlı WCAG 2.2 AA kontrolü sonraki erişilebilirlik sprintinde sürer.
