/**
 * 根据 worldState.time 在四个时段之间渐进插值面板 CSS 变量：
 * 清晨 6–10 · 正午 10–16 · 黄昏 16–19 · 夜晚 19–6（跨午夜）。
 * 权重为平滑高斯脉冲 + 边界余弦衔接，相邻时段自然过渡。
 * 配色参考：米色/浅棕/暖黄 → 暖白/浅金/淡橙 → 焦糖/橙红/暗金 → 深棕/蓝灰/微冷光。
 */

export function parseTimeToDecimalHours(raw: string | null | undefined): number | null {
  const s = (raw ?? '').trim();
  if (!s) return null;
  const m = s.match(/\b([01]?\d|2[0-3])[:：]([0-5]\d)\b/);
  if (m) {
    const h = Number.parseInt(m[1], 10);
    const min = Number.parseInt(m[2], 10);
    return h + min / 60;
  }
  return null;
}

/** @deprecated 旧版昼夜单轴因子；请使用 computeTimePhaseWeights + buildPanelTimeThemeVars(null) 的默认行为 */
export function computeDaylightFactor(decimalHours: number | null): number {
  if (decimalHours === null) return 1;
  const rad = ((decimalHours - 12) / 24) * 2 * Math.PI;
  return (Math.cos(rad) + 1) / 2;
}

type Hsl = { h: number; s: number; l: number };
type Hsla = { h: number; s: number; l: number; a: number };

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

function circDist(a: number, b: number): number {
  let d = Math.abs(a - b);
  return Math.min(d, 24 - d);
}

/**
 * 四时段权重 [夜, 晨, 昼, 昏]，和为 1。
 * 以 8 / 13 / 17.5 / 22 为中心的高斯脉冲，夜段用双中心贴合 19–6。
 */
export function computeTimePhaseWeights(decimalHours: number | null): [number, number, number, number] {
  if (decimalHours === null) return [0.08, 0.1, 0.74, 0.08];

  const h = ((decimalHours % 24) + 24) % 24;

  const gauss = (x: number, c: number, sigma: number): number => {
    const d = circDist(x, c);
    return Math.exp(-(d * d) / (2 * sigma * sigma));
  };

  // 夜：22 与 2 双峰，覆盖 19–6；σ 略大使与昏/晨衔接柔和
  let wNight = gauss(h, 22, 2.85) + gauss(h, 2, 2.85);
  // 压低白昼对「夜」的串扰
  if (h >= 9 && h < 19) wNight *= 0.04;

  const wMorning = gauss(h, 8, 1.85);
  const wDay = gauss(h, 13, 2.65);
  const wDusk = gauss(h, 17.5, 1.25);

  let wN = wNight;
  let wM = wMorning;
  let wD = wDay;
  let wU = wDusk;

  const sum = wN + wM + wD + wU;
  if (sum < 1e-6) return [0.25, 0.25, 0.25, 0.25];

  wN /= sum;
  wM /= sum;
  wD /= sum;
  wU /= sum;

  return [wN, wM, wD, wU];
}

function mixHsl(n: Hsl, m: Hsl, d: Hsl, u: Hsl, w: [number, number, number, number]): Hsl {
  const [wN, wM, wD, wU] = w;
  let x = 0;
  let y = 0;
  let sw = 0;
  let sl = 0;
  const phases = [n, m, d, u];
  const weights = [wN, wM, wD, wU];
  for (let i = 0; i < 4; i++) {
    const rad = (phases[i].h * Math.PI) / 180;
    x += weights[i] * Math.cos(rad);
    y += weights[i] * Math.sin(rad);
    sw += weights[i] * phases[i].s;
    sl += weights[i] * phases[i].l;
  }
  const hh = (Math.atan2(y, x) * 180) / Math.PI;
  return { h: hh < 0 ? hh + 360 : hh, s: sw, l: sl };
}

