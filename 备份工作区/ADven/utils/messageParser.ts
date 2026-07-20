/**
 * 消息解析工具
 * 从 assistant 楼层消息中解析 maintext/world/presence/interest/options 标签。
 * 世界信息可从 `<world>...</world>` 内读取；若某字段缺失，也会回退到消息中任意位置的
 * `<time>...</time>`、`<weather>...</weather>` 等独立标签（与 `<world>` 内规则相同，后者优先）。
 *
 * 标准叙事格式要点：
 * - `<maintext>` 内可含 `<dice>...</dice>`，须在净化正文前先抽取骰子，再对剩余正文做 sanitize。
 * - `<options>` 内推荐 `<A>...</A>` … `<D>...</D>`，或与 `A. 文案`、`<option id="A">` 等兼容。
 */

declare function getChatMessages(
  range: string | number,
  options?: { role?: 'all' | 'system' | 'assistant' | 'user' },
): Array<{ message: string; message_id: number; role: string; data?: Record<string, unknown> }>;
declare function getLastMessageId(): number;

export interface Option {
  id: string;
  text: string;
}

export interface WorldState {
  day: string;
  time: string;
  weather: string;
  degree: string;
  location: string;
}

export interface InterestPoint {
  target: string;
  description: string;
}

const CONTROL_TAG_NAME_PATTERN =
  '(?:world|presence|interest|options?|option|tucao|updatevariable|konotan_planning|konatan_planning|statusplaceholderimpl|stat_data|thinking|think)';
const CONTROL_NOISE_KEYWORD_REGEX =
  /\b(?:world|presence|interest|options?|option|tucao|updatevariable|konotan_planning|konatan_planning|statusplaceholderimpl|stat_data)\b/i;
const STRONG_CONTROL_TOKENS = ['updatevariable', 'tucao', 'konotanplanning', 'konatanplanning', 'statusplaceholderimpl', 'statdata'] as const;
const WEAK_CONTROL_TOKENS = ['world', 'presence', 'interest', 'option', 'options'] as const;
const CONTROL_FRAGMENT_REGEX =
  /\\?\s*[<＜]?\s*\/?\s*(?:kona[ot]an[\s_-]*planning|update[\s_-]*variable|status[\s_-]*placeholder(?:[\s_-]*impl)?|stat[\s_-]*data|tucao|world|presence|interest|options?)\b[^>\n\r]*[>＞]?/gi;

function removeReasoningBlocks(messageContent: string): string {
  if (!messageContent) return '';
  let cleaned = messageContent.replace(/<thinking>[\s\S]*?<\/thinking>/gi, '');
  cleaned = cleaned.replace(/<think>[\s\S]*?(<\/redacted_reasoning>|<\/think>)/gi, '');
  const thinkingStart = cleaned.search(/<thinking>/i);
  if (thinkingStart !== -1) cleaned = cleaned.substring(0, thinkingStart);
  const thinkStart = cleaned.search(/<think>/i);
  if (thinkStart !== -1) cleaned = cleaned.substring(0, thinkStart);
  return decodeBasicHtmlEntities(cleaned);
}

function decodeBasicHtmlEntities(text: string): string {
  if (!text) return '';
  return text
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&amp;/gi, '&');
}

function extractTagBlock(messageContent: string, tagName: string): string {
  if (!messageContent) return '';
  const cleaned = removeReasoningBlocks(messageContent);
  const regex = new RegExp(`<${tagName}\\b[^>]*>([\\s\\S]*?)<\\/${tagName}\\s*>`, 'gi');
  const matches = Array.from(cleaned.matchAll(regex));
  if (matches.length === 0) return '';
  return (matches[matches.length - 1][1] || '').trim();
}

function stripControlTags(text: string): string {
  if (!text) return '';
  const controlTagRegex = new RegExp(`<\\/?${CONTROL_TAG_NAME_PATTERN}\\b[^>]*>`, 'gi');
  const relaxedControlTagRegex = new RegExp(`<\\s*\\/?\\s*${CONTROL_TAG_NAME_PATTERN}\\b[^>]*>`, 'gi');
  return text.replace(controlTagRegex, ' ').replace(relaxedControlTagRegex, ' ');
}

function stripGenericXmlLikeTags(text: string): string {
  if (!text) return '';
  return text
    .replace(/<\s*\/?\s*[a-zA-Z_][\w:-]*(?:\s[^>]*)?>/g, ' ')
    .replace(/[<>]/g, ' ');
}

