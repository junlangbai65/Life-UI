<template>
  <!-- FX 遮罩外置到 body，叠在 #app 之上，避免被壳内卡片/主布局压住；pointer-events: none 不挡交互 -->
  <Teleport to="body">
    <div class="adven-fx-host" :class="rootFxClasses" :style="rootFxVars" aria-hidden="true">
      <div class="global-fx-layer">
        <div class="global-fx-ambience"></div>
        <!-- 参考案例「装饰元素1.vue」：夜间深蓝天幕 + 视差星场 -->
        <div class="global-fx-night-depth"></div>
        <div class="global-fx-starfield">
          <div class="global-fx-starfield__layer global-fx-starfield__layer--1"></div>
          <div class="global-fx-starfield__layer global-fx-starfield__layer--2"></div>
          <div class="global-fx-starfield__layer global-fx-starfield__layer--3"></div>
        </div>
        <div class="global-fx-weather"></div>
        <div class="global-fx-fog"></div>
        <div class="global-fx-fireflies">
          <span v-for="index in 12" :key="`firefly-${index}`" class="firefly-dot"></span>
        </div>
      </div>
    </div>
  </Teleport>

  <div id="adven-root" class="adven-shell" :style="panelTimeThemeStyle" :class="degreeRootClasses">
    <h1 class="visually-hidden">暮辉远征录：奇幻冒险叙事与交互指挥界面</h1>
    <header
      id="adven-main-header"
      class="shell-header pixel-card"
      :class="{ 'shell-header--single': !isNarrativeRoute, 'shell-header--narrative': isNarrativeRoute }"
    >
      <template v-if="isNarrativeRoute">
        <div id="top-world-presence-cluster" class="top-world-presence-cluster">
          <section id="top-world-strip" class="info-strip top-strip-world">
            <AdvenWorldInfoCard :world-state="worldState" :weather-token="weatherFxToken" />
          </section>

          <section id="top-presence-strip" class="info-strip top-strip-presence">
            <h3 class="strip-title">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M7 10a3 3 0 1 1 0-6 3 3 0 0 1 0 6m10 0a3 3 0 1 1 0-6 3 3 0 0 1 0 6M2 20a5 5 0 0 1 10 0m0 0a5 5 0 0 1 10 0" />
              </svg>
              <span>周围人物</span>
            </h3>
            <div class="presence-grid">
              <div
                v-for="(presence, index) in presenceList"
                :key="`${narrativeLayerSourceMessageId ?? 'none'}-${selectedMaintextLayerOffset}-${index}`"
                class="presence-item"
              >
                <small>{{ index + 1 }}</small>
                <span>{{ presence }}</span>
              </div>
              <span v-if="presenceList.length === 0" class="empty-note">周围暂无人物</span>
            </div>
          </section>
        </div>
      </template>

      <section id="top-nav-strip" class="info-strip top-strip-nav">
        <h3 class="icon-title" aria-label="页面导航">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M4 6h16M4 12h16M4 18h16M7 6v12" />
          </svg>
        </h3>
        <div class="header-nav">
          <button
            id="goto-narrative-page"
            class="icon-nav-btn"
            type="button"
            :class="{ active: route.path === '/narrative' }"
            aria-label="切换到叙事页"
            @click="goNarrative"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M5 4h14v16H5zM8 8h8M8 12h8M8 16h6" />
            </svg>
            <span class="icon-nav-tip">剧情</span>
          </button>
          <button
            id="goto-interaction-page"
            class="icon-nav-btn"
            type="button"
            :class="{ active: route.path === '/interaction' }"
            aria-label="切换到导航页"
            @click="goInteraction"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M4 6h16M4 12h16M4 18h16M7 6v12" />
            </svg>
            <span class="icon-nav-tip">面板</span>
          </button>
        </div>
      </section>
    </header>

    <main id="adven-main-layout" class="main-layout">
      <RouterView v-slot="{ Component, route: currentRoute }">
        <Transition name="page-fade-slide" mode="out-in">
          <component :is="Component" :key="currentRoute.path" />
        </Transition>
      </RouterView>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed, provide } from 'vue';
import { RouterView, useRoute, useRouter } from 'vue-router';
import { advenStateKey } from './advenStateContext';
import { useAdvenState } from './useAdvenState';
import { buildPanelTimeThemeVars, parseTimeToDecimalHours } from './utils/panelTimeTheme';
import {
  applyTemperatureTint,
  computeSnowLevel,
  degreeFxToken,
  parseDegreeToCelsius,
} from './utils/degreeTheme';
import { mapTimeToken, mapWeatherToken } from './utils/worldFxTokens';
import AdvenWorldInfoCard from './AdvenWorldInfoCard.vue';

