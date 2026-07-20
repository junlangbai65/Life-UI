# cards/ — 角色卡与世界书项目

本目录存放 **tavern-cards** 管理的 SillyTavern 角色卡 / 世界书源项目。不参与 webpack 打包；用 forge 产出可导入的 PNG/JSON。

平台总览见根目录 [`AGENTS.md`](../AGENTS.md)；路径与协作约定见 [`.cursor/skills/tavern-cards/project-integration.md`](../.cursor/skills/tavern-cards/project-integration.md)。

## 已注册项目

注册表：仓库根目录 [`.cardrc.json`](../.cardrc.json)。

| 项目 | 目录 | 产物（artifact） |
|------|------|------------------|
| `fh` | [`cards/fh/`](fh/) | `cards/fh/F&H.json` |
| `wife` | [`cards/wife/`](wife/) | `cards/wife/指腹为婚的幼小娇妻.json` |

`wife` 的前端界面在 [`src/wife/`](../src/wife/)；`fh` 目前以写卡内容为主。

## 常用命令

在仓库根目录：

```bash
pnpm card:forge -- init MyProject --mvu
pnpm card:forge -- configure MyProject
pnpm card:forge -- pack MyProject
pnpm card:forge -- --help
```

## 典型目录结构（单项目）

```
cards/{Project}/
├── tavern-cards-state.json   # forge 状态
├── 创作规划.yaml             # 项目级事实来源
├── 世界书/                   # 条目 YAML/TXT
├── 开场白/                   # 可选
├── 正则/                     # 可选（含状态栏 HTML）
└── 脚本/                     # 可选（MVU 等）
```

## 与制卡方法论 / STDB

- **方法论（访谈、schema、世界书方案、状态栏设计）：** [`.cursor/skills/tavern-card-builder/SKILL.md`](../.cursor/skills/tavern-card-builder/SKILL.md)
- **深参查阅：** [`.cursor/skills/st-dev-guide-db/SKILL.md`](../.cursor/skills/st-dev-guide-db/SKILL.md) → `db/`
- **栈总览：** [`.cursor/skills/CARD-WORKFLOW-STACK.md`](../.cursor/skills/CARD-WORKFLOW-STACK.md)

方案设计用 `tavern-card-builder`；本目录与 forge 落地用 **`tavern-cards`**（本 skill）。

## 与 Agent Foundry（创意源文件）

源文件优先的创意立项在 [`agent-foundry-vault/50-创意库/`](../agent-foundry-vault/50-创意库/)；桥接 skill：[`.cursor/skills/agent-foundry-st/SKILL.md`](../.cursor/skills/agent-foundry-st/SKILL.md)。落地到本目录前先过方法论再 forge。

## Agent 入口

- 方法论：`.cursor/skills/tavern-card-builder/SKILL.md`
- 工程写卡：`.cursor/skills/tavern-cards/SKILL.md`
- 深参：`.cursor/skills/st-dev-guide-db/SKILL.md`
- 创意流程：`.cursor/skills/agent-foundry-st/SKILL.md`
- 子代理：`.cursor/agents/`（check-agent、conversion-agent、first-message-agent）
