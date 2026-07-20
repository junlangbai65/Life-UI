<template>
  <dl class="intimate-panel">
    <div class="ios-row ios-row--interactive ios-row--compact">
      <dt class="ios-row-label">
        <Icon name="circle" size="sm" />
        处女
      </dt>
      <dd id="wife-status-virgin" class="ios-row-value">{{ intimate.isVirgin ? '是' : '否' }}</dd>
    </div>
    <div class="ios-row ios-row--interactive ios-row--compact">
      <dt class="ios-row-label">
        <Icon name="user" size="sm" />
        破处
      </dt>
      <dd id="wife-status-virginity-to" class="ios-row-value">{{ intimate.virginityTo }}</dd>
    </div>
    <div class="ios-row ios-row--interactive ios-row--compact">
      <dt class="ios-row-label">
        <Icon name="heart-handshake" size="sm" />
        user
      </dt>
      <dd id="wife-status-sex-user" class="ios-row-value">{{ intimate.sexWithUser }}</dd>
    </div>
    <div class="ios-row ios-row--interactive ios-row--compact">
      <dt class="ios-row-label">
        <Icon name="alert-octagon" size="sm" />
        越界
      </dt>
      <dd id="wife-status-sex-ntr" class="ios-row-value">{{ intimate.sexNtr }}</dd>
    </div>
    <div class="intimate-panel__fluid ios-row ios-row--compact">
      <dt class="ios-row-label">
        <Icon name="droplet" size="sm" />
        痕迹
      </dt>
      <dd id="wife-status-fluid-trace" class="intimate-panel__meter">
        <MeterBar :value="intimate.fluidTrace" color="var(--c-label-secondary)" />
      </dd>
    </div>
  </dl>
</template>

<script setup lang="ts">
import { Icon } from './icons';
import MeterBar from './ui/MeterBar.vue';
import { useMvuSlices } from '../composables/useMvuSlices';

const { intimateSlice: intimate } = useMvuSlices();
</script>

<style scoped>
.intimate-panel {
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.intimate-panel__fluid {
  flex-direction: column;
  align-items: stretch;
  gap: 6px;
}

.intimate-panel__meter {
  margin: 0;
  width: 100%;
}
</style>
