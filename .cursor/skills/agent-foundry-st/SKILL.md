---
name: agent-foundry-st
description: "Vibe code 一站式写卡 / Agent Foundry Vault / 焚诀式 ST 创意流程与开发指南库。当用户提到 agent-foundry-vault、创意库、源文件优先、雨夜便利店、Vibe 写卡、ST 开发指南、灵感→世界观→角色→源文件→调试→发布，或要从 Vault 导出到 cards/ 时使用。创意与方法论在 agent-foundry-vault/；落地 forge/UI 仍走 tavern-cards 与 src/。"
---

# Agent Foundry ST 工作流（Vibe 一站式写卡桥接）

上游：[LiarMTTT/agent-foundry-vault](https://github.com/LiarMTTT/agent-foundry-vault)  
本仓库部署路径：[`agent-foundry-vault/`](../../../agent-foundry-vault/)  
本地协作说明：[`agent-foundry-vault/本地集成-tavern_helper.md`](../../../agent-foundry-vault/本地集成-tavern_helper.md)

## 职责边界

| 层 | 谁负责 |
|----|--------|
| 灵感 / 世界观 / 角色 / **源文件真源** / 对话调试 / 发布门禁 | `agent-foundry-vault/50-创意库/` |
| Obsidian Wiki / 收件箱 / Harness / Hermes 运维 | Vault 根目录其它分区（读 Vault 自己的 `AGENTS.md`） |
| **制卡方法论**（访谈、schema、世界书/状态栏方案） | **`tavern-card-builder`** |
| SillyTavern 条目 YAML、forge pack、MVU/EJS 工程落地 | **`tavern-cards`** → `cards/{Project}/` |
| 深参避坑 | **`st-dev-guide-db`** |
| 状态栏 / 脚本 / 热重载 | `src/{Project}/` + `.cursor/rules` |

**不要**用本 skill 替代 `tavern-card-builder` 或 `tavern-cards`；**不要**把 Vault 虚构内容写入 Vault 的 `concepts/`/`entities/` 事实区。

## 何时读取

1. Vault：[`50-创意库/README.md`](../../../agent-foundry-vault/50-创意库/README.md)
2. Vault：[`AGENTS.md`](../../../agent-foundry-vault/AGENTS.md) + [`SCHEMA.md`](../../../agent-foundry-vault/SCHEMA.md)（信息分区）
3. 模板：[`templates/模板-角色源文件.md`](../../../agent-foundry-vault/templates/模板-角色源文件.md)、[`模板-世界书源条目.md`](../../../agent-foundry-vault/templates/模板-世界书源条目.md)、[`模板-对话调试记录.md`](../../../agent-foundry-vault/templates/模板-对话调试记录.md)
4. 示例：[`50-创意库/示例项目-雨夜便利店/`](../../../agent-foundry-vault/50-创意库/示例项目-雨夜便利店/)
5. 本仓库：[`tavern-card-builder/SKILL.md`](../tavern-card-builder/SKILL.md) → [`tavern-cards/SKILL.md`](../tavern-cards/SKILL.md) + [`project-integration.md`](../tavern-cards/project-integration.md)

## 标准流程

```text
Vault 创意库（源文件） → 锁定 manifest（ST + 扩展层）
  → tavern-card-builder（方法论 / 分册）
  → pnpm card:forge init/configure（cards/，tavern-cards）
  → 源语义翻译为世界书/角色条目
  → 如需 MVU/EJS/UI → schema + src/
  → 真实 SillyTavern 导入回归 → 再写「已兼容」
```

### 路径映射

| Vault | 本仓库 |
|-------|--------|
| `50-创意库/{项目}/01–03` | 可选：`cards/{P}/` 规划笔记 / `创作规划.yaml` 素材 |
| `04-源文件/` + manifest | `cards/{P}/` 条目与 forge 输入（**源优先**） |
| `05-对话调试/` | 回归记录；未实测不得写「已兼容」 |
| `06-发布/` | 仅记录；派生物由 `pnpm card:forge -- pack` 生成 |
| Helper / EJS / MVU（manifest 声明） | `mvu*` rules + `src/{P}/` |

### 世界书源语义（导出前必须齐全）

每个条目明示：`strategy`、`keys`、`position`、`recursion`、`content`（详见创意库 README）。

## 与现有主线关系

- **创意方法论 / 指南库入口**：本 skill + `agent-foundry-vault/`
- **制卡方法论**：`tavern-card-builder`
- **工程化写卡 / forge**：`tavern-cards`（禁止与源文件真源互相覆盖）
- **深参 / API**：`st-dev-guide-db` / `tavern-card-knowledge`；冲突以 `@types` + `.cursor/rules` 为准

## 更新 Vault

```powershell
git -C agent-foundry-vault pull
node agent-foundry-vault/scripts/verify-repo.mjs   # 可选，需 Node ≥22
```
