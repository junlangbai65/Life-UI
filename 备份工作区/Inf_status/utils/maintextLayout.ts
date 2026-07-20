export type QuoteStyle = 'corner' | 'double' | 'western';

export type MaintextBlock =
  | { kind: 'prose'; text: string }
  | { kind: 'quote'; text: string; style: QuoteStyle };

type QuoteOpener = {
  open: string;
  close: string;
  style: QuoteStyle;
  minInner?: number;
};

const QUOTE_OPENERS: QuoteOpener[] = [
  { open: '『', close: '』', style: 'double' },
  { open: '「', close: '」', style: 'corner' },
  { open: '"', close: '"', style: 'western' },
  { open: '\u201c', close: '\u201d', style: 'western' },
  { open: '\u2018', close: '\u2019', style: 'western', minInner: 2 },
  { open: "'", close: "'", style: 'western', minInner: 2 },
];

type QuoteMatch = {
  index: number;
  length: number;
  inner: string;
  style: QuoteStyle;
};

function graphemeSegments(text: string): string[] {
  try {
    const segmenter = new Intl.Segmenter(undefined, { granularity: 'grapheme' });
    return [...segmenter.segment(text)].map(part => part.segment);
  } catch {
    return [...text];
  }
}

export function graphemeLength(text: string): number {
  return graphemeSegments(text).length;
}

export function sliceByGraphemeCount(text: string, count: number): string {
  if (count <= 0) return '';
  return graphemeSegments(text)
    .slice(0, count)
    .join('');
}

function findNextQuote(text: string, from: number): QuoteMatch | null {
  let best: QuoteMatch | null = null;

  for (const opener of QUOTE_OPENERS) {
    const start = text.indexOf(opener.open, from);
    if (start === -1) continue;

    const innerStart = start + opener.open.length;
    const end = text.indexOf(opener.close, innerStart);
    if (end === -1) continue;

    const inner = text.slice(innerStart, end);
    if (inner.length < (opener.minInner ?? 0)) continue;

    const candidate: QuoteMatch = {
      index: start,
      length: end + opener.close.length - start,
      inner,
      style: opener.style,
    };

    if (!best || candidate.index < best.index) {
      best = candidate;
    }
  }

  return best;
}

function pushProse(blocks: MaintextBlock[], text: string) {
  const normalized = text.replace(/[ \t]+\n/g, '\n').replace(/\n[ \t]+/g, '\n').trim();
  if (!normalized) return;

  const last = blocks[blocks.length - 1];
  if (last?.kind === 'prose') {
    last.text = `${last.text}\n${normalized}`;
    return;
  }

  blocks.push({ kind: 'prose', text: normalized });
}

function splitParagraphIntoBlocks(paragraph: string): MaintextBlock[] {
  const blocks: MaintextBlock[] = [];
  let cursor = 0;

  while (cursor < paragraph.length) {
    const match = findNextQuote(paragraph, cursor);
    if (!match) {
      pushProse(blocks, paragraph.slice(cursor));
      break;
    }

    pushProse(blocks, paragraph.slice(cursor, match.index));
    blocks.push({ kind: 'quote', text: match.inner, style: match.style });
    cursor = match.index + match.length;
  }

  return blocks;
}

function mergeAdjacentProse(blocks: MaintextBlock[]): MaintextBlock[] {
  const merged: MaintextBlock[] = [];

  for (const block of blocks) {
    if (block.kind === 'prose' && merged.at(-1)?.kind === 'prose') {
      merged[merged.length - 1] = {
        kind: 'prose',
        text: `${(merged.at(-1) as MaintextBlock & { kind: 'prose' }).text}\n\n${block.text}`,
      };
      continue;
    }
    merged.push(block);
  }

  return merged;
}

export function parseMaintextBlocks(raw: string): MaintextBlock[] {
  if (!raw?.trim()) return [];

  const paragraphs = raw
    .replace(/\r\n/g, '\n')
    .split(/\n\s*\n/)
    .map(part => part.trim())
    .filter(Boolean);

  const blocks: MaintextBlock[] = [];
  for (const paragraph of paragraphs) {
    blocks.push(...splitParagraphIntoBlocks(paragraph));
  }

  return mergeAdjacentProse(blocks);
}

export function parseMaintextBlocksPartial(raw: string, visibleLength: number): MaintextBlock[] {
  if (!raw || visibleLength <= 0) return [];
  return parseMaintextBlocks(sliceByGraphemeCount(raw, visibleLength));
}
