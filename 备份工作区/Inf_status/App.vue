<template>
  <InfShell />
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, watch } from 'vue';
import InfShell from './components/shell/InfShell.vue';
import { useFloorKeyboardNav } from './composables/useFloorKeyboardNav';
import { useGameStore } from './stores/useGameStore';
import {
  attachInfChatRawTextHider,
  attachInfMesLayoutObserver,
  restoreInfAllHiddenRawText,
  syncInfCurrentMesLayout,
  syncInfHiddenRawTextForStructuredMessages,
} from './utils/tavernChatHide';

const game = useGameStore();
useFloorKeyboardNav();
let detachChatHide: (() => void) | null = null;
let detachLayoutObserver: (() => void) | null = null;

onMounted(() => {
  game.bindMessageEvents();
  detachChatHide = attachInfChatRawTextHider(() => game.uiSettings.hideChatRawText);
  detachLayoutObserver = attachInfMesLayoutObserver(() => game.uiSettings.hideChatRawText);
  requestAnimationFrame(() => syncInfCurrentMesLayout());
});

watch(
  () => game.uiSettings.hideChatRawText,
  enabled => {
    if (enabled) syncInfHiddenRawTextForStructuredMessages();
    else restoreInfAllHiddenRawText();
  },
);

onUnmounted(() => {
  detachLayoutObserver?.();
  detachLayoutObserver = null;
  detachChatHide?.();
  detachChatHide = null;
  game.unbindMessageEvents();
});
</script>
