# Görsel kalite sprint raporları

Tarih: 25 Ekim 2026. Başlangıç incelemesi: [design-audit](../design-audit.md). Bu kayıt önceki içerik sadeleştirme raporundan ayrıdır. Mevcut işlevler ve backend politikaları değişmez. Ekran görüntülerinde API politikası sentetiktir; dönüşüm başarısı iddia edilmez.

## Sprint 0 — inceleme

- Tamamlanan: component/veri/rota ağacı, tipografi ve token envanteri, hiyerarşi/kontrast/breakpoint sorunları, ortak bileşen etki analizi.
- Dosyalar: `design-audit.md`; yerel `.qa/visual-quality/capture.cjs` ve kaynak başlangıç kopyaları.
- Önce: TR/EN, 320/360/390/768/1024/1440/1920px tam sayfa ve bölüm görüntüleri `.qa/visual-quality/before/` içinde. İlk görsel inceleme katalogda 14px kompakt başlık ve merkezlenen alt satırı doğruladı.
- Test: mevcut Chromium ana sayfa/kontrast/arama/kategori testleri 4/4 geçti.
- Açık sınır: tarayıcı testleri gerçek motor veya fiziksel cihaz kanıtı değildir. Çalışma ağacında önceden bulunan değişiklikler korunur.
- Sonraki bağımlılık: ortak container/token temeli.

## Sprint 1 — görsel temel

- Tamamlanan: 1200px dış container, ortak 16/24/32px gutter, 24–28px section H2 ve 13px format metadata tokenları; section spacing/motion tokenları. Mevcut mavi ve metin renkleri korunur.
- Dosyalar: `styles/tokens.css`, `styles/global.css`; AppShell/Topbar/SiteFooter container’ları; scenario hub/doküman header hizası; Tools/Guides/Help başlıkları.
- Gerekçe: başlıklar aynı ritimde; 1440px’de okunabilir içerik 1136px; bağımsız 1240px tanımlarının çelişmesi engellendi. Kart ve grid düzeni bu sprintte değiştirilmedi.
- Karşılaştırma: `.qa/visual-quality/before/` → `sprint-1/`; H2 mobil 22/20px yerine 24px, masaüstü en çok 28px. Paylaşılan fontlar aynı.
- Test: Chromium TR/EN rehber kompozisyonu, kontrast ve 320px taşma 3/3 geçti. Web typecheck 0 hata / 0 uyarıyla geçti.
- Sonraki bağımlılık: Hero/dropzone düzenlemesi yeni container’ı kullanacak.
## Sprint 2 — hero ve dosya seçimi

- Tamamlanan: 32–48px dengeli hero başlığı, 43ch açıklama, dikey merkezleme, 270/290px dropzone, daha belirgin kesik sınır ve sade format satırı. PDF seçiminde yalnızca gerçek yerel seçim için “Dosya seçildi” durumu gösterilir; yükleme tamamlandı denmez. Mobil işlem menüsünde metin kırpılması kaldırıldı.
- Dosyalar: Hero, FileDropzone, `i18n/ui.ts`, tokens/global CSS.
- Gerekçe/karşılaştırma: dış boşluk ve gölge azaltıldı, başlık ile dosya seçme alanı aynı optik eksende; `.qa/visual-quality/sprint-2/` önceki görüntülerle aynı genişliklerdedir.
- Test: web typecheck 0 hata/uyarı; mevcut helper/hero/dosya değiştirme/geçersiz sayfa/16 araç giriş testi 5/5 geçti.
- Açık sınır: seçim durumu yereldir; sunucu işleme ve API akışı değiştirilmedi.
- Sonraki bağımlılık: katalog kartlarının geometri ve okunabilirlik düzenlemesi.

## Sprint 3 — araç kataloğu

- Tamamlanan: 15px kompakt kart başlığı, 16px Quick Start başlığı, 14px açıklama, 13px metadata. Önerilen dört araç ayrı kaldı; toplam ve filtre sayaçları benzersiz araçları saymaya devam eder. Kartların erişilebilir adları somut aracı belirtir.
- Dosyalar: ToolGrid, global CSS, mevcut `e2e/app.spec.ts` grid testi.
- Gerekçe/karşılaştırma: 5/7 öğeye özel sanal grid ve ortalama kuralları kaldırıldı. Masaüstünde 3, tablette 2, mobilde 1 sol hizalı gerçek kolon; iki araçlı gruplar 2 kolon. Son satır aynı genişlik ve sol hizayı korur. Katalog ikon yüzeyleri sadeleştirildi; hover gölgesi yerine renk/sınır değişimi kullanıldı. Görüntüler `sprint-3/` altında.
- Test: web typecheck 0 hata/uyarı; TR/EN 2/3/5 öğeli grid, 16 kart, kontrast, arama ve kategori testleri 5/5 geçti. Yeni test gerçek kart genişliklerini ve satır başlangıçlarını ölçer.
- Açık sınır: Quick Start sırası analitik popülerlik iddiası değildir. Kullanılamayan araçta metinsel uyarı korunur; kart daha soluk yapılarak okunabilirlik düşürülmez.
- Sonraki bağımlılık: rehber vitrini yeni tipografi/token temelini kullanır.

