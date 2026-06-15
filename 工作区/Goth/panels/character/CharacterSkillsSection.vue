<template>
  <div id="goth-panel-skills" class="goth-panel-character goth-panel--skills">
    <section class="goth-card" aria-labelledby="goth-char-skills-title">
      <h2 id="goth-char-skills-title" class="goth-panel-section-title">技能</h2>
      <div class="goth-skill-grid">
        <article v-for="s in ch.skills" :id="`goth-skill-${s.name}`" :key="s.name" class="goth-skill-cell goth-inset-slot skill-ribbon">
          <header>
            <strong>{{ s.name }}</strong>
            <span class="goth-tag">LV{{ s.level }}</span>
          </header>
          <div class="goth-progress" :title="`${s.currentXp}/${s.maxXp}`">
            <span :style="{ width: `${s.maxXp ? (s.currentXp / s.maxXp) * 100 : 0}%` }" />
          </div>
          <small class="goth-mono">{{ s.currentXp }}/{{ s.maxXp }}</small>
        </article>
      </div>
      <p v-if="ch.skills.length === 0" class="skills-empty muted">当前未知</p>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, inject } from 'vue';
import { gothStateKey } from '../../gothStateContext';

const state = inject(gothStateKey);
if (!state) throw new Error('未找到 Goth 状态上下文。');

const ch = computed(() => state.snapshot.value.character);
</script>

<style scoped>
.goth-skill-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 0.45rem;
}

.goth-skill-cell {
  padding: 0.4rem 0.45rem;
}

.skill-ribbon {
  background: linear-gradient(180deg, rgba(48, 52, 44, 0.55), rgba(22, 24, 20, 0.4));
  border-top: 2px solid rgba(143, 158, 134, 0.35);
  border-bottom: 2px solid rgba(143, 158, 134, 0.12);
}

.goth-skill-cell header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.35rem;
  margin-bottom: 0.35rem;
}

.skills-empty {
  margin: 0.45rem 0 0;
  font-size: 0.85rem;
}

.muted {
  color: var(--g-text-muted);
}
</style>
