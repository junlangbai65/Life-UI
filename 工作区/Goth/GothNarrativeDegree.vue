<template>
  <div
    class="goth-deg"
    :class="{ 'goth-deg--idle': !value, 'goth-deg--has-temp': hasNumericTemp }"
    role="status"
    :aria-label="ariaLabel"
  >
    <div class="goth-deg__chassis">
      <span class="goth-deg__bulb" aria-hidden="true" :style="bulbInlineStyle" />
      <div class="goth-deg__channel-wrap">
        <div class="goth-deg__channel">
          <span class="goth-deg__channel-tint" aria-hidden="true" />
          <span
            class="goth-deg__mercury"
            :style="mercuryInlineStyle"
            aria-hidden="true"
          />
          <span class="goth-deg__ticks" aria-hidden="true" />
          <span class="goth-deg__glass-top" aria-hidden="true" />
          <span class="goth-deg__glass-edge" aria-hidden="true" />
        </div>
      </div>
      <div class="goth-deg__readout" :style="readoutAmbientStyle">
        <span class="goth-deg__rim" aria-hidden="true" />
        <span class="goth-deg__value goth-mono" :style="valueTextStyle">{{ display }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  /** 如 `24℃`；null 表示暂无 `<degree>` */
  value: string | null;
}>();

/** 叙事温度计有效刻度：±50°C（钳制后映射柱长与色相） */
const TEMP_RANGE = 50;

type Rgb = { r: number; g: number; b: number };

/** 规范化温度 t∈[0,1]：严格「越低越蓝、越高越红」，冷段拉长饱和蓝、热段拉长红橙 */
const RGB_STOPS: { t: number; rgb: Rgb }[] = [
  { t: 0, rgb: { r: 22, g: 72, b: 168 } },
  { t: 0.18, rgb: { r: 42, g: 118, b: 212 } },
  { t: 0.34, rgb: { r: 78, g: 162, b: 232 } },
  { t: 0.48, rgb: { r: 140, g: 198, b: 242 } },
  { t: 0.56, rgb: { r: 210, g: 195, b: 155 } },
  { t: 0.68, rgb: { r: 242, g: 148, b: 72 } },
  { t: 0.82, rgb: { r: 228, g: 82, b: 48 } },
  { t: 1, rgb: { r: 196, g: 34, b: 42 } },
];

function clamp01(x: number) {
  return Math.min(1, Math.max(0, x));
}

function lerp(a: number, b: number, u: number) {
  return a + (b - a) * u;
}

function rgbAtNorm(t: number): Rgb {
  const x = clamp01(t);
  let i = 0;
  while (i < RGB_STOPS.length - 1 && x > RGB_STOPS[i + 1].t) {
    i += 1;
  }
  const a = RGB_STOPS[i];
  const b = RGB_STOPS[Math.min(i + 1, RGB_STOPS.length - 1)];
  const span = b.t - a.t || 1e-6;
  const u = clamp01((x - a.t) / span);
  return {
    r: Math.round(lerp(a.rgb.r, b.rgb.r, u)),
    g: Math.round(lerp(a.rgb.g, b.rgb.g, u)),
    b: Math.round(lerp(a.rgb.b, b.rgb.b, u)),
  };
}

function rgbToCss({ r, g, b }: Rgb) {
  return `rgb(${r},${g},${b})`;
}

function shadeRgb(rgb: Rgb, mul: number): Rgb {
  return {
    r: Math.min(255, Math.max(0, Math.round(rgb.r * mul))),
    g: Math.min(255, Math.max(0, Math.round(rgb.g * mul))),
    b: Math.min(255, Math.max(0, Math.round(rgb.b * mul))),
  };
}

function mixRgb(a: Rgb, b: Rgb, u: number): Rgb {
  return {
    r: Math.round(lerp(a.r, b.r, u)),
    g: Math.round(lerp(a.g, b.g, u)),
    b: Math.round(lerp(a.b, b.b, u)),
  };
}

function parseCelsius(raw: string | null): number | null {
  if (!raw) return null;
  const m = raw.match(/^-?\d+(?:\.\d+)?/);
  if (!m) return null;
  const n = Number(m[0]);
  return Number.isFinite(n) ? n : null;
}

const display = computed(() => props.value ?? '—');

const celsius = computed(() => parseCelsius(props.value));

const hasNumericTemp = computed(() => celsius.value !== null && props.value !== null);

/** 0 = -50°C，1 = +50°C */
const normTemp = computed(() => {
  const c = celsius.value;
  if (c === null) return 0.5;
  return clamp01((Math.min(TEMP_RANGE, Math.max(-TEMP_RANGE, c)) + TEMP_RANGE) / (TEMP_RANGE * 2));
});

