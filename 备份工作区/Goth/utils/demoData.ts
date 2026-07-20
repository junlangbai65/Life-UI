import type {
  CharacterState,
  EquipmentSlots,
  GothGameSnapshot,
  MapState,
  TimeWeatherState,
} from '../goth.types';
import { GOTH_DEFAULT_DISPLAY_NAME } from '../defaultDisplayName';

/** MVU 未同步或无聊天变量时的占位快照文案 */
const UNKNOWN = '当前未知';
const NA = 'N/A';

const slotLabels = {
  head: '头部',
  body: '上身',
  legs: '下身',
  underwear_top: '内衣',
  underwear_bottom: '内裤',
  shoes: '鞋子',
  socks: '袜子',
  gloves: '手套',
  weapon: '武器',
  accessory: '饰品',
} as const;

const emptyEquipment: EquipmentSlots = {
  head: null,
  body: null,
  legs: null,
  underwear_top: null,
  underwear_bottom: null,
  shoes: null,
  socks: null,
  gloves: null,
  weapon: null,
  accessory: null,
};

const placeholderCharacter: CharacterState = {
  name: GOTH_DEFAULT_DISPLAY_NAME,
  portraitUrl: null,
  attributes: [
    { name: '体魄', value: 10 },
    { name: '敏捷', value: 10 },
    { name: '意志', value: 10 },
    { name: '感知', value: 10 },
    { name: '魅力', value: 10 },
  ],
  hpCurrent: 0,
  hpMax: 0,
  san: 0,
  sanMax: 0,
  pollution: 0,
  pollutionMax: 200,
  stamina: 0,
  staminaMax: 0,
  currency: 0,
  skills: [],
  physiological: {
    fluidAmount: NA,
    sexCount: 0,
    pregnancy: UNKNOWN,
    bodyDevelopment: [],
  },
  statusShallow: [],
  statusMid: [],
  statusDeep: [],
};

const placeholderMap: MapState = {
  region: UNKNOWN,
  location: UNKNOWN,
  subLocation: UNKNOWN,
  regions: [],
};

const placeholderTime: TimeWeatherState = {
  date: NA,
  weekday: UNKNOWN,
  period: '当前未知',
  weather: UNKNOWN,
};

export function createDemoSnapshot(): GothGameSnapshot {
  return {
    character: placeholderCharacter,
    equipmentSlots: emptyEquipment,
    equipmentSlotLabels: { ...slotLabels },
    backpackItems: [],
    backpackWeightLimit: 16,
    storageLocations: [],
    searchResults: [],
    accessoryItems: [],
    activeCases: [],
    completedCaseCount: 0,
    relations: [],
    factions: [],
    morality: { value: 0, label: '普通' },
    map: placeholderMap,
    timeWeather: placeholderTime,
    enemies: [],
    inCombat: false,
  };
}
