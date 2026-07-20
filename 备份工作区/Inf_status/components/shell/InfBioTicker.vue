<template>
  <div id="inf-bio-ticker" class="inf-bio-ticker" aria-label="监测链路状态">
    <span class="inf-bio-ticker__signal" aria-hidden="true" />
    <div class="inf-bio-ticker__viewport" aria-hidden="true">
      <div class="inf-bio-ticker__track">
        <span v-for="(line, index) in doubledLines" :key="`${line}-${index}`" class="inf-bio-ticker__line">
          {{ line }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const LINES = [
  'BIOHAZARD MONITOR',
  'RACCOON CITY LINK',
  'NEXUS PARASITE TELEMETRY',
  'OUTBREAK WATCH',
  'NEURAL PATHOGEN SCAN',
  'CONTAINMENT STATUS LIVE',
];

const doubledLines = computed(() => [...LINES, ...LINES]);
</script>

<style scoped lang="scss">
.inf-bio-ticker {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-shrink: 0;
  width: min(11rem, 28vw);
  min-width: 7.5rem;
  padding: 0.35rem 0.55rem;
  border-radius: var(--inf-radius-xs);
  background: var(--inf-chip-bg, color-mix(in srgb, var(--inf-accent-soft) 45%, transparent));
  border: 1px solid var(--inf-chip-border, color-mix(in srgb, var(--inf-accent) 14%, var(--inf-border)));
  overflow: hidden;
}

.inf-bio-ticker__signal {
  flex-shrink: 0;
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--inf-tier-accent-strong);
  box-shadow: 0 0 8px var(--inf-tier-accent);
  animation: inf-signal-pulse 2.4s ease-in-out infinite;
}

.inf-bio-ticker__viewport {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  mask-image: linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent);
}

.inf-bio-ticker__track {
  display: flex;
  width: max-content;
  animation: inf-ticker-scroll 28s linear infinite;
}

.inf-bio-ticker__line {
  flex-shrink: 0;
  padding-right: 2rem;
  font-family: var(--inf-font-tech);
  font-size: 0.62rem;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--inf-accent);
  white-space: nowrap;
}

@media (max-width: 640px) {
  .inf-bio-ticker {
    display: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  .inf-bio-ticker__track {
    animation: none;
  }

  .inf-bio-ticker__line:not(:first-child) {
    display: none;
  }
}
</style>
