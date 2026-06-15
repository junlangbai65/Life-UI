/**
 * 在酒馆父页面隐藏各楼层 `.mes_text` 内的原始 DOM（保留 iframe 及祖先链，避免挡住 Inf_status 界面）。
 * 思路与 ADven / Goth 一致，使用 `inf-` 前缀避免与其它脚本冲突。
 */

import { debounce } from 'lodash';
import { shouldHideRawTextForMessage } from './messageParser';

const ATTR = 'data-inf-hidden-raw-node';
const CLS = 'inf-hidden-raw-text';
const MES_ATTR = 'data-inf-structured-hidden';
const CHAIN_ATTR = 'data-inf-iframe-chain';
const HEIGHT_ATTR = 'data-inf-synced-height';
const STYLE_ID = 'inf-chat-hide-styles';

const PARENT_HIDE_CSS = `
#chat .mes .mes_text[data-inf-structured-hidden="1"] {
  min-height: 0 !important;
  height: auto !important;
  font-size: 0 !important;
  line-height: 0 !important;
  letter-spacing: 0 !important;
  overflow: hidden;
}
#chat .mes .mes_text[data-inf-structured-hidden="1"] [data-inf-iframe-chain="1"] {
  margin: 0 !important;
  padding: 0 !important;
  min-height: 0 !important;
  border: 0 !important;
  font-size: initial;
  line-height: normal;
}
#chat .mes .mes_text[data-inf-structured-hidden="1"] iframe {
  display: block !important;
  vertical-align: top;
  margin: 0 !important;
}
.inf-hidden-raw-text {
  display: none !important;
}
`;

function getHostDocuments(): Document[] {
  const docs: Document[] = [];
  try {
    const parentWindow = window.parent;
    if (parentWindow && parentWindow !== window && parentWindow.document) {
      docs.push(parentWindow.document);
    }
  } catch {
    /* 跨域或未注入父页 */
  }
  docs.push(document);
  return docs;
}

function ensureInfChatHideStyles(doc: Document): void {
  if (doc.getElementById(STYLE_ID)) return;
  const style = doc.createElement('style');
  style.id = STYLE_ID;
  style.textContent = PARENT_HIDE_CSS;
  doc.head?.appendChild(style);
}

function ensureStylesInHostDocuments(): void {
  getHostDocuments().forEach(doc => ensureInfChatHideStyles(doc));
}

function clearIframeChainMarks(root: HTMLElement): void {
  root.querySelectorAll<HTMLElement>(`[${CHAIN_ATTR}="1"]`).forEach(el => {
    el.removeAttribute(CHAIN_ATTR);
  });
}

function markIframeChain(keep: Set<HTMLElement>): void {
  keep.forEach(node => node.setAttribute(CHAIN_ATTR, '1'));
}

function restoreMesTextLayout(root: HTMLElement): void {
  root.removeAttribute(MES_ATTR);
  if (root.getAttribute(HEIGHT_ATTR) === '1') {
    root.style.removeProperty('height');
    root.style.removeProperty('overflow');
    root.removeAttribute(HEIGHT_ATTR);
  }
  root.style.removeProperty('min-height');
}

/** 将 `.mes_text` 高度收束到 iframe，避免隐藏正文后仍保留旧占位高度 */
export function syncMesTextHeightToIframe(root: HTMLElement): void {
  const iframe = root.querySelector('iframe');
  if (!iframe) return;

  const measure = () => {
    const height = Math.ceil(iframe.getBoundingClientRect().height);
    if (height <= 0) return;
    root.style.height = `${height}px`;
    root.style.overflow = 'hidden';
    root.setAttribute(HEIGHT_ATTR, '1');
  };

  requestAnimationFrame(() => {
    requestAnimationFrame(measure);
  });
}

/** 同步当前 iframe 所在楼层的 `.mes_text` 布局（Vue 渲染或 iframe 测高后调用） */
export function syncInfCurrentMesLayout(): void {
  let messageId = -1;
  try {
    messageId = getCurrentMessageId();
  } catch {
    return;
  }
  if (messageId < 0) return;

  getHostDocuments().forEach(doc => {
    try {
      doc
        .querySelectorAll<HTMLElement>(
          `#chat .mes[mesid='${messageId}'] .mes_text[${MES_ATTR}="1"]`,
        )
        .forEach(el => syncMesTextHeightToIframe(el));
    } catch {
      /* */
    }
  });
}

