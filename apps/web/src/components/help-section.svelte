<script lang="ts">
  import Icon from './icon.svelte';
  import { useUi } from '../i18n/context';
  const text = useUi().help;
</script>

<section id="how" class="mt-14 grid gap-8 border-t border-border pt-12 md:grid-cols-[1.1fr_2fr] max-[600px]:mt-10 max-[600px]:gap-6 max-[600px]:pt-9" aria-labelledby="how-title">
  <div><span class="eyebrow">{text.eyebrow}</span><h2 id="how-title" class="mt-2.5 font-display text-2xl font-semibold leading-snug tracking-[-0.02em] text-text">{text.titleA}<br class="max-md:hidden" /> {text.titleB}</h2></div>
  <ol class="grid gap-6 sm:grid-cols-3 max-sm:gap-4">
    {#each text.steps as step, index}
      <li class="flex gap-3 sm:flex-col">
        <span class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent-soft text-sm font-semibold text-accent-strong">{index + 1}</span>
        <div><h3 class="text-[15px] font-semibold text-text">{step.title}</h3><p class="mt-1 text-sm leading-relaxed text-text-soft">{step.text}</p></div>
      </li>
    {/each}
  </ol>
</section>

<section id="privacy" class="mt-12 flex items-start gap-4 rounded-panel border border-accent/15 bg-accent-soft/50 p-6 max-[600px]:mt-9 max-[600px]:p-5" aria-labelledby="privacy-title">
  <span class="flex h-11 w-11 shrink-0 items-center justify-center rounded-card bg-surface text-accent ring-1 ring-accent/15"><Icon name="shield" size={24} /></span>
  <div><h2 id="privacy-title" class="text-base font-semibold text-text">{text.privacyTitle}</h2><p class="mt-1 text-sm leading-relaxed text-text-soft">{text.privacyText}</p></div>
</section>

<section id="faq" class="mt-12 mb-12 max-[600px]:mt-9" aria-labelledby="faq-title">
  <h2 id="faq-title" class="mb-3 font-display text-xl font-semibold tracking-[-0.01em] text-text">{text.faqTitle}</h2>
  <div class="border-t border-border">
    {#each text.questions as question}
      <details class="group border-b border-border">
        <summary class="flex min-h-14 cursor-pointer list-none items-center justify-between gap-3 py-3 text-[15px] font-medium text-text transition-colors hover:text-accent [&::-webkit-details-marker]:hidden">{question.title}<span class="shrink-0 text-text-muted transition-transform group-open:rotate-180"><Icon name="chevronDown" size={18} /></span></summary>
        <p class="max-w-[760px] pb-5 pr-8 text-sm leading-relaxed text-text-soft">{question.text}</p>
      </details>
    {/each}
  </div>
</section>
