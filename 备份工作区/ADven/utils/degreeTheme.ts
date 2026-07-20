/**
 * 从 worldState.degree 解析摄氏温度，并生成 UI 色调覆盖（叠在 panel 时间主题之上）。
 * 负温：雪地日光色（浅冰蓝系）↔ 冬夜色（深青灰 + 冰蓝点缀）按时间与强度渐进混合，避免高饱和廉价蓝。
 * 高温（≥30℃）：暖白/杏色空气感背景 + 青蓝主交互（降温）；夜间为深灰 + 暖灯点缀 + 辅助青。
 */

import { computeTimePhaseWeights } from './panelTimeTheme';

export type DegreeFxToken = 'freezing' | 'cold' | 'mild' | 'hot' | 'unknown';

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

function lerpHue(h0: number, h1: number, t: number): number {
  let d = h1 - h0;
  if (d > 180) d -= 360;
  if (d < -180) d += 360;
  let h = h0 + d * t;
  if (h < 0) h += 360;
  if (h >= 360) h -= 360;
  return h;
}

type ParsedHsl = { h: number; s: number; l: number; a?: number };

/** 常见中文/英文/单位；无法解析返回 null（不施加温度约束） */
export function parseDegreeToCelsius(raw: string | null | undefined): number | null {
  const s0 = (raw ?? '').trim();
  if (!s0) return null;
  const s = s0.replace(/[−﹣－]/g, '-').replace(/℃/g, '°C');

  const lingxia1 = s.match(/零\s*下\s*(\d+(?:\.\d+)?)/);
  if (lingxia1) return -Number.parseFloat(lingxia1[1]);
  const lingxia2 = s.match(/零下\s*(\d+(?:\.\d+)?)/);
  if (lingxia2) return -Number.parseFloat(lingxia2[1]);
  const fu = s.match(/负\s*(\d+(?:\.\d+)?)/);
  if (fu) return -Number.parseFloat(fu[1]);

  const isF = /°\s*F|华氏|\bF\b/i.test(s);
  const numMatch = s.match(/-?\d+(?:\.\d+)?/);
  if (!numMatch) return null;
  let v = Number.parseFloat(numMatch[0]);
  if ((/零下|负/.test(s) || /^-\s*\d/.test(s)) && v > 0) v = -v;

  if (isF) return ((v - 32) * 5) / 9;
  return v;
}

export function degreeFxToken(c: number | null): DegreeFxToken {
  if (c === null || Number.isNaN(c)) return 'unknown';
  if (c < 0) return 'freezing';
  if (c < 12) return 'cold';
  if (c < 30) return 'mild';
  return 'hot';
}

function parseHslMatch(m: RegExpMatchArray): ParsedHsl {
  return {
    h: Number.parseFloat(m[1]),
    s: Number.parseFloat(m[2]),
    l: Number.parseFloat(m[3]),
    a: m[4] !== undefined && m[4] !== '' ? Number.parseFloat(m[4]) : undefined,
  };
}

function formatParsed(p: ParsedHsl): string {
  if (p.a !== undefined && p.a < 1) {
    return `hsl(${p.h.toFixed(1)}deg ${p.s.toFixed(1)}% ${p.l.toFixed(1)}% / ${p.a.toFixed(3)})`;
  }
  return `hsl(${p.h.toFixed(1)}deg ${p.s.toFixed(1)}% ${p.l.toFixed(1)}%)`;
}

function mixParsed(a: ParsedHsl, b: ParsedHsl, t: number): ParsedHsl {
  return {
    h: lerpHue(a.h, b.h, t),
    s: lerp(a.s, b.s, t),
    l: lerp(a.l, b.l, t),
    a: a.a !== undefined && b.a !== undefined ? lerp(a.a, b.a, t) : b.a ?? a.a,
  };
}

/** 将字符串中按顺序出现的每个 hsl(...) 与 target 中对应项混合（结构需一致）。 */
function mixCssHslStrings(base: string, target: string, t: number): string {
  if (t <= 0) return base;
  if (t >= 1) return target;
  const re = /hsl\(\s*([\d.]+)deg\s+([\d.]+)%\s+([\d.]+)%(?:\s*\/\s*([\d.]+))?\s*\)/gi;
  const bm = [...base.matchAll(re)];
  const tm = [...target.matchAll(re)];
  if (bm.length === 0 || bm.length !== tm.length) {
    return base;
  }
  let result = base;
  for (let i = bm.length - 1; i >= 0; i--) {
    const mixed = formatParsed(mixParsed(parseHslMatch(bm[i]), parseHslMatch(tm[i]), t));
    const start = bm[i].index!;
    result = result.slice(0, start) + mixed + result.slice(start + bm[i][0].length);
  }
  return result;
}