## Sprint 4 — rehber vitrini

- Tamamlanan: featured rehberin güçlü başlığı, nötr kategori etiketi, 01/02/03 numaralı süreç, eşit üst hizalı iki yan rehber, üç kısa senaryoya uygun üçlü bağlantı ızgarası. Doğal yükseklik ve tüm kartın klavye bağlantısı korunur.
- Dosyalar: HomeGuidesShowcase, global CSS.
- Gerekçe/karşılaştırma: kategori etiketi eylem gibi mavi görünmez; tek featured kart korunur, ikincil içerik tekrar kartlaştırılmaz. Numara işaretleri belge/sayfa diliyle ilişkilidir. `sprint-4/guides-*` önceki aynı bölüm görüntüleriyle karşılaştırıldı.
- Test: web typecheck 0 hata / 0 uyarı; TR/EN çok genişlikli rehber, helper ve yerel footer/link kontrolleri 3/3 geçti.
- Açık sınır: içerik ve rehber URL’leri değişmedi. Farklı uzunluklarda metin sabit yüksekliğe veya ellipsis’e zorlanmaz.
- Sonraki bağımlılık: süreç, SSS ve footer.

## Sprint 5 — süreç, SSS ve footer

- Tamamlanan: dört süreç adımına küçük okunabilir numara işareti ve 15px başlık; saklama notuna daha anlaşılır metin/link hizası. SSS’de 16px soru, sade 20px chevron ve açık durum için renk yanında sol sınır kullanılır. Footer dört grubu ve mobil iki kolonu korur; link hedefleri en az 44px oldu.
- Dosyalar: HelpSection, SiteFooter.
- Gerekçe/karşılaştırma: süreç numaraları metinden ayrılır; SSS chevron’unun dairesi kaldırıldı; footer başlıkları 600 ağırlığa indirildi. Bilgi içeriği ve saklama/silme taahhütleri aynı kaldı. Görüntüler `sprint-5/` altında.
- Test: web typecheck 0 hata / 0 uyarı; genel FAQ klavye akışı, helper doğruluğu, footer bağlantıları ve 320px taşma 4/4 geçti.
- Açık sınır: değişiklikler backend silme veya saklama mekanizmasını yeniden doğrulamaz.
- Sonraki bağımlılık: ortak ikon/etkileşim düzenlemesi ve tüm genişliklerde final inceleme.

## Sprint 6 — marka ve etkileşim ayrıntıları

- Tamamlanan: aynı Lucide ailesinden PowerPoint için presentation, filigran için stamp, parola kaldırma için unlock ikonları; katalog ikonları optik 20px. İşlem grubu renkleri koyulaştırıldı, küçük metin kullanımı için AA kontrast testi genişletildi. Format metadata aynı 13px stile bağlıdır.
- Dosyalar: tokens/global CSS, Icon, `lib/tools.ts`, ToolGrid, Topbar, Button, mevcut kontrast testi.
- Gerekçe/karşılaştırma: ikonlar işi tarif eder; pastel katalog arka planlarına geri dönülmez. Navbar düz beyaz yüzeydir. Birincil butonun ayrı gölgesi kaldırıldı, 160ms renk/sınır geçişi ve belirgin active/disabled durumları kullanıldı. Disabled bağlantı href/tab sırasıyla da kapatılır. Katmansız renk ve reduced-motion kuralları uygun CSS katmanına alındı.
- Test: web typecheck 0 hata / 0 uyarı; beş grup rengi dahil kontrast, klavye, combobox, FAQ, reduced-motion, API kesintisi ve kuyruk/sonuç/silme arayüz testleri 8/8 geçti.
- Karşılaştırma: `sprint-6/` ekranları; gövde metni ve ana mavi değişmedi, ana sayfadaki kararlar ortak Button/ikon/container üzerinden araçlara taşındı.
- Açık sınır: tüm görsel durumlar gerçek motor performansı veya ekran okuyucu onayı değildir. Yeni bağımlılık eklenmedi.
- Sonraki bağımlılık: Sprint 7 tüm genişlikler, iki dil, navigasyon ve reflow testleri.

