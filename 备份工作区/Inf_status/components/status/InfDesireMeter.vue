<template>
  <article
    id="inf-desire-meter"
    class="inf-desire-meter inf-glass-interactive inf-stagger-item"
    :class="[
      `inf-desire-meter--tier-${tier}`,
      { 'inf-desire-meter--liquid-active': liquidPhase !== 'idle' },
    ]"
    :style="{ '--stagger': stagger }"
    :data-inf-desire-tier="tier"
    :aria-label="`性欲 ${clamped}%`"
  >
    <header class="inf-desire-meter__head">
      <span class="inf-desire-meter__label-wrap">
        <span class="inf-desire-meter__icon-box">
          <InfIcon name="heart" size="sm" />
        </span>
        <span class="inf-desire-meter__label inf-section-label">性欲</span>
      </span>
      <span class="inf-desire-meter__meta">
        <span class="inf-desire-meter__value inf-mono">{{ clamped }}%</span>
        <InfDeltaChip :delta="delta" variant="desire" />
      </span>
    </header>

    <div class="inf-desire-meter__track-wrap">
      <InfMeterLiquidTrack
        variant="desire"
        :percent="clamped"
        :slosh="slosh"
        :ripple="trackRipple"
        :specular-pass="specularPass"
        :elevated="tier === 'surge'"
        :distort-active="tier === 'surge' || slosh"
        :motion-enabled="motionEnabled"
        :fill-style="desireFillStyle"
      />
    </div>

    <p class="inf-desire-meter__hint inf-caption">{{ tierLabel }}</p>

    <div
      v-if="liquidPhase !== 'idle'"
      class="inf-desire-meter__liquid-overlay"
      :class="`inf-desire-meter__liquid-overlay--${liquidPhase}`"
      aria-hidden="true"
    >
      <span class="inf-desire-meter__liquid-body" />
      <span class="inf-desire-meter__liquid-sheen" />
    </div>
  </article>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import {
  getDesireTier,
  getDesireTierLabel,
  type DesireTier,
} from '../../utils/mvuDisplay';
import InfMeterLiquidTrack from './InfMeterLiquidTrack.vue';
import InfDeltaChip from './InfDeltaChip.vue';
import InfIcon from '../ui/InfIcon.vue';

const props = withDefaults(
  defineProps<{
    percent: number;
    delta?: number;
    stagger?: number;
    rollbackToZero?: boolean;
    motionEnabled?: boolean;
  }>(),
  { delta: 0, stagger: 3, rollbackToZero: false, motionEnabled: true },
);

type LiquidPhase = 'idle' | 'filling' | 'hold' | 'wiping';

const clamped = computed(() => Math.min(100, Math.max(0, Math.round(props.percent))));
const tier = computed<DesireTier>(() => getDesireTier(clamped.value));
const tierLabel = computed(() => getDesireTierLabel(tier.value));

const desireFillStyle = computed(() => ({
  '--inf-meter-liquid-color': 'var(--inf-desire-accent)',
  '--inf-meter-liquid-highlight': 'rgba(255, 255, 255, 0.52)',
  '--inf-meter-liquid-shadow': 'var(--inf-desire-accent-strong)',
}));

const liquidPhase = ref<LiquidPhase>('idle');
const slosh = ref(false);
const trackRipple = ref(false);
const specularPass = ref(false);

let fillTimer: number | undefined;
let holdTimer: number | undefined;
let wipeTimer: number | undefined;
const playedFloorKey = ref('');

function clearLiquidTimers() {
  [fillTimer, holdTimer, wipeTimer].forEach(id => {
    if (id !== undefined) window.clearTimeout(id);
  });
  fillTimer = holdTimer = wipeTimer = undefined;
}

function playLiquidSequence() {
  if (!props.motionEnabled) return;

  clearLiquidTimers();
  liquidPhase.value = 'filling';

  fillTimer = window.setTimeout(() => {
    liquidPhase.value = 'hold';
    fillTimer = undefined;

    holdTimer = window.setTimeout(() => {
      liquidPhase.value = 'wiping';
      holdTimer = undefined;

      wipeTimer = window.setTimeout(() => {
        liquidPhase.value = 'idle';
        wipeTimer = undefined;
      }, 720);
    }, 380);
  }, 680);
}

