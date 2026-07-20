<template>
  <div id="goth-combat-overlay" class="goth-combat-overlay" role="dialog" aria-modal="true" aria-labelledby="goth-combat-title">
    <article class="goth-combat-card">
      <h2 id="goth-combat-title">战斗简报</h2>
      <p class="goth-mono" style="font-size: 0.8rem; color: var(--g-text-muted); margin: 0 0 0.5rem">
        下列敌对单位正在交战中（由数据中「是否在战斗中」判定）。可点击下方结束简报。
      </p>
      <div class="goth-enemy-row goth-enemy-row--header" role="row">
        <div>单位</div>
        <div>HP</div>
        <div>ATK</div>
        <div>DEF</div>
        <div>类型</div>
      </div>
      <div
        v-for="e in snapshot.enemies"
        :id="`goth-enemy-row-${e.id}`"
        :key="e.id"
        class="goth-enemy-row"
        role="row"
      >
        <div>
          <strong>{{ e.name }}</strong>
        </div>
        <div class="goth-mono">{{ e.hpCurrent }} / {{ e.hpMax }}</div>
        <div class="goth-mono">{{ e.atk }}</div>
        <div class="goth-mono">{{ e.def }}</div>
        <div>{{ e.enemyType }}</div>
      </div>
      <div v-if="snapshot.enemies.length === 0" class="goth-enemy-row goth-enemy-row--empty" role="row">
        <div class="goth-enemy-empty-msg">当前未知</div>
      </div>
      <div class="goth-toolbar-row" style="margin-top: 0.75rem">
        <button id="goth-combat-close" type="button" class="goth-btn-primary" @click="toggleCombatDemo">结束简报</button>
      </div>
    </article>
  </div>
</template>

<script setup lang="ts">
import { inject } from 'vue';
import { gothStateKey } from './gothStateContext';

const state = inject(gothStateKey);
if (!state) throw new Error('未找到 Goth 状态上下文。');

const { snapshot, toggleCombatDemo } = state;
</script>
