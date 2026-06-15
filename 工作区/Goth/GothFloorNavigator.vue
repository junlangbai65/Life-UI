<template>
  <div class="goth-floor-nav" role="toolbar" aria-label="切换 AI 楼层">
    <button
      type="button"
      class="goth-floor-nav__btn"
      :class="{ 'is-disabled': !canPrev }"
      :disabled="!canPrev"
      aria-label="上一楼层 AI"
      title="上一楼层"
      @click="onPrev"
    >
      <svg class="goth-floor-nav__svg" viewBox="0 0 24 24" aria-hidden="true">
        <path
          class="goth-floor-nav__arrow"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="square"
          stroke-linejoin="miter"
          vector-effect="non-scaling-stroke"
          d="M14 5 L7 12 L14 19"
        />
      </svg>
    </button>
    <button
      type="button"
      class="goth-floor-nav__btn"
      :class="{ 'is-disabled': !canNext }"
      :disabled="!canNext"
      aria-label="下一楼层 AI"
      title="下一楼层"
      @click="onNext"
    >
      <svg class="goth-floor-nav__svg" viewBox="0 0 24 24" aria-hidden="true">
        <path
          class="goth-floor-nav__arrow"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="square"
          stroke-linejoin="miter"
          vector-effect="non-scaling-stroke"
          d="M10 5 L17 12 L10 19"
        />
      </svg>
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed, inject } from 'vue';
import { gothStateKey } from './gothStateContext';

const state = inject(gothStateKey);
if (!state) throw new Error('未找到 Goth 状态上下文。');

const canPrev = computed(() => state.floorNavCanPrev.value);
const canNext = computed(() => state.floorNavCanNext.value);

function onPrev() {
  state.navigateFloorPrev();
}

function onNext() {
  state.navigateFloorNext();
}
</script>

<style scoped>
.goth-floor-nav {
  display: inline-flex;
  align-items: center;
  gap: 0.22rem;
  flex-shrink: 0;
}

.goth-floor-nav__btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  padding: 0;
  margin: 0;
  border: none;
  border-radius: 3px;
  cursor: pointer;
  color: rgba(172, 158, 132, 0.88);
  background: linear-gradient(180deg, rgba(40, 36, 32, 0.88) 0%, rgba(22, 20, 18, 0.96) 100%);
  box-shadow:
    inset 0 2px 8px rgba(5, 4, 3, 0.42),
    inset 0 1px 0 rgba(72, 66, 58, 0.1),
    inset 0 0 0 1px rgba(196, 182, 150, 0.06),
    0 1px 0 rgba(42, 38, 34, 0.45);
  transition:
    color var(--g-motion-fast, 0.18s) ease,
    box-shadow var(--g-motion-fast, 0.18s) ease,
    transform 0.1s ease;
}

.goth-floor-nav__btn:hover:not(:disabled) {
  color: rgba(212, 198, 168, 0.95);
  box-shadow:
    inset 0 2px 10px rgba(5, 4, 3, 0.48),
    inset 0 1px 0 rgba(92, 84, 72, 0.12),
    inset 0 0 0 1px rgba(196, 182, 150, 0.1),
    0 1px 0 rgba(38, 34, 30, 0.4);
}

.goth-floor-nav__btn:active:not(:disabled) {
  transform: translateY(1px);
}

.goth-floor-nav__btn:focus-visible {
  outline: none;
  box-shadow:
    inset 0 2px 8px rgba(5, 4, 3, 0.42),
    0 0 0 2px rgba(157, 136, 104, 0.45);
}

.goth-floor-nav__btn.is-disabled,
.goth-floor-nav__btn:disabled {
  cursor: default;
  color: rgba(88, 82, 74, 0.45);
  opacity: 0.72;
  box-shadow:
    inset 0 2px 10px rgba(5, 4, 3, 0.52),
    inset 0 1px 0 rgba(48, 44, 40, 0.06),
    0 1px 0 rgba(32, 28, 26, 0.35);
}

.goth-floor-nav__svg {
  width: 22px;
  height: 22px;
  display: block;
}

.goth-floor-nav__arrow {
  stroke: currentColor;
}
</style>
