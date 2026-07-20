<template>
  <Teleport to="#lf-overlay-root">
    <div class="lf-toasts" aria-live="polite" aria-atomic="false">
      <TransitionGroup name="lf-toast">
        <div
          v-for="toast in ui.toasts"
          :id="`lf-toast-${toast.id}`"
          :key="toast.id"
          class="lf-toast"
          :class="`lf-toast--${toast.kind}`"
          role="status"
        >
          <span class="lf-toast__icon" aria-hidden="true">
            <AppIcon :name="toast.icon ?? 'info'" size="sm" bold />
          </span>
          <div class="lf-toast__body">
            <p class="lf-toast__title">{{ toast.title }}</p>
            <p v-if="toast.message" class="lf-toast__msg">{{ toast.message }}</p>
          </div>
          <button
            type="button"
            class="lf-toast__close"
            aria-label="关闭通知"
            @click="ui.dismissToast(toast.id)"
          >
            <AppIcon name="close" size="xs" bold />
          </button>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import AppIcon from '../base/AppIcon.vue';
import { useUiStore } from '../../stores/useUiStore';

const ui = useUiStore();
</script>

<style scoped lang="scss">
.lf-toasts {
  position: absolute;
  top: 12px;
  left: 12px;
  right: 12px;
  z-index: var(--lf-z-toast);
  display: flex;
  flex-direction: column;
  gap: 8px;
  pointer-events: none;
}
.lf-toast {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 11px 12px;
  border: 2.5px solid var(--lf-ink);
  border-radius: var(--lf-radius-md);
  background: var(--lf-surface);
  box-shadow: var(--lf-shadow-chunky);
  pointer-events: auto;
}
.lf-toast__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  flex-shrink: 0;
  border: 2px solid var(--lf-ink);
  border-radius: var(--lf-radius-pill);
  color: var(--lf-ink);
}
.lf-toast--success .lf-toast__icon { background: var(--lf-success); }
.lf-toast--info .lf-toast__icon { background: var(--lf-info); }
.lf-toast--warning .lf-toast__icon { background: var(--lf-warning); }
.lf-toast--error .lf-toast__icon { background: var(--lf-error); }

.lf-toast__body { flex: 1; min-width: 0; }
.lf-toast__title {
  font-family: var(--lf-font-display);
  font-weight: 700;
  font-size: 14px;
  color: var(--lf-text);
}
.lf-toast__msg {
  margin-top: 2px;
  font-size: 12px;
  color: var(--lf-text-secondary);
  line-height: 1.4;
}
.lf-toast__close {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  flex-shrink: 0;
  border: none;
  border-radius: var(--lf-radius-pill);
  background: transparent;
  color: var(--lf-text-muted);
  transition: background var(--lf-dur), color var(--lf-dur);
}
.lf-toast__close:hover {
  background: var(--lf-surface-sunken);
  color: var(--lf-ink);
}

.lf-toast-enter-active {
  transition: transform var(--lf-dur) var(--lf-ease-bounce), opacity var(--lf-dur);
}
.lf-toast-leave-active {
  transition: transform var(--lf-dur) var(--lf-ease-soft), opacity var(--lf-dur);
  position: absolute;
  left: 0;
  right: 0;
}
.lf-toast-enter-from {
  transform: translateY(-16px) scale(0.92);
  opacity: 0;
}
.lf-toast-leave-to {
  transform: translateX(40px) scale(0.92);
  opacity: 0;
}
.lf-toast-move {
  transition: transform var(--lf-dur) var(--lf-ease-soft);
}
</style>
