import type { NarrativeRichSegment } from './narrativeJpZhSegments';
import { parseNarrativeJpZhSegments } from './narrativeJpZhSegments';

export type DiceSegment = { kind: 'dice'; content: string };

export type NarrativeBodySegment = NarrativeRichSegment | DiceSegment;

/** 提取 `<dice>…</dice>`，其余片段再走「日文」{中文} 解析 */
export function parseNarrativeBodySegments(input: string): NarrativeBodySegment[] {
  const result: NarrativeBodySegment[] = [];
  const diceRe = /<dice>([\s\S]*?)<\/dice>/gi;
  let last = 0;
  for (const match of input.matchAll(diceRe)) {
    const idx = match.index ?? 0;
    if (idx > last) {
      result.push(...parseNarrativeJpZhSegments(input.slice(last, idx)));
    }
    result.push({ kind: 'dice', content: match[1].trim() });
    last = idx + match[0].length;
  }
  if (last < input.length) {
    result.push(...parseNarrativeJpZhSegments(input.slice(last)));
  }
  return result;
}
