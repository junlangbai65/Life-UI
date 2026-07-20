---
name: st-dev-guide-db
description: "Lookup-only SillyTavern engineering handbook DB (STDB V1.1 / ST开发指南DB). Use when needing deep pitfalls, paradigms, or sourced confidence notes on ST core, worldbook, MVU, Tavern Helper UI, regex, extensions, ops — not as the primary card-authoring entry (use tavern-card-builder for methodology, tavern-cards for forge). On conflict, current @types and .cursor/rules win."
---

# ST 开发指南 DB（STDB V1.1）

本仓库内的 **查阅型** 知识库，源自 STDB_V1.1（避坑手册 + 范式库）。**不是**可执行 skill 流程；制卡动手前仍先走 `tavern-card-builder`，工程落地走 `tavern-cards`。

## 知识库位置

所有主题手册：[`db/`](db/)（扁平 `A*` / `B*` / `C*` / `D*` / `E*` + 收集蓝图）

索引入口：[`db/ST开发指南DB-收集蓝图.md`](db/ST开发指南DB-收集蓝图.md)

## 按任务开卷（每次 1～3 个文件）

| 系列 | 主题 | 何时打开 |
|------|------|----------|
| **Meta** | 收集蓝图 | 查版本索引、源清单、缺口 |
| **A** | 卡格式、世界书、提示/预设、渲染/宏、正则；A0 驾驭检查单 | ST 核心制卡工程 |
| **B** | MVU/JSONPatch+Zod（B1）、STScript（B2）；勿用归档旧文 | 变量与自动化 |
| **C** | 酒馆助手 iframe、状态栏、HTML/CSS、同层前端、产品形态 | UI / 前端架构 |
| **D** | CDN/git、性能、多 API、数据目录、扩展、XSS、移动端 | 运维 / 安全 |
| **E** | 群聊、swipe、多媒体、Live2D、工坊脚本 | 进阶宿主能力 |

## 使用规则

1. **按需加载**，不要整库塞进上下文。
2. 尊重文内置信度：`high` + 运行时/本地证据才可当施工依据；`low` / 悬案须再核对。
3. 与本仓库冲突时：**当前 `@types/` + `.cursor/rules/` 优先**（STDB 部分基线偏旧版 ST）。
4. 缺文件 `A1_驾驶员同步检查.md`：本 dump 未收录，勿虚构其内容。
5. `C8_数据库兼容同层前端-待验证.md`：文档自标禁止生产引用，遵守。

## 与其它 skill 的边界

| 需求 | 去哪 |
|------|------|
| 造新卡 / 改造 / schema / 状态栏方案 | `tavern-card-builder` |
| `cards/` forge 打包 | `tavern-cards` |
| 轻量 API 名词查阅 | `tavern-card-knowledge` |
| 深参避坑 / 范式对照 | **本 skill → `db/`** |
| 创意源文件长期沉淀 | `agent-foundry-st` + AFV |
