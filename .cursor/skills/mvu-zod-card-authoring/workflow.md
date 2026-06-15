# MVU ZOD Workflow

## Authoring Checklist

- [ ] Schema uses Zod 4 and exports `Schema`.
- [ ] Variable-structure script imports `registerMvuSchema` remotely and registers `Schema` in `$(() => {})`.
- [ ] Init data matches the schema and is provided by disabled `[initvar]` worldbook entry or opening-message `<initvar>`.
- [ ] `变量列表` shows only AI-visible fields.
- [ ] `[mvu_update]变量更新规则` describes when each mutable variable changes.
- [ ] `[mvu_update]变量输出格式` tells the AI to output `<UpdateVariable>` with `<Analysis>` and `<JSONPatch>`.
- [ ] Tavern regex hides `<UpdateVariable>` blocks and handles optional status placeholders.
- [ ] Script/front-end integrations wait for `Mvu` before reading or writing MVU data.

## Schema Rules

- Use `z.coerce.number()` for numeric fields that may arrive as strings.
- Prefer `z.prefault()` over `z.default()` for incremental updates.
- Prefer records over arrays when keys are meaningful, such as inventory item names.
- Keep transforms idempotent: `Schema.parse(Schema.parse(input))` should be stable.
- Use transforms to repair acceptable broken updates when users expect partial effect, such as clamping ranges or dropping oldest overflow entries.
- Do not use `z.passthrough()` or `z.strict()` in this project's Zod 4 MVU schemas.

## Path Rules

| Context | Path Format |
| --- | --- |
| EJS `getvar` / status display | `stat_data.角色.好感度` |
| Tavern Helper code reading MVU data | `_.get(data, 'stat_data.角色.好感度')` |
| JSON Patch in `<UpdateVariable>` | `/角色/好感度` |
| JSON Patch object insert | `/背包/新物品` |
| JSON Patch array append | `/记忆/-` |

## Common Files

- `schema.ts`: exports the pure schema for project code.
- `脚本/变量结构/index.ts`: imports the schema and calls `registerMvuSchema(Schema)`.
- `世界书/变量/initvar.yaml`: initial value data, ideally with `# yaml-language-server: $schema=...`.
- `世界书/index.yaml`: worldbook entries for variable list and MVU update prompts.
