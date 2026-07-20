/**
 * 当 TH 未将 markdown 代码块转为 iframe 时，将状态栏代码块挂载为 iframe。
 * 默认使用代码块内的 inline HTML（无需 6622 开发服务器）；仅 loader 桩脚本才走 URL 加载。
 */
const MARKER = 'wife-cohab-status-panel';
const DEV_LOAD_URL = 'http://127.0.0.1:6622/wife/界面/同居状态栏/index.html';

/** 在 iframe 内同步父窗口的酒馆助手全局，供 inline bundle 使用 */
const GLOBAL_BRIDGE = `(function(){const g=window.parent;const n=['Vue','$','_','z','waitGlobalInitialized','getVariables','getCurrentMessageId','updateVariablesWith','errorCatched','eventOn','tavern_events','user_name','SillyTavern','toastr','YAML','getChatMessages','replaceVariables','triggerSlash','klona','Mvu'];for(const k of n){try{if(k in g&&g[k]!=null)window[k]=g[k]}catch(e){}}})();`;

function getChatDocument(): Document {
  try {
    if (window.parent?.document?.documentElement) return window.parent.document;
  } catch {
    /* cross-origin */
  }
  return document;
}

function isThMessageIframe(mes: Element): boolean {
  return Boolean(mes.querySelector(`iframe[id^="TH-message"]`));
}

function isWifeStatusCode(text: string): boolean {
  return (
    text.includes(MARKER) ||
    (text.includes('id="app"') && text.includes('<style') && text.includes('<script'))
  );
}

function isLoadModeStub(text: string): boolean {
  return /\$\(['"]body['"]\)\.load\s*\(/.test(text) || text.includes('wife-status-loader');
}

function extractLoadUrl(text: string): string {
  const matched = text.match(/\.load\s*\(\s*['"]([^'"]+)['"]/);
  return matched?.[1] ?? DEV_LOAD_URL;
}

function buildInlineDocument(fragment: string): string {
  if (fragment.includes('<!DOCTYPE') || /<html[\s>]/i.test(fragment)) {
    return fragment;
  }

  const styles = [...fragment.matchAll(/<style[^>]*>[\s\S]*?<\/style>/gi)].map(m => m[0]).join('\n');
  const scripts = [...fragment.matchAll(/<script[\s\S]*?<\/script>/gi)].map(m => m[0]).join('\n');
  const bodyMatch = fragment.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  const bodyInner = (bodyMatch?.[1] ?? '<div id="app"></div>').replace(/<script[\s\S]*?<\/script>/gi, '').trim();

  return `<!DOCTYPE html><html><head><meta charset="UTF-8"><script>${GLOBAL_BRIDGE}</script>${styles}</head><body>${bodyInner || '<div id="app"></div>'}${scripts}</body></html>`;
}

function resizeIframe(iframe: HTMLIFrameElement) {
  const fit = () => {
    try {
      const doc = iframe.contentDocument;
      if (!doc?.body) return;
      const h = Math.max(doc.body.scrollHeight, doc.documentElement?.scrollHeight ?? 0);
      if (h > 0) iframe.style.height = `${h}px`;
    } catch {
      /* ignore */
    }
  };
  iframe.addEventListener('load', () => {
    fit();
    window.setTimeout(fit, 120);
    window.setTimeout(fit, 480);
  });
}

function mountCodeBlock(pre: HTMLPreElement, mesid: string) {
  const code = pre.querySelector('code');
  const text = code?.textContent?.trim() ?? '';
  if (!isWifeStatusCode(text)) return;
  if (pre.dataset.wifeStatusMounted === '1') return;

  const iframe = document.createElement('iframe');
  iframe.className = 'wife-status-iframe';
  iframe.dataset.mesid = mesid;
  iframe.setAttribute('frameborder', '0');
  iframe.setAttribute('scrolling', 'no');
  iframe.style.width = '100%';
  iframe.style.border = 'none';
  iframe.style.display = 'block';
  iframe.style.minHeight = '120px';

  if (isLoadModeStub(text)) {
    iframe.src = extractLoadUrl(text);
    console.info('[wife/状态栏挂载] URL 模式挂载楼层', mesid, iframe.src);
  } else {
    const html = buildInlineDocument(text);
    const objectUrl = URL.createObjectURL(new Blob([html], { type: 'text/html;charset=utf-8' }));
    iframe.src = objectUrl;
    iframe.addEventListener(
      'load',
      () => {
        URL.revokeObjectURL(objectUrl);
      },
      { once: true },
    );
    console.info('[wife/状态栏挂载] inline 模式挂载楼层', mesid, `${Math.round(html.length / 1024)}KB`);
  }

  pre.dataset.wifeStatusMounted = '1';
  pre.replaceWith(iframe);
  resizeIframe(iframe);
}

function mountAll(doc: Document = getChatDocument()) {
  doc.querySelectorAll('#chat .mes').forEach(mes => {
    const mesid = mes.getAttribute('mesid');
    if (mesid == null) return;
    if (isThMessageIframe(mes)) return;

    mes.querySelectorAll('.mes_text pre').forEach(pre => {
      mountCodeBlock(pre as HTMLPreElement, mesid);
    });
  });
}

function watchChat(doc: Document) {
  if (typeof MutationObserver === 'undefined') return;
  let timer: ReturnType<typeof setTimeout> | undefined;
  const obs = new MutationObserver(() => {
    clearTimeout(timer);
    timer = setTimeout(() => mountAll(doc), 40);
  });
  obs.observe(doc.documentElement, { childList: true, subtree: true });
}

$(() => {
  errorCatched(() => {
    const chatDoc = getChatDocument();
    mountAll(chatDoc);
    for (const delay of [0, 80, 320, 900, 2000]) {
      window.setTimeout(() => mountAll(chatDoc), delay);
    }
    watchChat(chatDoc);

    eventOn(tavern_events.CHARACTER_MESSAGE_RENDERED, () => mountAll(chatDoc));
    eventOn(tavern_events.USER_MESSAGE_RENDERED, () => mountAll(chatDoc));
    eventOn(tavern_events.CHAT_CHANGED, () => {
      window.setTimeout(() => mountAll(chatDoc), 200);
    });
  })();
});
