/**
 * 天气图标变体（对应 GothWeatherIcon）。
 * 推断顺序：复合天气 → 降水相态 → 能见度/沙尘 → 风 → 强降雨 → 一般降水 → 雷电 → 云量 → 晴。
 */
export type GothWeatherVariant =
  | 'sunny'
  | 'partly-cloudy'
  | 'cloudy'
  | 'overcast'
  | 'windy'
  | 'dust'
  | 'thunder'
  | 'hail'
  | 'snow'
  | 'sleet'
  | 'rainy'
  | 'heavy-rain'
  | 'sun-shower'
  | 'fog'
  | 'haze';

export function inferGothWeatherVariant(weather: string): GothWeatherVariant {
  const w = weather.trim();
  if (!w || w === '未知') return 'cloudy';

  // --- 复合 / 相态（优先于单一「雨」「雪」）---
  if (/阵雨|太阳雨|晴间雨|^晴雨|晴雨$/i.test(w)) return 'sun-shower';
  if (/雷阵雨/i.test(w)) return 'thunder';
  if (/雨夹雪|冻雨|雨雪/i.test(w)) return 'sleet';
  if (/冰雹|雹子/i.test(w)) return 'hail';
  if (/暴雪|大雪|中雪|小雪|阵雪|降雪|飘雪|雪天|^雪$/i.test(w)) return 'snow';

  // --- 能见度 / 沙尘 ---
  if (/霾|空气污染|重污染|雾霾/i.test(w)) return 'haze';
  if (/雾|薄雾|大雾|浓雾/i.test(w)) return 'fog';
  if (/沙尘暴|扬沙|浮尘|沙尘/i.test(w)) return 'dust';

  // --- 风（含热带系统，图标统一用「强风」示意）---
  if (/台风|飓风|热带风暴|热带气旋|旋风/i.test(w)) return 'windy';
  if (/大风|狂风|阵风|强风|劲风/i.test(w)) return 'windy';

  // --- 强降雨 ---
  if (/暴雨|大暴雨|特大暴雨|强降雨|倾盆|骤雨|特大降雨/i.test(w)) return 'heavy-rain';

  // --- 雷电（无「阵雨」已在上处理）---
  if (/雷|闪电|霹雳|雷雨|^雷电$/i.test(w)) return 'thunder';

  // --- 一般降水 ---
  if (/雨|淋|潮湿|细雨|毛毛雨|阵雨过后/i.test(w)) return 'rainy';

  // --- 云量 ---
  if (/阴|阴天/i.test(w)) return 'overcast';
  if (/少云|晴转多云|多云转晴|晴间多云|多云间晴/i.test(w)) return 'partly-cloudy';
  if (/多云/i.test(w)) return 'cloudy';

  // --- 晴 ---
  if (/晴|爽朗/i.test(w)) return 'sunny';

  return 'cloudy';
}
