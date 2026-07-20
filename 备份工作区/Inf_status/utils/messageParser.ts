import type { GameOption } from '../types/game.types';

function stripThinkingBlocks(content: string): string {
  let cleaned = content.replace(/<thinking>[\s\S]*?<\/thinking>/gi, '');
  cleaned = cleaned.replace(/<think>[\s\S]*?<\/redacted_thinking>/gi, '');
  cleaned = cleaned.replace(/<redacted_reasoning>[\s\S]*?<\/redacted_reasoning>/gi, '');

  const thinkingStart = cleaned.search(/<thinking>/i);
  if (thinkingStart !== -1) cleaned = cleaned.slice(0, thinkingStart);
  const redactedStart = cleaned.search(/<think>/i);
  if (redactedStart !== -1) cleaned = cleaned.slice(0, redactedStart);
  return cleaned;
}

export function parseMaintext(messageContent: string): string {
  if (!messageContent) return '';
  const cleaned = stripThinkingBlocks(messageContent);
  const matches = cleaned.match(/<maintext>([\s\S]*?)<\/maintext>/gi);
  if (!matches?.length) return '';
  const lastMatch = matches[matches.length - 1];
  const content = lastMatch.match(/<maintext>([\s\S]*?)<\/maintext>/i);
  return content?.[1]?.trim() ?? '';
}

export function parseOptions(messageContent: string): GameOption[] {
  if (!messageContent) return [];
  const cleaned = stripThinkingBlocks(messageContent);

  const optionWithIdRegex = /<option\s+id="([^"]+)">([\s\S]*?)<\/option>/gi;
  const optionsWithId: GameOption[] = [];
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
    const options: GameOption[] = [];
    let currentOption: string[] = [];

    for (const line of lines) {
      if (optionPattern.test(line)) {
        if (currentOption.length > 0) {
          const text = currentOption.join('\n');
          const id = text.match(/^([A-Z])\./)?.[1] ?? String.fromCharCode(65 + options.length);
          options.push({ id, text: text.replace(/^[A-Z]\.\s*/, '').trim() });
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
      options.push({ id, text: text.replace(/^[A-Z]\.\s*/, '').trim() });
    }
    return options;
  }

  return lines.map((line, index) => ({
    id: String.fromCharCode(65 + index),
    text: line,
  }));
}

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

export function resolveAssistantMessageId(pinnedAssistantMessageId: number | null): number {
  const ids = getAssistantMessageIdsSorted();
  const lastId = ids.length ? ids[ids.length - 1] : -1;
  if (pinnedAssistantMessageId !== null && ids.includes(pinnedAssistantMessageId)) {
    return pinnedAssistantMessageId;
  }
  return lastId;
}

export function hasRenderableTag(content: string): boolean {
  return /<(maintext|stat_data|option|options)\b[^>]*>/i.test(content);
}

export function hasRenderablePayload(content: string): boolean {
  if (!content) return false;
  if (parseMaintext(content).trim()) return true;
  if (parseOptions(content).length > 0) return true;
  return /<stat_data\b/i.test(content);
}

/** 是否应隐藏该 assistant 楼层 `.mes_text` 内的原始 DOM（界面 iframe 仍可见） */
export function shouldHideRawTextForMessage(content: string): boolean {
  return hasRenderableTag(content) && hasRenderablePayload(content);
}

export function getAssistantMessageContent(messageId: number = getCurrentMessageId()): string {
  if (messageId < 0) return '';
  const messages = getChatMessages(messageId, { role: 'assistant' });
  if (messages.length > 0) return messages[messages.length - 1].message;
  const all = getChatMessages(messageId, { role: 'all' });
  const assistant = [...all].reverse().find(m => m.role === 'assistant');
  return assistant?.message ?? '';
}
