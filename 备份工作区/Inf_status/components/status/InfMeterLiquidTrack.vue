<template>
  <div
    class="inf-meter-glass-track inf-meter-liquid-track"
    :class="[
      `inf-meter-glass-track--${variant}`,
      {
        'inf-meter-liquid-track--ripple': ripple,
        'inf-meter-glass-track--elevated': elevated,
      },
    ]"
    role="presentation"
    :style="trackStyle"
  >
    <div class="inf-meter-glass-track__shell" aria-hidden="true">
      <span class="inf-meter-glass-track__specular" />
      <span class="inf-meter-glass-track__refraction" />
      <span class="inf-meter-glass-track__rim" />
      <span
        class="inf-meter-glass-track__specular-pass"
        :class="{ 'inf-meter-glass-track__specular-pass--play': specularPass }"
      />
    </div>

    <div
      v-if="showFill"
      class="inf-meter-glass-fill inf-meter-liquid-fill"
      :class="[
        fillClass,
        {
          'inf-meter-liquid-fill--slosh': slosh,
          'inf-meter-liquid-fill--elevated': elevated,
        },
      ]"
      :style="{ width: `${clamped}%`, ...fillStyle }"
    >
      <div
        v-if="showLiquid"
        class="inf-meter-liquid-distort"
        :class="{
          'inf-meter-liquid-distort--active': distortActive && motionEnabled,
          'inf-meter-liquid-distort--paused': !motionEnabled,
        }"
      >
        <span class="inf-meter-liquid-fill__depth" aria-hidden="true" />
        <span class="inf-meter-liquid-fill__body" aria-hidden="true" />
        <span class="inf-meter-liquid-fill__caustic" aria-hidden="true" />
        <span class="inf-meter-liquid-fill__surface" aria-hidden="true">
          <span class="inf-meter-liquid-fill__wave inf-meter-liquid-fill__wave--a" />
          <span class="inf-meter-liquid-fill__wave inf-meter-liquid-fill__wave--b" />
        </span>
        <span class="inf-meter-liquid-fill__bubble inf-meter-liquid-fill__bubble--1" aria-hidden="true" />
        <span class="inf-meter-liquid-fill__bubble inf-meter-liquid-fill__bubble--2" aria-hidden="true" />
        <span class="inf-meter-liquid-fill__bubble inf-meter-liquid-fill__bubble--3" aria-hidden="true" />
      </div>
      <span v-if="showLiquid" class="inf-meter-glass-fill__meniscus" aria-hidden="true">
        <span class="inf-meter-glass-fill__meniscus-core" />
        <span class="inf-meter-glass-fill__meniscus-glint" />
      </span>
      <span v-if="showLiquid" class="inf-meter-glass-fill__contact" aria-hidden="true" />
      <slot name="fill-end" />
    </div>

    <slot />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = withDefaults(
  defineProps<{
    percent: number;
    variant?: 'infection' | 'desire';
    showFill?: boolean;
    showLiquid?: boolean;
    slosh?: boolean;
    ripple?: boolean;
    specularPass?: boolean;
    elevated?: boolean;
    distortActive?: boolean;
    motionEnabled?: boolean;
    fillClass?: string | string[] | Record<string, boolean>;
    fillStyle?: Record<string, string>;
    trackStyle?: Record<string, string>;
  }>(),
  {
    variant: 'desire',
    showFill: true,
    showLiquid: true,
    slosh: false,
    ripple: false,
    specularPass: false,
    elevated: false,
    distortActive: false,
    motionEnabled: true,
    fillClass: '',
    fillStyle: () => ({}),
    trackStyle: () => ({ '--inf-meter-track-height': '12px' }),
  },
);

const clamped = computed(() => Math.min(100, Math.max(0, Math.round(props.percent))));
</script>
