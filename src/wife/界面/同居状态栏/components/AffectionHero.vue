<template>
  <section class="ios-group affection-hero" aria-labelledby="wife-status-affection-title">
    <h2 id="wife-status-affection-title" class="sr-only">凌月好感</h2>
    <div class="affection-hero__inner">
      <div class="affection-hero__ring" aria-hidden="true">
        <svg viewBox="0 0 64 64" class="affection-hero__svg">
          <circle cx="32" cy="32" r="24" fill="none" stroke="var(--c-fill)" stroke-width="5" />
          <circle
            cx="32"
            cy="32"
            r="24"
            fill="none"
            stroke="var(--c-accent-affection)"
            stroke-width="5"
            stroke-linecap="round"
            :stroke-dasharray="ringCircumference"
            :stroke-dashoffset="ringOffset"
            transform="rotate(-90 32 32)"
            class="affection-hero__progress"
          />
        </svg>
        <span class="affection-hero__value">{{ animatedAffection }}</span>
      </div>
      <div class="affection-hero__meta">
        <p class="affection-hero__label">
          <Icon name="heart" size="sm" />
        </p>
        <Transition name="stage-fade" mode="out-in">
          <p id="wife-status-affection-stage" :key="relation.stage" class="affection-hero__stage">
            {{ relation.stage }}
          </p>
        </Transition>
        <MeterBar :value="relation.affectionPercent" color="var(--c-accent-affection)" />
        <p class="affection-hero__cap">/ 400</p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { Icon } from './icons';
import MeterBar from './ui/MeterBar.vue';
import { useAnimatedNumber, useAnimatedPercent } from '../composables/useValueAnimation';
import { useMvuSlices } from '../composables/useMvuSlices';

const { relationSlice: relation } = useMvuSlices();

const animatedAffection = useAnimatedNumber(() => relation.value.affection);
const animatedPercent = useAnimatedPercent(() => relation.value.affectionPercent);

const ringCircumference = 2 * Math.PI * 24;
const ringOffset = computed(() => ringCircumference * (1 - animatedPercent.value / 100));
</script>

<style scoped>
.affection-hero {
  padding: 10px 12px;
}

.affection-hero__inner {
  display: flex;
  align-items: center;
  gap: 10px;
}

.affection-hero__ring {
  position: relative;
  width: 52px;
  height: 52px;
  flex-shrink: 0;
}

.affection-hero__svg {
  width: 52px;
  height: 52px;
}

.affection-hero__progress {
  transition: stroke-dashoffset var(--duration-meter) var(--ease-ios);
}

.affection-hero__value {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  font-weight: 700;
}

.affection-hero__label {
  display: flex;
  color: var(--c-accent-affection);
  margin-bottom: 2px;
}

.affection-hero__stage {
  font-size: 14px;
  font-weight: 700;
  margin: 0 0 6px;
  line-height: 1.2;
}

.affection-hero__cap {
  font-size: 10px;
  color: var(--c-label-secondary);
  margin-top: 4px;
}

.affection-hero__meta {
  flex: 1;
  min-width: 0;
}
</style>