function mixHsla(n: Hsla, m: Hsla, d: Hsla, u: Hsla, w: [number, number, number, number]): Hsla {
  const [wN, wM, wD, wU] = w;
  let x = 0;
  let y = 0;
  let ss = 0;
  let sl = 0;
  let sa = 0;
  const phases = [n, m, d, u];
  const weights = [wN, wM, wD, wU];
  for (let i = 0; i < 4; i++) {
    const rad = (phases[i].h * Math.PI) / 180;
    x += weights[i] * Math.cos(rad);
    y += weights[i] * Math.sin(rad);
    ss += weights[i] * phases[i].s;
    sl += weights[i] * phases[i].l;
    sa += weights[i] * phases[i].a;
  }
  const hh = (Math.atan2(y, x) * 180) / Math.PI;
  return { h: hh < 0 ? hh + 360 : hh, s: ss, l: sl, a: sa };
}

function hslCss(c: Hsl): string {
  return `hsl(${c.h.toFixed(1)}deg ${c.s.toFixed(1)}% ${c.l.toFixed(1)}%)`;
}

function hslaCss(c: Hsla): string {
  return `hsl(${c.h.toFixed(1)}deg ${c.s.toFixed(1)}% ${c.l.toFixed(1)}% / ${c.a.toFixed(3)})`;
}

function edgeStrengthBlend(w: [number, number, number, number]): number {
  const sn = 1.12;
  const sm = 0.95;
  const sd = 0.88;
  const su = 1.02;
  return w[0] * sn + w[1] * sm + w[2] * sd + w[3] * su;
}

function enforceInkContrast(ink: Hsl, bgAvgL: number, w: [number, number, number, number]): Hsl {
  const tDay = w[2] + w[1] * 0.35;
  const minDelta = lerp(72, 54, Math.min(1, tDay));
  const minL = bgAvgL + minDelta;
  return { ...ink, l: Math.max(ink.l, minL) };
}

function enforceInkSoftContrast(inkSoft: Hsl, bgAvgL: number, w: [number, number, number, number]): Hsl {
  const tDay = w[2] + w[1] * 0.35;
  const minDelta = lerp(42, 30, Math.min(1, tDay));
  const minL = bgAvgL + minDelta;
  return { ...inkSoft, l: Math.max(inkSoft.l, minL) };
}

function applyEdgeHsla(c: Hsla, strength: number): Hsla {
  return {
    ...c,
    a: Math.min(0.42, c.a * strength),
    l: Math.min(66, c.l + (strength - 1) * 6),
  };
}

type PhaseHsl = {
  bg0: Hsl;
  bg1: Hsl;
  bg2: Hsl;
  card: Hsla;
  card2: Hsla;
  line: Hsla;
  ink: Hsl;
  inkSoft: Hsl;
  stripBg: Hsla;
  stripBorder: Hsla;
  stripTitle: Hsl;
  shellBorder: Hsla;
  paperTop: Hsla;
  paperBot: Hsla;
  gridH: Hsla;
  gridV: Hsla;
  maintextFg: Hsl;
  maintextMuted: Hsl;
  maintextContentBorder: Hsla;
  maintextPanelBorder: Hsla;
  panelInset: Hsla;
  panelDrop: Hsla;
  paperInsetHi: Hsla;
  paperOuterDrop: Hsla;
  cursor: Hsl;
  cursorGlow: Hsla;
  sbTrack1: Hsl;
  sbTrack2: Hsl;
  sbTrackBr: Hsla;
  sbThumb1: Hsl;
  sbThumb2: Hsl;
  sbThumbBr: Hsla;
  sbThumbH1: Hsl;
  sbThumbH2: Hsl;
  dlgBorder: Hsla;
  dlgBg1: Hsla;
  dlgBg2: Hsla;
  dlgZh: Hsl;
  tabBorder: Hsla;
  tabBg: Hsla;
  tabFg: Hsl;
  tabHoverBr: Hsla;
  tabAct1: Hsla;
  tabAct2: Hsla;
  tabActBr: Hsla;
  tabActFg: Hsl;
  hotHTr: number;
  hotHBl: number;
  hotSTr: number;
  hotSBl: number;
  hotLTr: number;
  hotLBl: number;
  hotATr: number;
  hotABl: number;
};

