<template>
  <svg
    class="goth-wx-icon"
    :class="[`goth-wx-icon--${variant}`, { 'goth-wx-icon--anim': animate }]"
    viewBox="0 0 48 44"
    width="48"
    height="44"
    aria-hidden="true"
    focusable="false"
  >
    <defs>
      <linearGradient :id="`${gid}-cloud-face`" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="var(--wx-cloud-lit, #a89882)" />
        <stop offset="45%" stop-color="var(--wx-cloud-mid, #6e6258)" />
        <stop offset="100%" stop-color="var(--wx-cloud-shade, #3a342e)" />
      </linearGradient>
      <linearGradient :id="`${gid}-cloud-rim`" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="var(--wx-rim-lit, rgba(232, 220, 196, 0.42))" />
        <stop offset="100%" stop-color="var(--wx-rim-shade, rgba(24, 20, 18, 0.55))" />
      </linearGradient>
      <linearGradient :id="`${gid}-sun-face`" x1="30%" y1="0%" x2="70%" y2="100%">
        <stop offset="0%" stop-color="var(--wx-sun-lit, #f2e8d4)" />
        <stop offset="55%" stop-color="var(--wx-sun-mid, #c9b078)" />
        <stop offset="100%" stop-color="var(--wx-sun-shade, #8a7448)" />
      </linearGradient>
      <linearGradient :id="`${gid}-ray`" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="var(--wx-ray-lit, rgba(255, 246, 228, 0.95))" />
        <stop offset="100%" stop-color="var(--wx-ray-shade, rgba(180, 158, 118, 0.35))" />
      </linearGradient>
      <linearGradient :id="`${gid}-rain`" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="var(--wx-rain-lit, #8eb8c8)" />
        <stop offset="100%" stop-color="var(--wx-rain-shade, #4a6a78)" />
      </linearGradient>
      <linearGradient :id="`${gid}-haze-band`" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="rgba(140, 118, 78, 0.35)" />
        <stop offset="50%" stop-color="rgba(180, 152, 102, 0.55)" />
        <stop offset="100%" stop-color="rgba(110, 92, 62, 0.38)" />
      </linearGradient>
      <filter :id="`${gid}-soft-glow`" x="-40%" y="-40%" width="180%" height="180%">
        <feGaussianBlur stdDeviation="0.6" result="b" />
        <feMerge>
          <feMergeNode in="b" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>

    <!-- 晴 -->
    <g v-if="variant === 'sunny'" class="goth-wx-sunny">
      <circle
        cx="24"
        cy="22"
        r="10"
        :fill="u('sun-face')"
        :stroke="u('cloud-rim')"
        stroke-width="0.75"
      />
      <g class="goth-wx-sunny__rays" :stroke="u('ray')" stroke-linecap="round">
        <line x1="24" y1="5" x2="24" y2="9.5" stroke-width="1.35" />
        <line x1="24" y1="34.5" x2="24" y2="39" stroke-width="1.35" />
        <line x1="7" y1="22" x2="11.5" y2="22" stroke-width="1.35" />
        <line x1="36.5" y1="22" x2="41" y2="22" stroke-width="1.35" />
        <line x1="11.5" y1="10.5" x2="14.8" y2="13.8" stroke-width="1.15" />
        <line x1="33.2" y1="30.2" x2="36.5" y2="33.5" stroke-width="1.15" />
        <line x1="36.5" y1="10.5" x2="33.2" y2="13.8" stroke-width="1.15" />
        <line x1="14.8" y1="30.2" x2="11.5" y2="33.5" stroke-width="1.15" />
      </g>
    </g>

    <!-- 少云 / 晴间多云 -->
    <g v-else-if="variant === 'partly-cloudy'" class="goth-wx-partly">
      <circle cx="31" cy="14" r="7.5" :fill="u('sun-face')" :stroke="u('cloud-rim')" stroke-width="0.65" />
      <g class="goth-wx-partly__rays" :stroke="u('ray')" stroke-linecap="round">
        <line x1="31" y1="4" x2="31" y2="7" stroke-width="1.1" />
        <line x1="31" y1="21" x2="31" y2="24" stroke-width="1.1" />
        <line x1="21" y1="14" x2="23.5" y2="14" stroke-width="1.1" />
        <line x1="38.5" y1="14" x2="41" y2="14" stroke-width="1.1" />
      </g>
      <path
        class="goth-wx-cloud goth-wx-cloud--front"
        :fill="u('cloud-face')"
        :stroke="u('cloud-rim')"
        stroke-width="0.65"
        d="M38 28.5c0-6.2-5-11.2-11.1-11.2a11 11 0 0 0-10.4 7A8 8 0 0 0 6 28.5C6 33.7 10.3 38 15.6 38h15.8c5.3 0 9.6-4.3 9.6-9.5z"
      />
    </g>

    <!-- 多云 -->
    <g v-else-if="variant === 'cloudy'" class="goth-wx-cloudy">
      <path
        class="goth-wx-cloud goth-wx-cloud--back"
        :fill="u('cloud-face')"
        opacity="0.42"
        transform="translate(7 -4) scale(0.72)"
        d="M34 26c0-5.5-4.3-10-9.6-10a9.8 9.8 0 0 0-9.2 6.2A7.2 7.2 0 0 0 8 26c0 4 3.2 7.2 7.2 7.2h17.5c4.7 0 8.3-3.8 8.3-8.5z"
      />
      <path
        class="goth-wx-cloud goth-wx-cloud--front"
        :fill="u('cloud-face')"
        :stroke="u('cloud-rim')"
        stroke-width="0.65"
        d="M38 28.5c0-6.2-5-11.2-11.1-11.2a11 11 0 0 0-10.4 7A8 8 0 0 0 6 28.5C6 33.7 10.3 38 15.6 38h15.8c5.3 0 9.6-4.3 9.6-9.5z"
      />
    </g>

    <!-- 阴（与多云同形，靠样式压暗） -->
    <g v-else-if="variant === 'overcast'" class="goth-wx-overcast">
      <path
        class="goth-wx-cloud goth-wx-cloud--back"
        :fill="u('cloud-face')"
        opacity="0.55"
        transform="translate(5 -2) scale(0.78)"
        d="M34 26c0-5.5-4.3-10-9.6-10a9.8 9.8 0 0 0-9.2 6.2A7.2 7.2 0 0 0 8 26c0 4 3.2 7.2 7.2 7.2h17.5c4.7 0 8.3-3.8 8.3-8.5z"
      />
      <path
        class="goth-wx-cloud goth-wx-cloud--front"
        :fill="u('cloud-face')"
        :stroke="u('cloud-rim')"
        stroke-width="0.65"
        opacity="0.96"
        d="M38 28.5c0-6.2-5-11.2-11.1-11.2a11 11 0 0 0-10.4 7A8 8 0 0 0 6 28.5C6 33.7 10.3 38 15.6 38h15.8c5.3 0 9.6-4.3 9.6-9.5z"
      />
    </g>

    <!-- 大风（流线；热带系统同名归类） -->
    <g v-else-if="variant === 'windy'" class="goth-wx-windy">
      <path
        class="goth-wx-cloud goth-wx-cloud--mini"
        :fill="u('cloud-face')"
        :stroke="u('cloud-rim')"
        stroke-width="0.45"
        opacity="0.72"
        d="M40 17c0-3.8-3.1-6.9-6.9-6.9a6.9 6.9 0 0 0-6.5 4.4A5 5 0 0 0 22 17c0 3.2 2.6 5.8 5.8 5.8h9.9c3.3 0 6-2.7 6-6z"
      />
      <g
        class="goth-wx-wind-strokes"
        fill="none"
        stroke="var(--wx-wind, rgba(196, 182, 158, 0.65))"
        stroke-width="1.35"
        stroke-linecap="round"
      >
        <path class="goth-wx-wind-a" d="M5 26 Q18 22 33 26 T43 26" />
        <path class="goth-wx-wind-b" d="M7 32 Q22 28 38 32" />
        <path class="goth-wx-wind-c" d="M6 19 Q20 15 36 19" />
      </g>
    </g>

    <!-- 沙尘 -->
    <g v-else-if="variant === 'dust'" class="goth-wx-dust">
      <path
        :fill="u('cloud-face')"
        opacity="0.28"
        d="M38 20c0-6.2-5-11.2-11.1-11.2a11 11 0 0 0-10.4 7A8 8 0 0 0 6 20c0 5.2 4.3 9.5 9.6 9.5h15.8c5.3 0 9.6-4.3 9.6-9.5z"
      />
      <g
        class="goth-wx-dust-stream"
        stroke="var(--wx-dust, rgba(168, 138, 98, 0.55))"
        stroke-width="1.15"
        stroke-linecap="round"
      >
        <line x1="4" y1="30" x2="22" y2="34" />
        <line x1="10" y1="34" x2="30" y2="38" />
        <line x1="18" y1="28" x2="38" y2="32" />
        <line x1="26" y1="36" x2="44" y2="40" />
      </g>
    </g>

    <!-- 雨 / 暴雨 -->
    <g v-else-if="variant === 'rainy' || variant === 'heavy-rain'" class="goth-wx-rainy">
      <path
        class="goth-wx-cloud goth-wx-cloud--front"
        :fill="u('cloud-face')"
        :stroke="u('cloud-rim')"
        stroke-width="0.65"
        d="M38 22c0-6.2-5-11.2-11.1-11.2a11 11 0 0 0-10.4 7A8 8 0 0 0 6 22c0 5.2 4.3 9.5 9.6 9.5h15.8c5.3 0 9.6-4.3 9.6-9.5z"
      />
      <g class="goth-wx-rain-drops" :fill="u('rain')" stroke="none">
        <path class="goth-wx-drop goth-wx-drop--a" d="M17 30c0 2 1.6 3.5 3.5 3.5s3.5-1.6 3.5-3.5c0-2.2-3.5-6.2-3.5-6.2s-3.5 4-3.5 6.2z" />
        <path class="goth-wx-drop goth-wx-drop--b" d="M26 32c0 1.7 1.3 3 3 3s3-1.3 3-3c0-1.8-3-5.4-3-5.4s-3 3.6-3 5.4z" />
        <path class="goth-wx-drop goth-wx-drop--c" d="M11 33c0 1.5 1.2 2.6 2.6 2.6s2.6-1.2 2.6-2.6c0-1.6-2.6-4.8-2.6-4.8s-2.6 3.2-2.6 4.8z" />
        <path
          v-if="variant === 'heavy-rain'"
          class="goth-wx-drop goth-wx-drop--d"
          d="M32 31c0 1.7 1.3 3 3 3s3-1.3 3-3c0-1.8-3-5.4-3-5.4s-3 3.6-3 5.4z"
        />
        <path
          v-if="variant === 'heavy-rain'"
          class="goth-wx-drop goth-wx-drop--e"
          d="M21 34c0 1.5 1.2 2.6 2.6 2.6s2.6-1.2 2.6-2.6c0-1.6-2.6-4.8-2.6-4.8s-2.6 3.2-2.6 4.8z"
        />
      </g>
    </g>

    <!-- 太阳雨 -->
    <g v-else-if="variant === 'sun-shower'" class="goth-wx-sun-shower">
      <g class="goth-wx-sun-shower__sun">
        <circle cx="14" cy="13" r="6.25" :fill="u('sun-face')" :stroke="u('cloud-rim')" stroke-width="0.65" />
        <g class="goth-wx-sun-shower__rays" :stroke="u('ray')" stroke-linecap="round">
          <line x1="14" y1="3.5" x2="14" y2="6.25" stroke-width="1.2" />
          <line x1="14" y1="19.75" x2="14" y2="22.5" stroke-width="1.2" />
          <line x1="4.5" y1="13" x2="7.25" y2="13" stroke-width="1.2" />
          <line x1="20.75" y1="13" x2="23.5" y2="13" stroke-width="1.2" />
          <line x1="7.5" y1="6.5" x2="9.45" y2="8.45" stroke-width="1" />
          <line x1="18.55" y1="17.55" x2="20.5" y2="19.5" stroke-width="1" />
          <line x1="20.5" y1="6.5" x2="18.55" y2="8.45" stroke-width="1" />
          <line x1="9.45" y1="17.55" x2="7.5" y2="19.5" stroke-width="1" />
        </g>
      </g>
      <path
        class="goth-wx-cloud goth-wx-cloud--front"
        :fill="u('cloud-face')"
        :stroke="u('cloud-rim')"
        stroke-width="0.65"
        d="M39 24.5c0-5.8-4.6-10.5-10.2-10.5a10 10 0 0 0-9.6 6.5A7.4 7.4 0 0 0 7 24.5C7 29.4 11 33.5 16 33.5h14.9c5 0 9.1-4 9.1-9z"
      />
      <g class="goth-wx-rain-drops" :fill="u('rain')">
        <path class="goth-wx-drop goth-wx-drop--a" d="M18 34c0 1.6 1.3 2.8 2.8 2.8s2.8-1.3 2.8-2.8c0-1.7-2.8-5-2.8-5s-2.8 3.3-2.8 5z" />
        <path class="goth-wx-drop goth-wx-drop--b" d="M27 35c0 1.4 1.1 2.4 2.4 2.4s2.4-1.1 2.4-2.4c0-1.5-2.4-4.4-2.4-4.4s-2.4 2.9-2.4 4.4z" />
      </g>
    </g>

    <!-- 雷 -->
    <g v-else-if="variant === 'thunder'" class="goth-wx-thunder" :filter="`url(#${gid}-soft-glow)`">
      <path
        class="goth-wx-cloud goth-wx-cloud--front"
        :fill="u('cloud-face')"
        :stroke="u('cloud-rim')"
        stroke-width="0.65"
        d="M38 21c0-6.2-5-11.2-11.1-11.2a11 11 0 0 0-10.4 7A8 8 0 0 0 6 21c0 5.2 4.3 9.5 9.6 9.5h15.8c5.3 0 9.6-4.3 9.6-9.5z"
      />
      <path
        class="goth-wx-bolt"
        fill="var(--wx-bolt, #c9b078)"
        stroke="rgba(28,24,18,0.35)"
        stroke-width="0.35"
        d="M25 22 L21 31.5 L24 31.5 L20 40 L30 28.5 L26 28.5 L29 22 Z"
      />
    </g>

    <!-- 雪 -->
    <g v-else-if="variant === 'snow'" class="goth-wx-snow">
      <path
        class="goth-wx-cloud goth-wx-cloud--front"
        :fill="u('cloud-face')"
        :stroke="u('cloud-rim')"
        stroke-width="0.65"
        d="M38 21c0-6.2-5-11.2-11.1-11.2a11 11 0 0 0-10.4 7A8 8 0 0 0 6 21c0 5.2 4.3 9.5 9.6 9.5h15.8c5.3 0 9.6-4.3 9.6-9.5z"
      />
      <g class="goth-wx-flakes" fill="none" stroke="var(--wx-flake, rgba(228, 218, 200, 0.85))" stroke-width="1.1" stroke-linecap="round">
        <path class="goth-wx-flake goth-wx-flake--a" d="M14 33v5m-2.5-2.5h5M14 33l3.2 3.2m-6.4 0L14 33" />
        <path class="goth-wx-flake goth-wx-flake--b" d="M24 31v5m-2.5-2.5h5" />
        <path class="goth-wx-flake goth-wx-flake--c" d="M34 34v4m-2-2h4" />
      </g>
    </g>

    <!-- 雨夹雪 / 冻雨 -->
    <g v-else-if="variant === 'sleet'" class="goth-wx-sleet">
      <path
        class="goth-wx-cloud goth-wx-cloud--front"
        :fill="u('cloud-face')"
        :stroke="u('cloud-rim')"
        stroke-width="0.65"
        d="M38 21c0-6.2-5-11.2-11.1-11.2a11 11 0 0 0-10.4 7A8 8 0 0 0 6 21c0 5.2 4.3 9.5 9.6 9.5h15.8c5.3 0 9.6-4.3 9.6-9.5z"
      />
      <path class="goth-wx-sleet-drop" :fill="u('rain')" d="M15 33c0 1.4 1.1 2.4 2.4 2.4s2.4-1.1 2.4-2.4c0-1.5-2.4-4.4-2.4-4.4s-2.4 2.9-2.4 4.4z" />
      <path class="goth-wx-sleet-drop" :fill="u('rain')" d="M26 34c0 1.2 1 2.1 2.1 2.1s2.1-1 2.1-2.1c0-1.3-2.1-3.8-2.1-3.8s-2.1 2.5-2.1 3.8z" />
      <path class="goth-wx-sleet-flake" fill="none" stroke="var(--wx-flake, rgba(228, 218, 200, 0.85))" stroke-width="1" d="M32 31v4m-2-2h4" />
      <path class="goth-wx-sleet-flake" fill="none" stroke="var(--wx-flake, rgba(228, 218, 200, 0.85))" stroke-width="1" d="M10 36v3.5m-1.8-1.8h3.6" />
    </g>

    <!-- 冰雹 -->
    <g v-else-if="variant === 'hail'" class="goth-wx-hail">
      <path
        class="goth-wx-cloud goth-wx-cloud--front"
        :fill="u('cloud-face')"
        :stroke="u('cloud-rim')"
        stroke-width="0.65"
        d="M38 20c0-6.2-5-11.2-11.1-11.2a11 11 0 0 0-10.4 7A8 8 0 0 0 6 20c0 5.2 4.3 9.5 9.6 9.5h15.8c5.3 0 9.6-4.3 9.6-9.5z"
      />
      <g class="goth-wx-hail-stones" fill="var(--wx-hail, rgba(212, 208, 198, 0.92))" stroke="rgba(28,24,18,0.28)" stroke-width="0.35">
        <circle class="goth-wx-hail-dot goth-wx-hail-dot--a" cx="14" cy="34" r="2.1" />
        <circle class="goth-wx-hail-dot goth-wx-hail-dot--b" cx="22" cy="37" r="1.65" />
        <circle class="goth-wx-hail-dot goth-wx-hail-dot--c" cx="30" cy="34.5" r="2" />
        <circle class="goth-wx-hail-dot goth-wx-hail-dot--d" cx="36" cy="37" r="1.5" />
      </g>
    </g>

    <!-- 雾 -->
    <g v-else-if="variant === 'fog'" class="goth-wx-fog">
      <rect x="6" y="14" width="36" height="5.5" rx="2.75" :fill="u('cloud-face')" opacity="0.55" />
      <rect
        x="10"
        y="21"
        width="30"
        height="5"
        rx="2.5"
        :fill="u('cloud-face')"
        opacity="0.72"
        :stroke="u('cloud-rim')"
        stroke-width="0.5"
      />
      <rect x="7" y="27.5" width="34" height="5.5" rx="2.75" :fill="u('cloud-face')" opacity="0.48" />
    </g>

    <!-- 霾 -->
    <g v-else class="goth-wx-haze">
      <rect x="5" y="13" width="38" height="6" rx="3" :fill="`url(#${gid}-haze-band)`" opacity="0.42" />
      <rect x="8" y="20.5" width="32" height="5.5" rx="2.75" :fill="`url(#${gid}-haze-band)`" opacity="0.58" />
      <rect x="6" y="28" width="36" height="6" rx="3" :fill="`url(#${gid}-haze-band)`" opacity="0.38" />
    </g>
  </svg>