function removeNoiseSymbols(text: string): string {
  if (!text) return '';
  return text
    .replace(/[+｜|]+/g, ' ')
    .replace(/[＜〈《]/g, '<')
    .replace(/[＞〉》]/g, '>')
    .replace(/[ \t]+/g, ' ')
    .trim();
}

function stripControlFragments(text: string): string {
  if (!text) return '';
  return text.replace(CONTROL_FRAGMENT_REGEX, ' ');
}

function normalizeListItemPrefix(text: string): string {
  if (!text) return '';
  return text.replace(/^\s*(?:\d+[.)、]|[-*+])\s*/, '').trim();
}

/** 思维链 / 规划标记（易误入 interest） */
const THINKING_OR_PLANNING_REGEX =
  /(?:思维链|思考链|chain\s*of\s*thought|コトナン|konat[ao]n|\/\s*konat[ao]n|planning|コト\s*プラ)/i;

/** 明显像正文/对话泄漏（误入 presence；避免误杀「柜台」等可作物件名） */
const NARRATIVE_LEAK_HINT_REGEX =
  /(?:她|他|它|说道|的手指|敲了|拍了|点了点头|柜台小姐|讨伐任务|史莱姆讨伐|麦露|问道|答道|继续往前走|走了大概|城门到了)/;

function looksLikeThinkingChainOrPlanning(text: string): boolean {
  const t = text.trim();
  if (!t) return false;
  if (THINKING_OR_PLANNING_REGEX.test(t)) return true;
  if (/[（(]\s*思维链\s*[)）]/.test(t)) return true;
  if (/\/\s*[^/\s]{3,}/.test(t) && /planning|konat/i.test(t)) return true;
  return false;
}

function looksLikeMaintextOrDialogueLeak(text: string): boolean {
  const t = text.trim();
  if (!t) return false;
  if (/[「」『』｛｝]/.test(t)) return true;
  if (/\{[^}]+\}/.test(t)) return true;
  if (NARRATIVE_LEAK_HINT_REGEX.test(t)) return true;
  const kanaRun = t.match(/[\u3040-\u30ff]+/g);
  if (kanaRun && kanaRun.some(run => run.length >= 4)) return true;
  const cjk = t.match(/[\u4e00-\u9fa5]/g);
  if (cjk && cjk.length >= 10) return true;
  if (t.length >= 14 && /(?:的|了|着|在|和|与|把|被|让|说|道|问|答|着|过)/.test(t)) return true;
  return false;
}

/** 兴趣点专用：只拦对话/思维链/战斗等，允许「景物-一句说明」类长中文（含 的/在/贴着） */
function looksLikeInterestTargetLeak(text: string): boolean {
  const t = text.trim();
  if (!t) return true;
  if (/[「」『』｛｝]/.test(t)) return true;
  if (/\{[^}]+\}/.test(t)) return true;
  if (looksLikeThinkingChainOrPlanning(t)) return true;
  if (isControlNoiseLine(t)) return true;
  if (/(?:她|他|它)(?:说|道|问|答|想|笑|叹|摇)/.test(t)) return true;
  if (/(?:麦露|的手指|敲了两下|点了点头|柜台小姐)/.test(t)) return true;
  const kanaRun = t.match(/[\u3040-\u30ff]+/g);
  if (kanaRun && kanaRun.some(run => run.length >= 4)) return true;
  return false;
}

function looksLikeInterestDescriptionLeak(text: string): boolean {
  const t = text.trim();
  if (!t) return true;
  if (/[「」『』｛｝]/.test(t)) return true;
  if (/\{[^}]+\}/.test(t)) return true;
  if (looksLikeThinkingChainOrPlanning(t)) return true;
  if (isControlNoiseLine(t)) return true;
  if (/(?:她|他|它)(?:说|道|问|答|想)/.test(t)) return true;
  if (/(?:麦露|的手指|敲了|点了点头|柜台小姐)/.test(t)) return true;
  if (/(?:\bvs\b|攻击判定|伤害|命中|d\d+|=\s*\d+)/i.test(t)) return true;
  const kanaRun = t.match(/[\u3040-\u30ff]+/g);
  if (kanaRun && kanaRun.some(run => run.length >= 4)) return true;
  return false;
}

function sanitizeMaintextContent(raw: string): string {
  if (!raw) return '';
  const withoutControlTags = stripControlTags(raw);
  const lines = withoutControlTags
    .split('\n')
    .map(line => line.trim())
    .filter(Boolean)
    .map(line => removeNoiseSymbols(stripControlFragments(stripGenericXmlLikeTags(line))))
    .filter(Boolean)
    .filter(line => !/^[-–—]+$/.test(line))
    .filter(line => !/^[A-Za-z_][\w-]*$/.test(line))
    .filter(line => !isControlNoiseLine(line));
  return lines.join('\n').trim();
}

