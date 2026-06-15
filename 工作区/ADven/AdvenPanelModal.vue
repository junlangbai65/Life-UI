<template>
  <section
    id="adven-panel-stage"
    class="panel-stage-shell pixel-card panel-stage-shell--world-fx"
    :class="panelFxClasses"
  >
    <header class="modal-header stage-header">
      <div>
        <h2 :id="activePanel ? `${activePanel}-modal-title` : 'panel-stage-title'">
          {{ currentPanel?.title || '互动面板舞台' }}
        </h2>
        <p>{{ currentPanel?.desc || '从左侧导航选择面板开始查看。' }}</p>
      </div>
      <button
        v-if="activePanel"
        id="close-modal-button"
        class="pixel-btn close-btn"
        type="button"
        @click="$emit('close-panel')"
      >
        返回导航
      </button>
    </header>

    <section id="panel-modal-content" class="modal-content stage-content">
      <CharacterPanelView v-if="activePanel === 'character'" :character="character" />

      <InventoryPanelView
        v-else-if="activePanel === 'inventory'"
        :equipment-slot-list="equipmentSlotList"
        :equipment-slots="equipmentSlots"
        :inventory-categories="inventoryCategories"
        :active-inventory-category="activeInventoryCategory"
        :filtered-inventory-items="filteredInventoryItems"
        :inventory-feedback="inventoryFeedback"
        @update:active-category="$emit('update:active-category', $event)"
        @drag-start-inventory="$emit('drag-start-inventory', $event)"
        @drag-start-equipment="$emit('drag-start-equipment', $event)"
        @drop-to-equip="$emit('drop-to-equip', $event)"
        @drop-to-inventory="$emit('drop-to-inventory')"
      />

      <QuestPanelView v-else-if="activePanel === 'quest'" :quests="quests" />

      <ProductionPanelView
        v-else-if="activePanel === 'production'"
        :production="production"
        @select-production-item="$emit('select-production-item', $event)"
      />

      <SkillsPanelView v-else-if="activePanel === 'skills'" :skills="skills" />

      <PetPanelView v-else-if="activePanel === 'pet'" :pets="pets" />

      <NpcPanelView v-else-if="activePanel === 'npc'" :npc-list="npcList" />

      <SocialPanelView v-else-if="activePanel === 'social'" :social="social" />

      <StatusPanelView v-else-if="activePanel === 'status'" :status-depth-tags="statusDepthTags" :body-status="bodyStatus" />

      <AchievementPanelView v-else-if="activePanel === 'achievement'" :achievements="achievements" />

      <RecipePanelView v-else-if="activePanel === 'recipe'" :recipes="recipes" />

      <article v-else class="panel-content panel-empty-state">
        <h3>选择一个互动面板开始</h3>
        <p>当前未选中核心面板，可从导航区点击进入。</p>
      </article>
    </section>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type {
  EquipmentSlotInfo,
  EquipmentSlots,
  InventoryItem,
  PanelDefinition,
  PanelKey,
  QuestEntry,
  RecipesBundle,
} from './adven.types';
import CharacterPanelView from './panels/CharacterPanelView.vue';
import InventoryPanelView from './panels/InventoryPanelView.vue';
import ProductionPanelView from './panels/ProductionPanelView.vue';
import QuestPanelView from './panels/QuestPanelView.vue';
import SkillsPanelView from './panels/SkillsPanelView.vue';
import PetPanelView from './panels/PetPanelView.vue';
import NpcPanelView from './panels/NpcPanelView.vue';
import SocialPanelView from './panels/SocialPanelView.vue';
import StatusPanelView from './panels/StatusPanelView.vue';
import AchievementPanelView from './panels/AchievementPanelView.vue';
import RecipePanelView from './panels/RecipePanelView.vue';
import type { TimeFxToken, WeatherFxToken } from './utils/worldFxTokens';

interface CharacterData {
  baseAttributes: Array<{ name: string; value: number }>;
  hp: string;
  mp: string;
  atk: number;
  def: number;
  money: { gold: number; silver: number; copper: number };
}

interface SkillsData {
  life: Array<{ name: string; level: number; exp: number }>;
  production: Array<{ name: string; level: number; exp: number }>;
  bodyDevelopment: Array<{ name: string; value: number }>;
  growthRecords: Array<{ name: string; value: number }>;
}

interface PetData {
  name: string;
  brief: string;
  race: string;
  tier: string;
  hp: string;
  mp: string;
  loyalty: string;
  fatigue: string;
  atk: number;
  def: number;
}

interface SocialData {
  npcNetwork: Array<{ name: string; role: string; favorability: number }>;
  morality: string;
  reputation: string;
}

interface NpcData {
  name: string;
  hp: string;
  mp: string;
  relation: number;
  status: string[];
}

interface BodyStatusData {
  internalSemenVolume: number;
  sexCount: number;
  pregnancy: {
    isPregnant: boolean;
    father: string;
    progress: number;
    eta: number;
  };
}

interface ProductionData {
  currentItem: string;
  steps: Array<{ name: string; progress: number }>;
  items: Array<{ name: string; recipeName: string; currentStep: number; totalSteps: number; progress: number; consumed: string[] }>;
  selectedIndex: number;
}

const props = withDefaults(
  defineProps<{
  activePanel: PanelKey | null;
  currentPanel?: PanelDefinition;
  panelDefinitions: PanelDefinition[];
  /** 与全局 Teleport FX 一致的时间/天气 token，用于面板舞台与叙事页视觉对齐 */
  fxWeatherToken?: WeatherFxToken;
  fxTimeToken?: TimeFxToken;
  character: CharacterData;
  skills: SkillsData;
  equipmentSlotList: EquipmentSlotInfo[];
  equipmentSlots: EquipmentSlots;
  inventoryCategories: Array<InventoryItem['category']>;
  activeInventoryCategory: InventoryItem['category'];
  filteredInventoryItems: InventoryItem[];
  inventoryFeedback: string;
  pets: PetData[];
  npcList: NpcData[];
  social: SocialData;
  quests: QuestEntry[];
  statusDepthTags: { shallow: string[]; middle: Array<{ name: string; value: string }>; deep: string[] };
  bodyStatus: BodyStatusData;
  achievements: Array<{ title: string; condition: string }>;
  recipes: RecipesBundle;
  production: ProductionData;
  }>(),
  {
    currentPanel: undefined,
    fxWeatherToken: 'default',
    fxTimeToken: 'default',
  },
);

const panelFxClasses = computed(() => [`fx-weather-${props.fxWeatherToken}`, `fx-time-${props.fxTimeToken}`]);

defineEmits<{
  'close-panel': [];
  'open-panel': [panel: PanelKey];
  'update:active-category': [category: InventoryItem['category']];
  'drag-start-inventory': [itemId: string];
  'drag-start-equipment': [slot: keyof EquipmentSlots];
  'drop-to-equip': [slot: keyof EquipmentSlots];
  'drop-to-inventory': [];
  'select-production-item': [index: number];
}>();
</script>
