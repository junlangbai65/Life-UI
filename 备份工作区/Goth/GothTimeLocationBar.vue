<template>
  <section
    id="goth-time-location-bar"
    class="goth-time-loc-bar"
    aria-labelledby="goth-time-loc-heading"
  >
    <h2 id="goth-time-loc-heading" class="visually-hidden">时间与地点</h2>

    <div class="goth-time-loc-bar__block goth-time-loc-bar__block--time">
      <div class="goth-time-loc-bar__block-head">
        <span class="goth-time-loc-bar__plate-mark" aria-hidden="true" />
        <p class="goth-time-loc-bar__label">DATE</p>
        <GothFloorNavigator class="goth-time-loc-bar__floor-nav" />
      </div>
      <div class="goth-time-loc-bar__date-row">
        <p class="goth-time-loc-bar__date goth-mono goth-time-loc-bar__line--emboss-mono">{{ tw.date }} · {{ tw.weekday }}</p>
        <div class="goth-time-loc-bar__lcd-slot">
          <GothNarrativeClock :time="narrativeClock" />
        </div>
      </div>
      <div class="goth-time-loc-bar__weather-row">
        <GothWeatherIcon class="goth-time-loc-bar__wx" :variant="wxVariant" />
        <div class="goth-time-loc-bar__weather-copy">
          <p class="goth-time-loc-bar__period-line">
            <span class="goth-time-loc-bar__period-label">{{ tw.period }}</span>
            <span class="goth-time-loc-bar__weather-dot" aria-hidden="true">·</span>
            <span class="goth-time-loc-bar__weather-name">{{ tw.weather }}</span>
          </p>
        </div>
        <div class="goth-time-loc-bar__degree-slot">
          <GothNarrativeDegree :value="narrativeDegree" />
        </div>
      </div>
    </div>

    <div class="goth-time-loc-bar__ridge" aria-hidden="true">
      <span class="goth-time-loc-bar__ridge-cap goth-time-loc-bar__ridge-cap--top" />
      <span class="goth-time-loc-bar__ridge-line" />
      <span class="goth-time-loc-bar__ridge-dots">
        <span /><span /><span />
      </span>
      <span class="goth-time-loc-bar__ridge-line" />
      <span class="goth-time-loc-bar__ridge-cap goth-time-loc-bar__ridge-cap--bottom" />
    </div>

    <div class="goth-time-loc-bar__block goth-time-loc-bar__block--place" role="group" aria-label="当前位置">
      <div class="goth-time-loc-bar__block-head">
        <span class="goth-time-loc-bar__plate-mark" aria-hidden="true" />
        <p class="goth-time-loc-bar__label">LOCATION</p>
      </div>
      <p class="goth-time-loc-bar__place goth-time-loc-bar__line--emboss-serif">{{ map.region }}</p>
      <p class="goth-time-loc-bar__sub goth-mono goth-time-loc-bar__line--emboss-mono-sub">{{ map.location }} · {{ map.subLocation }}</p>
      <GothPresenceStrip v-if="narrativePresence.length > 0" :names="narrativePresence" />
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, inject } from 'vue';
import GothFloorNavigator from './GothFloorNavigator.vue';
import GothNarrativeClock from './GothNarrativeClock.vue';
import GothNarrativeDegree from './GothNarrativeDegree.vue';
import GothPresenceStrip from './GothPresenceStrip.vue';
import GothWeatherIcon from './GothWeatherIcon.vue';
import { gothStateKey } from './gothStateContext';
import { inferGothWeatherVariant } from './utils/gothWeatherVariant';

const state = inject(gothStateKey);
if (!state) throw new Error('未找到 Goth 状态上下文。');

const tw = computed(() => state.snapshot.value.timeWeather);
const map = computed(() => state.snapshot.value.map);
const wxVariant = computed(() => inferGothWeatherVariant(tw.value.weather));
const narrativeClock = computed(() => state.narrativeClock.value);
const narrativeDegree = computed(() => state.narrativeDegree.value);
const narrativePresence = computed(() => state.narrativePresence.value);
</script>

