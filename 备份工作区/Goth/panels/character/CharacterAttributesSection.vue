<template>
  <div id="goth-panel-attributes" class="goth-panel-character goth-panel--attrs">
    <!-- 分区标题由档案后台 BackstageSectionHeader 提供，此处仅保留说明性导语，避免重复一级标题 -->
    <section class="goth-card goth-attrs-shell" aria-label="五项核心属性">
      <header class="goth-attrs-shell__intro">
        <div class="goth-attrs-shell__intro-line" aria-hidden="true" />
        <div class="goth-attrs-shell__intro-text">
          <p v-if="ch.attributes.length > 0" class="goth-attrs-shell__lede goth-attrs-shell__lede--emph">
            {{ attrNamesLine }}
          </p>
          <p v-else class="goth-attrs-shell__lede goth-attrs-shell__lede--muted">同步主角数值后可在此检视五项核心属性</p>
        </div>
      </header>

      <ul class="goth-attrs-matrix" role="list" :aria-label="ch.attributes.length ? '五项属性当前值' : undefined">
        <li
          v-for="(a, idx) in ch.attributes"
          :key="a.name"
          class="goth-attr-stat goth-inset-slot"
          :style="{ '--attr-pct': `${barPercent(a.value)}%` }"
        >
          <span class="goth-attr-stat__index goth-mono" aria-hidden="true">{{ indexLabel(idx) }}</span>
          <div class="goth-attr-stat__body">
            <span class="goth-attr-stat__name">{{ a.name }}</span>
            <span class="goth-attr-stat__value goth-mono">{{ a.value }}</span>
          </div>
          <span class="goth-attr-stat__meter" aria-hidden="true">
            <span class="goth-attr-stat__meter-fill" />
          </span>
        </li>
        <li v-if="ch.attributes.length === 0" class="goth-attrs-empty muted" role="status">当前未知</li>
      </ul>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, inject } from 'vue';
import { gothStateKey } from '../../gothStateContext';

const state = inject(gothStateKey);
if (!state) throw new Error('未找到 Goth 状态上下文。');

const ch = computed(() => state.snapshot.value.character);

const attrNamesLine = computed(() => ch.value.attributes.map(a => a.name).join(' · '));

/** 刻度上限：不低于 18（常见规则上限参考），并盖住当前最大值 */
const scaleMax = computed(() => {
  const vals = ch.value.attributes.map(a => a.value).filter(n => Number.isFinite(n));
  const peak = vals.length ? Math.max(...vals) : 10;
  return Math.max(18, Math.ceil(peak * 1.08));
});

function barPercent(v: number): number {
  if (!Number.isFinite(v) || scaleMax.value <= 0) return 0;
  return Math.min(100, Math.round((v / scaleMax.value) * 1000) / 10);
}

function indexLabel(i: number): string {
  const n = i + 1;
  return n < 10 ? `0${n}` : String(n);
}
</script>

<style scoped>
.goth-attrs-shell {
  position: relative;
  padding: 0.65rem 0.72rem 0.62rem;
  overflow: hidden;
}

.goth-attrs-shell::before {
  content: '';
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse 120% 80% at 50% -30%, rgba(184, 168, 130, 0.09), transparent 55%),
    radial-gradient(ellipse 70% 50% at 100% 100%, rgba(184, 168, 130, 0.05), transparent 45%);
  pointer-events: none;
}

.goth-attrs-shell__intro {
  position: relative;
  display: flex;
  gap: 0.55rem;
  align-items: flex-start;
  margin-bottom: 0.62rem;
}

.goth-attrs-shell__intro-line {
  flex-shrink: 0;
  width: 3px;
  align-self: stretch;
  min-height: 2.35rem;
  border-radius: 2px;
  background: linear-gradient(
    180deg,
    var(--g-backstage-accent, var(--g-archive-beige)),
    rgba(184, 168, 130, 0.25)
  );
  box-shadow: 0 0 12px rgba(184, 168, 130, 0.12);
}

.goth-attrs-shell__intro-text {
  min-width: 0;
  padding-top: 0.08rem;
}

.goth-attrs-shell__lede {
  margin: 0.28rem 0 0;
  font-family: var(--g-font-ui);
  font-size: 0.72rem;
  line-height: 1.45;
  color: var(--g-text-muted);
  letter-spacing: 0.06em;
}

.goth-attrs-shell__intro-text > .goth-attrs-shell__lede:first-child {
  margin-top: 0;
}

