<template>
  <div class="lf-choices" role="group" aria-label="可选回应">
    <button
      v-for="(choice, i) in choices"
      :id="`lf-choice-${choice.id}`"
      :key="choice.id"
      type="button"
      class="lf-choice"
      :class="`lf-choice--${choice.tone ?? 'strawberry'}`"
      :style="{ animationDelay: `${i * 70}ms` }"
      :disabled="disabled"
      @click="$emit('pick', choice)"
    >
      <span class="lf-choice__index" aria-hidden="true">{{ String.fromCharCode(65 + i) }}</span>
      <span class="lf-choice__text">{{ choice.text }}</span>
      <span v-if="choice.hint" class="lf-choice__hint">{{ choice.hint }}</span>
      <span class="lf-choice__arrow" aria-hidden="true"><AppIcon name="chevron-right" size="sm" bold /></span>
    </button>
  </div>
</template>

<script setup lang="ts">
import AppIcon from '../base/AppIcon.vue';
import type { DialogueChoice } from '../../types';

defineProps<{ choices: DialogueChoice[]; disabled?: boolean }>();
defineEmits<{ (e: 'pick', choice: DialogueChoice): void }>();
</script>

<style scoped lang="scss">
.lf-choices {
  display: flex;
  flex-direction: column;
  gap: 9px;
}
.lf-choice {
  position: relative;
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 12px 12px;
  border: 2.5px solid var(--lf-ink);
  border-radius: var(--lf-radius-lg);
  background: var(--lf-surface);
  text-align: left;
  box-shadow: var(--lf-shadow-chunky-sm);
  animation: lf-pop-in var(--lf-dur) var(--lf-ease-bounce) both;
  transition: transform var(--lf-dur) var(--lf-ease-bounce), box-shadow var(--lf-dur) var(--lf-ease-out), background var(--lf-dur);
}
.lf-choice:hover:not(:disabled) {
  transform: translate(-2px, -2px);
  box-shadow: var(--lf-shadow-chunky);
}
.lf-choice:hover:not(:disabled) .lf-choice__arrow { transform: translateX(3px); }
.lf-choice:active:not(:disabled) {
  transform: translate(1px, 1px);
  box-shadow: var(--lf-shadow-chunky-sm);
}
.lf-choice:disabled { opacity: 0.5; cursor: not-allowed; }

.lf-choice--strawberry:hover:not(:disabled) { background: #fde4ee; }
.lf-choice--mint:hover:not(:disabled) { background: #e2f7ee; }
.lf-choice--sky:hover:not(:disabled) { background: #e3f3fd; }
.lf-choice--lavender:hover:not(:disabled) { background: #efe9fb; }
.lf-choice--peach:hover:not(:disabled) { background: #ffe8da; }

.lf-choice__index {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  flex-shrink: 0;
  border: 2.5px solid var(--lf-ink);
  border-radius: var(--lf-radius-pill);
  font-family: var(--lf-font-display);
  font-weight: 700;
  font-size: 13px;
  color: var(--lf-ink);
}
.lf-choice--strawberry .lf-choice__index { background: var(--lf-strawberry); }
.lf-choice--mint .lf-choice__index { background: var(--lf-mint); }
.lf-choice--sky .lf-choice__index { background: var(--lf-sky); }
.lf-choice--lavender .lf-choice__index { background: var(--lf-lavender); }
.lf-choice--peach .lf-choice__index { background: var(--lf-peach); }

.lf-choice__text {
  flex: 1;
  min-width: 0;
  font-size: 13.5px;
  font-weight: 600;
  line-height: 1.45;
  color: var(--lf-text);
}
.lf-choice__hint {
  flex-shrink: 0;
  padding: 2px 8px;
  border: 1.5px solid var(--lf-line-strong);
  border-radius: var(--lf-radius-pill);
  font-size: 10px;
  font-weight: 700;
  color: var(--lf-text-secondary);
  background: var(--lf-surface-soft);
}
.lf-choice__arrow {
  display: inline-flex;
  color: var(--lf-text-muted);
  transition: transform var(--lf-dur) var(--lf-ease-bounce);
}
</style>