</template>

<script setup lang="ts">
import { useId } from 'vue';
import type { GothWeatherVariant } from './utils/gothWeatherVariant';

withDefaults(
  defineProps<{
    variant: GothWeatherVariant;
    /** 是否启用参考案例式轻微动画（晴旋转、雨雪相位） */
    animate?: boolean;
  }>(),
  { animate: true },
);

const gid = useId().replace(/\W/g, '_');
function u(suffix: string) {
  return `url(#${gid}-${suffix})`;
}
</script>

<style scoped>
.goth-wx-icon {
  display: block;
  flex-shrink: 0;
  width: 2.65rem;
  height: auto;
  overflow: visible;

  --wx-cloud-lit: #9a8b78;
  --wx-cloud-mid: #5c5248;
  --wx-cloud-shade: #2e2924;
  --wx-rim-lit: rgba(236, 226, 206, 0.38);
  --wx-rim-shade: rgba(14, 12, 10, 0.62);
  --wx-sun-lit: #f4ebd8;
  --wx-sun-mid: #c6a86c;
  --wx-sun-shade: #7d6842;
  --wx-ray-lit: rgba(255, 248, 232, 0.9);
  --wx-ray-shade: rgba(148, 128, 96, 0.4);
  --wx-rain-lit: #9cb8c4;
  --wx-rain-shade: #4a6672;
  --wx-bolt: #d8c090;
  --wx-flake: rgba(232, 222, 198, 0.88);
  --wx-wind: rgba(196, 182, 158, 0.62);
  --wx-dust: rgba(168, 138, 98, 0.55);
  --wx-hail: rgba(212, 208, 198, 0.92);
}