function tintHslComponent(h: number, s: number, l: number, a: number | undefined, coldW: number): ParsedHsl {
  let nh = h;
  let ns = s;
  let nl = l;
  if (coldW > 0) {
    const targetH = 212;
    nh = lerpHue(h, targetH, coldW * 0.38);
    ns = lerp(s, Math.min(48, s + 6), coldW * 0.18);
    if (l < 48) nl = lerp(l, l + 5, coldW * 0.26);
    else if (l > 78) nl = lerp(l, l - 5, coldW * 0.18);
  }
  return { h: nh, s: ns, l: nl, a };
}

function formatHsl(p: ParsedHsl): string {
  return formatParsed(p);
}

function replaceAllHslInString(value: string, coldW: number): string {
  return value.replace(/hsl\(\s*([\d.]+)deg\s+([\d.]+)%\s+([\d.]+)%\s*(?:\/\s*([\d.]+)\s*)?\)/gi, (_m, h, s, l, aStr) => {
    const a = aStr !== undefined && aStr !== '' ? Number.parseFloat(aStr) : undefined;
    const tinted = tintHslComponent(Number.parseFloat(h), Number.parseFloat(s), Number.parseFloat(l), a, coldW);
    return formatHsl(tinted);
  });
}

/* —— 负温：雪地日光（冰蓝向、降亮提对比）与冬夜 —— */

/**
 * 日光雪地：色相 ~209–214°（冰蓝/天蓝）；背景再略压一层明度，正文与线框略加重。
 */
const FD = {
  bgLayer: { h: 212, s: 34, l: 73 },
  bgSub: { h: 211, s: 28, l: 81 },
  bgMain: { h: 210, s: 24, l: 87 },
  ice: { h: 209, s: 44, l: 54 },
  iceH: { h: 209, s: 36, l: 48 },
  iceA: { h: 210, s: 34, l: 42 },
  textSec: { h: 214, s: 15, l: 50 },
  fog: { h: 210, s: 10, l: 91 },
  silver: { h: 213, s: 18, l: 66 },
};

/** 冬夜点缀与日光同一冰蓝轴，避免 200° 一带偏青 */
const FN = {
  bg0: { h: 211, s: 22, l: 15 },
  bg1: { h: 209, s: 21, l: 20 },
  bg2: { h: 210, s: 22, l: 24 },
  accent: { h: 208, s: 48, l: 62 },
};

function hs(h: number, s: number, l: number): string {
  return `hsl(${h.toFixed(1)}deg ${s.toFixed(1)}% ${l.toFixed(1)}%)`;
}

function hsla(h: number, s: number, l: number, a: number): string {
  return `hsl(${h.toFixed(1)}deg ${s.toFixed(1)}% ${l.toFixed(1)}% / ${a.toFixed(3)})`;
}

