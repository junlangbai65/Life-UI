# Status Panel Overrides (wife 同居状态栏)

Overrides MASTER for this iframe panel.

## Visual

- **Reference:** iOS 17 Settings grouped inset lists (not generic dark OLED dashboard)
- **Light:** page `#F2F2F7`, grouped surface `#FFFFFF`, separator `rgba(60,60,67,0.12)`
- **Dark:** page `#000000`, grouped `#1C1C1E`, label secondary `rgba(235,235,245,0.6)`
- **Accents:** affection `#ff8fab`, wallet `#5AC8FA`, 凌月 preserved
- **NTR stages:** safe `#8E8E93`, warn `#FF9F0A`, cross `#BF5AF2`, expose `#FF453A`
- **Typography:** system stack `-apple-system, BlinkMacSystemFont, "SF Pro Text", "PingFang SC", sans-serif`
- **No** Fira Code / external webfonts in production iframe
- **Row height:** 44px minimum for tappable rows
- **Radius:** group 12px, pill 20px

## Icons

- **Set:** Lucide-style inline SVG (`viewBox="0 0 24 24"`, stroke `currentColor`, no fill)
- **Sizes:** `--icon-size-sm` (16px) labels/chips, `--icon-size-md` (20px) hero/accordion
- **No emoji icons**; decorative labels replaced by icon + data text only
- **Interactive controls:** icon-only buttons require `aria-label`

| Context | Icon names |
|---------|------------|
| Theme | sun, moon, monitor |
| Weather | cloud-sun, cloud-rain, cloud |
| Grad countdown | graduation-cap |
| Scene | school, home, map-pin |
| Accordion | heart, alert-triangle, lock |
| Wallet | wallet |
| Milestone done | check-circle |
| NTR steps | shield, alert-circle, crosshair, eye-off |
| Intimate rows | circle-dot, user, heart-handshake, alert-octagon, droplet |

## Layout

- Fixed outer height `400px`, width `100%`, transparent outer background
- Internal scroll only on `.status-scroll` (background `--c-page`)
- Fixed region: header → endgame banner → hero grid (scene + affection) → wallet
- Accordion: relationship open by default; risk + intimate closed

## Motion

- UI transition: 220ms `--ease-ios`
- Value/meter tween: 450ms GSAP `power2.out` (`--duration-meter`)
- Max 1 infinite animation on screen (grad countdown ≤14 days only)
- Accordion: height + opacity enter/leave
- Theme segment: glider `translateX` with `--duration-fast`
- `prefers-reduced-motion: reduce` → instant transitions, no GSAP tween

## Scrollbar

- Width 5px, thumb `--c-scrollbar-thumb`, track transparent
- Firefox: `scrollbar-width: thin`

## Anti-patterns

- No emojis as icons
- No `----` placeholder text; hide empty chips
- No infinite pulse except grad countdown ≤14 days (subtle)
- No layout-shifting hover (scale/translate on cards)
- No animating width/height for accordion (use max-height + opacity)

## Pre-delivery checklist

- [ ] Light + dark + system theme with glider transition
- [ ] All meters animate on value change
- [ ] Accordion expand/collapse has fade
- [ ] `:focus-visible` on triggers and theme buttons
- [ ] Custom scrollbar in scroll region
- [ ] Reduced motion respected
