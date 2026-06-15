<template>
  <article id="social-panel-content" class="panel-content panel-v2 social-v2">
    <section class="social-network-stage pixel-card">
      <h3 class="panel-heading">
        <svg viewBox="0 0 24 24" aria-hidden="true" class="panel-heading-icon">
          <circle cx="6" cy="8" r="2" fill="none" stroke="currentColor" stroke-width="1.8" />
          <circle cx="18" cy="8" r="2" fill="none" stroke="currentColor" stroke-width="1.8" />
          <circle cx="12" cy="16" r="2" fill="none" stroke="currentColor" stroke-width="1.8" />
          <path d="M8 8H16M7 10L11 14M17 10L13 14" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
        </svg>
        <span>关系网络</span>
      </h3>
      <ul class="line-list social-list">
        <li v-for="npc in social.npcNetwork" :key="npc.name">
          <div class="metric-head">
            <span>{{ npc.name }}（{{ npc.role }}）</span>
            <strong>好感度 {{ npc.favorability }}</strong>
          </div>
          <div class="metric-track relation-track">
            <i :style="{ width: `${toPercent(npc.favorability)}%` }" />
          </div>
        </li>
        <li v-if="social.npcNetwork.length === 0">
          <span>暂无已记录关系</span>
        </li>
      </ul>
    </section>

    <section class="social-reputation-stage pixel-card">
      <h3 class="panel-heading">
        <svg viewBox="0 0 24 24" aria-hidden="true" class="panel-heading-icon">
          <path d="M5 7H19V17H5z" fill="none" stroke="currentColor" stroke-width="2" />
          <path d="M9 12H15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
        </svg>
        <span>阵营倾向</span>
      </h3>
      <div class="faction-balance-card">
        <div class="faction-balance-header">
          <span>守序 / 混沌天平</span>
          <strong>{{ moralityScore > 0 ? `+${moralityScore}` : moralityScore }}</strong>
        </div>
        <div class="faction-balance-shell">
          <div class="faction-balance-beam" :style="{ '--tilt-angle': `${moralityTiltDeg}deg` }">
            <span class="faction-pan faction-pan-left"></span>
            <span class="faction-pan faction-pan-right"></span>
          </div>
          <span class="faction-pillar"></span>
          <span class="faction-base"></span>
        </div>
        <p class="faction-morality-text">{{ social.morality }}</p>
      </div>

      <div class="stat-grid two">
        <div class="stat-card"><span>声望</span><strong>{{ social.reputation }}</strong></div>
      </div>
    </section>
  </article>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  social: {
    npcNetwork: Array<{ name: string; role: string; favorability: number }>;
    morality: string;
    reputation: string;
  };
}>();

function toPercent(value: number) {
  return Math.max(4, Math.min(100, Math.round(value)));
}

function parseMoralityScore(raw: string): number {
  const text = `${raw ?? ''}`.trim();
  const numberMatch = text.match(/[+-]?\d+/);
  if (numberMatch?.[0]) {
    const parsed = Number.parseInt(numberMatch[0], 10);
    if (Number.isFinite(parsed)) {
      return Math.max(-100, Math.min(100, parsed));
    }
  }

  if (/守序|善良|正义|光明/.test(text)) return 65;
  if (/中立|平衡|摇摆/.test(text)) return 0;
  if (/混沌|邪恶|黑暗|恶行/.test(text)) return -65;
  return 0;
}

const moralityScore = computed(() => parseMoralityScore(props.social.morality));
const moralityTiltDeg = computed(() => (moralityScore.value / 100) * 22);
</script>
