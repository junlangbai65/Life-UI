/** Lucide-compatible stroke paths (24×24 viewBox). Each entry is an SVG path `d`. */
export type IconName =
  | 'sun'
  | 'moon'
  | 'monitor'
  | 'cloud'
  | 'cloud-sun'
  | 'cloud-rain'
  | 'graduation-cap'
  | 'school'
  | 'home'
  | 'map-pin'
  | 'heart'
  | 'alert-triangle'
  | 'lock'
  | 'wallet'
  | 'check-circle'
  | 'circle'
  | 'shield'
  | 'alert-circle'
  | 'crosshair'
  | 'eye-off'
  | 'droplet'
  | 'user'
  | 'heart-handshake'
  | 'alert-octagon'
  | 'chevron-right'
  | 'users';

export const ICON_PATHS: Record<IconName, string | string[]> = {
  sun: [
    'M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41',
    'M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z',
  ],
  moon: 'M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9z',
  monitor: 'M2 3h20v14H2zM8 21h8M12 17v4',
  cloud: 'M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9z',
  'cloud-sun': 'M12 2v2M4.93 4.93l1.41 1.41M2 12h2M12 8a4 4 0 0 0-2 7.5H17.5a4.5 4.5 0 0 0 .5-9H12z',
  'cloud-rain': 'M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9zM8 19v2M12 19v2M16 19v2',
  'graduation-cap': 'M22 10v6M2 10l10-5 10 5-10 5zM6 12v5c0 1.7 2.7 3 6 3s6-1.3 6-3v-5',
  school: 'M22 9l-10-5L2 9l10 5 10-5zM6 10.6V16a6 3 0 0 0 12 0v-5.4',
  home: 'M3 9.5 12 3l9 6.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z',
  'map-pin': 'M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0zM12 10a3 3 0 1 0 0-6 3 3 0 0 0 0 6z',
  heart: 'M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z',
  'alert-triangle': 'm21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3ZM12 9v4M12 17h.01',
  lock: 'M7 11V7a5 5 0 0 1 10 0v4M5 11h14v11H5z',
  wallet: 'M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1M3 5v14a2 2 0 0 0 2 2h15v-4',
  'check-circle': 'M22 11.08V12a10 10 0 1 1-5.93-9.14M9 11l3 3L22 4',
  circle: 'M12 12m-10 0a10 10 0 1 0 20 0a10 10 0 1 0-20 0',
  shield: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z',
  'alert-circle': 'M12 12m-10 0a10 10 0 1 0 20 0a10 10 0 1 0-20 0M12 8v4M12 16h.01',
  crosshair: 'M12 12m-10 0a10 10 0 1 0 20 0a10 10 0 1 0-20 0M22 12h-4M6 12H2M12 6V2M12 22v-4',
  'eye-off': 'M9.88 9.88a3 3 0 1 0 4.24 4.24M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61M2 2l20 20',
  droplet: 'M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z',
  user: 'M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z',
  'heart-handshake': 'M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z',
  'alert-octagon': 'M12 16h.01M12 8v4M15.31 8.5 18.5 12l-3.19 3.5H8.69L5.5 12l3.19-3.5h6.62Z',
  'chevron-right': 'm9 18 6-6-6-6',
  users: 'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75',
};
