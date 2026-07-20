<template>
  <dialog
    id="inf-confirm-dialog"
    ref="dialogEl"
    class="inf-dialog-shell"
    @close="onNativeClose"
  >
    <div class="inf-dialog-panel inf-glass-strong">
      <header class="inf-dialog__header">
        <span class="inf-dialog__icon-wrap inf-dialog__icon-wrap--warn">
          <InfIcon name="warning" size="lg" />
        </span>
        <div>
          <span class="inf-label">Confirm Action</span>
          <h2 id="inf-confirm-dialog-title" class="inf-display inf-dialog__title">{{ ui.confirmDialog.title }}</h2>
        </div>
      </header>
      <p id="inf-confirm-dialog-message" class="inf-dialog__message">{{ ui.confirmDialog.message }}</p>
      <footer class="inf-dialog__footer inf-dialog__footer--split">
        <button
          id="inf-confirm-dialog-cancel"
          type="button"
          class="inf-btn inf-btn--ghost"
          @click="close(false)"
        >
          {{ ui.confirmDialog.cancelLabel ?? '取消' }}
        </button>
        <button
          id="inf-confirm-dialog-confirm"
          type="button"
          class="inf-btn inf-btn--primary"
          @click="close(true)"
        >
          {{ ui.confirmDialog.confirmLabel ?? '确认' }}
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
let confirmed = false;

watch(
  () => ui.confirmDialog.open,
  open => {
    if (open) {
      confirmed = false;
      dialogEl.value?.showModal();
    } else if (dialogEl.value?.open) {
      dialogEl.value.close();
    }
  },
);

function close(value: boolean) {
  confirmed = value;
  dialogEl.value?.close();
  ui.closeConfirm(value);
}

function onNativeClose() {
  if (!confirmed) ui.closeConfirm(false);
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

  &--warn {
    color: var(--inf-warning);
    background: color-mix(in srgb, var(--inf-warning) 12%, transparent);
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
  gap: 0.5rem;

  &--split {
    justify-content: space-between;
  }
}
</style>
