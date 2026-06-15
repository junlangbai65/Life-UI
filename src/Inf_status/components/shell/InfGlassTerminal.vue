<template>
  <section id="inf-glass-terminal" class="inf-glass-terminal" aria-label="叙事终端">
    <div class="inf-glass-terminal__accent" aria-hidden="true" />
    <div class="inf-glass-terminal__ambient inf-ambient-glow" aria-hidden="true" />

    <InfWorldStrip class="inf-glass-terminal__header" />

    <div class="inf-glass-terminal__body">
      <InfStatusRail class="inf-glass-terminal__rail" />
      <div class="inf-glass-terminal__main">
        <InfReadingPanel class="inf-glass-terminal__narrative" />
        <InfInputDock class="inf-glass-terminal__input" />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import InfInputDock from '../narrative/InfInputDock.vue';
import InfReadingPanel from '../narrative/InfReadingPanel.vue';
import InfStatusRail from '../status/InfStatusRail.vue';
import InfWorldStrip from './InfWorldStrip.vue';
</script>

<style scoped lang="scss">
.inf-glass-terminal {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  min-height: 0;
  border-radius: 0;
  overflow: hidden;
  background: var(--inf-surface-glass);
  backdrop-filter: blur(var(--inf-blur-heavy)) saturate(190%);
  border-top: 1px solid var(--inf-border-strong);
  border-bottom: 1px solid var(--inf-border-strong);
}

.inf-glass-terminal__accent {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(
    90deg,
    transparent,
    color-mix(in srgb, var(--inf-accent) 70%, transparent) 20%,
    color-mix(in srgb, var(--inf-tier-accent) 60%, transparent) 50%,
    color-mix(in srgb, var(--inf-accent) 70%, transparent) 80%,
    transparent
  );
  pointer-events: none;
}

.inf-glass-terminal__ambient {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.inf-glass-terminal__header {
  position: relative;
  flex-shrink: 0;
  z-index: 2;
}

.inf-glass-terminal__body {
  position: relative;
  display: flex;
  flex: 1;
  min-height: 0;
  z-index: 1;
}

.inf-glass-terminal__rail {
  flex: 0 0 var(--inf-status-rail-width);
  min-width: 0;
  min-height: 0;
  border-right: 1px solid var(--inf-border);
  background: color-mix(in srgb, var(--inf-surface-glass-strong) 55%, transparent);
}

.inf-glass-terminal__main {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
  min-height: 0;
  border-top: none;
  background: linear-gradient(
    180deg,
    color-mix(in srgb, var(--inf-bg) 40%, transparent) 0%,
    color-mix(in srgb, var(--inf-surface-glass-strong) 75%, transparent) 100%
  );
}

.inf-glass-terminal__narrative {
  flex: 1;
  min-height: 0;
  padding: clamp(0.5rem, 1vw, 0.75rem) clamp(0.625rem, 1.5vw, 1rem) 0.375rem;
  overflow: hidden;
}

.inf-glass-terminal__input {
  flex-shrink: 0;
  max-height: var(--inf-compose-max-height);
  padding: clamp(0.75rem, 1.5vw, 1rem) clamp(0.875rem, 2vw, 1.5rem)
    clamp(0.75rem, 1.5vw, 1rem);
  border-top: 1px solid var(--inf-border);
  background: linear-gradient(
    180deg,
    color-mix(in srgb, var(--inf-surface-glass-strong) 70%, transparent),
    color-mix(in srgb, var(--inf-surface-glass-strong) 92%, transparent)
  );
}

@media (min-width: 1200px) {
  .inf-glass-terminal__rail {
    flex-basis: var(--inf-status-rail-width-wide);
  }
}

@media (max-width: 768px) {
  .inf-glass-terminal__body {
    flex-direction: column;
    min-height: 0;
  }

  .inf-glass-terminal__rail {
    flex: 0 0 auto;
    max-height: var(--inf-rail-max-height-mobile);
    border-right: none;
    border-bottom: 1px solid var(--inf-border);
  }

  .inf-glass-terminal__main {
    flex: 1 1 auto;
    min-height: 0;
  }

  .inf-glass-terminal__input {
    max-height: none;
  }
}
</style>
