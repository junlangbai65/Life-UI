import YAML from 'yaml';

function removeReasoningBlocks(message: string): string {
  if (!message) return '';
  let cleaned = message.replace(/<thinking>[\s\S]*?<\/thinking>/gi, '');
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

function extractTagBlock(message: string, tagName: string): string {
  if (!message) return '';
  const cleaned = removeReasoningBlocks(message);
  const regex = new RegExp(`<${tagName}\\b[^>]*>([\\s\\S]*?)<\\/${tagName}\\s*>`, 'i');
  const matched = cleaned.match(regex);
  return matched?.[1]?.trim() ?? '';
}

function stripCodeFence(raw: string): string {
  if (!raw) return '';
  return raw.replace(/^```(?:yaml|yml|json)?\s*/i, '').replace(/\s*```$/, '').trim();
}

/**
 * 解析 assistant 消息中的 <stat_data>，支持 YAML / JSON。
 */
export function parseStatDataFromMessage(message: string): Record<string, unknown> | null {
  const block = extractTagBlock(message, 'stat_data');
  if (!block) return null;
  const content = stripCodeFence(block);
  if (!content) return null;

  try {
    const yamlData = YAML.parse(content);
    if (yamlData && typeof yamlData === 'object') {
      return yamlData as Record<string, unknown>;
    }
  } catch {
    // fallback to JSON parse
  }

  try {
    const jsonData = JSON.parse(content);
    if (jsonData && typeof jsonData === 'object') {
      return jsonData as Record<string, unknown>;
    }
  } catch {
    // ignore
  }

  return null;
}

export function replaceStatDataInMessage(message: string, statDataRoot: Record<string, unknown>): string {
  const yamlText = YAML.stringify(statDataRoot).trim();
  const wrapped = `<stat_data>\n${yamlText}\n</stat_data>`;
  if (/<stat_data>[\s\S]*?<\/stat_data>/i.test(message)) {
    return message.replace(/<stat_data>[\s\S]*?<\/stat_data>/i, wrapped);
  }
  return `${message.trim()}\n\n${wrapped}`;
}