/** 柱长：两端留白以免贴边 */
const fillPercent = computed(() => {
  if (!props.value) return 5;
  const c = celsius.value;
  if (c === null) return 50;
  const n = normTemp.value;
  return Math.round((4 + n * 92) * 10) / 10;
});

const coreRgb = computed(() => rgbAtNorm(normTemp.value));

/** 汞柱内横向略偏冷→略偏暖，与槽「左寒右暑」刻度一致 */
function thermalMercuryCss(norm: number) {
  const n = clamp01(norm);
  const nl = clamp01(n - 0.09);
  const nr = clamp01(n + 0.09);
  const cLeft = rgbAtNorm(nl);
  const cMid = rgbAtNorm(n);
  const cRight = rgbAtNorm(nr);
  const deepL = shadeRgb(cLeft, 0.5);
  const hiR = mixRgb(cRight, { r: 255, g: 255, b: 255 }, 0.36);
  return {
    '--deg-mercury-fill': `linear-gradient(90deg, ${rgbToCss(deepL)} 0%, ${rgbToCss(cMid)} 46%, ${rgbToCss(hiR)} 100%)`,
    '--deg-glow-color': `rgba(${cMid.r},${cMid.g},${cMid.b},0.44)`,
  };
}

const mercuryInlineStyle = computed(() => {
  if (!props.value) {
    return { '--deg-fill-pct': `${fillPercent.value}%` };
  }
  if (!hasNumericTemp.value) {
    return {
      '--deg-fill-pct': `${fillPercent.value}%`,
      ...thermalMercuryCss(0.5),
    };
  }
  return {
    '--deg-fill-pct': `${fillPercent.value}%`,
    ...thermalMercuryCss(normTemp.value),
  };
});

function bulbCss(rgb: Rgb) {
  const c = rgb;
  const hi = mixRgb(c, { r: 255, g: 255, b: 255 }, 0.38);
  const lo = shadeRgb(c, 0.52);
  const mid = mixRgb(c, lo, 0.45);
  return {
    background: `
      radial-gradient(
        circle at 34% 26%,
        ${rgbToCss(hi)} 0%,
        ${rgbToCss(c)} 42%,
        ${rgbToCss(mid)} 72%,
        ${rgbToCss(lo)} 100%
      )
    `,
    boxShadow: `
      inset 0 2px 5px rgba(255,255,255,0.38),
      inset 0 -4px 8px rgba(0,0,0,0.45),
      0 0 10px rgba(${c.r},${c.g},${c.b},0.35),
      0 1px 3px rgba(4,3,2,0.55)
    `,
  };
}

const bulbInlineStyle = computed(() => {
  if (!props.value) return {};
  const rgb = hasNumericTemp.value ? coreRgb.value : rgbAtNorm(0.5);
  return bulbCss(rgb);
});

/** 读数窗：边框与光晕随色相蓝↔红 */
const readoutAmbientStyle = computed(() => {
  if (!props.value) return {};
  const c = hasNumericTemp.value ? coreRgb.value : rgbAtNorm(0.5);
  const edge = mixRgb(c, { r: 28, g: 24, b: 22 }, 0.62);
  return {
    borderColor: `rgba(${edge.r},${edge.g},${edge.b},0.88)`,
    boxShadow: `
      inset 0 2px 8px rgba(2,2,2,0.55),
      inset 0 1px 0 rgba(160,140,118,0.06),
      0 0 0 1px rgba(${Math.round(c.r * 0.35 + 62)},${Math.round(c.g * 0.35 + 54)},${Math.round(c.b * 0.35 + 46)},0.45),
      0 0 16px rgba(${c.r},${c.g},${c.b},0.14)
    `,
  };
});

const valueTextStyle = computed(() => {
  if (!props.value) return {};
  const t = normTemp.value;
  const blueInk: Rgb = { r: 168, g: 212, b: 248 };
  const redInk: Rgb = { r: 255, g: 196, b: 186 };
  const ink = mixRgb(blueInk, redInk, t);
  const c = hasNumericTemp.value ? coreRgb.value : rgbAtNorm(0.5);
  return {
    color: rgbToCss(mixRgb(ink, c, 0.22)),
    textShadow: `
      0 0 12px rgba(${c.r},${c.g},${c.b},0.38),
      0 1px 0 rgba(0,0,0,0.82)
    `,
  };
});

const ariaLabel = computed(() =>
  props.value ? `叙事气温 ${props.value}` : '叙事气温：等待 AI 回复中的 degree 标签',
);
</script>