## Sprint 7 — responsive ve görsel kabul

- Tamamlanan: TR/EN için 320/360/390/768/1024/1440/1920px görüntüleri; dört section başlığının ölçüsü, navbar/main/footer içerik hizası, 16 benzersiz araç, kart/rehber kırpılmaması, mobil dokunma hedefleri, drag/focus, dosya seçimi/hataları, dil değişimi ve tüm araç bağlantıları kontrol edildi.
- Dosyalar: yeni `e2e/visual-quality.spec.ts`; DESIGN-SYSTEM, USER-FLOWS ve TESTING belgeleri. Önceki testlerin gerçek akış ve metadata kontrolleri korundu.
- Görsel karşılaştırma: `.qa/visual-quality/comparison.html`, `before/` ve `after/` aynı viewport/politika ile karşılaştırıldı. Hero, katalog, rehber, süreç, FAQ ve mobil görünüm elle incelendi. `after/selected-*`, `error-*`, `drag-*`, `faq-open-*` gerçek arayüz durumlarının sentetik veriyle alınmış örnekleridir.
- İnceleme düzeltmesi: programatik odaklanan başlıkların tarayıcı varsayılan siyah çerçevesi ortak mavi focus rengine bağlandı; odak kaldırılmadı. Hero’daki filigran/parola kaldırma ikonları katalogla eşlendi. FAQ ekran görüntülerinde geçişin ara karesini yakalamamak için yalnızca screenshot sırasında son animasyon karesi kullanıldı; ürün animasyonu değiştirilmedi.
- Teknik sonuç: `pnpm check` geçti (modül sınırları, server/web typecheck; 0 hata/uyarı). `pnpm build` geçti; 105 statik sayfa üretildi. Ayrı lint script’i bulunmadığından olmayan bir lint koşusu başarı olarak raporlanmadı.
- Tam regresyon: `pnpm exec playwright test e2e/app.spec.ts e2e/content-consistency.spec.ts e2e/visual-quality.spec.ts e2e/visual-regression.spec.ts --output=.qa/visual-quality/final-test-results` → **156 geçti, 42 atlandı, 0 başarısız**. Chromium, mobil Chromium, Firefox, masaüstü/mobil WebKit ve Edge profilleri çalıştı.
- Atlamaların dağılımı: bir kez Chromium’da yürütülen rota/genişlik/görsel/reflow matrislerinin diğer profillerdeki tekrarları 30; katalog navigasyonunun Chromium dışındaki tekrarları 4; 16 dosya giriş smoke testinin Chromium dışındaki tekrarları 4; mobil `/` kısayolu 2; Windows WebKit skip-link klavye tercihi sınırı 2. Atlamalar başarıya eklenmedi.
- Son odak/ikon düzeltmesinden sonra `hero selection stays local` testi altı profilde ayrıca **6/6 geçti**; nihai check/build tekrar geçti. Sprint 0–6 odaklı koşuları bu 156 sayısına ikinci kez eklenmedi.
- %200 incelemesi: 1440 fiziksel / 720 CSS piksel, DPR 2 eşdeğer reflow TR/EN’de geçti. Gerçek tarayıcı menüsü zoom’u, fiziksel telefon ve ekran okuyucu denemesi yapılmadı; bunlar tamamlandı diye işaretlenmez.
- Backend sınırı: API/worker/motor veya rota değiştirilmedi. Gerçek motor ve Docker entegrasyon testleri yeniden çalıştırılmadı. Önceki analitik tercih kodu değiştirilmedi; dedicated PostHog suite bu görsel çalışmada yeniden koşulmadı. Belge/saklama/erişim davranışı için sentetik arayüz testleri gerçek servis kanıtı değildir.
- Sonraki bağımlılık: yok; yerel görsel çalışma tamamlandı, yayın yapılmadı. İleride fiziksel cihaz ve ekran okuyucu kontrolü ayrı kalite kapısıdır.

## Ölçülen tipografi karşılaştırması

| Öğe | Önce (320px) | Sonra (320px) |
| --- | --- | --- |
| Hero H1 | 30px / 700 | 32px / 700 |
| Katalog / rehber H2 | 22px / 600 | 24px / 600 |
| Genel FAQ H2 | 20px / 600 | 24px / 600 |
| Kompakt araç başlığı | 14px / 600 | 15px / 600 |
| Metadata | 13px | 13px |

Kaynak: `before/metrics.json` ve `after/metrics.json`. Tipografik iyileştirme, sayfanın her genişlikte daha kısa olması iddiası değildir; uzun metinler doğal biçimde kırılır.
