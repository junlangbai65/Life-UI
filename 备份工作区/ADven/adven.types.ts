export type PanelKey =
  | 'character'
  | 'skills'
  | 'inventory'
  | 'pet'
  | 'npc'
  | 'social'
  | 'quest'
  | 'status'
  | 'achievement'
  | 'recipe'
  | 'production';

export type ChatRole = 'user' | 'system' | 'assistant';

export interface PanelDefinition {
  key: PanelKey;
  title: string;
  desc: string;
  tip: string;
  icon: string;
}

export interface ChatMessage {
  id: string;
  role: ChatRole;
  content: string;
}

export interface NarrativeOption {
  id: string;
  text: string;
}

export interface WorldState {
  day: string;
  time: string;
  weather: string;
  degree: string;
  location: string;
}

export interface InterestPoint {
  target: string;
  description: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  category: '装备' | '物品' | '消耗品' | '材料';
  quality: string;
  description?: string;
  quantity?: number;
  baseATK?: number;
  baseDEF?: number;
  entries?: string[];
  equipType?: keyof EquipmentSlots;
}

export interface EquipmentSlots {
  weapon: InventoryItem | null;
  armor: InventoryItem | null;
  accessory: InventoryItem | null;
}

export interface EquipmentSlotInfo {
  key: keyof EquipmentSlots;
  label: string;
}

/** 主角.等级系统 — 叙事页等级条 */
export interface LevelSystem {
  level: number;
  currentExp: number;
  requiredExp: number;
}

/** stat_data.敌人列表 单条 */
export interface EnemyEntry {
  name: string;
  race: string;
  tier: number;
  level: number;
  currentHp: number;
  maxHp: number;
  currentMp: number;
  maxMp: number;
  atk: number;
  def: number;
  status: string[];
}

/** stat_data.任务列表 单条（任务面板与剧情侧栏同源） */
export interface QuestEntry {
  name: string;
  type: string;
  objective: string;
  description: string;
}

/** 掌握配方中单条（名称 + 描述） */
export interface RecipeEntry {
  name: string;
  description: string;
}

export interface RecipesBundle {
  blueprints: RecipeEntry[];
  alchemy: RecipeEntry[];
  cooking: RecipeEntry[];
}