<style scoped>
/* 档案仪器顶栏：双读数窗 + 分隔脊；区位烫金立体字 + 天气 SVG（参考案例云层/降水结构） */
.goth-time-loc-bar {
  --tl-chassis-top: rgba(56, 52, 46, 0.97);
  --tl-chassis-bot: rgba(28, 26, 22, 1);
  --tl-well-top: rgba(48, 44, 40, 0.42);
  --tl-well-bot: rgba(22, 20, 18, 0.78);
  --tl-ink-label: rgba(118, 112, 102, 0.72);
  --tl-period: rgba(148, 138, 118, 0.9);
  --tl-gold-highlight: rgba(255, 248, 232, 0.22);
  --tl-gold-shadow: rgba(4, 3, 2, 0.62);

  position: sticky;
  top: 0;
  z-index: 8;
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
  align-items: stretch;
  gap: 0;
  padding: 0.58rem 0.68rem;
  border-radius: var(--g-radius);
  border: 1px solid rgba(22, 18, 15, 0.92);
  background: linear-gradient(180deg, var(--tl-chassis-top) 0%, var(--tl-chassis-bot) 72%, #1a1815 100%);
  box-shadow:
    inset 0 1px 0 rgba(82, 74, 66, 0.09),
    inset 0 -18px 36px rgba(6, 5, 4, 0.42),
    0 6px 18px rgba(5, 4, 3, 0.34),
    0 1px 0 rgba(48, 42, 36, 0.35);
}

/* 嵌入 App 顶区机箱：去掉重复外壳，由 .goth-shell-top--integrated 统一承托 */
.goth-time-loc-bar.goth-time-loc-bar--embedded {
  position: relative;
  top: auto;
  z-index: auto;
  padding: 0;
  border: none;
  border-radius: 0;
  background: transparent;
  box-shadow: none;
}

.goth-time-loc-bar.goth-time-loc-bar--embedded::before {
  display: none;
}

.goth-time-loc-bar::before {
  content: '';
  position: absolute;
  inset: 3px;
  border-radius: calc(var(--g-radius) - 2px);
  pointer-events: none;
  opacity: 1;
  box-shadow: inset 0 0 0 1px rgba(14, 12, 10, 0.55);
}

.goth-time-loc-bar__block {
  position: relative;
  min-width: 0;
  padding: 0.48rem 0.58rem;
  border-radius: 4px;
  background: linear-gradient(178deg, var(--tl-well-top) 0%, var(--tl-well-bot) 100%);
  border: 1px solid rgba(18, 16, 14, 0.88);
  box-shadow:
    inset 0 2px 3px rgba(255, 248, 236, 0.035),
    inset 0 1px 0 rgba(68, 62, 54, 0.08),
    inset 0 -12px 26px rgba(5, 4, 3, 0.38),
    inset 0 0 0 1px rgba(12, 10, 8, 0.65),
    0 0 0 1px rgba(72, 64, 54, 0.18),
    0 5px 12px rgba(6, 5, 4, 0.18);
}

.goth-time-loc-bar__block::before {
  content: '';
  position: absolute;
  left: 0.42rem;
  right: 0.42rem;
  top: 0;
  height: 1px;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(196, 182, 150, 0.22) 22%,
    rgba(92, 82, 68, 0.32) 50%,
    rgba(196, 182, 150, 0.16) 78%,
    transparent 100%
  );
  pointer-events: none;
}

.goth-time-loc-bar__block::after {
  content: '';
  position: absolute;
  inset: 5px;
  border-radius: 2px;
  pointer-events: none;
  box-shadow:
    inset 0 0 0 1px rgba(196, 182, 150, 0.06),
    inset 0 4px 14px rgba(4, 3, 2, 0.28);
  opacity: 0.95;
}

.goth-time-loc-bar__block--time {
  margin-right: 0.2rem;
}

.goth-time-loc-bar__block--place {
  margin-left: 0.2rem;
  background: linear-gradient(176deg, rgba(44, 40, 36, 0.52) 0%, rgba(18, 16, 14, 0.82) 100%);
  box-shadow:
    inset 0 2px 4px rgba(255, 248, 236, 0.04),
    inset 0 1px 0 rgba(82, 74, 62, 0.07),
    inset 0 -14px 30px rgba(4, 3, 2, 0.48),
    inset 0 0 0 1px rgba(10, 8, 6, 0.88),
    0 0 0 1px rgba(118, 102, 82, 0.16),
    0 7px 16px rgba(6, 5, 4, 0.22);
}

