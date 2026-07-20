export type MaintextSegment =
  | {
      kind: 'narration';
      text: string;
    }
  | {
      kind: 'dialogue';
      japaneseText: string;
      chineseText: string;
    };

const dialoguePattern = /(「[^」]+」|『[^』]+』|[^\s{}「」『』][^{}]*?)\s*\{([^{}]+)\}/g;
const MAIN_TEXT_CONTROL_NOISE_REGEX =
  /\b(?:world|presence|interest|options?|option|tucao|updatevariable|konotan_planning|konatan_planning|statusplaceholderimpl|stat_data|thinking|think)\b/i;
const MAIN_TEXT_STRONG_CONTROL_TOKENS = ['updatevariable', 'tucao', 'konotanplanning', 'konatanplanning', 'statusplaceholderimpl', 'statdata'] as const;
const MAIN_TEXT_WEAK_CONTROL_TOKENS = ['world', 'presence', 'interest', 'option', 'options'] as const;
const MAIN_TEXT_CONTROL_FRAGMENT_REGEX =
  /\\?\s*[<＜]?\s*\/?\s*(?:kona[ot]an[\s_-]*planning|update[\s_-]*variable|status[\s_-]*placeholder(?:[\s_-]*impl)?|stat[\s_-]*data|tucao|world|presence|interest|options?)\b[^>\n\r]*[>＞]?/gi;

function stripMainTextControlFragments(text: string): string {
  if (!text) return '';
  return text.replace(MAIN_TEXT_CONTROL_FRAGMENT_REGEX, ' ').replace(/[<>＜＞]/g, ' ').replace(/\s+/g, ' ').trim();
}

function isRenderableMaintextLine(line: string): boolean {
  const normalized = stripMainTextControlFragments(line);
  if (!normalized) return false;
  if (/[<>]/.test(normalized)) return false;
  const compact = normalized.toLowerCase().replace(/[^a-z0-9]/g, '');
  if (compact.length > 0) {
    if (MAIN_TEXT_STRONG_CONTROL_TOKENS.some(token => compact.includes(token))) return false;
    const weakHitCount = MAIN_TEXT_WEAK_CONTROL_TOKENS.reduce((count, token) => (compact.includes(token) ? count + 1 : count), 0);
    if (weakHitCount >= 2) return false;
  }
  if (MAIN_TEXT_CONTROL_NOISE_REGEX.test(normalized)) {
    // Keep sentence-like long natural text, but drop short control markers.
    if (normalized.length <= 64) return false;
    if (!/[\u4e00-\u9fa5]{2,}|[a-z]{4,}\s+[a-z]{4,}/i.test(normalized)) return false;
  }
  if (/^[+\-–—|｜\s]+$/.test(normalized)) return false;
  return true;
}

function pushNarration(segments: MaintextSegment[], text: string) {
  const normalized = text.replace(/\s+\n/g, '\n').trim();
  if (!normalized) return;
  segments.push({ kind: 'narration', text: normalized });
}

export function formatMaintextSegments(raw: string): MaintextSegment[] {
  if (!raw) return [];
  const segments: MaintextSegment[] = [];
  const lines = raw
    .split('\n')
    .map(line => stripMainTextControlFragments(line))
    .filter(line => isRenderableMaintextLine(line));

  for (const line of lines) {
    dialoguePattern.lastIndex = 0;
    let cursor = 0;
    let hasDialogue = false;
    let match: RegExpExecArray | null;

    while ((match = dialoguePattern.exec(line)) !== null) {
      hasDialogue = true;
      const beforeText = line.slice(cursor, match.index).trim();
      pushNarration(segments, beforeText);

      const japaneseText = (match[1] || '').trim();
      const chineseText = (match[2] || '').trim();
      if (japaneseText && chineseText) {
        segments.push({
          kind: 'dialogue',
          japaneseText,
          chineseText,
        });
      }
      cursor = match.index + match[0].length;
    }

    if (!hasDialogue) {
      pushNarration(segments, line);
      continue;
    }
    const trailing = line.slice(cursor).trim();
    pushNarration(segments, trailing);
  }

  return segments;
}
