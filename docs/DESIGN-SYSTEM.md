# Tasarım sistemi

Durum: İlk görsel yön. Marka adı ve nihai görsel kimlik açık karardır. Tasarım, hızlı ve anlaşılır belge işlemlerini destekler.

## Görsel yaklaşım

Açık zemin, belirgin tipografik hiyerarşi, sınırlı vurgu rengi ve geniş okunabilir alan kullanılır. Araç ekranında birincil eylem nettir. Dekoratif animasyonlar işlem durumunu taklit etmez; arayüzde teknik altyapı ayrıntıları gösterilmez.

## Başlangıç token'ları

Değerler tek kaynak olarak `apps/web/src/styles/tokens.css` içinde Tailwind `@theme` bloğunda tutulur; gerçek metin/zemin eşleşmeleri uygulamada kontrast kontrolünden geçer.

| Token | Değer | Kullanım |
| --- | --- | --- |
| background | #F8FAFC | Sayfa zemini |
| surface | #FFFFFF | Kart ve işlem paneli |
| text-primary | #0F172A | Ana metin |
| text-secondary | #475569 | Yardımcı metin |
| text-muted | #64748B | Soluk yardımcı metin |
| border | #E2E8F0 / #CBD5E1 | Ayırıcı ve kontrol sınırı |
| accent | #2563EB | Birincil eylem ve bağlantı |
| accent-strong | #1D4ED8 | Accent hover/basılı durum |
| success | #166534 | Başarı metni ve ikonu |
| warning | #92400E | Uyarı metni ve ikonu |
| danger | #B91C1C | Hata metni ve ikonu |
| tool-* (10 renk) | araç başına asıl + `-soft` zemin tonu | Araç ikonu ve kimlik rengi |

Renkler token olarak tanımlanır; bileşenlerde rastgele hex değerleri çoğaltılmaz. Durumlar renk yanında metin ve ikonla da anlatılır.

Global CSS sıfırlamaları `@layer base`, paylaşılan sınıflar (`.field`, `.tool-icon`, `.eyebrow`) `@layer components` içinde tutulur. Katmansız kural yazılmaz; katmansız kurallar Tailwind utility'lerini (margin, border, font boyutu) ezer.

## Tipografi ve ölçüler

- Gövde metni 16px; satır yüksekliği yaklaşık 1.5. Yardımcı metin 13–14px altına inmez.
- Yazı tipi: self-host variable font. Gövde `Inter Variable`, başlıklar `Sora Variable`; ikisi latin-ext destekli (Türkçe glif). Harici font isteği yok.
- Tipografi ölçeği: 12, 14, 16, 20, 24, 32, 40px; mobilde başlıklar taşmaz.
- Boşluk ölçeği: 4, 8, 12, 16, 24, 32, 48, 64px.
- Köşe yarıçapları: kontrol 8px, kart 12px, büyük panel 16px.
- İçerik alanı yaklaşık 1120px üst sınır; araç çalışma alanı ihtiyaç halinde ayrı token kullanabilir.
- Etkileşim hedefleri yaklaşık en az 44×44px; klavye odak halkası belirgin.
- Araç ekranında açıklama ve durum metinleri 14px altına düşmez; ana gövde 16px kalır. Form kontrolleri 48px, küçük ikon eylemleri en az 44px yüksekliğinde olur.
- Dosya ekleme, ayar ve başlatma tek anlaşılır akışta sunulur; kullanıcıdan görünür olan dosya seçimini ikinci kez onaylaması istenmez.

## Sayfa düzenleri

### Ana sayfa

Basit başlık, kısa ürün açıklaması, araç araması ve 10 araç kartı. Mobilde tek, orta genişlikte iki, geniş ekranda üç sütun önerilir. Arama yalnızca araçları filtreler; bulunmayan sonucu açıkça söyler.

### Araç sayfası

