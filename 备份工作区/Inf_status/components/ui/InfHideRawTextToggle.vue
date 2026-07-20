<template>
  <button
    id="inf-btn-hide-raw-text"
    type="button"
    class="inf-hide-raw-toggle"
    :class="{ 'inf-hide-raw-toggle--active': hidden }"
    :aria-label="hidden ? '显示酒馆原始文本' : '隐藏酒馆原始文本'"
    :title="hidden ? '显示原始文本' : '隐藏原始文本'"
    :aria-pressed="hidden"
    @click="game.toggleHideChatRawText()"
  >
    <InfIcon :name="hidden ? 'eye-off' : 'eye'" size="md" />
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useGameStore } from '../../stores/useGameStore';
import InfIcon from './InfIcon.vue';

const game = useGameStore();
const hidden = computed(() => game.uiSettings.hideChatRawText);
</script>

<style scoped lang="scss">
.inf-hide-raw-toggle {
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

  &--active {
    color: var(--inf-accent);
    background: color-mix(in srgb, var(--inf-accent) 14%, transparent);
    border-color: color-mix(in srgb, var(--inf-accent) 32%, transparent);
  }

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
