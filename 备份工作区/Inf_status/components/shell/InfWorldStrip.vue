<template>
  <header id="inf-world-strip" class="inf-world-strip" aria-label="世界状态 telemetry">
    <InfBioTicker />

    <div class="inf-world-strip__telemetry">
      <div
        id="inf-world-time"
        class="inf-world-strip__chip inf-world-strip__chip--time"
        :class="{ 'inf-no-motion': !motionEnabled, 'inf-world-strip__chip--time-live': timeSegments }"
      >
        <InfIcon name="clock" size="sm" class="inf-world-strip__icon" />
        <time class="inf-world-strip__datetime" :datetime="world.日期与时间">
          <span class="inf-world-strip__date">{{ worldDate }}</span>
          <span
            class="inf-world-strip__time"
            :class="{ 'inf-world-strip__time--digital': timeSegments }"
          >
            <template v-if="timeSegments">
              <span class="inf-world-strip__time-segment">{{ timeSegments.hours }}</span>
              <span class="inf-world-strip__time-colon" aria-hidden="true">:</span>
              <span class="inf-world-strip__time-segment">{{ timeSegments.minutes }}</span>
            </template>
            <template v-else>{{ worldTime }}</template>
          </span>
        </time>
      </div>

      <div id="inf-world-location" class="inf-world-strip__chip inf-world-strip__chip--location">
        <InfIcon name="location" size="sm" class="inf-world-strip__icon" />
        <span class="inf-world-strip__location inf-text-value">{{ world.地点 || '—' }}</span>
      </div>

      <InfWeatherBubble :weather="world.天气" />

      <span id="inf-world-floor" class="inf-world-strip__chip inf-world-strip__chip--floor inf-mono">
        FL {{ game.currentFloor }}
      </span>
    </div>

    <div class="inf-world-strip__actions">
      <InfHideRawTextToggle />
      <InfThemeToggle />
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useGameStore } from '../../stores/useGameStore';
import { useMvuStore } from '../../stores/useMvuStore';
import { parseTimeSegments, parseWorldDateTime } from '../../utils/mvuDisplay';
import InfBioTicker from './InfBioTicker.vue';
import InfThemeToggle from '../ui/InfThemeToggle.vue';
import InfHideRawTextToggle from '../ui/InfHideRawTextToggle.vue';
import InfWeatherBubble from './InfWeatherBubble.vue';
import InfIcon from '../ui/InfIcon.vue';

const game = useGameStore();
const mvu = useMvuStore();

const world = computed(() => mvu.data.世界);
const worldDate = computed(() => parseWorldDateTime(world.value.日期与时间).date);
const worldTime = computed(() => parseWorldDateTime(world.value.日期与时间).time);
const timeSegments = computed(() => parseTimeSegments(worldTime.value));
const motionEnabled = computed(() => game.uiSettings.motionEnabled);
</script>

<style scoped lang="scss">
.inf-world-strip {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  min-height: var(--inf-world-strip-height);
  padding: 0.55rem clamp(0.875rem, 2vw, 1.5rem);
  border-bottom: 1px solid var(--inf-border);
  background: linear-gradient(
    180deg,
    color-mix(in srgb, var(--inf-surface-glass-strong) 95%, transparent),
    color-mix(in srgb, var(--inf-surface-glass-strong) 82%, transparent)
  );
}

.inf-world-strip__telemetry {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.45rem 0.6rem;
  min-width: 0;
  flex: 1;
  justify-content: flex-end;
}

.inf-world-strip__actions {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  flex-shrink: 0;
}

.inf-world-strip__chip {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  min-width: 0;
  padding: 0.3rem 0.6rem;
  border-radius: var(--inf-radius-xs);
  background: var(--inf-chip-bg);
  border: 1px solid var(--inf-chip-border);
  border-left: 2px solid color-mix(in srgb, var(--inf-accent) 35%, transparent);
  transition:
    background var(--inf-transition),
    border-color var(--inf-transition);

  &--time {
    position: relative;
    overflow: hidden;
    font-family: var(--inf-font-tech);
  }

  &--time-live {
    border-left-color: color-mix(in srgb, var(--inf-accent) 55%, transparent);
    box-shadow:
      inset 0 0 12px color-mix(in srgb, var(--inf-accent) 8%, transparent),
      0 0 0 1px color-mix(in srgb, var(--inf-accent) 10%, transparent);

    &::after {
      content: '';
      position: absolute;
      inset: 0;
      pointer-events: none;
      background: repeating-linear-gradient(
        180deg,
        transparent 0,
        transparent 2px,
        color-mix(in srgb, var(--inf-accent) 5%, transparent) 2px,
        color-mix(in srgb, var(--inf-accent) 5%, transparent) 3px
      );
      opacity: 0.45;
      animation: inf-digital-scanline 3.2s linear infinite;
    }
  }

  &--location {
    flex: 1;
    min-width: 80px;
    max-width: min(36vw, 420px);
    font-family: var(--inf-font-ui);
  }

  &--floor {
    font-family: var(--inf-font-tech);
    font-size: 0.7rem;
    font-weight: 600;
    letter-spacing: 0.05em;
    color: var(--inf-accent);
    white-space: nowrap;
  }
}

.inf-world-strip__icon {
  color: var(--inf-accent);
  flex-shrink: 0;
}

.inf-world-strip__datetime {
  display: inline-flex;
  flex-direction: column;
  gap: 0.05rem;
  min-width: 0;
  line-height: 1.15;
}

.inf-world-strip__date {
  font-size: 0.65rem;
  font-weight: 500;
  color: var(--inf-text-secondary);
  letter-spacing: 0.04em;
}

.inf-world-strip__time {
  font-size: 1rem;
  font-weight: 700;
  color: var(--inf-text);
  letter-spacing: 0.02em;

  &--digital {
    display: inline-flex;
    align-items: baseline;
    font-variant-numeric: tabular-nums;
    color: color-mix(in srgb, var(--inf-accent-bright) 18%, var(--inf-text));
    text-shadow:
      0 0 6px color-mix(in srgb, var(--inf-accent) 28%, transparent),
      0 0 14px color-mix(in srgb, var(--inf-accent-glow) 35%, transparent);
  }
}

.inf-world-strip__time-segment {
  animation: inf-digital-segment-glow 2.4s ease-in-out infinite;

  &:last-child {
    animation-delay: 0.35s;
  }
}

.inf-world-strip__time-colon {
  margin: 0 0.04em;
  animation: inf-digital-colon-blink 1s step-end infinite;
}

.inf-world-strip__location {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 0.8125rem;
  font-weight: 600;
}

@media (min-width: 900px) {
  .inf-world-strip__telemetry {
    gap: 0.6rem 0.85rem;
  }
}

@media (min-width: 1200px) {
  .inf-world-strip__telemetry {
    justify-content: space-between;
  }

  .inf-world-strip__chip--location {
    max-width: none;
  }
}

@media (max-width: 640px) {
  .inf-world-strip__chip--floor {
    order: 5;
    width: 100%;
    justify-content: center;
  }
}
</style>
