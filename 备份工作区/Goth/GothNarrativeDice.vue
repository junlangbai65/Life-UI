<template>
  <div class="goth-narrative-dice" role="note" aria-label="骰子判定">
    <div class="goth-narrative-dice__plate" aria-hidden="true" />
    <div class="goth-narrative-dice__inner">
      <!-- 案例骰子样式：六点阵作铭牌角标 -->
      <div class="goth-narrative-dice__pip-grid" aria-hidden="true">
        <span v-for="n in 6" :key="n" class="goth-narrative-dice__pip" />
      </div>
      <div class="goth-narrative-dice__content">
        <template v-if="parsed.structured">
          <p class="goth-narrative-dice__title">{{ parsed.checkName }}</p>
          <p class="goth-narrative-dice__row goth-mono">
            <span class="goth-narrative-dice__expr">{{ parsed.rollLine }}</span>
            <span class="goth-narrative-dice__vs">VS</span>
            <span class="goth-narrative-dice__dc">{{ parsed.dc }}</span>
          </p>
          <p class="goth-narrative-dice__outcome" :class="outcomeClass">{{ parsed.outcome }}</p>
        </template>
        <p v-else class="goth-narrative-dice__fallback goth-mono">{{ parsed.fallbackText }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{ content: string }>();

/** 标准：<检定名>：<算式> VS <DC>，<结果> */
function parseDiceLine(raw: string) {
  const t = raw.trim();
  const m = t.match(/^(.+?)[：:]\s*(.+?)\s+vs\s+(dc\s*\d+)\s*[,，]\s*(.+)$/i);
  if (!m) {
    return { structured: false as const, fallbackText: t };
  }
  return {
    structured: true as const,
    checkName: m[1].trim(),
    rollLine: m[2].trim(),
    dc: m[3].trim().replace(/^dc/i, 'DC'),
    outcome: m[4].trim(),
    fallbackText: t,
  };
}

const parsed = computed(() => parseDiceLine(props.content));

const outcomeClass = computed(() => {
  if (!parsed.value.structured) return '';
  const o = parsed.value.outcome;
  if (/失败|失敗|大失败|判定的失败/i.test(o)) return 'goth-narrative-dice__outcome--fail';
  if (/成功|大成功|極限|极限/i.test(o)) return 'goth-narrative-dice__outcome--success';
  return 'goth-narrative-dice__outcome--neutral';
});
</script>

<style scoped>
.goth-narrative-dice {
  display: block;
  width: 100%;
  max-width: 36rem;
  margin: 0.75rem auto;
  position: relative;
}

.goth-narrative-dice__plate {
  position: absolute;
  inset: -2px;
  border-radius: calc(var(--g-radius) + 2px);
  background: linear-gradient(
    165deg,
    rgba(72, 64, 54, 0.5) 0%,
    rgba(22, 18, 14, 0.85) 100%
  );
  box-shadow:
    0 2px 12px rgba(4, 3, 2, 0.45),
    inset 0 1px 0 rgba(255, 248, 236, 0.06);
  pointer-events: none;
}

.goth-narrative-dice__inner {
  position: relative;
  display: flex;
  gap: 0.65rem;
  align-items: stretch;
  padding: 0.55rem 0.65rem 0.58rem 0.55rem;
  border-radius: var(--g-radius);
  border: 1px solid rgba(38, 34, 28, 0.92);
  background: linear-gradient(
    178deg,
    rgba(48, 42, 36, 0.92) 0%,
    rgba(22, 18, 14, 0.97) 100%
  );
  box-shadow:
    inset 0 2px 14px rgba(4, 3, 2, 0.42),
    inset 0 1px 0 rgba(118, 108, 88, 0.08);
}

/* 参考案例：骰面六点阵，静态嵌入 Gothic 金属凹印 */
.goth-narrative-dice__pip-grid {
  flex-shrink: 0;
  width: 2.35rem;
  align-self: center;
  display: grid;
  grid-template-columns: repeat(2, 7px);
  grid-template-rows: repeat(3, 7px);
  gap: 5px;
  padding: 0.35rem 0.28rem;
  border-radius: 4px;
  background: rgba(14, 12, 10, 0.65);
  box-shadow:
    inset 0 2px 6px rgba(4, 3, 2, 0.55),
    inset 0 1px 0 rgba(72, 66, 58, 0.12);
}

.goth-narrative-dice__pip {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: radial-gradient(circle at 30% 28%, rgba(210, 196, 168, 0.35), rgba(24, 22, 18, 0.95) 55%);
  box-shadow:
    0 1px 2px rgba(0, 0, 0, 0.55),
    inset 0 1px 0 rgba(255, 248, 236, 0.08);
}

.goth-narrative-dice__content {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 0.28rem;
}

.goth-narrative-dice__title {
  margin: 0;
  font-family: var(--g-font-display);
  font-size: 0.82rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  color: rgba(218, 202, 168, 0.94);
  text-shadow: 0 1px 2px rgba(8, 6, 5, 0.45);
}

.goth-narrative-dice__row {
  margin: 0;
  font-size: 0.84rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  color: rgba(210, 200, 178, 0.92);
  line-height: 1.45;
  word-break: break-word;
}

.goth-narrative-dice__expr {
  margin-right: 0.35em;
}

.goth-narrative-dice__vs {
  margin: 0 0.35em;
  font-family: var(--g-font-ui);
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.16em;
  color: rgba(148, 138, 118, 0.72);
  vertical-align: middle;
}

.goth-narrative-dice__dc {
  font-weight: 700;
  color: rgba(188, 176, 148, 0.88);
}

.goth-narrative-dice__outcome {
  margin: 0.12rem 0 0;
  font-family: var(--g-font-serif);
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.05em;
}

.goth-narrative-dice__outcome--success {
  color: rgba(158, 188, 158, 0.95);
  text-shadow: 0 0 12px rgba(88, 128, 88, 0.22);
}

.goth-narrative-dice__outcome--fail {
  color: rgba(196, 148, 132, 0.94);
  text-shadow: 0 0 10px rgba(128, 72, 58, 0.18);
}

.goth-narrative-dice__outcome--neutral {
  color: rgba(188, 178, 158, 0.88);
}

.goth-narrative-dice__fallback {
  margin: 0;
  font-size: 0.82rem;
  line-height: 1.5;
  letter-spacing: 0.03em;
  color: rgba(200, 190, 168, 0.88);
  white-space: pre-wrap;
}
</style>