/** 雪地日光：完整 CSS 变量（与时间主题键一致） */
function frozenDayShell(): Record<string, string> {
  const { bgMain, bgSub, bgLayer, ice, iceH, iceA, textSec, fog, silver } = FD;
  const textBody = { h: 216, s: 16, l: 27 };
  const textMuted = { h: 213, s: 11, l: 42 };

  return {
    '--bg-0': hs(bgLayer.h, bgLayer.s, bgLayer.l),
    '--bg-1': hs(bgSub.h, bgSub.s, bgSub.l),
    '--bg-2': hs(bgMain.h, bgMain.s, bgMain.l),
    '--card': hsla(210, 12, 89, 0.54),
    '--card-2': hsla(211, 14, 85, 0.55),
    '--line': hsla(silver.h, silver.s + 2, silver.l - 6, 0.38),
    '--ink': hs(textSec.h, textSec.s + 3, 36),
    '--ink-soft': hs(textSec.h, textSec.s, textSec.l),
    '--strip-bg': hsla(bgSub.h, 28, 86, 0.58),
    '--strip-border': hsla(silver.h, 22, 64, 0.32),
    '--strip-title': hs(ice.h, Math.min(52, ice.s + 4), ice.l + 4),
    '--shell-outer-border': hsla(212, 22, 58, 0.42),
    '--shell-hotspot-tr': hsla(208, 28, 88, 0.1),
    '--shell-hotspot-bl': hsla(214, 22, 82, 0.08),

    '--maintext-paper-top': hsla(210, 11, 91, 0.92),
    '--maintext-paper-bottom': hsla(211, 9, 86, 0.92),
    '--maintext-grid-h': hsla(212, 16, 58, 0.28),
    '--maintext-grid-v': hsla(212, 16, 58, 0.34),
    '--maintext-fg': hs(textBody.h, textBody.s, textBody.l),
    '--maintext-muted': hs(textMuted.h, textMuted.s, textMuted.l),
    '--maintext-content-border': hsla(212, 18, 62, 0.36),
    '--maintext-panel-border': hsla(ice.h, 32, 58, 0.5),
    '--maintext-panel-shadow': `0 0 0 1px ${hsla(213, 22, 68, 0.72)} inset, 0 4px 12px ${hsla(215, 18, 28, 0.14)}`,
    '--maintext-paper-inset-shadow': `0 0 0 1px ${hsla(210, 12, 96, 0.55)} inset, 0 6px 14px ${hsla(215, 14, 38, 0.1)}`,
    '--maintext-cursor': hs(iceA.h, iceA.s + 2, iceA.l),
    '--maintext-cursor-glow': hsla(ice.h, 38, 54, 0.24),

    '--maintext-scrollbar-track-1': hs(210, 18, 86),
    '--maintext-scrollbar-track-2': hs(211, 20, 80),
    '--maintext-scrollbar-track-border': hsla(silver.h, 20, 58, 0.52),
    '--maintext-scrollbar-thumb-1': hs(iceH.h, iceH.s + 2, iceH.l),
    '--maintext-scrollbar-thumb-2': hs(iceA.h, iceA.s, iceA.l),
    '--maintext-scrollbar-thumb-border': hsla(209, 28, 42, 0.68),
    '--maintext-scrollbar-thumb-hover-1': hs(ice.h, ice.s + 2, ice.l),
    '--maintext-scrollbar-thumb-hover-2': hs(iceH.h, iceH.s + 2, iceH.l),

    '--maintext-dialogue-border': hsla(iceH.h, 28, 52, 0.52),
    '--maintext-dialogue-bg-1': hsla(209, 22, 90, 0.45),
    '--maintext-dialogue-bg-2': hsla(211, 20, 86, 0.38),
    '--maintext-dialogue-zh': hs(215, 18, 26),

    '--maintext-tab-border': hsla(silver.h, 20, 62, 0.45),
    '--maintext-tab-bg': hsla(bgLayer.h, 24, 78, 0.82),
    '--maintext-tab-fg': hs(213, 14, 34),
    '--maintext-tab-hover-border': hsla(iceH.h, 32, 52, 0.58),
    '--maintext-tab-active-bg': `linear-gradient(135deg, ${hsla(ice.h, 44, 54, 0.9)}, ${hsla(iceH.h, 36, 48, 0.88)})`,
    '--maintext-tab-active-border': hsla(ice.h, 40, 50, 0.62),
    '--maintext-tab-active-fg': hsla(210, 25, 98, 0.98),
  };
}