function sanitizeOptionLikeLine(rawLine: string): string {
  if (!rawLine) return '';
  const withoutListMarker = normalizeListItemPrefix(rawLine);
  const cleaned = removeNoiseSymbols(stripControlFragments(stripGenericXmlLikeTags(stripControlTags(withoutListMarker))));
  if (!cleaned) return '';
  if (/^[-–—]+$/.test(cleaned)) return '';
  if (isControlNoiseLine(cleaned)) return '';
  return cleaned;
}

function isLikelyPresenceName(text: string): boolean {
  const value = text.trim();
  if (!value) return false;
  if (looksLikeMaintextOrDialogueLeak(value)) return false;
  // 标准格式允许「特征法」较长个体名（如 伤痕累累的野狼、毛色较浅的野狼）
  if (value.length > 40) return false;
  if (/[。！？!?：:;；{}[\]<>＜＞=+*/\\]/.test(value)) return false;
  if (/\d{2,}/.test(value)) return false;
  const wordCount = value.split(/\s+/).filter(Boolean).length;
  if (wordCount > 5) return false;
  const cjk = value.match(/[\u4e00-\u9fa5]/g);
  if (cjk && cjk.length > 24) return false;
  return true;
}

/** 带数量、括注、分级等的长条目（不应按短名规则误杀） */
const PRESENCE_STRUCTURE_HINT =
  /[×xX＊*]\s*\d|[（(][^)）]{1,120}[)）]|\bT\d|级(?:魔兽|怪物)|(?:敌意|友善|中立|敌对)|NPC|BOSS|Lv\.?\s*\d/i;

function isLikelyPresenceEntry(text: string): boolean {
  const value = text.trim();
  if (!value) return false;
  if (looksLikeThinkingChainOrPlanning(value)) return false;
  if (value.length > 160) return false;
  if (PRESENCE_STRUCTURE_HINT.test(value)) {
    if (/[「」『』]/.test(value)) return false;
    if (NARRATIVE_LEAK_HINT_REGEX.test(value)) return false;
    return true;
  }
  return isLikelyPresenceName(value);
}

/** 仅在括号外按分隔符切分，避免「魔兽,目前」被拆成两段 */
function splitPresenceSegments(raw: string): string[] {
  const line = raw.replace(/\r\n/g, '\n');
  const segments: string[] = [];
  let depth = 0;
  let buf = '';
  for (let i = 0; i < line.length; i++) {
    const ch = line[i]!;
    if (ch === '(' || ch === '（') depth++;
    else if (ch === ')' || ch === '）') depth = Math.max(0, depth - 1);
    if (depth === 0 && /[，,、;；|]/.test(ch)) {
      const t = buf.trim();
      if (t) segments.push(t);
      buf = '';
      continue;
    }
    if (depth === 0 && ch === '\n') {
      const t = buf.trim();
      if (t) segments.push(t);
      buf = '';
      continue;
    }
    buf += ch;
  }
  const t = buf.trim();
  if (t) segments.push(t);
  return segments;
}

function isLikelyInterestTarget(text: string): boolean {
  const value = text.trim();
  if (!value) return false;
  if (looksLikeInterestTargetLeak(value)) return false;
  if (value.length > 32) return false;
  if (/[。！？!?：:;；{}[\]<>＜＞=+*/\\]/.test(value)) return false;
  if (/\d{2,}/.test(value)) return false;
  return true;
}

function isLikelyInterestDescription(text: string): boolean {
  const value = text.trim();
  if (!value) return false;
  if (looksLikeInterestDescriptionLeak(value)) return false;
  // 标准格式允许较长 Tips 描述（名称-描述）
  if (value.length > 160) return false;
  if (/[{}[\]<>＜＞「」『』]/.test(value)) return false;
  if (/[。！？!?]/.test(value)) return false;
  const kanaRun = value.match(/[\u3040-\u30ff]+/g);
  if (kanaRun && kanaRun.some(run => run.length >= 5)) return false;
  return true;
}

