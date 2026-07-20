# 制卡工作流更新说明（TCB 2.2.3 + STDB V1.1）

本仓库已接入两套外部制卡资料，与既有 `tavern-cards` / AFV 分工如下。

## 安装位置

| 来源 | 本仓库路径 | 角色 |
|------|------------|------|
| tavern-card-builder 2.2.3 | `.cursor/skills/tavern-card-builder/` | **主制卡方法论**（10 步 + 16 分册） |
| STDB_V1.1 | `.cursor/skills/st-dev-guide-db/db/` | **查阅参考库**（A–E 主题手册） |
| （既有）tavern-cards | `.cursor/skills/tavern-cards/` | **工程 forge**（`cards/` + CLI） |
| （既有）agent-foundry-st | `.cursor/skills/agent-foundry-st/` | **创意源文件 / 长期经验**（AFV） |

## 推荐串联

```text
AFV 创意源文件（可选）
  → tavern-card-builder（需求访谈 → schema/世界书/状态栏方案）
  → 深参时打开 st-dev-guide-db/db 对应字母册
  → tavern-cards + pnpm card:forge → cards/
  →（可选）src/ + pnpm watch
  → 真实 SillyTavern 导入回归
```

## 冲突优先级

1. 用户当前明确指令  
2. `.cursor/rules/` + 当前 `@types/`  
3. `tavern-card-builder` 方法论铁律  
4. `st-dev-guide-db` 高置信条目  
5. `tavern-card-knowledge` 百科  

## 更新来源

- 上游 skill 包：重新复制 `tavern-card-builder` 文件夹覆盖 `.cursor/skills/tavern-card-builder/`（保留本仓对「工作区协作边界」的补丁）。  
- STDB：覆盖 `.cursor/skills/st-dev-guide-db/db/*.md`。  
- 平台路由：以仓库根 `AGENTS.md` 为准。
