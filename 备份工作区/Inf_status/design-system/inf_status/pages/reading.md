# Reading Page Overrides

> **PROJECT:** Inf_status
> **Page:** InfReadingPanel / maintext narrative

> Rules here **override** [`design-system/MASTER.md`](../../MASTER.md) for the reading panel only.

---

## Layout

- **Format:** horizontal ruled sheet — symmetric left/right padding (`clamp(1.35rem, 4.5vw, 2.75rem)`)
- **Grid:** horizontal lines on inset glass sheet only; **no vertical margin rules**
- **Background:** layered mesh + glass sheet elevation (ui-ux-pro-max: glassmorphism + dimensional layering)
- **Scroll:** progress bar retained; `overscroll-behavior: contain`

## Typography

- **Narrative body:** `LXGW Neo XiHei`, weight 500, letter-spacing 0.05em, inner horizontal inset
- **Quote blocks:** `ZevHeiTC-N Dev`, badge header, gradient edge, glass elevation

## Quote UI

- No style badge labels; compact row: accent bar + small quote icon + ZevHeiTC text
- Same line-height and horizontal inset as narrative prose
- Quote text uses accent-tinted `--inf-quote-block-text` (distinct from body `--inf-text`)

## Colors & contrast

- Light page bg opacity ≥ 88%; frame border visible (`--inf-reading-frame-border`)
- Body text `#0F1117` on page bg; muted only for captions, not narrative body
- Quote blocks: `--inf-quote-bg`, left accent bar `--inf-quote-accent`

## Quote parsing

- Chinese: `「」` (corner), `『』` (double)
- Western: `" "` / `""`, `' '` / `''` (single min inner length 2)
- Each matched span → independent `InfQuoteBlock` on own line

## Motion

- Typewriter via GSAP on flat text; `prefers-reduced-motion` → instant full render
- Caret on last visible block; no motion blur

## Anti-patterns

- No emoji quote decoration
- No full-width prose on large screens
- No invisible borders in light mode
