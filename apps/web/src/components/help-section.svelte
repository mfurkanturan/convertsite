<script lang="ts">
  import Icon from './icon.svelte';
  import { useUi } from '../i18n/context';
  const text = useUi().help;
</script>

<!-- Security & Architecture Guarantee (Replaces the generic 3-step boilerplate) -->
<section id="how" class="mt-14 border-t border-border pt-12 max-[600px]:mt-10 max-[600px]:pt-9" aria-labelledby="how-title">
  <div>
    <span class="eyebrow">{text.eyebrow}</span>
    <h2 id="how-title" class="mt-2.5 font-display text-[clamp(22px,2.2vw,28px)] font-semibold leading-snug tracking-[-0.02em] text-text">
      {text.titleA} <span class="text-accent">{text.titleB}</span>
    </h2>
  </div>

  <div class="mt-8 grid gap-5 sm:grid-cols-3">
    {#each text.steps as step, index}
      <div class="flex flex-col rounded-card border border-border/80 bg-surface p-5 transition-all hover:border-accent/40 hover:shadow-xs">
        <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-soft text-accent mb-3.5">
          {#if index === 0}
            <Icon name="shield" size={20} />
          {:else if index === 1}
            <Icon name="bolt" size={20} />
          {:else}
            <Icon name="sparkles" size={20} />
          {/if}
        </div>
        <h3 class="text-[15px] font-semibold text-text">{step.title}</h3>
        <p class="mt-1.5 text-xs sm:text-[13px] leading-relaxed text-text-soft">{step.text}</p>
      </div>
    {/each}
  </div>
</section>

<!-- Direct Privacy Statement -->
<section id="privacy" class="mt-10 flex items-start gap-4 rounded-panel border border-accent/20 bg-accent-soft/40 p-5 sm:p-6" aria-labelledby="privacy-title">
  <span class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-surface text-accent shadow-xs border border-accent/15">
    <Icon name="lock" size={20} />
  </span>
  <div>
    <h2 id="privacy-title" class="text-sm sm:text-base font-semibold text-text">{text.privacyTitle}</h2>
    <p class="mt-1 text-xs sm:text-[13px] leading-relaxed text-text-soft">{text.privacyText}</p>
  </div>
</section>

<!-- FAQ Accordion -->
<section id="faq" class="mt-12 mb-12 max-[600px]:mt-9" aria-labelledby="faq-title">
  <h2 id="faq-title" class="mb-4 font-display text-xl sm:text-2xl font-semibold tracking-[-0.01em] text-text">
    {text.faqTitle}
  </h2>
  <div class="border-t border-border">
    {#each text.questions as question}
      <details class="group border-b border-border">
        <summary class="flex min-h-14 cursor-pointer list-none items-center justify-between gap-3 py-3.5 text-[15px] font-medium text-text transition-colors hover:text-accent [&::-webkit-details-marker]:hidden">
          {question.title}
          <span class="shrink-0 text-text-muted transition-transform group-open:rotate-180">
            <Icon name="chevronDown" size={18} />
          </span>
        </summary>
        <p class="max-w-[760px] pb-5 pr-8 text-xs sm:text-sm leading-relaxed text-text-soft">
          {question.text}
        </p>
      </details>
    {/each}
  </div>
</section>