/** 夜晚：深棕 / 暗蓝灰 / 微冷光 */
const PHASE_NIGHT: PhaseHsl = {
  bg0: { h: 24, s: 32, l: 7.5 },
  bg1: { h: 202, s: 16, l: 10.5 },
  bg2: { h: 26, s: 22, l: 13.5 },
  card: { h: 24, s: 26, l: 13, a: 0.62 },
  card2: { h: 22, s: 24, l: 15, a: 0.65 },
  line: { h: 200, s: 18, l: 44, a: 0.32 },
  ink: { h: 200, s: 16, l: 88 },
  inkSoft: { h: 202, s: 12, l: 62 },
  stripBg: { h: 24, s: 22, l: 9, a: 0.68 },
  stripBorder: { h: 200, s: 22, l: 40, a: 0.28 },
  stripTitle: { h: 200, s: 14, l: 64 },
  shellBorder: { h: 24, s: 24, l: 34, a: 0.4 },
  paperTop: { h: 26, s: 26, l: 13, a: 0.96 },
  paperBot: { h: 24, s: 22, l: 16, a: 0.96 },
  gridH: { h: 200, s: 28, l: 48, a: 0.18 },
  gridV: { h: 200, s: 28, l: 48, a: 0.22 },
  maintextFg: { h: 200, s: 14, l: 91 },
  maintextMuted: { h: 200, s: 12, l: 60 },
  maintextContentBorder: { h: 200, s: 30, l: 44, a: 0.4 },
  maintextPanelBorder: { h: 200, s: 36, l: 48, a: 0.5 },
  panelInset: { h: 202, s: 38, l: 7, a: 0.78 },
  panelDrop: { h: 0, s: 0, l: 0, a: 0.28 },
  paperInsetHi: { h: 200, s: 8, l: 92, a: 0.1 },
  paperOuterDrop: { h: 0, s: 0, l: 0, a: 0.22 },
  cursor: { h: 200, s: 28, l: 76 },
  cursorGlow: { h: 200, s: 35, l: 62, a: 0.28 },
  sbTrack1: { h: 210, s: 18, l: 22 },
  sbTrack2: { h: 212, s: 16, l: 28 },
  sbTrackBr: { h: 208, s: 24, l: 38, a: 0.55 },
  sbThumb1: { h: 206, s: 32, l: 40 },
  sbThumb2: { h: 210, s: 26, l: 28 },
  sbThumbBr: { h: 212, s: 30, l: 20, a: 0.75 },
  sbThumbH1: { h: 204, s: 36, l: 46 },
  sbThumbH2: { h: 210, s: 30, l: 34 },
  dlgBorder: { h: 200, s: 32, l: 50, a: 0.55 },
  dlgBg1: { h: 210, s: 28, l: 26, a: 0.45 },
  dlgBg2: { h: 212, s: 24, l: 22, a: 0.38 },
  dlgZh: { h: 200, s: 16, l: 88 },
  tabBorder: { h: 205, s: 28, l: 40, a: 0.5 },
  tabBg: { h: 215, s: 22, l: 14, a: 0.82 },
  tabFg: { h: 200, s: 18, l: 86 },
  tabHoverBr: { h: 200, s: 45, l: 56, a: 0.62 },
  tabAct1: { h: 205, s: 38, l: 26, a: 0.9 },
  tabAct2: { h: 218, s: 28, l: 15, a: 0.88 },
  tabActBr: { h: 200, s: 48, l: 52, a: 0.72 },
  tabActFg: { h: 200, s: 38, l: 90 },
  hotHTr: 205,
  hotHBl: 220,
  hotSTr: 38,
  hotSBl: 42,
  hotLTr: 54,
  hotLBl: 48,
  hotATr: 0.1,
  hotABl: 0.085,
};

