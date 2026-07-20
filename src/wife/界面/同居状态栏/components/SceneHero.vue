<template>
  <section class="ios-group scene-hero" aria-labelledby="wife-status-scene-title">
    <h2 id="wife-status-scene-title" class="sr-only">当前场景</h2>
    <div class="scene-hero__row">
      <span class="scene-hero__icon" aria-hidden="true">
        <Icon :name="world.sceneIconName" size="md" />
      </span>
      <div class="scene-hero__text">
        <p class="scene-hero__type">{{ world.sceneType }}</p>
        <p id="wife-status-scene-place" class="scene-hero__place">{{ world.scene }}</p>
      </div>
    </div>
    <div v-if="relation.outfitChips.length" class="chips-scroll-x scene-hero__chips" role="list" aria-label="穿着">
      <span v-for="(chip, i) in relation.outfitChips" :key="i" class="ios-chip" role="listitem">{{ chip }}</span>
    </div>
  </section>
</template>

<script setup lang="ts">
import { Icon } from './icons';
import { useMvuSlices } from '../composables/useMvuSlices';

const { worldSlice: world, relationSlice: relation } = useMvuSlices();
</script>

<style scoped>
.scene-hero {
  padding: 10px 12px;
}

.scene-hero__row {
  display: flex;
  gap: 8px;
  align-items: flex-start;
}

.scene-hero__icon {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: var(--c-fill);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--c-accent-wallet);
  flex-shrink: 0;
  transition: background var(--duration-fast) var(--ease-ios);
}

.scene-hero__type {
  font-size: 11px;
  color: var(--c-label-secondary);
  margin-bottom: 2px;
}

.scene-hero__place {
  font-size: 13px;
  font-weight: 600;
  line-height: 1.35;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.scene-hero__chips {
  margin-top: 8px;
}
</style>
