import { debounce } from 'lodash';
import type { GothState } from './useGothState';

/**
 * 挂载酒馆事件：消息更新后刷新叙事文本与 MVU 补丁
 */
export function attachGothTavernListeners(state: GothState): () => void {
  const refresh = debounce(() => {
    void state.refreshFromTavern();
  }, 400);

  const u = eventOn(tavern_events.MESSAGE_UPDATED, () => {
    refresh();
  });
  const r = eventOn(tavern_events.MESSAGE_RECEIVED, () => {
    refresh();
  });
  const c = eventOn(tavern_events.CHAT_CHANGED, () => {
    state.resetFloorNavigation();
    refresh();
  });

  let mvuEndedStop: (() => void) | undefined;
  let cancelled = false;
  void waitGlobalInitialized('Mvu')
    .then(() => {
      if (cancelled) return;
      mvuEndedStop = eventOn(Mvu.events.VARIABLE_UPDATE_ENDED, () => refresh()).stop;
    })
    .catch(() => {
      /* 非 MVU 环境 */
    });

  void state.refreshFromTavern();

  return () => {
    cancelled = true;
    u.stop();
    r.stop();
    c.stop();
    mvuEndedStop?.();
    refresh.cancel();
  };
}
