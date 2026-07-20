<template>
  <header class="status-header">
    <div class="status-header__top">
      <time :id="datetimeId" class="status-header__datetime" :datetime="isoHint">{{ world.datetimeLine }}</time>
      <ThemeSegment />
    </div>
    <div class="status-header__meta">
      <span v-if="world.weather" class="ios-chip">
        <Icon :name="weatherIconName" size="sm" />
        {{ world.weather }}
      </span>
      <span
        id="wife-status-grad-countdown"
        class="ios-pill"
        :class="{
          'ios-pill--urgent': world.gradUrgent,
          'ios-pill--endgame': world.isEndgame,
          'grad-pulse': world.gradUrgent,
        }"
      >
        <Icon name="graduation-cap" size="sm" />
        {{ gradLabel }}
      </span>
    </div>
  </header>
</template>

<script setup lang="ts">
import { Icon, weatherIcon } from './icons';
import ThemeSegment from './ui/ThemeSegment.vue';
import { useMvuSlices } from '../composables/useMvuSlices';

const { worldSlice: world } = useMvuSlices();

const datetimeId = 'wife-status-datetime';

const isoHint = computed(() => {
  const w = world.value;
  if (!w.year) return '';
  return `${w.year}-${String(w.month).padStart(2, '0')}-${String(w.day).padStart(2, '0')}`;
});

const weatherIconName = computed(() => weatherIcon(world.value.weather));

const gradLabel = computed(() => {
  if (world.value.isEndgame) return '典礼';
  return `${world.value.gradDays}天`;
});
</script>

<style scoped>
.status-header__top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 6px;
}

.status-header__datetime {
  font-size: 13px;
  font-weight: 600;
  color: var(--c-label);
  line-height: 1.3;
  flex: 1;
  min-width: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.status-header__meta {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  align-items: center;
  margin-bottom: 8px;
}
</style>