/** 对单个 `.mes_text` 根节点应用隐藏/恢复（保留 iframe 及其祖先链可见） */
export function applyInfMesTextHide(root: HTMLElement, hide: boolean): void {
  if (root.getAttribute('data-inf-hidden-raw-text') === '1') {
    root.classList.remove(CLS);
    root.removeAttribute('data-inf-hidden-raw-text');
    root.style.removeProperty('display');
  }

  const iframeNodes = root.querySelectorAll<HTMLElement>('iframe');
  const keep = new Set<HTMLElement>();
  iframeNodes.forEach(iframe => {
    keep.add(iframe);
    let parent: HTMLElement | null = iframe.parentElement;
    while (parent && parent !== root) {
      keep.add(parent);
      parent = parent.parentElement;
    }
  });

  if (!hide) {
    clearIframeChainMarks(root);
    restoreMesTextLayout(root);

    root.querySelectorAll<HTMLElement>('*').forEach(node => {
      if (node.getAttribute(ATTR) !== '1') return;
      node.removeAttribute(ATTR);
      node.classList.remove(CLS);
      node.style.removeProperty('display');
    });
    return;
  }

  // iframe 尚未挂载时不隐藏，否则整段 `.mes_text` 会空白
  if (iframeNodes.length === 0) {
    clearIframeChainMarks(root);
    restoreMesTextLayout(root);
    return;
  }

  ensureStylesInHostDocuments();
  root.setAttribute(MES_ATTR, '1');
  clearIframeChainMarks(root);
  markIframeChain(keep);

  root.querySelectorAll<HTMLElement>('*').forEach(node => {
    if (keep.has(node)) return;
    node.setAttribute(ATTR, '1');
    node.classList.add(CLS);
    node.style.setProperty('display', 'none', 'important');
  });

  syncMesTextHeightToIframe(root);
}

export function setInfRawTextHiddenState(messageId: number, shouldHide: boolean): void {
  getHostDocuments().forEach(doc => {
    try {
      doc.querySelectorAll<HTMLElement>(`#chat .mes[mesid='${messageId}'] .mes_text`).forEach(el => {
        applyInfMesTextHide(el, shouldHide);
      });
    } catch {
      /* */
    }
  });
}

/** 对近期 assistant 楼层：有结构化正文/选项/stat 时隐藏原始 DOM */
export function syncInfHiddenRawTextForStructuredMessages(): void {
  const lastMessageId = getLastMessageId();
  if (lastMessageId < 0) return;

  const begin = Math.max(0, lastMessageId - 160);
  const assistantMessages = getChatMessages(`${begin}-${lastMessageId}`, {
    role: 'assistant',
    hide_state: 'all',
  });
  if (!assistantMessages?.length) return;

  assistantMessages.forEach(message => {
    const shouldHide = shouldHideRawTextForMessage(message.message ?? '');
    setInfRawTextHiddenState(message.message_id, shouldHide);
  });

  syncInfCurrentMesLayout();
}

export function restoreInfAllHiddenRawText(): void {
  getHostDocuments().forEach(doc => {
    try {
      doc.querySelectorAll<HTMLElement>('#chat .mes .mes_text').forEach(el => {
        applyInfMesTextHide(el, false);
      });
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
 * 挂载：按设置隐藏结构化楼层的原始文本；监听消息事件防抖重扫。
 * @returns 卸载时调用：取消监听并恢复正文显示
 */
export function attachInfChatRawTextHider(isEnabled: () => boolean): () => void {
  ensureStylesInHostDocuments();

  const run = debounce(() => {
    if (isEnabled()) {
      syncInfHiddenRawTextForStructuredMessages();
      return;
    }
    restoreInfAllHiddenRawText();
  }, 280);

  run();

  const stops: EventOnReturn[] = [
    eventOn(tavern_events.MESSAGE_UPDATED, () => run()),
    eventOn(tavern_events.MESSAGE_RECEIVED, () => run()),
    eventOn(tavern_events.MESSAGE_SWIPED, () => run()),
    eventOn(tavern_events.MESSAGE_DELETED, () => run()),
    eventOn(tavern_events.CHARACTER_MESSAGE_RENDERED, () => run()),
    eventOn(tavern_events.USER_MESSAGE_RENDERED, () => run()),
    eventOn(tavern_events.CHAT_CHANGED, () => run()),
  ];

  return () => {
    run.cancel();
    stops.forEach(stop => stop.stop());
    restoreInfAllHiddenRawText();
  };
}

/** iframe 内容高度变化时，同步父页 `.mes_text` 占位，避免底部留白 */
export function attachInfMesLayoutObserver(isEnabled: () => boolean): () => void {
  const app = document.getElementById('app');
  if (!app || typeof ResizeObserver === 'undefined') {
    return () => {};
  }

  const sync = debounce(() => {
    if (isEnabled()) syncInfCurrentMesLayout();
  }, 180);

  const observer = new ResizeObserver(() => sync());
  observer.observe(app);
  sync();

  return () => {
    sync.cancel();
    observer.disconnect();
  };
}
