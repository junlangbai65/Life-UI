# 工作区 — 暂停/归档的前端界面与脚本

本目录存放**暂未启用**的酒馆助手项目源码，不参与 `pnpm build` / `pnpm watch` 的 webpack 打包（webpack 仅扫描 `{示例,src}/**/index.{ts,tsx}`）。

## 目录说明

| 目录 | 类型 | 说明 |
|------|------|------|
| [ADven](./ADven/) | 前端界面 | 冒险主题 Vue 全屏界面（`index.html` + `index.ts`） |
| [Goth](./Goth/) | 前端界面 | Goth 风格终端界面；[参考](./Goth/参考/) 为 UI 效果原型 |
| [infection_bar_boot](./infection_bar_boot/) | 脚本 | 感染态势栏 boot，配合 `util/状态栏1.html` 正则使用 |
| [LYsta](./LYsta/) | 正则 HTML + 脚本 | 凌月 MVU 状态栏；[npc_boot](./LYsta/npc_boot/) 为脚本入口 |
| [Inf_status](./Inf_status/) | 前端界面 | 感染/叙事终端 Vue 界面（MVU 状态栏 + 阅读画布） |
| [Life-UI](./Life-UI/) | 前端界面 |  clay 风格 Life-UI 游戏壳（路由、对话、存档等） |
| [wife](./wife/) | MVU 角色卡 + 前端 | 指腹为婚的幼小娇妻；含世界书、脚本、同居状态栏界面 |
| [wife-状态栏-旧版](./wife-状态栏-旧版/) | 前端界面 | 早期状态栏原型（已被 wife/界面/同居状态栏 取代） |
| [手机前端页面](./手机前端页面/) | 前端界面 | Vue 手机布局界面（自嵌套模板副本迁入） |

## 恢复开发

将对应文件夹**移回** `src/` 即可重新参与打包，例如：

```powershell
Move-Item 备份工作区\ADven src\ADven
Move-Item 备份工作区\Inf_status src\Inf_status
Move-Item 备份工作区\Life-UI src\Life-UI
Move-Item 备份工作区\wife src\wife
pnpm watch
```

打包产物输出到 `dist/<项目名>/`。

## 与 dist 的关系

- `dist/` 仅保留**当前活跃**项目的构建结果（主要来自 `示例/` 与 `src/`）。
- 本工作区项目移出 `src/` 后，请删除 `dist/` 中对应的旧产物（或执行一次 `pnpm build` 让 webpack 清理）。

## 样式参考

通用 UI 片段与效果原型已迁至项目根目录 [`样式库/`](../样式库/README.md)（原 `util/found1`、`src/案例`）。Goth 专属参考仍在本目录 [`Goth/参考/`](./Goth/参考/)。
