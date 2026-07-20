/**
 * 将 MVU stat_data 中文嵌套结构映射为 GothGameSnapshot 补丁。
 * 兼容 MVU [值, "描述"] 单元格式。
 */

import { GOTH_DEFAULT_DISPLAY_NAME } from '../defaultDisplayName';
import { WEAR_CATEGORY_CN_TO_SLOT } from './inventoryWearRules';
import type {
  AccessoryItem,
  BackpackItem,
  CaseEntry,
  CharacterState,
  EnemyEntry,
  EquipmentPiece,
  EquipmentSlots,
  EquipmentSlotKey,
  FactionReputation,
  GothGameSnapshot,
  InventoryCategoryFilter,
  MapLocationRecord,
  MapRegion,
  MapState,
  MoralityLabel,
  MoralityState,
  RelationCharacter,
  RelationLabel,
  SearchResultItem,
  BodyDevelopmentEntry,
  SkillEntry,
  StatusEntry,
  StorageLocation,
  TimeWeatherState,
} from '../goth.types';

/** MVU 常见包装：[实际值, "说明文字"] */
export function unwrapMvuValue<T>(raw: unknown): T | undefined {
  if (raw === undefined || raw === null) return undefined;
  if (Array.isArray(raw) && raw.length > 0) {
    return raw[0] as T;
  }
  return raw as T;
}

function unwrapRecord(raw: unknown): Record<string, unknown> | null {
  const v = unwrapMvuValue<unknown>(raw);
  if (v && typeof v === 'object' && !Array.isArray(v)) {
    return v as Record<string, unknown>;
  }
  return null;
}

function pickNum(raw: unknown, fallback = 0): number {
  const v = unwrapMvuValue(raw);
  const n = typeof v === 'number' ? v : Number(v);
  return Number.isFinite(n) ? n : fallback;
}

function pickStr(raw: unknown, fallback = ''): string {
  const v = unwrapMvuValue(raw);
  if (typeof v === 'string') return v;
  if (v === undefined || v === null) return fallback;
  return String(v);
}

function pickBool(raw: unknown, fallback = false): boolean {
  const v = unwrapMvuValue(raw);
  if (typeof v === 'boolean') return v;
  return fallback;
}

/**
 * MVU SAN：可为扁平数值，或与 HP 相同的 `{ 当前值, 最大值 }`（可包一层 `[值, "说明"]`）。
 */
function parseMvuSan(
  raw: unknown,
  opts: { flatDefaultSan: number; flatDefaultMax: number },
): { san: number; sanMax: number; sanUnavailable: boolean } {
  const prim = unwrapMvuValue(raw);
  if (
    prim === 'N/A' ||
    (typeof prim === 'string' && prim.trim().toUpperCase() === 'N/A')
  ) {
    return { san: 0, sanMax: opts.flatDefaultMax, sanUnavailable: true };
  }
  const block = unwrapRecord(raw);
  if (
    block &&
    (Object.prototype.hasOwnProperty.call(block, '当前值') ||
      Object.prototype.hasOwnProperty.call(block, '最大值'))
  ) {
    const san = pickNum(block['当前值'], opts.flatDefaultSan);
    const sanMax = pickNum(block['最大值'], opts.flatDefaultMax);
    return {
      san,
      sanMax: Math.max(1, Math.max(san, sanMax)),
      sanUnavailable: false,
    };
  }
  const san = pickNum(raw, opts.flatDefaultSan);
  return { san, sanMax: opts.flatDefaultMax, sanUnavailable: false };
}

