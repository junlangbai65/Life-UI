<template>
  <svg
    class="inf-arc-ring"
    :width="size"
    :height="size"
    :viewBox="`0 0 ${size} ${size}`"
    role="img"
    :aria-label="`${label} ${clamped}%`"
  >
    <circle
      class="inf-arc-ring__track"
      :cx="center"
      :cy="center"
      :r="radius"
      fill="none"
      :stroke-width="stroke"
    />
    <circle
      class="inf-arc-ring__fill"
      :class="`inf-arc-ring__fill--${variant}`"
      :cx="center"
      :cy="center"
      :r="radius"
      fill="none"
      :stroke-width="stroke"
      :stroke-dasharray="circumference"
      :stroke-dashoffset="dashOffset"
      stroke-linecap="round"
      transform-origin="center"
      :transform="`rotate(-90 ${center} ${center})`"
    />
  </svg>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = withDefaults(
  defineProps<{
    percent: number;
    label?: string;
    size?: number;
    stroke?: number;
    variant?: 'infection' | 'desire';
  }>(),
  { label: '', size: 52, stroke: 4, variant: 'infection' },
);

const clamped = computed(() => Math.min(100, Math.max(0, Math.round(props.percent))));
const center = computed(() => props.size / 2);
const radius = computed(() => (props.size - props.stroke) / 2 - 1);
const circumference = computed(() => 2 * Math.PI * radius.value);
const dashOffset = computed(
  () => circumference.value - (clamped.value / 100) * circumference.value,
);
</script>

<style scoped lang="scss">
.inf-arc-ring__track {
  stroke: var(--inf-border);
  opacity: 0.8;
}

.inf-arc-ring__fill {
  transition: stroke-dashoffset var(--inf-transition-slow);

  &--infection {
    stroke: var(--inf-tier-accent-strong);
    filter: drop-shadow(0 0 4px color-mix(in srgb, var(--inf-tier-accent) 45%, transparent));
  }

  &--desire {
    stroke: var(--inf-accent-bright);
    filter: drop-shadow(0 0 4px var(--inf-accent-glow));
  }
}
</style>
