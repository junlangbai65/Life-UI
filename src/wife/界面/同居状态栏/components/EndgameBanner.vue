<template>
  <Transition name="banner">
    <div
      v-if="world.isEndgame"
      id="wife-status-endgame-banner"
      class="endgame-banner endgame-banner--enter"
      role="status"
      aria-live="polite"
    >
      <Icon name="graduation-cap" size="sm" />
      <span>终局收束</span>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { Icon } from './icons';
import { useMvuSlices } from '../composables/useMvuSlices';

const { worldSlice: world } = useMvuSlices();
</script>

<style scoped>
.endgame-banner {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  margin-bottom: 8px;
  padding: 8px 12px;
  border-radius: var(--radius-group);
  background: color-mix(in srgb, var(--c-endgame) 18%, var(--c-surface));
  color: var(--c-endgame);
  font-size: 13px;
  font-weight: 700;
}
</style>
