<template>
  <div class="inf-infection-badge-wrap">
    <div
      id="inf-infection-badge"
      class="inf-infection-badge"
      :class="stateModifierClass"
      :data-state="state"
      :aria-label="`感染状态：${state}`"
    >
      <span class="inf-infection-badge__lamp" aria-hidden="true">
        <span class="inf-infection-badge__lamp-halo" />
        <span class="inf-infection-badge__lamp-core" />
      </span>
      <span class="inf-infection-badge__text">{{ state }}</span>
    </div>

    <div
      v-if="state === '感染中'"
      class="inf-infection-badge__bubble-wrap"
      aria-hidden="true"
      title="感染进行中"
    >
      <div class="inf-infection-badge__bubble">
        <span class="inf-infection-badge__bubble-glow" aria-hidden="true" />
        <span class="inf-infection-badge__bubble-shine" aria-hidden="true" />
        <span class="inf-infection-badge__bubble-core" aria-hidden="true">
          <svg class="inf-infection-badge__bubble-anchor" viewBox="0 0 24 24">
            <path
              d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2 4 4 0 0 1 7 2c0 5.5-7 10-7 10Z"
              fill="currentColor"
            />
          </svg>
        </span>
      </div>
      <div class="inf-infection-badge__hearts-layer">
        <svg
          v-for="heart in hearts"
          :key="heart.id"
          class="inf-infection-badge__bubble-heart"
          :style="{
            '--heart-x': heart.x,
            '--heart-drift-x': heart.driftX,
            '--heart-drift-y': heart.driftY,
            '--heart-delay': `${heart.delay}s`,
            '--heart-duration': `${heart.duration}s`,
            '--heart-scale': heart.scale,
          }"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2 4 4 0 0 1 7 2c0 5.5-7 10-7 10Z"
            fill="#fb7185"
          />
        </svg>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { InfectionStatus } from '../../schema';

const props = defineProps<{
  state: InfectionStatus;
}>();

const STATE_MODIFIER_CLASS: Record<InfectionStatus, string> = {
  未感染: 'inf-infection-badge--uninfected',
  感染中: 'inf-infection-badge--infecting',
  已感染: 'inf-infection-badge--infected',
};

const stateModifierClass = computed(() => STATE_MODIFIER_CLASS[props.state]);

const hearts = [
  { id: 0, x: '22%', driftX: '12px', driftY: '-58px', delay: 0, duration: 2.6, scale: 1 },
  { id: 1, x: '42%', driftX: '18px', driftY: '-64px', delay: 0.65, duration: 2.9, scale: 0.92 },
  { id: 2, x: '32%', driftX: '24px', driftY: '-70px', delay: 1.3, duration: 2.7, scale: 1.04 },
  { id: 3, x: '52%', driftX: '16px', driftY: '-62px', delay: 1.95, duration: 2.5, scale: 0.88 },
];
</script>

<style scoped lang="scss">
.inf-infection-badge-wrap {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  max-width: 100%;
  overflow: visible;
}

.inf-infection-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.32rem 0.7rem 0.32rem 0.5rem;
  border-radius: 999px;
  border: 1px solid var(--inf-border);
  background: color-mix(in srgb, var(--inf-surface-glass-strong) 92%, transparent);
  font-family: var(--inf-font-ui);
  font-size: 0.78rem;
  font-weight: 600;
  letter-spacing: 0.06em;
  color: var(--inf-text);
  box-shadow: var(--inf-shadow-sm);
  transition:
    border-color var(--inf-transition),
    box-shadow var(--inf-transition);
}

.inf-infection-badge__lamp {
  position: relative;
  flex-shrink: 0;
  width: 16px;
  height: 16px;
}

.inf-infection-badge__lamp-halo {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  opacity: 0.35;
}

.inf-infection-badge__lamp-core {
  position: absolute;
  inset: 3px;
  border-radius: 50%;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.35);
}

