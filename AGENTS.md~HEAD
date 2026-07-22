# SillyTavern Cards / UI 制作平台

本仓库是综合性 **SillyTavern 角色卡 + 酒馆助手 UI** 制作平台：在 [SillyTavern](https://github.com/SillyTavern/SillyTavern) 中编写 [酒馆助手 (Tavern Helper)](https://n0vi028.github.io/JS-Slash-Runner-Doc/guide/关于酒馆助手/介绍.html) 支持的前端界面与脚本；用 **tavern-card-builder** 做制卡方法论；用 **tavern-cards** 在 `cards/` 工程化 forge；用 **STDB** 做深参查阅；用 **Agent Foundry Vault** 做源文件优先的创意与长期经验沉淀。

**文档真源：** 本文件（`AGENTS.md`）。`CLAUDE.md` / `GEMINI.md` 仅为指向此处的短桩。  
**制卡栈总览：** [`.cursor/skills/CARD-WORKFLOW-STACK.md`](.cursor/skills/CARD-WORKFLOW-STACK.md)

---

## 轨道一览

| 轨道 | 路径 | 工具链 | 入口 |
|------|------|--------|------|
| **A0 创意源文件** | `agent-foundry-vault/50-创意库/` | Vault 模板；源优先 | **`agent-foundry-st`** |
| **A1 制卡方法论** | `.cursor/skills/tavern-card-builder/` | 10 步 + 16 分册（v2.2.3） | **`tavern-card-builder`** |
| **A2 工程 forge** | `cards/{Project}/` | `pnpm card:forge` | **`tavern-cards`** + `.cursor/agents/` |
| **A3 深参查阅** | `.cursor/skills/st-dev-guide-db/db/` | STDB V1.1 字母册 | **`st-dev-guide-db`** |
| **B UI/脚本** | `src/{Project}/` | `pnpm watch` / `build` → `dist/` | Rules：`前端界面` / `脚本` / `mvu*` |
| **旁轨 Web** | 外部项目 | `sillytavern-web` | 非 `src/` webpack |
| **旁轨 React** | React / `@pixi/react` | `bulletproof-react` / `react-bits` | Vue 主线勿默认加载 |

**推荐串联：**

```text
AFV 源文件（可选）
  → tavern-card-builder（访谈 / schema / 世界书 / 状态栏方案）
  → 需要深参时 st-dev-guide-db
  → tavern-cards + forge → cards/
  →（可选）src/ UI
  → 真实 SillyTavern 导入回归
```

协作说明：

- 制卡栈：[`.cursor/skills/CARD-WORKFLOW-STACK.md`](.cursor/skills/CARD-WORKFLOW-STACK.md)
- Vault：[agent-foundry-vault/本地集成-tavern_helper.md](agent-foundry-vault/本地集成-tavern_helper.md)
- cards↔UI：[`.cursor/skills/tavern-cards/project-integration.md`](.cursor/skills/tavern-cards/project-integration.md)、[`cards/README.md`](cards/README.md)

---

## 目录分工

| 目录 | 用途 | 是否打包 |
|------|------|----------|
| `src/` | 当前开发中的前端界面 / 脚本 | 是 → `dist/` |
| `cards/` | 角色卡 / 世界书源项目（forge） | 否（forge → PNG/JSON） |
| `agent-foundry-vault/` | Agent Foundry：创意库 / Wiki / Harness | 否 |
| `示例/` | 模板自带可运行示例 | 是（默认） |
| `备份工作区/` | 暂停/归档的完整项目 | 否 |
| `样式库/` | 可复用 UI 片段 | 否 |
| `util/` | 工具函数与共享 HTML | 否 |
| `初始模板/` | 新建项目脚手架 | 否 |
| `dist/` | 构建产物 | — |
| `@types/` | 酒馆助手与 MVU 类型 | — |
| `.cursor/rules/` | Agent 硬性规范真源 | — |
| `.cursor/skills/` | 专项工作流（含 TCB / STDB） | — |
| `.cursor/agents/` | check / conversion / first-message | — |

**判定项目类型：** `index.ts` + `index.html` → 前端；仅 `index.ts` → 脚本. Webpack：`{示例,src}/**/index.{ts,tsx}`.

**恢复归档：** `Move-Item 备份工作区\<项目名> src\<项目名>` → `pnpm watch`.

---

## 日常开发流程

1. `pnpm install`
2. `pnpm watch`（热重载）
3. 酒馆助手 → **允许监听**
4. MCP chrome-devtools 调试（见 `.vscode/launch.json`）
5. `pnpm build` → `dist/`
6. 制卡：读 `tavern-card-builder` → 落地 `pnpm card:forge`
7. 深参：按需打开 `st-dev-guide-db/db/` 字母册
8. 创意沉淀：`agent-foundry-vault/50-创意库/`；`pnpm vault:verify` 可选
9. 可选：`pnpm sync`（`tavern_sync.yaml`）

接口优先 `@types`；冲突以 Rules + `@types` 为准。

---

## Rules（`.cursor/rules/`）

### 始终生效

| 文件 | 内容 |
|------|------|
| `项目基本概念.mdc` | 结构、备份工作区、AFV、打包 |
| `酒馆变量.mdc` | 变量作用域 |
| `mcp.mdc` | chrome-devtools / 热重载 |

### 按任务加载

| 文件 | 何时 |
|------|------|
| `前端界面.mdc` / `脚本.mdc` | UI / 后台脚本 |
| `酒馆助手接口.mdc` | API 调用 |
| `mvu变量框架.mdc` / `mvu角色卡.mdc` | MVU |
| `前端项目改造指南.mdc` | 游戏式界面；示例 `备份工作区/ADven`、`Goth` |

---

## Skills 分层

### 制卡主链

| Skill | 角色 |
|-------|------|
| **tavern-card-builder** | **制卡方法论主入口**（新卡 / 改造 / schema / 世界书 / 状态栏 / 正则 / 第二 API） |
| **tavern-cards** | **工程 forge**：`cards/`、`pnpm card:forge`、子代理注册 |
| **st-dev-guide-db** | **深参查阅**：STDB A–E；勿当动手入口 |
| **agent-foundry-st** | 创意源文件 / 长期经验；桥接到主链 |
| **tavern-card-knowledge** | 轻量 API 百科 |
| **mvu-zod / ejs** | 短桩 → 优先 `tavern-card-builder` 分册 + `tavern-cards` references |

子代理：`.cursor/agents/check-agent`、`conversion-agent`、`first-message-agent`。

### UI / 发布

| Skill | 角色 |
|-------|------|
| **ui-ux-pro-max** | 设计系统 |
| **tavern-script-publishing** | dist CDN |

### 旁轨

| Skill | 角色 |
|-------|------|
| **sillytavern-web** | 独立 Web；禁止与 `src/` 混用 |
| **bulletproof-react** / **react-bits** | 仅 React / `@pixi/react` |

---

## Agent 路由表

```
新卡 / 改造 / 加系统 / schema / 更新规则 / 世界书方案 / 状态栏方案 / 变量丢了
  → tavern-card-builder（先访谈/读分册）→ 落地用 tavern-cards

精确 API / 避坑 / 范式深参（字母册 A–E）
  → st-dev-guide-db → db/ 对应文件；冲突以 @types + rules 为准

cards/ 条目注册、forge pack、开场白工程落地
  → tavern-cards (+ agents)

创意立项 / Vault 源文件 / 长期经验沉淀
  → agent-foundry-st

轻量 Helper API 名词
  → tavern-card-knowledge

Vue 状态栏实现 / 脚本 / 热重载
  → 前端界面.mdc 或 脚本.mdc + mcp +（可选）ui-ux-pro-max

游戏式界面改造
  → 前端项目改造指南.mdc（备份工作区/ADven|Goth）

发布 dist CDN
  → tavern-script-publishing

独立站 lorebook/聊天
  → sillytavern-web（旁轨）

归档
  → 备份工作区/
```

---

## Rules 引用（Agent 上下文）

@.cursor/rules/项目基本概念.mdc
@.cursor/rules/mcp.mdc
@.cursor/rules/酒馆变量.mdc
@.cursor/rules/酒馆助手接口.mdc
@.cursor/rules/前端界面.mdc
@.cursor/rules/脚本.mdc
@.cursor/rules/mvu变量框架.mdc
@.cursor/rules/mvu角色卡.mdc
@.cursor/rules/前端项目改造指南.mdc
