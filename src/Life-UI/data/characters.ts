import type { Character } from '../types';

export const characters: Character[] = [
  {
    id: 'qinghe',
    name: '清和',
    fullName: '林清和',
    title: '温柔学姐 · 常客',
    cv: '声线：温柔知性',
    color: 'var(--lf-char-qinghe)',
    accent: 'lavender',
    affinity: 64,
    affinityStage: '暗生情愫',
    mood: '惬意',
    bio: '邻校文学系的研究生，几乎每个午后都会来云町咖啡屋占据靠窗的位置。习惯点一杯热拿铁，安静地读一下午书，偶尔抬头对你温柔一笑。',
    likes: ['热拿铁', '旧书店', '雨天', '钢琴曲'],
    statusTags: [
      { label: '在店内', tone: 'mint', icon: 'location' },
      { label: '心情很好', tone: 'strawberry', icon: 'mood' },
      { label: '读书中', tone: 'lavender', icon: 'book' },
    ],
    attributes: [
      { key: 'gentle', label: '温柔', value: 92 },
      { key: 'wisdom', label: '学识', value: 88 },
      { key: 'lively', label: '活泼', value: 41 },
      { key: 'trust', label: '信任', value: 70 },
    ],
    location: 'cafe',
  },
  {
    id: 'suqing',
    name: '苏晴',
    fullName: '苏晴',
    title: '元气店员 · 邻家',
    cv: '声线：明朗元气',
    color: 'var(--lf-char-suqing)',
    accent: 'peach',
    affinity: 78,
    affinityStage: '青梅竹马',
    mood: '雀跃',
    bio: '和你一起把云町咖啡屋撑起来的好搭档，从小一起长大的邻居。嗓门大、笑点低，却总在你最累的时候端来一杯加了双份糖的特调。',
    likes: ['草莓蛋糕', '街机厅', '烟花', '恶作剧'],
    statusTags: [
      { label: '在吧台', tone: 'peach', icon: 'coffee' },
      { label: '干劲十足', tone: 'butter', icon: 'energy' },
      { label: '想吃甜点', tone: 'strawberry', icon: 'heart' },
    ],
    attributes: [
      { key: 'lively', label: '活泼', value: 96 },
      { key: 'cook', label: '手艺', value: 81 },
      { key: 'calm', label: '沉稳', value: 38 },
      { key: 'trust', label: '信任', value: 90 },
    ],
    location: 'cafe',
  },
  {
    id: 'chenzhou',
    name: '沉舟',
    fullName: '顾沉舟',
    title: '高冷音乐人 · 谜',
    cv: '声线：清冷低沉',
    color: 'var(--lf-char-chenzhou)',
    accent: 'sky',
    affinity: 35,
    affinityStage: '初识',
    mood: '疏离',
    bio: '夜里才会出现的街头音乐人，抱着一把旧吉他坐在云町广场的喷泉边。话不多，眼神却像深海。据说他在等一个永远不会来的人。',
    likes: ['深夜电台', '黑咖啡', '旧吉他', '海'],
    statusTags: [
      { label: '广场喷泉', tone: 'sky', icon: 'location' },
      { label: '若有所思', tone: 'lavender', icon: 'music' },
      { label: '戒备中', tone: 'neutral', icon: 'lock' },
    ],
    attributes: [
      { key: 'cool', label: '清冷', value: 89 },
      { key: 'talent', label: '才华', value: 94 },
      { key: 'open', label: '坦诚', value: 28 },
      { key: 'trust', label: '信任', value: 33 },
    ],
    location: 'square',
  },
];

export function getCharacter(id: string) {
  return characters.find(c => c.id === id);
}
