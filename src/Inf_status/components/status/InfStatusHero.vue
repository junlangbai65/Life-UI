<template>
  <header
    id="inf-status-hero"
    class="inf-status-hero inf-glass-interactive inf-stagger-item"
    :style="{ '--stagger': 1 }"
  >
    <div class="inf-status-hero__name-plate">
      <span class="inf-status-hero__name-accent" aria-hidden="true" />
      <span class="inf-status-hero__name-glow" aria-hidden="true" />
      <h2 class="inf-text-name inf-status-hero__name">{{ displayName }}</h2>
    </div>
    <InfCharacterSwitchButton
      v-if="characterKeys.length > 1"
      v-model="activeCharacterKey"
      :keys="characterKeys"
    />
    <InfInfectionBadge :state="infectionState" />
  </header>
</template>

<script setup lang="ts">
import type { InfectionStatus } from '../../schema';
import InfCharacterSwitchButton from './InfCharacterSwitchButton.vue';
import InfInfectionBadge from './InfInfectionBadge.vue';

defineProps<{
  displayName: string;
  infectionState: InfectionStatus;
  characterKeys: string[];
}>();

const activeCharacterKey = defineModel<string>('activeCharacterKey', { required: true });
</script>

<style scoped lang="scss">
.inf-status-hero {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.55rem 0.65rem;
  padding: 0;
  margin-bottom: 0.625rem;
  border-radius: 0;
  background: transparent;
  box-shadow: none;
}

.inf-status-hero__name-plate {
  position: relative;
  flex: 1 1 auto;
  min-width: 0;
  padding: 0.7rem 0.85rem 0.7rem 1rem;
  border-radius: var(--inf-radius-md);
  overflow: hidden;
  background: linear-gradient(
    135deg,
    color-mix(in srgb, var(--inf-accent-soft) 55%, var(--inf-bg-elevated)) 0%,
    color-mix(in srgb, var(--inf-surface-glass-strong) 92%, transparent) 100%
  );
  border: 1px solid color-mix(in srgb, var(--inf-accent) 22%, var(--inf-border));
  box-shadow:
    inset 0 1px 0 color-mix(in srgb, #fff 35%, transparent),
    var(--inf-shadow-sm);
}

.inf-status-hero__name-accent {
  position: absolute;
  left: 0;
  top: 0.45rem;
  bottom: 0.45rem;
  width: 3px;
  border-radius: 0 3px 3px 0;
  background: linear-gradient(
    180deg,
    var(--inf-accent-bright),
    color-mix(in srgb, var(--inf-tier-accent-strong) 70%, var(--inf-accent))
  );
}

.inf-status-hero__name-glow {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: radial-gradient(
    ellipse 80% 120% at 0% 50%,
    color-mix(in srgb, var(--inf-accent) 12%, transparent),
    transparent 65%
  );
}

.inf-status-hero__name {
  position: relative;
  z-index: 1;
  margin: 0;
  font-size: clamp(1.25rem, 4vw, 1.5rem);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 100%;
  color: var(--inf-text);
  text-shadow: 0 1px 0 color-mix(in srgb, var(--inf-bg-elevated) 40%, transparent);
}
</style>
