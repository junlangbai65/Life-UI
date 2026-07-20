// Life-UI — 全局类型定义
import type { IconName } from './components/base/AppIcon.vue';

export type CharacterId = 'qinghe' | 'suqing' | 'chenzhou';

export interface StatDef {
  key: string;
  label: string;
  icon: IconName;
  value: number;
  max: number;
  color: string;
}

export interface CharacterStatTag {
  label: string;
  tone: 'strawberry' | 'mint' | 'sky' | 'butter' | 'lavender' | 'peach' | 'neutral';
  icon?: IconName;
}

export interface CharacterAttribute {
  key: string;
  label: string;
  value: number; // 0-100
}

export interface Character {
  id: CharacterId;
  name: string;
  fullName: string;
  title: string; // 身份
  cv: string;
  color: string; // 主题色 css var
  accent: 'lavender' | 'peach' | 'sky';
  affinity: number; // 好感度 0-100
  affinityStage: string; // 关系阶段
  mood: string;
  bio: string;
  likes: string[];
  statusTags: CharacterStatTag[];
  attributes: CharacterAttribute[];
  location: string; // 当前所在场景 id
}

export type Speaker = 'narration' | 'player' | CharacterId;

export interface DialogueMessage {
  id: string;
  speaker: Speaker;
  name?: string;
  text: string;
  emotion?: string;
  streaming?: boolean;
}

export interface DialogueChoice {
  id: string;
  text: string;
  hint?: string;
  tone?: 'strawberry' | 'mint' | 'sky' | 'lavender' | 'peach';
}

export interface Scene {
  id: string;
  name: string;
  subtitle: string;
  icon: IconName;
  tone: 'strawberry' | 'mint' | 'sky' | 'butter' | 'lavender' | 'peach';
  x: number; // 地图坐标 %（0-100）
  y: number;
  unlocked: boolean;
  description: string;
  presentCharacters: CharacterId[];
}

export interface TimelineEvent {
  id: string;
  day: number;
  time: string;
  title: string;
  description: string;
  icon: IconName;
  status: 'done' | 'current' | 'upcoming' | 'preview';
  relatedCharacter?: CharacterId;
}

export interface ReviewEntry {
  id: string;
  day: number;
  time: string;
  category: '剧情' | '回忆' | '里程碑';
  title: string;
  summary: string;
  detail: string;
  icon: IconName;
  relatedCharacter?: CharacterId;
  pinned?: boolean;
}

export interface SaveSlot {
  id: string;
  name: string;
  branch: string; // 分支线名
  branchColor: 'strawberry' | 'mint' | 'sky' | 'lavender' | 'peach' | 'neutral';
  day: number;
  time: string;
  scene: string;
  summary: string;
  savedAt: string;
  isAuto?: boolean;
  thumbnailChar?: CharacterId;
  empty?: boolean;
}

export interface EnvInfo {
  weather: { label: string; icon: IconName };
  season: string;
  timeOfDay: string;
  ambiance: string;
  day: number;
}

export interface TreeNode {
  key: string;
  label: string;
  value?: string | number;
  badge?: string;
  children?: TreeNode[];
}

export interface HistoryRecord {
  id: string;
  time: string;
  label: string;
  delta: string;
  direction: 'up' | 'down' | 'flat';
  icon: IconName;
}
