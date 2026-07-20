<template>
  <div class="world-info-ecal" :class="{ 'world-info-ecal--compact': compact }">
    <div class="world-info-ecal__glow">
      <div class="world-info-ecal__panel">
        <div class="world-info-ecal__panel-shine" aria-hidden="true" />
        <div class="world-info-ecal__panel-floor" aria-hidden="true" />

        <div class="world-info-ecal__head-row">
          <h3 class="strip-title world-info-ecal__head">
            <svg viewBox="0 0 24 24" aria-hidden="true" class="world-info-ecal__head-icon">
              <path
                d="M12 2a10 10 0 1 0 0.01 0zM2 12h20M12 2a15 15 0 0 1 0 20M12 2a15 15 0 0 0 0 20"
                fill="none"
                stroke="currentColor"
                stroke-width="1.8"
                stroke-linecap="round"
              />
            </svg>
            <span>世界信息</span>
          </h3>
        </div>

        <div class="world-info-ecal__screen">
          <div class="world-info-ecal__screen-inner">
            <div class="world-info-ecal__hero">
              <p class="world-info-ecal__time" aria-label="当前时间">
                <span class="world-info-ecal__time-main">{{ timeParts.main }}</span>
                <span v-if="timeParts.suffix" class="world-info-ecal__time-suffix">{{ timeParts.suffix }}</span>
              </p>
              <p class="world-info-ecal__day">{{ dayDisplay }}</p>
              <div class="world-info-ecal__weather-icon" :class="`world-info-ecal__weather-icon--${weatherToken}`" aria-hidden="true">
                <AdvenWeatherIcon :token="weatherToken" />
              </div>
            </div>
          </div>
        </div>

        <div class="world-info-ecal__meta">
          <span class="world-info-ecal__chip">
            <span class="world-info-ecal__chip-k">天气</span>
            <span class="world-info-ecal__chip-v">{{ weatherDisplay }}</span>
          </span>
          <span class="world-info-ecal__chip">
            <span class="world-info-ecal__chip-k">温度</span>
            <span class="world-info-ecal__chip-v">{{ degreeDisplay }}</span>
          </span>
          <span class="world-info-ecal__chip world-info-ecal__chip--wide">
            <span class="world-info-ecal__chip-k">地点</span>
            <span class="world-info-ecal__chip-v">{{ locationDisplay }}</span>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import AdvenWeatherIcon from './AdvenWeatherIcon.vue';
import type { WorldState } from './adven.types';
import type { WeatherFxToken } from './utils/worldFxTokens';

const props = defineProps<{
  worldState: WorldState | null;
  weatherToken: WeatherFxToken;
  /** 面板页等紧凑布局：缩小标题区与主数字，省略顶栏「世界信息」标题行 */
  compact?: boolean;
}>();

const unknown = '未知';

function splitTimeDisplay(raw: string | null | undefined): { main: string; suffix: string } {
  const s = (raw ?? '').trim();
  if (!s) return { main: '—', suffix: '' };
  const ampm = s.match(/^(.+?)\s+(AM|PM|am|pm)\s*$/);
  if (ampm) return { main: ampm[1].trim(), suffix: ampm[2].toUpperCase() === 'PM' ? 'PM' : 'AM' };
  const cn = s.match(/^(.+?)\s+(上午|下午|中午|凌晨|晚间|深夜)\s*$/);
  if (cn) return { main: cn[1].trim(), suffix: cn[2] };
  return { main: s, suffix: '' };
}

const timeParts = computed(() => splitTimeDisplay(props.worldState?.time));

const dayDisplay = computed(() => {
  const d = (props.worldState?.day ?? '').trim();
  return d || unknown;
});

const weatherDisplay = computed(() => (props.worldState?.weather ?? '').trim() || unknown);
const degreeDisplay = computed(() => (props.worldState?.degree ?? '').trim() || unknown);
const locationDisplay = computed(() => (props.worldState?.location ?? '').trim() || unknown);
</script>

<style scoped>
.world-info-ecal {
  width: 100%;
  min-width: 0;
  overflow: visible;
}

