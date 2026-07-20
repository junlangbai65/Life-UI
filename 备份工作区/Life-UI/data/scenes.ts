import type { Scene } from '../types';

export const scenes: Scene[] = [
  {
    id: 'cafe',
    name: '云町咖啡屋',
    subtitle: '你的主场',
    icon: 'coffee',
    tone: 'peach',
    x: 38,
    y: 52,
    unlocked: true,
    description: '由你和苏晴一同经营的小店。木质吧台、靠窗的旧沙发，还有总是坐满熟客的午后。',
    presentCharacters: ['qinghe', 'suqing'],
  },
  {
    id: 'square',
    name: '云町广场',
    subtitle: '喷泉与街声',
    icon: 'tree',
    tone: 'mint',
    x: 66,
    y: 34,
    unlocked: true,
    description: '镇子的中心，喷泉日夜不息。入夜后会有街头艺人在这里弹唱，路灯把影子拉得很长。',
    presentCharacters: ['chenzhou'],
  },
  {
    id: 'bookstore',
    name: '旧书店「拾光」',
    subtitle: '纸页的香气',
    icon: 'book',
    tone: 'lavender',
    x: 20,
    y: 30,
    unlocked: true,
    description: '林清和最常出没的地方。窄窄的书架间藏着许多绝版书，老板娘养了一只爱睡觉的橘猫。',
    presentCharacters: ['qinghe'],
  },
  {
    id: 'seaside',
    name: '云町海岸',
    subtitle: '夕阳与浪',
    icon: 'cloud',
    tone: 'sky',
    x: 80,
    y: 66,
    unlocked: true,
    description: '走出小镇就能看到海。傍晚的堤坝是看夕阳的最佳位置，据说也是顾沉舟会独自前往的地方。',
    presentCharacters: [],
  },
  {
    id: 'festival',
    name: '夏日祭会场',
    subtitle: '尚未开放',
    icon: 'sparkle',
    tone: 'strawberry',
    x: 52,
    y: 80,
    unlocked: false,
    description: '盛夏的限定场景。当人气与好感累积到一定程度，这里会绽放属于云町的烟花。',
    presentCharacters: [],
  },
];

export function getScene(id: string) {
  return scenes.find(s => s.id === id);
}
