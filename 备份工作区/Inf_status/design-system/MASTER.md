# Design System — Inf_status (Neural Terminal)

## Concept
Premium liquid-glass narrative terminal for urban survival SLG. Editorial typography meets telemetry HUD — not a generic dashboard.

## Pattern
Scroll-triggered storytelling inside a single glass terminal. Progressive intensity via infection tier ambient glow.

## Style: Liquid Glass + Editorial HUD
- Flowing glass, iridescent edge highlights, animated blur
- Subtle film grain (CSS noise), mesh gradients
- Micro-interactions 150–300ms ease-out; tier shifts 400–600ms

## Typography
| Role | Font | Usage |
|------|------|--------|
| Display | Cormorant Garamond | Headings, narrative drop-cap |
| UI | LXGW Neo XiHei | Controls, labels, body UI, location/weather |
| Name | ZevHeiTC-N Dev | Character name plate |
| Tech / Mono | Maple Mono NF CN | Time, floor, ticker, stats, option IDs |

```css
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;0,700;1,500&family=IBM+Plex+Mono:wght@400;500;600&family=Outfit:wght@300;400;500;600;700&display=swap');
```

## World strip (InfWorldStrip)
- **Left:** Biohazard-style scrolling English ticker (`InfBioTicker`) — hidden ≤640px
- **Center:** Telemetry chips with glass bg + accent left border — time (date secondary / time bold), location, weather bubble, FL
- **Right:** Theme toggle only (`InfThemeToggle` sun/moon) — no settings dialog or font scale UI

### Weather bubble
`世界.天气` string → `resolveWeatherVisual()` → `InfWeatherBubble` + animated SVG (`InfWeatherIcon`).

| kind | Keywords (priority order) |
|------|---------------------------|
| thunder | 雷、雷阵雨、闪电 |
| blizzard | 暴雪、大雪、暴风雪 |
| heavyRain | 暴雨、大雨、强降雨 |
| sleet | 雨夹雪、冻雨 |
| drizzle | 毛毛雨、小雨、细雨 |
| rain | 中雨、雨、降雨 |
| sandstorm | 沙尘、扬沙、沙暴 |
| fog | 雾、浓雾 |
| haze | 霾、雾霾 |
| wind | 风、大风、狂风 |
| snow | 雪、小雪、飘雪 |
| partlyCloudy | 多云、少云 |
| overcast | 阴、阴天、阴沉 |
| clear | 晴、晴天、晴朗 |
| unknown | fallback |

Animations in `styles/weather-motion.scss`; disabled under `prefers-reduced-motion` and `.inf-no-motion`.

## Colors
| Role | Light | Dark |
|------|-------|------|
| Background | #E8EAED | #0A0B0F |
| Surface glass | rgba(255,255,255,0.72) | rgba(22,24,32,0.82) |
| Text primary | #12141A | #F4F5F7 |
| Accent (terminal) | #0D9488 | #2DD4BF |
| CTA | #007AFF | #0A84FF |
| Infection tiers | green → amber → red | same hue family |

## Anti-patterns
- Browser default fonts, emoji icons, flat MVP cards
- Placeholder-only inputs, hover-only critical actions
- Animations >500ms for micro-interactions
- External toastr / browser alert()

## Checklist
- [x] Internal toast + dialog only
- [x] Semantic HTML + unique IDs
- [x] prefers-reduced-motion
- [x] cursor-pointer on interactives
- [x] No horizontal scroll in iframe
