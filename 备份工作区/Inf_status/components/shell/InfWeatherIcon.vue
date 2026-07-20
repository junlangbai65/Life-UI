<template>
  <svg
    class="inf-weather-icon"
    :class="`inf-weather-icon--${kind}`"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <template v-if="kind === 'clear'">
      <circle class="inf-weather-icon__sun-core" cx="12" cy="12" r="4" fill="currentColor" opacity="0.9" />
      <g class="inf-weather-icon__sun-rays" stroke="currentColor" stroke-width="1.2" stroke-linecap="round">
        <line x1="12" y1="2" x2="12" y2="5" />
        <line x1="12" y1="19" x2="12" y2="22" />
        <line x1="2" y1="12" x2="5" y2="12" />
        <line x1="19" y1="12" x2="22" y2="12" />
        <line x1="4.9" y1="4.9" x2="7" y2="7" />
        <line x1="17" y1="17" x2="19.1" y2="19.1" />
        <line x1="4.9" y1="19.1" x2="7" y2="17" />
        <line x1="17" y1="7" x2="19.1" y2="4.9" />
      </g>
    </template>

    <template v-else-if="kind === 'partlyCloudy'">
      <circle class="inf-weather-icon__sun-peek" cx="8" cy="9" r="3" fill="currentColor" opacity="0.85" />
      <path
        class="inf-weather-icon__cloud"
        d="M7 17h10a4 4 0 0 0 .3-8 5.5 5.5 0 0 0-10.6 1.8A3.2 3.2 0 0 0 7 17Z"
        fill="currentColor"
        opacity="0.75"
      />
    </template>

    <template v-else-if="kind === 'overcast'">
      <path
        class="inf-weather-icon__cloud"
        d="M6 16h12a4 4 0 0 0 .4-8 6 6 0 0 0-11.8 2A3.5 3.5 0 0 0 6 16Z"
        fill="currentColor"
        opacity="0.8"
      />
    </template>

    <template v-else-if="kind === 'drizzle' || kind === 'rain' || kind === 'heavyRain'">
      <path
        class="inf-weather-icon__cloud"
        d="M6 11h12a4 4 0 0 0 .4-8 6 6 0 0 0-11.8 2A3.5 3.5 0 0 0 6 11Z"
        fill="currentColor"
        opacity="0.75"
      />
      <line class="inf-weather-icon__drop" x1="9" y1="14" x2="9" y2="18" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" />
      <line class="inf-weather-icon__drop" x1="12" y1="15" x2="12" y2="19" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" />
      <line
        v-if="kind !== 'drizzle'"
        class="inf-weather-icon__drop"
        x1="15"
        y1="14"
        x2="15"
        y2="18"
        stroke="currentColor"
        stroke-width="1.4"
        stroke-linecap="round"
      />
      <line
        v-if="kind === 'heavyRain'"
        class="inf-weather-icon__drop"
        x1="18"
        y1="15"
        x2="18"
        y2="19"
        stroke="currentColor"
        stroke-width="1.4"
        stroke-linecap="round"
      />
    </template>

    <template v-else-if="kind === 'thunder'">
      <path
        class="inf-weather-icon__cloud"
        d="M6 10h12a4 4 0 0 0 .4-8 6 6 0 0 0-11.8 2A3.5 3.5 0 0 0 6 10Z"
        fill="currentColor"
        opacity="0.75"
      />
      <path
        class="inf-weather-icon__bolt"
        d="M13 12h-2l-1 5 3-3h2l1-5-3 3Z"
        fill="var(--inf-warning, #d97706)"
      />
    </template>

    <template v-else-if="kind === 'snow' || kind === 'blizzard'">
      <path
        class="inf-weather-icon__cloud"
        d="M6 10h12a4 4 0 0 0 .4-8 6 6 0 0 0-11.8 2A3.5 3.5 0 0 0 6 10Z"
        fill="currentColor"
        opacity="0.7"
      />
      <circle class="inf-weather-icon__flake" cx="9" cy="16" r="1" fill="currentColor" />
      <circle class="inf-weather-icon__flake" cx="13" cy="18" r="1" fill="currentColor" />
      <circle class="inf-weather-icon__flake" cx="16" cy="15" r="1" fill="currentColor" />
      <circle v-if="kind === 'blizzard'" class="inf-weather-icon__flake" cx="11" cy="20" r="1" fill="currentColor" />
    </template>

    <template v-else-if="kind === 'fog' || kind === 'haze'">
      <rect class="inf-weather-icon__fog-layer" x="4" y="10" width="16" height="2" rx="1" fill="currentColor" opacity="0.5" />
      <rect class="inf-weather-icon__fog-layer" x="3" y="14" width="18" height="2" rx="1" fill="currentColor" opacity="0.45" />
      <rect x="5" y="18" width="14" height="2" rx="1" fill="currentColor" opacity="0.35" />
    </template>

    <template v-else-if="kind === 'wind'">
      <path
        class="inf-weather-icon__wind-line"
        d="M4 8h12a2 2 0 1 0 0-4H4"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="round"
      />
      <path
        class="inf-weather-icon__wind-line"
        d="M4 12h16a2.5 2.5 0 1 0 0-5H4"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="round"
      />
      <path
        class="inf-weather-icon__wind-line"
        d="M4 16h10a2 2 0 1 0 0-4H4"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="round"
      />
    </template>

    <template v-else-if="kind === 'sandstorm'">
      <rect x="3" y="8" width="18" height="10" rx="2" fill="currentColor" opacity="0.15" />
      <line class="inf-weather-icon__sand" x1="5" y1="11" x2="11" y2="11" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" />
      <line class="inf-weather-icon__sand" x1="8" y1="14" x2="16" y2="14" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" />
      <line class="inf-weather-icon__sand" x1="6" y1="17" x2="13" y2="17" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" />
    </template>

    <template v-else-if="kind === 'sleet'">
      <path
        class="inf-weather-icon__cloud"
        d="M6 10h12a4 4 0 0 0 .4-8 6 6 0 0 0-11.8 2A3.5 3.5 0 0 0 6 10Z"
        fill="currentColor"
        opacity="0.7"
      />
      <line class="inf-weather-icon__drop" x1="10" y1="14" x2="10" y2="17" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" />
      <circle class="inf-weather-icon__flake" cx="14" cy="16" r="1" fill="currentColor" />
      <circle class="inf-weather-icon__flake" cx="17" cy="18" r="1" fill="currentColor" />
    </template>

    <template v-else>
      <path
        d="M6 14h12a4 4 0 0 0 .4-8 6 6 0 0 0-11.8 2A3.5 3.5 0 0 0 6 14Z"
        fill="currentColor"
        opacity="0.5"
      />
      <text x="12" y="21" text-anchor="middle" fill="currentColor" font-size="8" font-family="var(--inf-font-tech)">?</text>
    </template>
  </svg>
</template>

<script setup lang="ts">
import type { WeatherKind } from '../../utils/weatherVisual';

defineProps<{
  kind: WeatherKind;
}>();
</script>