.goth-time-loc-bar__block-head {
  display: flex;
  align-items: center;
  gap: 0.38rem;
  margin-bottom: 0.28rem;
}

.goth-time-loc-bar__floor-nav {
  margin-left: auto;
}

.goth-time-loc-bar__plate-mark {
  flex-shrink: 0;
  width: 5px;
  height: 5px;
  border: 1px solid rgba(118, 102, 82, 0.42);
  box-shadow:
    inset 0 1px 0 rgba(196, 182, 150, 0.12),
    inset 0 -1px 2px rgba(4, 3, 2, 0.45),
    0 0 0 1px rgba(12, 10, 8, 0.45);
  background: linear-gradient(145deg, rgba(52, 46, 40, 0.85) 0%, rgba(22, 20, 18, 0.92) 100%);
}

.goth-time-loc-bar__label {
  margin: 0;
  font-family: var(--g-font-ui);
  font-size: var(--g-label-size);
  font-weight: 600;
  letter-spacing: var(--g-label-tracking);
  text-transform: uppercase;
  background: linear-gradient(180deg, rgba(188, 178, 158, 0.95) 0%, rgba(98, 90, 78, 0.85) 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  filter: drop-shadow(0 1px 0 var(--tl-gold-shadow));
}

.goth-time-loc-bar__date-row {
  display: flex;
  align-items: center;
  gap: 0.45rem;
  min-width: 0;
}

.goth-time-loc-bar__date {
  margin: 0;
  flex: 0 1 auto;
  min-width: 0;
  font-size: 0.82rem;
  font-weight: 500;
  letter-spacing: 0.02em;
  line-height: 1.35;
}

.goth-time-loc-bar__lcd-slot {
  flex: 1 1 58%;
  min-width: 6.5rem;
  display: flex;
  justify-content: flex-end;
}

.goth-time-loc-bar__weather-row {
  display: flex;
  align-items: center;
  gap: 0.42rem;
  margin-top: 0.28rem;
  padding-top: 0.32rem;
  border-top: 1px solid rgba(46, 42, 38, 0.72);
}

.goth-time-loc-bar__wx {
  flex-shrink: 0;
  align-self: flex-start;
  margin-top: 0.06rem;
}

.goth-time-loc-bar__weather-copy {
  min-width: 0;
  flex: 0 1 auto;
  max-width: min(52%, 14rem);
}

.goth-time-loc-bar__degree-slot {
  flex: 1 1 0;
  min-width: 5.75rem;
  margin-left: 0.28rem;
  align-self: stretch;
  display: flex;
  align-items: center;
}

.goth-time-loc-bar__period-line {
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-family: var(--g-font-display);
  font-size: 0.9rem;
  line-height: 1.38;
  color: var(--tl-period);
}

.goth-time-loc-bar__period-label {
  color: rgba(196, 186, 162, 0.92);
  text-shadow:
    0 1px 0 var(--tl-gold-highlight),
    0 -1px 1px var(--tl-gold-shadow);
}

.goth-time-loc-bar__weather-dot {
  margin: 0 0.15rem;
  opacity: 0.65;
}

.goth-time-loc-bar__weather-name {
  color: rgba(212, 202, 178, 0.94);
  text-shadow:
    0 1px 0 var(--tl-gold-highlight),
    0 -1px 1px var(--tl-gold-shadow);
}

.goth-time-loc-bar__place {
  margin: 0;
  font-size: 1.02rem;
  font-family: var(--g-font-display);
  font-weight: 600;
  letter-spacing: 0.03em;
}

.goth-time-loc-bar__sub {
  margin: 0.28rem 0 0;
  padding-top: 0.32rem;
  border-top: 1px solid rgba(46, 42, 38, 0.72);
  font-size: 0.8rem;
  letter-spacing: 0.03em;
}

/* 烫金立体字：渐变填充 + 轻微浮雕阴影（WebKit / 标准 clip） */
.goth-time-loc-bar__line--emboss-serif {
  background: linear-gradient(
    168deg,
    #f4ebd8 0%,
    #dccaaa 26%,
    #b89a68 48%,
    #8f7648 68%,
    #d2c29a 100%
  );
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  filter: drop-shadow(0 1px 0 rgba(255, 252, 245, 0.2)) drop-shadow(0 -1px 1px rgba(0, 0, 0, 0.58));
}

.goth-time-loc-bar__line--emboss-mono {
  background: linear-gradient(
    175deg,
    #ebe4d4 0%,
    #c9bba6 38%,
    #988872 68%,
    #c8baa4 100%
  );
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  filter: drop-shadow(0 1px 0 rgba(255, 252, 248, 0.18)) drop-shadow(0 -1px 1px rgba(0, 0, 0, 0.55));
}

.goth-time-loc-bar__line--emboss-mono-sub {
  background: linear-gradient(
    175deg,
    rgba(196, 188, 172, 0.95) 0%,
    rgba(132, 122, 108, 0.88) 45%,
    rgba(168, 158, 142, 0.92) 100%
  );
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  filter: drop-shadow(0 1px 0 rgba(255, 250, 242, 0.12)) drop-shadow(0 -1px 1px rgba(0, 0, 0, 0.5));
}

/* 中央分隔脊：线段 + 三点 */
.goth-time-loc-bar__ridge {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 1.35rem;
  flex-shrink: 0;
  padding: 0.2rem 0;
  gap: 0.28rem;
}

.goth-time-loc-bar__ridge-line {
  flex: 1;
  width: 1px;
  min-height: 0.85rem;
  background: linear-gradient(
    180deg,
    transparent 0%,
    rgba(82, 74, 66, 0.35) 35%,
    rgba(42, 38, 34, 0.55) 50%,
    rgba(82, 74, 66, 0.28) 65%,
    transparent 100%
  );
}

.goth-time-loc-bar__ridge-cap {
  width: 10px;
  height: 2px;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(72, 66, 58, 0.45) 25%,
    rgba(52, 46, 42, 0.55) 50%,
    rgba(72, 66, 58, 0.4) 75%,
    transparent
  );
  opacity: 0.85;
}

