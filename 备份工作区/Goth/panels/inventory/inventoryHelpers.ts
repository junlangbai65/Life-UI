import type { AccessoryItem, BackpackItem, EquipmentPiece, EquipmentSlotKey } from '../../goth.types';

export function equipmentPieceToBackpackItem(piece: EquipmentPiece): BackpackItem {
  const desc = piece.specialEffects === '—' ? '' : piece.specialEffects;
  return {
    id: piece.id,
    name: piece.name,
    description: desc,
    type: '物品',
    quantity: 1,
    weight: piece.weight,
    itemType: piece.itemType,
    atk: piece.atk,
    def: piece.def,
    specialEffects: piece.specialEffects,
  };
}

export function accessoryItemToBackpackItem(a: AccessoryItem): BackpackItem {
  return {
    id: a.id,
    name: a.name,
    description: a.description,
    type: '物品',
    quantity: 1,
    weight: a.weight,
    itemType: a.itemType,
    specialEffects: a.specialEffects,
  };
}

export function backpackItemToEquipmentPiece(item: BackpackItem, slotKey: EquipmentSlotKey): EquipmentPiece {
  const fx = item.specialEffects ?? (item.description ? item.description : '—');
  return {
    id: item.id.includes('-') ? item.id : `${slotKey}-${item.id}`,
    name: item.name,
    itemType: item.itemType ?? '装备',
    atk: item.atk ?? 0,
    def: item.def ?? 0,
    weight: item.weight,
    specialEffects: fx || '—',
  };
}

export function backpackItemToAccessoryItem(item: BackpackItem): AccessoryItem {
  return {
    id: item.id,
    name: item.name,
    description: item.description,
    itemType: item.itemType ?? '饰品',
    weight: item.weight,
    specialEffects: (item.specialEffects ?? item.description) || '—',
  };
}
