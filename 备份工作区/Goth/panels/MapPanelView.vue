<template>
  <div id="goth-panel-map" class="goth-panel-map goth-panel--map">
    <section class="goth-card goth-card--mb" aria-labelledby="goth-map-current-title">
      <h3 id="goth-map-current-title">当前位置</h3>
      <p id="goth-map-breadcrumb" class="crumb goth-mono">
        {{ snapshot.map.region }} → {{ snapshot.map.location }} → {{ snapshot.map.subLocation }}
      </p>
    </section>

    <GothMapBoard />

    <section class="goth-card goth-card--mb" aria-labelledby="goth-map-regions-title">
      <h3 id="goth-map-regions-title">区域分区</h3>
      <ul class="region-legend">
        <li v-for="rn in regionLegend" :key="rn">{{ rn }}</li>
      </ul>
    </section>

    <section class="goth-card" aria-labelledby="goth-map-visits-title">
      <h3 id="goth-map-visits-title">到访记录</h3>
      <p v-if="snapshot.map.regions.length === 0" class="visits-empty">当前未知</p>
      <details
        v-for="reg in snapshot.map.regions"
        :id="`goth-map-region-${reg.id}`"
        :key="reg.id"
        class="region-block goth-inset-slot"
      >
        <summary>{{ reg.name }}</summary>
        <ul>
          <li v-for="loc in reg.locations" :id="`goth-map-loc-${loc.id}`" :key="loc.id">
            <span class="name">{{ loc.name }}</span>
            <span class="goth-mono meta">首次 {{ loc.firstVisit }}</span>
            <span class="goth-tag">{{ loc.unlocked ? '已解锁' : '未解锁' }}</span>
          </li>
        </ul>
      </details>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, inject } from 'vue';
import GothMapBoard from './GothMapBoard.vue';
import { gothStateKey } from '../gothStateContext';

const state = inject(gothStateKey);
if (!state) throw new Error('未找到 Goth 状态上下文。');

const { snapshot } = state;

const regionLegend = computed(() => {
  const names = snapshot.value.map.regions.map((r) => r.name).filter(Boolean);
  return names.length ? names : ['当前未知'];
});
</script>

<style scoped>
.goth-card--mb {
  margin-bottom: 0.65rem;
}

.crumb {
  margin: 0;
  font-size: 0.95rem;
  line-height: 1.5;
  padding: 0.55rem 0.65rem;
  border-radius: var(--g-radius);
  background: radial-gradient(ellipse 120% 80% at 50% 0%, rgba(110, 143, 138, 0.14), transparent 55%),
    linear-gradient(165deg, rgba(38, 42, 40, 0.55), rgba(20, 22, 21, 0.62));
  box-shadow: inset 0 0 0 1px rgba(110, 143, 138, 0.18);
}

.region-legend {
  margin: 0;
  padding-left: 1.1rem;
  columns: 2;
  gap: 1rem;
  font-size: 0.82rem;
  color: var(--g-text-muted);
}

.region-block {
  margin-bottom: 0.45rem;
  padding: 0.35rem 0.5rem;
  border-left: 3px solid rgba(110, 143, 138, 0.22);
}

.region-block summary {
  cursor: pointer;
  font-family: var(--g-font-display);
  color: var(--g-text-accent);
}

.region-block ul {
  margin: 0.45rem 0 0;
  padding: 0;
  list-style: none;
}

.region-block li {
  position: relative;
  display: grid;
  grid-template-columns: 1fr auto auto;
  gap: 0.35rem;
  align-items: center;
  padding: 0.35rem 0;
  border-top: none;
  font-size: 0.82rem;
}

.region-block li:not(:first-child)::before {
  content: '';
  position: absolute;
  left: 3%;
  right: 3%;
  top: 0;
  height: 1px;
  background: var(--g-divider-fade-subtle);
  opacity: 0.82;
  pointer-events: none;
}

.meta {
  font-size: 0.72rem;
  color: var(--g-text-muted);
}

.visits-empty {
  margin: 0;
  font-size: 0.85rem;
  color: var(--g-text-muted);
}
</style>
