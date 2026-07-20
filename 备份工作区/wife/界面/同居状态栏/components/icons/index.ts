export { default as Icon } from './Icon.vue';
export type { IconName } from './paths';
export { ICON_PATHS } from './paths';

/** Accordion section → icon */
export const SECTION_ICONS = {
  relationship: 'heart',
  risk: 'alert-triangle',
  intimate: 'lock',
} as const satisfies Record<string, import('./paths').IconName>;

/** NTR stage index → icon */
export const NTR_STAGE_ICONS = ['shield', 'alert-circle', 'crosshair', 'eye-off'] as const satisfies readonly import('./paths').IconName[];

/** Scene type → icon */
export const SCENE_TYPE_ICONS: Record<string, import('./paths').IconName> = {
  校内: 'school',
  居家: 'home',
  外出: 'map-pin',
  其他: 'map-pin',
};

export function weatherIcon(weather: string): import('./paths').IconName {
  const w = weather.toLowerCase();
  if (/雨|雪|雷/.test(weather)) return 'cloud-rain';
  if (/晴|阳/.test(weather)) return 'cloud-sun';
  return 'cloud';
}
