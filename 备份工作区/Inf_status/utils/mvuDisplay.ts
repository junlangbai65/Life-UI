import type { MvuStatData } from '../schema';
import { Schema } from '../schema';

/** 无楼层 stat_data 时的空结构（不含示例角色，便于联调） */
export function createFallbackStatData(): MvuStatData {
  return Schema.parse({});
}

export function parseWorldDateTime(raw: string): { date: string; time: string } {
  const trimmed = raw.trim();
  if (!trimmed) return { date: '—', time: '—' };
  const timeMatch = trimmed.match(/(\d{1,2}:\d{2})/);
  const time = timeMatch?.[1] ?? '';
  const date = time ? trimmed.replace(time, '').trim() : trimmed;
  return { date: date || '—', time: time || '—' };
}

export type TimeSegments = { hours: string; minutes: string };

/** 将 HH:MM 拆为电子表分段；无法解析时返回 null */
export function parseTimeSegments(time: string): TimeSegments | null {
  const match = time.match(/^(\d{1,2}):(\d{2})$/);
  if (!match) return null;
  return {
    hours: match[1].padStart(2, '0'),
    minutes: match[2],
  };
}

export function getPortraitInitials(name: string): string {
  const trimmed = name.trim();
  if (!trimmed) return '?';
  return trimmed.slice(0, 1);
}

export type InfectionTier = 'low' | 'mid' | 'high' | 'critical';

export function getInfectionTier(progress: number): InfectionTier {
  const v = Math.min(100, Math.max(0, Math.round(progress)));
  if (v >= 75) return 'critical';
  if (v >= 50) return 'high';
  if (v >= 25) return 'mid';
  return 'low';
}

export function getInfectionTierLabel(tier: InfectionTier): string {
  return (
    {
      low: '低度',
      mid: '中度',
      high: '高度',
      critical: '临界',
    } satisfies Record<InfectionTier, string>
  )[tier];
}

export type DesireTier = 'calm' | 'warm' | 'surge';

export function getDesireTier(progress: number): DesireTier {
  const v = Math.min(100, Math.max(0, Math.round(progress)));
  if (v >= 67) return 'surge';
  if (v >= 34) return 'warm';
  return 'calm';
}

export function getDesireTierLabel(tier: DesireTier): string {
  return (
    {
      calm: '平静',
      warm: '升温',
      surge: '高涨',
    } satisfies Record<DesireTier, string>
  )[tier];
}

export function formatDelta(delta: number): string {
  if (delta > 0) return `+${delta}`;
  if (delta < 0) return `${delta}`;
  return '';
}
