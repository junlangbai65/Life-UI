/**
 * 从 MVU / 消息楼层变量读取 Goth 界面补丁（对齐指南优先级思想的精简版）
 */

import { mergeWith } from 'lodash';
import type { CharacterState, GothGameSnapshot } from '../goth.types';
import { createDemoSnapshot } from './demoData';
import { isChineseGothStatShape, mapChineseStatToGothPatch } from './chineseStatMapper';

const GOTH_UI_KEYS = ['goth_ui', 'goth_snapshot', 'goth'] as const;

function hasStatDataContent(stat_data: unknown): boolean {
  return !!(stat_data && typeof stat_data === 'object' && Object.keys(stat_data as object).length > 0);
}

function extractGothPatch(stat_data: Record<string, unknown>): Partial<GothGameSnapshot> | null {
  for (const key of GOTH_UI_KEYS) {
    const blob = stat_data[key];
    if (blob && typeof blob === 'object' && !Array.isArray(blob)) {
      return blob as Partial<GothGameSnapshot>;
    }
  }
  if (isChineseGothStatShape(stat_data)) {
    return mapChineseStatToGothPatch(stat_data);
  }
  return null;
}

/** 从 MVU 消息变量读取（若框架可用） */
function tryMvuMessage(message_id: number | 'latest'): Record<string, unknown> | null {
  try {
    if (typeof Mvu === 'undefined') return null;
    const data = Mvu.getMvuData({ type: 'message', message_id });
    const stat = data?.stat_data;
    if (stat && hasStatDataContent(stat)) {
      return stat as Record<string, unknown>;
    }
  } catch {
    /* MVU 未就绪或非 MVU 卡 */
  }
  return null;
}

function tryVariables(message_id: number | 'latest'): Record<string, unknown> | null {
  try {
    const vars = getVariables({ type: 'message', message_id });
    const stat = vars?.stat_data;
    if (stat && hasStatDataContent(stat)) {
      return stat as Record<string, unknown>;
    }
  } catch {
    /* */
  }
  return null;
}

/** 部分角色卡把 MVU 写在聊天级变量上 */
function tryChatStatData(): Record<string, unknown> | null {
  try {
    const vars = getVariables({ type: 'chat' });
    const stat = vars?.stat_data;
    if (stat && hasStatDataContent(stat)) {
      return stat as Record<string, unknown>;
    }
  } catch {
    /* */
  }
  return null;
}

/**
 * 仅从指定 assistant **楼层**读取 MVU / stat_data（用于手动回看某一楼，不与聊天级回退混用）。
 */
export function readGothUiPartialForAssistantFloor(messageId: number): Partial<GothGameSnapshot> | null {
  try {
    const fromMvu = tryMvuMessage(messageId);
    if (fromMvu) {
      const patch = extractGothPatch(fromMvu);
      if (patch) return patch;
    }
    const assistants = getChatMessages(messageId, { role: 'assistant' });
    const row = assistants.length ? assistants[assistants.length - 1] : undefined;
    if (row?.data?.stat_data) {
      const stat = row.data.stat_data as Record<string, unknown>;
      if (hasStatDataContent(stat)) {
        const patch = extractGothPatch(stat);
        if (patch) return patch;
      }
    }
    const all = getChatMessages(messageId);
    const asst = [...all].reverse().find(m => m.role === 'assistant');
    const stat = asst?.data?.stat_data as Record<string, unknown> | undefined;
    if (stat && hasStatDataContent(stat)) {
      const patch = extractGothPatch(stat);
      if (patch) return patch;
    }
  } catch (error) {
    console.warn('[Goth] 从指定楼层读取 MVU 失败:', error);
  }
  return null;
}

/**
 * 将指定 assistant 楼层的 MVU 补丁与演示快照合并后取出 `character`。
 * `patchHadCharacter`：补丁中是否包含 `character` 对象（无则不应与上一楼做数值对比，以免全是占位默认值）。
 */
export function readMergedCharacterFromAssistantFloor(messageId: number): {
  character: CharacterState;
  patchHadCharacter: boolean;
} | null {
  const patch = readGothUiPartialForAssistantFloor(messageId);
  if (!patch || Object.keys(patch).length === 0) return null;
  const patchHadCharacter = patch.character != null && typeof patch.character === 'object';
  const merged = mergeGothSnapshot(createDemoSnapshot(), patch);
  return { character: merged.character, patchHadCharacter };
}

/**
 * 返回应合并进 GothGameSnapshot 的部分数据；若不存在 UI 块则返回 null
 *
 * 读取顺序说明：MVU 文档推荐用 `message_id: 'latest'` 表示当前聊天末尾的变量视图。
 * 若优先使用「某一 assistant 楼层的数字 message_id」，得到的多半是该楼生成时的快照，
 * 后续 `_.set('主角数值.SAN值', …)` 等更新不会反映在该楼层副本上，界面会卡在例如 100/100。
 */
export function readGothUiPartialFromTavern(): Partial<GothGameSnapshot> | null {
  try {
    const liveSources = [tryMvuMessage('latest'), tryVariables('latest'), tryChatStatData()];
    for (const raw of liveSources) {
      if (!raw) continue;
      const patch = extractGothPatch(raw);
      if (patch) return patch;
    }

    const assistantMessages = getChatMessages(-1, { role: 'assistant' });
    if (assistantMessages.length > 0) {
      const latestAssistant = assistantMessages[assistantMessages.length - 1];
      const mid = latestAssistant.message_id;
      const fromAssistantMvu = tryMvuMessage(mid);
      if (fromAssistantMvu) {
        const patch = extractGothPatch(fromAssistantMvu);
        if (patch) return patch;
      }
      const dataField = latestAssistant.data?.stat_data as Record<string, unknown> | undefined;
      if (dataField && hasStatDataContent(dataField)) {
        const patch = extractGothPatch(dataField);
        if (patch) return patch;
      }
    }

    const zeroMvu = tryMvuMessage(0);
    if (zeroMvu) {
      const patch = extractGothPatch(zeroMvu);
      if (patch) return patch;
    }

    const zeroVars = tryVariables(0);
    if (zeroVars) {
      const patch = extractGothPatch(zeroVars);
      if (patch) return patch;
    }
  } catch (error) {
    console.warn('[Goth] readGothUiPartialFromTavern 失败:', error);
  }

  return null;
}

/** patch 中给出的数组字段整段替换，避免 lodash merge 按索引残留旧元素 */
const REPLACE_ARRAY_KEYS = new Set([
  'backpackItems',
  'storageLocations',
  'searchResults',
  'activeCases',
  'relations',
  'accessoryItems',
  'enemies',
  'skills',
  'attributes',
  'statusShallow',
  'statusMid',
  'statusDeep',
  'regions',
]);

/** 将补丁合并进当前快照（嵌套对象递归合并；指定键的数组整段替换） */
export function mergeGothSnapshot(base: GothGameSnapshot, patch: Partial<GothGameSnapshot>): GothGameSnapshot {
  return mergeWith({}, base, patch, (_baseVal, patchVal, key) => {
    if (key === 'bodyDevelopment' && Array.isArray(patchVal)) {
      return patchVal;
    }
    if (Array.isArray(patchVal) && REPLACE_ARRAY_KEYS.has(String(key))) {
      return patchVal;
    }
    return undefined;
  }) as GothGameSnapshot;
}
