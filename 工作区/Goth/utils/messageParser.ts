/**
 * 消息解析工具：从 assistant（或回退为当前楼层）消息中解析
 * `<maintext>`、`<option>`、`<mission>` 等标签。
 * 思路对齐 `.cursor/rules/前端项目改造指南.mdc`；剔除 `<thinking>` / `<redacted_*>` 内内容后再提取标签。
 */

/** 与叙事选项 chips 一致 */
export interface GothParsedOption {
  id: string;
  text: string;
}

/** 规范文档中的选项类型别名 */
export type Option = GothParsedOption;

/** `<mission>` 任务块（可由界面后续接入） */
export interface GothParsedMission {
  id: string;
  text: string;
}

/** `<interest>` 内单行：`兴趣点标题-描述`（至多 4 条） */
export interface GothNarrativeInterest {
  title: string;
  description: string;
}

function stripThinkingBlocks(content: string): string {
  let cleaned = content.replace(/<thinking>[\s\S]*?<\/thinking>/gi, '');
  cleaned = cleaned.replace(/<think>[\s\S]*?<\/redacted_thinking>/gi, '');
  cleaned = cleaned.replace(/<redacted_reasoning>[\s\S]*?<\/redacted_reasoning>/gi, '');

  const thinkingStart = cleaned.search(/<thinking>/i);
  if (thinkingStart !== -1) {
    cleaned = cleaned.slice(0, thinkingStart);
  }
  const redactedStart = cleaned.search(/<think>/i);
  if (redactedStart !== -1) {
    cleaned = cleaned.slice(0, redactedStart);
  }
  return cleaned;
}

/**
 * 解析消息正文：只使用剔除 thinking 后的文本中**最后一个** `<maintext>...</maintext>`。
 */
export function parseMaintext(messageContent: string): string {
  if (!messageContent) return '';
  const cleaned = stripThinkingBlocks(messageContent);
  const matches = cleaned.match(/<maintext>([\s\S]*?)<\/maintext>/gi);
  if (!matches || matches.length === 0) return '';
  const lastMatch = matches[matches.length - 1];
  const content = lastMatch.match(/<maintext>([\s\S]*?)<\/maintext>/i);
  return content?.[1]?.trim() ?? '';
}

/**
 * 解析 `<option>`：
 * 1. `<option id="A">...</option>`（支持多行正文）
 * 2. `<option>` 块内 `A. xxx` / 多行字母前缀，或简单逐行选项
 */
export function parseOptions(messageContent: string): GothParsedOption[] {
  if (!messageContent) return [];
  const cleaned = stripThinkingBlocks(messageContent);

  const optionWithIdRegex = /<option\s+id="([^"]+)">([\s\S]*?)<\/option>/gi;
  const optionsWithId: GothParsedOption[] = [];
  let match;
  while ((match = optionWithIdRegex.exec(cleaned)) !== null) {
    optionsWithId.push({ id: match[1], text: match[2].trim() });
  }
  if (optionsWithId.length > 0) return optionsWithId;

  const optionMatch = cleaned.match(/<option>([\s\S]*?)<\/option>/i);
  if (!optionMatch) return [];

  const optionText = optionMatch[1].trim();
  const lines = optionText
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0);

  const optionPattern = /^[A-Z]\.\s*/;
  const hasLetterPrefix = lines.some(line => optionPattern.test(line));

  if (hasLetterPrefix) {
    const options: GothParsedOption[] = [];
    let currentOption: string[] = [];

    for (const line of lines) {
      if (optionPattern.test(line)) {
        if (currentOption.length > 0) {
          const text = currentOption.join('\n');
          const id = text.match(/^([A-Z])\./)?.[1] ?? String.fromCharCode(65 + options.length);
          options.push({
            id,
            text: text.replace(/^[A-Z]\.\s*/, '').trim(),
          });
          currentOption = [];
        }
        currentOption.push(line);
      } else if (currentOption.length > 0) {
        currentOption.push(line);
      }
    }
    if (currentOption.length > 0) {
      const text = currentOption.join('\n');
      const id = text.match(/^([A-Z])\./)?.[1] ?? String.fromCharCode(65 + options.length);
      options.push({
        id,
        text: text.replace(/^[A-Z]\.\s*/, '').trim(),
      });
    }
    return options;
  }

  return lines.map((line, index) => ({
    id: String.fromCharCode(65 + index),
    text: line,
  }));
}

