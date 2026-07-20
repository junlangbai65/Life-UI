<template>
  <article id="pet-panel-content" class="panel-content panel-v2 pet-v2">
    <section class="pet-codex-stage pixel-card">
      <h3 class="panel-heading">
        <svg viewBox="0 0 24 24" aria-hidden="true" class="panel-heading-icon">
          <path d="M7 9C7 7.34 8.34 6 10 6C11.02 6 11.93 6.51 12.47 7.29C12.99 6.51 13.9 6 14.93 6C16.58 6 17.93 7.34 17.93 9C17.93 10.43 17.02 11.64 15.74 12.09L12.47 13.22L9.2 12.09C7.91 11.64 7 10.43 7 9z" fill="none" stroke="currentColor" stroke-width="1.8" />
          <path d="M10 14L12.47 15L15 14V18H10z" fill="none" stroke="currentColor" stroke-width="1.8" />
        </svg>
        <span>魔宠图鉴</span>
      </h3>
      <div class="pet-list codex">
        <article v-for="pet in pets" :key="pet.name" class="pet-card pixel-card codex-card">
          <header>
            <h4>{{ pet.name }}</h4>
            <span>{{ pet.race }} · {{ pet.tier }}</span>
          </header>
          <p>{{ pet.brief }}</p>
          <div class="pet-meters">
            <label>
              忠诚
              <div class="metric-track loyalty-track">
                <i :style="{ width: `${toPercent(pet.loyalty)}%` }" />
              </div>
            </label>
            <label>
              疲劳
              <div class="metric-track fatigue-track">
                <i :style="{ width: `${toPercent(pet.fatigue)}%` }" />
              </div>
            </label>
          </div>
          <div class="pet-stats">
            <span>HP {{ pet.hp }}</span>
            <span>MP {{ pet.mp }}</span>
            <span>忠诚 {{ pet.loyalty }}</span>
            <span>疲劳 {{ pet.fatigue }}</span>
            <span>ATK {{ pet.atk }}</span>
            <span>DEF {{ pet.def }}</span>
          </div>
        </article>
        <div v-if="pets.length === 0" class="empty-note">暂无魔宠</div>
      </div>
    </section>
  </article>
</template>

<script setup lang="ts">
defineProps<{
  pets: Array<{
    name: string;
    brief: string;
    race: string;
    tier: string;
    hp: string;
    mp: string;
    loyalty: string;
    fatigue: string;
    atk: number;
    def: number;
  }>;
}>();

function toPercent(raw: string) {
  const parsed = Number.parseInt(`${raw}`.replace(/[^\d-]/g, ''), 10);
  if (Number.isNaN(parsed)) {
    return 0;
  }
  return Math.max(0, Math.min(100, parsed));
}
</script>
