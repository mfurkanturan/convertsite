<script lang="ts">
  import Icon from './icon.svelte';
  import { useLocale, useUi } from '../i18n/context';
  import { localePath, localeRoutes } from '../i18n/locales';
  import { track } from '../lib/analytics';
  export let compact = false;
  const locale = useLocale();
  const text = useUi().help;
  const links = useUi().links;
  const securityHref = localePath(locale, localeRoutes[locale].security);
  const privacyHref = localePath(locale, localeRoutes[locale].privacy);
  let openFaqIndex: number | null = null;
</script>

{#if compact}
  <nav class="mx-auto mt-8 flex max-w-[900px] flex-wrap gap-x-6 gap-y-2 border-t border-border pt-4 text-sm text-text-soft" aria-label={text.privacyTitle}>
    <a class="inline-flex min-h-11 items-center hover:text-accent" href={securityHref}>{text.securityLink}</a>
    <a class="inline-flex min-h-11 items-center hover:text-accent" href={privacyHref}>{text.privacyLink}</a>
  </nav>
{:else}
<section id="how" class="mt-[var(--section-space)] border-t border-border pt-[var(--section-space)]" aria-labelledby="how-title">
  <div>

    <h2 id="how-title" class="home-section-title">
      {text.titleA} {text.titleB}
    </h2>
  </div>

  <ol class="mt-7 grid gap-0 border-y border-border sm:grid-cols-2 lg:grid-cols-4">
    {#each text.steps as step, index}
      <li class="relative flex gap-4 border-b border-border py-5 last:border-b-0 sm:px-4 sm:odd:border-r lg:border-b-0 lg:border-r lg:first:pl-0 lg:last:border-r-0 lg:last:pr-0">
        <span class="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-border-strong bg-surface text-sm font-semibold text-accent-strong" aria-hidden="true">{index + 1}</span>
        <div>
          <h3 class="text-[15px] font-semibold leading-snug text-text">{step.title}</h3>
          <p class="mt-1.5 text-sm leading-relaxed text-text-soft">{step.text}</p>
        </div>
      </li>
    {/each}
  </ol>

  <div id="privacy" class="mt-5 grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-start">
    <div class="flex items-start gap-3">
      <span class="flex h-7 w-6 shrink-0 items-center justify-center text-text-muted"><Icon name="lock" size={18} /></span>
      <div>
        <h3 class="text-sm font-semibold text-text">{text.privacyTitle}</h3>
        <p class="mt-1 max-w-3xl text-sm leading-relaxed text-text-soft">{text.privacyText}</p>
      </div>
    </div>
    <nav class="flex flex-wrap gap-x-5 gap-y-1 pl-9 text-sm font-semibold lg:pl-0" aria-label={`${links.security} · ${links.privacy}`}>
      <a class="min-h-11 inline-flex items-center text-accent underline-offset-2 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent" href={securityHref}>{text.securityLink}</a>
      <a class="min-h-11 inline-flex items-center text-accent underline-offset-2 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent" href={privacyHref}>{text.privacyLink}</a>
    </nav>
  </div>
</section>

<!-- FAQ Accordion -->
<section id="faq" class="mt-[var(--section-space)] mb-10" aria-labelledby="faq-title">
  <h2 id="faq-title" class="home-section-title mb-5">
    {text.faqTitle}
  </h2>
  <div class="border-t border-border">
    {#each text.questions as question, index}
      <div class={`group border-b border-l-2 border-border ${openFaqIndex === index ? 'border-l-accent bg-accent-soft' : 'border-l-transparent'}`}>
        <button type="button" aria-expanded={openFaqIndex === index} aria-controls={`faq-answer-${index}`} onclick={() => { if (openFaqIndex !== index) track('faq_expand'); openFaqIndex = openFaqIndex === index ? null : index; }} class="flex min-h-14 w-full cursor-pointer items-center justify-between gap-4 px-4 py-4 text-left text-base font-semibold leading-relaxed text-text transition-colors hover:text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent">
          {question.title}
          <span class={`flex h-6 w-6 shrink-0 items-center justify-center transition-transform ${openFaqIndex === index ? 'rotate-180 text-accent' : 'text-text-muted'}`}>
            <Icon name="chevronDown" size={20} />
          </span>
        </button>
        <p id={`faq-answer-${index}`} hidden={openFaqIndex !== index} class="max-w-[760px] px-4 pb-5 text-sm leading-relaxed text-text-soft">{question.text}</p>
      </div>
    {/each}
  </div>
</section>

{/if}