/**
 * 从 AI 回复中取 **最后一个** `<time>...</time>`（剔除 thinking 后），规范为 `HH:MM` 或 `HH:MM:SS`。
 * 标准示例：`<time>14:30</time>`
 */
export function parseNarrativeTime(messageContent: string): string | null {
  if (!messageContent) return null;
  const cleaned = stripThinkingBlocks(messageContent);
  const matches = [...cleaned.matchAll(/<time\b[^>]*>([\s\S]*?)<\/time>/gi)];
  if (matches.length === 0) return null;
  const raw = matches[matches.length - 1][1].trim().replace(/\s+/g, '');
  const m = raw.match(/^(\d{1,2}):(\d{2})(?::(\d{2}))?$/);
  if (!m) return null;
  const h = parseInt(m[1], 10);
  const min = parseInt(m[2], 10);
  const sec = m[3] !== undefined ? parseInt(m[3], 10) : undefined;
  if (Number.isNaN(h) || Number.isNaN(min) || h > 23 || min > 59) return null;
  if (sec !== undefined && (Number.isNaN(sec) || sec > 59)) return null;
  const hh = String(h).padStart(2, '0');
  const mm = String(min).padStart(2, '0');
  if (sec !== undefined) return `${hh}:${mm}:${String(sec).padStart(2, '0')}`;
  return `${hh}:${mm}`;
}

/**
 * 从 AI 回复中取 **最后一个** `<degree>...</degree>` 正文（剔除 thinking 与内嵌标签）。
 * 标准示例：`<degree>24℃</degree>`
 */
export function parseNarrativeDegree(messageContent: string): string | null {
  if (!messageContent) return null;
  const cleaned = stripThinkingBlocks(messageContent);
  const matches = [...cleaned.matchAll(/<degree\b[^>]*>([\s\S]*?)<\/degree>/gi)];
  if (matches.length === 0) return null;
  const inner = matches[matches.length - 1][1].replace(/<[^>]+>/g, '').trim().replace(/\s+/g, '');
  if (!inner || inner.length > 28) return null;
  return inner;
}

/**
 * 从 AI 回复中取 **最后一个** `<presence>...</presence>`，解析在场实体名称。
 * 标准示例：`<presence>-杰克-,-狗-,-深潜者-</presence>`
 * 逗号分隔；每项可包 `-名称-`；展示时去掉分隔符与常见标点，仅保留字母数字与中日韩等文字。
 */
export function parseNarrativePresence(messageContent: string): string[] {
  if (!messageContent) return [];
  const cleaned = stripThinkingBlocks(messageContent);
  const matches = [...cleaned.matchAll(/<presence\b[^>]*>([\s\S]*?)<\/presence>/gi)];
  if (matches.length === 0) return [];
  const inner = matches[matches.length - 1][1].replace(/<[^>]+>/g, '').trim();
  if (!inner || inner.length > 512) return [];

  const parts = inner.split(/[,，]/).map(p => p.trim()).filter(Boolean);
  const out: string[] = [];
  const seen = new Set<string>();

  const dashEdge = /^[\u2013\u2014﹣－-]+|[\u2013\u2014﹣－-]+$/g;
  for (const raw of parts) {
    let s = raw.replace(dashEdge, '').trim();
    s = s.replace(/[^\p{L}\p{M}\p{N}\s]/gu, ' ');
    s = s.replace(/\s+/g, ' ').trim();
    if (!s || s.length > 48) continue;
    const key = s.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(s);
    if (out.length >= 32) break;
  }

  return out;
}