Araç adı ve açıklama → desteklenen girdiler/limitler → yükleyici → dosyalar ve ayarlar → birincil eylem → işlem durumu → sonuç alanı. Alt bölümde kısa kullanım açıklaması ve ilgili SSS bulunur. Ayarlar mobilde de işlem akışında erişilebilir kalır.

Uygulanan düzen: geniş ekranda (≥1024px) sol sütunda yükleyici, dosya listesi ve "İşlemi başlat" paneli; sağ sütunda yapışkan ayar paneli. Dar ekranda sıra yükleyici → dosyalar → ayarlar → başlat'tır. Dosya seçildikten sonra yükleyici kompakt satıra küçülür.

İlk reklam alanı ana sayfada araç kartlarından sonra ve kullanım rehberlerinden önce yer alır. Google AdSense reklam birimi kimlikleri ayarlanana kadar placeholder yalnızca geliştirme önizlemesinde görünür; kimlikler olmadan production'da boş alan bırakılmaz. Araç çalışma/indirme akışının içine, açılır pencere olarak veya sabit mobil yüzeyde reklam konmaz. Zorunlu üyelik penceresi ve dikkat dağıtan promosyon alanı kullanılmaz. Reklam entegrasyonunu yayına almadan önce gizlilik açıklaması ve gerekli bölgesel onay akışı tamamlanmalıdır. Marka ve footer metinleri ürün kararlarıyla tamamlanır.

## Ortak bileşenler

| Bileşen | Gerekli durumlar |
| --- | --- |
| ToolCard | Normal, hover, focus, kullanılamıyor |
| FileDropzone | Boş, sürükleme, yükleme, hata, devre dışı |
| FileList | Dosya bilgisi, kaldırma, sıralama |
| PageGrid | Yükleniyor, sayfa seçili, döndürülmüş, küçük resim hatası |
| SettingsPanel | Varsayılan, doğrulama hatası, devre dışı |
| Button | Normal, hover, focus, loading, disabled |
| JobStatus | Kuyrukta, işleniyor, iptal ediliyor, hata |
| ResultPanel | Hazır, indiriliyor, siliniyor, süresi doldu |
| InlineNotice | Bilgi, başarı, uyarı, hata |

Bileşenlerde iş kuralları kopyalanmaz; sunucunun araç yetenekleri ve politika verisi kullanılır. Birincil eylem metni somut olur: “PDF'leri birleştir”, “Word'e dönüştür”, “Sonucu indir”.

## Erişilebilirlik

- Hedef WCAG 2.2 AA; tamamlandığı ancak gerçek kontrollerle söylenir.
- Bütün kontroller etiketli, odak sırası anlamlı ve yalnızca klavyeyle kullanılabilir olur.
- Sürükle-bırak dışında dosya seçme ve yukarı/aşağı taşıma butonları bulunur.
- İşlem durumu uygun live region ile bildirilir; her polling yanıtı tekrar okunmaz.
- Hata, ilgili alanla ilişkilendirilir; yalnızca toast'a bırakılmaz.
- Reduced-motion tercihi uygulanır; animasyon anlamın tek taşıyıcısı olmaz.
- Diyalog gerekiyorsa odağı yönetir ve kapanınca tetikleyiciye geri verir.
- 320px genişlikte ana iş akışı yatay kaydırma gerektirmemeli; uzun dosya adları kontrollü kırpılır ve erişilebilir tam ad korunur.

## Arayüz performansı ve kabul

Statik alanlara gereksiz hydration eklenmez. Önizleme kodu yalnızca ihtiyaç duyan araçlarda yüklenir. Görsellerin boyutları ayrılır; sayfa değişimi ve sonuç görünmesi gereksiz yerleşim sıçraması yaratmaz.

Kabul kontrolü: mobil/masaüstü düzen, klavye akışı, kontrast, uzun Türkçe metinler, boş/hata/yükleme/sonuç durumları ve düşük bağlantı davranışı. Her yeni tasarım durumunun motor çalıştırması gerekmez; sentetik UI verileriyle de incelenebilir.