/* 阴天：压低云层亮度 */
.goth-wx-icon--overcast {
  --wx-cloud-lit: #72685c;
  --wx-cloud-mid: #454038;
  --wx-cloud-shade: #1e1c18;
  --wx-rim-lit: rgba(160, 148, 128, 0.22);
}

.goth-wx-icon--anim.goth-wx-icon--sunny .goth-wx-sunny__rays {
  transform-origin: 24px 22px;
  animation: goth-wx-spin 14s linear infinite;
}

.goth-wx-icon--anim.goth-wx-icon--partly-cloudy .goth-wx-partly__rays {
  animation: goth-wx-spin 18s linear infinite;
  transform-origin: 31px 14px;
}

.goth-wx-icon--anim.goth-wx-icon--cloudy .goth-wx-cloud--back {
  animation: goth-wx-cloud-pulse 5s ease-in-out infinite;
}

.goth-wx-icon--anim.goth-wx-icon--overcast .goth-wx-cloud--back {
  animation: goth-wx-cloud-pulse 6.5s ease-in-out infinite;
}

.goth-wx-icon--anim.goth-wx-icon--windy .goth-wx-wind-a {
  animation: goth-wx-wind 2.8s ease-in-out infinite;
}

.goth-wx-icon--anim.goth-wx-icon--windy .goth-wx-wind-b {
  animation: goth-wx-wind 2.8s ease-in-out infinite 0.35s;
}

