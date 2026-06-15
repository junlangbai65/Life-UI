<template>
  <div
    id="inf-root"
    class="inf-root inf-shell inf-font-scale--md"
    data-inf-layout="tile"
    :data-inf-theme="game.uiSettings.theme"
    :data-inf-infection-tier="game.infectionTier"
  >
    <div class="inf-ambient" aria-hidden="true">
      <div class="inf-ambient__mesh" />
      <div class="inf-ambient__noise" />
      <div class="inf-ambient__pulse" />
    </div>

    <main id="inf-page-narrative" class="inf-shell__inner">
      <h1 class="visually-hidden">叙事终端</h1>
      <InfGlassTerminal />
    </main>

    <InfToastStack />
    <InfAlertDialog />
    <InfConfirmDialog />
  </div>
</template>

<script setup lang="ts">
import { defineAsyncComponent } from 'vue';
import { useGameStore } from '../../stores/useGameStore';
import InfGlassTerminal from './InfGlassTerminal.vue';
import InfToastStack from '../ui/InfToastStack.vue';

const game = useGameStore();

const InfAlertDialog = defineAsyncComponent(() => import('../ui/InfAlertDialog.vue'));
const InfConfirmDialog = defineAsyncComponent(() => import('../ui/InfConfirmDialog.vue'));
</script>

<style scoped lang="scss">
.inf-font-scale--sm {
  font-size: 14px;
}

.inf-font-scale--md {
  font-size: 15px;
}

.inf-font-scale--lg {
  font-size: 16px;
}
</style>
