<template>
  <div id="goth-panel-time">
    <section class="goth-card clock-card" aria-labelledby="goth-time-title">
      <h3 id="goth-time-title">历法与时间</h3>
      <p id="goth-time-date" class="date goth-mono">{{ tw.date }}</p>
      <p id="goth-time-weekday" class="week">{{ tw.weekday }}</p>
      <p id="goth-time-period" class="period">{{ tw.period }}</p>
    </section>
    <section class="goth-card weather-card" aria-labelledby="goth-weather-title">
      <h3 id="goth-weather-title">天气状况</h3>
      <p id="goth-weather-desc">{{ tw.weather }}</p>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, inject } from 'vue';
import { gothStateKey } from '../gothStateContext';

const state = inject(gothStateKey);
if (!state) throw new Error('未找到 Goth 状态上下文。');

const tw = computed(() => state.snapshot.value.timeWeather);
</script>

<style scoped>
.clock-card {
  margin-bottom: 0.65rem;
}

.date {
  font-size: 1.35rem;
  margin: 0.35rem 0 0.15rem;
  color: var(--g-text-title);
}

.week {
  margin: 0;
  font-family: var(--g-font-ui);
  color: var(--g-text-muted);
  font-size: 0.88rem;
}

.period {
  margin: 0.65rem 0 0;
  font-family: var(--g-font-display);
  font-size: 1.25rem;
  color: var(--g-archive-beige);
}

.weather-card p {
  margin: 0.35rem 0 0;
  font-size: 0.92rem;
  line-height: 1.55;
}
</style>
