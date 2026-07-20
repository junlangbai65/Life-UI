import type { MvuCharacter, MvuStatData } from '../schema';
import { Schema } from '../schema';
import { getAssistantMessageIdsSorted } from './messageParser';

export type NumericDeltaKey = '感染进程' | '性欲';

export type CharacterCompareResult = {
  numericDeltas: Partial<Record<NumericDeltaKey, number>>;
  changedFields: Set<string>;
  hasDelta: boolean;
};

export function getPreviousFloorId(): number {
  return Math.max(0, getCurrentMessageId() - 1);
}

export function getPreviousAssistantMessageId(messageId: number): number | null {
  if (messageId < 0) return null;
  const ids = getAssistantMessageIdsSorted();
  const idx = ids.indexOf(messageId);
  if (idx <= 0) return null;
  return ids[idx - 1] ?? null;
}

export function readStatDataForFloor(messageId: number): MvuStatData | null {
  if (messageId < 0) return null;

  try {
    const mvuData = Mvu.getMvuData({ type: 'message', message_id: messageId });
    const result = Schema.safeParse(_.get(mvuData, 'stat_data', {}));
    if (result.success) return result.data;
  } catch {
    /* ignore */
  }

  try {
    const vars = getVariables({ type: 'message', message_id: messageId });
    const result = Schema.safeParse(_.get(vars, 'stat_data', {}));
    if (result.success) return result.data;
  } catch {
    /* ignore */
  }

  return null;
}

export function resolvePreviousCharacter(
  previousStat: MvuStatData | null,
  characterKey: string,
): MvuCharacter | null {
  if (!previousStat) return null;
  const chars = previousStat.角色 ?? {};
  if (chars[characterKey]) return chars[characterKey];
  const keys = Object.keys(chars);
  return keys.length > 0 ? chars[keys[0]] : null;
}

export function compareCharacter(
  current: MvuCharacter,
  previous: MvuCharacter | null,
): CharacterCompareResult {
  const numericDeltas: Partial<Record<NumericDeltaKey, number>> = {};
  const changedFields = new Set<string>();

  if (!previous) {
    return { numericDeltas, changedFields, hasDelta: false };
  }

  for (const key of ['感染进程', '性欲'] as const) {
    const delta = current[key] - previous[key];
    if (delta !== 0) {
      numericDeltas[key] = delta;
      changedFields.add(key);
    }
  }

  for (const key of ['姿态', '上身', '下身', '鞋袜', '感染状态', '姓名'] as const) {
    if (current[key] !== previous[key]) {
      changedFields.add(key);
    }
  }

  return {
    numericDeltas,
    changedFields,
    hasDelta: changedFields.size > 0,
  };
}

export function didDesireRollbackToZero(
  current: MvuCharacter,
  previous: MvuCharacter | null,
): boolean {
  if (!previous) return false;
  return previous.性欲 > 0 && current.性欲 === 0;
}
