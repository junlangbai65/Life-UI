<template>
  <section class="ios-group wallet-row" aria-labelledby="wife-status-wallet-title">
    <h2 id="wife-status-wallet-title" class="sr-only">生活费</h2>
    <div class="wallet-row__inner">
      <span class="wallet-row__icon" aria-hidden="true">
        <Icon name="wallet" size="md" />
      </span>
      <div class="wallet-row__content">
        <div class="wallet-row__top">
          <span class="wallet-row__label">{{ userName }}</span>
          <span id="wife-status-wallet-amount" class="wallet-row__amount">¥ {{ animatedFunds }}</span>
        </div>
        <MeterBar
          :value="economy.ratio"
          color="var(--c-accent-wallet)"
          height="thin"
          glow
        />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { Icon } from './icons';
import MeterBar from './ui/MeterBar.vue';
import { useAnimatedNumber } from '../composables/useValueAnimation';
import { useMvuSlices } from '../composables/useMvuSlices';

const { economySlice: economy, userName } = useMvuSlices();

const animatedFunds = useAnimatedNumber(() => economy.value.funds);
</script>

<style scoped>
.wallet-row {
  margin-bottom: 8px;
  padding: 10px 12px;
}

.wallet-row__inner {
  display: flex;
  align-items: center;
  gap: 10px;
}

.wallet-row__icon {
  color: var(--c-accent-wallet);
  flex-shrink: 0;
}

.wallet-row__content {
  flex: 1;
  min-width: 0;
}

.wallet-row__top {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 6px;
}

.wallet-row__label {
  font-size: 12px;
  color: var(--c-label-secondary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.wallet-row__amount {
  font-size: 15px;
  font-weight: 700;
  color: var(--c-accent-wallet);
  flex-shrink: 0;
}
</style>
