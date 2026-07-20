<template>
  <section class="goth-map-board" aria-labelledby="goth-map-board-title">
    <h3 id="goth-map-board-title" class="goth-map-board__heading">地图</h3>
    <div class="goth-map-board__frame">
      <div class="goth-map-board__rim" aria-hidden="true" />
      <div class="goth-map-board__container">
        <!-- 宽幅 viewBox：近似俯视城镇图 — 下海湾、中城区、东北林地、东西岸线 -->
        <svg class="goth-map-board__svg" viewBox="0 0 960 400" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
          <defs>
            <linearGradient id="goth-map-paper" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#585046" />
              <stop offset="35%" stop-color="#3d362e" />
              <stop offset="100%" stop-color="#1a1612" />
            </linearGradient>
            <radialGradient id="goth-map-paper-wash" cx="38%" cy="28%" r="82%">
              <stop offset="0%" stop-color="rgba(118, 104, 82, 0.18)" />
              <stop offset="50%" stop-color="rgba(52, 46, 38, 0.06)" />
              <stop offset="100%" stop-color="rgba(18, 14, 12, 0)" />
            </radialGradient>
            <radialGradient id="goth-map-vignette" cx="50%" cy="45%" r="78%">
              <stop offset="52%" stop-color="rgba(24, 20, 18, 0)" />
              <stop offset="100%" stop-color="rgba(6, 5, 4, 0.68)" />
            </radialGradient>
            <!-- 海湾深水（偏冷蓝灰，呼应参考图水域） -->
            <linearGradient id="goth-map-bay-deep" x1="50%" y1="0%" x2="50%" y2="100%">
              <stop offset="0%" stop-color="#3d4a54" />
              <stop offset="45%" stop-color="#2a343e" />
              <stop offset="100%" stop-color="#161c22" />
            </linearGradient>
            <linearGradient id="goth-map-bay-lit" x1="0%" y1="100%" x2="100%" y2="40%">
              <stop offset="0%" stop-color="rgba(72, 88, 98, 0.45)" />
              <stop offset="100%" stop-color="rgba(42, 52, 60, 0.25)" />
            </linearGradient>
            <!-- 城区 / 港区 -->
            <linearGradient id="goth-map-urban" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stop-color="#6e6254" />
              <stop offset="55%" stop-color="#4a4238" />
              <stop offset="100%" stop-color="#353028" />
            </linearGradient>
            <linearGradient id="goth-map-dock" x1="50%" y1="0%" x2="50%" y2="100%">
              <stop offset="0%" stop-color="rgba(92, 52, 48, 0.42)" />
              <stop offset="100%" stop-color="rgba(42, 32, 28, 0.55)" />
            </linearGradient>
            <!-- 东北林地 -->
            <linearGradient id="goth-map-forest" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#3a4234" />
              <stop offset="100%" stop-color="#222818" />
            </linearGradient>
            <!-- 西岸荒郊 -->
            <linearGradient id="goth-map-west" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stop-color="#504848" />
              <stop offset="100%" stop-color="#323028" />
            </linearGradient>
            <linearGradient id="goth-map-urban-shade" x1="100%" y1="50%" x2="0%" y2="50%">
              <stop offset="0%" stop-color="rgba(28, 24, 20, 0.35)" />
              <stop offset="100%" stop-color="rgba(28, 24, 20, 0)" />
            </linearGradient>
            <filter id="goth-map-noise" x="-5%" y="-5%" width="110%" height="110%">
              <feTurbulence type="fractalNoise" baseFrequency="0.75" numOctaves="3" stitchTiles="stitch" result="n" />
              <feColorMatrix type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.05 0" in="n" result="m" />
              <feBlend in="SourceGraphic" in2="m" mode="multiply" />
            </filter>
            <filter id="goth-map-soft" x="-2%" y="-2%" width="104%" height="104%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="1.4" result="b" />
              <feMerge>
                <feMergeNode in="SourceGraphic" />
                <feMergeNode in="b" />
              </feMerge>
            </filter>
            <pattern id="goth-map-grid" width="48" height="48" patternUnits="userSpaceOnUse">
              <path d="M48 0H0V48" fill="none" stroke="rgba(200, 182, 148, 0.065)" stroke-width="0.55" />
            </pattern>
          </defs>

          <rect width="960" height="400" fill="url(#goth-map-paper)" />
          <rect width="960" height="400" fill="url(#goth-map-paper-wash)" />

          <!-- 海湾水体（自下侵入城区） -->
          <path
            fill="url(#goth-map-bay-deep)"
            d="M0 400 L960 400 L960 268
               C 820 248 760 282 620 258
               C 520 242 440 252 360 238
               C 260 222 140 248 0 278 Z"
          />
          <path
            fill="url(#goth-map-bay-lit)"
            opacity="0.55"
            filter="url(#goth-map-noise)"
            d="M0 400 L960 400 L960 285
               C 780 255 680 275 480 252
               C 320 236 160 262 0 292 Z"
          />

          <!-- 制图网格 -->
          <rect width="960" height="400" fill="url(#goth-map-grid)" opacity="0.55" />

          <!-- 西岸丘陵 / 荒郊 -->
          <path
            fill="url(#goth-map-west)"
            opacity="0.88"
            filter="url(#goth-map-soft)"
            d="M0 0 L280 0 L265 95
               C 220 108 160 125 120 155
               C 85 182 55 218 40 260
               L0 272 Z"
          />

          <!-- 城区（分块叠在西岸灰褐之上） -->
          <path
            fill="url(#goth-map-urban)"
            opacity="0.96"
            filter="url(#goth-map-soft)"
            d="M280 0 L620 0 L618 125 C 560 115 520 145 505 175 C 488 205 430 225 360 218 C 290 210 265 175 265 95 Z"
          />
          <path
            fill="url(#goth-map-urban)"
            opacity="0.96"
            filter="url(#goth-map-soft)"
            d="M620 0 L960 0 L960 165 C 880 140 820 105 760 105 C 705 98 655 108 620 125 Z"
          />
          <path
            fill="url(#goth-map-urban)"
            opacity="0.96"
            filter="url(#goth-map-soft)"
            d="M35 285 C 85 228 155 198 265 175 C 335 195 410 232 480 248 C 580 268 720 248 840 262 C 900 270 935 268 960 268 L960 400 L0 400 L0 278 Z"
          />

          <!-- 东北林地（叠在城区之上） -->
          <path
            fill="url(#goth-map-forest)"
            opacity="0.92"
            filter="url(#goth-map-soft)"
            d="M620 0 L960 0 L960 165
               C 880 155 820 125 760 105
               C 700 85 640 72 580 78
               C 540 82 520 95 505 118
               C 488 148 520 178 560 188
               C 598 198 615 168 620 125 Z"
          />

          <!-- 港区褐红 hint -->
          <path
            fill="url(#goth-map-dock)"
            opacity="0.55"
            d="M380 230 L620 248 L640 285 L580 305 L420 288 Z"
          />

          <!-- 河道入湾 -->
          <path
            fill="none"
            stroke="rgba(52, 68, 78, 0.55)"
            stroke-width="4"
            stroke-linecap="round"
            stroke-linejoin="round"
            opacity="0.65"
            d="M448 88 C 455 130 462 165 468 195 C 472 218 465 235 448 248"
          />

          <!-- 东岸峭壁暗示 -->
          <path
            fill="rgba(38, 36, 34, 0.55)"
            d="M920 175 L960 195 L960 268 L930 255 Z"
          />

          <!-- 城区明暗分区（示意街区） -->
          <path fill="url(#goth-map-urban-shade)" opacity="0.42" d="M480 0 L960 0 L960 400 L520 400 L480 220 Z" />

          <!-- 岸线描边 -->
          <path
            fill="none"
            stroke="rgba(14, 12, 10, 0.5)"
            stroke-width="1.25"
            stroke-linejoin="round"
            d="M0 278 C 140 248 260 222 360 238 C 440 252 520 242 620 258 C 760 282 820 248 960 268"
          />
          <path
            fill="none"
            stroke="rgba(22, 18, 14, 0.35)"
            stroke-width="0.9"
            d="M265 95 C 215 145 125 195 35 285"
          />
          <path
            fill="none"
            stroke="rgba(22, 20, 16, 0.38)"
            stroke-width="0.85"
            d="M618 125 C 540 115 505 155 505 175"
          />
          <path
            fill="none"
            stroke="rgba(26, 36, 28, 0.4)"
            stroke-width="0.85"
            d="M620 125 C 700 95 820 105 960 165"
          />

          <!-- 离岸小岛 / 栈桥码头点 -->
          <ellipse cx="708" cy="292" rx="14" ry="9" fill="#454038" stroke="rgba(12,10,8,0.4)" stroke-width="0.75" />
          <ellipse cx="812" cy="302" rx="10" ry="7" fill="#3c3830" stroke="rgba(12,10,8,0.35)" stroke-width="0.6" />

          <!-- 方位弧（宽幅居中） -->
          <g fill="none" stroke="rgba(176, 154, 118, 0.085)" stroke-width="0.8">
            <ellipse cx="480" cy="195" rx="380" ry="155" />
            <ellipse cx="480" cy="195" rx="280" ry="112" />
            <ellipse cx="480" cy="195" rx="185" ry="74" />
          </g>
          <line x1="480" y1="22" x2="480" y2="378" stroke="rgba(176, 154, 118, 0.055)" stroke-width="0.65" />
          <line x1="42" y1="200" x2="918" y2="200" stroke="rgba(176, 154, 118, 0.055)" stroke-width="0.65" />

          <!-- 内框线（图廓） -->
          <rect
            x="14"
            y="12"
            width="932"
            height="376"
            fill="none"
            stroke="rgba(140, 122, 92, 0.18)"
            stroke-width="1"
            rx="2"
          />

          <rect width="960" height="400" fill="url(#goth-map-vignette)" pointer-events="none" />
        </svg>

        <div class="goth-map-board__pins">
          <template v-if="pins.length === 0">
            <p class="goth-map-board__empty">暂无已解锁地点；叙事与变量同步后将在此显示锚点。</p>
          </template>
          <button
            v-for="p in pins"
            :key="p.id"
            type="button"
            class="goth-map-pin"
            :class="{ 'goth-map-pin--here': p.isHere }"
            :style="{ '--pin-x': `${p.x}%`, '--pin-y': `${p.y}%`, '--pin-z': Math.round(p.y) }"
            :aria-label="`前往 ${p.name}`"
            @click="openTravelDialog(p.name)"
          >
            <span class="goth-map-pin__stem" aria-hidden="true" />
            <span class="goth-map-pin__dot" aria-hidden="true" />
            <span class="goth-map-pin__label">
              <span class="goth-map-pin__name">{{ p.name }}</span>
              <span v-if="p.isHere" class="goth-map-pin__badge">此处</span>
            </span>
          </button>
        </div>
      </div>
    </div>

    <dialog
      ref="travelDlg"
      class="goth-map-dialog"
      aria-labelledby="goth-map-travel-dlg-title"
      @cancel.prevent="closeTravelDialog(false)"
      @close="onDialogClose"
    >
      <div class="goth-map-dialog__panel">
        <p id="goth-map-travel-dlg-title" class="goth-map-dialog__msg">
          确定要前往「{{ pendingPlace ?? '' }}」吗？
        </p>
        <div class="goth-map-dialog__menu">
          <button ref="confirmBtn" type="button" class="goth-btn-primary" @click="closeTravelDialog(true)">
            确定
          </button>
          <button type="button" class="goth-btn-ghost" @click="closeTravelDialog(false)">取消</button>
        </div>
      </div>
    </dialog>
  </section>
