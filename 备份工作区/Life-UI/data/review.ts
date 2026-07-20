import type { ReviewEntry } from '../types';

export const reviewEntries: ReviewEntry[] = [
  {
    id: 'rv1',
    day: 1,
    time: 'Day 1 · 清晨',
    category: '里程碑',
    title: '我们的小店',
    summary: '云町咖啡屋正式开张。',
    detail:
      '第一缕阳光照进店里时，你和苏晴对视一笑。招牌还带着油漆未干的味道，门口的风铃是她从老家带来的。「从今天起，这里就是我们的主场啦！」',
    icon: 'coffee',
    relatedCharacter: 'suqing',
    pinned: true,
  },
  {
    id: 'rv2',
    day: 5,
    time: 'Day 5 · 午后',
    category: '剧情',
    title: '靠窗的她',
    summary: '林清和第一次走进店里。',
    detail:
      '她在靠窗的位置坐下，点了一杯热拿铁，然后摊开一本旧书。阳光落在书页上，也落在她的侧脸。你记住了这一幕，却没想到它会成为日常。',
    icon: 'book',
    relatedCharacter: 'qinghe',
  },
  {
    id: 'rv3',
    day: 9,
    time: 'Day 9 · 深夜',
    category: '回忆',
    title: '喷泉边的旋律',
    summary: '第一次听见顾沉舟的吉他。',
    detail:
      '夜里收摊，你抄近路穿过广场。喷泉的水声里，混着一段低低的吉他。那个抱着旧吉他的人没有抬头，可那段旋律却在你心里留了很久。',
    icon: 'music',
    relatedCharacter: 'chenzhou',
  },
  {
    id: 'rv4',
    day: 12,
    time: 'Day 12 · 傍晚',
    category: '剧情',
    title: '雨天的避雨人',
    summary: '一场突来的雷阵雨，让小店挤满了人。',
    detail:
      '苏晴手忙脚乱地添着椅子，你给每位避雨的客人端上热饮。林清和帮你擦着被雨打湿的窗台，轻声说：「这样热闹的店，真好。」',
    icon: 'rain',
    relatedCharacter: 'qinghe',
  },
  {
    id: 'rv5',
    day: 14,
    time: 'Day 14 · 午后',
    category: '里程碑',
    title: '小猫拉花',
    summary: '你为她端上了练习了一夜的拉花。',
    detail: '一只歪歪扭扭却努力可爱的小猫，浮在拿铁的奶泡上。这是你藏起来的心意，而她的回应，正握在你此刻的选择里。',
    icon: 'heart',
    relatedCharacter: 'qinghe',
    pinned: true,
  },
];