/** 清晨：米色 / 浅棕 / 柔和暖黄 */
const PHASE_MORNING: PhaseHsl = {
  bg0: { h: 38, s: 28, l: 17 },
  bg1: { h: 36, s: 32, l: 21 },
  bg2: { h: 34, s: 34, l: 25 },
  card: { h: 36, s: 28, l: 26, a: 0.48 },
  card2: { h: 33, s: 26, l: 28, a: 0.52 },
  line: { h: 34, s: 36, l: 54, a: 0.32 },
  ink: { h: 32, s: 20, l: 89 },
  inkSoft: { h: 34, s: 24, l: 80 },
  stripBg: { h: 35, s: 24, l: 18, a: 0.55 },
  stripBorder: { h: 36, s: 42, l: 52, a: 0.22 },
  stripTitle: { h: 42, s: 78, l: 76 },
  shellBorder: { h: 36, s: 48, l: 48, a: 0.34 },
  paperTop: { h: 42, s: 58, l: 91, a: 0.92 },
  paperBot: { h: 38, s: 48, l: 87, a: 0.92 },
  gridH: { h: 38, s: 42, l: 72, a: 0.24 },
  gridV: { h: 38, s: 42, l: 72, a: 0.3 },
  maintextFg: { h: 30, s: 22, l: 22 },
  maintextMuted: { h: 34, s: 22, l: 46 },
  maintextContentBorder: { h: 34, s: 38, l: 52, a: 0.3 },
  maintextPanelBorder: { h: 40, s: 58, l: 60, a: 0.5 },
  panelInset: { h: 32, s: 30, l: 9, a: 0.65 },
  panelDrop: { h: 0, s: 0, l: 0, a: 0.16 },
  paperInsetHi: { h: 48, s: 60, l: 98, a: 0.38 },
  paperOuterDrop: { h: 0, s: 0, l: 0, a: 0.12 },
  cursor: { h: 32, s: 30, l: 28 },
  cursorGlow: { h: 42, s: 85, l: 74, a: 0.22 },
  sbTrack1: { h: 36, s: 22, l: 76 },
  sbTrack2: { h: 34, s: 26, l: 68 },
  sbTrackBr: { h: 35, s: 28, l: 54, a: 0.52 },
  sbThumb1: { h: 32, s: 40, l: 46 },
  sbThumb2: { h: 28, s: 36, l: 34 },
  sbThumbBr: { h: 32, s: 40, l: 24, a: 0.7 },
  sbThumbH1: { h: 34, s: 46, l: 50 },
  sbThumbH2: { h: 28, s: 40, l: 38 },
  dlgBorder: { h: 34, s: 52, l: 44, a: 0.6 },
  dlgBg1: { h: 42, s: 72, l: 72, a: 0.34 },
  dlgBg2: { h: 40, s: 68, l: 66, a: 0.26 },
  dlgZh: { h: 26, s: 30, l: 24 },
  tabBorder: { h: 36, s: 58, l: 56, a: 0.4 },
  tabBg: { h: 30, s: 22, l: 12, a: 0.76 },
  tabFg: { h: 36, s: 26, l: 88 },
  tabHoverBr: { h: 38, s: 70, l: 64, a: 0.64 },
  tabAct1: { h: 200, s: 48, l: 30, a: 0.86 },
  tabAct2: { h: 28, s: 30, l: 22, a: 0.84 },
  tabActBr: { h: 198, s: 72, l: 66, a: 0.74 },
  tabActFg: { h: 44, s: 85, l: 78 },
  hotHTr: 42,
  hotHBl: 28,
  hotSTr: 70,
  hotSBl: 66,
  hotLTr: 54,
  hotLBl: 48,
  hotATr: 0.11,
  hotABl: 0.095,
};

