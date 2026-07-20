<template>
  <!-- 各天气独立 SVG + 按 token 的轻量 CSS 动效（与 mapWeatherToken 关键词一致） -->
  <span class="adven-weather-icon" :class="`adven-weather-icon--${token}`" aria-hidden="true">
    <!-- 晴：中心圆 + 光芒旋转 -->
    <svg v-if="token === 'sunny'" class="adven-weather-icon__svg" viewBox="0 0 24 24">
      <circle class="adven-weather-icon__sun-core" cx="12" cy="12" r="3.8" fill="currentColor" />
      <g class="adven-weather-icon__sun-rays" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round">
        <path d="M12 1.5v2.4M12 20.1v2.4M1.5 12h2.4M20.1 12h2.4M4.2 4.2l1.7 1.7M18.1 18.1l1.7 1.7M4.2 19.8l1.7-1.7M18.1 5.9l1.7-1.7" />
      </g>
    </svg>

    <!-- 多云 -->
    <svg v-else-if="token === 'cloudy'" class="adven-weather-icon__svg" viewBox="0 0 24 24">
      <g class="adven-weather-icon__cloud-float">
        <path fill="none" stroke="currentColor" stroke-width="1.55" stroke-linejoin="round" d="M6 18h11a4 4 0 0 0 0-8 4 4 0 0 0-4-4 4 4 0 0 0-3.8 2.7A3 3 0 0 0 6 14" />
      </g>
    </svg>

    <!-- 阴：双层云 -->
    <svg v-else-if="token === 'overcast'" class="adven-weather-icon__svg" viewBox="0 0 24 24">
      <g class="adven-weather-icon__overcast-clouds" fill="none" stroke="currentColor" stroke-width="1.45" stroke-linejoin="round" opacity="0.85">
        <path d="M4 16h8a3 3 0 0 0 0-6 3 3 0 0 0-3-3 3 3 0 0 0-2.8 1.9" />
        <path d="M7 19h12a4 4 0 0 0 0-8 4 4 0 0 0-4-4 4 4 0 0 0-3.8 2.7A3 3 0 0 0 7 15" />
      </g>
    </svg>

    <!-- 毛毛雨 -->
    <svg v-else-if="token === 'drizzle'" class="adven-weather-icon__svg" viewBox="0 0 24 24">
      <path fill="none" stroke="currentColor" stroke-width="1.5" d="M6 14h11a4 4 0 0 0 0-8 4 4 0 0 0-4-4 4 4 0 0 0-3.8 2.7A3 3 0 0 0 6 10" />
      <g class="adven-weather-icon__drizzle-drops" fill="none" stroke="currentColor" stroke-width="1.35" stroke-linecap="round">
        <path class="adven-weather-icon__drop adven-weather-icon__drop--1" d="M9 17v2.2" />
        <path class="adven-weather-icon__drop adven-weather-icon__drop--2" d="M15 17v2.2" />
      </g>
    </svg>

    <!-- 雨 -->
    <svg v-else-if="token === 'rain'" class="adven-weather-icon__svg" viewBox="0 0 24 24">
      <path fill="none" stroke="currentColor" stroke-width="1.5" d="M6 14h11a4 4 0 0 0 0-8 4 4 0 0 0-4-4 4 4 0 0 0-3.8 2.7A3 3 0 0 0 6 10" />
      <g class="adven-weather-icon__rain-drops" fill="none" stroke="currentColor" stroke-width="1.35" stroke-linecap="round">
        <path class="adven-weather-icon__drop adven-weather-icon__drop--1" d="M8 17.5v3" />
        <path class="adven-weather-icon__drop adven-weather-icon__drop--2" d="M12 17v3.2" />
        <path class="adven-weather-icon__drop adven-weather-icon__drop--3" d="M16 17.5v3" />
      </g>
    </svg>

    <!-- 雷暴 -->
    <svg v-else-if="token === 'storm'" class="adven-weather-icon__svg" viewBox="0 0 24 24">
      <path fill="none" stroke="currentColor" stroke-width="1.5" d="M6 13h11a4 4 0 0 0 0-8 4 4 0 0 0-4-4 4 4 0 0 0-3.8 2.7A3 3 0 0 0 6 9" />
      <path
        class="adven-weather-icon__bolt"
        fill="none"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linejoin="round"
        d="M13 3L4 14h7l-2 8 11-13h-7l0-6z"
      />
    </svg>

    <!-- 冰雹 -->
    <svg v-else-if="token === 'hail'" class="adven-weather-icon__svg" viewBox="0 0 24 24">
      <path fill="none" stroke="currentColor" stroke-width="1.5" d="M6 13h11a4 4 0 0 0 0-8 4 4 0 0 0-4-4 4 4 0 0 0-3.8 2.7A3 3 0 0 0 6 9" />
      <g class="adven-weather-icon__hail-pellets">
        <circle class="adven-weather-icon__hail adven-weather-icon__hail--1" cx="9" cy="19" r="1.35" fill="currentColor" />
        <circle class="adven-weather-icon__hail adven-weather-icon__hail--2" cx="12.5" cy="20" r="1.35" fill="currentColor" />
        <circle class="adven-weather-icon__hail adven-weather-icon__hail--3" cx="16" cy="19" r="1.35" fill="currentColor" />
      </g>
    </svg>

    <!-- 雪 -->
    <svg v-else-if="token === 'snow'" class="adven-weather-icon__svg" viewBox="0 0 24 24">
      <path fill="none" stroke="currentColor" stroke-width="1.5" d="M6 14h11a4 4 0 0 0 0-8 4 4 0 0 0-4-4 4 4 0 0 0-3.8 2.7A3 3 0 0 0 6 10" />
      <g class="adven-weather-icon__snow-flakes" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round">
        <g class="adven-weather-icon__flake adven-weather-icon__flake--1">
          <path d="M12 16.5v4M10.2 17.7h3.6M10.8 16.3l2.4 4.2M13.2 16.3l-2.4 4.2" />
        </g>
        <g class="adven-weather-icon__flake adven-weather-icon__flake--2" transform="translate(5 2) scale(0.75)">
          <path d="M12 16.5v3.5M10.5 17.4h3M11 16.4l2 3.5M13 16.4l-2 3.5" />
        </g>
      </g>
    </svg>

    <!-- 风 -->
    <svg v-else-if="token === 'wind'" class="adven-weather-icon__svg" viewBox="0 0 24 24">
      <g class="adven-weather-icon__wind-lines" fill="none" stroke="currentColor" stroke-width="1.55" stroke-linecap="round">
        <path class="adven-weather-icon__wind adven-weather-icon__wind--1" d="M2 8.5h7c1.8 0 3-1 4.8-1s3 1 4.8 1H22" />
        <path class="adven-weather-icon__wind adven-weather-icon__wind--2" d="M2 12h11c1.8 0 3-1 4.8-1s3 1 4.8 1H22" />
        <path class="adven-weather-icon__wind adven-weather-icon__wind--3" d="M2 15.5h9c1.8 0 3 1 4.8 1s3-1 4.8-1H22" />
      </g>
    </svg>

    <!-- 沙尘 -->
    <svg v-else-if="token === 'sandstorm'" class="adven-weather-icon__svg" viewBox="0 0 24 24">
      <path fill="none" stroke="currentColor" stroke-width="1.45" d="M6 14h10a3.5 3.5 0 1 0-3.3-4.8A3 3 0 0 0 6 10" />
      <g class="adven-weather-icon__sand-streaks" fill="none" stroke="currentColor" stroke-width="1.25" stroke-linecap="round" opacity="0.9">
        <path class="adven-weather-icon__sand adven-weather-icon__sand--1" d="M3 18l4-2" />
        <path class="adven-weather-icon__sand adven-weather-icon__sand--2" d="M9 19.5l5-2.5" />
        <path class="adven-weather-icon__sand adven-weather-icon__sand--3" d="M7 21.5l6-3.5" />
        <path class="adven-weather-icon__sand adven-weather-icon__sand--4" d="M14 17l6-3" opacity="0.75" />
      </g>
    </svg>

    <!-- 雾 -->
    <svg v-else-if="token === 'fog'" class="adven-weather-icon__svg" viewBox="0 0 24 24">
      <g class="adven-weather-icon__fog-lines" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round">
        <path class="adven-weather-icon__fog adven-weather-icon__fog--1" d="M4 14h16" />
        <path class="adven-weather-icon__fog adven-weather-icon__fog--2" d="M4 18h16" />
        <path class="adven-weather-icon__fog adven-weather-icon__fog--3" d="M6 10h12" />
      </g>
    </svg>

    <!-- 未知 -->
    <svg v-else class="adven-weather-icon__svg" viewBox="0 0 24 24">
      <g class="adven-weather-icon__default-marks">
        <circle cx="12" cy="12" r="3.2" fill="none" stroke="currentColor" stroke-width="1.5" />
        <path fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" d="M12 6.5v1.8M12 15.8v1.8" />
      </g>
    </svg>
  </span>
