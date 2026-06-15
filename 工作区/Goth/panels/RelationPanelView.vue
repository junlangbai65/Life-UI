<template>
  <div id="goth-panel-relation" class="goth-panel-relation">
    <section class="goth-card goth-card--mb" aria-labelledby="goth-rel-chars-title">
      <h3 id="goth-rel-chars-title">人物关系</h3>
      <ul class="rel-list">
        <li v-if="snapshot.relations.length === 0" class="muted empty-line">当前未知</li>
        <li v-for="r in snapshot.relations" :id="`goth-rel-${r.id}`" :key="r.id" class="rel-row">
          <div class="rel-head">
            <strong>{{ r.name }}</strong>
            <span class="goth-tag">{{ r.relationLabel }}</span>
          </div>
          <div class="favor">
            <span class="label">好感度</span>
            <div class="bar goth-meter-track" role="progressbar" :aria-valuenow="r.favor" aria-valuemin="-100" aria-valuemax="100">
              <span class="fill" :style="favorStyle(r.favor)" />
            </div>
            <span class="goth-mono num">{{ r.favor }}</span>
          </div>
          <div class="goth-mono mini">
            HP {{ r.hpCurrent }}/{{ r.hpMax }} · SAN
            <template v-if="r.sanUnavailable">N/A</template>
            <template v-else>{{ r.san }}/{{ r.sanMax }}</template>
          </div>
          <p class="muted mini">异常：{{ r.abnormalSummary }}</p>
        </li>
      </ul>
    </section>

    <section class="goth-card goth-card--mb" aria-labelledby="goth-rel-faction-title">
      <h3 id="goth-rel-faction-title">阵营声望</h3>
      <ul class="faction-list">
        <li v-if="snapshot.factions.length === 0" class="muted empty-line">当前未知</li>
        <li v-for="f in snapshot.factions" :id="`goth-faction-${f.id}`" :key="f.id">
          <div class="faction-head">
            <strong>{{ f.name }}</strong>
            <span class="goth-tag">{{ f.label }}</span>
          </div>
          <div class="goth-mono">{{ f.value }}</div>
        </li>
      </ul>
    </section>

    <section class="goth-card goth-card--moral-balance" aria-labelledby="goth-rel-moral-title">
      <h3 id="goth-rel-moral-title">道德倾向</h3>
      <GothMoralBalance :value="snapshot.morality.value" :label="snapshot.morality.label" />
    </section>
  </div>
</template>

<script setup lang="ts">
import { inject } from 'vue';
import GothMoralBalance from '../backstage/widgets/GothMoralBalance.vue';
import { gothStateKey } from '../gothStateContext';

const state = inject(gothStateKey);
if (!state) throw new Error('未找到 Goth 状态上下文。');

const { snapshot } = state;

function favorStyle(v: number) {
  const pct = ((v + 100) / 200) * 100;
  const hue = v >= 0 ? 40 : 280;
  return {
    width: `${pct}%`,
    background: `linear-gradient(90deg, rgba(138, 106, 106, 0.35), hsl(${hue} 18% 42%))`,
  };
}
</script>

<style scoped>
.goth-card--mb {
  margin-bottom: 0.65rem;
}

.rel-list {
  margin: 0;
  padding: 0;
  list-style: none;
}

.rel-row {
  position: relative;
  padding: 0.55rem 0;
  border-bottom: none;
}

.rel-row:not(:last-child)::after {
  content: '';
  position: absolute;
  left: 3%;
  right: 3%;
  bottom: 0;
  height: 1px;
  background: var(--g-divider-fade-subtle);
  opacity: 0.88;
  pointer-events: none;
}

.rel-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.35rem;
}

.favor {
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 0.35rem;
  align-items: center;
  margin-bottom: 0.35rem;
}

.label {
  font-size: 0.72rem;
  color: var(--g-text-muted);
  font-family: var(--g-font-ui);
}

.bar {
  height: 8px;
}

.fill {
  display: block;
  height: 100%;
  border-radius: inherit;
  transition: width 0.35s ease;
}

.num {
  font-size: 0.78rem;
}

.mini {
  font-size: 0.78rem;
  margin: 0.2rem 0 0;
}

.muted {
  color: var(--g-text-muted);
}

.faction-list {
  margin: 0;
  padding: 0;
  list-style: none;
}

.faction-list li {
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.45rem 0;
  border-bottom: none;
}

.faction-list li:not(:last-child)::after {
  content: '';
  position: absolute;
  left: 3%;
  right: 3%;
  bottom: 0;
  height: 1px;
  background: var(--g-divider-fade-subtle);
  opacity: 0.85;
  pointer-events: none;
}

.faction-head {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
}

.goth-card--moral-balance {
  text-align: center;
}

.goth-card--moral-balance h3 {
  text-align: left;
  margin-bottom: 0.35rem;
}

.goth-panel-relation .rel-row {
  padding-left: 0.35rem;
  border-left: 2px solid rgba(155, 134, 168, 0.22);
}

.goth-panel-relation .faction-list li {
  padding-left: 0.35rem;
  border-left: 2px solid rgba(155, 134, 168, 0.18);
}

.empty-line {
  padding: 0.45rem 0;
  font-size: 0.85rem;
}
</style>
