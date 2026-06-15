<template>
  <article
    id="inf-infection-meter"
    class="inf-infection-meter inf-glass-interactive inf-stagger-item"
    :class="[
      `inf-infection-meter--tier-${tier}`,
      {
        'inf-infection-meter--shattering': shatterPhase === 'shattering',
        'inf-infection-meter--extinguished': isExtinguished,
      },
    ]"
    :style="{ '--stagger': stagger }"
    :data-inf-infection-tier="isExtinguished ? 'critical' : tier"
    :aria-label="isExtinguished ? '感染进程 100% 已熄灭' : `感染进程 ${clamped}%`"
  >
    <header class="inf-infection-meter__head">
      <span class="inf-infection-meter__label-wrap">
        <span class="inf-infection-meter__icon-box">
          <InfIcon name="activity" size="sm" />
        </span>
        <span class="inf-infection-meter__label inf-section-label">感染进程</span>
      </span>
      <span class="inf-infection-meter__meta">
        <span class="inf-infection-meter__value inf-mono">{{ clamped }}%</span>
        <InfDeltaChip v-if="!isExtinguished" :delta="delta" />
      </span>
    </header>

    <div class="inf-infection-meter__track-wrap">
      <span class="inf-infection-meter__accent-bar" aria-hidden="true" />
      <InfMeterLiquidTrack
        variant="infection"
        :percent="clamped"
        :show-liquid="!isExtinguished"
        :slosh="slosh && !isExtinguished"
        :ripple="trackRipple"
        :specular-pass="specularPass"
        :elevated="tier === 'critical' && !isExtinguished"
        :distort-active="!isExtinguished && (tier === 'critical' || (delta ?? 0) > 0 || slosh)"
        :motion-enabled="motionEnabled"
        :fill-class="[
          {
            'inf-infection-meter__fill--dying': shatterPhase === 'shattering',
            'inf-infection-meter__fill--dead': isExtinguished,
          },
        ]"
        :fill-style="infectionFillStyle"
        :track-style="{ '--inf-meter-track-height': '12px' }"
      >
        <svg
          v-if="shatterPhase !== 'idle' || isExtinguished"
          class="inf-infection-meter__shatter"
          viewBox="0 0 100 24"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path
            class="inf-infection-meter__crack inf-infection-meter__crack--a"
            d="M8 22 L22 14 L18 8 L32 12 L28 2"
            fill="none"
            stroke="currentColor"
            stroke-width="1.2"
            pathLength="120"
          />
          <path
            class="inf-infection-meter__crack inf-infection-meter__crack--b"
            d="M42 22 L48 10 L56 16 L62 4 L70 12"
            fill="none"
            stroke="currentColor"
            stroke-width="1.2"
            pathLength="120"
          />
          <path
            class="inf-infection-meter__crack inf-infection-meter__crack--c"
            d="M78 22 L84 14 L90 20 L96 8"
            fill="none"
            stroke="currentColor"
            stroke-width="1.2"
            pathLength="120"
          />
        </svg>
      </InfMeterLiquidTrack>

      <span v-if="isExtinguished" class="inf-infection-meter__ember" aria-hidden="true" />
    </div>

    <p class="inf-infection-meter__hint inf-caption">{{ hintText }}</p>
  </article>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import type { InfectionStatus } from '../../schema';
import {
  getInfectionTier,
  getInfectionTierLabel,
  type InfectionTier,
} from '../../utils/mvuDisplay';
import InfMeterLiquidTrack from './InfMeterLiquidTrack.vue';
import InfDeltaChip from './InfDeltaChip.vue';
import InfIcon from '../ui/InfIcon.vue';

const props = withDefaults(
  defineProps<{
    percent: number;
    delta?: number;
    infectionState?: InfectionStatus;
    stagger?: number;
    motionEnabled?: boolean;
  }>(),
  { delta: 0, infectionState: '未感染', stagger: 2, motionEnabled: true },
);

type ShatterPhase = 'idle' | 'shattering' | 'extinguished';

const clamped = computed(() => Math.min(100, Math.max(0, Math.round(props.percent))));
const tier = computed<InfectionTier>(() => getInfectionTier(clamped.value));
const tierLabel = computed(() => getInfectionTierLabel(tier.value));

const shatterPhase = ref<ShatterPhase>('idle');
const isExtinguished = computed(() => shatterPhase.value === 'extinguished');

const hintText = computed(() =>
  isExtinguished.value ? '临界 · 信号已熄灭' : `${tierLabel.value} · ${props.infectionState}`,
);

const infectionFillStyle = computed(() => ({
  '--inf-meter-liquid-color': 'var(--inf-tier-accent)',
  '--inf-meter-liquid-highlight': 'rgba(255, 255, 255, 0.48)',
  '--inf-meter-liquid-shadow': 'var(--inf-tier-accent-strong)',
}));

const slosh = ref(false);
const trackRipple = ref(false);
const specularPass = ref(false);
let shatterTimer: number | undefined;

function clearShatterTimer() {
  if (shatterTimer !== undefined) {
    window.clearTimeout(shatterTimer);
    shatterTimer = undefined;
  }
}

function triggerShatterSequence() {
  if (!props.motionEnabled) {
    shatterPhase.value = 'extinguished';
    return;
  }

  clearShatterTimer();
  shatterPhase.value = 'shattering';
  shatterTimer = window.setTimeout(() => {
    shatterPhase.value = 'extinguished';
    shatterTimer = undefined;
  }, 920);
}

