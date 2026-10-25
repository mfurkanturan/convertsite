<script lang="ts">
  export let variant: 'primary' | 'secondary' = 'primary';
  export let href = '';
  export let disabled = false;
  export let download = false;
  export let type: 'button' | 'submit' = 'button';
  export let className = '';
  export let id = '';
  export let onclick: ((event: MouseEvent) => void) | undefined = undefined;
  const base = 'ui-button inline-flex items-center justify-center gap-2.5 min-h-12 rounded-control px-5 text-[15px] font-semibold transition-colors aria-disabled:pointer-events-none aria-disabled:bg-bg aria-disabled:text-text-muted';
  const variants: Record<string, string> = {
    primary: 'bg-accent text-white hover:bg-accent-strong disabled:bg-border-strong disabled:text-text-soft disabled:shadow-none disabled:hover:bg-border-strong',
    secondary: 'border border-border-strong bg-surface text-text hover:border-text-muted hover:bg-bg disabled:bg-bg disabled:text-text-muted disabled:border-border',
  };
</script>

{#if href}
  <a href={disabled ? undefined : href} tabindex={disabled ? -1 : undefined} onclick={(event) => { if (disabled) event.preventDefault(); else onclick?.(event); }} id={id || undefined} download={download || null} class="{base} {variants[variant]} {className}" aria-disabled={disabled || undefined}><slot /></a>
{:else}
  <button {type} {disabled} {onclick} id={id || undefined} class="{base} {variants[variant]} {className}"><slot /></button>
{/if}
