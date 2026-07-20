/**
 * 在酒馆父页面隐藏各楼层 `.mes_text` 内的原始 DOM（保留 iframe，避免挡住 Goth 等嵌入式界面）。
 * 与 ADven 思路一致，使用独立 data-class 前缀以免与其它脚本冲突。
 */

import { debounce } from 'lodash';

const ATTR = 'data-goth-hidden-raw-node';
const CLS = 'goth-hidden-raw-text';

function getHostDocuments(): Document[] {
  const docs: Document[] = [];
  try {
    const pw = window.parent;
    if (pw && pw !== window && pw.document) docs.push(pw.document);
  } catch {
    /* 跨域或未注入父页 */
  }
  docs.push(document);
  return docs;
}

/** 对单个 `.mes_text` 根节点应用隐藏/恢复（保留 iframe 及其祖先链可见） */
export function applyGothMesTextHide(root: HTMLElement, hide: boolean): void {
  const iframeNodes = root.querySelectorAll<HTMLElement>('iframe');
  const keep = new Set<HTMLElement>();
  iframeNodes.forEach(ifr => {
    keep.add(ifr);
    let p: HTMLElement | null = ifr.parentElement;
    while (p && p !== root) {
      keep.add(p);
      p = p.parentElement;
    }
  });

  const all = Array.from(root.querySelectorAll<HTMLElement>('*'));
  all.forEach(node => {
    if (hide) {
      if (keep.has(node)) return;
      node.setAttribute(ATTR, '1');
      node.classList.add(CLS);
      node.style.setProperty('display', 'none', 'important');
      return;
    }
    if (node.getAttribute(ATTR) === '1') {
      node.removeAttribute(ATTR);
      node.classList.remove(CLS);
      node.style.removeProperty('display');
    }
  });
}

/** 同步：对所有聊天楼层 `.mes_text` 隐藏或恢复 */
export function syncGothHideAllChatRawText(hide: boolean): void {
  getHostDocuments().forEach(doc => {
    try {
      doc.querySelectorAll<HTMLElement>('#chat .mes .mes_text').forEach(el => {
        applyGothMesTextHide(el, hide);
      });
    } catch {
      /* */
    }
  });
}

/** 按楼层号同步（新楼层渲染后针对性处理，避免全表扫描过大时的补充；可选） */
export function syncGothHideChatRawTextForMessage(messageId: number, hide: boolean): void {
  getHostDocuments().forEach(doc => {
    try {
      doc.querySelectorAll<HTMLElement>(`#chat .mes[mesid='${messageId}'] .mes_text`).forEach(el => {
        applyGothMesTextHide(el, hide);
      });
    } catch {
      /* */
    }
  });
}

function restoreEverything(): void {
  getHostDocuments().forEach(doc => {
    try {
      doc.querySelectorAll<HTMLElement>(`[${ATTR}="1"]`).forEach(el => {
        el.removeAttribute(ATTR);
        el.classList.remove(CLS);
        el.style.removeProperty('display');
      });
    } catch {
      /* */
    }
  });
}

/**
 * 挂载：加载后立即隐藏；监听消息渲染事件防抖重扫。
 * @returns 卸载时调用：取消监听并恢复正文显示
 */
export function attachGothChatRawTextHider(): () => void {
  const run = debounce(() => {
    syncGothHideAllChatRawText(true);
  }, 280);

  run();

  const stops: EventOnReturn[] = [
    eventOn(tavern_events.MESSAGE_UPDATED, () => run()),
    eventOn(tavern_events.MESSAGE_RECEIVED, () => run()),
    eventOn(tavern_events.MESSAGE_SWIPED, () => run()),
    eventOn(tavern_events.MESSAGE_DELETED, () => run()),
    eventOn(tavern_events.CHARACTER_MESSAGE_RENDERED, () => run()),
    eventOn(tavern_events.USER_MESSAGE_RENDERED, () => run()),
  ];

  return () => {
    run.cancel();
    stops.forEach(s => s.stop());
    restoreEverything();
  };
}
