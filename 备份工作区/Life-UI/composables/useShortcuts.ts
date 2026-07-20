import { onMounted, onUnmounted } from 'vue';

export interface ShortcutMap {
  [key: string]: (e: KeyboardEvent) => void;
}

/**
 * 注册键盘快捷键（视角切换等）。输入框聚焦时自动忽略，避免打字误触。
 */
export function useShortcuts(map: ShortcutMap) {
  function handler(e: KeyboardEvent) {
    const target = e.target as HTMLElement | null;
    if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) {
      return;
    }
    const fn = map[e.key.toLowerCase()] ?? map[e.key];
    if (fn) {
      fn(e);
    }
  }

  onMounted(() => window.addEventListener('keydown', handler));
  onUnmounted(() => window.removeEventListener('keydown', handler));
}
