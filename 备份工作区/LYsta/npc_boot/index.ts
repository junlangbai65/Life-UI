/**
 * LYsta 状态栏 boot：当正则替换 HTML 内 <script> 被 SillyTavern 剥离时，
 * 由本酒馆助手脚本在父页面执行 lysta_message_runtime 逻辑。
 *
 * 请在角色卡中启用本脚本；正则替换内容仍为 status_bar.html 全文。
 */
import { installLystaMessageRuntime } from '../lysta_message_runtime';

function getChatDocument(): Document {
  try {
    if (window.parent?.document?.documentElement) return window.parent.document;
  } catch (_) {}
  return document;
}

function bootAll() {
  installLystaMessageRuntime(getChatDocument());
}

function watchChat(doc: Document) {
  if (typeof MutationObserver === 'undefined') return;
  let timer: ReturnType<typeof setTimeout> | undefined;
  const obs = new MutationObserver(() => {
    clearTimeout(timer);
    timer = setTimeout(bootAll, 40);
  });
  obs.observe(doc.documentElement, { childList: true, subtree: true });
}

$(() => {
  errorCatched(() => {
    const chatDoc = getChatDocument();
    bootAll();
    setTimeout(bootAll, 0);
    setTimeout(bootAll, 80);
    setTimeout(bootAll, 320);
    setTimeout(bootAll, 900);
    setTimeout(bootAll, 2000);
    watchChat(chatDoc);
    if (typeof jQuery === 'function') {
      jQuery(bootAll);
    }
  })();
});
