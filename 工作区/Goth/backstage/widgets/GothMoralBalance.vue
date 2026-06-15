<template>
  <figure class="goth-balance" :aria-label="`道德倾向 ${label}，数值 ${value}`">
    <svg class="goth-balance__svg" viewBox="0 0 200 120" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <defs>
        <linearGradient id="goth-balance-beam" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="rgba(92, 82, 68, 0.95)" />
          <stop offset="50%" stop-color="rgba(148, 132, 108, 0.85)" />
          <stop offset="100%" stop-color="rgba(72, 64, 54, 0.95)" />
        </linearGradient>
      </defs>

      <!-- Base -->
      <path d="M60 102 L100 72 L140 102 Z" fill="rgba(40,36,32,0.55)" stroke="currentColor" stroke-width="1.3" />
      <rect x="96" y="72" width="8" height="32" rx="1" fill="url(#goth-balance-beam)" stroke="currentColor" stroke-width="1" />

      <!-- Pivot + beam group -->
      <g :transform="`rotate(${beamAngle} 100 74)`">
        <line x1="42" y1="74" x2="158" y2="74" stroke="url(#goth-balance-beam)" stroke-width="5" stroke-linecap="round" />
        <!-- chains -->
        <line x1="58" y1="74" x2="58" y2="88" stroke="currentColor" stroke-width="1.2" opacity="0.55" />
        <line x1="142" y1="74" x2="142" y2="88" stroke="currentColor" stroke-width="1.2" opacity="0.55" />
        <!-- pans -->
        <ellipse cx="58" cy="94" rx="22" ry="8" fill="rgba(48,44,38,0.5)" stroke="currentColor" stroke-width="1.2" />
        <ellipse cx="142" cy="94" rx="22" ry="8" fill="rgba(48,44,38,0.5)" stroke="currentColor" stroke-width="1.2" />
        <path d="M46 94 Q58 102 70 94" fill="none" stroke="currentColor" stroke-width="1" opacity="0.45" />
        <path d="M130 94 Q142 102 154 94" fill="none" stroke="currentColor" stroke-width="1" opacity="0.45" />
      </g>

      <!-- Fulcrum cap -->
      <circle cx="100" cy="74" r="4" fill="var(--g-archive-beige)" opacity="0.55" stroke="currentColor" stroke-width="1" />

      <!-- Axis hints -->
      <text x="52" y="112" fill="currentColor" font-size="8" opacity="0.5" font-family="system-ui, sans-serif">负向</text>
      <text x="132" y="112" fill="currentColor" font-size="8" opacity="0.5" font-family="system-ui, sans-serif">正向</text>
    </svg>
    <figcaption class="goth-balance__caption">
      <span class="goth-balance__label">{{ label }}</span>
      <span class="goth-balance__num goth-mono">{{ value }}</span>
    </figcaption>
  </figure>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { MoralityLabel } from '../../goth.types';

const props = defineProps<{
  value: number;
  label: MoralityLabel;
}>();

/** -100 → 向左倾斜；+100 → 向右倾斜（与好感条语义一致） */
const beamAngle = computed(() => {
  const v = Math.min(100, Math.max(-100, props.value));
  return (v / 100) * 22;
});
</script>

<style scoped>
.goth-balance {
  margin: 0;
  color: var(--g-text-muted);
}

.goth-balance__svg {
  width: 100%;
  max-width: 220px;
  height: auto;
  display: block;
  margin: 0 auto;
}

.goth-balance__caption {
  display: flex;
  justify-content: center;
  align-items: baseline;
  gap: 0.5rem;
  margin-top: 0.35rem;
  flex-wrap: wrap;
}

.goth-balance__label {
  font-family: var(--g-font-display);
  font-size: 1rem;
  color: var(--g-text-accent);
}

.goth-balance__num {
  font-size: 1.05rem;
  font-weight: 600;
  color: var(--g-text-title);
}
</style>
