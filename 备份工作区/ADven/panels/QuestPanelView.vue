<template>
  <article id="quest-panel-content" class="panel-content panel-v2 quest-v2">
    <section class="quest-timeline-stage pixel-card">
      <h3>任务时间轴</h3>
      <ul class="quest-list timeline">
        <li v-for="quest in quests" :key="quest.name" class="quest-card timeline-card">
          <header>
            <h4>{{ quest.name }}</h4>
            <span>{{ quest.type }}</span>
          </header>
          <p><strong>当前目标：</strong>{{ quest.objective }}</p>
          <p><strong>描述：</strong>{{ quest.description }}</p>
        </li>
        <li v-if="quests.length === 0" class="quest-card timeline-card">
          <p><strong>当前目标：</strong>暂无任务</p>
          <p><strong>描述：</strong>任务列表为空。</p>
        </li>
      </ul>
    </section>
  </article>
</template>

<script setup lang="ts">
import type { QuestEntry } from '../adven.types';

defineProps<{
  quests: QuestEntry[];
}>();
</script>
