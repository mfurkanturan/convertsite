<script lang="ts">
  import Icon from './icon.svelte';
  export let variant: 'info' | 'success' | 'warning' | 'danger' = 'info';
  export let role = 'status';
  const iconName: Record<string, string> = { info: 'info', success: 'check', warning: 'info', danger: 'info' };
  const styles: Record<string, string> = {
    info: 'border-border bg-bg text-text-soft',
    success: 'border-success/30 bg-success-soft text-success',
    warning: 'border-warning/30 bg-warning-soft text-warning',
    danger: 'border-danger/30 bg-danger-soft text-danger',
  };
</script>

<div class="flex items-start gap-2.5 rounded-lg border px-4 py-3 text-sm leading-relaxed {styles[variant]}" {role}>
  <span class="mt-0.5 shrink-0"><Icon name={iconName[variant]} size={16} /></span>
  <div><slot /></div>
</div>
