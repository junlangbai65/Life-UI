<template>
  <div class="lf-thinking" role="status" aria-label="对方正在回应">
    <CharacterAvatar :id="speaker" size="sm" ring :ring-color="color" />
    <div class="lf-thinking__bubble">
      <span class="lf-thinking__dot" />
      <span class="lf-thinking__dot" />
      <span class="lf-thinking__dot" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import CharacterAvatar from '../base/CharacterAvatar.vue';
import { getCharacter } from '../../data/characters';
import type { CharacterId } from '../../types';

const props = withDefaults(defineProps<{ speaker?: CharacterId }>(), { speaker: 'qinghe' });
const color = computed(() => getCharacter(props.speaker)?.color ?? 'var(--lf-strawberry)');
</script>

<style scoped lang="scss">
.lf-thinking {
  display: flex;
  align-items: center;
  gap: 8px;
  animation: lf-pop-in var(--lf-dur) var(--lf-ease-bounce);
}
.lf-thinking__bubble {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 13px 16px;
  border: 2.5px solid var(--lf-ink);
  border-radius: var(--lf-radius-lg);
  border-top-left-radius: 6px;
  background: var(--lf-surface);
  box-shadow: var(--lf-shadow-chunky-sm);
}
.lf-thinking__dot {
  width: 8px;
  height: 8px;
  border-radius: var(--lf-radius-pill);
  background: var(--lf-strawberry-deep);
  animation: lf-think 1.2s ease-in-out infinite;
}
.lf-thinking__dot:nth-child(2) { animation-delay: 0.18s; }
.lf-thinking__dot:nth-child(3) { animation-delay: 0.36s; }

@keyframes lf-think {
  0%, 60%, 100% { transform: translateY(0); opacity: 0.5; }
  30% { transform: translateY(-6px); opacity: 1; }
}
</style>
