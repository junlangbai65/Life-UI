<template>
  <aside
    id="goth-core-stats-sidebar"
    class="goth-core-stats goth-core-stats--file goth-surface-strip"
    role="group"
    aria-label="侧栏：Subject 与 File"
  >
    <div class="goth-core-stats__file-strip" role="tablist" aria-label="侧栏视图">
      <button
        id="goth-sidebar-tab-subject"
        type="button"
        role="tab"
        class="goth-core-stats__file-badge goth-core-stats__file-tab"
        :class="{ 'is-active': leftPanelTab === 'subject' }"
        :aria-selected="leftPanelTab === 'subject'"
        aria-controls="goth-sidebar-panel"
        tabindex="0"
        @click="leftPanelTab = 'subject'"
      >
        Subject
      </button>
      <button
        id="goth-sidebar-tab-file"
        type="button"
        role="tab"
        class="goth-core-stats__file-badge goth-core-stats__file-badge--outline goth-core-stats__file-tab"
        :class="{ 'is-active': leftPanelTab === 'file' }"
        :aria-selected="leftPanelTab === 'file'"
        aria-controls="goth-sidebar-panel"
        tabindex="0"
        @click="leftPanelTab = 'file'"
      >
        File
      </button>
    </div>

    <div
      id="goth-sidebar-panel"
      class="goth-core-stats__panel-scroll"
      role="tabpanel"
      :aria-labelledby="leftPanelTab === 'subject' ? 'goth-sidebar-tab-subject' : 'goth-sidebar-tab-file'"
    >
      <Transition name="goth-sidebar-panel" mode="out-in">
        <div v-if="leftPanelTab === 'subject'" key="subject" class="goth-core-stats__panel-surface">
          <div class="goth-core-stats__identity" role="group" aria-label="角色">
            <div class="goth-core-stats__identity-inner">
              <div class="goth-core-stats__portrait goth-portrait-frame">
                <img v-if="ch.portraitUrl" :src="ch.portraitUrl" alt="" loading="lazy" />
                <div v-else class="goth-core-stats__portrait-fallback">{{ initials }}</div>
              </div>
              <div class="goth-core-stats__name-block">
                <template v-if="nameLines.length >= 2">
                  <p class="goth-core-stats__name-cn">{{ nameLines[0] }}</p>
                  <p class="goth-core-stats__name-sep" aria-hidden="true" />
                  <p class="goth-core-stats__name-ja">{{ nameLines[1] }}</p>
                </template>
                <p v-else class="goth-core-stats__name-single">{{ ch.name }}</p>
              </div>
            </div>
          </div>

          <div class="goth-core-stats__item goth-core-stats__item--hp">
            <span class="goth-core-stats__label">HP</span>
            <div class="goth-core-stats__bar" role="presentation">
              <span
                v-if="hpBarLayers"
                class="goth-core-stats__bar-ghost goth-core-stats__bar-ghost--hp"
                :style="{ width: hpBarLayers.ghostWidth }"
              />
              <span
                class="goth-core-stats__bar-fill goth-core-stats__bar-fill--current"
                :class="hpBarLayers?.fillPulseClass ?? []"
                :style="{ width: pct(ch.hpCurrent, ch.hpMax) }"
              />
              <span v-if="hpBarLayers" :class="hpBarLayers.overlayClass" :style="hpBarLayers.overlayStyle" />
            </div>
            <div class="goth-core-stats__value-row">
              <span class="goth-core-stats__value goth-mono" :class="{ 'goth-stat-delta': flashHp }">
                {{ ch.hpCurrent }} / {{ ch.hpMax }}
              </span>
              <span v-if="fmtHpDelta" class="goth-stat-mvu-delta goth-stat-mvu-delta--flash" :class="clsHpDelta">{{
                fmtHpDelta
              }}</span>
            </div>
          </div>
          <div class="goth-core-stats__item goth-core-stats__item--san">
            <span class="goth-core-stats__label">SAN</span>
            <div class="goth-core-stats__bar" role="presentation">
              <span
                v-if="sanBarLayers"
                class="goth-core-stats__bar-ghost goth-core-stats__bar-ghost--san"
                :style="{ width: sanBarLayers.ghostWidth }"
              />
              <span
                class="goth-core-stats__bar-fill goth-core-stats__bar-fill--current"
                :class="sanBarLayers?.fillPulseClass ?? []"
                :style="{ width: pct(ch.san, ch.sanMax) }"
              />
              <span v-if="sanBarLayers" :class="sanBarLayers.overlayClass" :style="sanBarLayers.overlayStyle" />
            </div>
            <div class="goth-core-stats__value-row">
              <span class="goth-core-stats__value goth-mono">{{ ch.san }} / {{ ch.sanMax }}</span>
              <span v-if="fmtSanDelta" class="goth-stat-mvu-delta goth-stat-mvu-delta--flash" :class="clsSanDelta">{{
                fmtSanDelta
              }}</span>
            </div>
          </div>
          <div class="goth-core-stats__item goth-core-stats__item--pollution">
            <span class="goth-core-stats__label">污染</span>
            <div class="goth-core-stats__bar" role="presentation">
              <span
                v-if="pollutionBarLayers"
                class="goth-core-stats__bar-ghost goth-core-stats__bar-ghost--pollution"
                :style="{ width: pollutionBarLayers.ghostWidth }"
              />
              <span
                class="goth-core-stats__bar-fill goth-core-stats__bar-fill--current"
                :class="pollutionBarLayers?.fillPulseClass ?? []"
                :style="{ width: pct(ch.pollution, ch.pollutionMax) }"
              />
              <span
                v-if="pollutionBarLayers"
                :class="pollutionBarLayers.overlayClass"
                :style="pollutionBarLayers.overlayStyle"
              />
            </div>
            <div class="goth-core-stats__value-row">
              <span class="goth-core-stats__value goth-mono">{{ ch.pollution }} / {{ ch.pollutionMax }}</span>
              <span
                v-if="fmtPollutionDelta"
                class="goth-stat-mvu-delta goth-stat-mvu-delta--flash"
                :class="clsPollutionDelta"
              >
                {{ fmtPollutionDelta }}
              </span>
            </div>
          </div>
          <div class="goth-core-stats__item goth-core-stats__item--stamina">
            <span class="goth-core-stats__label">体力</span>
            <div class="goth-core-stats__bar" role="presentation">
              <span
                v-if="staminaBarLayers"
                class="goth-core-stats__bar-ghost goth-core-stats__bar-ghost--stamina"
                :style="{ width: staminaBarLayers.ghostWidth }"
              />
              <span
                class="goth-core-stats__bar-fill goth-core-stats__bar-fill--current"
                :class="staminaBarLayers?.fillPulseClass ?? []"
                :style="{ width: pct(ch.stamina, ch.staminaMax) }"
              />
              <span
                v-if="staminaBarLayers"
                :class="staminaBarLayers.overlayClass"
                :style="staminaBarLayers.overlayStyle"
              />
            </div>
            <div class="goth-core-stats__value-row">
              <span class="goth-core-stats__value goth-mono">{{ ch.stamina }} / {{ ch.staminaMax }}</span>
              <span
                v-if="fmtStaminaDelta"
                class="goth-stat-mvu-delta goth-stat-mvu-delta--flash"
                :class="clsStaminaDelta"
              >
                {{ fmtStaminaDelta }}
              </span>
            </div>
          </div>
          <div class="goth-core-stats__funds" role="group" :aria-label="usdFunds.ariaLabel">
            <div class="goth-core-stats__funds-row">
              <span class="goth-core-stats__funds-icon-wrap" aria-hidden="true">
                <svg class="goth-core-stats__funds-icon" viewBox="0 0 24 24">
                  <ellipse
                    cx="12"
                    cy="7.25"
                    rx="8"
                    ry="3.35"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="1.2"
                    vector-effect="non-scaling-stroke"
                  />
                  <ellipse
                    cx="12"
                    cy="11.65"
                    rx="8"
                    ry="3.35"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="1.2"
                    vector-effect="non-scaling-stroke"
                  />
                  <ellipse
                    cx="12"
                    cy="16.05"
                    rx="8"
                    ry="3.35"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="1.2"
                    vector-effect="non-scaling-stroke"
                  />
                  <path
                    d="M12 5v14"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="1"
                    stroke-opacity="0.35"
                    vector-effect="non-scaling-stroke"
                  />
                </svg>
              </span>
              <div class="goth-core-stats__funds-main">
                <span class="goth-core-stats__funds-label">USD</span>
                <div class="goth-core-stats__funds-amount">
                  <span class="goth-core-stats__funds-dollar-part goth-mono">
                    <span class="goth-core-stats__funds-sign">{{ usdFunds.sign }}</span>
                    <span class="goth-core-stats__funds-dollar-mark">$</span>
                    <span class="goth-core-stats__funds-dollars">{{ usdFunds.dollarsInteger }}</span>
                  </span>
                  <span class="goth-core-stats__funds-cent-part goth-mono" aria-hidden="true">{{ usdFunds.centsPadded }}¢</span>
                  <span
                    v-if="fmtCurrencyDelta"
                    class="goth-stat-mvu-delta goth-stat-mvu-delta--funds goth-stat-mvu-delta--flash"
                    :class="clsCurrencyDelta"
                  >
                    {{ fmtCurrencyDelta }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <GothFileDossierPanel
          v-else
          key="file"
          :interests="narrativeInterests"
          :options="narrativeOptions"
          :is-generating="isGenerating"
          @selectOption="onSelectFileOption"
        />
      </Transition>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { computed, inject, ref, watch } from 'vue';
import GothFileDossierPanel from './GothFileDossierPanel.vue';
import { gothStateKey } from './gothStateContext';
import {
  deltaOverlayLayout,
  deltaSemanticTone,
  formatCurrencyDelta,
  formatIntDelta,
  semanticToneClass,
} from './utils/characterMvuDelta';
import type { GothParsedOption } from './utils/messageParser';

const state = inject(gothStateKey);
if (!state) throw new Error('未找到 Goth 状态上下文。');

const { narrativeInterests, narrativeOptions, isGenerating, submitOptionChoice, characterMvuDeltas } = state;

const leftPanelTab = ref<'subject' | 'file'>('subject');

function onSelectFileOption(opt: GothParsedOption) {
  submitOptionChoice(opt);
}

const ch = computed(() => state.snapshot.value.character);
const flashHp = ref(false);

const nameLines = computed(() =>
  ch.value.name
    .split('/')
    .map(s => s.trim())
    .filter(Boolean),
);

const initials = computed(() => {
  const raw = ch.value.name.trim();
  if (raw === 'N/A' || raw.length === 0 || raw === '当前未知') return '?';
  const primary = raw.split('/')[0]?.trim() || raw;
  const n = primary.replace(/调查员[^·]*·?\s*/u, '').trim() || primary;
  return n.slice(0, 2);
});

function pct(cur: number, max: number) {
  if (!max || max <= 0) return '0%';
  return `${Math.min(100, Math.round((cur / max) * 100))}%`;
}

type RpgBarStat = 'hp' | 'san' | 'pollution' | 'stamina';

/** RPG 部分变化：幽灵上一楼占比 + 当前填充保持原配色 + 差分条覆盖上一楼→当前区间 */
function buildRpgBarLayers(
  curr: number,
  maxVal: number,
  delta: number | null,
  stat: RpgBarStat,
): {
  ghostWidth: string;
  overlayStyle: { left: string; width: string };
  overlayClass: string[];
  fillPulseClass: string[];
} | null {
  const polarity = stat === 'pollution' ? 'negative' : 'positive';
  if (delta === null || !Number.isFinite(delta) || delta === 0 || !maxVal) return null;
  const tone = deltaSemanticTone(polarity, delta);
  if (!tone) return null;
  const layout = deltaOverlayLayout(curr, maxVal, delta);
  if (!layout) return null;
  const prev = curr - delta;
  const ghostWidth = pct(Math.max(0, prev), maxVal);
  const overlayClass = [
    'goth-core-stats__bar-delta-strip',
    tone === 'harmful' ? 'goth-core-stats__bar-delta-strip--harmful' : 'goth-core-stats__bar-delta-strip--beneficial',
    `goth-core-stats__bar-delta-strip--${stat}`,
  ];
  const fillPulseClass = [
    'goth-core-stats__bar-fill--rpg-pulse',
    tone === 'harmful' ? 'goth-core-stats__bar-fill--rpg-harmful' : 'goth-core-stats__bar-fill--rpg-beneficial',
    `goth-core-stats__bar-fill--rpg-${stat}`,
  ];
  return {
    ghostWidth,
    overlayStyle: layout,
    overlayClass,
    fillPulseClass,
  };
}

/** `currency` 为美元小数；小数部分转两位美分展示 */
function splitUsdFromDollars(raw: number) {
  const n = Number(raw);
  const safe = Number.isFinite(n) ? n : 0;
  const negative = safe < 0;
  const abs = Math.abs(safe);
  const totalCents = Math.round(abs * 100);
  const dollarsInt = Math.floor(totalCents / 100);
  const cents = totalCents % 100;
  const centsPadded = cents.toString().padStart(2, '0');
  const ariaLabel = `${negative ? 'Negative ' : ''}USD ${dollarsInt} dollars and ${centsPadded} cents`;
  return {
    sign: negative ? '−' : '',
    dollarsInteger: dollarsInt.toLocaleString('en-US'),
    centsPadded,
    ariaLabel,
  };
}

const usdFunds = computed(() => splitUsdFromDollars(ch.value.currency));

const fmtHpDelta = computed(() => formatIntDelta(characterMvuDeltas.value.hpCurrent));
const clsHpDelta = computed(() => semanticToneClass('positive', characterMvuDeltas.value.hpCurrent));
const fmtSanDelta = computed(() => formatIntDelta(characterMvuDeltas.value.san));
const clsSanDelta = computed(() => semanticToneClass('positive', characterMvuDeltas.value.san));
const fmtPollutionDelta = computed(() => formatIntDelta(characterMvuDeltas.value.pollution));
const clsPollutionDelta = computed(() => semanticToneClass('negative', characterMvuDeltas.value.pollution));
const fmtStaminaDelta = computed(() => formatIntDelta(characterMvuDeltas.value.stamina));
const clsStaminaDelta = computed(() => semanticToneClass('positive', characterMvuDeltas.value.stamina));
const fmtCurrencyDelta = computed(() => formatCurrencyDelta(characterMvuDeltas.value.currency));
const clsCurrencyDelta = computed(() => semanticToneClass('currency', characterMvuDeltas.value.currency));

const hpBarLayers = computed(() =>
  buildRpgBarLayers(ch.value.hpCurrent, ch.value.hpMax, characterMvuDeltas.value.hpCurrent, 'hp'),
);
const sanBarLayers = computed(() =>
  buildRpgBarLayers(ch.value.san, ch.value.sanMax, characterMvuDeltas.value.san, 'san'),
);
const pollutionBarLayers = computed(() =>
  buildRpgBarLayers(ch.value.pollution, ch.value.pollutionMax, characterMvuDeltas.value.pollution, 'pollution'),
);
const staminaBarLayers = computed(() =>
  buildRpgBarLayers(ch.value.stamina, ch.value.staminaMax, characterMvuDeltas.value.stamina, 'stamina'),
);

watch(
  () => state.snapshot.value.character.hpCurrent,
  () => {
    flashHp.value = true;
    window.setTimeout(() => {
      flashHp.value = false;
    }, 600);
  },
);
</script>

<style scoped>
/* 档案夹侧栏：封签 + 不均纸色 + 分段条（叙事在场，非通用数值面板） */
#goth-core-stats-sidebar.goth-core-stats--file {
  position: relative;
  isolation: isolate;
  overflow: hidden;
  border: none;
  border-radius: var(--g-radius);
  background:
    radial-gradient(ellipse 125% 70% at 18% 8%, rgba(228, 212, 182, 0.075), transparent 48%),
    radial-gradient(ellipse 90% 55% at 88% 92%, rgba(22, 18, 14, 0.45), transparent 42%),
    radial-gradient(ellipse 130% 85% at 50% -5%, rgba(218, 202, 172, 0.07), transparent 52%),
    linear-gradient(178deg, rgba(56, 50, 44, 0.96) 0%, rgba(38, 34, 30, 0.99) 48%, rgba(26, 22, 18, 1) 100%);
  box-shadow:
    var(--g-depth-raised-strong),
    inset 4px 0 22px rgba(12, 10, 8, 0.14),
    inset 0 1px 0 rgba(72, 66, 58, 0.05);
}

