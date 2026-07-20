/** 装备/背包交互写入输入框的叙事短语（统一括号便于检索） */
export function phraseUnequip(name: string): string {
  return `脱下了[${name}]`;
}

export function phraseEquip(name: string): string {
  return `穿戴了[${name}]`;
}

export function phraseUse(name: string): string {
  return `使用了[${name}]`;
}

export function phrasePickSearch(name: string): string {
  return `拾取了[${name}]`;
}
