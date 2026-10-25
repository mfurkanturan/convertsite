import type { ToolId } from '@convertsite/contracts';

export interface SeoStep { title: string; description: string }
export interface SeoFaq { question: string; answer: string }
export interface ToolSeoData {
  id: ToolId;
  title: string;
  metaTitle: string;
  metaDescription: string;
  h1: string;
  lead: string;
  keywords: string[];
  steps: SeoStep[];
  resultCheck: string;
  faqs: SeoFaq[];
  relatedTools: ToolId[];
}

export const toolSeoMap: Record<ToolId, ToolSeoData> = {
  "pdf-to-word": {
    "id": "pdf-to-word",
    "title": "PDF → Word",
    "metaTitle": "PDF → Word | DoctorConverter",
    "metaDescription": "Metin içeren PDF’leri düzenlenebilir Word belgesine dönüştür. DOCX dosyasını aç; başlıkları, sütunları, tabloları ve sayfa sonlarını kontrol et.",
    "h1": "PDF → Word",
    "lead": "Metin içeren PDF’leri düzenlenebilir Word belgesine dönüştür.",
    "keywords": ["pdf word dönüştürme", "pdf to docx", "ücretsiz pdf word çevirme", "online pdf düzenleme", "cv worde çevirme", "tez pdf word yapma"],
    "steps": [
      { "title": "Dosyanı seç", "description": "PDF dosyanı seç." },
      { "title": "İşlemi başlat", "description": "Word’e dönüştür düğmesiyle işlemi başlat." },
      { "title": "Sonucu indir", "description": "İşlem tamamlanınca sonucu aynı tarayıcı oturumundan indir." }
    ],
    "resultCheck": "DOCX dosyasını aç; başlıkları, sütunları, tabloları ve sayfa sonlarını kontrol et.",
    "faqs": [
      { "question": "Taranmış PDF’i Word’e çevirebilir miyim?", "answer": "Bu araç seçilebilir metin içeren PDF’ler içindir. Taranmış sayfalardan Metin çıkar (OCR) ile TXT alıp Word’e aktarabilirsin; bu işlem sayfa düzenini yeniden oluşturmaz." }
    ],
    "relatedTools": ["word-to-pdf", "pdf-to-excel", "compress-pdf", "ocr"]
  },
  "word-to-pdf": {
    "id": "word-to-pdf",
    "title": "Word → PDF",
    "metaTitle": "Word → PDF | DoctorConverter",
    "metaDescription": "DOCX belgeni PDF biçimine dönüştür. PDF’i aç; yazı tiplerini, tabloları ve sayfa sonlarını kontrol et.",
    "h1": "Word → PDF",
    "lead": "DOCX belgeni PDF biçimine dönüştür.",
    "keywords": ["word pdf dönüştürme", "docx to pdf", "word pdf yapma", "ücretsiz word pdf çevirici", "cv pdf yapma"],
    "steps": [
      { "title": "Dosyanı seç", "description": "DOCX dosyanı seç." },
      { "title": "İşlemi başlat", "description": "PDF’e dönüştür düğmesiyle işlemi başlat." },
      { "title": "Sonucu indir", "description": "İşlem tamamlanınca sonucu aynı tarayıcı oturumundan indir." }
    ],
    "resultCheck": "PDF’i aç; yazı tiplerini, tabloları ve sayfa sonlarını kontrol et.",
    "faqs": [
      { "question": "DOC veya makrolu Word dosyaları kabul edilir mi?", "answer": "Yalnızca DOCX kabul edilir. Makro, gömülü çalıştırılabilir içerik veya dış bağlantı içeren Office dosyaları reddedilir." }
    ],
    "relatedTools": ["pdf-to-word", "merge-pdf", "compress-pdf"]
  },
  "merge-pdf": {
    "id": "merge-pdf",
    "title": "PDF birleştir",
    "metaTitle": "PDF birleştir | DoctorConverter",
    "metaDescription": "PDF dosyalarını seçtiğin sırayla tek belgede birleştir. PDF’i aç; belge sırasını ve ilk/son sayfaları kontrol et.",
    "h1": "PDF birleştir",
    "lead": "PDF dosyalarını seçtiğin sırayla tek belgede birleştir.",
    "keywords": ["pdf birleştirme", "pdf birleştir", "vize evrakları birleştirme", "uyap pdf birleştir", "ders slaytları tek pdf", "fatura birleştirme"],
    "steps": [
      { "title": "Dosyanı seç", "description": "Birleştireceğin PDF dosyalarını seç." },
      { "title": "İşlemi başlat", "description": "En az iki PDF ekle. Sürükleyerek veya yukarı/aşağı düğmeleriyle sırala, ardından PDF’leri birleştir." },
      { "title": "Sonucu indir", "description": "İşlem tamamlanınca sonucu aynı tarayıcı oturumundan indir." }
    ],
    "resultCheck": "PDF’i aç; belge sırasını ve ilk/son sayfaları kontrol et.",
    "faqs": [
      { "question": "Dosya sırasını nasıl değiştiririm?", "answer": "Dosya listesindeki yukarı/aşağı düğmelerini veya sürüklemeyi kullan. Birleştirme dosya sırasını izler; tek tek sayfaları değiştirmek için PDF sayfalarını düzenle aracını aç." }
    ],
    "relatedTools": ["compress-pdf", "edit-pdf-pages", "pdf-to-word"]
  },
  "compress-pdf": {
    "id": "compress-pdf",
    "title": "PDF sıkıştır",
    "metaTitle": "PDF sıkıştır | DoctorConverter",
    "metaDescription": "PDF dosyasının boyutunu küçültmeyi dene. İndirdiğin dosyanın boyutunu kaynakla karşılaştır; yükleyeceğin sistemin sınırına uyduğunu kontrol et.",
    "h1": "PDF sıkıştır",
    "lead": "PDF dosyasının boyutunu küçültmeyi dene.",
    "keywords": ["pdf sıkıştırma", "pdf boyut küçültme", "uyap pdf boyutu küçültme", "vfs vize dosya boyutu", "cv dosya boyutu küçültme", "yök tez sıkıştırma"],
    "steps": [
      { "title": "Dosyanı seç", "description": "PDF dosyanı seç." },
      { "title": "İşlemi başlat", "description": "PDF’yi sıkıştır düğmesiyle işlemi başlat." },
      { "title": "Sonucu indir", "description": "İşlem tamamlanınca sonucu aynı tarayıcı oturumundan indir." }
    ],
    "resultCheck": "İndirdiğin dosyanın boyutunu kaynakla karşılaştır; yükleyeceğin sistemin sınırına uyduğunu kontrol et.",
    "faqs": [
      { "question": "Dosya neden küçülmedi?", "answer": "Araç PDF’in iç yapısını optimize eder; taranmış görsellerin çözünürlüğünü düşürmez. Zaten optimize edilmiş dosya küçülmeyebilir. Bu durumda özgün dosya döner." }
    ],
    "relatedTools": ["merge-pdf", "pdf-to-word", "pdf-to-images"]
  },
  "pdf-to-excel": {
    "id": "pdf-to-excel",
    "title": "PDF → Excel",
    "metaTitle": "PDF → Excel | DoctorConverter",
    "metaDescription": "PDF’te algılanabilen tabloları Excel çalışma sayfalarına aktar. XLSX’i aç; her tabloyu, satır/sütun eşleşmesini ve sayısal değerleri kaynakla karşılaştır.",
    "h1": "PDF → Excel",
    "lead": "PDF’te algılanabilen tabloları Excel çalışma sayfalarına aktar.",
    "keywords": ["pdf excel dönüştürme", "pdf to xlsx", "banka ekstresi excel aktarma", "fatura excel çevir", "bilanço excel yap"],
    "steps": [
      { "title": "Dosyanı seç", "description": "PDF dosyanı seç." },
      { "title": "İşlemi başlat", "description": "Excel’e aktar düğmesiyle işlemi başlat." },
      { "title": "Sonucu indir", "description": "İşlem tamamlanınca sonucu aynı tarayıcı oturumundan indir." }
    ],
    "resultCheck": "XLSX’i aç; her tabloyu, satır/sütun eşleşmesini ve sayısal değerleri kaynakla karşılaştır.",
    "faqs": [
      { "question": "Excel çıktısındaki hücreler formül mü?", "answer": "Hücreler formül çalıştırmayan metin olarak yazılır. Hesaplama yapmadan önce sayı ve tarih biçimlerini kontrol et. Algılanan her tablo ayrı çalışma sayfasına aktarılır." }
    ],
    "relatedTools": ["excel-to-pdf", "pdf-to-word", "ocr"]
  },
  "excel-to-pdf": {
    "id": "excel-to-pdf",
    "title": "Excel → PDF",
    "metaTitle": "Excel → PDF | DoctorConverter",
    "metaDescription": "XLSX çalışma sayfalarını PDF biçimine dönüştür. PDF’i aç; sütunların kesilmediğini, sayfa yönünü ve sayfa sonlarını kontrol et.",
    "h1": "Excel → PDF",
    "lead": "XLSX çalışma sayfalarını PDF biçimine dönüştür.",
    "keywords": ["excel pdf dönüştürme", "xlsx to pdf", "excel pdf yapma", "tablo pdf çevir"],
    "steps": [
      { "title": "Dosyanı seç", "description": "XLSX dosyanı seç." },
      { "title": "İşlemi başlat", "description": "Tüm çalışma sayfalarını veya yalnızca ilkini seç, ardından PDF’e dönüştür." },
      { "title": "Sonucu indir", "description": "İşlem tamamlanınca sonucu aynı tarayıcı oturumundan indir." }
    ],
    "resultCheck": "PDF’i aç; sütunların kesilmediğini, sayfa yönünü ve sayfa sonlarını kontrol et.",
    "faqs": [
      { "question": "Tablo PDF’te neden birden fazla sayfaya bölündü?", "answer": "Kaynak XLSX’in baskı alanı, ölçek ve sayfa ayarları sonucu etkiler. Gerekirse bunları kaynak dosyada düzenleyip yeniden dönüştür." }
    ],
    "relatedTools": ["pdf-to-excel", "word-to-pdf", "compress-pdf"]
  },
  "pptx-to-pdf": {
    "id": "pptx-to-pdf",
    "title": "PowerPoint → PDF",
    "metaTitle": "PowerPoint → PDF | DoctorConverter",
    "metaDescription": "PPTX sunumunu PDF dosyasına dönüştür. PDF’i aç; slayt sayısını, görselleri, yazı tiplerini ve tablo yerleşimlerini kontrol et.",
    "h1": "PowerPoint → PDF",
    "lead": "PPTX sunumunu PDF dosyasına dönüştür.",
    "keywords": ["powerpoint pdf dönüştürme", "pptx to pdf", "slayt pdf yapma", "sunumu pdf yap"],
    "steps": [
      { "title": "Dosyanı seç", "description": "PPTX dosyanı seç." },
      { "title": "İşlemi başlat", "description": "PDF’e dönüştür düğmesiyle işlemi başlat." },
      { "title": "Sonucu indir", "description": "İşlem tamamlanınca sonucu aynı tarayıcı oturumundan indir." }
    ],
    "resultCheck": "PDF’i aç; slayt sayısını, görselleri, yazı tiplerini ve tablo yerleşimlerini kontrol et.",
    "faqs": [
      { "question": "Animasyon ve gizli slaytlar PDF’e aktarılır mı?", "answer": "PDF sabit sayfalardan oluşur; animasyonları oynatmaz. Gizli slaytlar dışa aktarılmayabilir. İhtiyacın olan slaytların çıktıda bulunduğunu kontrol et." }
    ],
    "relatedTools": ["word-to-pdf", "excel-to-pdf", "pdf-to-word"]
  },
  "pdf-to-images": {
    "id": "pdf-to-images",
    "title": "PDF → JPG / PNG",
    "metaTitle": "PDF → JPG / PNG | DoctorConverter",
    "metaDescription": "PDF sayfalarını JPG veya PNG olarak dışa aktar. Tek görseli veya ZIP’i indir; seçtiğin sayfaların bulunduğunu ve metnin okunabildiğini kontrol et.",
    "h1": "PDF → JPG / PNG",
    "lead": "PDF sayfalarını JPG veya PNG olarak dışa aktar.",
    "keywords": ["pdf jpg dönüştürme", "pdf png çevirme", "pdf fotoğrafa çevir", "sosyal medya pdf paylaşımı"],
    "steps": [
      { "title": "Dosyanı seç", "description": "PDF dosyanı seç." },
      { "title": "İşlemi başlat", "description": "JPG/PNG, görsel kalitesi ve gerekiyorsa sayfa aralığını seç; görselleri oluştur." },
      { "title": "Sonucu indir", "description": "İşlem tamamlanınca sonucu aynı tarayıcı oturumundan indir." }
    ],
    "resultCheck": "Tek görseli veya ZIP’i indir; seçtiğin sayfaların bulunduğunu ve metnin okunabildiğini kontrol et.",
    "faqs": [
      { "question": "Kalite seçeneği neyi değiştirir?", "answer": "Standart 100 DPI, yüksek 150 DPI kullanır. Çıktının uzun kenarı ayrıca sınırlandırılır. Daha yüksek ayar kaynak görselde olmayan ayrıntıyı oluşturmaz." }
    ],
    "relatedTools": ["images-to-pdf", "compress-pdf", "edit-pdf-pages"]
  },
  "images-to-pdf": {
    "id": "images-to-pdf",
    "title": "JPG/PNG → PDF",
    "metaTitle": "JPG/PNG → PDF | DoctorConverter",
    "metaDescription": "JPG ve PNG görsellerini tek PDF dosyasında birleştir. PDF’i aç; görsel sırasını, yönleri ve sayfa içindeki boyutları kontrol et.",
    "h1": "JPG/PNG → PDF",
    "lead": "JPG ve PNG görsellerini tek PDF dosyasında birleştir.",
    "keywords": ["jpg pdf dönüştürme", "resimleri pdf yapma", "ödev fotoğraflarını pdf yap", "fiş fotoğrafı pdf yap"],
    "steps": [
      { "title": "Dosyanı seç", "description": "JPG veya PNG görsellerini seç." },
      { "title": "İşlemi başlat", "description": "Görselleri sırala; sayfa boyutunu ve yönünü seç, ardından PDF oluştur." },
      { "title": "Sonucu indir", "description": "İşlem tamamlanınca sonucu aynı tarayıcı oturumundan indir." }
    ],
    "resultCheck": "PDF’i aç; görsel sırasını, yönleri ve sayfa içindeki boyutları kontrol et.",
    "faqs": [
      { "question": "Şeffaf PNG ve telefon fotoğrafları nasıl aktarılır?", "answer": "Şeffaf alanlar beyaz zemine aktarılır. Telefon fotoğraflarının yön bilgisi uygulanır; yine de çıktıdaki sayfa yönlerini kontrol et." }
    ],
    "relatedTools": ["pdf-to-images", "merge-pdf", "compress-pdf"]
  },
  "edit-pdf-pages": {
    "id": "edit-pdf-pages",
    "title": "PDF sayfalarını düzenle",
    "metaTitle": "PDF sayfalarını düzenle | DoctorConverter",
    "metaDescription": "PDF sayfalarını sırala, döndür, ayır veya kaldır. PDF’i veya ZIP’i aç; sayfa sırasını, döndürmeleri ve çıkarılan sayfaları kontrol et.",
    "h1": "PDF sayfalarını düzenle",
    "lead": "PDF sayfalarını sırala, döndür, ayır veya kaldır.",
    "keywords": ["pdf sayfa silme", "pdf sayfa ayırma", "pdf split", "pdf döndürme", "ters taranmış pdf düzeltme"],
    "steps": [
      { "title": "Dosyanı seç", "description": "PDF dosyanı seç." },
      { "title": "İşlemi başlat", "description": "Sayfaları seç ve sırala. Çıktı biçimini belirle, ardından sayfaları kaydet." },
      { "title": "Sonucu indir", "description": "İşlem tamamlanınca sonucu aynı tarayıcı oturumundan indir." }
    ],
    "resultCheck": "PDF’i veya ZIP’i aç; sayfa sırasını, döndürmeleri ve çıkarılan sayfaları kontrol et.",
    "faqs": [
      { "question": "Her sayfayı ayrı PDF olarak alabilir miyim?", "answer": "Çıktı ayarında “Sayfa başına PDF (ZIP)” seç. En az bir sayfa bırakmalısın. Kaynak dosyanın sayfa içeriği bu araçla metin olarak düzenlenmez." }
    ],
    "relatedTools": ["merge-pdf", "compress-pdf", "pdf-to-word"]
  },
  "page-numbers": {
    "id": "page-numbers",
    "title": "Sayfa numarası ekle",
    "metaTitle": "Sayfa numarası ekle | DoctorConverter",
    "metaDescription": "PDF sayfalarına sayfa ve toplam sayfa numarası ekle. PDF’in ilk ve son sayfasını aç; numaranın içerikle çakışmadığını kontrol et.",
    "h1": "Sayfa numarası ekle",
    "lead": "PDF sayfalarına sayfa ve toplam sayfa numarası ekle.",
    "keywords": ["pdf sayfa numarası ekleme", "pdf numaralandırma", "pdf sayfa no koy"],
    "steps": [
      { "title": "Dosyanı seç", "description": "PDF dosyanı seç." },
      { "title": "İşlemi başlat", "description": "Numara konumunu seç, ardından numara ekle." },
      { "title": "Sonucu indir", "description": "İşlem tamamlanınca sonucu aynı tarayıcı oturumundan indir." }
    ],
    "resultCheck": "PDF’in ilk ve son sayfasını aç; numaranın içerikle çakışmadığını kontrol et.",
    "faqs": [
      { "question": "Numaraların biçimini değiştirebilir miyim?", "answer": "Numaralar “sayfa / toplam” biçimindedir. Alt orta, alt sağ veya üst sağ konumlarından birini seçebilirsin; özel başlangıç numarası seçeneği yoktur." }
    ],
    "relatedTools": ["edit-pdf-pages", "merge-pdf", "watermark-pdf"]
  },
  "watermark-pdf": {
    "id": "watermark-pdf",
    "title": "Filigran ekle",
    "metaTitle": "Filigran ekle | DoctorConverter",
    "metaDescription": "PDF sayfalarına metin filigranı ekle. PDF’i aç; filigran metnini, karakterleri ve belge içeriğinin okunabilirliğini kontrol et.",
    "h1": "Filigran ekle",
    "lead": "PDF sayfalarına metin filigranı ekle.",
    "keywords": ["pdf filigran ekleme", "pdf damga basma", "pdf gizlidir yazısı", "pdf watermark"],
    "steps": [
      { "title": "Dosyanı seç", "description": "PDF dosyanı seç." },
      { "title": "İşlemi başlat", "description": "Filigran metnini yaz, ardından filigran ekle." },
      { "title": "Sonucu indir", "description": "İşlem tamamlanınca sonucu aynı tarayıcı oturumundan indir." }
    ],
    "resultCheck": "PDF’i aç; filigran metnini, karakterleri ve belge içeriğinin okunabilirliğini kontrol et.",
    "faqs": [
      { "question": "Filigranı yalnızca bazı sayfalara ekleyebilir miyim?", "answer": "Filigran tüm sayfalara çapraz eklenir. Sayfa seçimi veya görsel filigran desteklenmez. Sığmayan metin veya desteklenmeyen karakterler hata verir." }
    ],
    "relatedTools": ["page-numbers", "protect-pdf", "compress-pdf"]
  },
  "protect-pdf": {
    "id": "protect-pdf",
    "title": "PDF şifrele",
    "metaTitle": "PDF şifrele | DoctorConverter",
    "metaDescription": "PDF dosyasını açmak için parola belirle. İndirdiğin PDF’i kapatıp yeniden aç; belirlediğin parolayla açıldığını doğrula.",
    "h1": "PDF şifrele",
    "lead": "PDF dosyasını açmak için parola belirle.",
    "keywords": ["pdf şifreleme", "pdf parola koyma", "pdf kilitleme", "pdf şifre koy"],
    "steps": [
      { "title": "Dosyanı seç", "description": "PDF dosyanı seç." },
      { "title": "İşlemi başlat", "description": "Bir parola yaz, ardından PDF’yi şifrele." },
      { "title": "Sonucu indir", "description": "İşlem tamamlanınca sonucu aynı tarayıcı oturumundan indir." }
    ],
    "resultCheck": "İndirdiğin PDF’i kapatıp yeniden aç; belirlediğin parolayla açıldığını doğrula.",
    "faqs": [
      { "question": "Parolayı unutursam geri alabilir miyim?", "answer": "Parolayı kendin saklamalısın. Bu araç parola kurtarma sunmaz; kaynak dosyanın bir kopyasını koru." }
    ],
    "relatedTools": ["unlock-pdf", "compress-pdf", "merge-pdf"]
  },
  "unlock-pdf": {
    "id": "unlock-pdf",
    "title": "PDF parolasını kaldır",
    "metaTitle": "PDF parolasını kaldır | DoctorConverter",
    "metaDescription": "Parolasını bildiğin PDF’in parola korumasını kaldır. İndirdiğin PDF’i yeniden aç; parola istemeden açıldığını kontrol et.",
    "h1": "PDF parolasını kaldır",
    "lead": "Parolasını bildiğin PDF’in parola korumasını kaldır.",
    "keywords": ["pdf şifre kaldırma", "pdf kilit açma", "pdf şifresi silme"],
    "steps": [
      { "title": "Dosyanı seç", "description": "PDF dosyanı seç." },
      { "title": "İşlemi başlat", "description": "Mevcut parolayı gir, ardından parolayı kaldır." },
      { "title": "Sonucu indir", "description": "İşlem tamamlanınca sonucu aynı tarayıcı oturumundan indir." }
    ],
    "resultCheck": "İndirdiğin PDF’i yeniden aç; parola istemeden açıldığını kontrol et.",
    "faqs": [
      { "question": "Parolayı bilmiyorsam kullanabilir miyim?", "answer": "Hayır. Doğru mevcut parola gerekir. Yanlış veya eksik parola ile dosya işlenmez." }
    ],
    "relatedTools": ["protect-pdf", "merge-pdf", "compress-pdf"]
  },
  "ocr": {
    "id": "ocr",
    "title": "Metin çıkar (OCR)",
    "metaTitle": "Metin çıkar (OCR) | DoctorConverter",
    "metaDescription": "PDF veya görseldeki yazıyı TXT dosyasına çıkar. TXT dosyasını aç; isimleri, sayıları ve Türkçe karakterleri kaynakla karşılaştır.",
    "h1": "Metin çıkar (OCR)",
    "lead": "PDF veya görseldeki yazıyı TXT dosyasına çıkar.",
    "keywords": ["pdf ocr", "resimden yazı kopyalama", "fotoğraftan metin çıkarma", "taranmış pdf metne çevirme", "kitaptan yazı kopyalama"],
    "steps": [
      { "title": "Dosyanı seç", "description": "PDF, JPG veya PNG dosyanı seç." },
      { "title": "İşlemi başlat", "description": "Belge dilini seç, ardından metni çıkar." },
      { "title": "Sonucu indir", "description": "İşlem tamamlanınca sonucu aynı tarayıcı oturumundan indir." }
    ],
    "resultCheck": "TXT dosyasını aç; isimleri, sayıları ve Türkçe karakterleri kaynakla karşılaştır.",
    "faqs": [
      { "question": "Çıktı Word belgesi mi, aranabilir PDF mi?", "answer": "Bu araç yalnızca düz metin TXT üretir. Word’de metni açıp düzenleyebilirsin. Özgün PDF’e metin katmanı eklemek için PDF’yi aranabilir yap aracını kullan." }
    ],
    "relatedTools": ["pdf-to-word", "pdf-to-excel", "pdf-to-images"]
  },
  "pdf-to-pdf-ocr": {
    "id": "pdf-to-pdf-ocr",
    "title": "PDF’yi aranabilir yap (OCR)",
    "metaTitle": "PDF’yi aranabilir yap (OCR) | DoctorConverter",
    "metaDescription": "Taranmış PDF’e seçilebilir ve aranabilir metin katmanı ekle. PDF’i aç; bir sözcüğü ara ve metin seçimini dene. Tanınan metni görüntüyle karşılaştır.",
    "h1": "PDF’yi aranabilir yap (OCR)",
    "lead": "Taranmış PDF’e seçilebilir ve aranabilir metin katmanı ekle.",
    "keywords": ["pdf aranabilir yapma", "taranmış pdf ocr", "pdf metin katmanı ekleme", "pdf arama yapılabilir hale getirme", "taranmış pdf aranabilir pdf"],
    "steps": [
      { "title": "Dosyanı seç", "description": "PDF dosyanı seç." },
      { "title": "İşlemi başlat", "description": "Belge dilini seç, ardından aranabilir PDF oluştur." },
      { "title": "Sonucu indir", "description": "İşlem tamamlanınca sonucu aynı tarayıcı oturumundan indir." }
    ],
    "resultCheck": "PDF’i aç; bir sözcüğü ara ve metin seçimini dene. Tanınan metni görüntüyle karşılaştır.",
    "faqs": [
      { "question": "Metin çıkar (OCR) aracından farkı nedir?", "answer": "Bu araç sayfa görüntülerini içeren PDF’e metin katmanı ekler. Metin çıkar (OCR) ise ayrı bir TXT dosyası üretir. Metin içeren sayfalara tekrar OCR uygulamak çift metin katmanı oluşturabilir." }
    ],
    "relatedTools": ["ocr", "pdf-to-word", "pdf-to-images"]
  }
};
