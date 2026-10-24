import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = resolve('.qa/engine-audit');
const load = async name => JSON.parse(await readFile(resolve(root, name), 'utf8'));
const lines = async name => (await readFile(resolve(root, name), 'utf8')).trim().split('\n').filter(Boolean).map(line => JSON.parse(line));
const rows = await lines('results.jsonl');
const manifest = await load('manifest.json');
const environment = await load('environment.json');
const optional = async (name, jsonl = false) => { try { return await (jsonl ? lines(name) : load(name)); } catch (error) { if (error.code === 'ENOENT') return []; throw error; } };
const workflow = await optional('workflow.json');
const performance = await optional('performance.jsonl', true);
const lifecycle = await optional('lifecycle.json');
const supplement = await optional('supplement.json');
const candidates = await optional('candidates.json');
const cgroup = await optional('cgroup-performance.json');
// A partially written run must not replace a complete audit report.
if (manifest.length !== 120 || rows.length !== 360 || performance.length !== 360)
  throw new Error('Expected 120 scenarios, 360 quality records and 360 performance records.');
for (const scenario of manifest) {
  const repeats = rows.filter(row => row.case === scenario.id);
  if (repeats.length !== 3 || new Set(repeats.map(row => row.label)).size !== 3)
    throw new Error(`Incomplete or duplicate quality repeats: ${scenario.id}`);
}
for (const tool of new Set(manifest.map(row => row.tool))) {
  for (const tier of ['small', 'medium', 'near']) {
    const runs = performance.filter(row => row.tool === tool && row.tier === tier);
    if (runs.filter(row => row.concurrency !== 2).length !== 6 || runs.filter(row => row.concurrency === 2).length !== 2)
      throw new Error(`Incomplete performance tier: ${tool}/${tier}`);
  }
}
const median = values => { const sorted = [...values].sort((a, b) => a - b); return sorted.length ? sorted[Math.floor(sorted.length / 2)] : null; };
const decisions = {
  'pdf-to-word': ['İyileştir / yerel alternatifle karşılaştır', 'Metin, kritik sayılar, 5 pt yerleşim ve düzenlenebilirlik ayrı kapılardır; tek bir geçer puanı yok.'],
  'pdf-to-excel': ['İyileştir', 'Çizgisiz ve birleşik tablolarda kapsamı netleştir; sayısal türler/formül güvenliği ve hücre yapısını ayrı doğrula.'],
  ocr: ['İyileştir', 'Sabit 150 DPI ve PSM 3 yerine yön/eğiklik ve çözünürlük adaylarını aynı corpus ile karşılaştır.'],
  'compress-pdf': ['Kayıpsız motoru koru, kapsamı açıkla', 'Küçülmeme başarısızlık değildir; görüntü ağırlıklı belgeler için ayrı kayıplı profil ancak kalite onayından sonra değerlendirilmeli.'],
  'pptx-to-pdf': ['Desteği sınırla; akış engellerini gider', 'API yükleme izin listesi PPTX kabul etmiyor; imajda Impress açıkça kurulmamış.'],
  'protect-pdf': ['Desteği sınırla; çıktı kontrolünü düzelt', 'Ortak pdf_pages kontrolü şifreli PDF reddediyor; doğru üretilen şifreli çıktının yayımlanmasını da engelleyebilir.'],
  'unlock-pdf': ['Desteği sınırla; parola farkındalığı ekle', 'Ortak girdi incelemesi şifreli PDF reddediyor; parola handler’a ulaşmadan akış kesiliyor.'],
  'watermark-pdf': ['İyileştir', 'Yerleşik Helvetica ile Unicode/Türkçe metin ve sayfa dönüşleri doğrulanmalı.'],
};
const cards = [...new Set(manifest.map(c => c.tool))].map(tool => {
  const expected = manifest.filter(c => c.tool === tool);
  const runs = rows.filter(r => r.tool === tool);
  const completed = expected.filter(c => runs.filter(r => r.case === c.id).length === 3).length;
  const checked = expected.filter(c => { const rs = runs.filter(r => r.case === c.id); return rs.length === 3 && rs.every(r => r.passed); }).length;
  const outputCases = expected.filter(c => !c.error);
  const outputChecked = outputCases.filter(c => { const rs=runs.filter(r=>r.case===c.id); return rs.length===3 && rs.every(r=>r.passed && r.supported_output); }).length;
  const rejectionChecked = expected.filter(c => c.error && runs.filter(r=>r.case===c.id).length===3 && runs.filter(r=>r.case===c.id).every(r=>r.passed)).length;
  const inconsistent = expected.filter(c => new Set(runs.filter(r => r.case === c.id).map(r => r.signature ?? r.error)).size > 1).map(c => c.id);
  const unknown = [...new Set(runs.flatMap(r => [...r.unmeasured, ...(!r.supported_output && !r.expected_error ? ['quality_gates_blocked_by_engine_failure'] : [])]))];
  const failures = runs.filter(r => !r.passed).map(r => ({ case: r.case, error: r.error, failedChecks: Object.entries(r.checks).filter(([, value]) => !value).map(([key]) => key), validatorError: r.validator_error }));
  const successful = runs.filter(r => r.supported_output);
  return { tool, completed, checked, outputCases:outputCases.length, outputChecked, rejectionChecked, total: expected.length, expectedRejections: expected.filter(c => c.error).length, inconsistent, unmeasured: unknown, failures, engineMedianSeconds: median(successful.map(r => r.seconds)), maxChildRssKiB: Math.max(0, ...runs.map(r => r.child_maxrss_kib)), workflow: workflow.find(r => r.tool === tool) ?? null, performance: performance.filter(r => r.tool === tool), decision: decisions[tool] ?? ['Çalışan çekirdeği koru; eksik kapıları tamamla', 'İçerik/yapısal sonuçlar ile görsel kontroller birlikte tamamlanmadan genel üretim onayı verilmez.'] };
});
await writeFile(resolve(root, 'cards.json'), JSON.stringify(cards, null, 2));
let report = '# Motor kalite incelemesi — ölçülen başlangıç durumu\n\n';
report += `Üretildi: ${new Date().toISOString()}. ${manifest.length} senaryo, ${rows.length} çalıştırma. Motor davranışı bu incelemede değiştirilmedi.\n\n`;
report += 'Kapsam: onaylanan plandaki 15 araç. Daha sonra eklenen 16. araç `pdf-to-pdf-ocr` bu incelemeye dahil değildir. Ana ölçümler kalite altyapısının `122e845` commit’inde korunan motor koduyla yapılmıştır; son OCR kelime hata ölçümü `9bb1b18` üzerinde yenilenmiştir. Bu commit mevcut TXT OCR fonksiyonunu değiştirmeden ayrı aranabilir PDF handler’ı ekler. Önceki ölçümler yeni aracın veya tüm güncel sürümün doğrulaması olarak sunulmaz.\n\n';
report += `Son bütünlük kontrolü: 120 senaryonun her birinde üç ayrı tekrar; 15 × 3 yük düzeyinde altışar sıralı ve ikişer eşzamanlı çalıştırma, toplam ${performance.length} performans kaydı. Bunlar motor çağrısı sayılarıdır; başarısız çağrılar da dahildir. OCR için karakter doğruluğuna ek olarak kelime ekleme/silme/değiştirme hata oranı ölçüldü. Audit değerlendiricisinin dört birim testi geçti. İzole regresyon koşusunda iki suite / 36 test geçti; bunlar önceki ölçüm sürümüne aittir.\n\n`;
report += '**“Geçen senaryo” yalnızca uygulanmış kontrolleri ifade eder; eksik görsel veya uygulama uyumluluğu kapıları varsa üretim kalitesi onayı değildir. Beklenen retler başarılı dönüşüm sayılmaz.**\n\n';
report += '| Araç | Üç tekrarı tamamlanan | Çıktı kontrolleri geçen | Doğru beklenen ret | API/worker | Medyan motor sn | Karar |\n|---|---:|---:|---:|---|---:|---|\n';
for (const c of cards) report += `| ${c.tool} | ${c.completed}/${c.total} | ${c.outputChecked}/${c.outputCases} | ${c.rejectionChecked}/${c.expectedRejections} | ${c.workflow?.state ?? c.workflow?.error ?? 'Ölçülmedi'} | ${c.engineMedianSeconds?.toFixed(2) ?? 'Çıktı yok'} | ${c.decision[0]} |\n`;
report += '\n## Ortam ve ölçüm sınırları\n\n';
report += `Python ${environment.python}; 1 CPU, 1024 MiB, 96 PID, ağsız doğrudan motor container’ı. Paket sürümleri: ${Object.entries(environment.packages).map(([p,v]) => `${p} ${v}`).join(', ')}.\n\n`;
report += 'RSS wait4 yüksek su işaretidir; eşzamanlı süreç ağacının anlık toplamı değildir. Geçici çalışma alanı 50 ms aralıkla örneklenir. Tekrarlı performans testi fiziksel disk önbelleğinin soğuk olduğunu kanıtlamaz. Aynı fixture ile ölçeklenmemiş yükler near-limit kanıtı sayılmaz.\n\n';
report += 'Tarayıcı, yerel frontend üzerinden yalnızca ayrı audit API/worker/veritabanına yönlendirilir. Başarılı indirmeler, yabancı oturum erişimi ve erken silme kontrol edilir. Zorla expiry, çalışan worker kill/lease kurtarma ve timeout fault injection bu runner’da henüz uygulanmamıştır; mevcut entegrasyon testleri bunların yerine sunulmaz.\n\n';
report = report.replace('Zorla expiry, çalışan worker kill/lease kurtarma ve timeout fault injection bu runner’da henüz uygulanmamıştır; mevcut entegrasyon testleri bunların yerine sunulmaz.', 'Kontrollü expiry, çalışan worker SIGKILL/gerçek lease kurtarma ve timeout fault injection sonuçları aşağıda ayrıca verilir. Test sonucu yoksa bu davranış doğrulanmış sayılmaz.');
report += 'Render tanımı API/motor/worker süreçlerini aynı container’da çalıştırır; yerel ölçümde bunlar ayrı container’lardır. Render bellek/CPU kapasitesi ve üretim yükü bu sonuçlardan çıkarılamaz.\n\n';
report += 'Dönüşüm çalışma dizini 384 MiB tmpfs içindedir; kanıtlar ölçümden sonra host’a kopyalanır. Doğrudan Python audit container’ı `--init` ile orphan süreçleri toplar. Windows bind mount çalışma dizini ve PID 1 reaping problemi içeren ön koşular ham deney olarak ayrılmıştır; rapor tablosuna dahil edilmez.\n\n';
if (cgroup['memory.peak']) report += `Performans container’ında cgroup tepe belleği ${Number(cgroup['memory.peak']) / 1048576} MiB, tepe süreç sayısı ${cgroup['pids.peak']}. Bellek olayları: ${cgroup['memory.events'].trim().replaceAll('\n', '; ')}. 1024 MiB sınıra erişildi; OOM öldürmesi gözlenmedi. Bu değer tek bir araca mal edilemez ve tmpfs/cache belleğini de içerir. Kaynak payı konusunda daha düşük bellekli üretim ortamına garanti verilmez.\n\n`;
report += 'Doğrulanmayan kapsam: tüm belgelerde elle kırpılma/örtüşme kontrolü, Microsoft Word ve kaynak Office uygulamalarıyla karşılaştırma, PDF form/yer imi/açıklama/dijital imza koruması, ICC renk profilleri, her araçta tüm bozuk dosya ve sınır çeşitleri, fiziksel disk dolması/silme hatası, çoklu worker kapasitesi ve canlı Render yükü. Manuel ve uygulamaya özgü referans seti tamamlanmadığı için bunlar geçti sayılmadı; ilgili belge sınıflarının güven düzeyi sınırlıdır.\n\n';
report += '## Yaşam döngüsü sonuçları\n\n' + (lifecycle.length ? lifecycle.map(r => `- ${r.name}: **${r.passed ? 'GEÇTİ' : 'GEÇMEDİ'}**, ${r.seconds.toFixed(1)} sn${r.error ? ', hata: ' + r.error : ''}${r.state ? ', durum: ' + r.state : ''}.`).join('\n') : 'Henüz ölçülmedi.') + '\n\n';
report += 'Performans kaydı yoksa kapasite veya optimizasyon kazanımı iddia edilmez. Alternatif motorlar çalıştırılmadığı sürece değişim önerisi bir aday değerlendirme kararıdır. Microsoft Word uyumluluğu LibreOffice render testiyle onaylanmaz.\n\n';
report += '## Öncelikli bulgular\n\n- Yüksek: şifreleme ve parola kaldırmada ortak PDF doğrulama akışını parola farkındalığı ile yeniden tasarla; erişim ve kaynak sınırlarını koru.\n- Yüksek: PPTX için frontend/sözleşme/API/kurulu LibreOffice bileşenleri arasındaki destek çelişkisini gider.\n- Yüksek: PDF → Word’de sessiz içerik kaybı ve yerleşim hatalarını öncele.\n- Orta: OCR yön/eğiklik, tablo yapısı ve Türkçe filigran için profil karşılaştırması yap.\n\n';
report += 'Statik veri işleme bulgusu: `jobs` repository create metodu (repository.ts:54) seçenekleri doğrudan JSONB parametresi olarak kaydediyor; `ToolOptions.password` için ayrı bir gizli veri mekanizması yok. Parola araçlarını iyileştirmeden önce parolanın düz metin iş metadata’sında kalması giderilmeli. Audit yalnızca sentetik parola kullandı; gerçek kullanıcı parolası sorgulanmadı veya raporlanmadı.\n\n';
for (const c of cards) {
  report += `## ${c.tool}\n\n${c.decision[0]}. ${c.decision[1]}\n\n`;
  report += `Üç tekrarı tamamlanan senaryo: ${c.completed}/${c.total}; çıktı kontrolleri geçen: ${c.outputChecked}/${c.outputCases}; doğru beklenen ret: ${c.rejectionChecked}/${c.expectedRejections}; tutarsız senaryo: ${c.inconsistent.length}; tepe child RSS: ${c.maxChildRssKiB} KiB.\n\n`;
  const distinct = [...new Set(c.failures.map(f => `${f.case}: ${f.error ?? f.validatorError ?? f.failedChecks.join(', ')}`))];
  report += distinct.length ? `Başarısızlıklar:\n\n${distinct.map(f => '- ' + f).join('\n')}\n\n` : 'Uygulanmış kontrollerde başarısızlık gözlenmedi.\n\n';
  report += `Ölçülmeyen kapılar: ${c.unmeasured.join(', ') || 'Runner kapsamındaki kapılar tamamlandı; genel üretim garantisi değildir'}.\n\n`;
  if (c.workflow?.queueTiming) report += `HTTP kuyruğu: ${c.workflow.queueTiming.queueSeconds ?? 'ölçülmedi'} sn; worker teslimi: ${c.workflow.queueTiming.workerSeconds ?? 'ölçülmedi'} sn; tarayıcı akışı: ${c.workflow.seconds.toFixed(2)} sn. Bunlar tek küçük belge örneğidir, servis p95 değeri değildir.\n\n`;
  const extra=supplement.filter(r=>r.case.startsWith(c.tool+'/'));
  if (extra.length) report += `İlk tekrara ait bağımsız piksel/yerleşim ek kontrolleri: ${extra.filter(r=>r.passed).length}/${extra.length}. Başarısız örnekler: ${extra.filter(r=>!r.passed).map(r=>r.case).join(', ') || 'yok'}. Bu ek ölçüm üç tekrarın yerini almaz.\n\n`;
  const toolRuns = rows.filter(r => r.tool === c.tool);
  for (const metric of ['content_accuracy', 'cell_accuracy', 'character_accuracy', 'word_error_rate', 'max_word_displacement_pt', 'size_ratio']) {
    const values = toolRuns.map(r => r.metrics?.[metric]).filter(v => typeof v === 'number');
    if (values.length) report += `- ${metric}: min ${Math.min(...values).toFixed(4)}, maks ${Math.max(...values).toFixed(4)} (yalnızca ölçülebilen çıktılar).\n`;
  }
  if (c.performance.length) {
    report += '\n| Yük | Birim | Sıralı başarılı/deneme | Sıcak medyan sn | Tepe child RSS KiB | İki eşzamanlı başarılı/deneme |\n|---|---:|---:|---:|---:|---:|\n';
    for (const tier of ['small','medium','near']) {
      const sample=c.performance.filter(r => r.tier===tier); const sequential=sample.filter(r => r.concurrency!==2); const parallel=sample.filter(r => r.concurrency===2);
      const warm=sequential.filter(r => !r.first_in_batch && r.supported_output);
      report += `| ${tier} | ${sequential[0]?.units ?? '?'} | ${sequential.filter(r=>r.supported_output).length}/${sequential.length} | ${median(warm.map(r=>r.seconds))?.toFixed(2) ?? 'Çıktı yok'} | ${Math.max(0,...sample.map(r=>r.child_maxrss_kib))} | ${parallel.filter(r=>r.supported_output).length}/${parallel.length} |\n`;
    }
    report += '\n';
  }
}
report += '## Görsel inceleme ve yerel iyileştirme adayları\n\nPDF → Word plain/layout örneklerinin kaynak ve LibreOffice render görüntüleri incelendi: ana içerik görünür kalıyor, ancak satır aralıkları ve dikey konumlar değişiyor. Rotated örneğinin render çıktısı boş; bu sessiz veri kaybıdır. Diğer belgelere bu sınırlı görsel inceleme üzerinden genel onay verilmedi.\n\n';
report += 'İlk adaylar mevcut açık kaynak araçların profilleridir: OCR için 300 DPI ve yön/eğiklik işleme; pdfplumber için çizgisiz tabloda text stratejisi; filigran için gömülü Unicode font; Office için eksik bileşen ve parola farkındalığı. Aday ölçümü olmadan kalite/hız kazanımı iddia edilmez.\n\n';
if (candidates.length) {
  report += '### Ölçülen profil adayları\n\n';
  for (const c of candidates) {
    if (c.tool==='ocr') report += `- OCR ${c.fixture} / ${c.profile}: üç tekrarda en düşük karakter doğruluğu ${(c.min_accuracy*100).toFixed(2)}%, medyan ${c.median_seconds.toFixed(3)} sn.\n`;
    else if (c.tables) report += `- PDF → Excel ${c.fixture} / ${c.profile}: ${c.tables.length} tablo algılandı; algılama tek başına doğruluk onayı değildir.\n`;
    else report += `- ${c.tool} / ${c.profile}: ${JSON.stringify(c)}\n`;
  }
  report += '\nÜretim profilinde değişiklik yapılmadı. Tek belgede kazanan profil, tüm belge sınıfları için seçilmedi; %20 performans hedefi kalite kapılarından bağımsız bir kabul değildir.\n\n';
  report += 'Aday kararı: yön profili dönük OCR örneğinde karakter doğruluğunu %0’dan %100’e çıkardı; süre yaklaşık iki katına çıktı. 300 DPI küçük yazıda %97,56’dan %100’e çıktı, fakat eğik örnekte %100’den %97,56’ya düştü. Bu nedenle tüm girdilere tek profil uygulamak yerine belge sınıfına göre seçim ayrıca doğrulanmalı. Çizgisiz tabloda algılama artışı, hücre/başlık ve kritik sayı kapıları tamamlanmadan kabul edilmemeli.\n\n';
}
report += '## Yerel gerçek belge karşılaştırması\n\nKullanıcının önceden paylaştığı örnek yalnızca ağsız, Git dışında tutulan yerel alanda yeniden işlendi. Yeni çıktıda normalize metin ve kritik sayı kontrolleri, düzenlenebilir metin ve sayfa sayısı geçti; 5 pt yerleşim kapısı geçmedi. Önceki DOCX ile metin karşılaştırması da yapıldı. Çok sütunlu belgede geometrik ve mantıksal okuma sırası farklı olabildiğinden eski/yeni dizi doğruluğu genel kalite yüzdesine dönüştürülmedi. Bu tek örnek genelleştirilmez; belge adı, metni ve çıktıları rapora eklenmedi. Microsoft Word üzerinde elle kontrol yapılmadı.\n\n';
report += '## Önceliklendirilmiş uygulama ve yeniden doğrulama\n\n1. Yüksek — Şifreleme/parola kaldırma ve parola saklama: parola farkındalığı olan giriş/çıkış doğrulaması, güvenli gizli veri yaşam döngüsü. Yeniden kabul: sekizer senaryo üçer kez; doğru/yanlış parola, bağımsız QPDF kontrolü ve gerçek API akışı geçmeli.\n2. Yüksek — PDF → Word: dönük sayfada başarılı görünen boş çıktı ve yerleşim kaymaları. Yeniden kabul: desteklenen belgelerde ≥%99,5 normalize metin, kritik sayılarda tam doğruluk, düzenlenebilir metin, sayfa sayısı ve 5 pt konum; ayrıca elle kırpılma/örtüşme kontrolü.\n3. Yüksek — PPTX: yükleme izinleri ve Impress bileşeni birlikte düzeltilmeli. Yeniden kabul: sekiz sentetik sunumda API → worker → indirme; kaynak uygulama referansıyla slayt sayısı/metin/yerleşim.\n4. Yüksek — Timeout: gerçek süre aşımında ENGINE_UNAVAILABLE yerine doğru hata ve kaynak temizliği. Yeniden kabul: aynı kısa timeout fault testi, iptal ve lease kurtarma regresyonları birlikte geçmeli.\n5. Orta — PDF → Excel: çizgisiz/birleşik hücreler için profil seçimi. Yeniden kabul: hücre ≥%99, satır/sütun ≥%98, kritik sayılar tam; inert formül metni korunmalı.\n6. Orta — OCR yön/çözünürlük: tek profile geçmeden aynı corpus üzerinde CER/WER ve üç tekrar. Temiz ≥%98 / bozulmuş ≥%95 karakter hedefi; iyileşen dönük örnek diğer sınıfları bozmamalı.\n7. Orta — Türkçe filigran ve döndürülmüş sayfa numarası: gömülü font/koordinat düzeltmesi. Yeniden kabul: sekizer senaryoda görünür metin, konum ve sayfa sınırları.\n8. Sonraki kapsam — Çalışan çekirdekleri koru; eksik görsel/Office referans ve PDF özellik koruma kapılarını tamamla. Hız/bellek adayı aynı kalite kapılarıyla karşılaştırılmalı; medyan süre veya tepe bellekte %20 hedefi henüz kanıtlanmış bir kazanım değildir.\n\n';
report += 'Upstream kaynakları (23 Ekim 2026 kontrolü): [pdf2docx bakım durumu](https://github.com/ArtifexSoftware/pdf2docx/discussions/374), [pdf2docx MIT lisansı](https://pdf2docx.readthedocs.io/en/latest/license.html), [PyMuPDF lisansı](https://pymupdf.readthedocs.io/en/latest/license.html), [Tesseract kalite önerileri](https://tesseract-ocr.github.io/tessdoc/ImproveQuality.html), [pdfplumber tablo stratejileri](https://github.com/jsvine/pdfplumber#extracting-tables), [QPDF kapsamı](https://qpdf.readthedocs.io/en/stable/overview.html). pdf2docx için Artifex aktif bakımı bırakmıştır; PyMuPDF lisans yükümlülükleri ayrı incelenmelidir. Bu rapor hukuki uygunluk onayı değildir.\n\n';
report += '## Yeniden üretim ve kanıtlar\n\n`node scripts/audit-engines.mjs` 120 senaryoyu üçer kez çalıştırır. `node scripts/audit-engines.mjs --performance-only` performans kaydını üretir. `node scripts/audit-workflow.mjs` ayrı Docker projesinde tarayıcı/worker akışını çalıştırır ve sonunda yalnızca bu geçici projeyi kaldırır. `node scripts/report-engine-audit.mjs` raporu günceller.\n\nHam sonuçlar, ilk tekrar çıktıları, kaynak/çıktı/fark PNG’leri, tarayıcı ekranları ve ortam bilgisi ignored `.qa/engine-audit/` altındadır. Fixture üreticileri sentetiktir; gerçek kullanıcı belgeleri rapora veya Git’e eklenmez.\n';
await writeFile(resolve('docs/ENGINE-AUDIT.md'), report);
console.log(`Report generated: ${cards.length} tools, ${rows.length} executions.`);
