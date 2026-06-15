import type { BackstageNavItem } from './goth.types';

export const backstageNavItems: BackstageNavItem[] = [
  { section: 'attributes', title: '基础属性', desc: '体魄、敏捷、意志、感知、魅力。' },
  { section: 'skills', title: '技能', desc: '等级与熟练度。' },
  { section: 'physiology', title: '生理数据', desc: '体征与开发度摘要。' },
  { section: 'status', title: '异常状态', desc: '浅层 / 中层 / 深层。' },
  { section: 'inventory', title: '装备与背包', desc: '装备槽、负重、仓储与搜索。' },
  { section: 'case', title: '案件卷宗', desc: '在办案件与结案统计。' },
  { section: 'map', title: '地图与到访', desc: '当前位置与各区足迹。' },
  { section: 'relation', title: '关系与声望', desc: '人物好感、阵营与道德。' },
];
