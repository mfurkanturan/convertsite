<script lang="ts">
  import Logo from './logo.svelte';
  import Icon from './icon.svelte';
  import { brand } from '../lib/brand';
</script>

<footer class="mt-20 border-t border-border bg-surface/80 pt-16 pb-12 transition-colors">
  <div class="mx-auto max-w-[1200px] px-10 max-[1180px]:px-7 max-[540px]:px-4">
    <div class="grid grid-cols-1 gap-10 md:grid-cols-12 lg:gap-12">
      <!-- Brand & Mission -->
      <div class="md:col-span-5 lg:col-span-4">
        <Logo />
        <p class="mt-4 text-sm leading-relaxed text-text-soft">
          DoctorConverter, belgelerinizi saniyeler içinde dönüştüren, düzenleyen ve optimize eden hızlı, güvenli ve ücretsiz online araç setidir.
        </p>
        <div class="mt-6 flex items-center gap-2 text-xs font-medium text-text-muted">
          <span class="flex h-6 w-6 items-center justify-center rounded-full bg-success-soft text-success">
            <Icon name="shield" size={14} />
          </span>
          <span>Dosyalarınız 60 dakika içinde otomatik imha edilir.</span>
        </div>
      </div>

      <!-- Popüler Araçlar -->
      <div class="md:col-span-3 lg:col-span-3 lg:col-start-6">
        <h3 class="text-xs font-bold uppercase tracking-wider text-text">Popüler Araçlar</h3>
        <ul class="mt-4 space-y-2.5 text-sm">
          <li><a href="/#tool/pdf-to-word" class="text-text-soft transition-colors hover:text-accent">PDF → Word Dönüştürücü</a></li>
          <li><a href="/#tool/word-to-pdf" class="text-text-soft transition-colors hover:text-accent">Word → PDF Dönüştürücü</a></li>
          <li><a href="/#tool/merge-pdf" class="text-text-soft transition-colors hover:text-accent">PDF Birleştirme</a></li>
          <li><a href="/#tool/compress-pdf" class="text-text-soft transition-colors hover:text-accent">PDF Boyutu Küçültme</a></li>
          <li><a href="/#tool/pdf-to-excel" class="text-text-soft transition-colors hover:text-accent">PDF → Excel Aktarma</a></li>
          <li><a href="/#tool/ocr" class="text-text-soft transition-colors hover:text-accent">Metin Çıkarma (OCR)</a></li>
        </ul>
      </div>

      <!-- Kurumsal & Güvenlik -->
      <div class="md:col-span-2 lg:col-span-2">
        <h3 class="text-xs font-bold uppercase tracking-wider text-text">Güvenlik & Bilgi</h3>
        <ul class="mt-4 space-y-2.5 text-sm">
          <li><a href="/guvenlik" class="text-text-soft transition-colors hover:text-accent">Güvenlik Mimarisi</a></li>
          <li><a href="/gizlilik" class="text-text-soft transition-colors hover:text-accent">Gizlilik Politikası</a></li>
          <li><a href="/kullanim-sartlari" class="text-text-soft transition-colors hover:text-accent">Kullanım Şartları</a></li>
          <li><a href="/#faq" class="text-text-soft transition-colors hover:text-accent">Sıkça Sorulanlar (SSS)</a></li>
        </ul>
      </div>

      <!-- İletişim & Yardım -->
      <div class="md:col-span-2 lg:col-span-3">
        <h3 class="text-xs font-bold uppercase tracking-wider text-text">İletişim & Destek</h3>
        <ul class="mt-4 space-y-2.5 text-sm">
          <li><a href="/iletisim" class="text-text-soft transition-colors hover:text-accent">İletişim & Destek</a></li>
          <li><a href="mailto:destek@doctorconverter.com" class="text-text-soft transition-colors hover:text-accent">destek@doctorconverter.com</a></li>
          <li class="pt-2 text-xs text-text-muted">
            Öneri ve sorularınız için bize her zaman ulaşabilirsiniz.
          </li>
        </ul>
      </div>
    </div>

    <!-- Bottom Bar -->
    <div class="mt-14 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 text-xs text-text-muted sm:flex-row">
      <p>© {new Date().getFullYear()} {brand.name} ({brand.domain}). Tüm hakları saklıdır.</p>
      <div class="flex items-center gap-6">
        <a href="/gizlilik" class="transition-colors hover:text-text">Gizlilik</a>
        <a href="/kullanim-sartlari" class="transition-colors hover:text-text">Şartlar</a>
        <a href="/guvenlik" class="transition-colors hover:text-text">Güvenlik</a>
        <a href="/iletisim" class="transition-colors hover:text-text">İletişim</a>
      </div>
    </div>
  </div>
</footer>
