<template>
  <div id="goth-root" class="goth-shell">
    <h1 class="visually-hidden">Goth：阿卡姆档案调查终端</h1>

    <div class="goth-shell-top goth-shell-top--integrated">
      <div class="goth-shell-top__inner">
        <GothTimeLocationBar class="goth-shell-top__readout goth-time-loc-bar--embedded" />

        <header id="goth-app-header" class="goth-app-toolbar goth-shell-top__routes" role="banner">
          <nav id="goth-route-switch" class="goth-route-nav goth-route-nav--svg" aria-label="主模块切换">
            <button
              id="goth-route-main"
              type="button"
              class="goth-route-icon-btn"
              :class="{ 'is-active': isMainTerminal }"
              aria-label="主终端"
              title="主终端"
              @click="go('/main')"
            >
              <!-- 抽象：登记窗口 — 外框 + 三条横读数线 -->
              <svg viewBox="0 0 24 24" aria-hidden="true" class="goth-route-icon-btn__svg">
                <rect
                  x="5"
                  y="5"
                  width="14"
                  height="14"
                  rx="0.5"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.25"
                  vector-effect="non-scaling-stroke"
                />
                <path
                  d="M8 9.25h8M8 12h8M8 14.75h8"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.25"
                  stroke-linecap="square"
                  vector-effect="non-scaling-stroke"
                />
              </svg>
            </button>
            <button
              id="goth-route-backstage"
              type="button"
              class="goth-route-icon-btn"
              :class="{ 'is-active': isBackstage }"
              aria-label="档案后台"
              title="档案后台"
              @click="go('/backstage')"
            >
              <!-- 抽象：辅助栅格 — 外框 + 中心十字 -->
              <svg viewBox="0 0 24 24" aria-hidden="true" class="goth-route-icon-btn__svg">
                <rect
                  x="5"
                  y="5"
                  width="14"
                  height="14"
                  rx="0.5"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.25"
                  vector-effect="non-scaling-stroke"
                />
                <path
                  d="M12 8v8M8 12h8"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.25"
                  stroke-linecap="square"
                  vector-effect="non-scaling-stroke"
                />
              </svg>
            </button>
          </nav>
        </header>
      </div>
    </div>

    <main id="goth-main-region" class="goth-main-flow">
      <RouterView v-slot="{ Component, route: r }">
        <Transition name="goth-page" mode="out-in">
          <component :is="Component" :key="r.path" />
        </Transition>
      </RouterView>
    </main>

    <Transition name="goth-combat">
      <GothCombatOverlay v-if="inCombat" />
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, provide, watch } from 'vue';
import { RouterView, useRoute, useRouter } from 'vue-router';
import GothCombatOverlay from './GothCombatOverlay.vue';
import GothTimeLocationBar from './GothTimeLocationBar.vue';
import { attachGothTavernListeners } from './tavernSync';
import { gothStateKey } from './gothStateContext';
import { useGothState } from './useGothState';

const state = useGothState();
provide(gothStateKey, state);

let detachTavern: (() => void) | null = null;

const inCombat = computed(() => state.snapshot.value.inCombat);

const router = useRouter();
const route = useRoute();

const pageTitle = computed(() => {
  for (let i = route.matched.length - 1; i >= 0; i--) {
    const t = route.matched[i]?.meta?.title;
    if (typeof t === 'string') return t;
  }
  return undefined;
});

const isMainTerminal = computed(() => route.path === '/main');
const isBackstage = computed(() => route.path.startsWith('/backstage'));

const BASE_TITLE = 'Goth：阿卡姆档案调查终端';

watch(
  pageTitle,
  title => {
    document.title = typeof title === 'string' ? `${title} · ${BASE_TITLE}` : BASE_TITLE;
  },
  { immediate: true },
);

function go(path: string) {
  void router.push(path);
}

function ensureMetaDescription() {
  const content =
    '二十世纪初英式报刊风档案界面：对话叙事、角色状态、案件卷宗、地图到访、关系声望与战斗简报，沉浸式灰色档案美学。';
  let el = document.querySelector('meta[name="description"]');
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute('name', 'description');
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

onMounted(() => {
  ensureMetaDescription();
  detachTavern = attachGothTavernListeners(state);
});

onBeforeUnmount(() => {
  detachTavern?.();
});
</script>
