<script lang="ts">
  export let variant: 'primary' | 'secondary' = 'primary';
  export let href = '';
  export let disabled = false;
  export let download = false;
  export let type: 'button' | 'submit' = 'button';
  export let className = '';
  export let onclick: ((event: MouseEvent) => void) | undefined = undefined;
  const base = 'inline-flex items-center justify-center gap-2.5 min-h-12 rounded-control px-5 text-[15px] font-semibold transition-colors aria-disabled:pointer-events-none aria-disabled:opacity-50';
  const variants: Record<string, string> = {
    primary: 'bg-accent text-white shadow-[0_4px_12px_rgb(37_99_235_/_0.18)] hover:bg-accent-strong disabled:bg-border-strong disabled:text-text-soft disabled:shadow-none disabled:hover:bg-border-strong',
    secondary: 'border border-border-strong bg-surface text-text hover:border-text-muted hover:bg-bg disabled:opacity-50',
  };
</script>

{#if href}
  <a {href} download={download || null} class="{base} {variants[variant]} {className}" aria-disabled={disabled || undefined}><slot /></a>
{:else}
  <button {type} {disabled} {onclick} class="{base} {variants[variant]} {className}"><slot /></button>
{/if}