/* 未感染 — 绿灯 */
.inf-infection-badge--uninfected {
  border-color: color-mix(in srgb, #10b981 32%, var(--inf-border));
  background: linear-gradient(
    135deg,
    color-mix(in srgb, #10b981 10%, transparent),
    color-mix(in srgb, var(--inf-surface-glass-strong) 90%, transparent)
  );
  box-shadow:
    var(--inf-shadow-sm),
    0 0 0 1px color-mix(in srgb, #10b981 8%, transparent);

  .inf-infection-badge__lamp-halo {
    background: radial-gradient(circle, rgba(16, 185, 129, 0.55) 0%, transparent 70%);
    animation: inf-lamp-glow-steady 3s ease-in-out infinite;
  }

  .inf-infection-badge__lamp-core {
    background: linear-gradient(145deg, #34d399, #059669);
    box-shadow:
      inset 0 1px 0 rgba(255, 255, 255, 0.4),
      0 0 8px rgba(16, 185, 129, 0.65);
  }

  .inf-infection-badge__text {
    color: color-mix(in srgb, #059669 85%, var(--inf-text));
  }
}

/* 感染中 — 黄灯 + 微弱呼吸 */
.inf-infection-badge--infecting {
  border-color: color-mix(in srgb, #f59e0b 38%, var(--inf-border));
  background: linear-gradient(
    135deg,
    color-mix(in srgb, #f59e0b 12%, transparent),
    color-mix(in srgb, var(--inf-surface-glass-strong) 90%, transparent)
  );
  box-shadow:
    var(--inf-shadow-sm),
    0 0 0 1px color-mix(in srgb, #f59e0b 10%, transparent);
  animation: inf-infecting-badge-breathe 3.2s ease-in-out infinite;

  .inf-infection-badge__lamp-halo {
    background: radial-gradient(circle, rgba(245, 158, 11, 0.6) 0%, transparent 70%);
    animation: inf-lamp-glow-pulse 1.6s ease-in-out infinite;
  }

  .inf-infection-badge__lamp-core {
    background: linear-gradient(145deg, #fcd34d, #d97706);
    animation: inf-lamp-blink 1.6s ease-in-out infinite;
    box-shadow:
      inset 0 1px 0 rgba(255, 255, 255, 0.45),
      0 0 10px rgba(245, 158, 11, 0.7);
  }

  .inf-infection-badge__text {
    color: color-mix(in srgb, #b45309 90%, var(--inf-text));
  }
}

/* 已感染 — 红灯 */
.inf-infection-badge--infected {
  border-color: color-mix(in srgb, #ef4444 40%, var(--inf-border));
  background: linear-gradient(
    135deg,
    color-mix(in srgb, #ef4444 12%, transparent),
    color-mix(in srgb, var(--inf-surface-glass-strong) 90%, transparent)
  );
  box-shadow:
    var(--inf-shadow-sm),
    0 0 0 1px color-mix(in srgb, #ef4444 10%, transparent);

  .inf-infection-badge__lamp-halo {
    background: radial-gradient(circle, rgba(239, 68, 68, 0.55) 0%, transparent 70%);
    animation: inf-lamp-glow-pulse 1.1s ease-in-out infinite;
  }

  .inf-infection-badge__lamp-core {
    background: linear-gradient(145deg, #f87171, #dc2626);
    animation: inf-lamp-blink 1.1s ease-in-out infinite;
    box-shadow:
      inset 0 1px 0 rgba(255, 255, 255, 0.35),
      0 0 12px rgba(239, 68, 68, 0.75);
  }

  .inf-infection-badge__text {
    color: color-mix(in srgb, #dc2626 88%, var(--inf-text));
  }
}

/* 感染中 — 爱心漂浮气泡 */
.inf-infection-badge__bubble-wrap {
  --inf-bubble-w: 2.65rem;
  --inf-bubble-h: 2rem;
  position: relative;
  flex-shrink: 0;
  width: var(--inf-bubble-w);
  height: var(--inf-bubble-h);
  overflow: visible;
}

.inf-infection-badge__bubble {
  position: absolute;
  inset: 0;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  border: 1px solid color-mix(in srgb, #fb7185 42%, var(--inf-border));
  background: linear-gradient(
    155deg,
    color-mix(in srgb, #ffe4e6 68%, var(--inf-surface-glass-strong)),
    color-mix(in srgb, #fecdd3 38%, var(--inf-bg-elevated))
  );
  backdrop-filter: blur(10px);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.55),
    inset 0 -6px 12px color-mix(in srgb, #fb7185 8%, transparent),
    0 0 0 1px color-mix(in srgb, #fb7185 10%, transparent),
    0 3px 10px color-mix(in srgb, #f43f5e 18%, transparent);
  overflow: hidden;
  animation: inf-bubble-breathe 3s ease-in-out infinite;
}

.inf-infection-badge__hearts-layer {
  position: absolute;
  left: 0;
  right: -0.75rem;
  top: -3.25rem;
  bottom: 0;
  overflow: visible;
  pointer-events: none;
  z-index: 2;
}

.inf-infection-badge__bubble-glow {
  position: absolute;
  inset: -40%;
  background: radial-gradient(circle at 50% 85%, rgba(251, 113, 133, 0.38), transparent 58%);
  animation: inf-bubble-glow-drift 2.8s ease-in-out infinite;
  pointer-events: none;
}

.inf-infection-badge__bubble-shine {
  position: absolute;
  top: 3px;
  left: 14%;
  right: 32%;
  height: 42%;
  border-radius: 999px;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.65), transparent);
  pointer-events: none;
}

.inf-infection-badge__bubble-core {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fb7185;
  animation: inf-bubble-anchor-breathe 2.4s ease-in-out infinite;
}

.inf-infection-badge__bubble-anchor {
  width: 15px;
  height: 15px;
  filter: drop-shadow(0 0 4px rgba(244, 63, 94, 0.45));
}

.inf-infection-badge__bubble-heart {
  position: absolute;
  left: var(--heart-x);
  bottom: 0.35rem;
  width: calc(16px * var(--heart-scale));
  height: calc(16px * var(--heart-scale));
  filter: drop-shadow(0 1px 2px rgba(225, 29, 72, 0.45))
    drop-shadow(0 0 6px rgba(244, 63, 94, 0.5));
  animation: inf-heart-float-ne var(--heart-duration) ease-in-out infinite;
  animation-delay: var(--heart-delay);
  pointer-events: none;
  transform-origin: center center;
}

:global([data-inf-theme='dark']) .inf-infection-badge__bubble {
  border-color: color-mix(in srgb, #fb7185 35%, var(--inf-border));
  background: linear-gradient(
    155deg,
    color-mix(in srgb, #fb7185 16%, var(--inf-surface-glass-strong)),
    color-mix(in srgb, #881337 22%, var(--inf-bg-elevated))
  );
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.08),
    inset 0 -6px 12px rgba(251, 113, 133, 0.12),
    0 0 0 1px color-mix(in srgb, #fb7185 14%, transparent),
    0 3px 14px rgba(244, 63, 94, 0.22);
}

:global([data-inf-theme='dark']) .inf-infection-badge__bubble-shine {
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.12), transparent);
}

@keyframes inf-lamp-glow-steady {
  0%,
  100% {
    opacity: 0.3;
    transform: scale(1);
  }
  50% {
    opacity: 0.45;
    transform: scale(1.08);
  }
}

@keyframes inf-lamp-glow-pulse {
  0%,
  100% {
    opacity: 0.35;
    transform: scale(1);
  }
  50% {
    opacity: 0.75;
    transform: scale(1.15);
  }
}

@keyframes inf-lamp-blink {
  0%,
  100% {
    opacity: 1;
    filter: brightness(1);
  }
  50% {
    opacity: 0.82;
    filter: brightness(1.15);
  }
}

@keyframes inf-heart-float-ne {
  0% {
    opacity: 0;
    transform: translate(0, 8px) scale(0.4);
  }
  8% {
    opacity: 1;
    transform: translate(calc(var(--heart-drift-x) * 0.1), -4px) scale(1.18);
  }
  18% {
    opacity: 1;
    transform: translate(calc(var(--heart-drift-x) * 0.28), calc(var(--heart-drift-y) * 0.22)) scale(0.94);
  }
  32% {
    opacity: 1;
    transform: translate(calc(var(--heart-drift-x) * 0.5), calc(var(--heart-drift-y) * 0.45)) scale(1.1);
  }
  50% {
    opacity: 0.88;
    transform: translate(calc(var(--heart-drift-x) * 0.72), calc(var(--heart-drift-y) * 0.68)) scale(0.9);
  }
  68% {
    opacity: 0.55;
    transform: translate(calc(var(--heart-drift-x) * 0.92), calc(var(--heart-drift-y) * 0.86)) scale(0.72);
  }
  84% {
    opacity: 0.22;
    transform: translate(var(--heart-drift-x), calc(var(--heart-drift-y) * 0.96)) scale(0.5);
  }
  100% {
    opacity: 0;
    transform: translate(calc(var(--heart-drift-x) * 1.08), var(--heart-drift-y)) scale(0.26);
  }
}

@keyframes inf-bubble-anchor-breathe {
  0%,
  100% {
    transform: scale(1);
    opacity: 0.88;
  }
  50% {
    transform: scale(1.14);
    opacity: 1;
  }
}

@keyframes inf-infecting-badge-breathe {
  0%,
  100% {
    transform: scale(1);
    box-shadow:
      var(--inf-shadow-sm),
      0 0 0 1px color-mix(in srgb, #f59e0b 10%, transparent),
      0 0 0 0 color-mix(in srgb, #f59e0b 0%, transparent);
  }
  50% {
    transform: scale(1.035);
    box-shadow:
      var(--inf-shadow-sm),
      0 0 0 1px color-mix(in srgb, #f59e0b 18%, transparent),
      0 0 14px color-mix(in srgb, #f59e0b 22%, transparent);
  }
}

@keyframes inf-bubble-breathe {
  0%,
  100% {
    transform: scale(1);
    box-shadow:
      inset 0 1px 0 rgba(255, 255, 255, 0.55),
      inset 0 -6px 12px color-mix(in srgb, #fb7185 8%, transparent),
      0 0 0 1px color-mix(in srgb, #fb7185 10%, transparent),
      0 3px 10px color-mix(in srgb, #f43f5e 18%, transparent);
  }
  50% {
    transform: scale(1.04);
    box-shadow:
      inset 0 1px 0 rgba(255, 255, 255, 0.62),
      inset 0 -6px 14px color-mix(in srgb, #fb7185 12%, transparent),
      0 0 0 2px color-mix(in srgb, #fb7185 16%, transparent),
      0 4px 14px color-mix(in srgb, #f43f5e 26%, transparent);
  }
}

@keyframes inf-bubble-glow-drift {
  0%,
  100% {
    opacity: 0.55;
    transform: translateY(0);
  }
  50% {
    opacity: 0.9;
    transform: translateY(-3px);
  }
}

@media (prefers-reduced-motion: reduce) {
  .inf-infection-badge__lamp-halo,
  .inf-infection-badge__lamp-core,
  .inf-infection-badge__bubble-heart,
  .inf-infection-badge__bubble,
  .inf-infection-badge__bubble-glow,
  .inf-infection-badge__bubble-core,
  .inf-infection-badge--infecting {
    animation: none !important;
  }
}
</style>
