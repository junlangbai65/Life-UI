---
name: bulletproof-react
description: >-
  Production-ready React architecture guide from bulletproof-react. Use when
  structuring React/TSX apps, organizing features, API layer, state management,
  testing, security, or performance. Triggers on: React project structure,
  feature folders, TanStack Query, Zustand, React architecture, scalable React.
license: MIT
metadata:
  author: alan2207
  version: 1.0.0
  source: https://github.com/alan2207/bulletproof-react
  platforms: [react, typescript]
---

# Bulletproof React Architecture

Opinionated guide for **production-ready React** apps: feature-based structure, clean boundaries, and consistent team conventions. Not a boilerplate — adapt tools to your stack.

**Source:** [alan2207/bulletproof-react](https://github.com/alan2207/bulletproof-react) (MIT)

## When to Use

Apply this skill when the user:

- Starts or refactors a **React / TSX** frontend (including `@pixi/react` in this repo)
- Asks about **folder structure**, feature modules, shared vs feature code
- Designs **API layer**, server state, forms, global state
- Needs **testing**, error handling, security, or performance patterns for React

For **Vue** projects in this tavern template, translate *principles* (feature folders, unidirectional flow, colocation) — do not force Zustand/React Query unless the stack is React.

## Quick Reference (read `AGENTS.md` first)

### Project layout

```
src/
├── app/           # routes, providers, router
├── components/    # shared UI
├── features/      # self-contained feature modules
├── hooks/         # shared hooks
├── lib/           # preconfigured clients (api, auth)
├── types/         # shared types
└── utils/         # shared utilities
```

Each feature: `api/`, `components/`, `hooks/`, `stores/`, `types/`, `utils/` — only what the feature needs.

### Architecture rules

- **No cross-feature imports** — share via `components/`, `hooks/`, `lib/`
- **Unidirectional flow:** shared → features → app
- **Colocation** — keep code close to usage
- **Kebab-case** files/folders; **PascalCase** components

### State

| Kind | Tool |
|------|------|
| Local UI | `useState` / `useReducer` |
| Global client | Zustand (sparingly) |
| Server | TanStack Query + fetcher functions |
| Forms | React Hook Form + Zod |

### API pattern

1. Types/schemas → 2. Fetcher → 3. Query hook

```typescript
export const useDiscussions = (params: GetDiscussionsParams) =>
  useQuery({ queryKey: ['discussions', params], queryFn: () => getDiscussions(params) });
```

## Detailed Docs (in this skill folder)

Read the matching doc **before** implementing that concern:

| Topic | File |
|-------|------|
| Overview | [docs/application-overview.md](./docs/application-overview.md) |
| Standards | [docs/project-standards.md](./docs/project-standards.md) |
| Structure | [docs/project-structure.md](./docs/project-structure.md) |
| Components & styling | [docs/components-and-styling.md](./docs/components-and-styling.md) |
| API layer | [docs/api-layer.md](./docs/api-layer.md) |
| State management | [docs/state-management.md](./docs/state-management.md) |
| Testing | [docs/testing.md](./docs/testing.md) |
| Error handling | [docs/error-handling.md](./docs/error-handling.md) |
| Security | [docs/security.md](./docs/security.md) |
| Performance | [docs/performance.md](./docs/performance.md) |
| Deployment | [docs/deployment.md](./docs/deployment.md) |
| Cheatsheet | [AGENTS.md](./AGENTS.md) |

## Workflow for Agent

1. **Clarify scope** — new feature vs refactor vs review
2. **Pick structure** — place code under `features/<name>/` or shared folders per [project-structure.md](./docs/project-structure.md)
3. **Apply standards** — naming, imports, no cross-feature deps ([project-standards.md](./docs/project-standards.md))
4. **Layer correctly** — API types → fetcher → hook → UI ([api-layer.md](./docs/api-layer.md))
5. **State** — local first; global only when cross-feature ([state-management.md](./docs/state-management.md))
6. **Harden** — errors, auth, XSS ([error-handling.md](./docs/error-handling.md), [security.md](./docs/security.md))

## Disclaimer (from upstream)

This is a **guide**, not mandatory boilerplate. Replace libraries (e.g. Vue + Pinia in tavern projects) while keeping structural principles consistent.