/** 正午：浅暖白 / 浅金 / 淡橙 */
const PHASE_DAY: PhaseHsl = {
  bg0: { h: 42, s: 26, l: 16 },
  bg1: { h: 40, s: 32, l: 20 },
  bg2: { h: 38, s: 38, l: 26 },
  card: { h: 38, s: 28, l: 26, a: 0.48 },
  card2: { h: 34, s: 26, l: 28, a: 0.52 },
  line: { h: 36, s: 52, l: 56, a: 0.32 },
  ink: { h: 30, s: 18, l: 90 },
  inkSoft: { h: 34, s: 24, l: 82 },
  stripBg: { h: 32, s: 22, l: 18, a: 0.55 },
  stripBorder: { h: 36, s: 56, l: 54, a: 0.2 },
  stripTitle: { h: 44, s: 88, l: 74 },
  shellBorder: { h: 38, s: 58, l: 50, a: 0.34 },
  paperTop: { h: 44, s: 72, l: 93, a: 0.92 },
  paperBot: { h: 40, s: 58, l: 89, a: 0.92 },
  gridH: { h: 32, s: 48, l: 74, a: 0.26 },
  gridV: { h: 32, s: 48, l: 74, a: 0.32 },
  maintextFg: { h: 30, s: 24, l: 20 },
  maintextMuted: { h: 34, s: 22, l: 48 },
  maintextContentBorder: { h: 34, s: 42, l: 52, a: 0.3 },
  maintextPanelBorder: { h: 44, s: 68, l: 62, a: 0.52 },
  panelInset: { h: 30, s: 32, l: 9, a: 0.65 },
  panelDrop: { h: 0, s: 0, l: 0, a: 0.16 },
  paperInsetHi: { h: 46, s: 80, l: 99, a: 0.4 },
  paperOuterDrop: { h: 0, s: 0, l: 0, a: 0.12 },
  cursor: { h: 30, s: 32, l: 26 },
  cursorGlow: { h: 36, s: 88, l: 72, a: 0.22 },
  sbTrack1: { h: 34, s: 20, l: 78 },
  sbTrack2: { h: 32, s: 24, l: 68 },
  sbTrackBr: { h: 33, s: 26, l: 54, a: 0.52 },
  sbThumb1: { h: 32, s: 42, l: 46 },
  sbThumb2: { h: 28, s: 38, l: 34 },
  sbThumbBr: { h: 31, s: 42, l: 24, a: 0.7 },
  sbThumbH1: { h: 33, s: 48, l: 50 },
  sbThumbH2: { h: 27, s: 42, l: 38 },
  dlgBorder: { h: 35, s: 56, l: 42, a: 0.62 },
  dlgBg1: { h: 44, s: 82, l: 72, a: 0.34 },
  dlgBg2: { h: 42, s: 78, l: 66, a: 0.26 },
  dlgZh: { h: 24, s: 32, l: 23 },
  tabBorder: { h: 38, s: 62, l: 58, a: 0.4 },
  tabBg: { h: 28, s: 22, l: 12, a: 0.76 },
  tabFg: { h: 36, s: 28, l: 88 },
  tabHoverBr: { h: 200, s: 72, l: 64, a: 0.66 },
  tabAct1: { h: 198, s: 54, l: 30, a: 0.86 },
  tabAct2: { h: 28, s: 32, l: 22, a: 0.84 },
  tabActBr: { h: 196, s: 75, l: 67, a: 0.75 },
  tabActFg: { h: 44, s: 88, l: 78 },
  hotHTr: 44,
  hotHBl: 24,
  hotSTr: 72,
  hotSBl: 68,
  hotLTr: 52,
  hotLBl: 46,
  hotATr: 0.11,
  hotABl: 0.095,
};