/**
 * 最后一个 `<interest>...</interest>`：按行解析，格式 `标题-描述`（首个 `-／－–—:：` 为界），至多 4 条。
 */
export function parseNarrativeInterests(messageContent: string): GothNarrativeInterest[] {
  if (!messageContent) return [];
  const cleaned = stripThinkingBlocks(messageContent);
  const matches = [...cleaned.matchAll(/<interest\b[^>]*>([\s\S]*?)<\/interest>/gi)];
  if (matches.length === 0) return [];
  const inner = matches[matches.length - 1][1];
  if (!inner || inner.length > 2048) return [];

  const lines = inner
    .split(/\n/)
    .map(l => l.trim())
    .filter(Boolean);

  const out: GothNarrativeInterest[] = [];
  const delim = /[-－–—﹣:：]/;

  for (const line of lines) {
    if (out.length >= 4) break;
    const plain = line.replace(/<[^>]+>/g, '').trim();
    if (!plain) continue;

    const m = plain.match(delim);
    if (!m || m.index === undefined || m.index <= 0) {
      out.push({ title: plain.slice(0, 56), description: '' });
      continue;
    }
    const title = plain.slice(0, m.index).trim();
    let description = plain.slice(m.index + m[0].length).trim();
    description = description.replace(/^[-－–—﹣:：\s]+/, '').trim();
    if (!title) continue;
    out.push({
      title: title.slice(0, 64),
      description: description.slice(0, 320),
    });
  }

  return out;
}

/**
 * 最后一个 `<options>...</options>` 内 `<A>...</A>`、`<B>...</B>` 等（标签名为单字母选项 id）。
 */
export function parseTaggedOptions(messageContent: string): GothParsedOption[] {
  if (!messageContent) return [];
  const cleaned = stripThinkingBlocks(messageContent);
  const matches = [...cleaned.matchAll(/<options\b[^>]*>([\s\S]*?)<\/options>/gi)];
  if (matches.length === 0) return [];
  const inner = matches[matches.length - 1][1];
  const out: GothParsedOption[] = [];

  for (let i = 0; i < 26; i++) {
    const letter = String.fromCharCode(65 + i);
    const re = new RegExp(`<${letter}\\b[^>]*>([\\s\\S]*?)<\\/${letter}>`, 'i');
    const m = inner.match(re);
    if (!m) continue;
    const text = m[1].replace(/<[^>]+>/g, '').trim();
    if (text) out.push({ id: letter, text: text.slice(0, 2000) });
  }

  return out;
}

/**
 * 叙事选项：优先 `<options>` 内 `<A>`…；否则沿用 `<option>` 系列解析。
 */
export function parseNarrativeOptionsMerged(messageContent: string): GothParsedOption[] {
  const tagged = parseTaggedOptions(messageContent);
  if (tagged.length > 0) return tagged;
  return parseOptions(messageContent);
}

/**
 * 解析 `<mission>` / `<mission id="...">...</mission>`（剔除 thinking 后按文档顺序）
 */
export function parseMissions(messageContent: string): GothParsedMission[] {
  if (!messageContent) return [];
  const cleaned = stripThinkingBlocks(messageContent);

  const withId = /<mission\s+id="([^"]+)">([\s\S]*?)<\/mission>/gi;
  const out: GothParsedMission[] = [];
  let m;
  while ((m = withId.exec(cleaned)) !== null) {
    out.push({ id: m[1], text: m[2].trim() });
  }
  if (out.length > 0) return out;

  const bare = /<mission>([\s\S]*?)<\/mission>/gi;
  let i = 0;
  while ((m = bare.exec(cleaned)) !== null) {
    const text = m[1].trim();
    if (text) out.push({ id: `M${i + 1}`, text });
    i += 1;
  }
  return out;
}

