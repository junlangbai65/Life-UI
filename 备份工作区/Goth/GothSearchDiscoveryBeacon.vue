<template>
  <!--
    不可在根节点使用 v-if="hasResults"：拾取最后一项时整树卸载会导致原生 <dialog showModal> 未正确关闭，
    遗留顶层阻塞（iframe 内点击全部失效）。FAB 单独 v-if；弹层 Teleport 到 #goth-root 并显式 pointer-events。
  -->
  <div class="goth-search-beacon">
    <button
      v-if="hasResults"
      type="button"
      class="goth-search-beacon__fab goth-inset-slot"
      :class="{ 'is-scanning': scanning }"
      :disabled="scanning"
      aria-haspopup="dialog"
      :aria-expanded="dialogOpen"
      aria-controls="goth-search-beacon-dialog"
      aria-label="打开搜索结果"
      title="搜索结果"
      @click="onFabClick"
    >
      <svg class="goth-search-beacon__svg" viewBox="0 0 48 48" aria-hidden="true">
        <circle
          class="goth-search-beacon__orbit"
          cx="24"
          cy="24"
          r="19"
          fill="none"
          stroke="currentColor"
          stroke-width="1.35"
          stroke-linecap="round"
        />
        <g class="goth-search-beacon__glass">
          <circle cx="20.5" cy="20.5" r="8.25" fill="none" stroke="currentColor" stroke-width="2" />
          <path
            d="M26.6 26.6 L36.2 36.2"
            fill="none"
            stroke="currentColor"
            stroke-width="2.25"
            stroke-linecap="round"
          />
        </g>
      </svg>
    </button>

    <Teleport to="#goth-root">
      <dialog
        id="goth-search-beacon-dialog"
        ref="dlgRef"
        class="goth-search-beacon__dialog"
        aria-labelledby="goth-search-beacon-title"
        @close="onDialogClose"
      >
        <div class="goth-search-beacon__panel">
          <header class="goth-search-beacon__head">
            <h2 id="goth-search-beacon-title" class="goth-search-beacon__title">搜索结果</h2>
            <button type="button" class="goth-btn-ghost goth-search-beacon__close" autofocus @click="closeDialog">
              关闭
            </button>
          </header>
          <ul class="goth-search-beacon__list" role="list">
            <li
              v-for="it in snapshot.searchResults"
              :id="`goth-main-sr-${it.id}`"
              :key="it.id"
              class="goth-search-beacon__row goth-inset-slot"
            >
              <div class="goth-search-beacon__row-head">
                <GothItemTypeIcon :type="it.type" />
                <div class="goth-search-beacon__row-titles">
                  <strong>{{ it.name }}</strong>
                  <span class="goth-tag">{{ it.sourceLabel }}</span>
                </div>
              </div>
              <p class="muted small goth-search-beacon__desc">{{ it.description }}</p>
              <p class="goth-mono goth-search-beacon__meta small">数量 {{ it.quantity }} · 负重 {{ it.weight }}</p>
              <div class="goth-search-beacon__actions">
                <button type="button" class="goth-btn-primary goth-search-beacon__btn" @click="onPick(it)">
                  拾取
                </button>
                <button type="button" class="goth-btn-ghost goth-search-beacon__btn" @click="onDiscard(it)">
                  丢弃
                </button>
              </div>
            </li>
          </ul>
        </div>
      </dialog>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { computed, inject, nextTick, onBeforeUnmount, ref, watch } from 'vue';
import GothItemTypeIcon from './panels/inventory/GothItemTypeIcon.vue';
import { gothStateKey } from './gothStateContext';
import type { SearchResultItem } from './goth.types';

const SCAN_MS = 2500;

const state = inject(gothStateKey);
if (!state) throw new Error('未找到 Goth 状态上下文。');

const { snapshot, pickSearchItem, discardSearchItem } = state;

const dlgRef = ref<HTMLDialogElement | null>(null);
const scanning = ref(false);
const dialogOpen = ref(false);

let scanTimer: ReturnType<typeof setTimeout> | null = null;

const hasResults = computed(() => snapshot.value.searchResults.length > 0);

function reducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function openDialog() {
  void nextTick(() => {
    const el = dlgRef.value;
    if (!el) return;
    el.showModal();
    dialogOpen.value = true;
  });
}

function closeDialog() {
  dlgRef.value?.close();
  dialogOpen.value = false;
}

function onDialogClose() {
  dialogOpen.value = false;
  scanning.value = false;
}

function onPick(it: SearchResultItem) {
  pickSearchItem(it);
  if (snapshot.value.searchResults.length === 0) closeDialog();
}

function onDiscard(it: SearchResultItem) {
  discardSearchItem(it);
  if (snapshot.value.searchResults.length === 0) closeDialog();
}

function onFabClick() {
  if (scanning.value || dialogOpen.value) return;
  if (reducedMotion()) {
    openDialog();
    return;
  }
  scanning.value = true;
  scanTimer = setTimeout(() => {
    scanTimer = null;
    scanning.value = false;
    openDialog();
  }, SCAN_MS);
}

watch(
  () => snapshot.value.searchResults.length,
  len => {
    if (len === 0) {
      scanning.value = false;
      if (scanTimer) {
        clearTimeout(scanTimer);
        scanTimer = null;
      }
      dlgRef.value?.close();
      dialogOpen.value = false;
    }
  },
);

onBeforeUnmount(() => {
  if (scanTimer) clearTimeout(scanTimer);
  dlgRef.value?.close();
  dialogOpen.value = false;
});
</script>

<style scoped>
.goth-search-beacon {
  position: absolute;
  z-index: 8;
  top: 0.35rem;
  right: 0.35rem;
  left: auto;
  pointer-events: none;
}

