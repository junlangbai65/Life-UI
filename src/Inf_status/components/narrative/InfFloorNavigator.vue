<template>
  <div class="inf-floor-nav" role="toolbar" aria-label="切换 AI 楼层">
    <button
      id="inf-btn-floor-prev"
      type="button"
      class="inf-floor-nav__btn"
      :class="{ 'is-disabled': !canPrev }"
      :disabled="!canPrev"
      aria-label="上一楼层（左方向键）"
      title="上一楼层 (←)"
      @click="game.navigateFloorPrev()"
    >
      <InfIcon name="chevron-left" size="sm" />
    </button>
    <button
      id="inf-btn-floor-next"
      type="button"
      class="inf-floor-nav__btn"
      :class="{ 'is-disabled': !canNext }"
      :disabled="!canNext"
      aria-label="下一楼层（右方向键）"
      title="下一楼层 (→)"
      @click="game.navigateFloorNext()"
    >
      <InfIcon name="chevron" size="sm" />
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useGameStore } from '../../stores/useGameStore';
import InfIcon from '../ui/InfIcon.vue';

const game = useGameStore();
const canPrev = computed(() => game.floorNavCanPrev);
const canNext = computed(() => game.floorNavCanNext);
</script>

<style scoped lang="scss">
.inf-floor-nav {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  flex-shrink: 0;
}

.inf-floor-nav__btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  padding: 0;
  border: 1px solid var(--inf-border);
  border-radius: var(--inf-radius-xs);
  cursor: pointer;
  color: var(--inf-text-secondary);
  background: color-mix(in srgb, var(--inf-bg-elevated) 88%, transparent);
  transition:
    color var(--inf-transition-fast),
    border-color var(--inf-transition-fast),
    background var(--inf-transition-fast),
    transform var(--inf-transition-fast);

  &:hover:not(:disabled) {
    color: var(--inf-accent);
    border-color: color-mix(in srgb, var(--inf-accent) 35%, var(--inf-border));
    background: var(--inf-accent-soft);
  }

  &:active:not(:disabled) {
    transform: translateY(1px);
  }

  &:focus-visible {
    outline: none;
    box-shadow: 0 0 0 3px var(--inf-accent-soft);
  }

  &.is-disabled,
  &:disabled {
    cursor: default;
    color: var(--inf-text-muted);
    opacity: 0.45;
    border-color: var(--inf-border);
    background: color-mix(in srgb, var(--inf-bg-elevated) 55%, transparent);
  }
}
</style>
