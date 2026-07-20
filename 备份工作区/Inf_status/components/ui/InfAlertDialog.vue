<template>
  <dialog
    id="inf-alert-dialog"
    ref="dialogEl"
    class="inf-dialog-shell"
    @close="ui.closeAlert()"
  >
    <div class="inf-dialog-panel inf-glass-strong">
      <header class="inf-dialog__header">
        <span class="inf-dialog__icon-wrap inf-dialog__icon-wrap--info">
          <InfIcon name="info" size="lg" />
        </span>
        <div>
          <span class="inf-label">System Notice</span>
          <h2 id="inf-alert-dialog-title" class="inf-display inf-dialog__title">{{ ui.alertDialog.title }}</h2>
        </div>
      </header>
      <p id="inf-alert-dialog-message" class="inf-dialog__message">{{ ui.alertDialog.message }}</p>
      <footer class="inf-dialog__footer">
        <button
          id="inf-alert-dialog-confirm"
          type="button"
          class="inf-btn inf-btn--primary"
          @click="close"
        >
          {{ ui.alertDialog.confirmLabel ?? '知道了' }}
        </button>
      </footer>
    </div>
  </dialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useUiStore } from '../../stores/useUiStore';
import InfIcon from './InfIcon.vue';

const ui = useUiStore();
const dialogEl = ref<HTMLDialogElement | null>(null);

watch(
  () => ui.alertDialog.open,
  open => {
    if (open) dialogEl.value?.showModal();
    else if (dialogEl.value?.open) dialogEl.value.close();
  },
);

function close() {
  dialogEl.value?.close();
  ui.closeAlert();
}
</script>

<style scoped lang="scss">
.inf-dialog__header {
  display: flex;
  align-items: flex-start;
  gap: 0.875rem;
  margin-bottom: 0.875rem;
}

.inf-dialog__icon-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius: var(--inf-radius-sm);
  flex-shrink: 0;

  &--info {
    color: var(--inf-info);
    background: color-mix(in srgb, var(--inf-info) 12%, transparent);
  }
}

.inf-dialog__title {
  margin: 0.15rem 0 0;
  font-size: 1.35rem;
  line-height: 1.2;
}

.inf-dialog__message {
  margin: 0 0 1.35rem;
  font-size: 0.9375rem;
  line-height: 1.65;
  color: var(--inf-text-secondary);
}

.inf-dialog__footer {
  display: flex;
  justify-content: flex-end;
}
</style>