/** 黄昏：焦糖棕 / 橙红 / 暗金 */
const PHASE_DUSK: PhaseHsl = {
  bg0: { h: 22, s: 36, l: 17 },
  bg1: { h: 18, s: 38, l: 21 },
  bg2: { h: 24, s: 34, l: 24 },
  card: { h: 22, s: 32, l: 25, a: 0.5 },
  card2: { h: 20, s: 30, l: 27, a: 0.54 },
  line: { h: 24, s: 48, l: 52, a: 0.32 },
  ink: { h: 32, s: 22, l: 88 },
  inkSoft: { h: 30, s: 26, l: 72 },
  stripBg: { h: 22, s: 28, l: 17, a: 0.56 },
  stripBorder: { h: 26, s: 52, l: 48, a: 0.24 },
  stripTitle: { h: 28, s: 62, l: 58 },
  shellBorder: { h: 24, s: 52, l: 44, a: 0.36 },
  paperTop: { h: 30, s: 44, l: 82, a: 0.92 },
  paperBot: { h: 26, s: 38, l: 76, a: 0.92 },
  gridH: { h: 22, s: 38, l: 58, a: 0.24 },
  gridV: { h: 22, s: 38, l: 58, a: 0.3 },
  maintextFg: { h: 28, s: 28, l: 22 },
  maintextMuted: { h: 30, s: 24, l: 44 },
  maintextContentBorder: { h: 26, s: 40, l: 48, a: 0.32 },
  maintextPanelBorder: { h: 32, s: 58, l: 54, a: 0.5 },
  panelInset: { h: 22, s: 32, l: 9, a: 0.66 },
  panelDrop: { h: 0, s: 0, l: 0, a: 0.18 },
  paperInsetHi: { h: 36, s: 50, l: 94, a: 0.36 },
  paperOuterDrop: { h: 0, s: 0, l: 0, a: 0.13 },
  cursor: { h: 16, s: 38, l: 30 },
  cursorGlow: { h: 24, s: 70, l: 58, a: 0.24 },
  sbTrack1: { h: 28, s: 24, l: 70 },
  sbTrack2: { h: 26, s: 28, l: 60 },
  sbTrackBr: { h: 28, s: 30, l: 50, a: 0.52 },
  sbThumb1: { h: 22, s: 44, l: 44 },
  sbThumb2: { h: 20, s: 38, l: 32 },
  sbThumbBr: { h: 24, s: 42, l: 22, a: 0.7 },
  sbThumbH1: { h: 22, s: 48, l: 48 },
  sbThumbH2: { h: 18, s: 42, l: 36 },
  dlgBorder: { h: 22, s: 54, l: 40, a: 0.62 },
  dlgBg1: { h: 32, s: 70, l: 58, a: 0.36 },
  dlgBg2: { h: 28, s: 66, l: 52, a: 0.28 },
  dlgZh: { h: 20, s: 34, l: 22 },
  tabBorder: { h: 26, s: 56, l: 52, a: 0.42 },
  tabBg: { h: 22, s: 24, l: 13, a: 0.77 },
  tabFg: { h: 34, s: 26, l: 86 },
  tabHoverBr: { h: 20, s: 62, l: 56, a: 0.64 },
  tabAct1: { h: 18, s: 48, l: 28, a: 0.87 },
  tabAct2: { h: 26, s: 30, l: 20, a: 0.85 },
  tabActBr: { h: 28, s: 58, l: 52, a: 0.73 },
  tabActFg: { h: 36, s: 78, l: 74 },
  hotHTr: 28,
  hotHBl: 18,
  hotSTr: 68,
  hotSBl: 62,
  hotLTr: 50,
  hotLBl: 44,
  hotATr: 0.105,
  hotABl: 0.09,
};

function pickPhase(
  key: keyof PhaseHsl,
  w: [number, number, number, number],
): Hsl | Hsla | number {
  const [wN, wM, wD, wU] = w;
  const a = PHASE_NIGHT[key] as unknown as number;
  const b = PHASE_MORNING[key] as unknown as number;
  const c = PHASE_DAY[key] as unknown as number;
  const d = PHASE_DUSK[key] as unknown as number;
  if (typeof a === 'number') {
    return wN * a + wM * b + wD * c + wU * d;
  }
  if ('a' in (PHASE_NIGHT[key] as Hsla)) {
    return mixHsla(
      PHASE_NIGHT[key] as Hsla,
      PHASE_MORNING[key] as Hsla,
      PHASE_DAY[key] as Hsla,
      PHASE_DUSK[key] as Hsla,
      w,
    );
  }
  return mixHsl(
    PHASE_NIGHT[key] as Hsl,
    PHASE_MORNING[key] as Hsl,
    PHASE_DAY[key] as Hsl,
    PHASE_DUSK[key] as Hsl,
    w,
  );
}

/**
 * 根据当前时刻（小数小时）生成面板 CSS 变量；无 time 时偏「正午」基线。
 */
