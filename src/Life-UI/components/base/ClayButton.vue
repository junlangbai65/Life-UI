<template>
  <button
    :id="id"
    type="button"
    class="lf-btn"
    :class="[`lf-btn--${variant}`, `lf-btn--${size}`, { 'lf-btn--block': block, 'lf-btn--icon': iconOnly, 'lf-btn--loading': loading }]"
    :disabled="disabled || loading"
    :aria-label="ariaLabel"
    @click="$emit('click', $event)"
  >
    <span v-if="loading" class="lf-btn__spinner" aria-hidden="true">
      <AppIcon name="spark" size="sm" />
    </span>
    <slot v-else name="icon" />
    <span v-if="!iconOnly" class="lf-btn__label"><slot /></span>
  </button>
</template>

<script setup lang="ts">
import AppIcon from './AppIcon.vue';

withDefaults(
  defineProps<{
    id?: string;
    variant?: 'primary' | 'secondary' | 'ghost' | 'mint' | 'sky' | 'lavender' | 'danger';
    size?: 'sm' | 'md' | 'lg';
    block?: boolean;
    iconOnly?: boolean;
    disabled?: boolean;
    loading?: boolean;
    ariaLabel?: string;
  }>(),
  { variant: 'primary', size: 'md', block: false, iconOnly: false, disabled: false, loading: false },
);

defineEmits<{ (e: 'click', ev: MouseEvent): void }>();
</script>

<style scoped lang="scss">
.lf-btn {
  --lf-btn-bg: var(--lf-peach);
  --lf-btn-fg: var(--lf-ink);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border: var(--lf-outline) solid var(--lf-ink);
  border-radius: var(--lf-radius-pill);
  background: var(--lf-btn-bg);
  color: var(--lf-btn-fg);
  font-family: var(--lf-font-display);
  font-weight: 600;
  line-height: 1;
  box-shadow: var(--lf-shadow-chunky-sm);
  transition:
    transform var(--lf-dur) var(--lf-ease-bounce),
    box-shadow var(--lf-dur) var(--lf-ease-out),
    filter var(--lf-dur) var(--lf-ease-soft);
}

.lf-btn:hover:not(:disabled) {
  transform: translate(-1.5px, -1.5px);
  box-shadow: var(--lf-shadow-chunky);
  filter: saturate(1.08);
}
.lf-btn:active:not(:disabled) {
  transform: translate(1.5px, 1.5px);
  box-shadow: 1px 1px 0 var(--lf-ink-shadow);
}
.lf-btn:disabled {
  opacity: 0.55;
  cursor: not-allowed;
  box-shadow: var(--lf-shadow-chunky-sm);
}

.lf-btn--sm { padding: 7px 14px; font-size: 13px; }
.lf-btn--md { padding: 10px 18px; font-size: 15px; }
.lf-btn--lg { padding: 14px 24px; font-size: 17px; }

.lf-btn--icon { padding: 0; aspect-ratio: 1; }
.lf-btn--icon.lf-btn--sm { width: 34px; }
.lf-btn--icon.lf-btn--md { width: 42px; }
.lf-btn--icon.lf-btn--lg { width: 52px; }

.lf-btn--block { display: flex; width: 100%; }

.lf-btn--primary { --lf-btn-bg: var(--lf-peach); }
.lf-btn--secondary { --lf-btn-bg: var(--lf-strawberry); }
.lf-btn--mint { --lf-btn-bg: var(--lf-mint); }
.lf-btn--sky { --lf-btn-bg: var(--lf-sky); }
.lf-btn--lavender { --lf-btn-bg: var(--lf-lavender); }
.lf-btn--danger { --lf-btn-bg: var(--lf-error); --lf-btn-fg: #fff; }
.lf-btn--ghost {
  --lf-btn-bg: transparent;
  box-shadow: none;
}
.lf-btn--ghost:hover:not(:disabled) {
  --lf-btn-bg: var(--lf-surface-soft);
  box-shadow: var(--lf-shadow-chunky-sm);
}

.lf-btn__label {
  display: inline-block;
}

.lf-btn__spinner {
  display: inline-flex;
  animation: lf-spin 0.9s linear infinite;
}
</style>
