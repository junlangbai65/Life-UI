<template>
  <section id="inf-reading-panel" class="inf-reading-panel" aria-label="叙事正文">
    <header class="inf-reading-panel__header">
      <InfFloorNavigator />
      <div v-if="hasText" class="inf-reading-panel__toolbar" role="toolbar" aria-label="打字机控制">
        <span class="inf-reading-panel__progress-label inf-mono" aria-hidden="true">{{ readProgress }}%</span>
        <button id="inf-btn-skip-typewriter" type="button" class="inf-btn inf-btn--ghost" @click="skipToEnd">
          <InfIcon name="forward" size="sm" />
          快进
        </button>
        <button id="inf-btn-replay-typewriter" type="button" class="inf-btn inf-btn--ghost" @click="replay">
          <InfIcon name="replay" size="sm" />
          重播
        </button>
      </div>
    </header>

    <div
      v-if="hasText"
      id="inf-reading-progress"
      class="inf-reading-panel__progress"
      role="progressbar"
      :aria-valuenow="readProgress"
      aria-valuemin="0"
      aria-valuemax="100"
      :aria-label="`阅读进度 ${readProgress}%`"
    >
      <div class="inf-reading-panel__progress-fill" :style="{ width: `${readProgress}%` }" />
    </div>

    <div v-if="ui.isGenerating" class="inf-reading-panel__generating" aria-busy="true" aria-label="生成中">
      <div class="inf-shimmer inf-reading-panel__skeleton" />
      <div class="inf-shimmer inf-reading-panel__skeleton inf-reading-panel__skeleton--mid" />
      <div class="inf-shimmer inf-reading-panel__skeleton inf-reading-panel__skeleton--short" />
    </div>

    <div v-else-if="!hasText" class="inf-reading-panel__empty" role="status">
      <div class="inf-reading-panel__empty-icon" aria-hidden="true">
        <InfIcon name="narrative" size="lg" />
      </div>
      <p class="inf-text-name inf-reading-panel__empty-title">信道静默</p>
      <p class="inf-caption">assistant 消息中的 maintext 标签将在此逐字呈现</p>
    </div>

    <InfReadingCanvas v-else @scroll="readProgress = $event">
      <span class="visually-hidden" role="status">{{ statusText }}</span>
      <InfMaintextRenderer
        :blocks="visibleBlocks"
        :show-drop-cap="showDropCap"
        :show-caret="showCaret"
      />
    </InfReadingCanvas>
  </section>
</template>

<script setup lang="ts">
import { gsap } from 'gsap';
import { computed, onBeforeUnmount, ref, watch } from 'vue';
import { useReducedMotion } from '../../composables/useReducedMotion';
import { useNarrativeStore } from '../../stores/useNarrativeStore';
import { useUiStore } from '../../stores/useUiStore';
import { graphemeLength, parseMaintextBlocksPartial } from '../../utils/maintextLayout';
import InfFloorNavigator from './InfFloorNavigator.vue';
import InfMaintextRenderer from './InfMaintextRenderer.vue';
import InfReadingCanvas from './InfReadingCanvas.vue';
import InfIcon from '../ui/InfIcon.vue';

const narrative = useNarrativeStore();
const ui = useUiStore();
const { wantsReducedMotion } = useReducedMotion();

const displayedLength = ref(0);
const readProgress = ref(0);
let typeTween: gsap.core.Tween | null = null;

const fullText = computed(() => narrative.maintext);
const hasText = computed(() => fullText.value.trim().length > 0);

const typewriterComplete = computed(
  () => hasText.value && displayedLength.value >= graphemeLength(fullText.value),
);

const visibleBlocks = computed(() =>
  parseMaintextBlocksPartial(fullText.value, displayedLength.value),
);

const showCaret = computed(
  () => hasText.value && !wantsReducedMotion.value && !typewriterComplete.value && !ui.isGenerating,
);

const showDropCap = computed(() => hasText.value && !wantsReducedMotion.value);

const statusText = computed(() => (ui.isGenerating ? '生成中' : ''));

/** 慢速逐字打字机：毫秒/字（grapheme），与 tokens 中 --inf-typewriter-* 保持一致 */
const TYPEWRITER_MS_PER_CHAR = 0.048;
const TYPEWRITER_MAX_DURATION_SEC = 22;

function typewriterDurationSec(graphemeCount: number): number {
  if (graphemeCount <= 0) return 0;
  return Math.min(Math.max(graphemeCount * TYPEWRITER_MS_PER_CHAR, 0.6), TYPEWRITER_MAX_DURATION_SEC);
}

function killTween() {
  typeTween?.kill();
  typeTween = null;
}

function playTypewriter() {
  killTween();
  const text = fullText.value;
  readProgress.value = 0;
  const total = graphemeLength(text);

  if (!text || wantsReducedMotion.value) {
    displayedLength.value = total;
    return;
  }

  displayedLength.value = 0;
  const proxy = { progress: 0 };
  typeTween = gsap.to(proxy, {
    progress: total,
    duration: typewriterDurationSec(total),
    ease: 'none',
    onUpdate: () => {
      displayedLength.value = Math.floor(proxy.progress);
    },
    onComplete: () => {
      displayedLength.value = total;
    },
  });
}

function skipToEnd() {
  killTween();
  displayedLength.value = graphemeLength(fullText.value);
}

function replay() {
  playTypewriter();
}

watch(fullText, () => playTypewriter(), { immediate: true });

onBeforeUnmount(killTween);
</script>

<style scoped lang="scss">
.inf-reading-panel {
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 0;
}

.inf-reading-panel__header {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  margin-bottom: 0.625rem;
}

.inf-reading-panel__toolbar {
  display: flex;
  align-items: center;
  gap: 0.35rem;
}

.inf-reading-panel__progress-label {
  min-width: 2.5rem;
  font-size: 0.68rem;
  font-weight: 600;
  color: var(--inf-text-secondary);
  text-align: right;
}

.inf-reading-panel__progress {
  height: 2px;
  margin-bottom: 0.75rem;
  background: var(--inf-border);
  border-radius: 999px;
  overflow: hidden;
}

.inf-reading-panel__progress-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--inf-accent), var(--inf-tier-accent-strong));
  border-radius: inherit;
  transition: width var(--inf-transition-fast);
}

.inf-reading-panel__empty {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.35rem;
  padding: 2rem 1rem;
  text-align: center;
}

.inf-reading-panel__empty-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 52px;
  height: 52px;
  margin-bottom: 0.35rem;
  color: var(--inf-accent);
  background: var(--inf-accent-soft);
  border-radius: 50%;
  border: 1px solid color-mix(in srgb, var(--inf-accent) 20%, transparent);
}

.inf-reading-panel__empty-title {
  margin: 0;
  font-size: 1.125rem;
  color: var(--inf-text-secondary);
  letter-spacing: 0.08em;
}

.inf-reading-panel__generating {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 0.75rem 0;
}

.inf-reading-panel__skeleton {
  height: 14px;
  border-radius: 6px;

  &--mid {
    width: 88%;
  }

  &--short {
    width: 62%;
  }
}
</style>