watch(
  () => [props.rollbackToZero, getCurrentMessageId()] as const,
  ([rollback, floorId]) => {
    const key = `${floorId}`;
    if (!rollback || !props.motionEnabled) return;
    if (playedFloorKey.value === key) return;

    playedFloorKey.value = key;
    playLiquidSequence();
  },
  { immediate: true },
);

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

watch(
  () => props.percent,
  (next, prev) => {
    if (prev !== undefined && next !== prev && liquidPhase.value === 'idle') {
      triggerLiquidPulse();
    }
  },
);
</script>

<style scoped lang="scss">
.inf-desire-meter {
  position: relative;
  padding: 0.75rem 0.875rem;
  margin-bottom: 0.625rem;
  border-radius: var(--inf-radius-md);
  border-left: 3px solid var(--inf-desire-accent);
  box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--inf-desire-accent) 8%, transparent);
  overflow: hidden;
}

.inf-desire-meter--tier-surge {
  background: linear-gradient(
    135deg,
    color-mix(in srgb, var(--inf-desire-accent-soft) 38%, transparent),
    transparent 58%
  );
  box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--inf-desire-accent) 14%, transparent);
}

.inf-desire-meter--liquid-active {
  z-index: 1;
}

.inf-desire-meter__head {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.inf-desire-meter__label-wrap {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
}

.inf-desire-meter__icon-box {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 26px;
  border-radius: 8px;
  color: var(--inf-desire-accent-strong);
  background: var(--inf-desire-accent-soft);
  transition: transform var(--inf-transition-fast);

  .inf-desire-meter:hover & {
    transform: scale(1.08);
  }
}

.inf-desire-meter__label {
  color: var(--inf-desire-accent-strong);
}

.inf-desire-meter__meta {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  flex-shrink: 0;
}

.inf-desire-meter__value {
  font-size: 0.875rem;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
  color: var(--inf-desire-accent-strong);
}

.inf-desire-meter__track-wrap {
  position: relative;
  z-index: 1;
}

.inf-desire-meter__hint {
  position: relative;
  z-index: 1;
  margin: 0.4rem 0 0;
  color: color-mix(in srgb, var(--inf-desire-accent) 70%, var(--inf-text-muted));
}

.inf-desire-meter__liquid-overlay {
  position: absolute;
  inset: 0;
  z-index: 3;
  border-radius: inherit;
  pointer-events: none;
  overflow: hidden;
}

.inf-desire-meter__liquid-body {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.97) 0%,
    rgba(248, 250, 252, 0.94) 55%,
    rgba(241, 245, 249, 0.92) 100%
  );
  transform: translateY(100%);
  filter: url(#inf-liquid-still);
}

.inf-desire-meter__liquid-sheen {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    105deg,
    transparent 0%,
    rgba(255, 255, 255, 0.55) 45%,
    transparent 100%
  );
  opacity: 0;
}

.inf-desire-meter__liquid-overlay--filling .inf-desire-meter__liquid-body {
  animation: inf-desire-liquid-fill 680ms cubic-bezier(0.22, 1, 0.36, 1) forwards;
}

.inf-desire-meter__liquid-overlay--filling .inf-desire-meter__liquid-sheen,
.inf-desire-meter__liquid-overlay--hold .inf-desire-meter__liquid-sheen {
  animation: inf-desire-liquid-sheen 900ms ease-in-out infinite;
  opacity: 1;
}

.inf-desire-meter__liquid-overlay--hold .inf-desire-meter__liquid-body {
  transform: translateY(0);
  opacity: 0.94;
}

.inf-desire-meter__liquid-overlay--wiping {
  animation: inf-desire-liquid-wipe 720ms cubic-bezier(0.4, 0, 0.2, 1) forwards;
}

:global([data-inf-theme='dark']) .inf-desire-meter__liquid-body {
  background: linear-gradient(
    180deg,
    rgba(250, 250, 250, 0.92) 0%,
    rgba(228, 228, 231, 0.88) 100%
  );
}
</style>
