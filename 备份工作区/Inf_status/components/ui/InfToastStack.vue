<template>
  <Teleport to="#app">
    <div id="inf-toast-stack" class="inf-toast-stack" aria-live="polite" aria-relevant="additions">
      <TransitionGroup name="inf-toast">
        <article
          v-for="toast in ui.toasts"
          :key="toast.id"
          :id="toast.id"
          class="inf-toast inf-glass-strong"
          :class="`inf-toast--${toast.type}`"
          role="status"
        >
          <div class="inf-toast__accent" aria-hidden="true" />
          <InfIcon :name="iconFor(toast.type)" size="md" class="inf-toast__icon" />
          <div class="inf-toast__body">
            <h3 class="inf-toast__title">{{ toast.title }}</h3>
            <p v-if="toast.message" class="inf-toast__message">{{ toast.message }}</p>
          </div>
          <button
            :id="`${toast.id}-close`"
            type="button"
            class="inf-toast__close"
            aria-label="关闭通知"
            @click="ui.dismissToast(toast.id)"
          >
            <InfIcon name="close" size="sm" />
          </button>
          <div
            v-if="toast.duration && toast.duration > 0"
            class="inf-toast__progress"
            :style="{ animationDuration: `${toast.duration}ms` }"
            aria-hidden="true"
          />
        </article>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { useUiStore } from '../../stores/useUiStore';
import type { ToastType } from '../../types/game.types';
import InfIcon from './InfIcon.vue';

const ui = useUiStore();

function iconFor(type: ToastType) {
  const map: Record<ToastType, string> = {
    success: 'check',
    warning: 'warning',
    error: 'warning',
    info: 'info',
  };
  return map[type];
}
</script>

<style scoped lang="scss">
.inf-toast-stack {
  position: fixed;
  top: 1rem;
  right: 1rem;
  z-index: 9000;
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
  width: min(380px, calc(100% - 2rem));
  pointer-events: none;
}

.inf-toast {
  position: relative;
  display: flex;
  align-items: flex-start;
  gap: 0.625rem;
  padding: 0.95rem 1rem 1.05rem;
  border-radius: var(--inf-radius-md);
  pointer-events: auto;
  overflow: hidden;
  box-shadow: var(--inf-shadow-md);
}

.inf-toast__accent {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 3px;
  background: var(--inf-info);
}

.inf-toast--success .inf-toast__accent {
  background: var(--inf-success);
}

.inf-toast--warning .inf-toast__accent {
  background: var(--inf-warning);
}

.inf-toast--error .inf-toast__accent {
  background: var(--inf-error);
}

.inf-toast--info .inf-toast__accent {
  background: var(--inf-info);
}

.inf-toast__icon {
  margin-top: 0.125rem;
  color: var(--inf-text-secondary);
}

.inf-toast__body {
  flex: 1;
  min-width: 0;
}

.inf-toast__title {
  margin: 0;
  font-size: 0.875rem;
  font-weight: 600;
  letter-spacing: 0.01em;
}

.inf-toast__message {
  margin: 0.25rem 0 0;
  font-size: 0.8125rem;
  line-height: 1.5;
  color: var(--inf-text-secondary);
}

.inf-toast__close {
  display: flex;
  padding: 0.3rem;
  color: var(--inf-text-muted);
  background: transparent;
  border: none;
  border-radius: var(--inf-radius-xs);
  cursor: pointer;
  transition:
    background var(--inf-transition),
    color var(--inf-transition);

  &:hover {
    color: var(--inf-text);
    background: var(--inf-accent-soft);
  }

  &:focus-visible {
    outline: 2px solid var(--inf-accent);
    outline-offset: 2px;
  }
}

.inf-toast__progress {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 2px;
  background: linear-gradient(90deg, var(--inf-accent), var(--inf-tier-accent-strong));
  transform-origin: left center;
  animation: inf-toast-progress linear forwards;
}
</style>
