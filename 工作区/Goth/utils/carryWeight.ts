import type { AccessoryItem, BackpackItem, EquipmentSlots, EquipmentSlotKey } from '../goth.types';

const EQUIP_WEIGHT_SLOTS: EquipmentSlotKey[] = [
  'head',
  'body',
  'legs',
  'underwear_top',
  'underwear_bottom',
  'shoes',
  'socks',
  'gloves',
  'weapon',
  'accessory',
];

/** 已穿戴装备（含单槽饰品）总负重，单位 kg */
export function sumEquippedPiecesWeightKg(slots: EquipmentSlots): number {
  let w = 0;
  for (const k of EQUIP_WEIGHT_SLOTS) {
    const p = slots[k];
    if (p) w += Number.isFinite(p.weight) ? p.weight : 0;
  }
  return w;
}

/** MVU「饰品」列表额外负重（与 equipmentSlots.accessory 并存时两者皆计入，避免解析遗漏） */
export function sumAccessoryItemsWeightKg(items: AccessoryItem[]): number {
  return items.reduce((s, a) => s + (Number.isFinite(a.weight) ? a.weight : 0), 0);
}

/** 背包内物品总负重（单件负重 × 数量），单位 kg */
export function sumBackpackWeightKg(items: BackpackItem[]): number {
  return items.reduce((s, i) => s + (Number.isFinite(i.weight) ? i.weight : 0) * Math.max(1, i.quantity), 0);
}

/**
 * MVU「负重追踪·当前负重」应对齐的值：已穿戴装备 + 饰品列表 + 背包。
 * 单位 kg。
 */
export function computeCarriedWeightKg(snapshot: {
  equipmentSlots: EquipmentSlots;
  accessoryItems: AccessoryItem[];
  backpackItems: BackpackItem[];
}): number {
  return (
    sumEquippedPiecesWeightKg(snapshot.equipmentSlots) +
    sumAccessoryItemsWeightKg(snapshot.accessoryItems) +
    sumBackpackWeightKg(snapshot.backpackItems)
  );
}