.goth-wx-icon--anim.goth-wx-icon--windy .goth-wx-wind-c {
  animation: goth-wx-wind 2.8s ease-in-out infinite 0.7s;
}

.goth-wx-icon--anim.goth-wx-icon--dust .goth-wx-dust-stream {
  animation: goth-wx-dust-shift 2.6s ease-in-out infinite;
}

.goth-wx-icon--anim.goth-wx-icon--rainy .goth-wx-drop--a,
.goth-wx-icon--anim.goth-wx-icon--heavy-rain .goth-wx-drop--a {
  animation: goth-wx-rain 2.4s ease-in-out infinite;
}

.goth-wx-icon--anim.goth-wx-icon--rainy .goth-wx-drop--b,
.goth-wx-icon--anim.goth-wx-icon--heavy-rain .goth-wx-drop--b {
  animation: goth-wx-rain 2.4s ease-in-out infinite 0.35s;
}

.goth-wx-icon--anim.goth-wx-icon--rainy .goth-wx-drop--c,
.goth-wx-icon--anim.goth-wx-icon--heavy-rain .goth-wx-drop--c {
  animation: goth-wx-rain 2.4s ease-in-out infinite 0.7s;
}

.goth-wx-icon--anim.goth-wx-icon--heavy-rain .goth-wx-drop--d {
  animation: goth-wx-rain 1.65s ease-in-out infinite 0.15s;
}

