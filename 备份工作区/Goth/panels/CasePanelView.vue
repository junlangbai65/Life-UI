<template>
  <div id="goth-panel-case" class="goth-panel-case goth-panel--case">
    <section class="goth-card" aria-labelledby="goth-case-active-title">
      <h3 id="goth-case-active-title">当前案件（至多三项）</h3>
      <ul class="case-list">
        <li v-for="c in snapshot.activeCases" :id="`goth-case-${c.id}`" :key="c.id" class="case-card goth-inset-slot">
          <header>
            <strong>{{ c.name }}</strong>
            <span class="goth-tag">{{ c.taskType }}</span>
          </header>
          <dl class="grid">
            <div><dt>委托人</dt><dd>{{ c.client }}</dd></div>
            <div><dt>报酬</dt><dd>{{ c.reward }}</dd></div>
            <div><dt>时限</dt><dd class="goth-mono">{{ c.timeLimit }}</dd></div>
            <div><dt>承接时间</dt><dd class="goth-mono">{{ c.acceptedAt }}</dd></div>
          </dl>
        </li>
        <li v-if="snapshot.activeCases.length === 0" class="muted">当前未知</li>
      </ul>
    </section>
    <section class="goth-card stat-banner" aria-labelledby="goth-case-done-title">
      <h3 id="goth-case-done-title">已完成案件</h3>
      <p class="big">{{ snapshot.completedCaseCount }}</p>
    </section>
  </div>
</template>

<script setup lang="ts">
import { inject } from 'vue';
import { gothStateKey } from '../gothStateContext';

const state = inject(gothStateKey);
if (!state) throw new Error('未找到 Goth 状态上下文。');

const { snapshot } = state;
</script>

<style scoped>
.case-list {
  margin: 0;
  padding: 0;
  list-style: none;
}

.case-card {
  padding: 0.55rem 0.65rem;
  margin-bottom: 0.45rem;
}

.case-card header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.35rem;
  margin-bottom: 0.45rem;
}

.grid {
  margin: 0;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.35rem;
  font-size: 0.82rem;
}

.grid dt {
  color: var(--g-text-muted);
  font-family: var(--g-font-ui);
}

.grid dd {
  margin: 0.1rem 0 0;
}

.muted {
  color: var(--g-text-muted);
}

.small {
  font-size: 0.8rem;
}

.stat-banner {
  margin-top: 0.65rem;
  text-align: center;
  border: 1px dashed rgba(125, 138, 158, 0.28);
}

.big {
  margin: 0.25rem 0;
  font-family: var(--g-font-display);
  font-size: 2.2rem;
  color: var(--g-archive-beige);
}

.goth-panel--case .case-card {
  position: relative;
  border-radius: 2px 6px 6px 6px;
  box-shadow:
    inset 8px 0 0 rgba(125, 138, 158, 0.22),
    inset 0 0 0 1px rgba(92, 102, 118, 0.15);
}

.goth-panel--case .case-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 28%;
  height: 10px;
  background: linear-gradient(180deg, rgba(125, 138, 158, 0.28), rgba(56, 52, 48, 0.15));
  border-radius: 2px 8px 0 0;
  pointer-events: none;
}
</style>
