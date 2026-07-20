<template>
  <section class="narrative-quest-card pixel-card" aria-label="任务简报">
    <header class="narrative-quest-card__head">
      <svg class="narrative-quest-card__icon" viewBox="0 0 24 24" aria-hidden="true">
        <path
          d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z"
          fill="none"
          stroke="currentColor"
          stroke-width="1.8"
          stroke-linejoin="round"
        />
        <path d="M14 2v6h6M8 13h8M8 17h5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
      </svg>
      <span class="narrative-quest-card__title">任务简报</span>
    </header>
    <ul class="narrative-quest-card__list">
      <li v-for="quest in displayQuests" :key="quest.name" class="narrative-quest-card__item">
        <div class="narrative-quest-card__row">
          <h4 class="narrative-quest-card__name">{{ quest.name }}</h4>
          <span class="narrative-quest-card__type">{{ quest.type }}</span>
        </div>
        <p class="narrative-quest-card__objective">
          <span class="narrative-quest-card__label">目标</span>{{ quest.objective || '—' }}
        </p>
      </li>
      <li v-if="quests.length === 0" class="narrative-quest-card__empty">暂无登记任务</li>
    </ul>
    <p v-if="hiddenQuestCount > 0" class="narrative-quest-card__more">还有 {{ hiddenQuestCount }} 项未在侧栏展开，可在数据面板打开「任务」查看全部</p>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { QuestEntry } from './adven.types';

const props = defineProps<{
  quests: QuestEntry[];
}>();

const maxVisible = 4;

/** 侧栏空间有限，优先展示前几条 */
const displayQuests = computed(() => props.quests.slice(0, maxVisible));

const hiddenQuestCount = computed(() => Math.max(0, props.quests.length - maxVisible));
</script>