/** 冬夜：深背景 + 微光点缀 */
function frozenNightShell(): Record<string, string> {
  const { bg0, bg1, bg2, accent } = FN;
  const paperT = { h: 211, s: 20, l: 17 };
  const paperB = { h: 209, s: 18, l: 14 };
  const inkL = { h: 210, s: 16, l: 90 };
  const inkM = { h: 211, s: 12, l: 66 };

  return {
    '--bg-0': hs(bg0.h, bg0.s, bg0.l),
    '--bg-1': hs(bg1.h, bg1.s, bg1.l),
    '--bg-2': hs(bg2.h, bg2.s, bg2.l),
    '--card': hsla(bg1.h, 24, 22, 0.55),
    '--card-2': hsla(bg0.h, 22, 18, 0.58),
    '--line': hsla(accent.h, 28, 52, 0.22),
    '--ink': hs(inkL.h, inkL.s, inkL.l),
    '--ink-soft': hs(inkM.h, inkM.s, inkM.l),
    '--strip-bg': hsla(bg0.h, 22, 14, 0.68),
    '--strip-border': hsla(accent.h, 22, 48, 0.2),
    '--strip-title': hs(accent.h, accent.s * 0.92, accent.l),
    '--shell-outer-border': hsla(accent.h, 24, 42, 0.32),
    '--shell-hotspot-tr': hsla(accent.h, 38, 58, 0.12),
    '--shell-hotspot-bl': hsla(bg1.h, 22, 32, 0.1),

    '--maintext-paper-top': hsla(paperT.h, paperT.s, paperT.l, 0.96),
    '--maintext-paper-bottom': hsla(paperB.h, paperB.s, paperB.l, 0.96),
    '--maintext-grid-h': hsla(accent.h, 22, 52, 0.14),
    '--maintext-grid-v': hsla(accent.h, 22, 52, 0.18),
    '--maintext-fg': hs(inkL.h, inkL.s - 2, 92),
    '--maintext-muted': hs(inkM.h, inkM.s, inkM.l),
    '--maintext-content-border': hsla(accent.h, 26, 48, 0.35),
    '--maintext-panel-border': hsla(accent.h, 32, 52, 0.42),
    '--maintext-panel-shadow': `0 0 0 1px ${hsla(bg0.h, 28, 10, 0.78)} inset, 0 4px 10px ${hsla(0, 0, 0, 0.32)}`,
    '--maintext-paper-inset-shadow': `0 0 0 1px ${hsla(accent.h, 25, 52, 0.12)} inset, 0 6px 12px ${hsla(0, 0, 0, 0.28)}`,
    '--maintext-cursor': hs(accent.h, accent.s * 0.85, accent.l),
    '--maintext-cursor-glow': hsla(accent.h, 40, 58, 0.22),

    '--maintext-scrollbar-track-1': hs(bg1.h, 18, 24),
    '--maintext-scrollbar-track-2': hs(bg0.h, 16, 20),
    '--maintext-scrollbar-track-border': hsla(accent.h, 18, 40, 0.4),
    '--maintext-scrollbar-thumb-1': hsla(accent.h, 28, 48, 0.85),
    '--maintext-scrollbar-thumb-2': hsla(bg1.h, 20, 32, 0.9),
    '--maintext-scrollbar-thumb-border': hsla(bg0.h, 22, 16, 0.75),
    '--maintext-scrollbar-thumb-hover-1': hs(accent.h, accent.s, accent.l),
    '--maintext-scrollbar-thumb-hover-2': hsla(accent.h, 32, 44, 0.88),

    '--maintext-dialogue-border': hsla(accent.h, 28, 52, 0.45),
    '--maintext-dialogue-bg-1': hsla(bg1.h, 26, 26, 0.42),
    '--maintext-dialogue-bg-2': hsla(bg0.h, 24, 20, 0.38),
    '--maintext-dialogue-zh': hs(inkL.h, 20, 88),

    '--maintext-tab-border': hsla(accent.h, 22, 42, 0.42),
    '--maintext-tab-bg': hsla(bg0.h, 22, 14, 0.82),
    '--maintext-tab-fg': hs(inkL.h, 16, 86),
    '--maintext-tab-hover-border': hsla(accent.h, 35, 58, 0.48),
    '--maintext-tab-active-bg': `linear-gradient(135deg, ${hsla(accent.h, 38, 42, 0.9)}, ${hsla(bg1.h, 22, 22, 0.88)})`,
    '--maintext-tab-active-border': hsla(accent.h, 42, 58, 0.5),
    '--maintext-tab-active-fg': hs(accent.h, 48, 92),
  };
}

/* —— 高温（≥30℃）：暖白杏色空气感 + 青蓝主交互；夏夜深灰 + 暖灯 + 辅助青 —— */

