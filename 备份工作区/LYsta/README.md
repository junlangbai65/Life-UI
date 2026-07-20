# LYsta — 凌月 MVU 状态栏（正则替换 HTML）

本目录提供粘贴在 SillyTavern **正则 → 替换为** 中的自包含 HTML，用于将消息里的 **`<StatusPlaceHolderImpl/>`** 占位标签替换为可视化状态栏（与项目内 [`示例/角色卡示例/index.yaml`](../../示例/角色卡示例/index.yaml) 中「界面」类正则的写法一致）。

## 文件说明

| 文件 | 用途 |
|------|------|
| `status_bar.html` | 酒馆正则「替换为」的完整内容（含 `{{format_message_variable::stat_data…}}` 宏与脚本） |
| `preview.html` | 本地双击预览：mock 数据 + 与酒馆相同的样式与逻辑 |
| `README.md` | 本说明 |

> 本目录**没有** `index.ts` / `index.html` 作为 webpack 入口，不会被当作酒馆助手 iframe 前端项目打包。

## 酒馆正则配置

1. 打开 **SillyTavern → 正则 (Regex)**，新建一条规则（或并入现有角色卡的正则条目）。
2. **查找表达式**：`<StatusPlaceHolderImpl/>`  
   - 若 AI 偶尔写出空格，可改用正则查找：`/<StatusPlaceHolderImpl\s*\/>/`
3. **替换为（内容）**：将 [`status_bar.html`](./status_bar.html) 的**全文**复制粘贴进去（从首行 `<div class="lysta-root">` 到末行 `</div>`，包含其中的 `<style>` 与 `<script>`）。
4. **建议勾选**（与角色卡示例里「前端界面状态栏」一类规则相同）：
   - **AI 输出**：是（世界书或模型在正文里输出占位符时生效）
   - **用户输入**：按需（若玩家手动贴占位符则勾选）
   - **仅格式显示**：通常勾选，聊天里看到状态栏、且不污染发送给模型的可见文本（以你的 ST 版本选项为准）
5. 在需要显示状态栏的消息中，由 AI、世界书或第一条消息模板输出单行占位符即可：

   ```text
   <StatusPlaceHolderImpl/>
   ```

   正则会把该标签整段替换为状态栏 HTML。

### 写入角色卡 `index.yaml` 时（可选）

可与示例条目 `[界面]美化状态栏` / `[界面]前端界面状态栏` 并列，新增一条：将上述「查找表达式」与「内容」填入 `查找表达式`、`内容` 字段，`来源`、`作用于` 与示例保持一致即可。

## MVU 字段对照（`stat_data`）

状态栏读取的是消息楼层变量中的 MVU 数据，路径与变量结构脚本一致：

| 路径 | 说明 |
|------|------|
| `stat_data.凌月.依赖程度` | 0–100，进度条 + 阶段徽章（疏离 / 亲近 / 依恋 / 沉迷） |
| `stat_data.凌月.性欲值` | 0–100；≥80 显示「事件阈值」警示与条带动画 |
| `stat_data.世界.当前日期` | 字符串，如 `2025年9月15日` |
| `stat_data.世界.生活费` | 数值；≤0 显示「财务危机」条 |
| `stat_data.NPC关系` | 对象：`{ [NPC名]: { 关系值, 阶段说明 } }`；动态列表由脚本渲染 |

宏写法（已写在 `status_bar.html` 内）：必须使用 **`format_message_variable`** 才能读到**本条消息楼层**上的 MVU `stat_data`（与 [`示例/角色卡示例/index.yaml`](../../示例/角色卡示例/index.yaml) 中美化状态栏示例一致）。`{{getvar::…}}` 通常不指向楼层变量，会导致空白或错误。

依赖程度 / 性欲值的宏同时写在隐藏的 **`data-stat-raw` 文本节点**内：不少环境下正则只会替换正文里的宏，**不会替换** HTML 属性里的 `data-value`，脚本会优先读文本节点，并在仍失败时用 `Mvu.getMvuData` / `getVariables` 读本条 `stat_data` 兜底。