#goth-core-stats-sidebar.goth-core-stats--file::before {
  content: '';
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 0;
  opacity: 0.075;
  mix-blend-mode: multiply;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.95' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.45'/%3E%3C/svg%3E");
  background-size: 120px 120px;
}

#goth-core-stats-sidebar.goth-core-stats--file::after {
  content: '';
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 0;
  opacity: 1;
  background:
    radial-gradient(ellipse 55% 38% at 8% 22%, rgba(252, 246, 232, 0.045), transparent 62%),
    radial-gradient(ellipse 48% 36% at 96% 78%, rgba(8, 6, 5, 0.22), transparent 58%);
  mix-blend-mode: soft-light;
}

#goth-core-stats-sidebar.goth-core-stats--file > * {
  position: relative;
  z-index: 1;
}

.goth-core-stats {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  gap: 0.55rem;
  padding: 0.45rem 0.6rem 0.55rem;
}

.goth-core-stats__panel-scroll {
  flex: 1;
  min-height: 0;
  overflow-x: hidden;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}

.goth-core-stats__panel-surface {
  flex: 1;
  min-height: 0;
  min-width: 0;
}

/* Subject / File：紧凑标签切换 */
.goth-core-stats__file-strip {
  flex-shrink: 0;
  display: flex;
  flex-wrap: wrap;
  align-items: stretch;
  gap: 0.26rem;
  margin: -0.05rem 0 0.32rem -0.08rem;
  padding: 0;
}

