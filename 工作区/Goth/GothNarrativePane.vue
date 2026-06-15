<template>
  <section id="goth-narrative-pane" class="goth-narrative-pane" aria-label="叙事正文">
    <span class="visually-hidden" role="status">{{ statusAnnouncement }}</span>
    <div v-if="isGenerating" class="goth-narrative-pane__generating" aria-hidden="true">
      <div class="goth-generating-cradle" role="presentation">
        <span class="goth-generating-cradle__dot" />
        <span class="goth-generating-cradle__dot" />
        <span class="goth-generating-cradle__dot" />
        <span class="goth-generating-cradle__dot" />
      </div>
    </div>

    <div
      v-if="showTypewriterToolbar"
      class="goth-narrative-pane__type-toolbar"
      role="toolbar"
      aria-label="打字机播放控制"
    >
      <button
        type="button"
        class="goth-typewriter-btn"
        :disabled="typewriterComplete || !hasMaintext"
        aria-label="快进：立即显示全文"
        title="快进"
        @click="skipToEnd"
      >
        快进
      </button>
      <button
        type="button"
        class="goth-typewriter-btn"
        :disabled="!hasMaintext"
        aria-label="重放打字机动画"
        title="重放"
        @click="replay"
      >
        重放
      </button>
    </div>

    <div v-if="!hasMaintext" class="goth-narrative-pane__placeholder" role="status">
      <p class="goth-narrative-pane__empty">暂无正文，等待楼层生成。</p>
      <p class="goth-narrative-pane__empty-sub">叙事稿纸 · 随楼层填充</p>
    </div>
    <div
      v-else
      class="goth-narrative-pane__body goth-mono-flow"
      role="article"
      :aria-busy="!typewriterComplete && !wantsReducedMotion"
    >
      <template v-for="(seg, idx) in narrativeSegments" :key="idx">
        <template v-if="seg.kind === 'plain'">{{ seg.text }}</template>
        <GothNarrativeDice v-else-if="seg.kind === 'dice'" :content="seg.content" />
        <GothNarrativeRichInline v-else-if="seg.kind === 'jp-zh'" :seg="seg" />
      </template>
      <span v-if="showCaret" class="goth-typewriter-caret" aria-hidden="true" />
    </div>
  </section>
</template>

<script setup lang="ts">
import { usePreferredReducedMotion } from '@vueuse/core';
import { gsap } from 'gsap';
import { computed, inject, onBeforeUnmount, ref, watch } from 'vue';
import { gothStateKey } from './gothStateContext';
import GothNarrativeDice from './GothNarrativeDice.vue';
import GothNarrativeRichInline from './GothNarrativeRichInline.vue';
import { parseNarrativeBodySegments } from './utils/narrativeBodySegments';

const state = inject(gothStateKey);
if (!state) throw new Error('未找到 Goth 状态上下文。');

const { tavernMaintext, isGenerating } = state;

/** VueUse 返回 `'reduce' | 'no-preference'`，勿当 boolean 用（`no-preference` 亦为 truthy） */
const preferredMotion = usePreferredReducedMotion();
const wantsReducedMotion = computed(() => preferredMotion.value === 'reduce');

const displayedText = ref('');
let typeTween: gsap.core.Tween | null = null;

const hasMaintext = computed(() => tavernMaintext.value.trim().length > 0);

const showTypewriterToolbar = computed(() => hasMaintext.value && !isGenerating.value);

const typewriterComplete = computed(() => {
  const full = tavernMaintext.value;
  return full.length > 0 && displayedText.value === full;
});

const showCaret = computed(
  () =>
    hasMaintext.value &&
    !wantsReducedMotion.value &&
    !typewriterComplete.value &&
    !isGenerating.value,
);

const statusAnnouncement = computed(() => (isGenerating.value ? '生成中' : ''));

/** `<dice>` + 「日文」{中文} 分段，随打字机字符串增量更新 */
const narrativeSegments = computed(() => parseNarrativeBodySegments(displayedText.value));

function graphemeSegments(s: string): string[] {
  try {
    const seg = new Intl.Segmenter(undefined, { granularity: 'grapheme' });
    return [...seg.segment(s)].map(x => x.segment);
  } catch {
    return [...s];
  }
}

function sliceByGraphemeCount(s: string, count: number): string {
  const units = graphemeSegments(s);
  return units.slice(0, Math.max(0, Math.round(count))).join('');
}

function killTypeTween() {
  if (typeTween) {
    typeTween.kill();
    typeTween = null;
  }
}

