import type { CharacterId } from '../types';

// AI 生成的角色立绘接入点（主页 / 角色卡使用）。
// 当前环境未生成位图立绘，统一回退到 CharacterAvatar 的 SVG 贴纸立绘。
// 未来如需接入位图立绘：`import img from '../assets/portrait-qinghe.png?url'`
// 然后填入下表即可，组件会自动优先使用位图。
export const portraits: Partial<Record<CharacterId, string>> = {};