.goth-core-stats__file-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-family: var(--g-font-ui);
  font-size: 0.47rem;
  font-weight: 700;
  letter-spacing: 0.085em;
  text-transform: uppercase;
  line-height: 1;
  color: rgba(188, 172, 142, 0.72);
  padding: 0.11rem 0.26rem 0.12rem 0.3rem;
  border-radius: 1px;
  background: linear-gradient(165deg, rgba(42, 38, 32, 0.88), rgba(22, 18, 14, 0.94));
  border: none;
  box-shadow:
    var(--g-depth-chip),
    inset 0 1px 0 rgba(112, 100, 82, 0.05);
  transform: rotate(-0.28deg);
}

.goth-core-stats__file-badge--outline {
  color: rgba(148, 136, 118, 0.58);
  background: linear-gradient(165deg, rgba(32, 28, 24, 0.55), rgba(18, 14, 12, 0.72));
  border: none;
  box-shadow:
    var(--g-depth-chip),
    inset 0 0 0 1px rgba(72, 62, 50, 0.35),
    inset 0 1px 0 rgba(92, 82, 68, 0.04);
  transform: rotate(0.28deg) translateY(0.5px);
}

.goth-core-stats__file-tab {
  cursor: pointer;
  font: inherit;
  appearance: none;
  transition:
    color 0.18s ease,
    box-shadow 0.18s ease,
    transform 0.12s ease;
}

