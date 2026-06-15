<template>
  <figure class="goth-cylinder" :title="tooltip">
    <svg class="goth-cylinder__svg" viewBox="0 0 140 200" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <defs>
        <clipPath :id="ids.clip">
          <rect x="38" y="32" width="64" height="142" rx="3" />
        </clipPath>
        <linearGradient :id="ids.glass" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="rgba(220,210,195,0.14)" />
          <stop offset="45%" stop-color="rgba(180,168,148,0.06)" />
          <stop offset="100%" stop-color="rgba(230,220,200,0.12)" />
        </linearGradient>
        <linearGradient :id="ids.liquid" x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stop-color="rgba(248, 246, 240, 0.92)" />
          <stop offset="55%" stop-color="rgba(235, 232, 224, 0.85)" />
          <stop offset="100%" stop-color="rgba(255, 255, 252, 0.55)" />
        </linearGradient>
      </defs>

      <!-- Tick marks (graduations) -->
      <g stroke="currentColor" stroke-width="0.9" opacity="0.45">
        <template v-for="i in 11" :key="i">
          <line :x1="34" :y1="32 + (i - 1) * 14.2" x2="102" :y2="32 + (i - 1) * 14.2" stroke-dasharray="4 6" />
        </template>
      </g>

      <!-- Outer vessel -->
      <rect x="36" y="30" width="68" height="146" rx="4" :fill="`url(#${ids.glass})`" stroke="currentColor" stroke-width="1.8" opacity="0.9" />

      <!-- Liquid (masked to inner volume) -->
      <g :clip-path="`url(#${ids.clip})`">
        <rect x="38" y="32" width="64" height="142" fill="transparent" />
        <rect
          class="goth-cylinder__fill"
          x="40"
          :y="fillY"
          width="60"
          :height="fillHeight"
          :fill="`url(#${ids.liquid})`"
        />
        <rect
          v-if="showMotion && fillPct > 0"
          class="goth-cylinder__shimmer"
          x="42"
          :y="fillY"
          width="18"
          :height="shimmerHeight"
          fill="rgba(255,255,255,0.22)"
        />
      </g>

      <!-- Meniscus line -->
      <line
        v-if="fillPct > 0"
        class="goth-cylinder__meniscus"
        x1="42"
        :y1="meniscusY"
        x2="98"
        :y2="meniscusY"
        stroke="rgba(255,255,255,0.35)"
        stroke-width="1.2"
        stroke-linecap="round"
      />

      <!-- Rim highlight -->
      <rect x="37" y="29" width="66" height="5" rx="2" fill="none" stroke="currentColor" stroke-width="1" opacity="0.35" />
    </svg>
    <figcaption class="goth-cylinder__caption">
      <span class="goth-cylinder__label">体内精液量</span>
      <span class="goth-cylinder__val goth-mono">{{ captionMl }}</span>
      <span v-if="parsed.ml === null && displayRaw.trim()" class="goth-cylinder__raw muted">{{ displayRaw }}</span>
    </figcaption>
  </figure>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, useId } from 'vue';
import { parseFluidMl } from '../../utils/parseFluidMl';

const props = defineProps<{
  fluidAmount: string;
}>();

const INNER_TOP = 32;
const INNER_H = 142;

const uid = useId().replace(/[^a-zA-Z0-9_-]/g, '') || '0';
const ids = {
  clip: `goth-cyl-clip-${uid}`,
  glass: `goth-cyl-glass-${uid}`,
  liquid: `goth-cyl-liq-${uid}`,
};

const showMotion = ref(false);

onMounted(() => {
  showMotion.value = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
});

const parsed = computed(() => parseFluidMl(props.fluidAmount));
const displayRaw = computed(() => parsed.value.displayRaw);

const fillPct = computed(() => {
  const m = parsed.value.ml;
  if (m === null) return 0;
  return Math.min(100, Math.max(0, (m / 1000) * 100));
});

const fillHeight = computed(() => (INNER_H * fillPct.value) / 100);
const fillY = computed(() => INNER_TOP + INNER_H - fillHeight.value);
const meniscusY = computed(() => fillY.value);
const shimmerHeight = computed(() => Math.max(fillHeight.value, 1));

const captionMl = computed(() => {
  if (parsed.value.ml === null) return '— ml';
  return `${parsed.value.ml % 1 === 0 ? parsed.value.ml : parsed.value.ml.toFixed(1)} ml`;
});

const tooltip = computed(() => {
  if (!displayRaw.value.trim()) return '体内精液量';
  return `${displayRaw.value}（可视化：0–1000 ml）`;
});
</script>

<style scoped>
.goth-cylinder {
  margin: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.35rem;
  color: var(--g-text-muted);
}

.goth-cylinder__svg {
  width: min(140px, 38vw);
  height: auto;
  display: block;
}

.goth-cylinder__caption {
  text-align: center;
  font-size: 0.72rem;
  font-family: var(--g-font-ui);
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
}

.goth-cylinder__label {
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--g-text-muted);
}

.goth-cylinder__val {
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--g-text-title);
}

.goth-cylinder__raw {
  font-size: 0.68rem;
  max-width: 16rem;
  word-break: break-word;
}

.muted {
  color: var(--g-text-muted);
}

.goth-cylinder__fill {
  transition: y 0.45s ease, height 0.45s ease;
}

@media (prefers-reduced-motion: reduce) {
  .goth-cylinder__fill {
    transition: none;
  }
}

.goth-cylinder__shimmer {
  animation: goth-cylinder-shimmer 4.5s ease-in-out infinite;
  pointer-events: none;
}

@keyframes goth-cylinder-shimmer {
  0%,
  100% {
    transform: translateX(0);
    opacity: 0.35;
  }
  50% {
    transform: translateX(28px);
    opacity: 0.65;
  }
}

@media (prefers-reduced-motion: reduce) {
  .goth-cylinder__shimmer {
    animation: none;
    opacity: 0.25;
  }
}
</style>
