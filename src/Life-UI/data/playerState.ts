import type { EnvInfo, StatDef } from '../types';

export const playerStats: StatDef[] = [
  { key: 'funds', label: '资金', icon: 'coin', value: 12800, max: 50000, color: 'var(--lf-butter-deep)' },
  { key: 'popularity', label: '人气', icon: 'people', value: 62, max: 100, color: 'var(--lf-strawberry)' },
  { key: 'mood', label: '心情', icon: 'mood', value: 78, max: 100, color: 'var(--lf-peach)' },
  { key: 'stamina', label: '体力', icon: 'energy', value: 54, max: 100, color: 'var(--lf-mint-deep)' },
  { key: 'inspiration', label: '灵感', icon: 'spark', value: 71, max: 100, color: 'var(--lf-lavender-deep)' },
];

export const environment: EnvInfo = {
  weather: { label: '晴转多云', icon: 'sun' },
  season: '初夏',
  timeOfDay: '午后',
  ambiance: '惬意慵懒',
  day: 14,
};

export const playerProfile = {
  name: '你',
  role: '云町咖啡屋 · 店主',
  shopName: '云町咖啡屋',
  level: 7,
  levelTitle: '小有名气',
};