.goth-core-stats__file-tab:hover {
  color: rgba(212, 198, 172, 0.92);
  box-shadow:
    var(--g-depth-chip),
    inset 0 1px 0 rgba(132, 118, 98, 0.1),
    0 2px 10px rgba(8, 6, 5, 0.22);
}

.goth-core-stats__file-badge--outline.goth-core-stats__file-tab:hover {
  color: rgba(188, 176, 155, 0.85);
}

.goth-core-stats__file-tab:active {
  transform: rotate(-0.15deg) scale(0.98);
}

.goth-core-stats__file-badge--outline.goth-core-stats__file-tab:active {
  transform: rotate(0.25deg) translateY(1px) scale(0.98);
}

.goth-core-stats__file-tab:focus-visible {
  outline: 1px solid rgba(118, 108, 92, 0.45);
  outline-offset: 2px;
}

.goth-core-stats__file-tab.is-active {
  color: rgba(228, 212, 182, 0.92);
  box-shadow:
    var(--g-depth-chip),
    inset 0 0 0 1px rgba(196, 182, 150, 0.22),
    inset 0 1px 0 rgba(118, 108, 88, 0.08),
    0 0 14px rgba(92, 78, 58, 0.28);
}

.goth-core-stats__file-badge--outline.goth-core-stats__file-tab.is-active {
  color: rgba(228, 212, 182, 0.92);
  background: linear-gradient(165deg, rgba(48, 42, 36, 0.82), rgba(26, 22, 18, 0.92));
  border: none;
  box-shadow:
    var(--g-depth-chip),
    inset 0 0 0 1px rgba(196, 182, 150, 0.2),
    inset 0 1px 0 rgba(118, 108, 88, 0.08),
    0 0 14px rgba(92, 78, 58, 0.26);
}

/* 分段线：多段透明度，避免一根均匀实线 */
#goth-core-stats-sidebar .goth-core-stats__item ~ .goth-core-stats__item {
  margin-top: 0.15rem;
  padding-top: 0.42rem;
  background-image: linear-gradient(
    90deg,
    transparent 0%,
    rgba(132, 114, 92, 0.04) 6%,
    rgba(132, 114, 92, 0.13) 18%,
    transparent 32%,
    rgba(118, 102, 84, 0.08) 48%,
    transparent 58%,
    rgba(132, 114, 92, 0.1) 74%,
    transparent 88%,
    rgba(100, 88, 72, 0.06) 96%,
    transparent 100%
  );
  background-size: 100% 1px;
  background-position: top;
  background-repeat: no-repeat;
}

.goth-core-stats__identity {
  padding-bottom: 0.55rem;
  margin-bottom: 0.15rem;
  border-bottom: none;
  background-image: linear-gradient(
    90deg,
    transparent 0%,
    rgba(132, 114, 92, 0.06) 10%,
    rgba(132, 114, 92, 0.14) 28%,
    transparent 44%,
    rgba(118, 102, 84, 0.09) 56%,
    transparent 68%,
    rgba(132, 114, 92, 0.11) 82%,
    transparent 100%
  );
  background-size: 100% 1px;
  background-position: bottom;
  background-repeat: no-repeat;
  box-shadow: inset 0 -14px 28px -12px rgba(10, 8, 6, 0.14);
}

.goth-core-stats__identity-inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.45rem;
  text-align: center;
  min-width: 0;
}

.goth-core-stats__portrait {
  flex-shrink: 0;
  width: 3.35rem;
  aspect-ratio: 3 / 4;
}

#goth-core-stats-sidebar .goth-core-stats__portrait img {
  filter: sepia(0.07) contrast(0.96);
}

.goth-core-stats__portrait img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.goth-core-stats__portrait-fallback {
  width: 100%;
  height: 100%;
  min-height: 4rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--g-font-serif);
  font-size: 1.02rem;
  font-weight: 600;
  letter-spacing: 0.06em;
  color: var(--g-ink-muted);
}

.goth-core-stats__name-block {
  width: 100%;
  min-width: 0;
}

.goth-core-stats__name-cn {
  margin: 0;
  font-family: var(--g-font-serif);
  font-size: clamp(0.78rem, 3vw, 0.92rem);
  font-weight: 700;
  line-height: 1.36;
  letter-spacing: 0.035em;
  color: var(--g-ink);
  word-break: break-word;
}

.goth-core-stats__name-sep {
  width: 2.25rem;
  height: 1px;
  margin: 0.35rem auto;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(168, 148, 118, 0.55),
    transparent
  );
  opacity: 0.5;
}

.goth-core-stats__name-ja {
  margin: 0;
  font-family: var(--g-font-serif);
  font-size: clamp(0.66rem, 2.5vw, 0.76rem);
  font-weight: 500;
  font-style: italic;
  line-height: 1.45;
  letter-spacing: 0.03em;
  color: var(--g-ink-faint);
  word-break: break-word;
}

.goth-core-stats__name-single {
  margin: 0;
  font-family: var(--g-font-serif);
  font-size: clamp(0.74rem, 2.8vw, 0.88rem);
  font-weight: 700;
  line-height: 1.36;
  letter-spacing: 0.03em;
  color: var(--g-ink);
  word-break: break-word;
}

/* 标签：褪墨、字距略松；数值：更醒目 */
.goth-core-stats__label {
  display: block;
  font-family: var(--g-font-serif);
  font-size: 0.62rem;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: none;
  color: var(--g-ink-faint);
  opacity: 0.82;
  margin-bottom: 0.22rem;
}

.goth-core-stats__item--hp .goth-core-stats__label,
.goth-core-stats__item--san .goth-core-stats__label {
  font-family: var(--g-font-ui);
  font-size: 0.58rem;
  font-weight: 600;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  opacity: 0.78;
}

