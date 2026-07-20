import type { IconName } from '../components/base/AppIcon.vue';
import { useUiStore, type ConfirmRequest, type ToastKind } from '../stores/useUiStore';

const defaultIcons: Record<ToastKind, IconName> = {
  success: 'check',
  info: 'info',
  warning: 'warning',
  error: 'error',
};

/**
 * 应用内通知 / 确认（替代外部 toastr 与 window.confirm）。
 */
export function useNotify() {
  const ui = useUiStore();

  function notify(kind: ToastKind, title: string, message?: string, icon?: IconName) {
    return ui.pushToast({ kind, title, message, icon: icon ?? defaultIcons[kind] });
  }

  return {
    success: (title: string, message?: string) => notify('success', title, message),
    info: (title: string, message?: string) => notify('info', title, message),
    warning: (title: string, message?: string) => notify('warning', title, message),
    error: (title: string, message?: string) => notify('error', title, message),
    confirm: (req: ConfirmRequest) => ui.requestConfirm(req),
  };
}