/** 日光：分层 #FFE4B8 / 次 #FFEFD6 / 主 #FFF6E5；主交互 #4FB3BF / #3FA2AE / #358C97 */
function hotDayShell(): Record<string, string> {
  const bgLayer = { h: 35, s: 100, l: 86 };
  const bgSub = { h: 38, s: 100, l: 92 };
  const bgMain = { h: 43, s: 100, l: 95 };
  const pool = { h: 187, s: 47, l: 53 };
  const poolH = { h: 187, s: 47, l: 46 };
  const poolA = { h: 187, s: 48, l: 40 };
  const orange = { h: 25, s: 100, l: 65 };
  const textBody = { h: 28, s: 22, l: 24 };
  const textMuted = { h: 30, s: 14, l: 44 };
  const warmGray = { h: 30, s: 16, l: 60 };

  return {
    '--bg-0': hs(bgLayer.h, bgLayer.s, bgLayer.l),
    '--bg-1': hs(bgSub.h, bgSub.s, bgSub.l),
    '--bg-2': hs(bgMain.h, bgMain.s, bgMain.l),
    '--card': hsla(40, 100, 99, 0.56),
    '--card-2': hsla(38, 85, 97, 0.54),
    '--line': hsla(30, 18, 58, 0.36),
    '--ink': hs(textBody.h, textBody.s, textBody.l),
    '--ink-soft': hs(warmGray.h, warmGray.s, warmGray.l),
    '--strip-bg': hsla(38, 75, 94, 0.6),
    '--strip-border': hsla(pool.h, 38, 58, 0.34),
    '--strip-title': hs(pool.h, Math.min(52, pool.s + 3), pool.l + 2),
    '--shell-outer-border': hsla(orange.h, 72, 62, 0.36),
    '--shell-hotspot-tr': hsla(43, 95, 94, 0.16),
    '--shell-hotspot-bl': hsla(25, 90, 72, 0.11),

    '--maintext-paper-top': hsla(40, 100, 99, 0.94),
    '--maintext-paper-bottom': hsla(35, 55, 94, 0.92),
    '--maintext-grid-h': hsla(187, 22, 58, 0.24),
    '--maintext-grid-v': hsla(187, 22, 55, 0.3),
    '--maintext-fg': hs(textBody.h, textBody.s, textBody.l),
    '--maintext-muted': hs(textMuted.h, textMuted.s, textMuted.l),
    '--maintext-content-border': hsla(187, 28, 58, 0.36),
    '--maintext-panel-border': hsla(pool.h, 38, 54, 0.5),
    '--maintext-panel-shadow': `0 0 0 1px ${hsla(187, 30, 68, 0.68)} inset, 0 4px 12px ${hsla(32, 100, 74, 0.2)}`,
    '--maintext-paper-inset-shadow': `0 0 0 1px ${hsla(40, 90, 98, 0.58)} inset, 0 6px 14px ${hsla(32, 95, 72, 0.18)}`,
    '--maintext-cursor': hs(pool.h, pool.s + 2, pool.l),
    '--maintext-cursor-glow': hsla(pool.h, 48, 55, 0.26),

    '--maintext-scrollbar-track-1': hs(38, 65, 92),
    '--maintext-scrollbar-track-2': hs(35, 50, 88),
    '--maintext-scrollbar-track-border': hsla(30, 20, 58, 0.46),
    '--maintext-scrollbar-thumb-1': hs(poolH.h, poolH.s + 2, poolH.l),
    '--maintext-scrollbar-thumb-2': hs(poolA.h, poolA.s, poolA.l),
    '--maintext-scrollbar-thumb-border': hsla(poolA.h, 42, 38, 0.66),
    '--maintext-scrollbar-thumb-hover-1': hs(pool.h, pool.s + 2, pool.l),
    '--maintext-scrollbar-thumb-hover-2': hs(poolH.h, poolH.s + 2, poolH.l),

    '--maintext-dialogue-border': hsla(187, 30, 52, 0.48),
    '--maintext-dialogue-bg-1': hsla(40, 55, 97, 0.48),
    '--maintext-dialogue-bg-2': hsla(35, 45, 94, 0.4),
    '--maintext-dialogue-zh': hs(28, 22, 22),

    '--maintext-tab-border': hsla(187, 26, 64, 0.44),
    '--maintext-tab-bg': hsla(43, 72, 96, 0.84),
    '--maintext-tab-fg': hs(28, 18, 28),
    '--maintext-tab-hover-border': hsla(pool.h, 42, 50, 0.54),
    '--maintext-tab-active-bg': `linear-gradient(135deg, ${hsla(pool.h, 48, 52, 0.92)}, ${hsla(poolH.h, 44, 46, 0.9)})`,
    '--maintext-tab-active-border': hsla(pool.h, 44, 44, 0.6),
    '--maintext-tab-active-fg': hsla(40, 100, 99, 0.98),
  };
}

