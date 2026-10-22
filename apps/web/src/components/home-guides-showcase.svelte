<script lang="ts">
  import Icon from './icon.svelte';
  import type { Locale } from '../i18n/locales';

  interface GuideItem {
    slug: string;
    group: string;
    groupLabel: string;
    title: string;
    lead: string;
    href: string;
  }

  export let locale: Locale = 'tr';
  export let allGuidesHref: string;
  export let allGuidesLabel: string;
  export let hubTitle: string;
  export let hubLead: string;
  export let items: GuideItem[] = [];

  let activeGroup = 'all';

  const groupIcons: Record<string, string> = {
    student: '🎓',
    legal: '⚖️',
    visa: '🏛️',
    career: '💼',
    finance: '📊',
    office: '🏢',
  };

  const uniqueGroups = Array.from(new Set(items.map((i) => i.group))).map((groupId) => {
    const found = items.find((i) => i.group === groupId);
    return {
      id: groupId,
      label: found ? found.groupLabel : groupId,
      icon: groupIcons[groupId] || '📌',
    };
  });

  $: filtered = activeGroup === 'all'
    ? items.slice(0, 6) // Curate top 6 when all is selected for clean layout
    : items.filter((i) => i.group === activeGroup);
</script>

<section id="guides" class="mt-14 border-t border-border pt-12 max-[600px]:mt-10 max-[600px]:pt-9" aria-labelledby="guides-title">
  <!-- Section Header -->
  <div class="flex flex-wrap items-end justify-between gap-4">
    <div>
      <h2 id="guides-title" class="font-display text-[clamp(22px,2.2vw,28px)] font-semibold tracking-[-0.02em] text-text">
        {hubTitle}<span class="text-accent">.</span>
      </h2>
      <p class="mt-1.5 max-w-2xl text-[15px] text-text-soft">
        {hubLead}
      </p>
    </div>
    <a href={allGuidesHref} class="text-sm font-semibold text-accent hover:underline flex items-center gap-1">
      <span>{allGuidesLabel}</span>
      <Icon name="arrow" size={14} />
    </a>
  </div>

  <!-- Interactive Audience Tabs -->
  <div class="mt-6 -mx-1 flex min-w-0 gap-1.5 overflow-x-auto px-1 py-1 [scrollbar-width:none]" role="tablist">
    <button
      type="button"
      role="tab"
      aria-selected={activeGroup === 'all'}
      class="flex min-h-9 shrink-0 items-center whitespace-nowrap rounded-lg px-3.5 text-xs font-semibold transition-all {activeGroup === 'all' ? 'bg-accent text-white shadow-xs' : 'bg-surface text-text-soft border border-border/80 hover:border-accent/40 hover:text-text'}"
      onclick={() => activeGroup = 'all'}
    >
      {locale === 'tr' ? '⭐ Öne Çıkanlar' : '⭐ Highlights'}
    </button>

    {#each uniqueGroups as group}
      <button
        type="button"
        role="tab"
        aria-selected={activeGroup === group.id}
        class="flex min-h-9 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-lg px-3.5 text-xs font-semibold transition-all {activeGroup === group.id ? 'bg-accent text-white shadow-xs' : 'bg-surface text-text-soft border border-border/80 hover:border-accent/40 hover:text-text'}"
        onclick={() => activeGroup = group.id}
      >
        <span>{group.icon}</span>
        <span>{group.label}</span>
      </button>
    {/each}
  </div>

  <!-- Cards Grid -->
  <div class="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
    {#each filtered as item}
      <a
        href={item.href}
        class="group flex flex-col justify-between rounded-card border border-border/80 bg-surface p-5 transition-all duration-150 hover:-translate-y-0.5 hover:border-accent hover:shadow-card"
      >
        <div>
          <div class="flex items-center justify-between mb-2">
            <span class="rounded-md bg-accent-soft/70 px-2 py-0.5 text-[11px] font-semibold text-accent border border-accent/20">
              {item.groupLabel}
            </span>
          </div>
          <h3 class="text-[15px] font-semibold text-text group-hover:text-accent transition-colors leading-snug">
            {item.title}
          </h3>
          <p class="mt-2 text-xs sm:text-[13px] text-text-soft line-clamp-2 leading-relaxed">
            {item.lead}
          </p>
        </div>

        <div class="mt-4 pt-3 border-t border-border/40 flex items-center justify-between text-xs font-semibold text-accent">
          <span>{locale === 'tr' ? 'Rehberi Aç' : 'Read Guide'}</span>
          <span class="transition-transform group-hover:translate-x-1">→</span>
        </div>
      </a>
    {/each}
  </div>
</section>
