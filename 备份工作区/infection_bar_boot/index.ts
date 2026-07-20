/**
 * 感染状态栏 boot：当世界书正则插入的 HTML 内 <script> 被 SillyTavern 剥离时，
 * 由本酒馆助手脚本在父页面执行 util/状态栏1.html 中的运行时逻辑。
 *
 * 请在角色卡中启用本脚本；正则替换内容仍为 util/状态栏1.html 全文。
 */
import statusBarHtml from '../../util/状态栏1.html?raw';

/** 酒馆助手脚本在 iframe 内运行，聊天 DOM 在 parent.document（见 .cursor/rules/脚本.mdc） */
function getChatWindow(): Window {
  try {
    if (window.parent?.document?.documentElement) return window.parent;
  } catch (_) {}
  return window;
}

function getChatDocument(): Document {
  return getChatWindow().document;
}

function runStatusBarRuntime() {
  const chatWin = getChatWindow();

  if (typeof chatWin.__initInfectionStatusBar === 'function') {
    chatWin.__initInfectionStatusBar();
    return;
  }

  const match = statusBarHtml.match(/<script>\s*([\s\S]*?)<\/script>/i);
  if (!match?.[1]) {
    console.warn('[感染状态栏 boot] 未能从 状态栏1.html 提取脚本');
    return;
  }

  // eslint-disable-next-line no-new-func
  const runner = new Function(match[1]);
  runner();

  chatWin.__initInfectionStatusBar?.();
}

function bootAll() {
  runStatusBarRuntime();
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

declare global {
  interface Window {
    __infectionBarRefreshers?: WeakMap<Element, { 刷新: () => void; 强制重渲染: () => void }>;
    __initInfectionStatusBar?: () => void;
  }
}
