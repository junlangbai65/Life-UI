<template>
  <article id="achievement-panel-content" class="panel-content panel-v2 achievement-v2">
    <section class="achievement-gallery-stage pixel-card">
      <h3 class="panel-heading">
        <svg viewBox="0 0 24 24" aria-hidden="true" class="panel-heading-icon">
          <circle cx="12" cy="8.5" r="4" fill="none" stroke="currentColor" stroke-width="2" />
          <path d="M9.5 12.5L8 20L12 17.8L16 20L14.5 12.5" fill="none" stroke="currentColor" stroke-width="2" />
        </svg>
        <span>勋章陈列</span>
      </h3>
      <ul class="line-list achievement-list">
        <li v-for="(achievement, index) in achievements" :key="achievement.title">
          <div class="metric-head">
            <span>{{ achievement.title }}</span>
            <em class="rarity-chip" :class="`rarity-${inferRarity(achievement.title, achievement.condition, index)}`">
              {{ rarityLabel(inferRarity(achievement.title, achievement.condition, index)) }}
            </em>
          </div>
          <strong>{{ achievement.condition }}</strong>
        </li>
        <li v-if="achievements.length === 0">
          <span>暂无称号成就</span>
        </li>
      </ul>
    </section>
  </article>
</template>

<script setup lang="ts">
defineProps<{
  achievements: Array<{ title: string; condition: string }>;
}>();

type RarityKey = 'legendary' | 'epic' | 'rare' | 'common';

function inferRarity(title: string, condition: string, index: number): RarityKey {
  const text = `${title}${condition}`;
  if (/传说|神话|终焉|天选/.test(text)) return 'legendary';
  if (/史诗|大师|宗师|王者/.test(text)) return 'epic';
  if (/稀有|精英|先锋|专家/.test(text)) return 'rare';
  return index % 2 === 0 ? 'common' : 'rare';
}

function rarityLabel(rarity: RarityKey) {
  if (rarity === 'legendary') return '传说';
  if (rarity === 'epic') return '史诗';
  if (rarity === 'rare') return '稀有';
  return '普通';
}
</script>
