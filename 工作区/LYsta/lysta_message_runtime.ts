/**
 * LYsta 状态栏运行时：供 npc_boot（酒馆助手脚本）在聊天 DOM 上执行。
 * 浏览器对 innerHTML 插入的消息不会执行其中的 <script>，必须由已在跑的脚本触发初始化。
 */
export function installLystaMessageRuntime(doc: Document): void {
  const win = doc.defaultView ?? window;

  function clamp(n, a, b) {
    return Math.max(a, Math.min(b, n));
  }
  function prefersReducedMotion() {
    try {
      return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    } catch (e) {
      return false;
    }
  }
  function parseNum(v) {
    const n = Number(String(v).replace(/[^\d.-]/g, ''));
    return Number.isFinite(n) ? n : 0;
  }
  function tweenNumber(el, to, dur, formatter) {
    if (!el) return;
    var ms = dur == null ? 600 : dur;
    var fmt =
      formatter ||
      function (n) {
        return String(Math.round(n));
      };
    if (prefersReducedMotion()) {
      el.textContent = fmt(to);
      return;
    }
    var from = parseNum(el.textContent);
    var start = typeof performance !== 'undefined' && performance.now ? performance.now() : Date.now();
    function easeOutCubic(t) {
      return 1 - Math.pow(1 - t, 3);
    }
    function tick(now) {
      var t = Math.min(1, ((now || start) - start) / ms);
      if (t >= 1) {
        el.textContent = fmt(to);
        return;
      }
      var cur = from + (to - from) * easeOutCubic(t);
      el.textContent = fmt(cur);
      if (typeof requestAnimationFrame === 'function') {
        requestAnimationFrame(tick);
      } else {
        setTimeout(function () {
          tick(typeof performance !== 'undefined' && performance.now ? performance.now() : Date.now());
        }, 16);
      }
    }
    if (typeof requestAnimationFrame === 'function') {
      requestAnimationFrame(tick);
    } else {
      setTimeout(function () {
        tick(typeof performance !== 'undefined' && performance.now ? performance.now() : Date.now());
      }, 0);
    }
  }
  function tierMarkSvg(tier) {
    var t = String(tier);
    if (t === '1') {
      return '<svg class="lysta-npc-tier-mark" viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.2" aria-hidden="true"><path d="M8 1l1.8 5.5h6l-4.8 3.5 1.8 5.5-5-3.6-5 3.6 1.8-5.5-4.8-3.5h6z"/></svg>';
    }
    if (t === '2') {
      return '<svg class="lysta-npc-tier-mark" viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.2" aria-hidden="true"><circle cx="8" cy="8" r="2"/><path d="M8 1v3M8 12v3M1 8h3M12 8h3M3 3l2 2M11 11l2 2M13 3l-2 2M5 11l-2 2"/></svg>';
    }
    if (t === '3') {
      return '<svg class="lysta-npc-tier-mark" viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.2" aria-hidden="true"><path d="M10.5 2a6 6 0 0 1 0 10 6 6 0 1 1-6-10"/></svg>';
    }
    if (t === '4') {
      return '<svg class="lysta-npc-tier-mark" viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.2" aria-hidden="true"><path d="M8 1l2.5 5 5.5.8-4 3.8 1 5.4L8 13.2 3 16l1-5.4-4-3.8L5.5 6z"/></svg>';
    }
    return '<svg class="lysta-npc-tier-mark" viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.2" aria-hidden="true"><circle cx="8" cy="8" r="2.5"/></svg>';
  }
  function depStage(v) {
    if (v <= 30) return '疏离';
    if (v <= 60) return '亲近';
    if (v <= 80) return '依恋';
    return '沉迷';
  }
  function npcTier(v) {
    if (v <= 20) return '0';
    if (v <= 40) return '1';
    if (v <= 60) return '2';
    if (v <= 80) return '3';
    return '4';
  }
  function getPath(obj, path) {
    if (!obj || !path) return undefined;
    const parts = path.split('.');
    let cur = obj;
    for (const p of parts) {
      if (cur == null) return undefined;
      cur = cur[p];
    }
    return cur;
  }
  /** 正则/MVU 注入往往在父页面；iframe 内 window 可能没有 Mvu/getVariables。 */
  function getLystaApiWindow() {
    var candidates = [];
    function addWin(w) {
      if (!w) return;
      for (var s = 0; s < candidates.length; s++) {
        if (candidates[s] === w) return;
      }
      candidates.push(w);
    }
    addWin(window);
    try {
      addWin(window.parent);
    } catch (e0) {}
    try {
      addWin(window.top);
    } catch (e1) {}
    var i;
    for (i = 0; i < candidates.length; i++) {
      try {
        var w = candidates[i];
        if (w && w.Mvu && typeof w.Mvu.getMvuData === 'function') {
          return w;
        }
      } catch (e2) {}
    }
    for (i = 0; i < candidates.length; i++) {
      try {
        var w2 = candidates[i];
        if (w2 && typeof w2.getVariables === 'function') {
          return w2;
        }
      } catch (e3) {}
    }
    return window;
  }
  /** 正则插入的正文不在 iframe 内时往往没有 getCurrentMessageId，需从聊天 DOM 推断本条 mes 的 id。 */
  function lystaResolveMessageId(root) {
    var wins = [];
    function addW(w) {
      if (!w) return;
      for (var t = 0; t < wins.length; t++) {
        if (wins[t] === w) return;
      }
      wins.push(w);
    }
    addW(window);
    try {
      addW(window.parent);
    } catch (eW) {}
    try {
      addW(window.top);
    } catch (eW2) {}
    var wi;
    for (wi = 0; wi < wins.length; wi++) {
      try {
        var ww = wins[wi];
        if (ww && typeof ww.getCurrentMessageId === 'function') {
          var gid = ww.getCurrentMessageId();
          if (gid !== undefined && gid !== null && String(gid) !== '') {
            var gn = Number(gid);
            if (!Number.isNaN(gn)) return gn;
          }
        }
      } catch (e) {}
    }
    try {
      if (root && typeof root.closest === 'function') {
        var mesEl = root.closest('.mes');
        if (mesEl) {
          var mr = mesEl.getAttribute('mesid') || mesEl.getAttribute('mesId') || mesEl.getAttribute('data-mes-id');
          if (mr != null && String(mr) !== '') {
            var mi = parseInt(String(mr), 10);
            if (!Number.isNaN(mi)) return mi;
          }
        }
      }
    } catch (eMes) {}
    try {
      var el = root;
      for (var depth = 0; depth < 24 && el; depth++, el = el.parentElement) {
        if (!el || !el.getAttribute) continue;
        var raw =
          el.getAttribute('mesid') ||
          el.getAttribute('mesId') ||
          el.getAttribute('data-mes-id') ||
          el.getAttribute('data-message-id') ||
          (el.dataset && (el.dataset.mesId || el.dataset.messageId));
        if (raw != null && String(raw) !== '') {
          var num = parseInt(String(raw), 10);
          if (!Number.isNaN(num)) return num;
        }
      }
    } catch (e2) {}
    return undefined;
  }
  function getStatDataForMessage(messageId) {
    if (messageId === undefined || messageId === null) return null;
    var mid = Number(messageId);
    if (Number.isNaN(mid)) return null;
    var W = getLystaApiWindow();
    try {
      if (W && W.Mvu && typeof W.Mvu.getMvuData === 'function') {
        var mvuData = W.Mvu.getMvuData({ type: 'message', message_id: mid });
        var sd = getPath(mvuData, 'stat_data');
        if (sd && typeof sd === 'object') return sd;
      }
    } catch (e1) {}
    try {
      if (W && typeof W.getVariables === 'function') {
        var vars = W.getVariables({ type: 'message', message_id: mid });
        var sd2 = getPath(vars, 'stat_data');
        if (sd2 && typeof sd2 === 'object') return sd2;
      }
    } catch (e2) {}
    return null;
  }
  function readPrevStatFallback(root) {
    try {
      var fb = root.querySelector('.lysta-prev-stat-fallback');
      if (fb && fb.textContent) {
        var t = fb.textContent.trim();
        if (t && t !== '{}' && t !== 'undefined') {
          return JSON.parse(t);
        }
      }
    } catch (e) {}
    return null;
  }
  function getPrevStatForCompare(root, mid) {
    if (mid !== undefined && mid !== null && !Number.isNaN(Number(mid)) && Number(mid) >= 1) {
      var sd = getStatDataForMessage(Number(mid) - 1);
      if (sd) return sd;
    }
    return readPrevStatFallback(root);
  }
  var DRIFT_SVG_CAL =
    '<svg class="lysta-drift-svg" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>';
  var DRIFT_SVG_YEN =
    '<svg class="lysta-drift-svg" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>';
  var DRIFT_SVG_LINK =
    '<svg class="lysta-drift-svg" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M10 13a5 5 0 0 1 0-7l1-1a5 5 0 1 1 7 7l-1 1M14 11a5 5 0 0 1 0 7l-1 1a5 5 0 1 1-7-7l1-1"/></svg>';
  var DRIFT_SVG_ZAP =
    '<svg class="lysta-drift-svg" viewBox="0 0 24 24" width="14" height="14" fill="currentColor" aria-hidden="true"><path d="M13 2L3 14h7l-1 8 10-12h-7l1-8z"/></svg>';
  function formatSignedDelta(n) {
    var r = Math.round(Number(n));
    if (!Number.isFinite(r) || r === 0) return '';
    return (r > 0 ? '+' : '') + String(r);
  }
  /** 相较上一条：仅图标 + 带符号数字（日期无数字），NPC 列表仍为完整字段展示。 */
  function syncDriftHub(root) {
    var hub = root.querySelector('[data-drift-hub]');
    var rail = root.querySelector('[data-drift-rail]');
    if (!hub || !rail) return;
    var mid = lystaResolveMessageId(root);
    var prevStat = getPrevStatForCompare(root, mid);
    if (!prevStat) {
      hub.hidden = true;
      rail.innerHTML = '';
      hub.removeAttribute('aria-label');
      return;
    }
    var ariaParts = [];
    var htmlChunks = [];
    var di = 0;
    var curDateEl = root.querySelector('.lysta-date-text');
    var curDate = curDateEl ? String(curDateEl.textContent || '').trim() : '';
    var pDate = getPath(prevStat, '世界.当前日期');
    var pDateStr = pDate != null ? String(pDate).trim() : '';
    if (pDateStr !== '' && pDateStr !== curDate) {
      ariaParts.push('叙事日期已相对上一条变化');
      htmlChunks.push(
        '<span class="lysta-drift-node lysta-drift-node--date" style="--drift-i:' +
          di++ +
          '" title="日期相对上一条已变化">' +
          '<span class="lysta-drift-sr">相较上一条，叙事日期已变化</span>' +
          '<span class="lysta-drift-cal-wrap" aria-hidden="true">' +
          DRIFT_SVG_CAL +
          '</span></span>',
      );
    }
    var moneyEl = root.querySelector('[data-money-value]');
    var curMoney = moneyEl ? parseNum(moneyEl.textContent) : 0;
    var pMoney = getPath(prevStat, '世界.生活费');
    if (pMoney !== undefined && pMoney !== null && String(pMoney).trim() !== '') {
      var pm = parseNum(pMoney);
      if (Number.isFinite(pm)) {
        var dMoney = Math.round(curMoney) - Math.round(pm);
        if (dMoney !== 0) {
          ariaParts.push('生活费差额 ' + formatSignedDelta(dMoney));
          var dirM = dMoney > 0 ? 'up' : 'down';
          htmlChunks.push(
            '<span class="lysta-drift-node lysta-drift-node--' +
              dirM +
              '" style="--drift-i:' +
              di++ +
              '">' +
              '<span class="lysta-drift-sr">生活费变化 ' +
              formatSignedDelta(dMoney) +
              '</span>' +
              DRIFT_SVG_YEN +
              '<span class="lysta-drift-num">' +
              formatSignedDelta(dMoney) +
              '</span></span>',
          );
        }
      }
    }
    var depStat = root.querySelector('.lysta-stat-dep');
    var curDep = depStat ? resolveStatNumeric(depStat, root) : 0;
    var pDep = getPath(prevStat, '凌月.依赖程度');
    if (pDep !== undefined && pDep !== null && String(pDep).trim() !== '') {
      var pd = clamp(parseNum(pDep), 0, 100);
      var dDep = Math.round(curDep) - Math.round(pd);
      if (dDep !== 0) {
        ariaParts.push('依赖程度变化 ' + formatSignedDelta(dDep));
        var dirD = dDep > 0 ? 'up' : 'down';
        htmlChunks.push(
          '<span class="lysta-drift-node lysta-drift-node--' +
            dirD +
            '" style="--drift-i:' +
            di++ +
            '">' +
            '<span class="lysta-drift-sr">依赖程度变化 ' +
            formatSignedDelta(dDep) +
            '</span>' +
            DRIFT_SVG_LINK +
            '<span class="lysta-drift-num">' +
            formatSignedDelta(dDep) +
            '</span></span>',
        );
      }
    }
    var desireStat = root.querySelector('.lysta-stat-desire');
    var curDesire = desireStat ? resolveStatNumeric(desireStat, root) : 0;
    var pDesire = getPath(prevStat, '凌月.性欲值');
    if (pDesire !== undefined && pDesire !== null && String(pDesire).trim() !== '') {
      var pdes = clamp(parseNum(pDesire), 0, 100);
      var dDesire = Math.round(curDesire) - Math.round(pdes);
      if (dDesire !== 0) {
        ariaParts.push('性欲值变化 ' + formatSignedDelta(dDesire));
        var dirZ = dDesire > 0 ? 'up' : 'down';
        htmlChunks.push(
          '<span class="lysta-drift-node lysta-drift-node--' +
            dirZ +
            '" style="--drift-i:' +
            di++ +
            '">' +
            '<span class="lysta-drift-sr">性欲值变化 ' +
            formatSignedDelta(dDesire) +
            '</span>' +
            DRIFT_SVG_ZAP +
            '<span class="lysta-drift-num">' +
            formatSignedDelta(dDesire) +
            '</span></span>',
        );
      }
    }
    if (htmlChunks.length === 0) {
      hub.hidden = true;
      rail.innerHTML = '';
      hub.removeAttribute('aria-label');
      return;
    }
    rail.innerHTML = htmlChunks.join('');
    hub.hidden = false;
    hub.setAttribute('aria-label', '相较上一条：' + ariaParts.join('；'));
  }
  /** API 常返回空的 NPC关系 {}，仍 truthy，会拦住 DOM 宏解析 —— 只有有关键条目才算命中。 */
  function isNonEmptyNpcRecord(o) {
    return o && typeof o === 'object' && !Array.isArray(o) && Object.keys(o).length > 0;
  }
  /** innerText 会把 &lt;br&gt; 等视作换行；textContent 在部分 DOM 下会粘成一行。隐藏节点 innerText 可能为空，需回退 textContent。 */
  function lystaNpcDomRawText(el) {
    if (!el) return '';
    try {
      var it = typeof el.innerText === 'string' ? String(el.innerText).trim() : '';
      if (it !== '') return it;
    } catch (e) {}
    return String(el.textContent || '').trim();
  }
  /** 解析 NPC 关系 JSON；跳过未展开的 {{…}}；允许首尾多余空白或非 JSON 包裹（部分宏会带前缀）。 */
  function tryParseNpcFallbackJson(raw) {
    var t = raw == null ? '' : String(raw).trim();
    if (!t || t === '{}' || t === 'undefined' || t === 'null') return null;
    if (/\{\{[\s\S]*?\}\}/.test(t)) return null;
    try {
      var o = JSON.parse(t);
      if (o && typeof o === 'object' && !Array.isArray(o)) return o;
    } catch (err) {}
    var start = t.indexOf('{');
    var end = t.lastIndexOf('}');
    if (start >= 0 && end > start) {
      try {
        var slice = t.slice(start, end + 1);
        var o2 = JSON.parse(slice);
        if (o2 && typeof o2 === 'object' && !Array.isArray(o2)) return o2;
      } catch (err2) {}
    }
    var pretty = tryParseNpcMvuPrettyText(t);
    if (pretty) return pretty;
    return null;
  }
  /**
   * MVU / format_message_variable 常把对象渲染为多行说明文而非 JSON，例如：
   * 夏露:\n关系值: 15\n阶段说明: …
   */
  function tryParseNpcMvuPrettyText(raw) {
    var t = raw == null ? '' : String(raw).trim();
    if (!t || /\{\{[\s\S]*?\}\}/.test(t)) return null;
    var fc = t.charAt(0);
    if (fc === '{' || fc === '[') return null;
    var lines = t.split(/\r?\n/).map(function (line) {
      return String(line).trim();
    });
    function isNpcNameLine(line) {
      if (!line) return false;
      if (/^关系值\s*[:：]/.test(line)) return false;
      if (/^阶段说明\s*[:：]/.test(line)) return false;
      var m = line.match(/^(.+?)[:：]\s*(.*)$/);
      if (!m) return false;
      var head = m[1].trim();
      if (head === '关系值' || head === '阶段说明') return false;
      return true;
    }
    function nameFromLine(line) {
      var m = line.match(/^(.+?)[:：]\s*(.*)$/);
      if (!m) return null;
      var head = m[1].trim();
      if (head === '关系值' || head === '阶段说明') return null;
      return head;
    }
    var result = {};
    var i = 0;
    while (i < lines.length) {
      var line = lines[i];
      if (!line) {
        i++;
        continue;
      }
      if (!isNpcNameLine(line)) {
        i++;
        continue;
      }
      var name = nameFromLine(line);
      if (!name) {
        i++;
        continue;
      }
      var rec = { 关系值: 0, 阶段说明: '' };
      i++;
      while (i < lines.length) {
        var L = lines[i];
        if (!L) {
          i++;
          continue;
        }
        if (isNpcNameLine(L)) break;
        var rm = L.match(/^关系值\s*[:：]\s*(.+)$/);
        if (rm) {
          rec.关系值 = clamp(parseNum(rm[1]), 0, 100);
          i++;
          continue;
        }
        var sm = L.match(/^阶段说明\s*[:：]\s*(.*)$/);
        if (sm) {
          var desc = sm[1] || '';
          i++;
          while (i < lines.length) {
            var nx = lines[i];
            if (!nx) {
              i++;
              continue;
            }
            if (isNpcNameLine(nx)) break;
            if (/^关系值\s*[:：]/.test(nx)) break;
            desc += (desc ? '\n' : '') + nx;
            i++;
          }
          rec.阶段说明 = desc.trim();
          continue;
        }
        i++;
      }
      result[name] = rec;
    }
    if (Object.keys(result).length) return result;
    return tryParseNpcMvuPrettyTextGlued(t);
  }
  /** 无换行时被粘成一行，或 &lt;br&gt; 经 textContent 粘成一行：夏露:关系值:15阶段说明:… */
  function tryParseNpcMvuPrettyTextGlued(t) {
    if (!t || t.indexOf('关系值') < 0 || t.indexOf('阶段说明') < 0) return null;
    var out = {};
    var re = /([^\r\n]+?)[:：]\s*关系值\s*[:：]\s*([\d.]+)\s*阶段说明\s*[:：]\s*/g;
    var matches = [];
    var m;
    while ((m = re.exec(t)) !== null) {
      matches.push({
        index: m.index,
        name: String(m[1] || '').trim(),
        val: m[2],
        descStart: m.index + m[0].length,
      });
    }
    if (matches.length === 0) {
      var one = t.replace(/\s+/g, ' ').trim();
      var single = one.match(/^(.+?)[:：]\s*关系值\s*[:：]\s*([\d.]+)\s*阶段说明\s*[:：]\s*(.+)$/);
      if (single) {
        var nm = single[1].trim();
        if (nm && nm !== '关系值' && nm !== '阶段说明') {
          out[nm] = {
            关系值: clamp(parseNum(single[2]), 0, 100),
            阶段说明: String(single[3] || '').trim(),
          };
        }
      }
      return Object.keys(out).length ? out : null;
    }
    for (var i = 0; i < matches.length; i++) {
      var mm = matches[i];
      if (!mm.name || mm.name === '关系值' || mm.name === '阶段说明') continue;
      var descEnd = i + 1 < matches.length ? matches[i + 1].index : t.length;
      var desc = t.slice(mm.descStart, descEnd).trim();
      out[mm.name] = { 关系值: clamp(parseNum(mm.val), 0, 100), 阶段说明: desc };
    }
    return Object.keys(out).length ? out : null;
  }
  function normalizeNpcRelationValue(x) {
    if (x == null) return null;
    if (typeof x === 'string') {
      var t = String(x).trim();
      if (!t || t === '{}' || t === 'undefined' || t === 'null') return null;
      if (/\{\{[\s\S]*?\}\}/.test(t)) return null;
      if (t.charAt(0) === '{' || t.charAt(0) === '[') {
        try {
          var o = JSON.parse(t);
          if (o && typeof o === 'object' && !Array.isArray(o)) return o;
        } catch (eStr) {}
        var start = t.indexOf('{');
        var end = t.lastIndexOf('}');
        if (start >= 0 && end > start) {
          try {
            var slice = t.slice(start, end + 1);
            var o2 = JSON.parse(slice);
            if (o2 && typeof o2 === 'object' && !Array.isArray(o2)) return o2;
          } catch (eStr2) {}
        }
        return null;
      }
      var prettyNorm = tryParseNpcMvuPrettyText(t);
      if (prettyNorm) return prettyNorm;
      return null;
    }
    if (typeof x === 'object' && !Array.isArray(x)) return x;
    return null;
  }
  function npcRelationFromVariableBlob(blob) {
    if (!blob || typeof blob !== 'object') return null;
    var paths = [
      'stat_data.NPC关系',
      'NPC关系',
      'data.stat_data.NPC关系',
      'message_data.stat_data.NPC关系',
      'variables.stat_data.NPC关系',
    ];
    for (var p = 0; p < paths.length; p++) {
      var x = getPath(blob, paths[p]);
      var n = normalizeNpcRelationValue(x);
      if (isNonEmptyNpcRecord(n)) return n;
    }
    return null;
  }
  function npcRelationFromApis(msgId) {
    var W = getLystaApiWindow();
    try {
      if (W && W.Mvu && typeof W.Mvu.getMvuData === 'function') {
        var mvuData = W.Mvu.getMvuData({ type: 'message', message_id: msgId });
        var d1 = npcRelationFromVariableBlob(mvuData);
        if (isNonEmptyNpcRecord(d1)) return d1;
      }
    } catch (e1) {}
    try {
      if (W && typeof W.getVariables === 'function') {
        var vars = W.getVariables({ type: 'message', message_id: msgId });
        var d2 = npcRelationFromVariableBlob(vars);
        if (isNonEmptyNpcRecord(d2)) return d2;
      }
    } catch (e2) {}
    return null;
  }
  function getNpcRecord(root) {
    var mid = lystaResolveMessageId(root);
    var tryIds = [];
    if (mid !== undefined && mid !== null && !Number.isNaN(Number(mid))) {
      tryIds.push(Number(mid));
    }
    if (tryIds.length === 0) {
      tryIds.push('latest');
      tryIds.push(-1);
    }
    for (var i = 0; i < tryIds.length; i++) {
      var got = npcRelationFromApis(tryIds[i]);
      if (isNonEmptyNpcRecord(got)) return got;
    }
    try {
      var Wc = getLystaApiWindow();
      if (Wc && typeof Wc.getVariables === 'function') {
        var chatBlob = Wc.getVariables({ type: 'chat' });
        var dc = npcRelationFromVariableBlob(chatBlob);
        if (isNonEmptyNpcRecord(dc)) return dc;
      }
    } catch (eChat) {}
    var inline = root.querySelector('.lysta-npc-fallback-inline');
    if (inline) {
      var p1 = tryParseNpcFallbackJson(lystaNpcDomRawText(inline));
      if (isNonEmptyNpcRecord(p1)) return p1;
    }
    var fb = root.querySelector('.lysta-npc-fallback');
    if (fb) {
      var p2 = tryParseNpcFallbackJson(lystaNpcDomRawText(fb));
      if (isNonEmptyNpcRecord(p2)) return p2;
    }
    var ssrPre = root.querySelector('.lysta-npc-ssr-pre');
    if (ssrPre) {
      var pSsr = tryParseNpcFallbackJson(lystaNpcDomRawText(ssrPre));
      if (isNonEmptyNpcRecord(pSsr)) return pSsr;
    }
    return {};
  }
  function renderNpcs(root, data) {
    var listEl = root.querySelector('[data-npc-list]');
    var emptyEl = root.querySelector('[data-npc-empty]');
    if (!listEl) return;
    listEl.innerHTML = '';
    var keys = Object.keys(data);
    if (keys.length === 0) {
      listEl.removeAttribute('data-lysta-has-npcs');
      if (emptyEl) emptyEl.hidden = false;
      return;
    }
    listEl.setAttribute('data-lysta-has-npcs', '1');
    if (emptyEl) emptyEl.hidden = true;
    keys.forEach(function (name, idx) {
      var rec = data[name] || {};
      var val = clamp(parseNum(rec.关系值), 0, 100);
      var tier = npcTier(val);
      var desc = rec.阶段说明 != null ? String(rec.阶段说明) : '';
      var initial = name.length ? name.charAt(0) : '?';
      var card = doc.createElement('div');
      card.className = 'lysta-npc-card lysta-bezel';
      card.style.setProperty('--lysta-anim-delay', idx * 0.05 + 's');
      var riv = doc.createElement('span');
      riv.className = 'lysta-rivets-mini';
      riv.setAttribute('aria-hidden', 'true');
      riv.innerHTML = '<i></i><i></i>';
      card.insertBefore(riv, card.firstChild);
      var av = doc.createElement('div');
      av.className = 'lysta-npc-avatar';
      av.setAttribute('data-tier', tier);
      av.textContent = initial;
      var main = doc.createElement('div');
      main.className = 'lysta-npc-main';
      var nm = doc.createElement('div');
      nm.className = 'lysta-npc-name lysta-engrave';
      nm.textContent = name;
      var barWrap = doc.createElement('div');
      barWrap.className = 'lysta-npc-bar';
      var barFill = doc.createElement('div');
      barFill.className = 'lysta-npc-bar-fill';
      barFill.style.width = val + '%';
      barWrap.appendChild(barFill);
      var row = doc.createElement('div');
      row.className = 'lysta-npc-meta';
      var lab = doc.createElement('span');
      lab.textContent = '关系值';
      var num = doc.createElement('span');
      num.className = 'lysta-npc-meta-val';
      num.textContent = String(val);
      row.appendChild(lab);
      row.appendChild(num);
      var des = doc.createElement('div');
      des.className = 'lysta-npc-desc';
      des.setAttribute('data-tier', tier);
      des.innerHTML = tierMarkSvg(tier) + '<span class="lysta-npc-desc-text"></span>';
      var desText = des.querySelector('.lysta-npc-desc-text');
      if (desText) desText.textContent = desc || '—';
      main.appendChild(nm);
      main.appendChild(row);
      main.appendChild(barWrap);
      main.appendChild(des);
      card.appendChild(av);
      card.appendChild(main);
      listEl.appendChild(card);
    });
  }
  function looksLikeMacroToken(s) {
    return /\{\{[\s\S]*?\}\}/.test(String(s || ''));
  }
  /** 优先读文本节点里的宏展开结果，跳过未替换的 {{…}}；必要时读本条 message 的 stat_data。 */
  function resolveStatNumeric(statEl, root) {
    if (!statEl) return 0;
    var rawEl = statEl.querySelector('[data-stat-raw]');
    var chunks = [];
    if (rawEl) chunks.push(String(rawEl.textContent || '').trim());
    var attr = statEl.getAttribute('data-value');
    if (attr != null && String(attr).trim() !== '') chunks.push(String(attr).trim());
    for (var i = 0; i < chunks.length; i++) {
      var chunk = chunks[i];
      if (!chunk || looksLikeMacroToken(chunk)) continue;
      var stripped = String(chunk).replace(/[^\d.-]/g, '');
      if (stripped === '') continue;
      var n = parseNum(chunk);
      if (Number.isFinite(n)) return clamp(n, 0, 100);
    }
    var key = statEl.getAttribute('data-stat');
    var pathByKey = { 依赖程度: '凌月.依赖程度', 性欲值: '凌月.性欲值' };
    var subpath = pathByKey[key];
    if (subpath && root) {
      var mid = lystaResolveMessageId(root);
      if (mid !== undefined && mid !== null && !Number.isNaN(Number(mid))) {
        var sd = getStatDataForMessage(mid);
        if (sd) {
          var apiRaw = getPath(sd, subpath);
          if (apiRaw !== undefined && apiRaw !== null && String(apiRaw).trim() !== '') {
            return clamp(parseNum(apiRaw), 0, 100);
          }
        }
      }
    }
    return 0;
  }
  function syncStatPrevLayer(statEl, root, v, key) {
    var wrap = statEl.querySelector('[data-stat-delta-wrap]');
    var deltaEl = statEl.querySelector('[data-stat-delta]');
    var ghost = statEl.querySelector('[data-fill-prev]');
    if (!wrap || !deltaEl) return;
    var path = key === '依赖程度' ? '凌月.依赖程度' : '凌月.性欲值';
    var mid = lystaResolveMessageId(root);
    var prevStat = getPrevStatForCompare(root, mid);
    var prevRaw = prevStat ? getPath(prevStat, path) : undefined;
    statEl.classList.remove('lysta-stat--delta-flash');
    if (prevRaw === undefined || prevRaw === null || String(prevRaw).trim() === '') {
      wrap.hidden = true;
      statEl.removeAttribute('data-stat-delta-dir');
      if (ghost) ghost.style.width = '0%';
      wrap.removeAttribute('title');
      return;
    }
    wrap.hidden = false;
    var prevVal = clamp(parseNum(prevRaw), 0, 100);
    var d = Math.round(v) - Math.round(prevVal);
    var label = d === 0 ? '0' : formatSignedDelta(d);
    deltaEl.textContent = label;
    statEl.setAttribute('data-stat-delta-dir', d > 0 ? 'up' : d < 0 ? 'down' : 'zero');
    wrap.setAttribute('title', '较上一条：' + label);
    if (ghost) {
      ghost.style.width = prevVal + '%';
    }
    if (d !== 0 && !prefersReducedMotion()) {
      statEl.classList.add('lysta-stat--delta-flash');
      window.setTimeout(function () {
        statEl.classList.remove('lysta-stat--delta-flash');
      }, 750);
    }
  }
  function syncStat(statEl, root) {
    if (!statEl) return;
    var v = resolveStatNumeric(statEl, root);
    var ariaLive = statEl.querySelector('[data-stat-aria-live]');
    var fillEl = statEl.querySelector('[data-fill]');
    var badgeEl = statEl.querySelector('[data-badge]');
    var badgeText = statEl.querySelector('[data-badge-text]');
    var key = statEl.getAttribute('data-stat');
    if (ariaLive && key) {
      ariaLive.textContent = key + ' ' + String(Math.round(v)) + '，满分 100';
    }
    var lcdVal = statEl.querySelector('[data-bar-lcd]');
    if (lcdVal) {
      lcdVal.textContent = String(Math.round(v));
    }
    if (fillEl) {
      fillEl.setAttribute('data-fill-pct', String(Math.round(v)));
      fillEl.style.width = '0%';
      if (typeof requestAnimationFrame === 'function') {
        requestAnimationFrame(function () {
          requestAnimationFrame(function () {
            fillEl.style.width = v + '%';
          });
        });
      } else {
        fillEl.style.width = v + '%';
      }
    }
    if (key === '依赖程度' && badgeEl) {
      var st = depStage(v);
      if (badgeText) badgeText.textContent = st;
      else badgeEl.textContent = st;
      badgeEl.setAttribute('data-stage', st);
    }
    if (key === '性欲值') {
      statEl.setAttribute('data-desire-overflow', v >= 80 ? '1' : '0');
      if (badgeEl) {
        if (badgeText) badgeText.textContent = '';
        if (v >= 80) {
          badgeEl.setAttribute('data-state', 'overflow');
        } else {
          badgeEl.removeAttribute('data-state');
        }
      }
    }
    if (key === '依赖程度' || key === '性欲值') {
      syncStatPrevLayer(statEl, root, v, key);
    }
  }
  function syncMoney(root) {
    var wrap = root.querySelector('[data-money-wrap]');
    var el = root.querySelector('[data-money-value]');
    var crisis = root.querySelector('[data-crisis]');
    if (!el) return;
    var v = parseNum(el.textContent);
    if (wrap) wrap.setAttribute('data-money-state', v < 0 ? 'crisis' : 'normal');
    if (crisis) crisis.hidden = v > 0;
    tweenNumber(el, v, 650, function (n) {
      var rounded = Math.round(n);
      var sign = rounded < 0 ? '-' : '';
      var abs = Math.abs(rounded);
      return '¥' + sign + abs;
    });
  }
  function initLystaRoot(root) {
    if (!root || !root.querySelector) return;
    try {
      root.querySelectorAll('.lysta-stat').forEach(function (se) {
        try {
          syncStat(se, root);
        } catch (eSt) {
          console.warn('[LYsta] syncStat', eSt);
        }
      });
      try {
        syncMoney(root);
      } catch (eM) {
        console.warn('[LYsta] syncMoney', eM);
      }
      try {
        syncDriftHub(root);
      } catch (eD) {
        console.warn('[LYsta] syncDriftHub', eD);
      }
      try {
        var rec = getNpcRecord(root);
        renderNpcs(root, rec);
      } catch (eN) {
        console.warn('[LYsta] npc', eN);
      }
    } catch (e) {
      console.warn('[LYsta]', e);
    } finally {
      try {
        root.classList.add('lysta-js-done');
      } catch (eCl) {}
      try {
        var ssrFb = root.querySelector('[data-npc-ssr-fallback]') || root.querySelector('.lysta-npc-ssr-fallback');
        if (ssrFb) ssrFb.remove();
      } catch (eRm) {}
    }
  }
  function bootAllLysta() {
    doc.querySelectorAll('.lysta-root').forEach(initLystaRoot);
  }
  bootAllLysta();
  setTimeout(bootAllLysta, 0);
  setTimeout(bootAllLysta, 80);
  setTimeout(bootAllLysta, 320);
  setTimeout(bootAllLysta, 900);
  if (typeof jQuery !== 'undefined' && typeof jQuery === 'function') {
    jQuery(bootAllLysta);
  }
  doc.querySelectorAll('.lysta-root').forEach(function (root) {
    if (typeof MutationObserver === 'undefined') return;
    var watch = root.querySelector('.lysta-npc-fallback-inline');
    var scriptFb = root.querySelector('.lysta-npc-fallback');
    var ssrPre = root.querySelector('.lysta-npc-ssr-pre');
    [watch, scriptFb, ssrPre].forEach(function (node) {
      if (!node) return;
      var obs = new MutationObserver(function () {
        initLystaRoot(root);
      });
      obs.observe(node, { characterData: true, subtree: true, childList: true });
    });
  });
}

declare global {
  interface Window {
    Mvu?: { getMvuData: (opts: { type: string; message_id: number | string }) => unknown };
    getVariables?: (opts: { type: string; message_id?: number | string; script_id?: string }) => unknown;
    getCurrentMessageId?: () => unknown;
  }
}