</template>

<script setup lang="ts">
import type { WeatherFxToken } from './utils/worldFxTokens';

defineProps<{
  token: WeatherFxToken;
}>();
</script>

<style scoped>
.adven-weather-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}

.adven-weather-icon__svg {
  width: 100%;
  height: 100%;
  overflow: visible;
}

/* 晴：光芒慢转 */
.adven-weather-icon--sunny .adven-weather-icon__sun-rays {
  transform-origin: 12px 12px;
  animation: adven-wi-sun-rotate 22s linear infinite;
}

/* 多云：云轻摆 */
.adven-weather-icon--cloudy .adven-weather-icon__cloud-float {
  transform-origin: 12px 14px;
  animation: adven-wi-cloud-bob 3.2s ease-in-out infinite;
}

/* 阴：云层微移 */
.adven-weather-icon--overcast .adven-weather-icon__overcast-clouds {
  transform-origin: 12px 14px;
  animation: adven-wi-overcast-shift 4s ease-in-out infinite;
}

/* 雨 / 毛毛雨：雨滴下落 */
.adven-weather-icon--rain .adven-weather-icon__drop,
.adven-weather-icon--drizzle .adven-weather-icon__drop {
  animation: adven-wi-rain-streak 0.85s ease-in infinite;
}

.adven-weather-icon--drizzle .adven-weather-icon__drop {
  animation-duration: 1.15s;
  opacity: 0.88;
}

