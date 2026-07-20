<template>
  <article
    class="inf-progress-card"
    :class="[
      `inf-progress-card--${variant}`,
      `inf-progress-card--tier-${tier}`,
      { 'inf-progress-card--compact': compact, 'inf-glass': !compact },
    ]"
    :aria-label="`${label} ${clamped}%`"
  >
    <header class="inf-progress-card__head">
      <span class="inf-progress-card__label">{{ label }}</span>
      <span class="inf-progress-card__value inf-mono">{{ clamped }}%</span>
    </header>
    <div class="inf-progress-card__track" role="presentation">
      <div class="inf-progress-card__fill" :style="{ width: `${clamped}%` }">
        <span class="inf-progress-card__glow" aria-hidden="true" />
      </div>
      <div class="inf-progress-card__sheen" aria-hidden="true" />
    </div>
    <p v-if="hint" class="inf-progress-card__hint inf-caption">{{ hint }}</p>
  </article>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { InfectionTier } from '../../utils/mvuDisplay';
import { getInfectionTier, getInfectionTierLabel } from '../../utils/mvuDisplay';

const props = withDefaults(
  defineProps<{
    label: string;
    percent: number;
    variant?: 'infection' | 'desire';
    showTierHint?: boolean;
    compact?: boolean;
  }>(),
  { variant: 'infection', showTierHint: false, compact: false },
);

const clamped = computed(() => Math.min(100, Math.max(0, Math.round(props.percent))));

const tier = computed<InfectionTier>(() =>
  props.variant === 'infection' ? getInfectionTier(clamped.value) : 'low',
);

const hint = computed(() =>
  props.showTierHint && props.variant === 'infection'
    ? `当前阶段：${getInfectionTierLabel(tier.value)}`
    : '',
);
</script>

<style scoped lang="scss">
.inf-progress-card {
  padding: 0.875rem;
  border-radius: var(--inf-radius-md);
  margin-bottom: 0.625rem;
}

.inf-progress-card__head {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 0.45rem;
}

.inf-progress-card__label {
  font-size: 0.6875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--inf-text-muted);
}

.inf-progress-card__value {
  font-size: 0.8125rem;
  font-weight: 600;
}

.inf-progress-card__track {
  position: relative;
  height: 7px;
  border-radius: 999px;
  background: color-mix(in srgb, var(--inf-border) 90%, transparent);
  overflow: hidden;
}

.inf-progress-card__fill {
  position: relative;
  height: 100%;
  border-radius: inherit;
  transition: width var(--inf-transition-slow);
}

.inf-progress-card--infection .inf-progress-card__fill {
  background: linear-gradient(90deg, var(--inf-tier-accent), var(--inf-tier-accent-strong));
}

.inf-progress-card--desire .inf-progress-card__fill {
  background: linear-gradient(90deg, var(--inf-accent), var(--inf-accent-bright));
}

.inf-progress-card__glow {
  position: absolute;
  right: 0;
  top: 50%;
  width: 12px;
  height: 12px;
  transform: translate(50%, -50%);
  border-radius: 50%;
  background: var(--inf-tier-accent-strong);
  filter: blur(4px);
  opacity: 0.7;
}

.inf-progress-card--desire .inf-progress-card__glow {
  background: var(--inf-accent-bright);
}

.inf-progress-card__sheen {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.28), transparent 65%);
  pointer-events: none;
}

.inf-progress-card--compact {
  padding: 0;
  margin-bottom: 0.55rem;
  background: transparent;
  border: none;
  box-shadow: none;

  .inf-progress-card__track {
    height: 6px;
  }
}
</style>
