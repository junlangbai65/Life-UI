<template>
  <div id="goth-panel-physiology" class="goth-panel-character goth-panel--physiology">
    <section class="goth-card goth-card--cylinder" aria-labelledby="goth-char-fluid-title">
      <h2 id="goth-char-fluid-title" class="goth-panel-section-title goth-panel-section-title--phys">计量读数</h2>
      <GothFluidGraduatedCylinder :fluid-amount="ch.physiological.fluidAmount" />
    </section>
    <section class="goth-card" aria-labelledby="goth-char-bio-title">
      <h2 id="goth-char-bio-title" class="goth-panel-section-title goth-panel-section-title--phys">体征摘要</h2>
      <ul class="phys-grid" role="list">
        <li class="phys-tile goth-inset-slot">
          <span class="phys-tile__k">性行为次数</span>
          <span class="phys-tile__v goth-mono">{{ ch.physiological.sexCount }}</span>
        </li>
        <li class="phys-tile goth-inset-slot">
          <span class="phys-tile__k">怀孕状态</span>
          <span class="phys-tile__v">{{ ch.physiological.pregnancy }}</span>
        </li>
      </ul>

      <div class="phys-bodydev" aria-labelledby="goth-char-bodydev-title">
        <h3 id="goth-char-bodydev-title" class="phys-bodydev__heading">身体开发度</h3>
        <div class="phys-bodydev-grid">
          <article
            v-for="part in ch.physiological.bodyDevelopment"
            :id="`goth-bodydev-${slug(part.name)}`"
            :key="part.name"
            class="phys-bodydev-cell goth-inset-slot"
          >
            <header>
              <strong>{{ part.name }}</strong>
              <span class="goth-tag">Lv{{ part.level }}</span>
            </header>
            <div class="goth-progress" :title="`${part.currentXp}/${part.maxXp}`">
              <span :style="{ width: `${part.maxXp ? (part.currentXp / part.maxXp) * 100 : 0}%` }" />
            </div>
            <small class="goth-mono phys-bodydev-xp">{{ part.currentXp }}/{{ part.maxXp }}</small>
          </article>
        </div>
        <p v-if="ch.physiological.bodyDevelopment.length === 0" class="phys-bodydev-empty muted">当前未知</p>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, inject } from 'vue';
import GothFluidGraduatedCylinder from '../../backstage/widgets/GothFluidGraduatedCylinder.vue';
import { gothStateKey } from '../../gothStateContext';

const state = inject(gothStateKey);
if (!state) throw new Error('未找到 Goth 状态上下文。');

const ch = computed(() => state.snapshot.value.character);

function slug(name: string) {
  return name.replace(/\s+/g, '-');
}
</script>

<style scoped>
.goth-card--cylinder {
  margin-bottom: 0.65rem;
  text-align: center;
}

.goth-panel-section-title--phys {
  text-align: left;
  border-bottom: 1px solid var(--g-divider-fade-subtle);
  padding-bottom: 0.35rem;
  margin-bottom: 0.55rem;
}

.phys-grid {
  margin: 0;
  padding: 0;
  list-style: none;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(9.5rem, 1fr));
  gap: 0.45rem;
}

.phys-tile {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  padding: 0.5rem 0.55rem;
  font-size: 0.85rem;
  background: linear-gradient(180deg, rgba(42, 40, 36, 0.5), rgba(24, 22, 20, 0.35));
  box-shadow: inset 0 0 0 1px rgba(108, 124, 138, 0.12);
}

.phys-tile__k {
  font-family: var(--g-font-ui);
  color: var(--g-text-muted);
  font-size: 0.68rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.phys-tile__v {
  color: var(--g-text-title);
  font-weight: 600;
  line-height: 1.35;
}

.phys-bodydev {
  margin-top: 0.65rem;
  padding-top: 0.55rem;
  border-top: 1px solid var(--g-divider-fade-subtle);
}

.phys-bodydev__heading {
  margin: 0 0 0.45rem;
  font-family: var(--g-font-display);
  font-size: 0.95rem;
  color: var(--g-text-accent);
}

.phys-bodydev-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 0.45rem;
}

.phys-bodydev-cell {
  padding: 0.4rem 0.45rem;
  background: linear-gradient(180deg, rgba(42, 46, 50, 0.48), rgba(22, 24, 26, 0.38));
  border-top: 2px solid rgba(138, 155, 171, 0.35);
  border-bottom: 2px solid rgba(138, 155, 171, 0.12);
}

.phys-bodydev-cell header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.35rem;
  margin-bottom: 0.35rem;
}

.phys-bodydev-cell header strong {
  font-size: 0.82rem;
}

.phys-bodydev-xp {
  display: block;
  margin-top: 0.25rem;
  font-size: 0.72rem;
}

.phys-bodydev-empty {
  margin: 0.35rem 0 0;
  font-size: 0.85rem;
}

.muted {
  color: var(--g-text-muted);
}
</style>
