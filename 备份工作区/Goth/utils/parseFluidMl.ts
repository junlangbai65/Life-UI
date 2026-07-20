/**
 * 从 MVU 原文（如「320ml」「约 50 毫升」）解析毫升数，供量杯可视化（0–1000）。
 * 无法解析时返回 null，界面应展示空杯与原文，勿当作 0。
 */
export interface ParseFluidMlResult {
  /** 解析成功时为 [0, 1000] 内的数值；失败为 null */
  ml: number | null;
  displayRaw: string;
}

export function parseFluidMl(raw: string): ParseFluidMlResult {
  const displayRaw = raw ?? '';
  const trimmed = String(displayRaw).trim();
  if (!trimmed) return { ml: null, displayRaw };

  const match = trimmed.match(/(\d+(?:\.\d+)?)\s*(?:ml|mL|ML|毫升)?/);
  if (!match) return { ml: null, displayRaw };

  const n = Number.parseFloat(match[1]);
  if (!Number.isFinite(n)) return { ml: null, displayRaw };

  const clamped = Math.min(1000, Math.max(0, n));
  return { ml: clamped, displayRaw };
}
