---
name: mvu-zod-card-authoring
description: Use when authoring SillyTavern MVU ZOD character cards, schemas, initvar YAML, variable update rules, UpdateVariable JSON Patch prompts, or status-bar integration.
---

# MVU ZOD Card Authoring

## Use This Skill

Use this for MVU ZOD character-card work in this repository, including:

- designing or reviewing `schema.ts` / variable-structure scripts
- writing `[initvar]` YAML or per-opening `<initvar>` blocks
- writing `变量列表`, `[mvu_update]变量更新规则`, or `[mvu_update]变量输出格式`
- connecting MVU data to Tavern Helper scripts or front-end status bars

## Required Project Rules

Before editing code, also follow the project MVU rules:

- `.cursor/rules/mvu变量框架.mdc`
- `.cursor/rules/mvu角色卡.mdc`
- `.cursor/rules/酒馆助手接口.mdc` when calling Tavern Helper APIs

## Workflow

1. Locate or request the Zod 4 schema. If the user gives a variable-structure script, strip the remote `registerMvuSchema` import and registration wrapper before treating it as `schema.ts`.
2. Keep MVU data under `stat_data` when reading message variables, but omit the `stat_data` prefix in JSON Patch paths inside `<UpdateVariable>`.
3. Prefer `z.coerce.number()`, `z.prefault()`, `z.record()` / `z.partialRecord()`, and idempotent transforms for incremental updates.
4. Keep readonly `_` fields out of AI update rules, and hide `$` fields from AI-facing variable lists.
5. Verify the final setup covers schema, initvar, variable list, update rules, output format, regex hiding, and optional UI/script integration.

## References

- Full workflow and examples: [reference.md](reference.md)
- Quick checklists and templates: [workflow.md](workflow.md)