/** 夏夜：#2A2F36 + 暖灯 #FFB86B + 辅助青 #6FA3B8 */
function hotNightShell(): Record<string, string> {
  const bg0 = { h: 220, s: 12, l: 19 };
  const bg1 = { h: 218, s: 13, l: 23 };
  const bg2 = { h: 216, s: 12, l: 27 };
  const lamp = { h: 28, s: 100, l: 71 };
  const cyan = { h: 197, s: 38, l: 58 };
  const pool = { h: 187, s: 47, l: 53 };
  const paperT = { h: 218, s: 14, l: 18 };
  const paperB = { h: 220, s: 12, l: 15 };
  const inkL = { h: 40, s: 22, l: 92 };
  const inkM = { h: 35, s: 12, l: 68 };

  return {
    '--bg-0': hs(bg0.h, bg0.s, bg0.l),
    '--bg-1': hs(bg1.h, bg1.s, bg1.l),
    '--bg-2': hs(bg2.h, bg2.s, bg2.l),
    '--card': hsla(bg1.h, 16, 22, 0.56),
    '--card-2': hsla(bg0.h, 14, 18, 0.58),
    '--line': hsla(cyan.h, 28, 52, 0.24),
    '--ink': hs(inkL.h, inkL.s, inkL.l),
    '--ink-soft': hs(inkM.h, inkM.s, inkM.l),
    '--strip-bg': hsla(bg0.h, 14, 16, 0.7),
    '--strip-border': hsla(lamp.h, 55, 58, 0.28),
    '--strip-title': hs(lamp.h, lamp.s * 0.88, lamp.l),
    '--shell-outer-border': hsla(cyan.h, 28, 48, 0.34),
    '--shell-hotspot-tr': hsla(lamp.h, 65, 58, 0.14),
    '--shell-hotspot-bl': hsla(cyan.h, 32, 42, 0.12),

    '--maintext-paper-top': hsla(paperT.h, paperT.s, paperT.l, 0.96),
    '--maintext-paper-bottom': hsla(paperB.h, paperB.s, paperB.l, 0.96),
    '--maintext-grid-h': hsla(cyan.h, 22, 48, 0.16),
    '--maintext-grid-v': hsla(cyan.h, 22, 48, 0.2),
    '--maintext-fg': hs(inkL.h, inkL.s - 2, 90),
    '--maintext-muted': hs(inkM.h, inkM.s, inkM.l),
    '--maintext-content-border': hsla(cyan.h, 26, 50, 0.38),
    '--maintext-panel-border': hsla(lamp.h, 48, 58, 0.4),
    '--maintext-panel-shadow': `0 0 0 1px ${hsla(bg0.h, 18, 12, 0.82)} inset, 0 4px 12px ${hsla(0, 0, 0, 0.34)}`,
    '--maintext-paper-inset-shadow': `0 0 0 1px ${hsla(lamp.h, 40, 52, 0.14)} inset, 0 6px 12px ${hsla(0, 0, 0, 0.3)}`,
    '--maintext-cursor': hs(cyan.h, cyan.s * 0.9, cyan.l),
    '--maintext-cursor-glow': hsla(cyan.h, 42, 58, 0.24),

    '--maintext-scrollbar-track-1': hs(bg1.h, 14, 24),
    '--maintext-scrollbar-track-2': hs(bg0.h, 12, 20),
    '--maintext-scrollbar-track-border': hsla(cyan.h, 20, 42, 0.42),
    '--maintext-scrollbar-thumb-1': hsla(pool.h, 42, 48, 0.88),
    '--maintext-scrollbar-thumb-2': hsla(cyan.h, 36, 44, 0.85),
    '--maintext-scrollbar-thumb-border': hsla(bg0.h, 14, 14, 0.78),
    '--maintext-scrollbar-thumb-hover-1': hs(lamp.h, lamp.s * 0.85, lamp.l),
    '--maintext-scrollbar-thumb-hover-2': hsla(lamp.h, 55, 58, 0.85),

    '--maintext-dialogue-border': hsla(cyan.h, 30, 52, 0.46),
    '--maintext-dialogue-bg-1': hsla(bg1.h, 18, 24, 0.44),
    '--maintext-dialogue-bg-2': hsla(bg0.h, 14, 18, 0.4),
    '--maintext-dialogue-zh': hs(inkL.h, 18, 88),

    '--maintext-tab-border': hsla(cyan.h, 24, 44, 0.44),
    '--maintext-tab-bg': hsla(bg0.h, 14, 14, 0.84),
    '--maintext-tab-fg': hs(inkL.h, 14, 86),
    '--maintext-tab-hover-border': hsla(lamp.h, 55, 62, 0.46),
    '--maintext-tab-active-bg': `linear-gradient(135deg, ${hsla(pool.h, 40, 42, 0.92)}, ${hsla(cyan.h, 32, 38, 0.88)})`,
    '--maintext-tab-active-border': hsla(lamp.h, 50, 58, 0.52),
    '--maintext-tab-active-fg': hs(lamp.h, 88, 94),
  };
}

