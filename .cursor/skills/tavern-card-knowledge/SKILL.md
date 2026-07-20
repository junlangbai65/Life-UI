---
name: tavern-card-knowledge
description: "Lookup-only Tavern Helper API and card/worldbook knowledge base. Use when the user asks to look up APIs, @types, regex, floors, variables, or presets — not for creating or editing card content (use tavern-cards for that). On conflict, .cursor/rules and current @types win."
---

# Tavern Card Knowledge（查阅）

## Use This Skill

**仅查阅** Helper API / 楼层 / 正则 / 变量 / 预设等释义。  
**创作或修改角色卡/世界书** → 使用 [`tavern-cards`](../tavern-cards/SKILL.md)，不要用本 skill 抢写卡流程。

## Workflow

1. Start from [reference.md](reference.md) and search for the topic heading or source file name.
2. Prefer high-level Tavern Helper APIs from `@types/function/*` over low-level SillyTavern exports or STScript.
3. When implementation is required, also read the relevant project rule (script / front-end / MVU / 酒馆助手接口).
4. If this knowledge conflicts with `.cursor/rules/` or current `@types`, **repository files win**.

## Reference Map

- Converted knowledge base: [reference.md](reference.md)
- Topic index: [index.md](index.md)