function isControlNoiseLine(line: string): boolean {
  if (!line) return false;
  const normalized = line.trim().toLowerCase();
  if (!normalized) return false;
  if (/^[+\-–—\s]+$/.test(normalized)) return true;
  const compact = normalized.replace(/[^a-z0-9]/g, '');
  if (compact.length > 0) {
    if (STRONG_CONTROL_TOKENS.some(token => compact.includes(token))) return true;
    const weakHitCount = WEAK_CONTROL_TOKENS.reduce((count, token) => (compact.includes(token) ? count + 1 : count), 0);
    if (weakHitCount >= 2) return true;
  }
  if (CONTROL_NOISE_KEYWORD_REGEX.test(normalized)) {
    // Keep only long natural sentences; drop marker-like short control lines.
    if (normalized.length <= 48) return true;
    if (!/[\u4e00-\u9fa5]{2,}|[a-z]{4,}\s+[a-z]{4,}/i.test(normalized)) return true;
  }
  // Residual malformed markup (e.g. "< konotan_planning'>")
  if (/[<>]/.test(line)) return true;
  return false;
}

/**
 * 从消息中解析 `<maintext>`：先在原始块内抽取 `<dice>`，再净化正文（避免 dice 标签被 strip 掉导致骰子列表为空）。
 */
export function parseMaintextWithDice(messageContent: string): { maintext: string; dices: string[] } {
  const raw = extractTagBlock(messageContent, 'maintext');
  if (!raw) return { maintext: '', dices: [] };
  const { plainText, dices } = parseDiceSegments(raw);
  return {
    maintext: sanitizeMaintextContent(plainText),
    dices,
  };
}

export function parseMaintext(messageContent: string): string {
  return parseMaintextWithDice(messageContent).maintext;
}

export function parseDiceSegments(maintext: string): { plainText: string; dices: string[] } {
  if (!maintext) return { plainText: '', dices: [] };
  const dices = Array.from(maintext.matchAll(/<dice>([\s\S]*?)<\/dice>/gi))
    .map(match => (match[1] || '').trim())
    .filter(Boolean);
  const plainText = maintext.replace(/<dice>[\s\S]*?<\/dice>/gi, '').trim();
  return { plainText, dices };
}

export function parseWorld(messageContent: string): WorldState | null {
  const worldBlock = extractTagBlock(messageContent, 'world');
  const fieldInWorld = (tag: string) =>
    worldBlock ? (worldBlock.match(new RegExp(`<${tag}\\b[^>]*>([\\s\\S]*?)<\\/${tag}\\s*>`, 'i'))?.[1] || '').trim() : '';
  const loose = (tag: string) => extractTagBlock(messageContent, tag);
  const day = fieldInWorld('day') || loose('day');
  const time = fieldInWorld('time') || loose('time');
  const weather = fieldInWorld('weather') || loose('weather');
  const degree = fieldInWorld('degree') || loose('degree');
  const location = fieldInWorld('location') || loose('location');
  if (!day && !time && !weather && !degree && !location) return null;
  return { day, time, weather, degree, location };
}

export function parsePresence(messageContent: string): string[] {
  const block = extractTagBlock(messageContent, 'presence');
  if (!block || block === '无') return [];
  let cleaned = sanitizeOptionLikeLine(block);
  if (!cleaned || cleaned === '无') return [];
  cleaned = cleaned.replace(THINKING_OR_PLANNING_REGEX, ' ').trim();
  const tokens = splitPresenceSegments(cleaned)
    .map(item => sanitizeOptionLikeLine(normalizeListItemPrefix(item)))
    .filter(Boolean)
    .filter(item => !/^(?:暂无|未知|无|none|null|n\/a)$/i.test(item))
    .filter(item => !looksLikeThinkingChainOrPlanning(item))
    .filter(item => isLikelyPresenceEntry(item));
  const deduped = Array.from(new Set(tokens));
  return deduped.slice(0, 5);
}

export function parseInterest(messageContent: string): InterestPoint[] {
  const block = extractTagBlock(messageContent, 'interest');
  if (!block || block === '无') return [];
  const placeholderRegex = /^(?:暂无描述|无|未知|none|null|n\/a)(?:[（(].*[)）])?$/i;
  return block
    .split('\n')
    .map(line => sanitizeOptionLikeLine(line))
    .filter(Boolean)
    .map(line => normalizeListItemPrefix(line))
    .filter(line => !placeholderRegex.test(line))
    .filter(line => !looksLikeThinkingChainOrPlanning(line))
    .map(line => {
      const pair = line.match(/^(.{1,48}?)(?:\s*[-:：]\s*)(.{1,200})$/);
      if (!pair) return null;
      const target = pair[1].trim();
      const description = pair[2].trim();
      if (!target || !description) return null;
      if (placeholderRegex.test(target) || placeholderRegex.test(description)) return null;
      if (looksLikeThinkingChainOrPlanning(target) || looksLikeThinkingChainOrPlanning(description)) return null;
      if (!isLikelyInterestTarget(target)) return null;
      if (!isLikelyInterestDescription(description)) return null;
      return {
        target,
        description,
      };
    })
    .filter((item): item is InterestPoint => !!item)
    .slice(0, 4);
}