**液体进度条宽度**：每个 `.lysta-bar-fill[data-fill]` 上 **`data-fill-pct="{{format_message_variable::…}}"`** 在正则替换阶段写入 **0–100 的纯数字**（无 `%`），样式表用 `calc(attr(data-fill-pct number, 0) * 1%)` 得出条宽，避免在 `<article>` 上使用内联 `style`（满足 Edge / webhint 的 `no-inline-styles`）。即便聊天内 **`<script>` 被禁用**，只要宏能把数字写进 `data-fill-pct`，且环境为较新的 Chromium（支持 `attr()` 的 `number` 类型），液体层仍有可视宽度；脚本运行时会更新 `data-fill-pct` 并写 `fill` 的 `width` 做动画。**若条始终为空**：确认替换结果里 `data-fill-pct` 是否为合法数字；极旧内核可能不认识 `attr(... number)`，需依赖脚本设宽。**若仍见大号 50/25**：当前模板已不再绘制该项大号数字，多见于正则未更新或其它界面重复输出 MVU。

**核心四项一体化布局**：`当前日期`、`生活费`、`依赖程度`、`性欲值` 同在一个 **`lysta-core-grid`**（2×2）内，每张 **`lysta-core-card`** 均为：**顶栏**（`lysta-core-head`：左侧图标列 + 标题 + 右侧占位或徽章/变动）、**中部读数窗**（`lysta-readout-screen--core`，垂直居中）、**底部轨槽**（统计为液体条；世界两项为 **`lysta-core-track--idle`** 空轨，高度与进度条一致以便对齐）。

**统计主读数液晶**：**`整数/100`** 显示在读数窗内（与日期、生活费同级体量），宏写在 **`[data-bar-lcd]`** 文本节点；脚本 `syncStat` 同步取整。字体 **Share Tech Mono**（失败回落等宽），配色仍按依赖 / 性欲分两套主题。

- `{{format_message_variable::stat_data.凌月.依赖程度}}`
- `{{format_message_variable::stat_data.凌月.性欲值}}`
- `{{format_message_variable::stat_data.世界.当前日期}}`
- `{{format_message_variable::stat_data.世界.生活费}}`
- 隐藏 JSON：`{{format_message_variable::stat_data.NPC关系}}` 同时放在 **`<script class="lysta-npc-fallback">`** 与 **`.lysta-npc-fallback-inline` 隐蔽文本**中：部分 ST 版本**不会在 `<script>` 内展开宏**，仅用脚本标签会导致 `JSON.parse` 失败、列表空白；隐蔽 span 与正文宏一致，供脚本优先解析。

### NPC 列表数据来源（优先级）

内联脚本会按顺序尝试：

1. 解析本条楼层 `message_id`（在 **`window` / `parent` / `top`** 上尝试 `getCurrentMessageId` → 否则 `.closest('.mes')` 的 `mesid` → 否则向上遍历带 `mesid` 的祖先），在该窗口上对 id 调用 **`Mvu.getMvuData` / `getVariables`**（同样在 **`window` / `parent` / `top`** 上探测接口；正则注入 iframe 时 API 常在父页）→ 读取 `stat_data.NPC关系` 等路径
2. **若仍拿不到 id**（例如正则块未挂在 `.mes` 下），再对 **`'latest'`** 与 **`-1`** 各试一次（与 MVU 文档中「当前楼」含义一致，避免整页空白）
3. 解析 **`.lysta-npc-fallback-inline`** 的文本：优先 **JSON**；若 `format_message_variable` 将对象渲染成**多行说明文**（`名字:\n关系值: 数字\n阶段说明: …`），脚本会再尝试**可读文本解析**
4. 解析 **`.lysta-npc-fallback`** 脚本内文本（同上：JSON → 说明文）
5. 解析 **`[data-npc-ssr-fallback]`** 内 **`.lysta-npc-ssr-pre`**：与上相同；初始化结束时 **`finally`** 会 **`remove()`** 整块 SSR，并为 **`.lysta-root`** 加上 **`lysta-js-done`**（配套 CSS 隐藏 SSR，防止中途抛错导致删不掉 DOM）。若 **`[data-npc-list]`** 已挂上 **`data-lysta-has-npcs`**（渲染出卡片），亦用 **兄弟选择器 CSS** 隐藏 SSR作兜底。**若仍长期看见 SSR**，多为消息 HTML 内的 **`<script>` 被酒馆剥离**，上述逻辑均不会运行，需在 SillyTavern / 扩展里允许消息脚本或使用酒馆助手前端等方式挂载。

