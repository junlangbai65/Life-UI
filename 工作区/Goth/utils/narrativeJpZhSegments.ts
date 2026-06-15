/**
 * 解析叙事正文中的对照片段，供界面分层样式。
 *
 * - 「外壳」{主文} / 『』 / 《》：外壳内为对照语种（日/英/法等）；花括号内为阅读主文（常为中文）。外壳为空且仍有 `{…}` 时仅展示主文、无悬浮对照。
 * - 〔〕{主文}：刻意不写对照语时用〔〕占位（多为空〔〕），永不显示悬浮层；〔〕内文字不向屏幕展示，仅写入无障碍朗读「编者标记」。
 *
 * 打字机进行中若 `{` 未闭合，则 `{` 及后续暂作 plain，避免半套花括号样式错乱。
 */

export type NarrativePlainSegment = { kind: 'plain'; text: string };

export type NarrativeJpZhSegment = {
  kind: 'jp-zh';
  /** 「 / 『 / 《 / 〔 */
  open: string;
  /** 」 / 』 / 》 / 〕 */
  close: string;
  /** 不含外层括号的对照文本（多语种）；仅有空白视为「无对照」 */
  inner: string;
  /** 花括号内主阅读语；未写出花括号或未完成打字时为 undefined */
  chinese?: string;
};

export type NarrativeRichSegment = NarrativePlainSegment | NarrativeJpZhSegment;

const RICH_OPENERS = ['「', '『', '《', '〔'] as const;
type RichOpener = (typeof RICH_OPENERS)[number];

const RICH_CLOSER: Record<RichOpener, string> = {
  '「': '」',
  '『': '』',
  '《': '》',
  '〔': '〕',
};

export function parseNarrativeJpZhSegments(input: string): NarrativeRichSegment[] {
  const out: NarrativeRichSegment[] = [];
  if (!input) return [{ kind: 'plain', text: '' }];

  let i = 0;

  while (i < input.length) {
    let openPos = -1;
    let openCh: RichOpener | '' = '';
    for (const k of RICH_OPENERS) {
      const p = input.indexOf(k, i);
      if (p >= 0 && (openPos < 0 || p < openPos)) {
        openPos = p;
        openCh = k;
      }
    }

    if (openPos < 0 || !openCh) {
      out.push({ kind: 'plain', text: input.slice(i) });
      break;
    }

    if (openPos > i) {
      out.push({ kind: 'plain', text: input.slice(i, openPos) });
    }

    const closeCh = RICH_CLOSER[openCh];
    const closePos = input.indexOf(closeCh, openPos + 1);
    if (closePos < 0) {
      out.push({ kind: 'plain', text: input.slice(openPos) });
      break;
    }

    const inner = input.slice(openPos + 1, closePos);
    let cursor = closePos + 1;
    let chinese: string | undefined;

    if (input[cursor] === '{') {
      const endBrace = input.indexOf('}', cursor + 1);
      if (endBrace >= 0) {
        chinese = input.slice(cursor + 1, endBrace);
        cursor = endBrace + 1;
      } else {
        out.push({
          kind: 'jp-zh',
          open: openCh,
          close: closeCh,
          inner,
        });
        out.push({ kind: 'plain', text: input.slice(cursor) });
        break;
      }
    }

    out.push({
      kind: 'jp-zh',
      open: openCh,
      close: closeCh,
      inner,
      chinese,
    });
    i = cursor;
  }

  return mergeAdjacentPlain(out);
}

function mergeAdjacentPlain(segments: NarrativeRichSegment[]): NarrativeRichSegment[] {
  const merged: NarrativeRichSegment[] = [];
  for (const seg of segments) {
    const prev = merged[merged.length - 1];
    if (seg.kind === 'plain' && prev?.kind === 'plain') {
      prev.text += seg.text;
    } else {
      merged.push(seg);
    }
  }
  return merged;
}
