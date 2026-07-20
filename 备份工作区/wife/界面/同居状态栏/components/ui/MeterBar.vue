<template>
  <div
    class="meter-bar"
    :class="[
      `meter-bar--${height}`,
      { 'meter-bar--glow': glow && glowActive },
    ]"
    role="progressbar"
    :aria-valuenow="Math.round(clampedValue)"
    aria-valuemin="0"
    aria-valuemax="100"
  >
    <div class="meter-bar__track">
      <div
        class="meter-bar__fill"
        :style="{
          width: `${displayPercent}%`,
          background: color,
        }"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAnimatedPercent } from '../../composables/useValueAnimation';

const props = withDefaults(
  defineProps<{
    value: number;
    color?: string;
    height?: 'default' | 'thin';
    glow?: boolean;
  }>(),
  {
    color: 'var(--c-accent-affection)',
    height: 'default',
    glow: false,
  },
);

const clampedValue = computed(() => Math.min(100, Math.max(0, props.value)));

const displayPercent = useAnimatedPercent(() => clampedValue.value);

const glowActive = ref(false);
let glowTimer: ReturnType<typeof setTimeout> | null = null;

watch(clampedValue, (next, prev) => {
  if (!props.glow || next === prev) return;
  glowActive.value = true;
  if (glowTimer) clearTimeout(glowTimer);
  glowTimer = setTimeout(() => {
    glowActive.value = false;
  }, 300);
});
</script>

<style scoped>
.meter-bar__track {
  height: var(--meter-height);
  border-radius: calc(var(--meter-height) / 2);
  background: var(--c-fill);
  overflow: hidden;
}

.meter-bar--thin .meter-bar__track {
  height: var(--meter-height-thin);
  border-radius: calc(var(--meter-height-thin) / 2);
}

.meter-bar__fill {
  height: 100%;
  border-radius: inherit;
  transition: width var(--duration-meter) var(--ease-ios);
}

.meter-bar--glow .meter-bar__fill {
  box-shadow: 0 0 8px color-mix(in srgb, var(--c-accent-wallet) 55%, transparent);
}
</style>
