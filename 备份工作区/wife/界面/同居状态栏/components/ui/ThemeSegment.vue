<template>
  <div class="theme-segment" role="group" aria-label="外观主题">
    <span class="theme-segment__glider" :style="gliderStyle" aria-hidden="true" />
    <button
      v-for="opt in options"
      :key="opt.value"
      type="button"
      class="theme-segment__btn"
      :aria-label="opt.label"
      :aria-pressed="theme.settings.theme === opt.value"
      @click="theme.setTheme(opt.value)"
    >
      <Icon :name="opt.icon" size="sm" />
    </button>
  </div>
</template>

<script setup lang="ts">
import { Icon } from '../icons';
import type { IconName } from '../icons';
import { useThemeStore } from '../../stores/themeStore';

const theme = useThemeStore();

const options: { value: 'light' | 'dark' | 'system'; icon: IconName; label: string }[] = [
  { value: 'light', icon: 'sun', label: '浅色主题' },
  { value: 'dark', icon: 'moon', label: '深色主题' },
  { value: 'system', icon: 'monitor', label: '跟随系统主题' },
];

const activeIndex = computed(() => {
  const idx = options.findIndex(o => o.value === theme.settings.theme);
  return idx >= 0 ? idx : 2;
});

const gliderStyle = computed(() => ({
  transform: `translateX(${activeIndex.value * 100}%)`,
}));
</script>

<style scoped>
.theme-segment {
  position: relative;
  display: inline-flex;
  padding: 2px;
  border-radius: 8px;
  background: var(--c-fill);
  gap: 0;
  flex-shrink: 0;
}

.theme-segment__glider {
  position: absolute;
  top: 2px;
  left: 2px;
  width: calc((100% - 4px) / 3);
  height: calc(100% - 4px);
  border-radius: 6px;
  background: var(--c-surface-elevated);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.08);
  transition: transform var(--duration-fast) var(--ease-ios);
  pointer-events: none;
  z-index: 0;
}

.theme-segment__btn {
  position: relative;
  z-index: 1;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 32px;
  min-height: 28px;
  border: none;
  background: transparent;
  color: var(--c-label-secondary);
  cursor: pointer;
  border-radius: 6px;
  transition: color var(--duration-fast) var(--ease-ios);
}

.theme-segment__btn[aria-pressed='true'] {
  color: var(--c-label);
}

.theme-segment__btn:focus-visible {
  outline: none;
  box-shadow: var(--focus-ring);
}

.theme-segment__btn:active {
  opacity: 0.75;
}
</style>