未展开的 `{{…}}` 会跳过解析，避免静默失败。

**仍为空时请先对照**：关系列表依赖底部 **`<script>...</script>`** 执行 `renderNpcs`。若 SillyTavern / 扩展 **移除消息内的脚本**，卡片无法生成且 SSR 会一直在；否则需在酒馆侧允许该 HTML 内脚本，或改用酒馆助手「前端界面」iframe 等方式挂载。若脚本正常但仍无卡，请对照宏展开：说明文解析优先 **`innerText`**（`&lt;br&gt;` 作换行），再回退 **`textContent`**；另 **API 若返回空的 `NPC关系: {}` 曾为 truthy 会挡住 DOM 宏**，现仅当 **`Object.keys` 非空** 才视为 API 命中。

宏若在脚本首次运行之后才写入 DOM（异步替换 `{{…}}`），模板已对 `.lysta-npc-fallback-inline` / `script.lysta-npc-fallback` / `.lysta-npc-ssr-pre` 挂了 **`MutationObserver`**，并在 **`jQuery` ready** 与 **0 / 80 / 320 / 900 ms** 多次重跑初始化，以便宏展开后补上列表。

数据源额外尝试：`stat_data.NPC关系`、顶层 **`NPC关系`**，以及若干嵌套路径（如 **`data.stat_data.NPC关系`** 等）。字段为**字符串**时：先按 **JSON** 解析，失败则按 **MVU 说明文**（`名字:` / `关系值:` / `阶段说明:`，支持半角/全角冒号、多 NPC 块、阶段说明多行续行）解析。API 均失败后再读 **`getVariables({ type: 'chat' })`** 上的同路径（部分部署会把快照挂在聊天变量上）。

### 相较上一条：变动脉络（`.lysta-drift`）

核心页在**能拿到上一条消息楼层**的 `stat_data` 时，在世界卡片**下方**显示一条紧凑的「变动脉络」：**不展示字段名与旧→新全文**，仅用图标 + 带符号整数（如 `+4`、`-70`）表示差额；**日期**仅有旋转日历图标与循环动效（无数字）。左侧信标点、扫光与节点呼吸动画形成轻量循环提示。**关系列表**仍为 NPC 姓名、关系值、阶段说明等完整字段展示，互不干扰。

- **数据来源**：解析当前 `message_id` 后，读取 `message_id - 1` 的 `stat_data`，与当前楼层宏 / API 数值比对（逻辑与原先一致）。
- **首条消息**（`id < 1`）或无上一条数据时，整块隐藏。
- **本地预览**：[`preview.html`](./preview.html) 内 `lysta-prev-stat-fallback` 与当前 mock 错开，用于演示该条；酒馆内一般不需该块。

## 交互说明

- **核心 / 关系列表**：顶部分段标签切换；**核心**页为凌月数值 + 世界日期与生活费；**关系列表**为 NPC 关系卡片网格；无记录时显示「当前没有特殊关系」。
- **右上圆形按钮**：切换**夜间（默认）**与**日间**主题（纯 CSS，无持久化）。

### 拟物视觉系统（维护必读）

状态栏采用 **一处定义、多处复用** 的 sci-fi 面板语言：在 `.lysta-root` 上声明 token，用 utility 类叠出金属外框、内嵌读数窗与阴刻字。**改样式时请勿删除** HTML 中为拟物效果而加的结构层（如 `.lysta-rivets-mini`、`.lysta-bezel`、`[data-fill]` + `.lysta-bar-fill-liquid` 液体进度栈），否则脚本绑定的 `data-fill`、`data-money-value` 等选择器会失效。凌月两项数值无可见数字，读数依赖液体条长度 + 隐藏 `data-stat-aria-live`。

| Token / 变量 | 作用 |
|----------------|------|
| `--lysta-bezel-high` / `--lysta-bezel-low` | 顶/左高光与底/右阴影，模拟金属倒角 |
| `--lysta-bezel-rim` | 外金属边圈色 |
| `--lysta-screen-bg` / `--lysta-screen-border` | 读数窗底色与内凹边 |
| `--lysta-c-fg-engraved` | 阴刻标签/标题字色 |
| `--lysta-led-purple` / `--lysta-led-teal` | LED 灯条与辉光强调 |