/* 外层：渐变壳 + 投影（无 3D/位移，避免 hover 时发糊） */
.world-info-ecal__glow {
  position: relative;
  border-radius: 16px;
  padding: 3px;
  background: linear-gradient(
    148deg,
    color-mix(in hsl, var(--mint, hsl(156deg 48% 62%)) 50%, var(--strip-title)) 0%,
    color-mix(in hsl, var(--strip-title) 38%, var(--bg-2)) 42%,
    color-mix(in hsl, var(--line) 32%, var(--bg-1)) 72%,
    color-mix(in hsl, var(--bg-2) 55%, hsl(220deg 20% 14%)) 100%
  );
  box-shadow:
    0 0 0 1px color-mix(in hsl, var(--strip-border) 55%, transparent),
    0 2px 0 color-mix(in hsl, var(--ink) 10%, transparent) inset,
    0 10px 28px hsl(0deg 0% 0% / 28%),
    0 4px 10px hsl(0deg 0% 0% / 18%),
    0 0 32px color-mix(in hsl, var(--strip-title) 14%, transparent);
  transition: box-shadow 0.35s cubic-bezier(0.33, 1, 0.32, 1);
}

@media (prefers-reduced-motion: reduce) {
  .world-info-ecal__glow {
    transition: none;
  }
}

.world-info-ecal:hover .world-info-ecal__glow {
  box-shadow:
    0 0 0 1px color-mix(in hsl, var(--strip-title) 32%, var(--strip-border)),
    0 2px 0 color-mix(in hsl, var(--ink) 12%, transparent) inset,
    0 14px 36px hsl(0deg 0% 0% / 30%),
    0 5px 12px hsl(0deg 0% 0% / 20%),
    0 0 40px color-mix(in hsl, var(--mint, hsl(156deg 48% 62%)) 16%, transparent);
}

/* 主面板：分层高光 + 底部暗角（立体感） */
.world-info-ecal__panel {
  position: relative;
  isolation: isolate;
  border-radius: 13px;
  overflow: visible;
  padding: 9px 11px 11px;
  background: linear-gradient(
    168deg,
    color-mix(in hsl, var(--bg-1) 92%, hsl(218deg 22% 14%)) 0%,
    color-mix(in hsl, var(--bg-0) 96%, hsl(225deg 28% 7%)) 48%,
    color-mix(in hsl, var(--bg-0) 88%, hsl(230deg 25% 6%)) 100%
  );
  box-shadow:
    inset 0 1px 0 color-mix(in hsl, var(--ink) 14%, transparent),
    inset 0 -1px 0 hsl(0deg 0% 0% / 35%);
}

.world-info-ecal__panel-shine {
  position: absolute;
  inset: 0;
  border-radius: 13px;
  pointer-events: none;
  z-index: 0;
  background: linear-gradient(
    155deg,
    hsl(0deg 0% 100% / 0.11) 0%,
    hsl(0deg 0% 100% / 0.03) 38%,
    transparent 52%
  );
}

.world-info-ecal__panel-floor {
  position: absolute;
  inset: auto 0 0 0;
  height: 58%;
  border-radius: 0 0 13px 13px;
  pointer-events: none;
  z-index: 0;
  background: linear-gradient(to top, hsl(0deg 0% 0% / 0.28) 0%, transparent 72%);
}

.world-info-ecal__head-row {
  position: relative;
  z-index: 1;
  margin-bottom: 2px;
  padding-bottom: 6px;
  border-bottom: 1px solid color-mix(in hsl, var(--line) 38%, transparent);
  box-shadow: 0 1px 0 color-mix(in hsl, var(--ink) 6%, transparent);
}

.world-info-ecal__head {
  margin: 0;
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  font-weight: 700;
  color: var(--strip-title);
  letter-spacing: 0.04em;
  opacity: 0.95;
}

.world-info-ecal__head-icon {
  width: 15px;
  height: 15px;
  flex-shrink: 0;
  opacity: 0.9;
}

