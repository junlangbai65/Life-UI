<template>
  <header class="lf-topbar">
    <div class="lf-topbar__left">
      <span class="lf-topbar__logo" aria-hidden="true">
        <AppIcon name="coffee" size="md" bold />
      </span>
      <div class="lf-topbar__titles">
        <span class="lf-topbar__shop">{{ game.profile.shopName }}</span>
        <span class="lf-topbar__day">Day {{ game.env.day }} · {{ game.env.timeOfDay }}</span>
      </div>
    </div>

    <div class="lf-topbar__env">
      <TagChip tone="sky" :icon="game.env.weather.icon" sticker>{{ game.env.weather.label }}</TagChip>
    </div>

    <div class="lf-topbar__actions">
      <button
        id="lf-topbar-status"
        type="button"
        class="lf-topbar__btn"
        aria-label="展开状态面板"
        @click="ui.toggleStatusPanel()"
      >
        <AppIcon name="mood" size="sm" bold />
      </button>
      <button
        id="lf-topbar-save"
        type="button"
        class="lf-topbar__btn"
        aria-label="存档管理"
        @click="ui.saveManagerOpen = true"
      >
        <AppIcon name="save" size="sm" bold />
      </button>
      <button
        id="lf-topbar-settings"
        type="button"
        class="lf-topbar__btn"
        aria-label="设置"
        @click="ui.settingsOpen = true"
      >
        <AppIcon name="gear" size="sm" bold />
      </button>
    </div>
  </header>
</template>

<script setup lang="ts">
import AppIcon from '../base/AppIcon.vue';
import TagChip from '../base/TagChip.vue';
import { useGameStore } from '../../stores/useGameStore';
import { useUiStore } from '../../stores/useUiStore';

const game = useGameStore();
const ui = useUiStore();
</script>

<style scoped lang="scss">
.lf-topbar {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  background: var(--lf-surface);
  border-bottom: 2.5px solid var(--lf-ink);
  z-index: 2;
}
.lf-topbar__left {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
}
.lf-topbar__logo {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  border: 2.5px solid var(--lf-ink);
  border-radius: var(--lf-radius-sm);
  background: var(--lf-peach);
  color: var(--lf-ink);
  box-shadow: var(--lf-shadow-chunky-sm);
}
.lf-topbar__titles {
  display: flex;
  flex-direction: column;
  min-width: 0;
}
.lf-topbar__shop {
  font-family: var(--lf-font-display);
  font-weight: 700;
  font-size: 15px;
  color: var(--lf-text);
  line-height: 1.1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.lf-topbar__day {
  font-size: 11px;
  color: var(--lf-text-secondary);
  font-weight: 600;
}
.lf-topbar__env {
  margin-left: auto;
}
.lf-topbar__actions {
  display: flex;
  gap: 6px;
}
.lf-topbar__btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  border: 2.5px solid var(--lf-ink);
  border-radius: var(--lf-radius-pill);
  background: var(--lf-surface-soft);
  color: var(--lf-ink);
  box-shadow: var(--lf-shadow-chunky-sm);
  transition: transform var(--lf-dur) var(--lf-ease-bounce), background var(--lf-dur);
}
.lf-topbar__btn:hover {
  background: var(--lf-butter);
  transform: translateY(-2px);
}
.lf-topbar__btn:active {
  transform: translateY(1px);
  box-shadow: 1px 1px 0 var(--lf-ink-shadow);
}
</style>
