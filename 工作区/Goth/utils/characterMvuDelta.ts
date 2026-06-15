import type { CharacterState } from '../goth.types';

/** 相对「上一条 assistant 楼层」MVU 合并结果的数值差（当前 − 上一楼）；null 表示不展示 */
export interface CharacterMvuNumericDeltas {
  hpCurrent: number | null;
  san: number | null;
  pollution: number | null;
  stamina: number | null;
  currency: number | null;
}

export const EMPTY_CHARACTER_MVU_DELTAS: CharacterMvuNumericDeltas = {
  hpCurrent: null,
  san: null,
  pollution: null,
  stamina: null,
  currency: null,
};

export function computeCharacterMvuDeltas(prev: CharacterState, curr: CharacterState): CharacterMvuNumericDeltas {
  const d = (a: number, b: number): number | null =>
    Number.isFinite(a) && Number.isFinite(b) ? b - a : null;
  return {
    hpCurrent: d(prev.hpCurrent, curr.hpCurrent),
    san: d(prev.san, curr.san),
    pollution: d(prev.pollution, curr.pollution),
    stamina: d(prev.stamina, curr.stamina),
    currency: d(prev.currency, curr.currency),
  };
}

/** 整数项：零变化不显示 */
export function formatIntDelta(delta: number | null): string | null {
  if (delta === null || !Number.isFinite(delta)) return null;
  const rounded = Math.round(delta);
  if (rounded === 0) return null;
  return rounded > 0 ? `+${rounded}` : `${rounded}`;
}

/** 资产变化：以美元计，显示到分；零变化不显示 */
export function formatCurrencyDelta(delta: number | null): string | null {
  if (delta === null || !Number.isFinite(delta)) return null;
  const cents = Math.round(delta * 100);
  if (cents === 0) return null;
  const abs = (Math.abs(cents) / 100).toFixed(2);
  return cents > 0 ? `+$${abs}` : `−$${abs}`;
}

/** HP/SAN/体力/货币：数值越高越好；污染：数值越高越糟 */
export type MvuStatPolarity = 'positive' | 'negative' | 'currency';

export function deltaSemanticTone(
  polarity: MvuStatPolarity,
  delta: number | null,
): 'beneficial' | 'harmful' | null {
  if (delta === null || !Number.isFinite(delta) || delta === 0) return null;
  if (polarity === 'negative') return delta > 0 ? 'harmful' : 'beneficial';
  return delta > 0 ? 'beneficial' : 'harmful';
}

/** 数值标签用：有益绿 / 有害红（污染逻辑已反转） */
export function semanticToneClass(polarity: MvuStatPolarity, delta: number | null): string {
  const t = deltaSemanticTone(polarity, delta);
  if (t === 'beneficial') return 'goth-stat-mvu-delta--pos';
  if (t === 'harmful') return 'goth-stat-mvu-delta--neg';
  return '';
}

/** RPG 差分条：上一楼与当前在槽内的占比区间（left / width 百分数字符串） */
export function deltaOverlayLayout(
  curr: number,
  maxVal: number,
  delta: number | null,
): { left: string; width: string } | null {
  if (delta === null || !Number.isFinite(delta) || delta === 0) return null;
  if (!Number.isFinite(curr) || !maxVal || maxVal <= 0) return null;
  const prev = curr - delta;
  const clampPct = (v: number) => Math.min(100, Math.max(0, (v / maxVal) * 100));
  const pCurr = clampPct(curr);
  const pPrev = clampPct(prev);
  const left = Math.min(pCurr, pPrev);
  const width = Math.abs(pCurr - pPrev);
  if (width < 0.12) return null;
  return { left: `${left}%`, width: `${width}%` };
}

/** @deprecated 请用 semanticToneClass；保留以防外部引用 */
export function deltaToneClass(delta: number | null): string {
  return semanticToneClass('positive', delta);
}