<style scoped>
.goth-deg {
  --deg-mercury-idle: linear-gradient(90deg, #4a4038 0%, #5c5248 55%, #6a6058 100%);
  --deg-digit: rgba(255, 214, 176, 0.95);
  --deg-digit-idle: rgba(108, 96, 84, 0.5);

  display: block;
  width: 100%;
  min-width: 0;
}

.goth-deg__chassis {
  display: flex;
  align-items: center;
  gap: 0.28rem;
  width: 100%;
  min-height: 1.72rem;
  padding: 0.22rem 0.28rem 0.24rem;
  border-radius: 999px;
  background: linear-gradient(165deg, rgba(58, 52, 46, 0.96) 0%, rgba(20, 18, 16, 0.98) 55%, rgba(14, 12, 10, 1) 100%);
  border: 1px solid rgba(12, 10, 8, 0.88);
  box-shadow:
    inset 0 1px 0 rgba(132, 118, 98, 0.12),
    inset 0 -3px 10px rgba(4, 3, 2, 0.45),
    0 0 0 1px rgba(72, 64, 54, 0.22),
    0 2px 6px rgba(5, 4, 3, 0.35);
}

.goth-deg__bulb {
  flex-shrink: 0;
  width: 13px;
  height: 13px;
  border-radius: 50%;
  border: 1px solid rgba(14, 10, 8, 0.78);
  background: radial-gradient(
    circle at 32% 28%,
    #ffb090 0%,
    #e05038 38%,
    #881818 72%,
    #3a0c08 100%
  );
  box-shadow:
    inset 0 2px 4px rgba(255, 220, 190, 0.45),
    inset 0 -3px 6px rgba(40, 6, 4, 0.65),
    0 1px 3px rgba(4, 3, 2, 0.55);
  transition: box-shadow 0.55s cubic-bezier(0.33, 1, 0.68, 1), background 0.55s cubic-bezier(0.33, 1, 0.68, 1);
}

.goth-deg__channel-wrap {
  flex: 1 1 0;
  min-width: 1.5rem;
  display: flex;
  align-items: center;
}

.goth-deg__channel {
  position: relative;
  width: 100%;
  height: 0.68rem;
  border-radius: 999px;
  overflow: hidden;
  background: linear-gradient(
    180deg,
    rgba(36, 32, 28, 0.92) 0%,
    rgba(18, 16, 14, 0.96) 48%,
    rgba(28, 24, 22, 0.88) 100%
  );
  border: 1px solid rgba(8, 6, 5, 0.75);
  box-shadow:
    inset 0 3px 8px rgba(2, 2, 2, 0.72),
    inset 0 1px 0 rgba(92, 82, 72, 0.12),
    inset 0 -1px 0 rgba(0, 0, 0, 0.55);
}

/* 槽底尺度暗示：左寒（蓝）→ 右暑（红），与汞柱方向一致 */
.goth-deg__channel-tint {
  position: absolute;
  inset: 0;
  pointer-events: none;
  border-radius: inherit;
  opacity: 0;
  transition: opacity 0.45s ease;
  background: linear-gradient(
    90deg,
    rgba(28, 92, 178, 0.32) 0%,
    rgba(72, 148, 218, 0.12) 32%,
    rgba(210, 175, 130, 0.1) 48%,
    rgba(245, 140, 72, 0.12) 68%,
    rgba(188, 36, 48, 0.3) 100%
  );
}

.goth-deg--has-temp .goth-deg__channel-tint {
  opacity: 1;
}

/* 有 `<degree>` 但无法解析数字时仍显示色谱条 */
.goth-deg:not(.goth-deg--idle):not(.goth-deg--has-temp) .goth-deg__channel-tint {
  opacity: 0.85;
}

.goth-deg__mercury {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: var(--deg-fill-pct, 40%);
  max-width: 100%;
  border-radius: inherit;
  background:
    linear-gradient(
      180deg,
      rgba(255, 255, 255, 0.26) 0%,
      rgba(255, 255, 255, 0) 38%,
      rgba(0, 0, 0, 0.2) 100%
    ),
    var(--deg-mercury-fill, var(--deg-mercury-idle));
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.28),
    inset 0 -2px 6px rgba(0, 0, 0, 0.35),
    0 0 14px var(--deg-glow-color, rgba(255, 120, 64, 0.22));
  transition:
    width 0.55s cubic-bezier(0.33, 1, 0.68, 1),
    box-shadow 0.55s cubic-bezier(0.33, 1, 0.68, 1),
    background 0.55s cubic-bezier(0.33, 1, 0.68, 1);
}

