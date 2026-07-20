import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { AlertDialogState, ConfirmDialogState, ToastItem, ToastType } from '../types/game.types';

let toastSeq = 0;

export const useUiStore = defineStore('inf-ui', () => {
  const toasts = ref<ToastItem[]>([]);
  const alertDialog = ref<AlertDialogState>({
    open: false,
    title: '',
    message: '',
    confirmLabel: '知道了',
  });
  const confirmDialog = ref<ConfirmDialogState>({
    open: false,
    title: '',
    message: '',
    confirmLabel: '确认',
    cancelLabel: '取消',
  });
  const isGenerating = ref(false);
  const composeText = ref('');

  function pushToast(type: ToastType, title: string, message?: string, duration = 4200) {
    const id = `inf-toast-${++toastSeq}`;
    toasts.value.push({ id, type, title, message, duration });
    if (duration > 0) {
      window.setTimeout(() => dismissToast(id), duration);
    }
    return id;
  }

  function dismissToast(id: string) {
    toasts.value = toasts.value.filter(t => t.id !== id);
  }

  function showAlert(title: string, message: string, confirmLabel = '知道了') {
    alertDialog.value = { open: true, title, message, confirmLabel };
  }

  function closeAlert() {
    alertDialog.value.open = false;
  }

  function showConfirm(
    title: string,
    message: string,
    onConfirm: () => void,
    confirmLabel = '确认',
    cancelLabel = '取消',
  ) {
    confirmDialog.value = { open: true, title, message, confirmLabel, cancelLabel, onConfirm };
  }

  function closeConfirm(confirmed: boolean) {
    if (confirmed && confirmDialog.value.onConfirm) {
      confirmDialog.value.onConfirm();
    }
    confirmDialog.value.open = false;
    confirmDialog.value.onConfirm = undefined;
  }

  function simulateGenerate() {
    isGenerating.value = true;
    window.setTimeout(() => {
      isGenerating.value = false;
      pushToast('info', '原型模式', '尚未连接 LLM 生成接口，当前为前端演示。');
    }, 2800);
  }

  return {
    toasts,
    alertDialog,
    confirmDialog,
    isGenerating,
    composeText,
    pushToast,
    dismissToast,
    showAlert,
    closeAlert,
    showConfirm,
    closeConfirm,
    simulateGenerate,
  };
});

export function useToast() {
  const ui = useUiStore();
  return {
    success: (title: string, message?: string) => ui.pushToast('success', title, message),
    warning: (title: string, message?: string) => ui.pushToast('warning', title, message),
    error: (title: string, message?: string) => ui.pushToast('error', title, message),
    info: (title: string, message?: string) => ui.pushToast('info', title, message),
  };
}

export function useDialog() {
  const ui = useUiStore();
  return {
    alert: ui.showAlert,
    confirm: ui.showConfirm,
  };
}