/* 内凹「显示屏」外框 */
.world-info-ecal__screen {
  position: relative;
  z-index: 1;
  margin-top: 8px;
  padding: 4px;
  border-radius: 12px;
  background: linear-gradient(
    145deg,
    color-mix(in hsl, var(--line) 28%, hsl(0deg 0% 0% / 55%)) 0%,
    color-mix(in hsl, var(--bg-2) 25%, hsl(0deg 0% 0% / 70%)) 100%
  );
  box-shadow:
    0 1px 0 color-mix(in hsl, var(--ink) 10%, transparent),
    inset 0 3px 10px hsl(0deg 0% 0% / 45%),
    inset 0 1px 0 hsl(0deg 0% 100% / 0.05);
}

.world-info-ecal__screen-inner {
  position: relative;
  border-radius: 9px;
  padding: 11px 13px 13px;
  background: linear-gradient(
    185deg,
    color-mix(in hsl, var(--bg-0) 75%, hsl(225deg 30% 5%)) 0%,
    color-mix(in hsl, var(--bg-0) 92%, hsl(220deg 25% 8%)) 55%,
    color-mix(in hsl, var(--bg-0) 85%, hsl(218deg 28% 6%)) 100%
  );
  box-shadow:
    inset 0 1px 0 hsl(0deg 0% 100% / 0.07),
    inset 0 -12px 24px hsl(0deg 0% 0% / 0.38);
  border: 1px solid color-mix(in hsl, var(--line) 22%, transparent);
}

.world-info-ecal__hero {
  position: relative;
  padding-right: 42px;
  min-height: 74px;
}

.world-info-ecal__time {
  margin: 0;
  line-height: 1.05;
  font-variant-numeric: tabular-nums;
  letter-spacing: 0.03em;
  color: color-mix(in hsl, var(--ink) 97%, hsl(210deg 45% 97%));
  text-shadow:
    0 1px 0 color-mix(in hsl, var(--strip-title) 12%, hsl(0deg 0% 0% / 55%)),
    0 2px 3px hsl(0deg 0% 0% / 35%);
}

.world-info-ecal__time-main {
  font-size: clamp(28px, 5.5vw, 40px);
  font-weight: 800;
}

.world-info-ecal__time-suffix {
  margin-left: 6px;
  font-size: 13px;
  font-weight: 700;
  opacity: 0.9;
  vertical-align: 0.38em;
  letter-spacing: 0.06em;
}

.world-info-ecal__day {
  margin: 8px 0 0;
  font-size: 12px;
  font-weight: 600;
  color: color-mix(in hsl, var(--ink) 82%, var(--strip-title) 18%);
  line-height: 1.4;
  word-break: break-word;
  opacity: 1;
  letter-spacing: 0.02em;
  text-shadow: 0 1px 2px hsl(0deg 0% 0% / 32%);
}

.world-info-ecal__weather-icon {
  position: absolute;
  right: 2px;
  top: 2px;
  width: 38px;
  height: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 6px;
  border-radius: 12px;
  color: color-mix(in hsl, var(--strip-title) 95%, var(--ink-soft));
  background: linear-gradient(
    160deg,
    color-mix(in hsl, var(--strip-title) 18%, transparent) 0%,
    color-mix(in hsl, var(--bg-0) 60%, transparent) 100%
  );
  box-shadow:
    0 2px 6px hsl(0deg 0% 0% / 28%),
    inset 0 1px 0 hsl(0deg 0% 100% / 0.12);
  opacity: 0.98;
  transition: opacity 0.25s ease, box-shadow 0.25s ease;
}

.world-info-ecal:hover .world-info-ecal__weather-icon {
  opacity: 1;
  box-shadow:
    0 3px 8px hsl(0deg 0% 0% / 30%),
    inset 0 1px 0 hsl(0deg 0% 100% / 0.14);
}

@media (prefers-reduced-motion: reduce) {
  .world-info-ecal__weather-icon {
    transition: none;
  }
}

.world-info-ecal__weather-icon svg {
  width: 100%;
  height: 100%;
}

