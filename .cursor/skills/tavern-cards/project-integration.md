# 本仓库集成（tavern_helper_template）

本文件说明 tavern-cards skill 在本仓库中的路径与命令约定。

## 路径

| 用途 | 路径 |
|------|------|
| Skill 根目录 | `.cursor/skills/tavern-cards/` |
| Forge CLI | `.cursor/skills/tavern-cards/scripts/tavern-cards-forge.mjs` |
| 项目注册 | 仓库根目录 `.cardrc.json` |
| 角色卡/世界书项目 | `cards/{Project}/` |
| 子代理 | `.cursor/agents/`（check-agent、conversion-agent、first-message-agent） |
| 前端界面开发 | `src/{ProjectName}/` |
| 构建产物 | `dist/{ProjectName}/` |
| SillyTavern | `D:\Sillybuild\SillyTavern`（端口 8000） |
| 平台地图 | 仓库根目录 [`AGENTS.md`](../../../AGENTS.md) |
| cards 说明 | [`cards/README.md`](../../../cards/README.md) |
| 制卡方法论 | skill `tavern-card-builder`（10 步 + references） |
| ST 深参库 | skill `st-dev-guide-db` → `db/` |
| 制卡栈总览 | [`CARD-WORKFLOW-STACK.md`](../CARD-WORKFLOW-STACK.md) |
| 创意库（源文件优先） | [`agent-foundry-vault/`](../../../agent-foundry-vault/) + skill `agent-foundry-st` |

## 命令

在仓库根目录执行：

```bash
# Forge CLI（推荐）
pnpm card:forge -- init MyProject --mvu
pnpm card:forge -- configure MyProject
pnpm card:forge -- pack MyProject

# 或直接 node
node .cursor/skills/tavern-cards/scripts/tavern-cards-forge.mjs --help
```

## 新建 MVU 角色卡时的协作关系

1. **内容与条目**：用 tavern-cards skill 在 `cards/{Project}/` 创作，经 forge 打包为 PNG/JSON。
2. **前端状态栏/脚本**：将 `schema.ts` 复制到 `src/{ProjectName}/`，在 `src/{ProjectName}/界面/`、`src/{ProjectName}/脚本/` 开发；`pnpm watch` 热重载到 SillyTavern。
3. **规范优先级**：硬性 API 与打包规则以 `.cursor/rules/`、`@types/` 为准；tavern-cards 负责写卡流程与 forge 操作。

## 注册新项目

向 `.cardrc.json` 的 `projects` 添加：

```json
"MyProject": {
  "state_file": "cards/MyProject/tavern-cards-state.json",
  "artifact": "cards/MyProject/MyProject.png"
}
```

然后运行 `pnpm card:forge -- init MyProject [--mvu|--worldbook]`。
