# 酒馆助手 / SillyTavern 开发工作流

本仓库用于在 [SillyTavern](https://github.com/SillyTavern/SillyTavern) 中编写 [酒馆助手 (Tavern Helper)](https://n0vi028.github.io/JS-Slash-Runner-Doc/guide/关于酒馆助手/介绍.html) 支持的前端界面与脚本. 下文说明目录分工、开发流程, 以及 **Rules**（规范）与 **Skills**（专项能力）的用法.

---

## 目录分工

| 目录 | 用途 | 是否打包 |
|------|------|----------|
| `src/` | 当前开发中的前端界面 / 脚本 | 是 → `dist/` |
| `示例/` | 模板自带可运行示例（角色卡、流式界面等） | 是（默认） |
| `工作区/` | 暂停/归档的完整项目（ADven、Goth、LYsta 等） | 否 |
| `样式库/` | 可复用 UI 片段（`found1/`、`案例/`） | 否 |
| `util/` | 工具函数与共享 HTML（如 `状态栏1.html`） | 否 |
| `初始模板/` | 新建项目脚手架 | 否 |
| `dist/` | `pnpm build` / CI 构建产物 | — |
| `@types/` | 酒馆助手与 MVU 的 TypeScript 类型 | — |

**判定项目类型：** 文件夹内同时有 `index.ts` + `index.html` → 前端界面；仅有 `index.ts` → 脚本. Webpack 仅扫描 `{示例,src}/**/index.{ts,tsx}`.

**恢复归档项目：** `Move-Item 工作区\<项目名> src\<项目名>` 后执行 `pnpm watch`.

---

## 日常开发流程

1. **安装依赖：** `pnpm install`
2. **实时编译与热重载：** `pnpm watch`（webpack 监听 + 酒馆助手 socket 推送）
3. **在酒馆中启用：** 扩展设置 → 酒馆助手 → **允许监听**
4. **调试页面：** 用 MCP **chrome-devtools** 连接 `.vscode/launch.json` 中的酒馆 URL，查看 DOM / Console，无需手动刷新（热重载生效时）
5. **生产构建：** `pnpm build` → 输出到 `dist/`
6. **角色卡同步：** 配置 `tavern_sync.yaml` 后 `pnpm sync`

编写时优先使用 `@types` 中的酒馆助手接口（`getChatMessages`、`getVariables`、`generate` 等），详见 Rules 中的「酒馆助手接口」.

---

## Rules（`.cursor/rules/`）

Rules 是本项目对 Agent 的**硬性规范**. 带 `@` 的条目会在 Cursor 中按策略注入上下文.

### 始终生效（alwaysApply）

| 文件 | 内容 |
|------|------|
| `项目基本概念.mdc` | 项目结构、工作区/样式库、打包机制、最佳实践 |
| `酒馆变量.mdc` | global / character / script / chat / message 变量 |
| `mcp.mdc` | chrome-devtools 连接酒馆、检查热重载 |

### 按任务加载（alwaysApply: false）

| 文件 | 何时阅读 |
|------|----------|
| `前端界面.mdc` | 编写含 `index.html` 的前端界面 |
| `脚本.mdc` | 编写仅 `index.ts` 的后台脚本 |
| `酒馆助手接口.mdc` | 调用酒馆 API、消息、世界书、变量等 |
| `mvu变量框架.mdc` | 用户提及 MVU、变量解析与更新 |
| `mvu角色卡.mdc` | 制作/维护 MVU 角色卡（`schema.ts`、世界书、界面 store） |
| `前端项目改造指南.mdc` | 改造为 mhjg/horr 式游戏界面（开局、MVU、统一请求、编年史） |

---

## Skills（`.cursor/skills/`）

Skills 是**专项工作流与外部知识库**, 在相关任务时由 Agent 按需读取.

| Skill | 路径 | 适用场景 |
|-------|------|----------|
| **sillytavern-web**（[tavernlike](https://github.com/ariespo/tavernlike)） | `.cursor/skills/sillytavern-web/` | 将 lorebook / 预设 / AI 聊天集成进**独立 Web 项目**；流式标签、双 API、游戏模式 UI；触发 `/sillytavern-web` 或 `/tavernlike` |
| **ui-ux-pro-max** | `.cursor/skills/ui-ux-pro-max/` | 界面设计、配色、字体、UX 规范；用 `scripts/search.py --design-system` 生成设计系统 |
| **bulletproof-react** | `.cursor/skills/bulletproof-react/` | React/TSX 项目结构、feature 目录、API 层、状态管理 |
| **react-bits** | `.cursor/skills/react-bits/` | React 模式、反模式、性能与 gotcha 审查 |

**与本仓库的关系：**

- 酒馆助手界面以 **Vue** 为主 → 改造/游戏流程看 `前端项目改造指南` + `示例/角色卡示例`；UI 样式可复制 `样式库/` 或使用 **ui-ux-pro-max**
- **sillytavern-web**（上游 [tavernlike](https://github.com/ariespo/tavernlike)）面向独立 React Web 应用，与 iframe 内酒馆界面互补，勿与 `src/` 打包流程混淆；更新 skill 见 `.cursor/skills/sillytavern-web/UPSTREAM.md`
- **bulletproof-react** / **react-bits** 用于 React 或 `@pixi/react` 子项目；Vue 项目只借鉴结构原则

---

## 典型任务路径

```
新建前端界面 / 脚本
  → 复制 初始模板/ 或参考 示例/
  → 放入 src/<项目名>/
  → 读 前端界面.mdc 或 脚本.mdc + 酒馆助手接口.mdc
  → pnpm watch + MCP 验证

MVU 角色卡
  → 参考 示例/角色卡示例/（schema、世界书、界面、脚本）
  → 读 mvu角色卡.mdc + mvu变量框架.mdc
  → util/mvu.ts 的 defineMvuDataStore

完整游戏式界面（mhjg / horr）
  → 读 前端项目改造指南.mdc（开局、messageParser、requestHandler、编年史）
  → 可参考 工作区/ADven、工作区/Goth 归档实现

状态栏 / 正则 HTML
  → util/状态栏1.html、工作区/LYsta/（正则 + boot 脚本）
  → 样式参考 样式库/案例/状态栏样式.html

UI 美化
  → 样式库/ 复制片段 + ui-ux-pro-max skill

独立 Web 项目集成 SillyTavern（非酒馆 iframe）
  → 读 .cursor/skills/sillytavern-web/SKILL.md（上游 tavernlike）
  → 触发 /sillytavern-web 或 /tavernlike；模板在 skill 内 templates/react/
  → 与 src/ 酒馆助手打包流程分离，勿混用

归档 / 暂停项目
  → 移入 工作区/，勿留 src/ 入口
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
