<template>
  <!-- 有主文：默认显示花括号内文本；仅有对照外壳非空时悬浮/聚焦才展示对照（Teleport + fixed 避免裁切） -->
  <span
    v-if="showZhPrimary"
    ref="anchorRef"
    class="goth-narrative-rich"
    :class="[surfaceVariant, { 'goth-narrative-rich--no-tip': !showTooltip }]"
    :tabindex="showTooltip ? 0 : undefined"
    role="group"
    :aria-label="ariaLabel"
    @mouseenter="openTip"
    @mouseleave="scheduleCloseTip"
    @focus="openTip"
    @blur="closeTipNow"
    @keydown.escape.prevent="closeTipNow"
  >
    <span class="goth-narrative-rich__surface">{{ seg.chinese }}</span>
  </span>

  <!-- 无主文：仍展示外壳内对照文本（独白 / 告示 / 书名未写括号） -->
  <span v-else class="goth-narrative-rich goth-narrative-rich--bare" :class="bareVariant">
    <span class="goth-narrative-rich__original-only">{{ bracketFull }}</span>
  </span>

  <Teleport to="body">
    <div
      v-show="tipVisible && showTooltip"
      class="goth-narrative-rich__tooltip"
      :lang="tooltipLangHint"
      :style="tipStyle"
      role="tooltip"
      @mouseenter="cancelCloseTip"
      @mouseleave="scheduleCloseTip"
    >
      <span class="goth-narrative-rich__tooltip-label">对照文本</span>
      <span class="goth-narrative-rich__tooltip-original">{{ bracketFull }}</span>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue';
import type { NarrativeJpZhSegment } from './utils/narrativeJpZhSegments';

const props = defineProps<{ seg: NarrativeJpZhSegment }>();

/** 外壳 + 内文 + 闭括号；用于悬浮对照或裸显 */
const bracketFull = computed(() => `${props.seg.open}${props.seg.inner}${props.seg.close}`);

const showZhPrimary = computed(() => {
  const z = props.seg.chinese;
  return z !== undefined && z.trim().length > 0;
});

/** 〔〕 语法约定为不写对照语；空外壳或仅空白对照也不弹层 */
const hasBracketOriginal = computed(() => {
  if (props.seg.open === '〔') return false;
  return props.seg.inner.trim().length > 0;
});

const showTooltip = computed(() => showZhPrimary.value && hasBracketOriginal.value);

const surfaceVariant = computed(() => {
  if (props.seg.open === '『') return 'goth-narrative-rich--sign';
  if (props.seg.open === '《') return 'goth-narrative-rich--book';
  return 'goth-narrative-rich--dialogue';
});

const bareVariant = computed(() => {
  if (props.seg.open === '『') return 'goth-narrative-rich--bare-sign';
  if (props.seg.open === '《') return 'goth-narrative-rich--bare-book';
  return 'goth-narrative-rich--bare-dialogue';
});

/** 粗测外壳内语种，供 lang 与字体回退（不要求精确） */
const tooltipLangHint = computed(() => {
  const t = props.seg.inner;
  if (!t.trim()) return 'und';
  if (/[\u3040-\u30ff\u31f0-\u31ff]/.test(t)) return 'ja';
  if (/[àâäéèêëïîôùûüÿœæç]/i.test(t)) return 'fr';
  if (/[a-zA-Z]/.test(t)) return 'en';
  if (/[\u4e00-\u9fff]/.test(t)) return 'zh';
  return 'und';
});

const ariaLabel = computed(() => {
  const zh = props.seg.chinese?.trim() ?? '';
  if (!showZhPrimary.value) return bracketFull.value;
  const corner = props.seg.open === '〔' ? props.seg.inner.trim() : '';
  if (corner) return `${zh}（编者标记：${corner}）`;
  if (!hasBracketOriginal.value) return zh;
  return `${zh}（悬浮或 Tab 可读对照文本：${bracketFull.value}）`;
});

const anchorRef = ref<HTMLElement | null>(null);
const tipVisible = ref(false);
const tipStyle = ref<Record<string, string>>({});

let hideTimer: ReturnType<typeof setTimeout> | null = null;
let scrollCleanup: (() => void) | null = null;

function measureTip() {
  const el = anchorRef.value;
  if (!el) return;
  const r = el.getBoundingClientRect();
  const gap = 6;
  const vw = typeof window !== 'undefined' ? window.innerWidth : 1024;
  const margin = 10;
  let cx = r.left + r.width / 2;
  cx = Math.max(margin, Math.min(vw - margin, cx));
  tipStyle.value = {
    position: 'fixed',
    left: `${Math.round(cx)}px`,
    top: `${Math.round(r.bottom + gap)}px`,
    transform: 'translateX(-50%)',
    zIndex: '2147483646',
    maxWidth: `min(calc(100vw - ${margin * 2}px), 26rem)`,
  };
}

function cancelCloseTip() {
  if (hideTimer !== null) {
    clearTimeout(hideTimer);
    hideTimer = null;
  }
}

