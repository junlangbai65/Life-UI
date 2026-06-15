export type PanelKey = 'character' | 'inventory' | 'case' | 'map' | 'relation' | 'time';

/** 档案后台左侧导航分区（与路由 `/backstage/:section` 对齐） */
export type BackstageSectionKey =
  | 'attributes'
  | 'skills'
  | 'physiology'
  | 'status'
  | 'inventory'
  | 'case'
  | 'map'
  | 'relation';

export interface BackstageNavItem {
  section: BackstageSectionKey;
  title: string;
  desc: string;
}

export type ChatRole = 'user' | 'assistant' | 'system';

export interface PanelDefinition {
  key: PanelKey;
  title: string;
  desc: string;
  iconPath: string;
}

export interface ChatMessage {
  id: string;
  role: ChatRole;
  content: string;
  createdAt: number;
}

/** 背包物品分类筛选 */
export type InventoryCategoryFilter = '物品' | '工具' | '材料' | '消耗品';

export interface EquipmentPiece {
  id: string;
  name: string;
  itemType: string;
  atk: number;
  def: number;
  weight: number;
  specialEffects: string;
}

export type EquipmentSlotKey =
  | 'head'
  | 'body'
  | 'legs'
  | 'underwear_top'
  | 'underwear_bottom'
  | 'shoes'
  | 'socks'
  | 'gloves'
  | 'weapon'
  | 'accessory';

export interface EquipmentSlots {
  head: EquipmentPiece | null;
  body: EquipmentPiece | null;
  legs: EquipmentPiece | null;
  underwear_top: EquipmentPiece | null;
  underwear_bottom: EquipmentPiece | null;
  shoes: EquipmentPiece | null;
  socks: EquipmentPiece | null;
  gloves: EquipmentPiece | null;
  weapon: EquipmentPiece | null;
  accessory: EquipmentPiece | null;
}

export interface BackpackItem {
  id: string;
  name: string;
  description: string;
  type: InventoryCategoryFilter;
  quantity: number;
  weight: number;
  /** MVU 可选：穿戴目标槽（穿戴部位 / 装备槽） */
  equipSlot?: EquipmentSlotKey;
  /** 与装备词条对齐，便于乐观穿上 */
  atk?: number;
  def?: number;
  specialEffects?: string;
  /** 细分类型展示（如装备子类） */
  itemType?: string;
}

export interface StorageLocation {
  id: string;
  name: string;
  items: BackpackItem[];
}

export interface SearchResultItem extends BackpackItem {
  sourceLabel: string;
}

export interface SkillEntry {
  name: string;
  level: 1 | 2 | 3 | 4 | 5;
  currentXp: number;
  maxXp: number;
}

/** MVU 生理数据「身体开发度」record 各部位（等级 + 经验累积） */
export interface BodyDevelopmentEntry {
  name: string;
  level: number;
  currentXp: number;
  maxXp: number;
}

export interface StatusEntry {
  name: string;
  description: string;
  effect: string;
  /** 剩余天数；`null` 表示无期限（如深层状态无 MVU 字段时） */
  remainingDays: number | null;
  /** MVU 异常状态「类型」 */
  kind?: string;
}

/** MVU「饰品」record 条目（多件饰品列表，与单槽 accessory 区分） */
export interface AccessoryItem {
  id: string;
  name: string;
  description: string;
  itemType: string;
  weight: number;
  specialEffects: string;
}

export interface CharacterState {
  name: string;
  portraitUrl: string | null;
  attributes: { name: string; value: number }[];
  hpCurrent: number;
  hpMax: number;
  san: number;
  sanMax: number;
  pollution: number;
  pollutionMax: number;
  stamina: number;
  staminaMax: number;
  /** 资产数额，单位为美元（USD），可为小数；界面拆为「整数美元 + 美分」 */
  currency: number;
  skills: SkillEntry[];
  physiological: {
    fluidAmount: string;
    sexCount: number;
    pregnancy: string;
    bodyDevelopment: BodyDevelopmentEntry[];
  };
  statusShallow: StatusEntry[];
  statusMid: StatusEntry[];
  statusDeep: StatusEntry[];
}

export interface CaseEntry {
  id: string;
  name: string;
  taskType: '调查' | '委托';
  client: string;
  reward: string;
  timeLimit: string;
  acceptedAt: string;
}

export type RelationLabel = '敌对' | '戒备' | '陌生' | '友善' | '信赖' | '倾慕';

export interface RelationCharacter {
  id: string;
  name: string;
  favor: number;
  hpCurrent: number;
  hpMax: number;
  san: number;
  sanMax: number;
  /** MVU SAN 为字面量 N/A 时为 true */
  sanUnavailable?: boolean;
  abnormalSummary: string;
  relationLabel: RelationLabel;
}

export interface FactionReputation {
  id: string;
  name: string;
  value: number;
  label: string;
}

export type MoralityLabel = '圣洁' | '高洁' | '温良' | '普通' | '轻浮' | '放纵' | '魔性';

export interface MoralityState {
  value: number;
  label: MoralityLabel;
}

export interface MapLocationRecord {
  id: string;
  name: string;
  firstVisit: string;
  unlocked: boolean;
}

export interface MapRegion {
  id: string;
  name: string;
  locations: MapLocationRecord[];
}

export interface MapState {
  region: string;
  location: string;
  subLocation: string;
  regions: MapRegion[];
}

export type DayPeriod = '早晨' | '下午' | '傍晚' | '深夜' | '当前未知';

export interface TimeWeatherState {
  date: string;
  weekday: string;
  period: DayPeriod;
  weather: string;
}

export interface EnemyEntry {
  id: string;
  name: string;
  hpCurrent: number;
  hpMax: number;
  atk: number;
  def: number;
  enemyType: string;
}

/** 预留：从消息楼层合并状态 */
export type MergeGothStateFromMessage = (raw: unknown) => Partial<GothGameSnapshot> | null;

export interface GothGameSnapshot {
  character: CharacterState;
  equipmentSlots: EquipmentSlots;
  equipmentSlotLabels: Record<EquipmentSlotKey, string>;
  backpackItems: BackpackItem[];
  /**
   * MVU「负重追踪」中的负重上限（kg），对应字段 `负重上限`。
   * 当前负重由界面按装备+背包实时合计，与「当前负重」一致。
   */
  backpackWeightLimit: number;
  storageLocations: StorageLocation[];
  searchResults: SearchResultItem[];
  activeCases: CaseEntry[];
  completedCaseCount: number;
  /** MVU 装备系统「饰品」record 展开 */
  accessoryItems: AccessoryItem[];
  relations: RelationCharacter[];
  factions: FactionReputation[];
  morality: MoralityState;
  map: MapState;
  timeWeather: TimeWeatherState;
  enemies: EnemyEntry[];
  inCombat: boolean;
}
