# 上游同步

本 skill 源自 [ariespo/tavernlike](https://github.com/ariespo/tavernlike)（Claude Code / Cursor skill：**SillyTavern Web Automator**）。

| 字段 | 值 |
|------|-----|
| 上游仓库 | https://github.com/ariespo/tavernlike |
| 本仓库路径 | `.cursor/skills/sillytavern-web/` |
| Skill 名 | `sillytavern-web`（触发词亦可用 `/tavernlike`） |
| 当前同步 commit | `9d93c53` — Add zhangmen-parity features: toast, badges, API tools, variables, backup |
| 版本 | 3.0.0 |

## 重新同步

```powershell
cd d:\download\tavern_helper_template-main
git clone --depth 1 https://github.com/ariespo/tavernlike.git .cursor/skills/_tavernlike-upstream
# 复制除 .git 外所有文件到 sillytavern-web/
# 保留 skill.json 中 platforms 含 "cursor"、keywords 含 "tavernlike"
Remove-Item -Recurse -Force .cursor/skills/_tavernlike-upstream
```

同步后更新本文件中的 commit 哈希，并检查 `AGENTS.md` / `CLAUDE.md` / `GEMINI.md` 是否需要修订。
