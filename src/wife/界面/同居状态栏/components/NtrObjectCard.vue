<template>
  <article v-if="obj" id="wife-status-ntr-object" class="ntr-card">
    <header class="ntr-card__header">
      <h3 class="ntr-card__title">
        <Icon name="users" size="sm" />
        {{ obj.name }}
      </h3>
      <span class="ios-chip">{{ obj.prototypeLabel }}</span>
    </header>
    <dl class="ntr-card__meta">
      <div class="ntr-card__row">
        <dt>熟悉度</dt>
        <dd>
          <MeterBar :value="obj.familiarity" color="var(--c-ntr-cross)" />
          <span>{{ obj.familiarity }}</span>
        </dd>
      </div>
    </dl>
  </article>
</template>

<script setup lang="ts">
import { Icon } from './icons';
import MeterBar from './ui/MeterBar.vue';
import { useMvuSlices } from '../composables/useMvuSlices';

const { ntrObjectSlice: obj } = useMvuSlices();
</script>

<style scoped>
.ntr-card {
  margin-top: 14px;
  padding: 10px 12px;
  border-radius: 10px;
  background: var(--c-fill);
}

.ntr-card__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 8px;
}

.ntr-card__title {
  font-size: 14px;
  font-weight: 700;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.ntr-card__meta {
  margin: 0;
}

.ntr-card__row {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.ntr-card__row dt {
  font-size: 11px;
  color: var(--c-label-secondary);
}

.ntr-card__row dd {
  margin: 0;
  font-size: 13px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
}

.ntr-card__row dd :deep(.meter-bar) {
  flex: 1;
}
</style>