/** 解析 `<option id="A">...</option>`（可重复，id 转为大写） */
function parseOptionIdTags(fragment: string): Option[] {
  const optionWithIdRegex = /<option\b[^>]*\bid\s*=\s*["']?([^"'>\s]+)["']?[^>]*>([\s\S]*?)<\/option\s*>/gi;
  const optionsWithId: Option[] = [];
  let match: RegExpExecArray | null;
  while ((match = optionWithIdRegex.exec(fragment)) !== null) {
    const text = sanitizeOptionLikeLine(match[2] || '');
    if (!text) continue;
    optionsWithId.push({
      id: match[1].trim().toUpperCase(),
      text,
    });
  }
  return optionsWithId;
}

/**
 * 标准四选项：`<options><A>...</A><B>...</B><C>...</C><D>...</D></options>`（标签名不区分大小写）
 */
function parseOptionsAbcdTags(block: string): Option[] {
  const letters = ['A', 'B', 'C', 'D'] as const;
  const out: Option[] = [];
  for (const L of letters) {
    const re = new RegExp(`<${L}\\b[^>]*>([\\s\\S]*?)<\\/${L}\\s*>`, 'i');
    const m = block.match(re);
    if (!m) continue;
    const text = sanitizeOptionLikeLine(m[1] || '');
    if (text) out.push({ id: L, text });
  }
  return out;
}

export function parseOptions(messageContent: string): Option[] {
  if (!messageContent) return [];
  const cleaned = removeReasoningBlocks(messageContent);
  // 仅使用 `<options>...</options>` 作为结构化容器；勿用 `<option>` 作容器（多段 `<option id>` 时 extractTagBlock 会取错）
  const optionsBlock = extractTagBlock(cleaned, 'options');

  if (optionsBlock) {
    const abcd = parseOptionsAbcdTags(optionsBlock);
    if (abcd.length > 0) return abcd;

    const nestedById = parseOptionIdTags(optionsBlock);
    if (nestedById.length > 0) return nestedById;

    const lines = optionsBlock
      .split('\n')
      .map(line => sanitizeOptionLikeLine(line))
      .filter(Boolean);

    const optionPattern = /^([A-D])\.\s*(.*)$/i;
    const parsed = lines
      .map(line => {
        const matched = line.match(optionPattern);
        if (!matched) return null;
        return {
          id: matched[1].toUpperCase(),
          text: matched[2].trim(),
        };
      })
      .filter((item): item is Option => !!item && !!item.text);

    if (parsed.length > 0) return parsed;

    const fallback = lines
      .filter(line => !/^[A-Za-z_][\w-]*$/.test(line))
      .slice(0, 6);
    if (fallback.length > 0) {
      return fallback.map((line, index) => ({
        id: String.fromCharCode(65 + index),
        text: line,
      }));
    }
  }

  const globalById = parseOptionIdTags(cleaned);
  if (globalById.length > 0) return globalById;

  // 无 `<options>` 时在全文中找 `<A>`…`<D>`，但排除 `<maintext>` 内容易误匹配的片段
  const withoutMaintext = cleaned.replace(/<maintext\b[^>]*>[\s\S]*?<\/maintext\s*>/gi, '');
  return parseOptionsAbcdTags(withoutMaintext);
}

export function loadFromLatestMessage(): {
  maintext: string;
  options: Option[];
  messageId?: number;
  userMessageId?: number;
  fullMessage?: string;
} {
  try {
    const lastMessageId = getLastMessageId();
    if (lastMessageId < 0) return { maintext: '', options: [] };

    const messages = getChatMessages(lastMessageId, { role: 'assistant' });
    if (!messages || messages.length === 0) return { maintext: '', options: [] };

    const latestAssistantMessage = messages[0];
    const messageContent = latestAssistantMessage.message || '';
    const maintext = parseMaintext(messageContent);
    const options = parseOptions(messageContent);

    let userMessageId: number | undefined;
    if (latestAssistantMessage.message_id > 0) {
      const userMessages = getChatMessages(latestAssistantMessage.message_id - 1, { role: 'user' });
      if (userMessages && userMessages.length > 0) userMessageId = userMessages[0].message_id;
    }

    return {
      maintext,
      options,
      messageId: latestAssistantMessage.message_id,
      userMessageId,
      fullMessage: messageContent,
    };
  } catch (error) {
    console.error('[messageParser] 加载最新消息失败:', error);
    return { maintext: '', options: [] };
  }
}

