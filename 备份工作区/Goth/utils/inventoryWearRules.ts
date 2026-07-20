import type { BackpackItem, EquipmentSlotKey } from '../goth.types';

/** 与 MVU 装备槽中文名对齐：仅这些类别的「物品」可装备 */
export const WEAR_CATEGORY_CN_TO_SLOT: Record<string, EquipmentSlotKey> = {
  头部: 'head',
  上身: 'body',
  下身: 'legs',
  内衣: 'underwear_top',
  内裤: 'underwear_bottom',
  鞋子: 'shoes',
  袜子: 'socks',
  手套: 'gloves',
  武器: 'weapon',
  饰品: 'accessory',
};

const ALLOWED_SLOTS = new Set<EquipmentSlotKey>(Object.values(WEAR_CATEGORY_CN_TO_SLOT));

/**
 * 解析背包条目应穿上的槽位；不满足「物品 + 合法穿戴类别」时返回 null。
 * 优先 `equipSlot`（MVU 穿戴部位）；否则用 `itemType` 匹配上表中文。
 */
export function resolveWearTargetSlot(item: BackpackItem): EquipmentSlotKey | null {
  if (item.type !== '物品') return null;
  if (item.equipSlot && ALLOWED_SLOTS.has(item.equipSlot)) return item.equipSlot;
  const label = item.itemType?.trim();
  if (label && WEAR_CATEGORY_CN_TO_SLOT[label]) return WEAR_CATEGORY_CN_TO_SLOT[label];
  return null;
}

export function canWearBackpackItem(item: BackpackItem): boolean {
  return resolveWearTargetSlot(item) !== null;
}
