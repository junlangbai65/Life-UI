export type WeatherKind =
  | 'clear'
  | 'partlyCloudy'
  | 'overcast'
  | 'drizzle'
  | 'rain'
  | 'heavyRain'
  | 'thunder'
  | 'snow'
  | 'blizzard'
  | 'fog'
  | 'haze'
  | 'wind'
  | 'sandstorm'
  | 'sleet'
  | 'unknown';

export type WeatherVisual = {
  kind: WeatherKind;
  label: string;
};

type Rule = { kind: WeatherKind; keywords: string[] };

const RULES: Rule[] = [
  { kind: 'thunder', keywords: ['雷阵雨', '闪电', '雷'] },
  { kind: 'blizzard', keywords: ['暴风雪', '暴雪', '大雪'] },
  { kind: 'heavyRain', keywords: ['强降雨', '暴雨', '大雨'] },
  { kind: 'sleet', keywords: ['雨夹雪', '冻雨'] },
  { kind: 'drizzle', keywords: ['毛毛雨', '细雨', '小雨'] },
  { kind: 'rain', keywords: ['中雨', '降雨', '雨'] },
  { kind: 'sandstorm', keywords: ['沙尘暴', '沙暴', '扬沙', '沙尘'] },
  { kind: 'fog', keywords: ['浓雾', '雾'] },
  { kind: 'haze', keywords: ['雾霾', '霾'] },
  { kind: 'wind', keywords: ['狂风', '大风', '风'] },
  { kind: 'snow', keywords: ['飘雪', '小雪', '雪'] },
  { kind: 'partlyCloudy', keywords: ['少云', '多云'] },
  { kind: 'overcast', keywords: ['阴沉', '阴天', '阴'] },
  { kind: 'clear', keywords: ['晴朗', '晴天', '晴'] },
];

export function resolveWeatherVisual(raw: string): WeatherVisual {
  const label = raw?.trim() ?? '';
  if (!label) {
    return { kind: 'unknown', label: '—' };
  }

  for (const rule of RULES) {
    if (rule.keywords.some(kw => label.includes(kw))) {
      return { kind: rule.kind, label };
    }
  }

  return { kind: 'unknown', label };
}
