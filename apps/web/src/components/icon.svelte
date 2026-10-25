<script lang="ts">
  import {
    LayoutGrid,
    ArrowLeftRight,
    Layers,
    Sparkles,
    Search,
    ArrowRight,
    ChevronRight,
    ChevronDown,
    ChevronUp,
    ShieldCheck,
    Lock,
    Zap,
    Heart,
    CircleQuestionMark,
    Globe,
    CloudUpload,
    FileText,
    FileType,
    FileSpreadsheet,
    FileStack,
    Minimize2,
    SquareScissors,
    ScanText,
    FileImage,
    Images,
    Plus,
    X,
    Check,
    Menu,
    ArrowLeft,
    Download,
    Info,
    Stethoscope,
    Presentation,
    LockOpen,
    Stamp
  } from '@lucide/svelte';
  import type { Component } from 'svelte';

  export let name = 'file';
  export let size = 20;
  export let stroke = 2;
  export let className = '';

  const iconMap: Record<string, Component<any>> = {
    // Navigation & General
    grid: LayoutGrid,
    arrows: ArrowLeftRight,
    layers: Layers,
    sparkles: Sparkles,
    search: Search,
    arrow: ArrowRight,
    chevron: ChevronRight,
    chevronDown: ChevronDown,
    chevronUp: ChevronUp,
    shield: ShieldCheck,
    lock: Lock,
    bolt: Zap,
    heart: Heart,
    help: CircleQuestionMark,
    globe: Globe,
    upload: CloudUpload,
    plus: Plus,
    close: X,
    check: Check,
    menu: Menu,
    back: ArrowLeft,
    up: ChevronUp,
    down: ChevronDown,
    download: Download,
    info: Info,
    stethoscope: Stethoscope,

    // File & Tool Specific
    file: FileText,
    word: FileType,
    pdf: FileText,
    merge: FileStack,
    compress: Minimize2,
    excel: FileSpreadsheet,
    table: FileSpreadsheet,
    presentation: Presentation,
    unlock: LockOpen,
    stamp: Stamp,
    image: FileImage,
    images: Images,
    scissors: SquareScissors,
    scan: ScanText,
  };

  $: CurrentIcon = iconMap[name] ?? FileText;
</script>

<svelte:component this={CurrentIcon} {size} strokeWidth={stroke} class={className} aria-hidden="true" />
