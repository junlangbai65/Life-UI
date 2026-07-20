import type { InventoryItem } from '../adven.types';

export type ItemSemanticIcon =
  | 'sword'
  | 'blade'
  | 'dagger'
  | 'axe'
  | 'spear'
  | 'bow'
  | 'armor'
  | 'shield'
  | 'helmet'
  | 'robe'
  | 'potion'
  | 'torch'
  | 'rope'
  | 'hook'
  | 'key'
  | 'ore'
  | 'crystal'
  | 'wood'
  | 'leather'
  | 'bone'
  | 'herb'
  | 'bag';

type KeywordRule = {
  icon: ItemSemanticIcon;
  priority: number;
  keywords: RegExp;
};

const keywordRules: KeywordRule[] = [
  { icon: 'sword', priority: 120, keywords: /剑|长剑|短剑|单手剑|双手剑|sword/i },
  { icon: 'blade', priority: 118, keywords: /刀|太刀|弯刀|blade/i },
  { icon: 'dagger', priority: 116, keywords: /匕首|短匕|dagger/i },
  { icon: 'axe', priority: 114, keywords: /斧|战斧|axe/i },
  { icon: 'spear', priority: 112, keywords: /枪|长枪|矛|spear|lance/i },
  { icon: 'bow', priority: 110, keywords: /弓|长弓|短弓|弩|bow|crossbow/i },
  { icon: 'armor', priority: 108, keywords: /甲|铠|护甲|胸甲|armor/i },
  { icon: 'shield', priority: 106, keywords: /盾|塔盾|圆盾|shield/i },
  { icon: 'helmet', priority: 104, keywords: /盔|头盔|帽|helmet/i },
  { icon: 'robe', priority: 102, keywords: /袍|法袍|披风|robe|cloak/i },
  { icon: 'potion', priority: 100, keywords: /药|药水|回复|治疗|卷轴|potion|elixir|scroll/i },
  { icon: 'torch', priority: 98, keywords: /火把|照明|灯|灯笼|torch|lamp/i },
  { icon: 'rope', priority: 96, keywords: /绳|缆|rope/i },
  { icon: 'hook', priority: 94, keywords: /钩|抓钩|hook/i },
  { icon: 'key', priority: 92, keywords: /钥匙|key/i },
  { icon: 'ore', priority: 90, keywords: /矿|矿石|铁|铜|银|金|ore/i },
  { icon: 'crystal', priority: 88, keywords: /晶|水晶|结晶|crystal|gem/i },
  { icon: 'wood', priority: 86, keywords: /木|原木|木材|wood|timber/i },
  { icon: 'leather', priority: 84, keywords: /皮|皮革|leather|hide/i },
  { icon: 'bone', priority: 82, keywords: /骨|bone/i },
  { icon: 'herb', priority: 80, keywords: /草|草药|花|herb/i },
];

const fallbackByCategory: Record<InventoryItem['category'], ItemSemanticIcon> = {
  装备: 'sword',
  物品: 'bag',
  消耗品: 'potion',
  材料: 'ore',
};

export function iconPaths(icon: ItemSemanticIcon): string[] {
  const map: Record<ItemSemanticIcon, string[]> = {
    sword: ['M6 18l6-6 2 2 6-6M10 7l2-2 2 2M4 20h16'],
    blade: ['M5 18l7-7 1.8 1.8 5.2-5.2M9 7l1.5-1.5 2 2L11 9M4 20h10'],
    dagger: ['M12 5v10M9 8h6M10 15l2 4 2-4'],
    axe: ['M8 5l8 8M9 6c-2 0-3 1.4-3 3.1 0 2 2 3.3 4 3.6M16 13l3 3'],
    spear: ['M12 4l2 2-8 8-2-2 8-8zM14 6l6 6M6 14l4 4'],
    bow: ['M7 4c5 2 7 6 7 8s-2 6-7 8M7 12h10M17 9l3 3-3 3'],
    armor: ['M8 5h8l2 3-2 11H8L6 8zM10 9h4'],
    shield: ['M12 4l6 2v5c0 4-2.4 7-6 9-3.6-2-6-5-6-9V6z'],
    helmet: ['M6 13v-2a6 6 0 0 1 12 0v2M8 13h8M9 17h6'],
    robe: ['M8 4h8l2 4v12H6V8zM12 8v12'],
    potion: ['M10 4h4M11 4v4l-3 5a4 4 0 0 0 3.4 6h1.2A4 4 0 0 0 16 13l-3-5V4'],
    torch: ['M11 4l3 3-2 2 3 7H9l3-7-2-2zM10 19h4'],
    rope: ['M7 7c0-1.5 1.2-2.7 2.7-2.7h4.6c1.5 0 2.7 1.2 2.7 2.7S15.8 9.7 14.3 9.7H10M10 14.3h4.3c1.5 0 2.7 1.2 2.7 2.7s-1.2 2.7-2.7 2.7H9.7'],
    hook: ['M12 4v8a3 3 0 1 0 3 3M12 4h5'],
    key: ['M7 12a3 3 0 1 1 5.5 1.5L20 21M16 17h2M14 19h2'],
    ore: ['M12 4l6 4v8l-6 4-6-4V8z'],
    crystal: ['M12 3l4 5-4 13-4-13zM8 8h8'],
    wood: ['M6 6h12v12H6zM9 6v12M14 6v12'],
    leather: ['M6 10c0-3 2.2-6 6-6s6 3 6 6-2.2 10-6 10-6-7-6-10z'],
    bone: ['M7 10a2 2 0 1 1 2-2l6 6a2 2 0 1 1 2 2l-6-6a2 2 0 1 1-2-2'],
    herb: ['M12 20V7M12 12c-4 0-6-2-6-6 4 0 6 2 6 6zm0 2c4 0 6-2 6-6-4 0-6 2-6 6z'],
    bag: ['M7 7h10l1 12H6zM9 7V5h6v2M9 12h6M9 15h4'],
  };
  return map[icon];
}

export function resolveItemSemanticIcons(
  name: string,
  description: string,
  category: InventoryItem['category'],
): { primary: ItemSemanticIcon; secondary: ItemSemanticIcon[]; hits: string[] } {
  const sourceName = (name ?? '').trim();
  const sourceDesc = (description ?? '').trim();
  const fromName = keywordRules.filter(rule => rule.keywords.test(sourceName));
  const fromDesc = keywordRules.filter(rule => rule.keywords.test(sourceDesc));
  const merged = [...fromName, ...fromDesc].sort((a, b) => b.priority - a.priority);
  const deduped: ItemSemanticIcon[] = [];
  for (const item of merged) {
    if (!deduped.includes(item.icon)) deduped.push(item.icon);
  }
  const fallback = fallbackByCategory[category];
  if (deduped.length === 0) {
    return { primary: fallback, secondary: [], hits: [] };
  }
  const [primary, ...rest] = deduped;
  return {
    primary,
    secondary: rest.slice(0, 3),
    hits: merged.map(rule => rule.icon),
  };
}