export function buildPanelTimeThemeVars(decimalHours: number | null): Record<string, string> {
  const w = computeTimePhaseWeights(decimalHours);
  const strength = edgeStrengthBlend(w);

  const bg0 = pickPhase('bg0', w) as Hsl;
  const bg1 = pickPhase('bg1', w) as Hsl;
  const bg2 = pickPhase('bg2', w) as Hsl;
  let card = pickPhase('card', w) as Hsla;
  let card2 = pickPhase('card2', w) as Hsla;
  let line = pickPhase('line', w) as Hsla;
  let ink = pickPhase('ink', w) as Hsl;
  let inkSoft = pickPhase('inkSoft', w) as Hsl;
  let stripBg = pickPhase('stripBg', w) as Hsla;
  let stripBorder = pickPhase('stripBorder', w) as Hsla;
  let stripTitle = pickPhase('stripTitle', w) as Hsl;
  let shellBorder = pickPhase('shellBorder', w) as Hsla;

  const bgAvgL = (bg0.l + bg1.l + bg2.l) / 3;
  ink = enforceInkContrast(ink, bgAvgL, w);
  inkSoft = enforceInkSoftContrast(inkSoft, bgAvgL, w);

  line = applyEdgeHsla(line, strength);
  stripBorder = applyEdgeHsla(stripBorder, strength);
  shellBorder = applyEdgeHsla(shellBorder, strength);

  const hotHTr = pickPhase('hotHTr', w) as number;
  const hotHBl = pickPhase('hotHBl', w) as number;
  const hotSTr = pickPhase('hotSTr', w) as number;
  const hotSBl = pickPhase('hotSBl', w) as number;
  const hotLTr = pickPhase('hotLTr', w) as number;
  const hotLBl = pickPhase('hotLBl', w) as number;
  const hotATr = pickPhase('hotATr', w) as number;
  const hotABl = pickPhase('hotABl', w) as number;

  const paperTop = pickPhase('paperTop', w) as Hsla;
  const paperBot = pickPhase('paperBot', w) as Hsla;
  const gridH = pickPhase('gridH', w) as Hsla;
  const gridV = pickPhase('gridV', w) as Hsla;
  const maintextFg = pickPhase('maintextFg', w) as Hsl;
  const maintextMuted = pickPhase('maintextMuted', w) as Hsl;
  const maintextContentBorder = pickPhase('maintextContentBorder', w) as Hsla;
  const maintextPanelBorder = pickPhase('maintextPanelBorder', w) as Hsla;

  const panelInsetCol = pickPhase('panelInset', w) as Hsla;
  const panelDropCol = pickPhase('panelDrop', w) as Hsla;
  const paperInsetHiCol = pickPhase('paperInsetHi', w) as Hsla;
  const paperOuterDropCol = pickPhase('paperOuterDrop', w) as Hsla;

  const cursor = pickPhase('cursor', w) as Hsl;
  const cursorGlow = pickPhase('cursorGlow', w) as Hsla;

  const sbTrack1 = pickPhase('sbTrack1', w) as Hsl;
  const sbTrack2 = pickPhase('sbTrack2', w) as Hsl;
  const sbTrackBr = pickPhase('sbTrackBr', w) as Hsla;
  const sbThumb1 = pickPhase('sbThumb1', w) as Hsl;
  const sbThumb2 = pickPhase('sbThumb2', w) as Hsl;
  const sbThumbBr = pickPhase('sbThumbBr', w) as Hsla;
  const sbThumbH1 = pickPhase('sbThumbH1', w) as Hsl;
  const sbThumbH2 = pickPhase('sbThumbH2', w) as Hsl;

  const dlgBorder = pickPhase('dlgBorder', w) as Hsla;
  const dlgBg1 = pickPhase('dlgBg1', w) as Hsla;
  const dlgBg2 = pickPhase('dlgBg2', w) as Hsla;
  const dlgZh = pickPhase('dlgZh', w) as Hsl;

  const tabBorder = pickPhase('tabBorder', w) as Hsla;
  const tabBg = pickPhase('tabBg', w) as Hsla;
  const tabFg = pickPhase('tabFg', w) as Hsl;
  const tabHoverBr = pickPhase('tabHoverBr', w) as Hsla;
  const tabAct1 = pickPhase('tabAct1', w) as Hsla;
  const tabAct2 = pickPhase('tabAct2', w) as Hsla;
  const tabActBr = pickPhase('tabActBr', w) as Hsla;
  const tabActFg = pickPhase('tabActFg', w) as Hsl;

  const maintextPanelShadow = `0 0 0 1px ${hslaCss(panelInsetCol)} inset, 0 4px 10px ${hslaCss(panelDropCol)}`;
  const maintextPaperInsetShadow = `0 0 0 1px ${hslaCss(paperInsetHiCol)} inset, 0 6px 12px ${hslaCss(paperOuterDropCol)}`;
  const maintextTabActiveBg = `linear-gradient(135deg, ${hslaCss(tabAct1)}, ${hslaCss(tabAct2)})`;

  return {
    '--bg-0': hslCss(bg0),
    '--bg-1': hslCss(bg1),
    '--bg-2': hslCss(bg2),
    '--card': hslaCss(card),
    '--card-2': hslaCss(card2),
    '--line': hslaCss(line),
    '--ink': hslCss(ink),
    '--ink-soft': hslCss(inkSoft),
    '--strip-bg': hslaCss(stripBg),
    '--strip-border': hslaCss(stripBorder),
    '--strip-title': hslCss(stripTitle),
    '--shell-outer-border': hslaCss(shellBorder),
    '--shell-hotspot-tr': `hsl(${hotHTr.toFixed(1)}deg ${hotSTr.toFixed(0)}% ${hotLTr.toFixed(0)}% / ${hotATr.toFixed(3)})`,
    '--shell-hotspot-bl': `hsl(${hotHBl.toFixed(1)}deg ${hotSBl.toFixed(0)}% ${hotLBl.toFixed(0)}% / ${hotABl.toFixed(3)})`,

    '--maintext-paper-top': hslaCss(paperTop),
    '--maintext-paper-bottom': hslaCss(paperBot),
    '--maintext-grid-h': hslaCss(gridH),
    '--maintext-grid-v': hslaCss(gridV),
    '--maintext-fg': hslCss(maintextFg),
    '--maintext-muted': hslCss(maintextMuted),
    '--maintext-content-border': hslaCss(maintextContentBorder),
    '--maintext-panel-border': hslaCss(maintextPanelBorder),
    '--maintext-panel-shadow': maintextPanelShadow,
    '--maintext-paper-inset-shadow': maintextPaperInsetShadow,
    '--maintext-cursor': hslCss(cursor),
    '--maintext-cursor-glow': hslaCss(cursorGlow),

    '--maintext-scrollbar-track-1': hslCss(sbTrack1),
    '--maintext-scrollbar-track-2': hslCss(sbTrack2),
    '--maintext-scrollbar-track-border': hslaCss(sbTrackBr),
    '--maintext-scrollbar-thumb-1': hslCss(sbThumb1),
    '--maintext-scrollbar-thumb-2': hslCss(sbThumb2),
    '--maintext-scrollbar-thumb-border': hslaCss(sbThumbBr),
    '--maintext-scrollbar-thumb-hover-1': hslCss(sbThumbH1),
    '--maintext-scrollbar-thumb-hover-2': hslCss(sbThumbH2),

    '--maintext-dialogue-border': hslaCss(dlgBorder),
    '--maintext-dialogue-bg-1': hslaCss(dlgBg1),
    '--maintext-dialogue-bg-2': hslaCss(dlgBg2),
    '--maintext-dialogue-zh': hslCss(dlgZh),

    '--maintext-tab-border': hslaCss(tabBorder),
    '--maintext-tab-bg': hslaCss(tabBg),
    '--maintext-tab-fg': hslCss(tabFg),
    '--maintext-tab-hover-border': hslaCss(tabHoverBr),
    '--maintext-tab-active-bg': maintextTabActiveBg,
    '--maintext-tab-active-border': hslaCss(tabActBr),
    '--maintext-tab-active-fg': hslCss(tabActFg),
  };
}
