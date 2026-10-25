# Sprint 0 — Bilgi mimarisi ve görev akışları

## Birincil kullanıcı görevleri

| Kullanıcı niyeti | İlk tercih | İhtiyaç duyduğu güven/geri bildirim |
|---|---|---|
| “Ne yapacağımı biliyorum.” | Araç araması, doğrudan link veya Önerilen işlem | Doğru giriş/çıktı, gerçek limit, işlem seçeneği |
| “Dosyam var, hangi aracı seçmeliyim bilmiyorum.” | Dosya bırak/seç; tür algılandıktan sonra uygun işlem önerisi | Uyumlu/uyumsuz tür açıklaması, başka işlem önerileri |
| “Aracı arıyorum.” | Arama ve kategori kataloğu | Terimler/eş anlamlılar, boş sonuç ve sıfırlama |
| “Gizlilik ve kaliteyi bilmek istiyorum.” | Kısa teknik süreç özeti; ayrıntı sayfası/FAQ | Yerel/sunucu tarafı işleme, saklama ve fiziksel silme ayrımı; araç kalite sınırı |
| “İşim hata verdi / sonucu almak istiyorum.” | Durum/result paneli | İnsan dilinde hata, yeniden dene, indirme, silme ve expiry |

## Önerilen ana sayfa sırası

1. **Header:** Logo, Araçlar, Rehberler, Güvenlik/Gizlilik, arama ve dil seçimi. Mobilde arama ve araçlara erişim ilk ekranda anlaşılır kalsın.
2. **Tek odaklı Hero + Quick File Drop:** Dosya seçme/bırakma birincil eylem; araç seçme/araçları görme ikincil bağlantı. Dosya türüne göre öneri akışı.
3. **Önerilen araçlar:** 4–6 araçlık kısa grup. Kullanım kanıtı yetersiz olduğu için ilk etapta “Popüler” yerine “Önerilen” etiketi kullan.
4. **Tüm araçlar:** Convert / Organize / Optimize / OCR gibi ürün taksonomisine göre 16 aracın tamamı; arama, filtre ve boş sonuç durumu.
5. **Kullanım rehberleri:** Editoryal düzen: bir öne çıkan rehber, iki ikincil içerik, kalanlara kısa bağlantı.
6. **Dosya güvenliği:** Bir kanıtlı mini süreç: yükleme → izole motor → sonuç → erişim kapanması/silme süresi. Ayrıntılı politikaya link.
7. **FAQ:** Maliyet, desteklenen format ve gerçek motor sınırları, dosyanın nerede işlendiği, silme, hatalar, büyük belgeler ve sonuç kalitesi.
8. **Footer:** Ürün, kaynaklar, güvenlik/yasal, iletişim; araç ve rehberlerin tümünü tekrar eden uzun link listesi yok.

## Akış ilkeleri

### Dosya ile başlama

Dosya seçme ve drag/drop aynı uzantı, boyut ve destek kontrolünü kullanır. Desteklenmeyen dosya yüklemeye geçmeden neden reddedildiğini ve desteklenen alternatifi gösterir. PDF seçildiyse niyet seçenekleri; DOCX/XLSX/PPTX ve JPG/PNG seçildiyse yalnızca doğrulanmış araçlara yönlendirme yapılır. Kalite sınırlaması işlem öncesi ilgili araçta görünür.

### Araçla başlama

Kullanıcı aramadan araca gider, uyumlu format/limit ve gerekli ayarı görür, dosya seçer, API'nin verdiği gerçek capability/limit değerleriyle işlemi başlatır. Kuyruk ve motor işleme durumu ayrıdır. Sonuçta boyut/tür, indirme, yeni iş ve silme/expiry bilgisi sunulur.

### Güvenlik ve sonuç kalitesi

Kısa anlatım ile teknik politika birbirinden ayrılır. Reklam ve analitik işlevleri dosya işleme iddiasına karıştırılmaz. “Kullanıcı indirmeyi tıkladı” ile “dosyayı cihazına kaydetti” ayrımı korunur. Kayıpsız, birebir düzen, anında silme veya RAM-only gibi kanıtlanmamış vaat kullanılmaz.
