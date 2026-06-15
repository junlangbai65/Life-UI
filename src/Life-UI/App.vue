<template>
  <div class="lf-app">
    <div id="lf-overlay-root" class="lf-app__overlay-root"></div>

    <Transition name="lf-title">
      <TitleScreen v-if="!started" @start="start" />
    </Transition>

    <template v-if="started">
      <TopBar />
      <main class="lf-app__main lf-scroll">
        <RouterView v-slot="{ Component }">
          <Transition name="lf-view" mode="out-in">
            <component :is="Component" />
          </Transition>
        </RouterView>
      </main>
      <BottomNav />

      <StatusPanel />
      <CharacterCardModal />
      <DataPanel />
      <SaveManager />
      <SettingsModal />
    </template>

    <NotificationLayer />
    <ConfirmDialog />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import TitleScreen from './views/TitleScreen.vue';
import TopBar from './components/layout/TopBar.vue';
import BottomNav from './components/layout/BottomNav.vue';
import StatusPanel from './components/status/StatusPanel.vue';
import CharacterCardModal from './components/character/CharacterCardModal.vue';
import DataPanel from './components/data/DataPanel.vue';
import SaveManager from './components/save/SaveManager.vue';
import SettingsModal from './components/layout/SettingsModal.vue';
import NotificationLayer from './components/feedback/NotificationLayer.vue';
import ConfirmDialog from './components/feedback/ConfirmDialog.vue';
import { useShortcuts } from './composables/useShortcuts';
import { navItems } from './router';
import { useUiStore } from './stores/useUiStore';

const started = ref(false);
const router = useRouter();
const ui = useUiStore();

function start() {
  started.value = true;
}

const shortcutMap: Record<string, () => void> = {};
for (const item of navItems) {
  shortcutMap[item.key] = () => {
    if (started.value) router.push(item.path);
  };
}
shortcutMap.s = () => started.value && ui.toggleStatusPanel();
shortcutMap.d = () => started.value && (ui.dataPanelOpen = true);
shortcutMap.escape = () => {
  ui.statusPanelOpen = false;
  ui.dataPanelOpen = false;
  ui.saveManagerOpen = false;
  ui.settingsOpen = false;
  ui.closeCharacterCard();
};
useShortcuts(shortcutMap);
</script>

<style lang="scss">
.lf-app {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  background: var(--lf-bg);
  background-image:
    radial-gradient(circle at 18% 12%, rgba(247, 168, 196, 0.18), transparent 42%),
    radial-gradient(circle at 82% 78%, rgba(174, 223, 247, 0.2), transparent 46%),
    radial-gradient(circle at 50% 50%, rgba(255, 227, 163, 0.1), transparent 60%);
  overflow: hidden;
}

.lf-app__overlay-root {
  position: absolute;
  inset: 0;
  z-index: var(--lf-z-modal);
  pointer-events: none;
}
.lf-app__overlay-root > * {
  pointer-events: auto;
}

.lf-app__main {
  position: relative;
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  overflow-x: hidden;
}

// —— 视图切换过渡 ——
.lf-view-enter-active {
  transition: opacity var(--lf-dur) var(--lf-ease-out), transform var(--lf-dur) var(--lf-ease-bounce);
}
.lf-view-leave-active {
  transition: opacity 140ms var(--lf-ease-soft), transform 140ms var(--lf-ease-soft);
}
.lf-view-enter-from {
  opacity: 0;
  transform: translateY(14px) scale(0.99);
}
.lf-view-leave-to {
  opacity: 0;
  transform: translateY(-8px) scale(0.99);
}

// —— 标题过渡 ——
.lf-title-leave-active {
  transition: opacity var(--lf-dur-slow) var(--lf-ease-soft);
}
.lf-title-leave-to {
  opacity: 0;
}
</style>