function scheduleCloseTip() {
  cancelCloseTip();
  hideTimer = window.setTimeout(() => {
    tipVisible.value = false;
    hideTimer = null;
  }, 160);
}

function openTip() {
  if (!showTooltip.value) return;
  cancelCloseTip();
  tipVisible.value = true;
}

function closeTipNow() {
  cancelCloseTip();
  tipVisible.value = false;
}

function attachScrollSync() {
  scrollCleanup?.();
  scrollCleanup = null;
  const scroller = anchorRef.value?.closest('.goth-narrative-pane__body');
  const onScroll = () => measureTip();
  scroller?.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  scrollCleanup = () => {
    scroller?.removeEventListener('scroll', onScroll);
    window.removeEventListener('resize', onScroll);
  };
}

watch(tipVisible, async v => {
  if (v && showTooltip.value) {
    await nextTick();
    measureTip();
    attachScrollSync();
  } else {
    scrollCleanup?.();
    scrollCleanup = null;
  }
});

watch(showTooltip, ok => {
  if (!ok) closeTipNow();
});

onBeforeUnmount(() => {
  cancelCloseTip();
  scrollCleanup?.();
});
</script>

<style scoped>
.goth-narrative-rich {
  display: inline;
  white-space: pre-wrap;
  max-width: 100%;
}

/* —— 译文表面：中文为主阅读流 —— */

.goth-narrative-rich--no-tip .goth-narrative-rich__surface {
  cursor: inherit;
}

.goth-narrative-rich__surface {
  display: inline;
  box-decoration-break: clone;
  -webkit-box-decoration-break: clone;
  padding: 0.12em 0.38em 0.14em;
  margin: 0 0.06em;
  border-radius: 3px;
  cursor: help;
  font-family: var(--g-font-serif), 'Source Han Serif SC', 'Noto Serif SC', serif;
  font-weight: 550;
  font-size: 0.98em;
  letter-spacing: 0.04em;
  line-height: inherit;
  vertical-align: baseline;
  transition:
    background 0.18s ease,
    box-shadow 0.18s ease,
    color 0.18s ease;
}

/* 对白：暖赭档案墨迹 + 细槽 */
.goth-narrative-rich--dialogue .goth-narrative-rich__surface {
  color: rgba(42, 34, 28, 0.96);
  background:
    linear-gradient(180deg, rgba(248, 238, 220, 0.94) 0%, rgba(228, 212, 188, 0.88) 100%);
  box-shadow:
    inset 0 0 0 1px rgba(92, 72, 52, 0.22),
    inset 0 2px 0 rgba(255, 252, 244, 0.55),
    0 1px 2px rgba(18, 14, 10, 0.18);
}

.goth-narrative-rich--dialogue:hover .goth-narrative-rich__surface,
.goth-narrative-rich--dialogue:focus-visible .goth-narrative-rich__surface {
  background:
    linear-gradient(180deg, rgba(255, 246, 228, 0.98) 0%, rgba(236, 218, 192, 0.94) 100%);
  box-shadow:
    inset 0 0 0 1px rgba(122, 88, 58, 0.28),
    inset 0 2px 0 rgba(255, 252, 244, 0.65),
    0 2px 8px rgba(42, 28, 18, 0.12);
}

/* 牌匾：冷绿铜锈告示牌 */
.goth-narrative-rich--sign .goth-narrative-rich__surface {
  color: rgba(228, 238, 220, 0.96);
  font-family: var(--g-font-serif), serif;
  letter-spacing: 0.14em;
  font-weight: 600;
  text-transform: none;
  background:
    linear-gradient(
      165deg,
      rgba(52, 62, 48, 0.92) 0%,
      rgba(28, 34, 26, 0.96) 48%,
      rgba(18, 22, 16, 0.98) 100%
    );
  box-shadow:
    inset 0 0 0 1px rgba(118, 142, 102, 0.35),
    inset 0 3px 10px rgba(4, 6, 4, 0.45),
    0 1px 3px rgba(6, 8, 5, 0.35);
}

.goth-narrative-rich--sign:hover .goth-narrative-rich__surface,
.goth-narrative-rich--sign:focus-visible .goth-narrative-rich__surface {
  box-shadow:
    inset 0 0 0 1px rgba(148, 172, 128, 0.42),
    inset 0 3px 10px rgba(4, 6, 4, 0.4),
    0 2px 10px rgba(22, 32, 18, 0.22);
}

/* 书名：狭条烫金题签 */
.goth-narrative-rich--book .goth-narrative-rich__surface {
  color: rgba(38, 32, 24, 0.94);
  font-weight: 600;
  letter-spacing: 0.12em;
  font-style: italic;
  background: linear-gradient(180deg, rgba(212, 196, 158, 0.55) 0%, rgba(188, 168, 128, 0.42) 100%);
  box-shadow:
    inset 0 -2px 0 rgba(138, 112, 62, 0.55),
    inset 0 0 0 1px rgba(92, 76, 48, 0.18),
    0 1px 2px rgba(18, 14, 10, 0.12);
}

