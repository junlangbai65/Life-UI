<template>
  <div
    class="adven-stat-bar"
    :class="[
      `adven-stat-bar--${variant}`,
      {
        'adven-stat-bar--compact': compact,
        'adven-stat-bar--subtle-fx': compact,
      },
    ]"
  >
    <div class="adven-stat-bar__track">
      <div
        class="adven-stat-bar__fill-clip"
        :class="{ 'adven-stat-bar__fill-clip--full': isFull }"
        :style="{ width: `${barWidth}%` }"
      >
        <div class="adven-stat-bar__fill vital-fill" :class="fillModifierClasses" />
        <div class="adven-stat-bar__liquid" aria-hidden="true" />
        <div class="adven-stat-bar__sheen" aria-hidden="true" />
      </div>
      <div v-if="!compact" class="adven-stat-bar__particles" aria-hidden="true">
        <span v-for="n in 5" :key="n" class="adven-stat-bar__particle" :data-i="n" />
      </div>
      <span class="adven-stat-bar__text">
        <span class="adven-stat-bar__tag">{{ label }}</span>
        <span class="adven-stat-bar__nums">{{ valueText }}</span>
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = withDefaults(
  defineProps<{
    label: string;
    valueText: string;
    percent: number;
    variant: 'hp' | 'mp' | 'exp';
    tier?: 'high' | 'medium' | 'low' | 'critical';
    compact?: boolean;
  }>(),
  { compact: false },
);

const barWidth = computed(() => Math.min(100, Math.max(0, Math.round(props.percent))));

const isFull = computed(() => barWidth.value >= 99.5);

const fillModifierClasses = computed(() => {
  if (props.variant === 'exp') return ['exp'];
  const tier = props.tier ?? 'high';
  return [props.variant, tier];
});
</script>
