<template>
  <div
    ref="cardRef"
    class="adven-briefing-card adven-briefing-card--draggable"
    role="dialog"
    aria-modal="true"
    aria-labelledby="adven-briefing-title"
    :style="cardPositionStyle"
    @click.stop
  >
    <div class="adven-briefing-card__border" aria-hidden="true"></div>
    <div class="adven-briefing-card__inner">
      <header ref="handleRef" class="adven-briefing-card__head adven-briefing-card__head--drag" title="拖动">
        <h2 id="adven-briefing-title">交战情报</h2>
        <button id="adven-enemy-briefing-close" type="button" class="pixel-btn close-btn" @click="$emit('close')">
          关闭
        </button>
      </header>
      <div class="adven-briefing-card__body">
        <ul v-if="enemies.length > 0" class="adven-enemy-list">
          <li v-for="enemy in enemies" :key="enemy.name" class="adven-enemy-card">
            <header class="adven-enemy-card__title">
              <div class="adven-enemy-card__identity">
                <strong>{{ enemy.name }}</strong>
                <span class="adven-enemy-card__meta">{{ enemy.race }}</span>
              </div>
              <span class="adven-enemy-card__threat" :class="`adven-enemy-card__threat--${threatRank(enemy.tier)}`">
                <span class="adven-enemy-card__threat-k">{{ threatLabel(enemy.tier) }}</span>
                <span class="adven-enemy-card__threat-v">T{{ enemy.tier }} · Lv.{{ enemy.level }}</span>
              </span>
            </header>
            <section class="adven-enemy-card__resources">
              <div class="adven-enemy-bar adven-enemy-bar--hp">
                <AdvenStatBar
                  label="HP"
                  :value-text="`${enemy.currentHp} / ${enemy.maxHp}`"
                  :percent="hpPercent(enemy)"
                  variant="hp"
                  :tier="hpTier(enemy)"
                  compact
                />
              </div>
              <div class="adven-enemy-bar adven-enemy-bar--mp">
                <AdvenStatBar
                  label="MP"
                  :value-text="`${enemy.currentMp} / ${enemy.maxMp}`"
                  :percent="mpPercent(enemy)"
                  variant="mp"
                  :tier="mpTier(enemy)"
                  compact
                />
              </div>
            </section>
            <section class="adven-enemy-card__summary">
              <p class="adven-enemy-stats">ATK {{ enemy.atk }} · DEF {{ enemy.def }}</p>
              <p v-if="enemy.status.length > 0" class="adven-enemy-status">状态：{{ enemy.status.join('、') }}</p>
              <p v-else class="adven-enemy-status adven-enemy-status--empty">状态：暂无异常</p>
            </section>
          </li>
        </ul>
        <div v-else class="adven-enemy-empty">
          <p class="empty-note">当前无交战敌人</p>
          <p class="adven-enemy-empty__hint">侦察与遭遇信息将在交战触发后显示。</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, ref } from 'vue';
import { useDraggable } from '@vueuse/core';
import AdvenStatBar from './AdvenStatBar.vue';
import type { EnemyEntry } from './adven.types';

const props = defineProps<{
  enemies: EnemyEntry[];
  containerEl: HTMLElement | null;
}>();

defineEmits<{
  close: [];
}>();

const cardRef = ref<HTMLElement | null>(null);
const handleRef = ref<HTMLElement | null>(null);

const { x, y, style: dragStyle } = useDraggable(cardRef, {
  handle: handleRef,
  containerElement: () => props.containerEl ?? undefined,
  preventDefault: true,
});

const cardPositionStyle = computed(() => `${dragStyle.value};position:absolute;z-index:2;`);

function hpPercent(e: EnemyEntry) {
  if (e.maxHp <= 0) return 0;
  return Math.min(100, Math.round((e.currentHp / e.maxHp) * 100));
}

function mpPercent(e: EnemyEntry) {
  if (e.maxMp <= 0) return 0;
  return Math.min(100, Math.round((e.currentMp / e.maxMp) * 100));
}

function toTier(percent: number): 'high' | 'medium' | 'low' | 'critical' {
  if (percent >= 70) return 'high';
  if (percent >= 35) return 'medium';
  if (percent >= 15) return 'low';
  return 'critical';
}

function hpTier(e: EnemyEntry) {
  return toTier(hpPercent(e));
}

function mpTier(e: EnemyEntry) {
  return toTier(mpPercent(e));
}

function parseTierValue(tier: EnemyEntry['tier']) {
  if (typeof tier === 'number') return tier;
  const parsed = Number.parseInt(String(tier).replace(/[^\d]/g, ''), 10);
  return Number.isFinite(parsed) ? parsed : 0;
}

function threatRank(tier: EnemyEntry['tier']): 'low' | 'medium' | 'high' | 'extreme' {
  const value = parseTierValue(tier);
  if (value >= 8) return 'extreme';
  if (value >= 5) return 'high';
  if (value >= 3) return 'medium';
  return 'low';
}

function threatLabel(tier: EnemyEntry['tier']) {
  const rank = threatRank(tier);
  if (rank === 'extreme') return '威胁 极高';
  if (rank === 'high') return '威胁 高';
  if (rank === 'medium') return '威胁 中';
  return '威胁 低';
}

async function centerCard() {
  await nextTick();
  await new Promise<void>(r => {
    requestAnimationFrame(() => requestAnimationFrame(() => r()));
  });
  const portal = props.containerEl;
  const card = cardRef.value;
  if (!portal || !card) return;
  const pw = portal.clientWidth;
  const ph = portal.clientHeight;
  const cw = card.offsetWidth || 320;
  const ch = card.offsetHeight || 200;
  x.value = Math.max(0, (pw - cw) / 2);
  y.value = Math.max(0, (ph - ch) / 2);
}

onMounted(() => {
  void centerCard();
});
</script>