const EQUIP_CN_TO_KEY: Record<string, EquipmentSlotKey> = {
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

const EQUIP_SLOT_ENGLISH: Record<string, EquipmentSlotKey> = {
  head: 'head',
  body: 'body',
  legs: 'legs',
  underwear_top: 'underwear_top',
  underwear_bottom: 'underwear_bottom',
  shoes: 'shoes',
  socks: 'socks',
  gloves: 'gloves',
  weapon: 'weapon',
  accessory: 'accessory',
};

function parseBackpackEquipSlotRaw(raw: unknown): EquipmentSlotKey | undefined {
  const v = unwrapMvuValue(raw);
  const s = typeof v === 'string' ? v.trim() : pickStr(v, '').trim();
  if (!s) return undefined;
  if (Object.prototype.hasOwnProperty.call(EQUIP_CN_TO_KEY, s)) return EQUIP_CN_TO_KEY[s];
  const lower = s.toLowerCase();
  if (Object.prototype.hasOwnProperty.call(EQUIP_SLOT_ENGLISH, lower)) return EQUIP_SLOT_ENGLISH[lower];
  return undefined;
}

function parseBackpackLikeItem(name: string, idPrefix: string, o: Record<string, unknown>): BackpackItem {
  const equipSlot =
    parseBackpackEquipSlotRaw(o['穿戴部位']) ??
    parseBackpackEquipSlotRaw(o['装备槽']) ??
    parseBackpackEquipSlotRaw(o['穿戴槽']);
  const entry: BackpackItem = {
    id: idPrefix ? `${idPrefix}-${slugId(name)}` : slugId(name),
    name,
    description: pickStr(o['描述']),
    type: normalizeItemType(pickStr(o['类型'], '物品')),
    quantity: Math.max(1, pickNum(o['数量'], 1)),
    weight: pickNum(o['负重'], 0),
  };
  if (equipSlot) entry.equipSlot = equipSlot;
  if (Object.prototype.hasOwnProperty.call(o, 'ATK')) entry.atk = pickNum(o['ATK'], 0);
  if (Object.prototype.hasOwnProperty.call(o, 'DEF')) entry.def = pickNum(o['DEF'], 0);
  const fx = pickStr(o['特殊效果']);
  if (fx) entry.specialEffects = fx;
  const subType = pickStr(o['装备类型']) || pickStr(o['类型细分']);
  if (subType) entry.itemType = subType;
  else {
    const typeRaw = pickStr(o['类型'], '').trim();
    if (typeRaw && WEAR_CATEGORY_CN_TO_SLOT[typeRaw]) entry.itemType = typeRaw;
  }
  return entry;
}

const SKILL_NAMES = [
  '调查',
  '交涉',
  '潜行',
  '运动',
  '战斗',
  '学识',
  '神秘学',
  '医疗',
  '机械',
  '聆听',
] as const;

function slugId(s: string): string {
  return s.replace(/[^\w\u4e00-\u9fff]+/gu, '_').slice(0, 48) || 'item';
}

function normalizeItemType(t: string): InventoryCategoryFilter {
  if (t === '物品' || t === '工具' || t === '材料' || t === '消耗品') return t;
  return '物品';
}

function parseSkillLevel(n: number): 1 | 2 | 3 | 4 | 5 {
  const x = Math.round(Number.isFinite(n) ? n : 1);
  return Math.min(5, Math.max(1, x)) as 1 | 2 | 3 | 4 | 5;
}

function parseProficiency(raw: unknown): { current: number; max: number } {
  const s = pickStr(raw, '0/1');
  const m = s.match(/^(\d+)\s*\/\s*(\d+)$/);
  if (!m) return { current: 0, max: 1 };
  return { current: Number(m[1]), max: Math.max(1, Number(m[2])) };
}

function parseEquipmentPiece(slotKey: EquipmentSlotKey, raw: unknown): EquipmentPiece | null {
  const o = unwrapRecord(raw);
  if (!o || Object.keys(o).length === 0) return null;
  const name = pickStr(o['名称']);
  if (!name) return null;
  const atk = pickNum(o['ATK'], 0);
  const def = pickNum(o['DEF'], 0);
  const weight = pickNum(o['负重'], 0);
  const fx = pickStr(o['特殊效果']);
  const desc = pickStr(o['描述']);
  const special = [desc && `描述：${desc}`, fx].filter(Boolean).join(' · ') || '—';
  return {
    id: `${slotKey}-${slugId(name)}`,
    name,
    itemType: pickStr(o['类型'], '装备'),
    atk,
    def,
    weight,
    specialEffects: special,
  };
}

function parseEquipmentSlots(raw: unknown): EquipmentSlots | undefined {
  const sys = unwrapRecord(raw);
  if (!sys) return undefined;
  const out = {} as EquipmentSlots;
  for (const [cn, key] of Object.entries(EQUIP_CN_TO_KEY)) {
    if (key === 'accessory') {
      out.accessory = null;
      continue;
    }
    out[key] = parseEquipmentPiece(key, sys[cn]);
  }
  return out;
}

function parseAccessoryItems(rawEquipment: unknown): AccessoryItem[] {
  const sys = unwrapRecord(rawEquipment);
  if (!sys) return [];
  const jewelry = unwrapRecord(sys['饰品']);
  if (!jewelry || Object.keys(jewelry).length === 0) return [];
  const items: AccessoryItem[] = [];
  for (const [name, val] of Object.entries(jewelry)) {
    const o = unwrapRecord(val);
    if (!o) continue;
    const fx = pickStr(o['特殊效果']);
    const desc = pickStr(o['描述']);
    const special = [desc && `描述：${desc}`, fx].filter(Boolean).join(' · ') || '—';
    items.push({
      id: `acc-${slugId(name)}`,
      name,
      description: desc,
      itemType: pickStr(o['类型'], '饰品'),
      weight: pickNum(o['负重'], 0),
      specialEffects: special,
    });
  }
  return items;
}

function parseSkills(raw: unknown): SkillEntry[] {
  const skillsRoot = unwrapRecord(raw);
  const list: SkillEntry[] = [];
  for (const name of SKILL_NAMES) {
    const sk = skillsRoot ? unwrapRecord(skillsRoot[name]) : null;
    if (!sk) {
      list.push({ name, level: 1, currentXp: 0, maxXp: 1 });
      continue;
    }
    const level = parseSkillLevel(pickNum(sk['等级'], 1));
    const prof = parseProficiency(sk['熟练度']);
    list.push({
      name,
      level,
      currentXp: prof.current,
      maxXp: prof.max,
    });
  }
  return list;
}

function parseAttributes(raw: unknown): { name: string; value: number }[] {
  const base = unwrapRecord(raw);
  if (!base) return [];
  const names = ['体魄', '敏捷', '意志', '感知', '魅力'];
  return names.map(name => ({
    name,
    value: pickNum(base[name], 0),
  }));
}

function formatPregnancy(raw: unknown): string {
  const o = unwrapRecord(raw);
  if (!o) return '无';
  const preg = pickBool(o['是否怀孕']);
  if (!preg) return '无';
  const days = pickNum(o['孕期天数'], 0);
  const father = pickStr(o['父亲信息']);
  return `怀孕 · ${days} 日 · ${father || '父源未知'}`;
}

function parseBodyDevelopment(raw: unknown): BodyDevelopmentEntry[] {
  const o = unwrapRecord(raw);
  if (!o) return [];
  const list: BodyDevelopmentEntry[] = [];
  for (const [name, v] of Object.entries(o)) {
    const sub = unwrapRecord(v);
    if (!sub) continue;
    const level = Math.max(1, Math.round(pickNum(unwrapMvuValue(sub['等级']) ?? sub['等级'], 1)));
    const prof = parseProficiency(unwrapMvuValue(sub['经验累积']) ?? sub['经验累积']);
    list.push({
      name,
      level,
      currentXp: prof.current,
      maxXp: prof.max,
    });
  }
  return list;
}

function parseStatusLayer(raw: unknown, isDeep: boolean): StatusEntry[] {
  const r = unwrapRecord(raw);
  if (!r || Object.keys(r).length === 0) return [];
  return Object.entries(r).map(([name, val]) => {
    const rec = unwrapRecord(val);
    const effectBase = pickStr(rec?.['效果'], '');
    const effect = effectBase || pickStr(rec?.['影响'], '');
    const kind = pickStr(rec?.['类型'], '');
    let remainingDays: number | null;
    if (isDeep) {
      remainingDays =
        rec && Object.prototype.hasOwnProperty.call(rec, '剩余天数')
          ? pickNum(rec['剩余天数'], 0)
          : null;
    } else {
      remainingDays = pickNum(rec?.['剩余天数'], pickNum(rec?.['剩余'], 0));
    }
    const entry: StatusEntry = {
      name,
      description: pickStr(rec?.['描述'], ''),
      effect,
      remainingDays,
    };
    if (kind) entry.kind = kind;
    return entry;
  });
}

function parseBackpack(raw: unknown): BackpackItem[] {
  const bag = unwrapRecord(raw);
  if (!bag) return [];
  const items: BackpackItem[] = [];
  for (const [name, val] of Object.entries(bag)) {
    const o = unwrapRecord(val);
    if (!o) continue;
    items.push(parseBackpackLikeItem(name, '', o));
  }
  return items;
}

function parseStorage(raw: unknown): StorageLocation[] {
  const sys = unwrapRecord(raw);
  if (!sys) return [];
  const locs: StorageLocation[] = [];
  for (const [locName, val] of Object.entries(sys)) {
    const bag = unwrapRecord(val);
    if (!bag) continue;
    const items: BackpackItem[] = [];
    for (const [name, itemRaw] of Object.entries(bag)) {
      const o = unwrapRecord(itemRaw);
      if (!o) continue;
      items.push(parseBackpackLikeItem(name, slugId(locName), o));
    }
    locs.push({
      id: slugId(locName),
      name: locName,
      items,
    });
  }
  return locs;
}

function parseSearchResults(raw: unknown): SearchResultItem[] {
  const sys = unwrapRecord(raw);
  if (!sys || Object.keys(sys).length === 0) return [];
  /* 结构与背包条目类似时按名称展开 */
  const items: SearchResultItem[] = [];
  for (const [name, val] of Object.entries(sys)) {
    const o = unwrapRecord(val);
    if (!o) continue;
    items.push({
      ...parseBackpackLikeItem(name, '', o),
      id: slugId(name),
      sourceLabel: pickStr(o['来源'], '搜索'),
    });
  }
  return items;
}

function factionTierLabel(value: number): string {
  if (value <= -60) return '声望极低';
  if (value <= -25) return '声望偏低';
  if (value < 25) return '中立';
  if (value < 60) return '声望良好';
  return '声望极高';
}

function parseFactions(raw: unknown): FactionReputation[] {
  const o = unwrapRecord(raw);
  if (!o) return [];
  return Object.entries(o).map(([name, val]) => {
    const value = pickNum(val, 0);
    return {
      id: slugId(name),
      name: name.replace(/^APD_/, 'APD · '),
      value,
      label: factionTierLabel(value),
    };
  });
}

function relationLabelFromFavor(v: number): RelationLabel {
  if (v <= -50) return '敌对';
  if (v <= -18) return '戒备';
  if (v < 18) return '陌生';
  if (v < 45) return '友善';
  if (v < 72) return '信赖';
  return '倾慕';
}

function summarizeNpcAbnormal(raw: unknown): string {
  const ab = unwrapRecord(raw);
  if (!ab || Object.keys(ab).length === 0) return '无';
  return Object.keys(ab)
    .slice(0, 6)
    .join('；');
}

function parseNpcSan(char: Record<string, unknown>): {
  san: number;
  sanMax: number;
  sanUnavailable: boolean;
} {
  return parseMvuSan(char['SAN'] ?? char['SAN值'], {
    flatDefaultSan: 100,
    flatDefaultMax: 100,
  });
}

function parseActiveCases(raw: unknown): CaseEntry[] {
  const root = unwrapRecord(raw);
  if (!root) return [];
  const list: CaseEntry[] = [];
  for (const [name, val] of Object.entries(root)) {
    const o = unwrapRecord(val);
    if (!o) continue;
    const tt = pickStr(o['任务类型'], '调查');
    const taskType: CaseEntry['taskType'] = tt === '委托' ? '委托' : '调查';
    list.push({
      id: slugId(name),
      name,
      taskType,
      client: pickStr(o['委托人']),
      reward: pickStr(o['报酬']),
      timeLimit: pickStr(o['时间限制']),
      acceptedAt: pickStr(o['接取时间']),
    });
  }
  return list;
}

function parseRelations(raw: unknown): RelationCharacter[] {
  const root = unwrapRecord(raw);
  if (!root) return [];
  const list: RelationCharacter[] = [];
  for (const [name, val] of Object.entries(root)) {
    const ch = unwrapRecord(val);
    if (!ch) continue;
    const favor = pickNum(ch['好感度'], 0);
    const hpBlock = unwrapRecord(ch['HP']);
    const hpCurrent = hpBlock ? pickNum(hpBlock['当前值'], 0) : 0;
    const hpMax = hpBlock ? Math.max(1, pickNum(hpBlock['最大值'], 10)) : 10;
    const { san, sanMax, sanUnavailable } = parseNpcSan(ch);
    const rel: RelationCharacter = {
      id: slugId(name),
      name,
      favor,
      hpCurrent,
      hpMax,
      san,
      sanMax,
      abnormalSummary: summarizeNpcAbnormal(ch['异常状态']),
      relationLabel: relationLabelFromFavor(favor),
    };
    if (sanUnavailable) rel.sanUnavailable = true;
    list.push(rel);
  }
  return list;
}

function parseMorality(raw: unknown): MoralityState | undefined {
  const o = unwrapRecord(raw);
  if (!o) return undefined;
  const label = pickStr(o['标签'], '普通') as MoralityLabel;
  const allowed: MoralityLabel[] = ['圣洁', '高洁', '温良', '普通', '轻浮', '放纵', '魔性'];
  return {
    value: pickNum(o['数值'], 0),
    label: allowed.includes(label) ? label : '普通',
  };
}

function parseMapCurrent(raw: unknown): Pick<MapState, 'region' | 'location' | 'subLocation'> | undefined {
  const o = unwrapRecord(raw);
  if (!o) return undefined;
  return {
    region: pickStr(o['区域'], ''),
    location: pickStr(o['地点'], ''),
    subLocation: pickStr(o['次级地点'], ''),
  };
}

function parseVisitedRegions(raw: unknown): MapRegion[] {
  const root = unwrapRecord(raw);
  if (!root) return [];
  const regions: MapRegion[] = [];
  for (const [regionName, val] of Object.entries(root)) {
    const locMap = unwrapRecord(val);
    if (!locMap) continue;
    const locations: MapLocationRecord[] = [];
    for (const [locName, meta] of Object.entries(locMap)) {
      const m = unwrapRecord(meta);
      locations.push({
        id: slugId(`${regionName}-${locName}`),
        name: locName,
        firstVisit: pickStr(m?.['首次到达时间'], ''),
        unlocked: pickBool(m?.['是否解锁'], true),
      });
    }
    regions.push({
      id: slugId(regionName),
      name: regionName,
      locations,
    });
  }
  return regions;
}

function parseTimeWeather(raw: unknown): TimeWeatherState | undefined {
  const o = unwrapRecord(raw);
  if (!o) return undefined;
  const period = pickStr(o['当前时间段'], '当前未知');
  const periods: TimeWeatherState['period'][] = ['早晨', '下午', '傍晚', '深夜', '当前未知'];
  return {
    date: pickStr(o['当前日期'], ''),
    weekday: pickStr(o['星期几'], ''),
    period: periods.includes(period as TimeWeatherState['period'])
      ? (period as TimeWeatherState['period'])
      : '当前未知',
    weather: pickStr(o['天气状态'], ''),
  };
}

function parseEnemies(raw: unknown): EnemyEntry[] {
  const o = unwrapRecord(raw);
  if (!o || Object.keys(o).length === 0) return [];
  return Object.entries(o).map(([name, val]) => {
    const e = unwrapRecord(val);
    return {
      id: slugId(name),
      name,
      hpCurrent: pickNum(e?.['当前HP'] ?? e?.['HP'], 0),
      hpMax: pickNum(e?.['最大HP'] ?? e?.['HP上限'], 1),
      atk: pickNum(e?.['ATK'], 0),
      def: pickNum(e?.['DEF'], 0),
      enemyType: pickStr(e?.['类型'], '未知'),
    };
  });
}

export function isChineseGothStatShape(stat: Record<string, unknown>): boolean {
  return (
    '主角数值' in stat ||
    '装备系统' in stat ||
    '背包系统' in stat ||
    '仓储系统' in stat ||
    '搜索系统' in stat ||
    '负重追踪' in stat ||
    '当前位置' in stat
  );
}

/**
 * 将中文 MVU stat_data 转为 Goth 快照补丁（不含 equipmentSlotLabels，合并时保留界面默认值）
 */
export function mapChineseStatToGothPatch(stat: Record<string, unknown>): Partial<GothGameSnapshot> | null {
  if (!isChineseGothStatShape(stat)) return null;

  const hero = unwrapRecord(stat['主角数值']);
  const skillList = hero ? parseSkills(hero['技能']) : parseSkills(undefined);

  const hpBlock = hero ? unwrapRecord(hero['HP']) : null;
  const hpCurrent = hpBlock ? pickNum(hpBlock['当前值'], 0) : pickNum(hero?.['HP'], 0);
  const hpMax = hpBlock ? pickNum(hpBlock['最大值'], hpCurrent || 1) : hpCurrent || 1;

  const sanParsed = hero
    ? parseMvuSan(hero['SAN值'] ?? hero['SAN'], { flatDefaultSan: 100, flatDefaultMax: 100 })
    : { san: 100, sanMax: 100, sanUnavailable: false };
  const san = sanParsed.sanUnavailable ? 0 : sanParsed.san;
  const sanMax = Math.max(san, sanParsed.sanMax);
  const pollution = hero ? pickNum(hero['污染值'], 0) : 0;
  const stamina = hero ? pickNum(hero['体力'], 100) : 100;
  // MVU「货币」→ USD 小数（美元整数 + 小数部分两位为美分）
  const currency = hero ? pickNum(hero['货币'], 0) : 0;

  const physRoot = unwrapRecord(stat['生理数据']);
  const pregStr = physRoot ? formatPregnancy(physRoot['怀孕状态']) : '无';
  const bodyDevelopment = physRoot ? parseBodyDevelopment(physRoot['身体开发度']) : [];

  const fluidRaw = physRoot?.['体内精液量'];
  const fluidUnwrapped = unwrapMvuValue(fluidRaw);
  const fluidAmount =
    typeof fluidUnwrapped === 'string' ? fluidUnwrapped : String(pickNum(fluidRaw, 0));

  const abnormal = unwrapRecord(stat['异常状态']);

  const character: CharacterState = {
    name: pickStr(hero?.['姓名'], GOTH_DEFAULT_DISPLAY_NAME),
    portraitUrl: null,
    attributes: parseAttributes(hero?.['基础属性']),
    hpCurrent,
    hpMax: Math.max(hpCurrent, hpMax),
    san,
    sanMax,
    pollution,
    pollutionMax: 200,
    stamina,
    staminaMax: 100,
    currency,
    skills: skillList,
    physiological: {
      fluidAmount,
      sexCount: physRoot ? pickNum(physRoot['sex次数'], 0) : 0,
      pregnancy: pregStr,
      bodyDevelopment,
    },
    statusShallow: parseStatusLayer(abnormal?.['浅层状态'], false),
    statusMid: parseStatusLayer(abnormal?.['中层状态'], false),
    statusDeep: parseStatusLayer(abnormal?.['深层状态'], true),
  };

  const equipmentSlots = parseEquipmentSlots(stat['装备系统']);
  const accessoryItems = parseAccessoryItems(stat['装备系统']);

  const backpackItems = parseBackpack(stat['背包系统']);
  const storageLocations = parseStorage(stat['仓储系统']);
  const searchResults = parseSearchResults(stat['搜索系统']);

  const weightBlock = unwrapRecord(stat['负重追踪']);
  const backpackWeightLimit = weightBlock ? pickNum(weightBlock['负重上限'], 16) : 16;

  const factions = parseFactions(stat['阵营声望']);
  const morality = parseMorality(stat['道德倾向']);

  const mapCur = parseMapCurrent(stat['当前位置']);
  const regions = parseVisitedRegions(stat['已到达地点记录']);

  const map: MapState | undefined =
    mapCur || regions.length
      ? {
          region: mapCur?.region ?? '',
          location: mapCur?.location ?? '',
          subLocation: mapCur?.subLocation ?? '',
          regions,
        }
      : undefined;

  const timeWeather = parseTimeWeather(stat['时间系统']);

  const combat = unwrapRecord(stat['当前战斗状态']);
  const inCombat = combat ? pickBool(combat['是否在战斗中'], false) : false;
  const enemies = combat ? parseEnemies(combat['敌人列表']) : [];

  const activeCases = parseActiveCases(stat['当前案件列表']);
  const relations = parseRelations(stat['角色列表']);

  const patch: Partial<GothGameSnapshot> = {
    character,
    ...(equipmentSlots ? { equipmentSlots } : {}),
    backpackItems,
    backpackWeightLimit,
    storageLocations,
    searchResults,
    accessoryItems,
    activeCases,
    completedCaseCount: pickNum(stat['已完成案件数量'], 0),
    relations,
    factions,
    ...(morality ? { morality } : {}),
    ...(map ? { map } : {}),
    ...(timeWeather ? { timeWeather } : {}),
    enemies,
    inCombat,
  };

  return patch;
}
