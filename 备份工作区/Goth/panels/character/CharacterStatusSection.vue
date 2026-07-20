<template>
  <div id="goth-panel-status" class="goth-panel-character goth-panel--status">
    <div class="goth-columns-2">
      <section class="goth-card goth-card--tier-shallow" aria-labelledby="goth-status-shallow">
        <h3 id="goth-status-shallow">浅层状态</h3>
        <StatusList :items="ch.statusShallow" tier="shallow" />
      </section>
      <section class="goth-card goth-card--tier-mid" aria-labelledby="goth-status-mid">
        <h3 id="goth-status-mid">中层状态</h3>
        <StatusList :items="ch.statusMid" tier="mid" />
      </section>
    </div>
    <section class="goth-card goth-card--spaced goth-card--tier-deep" aria-labelledby="goth-status-deep">
      <h3 id="goth-status-deep">深层状态</h3>
      <StatusList :items="ch.statusDeep" tier="deep" />
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, inject } from 'vue';
import StatusList from '../GothStatusList.vue';
import { gothStateKey } from '../../gothStateContext';

const state = inject(gothStateKey);
if (!state) throw new Error('未找到 Goth 状态上下文。');

const ch = computed(() => state.snapshot.value.character);
</script>

<style scoped>
.goth-card--spaced {
  margin-top: 0.65rem;
}

.goth-card--tier-shallow {
  box-shadow:
    inset 0 0 0 1px rgba(168, 124, 108, 0.18),
    var(--g-depth-chip, 0 2px 8px rgba(0, 0, 0, 0.2));
  background: linear-gradient(160deg, rgba(56, 44, 38, 0.42), rgba(26, 22, 18, 0.55));
}

.goth-card--tier-mid {
  box-shadow:
    inset 0 0 0 1px rgba(148, 118, 98, 0.22),
    var(--g-depth-chip, 0 2px 8px rgba(0, 0, 0, 0.2));
  background: linear-gradient(168deg, rgba(48, 40, 36, 0.5), rgba(22, 18, 16, 0.58));
}

.goth-card--tier-deep {
  box-shadow:
    inset 0 0 0 1px rgba(120, 88, 82, 0.28),
    inset 0 -12px 24px rgba(18, 12, 10, 0.35);
  background: linear-gradient(175deg, rgba(42, 32, 30, 0.62), rgba(18, 14, 12, 0.72));
}

.goth-card--tier-deep h3 {
  color: var(--g-warning);
}
</style>