.goth-core-stats__item--pollution .goth-core-stats__label,
.goth-core-stats__item--stamina .goth-core-stats__label {
  letter-spacing: 0.16em;
}

/* 登记表刻度槽 + RPG 分层：幽灵上一楼 / 当前填充 / 差分闪烁条 */
.goth-core-stats__bar {
  --g-file-bar-seg: 5px;
  position: relative;
  height: 11px;
  margin-bottom: 0.28rem;
  border-radius: 1px;
  border: 1px solid rgba(34, 28, 22, 0.82);
  box-shadow:
    inset 0 1px 0 rgba(82, 72, 62, 0.22),
    inset 0 -4px 8px rgba(6, 5, 4, 0.58),
    inset 2px 0 6px rgba(8, 6, 5, 0.18);
  background-color: rgba(12, 10, 8, 0.96);
  background-image: repeating-linear-gradient(
    90deg,
    transparent 0,
    transparent calc(var(--g-file-bar-seg) - 1px),
    rgba(10, 8, 6, 0.72) calc(var(--g-file-bar-seg) - 1px),
    rgba(10, 8, 6, 0.72) var(--g-file-bar-seg)
  );
  overflow: hidden;
}

.goth-core-stats__bar::after {
  content: '';
  position: absolute;
  inset: 0;
  z-index: 5;
  pointer-events: none;
  opacity: 0.055;
  mix-blend-mode: overlay;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.1' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23g)' opacity='0.5'/%3E%3C/svg%3E");
  background-size: 80px 80px;
}

.goth-core-stats__bar-ghost {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  z-index: 1;
  max-width: 100%;
  opacity: 0.48;
  pointer-events: none;
  border-radius: 0 1px 1px 0;
  transition: width 0.38s cubic-bezier(0.22, 1, 0.36, 1);
  box-shadow:
    inset 0 -1px 0 rgba(12, 10, 8, 0.35),
    inset 0 1px 0 rgba(255, 252, 245, 0.04);
}

.goth-core-stats__item--hp .goth-core-stats__bar-ghost--hp {
  background-image: repeating-linear-gradient(
    90deg,
    rgba(148, 108, 96, 0.65) 0,
    rgba(148, 108, 96, 0.65) calc(var(--g-file-bar-seg) - 1px),
    rgba(92, 64, 56, 0.78) calc(var(--g-file-bar-seg) - 1px),
    rgba(92, 64, 56, 0.78) var(--g-file-bar-seg)
  );
  background-size: var(--g-file-bar-seg) 100%;
}

.goth-core-stats__item--san .goth-core-stats__bar-ghost--san {
  background-image: repeating-linear-gradient(
    90deg,
    rgba(84, 122, 138, 0.62) 0,
    rgba(84, 122, 138, 0.62) calc(var(--g-file-bar-seg) - 1px),
    rgba(44, 74, 88, 0.76) calc(var(--g-file-bar-seg) - 1px),
    rgba(44, 74, 88, 0.76) var(--g-file-bar-seg)
  );
  background-size: var(--g-file-bar-seg) 100%;
}

.goth-core-stats__item--pollution .goth-core-stats__bar-ghost--pollution {
  background-image: repeating-linear-gradient(
    90deg,
    rgba(118, 114, 72, 0.64) 0,
    rgba(118, 114, 72, 0.64) calc(var(--g-file-bar-seg) - 1px),
    rgba(72, 68, 42, 0.78) calc(var(--g-file-bar-seg) - 1px),
    rgba(72, 68, 42, 0.78) var(--g-file-bar-seg)
  );
  background-size: var(--g-file-bar-seg) 100%;
}

.goth-core-stats__item--stamina .goth-core-stats__bar-ghost--stamina {
  background-image: repeating-linear-gradient(
    90deg,
    rgba(118, 132, 102, 0.62) 0,
    rgba(118, 132, 102, 0.62) calc(var(--g-file-bar-seg) - 1px),
    rgba(74, 88, 62, 0.76) calc(var(--g-file-bar-seg) - 1px),
    rgba(74, 88, 62, 0.76) var(--g-file-bar-seg)
  );
  background-size: var(--g-file-bar-seg) 100%;
}

.goth-core-stats__bar-fill--current {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  z-index: 2;
  max-width: 100%;
  min-width: 0;
  border-radius: 0;
  box-shadow:
    inset 0 -2px 0 rgba(12, 10, 8, 0.55),
    inset 0 1px 0 rgba(255, 252, 245, 0.035);
  background-image: repeating-linear-gradient(
    90deg,
    rgba(148, 134, 112, 0.97) 0,
    rgba(148, 134, 112, 0.97) calc(var(--g-file-bar-seg) - 1px),
    rgba(98, 88, 72, 1) calc(var(--g-file-bar-seg) - 1px),
    rgba(98, 88, 72, 1) var(--g-file-bar-seg)
  );
  background-size: var(--g-file-bar-seg) 100%;
  transition: width 0.38s cubic-bezier(0.22, 1, 0.36, 1);
}

.goth-core-stats__item--hp .goth-core-stats__bar-fill--current {
  background-image: repeating-linear-gradient(
    90deg,
    rgba(128, 92, 82, 0.97) 0,
    rgba(128, 92, 82, 0.97) calc(var(--g-file-bar-seg) - 1px),
    rgba(82, 56, 48, 1) calc(var(--g-file-bar-seg) - 1px),
    rgba(82, 56, 48, 1) var(--g-file-bar-seg)
  );
}

.goth-core-stats__item--san .goth-core-stats__bar-fill--current {
  background-image: repeating-linear-gradient(
    90deg,
    rgba(82, 138, 158, 0.97) 0,
    rgba(82, 138, 158, 0.97) calc(var(--g-file-bar-seg) - 1px),
    rgba(38, 78, 94, 1) calc(var(--g-file-bar-seg) - 1px),
    rgba(38, 78, 94, 1) var(--g-file-bar-seg)
  );
}

.goth-core-stats__item--pollution .goth-core-stats__bar-fill--current {
  background-image: repeating-linear-gradient(
    90deg,
    rgba(138, 132, 78, 0.97) 0,
    rgba(138, 132, 78, 0.97) calc(var(--g-file-bar-seg) - 1px),
    rgba(74, 70, 38, 1) calc(var(--g-file-bar-seg) - 1px),
    rgba(74, 70, 38, 1) var(--g-file-bar-seg)
  );
}