/** 约 62ms / 字素，总时长限制在 6s～150s，老式缓速感 */
function typewriterDurationSec(unitCount: number) {
  const msPer = 62;
  return Math.min(150, Math.max(6, (unitCount * msPer) / 1000));
}

function runTypewriter(full: string) {
  killTypeTween();
  if (!full) {
    displayedText.value = '';
    return;
  }
  if (wantsReducedMotion.value) {
    displayedText.value = full;
    return;
  }

  const units = graphemeSegments(full);
  const n = units.length;
  if (n === 0) {
    displayedText.value = '';
    return;
  }

  displayedText.value = '';
  const proxy = { pos: 0 };
  const duration = typewriterDurationSec(n);

  typeTween = gsap.to(proxy, {
    pos: n,
    duration,
    ease: 'none',
    onUpdate: () => {
      displayedText.value = sliceByGraphemeCount(full, proxy.pos);
    },
    onComplete: () => {
      displayedText.value = full;
      typeTween = null;
    },
  });
}

watch(
  tavernMaintext,
  full => {
    runTypewriter(full ?? '');
  },
  { immediate: true },
);

watch(wantsReducedMotion, reduce => {
  if (reduce && hasMaintext.value) {
    killTypeTween();
    displayedText.value = tavernMaintext.value;
  }
});

function skipToEnd() {
  const full = tavernMaintext.value;
  killTypeTween();
  displayedText.value = full;
}

function replay() {
  runTypewriter(tavernMaintext.value);
}

onBeforeUnmount(() => {
  killTypeTween();
});
</script>

<style scoped>
.goth-narrative-pane {
  position: relative;
  isolation: isolate;
  flex: 0 0 auto;
  display: flex;
  flex-direction: column;
  padding: 0.7rem 0.9rem 0.8rem;
  border-bottom: none;
  background-color: rgba(30, 26, 22, 0.42);
  background-image:
    radial-gradient(ellipse 95% 70% at 50% 0%, rgba(200, 184, 158, 0.07), transparent 58%),
    linear-gradient(178deg, rgba(48, 42, 36, 0.42) 0%, rgba(26, 22, 18, 0.62) 52%, rgba(20, 17, 14, 0.78) 100%);
  box-shadow:
    inset 0 1px 0 rgba(236, 226, 200, 0.045),
    inset 0 0 56px rgba(10, 8, 6, 0.42),
    inset 0 12px 36px rgba(8, 6, 5, 0.22);
}

/* 极轻纸感颗粒，与外侧 chat section 略区分 */
.goth-narrative-pane::before {
  content: '';
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 0;
  opacity: 0.055;
  mix-blend-mode: overlay;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.88' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.42'/%3E%3C/svg%3E");
  background-size: 140px 140px;
}

.goth-narrative-pane::after {
  content: '';
  position: absolute;
  left: 2%;
  right: 2%;
  bottom: 0;
  height: 1px;
  background: var(--g-divider-fade);
  opacity: 0.75;
  pointer-events: none;
  z-index: 2;
}

.goth-narrative-pane > * {
  position: relative;
  z-index: 1;
}

.goth-narrative-pane__type-toolbar {
  position: absolute;
  top: 0.52rem;
  left: 0.62rem;
  z-index: 5;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.35rem;
}

.goth-typewriter-btn {
  font-family: var(--g-font-ui);
  font-size: 0.68rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  padding: 0.32rem 0.55rem;
  border-radius: 3px;
  border: none;
  cursor: pointer;
  background: linear-gradient(180deg, rgba(34, 30, 26, 0.92) 0%, rgba(20, 18, 16, 0.98) 100%);
  box-shadow:
    inset 0 3px 10px rgba(5, 4, 3, 0.48),
    inset 0 1px 0 rgba(58, 54, 48, 0.12),
    inset 0 0 0 1px rgba(196, 182, 150, 0.07),
    0 1px 0 rgba(42, 38, 34, 0.55);
  color: rgba(148, 138, 122, 0.88);
  transition:
    color 0.18s ease,
    box-shadow 0.18s ease,
    transform 0.12s ease;
}

.goth-typewriter-btn:hover:not(:disabled) {
  color: rgba(172, 162, 142, 0.95);
  box-shadow:
    inset 0 4px 12px rgba(5, 4, 3, 0.52),
    inset 0 1px 0 rgba(52, 48, 42, 0.1),
    0 1px 0 rgba(38, 34, 30, 0.45);
}

