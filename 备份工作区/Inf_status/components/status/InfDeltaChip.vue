<template>
  <span
    v-if="delta !== 0"
    class="inf-delta-chip inf-mono"
    :class="[
      directionClass,
      { 'inf-delta-pop': animate },
      variantClass,
    ]"
    :aria-label="`较上一楼层${formatted}`"
  >
    {{ formatted }}
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { formatDelta } from '../../utils/mvuDisplay';

const props = withDefaults(
  defineProps<{
    delta?: number;
    animate?: boolean;
    variant?: 'default' | 'desire';
  }>(),
  { delta: 0, animate: true, variant: 'default' },
);

const formatted = computed(() => formatDelta(props.delta ?? 0));

const directionClass = computed(() => {
  if ((props.delta ?? 0) > 0) return 'inf-delta-chip--up';
  if ((props.delta ?? 0) < 0) return 'inf-delta-chip--down';
  return '';
});

const variantClass = computed(() =>
  props.variant === 'desire' ? 'inf-delta-chip--desire' : '',
);
</script>

<style scoped lang="scss">
.inf-delta-chip {
  display: inline-flex;
  align-items: center;
  padding: 0.1rem 0.35rem;
  font-size: 0.625rem;
  font-weight: 600;
  letter-spacing: 0.02em;
  border-radius: 999px;
  line-height: 1.2;
}

.inf-delta-chip--up {
  color: var(--inf-delta-up);
  background: color-mix(in srgb, var(--inf-delta-up) 12%, transparent);
}

.inf-delta-chip--down {
  color: var(--inf-delta-down);
  background: color-mix(in srgb, var(--inf-delta-down) 12%, transparent);
}

.inf-delta-chip--desire.inf-delta-chip--up {
  color: var(--inf-desire-accent-strong);
  background: color-mix(in srgb, var(--inf-desire-accent) 16%, transparent);
}

.inf-delta-chip--desire.inf-delta-chip--down {
  color: color-mix(in srgb, var(--inf-desire-accent) 80%, var(--inf-text-muted));
  background: color-mix(in srgb, var(--inf-desire-accent) 10%, transparent);
}
</style>
