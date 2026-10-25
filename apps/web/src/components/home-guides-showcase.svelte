<script lang="ts">
  import Icon from './icon.svelte';
  import type { Locale } from '../i18n/locales';
  import { track } from '../lib/analytics';

  interface GuideItem {
    slug: string;
    group: string;
    groupLabel: string;
    title: string;
    lead: string;
    steps: { title: string; text: string }[];
    href: string;
  }

  export let locale: Locale = 'tr';
  export let allGuidesHref: string;
  export let allGuidesLabel: string;
  export let hubTitle: string;
  export let hubLead: string;
  export let featured: GuideItem;
  export let sideGuides: GuideItem[] = [];
  export let quickGuides: GuideItem[] = [];

  const copy = locale === 'tr'
    ? { featured: 'Rehber', more: 'Diğer senaryolar', read: 'Rehberi oku', steps: 'Rehber adımları' }
    : { featured: 'Guide', more: 'More guides', read: 'Read the guide', steps: 'Guide steps' };
</script>

<section id="guides" class="mt-[var(--section-space)] border-t border-border pt-[var(--section-space)]" aria-labelledby="guides-title">
  <header class="flex flex-wrap items-end justify-between gap-4">
    <div>
      <h2 id="guides-title" class="home-section-title">{hubTitle}</h2>
      <p class="mt-1.5 max-w-2xl text-[15px] leading-relaxed text-text-soft">{hubLead}</p>
    </div>
    <a href={allGuidesHref} class="inline-flex min-h-11 items-center gap-1 rounded-lg px-2 text-sm font-semibold text-accent hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent">
      <span>{allGuidesLabel}</span><Icon name="arrow" size={14} />
    </a>
  </header>

  <div class="mt-6 grid items-start gap-4">
    <a href={featured.href} onclick={() => track('guide_open')} class="group flex flex-col items-start gap-4 rounded-panel border border-border-strong bg-surface p-5 transition-colors hover:border-accent/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus sm:p-6">
      <div class="flex w-full flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <span class="guide-category">{copy.featured} · {featured.groupLabel}</span>
          <h3 class="mt-2 max-w-2xl font-display text-xl font-semibold leading-snug tracking-[-0.025em] [text-wrap:balance] text-text group-hover:text-accent sm:text-2xl">{featured.title}</h3>
          <p class="mt-2 max-w-2xl text-sm leading-relaxed text-text-soft">{featured.lead}</p>
        </div>
        <span class="inline-flex min-h-11 w-fit shrink-0 items-center gap-2 text-sm font-semibold text-accent">
          {copy.read}<Icon name="arrow" size={16} />
        </span>
      </div>

      <ol class="grid w-full border-t border-border sm:grid-cols-3" aria-label={copy.steps}>
        {#each featured.steps as step, index}
          <li class="flex gap-3 border-b border-border py-4 last:border-b-0 sm:border-b-0 sm:px-3 sm:first:pl-0 sm:last:pr-0 sm:border-r sm:last:border-r-0">
            <span class="guide-step-number" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
            <div>
              <h4 class="text-[15px] font-semibold leading-snug text-text sm:text-base">{step.title}</h4>
              <p class="mt-1 text-sm leading-relaxed text-text-soft">{step.text}</p>
            </div>
          </li>
        {/each}
      </ol>
    </a>

    <div class="grid items-stretch gap-x-8 gap-y-4 sm:grid-cols-2">
      {#each sideGuides as item}
        <a href={item.href} onclick={() => track('guide_open')} class="group flex flex-col border-t border-border py-5 transition-colors sm:py-6">
          <div class="flex-1">
            <span class="guide-category">{item.groupLabel}</span>
            <h3 class="mt-2 font-display text-lg font-semibold leading-snug text-text group-hover:text-accent">{item.title}</h3>
            <p class="mt-2 text-sm leading-relaxed text-text-soft">{item.lead}</p>
          </div>
          <span class="mt-3 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-accent">{copy.read}<Icon name="arrow" size={15} /></span>
        </a>
      {/each}
    </div>
  </div>

  {#if quickGuides.length}
    <nav class="mt-7 border-t border-border pt-5" aria-label={copy.more}>
      <h3 class="text-sm font-semibold text-text">{copy.more}</h3>
      <ul class="mt-3 grid gap-x-6 sm:grid-cols-2 lg:grid-cols-3">
        {#each quickGuides as item}
          <li class="border-b border-border/70 py-3">
            <a href={item.href} onclick={() => track('guide_open')} class="group flex min-h-11 items-center justify-between gap-3 text-sm leading-snug text-text-soft hover:text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent">
              <span>{item.title}</span><span class="shrink-0 text-accent " aria-hidden="true">→</span>
            </a>
          </li>
        {/each}
      </ul>
    </nav>
  {/if}
</section>