.goth-core-stats__item--stamina .goth-core-stats__bar-fill--current {
  background-image: repeating-linear-gradient(
    90deg,
    rgba(102, 116, 88, 0.97) 0,
    rgba(102, 116, 88, 0.97) calc(var(--g-file-bar-seg) - 1px),
    rgba(62, 76, 52, 1) calc(var(--g-file-bar-seg) - 1px),
    rgba(62, 76, 52, 1) var(--g-file-bar-seg)
  );
}

/* 差分条：与同槽主填充一致的横向栅格刻度（repeating-linear-gradient + --g-file-bar-seg） */
.goth-core-stats__bar-delta-strip {
  position: absolute;
  top: 0;
  bottom: 0;
  z-index: 6;
  pointer-events: none;
  border-radius: 0;
  box-sizing: border-box;
  overflow: hidden;
  background-size: var(--g-file-bar-seg) 100%;
  box-shadow:
    inset 0 -2px 0 rgba(12, 10, 8, 0.52),
    inset 0 1px 0 rgba(255, 252, 245, 0.05);
}

.goth-core-stats__bar-delta-strip--harmful.goth-core-stats__bar-delta-strip--hp {
  background-image: repeating-linear-gradient(
    90deg,
    rgba(228, 128, 108, 0.96) 0,
    rgba(228, 128, 108, 0.96) calc(var(--g-file-bar-seg) - 1px),
    rgba(142, 48, 40, 1) calc(var(--g-file-bar-seg) - 1px),
    rgba(142, 48, 40, 1) var(--g-file-bar-seg)
  );
  box-shadow:
    inset 0 -2px 0 rgba(12, 10, 8, 0.52),
    inset 0 1px 0 rgba(255, 205, 192, 0.2),
    0 0 12px rgba(212, 72, 52, 0.58);
  animation: goth-rpg-strip-flash-hp-harm 1.08s ease-in-out infinite;
}

.goth-core-stats__bar-delta-strip--beneficial.goth-core-stats__bar-delta-strip--hp {
  background-image: repeating-linear-gradient(
    90deg,
    rgba(148, 208, 148, 0.95) 0,
    rgba(148, 208, 148, 0.95) calc(var(--g-file-bar-seg) - 1px),
    rgba(52, 112, 68, 1) calc(var(--g-file-bar-seg) - 1px),
    rgba(52, 112, 68, 1) var(--g-file-bar-seg)
  );
  box-shadow:
    inset 0 -2px 0 rgba(12, 10, 8, 0.48),
    inset 0 1px 0 rgba(220, 248, 215, 0.18),
    0 0 12px rgba(82, 148, 88, 0.52);
  animation: goth-rpg-strip-flash-hp-ben 1.08s ease-in-out infinite;
}

.goth-core-stats__bar-delta-strip--harmful.goth-core-stats__bar-delta-strip--san {
  background-image: repeating-linear-gradient(
    90deg,
    rgba(212, 148, 108, 0.96) 0,
    rgba(212, 148, 108, 0.96) calc(var(--g-file-bar-seg) - 1px),
    rgba(118, 68, 48, 1) calc(var(--g-file-bar-seg) - 1px),
    rgba(118, 68, 48, 1) var(--g-file-bar-seg)
  );
  box-shadow:
    inset 0 -2px 0 rgba(12, 10, 8, 0.52),
    inset 0 1px 0 rgba(255, 220, 188, 0.18),
    0 0 12px rgba(188, 98, 62, 0.48);
  animation: goth-rpg-strip-flash-san-harm 1.12s ease-in-out infinite;
}

.goth-core-stats__bar-delta-strip--beneficial.goth-core-stats__bar-delta-strip--san {
  background-image: repeating-linear-gradient(
    90deg,
    rgba(118, 218, 238, 0.95) 0,
    rgba(118, 218, 238, 0.95) calc(var(--g-file-bar-seg) - 1px),
    rgba(38, 118, 148, 1) calc(var(--g-file-bar-seg) - 1px),
    rgba(38, 118, 148, 1) var(--g-file-bar-seg)
  );
  box-shadow:
    inset 0 -2px 0 rgba(12, 10, 8, 0.48),
    inset 0 1px 0 rgba(210, 248, 255, 0.22),
    0 0 12px rgba(62, 162, 192, 0.52);
  animation: goth-rpg-strip-flash-san-ben 1.12s ease-in-out infinite;
}

.goth-core-stats__bar-delta-strip--harmful.goth-core-stats__bar-delta-strip--pollution {
  background-image: repeating-linear-gradient(
    90deg,
    rgba(198, 162, 58, 0.96) 0,
    rgba(198, 162, 58, 0.96) calc(var(--g-file-bar-seg) - 1px),
    rgba(98, 72, 28, 1) calc(var(--g-file-bar-seg) - 1px),
    rgba(98, 72, 28, 1) var(--g-file-bar-seg)
  );
  box-shadow:
    inset 0 -2px 0 rgba(12, 10, 8, 0.52),
    inset 0 1px 0 rgba(255, 235, 168, 0.16),
    0 0 12px rgba(168, 128, 38, 0.48);
  animation: goth-rpg-strip-flash-pol-harm 1.06s ease-in-out infinite;
}

.goth-core-stats__bar-delta-strip--beneficial.goth-core-stats__bar-delta-strip--pollution {
  background-image: repeating-linear-gradient(
    90deg,
    rgba(138, 212, 158, 0.95) 0,
    rgba(138, 212, 158, 0.95) calc(var(--g-file-bar-seg) - 1px),
    rgba(42, 108, 68, 1) calc(var(--g-file-bar-seg) - 1px),
    rgba(42, 108, 68, 1) var(--g-file-bar-seg)
  );
  box-shadow:
    inset 0 -2px 0 rgba(12, 10, 8, 0.48),
    inset 0 1px 0 rgba(218, 255, 228, 0.18),
    0 0 12px rgba(58, 148, 92, 0.48);
  animation: goth-rpg-strip-flash-pol-ben 1.06s ease-in-out infinite;
}

