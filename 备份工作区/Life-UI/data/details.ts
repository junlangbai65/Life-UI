import type { HistoryRecord, TreeNode } from '../types';

// 数据详情面板 — 树状结构（游戏存档变量的可视化）
export const dataTree: TreeNode[] = [
  {
    key: 'shop',
    label: '云町咖啡屋',
    badge: 'Lv.7',
    children: [
      { key: 'shop.funds', label: '资金', value: '¥12,800' },
      { key: 'shop.popularity', label: '人气', value: 62 },
      { key: 'shop.rating', label: '顾客评价', value: '4.6 / 5.0' },
      {
        key: 'shop.menu',
        label: '招牌菜单',
        children: [
          { key: 'menu.latte', label: '小猫拿铁', value: '热销' },
          { key: 'menu.cake', label: '草莓蛋糕', value: '常驻' },
          { key: 'menu.special', label: '双份糖特调', value: '隐藏' },
        ],
      },
    ],
  },
  {
    key: 'player',
    label: '店主 · 你',
    badge: '小有名气',
    children: [
      { key: 'player.mood', label: '心情', value: 78 },
      { key: 'player.stamina', label: '体力', value: 54 },
      { key: 'player.inspiration', label: '灵感', value: 71 },
    ],
  },
  {
    key: 'relations',
    label: '人物关系',
    badge: '3 人',
    children: [
      {
        key: 'rel.qinghe',
        label: '林清和',
        value: '暗生情愫',
        children: [
          { key: 'rel.qinghe.aff', label: '好感度', value: 64 },
          { key: 'rel.qinghe.trust', label: '信任', value: 70 },
          { key: 'rel.qinghe.flag', label: '关键旗标', value: '小猫拉花' },
        ],
      },
      {
        key: 'rel.suqing',
        label: '苏晴',
        value: '青梅竹马',
        children: [
          { key: 'rel.suqing.aff', label: '好感度', value: 78 },
          { key: 'rel.suqing.trust', label: '信任', value: 90 },
        ],
      },
      {
        key: 'rel.chenzhou',
        label: '顾沉舟',
        value: '初识',
        children: [
          { key: 'rel.chenzhou.aff', label: '好感度', value: 35 },
          { key: 'rel.chenzhou.trust', label: '信任', value: 33 },
        ],
      },
    ],
  },
  {
    key: 'world',
    label: '世界',
    children: [
      { key: 'world.day', label: '天数', value: 'Day 14' },
      { key: 'world.season', label: '季节', value: '初夏' },
      { key: 'world.weather', label: '天气', value: '晴转多云' },
    ],
  },
];

export const historyRecords: HistoryRecord[] = [
  { id: 'h1', time: 'Day 14 · 午后', label: '清和好感度', delta: '+4', direction: 'up', icon: 'heart' },
  { id: 'h2', time: 'Day 14 · 午后', label: '灵感', delta: '+6', direction: 'up', icon: 'spark' },
  { id: 'h3', time: 'Day 14 · 上午', label: '体力', delta: '-12', direction: 'down', icon: 'energy' },
  { id: 'h4', time: 'Day 13 · 夜晚', label: '资金', delta: '+¥1,200', direction: 'up', icon: 'coin' },
  { id: 'h5', time: 'Day 12 · 傍晚', label: '人气', delta: '+8', direction: 'up', icon: 'people' },
  { id: 'h6', time: 'Day 12 · 傍晚', label: '清和好感度', delta: '+5', direction: 'up', icon: 'heart' },
  { id: 'h7', time: 'Day 11 · 午后', label: '心情', delta: '±0', direction: 'flat', icon: 'mood' },
];