export interface LoadFromLatestMessageResult {
  maintext: string;
  options: GothParsedOption[];
  missions: GothParsedMission[];
  /** 来自 `<time>` 的叙事时钟（24h 显示串） */
  narrativeTime: string | null;
  /** 来自 `<degree>` 的气温展示串（如 `24℃`） */
  narrativeDegree: string | null;
  /** 来自 `<presence>` 的在场实体名称列表（已去符号） */
  narrativePresence: string[];
  /** 来自 `<interest>` 的兴趣点列表 */
  narrativeInterests: GothNarrativeInterest[];
  messageId?: number;
  userMessageId?: number;
  fullMessage?: string;
}

function resolveUserMessageId(assistantMessageId: number): number | undefined {
  if (assistantMessageId <= 0) return undefined;
  try {
    const prev = getChatMessages(assistantMessageId - 1, { role: 'user' });
    if (!prev.length) return undefined;
    return prev[prev.length - 1].message_id;
  } catch {
    return undefined;
  }
}

/** 当前聊天内全部 assistant 楼层 message_id（升序） */
export function getAssistantMessageIdsSorted(): number[] {
  try {
    const last = getLastMessageId();
    if (last < 0) return [];
    const rows = getChatMessages(`0-${last}`, { role: 'assistant' });
    return rows.map(m => m.message_id);
  } catch {
    return [];
  }
}

/**
 * 从指定 **楼层号** `messageId` 读取 AI 正文：优先该楼 assistant；若无则取该楼最后一条 assistant 角色消息。
 */
export function loadFromMessage(messageId: number): LoadFromLatestMessageResult {
  const empty: LoadFromLatestMessageResult = {
    maintext: '',
    options: [],
    missions: [],
    narrativeTime: null,
    narrativeDegree: null,
    narrativePresence: [],
    narrativeInterests: [],
  };
  try {
    if (messageId < 0) return empty;

    const rows = getChatMessages(messageId, { role: 'assistant' });
    let latest = rows.length ? rows[rows.length - 1] : undefined;

    if (!latest) {
      const all = getChatMessages(messageId);
      latest = [...all].reverse().find(m => m.role === 'assistant');
    }

    if (!latest) return empty;

    const messageContent = latest.message ?? '';
    const maintext = parseMaintext(messageContent);
    const options = parseNarrativeOptionsMerged(messageContent);
    const missions = parseMissions(messageContent);
    const narrativeTime = parseNarrativeTime(messageContent);
    const narrativeDegree = parseNarrativeDegree(messageContent);
    const narrativePresence = parseNarrativePresence(messageContent);
    const narrativeInterests = parseNarrativeInterests(messageContent);
    const userMessageId = resolveUserMessageId(latest.message_id);

    return {
      maintext,
      options,
      missions,
      narrativeTime,
      narrativeDegree,
      narrativePresence,
      narrativeInterests,
      messageId: latest.message_id,
      userMessageId,
      fullMessage: messageContent,
    };
  } catch (error) {
    console.warn('[Goth] loadFromMessage 失败:', error);
    return empty;
  }
}

/**
 * 从当前聊天**最新楼层**读取：优先该楼 assistant 正文；若无则回退为该楼任意角色消息。
 */
export function loadFromLatestMessage(): LoadFromLatestMessageResult {
  const empty: LoadFromLatestMessageResult = {
    maintext: '',
    options: [],
    missions: [],
    narrativeTime: null,
    narrativeDegree: null,
    narrativePresence: [],
    narrativeInterests: [],
  };
  try {
    const lastMessageId = getLastMessageId();
    if (lastMessageId < 0) return empty;
    return loadFromMessage(lastMessageId);
  } catch (error) {
    console.warn('[Goth] loadFromLatestMessage 失败:', error);
    return empty;
  }
}