.goth-wx-icon--anim.goth-wx-icon--heavy-rain .goth-wx-drop--e {
  animation: goth-wx-rain 1.65s ease-in-out infinite 0.5s;
}

.goth-wx-icon--anim.goth-wx-icon--sun-shower .goth-wx-sun-shower__rays {
  animation: goth-wx-spin 16s linear infinite;
  transform-origin: 14px 13px;
}

.goth-wx-icon--anim.goth-wx-icon--sun-shower .goth-wx-drop--a {
  animation: goth-wx-rain 2.2s ease-in-out infinite;
}

.goth-wx-icon--anim.goth-wx-icon--sun-shower .goth-wx-drop--b {
  animation: goth-wx-rain 2.2s ease-in-out infinite 0.4s;
}

.goth-wx-icon--anim.goth-wx-icon--thunder .goth-wx-bolt {
  animation: goth-wx-bolt 2.2s ease-in-out infinite;
}

.goth-wx-icon--anim.goth-wx-icon--snow .goth-wx-flake--a {
  animation: goth-wx-flake 5s ease-in-out infinite;
}

.goth-wx-icon--anim.goth-wx-icon--snow .goth-wx-flake--b {
  animation: goth-wx-flake 5.8s ease-in-out infinite 0.6s;
}

.goth-wx-icon--anim.goth-wx-icon--snow .goth-wx-flake--c {
  animation: goth-wx-flake 6.4s ease-in-out infinite 1.1s;
}

