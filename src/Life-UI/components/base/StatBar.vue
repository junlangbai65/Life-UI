<template>
  <div class="lf-stat" :class="{ 'lf-stat--compact': compact }">
    <div class="lf-stat__head">
      <span class="lf-stat__icon" :style="{ background: color }" aria-hidden="true">
        <AppIcon :name="icon" size="sm" />
      </span>
      <span class="lf-stat__label">{{ label }}</span>
      <span class="lf-stat__value">{{ displayValue }}<span v-if="suffix" class="lf-stat__suffix">{{ suffix }}</span></span>
    </div>
    <div class="lf-stat__track" role="progressbar" :aria-valuenow="value" :aria-valuemin="0" :aria-valuemax="max" :aria-label="label">
      <div class="lf-stat__fill" :style="{ width: `${pct}%`, background: color }">
        <span class="lf-stat__shine" aria-hidden="true" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import AppIcon, { type IconName } from './AppIcon.vue';

const props = withDefaults(
  defineProps<{
    label: string;
    icon: IconName;
    value: number;
    max?: number;
    color?: string;
    suffix?: string;
    compact?: boolean;
    showRaw?: boolean;
  }>(),
  { max: 100, color: 'var(--lf-strawberry)', compact: false, showRaw: false },
);

const pct = computed(() => Math.max(0, Math.min(100, (props.value / props.max) * 100)));

// 数值滚动动画
const animated = ref(props.value);
watch(
  () => props.value,
  (to, from) => {
    const start = performance.now();
    const dur = 520;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / dur);
      const eased = 1 - Math.pow(1 - t, 3);
      animated.value = Math.round((from + (to - from) * eased) * 10) / 10;
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  },
);

const displayValue = computed(() => {
  const v = Math.round(animated.value);
  return props.showRaw ? `${v}/${props.max}` : v;
});
</script>

<style scoped lang="scss">
.lf-stat__head {
  display: flex;
  align-items: center;
  gap: 7px;
  margin-bottom: 6px;
}
.lf-stat__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border: 2px solid var(--lf-ink);
  border-radius: var(--lf-radius-pill);
  color: var(--lf-ink);
}
.lf-stat__label {
  font-family: var(--lf-font-display);
  font-size: 13px;
  font-weight: 600;
  color: var(--lf-text);
}
.lf-stat__value {
  margin-left: auto;
  font-family: var(--lf-font-display);
  font-weight: 700;
  font-size: 14px;
  color: var(--lf-text);
}
.lf-stat__suffix {
  margin-left: 1px;
  font-size: 11px;
  color: var(--lf-text-secondary);
}
.lf-stat__track {
  position: relative;
  height: 13px;
  border: 2px solid var(--lf-ink);
  border-radius: var(--lf-radius-pill);
  background: var(--lf-surface-sunken);
  overflow: hidden;
}
.lf-stat__fill {
  position: relative;
  height: 100%;
  border-radius: var(--lf-radius-pill);
  transition: width 0.6s var(--lf-ease-out);
  overflow: hidden;
}
.lf-stat__shine {
  position: absolute;
  inset: 0 0 50% 0;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.55), transparent);
  border-radius: inherit;
}
.lf-stat--compact .lf-stat__head { margin-bottom: 4px; }
.lf-stat--compact .lf-stat__track { height: 10px; }
.lf-stat--compact .lf-stat__icon { width: 20px; height: 20px; }
</style>
