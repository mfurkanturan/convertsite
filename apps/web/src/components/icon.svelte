<script lang="ts">
  export let name = 'file';
  export let size = 20;
  export let stroke = 1.7;
  const paths: Record<string, string> = {
    grid: 'M3 3h7v7H3z M14 3h7v7h-7z M3 14h7v7H3z M14 14h7v7h-7z',
    arrows: 'M4 7h16m-5-5 5 5-5 5M20 17H4m5-5-5 5 5 5',
    layers: 'm12 3 10 5-10 5L2 8z M2 12l10 5 10-5M2 16l10 5 10-5',
    sparkles: 'm12 3 2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5z M20 2v4m-2-2h4',
    search: 'M21 21l-5-5 M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0',
    arrow: 'M4 12h16m-6-6 6 6-6 6',
    chevron: 'm9 5 7 7-7 7',
    chevronDown: 'm6 9 6 6 6-6',
    shield: 'm12 3 8 3v6c0 5-8 9-8 9s-8-4-8-9V6z m-4 9 3 3 5-6',
    lock: 'M6 10h12v11H6z M8 10V7a4 4 0 0 1 8 0v3 M12 14v3',
    bolt: 'm13 2-9 12h7l-1 8 10-12h-8z',
    heart: 'M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z',
    help: 'M9 9a3 3 0 1 1 5 2c-2 1-2 2-2 3 M12 17h.01 M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0',
    globe: 'M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0 M2 12h20 M12 2c6 6 6 14 0 20-6-6-6-14 0-20',
    upload: 'M12 16V3m-5 5 5-5 5 5 M3 15v6h18v-6',
    file: 'M14 2H5v20h14V7z M14 2v6h5 M8 13h8M8 17h6',
    word: 'M14 2H5v20h14V7z M14 2v6h5 M7 12l2 6 3-5 3 5 2-6',
    pdf: 'M14 2H5v20h14V7z M14 2v6h5 M8 17c4-7 2-8 2-5s4 6 6 4c1-2-6-1-8 1z',
    merge: 'M5 3v5c0 4 7 3 7 7m7-12v5c0 4-7 3-7 7 M12 15v7m-4-4 4 4 4-4',
    compress: 'M8 3v5H3 M16 3v5h5 M3 16h5v5m13-5h-5v5 M8 8 3 3m13 5 5-5 M8 16l-5 5m13-5 5 5',
    excel: 'M14 2H5v20h14V7z M14 2v6h5 M9 12l6 6m0-6-6 6',
    table: 'M3 4h18v16H3z M3 9h18M9 9v11M15 9v11M3 14h18',
    image: 'M3 3h18v18H3z m0 14 5-5 5 5 3-3 5 5 M16 7h.01',
    images: 'M7 3h14v14H7z M3 7v14h14 M7 13l4-4 5 5 2-2 3 3 M16 7h.01',
    scissors: 'M8 8 21 21 M8 16 21 3 M9 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0 M9 18a3 3 0 1 1-6 0 3 3 0 0 1 6 0',
    scan: 'M8 3H3v5m13-5h5v5 M3 16v5h5m13-5v5h-5 M7 8h10m-5 0v9m-3 0h6',
    plus: 'M12 5v14M5 12h14',
    close: 'm6 6 12 12M6 18 18 6',
    check: 'm5 12 4 4L19 6',
    menu: 'M3 6h18M3 12h18M3 18h18',
    back: 'M20 12H4m6-6-6 6 6 6',
    up: 'm6 14 6-6 6 6',
    down: 'm6 10 6 6 6-6',
    info: 'M12 11v6m0-10h.01 M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0',
  };
</script>

<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width={stroke} stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d={paths[name] ?? paths.file} /></svg>
