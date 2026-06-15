---
name: ejs-prompt-template
description: Use when writing SillyTavern ST-Prompt-Template EJS, getvar/getwi logic, dynamic worldbook prompts, prompt injection, decorators, or multi-stage personality palettes.
---

# EJS Prompt Template

## Use This Skill

Use this when the task mentions EJS, ST-Prompt-Template, dynamic worldbook entries, `getvar`, `getwi`, `print`, decorators, `@INJECT`, prompt injection, activation regex, or multi-stage character/personality palettes.

## Boundaries

- This is for prompt-template/worldbook authoring, not Tavern Helper TypeScript code by default.
- If the task also touches MVU schema or message-floor variables, use `mvu-zod-card-authoring` alongside this skill.
- Do not replace the repository's hard rules; use this as task guidance for writing prompt content.

## Workflow

1. Determine execution context: generation, rendering, preprocessing, worldbook, preset, character content, or message content.
2. Prefer `<%_ ... _%>` for control blocks to avoid unwanted blank lines.
3. Use `getvar('stat_data....', { defaults: ... })` for MVU-visible variable reads in prompt templates.
4. For large conditional content, prefer `print(await getwi('条目名'))` or split worldbook entries instead of huge nested EJS blocks.
5. For multi-stage palettes, confirm the stage variables and non-overlapping conditions before writing EJS.
6. Verify output through prompt viewer, alerts/toastr/console, or simplified test snippets as appropriate.

## References

- Complete EJS reference: [reference.md](reference.md)
- Multi-stage palette workflow: [multi-stage-palette-workflow.md](multi-stage-palette-workflow.md)
