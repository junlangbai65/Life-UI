<template>
  <div
    id="inf-world-weather"
    class="inf-weather-bubble"
    :aria-label="`天气：${visual.label}`"
  >
    <div class="inf-weather-bubble__icon-wrap" aria-hidden="true">
      <InfWeatherIcon :kind="visual.kind" />
    </div>
    <span class="inf-weather-bubble__label">{{ visual.label }}</span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { resolveWeatherVisual } from '../../utils/weatherVisual';
import InfWeatherIcon from './InfWeatherIcon.vue';

const props = defineProps<{
  weather: string;
}>();

const visual = computed(() => resolveWeatherVisual(props.weather));
</script>

<style scoped lang="scss">
.inf-weather-bubble {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  min-width: 0;
  padding: 0.28rem 0.55rem 0.28rem 0.35rem;
  border-radius: 999px;
  background: var(--inf-chip-bg);
  border: 1px solid var(--inf-chip-border);
  border-left: 2px solid color-mix(in srgb, var(--inf-accent) 45%, transparent);
}

.inf-weather-bubble__icon-wrap {
  flex-shrink: 0;
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: color-mix(in srgb, var(--inf-accent-soft) 80%, transparent);
  border: 1px solid color-mix(in srgb, var(--inf-accent) 12%, transparent);
}

.inf-weather-bubble__label {
  font-family: var(--inf-font-ui);
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--inf-text);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 8rem;
}

@media (max-width: 480px) {
  .inf-weather-bubble__label {
    max-width: 5rem;
  }
}
</style>
