<template>
  <button
    id="inf-btn-theme-toggle"
    type="button"
    class="inf-theme-toggle"
    :aria-label="isDark ? '切换浅色模式' : '切换深色模式'"
    :title="isDark ? '切换浅色' : '切换深色'"
    @click="game.toggleTheme()"
  >
    <InfIcon :name="isDark ? 'sun' : 'moon'" size="md" />
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useGameStore } from '../../stores/useGameStore';
import InfIcon from './InfIcon.vue';

const game = useGameStore();
const isDark = computed(() => game.uiSettings.theme === 'dark');
</script>

<style scoped lang="scss">
.inf-theme-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 38px;
  height: 38px;
  color: var(--inf-text-secondary);
  background: var(--inf-chip-bg, var(--inf-accent-soft));
  border: 1px solid var(--inf-chip-border, color-mix(in srgb, var(--inf-accent) 15%, transparent));
  border-radius: var(--inf-radius-sm);
  cursor: pointer;
  transition:
    color var(--inf-transition),
    background var(--inf-transition),
    border-color var(--inf-transition),
    box-shadow var(--inf-transition),
    transform var(--inf-transition-fast);

  &:hover {
    color: var(--inf-accent);
    background: color-mix(in srgb, var(--inf-accent) 18%, transparent);
    border-color: color-mix(in srgb, var(--inf-accent) 35%, transparent);
    box-shadow: var(--inf-shadow-sm);
  }

  &:active {
    transform: scale(0.96);
  }

  &:focus-visible {
    outline: 2px solid var(--inf-accent);
    outline-offset: 2px;
  }
}
</style>