.goth-narrative-rich--book:hover .goth-narrative-rich__surface,
.goth-narrative-rich--book:focus-visible .goth-narrative-rich__surface {
  background: linear-gradient(180deg, rgba(228, 210, 172, 0.62) 0%, rgba(198, 178, 138, 0.48) 100%);
  box-shadow:
    inset 0 -2px 0 rgba(158, 124, 68, 0.62),
    inset 0 0 0 1px rgba(108, 88, 52, 0.22),
    0 2px 8px rgba(42, 32, 18, 0.1);
}

.goth-narrative-rich:focus-visible {
  outline: none;
}

.goth-narrative-rich:focus-visible .goth-narrative-rich__surface {
  outline: 2px solid rgba(200, 168, 112, 0.65);
  outline-offset: 2px;
}

/* —— 悬浮层：日文原文 —— */

.goth-narrative-rich__tooltip {
  pointer-events: auto;
  padding: 0.45rem 0.65rem 0.5rem;
  border-radius: 4px;
  border: 1px solid rgba(72, 64, 54, 0.55);
  background:
    linear-gradient(175deg, rgba(36, 32, 28, 0.97) 0%, rgba(22, 19, 16, 0.99) 100%);
  box-shadow:
    0 12px 28px rgba(6, 5, 4, 0.55),
    inset 0 1px 0 rgba(255, 248, 236, 0.06);
  backdrop-filter: blur(6px);
}

.goth-narrative-rich__tooltip-label {
  display: block;
  font-family: var(--g-font-ui);
  font-size: 0.58rem;
  font-weight: 700;
  letter-spacing: 0.28em;
  text-transform: uppercase;
  color: rgba(180, 168, 148, 0.55);
  margin-bottom: 0.28rem;
}

/* 日/英/法/中等对照混排：拉丁衬线优先，再 CJK 明朝体 */
.goth-narrative-rich__tooltip-original {
  display: block;
  font-family:
    var(--g-font-narration),
    'Noto Serif',
    'Georgia',
    'Times New Roman',
    'Yu Mincho',
    'Hiragino Mincho ProN',
    'MS Mincho',
    'Noto Serif JP',
    var(--g-font-serif),
    serif;
  font-size: 0.82rem;
  font-weight: 600;
  line-height: 1.55;
  letter-spacing: 0.03em;
  color: rgba(238, 228, 208, 0.96);
  text-shadow: 0 1px 2px rgba(4, 4, 4, 0.65);
  word-break: break-word;
  overflow-wrap: anywhere;
  white-space: pre-wrap;
}

.goth-narrative-rich__tooltip-original:lang(en),
.goth-narrative-rich__tooltip-original:lang(fr) {
  font-family:
    var(--g-font-narration),
    'Noto Serif',
    'Source Serif 4',
    'Georgia',
    'Times New Roman',
    var(--g-font-serif),
    serif;
  letter-spacing: 0.02em;
}

.goth-narrative-rich__tooltip-original:lang(ja) {
  font-family:
    'Yu Mincho',
    'Hiragino Mincho ProN',
    'MS Mincho',
    'Noto Serif JP',
    var(--g-font-serif),
    serif;
}

@media (prefers-reduced-motion: reduce) {
  .goth-narrative-rich__surface {
    transition: none;
  }
}

/* —— 裸外壳（无主文花括号）：对照语种直接嵌入正文 —— */

.goth-narrative-rich__original-only {
  display: inline;
  box-decoration-break: clone;
  -webkit-box-decoration-break: clone;
  font-family:
    var(--g-font-narration),
    'Noto Serif',
    'Georgia',
    'Yu Mincho',
    'Hiragino Mincho ProN',
    'MS Mincho',
    'Noto Serif JP',
    var(--g-font-serif),
    serif;
  font-weight: 550;
  letter-spacing: 0.03em;
  padding: 0.06em 0.22em 0.08em;
  margin: 0 0.04em;
  border-radius: 3px;
  vertical-align: baseline;
}

.goth-narrative-rich--bare-dialogue .goth-narrative-rich__original-only {
  color: rgba(216, 204, 182, 0.9);
  background: rgba(48, 42, 34, 0.38);
  box-shadow: inset 0 0 0 1px rgba(92, 82, 68, 0.18);
}

.goth-narrative-rich--bare-sign .goth-narrative-rich__original-only {
  color: rgba(198, 212, 186, 0.88);
  background: rgba(34, 40, 30, 0.42);
  box-shadow: inset 0 0 0 1px rgba(88, 108, 74, 0.28);
}

.goth-narrative-rich--bare-book .goth-narrative-rich__original-only {
  color: rgba(228, 212, 178, 0.9);
  font-style: italic;
  letter-spacing: 0.08em;
  background: rgba(52, 46, 34, 0.4);
  box-shadow: inset 0 -1px 0 rgba(158, 132, 82, 0.35);
}
</style>
