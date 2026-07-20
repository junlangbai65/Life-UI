/**
 * 将 worldState 中的天气、时间文案映射为全局 FX 与图标用的 token（与 adven.css / Teleport 层一致）。
 */

export type WeatherFxToken =
  | 'default'
  | 'sunny'
  | 'cloudy'
  | 'overcast'
  | 'drizzle'
  | 'rain'
  | 'storm'
  | 'snow'
  | 'hail'
  | 'fog'
  | 'wind'
  | 'sandstorm';

export type TimeFxToken = 'default' | 'dawn' | 'day' | 'dusk' | 'night' | 'deepnight';

function normalizeText(input: string | null | undefined): string {
  return (input ?? '').trim().toLowerCase();
}

export function mapWeatherToken(rawWeather: string | null | undefined): WeatherFxToken {
  const weather = normalizeText(rawWeather);
  if (!weather) return 'default';
  if (/雷|暴雨|雷雨|暴风雨|storm|thunder/.test(weather)) return 'storm';
  if (/冰雹|hail/.test(weather)) return 'hail';
  if (/沙尘暴|沙尘|扬沙|浮尘|sandstorm|dust\s*storm/.test(weather) || /\bdust\b/.test(weather)) return 'sandstorm';
  if (/大风|阵风|强风|疾风|gale|windy/.test(weather) || /\bwind\b/i.test(weather)) return 'wind';
  if (/毛毛雨|细雨|drizzle/.test(weather)) return 'drizzle';
  if (/雨|阵雨|小雨|中雨|大雨|rain/.test(weather)) return 'rain';
  if (/雪|霜|snow/.test(weather)) return 'snow';
  if (/雾|霾|fog|mist|haze/.test(weather)) return 'fog';
  if (/多云|云|cloud/.test(weather)) return 'cloudy';
  if (/阴|阴天|overcast/.test(weather)) return 'overcast';
  if (/晴|晴朗|sun|clear/.test(weather)) return 'sunny';
  return 'default';
}

export function mapTimeToken(rawTime: string | null | undefined): TimeFxToken {
  const time = normalizeText(rawTime);
  if (!time) return 'default';
  const hourMatch = time.match(/\b([01]?\d|2[0-3])[:：][0-5]\d\b/);
  if (hourMatch?.[1]) {
    const hour = Number.parseInt(hourMatch[1], 10);
    if (hour >= 0 && hour < 5) return 'deepnight';
    if (hour < 6) return 'night';
    if (hour < 10) return 'dawn';
    if (hour < 16) return 'day';
    if (hour < 19) return 'dusk';
    return 'night';
  }
  if (/深夜|凌晨|午夜|子时|丑时|am 0|am 1|am 2|am 3/.test(time)) return 'deepnight';
  if (/夜|夜晚|晚间|夜间|宵|pm 9|pm 10|pm 11/.test(time)) return 'night';
  if (/黄昏|傍晚|夕|暮|日落|晚霞/.test(time)) return 'dusk';
  if (/清晨|早晨|黎明|拂晓|晨曦|日出/.test(time)) return 'dawn';
  if (/白天|上午|中午|午后|正午|day|noon/.test(time)) return 'day';
  return 'default';
}
