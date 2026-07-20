import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { IconName } from '../components/base/AppIcon.vue';

export type ToastKind = 'success' | 'info' | 'warning' | 'error';

export interface ToastItem {
  id: number;
  kind: ToastKind;
  title: string;
  message?: string;
  icon?: IconName;
}

export interface ConfirmRequest {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  tone?: 'primary' | 'danger';
  icon?: IconName;
}

let toastSeq = 0;

export const useUiStore = defineStore('lf-ui', () => {
  // —— 应用内通知 ——
  const toasts = ref<ToastItem[]>([]);

  function pushToast(item: Omit<ToastItem, 'id'>, duration = 3200) {
    const id = ++toastSeq;
    toasts.value.push({ ...item, id });
    if (duration > 0) {
      window.setTimeout(() => dismissToast(id), duration);
    }
    return id;
  }
  function dismissToast(id: number) {
    const idx = toasts.value.findIndex(t => t.id === id);
    if (idx !== -1) toasts.value.splice(idx, 1);
  }

  // —— 应用内确认框 ——
  const confirmState = ref<ConfirmRequest | null>(null);
  let confirmResolver: ((ok: boolean) => void) | null = null;

  function requestConfirm(req: ConfirmRequest): Promise<boolean> {
    confirmState.value = req;
    return new Promise<boolean>(resolve => {
      confirmResolver = resolve;
    });
  }
  function resolveConfirm(ok: boolean) {
    confirmResolver?.(ok);
    confirmResolver = null;
    confirmState.value = null;
  }

  // —— 全局模态/面板开关 ——
  const statusPanelOpen = ref(false);
  const characterCardId = ref<string | null>(null);
  const dataPanelOpen = ref(false);
  const saveManagerOpen = ref(false);
  const settingsOpen = ref(false);

  function openCharacterCard(id: string) {
    characterCardId.value = id;
  }
  function closeCharacterCard() {
    characterCardId.value = null;
  }
  function toggleStatusPanel(force?: boolean) {
    statusPanelOpen.value = force ?? !statusPanelOpen.value;
  }

  return {
    toasts,
    pushToast,
    dismissToast,
    confirmState,
    requestConfirm,
    resolveConfirm,
    statusPanelOpen,
    characterCardId,
    dataPanelOpen,
    saveManagerOpen,
    settingsOpen,
    openCharacterCard,
    closeCharacterCard,
    toggleStatusPanel,
  };
});
