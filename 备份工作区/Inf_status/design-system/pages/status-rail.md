# Status Rail — Page Override

> Overrides [MASTER.md](../MASTER.md) for the left character status sidebar only.

## Pattern

Editorial telemetry sidebar — single scroll stream, not tabbed dashboard panels.

## Layout

1. Character switcher (top, always visible)
2. Identity hero (avatar ring + name + infection badge)
3. Delta strip (conditional, vs previous message floor)
4. Infection meter (bio-HUD visual language)
5. Desire meter (violet/rose physiological signal)
6. Stat rows: pose + outfit fields

No overview/dossier tabs. All fields visible in one column with internal scroll.

## Typography

| Element | Font | Notes |
|---------|------|-------|
| Character name | Cormorant Garamond | Display, ellipsis overflow |
| Stat labels | Outfit uppercase | 0.6875rem, letter-spacing 0.08em |
| Percent / delta | IBM Plex Mono | tabular-nums |
| Stat values | Outfit | 0.8125rem, line-height 1.55 |

## Colors

### Infection meter
Uses global `data-inf-infection-tier` (low → critical). Green/amber/orange/red gradients. Shimmer sweep on fill.

### Desire meter
Independent `data-inf-desire-tier` (calm / warm / surge). Violet → rose gradient. Breathe animation, no alert pulse.

### Delta chips
- Up: `--inf-delta-up`
- Down: `--inf-delta-down`
- Desire variant: rose/violet tint

## Micro-interactions

| Target | Effect | Duration |
|--------|--------|----------|
| Stat row hover | translateY(-2px) + left accent | 220ms |
| Icon box hover | scale(1.08) | 140ms |
| Progress fill | width spring | 480ms |
| Delta chip | inf-delta-pop | 300ms |
| Value change | inf-meter-flash | 480ms |
| Delta strip | beacon + scan line | 1.8–3.2s loop |

Respect `prefers-reduced-motion` and `uiSettings.motionEnabled` via `.inf-no-motion`.

## Icons

Feather-style SVG via `InfIcon` — stroke 1.75, no emoji.

| Block | Icon |
|-------|------|
| Switcher | users |
| Delta strip | radar |
| Infection | activity |
| Desire | heart |
| Pose | user |
| 上身 | box |
| 下身 | layers |
| 鞋袜 | shoe |

## Anti-patterns

- Do not reuse infection tier colors for desire meter
- Do not hide deltas behind hover-only UI
- Do not split outfit into separate tab panel
- Do not show full old→new text for field changes (use chip / 已变更 badge)

## References

- `util/状态栏1.html` — progress shimmer, tier fills
- `样式库/案例/状态栏样式.html` — row hover, icon boxes
- `样式库/found1/参考UI2.vue` — segmented glider
- `备份工作区/LYsta` — floor delta strip pattern
