<template>
  <span class="lf-tag" :class="[`lf-tag--${tone}`, `lf-tag--${size}`, { 'lf-tag--sticker': sticker }]" :style="rotateStyle">
    <AppIcon v-if="icon" :name="icon" size="xs" />
    <span class="lf-tag__text"><slot /></span>
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import AppIcon, { type IconName } from './AppIcon.vue';

const props = withDefaults(
  defineProps<{
    tone?: 'neutral' | 'strawberry' | 'mint' | 'sky' | 'butter' | 'lavender' | 'peach';
    icon?: IconName;
    sticker?: boolean;
    rotate?: number;
    size?: 'xs' | 'sm';
  }>(),
  { tone: 'neutral', sticker: false, rotate: 0, size: 'sm' },
);

const rotateStyle = computed(() => (props.rotate ? { transform: `rotate(${props.rotate}deg)` } : {}));
</script>

<style scoped lang="scss">
.lf-tag {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  border: 2px solid var(--lf-ink);
  border-radius: var(--lf-radius-pill);
  background: var(--lf-surface);
  color: var(--lf-text);
  font-family: var(--lf-font-display);
  font-weight: 600;
  white-space: nowrap;
  line-height: 1.1;
}
.lf-tag--sm { padding: 4px 11px; font-size: 12px; }
.lf-tag--xs { padding: 2px 8px; font-size: 10px; }
.lf-tag--sticker {
  box-shadow: var(--lf-shadow-chunky-sm);
}
.lf-tag--neutral { background: var(--lf-surface); }
.lf-tag--strawberry { background: #fde4ee; }
.lf-tag--mint { background: #e2f7ee; }
.lf-tag--sky { background: #e3f3fd; }
.lf-tag--butter { background: #fff3d6; }
.lf-tag--lavender { background: #efe9fb; }
.lf-tag--peach { background: #ffe8da; }
.lf-tag__text {
  display: inline-block;
}
</style>
