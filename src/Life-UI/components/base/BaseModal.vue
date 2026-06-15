<template>
  <Teleport to="#lf-overlay-root">
    <Transition name="lf-modal">
      <div
        v-if="modelValue"
        class="lf-modal"
        :class="`lf-modal--${size}`"
        role="dialog"
        aria-modal="true"
        :aria-label="title"
      >
        <div class="lf-modal__scrim" @click="dismiss" />
        <div class="lf-modal__panel lf-scroll" :class="`lf-modal__panel--${tone}`">
          <header class="lf-modal__head">
            <span v-if="icon" class="lf-modal__badge" aria-hidden="true">
              <AppIcon :name="icon" size="md" />
            </span>
            <div class="lf-modal__titles">
              <h2 class="lf-modal__title">{{ title }}</h2>
              <p v-if="subtitle" class="lf-modal__subtitle">{{ subtitle }}</p>
            </div>
            <button
              v-if="closable"
              :id="`${idBase}-close`"
              type="button"
              class="lf-modal__close"
              aria-label="关闭"
              @click="dismiss"
            >
              <AppIcon name="close" size="sm" bold />
            </button>
          </header>
          <div class="lf-modal__body">
            <slot />
          </div>
          <footer v-if="$slots.footer" class="lf-modal__foot">
            <slot name="footer" />
          </footer>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import AppIcon, { type IconName } from './AppIcon.vue';

const props = withDefaults(
  defineProps<{
    modelValue: boolean;
    title: string;
    subtitle?: string;
    icon?: IconName;
    size?: 'sm' | 'md' | 'lg';
    tone?: 'paper' | 'cream' | 'strawberry' | 'mint' | 'sky' | 'lavender';
    closable?: boolean;
    idBase?: string;
  }>(),
  { size: 'md', tone: 'paper', closable: true, idBase: 'lf-modal' },
);

const emit = defineEmits<{ (e: 'update:modelValue', v: boolean): void; (e: 'close'): void }>();

const idBase = computed(() => props.idBase);

function dismiss() {
  if (!props.closable) return;
  emit('update:modelValue', false);
  emit('close');
}
</script>

<style scoped lang="scss">
.lf-modal {
  position: absolute;
  inset: 0;
  z-index: var(--lf-z-modal);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 18px;
}
.lf-modal__scrim {
  position: absolute;
  inset: 0;
  background: rgba(91, 74, 82, 0.34);
  backdrop-filter: blur(3px);
}
.lf-modal__panel {
  position: relative;
  width: 100%;
  max-height: 86%;
  overflow-y: auto;
  border: var(--lf-outline-bold) solid var(--lf-ink);
  border-radius: var(--lf-radius-xl);
  background: var(--lf-surface);
  box-shadow: var(--lf-shadow-float);
}
.lf-modal__panel--cream { background: var(--lf-surface-soft); }
.lf-modal__panel--strawberry { background: #fde9f1; }
.lf-modal__panel--mint { background: #e7f8f0; }
.lf-modal__panel--sky { background: #e8f4fd; }
.lf-modal__panel--lavender { background: #f1ecfb; }

.lf-modal--sm .lf-modal__panel { max-width: 320px; }
.lf-modal--md .lf-modal__panel { max-width: 400px; }
.lf-modal--lg .lf-modal__panel { max-width: 440px; }

.lf-modal__head {
  position: sticky;
  top: 0;
  z-index: 2;
  display: flex;
  align-items: center;
  gap: 11px;
  padding: 16px 16px 12px;
  background: inherit;
  border-bottom: 2px dashed var(--lf-line-strong);
}
.lf-modal__badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  border: var(--lf-outline) solid var(--lf-ink);
  border-radius: var(--lf-radius-sm);
  background: var(--lf-butter);
  color: var(--lf-ink);
  box-shadow: var(--lf-shadow-chunky-sm);
}
.lf-modal__titles { flex: 1; min-width: 0; }
.lf-modal__title {
  font-size: 18px;
  font-weight: 700;
}
.lf-modal__subtitle {
  margin-top: 2px;
  font-family: var(--lf-font-body);
  font-size: 12px;
  color: var(--lf-text-secondary);
}
.lf-modal__close {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: var(--lf-outline) solid var(--lf-ink);
  border-radius: var(--lf-radius-pill);
  background: var(--lf-surface);
  color: var(--lf-ink);
  transition: transform var(--lf-dur) var(--lf-ease-bounce), background var(--lf-dur);
}
.lf-modal__close:hover {
  background: var(--lf-strawberry);
  transform: rotate(90deg);
}
.lf-modal__body {
  padding: 16px;
}
.lf-modal__foot {
  position: sticky;
  bottom: 0;
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  padding: 12px 16px;
  background: inherit;
  border-top: 2px dashed var(--lf-line-strong);
}

// —— 过渡 ——
.lf-modal-enter-active .lf-modal__panel {
  animation: lf-pop-in var(--lf-dur) var(--lf-ease-bounce);
}
.lf-modal-enter-active,
.lf-modal-leave-active {
  transition: opacity var(--lf-dur) var(--lf-ease-soft);
}
.lf-modal-enter-from,
.lf-modal-leave-to {
  opacity: 0;
}
.lf-modal-leave-active .lf-modal__panel {
  transition: transform var(--lf-dur) var(--lf-ease-soft);
  transform: scale(0.92);
}
</style>