/* 每 10°C 一格（±50 共 11 段）；加粗 0°C 与 ±50 暗示线 */
.goth-deg__ticks {
  position: absolute;
  inset: 0;
  pointer-events: none;
  opacity: 0.5;
  background:
    linear-gradient(
      90deg,
      rgba(240, 236, 228, 0.34) 0,
      rgba(240, 236, 228, 0.34) 1px,
      transparent 1px,
      transparent 100%
    ),
    linear-gradient(
      90deg,
      transparent 0,
      transparent calc(50% - 0.5px),
      rgba(240, 236, 228, 0.42) calc(50% - 0.5px),
      rgba(240, 236, 228, 0.42) calc(50% + 0.5px),
      transparent calc(50% + 0.5px),
      transparent 100%
    ),
    linear-gradient(
      90deg,
      transparent 0,
      transparent calc(100% - 1px),
      rgba(240, 236, 228, 0.28) calc(100% - 1px),
      rgba(240, 236, 228, 0.28) 100%
    ),
    repeating-linear-gradient(
      90deg,
      transparent 0,
      transparent calc(10% - 0.5px),
      rgba(180, 172, 158, 0.2) calc(10% - 0.5px),
      rgba(180, 172, 158, 0.2) calc(10% - 0.5px + 1px),
      transparent calc(10% - 0.5px + 1px),
      transparent 10%
    );
  mix-blend-mode: overlay;
}

.goth-deg__glass-top {
  position: absolute;
  inset: 0;
  pointer-events: none;
  border-radius: inherit;
  background: linear-gradient(
    180deg,
    rgba(255, 248, 236, 0.16) 0%,
    transparent 38%,
    transparent 58%,
    rgba(0, 0, 0, 0.2) 100%
  );
}

.goth-deg__glass-edge {
  position: absolute;
  inset: 0;
  pointer-events: none;
  border-radius: inherit;
  box-shadow:
    inset 0 0 0 1px rgba(255, 252, 246, 0.05),
    inset 2px 0 4px rgba(255, 255, 255, 0.04),
    inset -2px 0 5px rgba(0, 0, 0, 0.22);
}

.goth-deg__readout {
  position: relative;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 3.1rem;
  padding: 0.12rem 0.4rem 0.14rem;
  border-radius: 6px;
  background: linear-gradient(175deg, rgba(42, 38, 34, 0.65) 0%, rgba(14, 12, 10, 0.94) 100%);
  border: 1px solid rgba(18, 14, 12, 0.82);
  transition:
    box-shadow 0.55s cubic-bezier(0.33, 1, 0.68, 1),
    border-color 0.45s ease;
  box-shadow:
    inset 0 2px 8px rgba(2, 2, 2, 0.55),
    inset 0 1px 0 rgba(160, 140, 118, 0.06),
    0 0 0 1px rgba(62, 54, 46, 0.35);
}

.goth-deg__rim {
  position: absolute;
  inset: 2px;
  border-radius: 4px;
  pointer-events: none;
  box-shadow: inset 0 0 0 1px rgba(200, 178, 148, 0.06);
}

.goth-deg__value {
  position: relative;
  z-index: 1;
  font-weight: 600;
  font-size: clamp(0.78rem, 2vw, 0.92rem);
  font-variant-numeric: tabular-nums;
  letter-spacing: 0.03em;
  line-height: 1.1;
  white-space: nowrap;
  color: var(--deg-digit);
  text-shadow:
    0 0 8px rgba(255, 160, 96, 0.22),
    0 1px 0 rgba(0, 0, 0, 0.82);
  transition: color 0.45s ease, text-shadow 0.45s ease;
}

.goth-deg--idle .goth-deg__bulb {
  background: radial-gradient(
    circle at 32% 28%,
    rgba(120, 112, 102, 0.55) 0%,
    rgba(62, 56, 50, 0.72) 55%,
    rgba(28, 26, 24, 0.88) 100%
  );
  box-shadow:
    inset 0 1px 2px rgba(255, 248, 236, 0.08),
    inset 0 -2px 5px rgba(4, 3, 2, 0.55),
    0 1px 2px rgba(4, 3, 2, 0.4);
}

.goth-deg--idle .goth-deg__mercury {
  background: linear-gradient(
      180deg,
      rgba(255, 255, 255, 0.12) 0%,
      transparent 45%,
      rgba(0, 0, 0, 0.12) 100%
    ),
    var(--deg-mercury-idle);
  box-shadow:
    inset 0 1px 0 rgba(255, 248, 236, 0.06),
    inset 0 -2px 5px rgba(4, 3, 2, 0.45);
}

.goth-deg--idle .goth-deg__value {
  color: var(--deg-digit-idle);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.65);
}

@media (prefers-reduced-motion: reduce) {
  .goth-deg__mercury,
  .goth-deg__bulb,
  .goth-deg__readout,
  .goth-deg__value,
  .goth-deg__channel-tint {
    transition: none;
  }
}
</style>
