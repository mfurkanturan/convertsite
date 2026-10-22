<script lang="ts">
  import { useLocale } from '../i18n/context';
  const labels = useLocale() === 'tr' ? { privacy: '%100 Gizlilik', speed: 'Hızlı Dönüşüm' } : { privacy: 'Private files', speed: 'Fast conversion' };
</script>

<svg viewBox="0 0 460 340" class="h-auto w-full select-none" aria-hidden="true" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <!-- Card drop shadow -->
    <filter id="hero-shadow-card" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="12" stdDeviation="16" flood-color="#1e293b" flood-opacity="0.08" />
      <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#1e293b" flood-opacity="0.04" />
    </filter>
    <filter id="hero-shadow-float" x="-30%" y="-30%" width="160%" height="160%">
      <feDropShadow dx="0" dy="8" stdDeviation="12" flood-color="#2563eb" flood-opacity="0.25" />
    </filter>
    <linearGradient id="hero-grad-accent" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#3b82f6" />
      <stop offset="100%" stop-color="#1d4ed8" />
    </linearGradient>
    <linearGradient id="hero-grad-pdf" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ef4444" />
      <stop offset="100%" stop-color="#dc2626" />
    </linearGradient>
    <linearGradient id="hero-grad-word" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#2563eb" />
      <stop offset="100%" stop-color="#1e40af" />
    </linearGradient>
  </defs>

  <!-- Ambient background rings -->
  <circle cx="230" cy="170" r="140" stroke="var(--color-border)" stroke-width="1.2" stroke-dasharray="4 4" opacity="0.6" />
  <circle cx="230" cy="170" r="185" stroke="var(--color-border)" stroke-width="1" opacity="0.35" />

  <!-- Back Card: Word / DOCX (Right Tilted) -->
  <g transform="translate(230, 48) rotate(7, 75, 105)" filter="url(#hero-shadow-card)">
    <rect x="0" y="0" width="148" height="196" rx="14" fill="#ffffff" stroke="var(--color-border)" stroke-width="1.2" />
    <!-- Top badge -->
    <rect x="16" y="16" width="56" height="26" rx="6" fill="url(#hero-grad-word)" />
    <text x="44" y="33" font-size="12" font-weight="800" fill="#ffffff" font-family="var(--font-sans)" text-anchor="middle" letter-spacing="0.04em">DOCX</text>
    <!-- Document lines -->
    <rect x="16" y="58" width="116" height="6" rx="3" fill="var(--color-border)" />
    <rect x="16" y="74" width="94" height="6" rx="3" fill="var(--color-border)" />
    <rect x="16" y="90" width="104" height="6" rx="3" fill="var(--color-border)" opacity="0.7" />
    <rect x="16" y="106" width="70" height="6" rx="3" fill="var(--color-border)" opacity="0.5" />
    <!-- Visual block inside Word doc -->
    <rect x="16" y="126" width="116" height="48" rx="8" fill="var(--color-accent-soft)" stroke="var(--color-border)" stroke-width="0.8" />
    <path d="M28 150h36M28 158h22" stroke="var(--color-accent)" stroke-width="2" stroke-linecap="round" opacity="0.75" />
    <circle cx="106" cy="150" r="12" fill="var(--color-accent)" fill-opacity="0.12" />
    <circle cx="106" cy="150" r="6" fill="var(--color-accent)" />
  </g>

  <!-- Front Card: PDF Document (Left Tilted) -->
  <g transform="translate(82, 38) rotate(-7, 75, 105)" filter="url(#hero-shadow-card)">
    <rect x="0" y="0" width="152" height="202" rx="14" fill="#ffffff" stroke="var(--color-border)" stroke-width="1.2" />
    <!-- Folded corner tab -->
    <path d="M152 30 L122 30 L122 0 Z" fill="var(--color-border)" opacity="0.6" />
    <!-- Top PDF badge -->
    <rect x="16" y="18" width="48" height="26" rx="6" fill="url(#hero-grad-pdf)" />
    <text x="40" y="35" font-size="12" font-weight="800" fill="#ffffff" font-family="var(--font-sans)" text-anchor="middle" letter-spacing="0.04em">PDF</text>
    <!-- Document lines -->
    <rect x="16" y="60" width="120" height="6" rx="3" fill="var(--color-border)" />
    <rect x="16" y="76" width="100" height="6" rx="3" fill="var(--color-border)" />
    <rect x="16" y="92" width="110" height="6" rx="3" fill="var(--color-border)" opacity="0.7" />
    <rect x="16" y="108" width="80" height="6" rx="3" fill="var(--color-border)" opacity="0.5" />
    <!-- Mini PDF table preview -->
    <rect x="16" y="128" width="120" height="52" rx="8" fill="#fef2f2" stroke="#fecaca" stroke-width="0.8" />
    <line x1="16" y1="145" x2="136" y2="145" stroke="#fecaca" stroke-width="1" />
    <line x1="56" y1="128" x2="56" y2="180" stroke="#fecaca" stroke-width="1" />
    <line x1="96" y1="128" x2="96" y2="180" stroke="#fecaca" stroke-width="1" />
  </g>

  <!-- Central Conversion Nexus -->
  <g transform="translate(230, 168)" filter="url(#hero-shadow-float)">
    <circle cx="0" cy="0" r="30" fill="url(#hero-grad-accent)" stroke="#ffffff" stroke-width="4" />
    <!-- Modern exchange arrows -->
    <path d="M-10 -4h20m-5 -5l5 5l-5 5" stroke="#ffffff" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" />
    <path d="M10 6h-20m5 -5l-5 5l5 5" stroke="#ffffff" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" />
  </g>

  <!-- Floating Feature Pill 1: Top Right (Security / Privacy) -->
  <g transform="translate(316, 24)" filter="url(#hero-shadow-card)">
    <rect x="0" y="0" width="124" height="34" rx="17" fill="#ffffff" stroke="var(--color-border)" stroke-width="1" />
    <circle cx="18" cy="17" r="9" fill="#f0fdf4" />
    <path d="M14 17l2.5 2.5 5-5" stroke="#16a34a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
    <text x="34" y="22" font-size="11.5" font-weight="700" fill="#0f172a" font-family="var(--font-sans)">{labels.privacy}</text>
  </g>

  <!-- Floating Feature Pill 2: Bottom Left (Lightning Speed) -->
  <g transform="translate(20, 246)" filter="url(#hero-shadow-card)">
    <rect x="0" y="0" width="138" height="34" rx="17" fill="#ffffff" stroke="var(--color-border)" stroke-width="1" />
    <circle cx="18" cy="17" r="9" fill="#fef9c3" />
    <path d="M18 10l-4 8h5l-1 6 6-9h-5l1-5z" fill="#ca8a04" stroke="#ca8a04" stroke-width="0.8" stroke-linejoin="round" />
    <text x="35" y="22" font-size="11.5" font-weight="700" fill="#0f172a" font-family="var(--font-sans)">{labels.speed}</text>
  </g>

  <!-- Floating Chip: Bottom Right (XLSX / Excel) -->
  <g transform="translate(328, 244)" filter="url(#hero-shadow-card)">
    <rect x="0" y="0" width="102" height="34" rx="17" fill="#ffffff" stroke="var(--color-border)" stroke-width="1" />
    <rect x="9" y="8" width="18" height="18" rx="4" fill="#059669" />
    <text x="18" y="21" font-size="10" font-weight="800" fill="#ffffff" font-family="var(--font-sans)" text-anchor="middle">X</text>
    <text x="35" y="22" font-size="11.5" font-weight="700" fill="#0f172a" font-family="var(--font-sans)">Excel · XLSX</text>
  </g>
</svg>
