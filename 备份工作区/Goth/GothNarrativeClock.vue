<template>
  <div
    class="goth-lcd"
    :class="{ 'goth-lcd--idle': !time, 'goth-lcd--tick': tickFlash }"
    role="timer"
    :aria-label="ariaLabel"
  >
    <div class="goth-lcd__bezel">
      <span class="goth-lcd__scanlines" aria-hidden="true" />
      <span class="goth-lcd__sheen" aria-hidden="true" />
      <div class="goth-lcd__face">
        <span class="goth-lcd__digits" :class="{ 'goth-lcd__digits--dim': !time }">{{ parts.hh }}</span>
        <span class="goth-lcd__colon" aria-hidden="true">:</span>
        <span class="goth-lcd__digits" :class="{ 'goth-lcd__digits--dim': !time }">{{ parts.mm }}</span>
        <template v-if="parts.ss !== null">
          <span class="goth-lcd__colon goth-lcd__colon--slow" aria-hidden="true">:</span>
          <span class="goth-lcd__digits goth-lcd__digits--sec">{{ parts.ss }}</span>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue';

const props = defineProps<{
  /** `HH:MM` 或 `HH:MM:SS`；null 表示暂无 `<time>` */
  time: string | null;
}>();

const tickFlash = ref(false);
let tickTimer: ReturnType<typeof setTimeout> | null = null;

watch(
  () => props.time,
  () => {
    if (tickTimer) clearTimeout(tickTimer);
    tickFlash.value = true;
    tickTimer = setTimeout(() => {
      tickFlash.value = false;
      tickTimer = null;
    }, 420);
  },
);

const parts = computed(() => {
  const t = props.time;
  if (!t) return { hh: '--', mm: '--', ss: null as string | null };
  const seg = t.split(':');
  const hh = seg[0]?.length ? seg[0] : '--';
  const mm = seg[1]?.length ? seg[1] : '--';
  const ss = seg[2]?.length ? seg[2] : null;
  return { hh, mm, ss };
});

const ariaLabel = computed(() =>
  props.time ? `叙事时间 ${props.time}` : '叙事时间：等待 AI 回复中的 time 标签',
);

onBeforeUnmount(() => {
  if (tickTimer) clearTimeout(tickTimer);
});
</script>

<style scoped>
.goth-lcd {
  --lcd-digit: rgba(168, 205, 132, 0.92);
  --lcd-digit-dim: rgba(92, 108, 72, 0.55);
  --lcd-glow: rgba(130, 180, 88, 0.35);
  --lcd-panel-top: #1a2215;
  --lcd-panel-bot: #0a0e08;

  display: block;
  width: 100%;
  max-width: 100%;
  min-width: 0;
}

.goth-lcd__bezel {
  position: relative;
  border-radius: 5px;
  padding: 0.28rem 0.42rem 0.32rem;
  background: linear-gradient(165deg, rgba(44, 40, 34, 0.95) 0%, rgba(18, 16, 14, 0.98) 100%);
  box-shadow:
    inset 0 1px 0 rgba(110, 98, 82, 0.16),
    inset 0 -2px 8px rgba(4, 3, 2, 0.55),
    0 0 0 1px rgba(12, 10, 8, 0.88),
    0 2px 6px rgba(6, 5, 4, 0.35);
}

.goth-lcd__face {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: baseline;
  justify-content: flex-end;
  gap: 0.06em;
  padding: 0.22rem 0.38rem 0.2rem;
  border-radius: 3px;
  background: linear-gradient(178deg, var(--lcd-panel-top) 0%, var(--lcd-panel-bot) 100%);
  box-shadow:
    inset 0 3px 14px rgba(2, 4, 2, 0.65),
    inset 0 1px 0 rgba(52, 62, 42, 0.12),
    inset 0 -1px 0 rgba(0, 0, 0, 0.45);
  font-family: var(--g-font-mono);
  font-weight: 600;
  font-size: clamp(1.05rem, 2.8vw, 1.42rem);
  font-variant-numeric: tabular-nums;
  letter-spacing: 0.06em;
  line-height: 1;
  color: var(--lcd-digit);
  text-shadow:
    0 0 10px var(--lcd-glow),
    0 0 22px rgba(100, 140, 70, 0.18),
    0 1px 0 rgba(0, 0, 0, 0.85);
}

.goth-lcd__digits--dim {
  color: var(--lcd-digit-dim);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.65);
}

.goth-lcd__digits--sec {
  font-size: 0.72em;
  opacity: 0.88;
  margin-left: -0.02em;
}

.goth-lcd__colon {
  opacity: 0.82;
  animation: goth-lcd-colon 1.1s step-end infinite;
  transform: translateY(-0.04em);
}

.goth-lcd__colon--slow {
  animation-duration: 1.6s;
}

.goth-lcd__scanlines {
  position: absolute;
  inset: 1px;
  z-index: 2;
  border-radius: 4px;
  pointer-events: none;
  opacity: 0.22;
  background: repeating-linear-gradient(
    180deg,
    transparent 0,
    transparent 1px,
    rgba(0, 0, 0, 0.22) 1px,
    rgba(0, 0, 0, 0.22) 2px
  );
  animation: goth-lcd-scan-drift 5.5s linear infinite;
  mix-blend-mode: multiply;
}

.goth-lcd__sheen {
  position: absolute;
  inset: 0;
  z-index: 3;
  border-radius: inherit;
  pointer-events: none;
  background: linear-gradient(
    125deg,
    transparent 35%,
    rgba(200, 210, 170, 0.06) 48%,
    transparent 62%
  );
  animation: goth-lcd-sheen 6s ease-in-out infinite;
}

.goth-lcd--tick .goth-lcd__face {
  animation: goth-lcd-flip 0.38s ease-out;
}

.goth-lcd--idle .goth-lcd__colon {
  animation: none;
  opacity: 0.38;
}

@keyframes goth-lcd-colon {
  0%,
  100% {
    opacity: 0.88;
  }

  50% {
    opacity: 0.28;
  }
}

@keyframes goth-lcd-scan-drift {
  0% {
    transform: translateY(0);
  }

  100% {
    transform: translateY(4px);
  }
}

@keyframes goth-lcd-sheen {
  0%,
  100% {
    opacity: 0.35;
    transform: translateX(-8%);
  }

  50% {
    opacity: 0.65;
    transform: translateX(8%);
  }
}

@keyframes goth-lcd-flip {
  0% {
    filter: brightness(1.35);
    transform: scale(1.012);
  }

  45% {
    filter: brightness(0.82);
    transform: scale(0.995);
  }

  100% {
    filter: brightness(1);
    transform: scale(1);
  }
}

@media (prefers-reduced-motion: reduce) {
  .goth-lcd__colon {
    animation: none;
    opacity: 0.85;
  }

  .goth-lcd__scanlines,
  .goth-lcd__sheen {
    animation: none;
  }

  .goth-lcd--tick .goth-lcd__face {
    animation: none;
  }
}
</style>