/* 底座托盘：略抬升、内凹承托 chip */
.world-info-ecal__meta {
  position: relative;
  z-index: 1;
  display: flex;
  flex-wrap: wrap;
  gap: 7px;
  margin-top: 12px;
  padding: 9px 8px 8px;
  border-radius: 11px;
  background: linear-gradient(
    180deg,
    color-mix(in hsl, var(--strip-bg) 45%, hsl(0deg 0% 0% / 0.22)) 0%,
    color-mix(in hsl, var(--bg-0) 70%, hsl(0deg 0% 0% / 0.35)) 100%
  );
  border: 1px solid color-mix(in hsl, var(--line) 32%, transparent);
  box-shadow:
    inset 0 1px 0 hsl(0deg 0% 100% / 0.05),
    inset 0 -2px 10px hsl(0deg 0% 0% / 0.22),
    0 3px 10px hsl(0deg 0% 0% / 15%);
}

.world-info-ecal__chip {
  display: inline-flex;
  align-items: baseline;
  gap: 6px;
  padding: 6px 10px;
  border-radius: 9px;
  font-size: 12px;
  line-height: 1.35;
  max-width: 100%;
  background: linear-gradient(
    185deg,
    color-mix(in hsl, var(--card) 70%, var(--bg-1)) 0%,
    color-mix(in hsl, var(--bg-0) 88%, var(--bg-1)) 100%
  );
  border: 1px solid color-mix(in hsl, var(--strip-border) 42%, transparent);
  box-shadow:
    0 2px 5px hsl(0deg 0% 0% / 22%),
    0 1px 0 hsl(0deg 0% 100% / 0.06) inset,
    inset 0 -1px 0 hsl(0deg 0% 0% / 0.12);
  transition: box-shadow 0.22s ease;
}

.world-info-ecal:hover .world-info-ecal__chip {
  box-shadow:
    0 3px 8px hsl(0deg 0% 0% / 26%),
    0 1px 0 hsl(0deg 0% 100% / 0.08) inset;
}

@media (prefers-reduced-motion: reduce) {
  .world-info-ecal__chip {
    transition: none;
  }
}

.world-info-ecal__chip--wide {
  flex: 1 1 100%;
  min-width: 0;
}

.world-info-ecal__chip-k {
  flex-shrink: 0;
  color: var(--ink-soft);
  font-weight: 700;
  font-size: 11px;
  letter-spacing: 0.04em;
  opacity: 0.88;
}

.world-info-ecal__chip-v {
  color: var(--ink);
  font-weight: 600;
  overflow-wrap: anywhere;
  word-break: break-word;
}

/* 面板页顶栏：单行高度内展示时间与天气 */
.world-info-ecal--compact .world-info-ecal__glow {
  padding: 2px;
}

.world-info-ecal--compact .world-info-ecal__panel {
  padding: 6px 8px 8px;
}

.world-info-ecal--compact .world-info-ecal__head-row {
  display: none;
}

.world-info-ecal--compact .world-info-ecal__screen {
  margin-top: 0;
  padding: 3px;
}

.world-info-ecal--compact .world-info-ecal__screen-inner {
  padding: 7px 9px 9px;
}

.world-info-ecal--compact .world-info-ecal__hero {
  min-height: 52px;
  padding-right: 34px;
}

.world-info-ecal--compact .world-info-ecal__time-main {
  font-size: clamp(20px, 3.2vw, 30px);
}

.world-info-ecal--compact .world-info-ecal__time-suffix {
  font-size: 11px;
}

.world-info-ecal--compact .world-info-ecal__day {
  margin-top: 4px;
  font-size: 11px;
}

.world-info-ecal--compact .world-info-ecal__weather-icon {
  width: 30px;
  height: 30px;
  padding: 4px;
  top: 0;
  right: 0;
}

.world-info-ecal--compact .world-info-ecal__meta {
  margin-top: 8px;
  padding: 6px 6px 6px;
  gap: 5px;
}

.world-info-ecal--compact .world-info-ecal__chip-k {
  font-size: 10px;
}

.world-info-ecal--compact .world-info-ecal__chip-v {
  font-size: 12px;
}

@media (max-width: 520px) {
  .world-info-ecal__hero {
    padding-right: 38px;
    min-height: 70px;
  }

  .world-info-ecal__weather-icon {
    width: 34px;
    height: 34px;
    padding: 5px;
  }

  .world-info-ecal__meta {
    flex-direction: column;
    padding: 8px;
  }

  .world-info-ecal__chip--wide {
    flex-basis: auto;
  }
}
</style>
