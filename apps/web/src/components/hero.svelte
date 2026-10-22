<script lang="ts">
  import Icon from './icon.svelte';
  import HeroArt from './hero-art.svelte';
  import Button from './button.svelte';
  import { useUi } from '../i18n/context';
  const text = useUi().hero;
</script>

<section class="relative flex items-center overflow-hidden rounded-panel border border-border bg-gradient-to-br from-accent-soft via-surface to-accent-soft/60" aria-labelledby="hero-title">
  <div class="relative z-[2] flex-1 px-10 py-10 max-[1000px]:px-8 max-[600px]:px-5 max-[600px]:py-7">
    <span class="eyebrow"><span></span> {text.eyebrow}</span>
    <h1 id="hero-title" class="mt-4 font-display text-[clamp(30px,3.2vw,42px)] font-bold leading-[1.15] tracking-[-0.035em] text-text">{text.titleA}<br /><span class="text-accent">{text.titleB}</span></h1>
    <p class="mt-4 max-w-md text-base leading-relaxed text-text-soft">{text.lead}</p>
    <div class="mt-7 flex flex-wrap items-center gap-x-5 gap-y-3">
      <Button href="#tools" className="whitespace-nowrap">{text.cta} <Icon name="arrow" size={17} /></Button>
      <span class="flex items-center gap-1.5 text-sm text-text-soft"><span class="text-success"><Icon name="check" size={16} /></span> {text.noSignup}</span>
    </div>
  </div>
  <div class="relative flex basis-[40%] items-center justify-center self-stretch py-4 pr-6 max-[760px]:hidden">
    <HeroArt />
  </div>
</section>

<ul class="mt-4 grid grid-cols-3 gap-3 max-[760px]:grid-cols-1 max-[760px]:gap-2" aria-label={text.highlights}>
  {#each text.features as item}
    <li class="flex items-center gap-3 rounded-card border border-border bg-surface px-4 py-3">
      <span class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent-soft text-accent"><Icon name={item.icon} size={18} /></span>
      <span class="min-w-0 leading-snug"><strong class="block text-sm font-semibold text-text">{item.title}</strong><span class="block text-[13px] text-text-muted">{item.text}</span></span>
    </li>
  {/each}
</ul>