.goth-wx-icon--anim.goth-wx-icon--sleet .goth-wx-sleet-drop {
  animation: goth-wx-rain 2.3s ease-in-out infinite;
}

.goth-wx-icon--anim.goth-wx-icon--sleet .goth-wx-sleet-flake {
  animation: goth-wx-flake 5.2s ease-in-out infinite 0.4s;
}

.goth-wx-icon--anim.goth-wx-icon--hail .goth-wx-hail-dot--a {
  animation: goth-wx-hail-bounce 2s ease-in-out infinite;
}

.goth-wx-icon--anim.goth-wx-icon--hail .goth-wx-hail-dot--b {
  animation: goth-wx-hail-bounce 2s ease-in-out infinite 0.25s;
}

.goth-wx-icon--anim.goth-wx-icon--hail .goth-wx-hail-dot--c {
  animation: goth-wx-hail-bounce 2s ease-in-out infinite 0.5s;
}

.goth-wx-icon--anim.goth-wx-icon--hail .goth-wx-hail-dot--d {
  animation: goth-wx-hail-bounce 2s ease-in-out infinite 0.75s;
}

.goth-wx-icon--anim.goth-wx-icon--fog .goth-wx-fog rect:nth-child(1) {
  animation: goth-wx-haze-drift 5s ease-in-out infinite;
}

