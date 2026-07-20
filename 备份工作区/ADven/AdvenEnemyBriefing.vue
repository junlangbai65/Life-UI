<template>
  <div class="adven-briefing-host" aria-hidden="false">
    <Teleport to="body">
      <div ref="portalRef" class="adven-narrative-briefing-portal adven-narrative-briefing-portal--body">
        <div
          v-if="open"
          class="adven-enemy-backdrop"
          role="presentation"
          @click="open = false"
        />
        <AdvenBriefingPanel
          v-if="open"
          :enemies="enemies"
          :container-el="portalRef"
          @close="open = false"
        />
      </div>
    </Teleport>

    <button
      id="adven-enemy-briefing-open"
      type="button"
      class="adven-enemy-fab"
      aria-haspopup="dialog"
      :aria-expanded="open"
      aria-label="打开交战情报"
      @click="open = true"
    >
      <span class="adven-enemy-fab__ring" aria-hidden="true"></span>
      <span class="adven-enemy-fab__glow" aria-hidden="true"></span>
      <svg class="adven-enemy-fab__icon" viewBox="0 0 48 48" aria-hidden="true">
        <defs>
          <linearGradient :id="`adven-fab-blade-${fabUid}`" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#f5e6c8" />
            <stop offset="45%" stop-color="#e8c86a" />
            <stop offset="100%" stop-color="#b8893a" />
          </linearGradient>
          <linearGradient :id="`adven-fab-shield-${fabUid}`" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#3d5a66" />
            <stop offset="100%" stop-color="#1e2f38" />
          </linearGradient>
        </defs>
        <path
          :fill="`url(#adven-fab-shield-${fabUid})`"
          stroke="#bd9f67"
          stroke-width="1.2"
          d="M24 4l16 6v14c0 11-7 18-16 22-9-4-16-11-16-22V10l16-6z"
        />
        <path :fill="`url(#adven-fab-blade-${fabUid})`" d="M14 14l8 20 2-9 9-11-10 6-9-6z" opacity="0.95" />
        <path
          fill="none"
          stroke="#bd9f67"
          stroke-width="1.5"
          stroke-linecap="round"
          d="M17 32l7-18M31 32l-7-18"
        />
        <circle cx="24" cy="12" r="2.2" fill="#bd9f67" opacity="0.9" />
      </svg>
      <span v-if="enemies.length > 0" class="adven-enemy-fab__badge">{{ enemies.length }}</span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, ref, useId, watch } from 'vue';
import AdvenBriefingPanel from './AdvenBriefingPanel.vue';
import type { EnemyEntry } from './adven.types';

defineProps<{
  enemies: EnemyEntry[];
}>();

const fabUid = useId().replace(/[^a-zA-Z0-9_-]/g, '');
const open = ref(false);
const portalRef = ref<HTMLElement | null>(null);

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') open.value = false;
}

watch(open, isOpen => {
  if (isOpen) {
    document.addEventListener('keydown', onKeydown);
  } else {
    document.removeEventListener('keydown', onKeydown);
  }
});

onBeforeUnmount(() => {
  open.value = false;
  document.removeEventListener('keydown', onKeydown);
});
</script>
