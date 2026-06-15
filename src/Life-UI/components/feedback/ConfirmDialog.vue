<template>
  <Teleport to="#lf-overlay-root">
    <Transition name="lf-confirm">
      <div v-if="ui.confirmState" class="lf-confirm" role="alertdialog" aria-modal="true" :aria-label="ui.confirmState.title">
        <div class="lf-confirm__scrim" @click="resolve(false)" />
        <div class="lf-confirm__panel" :class="`lf-confirm__panel--${ui.confirmState.tone ?? 'primary'}`">
          <span class="lf-confirm__icon" aria-hidden="true">
            <AppIcon :name="ui.confirmState.icon ?? (ui.confirmState.tone === 'danger' ? 'warning' : 'info')" size="lg" bold />
          </span>
          <h2 class="lf-confirm__title">{{ ui.confirmState.title }}</h2>
          <p class="lf-confirm__msg">{{ ui.confirmState.message }}</p>
          <div class="lf-confirm__actions">
            <ClayButton id="lf-confirm-cancel" variant="ghost" size="sm" @click="resolve(false)">
              {{ ui.confirmState.cancelText ?? '取消' }}
            </ClayButton>
            <ClayButton
              id="lf-confirm-ok"
              :variant="ui.confirmState.tone === 'danger' ? 'danger' : 'primary'"
              size="sm"
              @click="resolve(true)"
            >
              {{ ui.confirmState.confirmText ?? '确定' }}
            </ClayButton>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import AppIcon from '../base/AppIcon.vue';
import ClayButton from '../base/ClayButton.vue';
import { useUiStore } from '../../stores/useUiStore';

const ui = useUiStore();

function resolve(ok: boolean) {
  ui.resolveConfirm(ok);
}
</script>

<style scoped lang="scss">
.lf-confirm {
  position: absolute;
  inset: 0;
  z-index: var(--lf-z-toast);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
}
.lf-confirm__scrim {
  position: absolute;
  inset: 0;
  background: rgba(91, 74, 82, 0.38);
  backdrop-filter: blur(3px);
}
.lf-confirm__panel {
  position: relative;
  width: 100%;
  max-width: 300px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 8px;
  padding: 22px 20px 18px;
  border: 3px solid var(--lf-ink);
  border-radius: var(--lf-radius-xl);
  background: var(--lf-surface);
  box-shadow: var(--lf-shadow-float);
}
.lf-confirm__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  border: 3px solid var(--lf-ink);
  border-radius: var(--lf-radius-pill);
  background: var(--lf-butter);
  color: var(--lf-ink);
  box-shadow: var(--lf-shadow-chunky);
  transform: rotate(-4deg);
}
.lf-confirm__panel--danger .lf-confirm__icon {
  background: var(--lf-error);
  color: #fff;
}
.lf-confirm__title {
  font-size: 18px;
  font-weight: 700;
}
.lf-confirm__msg {
  font-size: 13px;
  line-height: 1.6;
  color: var(--lf-text-secondary);
}
.lf-confirm__actions {
  display: flex;
  gap: 10px;
  margin-top: 8px;
}

.lf-confirm-enter-active .lf-confirm__panel {
  animation: lf-pop-in var(--lf-dur) var(--lf-ease-bounce);
}
.lf-confirm-enter-active,
.lf-confirm-leave-active {
  transition: opacity var(--lf-dur) var(--lf-ease-soft);
}
.lf-confirm-enter-from,
.lf-confirm-leave-to {
  opacity: 0;
}
</style>
