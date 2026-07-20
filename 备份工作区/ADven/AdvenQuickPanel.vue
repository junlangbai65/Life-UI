<template>
  <aside id="adven-quick-panel" class="quick-panel pixel-card">
    <h2 class="icon-title" aria-label="互动面板导航">
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4 6h16M4 12h16M4 18h16M7 6v12" />
      </svg>
    </h2>
    <p class="quick-panel-subtitle">挑一个看看吧~</p>
    <nav id="adven-panel-nav" class="panel-grid" aria-label="游戏功能导航">
      <button
        v-for="panel in panelDefinitions"
        :id="`${panel.key}-modal-trigger`"
        :key="panel.key"
        class="panel-nav-btn"
        :class="{ active: activePanel === panel.key }"
        type="button"
        @click="$emit('open-panel', panel.key)"
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path :d="panel.icon"></path>
        </svg>
        <span class="panel-nav-title">{{ panel.title }}</span>
        <span class="panel-nav-desc">{{ panel.desc }}</span>
        <span class="panel-nav-tip">{{ panel.tip }}</span>
      </button>
    </nav>
  </aside>
</template>

<script setup lang="ts">
import type { PanelDefinition, PanelKey } from './adven.types';

defineProps<{
  panelDefinitions: PanelDefinition[];
  activePanel: PanelKey | null;
}>();

defineEmits<{
  'open-panel': [panel: PanelKey];
}>();
</script>