const state = useAdvenState();
provide(advenStateKey, state);

const { presenceList, worldState, selectedMaintextLayerOffset, narrativeLayerSourceMessageId } = state;

const router = useRouter();
const route = useRoute();
const isNarrativeRoute = computed(() => route.path === '/narrative');

const weatherFxToken = computed(() => mapWeatherToken(worldState.value?.weather));
const timeFxToken = computed(() => mapTimeToken(worldState.value?.time));

const rootFxClasses = computed(() => [
  `fx-weather-${weatherFxToken.value}`,
  `fx-time-${timeFxToken.value}`,
]);

/** 时间主题 + degree：负温为雪地日光↔冬夜冰色；≥30℃ 为夏日暖白杏色 + 青蓝交互 */
const panelTimeThemeStyle = computed(() => {
  const hours = parseTimeToDecimalHours(worldState.value?.time);
  const base = buildPanelTimeThemeVars(hours);
  const c = parseDegreeToCelsius(worldState.value?.degree);
  const tinted = applyTemperatureTint(base, c, hours);
  const snow = computeSnowLevel(c, hours);
  if (snow <= 0) return tinted;
  return { ...tinted, '--snow-level': snow.toFixed(3) };
});

/** 剧情页 / 面板页：温度分档类名，供积雪等装饰（见 adven.css） */
const degreeRootClasses = computed(() => {
  const list: string[] = [];
  const path = route.path;
  if (path === '/narrative') list.push('degree-fx--narrative');
  else if (path === '/interaction') list.push('degree-fx--interaction');
  else return list;

  const c = parseDegreeToCelsius(worldState.value?.degree);
  const token = degreeFxToken(c);
  if (token !== 'unknown') list.push(`degree-fx--${token}`);
  return list;
});

const rootFxVars = computed<Record<string, string>>(() => {
  /* 整体减弱光晕强度；色相/饱和度偏移收敛，避免廉价霓虹感 */
  let base: Record<string, string>;
  if (timeFxToken.value === 'dawn') {
    base = {
      '--fx-ambient-opacity': '0.14',
      '--fx-hue-shift': '4deg',
      '--fx-saturate': '1.03',
      '--fx-brightness': '1.01',
    };
  } else if (timeFxToken.value === 'day') {
    base = {
      '--fx-ambient-opacity': '0.11',
      '--fx-hue-shift': '-1deg',
      '--fx-saturate': '1.02',
      '--fx-brightness': '1.02',
    };
  } else if (timeFxToken.value === 'dusk') {
    base = {
      '--fx-ambient-opacity': '0.17',
      '--fx-hue-shift': '10deg',
      '--fx-saturate': '1.05',
      '--fx-brightness': '0.98',
    };
  } else if (timeFxToken.value === 'night') {
    base = {
      '--fx-ambient-opacity': '0.2',
      '--fx-hue-shift': '22deg',
      '--fx-saturate': '0.96',
      '--fx-brightness': '0.92',
    };
  } else if (timeFxToken.value === 'deepnight') {
    base = {
      '--fx-ambient-opacity': '0.24',
      '--fx-hue-shift': '28deg',
      '--fx-saturate': '0.94',
      '--fx-brightness': '0.88',
    };
  } else {
    base = {
      '--fx-ambient-opacity': '0.12',
      '--fx-hue-shift': '0deg',
      '--fx-saturate': '1',
      '--fx-brightness': '1',
    };
  }

  const c = parseDegreeToCelsius(worldState.value?.degree);
  if (c !== null && c < 0) {
    const w = Math.min(1, Math.abs(c) / 40);
    const hueBase = base['--fx-hue-shift'] ?? '0deg';
    const satN = Number.parseFloat(base['--fx-saturate'] ?? '1');
    return {
      ...base,
      '--fx-hue-shift': `calc(${hueBase} + ${(-14 * w).toFixed(1)}deg)`,
      '--fx-saturate': String(satN + 0.03 * w),
      '--fx-brightness': String(Number.parseFloat(base['--fx-brightness'] ?? '1') + 0.02 * w),
    };
  }
  return base;
});

function goNarrative() {
  state.closePanel();
  void router.push('/narrative');
}

function goInteraction() {
  state.closePanel();
  void router.push('/interaction');
}
</script>
