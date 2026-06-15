<template>
  <aside
    id="inf-status-rail"
    class="inf-status-rail inf-scrollbar"
    :class="{ 'inf-no-motion': !motionEnabled }"
    aria-label="角色状态侧栏"
  >
    <InfMeterLiquidFilters />

    <div v-if="!character" class="inf-status-rail__empty" role="status">
      <InfIcon name="info" size="lg" class="inf-status-rail__empty-icon" />
      <p class="inf-caption">等待 MVU 角色数据同步</p>
    </div>

    <div v-else class="inf-status-rail__stream">
      <InfStatusHero
        v-model:active-character-key="characterKeyModel"
        :display-name="displayName"
        :infection-state="character.感染状态"
        :character-keys="game.characterKeys"
      />

      <InfDeltaStrip
        v-if="hasDelta"
        :numeric-deltas="numericDeltas"
        :changed-fields="changedFields"
      />

      <InfInfectionMeter
        :percent="character.感染进程"
        :delta="getNumericDelta('感染进程')"
        :infection-state="character.感染状态"
        :motion-enabled="motionEnabled"
      />

      <InfDesireMeter
        :percent="character.性欲"
        :delta="getNumericDelta('性欲')"
        :rollback-to-zero="desireRollbackToZero"
        :motion-enabled="motionEnabled"
      />

      <InfStatRow
        v-for="(row, index) in statRows"
        :key="row.field"
        :icon="row.icon"
        :label="row.label"
        :value="row.value"
        :changed="isFieldChanged(row.field)"
        :stagger="4 + index"
        :field-key="row.field"
        :row-id="`inf-stat-${row.field}`"
      />
    </div>
  </aside>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useCharacterDelta } from '../../composables/useCharacterDelta';
import { useGameStore } from '../../stores/useGameStore';
import InfDeltaStrip from './InfDeltaStrip.vue';
import InfDesireMeter from './InfDesireMeter.vue';
import InfInfectionMeter from './InfInfectionMeter.vue';
import InfStatRow from './InfStatRow.vue';
import InfStatusHero from './InfStatusHero.vue';
import InfMeterLiquidFilters from '../ui/InfMeterLiquidFilters.vue';
import InfIcon from '../ui/InfIcon.vue';

const game = useGameStore();
const { numericDeltas, changedFields, hasDelta, desireRollbackToZero, isFieldChanged, getNumericDelta } =
  useCharacterDelta();

const motionEnabled = computed(() => game.uiSettings.motionEnabled);

const character = computed(() => game.activeCharacter?.data ?? null);
const displayName = computed(
  () => character.value?.姓名?.trim() || game.activeCharacter?.key || '未知',
);

const characterKeyModel = computed({
  get: () => game.activeCharacterKey,
  set: (v: string) => game.setActiveCharacterKey(v),
});

const statRows = computed(() => {
  const c = character.value;
  if (!c) return [];
  return [
    { field: '姿态', label: '姿态', icon: 'user', value: c.姿态 || '—' },
    { field: '上身', label: '上身', icon: 'box', value: c.上身 },
    { field: '下身', label: '下身', icon: 'layers', value: c.下身 },
    { field: '鞋袜', label: '鞋袜', icon: 'shoe', value: c.鞋袜 },
  ];
});
</script>

<style scoped lang="scss">
.inf-status-rail {
  display: flex;
  flex-direction: column;
  min-height: 0;
  height: 100%;
  padding: 0.875rem clamp(0.75rem, 1.5vw, 1rem);
  overflow-y: auto;
  overscroll-behavior: contain;
}

.inf-status-rail__stream {
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.inf-status-rail__empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 2rem 0.5rem;
  text-align: center;
}

.inf-status-rail__empty-icon {
  color: var(--inf-text-muted);
  opacity: 0.6;
}
</style>