.goth-attrs-shell__lede--emph {
  font-size: 0.76rem;
  color: var(--g-text);
  letter-spacing: 0.04em;
}

.goth-attrs-shell__lede--muted {
  opacity: 0.85;
  font-style: italic;
  letter-spacing: 0.03em;
}

.goth-attrs-matrix {
  position: relative;
  margin: 0;
  padding: 0;
  list-style: none;
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 0.48rem;
}

@media (max-width: 820px) {
  .goth-attrs-matrix {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 420px) {
  .goth-attrs-matrix {
    grid-template-columns: 1fr;
  }
}

.goth-attr-stat {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 0.42rem;
  padding: 0.52rem 0.48rem 0.48rem;
  min-height: 5.5rem;
  border-radius: calc(var(--g-radius, 10px) - 2px);
  background: linear-gradient(
    165deg,
    rgba(42, 38, 34, 0.72) 0%,
    rgba(22, 20, 18, 0.58) 48%,
    rgba(28, 26, 22, 0.52) 100%
  );
  box-shadow:
    inset 0 1px 0 rgba(120, 108, 88, 0.1),
    inset 0 -1px 0 rgba(8, 6, 5, 0.35),
    0 4px 14px rgba(8, 6, 5, 0.16);
  border: 1px solid rgba(108, 96, 76, 0.18);
  transition:
    border-color 0.22s ease,
    box-shadow 0.22s ease,
    transform 0.22s ease;
}

.goth-attr-stat::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0.85rem;
  right: 0.85rem;
  height: 2px;
  border-radius: 0 0 2px 2px;
  background: linear-gradient(
    90deg,
    transparent,
    var(--g-backstage-accent, rgba(184, 168, 130, 0.55)),
    transparent
  );
  opacity: 0.85;
  pointer-events: none;
}

.goth-attr-stat:hover {
  border-color: rgba(184, 168, 130, 0.28);
  box-shadow:
    inset 0 1px 0 rgba(157, 136, 104, 0.14),
    inset 0 -1px 0 rgba(8, 6, 5, 0.35),
    0 6px 18px rgba(8, 6, 5, 0.22);
}

.goth-attr-stat__index {
  position: absolute;
  top: 0.38rem;
  right: 0.42rem;
  font-size: 0.58rem;
  letter-spacing: 0.08em;
  color: var(--g-text-muted);
  opacity: 0.45;
}

.goth-attr-stat__body {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
  padding-right: 1.35rem;
  min-width: 0;
}

.goth-attr-stat__name {
  font-family: var(--g-font-ui);
  font-size: 0.74rem;
  font-weight: 500;
  letter-spacing: 0.12em;
  color: var(--g-text-muted);
  text-transform: uppercase;
}

.goth-attr-stat__value {
  font-size: 1.42rem;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
  line-height: 1.1;
  color: var(--g-text-title);
  text-shadow: 0 1px 0 rgba(8, 6, 5, 0.35);
}

.goth-attr-stat__meter {
  display: block;
  height: 5px;
  margin-top: auto;
  border-radius: 999px;
  background: rgba(12, 10, 8, 0.55);
  box-shadow:
    inset 0 1px 3px rgba(0, 0, 0, 0.45),
    inset 0 -1px 0 rgba(96, 86, 72, 0.08);
  overflow: hidden;
}

.goth-attr-stat__meter-fill {
  display: block;
  height: 100%;
  width: var(--attr-pct, 0%);
  border-radius: inherit;
  background: linear-gradient(
    90deg,
    rgba(92, 84, 72, 0.5),
    var(--g-backstage-accent, var(--g-archive-beige))
  );
  box-shadow: 0 0 10px rgba(184, 168, 130, 0.18);
  transition: width 0.45s cubic-bezier(0.22, 1, 0.36, 1);
}

.goth-attrs-empty {
  grid-column: 1 / -1;
  padding: 1rem 0.75rem;
  text-align: center;
  font-size: 0.84rem;
  border-radius: calc(var(--g-radius, 10px) - 2px);
  border: 1px dashed rgba(108, 96, 76, 0.28);
  background: rgba(18, 16, 14, 0.35);
}

.muted {
  color: var(--g-text-muted);
}

@media (prefers-reduced-motion: reduce) {
  .goth-attr-stat {
    transition: none;
  }

  .goth-attr-stat__meter-fill {
    transition: none;
  }
}
</style>