.goth-time-loc-bar__ridge-dots {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
}

.goth-time-loc-bar__ridge-dots span {
  display: block;
  width: 3px;
  height: 3px;
  border-radius: 50%;
  background: rgba(52, 48, 44, 0.85);
  box-shadow:
    inset 0 1px 0 rgba(72, 68, 62, 0.15),
    0 0 0 1px rgba(18, 16, 14, 0.5);
}

@media (max-width: 640px) {
  .goth-time-loc-bar {
    grid-template-columns: 1fr;
    grid-template-rows: auto auto auto;
  }

  .goth-time-loc-bar__date-row {
    flex-wrap: wrap;
  }

  .goth-time-loc-bar__lcd-slot {
    flex: 1 1 100%;
    justify-content: stretch;
    min-width: 0;
  }

  .goth-time-loc-bar__block--time {
    margin-right: 0;
  }

  .goth-time-loc-bar__block--place {
    margin-left: 0;
  }

  .goth-time-loc-bar__ridge {
    flex-direction: row;
    width: 100%;
    height: auto;
    padding: 0.35rem 0.25rem;
    gap: 0.42rem;
  }

  .goth-time-loc-bar__ridge-line {
    flex: 1;
    width: auto;
    height: 1px;
    min-height: 1px;
    min-width: 1.25rem;
    background: linear-gradient(
      90deg,
      transparent 0%,
      rgba(82, 74, 66, 0.35) 35%,
      rgba(42, 38, 34, 0.55) 50%,
      rgba(82, 74, 66, 0.28) 65%,
      transparent 100%
    );
  }

  .goth-time-loc-bar__ridge-cap--top,
  .goth-time-loc-bar__ridge-cap--bottom {
    width: 2px;
    height: 10px;
    background: linear-gradient(
      180deg,
      transparent,
      rgba(72, 66, 58, 0.45) 25%,
      rgba(52, 46, 42, 0.55) 50%,
      rgba(72, 66, 58, 0.4) 75%,
      transparent
    );
  }

  .goth-time-loc-bar__ridge-dots {
    flex-direction: row;
    gap: 6px;
  }

  .goth-time-loc-bar__weather-row {
    flex-wrap: wrap;
  }

  .goth-time-loc-bar__degree-slot {
    flex: 1 1 100%;
    min-width: 0;
    max-width: none;
    margin-left: 0;
    padding-top: 0.18rem;
  }

  .goth-time-loc-bar__weather-copy {
    max-width: 100%;
  }
}
</style>