.adven-weather-icon--rain .adven-weather-icon__drop--2 {
  animation-delay: 0.12s;
}
.adven-weather-icon--rain .adven-weather-icon__drop--3 {
  animation-delay: 0.24s;
}
.adven-weather-icon--drizzle .adven-weather-icon__drop--2 {
  animation-delay: 0.2s;
}

/* 雷暴：闪电闪烁 */
.adven-weather-icon--storm .adven-weather-icon__bolt {
  animation: adven-wi-bolt-flash 2.4s ease-in-out infinite;
}

/* 冰雹：颗粒弹跳 */
.adven-weather-icon--hail .adven-weather-icon__hail--1 {
  animation: adven-wi-hail-bounce 0.9s ease-in-out infinite;
}
.adven-weather-icon--hail .adven-weather-icon__hail--2 {
  animation: adven-wi-hail-bounce 0.9s ease-in-out infinite 0.15s;
}
.adven-weather-icon--hail .adven-weather-icon__hail--3 {
  animation: adven-wi-hail-bounce 0.9s ease-in-out infinite 0.3s;
}

/* 雪：雪花飘 */
.adven-weather-icon--snow .adven-weather-icon__flake--1 {
  transform-origin: 12px 18px;
  animation: adven-wi-snow-drift 2.8s ease-in-out infinite;
}
.adven-weather-icon--snow .adven-weather-icon__flake--2 {
  transform-origin: 14px 17px;
  animation: adven-wi-snow-drift 3.2s ease-in-out infinite 0.4s;
}

/* 风：流线滑动 */
.adven-weather-icon--wind .adven-weather-icon__wind--1 {
  animation: adven-wi-wind-slide 1.8s ease-in-out infinite;
}
.adven-weather-icon--wind .adven-weather-icon__wind--2 {
  animation: adven-wi-wind-slide 1.8s ease-in-out infinite 0.2s;
}
.adven-weather-icon--wind .adven-weather-icon__wind--3 {
  animation: adven-wi-wind-slide 1.8s ease-in-out infinite 0.4s;
}

/* 沙尘：沙线漂移 */
.adven-weather-icon--sandstorm .adven-weather-icon__sand--1 {
  animation: adven-wi-sand-slide 1.4s linear infinite;
}
.adven-weather-icon--sandstorm .adven-weather-icon__sand--2 {
  animation: adven-wi-sand-slide 1.4s linear infinite 0.15s;
}
.adven-weather-icon--sandstorm .adven-weather-icon__sand--3 {
  animation: adven-wi-sand-slide 1.4s linear infinite 0.3s;
}
.adven-weather-icon--sandstorm .adven-weather-icon__sand--4 {
  animation: adven-wi-sand-slide 1.4s linear infinite 0.08s;
}