.goth-core-stats__bar-delta-strip--harmful.goth-core-stats__bar-delta-strip--stamina {
  background-image: repeating-linear-gradient(
    90deg,
    rgba(222, 168, 82, 0.96) 0,
    rgba(222, 168, 82, 0.96) calc(var(--g-file-bar-seg) - 1px),
    rgba(132, 82, 30, 1) calc(var(--g-file-bar-seg) - 1px),
    rgba(132, 82, 30, 1) var(--g-file-bar-seg)
  );
  box-shadow:
    inset 0 -2px 0 rgba(12, 10, 8, 0.52),
    inset 0 1px 0 rgba(255, 228, 188, 0.22),
    0 0 12px rgba(198, 122, 42, 0.5);
  animation: goth-rpg-strip-flash-stam-harm 1.1s ease-in-out infinite;
}

.goth-core-stats__bar-delta-strip--beneficial.goth-core-stats__bar-delta-strip--stamina {
  background-image: repeating-linear-gradient(
    90deg,
    rgba(192, 232, 118, 0.95) 0,
    rgba(192, 232, 118, 0.95) calc(var(--g-file-bar-seg) - 1px),
    rgba(78, 122, 44, 1) calc(var(--g-file-bar-seg) - 1px),
    rgba(78, 122, 44, 1) var(--g-file-bar-seg)
  );
  box-shadow:
    inset 0 -2px 0 rgba(12, 10, 8, 0.48),
    inset 0 1px 0 rgba(238, 255, 205, 0.18),
    0 0 12px rgba(118, 172, 58, 0.5);
  animation: goth-rpg-strip-flash-stam-ben 1.1s ease-in-out infinite;
}

.goth-core-stats__bar-fill--rpg-pulse.goth-core-stats__bar-fill--rpg-harmful.goth-core-stats__bar-fill--rpg-hp {
  animation: goth-rpg-fill-pulse-hp-harm 1.08s ease-in-out infinite;
}

.goth-core-stats__bar-fill--rpg-pulse.goth-core-stats__bar-fill--rpg-beneficial.goth-core-stats__bar-fill--rpg-hp {
  animation: goth-rpg-fill-pulse-hp-ben 1.08s ease-in-out infinite;
}

.goth-core-stats__bar-fill--rpg-pulse.goth-core-stats__bar-fill--rpg-harmful.goth-core-stats__bar-fill--rpg-san {
  animation: goth-rpg-fill-pulse-san-harm 1.12s ease-in-out infinite;
}

.goth-core-stats__bar-fill--rpg-pulse.goth-core-stats__bar-fill--rpg-beneficial.goth-core-stats__bar-fill--rpg-san {
  animation: goth-rpg-fill-pulse-san-ben 1.12s ease-in-out infinite;
}

.goth-core-stats__bar-fill--rpg-pulse.goth-core-stats__bar-fill--rpg-harmful.goth-core-stats__bar-fill--rpg-pollution {
  animation: goth-rpg-fill-pulse-pol-harm 1.06s ease-in-out infinite;
}

.goth-core-stats__bar-fill--rpg-pulse.goth-core-stats__bar-fill--rpg-beneficial.goth-core-stats__bar-fill--rpg-pollution {
  animation: goth-rpg-fill-pulse-pol-ben 1.06s ease-in-out infinite;
}

.goth-core-stats__bar-fill--rpg-pulse.goth-core-stats__bar-fill--rpg-harmful.goth-core-stats__bar-fill--rpg-stamina {
  animation: goth-rpg-fill-pulse-stam-harm 1.1s ease-in-out infinite;
}

.goth-core-stats__bar-fill--rpg-pulse.goth-core-stats__bar-fill--rpg-beneficial.goth-core-stats__bar-fill--rpg-stamina {
  animation: goth-rpg-fill-pulse-stam-ben 1.1s ease-in-out infinite;
}

@keyframes goth-rpg-strip-flash-hp-harm {
  0%,
  100% {
    opacity: 0.82;
    filter: brightness(1);
  }
  50% {
    opacity: 1;
    filter: brightness(1.22);
  }
}

@keyframes goth-rpg-strip-flash-hp-ben {
  0%,
  100% {
    opacity: 0.8;
    filter: brightness(1.02);
  }
  50% {
    opacity: 1;
    filter: brightness(1.2);
  }
}

@keyframes goth-rpg-strip-flash-san-harm {
  0%,
  100% {
    opacity: 0.8;
    filter: brightness(0.98) saturate(1.05);
  }
  50% {
    opacity: 1;
    filter: brightness(1.18) saturate(1.12);
  }
}

@keyframes goth-rpg-strip-flash-san-ben {
  0%,
  100% {
    opacity: 0.78;
    filter: brightness(1);
  }
  50% {
    opacity: 1;
    filter: brightness(1.16);
  }
}

@keyframes goth-rpg-strip-flash-pol-harm {
  0%,
  100% {
    opacity: 0.82;
    filter: brightness(1);
  }
  50% {
    opacity: 1;
    filter: brightness(1.2);
  }
}

@keyframes goth-rpg-strip-flash-pol-ben {
  0%,
  100% {
    opacity: 0.78;
    filter: brightness(1.02);
  }
  50% {
    opacity: 1;
    filter: brightness(1.18);
  }
}

@keyframes goth-rpg-strip-flash-stam-harm {
  0%,
  100% {
    opacity: 0.82;
    filter: brightness(1);
  }
  50% {
    opacity: 1;
    filter: brightness(1.2);
  }
}

@keyframes goth-rpg-strip-flash-stam-ben {
  0%,
  100% {
    opacity: 0.78;
    filter: brightness(1.02);
  }
  50% {
    opacity: 1;
    filter: brightness(1.17);
  }
}

@keyframes goth-rpg-fill-pulse-hp-harm {
  0%,
  100% {
    filter: brightness(1);
  }
  50% {
    filter: brightness(1.06);
  }
}

@keyframes goth-rpg-fill-pulse-hp-ben {
  0%,
  100% {
    filter: brightness(1);
  }
  50% {
    filter: brightness(1.08);
  }
}

@keyframes goth-rpg-fill-pulse-san-harm {
  0%,
  100% {
    filter: brightness(1) saturate(1);
  }
  50% {
    filter: brightness(1.05) saturate(1.06);
  }
}

@keyframes goth-rpg-fill-pulse-san-ben {
  0%,
  100% {
    filter: brightness(1);
  }
  50% {
    filter: brightness(1.06);
  }
}

@keyframes goth-rpg-fill-pulse-pol-harm {
  0%,
  100% {
    filter: brightness(1);
  }
  50% {
    filter: brightness(1.05);
  }
}