.goth-search-beacon__fab {
  pointer-events: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.65rem;
  height: 2.65rem;
  padding: 0;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  color: var(--g-text-accent);
  background: linear-gradient(165deg, rgba(52, 48, 42, 0.92), rgba(28, 26, 22, 0.96));
  box-shadow:
    var(--g-depth-chip),
    inset 0 1px 0 rgba(120, 108, 88, 0.12);
  transition:
    box-shadow 0.22s ease,
    transform 0.22s ease,
    color 0.2s ease;
}

.goth-search-beacon__fab:hover:not(:disabled) {
  color: var(--g-text-title);
  box-shadow:
    var(--g-depth-chip),
    0 6px 18px rgba(12, 10, 8, 0.28),
    inset 0 1px 0 rgba(157, 136, 104, 0.14);
}

.goth-search-beacon__fab:focus-visible {
  outline: none;
  box-shadow:
    var(--g-depth-chip),
    0 0 0 2px rgba(157, 136, 104, 0.45);
}

.goth-search-beacon__fab:disabled {
  cursor: default;
  opacity: 0.92;
}

.goth-search-beacon__svg {
  width: 1.55rem;
  height: 1.55rem;
  display: block;
}

.goth-search-beacon__orbit {
  opacity: 0.35;
  stroke-dasharray: 8 6;
  transform-origin: 24px 24px;
}

.goth-search-beacon__glass {
  transform-origin: 24px 24px;
}

.goth-search-beacon__fab.is-scanning .goth-search-beacon__orbit {
  animation: goth-beacon-orbit 2.5s cubic-bezier(0.45, 0, 0.2, 1) forwards;
}

.goth-search-beacon__fab.is-scanning .goth-search-beacon__glass {
  animation: goth-beacon-glass 2.5s cubic-bezier(0.45, 0, 0.2, 1) forwards;
}

.goth-search-beacon__fab.is-scanning {
  animation: goth-beacon-pulse 2.5s ease-in-out forwards;
}

@keyframes goth-beacon-orbit {
  0% {
    opacity: 0.25;
    transform: rotate(0deg);
    stroke-dashoffset: 0;
  }
  40% {
    opacity: 0.85;
  }
  100% {
    opacity: 0.45;
    transform: rotate(720deg);
    stroke-dashoffset: -80;
  }
}

@keyframes goth-beacon-glass {
  0%,
  100% {
    transform: scale(1);
  }
  25% {
    transform: scale(1.06);
  }
  55% {
    transform: scale(0.94);
  }
  75% {
    transform: scale(1.03);
  }
}

@keyframes goth-beacon-pulse {
  0%,
  100% {
    box-shadow:
      var(--g-depth-chip),
      inset 0 1px 0 rgba(120, 108, 88, 0.12);
  }
  50% {
    box-shadow:
      var(--g-depth-chip),
      0 0 22px rgba(157, 136, 104, 0.35),
      inset 0 1px 0 rgba(157, 136, 104, 0.18);
  }
}

.goth-search-beacon__dialog {
  padding: 0;
  border: none;
  border-radius: var(--g-radius);
  background: transparent;
  max-width: min(420px, calc(100vw - 1.5rem));
  z-index: 30;
  pointer-events: auto;
}

.goth-search-beacon__dialog::backdrop {
  background: rgba(12, 10, 8, 0.52);
  backdrop-filter: blur(2px);
}

.goth-search-beacon__panel {
  max-height: min(72vh, 520px);
  display: flex;
  flex-direction: column;
  padding: 0.75rem 0.85rem;
  background: linear-gradient(168deg, rgba(52, 48, 42, 0.98), rgba(26, 24, 22, 0.99));
  border: 1px solid rgba(108, 96, 76, 0.28);
  border-radius: var(--g-radius);
  box-shadow: 0 18px 48px rgba(8, 6, 5, 0.45);
}

.goth-search-beacon__head {
  position: relative;
  padding-right: 4.5rem;
  margin-bottom: 0.55rem;
  flex-shrink: 0;
}

.goth-search-beacon__title {
  margin: 0;
  font-family: var(--g-font-display);
  font-size: 1.05rem;
  color: var(--g-text-title);
}

.goth-search-beacon__close {
  position: absolute;
  top: 0;
  right: 0;
  font-size: 0.72rem !important;
  padding: 0.35rem 0.55rem !important;
  min-height: 38px !important;
}

.goth-search-beacon__list {
  margin: 0;
  padding: 0;
  list-style: none;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
}

.goth-search-beacon__row {
  padding: 0.5rem 0.55rem;
  font-size: 0.82rem;
}

.goth-search-beacon__row-head {
  display: flex;
  align-items: flex-start;
  gap: 0.45rem;
}

.goth-search-beacon__row-titles {
  min-width: 0;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.35rem;
}

.goth-search-beacon__row-titles strong {
  font-size: 0.86rem;
}

.goth-search-beacon__desc {
  margin: 0.35rem 0 0;
}

.goth-search-beacon__meta {
  margin: 0.25rem 0 0;
  font-size: 0.7rem;
  color: var(--g-text-muted);
}

.goth-search-beacon__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
  margin-top: 0.45rem;
}

.goth-search-beacon__btn {
  font-size: 0.72rem !important;
  padding: 0.3rem 0.5rem !important;
  min-height: 36px !important;
}

.muted {
  color: var(--g-text-muted);
}

.small {
  font-size: 0.76rem;
}

@media (prefers-reduced-motion: reduce) {
  .goth-search-beacon__fab {
    transition: none;
  }

  .goth-search-beacon__fab.is-scanning .goth-search-beacon__orbit,
  .goth-search-beacon__fab.is-scanning .goth-search-beacon__glass,
  .goth-search-beacon__fab.is-scanning {
    animation: none;
  }
}
</style>
