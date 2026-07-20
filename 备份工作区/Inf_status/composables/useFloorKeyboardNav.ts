import { onMounted, onUnmounted } from 'vue';
import { useGameStore } from '../stores/useGameStore';
import { useUiStore } from '../stores/useUiStore';

function isEditableTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  const tag = target.tagName;
  if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return true;
  return target.isContentEditable;
}

function isModalOpen(ui: ReturnType<typeof useUiStore>): boolean {
  return ui.alertDialog.open || ui.confirmDialog.open;
}

/** 左右方向键切换 assistant 楼层（输入框聚焦或弹窗打开时不响应） */
export function useFloorKeyboardNav() {
  const game = useGameStore();
  const ui = useUiStore();

  function onKeyDown(event: KeyboardEvent) {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
    if (event.altKey || event.ctrlKey || event.metaKey) return;
    if (isModalOpen(ui) || isEditableTarget(event.target)) return;

    if (event.key === 'ArrowLeft') {
      if (!game.floorNavCanPrev) return;
      event.preventDefault();
      game.navigateFloorPrev();
      return;
    }

    if (!game.floorNavCanNext) return;
    event.preventDefault();
    game.navigateFloorNext();
  }

  onMounted(() => {
    window.addEventListener('keydown', onKeyDown);
  });

  onUnmounted(() => {
    window.removeEventListener('keydown', onKeyDown);
  });
}
