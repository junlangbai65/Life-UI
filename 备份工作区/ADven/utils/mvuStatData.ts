import { parseStatDataFromMessage } from './statDataParser';

/**
 * 从 MVU / 酒馆消息楼层变量读取 `stat_data`（与 `<stat_data>` 标签解析互为补充）
 */

export function isUsableStatData(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === 'object' && !Array.isArray(value) && Object.keys(value as object).length > 0;
}

/**
 * 读取指定消息楼层上的 `stat_data` 变量（MVU 写入的位置）
 */
export function readStatDataFromMessageVariables(messageId: number): Record<string, unknown> | null {
  if (messageId < 0) return null;
  try {
    const vars = getVariables({ type: 'message', message_id: messageId });
    const raw = _.get(vars, 'stat_data');
    if (isUsableStatData(raw)) {
      return raw;
    }
  } catch (error) {
    console.warn('[ADven] 读取消息楼层 stat_data 失败:', error);
  }
  return null;
}

/**
 * 合并解析顺序：优先消息变量（MVU），其次消息正文中的 `<stat_data>`
 */
export function resolveStatDataFromMvuOrMessage(
  messageContent: string | undefined,
  messageIdForVariables: number | null,
  fallbackMessageId?: number | null,
): Record<string, unknown> | null {
  if (messageIdForVariables !== null && messageIdForVariables >= 0) {
    const fromVars = readStatDataFromMessageVariables(messageIdForVariables);
    if (fromVars) return fromVars;
  }
  if (fallbackMessageId !== null && fallbackMessageId !== undefined && fallbackMessageId >= 0) {
    const fromFallback = readStatDataFromMessageVariables(fallbackMessageId);
    if (fromFallback) return fromFallback;
  }
  if (messageContent) {
    return parseStatDataFromMessage(messageContent);
  }
  return null;
}
