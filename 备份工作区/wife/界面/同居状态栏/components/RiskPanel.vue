<template>
  <dl class="risk-panel">
    <div class="risk-panel__row">
      <dt class="risk-panel__label">
        <Icon name="alert-circle" size="sm" />
        性欲
      </dt>
      <dd class="risk-panel__value">
        <span id="wife-status-libido">{{ libidoDisplay }}</span>
        <MeterBar :value="risk.libido" color="var(--c-ntr-warn)" />
      </dd>
    </div>
    <div class="risk-panel__row">
      <dt class="risk-panel__label">
        <Icon name="crosshair" size="sm" />
        堕落
      </dt>
      <dd class="risk-panel__value">
        <span id="wife-status-corruption">{{ corruptionDisplay }}</span>
        <MeterBar :value="risk.corruption" color="var(--c-ntr-cross)" />
      </dd>
    </div>
    <div class="risk-panel__row">
      <dt class="risk-panel__label">
        <Icon name="eye-off" size="sm" />
        暴露
      </dt>
      <dd class="risk-panel__value">
        <span id="wife-status-exposure">{{ exposureDisplay }}</span>
        <MeterBar :value="risk.exposure" color="var(--c-ntr-expose)" />
      </dd>
    </div>
    <div class="risk-panel__ntr">
      <span class="risk-panel__label">NTR</span>
      <div id="wife-status-ntr-steps" class="ntr-steps" role="list" aria-label="NTR阶段">
        <span
          v-for="(name, i) in stageNames"
          :key="name"
          role="listitem"
          class="ntr-steps__item"
          :class="{ 'ntr-steps__item--active': i <= risk.ntrStage, 'ntr-steps__item--current': i === risk.ntrStage }"
          :style="i <= risk.ntrStage ? { '--step-color': stageColors[i] } : undefined"
          :title="name"
        >
          <Icon :name="stageIcons[i]" size="sm" />
        </span>
      </div>
    </div>
    <div v-if="risk.ntrCooldown > 0" class="ios-row ios-row--compact">
      <span class="ios-row-label">
        <Icon name="shield" size="sm" />
        冷却
      </span>
      <span id="wife-status-ntr-cooldown" class="ios-row-value">{{ risk.ntrCooldown }} 天</span>
    </div>
  </dl>
  <Transition name="fade">
    <NtrObjectCard v-if="ntrObject" />
  </Transition>
</template>

<script setup lang="ts">
import { Icon, NTR_STAGE_ICONS } from './icons';
import MeterBar from './ui/MeterBar.vue';
import { useAnimatedNumber } from '../composables/useValueAnimation';
import { useMvuSlices } from '../composables/useMvuSlices';
import NtrObjectCard from './NtrObjectCard.vue';

const { riskSlice: risk, ntrObjectSlice: ntrObject } = useMvuSlices();

const stageNames = ['安全', '预警', '越界', '暴露'];
const stageIcons = NTR_STAGE_ICONS;
const stageColors = ['var(--c-ntr-safe)', 'var(--c-ntr-warn)', 'var(--c-ntr-cross)', 'var(--c-ntr-expose)'];

const libidoDisplay = useAnimatedNumber(() => risk.value.libido);
const corruptionDisplay = useAnimatedNumber(() => risk.value.corruption);
const exposureDisplay = useAnimatedNumber(() => risk.value.exposure);
</script>

<style scoped>
.risk-panel {
  margin: 0;
}

.risk-panel__row {
  margin-bottom: 12px;
}

.risk-panel__label {
  font-size: 12px;
  color: var(--c-label-secondary);
  margin-bottom: 4px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.risk-panel__value {
  margin: 0;
  font-size: 15px;
  font-weight: 600;
}

.risk-panel__value :deep(.meter-bar) {
  margin-top: 6px;
}

.risk-panel__ntr {
  margin-top: 14px;
}

.ntr-steps {
  display: flex;
  gap: 4px;
  margin-top: 8px;
}

.ntr-steps__item {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 32px;
  border-radius: 6px;
  background: var(--c-fill);
  color: var(--c-label-secondary);
  transition:
    background var(--duration-fast) var(--ease-ios),
    color var(--duration-fast) var(--ease-ios),
    box-shadow var(--duration-fast) var(--ease-ios);
}

.ntr-steps__item--active {
  background: color-mix(in srgb, var(--step-color, var(--c-ntr-safe)) 22%, transparent);
  color: var(--c-label);
}

.ntr-steps__item--current {
  box-shadow: inset 0 0 0 1.5px var(--step-color, var(--c-ntr-safe));
}
</style>