</template>

<script setup lang="ts">
import { computed, inject, nextTick, ref } from 'vue';
import { gothStateKey } from '../gothStateContext';

const state = inject(gothStateKey);
if (!state) throw new Error('未找到 Goth 状态上下文。');

const { snapshot, queueTravelDraft } = state;

/** 稳定哈希 → [12, 88] 内百分比；按区域索引条带错开 */
function pinPercentFromId(locId: string, regionIndex: number): { x: number; y: number } {
  let h = 2166136261;
  for (let i = 0; i < locId.length; i++) {
    h ^= locId.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  const u1 = (h >>> 0) / 2 ** 32;
  h ^= regionIndex * 2654435761;
  const u2 = (h >>> 0) / 2 ** 32;
  const col = regionIndex % 3;
  const row = Math.floor(regionIndex / 3);
  const cx = 16 + col * 26 + u1 * 22;
  const cy = 14 + row * 24 + u2 * 20;
  const clamp = (n: number) => Math.min(88, Math.max(12, n));
  return { x: Math.round(clamp(cx) * 10) / 10, y: Math.round(clamp(cy) * 10) / 10 };
}

const pins = computed(() => {
  const regions = snapshot.value.map.regions;
  const currentLoc = snapshot.value.map.location.trim();
  const unknown = currentLoc === '' || currentLoc === '当前未知';
  const list: Array<{
    id: string;
    name: string;
    x: number;
    y: number;
    isHere: boolean;
  }> = [];
  regions.forEach((reg, regionIndex) => {
    for (const loc of reg.locations) {
      if (!loc.unlocked) continue;
      const { x, y } = pinPercentFromId(loc.id, regionIndex);
      list.push({
        id: loc.id,
        name: loc.name,
        x,
        y,
        isHere: !unknown && loc.name === currentLoc,
      });
    }
  });
  return list;
});

const travelDlg = ref<HTMLDialogElement | null>(null);
const confirmBtn = ref<HTMLButtonElement | null>(null);
const pendingPlace = ref<string | null>(null);

function openTravelDialog(placeName: string) {
  pendingPlace.value = placeName;
  void nextTick(() => {
    travelDlg.value?.showModal();
    void nextTick(() => confirmBtn.value?.focus());
  });
}

function closeTravelDialog(confirmed: boolean) {
  const name = pendingPlace.value;
  travelDlg.value?.close();
  if (confirmed && name) queueTravelDraft(name);
}

function onDialogClose() {
  pendingPlace.value = null;
}
</script>

<style scoped>
.goth-map-board {
  margin-bottom: 0.65rem;
}

.goth-map-board__heading {
  margin: 0 0 0.45rem;
  font-family: var(--g-font-display);
  font-size: 0.98rem;
  color: var(--g-text-accent);
}

.goth-map-board__frame {
  position: relative;
  padding: 4px;
  border-radius: calc(var(--g-radius) + 2px);
  background: linear-gradient(
    165deg,
    rgba(72, 64, 54, 0.45) 0%,
    rgba(28, 24, 20, 0.72) 100%
  );
  box-shadow:
    inset 0 1px 0 rgba(255, 248, 236, 0.06),
    0 4px 18px rgba(4, 3, 2, 0.35);
}

.goth-map-board__rim {
  pointer-events: none;
  position: absolute;
  inset: 5px;
  border-radius: var(--g-radius);
  box-shadow:
    inset 0 0 0 1px rgba(210, 190, 158, 0.08),
    inset 0 10px 28px rgba(4, 3, 2, 0.28);
  z-index: 2;
}

.goth-map-board__container {
  position: relative;
  width: 100%;
  aspect-ratio: 960 / 400;
  min-height: 10.5rem;
  max-height: min(46vh, 28rem);
  margin: 0 auto;
  border-radius: var(--g-radius);
  overflow: hidden;
  border: 1px solid rgba(22, 18, 14, 0.85);
  box-shadow: inset 0 2px 12px rgba(4, 3, 2, 0.45);
}

.goth-map-board__svg {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.goth-map-board__pins {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.goth-map-board__empty {
  pointer-events: none;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  margin: 0;
  max-width: 85%;
  text-align: center;
  font-size: 0.82rem;
  line-height: 1.55;
  color: var(--g-text-muted);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.55);
}

.goth-map-pin {
  pointer-events: auto;
  position: absolute;
  left: calc(var(--pin-x, 50%) - 1.1rem);
  top: calc(var(--pin-y, 50%) - 2.35rem);
  width: 2.2rem;
  padding: 0;
  border: none;
  background: transparent;
  cursor: pointer;
  z-index: var(--pin-z, 50);
  font: inherit;
  color: inherit;
  transition:
    transform 0.22s var(--g-motion-ease-out, cubic-bezier(0.22, 1, 0.36, 1)),
    filter 0.18s ease;
}

.goth-map-pin:hover,
.goth-map-pin:focus-visible {
  transform: translateY(-2px);
  z-index: 900;
  outline: none;
}

.goth-map-pin:focus-visible {
  filter: drop-shadow(0 0 6px rgba(196, 172, 132, 0.45));
}

.goth-map-pin__stem {
  display: block;
  position: absolute;
  left: 50%;
  top: 1.35rem;
  width: 2px;
  height: 0.85rem;
  margin-left: -1px;
  background: linear-gradient(
    180deg,
    rgba(42, 38, 32, 0.95),
    rgba(18, 14, 12, 0.98)
  );
  box-shadow: 1px 0 0 rgba(255, 248, 236, 0.06);
  border-radius: 1px;
}

.goth-map-pin__dot {
  display: block;
  position: relative;
  width: 1.35rem;
  height: 1.35rem;
  margin: 0 auto;
  border-radius: 50%;
  background: radial-gradient(
    circle at 32% 28%,
    rgba(218, 192, 148, 0.55) 0%,
    rgba(112, 92, 68, 0.92) 42%,
    rgba(38, 32, 26, 0.98) 100%
  );
  box-shadow:
    0 2px 6px rgba(4, 3, 2, 0.55),
    inset 0 1px 0 rgba(255, 248, 236, 0.18),
    inset 0 -3px 6px rgba(12, 10, 8, 0.55);
  border: 1px solid rgba(22, 18, 14, 0.75);
}

.goth-map-pin--here .goth-map-pin__dot {
  background: radial-gradient(
    circle at 32% 28%,
    rgba(168, 188, 168, 0.42) 0%,
    rgba(82, 108, 92, 0.88) 45%,
    rgba(28, 34, 30, 0.98) 100%
  );
  box-shadow:
    0 0 0 2px rgba(138, 158, 138, 0.35),
    0 2px 8px rgba(4, 3, 2, 0.5),
    inset 0 1px 0 rgba(255, 248, 236, 0.14);
}

.goth-map-pin__label {
  display: none;
  position: absolute;
  left: 50%;
  bottom: calc(100% + 0.35rem);
  transform: translateX(-50%);
  min-width: 5.5rem;
  max-width: 11rem;
  padding: 0.28rem 0.42rem;
  border-radius: 3px;
  background: linear-gradient(175deg, rgba(48, 42, 36, 0.96), rgba(22, 18, 14, 0.98));
  border: 1px solid rgba(108, 96, 76, 0.35);
  box-shadow:
    0 4px 14px rgba(4, 3, 2, 0.45),
    inset 0 1px 0 rgba(255, 248, 236, 0.06);
  text-align: center;
  animation: goth-map-pin-label-in 0.28s var(--g-motion-ease-out, cubic-bezier(0.22, 1, 0.36, 1)) both;
}

@keyframes goth-map-pin-label-in {
  from {
    opacity: 0;
    transform: translateX(-50%) translateY(4px);
  }

  to {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
}

.goth-map-pin:hover .goth-map-pin__label,
.goth-map-pin:focus-visible .goth-map-pin__label {
  display: block;
}

.goth-map-pin__name {
  display: block;
  font-family: var(--g-font-serif);
  font-size: 0.74rem;
  font-weight: 600;
  letter-spacing: 0.03em;
  color: var(--g-ink, rgba(236, 228, 216, 0.94));
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.goth-map-pin__badge {
  display: inline-block;
  margin-top: 0.18rem;
  font-family: var(--g-font-ui);
  font-size: 0.52rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: rgba(168, 188, 168, 0.88);
}

@media (prefers-reduced-motion: reduce) {
  .goth-map-pin {
    transition: none;
  }

  .goth-map-pin:hover,
  .goth-map-pin:focus-visible {
    transform: none;
  }

  .goth-map-pin__label {
    animation: none;
  }
}

.goth-map-dialog {
  padding: 0;
  border: none;
  border-radius: var(--g-radius);
  background: transparent;
  max-width: calc(100vw - 2rem);
}

.goth-map-dialog::backdrop {
  background: rgba(12, 10, 8, 0.55);
}

.goth-map-dialog__panel {
  padding: 0.85rem 1rem;
  background: linear-gradient(165deg, rgba(52, 48, 42, 0.98), rgba(26, 24, 22, 0.99));
  border: 1px solid rgba(108, 96, 76, 0.28);
  border-radius: var(--g-radius);
  box-shadow: 0 16px 40px rgba(8, 6, 5, 0.45);
}

.goth-map-dialog__msg {
  margin: 0 0 0.75rem;
  font-size: 0.88rem;
  line-height: 1.45;
}

.goth-map-dialog__menu {
  display: flex;
  gap: 0.45rem;
  justify-content: flex-end;
  flex-wrap: wrap;
}
</style>
