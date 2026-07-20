export interface GameOption {
  id: string;
  text: string;
}

export interface UiSettings {
  theme: 'light' | 'dark';
  motionEnabled: boolean;
  fontScale: 'sm' | 'md' | 'lg';
  /** 隐藏酒馆楼层内已被界面接管的原始 XML/纯文本 */
  hideChatRawText: boolean;
}

export type ToastType = 'success' | 'warning' | 'error' | 'info';

export interface ToastItem {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
}

export interface AlertDialogState {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
}

export interface ConfirmDialogState {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm?: () => void;
}
