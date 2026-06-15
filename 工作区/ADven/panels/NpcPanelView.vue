<template>
  <article id="npc-panel-content" class="panel-content panel-v2 npc-v2">
    <section class="npc-dossier-stage pixel-card">
      <h3 class="panel-heading">
        <svg viewBox="0 0 24 24" aria-hidden="true" class="panel-heading-icon">
          <path d="M4 5H20V19H4z" fill="none" stroke="currentColor" stroke-width="2" />
          <circle cx="9" cy="10" r="2" fill="none" stroke="currentColor" stroke-width="1.8" />
          <path d="M7 15C7.6 13.9 8.64 13.2 10 13.2C11.36 13.2 12.4 13.9 13 15M14 10H17M14 14H17" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
        </svg>
        <span>关系档案</span>
      </h3>
      <ul class="dossier-list">
        <li v-for="npc in npcList" :key="npc.name" class="quest-card dossier-card">
          <header>
            <h4>{{ npc.name }}</h4>
            <span>关系 {{ npc.relation }}</span>
          </header>
          <div class="metric-track relation-track">
            <i :style="{ width: `${toPercent(npc.relation)}%` }" />
          </div>
          <p><strong>HP：</strong>{{ npc.hp }}</p>
          <p><strong>MP：</strong>{{ npc.mp }}</p>
          <p><strong>状态：</strong>{{ npc.status.length > 0 ? npc.status.join('、') : '无' }}</p>
        </li>
        <li v-if="npcList.length === 0" class="quest-card dossier-card">
          <p><strong>NPC 档案：</strong>暂无数据</p>
          <p><strong>说明：</strong>最新 stat_data 中未包含 <code>NPC列表</code> 字段，或该列表为空。</p>
        </li>
      </ul>
    </section>
  </article>
</template>

<script setup lang="ts">
defineProps<{
  npcList: Array<{
    name: string;
    hp: string;
    mp: string;
    relation: number;
    status: string[];
  }>;
}>();

function toPercent(value: number) {
  return Math.max(4, Math.min(100, Math.round(value)));
}
</script>