`#lysta-theme:checked ~ .lysta-wrap` 下会覆写上述 token，以适配日间主题。

| Utility 类 | 作用 |
|------------|------|
| `.lysta-bezel` | 外凸金属面（渐变 + 多层 `box-shadow` + `::before` 顶高光） |
| `.lysta-bezel--inset` | 内凹屏槽（变动脉络外壳、危机图标座等） |
| `.lysta-rivets` / `.lysta-rivets-mini` | 外壳四角铆钉 / 卡片角 mini 铆钉（装饰用，`aria-hidden`） |
| `.lysta-readout` + `.lysta-readout-screen` | 复合镶嵌读数窗；屏幕层 `::before` 为低速扫描高光（`lysta-screen-scan`） |
| `.lysta-engrave` | 阴刻字（`text-shadow` 高光 + 底影） |

动画：`lysta-led-breathe`（铆钉/LED 呼吸）、`lysta-screen-scan`（读数窗扫描线）。二者与既有动效一样，受 **`prefers-reduced-motion: reduce`** 全局压短（`.lysta-root` 内统一规则），无需单独写媒体查询。

### 动效与可访问性

状态栏包含以下主要动效（均为 CSS 与少量内联脚本，无外部 JS 库）：

- **头部**：标题旁月相/水晶图标 hover 微旋转；顶栏 conic 渐变慢速扫光；底边 1px 高光分隔线。
- **分页**：胶囊 Tab 内滑动指示条；分页内容切换时带轻微模糊渐入（`lysta-pane-in`）。
- **世界卡片**：左侧竖条高光随 hover 伸长；日期图标 Y 轴翻转、生活费图标硬币式旋转；生活费数字滚动补间；透支（&lt; 0）时金额区进入危机态与抖动提示。
- **财务危机条**：三角警示图标 + 扇形光晕慢旋；文案一次性「打字机」展开；hover 轻微倾斜与阴影加深。
- **凌月双进度条**：填充条内径向水波、外发光；夜间主题下轨道内有微粒漂浮；数值滚动；依赖徽章 hover 显示阶段阈值说明；性欲 ≥80 时闪电图标抖动与徽章 glow。
- **关系列表卡片**：入场错峰淡入；hover 时 conic 极光叠层；头像按关系值档位（tier）分级描边 / 高档位脉冲；阶段说明前带几何小图标。
- **变动脉络**：细条内多枚胶囊节点错位呼吸动画；日历节点慢旋；高光扫过（与 `prefers-reduced-motion` 协调）。
- **主题按钮**：按下缩放、径向涟漪；日月图标切换时旋转弹跳。

若系统开启 **「减少动态效果」**（`prefers-reduced-motion: reduce`），样式表会将动画与过渡时长压至极短，脚本中的数字补间也会直接跳到终值，以降低眩晕与干扰。

## 多实例与 id 冲突

模板使用固定 id：`lysta-theme`、`lysta-t1`、`lysta-t2`。同屏多条消息各渲染一块状态栏时，HTML 中会出现重复 id，可能导致主题按钮只控制第一个实例。若你需要同屏多块，请自行复制模板并把上述 id 与对应 `for` 改成唯一前缀。

## 本地预览

用浏览器打开 [`preview.html`](./preview.html)。其中生活费为 `-120`（演示财务危机）、性欲值 `85`（演示阈值）、NPC 为四条 mock 数据（关系值分别落在 tier 0 / 2 / 3 / 4 等区间，便于看头像光环与阶段图标差异）；变动脉络由 `lysta-prev-stat-fallback` 与当前 mock 故意错开，便于本地看图标与差额数字动效。修改 [`status_bar.html`](./status_bar.html) 后若需预览与之一致，可将该文件从 `<div class="lysta-root">` 起的整块复制到 `preview.html` 中对应位置并改回 mock 宏占位。

## 参考

视觉风格参考项目内 [`样式库/案例/状态栏样式.html`](../../样式库/案例/状态栏样式.html)（暗色卡片、紫色强调、轻噪点底）。