@keyframes goth-rpg-fill-pulse-pol-ben {
  0%,
  100% {
    filter: brightness(1);
  }
  50% {
    filter: brightness(1.07);
  }
}

@keyframes goth-rpg-fill-pulse-stam-harm {
  0%,
  100% {
    filter: brightness(1);
  }
  50% {
    filter: brightness(1.06);
  }
}

@keyframes goth-rpg-fill-pulse-stam-ben {
  0%,
  100% {
    filter: brightness(1);
  }
  50% {
    filter: brightness(1.07);
  }
}

@media (prefers-reduced-motion: reduce) {
  .goth-core-stats__bar-delta-strip,
  .goth-core-stats__bar-fill--rpg-pulse {
    animation: none !important;
  }

  .goth-stat-mvu-delta--flash {
    animation: none !important;
  }
}

.goth-core-stats__value-row {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 0.28rem 0.4rem;
}

.goth-stat-mvu-delta {
  font-family: var(--g-font-ui);
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  line-height: 1.2;
  white-space: nowrap;
}

.goth-stat-mvu-delta--pos {
  color: var(--g-success, #5d6b5d);
  text-shadow: 0 0 12px rgba(110, 138, 108, 0.35);
}

.goth-stat-mvu-delta--neg {
  color: var(--g-danger, #7a5f5f);
  text-shadow: 0 0 12px rgba(138, 96, 92, 0.28);
}

/* SAN：栏内差分标签与钢青条、珊瑚侵蚀条同色相看齐 */
.goth-core-stats__item--san .goth-stat-mvu-delta--pos {
  color: #5eb8cc;
  text-shadow: 0 0 12px rgba(72, 158, 182, 0.38);
}

.goth-core-stats__item--san .goth-stat-mvu-delta--neg {
  color: #c89472;
  text-shadow: 0 0 12px rgba(168, 108, 72, 0.32);
}

/* 污染：橄榄基底上的净化绿 / 淤积琥珀 */
.goth-core-stats__item--pollution .goth-stat-mvu-delta--pos {
  color: #72c892;
  text-shadow: 0 0 12px rgba(72, 168, 118, 0.35);
}

.goth-core-stats__item--pollution .goth-stat-mvu-delta--neg {
  color: #d4b048;
  text-shadow: 0 0 12px rgba(168, 138, 48, 0.32);
}

.goth-stat-mvu-delta--flash {
  animation: goth-rpg-delta-text-glint 1.15s ease-in-out infinite;
}

@keyframes goth-rpg-delta-text-glint {
  0%,
  100% {
    opacity: 1;
    filter: brightness(1);
  }
  50% {
    opacity: 0.88;
    filter: brightness(1.28);
  }
}

.goth-stat-mvu-delta--funds {
  flex-basis: 100%;
  margin-left: 0;
  margin-top: 0.12rem;
}

.goth-core-stats__value {
  font-family: var(--g-font-mono);
  font-size: 0.9rem;
  font-weight: 700;
  letter-spacing: 0.045em;
  font-variant-numeric: tabular-nums;
  color: var(--g-text-title);
}

.goth-core-stats__item--hp .goth-core-stats__value {
  color: #c4a898;
}

.goth-core-stats__item--san .goth-core-stats__value {
  color: #8ec8d8;
}

.goth-core-stats__item--pollution .goth-core-stats__value {
  color: #c8bf78;
}

.goth-core-stats__item--stamina .goth-core-stats__value {
  color: #b0c4a4;
}

/* 美元资金：凹槽卡片 + 叠币图标，整数美元与美分分列 */
.goth-core-stats__funds {
  margin-top: 0.28rem;
  padding: 0.48rem 0.45rem 0.5rem;
  border-radius: 4px;
  border: 1px solid rgba(38, 34, 30, 0.82);
  background: linear-gradient(168deg, rgba(44, 40, 36, 0.62) 0%, rgba(22, 20, 18, 0.82) 100%);
  box-shadow:
    inset 0 2px 10px rgba(6, 5, 4, 0.38),
    inset 0 1px 0 rgba(92, 84, 74, 0.07),
    0 1px 0 rgba(26, 22, 18, 0.45);
}

.goth-core-stats__funds-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  min-width: 0;
}

.goth-core-stats__funds-icon-wrap {
  flex-shrink: 0;
  width: 2.15rem;
  height: 2.15rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 3px;
  color: rgba(158, 142, 118, 0.52);
  background: rgba(18, 16, 14, 0.45);
  box-shadow:
    inset 0 2px 6px rgba(5, 4, 3, 0.42),
    inset 0 1px 0 rgba(72, 66, 58, 0.08);
}

.goth-core-stats__funds-icon {
  width: 1.55rem;
  height: 1.55rem;
  display: block;
}

.goth-core-stats__funds-main {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 0.12rem;
}

.goth-core-stats__funds-label {
  font-family: var(--g-font-ui);
  font-size: var(--g-label-size);
  font-weight: 600;
  letter-spacing: var(--g-label-tracking);
  text-transform: uppercase;
  color: rgba(138, 128, 112, 0.78);
}

.goth-core-stats__funds-amount {
  display: flex;
  align-items: baseline;
  flex-wrap: wrap;
  gap: 0.38rem 0.45rem;
}

.goth-core-stats__funds-dollar-part {
  font-weight: 700;
  font-size: 0.98rem;
  letter-spacing: 0.04em;
  font-variant-numeric: tabular-nums;
  color: rgba(228, 218, 202, 0.96);
}

.goth-core-stats__funds-sign {
  margin-right: 0.06em;
  font-weight: 700;
  color: rgba(188, 168, 148, 0.92);
}

.goth-core-stats__funds-dollar-mark {
  margin-right: 0.08em;
  font-weight: 600;
  color: rgba(178, 162, 138, 0.88);
}

.goth-core-stats__funds-cent-part {
  font-weight: 600;
  font-size: 0.76rem;
  letter-spacing: 0.06em;
  font-variant-numeric: tabular-nums;
  color: rgba(196, 182, 152, 0.88);
  padding: 0.12rem 0.28rem;
  border-radius: 2px;
  background: rgba(14, 12, 10, 0.42);
  box-shadow: inset 0 1px 0 rgba(62, 56, 48, 0.12);
}
</style>
