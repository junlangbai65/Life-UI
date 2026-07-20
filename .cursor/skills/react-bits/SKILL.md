---
name: react-bits
description: >-
  SIDE TRACK: React patterns/anti-patterns for React/TSX or @pixi/react only.
  Do not load by default for Vue Tavern Helper UI (src/). Triggers on React
  pattern, anti-pattern, setState, JSX conditional, HOC, synthetic events.
license: CC-BY-4.0
metadata:
  author: vasanthk
  version: 1.0.0
  source: https://github.com/vasanthk/react-bits
  platforms: [react]
---

# React Bits — Patterns & Pitfalls

Curated **patterns, anti-patterns, and tips** for React components. Prefer concrete examples in linked files over reinventing patterns.

**Source:** [vasanthk/react-bits](https://github.com/vasanthk/react-bits) (CC-BY-4.0) · [GitBook](https://vasanthk.gitbooks.io/react-bits)

## When to Use

- Implementing or reviewing **React/TSX** UI logic
- Fixing **re-renders**, **keys**, **state bugs**, **event handlers**
- Choosing **HOC vs composition**, **presentational vs container**
- **Styling** structure for React components

Vue note: many JSX/state ideas map to Vue (`v-if` vs `&&`, composables vs hooks); read for *intent*, adapt syntax.

## How to Use

1. Identify category (pattern / anti-pattern / perf / styling / gotcha)
2. Open the linked `.md` in this skill folder
3. Apply the recommended approach; cite anti-patterns to avoid

## Index

Full table of contents: [README.md](./README.md)

### Design patterns → `patterns/`

| Topic | File |
|-------|------|
| Conditionals in JSX | [patterns/1.conditionals-in-jsx.md](./patterns/1.conditionals-in-jsx.md) |
| Async setState | [patterns/2.async-nature-of-setState.md](./patterns/2.async-nature-of-setState.md) |
| Dependency injection | [patterns/3.dependency-injection.md](./patterns/3.dependency-injection.md) |
| Context wrapper | [patterns/4.context-wrapper.md](./patterns/4.context-wrapper.md) |
| Event handlers | [patterns/5.event-handlers.md](./patterns/5.event-handlers.md) |
| Flux / one-way flow | [patterns/6.flux-pattern.md](./patterns/6.flux-pattern.md), [patterns/7.one-way-data-flow.md](./patterns/7.one-way-data-flow.md) |
| Presentational vs container | [patterns/8.presentational-vs-container.md](./patterns/8.presentational-vs-container.md) |
| Third-party integration | [patterns/9.third-party-integration.md](./patterns/9.third-party-integration.md) |
| setState with function | [patterns/10.passing-function-to-setState.md](./patterns/10.passing-function-to-setState.md) |
| Decorators / feature flags | [patterns/11.decorators.md](./patterns/11.decorators.md), [patterns/12.feature-flags-using-redux.md](./patterns/12.feature-flags-using-redux.md) |
| Component switch / lists | [patterns/13.component-switch.md](./patterns/13.component-switch.md), [patterns/15.list-components.md](./patterns/15.list-components.md) |
| Fragments / tracking | [patterns/17.react-fragments.md](./patterns/17.react-fragments.md), [patterns/18.share-tracking-logic.md](./patterns/18.share-tracking-logic.md) |

### Anti-patterns → `anti-patterns/` (avoid these)

| Issue | File |
|-------|------|
| Props in initial state | [anti-patterns/01.props-in-initial-state.md](./anti-patterns/01.props-in-initial-state.md) |
| findDOMNode | [anti-patterns/02.findDOMNode.md](./anti-patterns/02.findDOMNode.md) |
| Mixins | [anti-patterns/03.mixins.md](./anti-patterns/03.mixins.md) |
| setState in componentWillMount | [anti-patterns/04.setState-in-componentWillMount.md](./anti-patterns/04.setState-in-componentWillMount.md) |
| Mutating state | [anti-patterns/05.mutating-state.md](./anti-patterns/05.mutating-state.md) |
| Index as key | [anti-patterns/06.using-indexes-as-key.md](./anti-patterns/06.using-indexes-as-key.md) |
| Spread props on DOM | [anti-patterns/07.spreading-props-dom.md](./anti-patterns/07.spreading-props-dom.md) |

### UX variations → `ux-variations/`

Composing toggles, HOC feature flags, wrapper components — see [ux-variations/README.md](./ux-variations/README.md).

### Performance → `perf-tips/`

[shouldComponentUpdate](./perf-tips/01.shouldComponentUpdate-check.md), [PureComponent](./perf-tips/02.pure-component.md), [reselect](./perf-tips/03.reselect.md).

### Styling → `styling/`

Stateless UI, CSS modules, base/layout/typography components — see [styling/README.md](./styling/README.md).

### Gotchas → `gotchas/`

[Pure render checks](./gotchas/01.pure-render-checks.md), [Synthetic events](./gotchas/02.synthetic-events.md).

### Further reading

[READINGS.md](./READINGS.md)

## Agent checklist (code review)

- [ ] No anti-patterns from `anti-patterns/` (especially keys, state mutation, props→state)
- [ ] Complex JSX conditionals extracted to subcomponents ([patterns/1.conditionals-in-jsx.md](./patterns/1.conditionals-in-jsx.md))
- [ ] Event handlers bound correctly ([patterns/5.event-handlers.md](./patterns/5.event-handlers.md))
- [ ] Lists use stable keys ([anti-patterns/06.using-indexes-as-key.md](./anti-patterns/06.using-indexes-as-key.md))
- [ ] Perf: avoid unnecessary renders ([perf-tips/](./perf-tips/))