const FROZEN_DAY = frozenDayShell();
const FROZEN_NIGHT = frozenNightShell();
const HOT_DAY = hotDayShell();
const HOT_NIGHT = hotNightShell();

function mergeFrozenPalettes(nightWeight: number): Record<string, string> {
  const w = Math.min(1, Math.max(0, nightWeight));
  const out: Record<string, string> = {};
  for (const key of Object.keys(FROZEN_DAY)) {
    const d = FROZEN_DAY[key];
    const n = FROZEN_NIGHT[key];
    out[key] = mixCssHslStrings(d, n, w);
  }
  return out;
}

function mergeHotPalettes(nightWeight: number): Record<string, string> {
  const w = Math.min(1, Math.max(0, nightWeight));
  const out: Record<string, string> = {};
  for (const key of Object.keys(HOT_DAY)) {
    const d = HOT_DAY[key];
    const n = HOT_NIGHT[key];
    out[key] = mixCssHslStrings(d, n, w);
  }
  return out;
}

/** 负温混合强度：略早于 -32℃ 贴齐冰色表，中段略加速，减轻与时间主题混色 */
function coldBlendFactor(celsius: number): number {
  const a = Math.abs(celsius);
  const linear = Math.min(1, a / 26);
  return Math.min(1, linear * 1.06);
}

/** 高温配色自 30℃ 起启用（含本数）；约 61℃ 贴齐夏日色表 */
function heatBlendFactor(celsius: number): number {
  if (celsius < 30) return 0;
  return Math.min(1, (celsius - 29) / 32);
}

/**
 * 叙事页「积雪状态」强度 0～1：越冷越厚；夜间堆积多、白昼略化（与夜权重联动）。
 * 供 CSS --snow-level 驱动 blur / 对比 / 叠层，而非单纯贴白。
 */
export function computeSnowLevel(celsius: number | null, decimalHours: number | null): number {
  if (celsius === null || Number.isNaN(celsius) || celsius >= 0) return 0;
  const cold = Math.min(1, Math.abs(celsius) / 26);
  const nightW = decimalHours !== null ? computeTimePhaseWeights(decimalHours)[0] : 0.28;
  const accumulation = 0.4 + 0.6 * nightW;
  return Math.min(1, cold * accumulation * 1.06);
}

/**
 * 叠在时间主题变量之上：
 * - 负温：向「雪地日光 ↔ 冬夜」全量渐进（强度见 coldBlendFactor），并与当前时刻的夜权重混合。
 * - 高温（≥30℃）：向「夏日日光 ↔ 夏夜」全量渐进（强度见 heatBlendFactor）。
 */
export function applyTemperatureTint(
  base: Record<string, string>,
  celsius: number | null,
  decimalHours: number | null = null,
): Record<string, string> {
  if (celsius === null || Number.isNaN(celsius)) {
    return { ...base };
  }

  const coldW = celsius < 0 ? coldBlendFactor(celsius) : 0;
  const heatBlend = heatBlendFactor(celsius);

  if (coldW === 0 && heatBlend === 0) {
    return { ...base };
  }

  if (coldW > 0) {
    const nightW = decimalHours !== null ? computeTimePhaseWeights(decimalHours)[0] : 0;
    const frozenMerged = mergeFrozenPalettes(nightW);
    const fallbackCold = coldW * 0.18;
    const out: Record<string, string> = {};
    for (const [k, v] of Object.entries(base)) {
      const tgt = frozenMerged[k];
      if (tgt) {
        out[k] = mixCssHslStrings(v, tgt, coldW);
      } else {
        out[k] = replaceAllHslInString(v, fallbackCold);
      }
    }
    return out;
  }

  const nightW = decimalHours !== null ? computeTimePhaseWeights(decimalHours)[0] : 0;
  const hotMerged = mergeHotPalettes(nightW);
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(base)) {
    const tgt = hotMerged[k];
    if (tgt) {
      out[k] = mixCssHslStrings(v, tgt, heatBlend);
    } else {
      out[k] = v;
    }
  }
  return out;
}