.goth-wx-icon--anim.goth-wx-icon--fog .goth-wx-fog rect:nth-child(2) {
  animation: goth-wx-haze-drift 5s ease-in-out infinite 0.6s;
}

.goth-wx-icon--anim.goth-wx-icon--fog .goth-wx-fog rect:nth-child(3) {
  animation: goth-wx-haze-drift 5s ease-in-out infinite 1.1s;
}

.goth-wx-icon--anim.goth-wx-icon--haze .goth-wx-haze rect:nth-child(1) {
  animation: goth-wx-haze-drift 6s ease-in-out infinite;
}

.goth-wx-icon--anim.goth-wx-icon--haze .goth-wx-haze rect:nth-child(2) {
  animation: goth-wx-haze-drift 6s ease-in-out infinite 0.7s;
}

.goth-wx-icon--anim.goth-wx-icon--haze .goth-wx-haze rect:nth-child(3) {
  animation: goth-wx-haze-drift 6s ease-in-out infinite 1.4s;
}

@keyframes goth-wx-spin {
  to {
    transform: rotate(360deg);
  }
}

@keyframes goth-wx-cloud-pulse {
  0%,
  100% {
    opacity: 0.38;
  }

  50% {
    opacity: 0.52;
  }
}

@keyframes goth-wx-wind {
  0%,
  100% {
    opacity: 0.45;
    transform: translateX(0);
  }

  50% {
    opacity: 1;
    transform: translateX(2px);
  }
}

@keyframes goth-wx-dust-shift {
  0%,
  100% {
    opacity: 0.55;
    transform: translate(0, 0);
  }

  50% {
    opacity: 0.95;
    transform: translate(1px, 1px);
  }
}

@keyframes goth-wx-rain {
  0%,
  100% {
    opacity: 0.35;
    transform: translateY(-1px);
  }

  50% {
    opacity: 1;
    transform: translateY(3px);
  }
}

@keyframes goth-wx-bolt {
  0%,
  70%,
  100% {
    opacity: 0.35;
    filter: brightness(0.85);
  }

  74%,
  78% {
    opacity: 1;
    filter: brightness(1.35);
  }
}

@keyframes goth-wx-flake {
  0%,
  100% {
    opacity: 0.45;
    transform: translateY(0) rotate(0deg);
  }

  50% {
    opacity: 1;
    transform: translateY(2px) rotate(18deg);
  }
}