function triggerLiquidPulse() {
  if (!props.motionEnabled) return;

  slosh.value = false;
  trackRipple.value = false;
  specularPass.value = false;
  requestAnimationFrame(() => {
    slosh.value = true;
    trackRipple.value = true;
    specularPass.value = true;
    window.setTimeout(() => {
      slosh.value = false;
      trackRipple.value = false;
      specularPass.value = false;
    }, 780);
  });
}

function resetShatter() {
  clearShatterTimer();
  shatterPhase.value = 'idle';
}

watch(
  () => props.percent,
  (next, prev) => {
    if (next < 100) {
      if (shatterPhase.value !== 'idle') resetShatter();
      if (prev !== undefined && next !== prev) {
        triggerLiquidPulse();
      }
      return;
    }

    if (shatterPhase.value === 'idle') {
      triggerShatterSequence();
    }
  },
  { immediate: true },
);

watch(
  () => props.motionEnabled,
  enabled => {
    if (!enabled && clamped.value >= 100) {
      shatterPhase.value = 'extinguished';
    }
  },
);
</script>

<style scoped lang="scss">
.inf-infection-meter {
  position: relative;
  padding: 0.75rem 0.875rem;
  margin-bottom: 0.625rem;
  border-radius: var(--inf-radius-md);
  border-left: 3px solid var(--inf-tier-accent);
  transition:
    border-color 520ms ease,
    background 520ms ease,
    box-shadow 520ms ease;
}

.inf-infection-meter--shattering {
  animation: inf-infection-shatter 720ms ease-out;
}

.inf-infection-meter--extinguished {
  border-left-color: #52525b;
  background: linear-gradient(
    135deg,
    color-mix(in srgb, #3f3f46 12%, var(--inf-surface-glass-strong)),
    color-mix(in srgb, #27272a 8%, transparent)
  );
  box-shadow: inset 0 0 0 1px color-mix(in srgb, #71717a 18%, transparent);

  .inf-infection-meter__icon-box {
    color: #71717a;
    background: color-mix(in srgb, #52525b 20%, transparent);
  }

  .inf-infection-meter__label,
  .inf-infection-meter__value {
    color: #71717a;
  }

  .inf-infection-meter__hint {
    color: #a1a1aa;
    letter-spacing: 0.06em;
  }

  .inf-infection-meter__accent-bar {
    background: linear-gradient(180deg, #71717a, #52525b);
    opacity: 0.5;
  }

  .inf-infection-meter__track {
    filter: grayscale(0.85);
  }

  .inf-infection-meter__shatter {
    opacity: 0.55;
    color: #a1a1aa;
  }
}

.inf-infection-meter__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.inf-infection-meter__label-wrap {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  min-width: 0;
}

.inf-infection-meter__icon-box {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 26px;
  border-radius: 8px;
  color: var(--inf-tier-accent-strong);
  background: color-mix(in srgb, var(--inf-tier-accent) 12%, transparent);
  transition:
    transform var(--inf-transition-fast),
    color 520ms ease,
    background 520ms ease;

  .inf-infection-meter:hover & {
    transform: scale(1.08);
  }
}

.inf-infection-meter--extinguished .inf-infection-meter__icon-box {
  transform: none;
}

.inf-infection-meter__label {
  color: var(--inf-tier-accent-strong);
}

.inf-infection-meter__meta {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  flex-shrink: 0;
}

.inf-infection-meter__value {
  font-size: 0.875rem;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
  color: var(--inf-text);
}

.inf-infection-meter__track-wrap {
  position: relative;
  padding-left: 0.35rem;
}

.inf-infection-meter__accent-bar {
  position: absolute;
  left: 0;
  top: 50%;
  width: 3px;
  height: 70%;
  transform: translateY(-50%);
  border-radius: 999px;
  background: linear-gradient(180deg, var(--inf-tier-accent), var(--inf-tier-accent-strong));
  transition: background 520ms ease, opacity 520ms ease;
}

.inf-infection-meter__track-wrap :deep(.inf-meter-glass-track) {
  margin-left: 0.35rem;
}

.inf-infection-meter__fill--dying {
  animation: inf-infection-fill-die 920ms ease-out forwards;
}

.inf-infection-meter__fill--dead {
  width: 100% !important;
  opacity: 0.45;
  background: linear-gradient(90deg, #52525b, #3f3f46);
  box-shadow: none;
}

.inf-infection-meter__shatter {
  position: absolute;
  inset: 0;
  z-index: 6;
  width: 100%;
  height: 100%;
  color: rgba(255, 255, 255, 0.85);
  pointer-events: none;
  mix-blend-mode: soft-light;
}

.inf-infection-meter__crack {
  stroke-dasharray: 120;
  stroke-dashoffset: 120;

  .inf-infection-meter--shattering & {
    animation: inf-infection-shatter-crack 680ms ease-out forwards;
  }

  .inf-infection-meter--extinguished & {
    stroke-dashoffset: 0;
  }
}

.inf-infection-meter__crack--b {
  animation-delay: 80ms !important;
}

.inf-infection-meter__crack--c {
  animation-delay: 140ms !important;
}

.inf-infection-meter__ember {
  position: absolute;
  right: 0.5rem;
  top: 50%;
  width: 4px;
  height: 4px;
  transform: translateY(-50%);
  border-radius: 50%;
  background: #71717a;
  opacity: 0.35;
  box-shadow: none;
}

.inf-infection-meter__hint {
  margin: 0.4rem 0 0;
}
</style>
