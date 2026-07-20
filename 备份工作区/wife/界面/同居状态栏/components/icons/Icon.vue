<template>
  <svg
    class="wife-icon"
    :class="[`wife-icon--${size}`, props.class]"
    :width="pixelSize"
    :height="pixelSize"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
  >
    <path v-for="(d, i) in normalizedPaths" :key="i" :d="d" />
  </svg>
</template>

<script setup lang="ts">
import { ICON_PATHS, type IconName } from './paths';

const props = withDefaults(
  defineProps<{
    name: IconName;
    size?: 'sm' | 'md';
    class?: string;
  }>(),
  { size: 'sm' },
);

const pixelSize = computed(() => (props.size === 'md' ? 20 : 16));

const normalizedPaths = computed(() => {
  const raw = ICON_PATHS[props.name];
  return Array.isArray(raw) ? raw : [raw];
});
</script>

<style scoped>
.wife-icon {
  flex-shrink: 0;
  display: block;
}

.wife-icon--sm {
  width: var(--icon-size-sm);
  height: var(--icon-size-sm);
}

.wife-icon--md {
  width: var(--icon-size-md);
  height: var(--icon-size-md);
}
</style>