@keyframes goth-wx-hail-bounce {
  0%,
  100% {
    opacity: 0.65;
    transform: translateY(0);
  }

  40% {
    opacity: 1;
    transform: translateY(1.5px);
  }
}

@keyframes goth-wx-haze-drift {
  0%,
  100% {
    opacity: 0.85;
    transform: translateX(0);
  }

  50% {
    opacity: 1;
    transform: translateX(1.5px);
  }
}

@media (prefers-reduced-motion: reduce) {
  .goth-wx-icon--anim .goth-wx-sunny__rays,
  .goth-wx-icon--anim .goth-wx-partly__rays,
  .goth-wx-icon--anim.goth-wx-icon--cloudy .goth-wx-cloud--back,
  .goth-wx-icon--anim.goth-wx-icon--overcast .goth-wx-cloud--back,
  .goth-wx-icon--anim.goth-wx-icon--windy .goth-wx-wind-a,
  .goth-wx-icon--anim.goth-wx-icon--windy .goth-wx-wind-b,
  .goth-wx-icon--anim.goth-wx-icon--windy .goth-wx-wind-c,
  .goth-wx-icon--anim.goth-wx-icon--dust .goth-wx-dust-stream,
  .goth-wx-icon--anim.goth-wx-icon--rainy .goth-wx-drop--a,
  .goth-wx-icon--anim.goth-wx-icon--rainy .goth-wx-drop--b,
  .goth-wx-icon--anim.goth-wx-icon--rainy .goth-wx-drop--c,
  .goth-wx-icon--anim.goth-wx-icon--heavy-rain .goth-wx-drop--a,
  .goth-wx-icon--anim.goth-wx-icon--heavy-rain .goth-wx-drop--b,
  .goth-wx-icon--anim.goth-wx-icon--heavy-rain .goth-wx-drop--c,
  .goth-wx-icon--anim.goth-wx-icon--heavy-rain .goth-wx-drop--d,
  .goth-wx-icon--anim.goth-wx-icon--heavy-rain .goth-wx-drop--e,
  .goth-wx-icon--anim.goth-wx-icon--sun-shower .goth-wx-sun-shower__rays,
  .goth-wx-icon--anim.goth-wx-icon--sun-shower .goth-wx-drop--a,
  .goth-wx-icon--anim.goth-wx-icon--sun-shower .goth-wx-drop--b,
  .goth-wx-icon--anim.goth-wx-icon--thunder .goth-wx-bolt,
  .goth-wx-icon--anim.goth-wx-icon--snow .goth-wx-flake--a,
  .goth-wx-icon--anim.goth-wx-icon--snow .goth-wx-flake--b,
  .goth-wx-icon--anim.goth-wx-icon--snow .goth-wx-flake--c,
  .goth-wx-icon--anim.goth-wx-icon--sleet .goth-wx-sleet-drop,
  .goth-wx-icon--anim.goth-wx-icon--sleet .goth-wx-sleet-flake,
  .goth-wx-icon--anim.goth-wx-icon--hail .goth-wx-hail-dot--a,
  .goth-wx-icon--anim.goth-wx-icon--hail .goth-wx-hail-dot--b,
  .goth-wx-icon--anim.goth-wx-icon--hail .goth-wx-hail-dot--c,
  .goth-wx-icon--anim.goth-wx-icon--hail .goth-wx-hail-dot--d,
  .goth-wx-icon--anim.goth-wx-icon--fog .goth-wx-fog rect:nth-child(1),
  .goth-wx-icon--anim.goth-wx-icon--fog .goth-wx-fog rect:nth-child(2),
  .goth-wx-icon--anim.goth-wx-icon--fog .goth-wx-fog rect:nth-child(3),
  .goth-wx-icon--anim.goth-wx-icon--haze .goth-wx-haze rect:nth-child(1),
  .goth-wx-icon--anim.goth-wx-icon--haze .goth-wx-haze rect:nth-child(2),
  .goth-wx-icon--anim.goth-wx-icon--haze .goth-wx-haze rect:nth-child(3) {
    animation: none !important;
  }
}
</style>