.goth-typewriter-btn:active:not(:disabled) {
  transform: translateY(1px);
}

.goth-typewriter-btn:disabled {
  opacity: 0.42;
  cursor: not-allowed;
}

.goth-typewriter-btn:focus-visible {
  outline: 1px solid rgba(118, 108, 92, 0.45);
  outline-offset: 2px;
}

/* 空状态：低对比氛围占位，避免「一块死灰字」 */
.goth-narrative-pane__placeholder {
  flex: 0 0 auto;
  box-sizing: border-box;
  min-height: var(--g-narr-body-fixed-height);
  height: var(--g-narr-body-fixed-height);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.65rem;
  padding: 1.1rem 1rem;
  text-align: center;
  background-image: repeating-linear-gradient(
    to bottom,
    transparent 0,
    transparent calc(1.75rem - 1px),
    rgba(112, 98, 80, 0.07) calc(1.75rem - 1px),
    rgba(112, 98, 80, 0.07) 1.75rem
  );
  background-origin: content-box;
}

.goth-narrative-pane__placeholder::before,
.goth-narrative-pane__placeholder::after {
  content: '';
  width: min(11rem, 70%);
  height: 1px;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(138, 122, 98, 0.18) 22%,
    rgba(92, 82, 68, 0.12) 50%,
    rgba(138, 122, 98, 0.15) 78%,
    transparent 100%
  );
  opacity: 0.85;
}

.goth-narrative-pane__empty {
  margin: 0;
  max-width: 17rem;
  font-family: var(--g-font-serif);
  font-size: 0.8rem;
  font-style: italic;
  font-weight: 500;
  line-height: 1.58;
  letter-spacing: 0.035em;
  color: var(--g-ink-muted);
  opacity: 0.52;
}

.goth-narrative-pane__empty-sub {
  margin: 0;
  font-family: var(--g-font-ui);
  font-size: 0.62rem;
  font-weight: 500;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--g-ink-faint);
  opacity: 0.38;
}

/* 稿纸横格：行距与格距共用 --np-step，格线贴在每行行框底，随正文滚动 */
.goth-narrative-pane__body {
  --np-rule: rgba(112, 98, 80, 0.165);
  /* 行距与稿纸格距一致：1.8 × 1em */
  --np-step: calc(var(--g-narration-line-height) * 1em);
  flex: 0 0 auto;
  box-sizing: border-box;
  height: var(--g-narr-body-fixed-height);
  max-height: var(--g-narr-body-fixed-height);
  overflow-x: hidden;
  overflow-y: auto;
  width: 100%;
  max-width: 42rem;
  margin: 0 auto;
  /* 顶栏按钮占位 + 顶/底留白 */
  padding: calc(var(--np-step) * 0.28 + 1.35rem) 1rem calc(var(--np-step) * 0.45);
  white-space: pre-wrap;
  font-family: var(--g-font-narration);
  font-size: 1rem;
  line-height: var(--g-narration-line-height);
  letter-spacing: var(--g-narration-tracking);
  color: var(--g-ink);
  text-shadow: 0 1px 1px rgba(8, 6, 5, 0.22);
  background-image: repeating-linear-gradient(
    to bottom,
    transparent 0,
    transparent calc(var(--np-step) - 1px),
    var(--np-rule) calc(var(--np-step) - 1px),
    var(--np-rule) var(--np-step)
  );
  background-origin: content-box;
  background-attachment: local;
}

.goth-typewriter-caret {
  display: inline-block;
  width: 0.58em;
  height: 1.05em;
  margin-left: 1px;
  vertical-align: -0.12em;
  border-radius: 1px;
  background: rgba(212, 198, 168, 0.82);
  box-shadow: 0 0 8px rgba(200, 184, 148, 0.22);
  animation: goth-typewriter-caret-blink 0.95s step-end infinite;
}

@media (prefers-reduced-motion: reduce) {
  .goth-typewriter-caret {
    animation: none;
    opacity: 0.85;
  }
}

@keyframes goth-typewriter-caret-blink {
  0%,
  45% {
    opacity: 1;
  }

  50%,
  100% {
    opacity: 0;
  }
}

/* 不支持 local 附件时仍显示格线（整幅固定，长文滚动时略错位） */
@supports not (background-attachment: local) {
  .goth-narrative-pane__body {
    background-attachment: scroll;
  }
}

.goth-mono-flow {
  white-space: pre-wrap;
}

</style>