/* 雾：线条呼吸 */
.adven-weather-icon--fog .adven-weather-icon__fog--1 {
  animation: adven-wi-fog-pulse 3s ease-in-out infinite;
}
.adven-weather-icon--fog .adven-weather-icon__fog--2 {
  animation: adven-wi-fog-pulse 3s ease-in-out infinite 0.4s;
}
.adven-weather-icon--fog .adven-weather-icon__fog--3 {
  animation: adven-wi-fog-pulse 3s ease-in-out infinite 0.8s;
}

.adven-weather-icon--default .adven-weather-icon__default-marks {
  animation: adven-wi-default-pulse 2.5s ease-in-out infinite;
}

@keyframes adven-wi-sun-rotate {
  to {
    transform: rotate(360deg);
  }
}

@keyframes adven-wi-cloud-bob {
  50% {
    transform: translate(0.6px, -0.5px);
  }
}

@keyframes adven-wi-overcast-shift {
  33% {
    transform: translate(-0.4px, 0.3px);
  }
  66% {
    transform: translate(0.5px, -0.2px);
  }
}

@keyframes adven-wi-rain-streak {
  0%,
  100% {
    opacity: 0.35;
    transform: translateY(-1px);
  }
  50% {
    opacity: 1;
    transform: translateY(2px);
  }
}

@keyframes adven-wi-bolt-flash {
  0%,
  58%,
  100% {
    opacity: 0.35;
  }
  59% {
    opacity: 1;
  }
  62% {
    opacity: 0.9;
  }
  65% {
    opacity: 0.4;
  }
}

@keyframes adven-wi-hail-bounce {
  0%,
  100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-1.8px);
  }
  70% {
    transform: translateY(0.5px);
  }
}

@keyframes adven-wi-snow-drift {
  50% {
    transform: rotate(12deg) translate(0.3px, 0.5px);
  }
}

@keyframes adven-wi-wind-slide {
  0%,
  100% {
    transform: translateX(-1px);
    opacity: 0.75;
  }
  50% {
    transform: translateX(2px);
    opacity: 1;
  }
}

@keyframes adven-wi-sand-slide {
  0% {
    transform: translateX(-2px);
    opacity: 0.55;
  }
  50% {
    opacity: 1;
  }
  100% {
    transform: translateX(3px);
    opacity: 0.65;
  }
}

@keyframes adven-wi-fog-pulse {
  0%,
  100% {
    opacity: 0.45;
  }
  50% {
    opacity: 1;
  }
}

@keyframes adven-wi-default-pulse {
  50% {
    opacity: 0.65;
  }
}

@media (prefers-reduced-motion: reduce) {
  .adven-weather-icon--sunny .adven-weather-icon__sun-rays,
  .adven-weather-icon--cloudy .adven-weather-icon__cloud-float,
  .adven-weather-icon--overcast .adven-weather-icon__overcast-clouds,
  .adven-weather-icon--rain .adven-weather-icon__drop,
  .adven-weather-icon--drizzle .adven-weather-icon__drop,
  .adven-weather-icon--storm .adven-weather-icon__bolt,
  .adven-weather-icon--hail .adven-weather-icon__hail--1,
  .adven-weather-icon--hail .adven-weather-icon__hail--2,
  .adven-weather-icon--hail .adven-weather-icon__hail--3,
  .adven-weather-icon--snow .adven-weather-icon__flake--1,
  .adven-weather-icon--snow .adven-weather-icon__flake--2,
  .adven-weather-icon--wind .adven-weather-icon__wind--1,
  .adven-weather-icon--wind .adven-weather-icon__wind--2,
  .adven-weather-icon--wind .adven-weather-icon__wind--3,
  .adven-weather-icon--sandstorm .adven-weather-icon__sand--1,
  .adven-weather-icon--sandstorm .adven-weather-icon__sand--2,
  .adven-weather-icon--sandstorm .adven-weather-icon__sand--3,
  .adven-weather-icon--sandstorm .adven-weather-icon__sand--4,
  .adven-weather-icon--fog .adven-weather-icon__fog--1,
  .adven-weather-icon--fog .adven-weather-icon__fog--2,
  .adven-weather-icon--fog .adven-weather-icon__fog--3,
  .adven-weather-icon--default .adven-weather-icon__default-marks {
    animation: none !important;
  }
}
</style>
