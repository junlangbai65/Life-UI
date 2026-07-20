<template>
  <section class="narrative-page">
    <AdvenChatSection
      :maintext-content="state.maintextContent.value"
      :maintext-dice="state.maintextDice.value"
      :interest-points="state.interestPoints.value"
      :narrative-options="state.narrativeOptions.value"
      :maintext-layer-tabs="state.maintextLayerTabs.value"
      :selected-maintext-layer-offset="state.selectedMaintextLayerOffset.value"
      :draft-input="state.draftInput.value"
      :send-mode="state.sendMode.value"
      :is-generating="state.isGenerating.value"
      :character="state.character.value"
      :achievements="state.achievements.value"
      :level-system="state.levelSystem.value"
      :enemy-list="state.enemyList.value"
      :quests="state.quests.value"
      @switch-maintext-layer="state.switchMaintextLayer"
      @apply-option="state.applyNarrativeOption"
      @update:draft-input="state.draftInput.value = $event"
      @update:send-mode="state.sendMode.value = $event"
      @submit-message="state.submitMessage"
    />
  </section>
</template>

<script setup lang="ts">
import { inject } from 'vue';
import AdvenChatSection from '../AdvenChatSection.vue';
import { advenStateKey } from '../advenStateContext';

const state = inject(advenStateKey);
if (!state) {
  throw new Error('未找到 ADven 状态上下文。');
}
</script>
