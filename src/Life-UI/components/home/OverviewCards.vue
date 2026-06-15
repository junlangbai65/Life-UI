<template>
  <section class="lf-overview" aria-label="状态概览">
    <header class="lf-overview__head">
      <h3 class="lf-overview__title"><AppIcon name="mood" size="sm" bold /> 今日速览</h3>
      <button id="lf-overview-more" type="button" class="lf-overview__more" @click="ui.toggleStatusPanel(true)">
        全部 <AppIcon name="chevron-right" size="xs" bold />
      </button>
    </header>

    <div class="lf-overview__env">
      <TagChip tone="sky" :icon="game.env.weather.icon" sticker :rotate="-2">{{ game.env.weather.label }}</TagChip>
      <TagChip tone="butter" icon="sun" sticker :rotate="1">{{ game.env.season }} · {{ game.env.timeOfDay }}</TagChip>
      <TagChip tone="mint" icon="leaf" sticker :rotate="-1">{{ game.env.ambiance }}</TagChip>
    </div>

    <div class="lf-overview__grid">
      <ClayCard
        v-for="stat in game.stats"
        :key="stat.key"
        tone="paper"
        :chunky="true"
        class="lf-overview__cell"
      >
        <span class="lf-overview__cell-icon" :style="{ background: stat.color }" aria-hidden="true">
          <AppIcon :name="stat.icon" size="sm" bold />
        </span>
        <div class="lf-overview__cell-body">
          <span class="lf-overview__cell-label">{{ stat.label }}</span>
          <span class="lf-overview__cell-value">{{ formatValue(stat) }}</span>
        </div>
        <span v-if="stat.max === 100" class="lf-overview__cell-bar" aria-hidden="true">
          <span class="lf-overview__cell-fill" :style="{ width: pct(stat) + '%', background: stat.color }" />
        </span>
      </ClayCard>
    </div>
  </section>
</template>

<script setup lang="ts">
import AppIcon from '../base/AppIcon.vue';
import ClayCard from '../base/ClayCard.vue';
import TagChip from '../base/TagChip.vue';
import { useGameStore } from '../../stores/useGameStore';
import { useUiStore } from '../../stores/useUiStore';
import type { StatDef } from '../../types';

const game = useGameStore();
const ui = useUiStore();

function pct(stat: StatDef) {
  return Math.round((stat.value / stat.max) * 100);
}
function formatValue(stat: StatDef) {
  if (stat.key === 'funds') return `¥${stat.value.toLocaleString()}`;
  return `${stat.value}`;
}
</script>

<style scoped lang="scss">
.lf-overview {
  margin: 0 12px 12px;
}
.lf-overview__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 9px;
}
.lf-overview__title {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 15px;
  font-weight: 700;
}
.lf-overview__more {
  display: inline-flex;
  align-items: center;
  gap: 2px;
  padding: 4px 10px;
  border: 2px solid var(--lf-ink);
  border-radius: var(--lf-radius-pill);
  background: var(--lf-surface);
  font-family: var(--lf-font-display);
  font-size: 12px;
  font-weight: 600;
  color: var(--lf-text-secondary);
  box-shadow: var(--lf-shadow-chunky-sm);
  transition: background var(--lf-dur), transform var(--lf-dur) var(--lf-ease-bounce);
}
.lf-overview__more:hover { background: var(--lf-butter); transform: translateX(2px); }

.lf-overview__env {
  display: flex;
  flex-wrap: wrap;
  gap: 7px;
  margin-bottom: 11px;
}

.lf-overview__grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 9px;
}
.lf-overview__cell {
  display: flex;
  align-items: center;
  gap: 9px;
  padding: 10px 11px;
}
.lf-overview__cell:nth-child(5) {
  grid-column: span 2;
}
.lf-overview__cell-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  flex-shrink: 0;
  border: 2px solid var(--lf-ink);
  border-radius: var(--lf-radius-sm);
  color: var(--lf-ink);
}
.lf-overview__cell-body {
  display: flex;
  flex-direction: column;
  min-width: 0;
}
.lf-overview__cell-label {
  font-size: 11px;
  color: var(--lf-text-secondary);
  font-weight: 600;
}
.lf-overview__cell-value {
  font-family: var(--lf-font-display);
  font-weight: 700;
  font-size: 16px;
  color: var(--lf-text);
}
.lf-overview__cell-bar {
  width: 46px;
  height: 8px;
  margin-left: auto;
  border: 2px solid var(--lf-ink);
  border-radius: var(--lf-radius-pill);
  background: var(--lf-surface-sunken);
  overflow: hidden;
}
.lf-overview__cell:nth-child(5) .lf-overview__cell-bar {
  width: 100%;
  max-width: 180px;
}
.lf-overview__cell-fill {
  display: block;
  height: 100%;
  border-radius: var(--lf-radius-pill);
  transition: width 0.6s var(--lf-ease-out);
}
</style>
