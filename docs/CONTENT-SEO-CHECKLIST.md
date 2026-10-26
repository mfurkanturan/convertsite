# İçerik ve SEO kontrol listesi

Bu belge, arayüz, araç ve rehber sayfalarında yayımlanan içerik için ortak editoryal kuralları ve sürüm öncesi kontrol listesini tanımlar.

## İçerik stili

- Önce kullanıcının yapacağı işi söyle; başlıkları kısa, açıklamaları eyleme dönük tut.
- Her sayfada bir H1 ve ardından atlamasız H2/H3 sırası kullan. Link metni hedefi anlatmalı; tek başına “Aç”, “Buraya tıkla” veya belirsiz simge bırakma.
- “Önerilen” ürünce seçilmiş girişleri, “popüler” ise ancak ölçülmüş kullanım verisi varsa anlatır. Rehber örnekleri kullanım sıklığı kanıtı sayılmaz.
- Ücretsiz, hesap gereksinimi, desteklenen biçim, dosya sınırı, saklama, silme ve sağlayıcı beyanlarını güncel uygulama veya canlı hizmet kanıtına bağla.
- PDF → Word / Excel sonuçları için birebir yerleşim, tüm tabloları çıkarma veya evrensel doğruluk sözü verme. OCR doğruluğunu belge türü ve kalitesine bağlı açıkla.
- Dosya içeriği uygulama veritabanına yazılmıyor olsa da geçici dosya depolama, işleme servisi, hosting/ağ sağlayıcıları ve analitik/reklam sağlayıcılarını birbirine karıştırma.
- Saklama süresini yapılandırılan etkin değer olarak anlat. Erişim kapatılmasını fiziksel silmenin tamamlanmasıyla eş anlamlı kullanma.
- Mikro kopya gerçek bir eylemi veya kullanıcıya yararlı sonucu tarif etsin; belirsiz süperlatifleri ve desteklenmeyen hız/kalite vaatlerini kaldır.

## SEO ve yayın kontrolü

- Her indekslenebilir rotada benzersiz, sayfa içeriğiyle tutarlı `<title>` ve meta description bulunur.
- Canonical URL, alan adı ve son rota biçimiyle eşleşir. Eşdeğer çeviriler karşılıklı `hreflang` üretir; eşdeğeri olmayan rotaya sahte alternatif eklenmez.
- Open Graph başlık, açıklama, URL ve 1200×630 paylaşım görseli doğru dil/rota ile eşleşir; favicon yüklenebilir.
- Sitemap yalnızca mevcut, kanonik, indekslenebilir sayfaları içerir ve dil alternatiflerini doğru eşler. `lastmod` yalnızca sayfa bazında gerçek içerik değişiklik tarihi varsa eklenir; build tarihini tüm URL'lere kopyalama. `robots.txt` sitemap adresini gösterir.
- Eski `/en/...` ve `/kullanim/...` URL'leri yalnızca güncel eşdeğer İngilizce/Türkçe sayfaya yönlendirilir; eşdeğeri olmayan, `/cdn-cgi/*` gibi sistem yolları ve API alan adı ana sayfaya yönlendirilmez.
- 404 sayfası açıklayıcı H1 ve çalışan yerel ana sayfa bağlantıları verir; `noindex` kullanır. Sunucu 5xx hata sayfaları hosting katmanında ayrıca tanımlanır.
- Her içerik rotasında bir H1, anlamlı başlık hiyerarşisi, etiketli gezinme alanları ve erişilebilir link adları bulunur.
- Türkçe, İngilizce ve İspanyolca sayfalarda içerik, sayfa başlığı, dil değiştirici ve link hedefleri aynı işleve karşılık gelir; taşma mobil genişlikte kontrol edilir.
- Footer bağlantıları, mailto adresi, iletişim ve yasal sayfalar gerçek ve erişilebilir hedeflere gider. Aynı yasal bağlantı grubu birden çok yerde gereksiz tekrarlanmaz.

## Sprint 6 doğrulama kapsamı

- SEO head title/description, canonical, hreflang, Open Graph, favicon ve robots meta etiketlerini üretir; sitemap `staticPairs`, araç kimlikleri ve rehber verilerinden oluşturulur.
- `robots.txt` sitemap'i ilan eder. Statik 404 sayfası iki dil ana sayfasına bağlantı verir ve indeks dışıdır.
- Kaynak incelemesi production CDN/hosting davranışının veya arama motoru indekslemesinin canlıda çalıştığını tek başına kanıtlamaz.

## Ortak dil ve içerik sahipliği

- Türkçe arayüz ve yönlendirmeler kısa “sen” dili kullanır; İngilizce aynı işlevi doğal görev diliyle anlatır. Yasal hükümler sadeleştirilirken hak ve sorumlulukların anlamı korunur.
- Ortak arayüz metni `i18n/ui.ts` ve `i18n/ui-es.ts`, araç katalog açıklaması `lib/tools.ts`, araç SEO verisi `lib/tool-seo.ts` / `lib/tool-seo-en.ts` / `lib/tool-seo-es.ts`, senaryo metni `lib/seo/scenarios-*` kaynaklarında tutulur. İkinci çeviri veya çalışma zamanı metin temizleme sistemi kurulmaz. Yeni İngilizce arayüz anahtarı veya senaryo eklendiğinde `apps/web` içindeki `check:i18n` betiği İspanyolca karşılığı yoksa başarısız olur.
- Başlık somut işi söyler; açıklama, CTA ve uyarı aynı cümleyi tekrarlamaz. Kart sayısını doldurmak için üç özellik veya üç fayda üretilmez.
- Araç SSS’si yalnızca araca özgü soruları yanıtlar. Ücret ve genel dosya saklama soruları ana sayfa/politika kaynaklarında kalır.
- Araç başlatma etiketleri 16 araç kimliğini kapsayan tip kontrollü sözlüktür. Parola, filigran ve OCR alanları da ortak i18n kaynağını kullanır.
- Rehberler kalıcı uygulama limiti vaat etmez; geçerli değer için araç paneline yönlendirir. Örnek sayfa aralıkları işlem önerisidir ve etkin sınırların yerine geçmez.
- “RAM only”, “sıfır iz”, “uçtan uca TLS”, evrensel kalite, kesin hız ve kesin dosya küçülmesi vaatleri kullanılmaz. Kayıpsız optimizasyon gibi belirli motor davranışları bütün dönüşümlere genellenmez.
- Meta açıklama görünür görevle uyumludur. Araç/rehber HowTo ve FAQ yapılandırılmış verileri görünür içerikle aynı kaynaktan üretilir. Slug değişmeden başlık sadeleştirilebilir.
- Katalog kartlarında önce aracın yaptığı iş ve araca özgü fark okunur; format çifti ikincil meta olarak kalabilir. Arayüz ayarı için yalnızca seçeneğin gerçek etkisini açıklayan iki dilli kısa yardım yazılır.
- Güvenlik, gizlilik ve şartlar sayfalarının bölüm gezinmesi var olan başlıklara bağlanır. Yasal özet veya gezinme metni hak ve sorumluluk anlamını genişletmez.
- Hata raporunda sorun teşhisi için gereken araç/tarayıcı/adımlar/zaman/hata bilgisi belirtilir; kullanıcıdan dosya veya parola göndermesi istenmez.

25 Ekim 2026 içerik envanteri ve değişiklik özeti: [CONTENT-REVIEW](CONTENT-REVIEW.md).
