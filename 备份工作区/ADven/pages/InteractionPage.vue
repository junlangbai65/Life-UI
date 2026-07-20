<template>
  <section class="interaction-page">
    <div id="interaction-world-strip" class="interaction-page__world">
      <AdvenWorldInfoCard
        :world-state="state.worldState.value"
        :weather-token="weatherFxToken"
        compact
      />
    </div>

    <AdvenQuickPanel
      :panel-definitions="state.panelDefinitions"
      :active-panel="state.activePanel.value"
      @open-panel="state.openPanel"
    />

    <AdvenPanelModal
      :fx-weather-token="weatherFxToken"
      :fx-time-token="timeFxToken"
      :active-panel="state.activePanel.value"
      :current-panel="state.currentPanel.value"
      :panel-definitions="state.panelDefinitions"
      :character="state.character.value"
      :skills="state.skills.value"
      :equipment-slot-list="state.equipmentSlotList"
      :equipment-slots="state.equipmentSlots.value"
      :inventory-categories="state.inventoryCategories"
      :active-inventory-category="state.activeInventoryCategory.value"
      :filtered-inventory-items="state.filteredInventoryItems.value"
      :inventory-feedback="state.inventoryFeedback.value"
      :pets="state.pets.value"
      :npc-list="state.npcList.value"
      :social="state.social.value"
      :quests="state.quests.value"
      :status-depth-tags="state.statusDepthTags.value"
      :body-status="state.bodyStatus.value"
      :achievements="state.achievements.value"
      :recipes="state.recipes.value"
      :production="state.production.value"
      @close-panel="state.closePanel"
      @open-panel="state.openPanel"
      @update:active-category="state.activeInventoryCategory.value = $event"
      @drag-start-inventory="state.onDragStartInventory"
      @drag-start-equipment="state.onDragStartEquipment"
      @drop-to-equip="state.onDropToEquip"
      @drop-to-inventory="state.onDropToInventory"
      @select-production-item="state.selectProductionItem"
    />
  </section>
</template>

<script setup lang="ts">
import { computed, inject, onMounted } from 'vue';
import AdvenPanelModal from '../AdvenPanelModal.vue';
import AdvenQuickPanel from '../AdvenQuickPanel.vue';
import { advenStateKey } from '../advenStateContext';
import { mapTimeToken, mapWeatherToken } from '../utils/worldFxTokens';
import AdvenWorldInfoCard from '../AdvenWorldInfoCard.vue';

const state = inject(advenStateKey);
if (!state) {
  throw new Error('未找到 ADven 状态上下文。');
}

const weatherFxToken = computed(() => mapWeatherToken(state.worldState.value?.weather));
const timeFxToken = computed(() => mapTimeToken(state.worldState.value?.time));

onMounted(() => {
  if (!state.activePanel.value) {
    state.openPanel('character');
  }
});
</script>
