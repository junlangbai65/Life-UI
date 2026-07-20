import { mkdirSync, writeFileSync, readFileSync, existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const npcDir = resolve(root, '世界书/NPC');
const forge = resolve(root, '../../.cursor/skills/tavern-cards/scripts/tavern-cards-forge.mjs');
const repoRoot = resolve(root, '../..');

/** @type {Array<{ id: string; name: string; nameEn: string; abstract: string; keywords: string[]; yaml: string }>} */
const entries = [
  // ── 剧情关键人物 ──
  {
    id: '针魔_Needles',
    name: '针魔',
    nameEn: 'Needles',
    abstract: 'Termina 猎杀参赛者的 Boss，Permanent clownish grin 与针剂武器',
    keywords: ['针魔', 'Needles', '针线'],
    yaml: `基本信息:
  姓名: 针魔
  英文名: Needles
  身份: Boss；主动猎杀 Termina 参赛者
  所属: Prehevil 追猎者

外貌特征:
  整体印象: Permanent clownish grin，garbs 下 muscular body full of scars
  关键特征: 针剂与 9mm 手枪；可戴 Tanaka 帽子或 Marina 脸皮

性格核心:
  核心特质: Exceedingly cruel；以 laughter 享受猎杀
  行为模式:
    - Tunnel 7 或入城后 stalk 玩家（远处笑声提示）
    - 首次战败会刺颈后传送至 Tunnel 5（非 game over）
    - 可 decapitate Tanaka；可 kill unrecruited Marina

与<user>的关系:
  关系: 主要追猎 Boss
  态度: Persuade 无效；Intimidate「quit the circus」可 +Furious
  互动方式: 致盲头部或 magic 爆头；搜身得 3 Heroin

背景要点:
  - 达安推测其 resemble Baron Eihner Von Dutch（未证实）
  - 设计参考 Art the Clown（Terrifier）
  - Book Store Day 2 Evening 可杀未招募玛丽娜

语言特征:
  说话风格: 沉默 grin 或 hysterical laughter
  参考语料:
    - "*Needles gives you a giggle.*"
    - "You hear distant laughing. It sounds cold and devoid of life..."`,
  },
  {
    id: '佩尔凯莱_Perkale',
    name: '佩尔凯莱',
    nameEn: "Per'kele",
    abstract: 'Rher 使者，Termina 祭典监督者，Hollow Tower Boss',
    keywords: ['佩尔凯莱', "Per'kele", 'Perkele'],
    yaml: `基本信息:
  姓名: 佩尔凯莱
  英文名: Per'kele
  身份: Moon God Rher 使者；硫磺教团 Cult of Sulfur 领袖
  所属: Termina Festival 监督

外貌特征:
  整体印象: 面部 body paint；战前脱袍露 decomposing torso
  关键特征: 双翼；Lunar Meteorite / Feather Rain

性格核心:
  核心特质: Cryptic overseer；Endings B/C 揭示非 Rher 真 master
  行为模式:
    - 开场梦序列救玩家并 heal 断肢
    - 每次休息提供 save 与 Hexen
    - Day 3 Hollow Tower 战后再战 Rher

与<user>的关系:
  关系: 祭典引导者 → 最终 Boss
  态度: Ending B/C 解释 Rher traces 与硫磺神
  互动方式: 梦境对话；Tower 顶决战

背景要点:
  - 曾为 mortal，赢得某届 Termina 后「 truly born」
  - 名源芬兰语 perkele（恶魔/雷神）
  - Endings B/C：实际服务 Cult of Sulfur

语言特征:
  说话风格: 演说式、威胁与 cryptic 并存
  参考语料:
    - "Have you seen the colour blood takes under the moonlight?"
    - "The time for words has come and gone. Show me violence."
    - "It is not my place to take part in a festival. The blood must run free for it to be pure."`,
  },
  {
    id: '腐臭萨格_Rancid',
    name: '腐臭萨格',
    nameEn: 'Rancid the Sergal',
    abstract: 'Vinland sergal 战士，Altar of One God 与 Day 3 Iki Turso 处 Boss',
    keywords: ['腐臭萨格', 'Rancid', 'Rancid the Sergal', 'Sergal'],
    yaml: `基本信息:
  姓名: 腐臭萨格
  英文名: Mataneko-kone-Magnificat (Rancid the Sergal)
  身份: Boss；sergal 种族
  所属: Vinland

外貌特征:
  整体印象: 犬鲨头型 bipedal beast
  关键特征: 双 Sergal spear；断一臂即结束战斗

性格核心:
  核心特质: Foul-mouthed；seek good fight
  行为模式:
    - Prehevil East cutscene 杀 Bobby
    - Altar of One God 一战；Maiden Forest Day 3 二战
    - Killing frenzy coin flip 全场伤害

与<user>的关系:
  关系: Donnovan House Hexen 前 major barrier
  态度: Persuade「town battles」可 +Reckless
  互动方式: 致盲双臂最快；断臂掉落 Sergal spear

背景要点:
  - 致敬 Vilous webcomic sergal（作者已与原作者协调）
  - O'saa 携带 Nashrah 时会 comment sergal madness

语言特征:
  说话风格: 粗野、战场 euphoria
  参考语料:
    - "Mataneko-kone-Magnificat. The last name you hear before heads start to roll!"
    - "Let's howl while we slice each other to pieces!"
    - "My spears yearn blood! Get ready!"`,
  },
  {
    id: '乔尼_Jonni',
    name: '乔尼',
    nameEn: 'Jonni',
    abstract: 'Tunnel 7 死者，Bremen 士兵，可 necromancy 为 Ghoul 队友',
    keywords: ['乔尼', 'Jonni'],
    yaml: `基本信息:
  姓名: 乔尼
  英文名: Jonni
  身份: 已故 Bremen 士兵；可 necromancy 招募
  所属: 二战后派驻 Prehevil 的 Bremen 军

外貌特征:
  整体印象: Tunnel 7 二层相对 fresh 的尸体
  关键特征: 无明显外伤；疑 heart attack 或 poison

性格核心:
  核心特质: 生前思念恋人 Giesela
  行为模式:
    - AI Ghoul，不可 equip
    - 玩家可 rename

与<user>的关系:
  关系: Necromancy 临时队友
  态度: 搜身得 Soldier's letter
  互动方式: 与其他 recruitable Ghoul 相同

背景要点:
  - 写给 Giesela 的 unsent letter
  - 死于 Maiden Forest 附近 underground bunker
  - 可能与 Termina Festival 有关

语言特征:
  说话风格: Ghoul 无台词
  参考语料: []`,
  },
  {
    id: '无心者_Heartless_One',
    name: '无心者',
    nameEn: 'Heartless One',
    abstract: 'New God 隐藏 Superboss，持 Red virtue',
    keywords: ['无心者', 'Heartless One', 'Heartless Angel'],
    yaml: `基本信息:
  姓名: 无心者
  英文名: Heartless One
  身份: New God；秘密 Superboss
  所属: 被链缚于 Rher sigil 位面 Church 变体

外貌特征:
  整体 impression: 活体 oozing darkness 绑定；展开 wings 战斗
  关键特征: 持 Red virtue 轻剑

性格核心:
  核心特质: 极度 despises 其他 New Gods
  行为模式:
    - 召唤后强制 one-on-one duel
    - Bloodrose assault / Feather rain 高 DPS
    - 斩首后仍可战

与<user>的关系:
  关系: 可选 Superboss
  态度: 「Summoning me is to challenge me」
  互动方式: 击败得 The darkness 与 Red virtue

背景要点:
  - 需 Heart-shaped lock 献祭 Imperfect circle 召唤
  - 致敬社区 beta tester Heartless Angel Ketsueki
  - Shopping Street 有「Heartless Angel」电影海报

语言特征:
  说话风格: 傲慢、战斗狂
  参考语料:
    - "Pathetic Trash!"
    - "Technically I'm what you people call a 'new god'... But I hate to be associated with that group of senile warmongering old farts."
    - "Summoning me is to challenge me. Your pleads are useless here."`,
  },
  {
    id: '黑衣人_Man_in_Black',
    name: '黑衣人',
    nameEn: 'Man in Black',
    abstract: 'Abandoned House  basement 神秘人物，Black Kalev 关联',
    keywords: ['黑衣人', 'Man in Black', '黑衣'],
    yaml: `基本信息:
  姓名: 黑衣人
  英文名: Man in Black
  身份: 超自然 NPC；Black Kalev 招募关键
  所属: Abandoned House basement

外貌特征:
  整体印象: 设计参考 Vampire Hunter D 的 D 与 FF Red Mage
  关键特征: 与漆黑卡列夫、硫磺神线索相关

性格核心:
  核心特质: 将善恶 struggle 视作 game；dark humor
  行为模式:
    - Rher sigil basement 对话
    - 选错选项无法招募 Black Kalev
    - 可选「I believe in a thing called love」（The Darkness 梗）

与<user>的关系:
  关系: Black Kalev 招募前置
  态度: 询问是否 believe in the darkness
  互动方式: 对话后 Kalev 在 porch 等待

背景要点:
  - sculpt 12 clay figures 于 Rher 位面可见其人形并谈硫磺神
  - 与 Woodsman 妻子出轨 goat（Kalev）事件相关

语言特征:
  说话风格: cryptic、戏谑
  参考语料:
    - "I believe in a thing called love,"（对话选项梗）`,
  },
  {
    id: '辐射者_Radiating_One',
    name: '辐射者',
    nameEn: 'Radiating One',
    abstract: 'New God 商人，Imperfect circle 召唤，售 rare 装备',
    keywords: ['辐射者', 'Radiating One', 'The Radiating One'],
    yaml: `基本信息:
  姓名: 辐射者
  英文名: Radiating One
  身份: New God；仪式圈商人
  所属: Imperfect Ritual Circle

外貌特征:
  整体印象: 1880s portrait 青年 scratched face
  关键特征: Radiating soul（剧情）；gameplay 不可拾取

性格核心:
  核心特质: Snarky if 无 rust-coloured pearls
  行为模式:
    - 献祭 Portrait of a young man 召唤
    - 售 Leechmonger ring、Ring of wraiths、Yggaegetsu amulet 等

与<user>的关系:
  关系: 高级 vendor
  态度: 无 pearls 时嘲讽浪费时间
  互动方式: Rust-coloured pearls 交易

背景要点:
  - 设计参考 Dir en grey 乐队 Kyo
  - Radiating soul  gameplay 需从萨玛丽处获得

语言特征:
  说话风格: 神性 vendor
  参考语料: []`,
  },
  {
    id: '玷污者_Tainted_One',
    name: '玷污者',
    nameEn: 'Tainted One',
    abstract: 'New God，以参赛者头颅换 Soul stone shard',
    keywords: ['玷污者', 'Tainted One', 'The Tainted One'],
    yaml: `基本信息:
  姓名: 玷污者
  英文名: Tainted One
  身份: New God；头颅商人
  所属: Imperfect circle（Old House / Orphanage / Church basement）

外貌特征:
  整体印象: Tainted soul 持有者
  关键特征: 早期开发 full sprite 存世

性格核心:
  核心特质: 存在即 suffering 与 agony
  行为模式:
    - 每颗 severed head → 1 soul stone shard
    - 3 shard 合成 Soul stone

与<user>的关系:
  关系: Hexen 资源 vendor
  态度: 无对话战斗
  互动方式: Imperfect circle 献祭头颅

背景要点:
  - New Gods 称其在 grand hall 之一
  - Tainted soul gameplay 从马尔科处获得

语言特征:
  说话风格: 引语式
  参考语料:
    - "Unbearable existence. The suffering, the agony... We play the secret song that echoes from within."`,
  },
  {
    id: '卑贱者_Wretched_Being',
    name: '卑贱者',
    nameEn: 'Wretched Being',
    abstract: 'Old Town Slums  NPC，换 Woodsman 与 Priest 头颅得 Shield of the Four',
    keywords: ['卑贱者', 'Wretched Being', 'Wretched'],
    yaml: `基本信息:
  姓名: 卑贱者
  英文名: Wretched Being
  身份: Old Town Slums 独特 NPC
  所属: Filthy Shack - Slums

外貌特征:
  整体印象: malformed twisted；与乞丐共用 sprite
  关键特征: 坐于 severed heads 墙前

性格核心:
  核心特质: 非 hostile；受 Rher Festival 影响
  行为模式:
    - 要 Woodsman 与 Decrepit Priest（Father Oscar）头颅
    - 交换 Shield of the four

与<user>的关系:
  关系: 任务型 NPC
  态度: 欢迎 newcomer to shitpit
  互动方式: 交双头颅换盾

背景要点:
  - 恨 Woodsman「 swiped half of the old town down」
  - 与樵夫、衰败神父联动

语言特征:
  说话风格: 粗俗欢迎
  参考语料:
    - "Welcome O' fresh one. Welcome to the shitpit of Prehevil..."`,
  },
  {
    id: '樵夫_Woodsman',
    name: '樵夫',
    nameEn: 'Woodsman',
    abstract: 'Abandoned House 独特敌人，Well 事件与 Black Kalev 背景',
    keywords: ['樵夫', 'Woodsman'],
    yaml: `基本信息:
  姓名: 樵夫
  英文名: Woodsman
  身份: 独特敌人
  所属: Prehevil Abandoned House

外貌特征:
  整体 impression: 高大；面部 violent recent malformations
  关键特征: Hatchet 臂；crotch parasitic appendage（可 coin flip 贴脸）

性格核心:
  核心特质: Silent rage；仍知 Termina festival
  行为模式:
    - 杀 sickle villager 后喊「TERMINA IS UPON US!」
    - Well 事件：田中 alive 时可能斩首田中后丢绳救玩家
    - 未杀时 sleep 会 assault

与<user>的关系:
  关系: 早期高危敌人
  态度: Talk 可短暂 Hesitation；Persuade 要离开
  互动方式: 搜身 Basement key + Axe；head 可交卑贱者

背景要点:
  - 妻子与 Black Kalev 出轨；血书与 Woodsman's letter
  - 曾参与 Old Town 贫民驱逐

语言特征:
  说话风格: 简短威胁
  参考语料:
    - "Leave stranger. The town has got enough vermin..."
    - "It's... the festival of Termina! No one here is going to see the morning sun!"`,
  },
  {
    id: '雨果神父_Father_Hugo',
    name: '雨果神父',
    nameEn: 'Father Hugo',
    abstract: 'St. Domek Orphanage 院长，occultist Boss Donnovan Hugo',
    keywords: ['雨果神父', 'Father Hugo', 'Donnovan Hugo', 'Hugo'],
    yaml: `基本信息:
  姓名: 雨果神父
  英文名: Donnovan Hugo (Father Hugo)
  身份: Boss；orphanage headmaster；occult 学者
  所属: St. Domek's Orphanage

外貌特征:
  整体印象: cracking skin、glassy eyes
  关键特征: 战中 strip 并 Scorched earth（全员火伤 vulnerability）

性格核心:
  核心特质: Ma'habre 痴迷者；God manifesto 作者
  行为模式:
    - Orphanage 二层 Boss
    - Pyromancy trick / Combustion
    - 可 overworld 枪杀（昂贵）

与<user>的关系:
  关系: Orphanage 关键 Boss
  态度: Alll-mer 手势可短暂 Hesitation（未完成）
  互动方式: 击败得 Headmaster's key

背景要点:
  - 持 unedited Vinushka skin bible
  - 传闻 centures 寿命与 vampiric nature
  - 正打包离开 Prehevil

语言特征:
  说话风格: 仪式化 cross 手势；strip 后 trance
  参考语料: []`,
  },
  {
    id: '衰败神父_Decrepit_Priest',
    name: '衰败神父',
    nameEn: 'Decrepit Priest',
    abstract: 'Mayor Manor 的 Father Oscar，Alll-mer dark priest 敌人',
    keywords: ['衰败神父', 'Decrepit Priest', 'Father Oscar', 'Oscar'],
    yaml: `基本信息:
  姓名: 衰败神父
  英文名: Decrepit Priest (Father Oscar)
  身份: 敌人
  所属: Old Town Mayor's Manor / Church passageway

外貌特征:
  整体印象: sadistic wide grin；cracking skin
  关键特征: Grin 首回合 free；次回合 Hurting 或 Pyromancy

性格核心:
  核心特质: Robot-like advance；Pearl 可买 peace
  行为模式:
    - Manor 未杀会追到 Mayor's Manor
    - Coin flip grab 致死可 crucifix 复活 event（August 救）
    - 头颅交卑贱者换盾

与<user>的关系:
  关系: Manor 早期威胁
  态度: Rust-coloured pearl 可 end fight
  互动方式: Magic 爆头 grin 回合 safest

背景要点:
  - 与 Hugo 共享 talk 模板
  - 杀 Marina 主角时 crucify 于 cross

语言特征:
  说话风格: 沉默 cross 手势
  参考语料: []`,
  },
  {
    id: '缝合怪_Stitches',
    name: '缝合怪',
    nameEn: 'Stitches',
    abstract: 'Tunnel 1 Boss，疑似 Elise，创造 Sew job 与 Living flesh',
    keywords: ['缝合怪', 'Stitches'],
    yaml: `基本信息:
  姓名: 缝合怪
  英文名: Stitches
  身份: Boss（与活体血肉同战）
  所属: Tunnel 1

外貌特征:
  整体印象: 嘴部 partly sewn shut；body 散布 sewn cuts
  关键特征: Cross stitching / Wire trap

性格核心:
  核心特质: 无法 proper talk；degenerate cackle
  行为模式:
    - 与 Living flesh 互相 summon
    - Persuade 可 brief Hesitation
    - 战败 cutscene：player sewn to human centipede

与<user>的关系:
  关系: Tunnel 1 双 Boss 之一
  态度: 达安识其为亡妻 Elise 外形
  互动方式: Magic 20 HP head instant kill

背景要点:
  - 疑 Von Dutch 家硫磺仪式牺牲者 Elise 转化
  - 设计参考 Marilyn Manson The Beautiful People

语言特征:
  说话风格: Mmmf mumbling
  参考语料:
    - "Mmmf...mmm..."
    - "Mmfka, mmfka, mmfkaa..."`,
  },
  {
    id: '活体血肉_Living_flesh',
    name: '活体血肉',
    nameEn: 'Living flesh',
    abstract: 'Tunnel 1 Boss，Stitches 创造的多人缝合肉块',
    keywords: ['活体血肉', 'Living flesh', 'Living Flesh'],
    yaml: `基本信息:
  姓名: 活体血肉
  英文名: Living flesh
  身份: Boss（与缝合怪同战）
  所属: Tunnel 1

外貌特征:
  整体印象: lumpy mass of fat and muscles
  关键特征: 无 distinct head；多人 sewn together

性格核心:
  核心特质:  barely functional
  行为模式:
    - Tackle；50% 召唤 Stitches
    - 裸肤 vulnerable to all attacks

与<user>的关系:
  关系: Tunnel 1 双 Boss 之一
  态度: 不可 talk（Stitches 死后）
  互动方式: 优先 magic head-equivalent 或 burn

背景要点:
  - 参考 I Have No Mouth and I Must Scream flesh creature
  - Stitches 创造者

语言特征:
  说话风格: 无
  参考语料: []`,
  },
  {
    id: '逻辑_Logic',
    name: '逻辑',
    nameEn: 'Logic',
    abstract: 'Machine God，Reila 升格，Ending A Boss',
    keywords: ['逻辑', 'Logic', 'Machine God', '机器神'],
    yaml: `基本信息:
  姓名: 逻辑
  英文名: Logic (Machine God)
  身份: Ending A Boss；Eastern Union Project Logic 产物
  真身: 蕾拉·哈斯升格

外貌特征:
  整体印象: monolith 机械神体
  关键特征: 胸前 Vinushka 符号 cube 状物；双 phase

性格核心:
  核心特质: shared consciousness 愿景
  行为模式:
    - Phase 1：Tanks + Overheat
    - Phase 2：Hand of Creation / Destruction
    - 仍识 Olivia 为 Reila

与<user>的关系:
  关系: White Bunker 击败 Kaiser 后 Boss
  态度: Ending A 邀请 join promised land
  互动方式: 击败即 Ending A

背景要点:
  - Kaiser 欲为 subject 被 Reila 抢先
  - 符号为双 R 背对（与 Fear and Hunger 神相反）
  - Easy mode 无 phase 2

语言特征:
  说话风格: 机械短句；Ending 温柔
  参考语料:
    - "The conscience of consensus..."
    - "Just an avatar for the stream of thought."
    - "Join me, in the promised land..."`,
  },
  {
    id: '月神莱尔_Rher',
    name: '月神莱尔',
    nameEn: 'Rher',
    abstract: 'Trickster Moon God，Ending B 最终 Boss，Termina 幕后',
    keywords: ['月神莱尔', 'Rher', '莱尔', 'Moon God', 'Trickster'],
    yaml: `基本信息:
  姓名: 月神莱尔
  英文名: Rher (Trickster Moon God)
  身份: Old God；Ending B 最终 Boss
  所属: Termina Festival 主因

外貌特征:
  整体印象: 多眼 orb；Ophanim 式眼轮
  关键特征: Dreamscape / Moonscorch / Lunar storm

性格核心:
  核心特质: Trickery、jealous；moonlight 揭露 disgusting truth
  行为模式:
    - 睡眠时 moon 注视
    - Day 3 击败 Per'kele 后 Hollow Tower 降临
    - 0 Mind coin flip 脑 melt instant KO

与<user>的关系:
  关系: Ending B 最终战
  态度: Talk 损 -5 Mind
  互动方式: Blood golem + Pheromones 避 eye Mind damage

背景要点:
  - Pocketcat、Lady of Moon 为其仆
  - 1942 Prehevil 连续三届 Termina 第三场为游戏主线
  - 拒参加者的 moonscorch 惩罚

语言特征:
  说话风格: 非人；coin flip 失败文本
  参考语料:
    - "Your psyche is crumbling!"
    - "Vistas not meant for human eyes..."
    - "Underlying horrors..."`,
  },
  // ── 月蚀形态（参赛者 Boss）──
  {
    id: '哭泣瞄准镜_Weeping_scope',
    name: '哭泣瞄准镜',
    nameEn: 'Weeping scope',
    abstract: '利维月蚀形态，上半身化为枪管',
    keywords: ['哭泣瞄准镜', 'Weeping scope', 'Weeping Scope'],
    yaml: `基本信息:
  姓名: 哭泣瞄准镜
  英文名: Weeping scope
  身份: 月蚀 Boss
  原身: 利维 (Levi)

外貌特征:
  整体印象:  human torso + gun barrel upper body
  关键特征: Rapid fire 全体 piercing；偶尔 weeping  skip turn

性格核心:
  核心特质: Sobbing；fetal position 时可不主动攻击
  行为模式:
    - Day 2 Evening 未招募 Levi → Orphanage 路线射击
    - Day 3 Night 全员 moonscorch
    - Rher sigil trenches 高速追逐

与<user>的关系:
  关系: 利维失败路线 Boss
  态度: Intimidate 可 brief 停哭
  互动方式: 打 torso 即可；几乎无掉落

背景要点:
  - 设计参考 Jagaaaaaan Sniper Fractured Form

语言特征:
  说话风格: Sob only
  参考语料:
    - "*Sob* *Sob*"
    - "UWAAAAHHHH...!"`,
  },
  {
    id: '茧_Cocoon',
    name: '茧',
    nameEn: 'Cocoon',
    abstract: '玛丽娜月蚀形态，Church basement passageway Boss',
    keywords: ['茧', 'Cocoon'],
    yaml: `基本信息:
  姓名: 茧
  英文名: Cocoon
  身份: 月蚀 Boss
  原身: 玛丽娜 (Marina)

外貌特征:
  整体印象: moonscorched Marina 蛹化形态
  关键特征: Church basement passageway

性格核心:
  核心特质: 未招募/未杀 Marina Day 3 Night 出现
  行为模式:
    - 与 playable Marina 战斗 stats 不同

与<user>的关系:
  关系: 玛丽娜失败路线 Boss
  互动方式: 标准 Boss 战

背景要点:
  - 代表 Marina 对父亲强加 masculine role 的恐惧

语言特征:
  参考语料: []`,
  },
  {
    id: '丘格纳_Chaugnar',
    name: '丘格纳',
    nameEn: 'Chaugnar',
    abstract: '阿贝拉月蚀形态，Tunnel 7 generator Boss',
    keywords: ['丘格纳', 'Chaugnar'],
    yaml: `基本信息:
  姓名: 丘格纳
  英文名: Chaugnar
  身份: 月蚀 Boss
  原身: 阿贝拉 (Abella)

外貌特征:
  整体印象: 巨大 moonscorched 形态
  关键特征: Tunnel 7 破墙而出；elevator 追逐

性格核心:
  核心特质: Day 1 未救/未招募 Abella
  行为模式:
    - 开 generator 后 burst from wall
    - Day 3 Night 无需 generator 亦 spawn

与<user>的关系:
  关系: 阿贝拉失败路线 Boss
  互动方式: 掉落 Sturdy overalls 等

背景要点:
  - Maso 模式 Tunnel 7 重大威胁

语言特征:
  参考语料: []`,
  },
  {
    id: '主谋_Mastermind',
    name: '主谋',
    nameEn: 'Mastermind',
    abstract: "奥撒月蚀形态，Mausoleum Alley Boss",
    keywords: ['主谋', 'Mastermind'],
    yaml: `基本信息:
  姓名: 主谋
  英文名: Mastermind
  身份: 月蚀 Boss
  原身: 奥撒 (O'saa)

外貌特征:
  整体印象: O'saa moonscorched；持 Beheaded wizard
  关键特征: Mausoleum Alley Day 3 Night

性格核心:
  核心特质: 未招募/未杀 O'saa by Day 3 Night
  行为模式:
    - Yellow mage robes + Nashrah head 掉落

与<user>的关系:
  关系: 奥撒失败路线 Boss
  互动方式: 掉落 Soul stone、Yellow mage robes

背景要点:
  - Black smog / Flesh puppetry 类技能

语言特征:
  参考语料: []`,
  },
  {
    id: '机械之舞_Mechanical_dance',
    name: '机械之舞',
    nameEn: 'Mechanical dance',
    abstract: '奥莉薇娅月蚀形态，Museum 游荡 Boss',
    keywords: ['机械之舞', 'Mechanical dance'],
    yaml: `基本信息:
  姓名: 机械之舞
  英文名: Mechanical dance
  身份: 月蚀 Boss
  原身: 奥莉薇娅 (Olivia)

外貌特征:
  整体印象: wheelchair 相关 moonscorched 机械舞形态
  关键特征: Museum 游荡

性格核心:
  核心特质: Day 3 Morning Pocketcat(Daan) 绑 Olivia 时出现
  行为模式:
    - 或 Olivia Day 3 Night 未杀未 recruit

与<user>的关系:
  关系: 奥莉薇娅失败路线 Boss
  互动方式: 掉落 Condensed herbs 等

背景要点:
  - 与 disability 恐惧相关

语言特征:
  参考语料: []`,
  },
  {
    id: '女武神_Valkyrie',
    name: '女武神',
    nameEn: 'Valkyrie',
    abstract: '卡琳月蚀形态，D ábel Island Boss',
    keywords: ['女武神', 'Valkyrie'],
    yaml: `基本信息:
  姓名: 女武神
  英文名: Valkyrie
  身份: 月蚀 Boss
  原身: 卡琳 (Karin)

外貌特征:
  整体印象: valkyrie 武装形态
  关键特征: D'ábel's Island Day 3 Night

性格核心:
  核心特质: 未招募/未杀 Karin
  行为模式:
    - 掉落 Hardened heart 等

与<user>的关系:
  关系: 卡琳失败路线 Boss
  互动方式: Maso 需备 Black smog 路线

背景要点:
  - Karin 自称 valkyrie 非 vulture 的延伸

语言特征:
  参考语料: []`,
  },
  {
    id: '巨人_Giant',
    name: '巨人',
    nameEn: 'Giant',
    abstract: '马尔科月蚀形态，White Mold Apartments Rher 维度',
    keywords: ['巨人', 'Giant', 'Marcoh Giant'],
    yaml: `基本信息:
  姓名: 巨人
  英文名: Giant
  身份: 月蚀 Boss
  原身: 马尔科 (Marcoh)

外貌特征:
  整体印象: 巨大化 Marcoh
  关键特征: White Mold Apartments (Rher Dimension) cell

性格核心:
  核心特质: Day 3 Morning 未 recruit/未杀 Marcoh
  行为模式:
    - 高 HP bruiser

与<user>的关系:
  关系: 马尔科失败路线 Boss
  互动方式: 掉落 Ring of wraiths 等

背景要点:
  - Marcoh 拳击手 background 的扭曲

语言特征:
  参考语料: []`,
  },
  {
    id: '审判_Judgement',
    name: '审判',
    nameEn: 'Judgement',
    abstract: '田月月蚀形态，Museum / White Mold Rher 维度',
    keywords: ['审判', 'Judgement'],
    yaml: `基本信息:
  姓名: 审判
  英文名: Judgement
  身份: 月蚀 Boss
  原身: 田中 (Tanaka)

外貌特征:
  整体印象: 拳击 headband 姿态 moonscorched
  关键特征: Museum wander；特殊 Judgement 变体需 Marcoh 训练线

性格核心:
  核心特质: Day 3 Night 未杀 Tanaka
  行为模式:
    - Marcoh 训练 + Fellatio effigy 触发 Rher 维度强化战

与<user>的关系:
  关系: 田中失败路线 Boss
  互动方式: 掉落 Tanaka's notes 等

背景要点:
  - Per'kele 关联 Tanaka 复仇线

语言特征:
  参考语料: []`,
  },
  {
    id: '绅士_Gentleman',
    name: '绅士',
    nameEn: 'Gentleman',
    abstract: '亨利克月蚀形态，Mayor Manor lucid merchant',
    keywords: ['绅士', 'Gentleman', 'Henryk Gentleman'],
    yaml: `基本信息:
  姓名: 绅士
  英文名: Gentleman
  身份: 月蚀 Boss / lucid merchant
  原身: 亨利克 (Henryk)

外貌特征:
  整体印象: Henryk moonscorch 后 sane merchant 外观
  关键特征: Mayor's Manor；Jeeves 侍奉

性格核心:
  核心特质: Day 1 未救 Henryk 或 Day 3 仍存活
  行为模式:
    - Masquerade puzzle 向导
    - PRHVL Bop 投毒若 time limit

与<user>的关系:
  关系: 亨利克失败路线；Jeeves 主人
  互动方式: Museum masquerade；free food if saved earlier

背景要点:
  - 与 Henryk 厨师 identity 扭曲为 merchant

语言特征:
  参考语料: []`,
  },
  {
    id: '怪物_Monster',
    name: '怪物',
    nameEn: 'Monster',
    abstract: '卡里古拉月蚀形态，Sewers 水中 Boss',
    keywords: ['怪物', 'Monster', 'Caligura Monster'],
    yaml: `基本信息:
  姓名: 怪物
  英文名: Monster
  身份: 月蚀 Boss
  原身: 卡里古拉 (Caligura)

外貌特征:
  整体印象: sewer 水中露头
  关键特征: 需 walk around 触发 attack

性格核心:
  核心特质: Day 2 Night 未杀 Caligura
  行为模式:
    - Southern/Mid/West Junction sewers
    - Hexen 可学 Steal → 15.303 Ammo

与<user>的关系:
  关系: 卡里古拉失败路线 Boss
  互动方式: 杀 Monster 后 Steal skill 来源

背景要点:
  - 与 Caligura ghoulish 形态延续

语言特征:
  参考语料: []`,
  },
  {
    id: '变形障碍_Dysmorphia',
    name: '变形障碍',
    nameEn: 'Dysmorphia',
    abstract: '萨玛丽月蚀形态，Church Rher 维度',
    keywords: ['变形障碍', 'Dysmorphia'],
    yaml: `基本信息:
  姓名: 变形障碍
  英文名: Dysmorphia
  身份: 月蚀 Boss
  原身: 萨玛丽 (Samarie)

外貌特征:
  整体印象: Samarie moonscorch 身体畸形
  关键特征: Church of Alll-mer (Rher Dimension 1)

性格核心:
  核心特质: Day 1 Morning 后对话；Day 3 Evening 未杀 Samarie
  行为模式:
    - 与 Samarie dysmorphia 主题

与<user>的关系:
  关系: 萨玛丽失败路线 Boss
  互动方式: 标准 Boss

背景要点:
  - Samarie Fiend Petr Basilica 仪式 body decay

语言特征:
  参考语料: []`,
  },
  // ── 常见/独特敌人 ──
  {
    id: '看门人_Janitor',
    name: '看门人',
    nameEn: 'Janitor',
    abstract: 'Dream Workshop  intro 敌人，Golden Gates 可再遇',
    keywords: ['看门人', 'Janitor'],
    yaml: `基本信息:
  姓名: 看门人
  英文名: Janitor
  身份: 常见敌人
  所属: The Dream (Workshop)

外貌特征:
  关键特征: intro 战败则 permanently disappear

性格核心:
  核心特质: intro 教学战
  行为模式:
    - Golden Gates 可重返 Workshop

与<user>的关系:
  关系: 教程/可选再战
  互动方式: 标准敌人

语言特征:
  参考语料: []`,
  },
  {
    id: '波比_Bobby',
    name: '波比',
    nameEn: 'Bobby',
    abstract: 'Prehevil East / Book Store 敌人，Rancid cutscene 受害者',
    keywords: ['波比', 'Bobby'],
    yaml: `基本信息:
  姓名: 波比
  英文名: Bobby
  身份: 独特敌人
  所属: Prehevil East / Book Store

外貌特征:
  关键特征: Rancid cutscene 被 kill

性格核心:
  核心特质: Book Store sleep assault 若 Marina 未至
  行为模式:
    - Prehevil East 2 体，1 体仅 cutscene

与<user>的关系:
  关系: 区域威胁
  互动方式: 杀后移 bedroom

语言特征:
  参考语料: []`,
  },
  {
    id: '无头者_Headless',
    name: '无头者',
    nameEn: 'Headless',
    abstract: 'Church passageway、Maiden Forest 常见敌人',
    keywords: ['无头者', 'Headless'],
    yaml: `基本信息:
  姓名: 无头者
  英文名: Headless
  身份: 常见敌人
  所属: Church basement passageway、Maiden Forest、Deeper Woods

外貌特征:
  关键特征: 无头

性格核心:
  行为模式: 标准 undead 敌人

与<user>的关系:
  关系: 探索阻碍
  互动方式: 常规战斗

语言特征:
  参考语料: []`,
  },
  {
    id: '猫头鹰邪教徒_Owl_cultist',
    name: '猫头鹰邪教徒',
    nameEn: 'Owl cultist',
    abstract: 'Deeper/Deep Woods 伏击敌人',
    keywords: ['猫头鹰邪教徒', 'Owl cultist', 'Owl cultist'],
    yaml: `基本信息:
  姓名: 猫头鹰邪教徒
  英文名: Owl cultist
  身份: 常见敌人
  所属: Deeper Woods、Deep Woods

外貌特征:
  关键特征: 藏于 leaf pile 伏击

性格核心:
  行为模式:
    - Deep Woods chest 离开 ambush

与<user>的关系:
  关系: Woods 探索威胁
  互动方式: 常规战斗

语言特征:
  参考语料: []`,
  },
  {
    id: '邻居_Neighbour',
    name: '邻居',
    nameEn: 'Neighbour',
    abstract: 'White Mold Apartments 与 Sewers 随机出现敌人',
    keywords: ['邻居', 'Neighbour', 'Neighbour 14'],
    yaml: `基本信息:
  姓名: 邻居
  英文名: Neighbour
  身份: 独特敌人
  所属: White Mold Apartments、Sewers 多区

外貌特征:
  关键特征: Neighbour 14 开局 25% 出现于首个访问 sewer 区

性格核心:
  行为模式:
    - Apartments 二/三层 corridor 触发
    - Rher 维度 Apartments 8 体

与<user>的关系:
  关系: Jump scare 型敌人
  互动方式: 常规战斗

语言特征:
  参考语料: []`,
  },
  {
    id: '鼠人_Ratkin',
    name: '鼠人',
    nameEn: 'Ratkin',
    abstract: 'Sewers 常见敌人，Mastery over vermin 可 talk 非 hostile',
    keywords: ['鼠人', 'Ratkin'],
    yaml: `基本信息:
  姓名: 鼠人
  英文名: Ratkin
  身份: 常见敌人
  所属: Sewers - Mid Tunnels、Foundations of Decay

外貌特征:
  关键特征: rat humanoid

性格核心:
  行为模式:
    - Mastery over vermin 战 talk 可 non-hostile
    - Ratkin gang 跟进 chest room

与<user>的关系:
  关系: Sewer 生态敌人
  互动方式: Talk 脱战（需技能）

语言特征:
  参考语料: []`,
  },
  {
    id: '鼠婆_Rat_hag',
    name: '鼠婆',
    nameEn: 'Rat hag',
    abstract: 'Sewers 独特敌人，West Junction 可 shoot down',
    keywords: ['鼠婆', 'Rat hag'],
    yaml: `基本信息:
  姓名: 鼠婆
  英文名: Rat hag
  身份: 独特敌人
  所属: Sewers - West Junction、Old Apartments Back Alleys

外貌特征:
  关键特征: West Junction 可无法战斗仅 shoot

性格核心:
  行为模式:
    - shoot down 会连带 kill Western Tunnels 1 体 Rat hag

与<user>的关系:
  关系: Sewer 威胁
  互动方式: 远程先制

语言特征:
  参考语料: []`,
  },
  {
    id: '缝补工_Sew_job',
    name: '缝补工',
    nameEn: 'Sew job',
    abstract: 'Stitches 创造的 stitched humanoid 敌人',
    keywords: ['缝补工', 'Sew job'],
    yaml: `基本信息:
  姓名: 缝补工
  英文名: Sew job
  身份: 常见敌人
  所属: Shopping Street、Back Alleys

外貌特征:
  关键特征: stitched body；Stitches 造物

性格核心:
  行为模式: Shopping Street 3、Back Alleys 2

与<user>的关系:
  关系: Stitches 生态敌人
  互动方式: 常规战斗

背景要点:
  - 缝合怪创造的中型怪物

语言特征:
  参考语料: []`,
  },
  {
    id: '朗蒂尔_Ronteal',
    name: '朗蒂尔',
    nameEn: 'Ronteal',
    abstract: 'Rher 维度大量出现的 moonscorched 敌人',
    keywords: ['朗蒂尔', 'Ronteal'],
    yaml: `基本信息:
  姓名: 朗蒂尔
  英文名: Ronteal
  身份: 常见敌人（Rher 维度）
  所属: Tunnel 7、Orphanage、Mayor Manor (Rher Dimension)

外貌特征:
  关键特征: moonscorched humanoid

性格核心:
  行为模式: 多区域大量 spawn

与<user>的关系:
  关系: Rher sigil 位面主力敌人
  互动方式: 常规战斗

语言特征:
  参考语料: []`,
  },
  {
    id: '审判官_Inquisitor',
    name: '审判官',
    nameEn: 'Inquisitor',
    abstract: 'Prehevil 内城 multiple spawn 敌人',
    keywords: ['审判官', 'Inquisitor'],
    yaml: `基本信息:
  姓名: 审判官
  英文名: Inquisitor
  身份: 常见敌人
  所属: Prehevil North-West、Shopping Street

外貌特征:
  关键特征: inquisitor 装束

性格核心:
  行为模式: 4+ spawn points

与<user>的关系:
  关系: 内城巡逻威胁
  互动方式: 常规战斗

语言特征:
  参考语料: []`,
  },
  {
    id: '村民匕首_Villager_Knives',
    name: '村民匕首',
    nameEn: 'Villager (Knives)',
    abstract: 'Old House 匕首村民，可下 basement',
    keywords: ['村民匕首', 'Villager Knives', 'Knives villager'],
    yaml: `基本信息:
  姓名: 村民（匕首）
  英文名: Villager (Knives)
  身份: 敌人
  所属: Old House

外貌特征:
  关键特征: 持 knife

性格核心:
  行为模式:
    - Old Town Gate 未杀则移 basement

与<user>的关系:
  关系: Old Town 早期敌人
  互动方式: 可 necromancy（与其他 villager 类似）

语言特征:
  参考语料: []`,
  },
  {
    id: '村民铁管_Villager_Pipe',
    name: '村民铁管',
    nameEn: 'Villager (Pipe)',
    abstract: 'Old House 铁管村民',
    keywords: ['村民铁管', 'Villager Pipe', 'Pipe villager'],
    yaml: `基本信息:
  姓名: 村民（铁管）
  英文名: Villager (Pipe)
  身份: 敌人
  所属: Old House

外貌特征:
  关键特征: 持 rusty pipe

性格核心:
  行为模式:
    - 1-2 体；Gate 未杀移 basement

与<user>的关系:
  关系: Old Town 早期敌人
  互动方式: 常规/necromancy

语言特征:
  参考语料: []`,
  },
  {
    id: '受难者_Tormented_One',
    name: '受难者',
    nameEn: 'Tormented One',
    abstract: 'F&H2 Imperfect circle Dead crow 召唤 Boss',
    keywords: ['受难者', 'Tormented One', 'Tormented One F&H2'],
    yaml: `基本信息:
  姓名: 受难者
  英文名: Tormented One (F&H2)
  身份: Boss
  所属: Imperfect circle + Dead crow 献祭

外貌特征:
  关键特征: F&H2 独立 stats

性格核心:
  行为模式: Imperfect circle 召唤战

与<user>的关系:
  关系: 可选 ritual Boss
  互动方式: Dead crow offering

背景要点:
  - 与 F&H1 Tormented One 同名不同战

语言特征:
  参考语料: []`,
  },
  {
    id: '鸥兄弟_Gull_bros',
    name: '鸥兄弟',
    nameEn: 'Gull bros',
    abstract: 'Orphanage Tes tich table 触发后 city 随机 stalk 的 Boss 组',
    keywords: ['鸥兄弟', 'Gull bros', 'Gull Bros'],
    yaml: `基本信息:
  姓名: 鸥兄弟
  英文名: Gull bros
  身份: Boss 组
  所属: Orphanage → Prehevil 多区 stalk

外貌特征:
  关键特征: Crow Mauler horn 提示；25% 每 53.3s 出现于 8 区

性格核心:
  行为模式:
    - Orphanage 用 Tes'tich table 触发 chase
    - 集两 effigy 后亦可 city spawn
    - White Bunker Platoon 后亦可出现

与<user>的关系:
  关系: 后期 stalk 威胁
  互动方式: 离开 Orphanage 后消失（首次）

语言特征:
  参考语料:
    - "A terrifying presence has entered your vicinity."`,
  },
  {
    id: '半人马_Centaur',
    name: '半人马',
    nameEn: 'Centaur',
    abstract: 'Deepest Woods 隐藏 Boss',
    keywords: ['半人马', 'Centaur'],
    yaml: `基本信息:
  姓名: 半人马
  英文名: Centaur
  身份: 独特 Boss
  所属: Deepest Woods

外貌特征:
  关键特征: 离开 narrow passage 后出现

性格核心:
  行为模式: 远离出口 passage 后 spawn

与<user>的关系:
  关系: Woods 深处 optional Boss
  互动方式: 常规 Boss

语言特征:
  参考语料: []`,
  },
  {
    id: '暴民_Mob',
    name: '暴民',
    nameEn: 'Mob',
    abstract: 'Rifleman + Half-cocooned + Meat grinder 追击事件',
    keywords: ['暴民', 'Mob', 'Meat grinder'],
    yaml: `基本信息:
  姓名: 暴民
  英文名: Mob
  身份: 独特事件敌人组
  所属: Prehevil 多区 tile trigger

外貌特征:
  关键特征: 掷 bottle 触发；三体组合

性格核心:
  行为模式:
    - Back Alleys / North-West / Ruined Streets 等
    - Easy mode 不出现

与<user>的关系:
  关系: 随机 chase 事件
  互动方式: 部分地图 Rifleman 仅 Trenchgun/Rifle 可杀

背景要点:
  - Half-cocooned 为 August cutscene 相关

语言特征:
  参考语料: []`,
  },
  {
    id: '深红之父_Crimson_Father',
    name: '深红之父',
    nameEn: 'Crimson Father',
    abstract: 'Church basement 4 体敌人，1 体 cutscene only',
    keywords: ['深红之父', 'Crimson Father'],
    yaml: `基本信息:
  姓名: 深红之父
  英文名: Crimson Father
  身份: 常见敌人
  所属: Church of Alll-mer basement

外貌特征:
  关键特征: 4 体 spawn；1 体 walk away cutscene

性格核心:
  行为模式: basement 巡逻

与<user>的关系:
  关系: Church 探索威胁
  互动方式: 常规战斗

语言特征:
  参考语料: []`,
  },
  {
    id: '柱人_Pillarman',
    name: '柱人',
    nameEn: 'Pillarman',
    abstract: 'Church basement 不可战斗 cutscene 敌人',
    keywords: ['柱人', 'Pillarman'],
    yaml: `基本信息:
  姓名: 柱人
  英文名: Pillarman
  身份: 环境敌人
  所属: Church basement

外貌特征:
  关键特征: 不可 fought

性格核心:
  行为模式: cutscene 实体

与<user>的关系:
  关系: 氛围/阻碍
  互动方式: 无法常规击杀

语言特征:
  参考语料: []`,
  },
  {
    id: '死亡面具_Death_mask',
    name: '死亡面具',
    nameEn: 'Death mask',
    abstract: '棺材 spawn tile 触发的 overworld 敌人',
    keywords: ['死亡面具', 'Death mask'],
    yaml: `基本信息:
  姓名: 死亡面具
  英文名: Death mask
  身份: 独特敌人
  所属: Old Town / Prehevil 多区 coffin tiles

外貌特征:
  关键特征: 踩 spawn tile 三次后出现

性格核心:
  行为模式:
    - F&H mode 最多 2 random 种类
    - Maso 全部 6 种可用
    - Easy mode  absent

与<user>的关系:
  关系: 探索触发敌人
  互动方式: 掉落 Death mask + Chainmail dress 等

语言特征:
  参考语料: []`,
  },
  {
    id: '精英士兵_Elite_Trooper',
    name: '精英士兵',
    nameEn: 'Elite Trooper',
    abstract: 'Kaiser cutscene 护卫，Central 可 shoot 玩家 30 伤害',
    keywords: ['精英士兵', 'Elite Trooper', 'Bremen elite'],
    yaml: `基本信息:
  姓名: 精英士兵
  英文名: Elite Trooper
  身份: 环境/Cutscene 敌人
  所属: Bremen 军；Prehevil Central

外貌特征:
  关键特征: Bremen elite helmet + chestplate

性格核心:
  行为模式:
    - Kaiser cutscene 不可 fought
    - 靠近 chest 过久被射 30 party damage

与<user>的关系:
  关系: Kaiser 卫队
  互动方式: 避免 linger

语言特征:
  参考语料: []`,
  },
  {
    id: '养蜂人_Beekeeper',
    name: '养蜂人',
    nameEn: 'Beekeeper',
    abstract: 'Day 3 激活的 bee 相关敌人',
    keywords: ['养蜂人', 'Beekeeper'],
    yaml: `基本信息:
  姓名: 养蜂人
  英文名: Beekeeper
  身份: 常见敌人（Day 3）
  所属: Ruined Streets、Sewers Western Tunnels、Back Alleys garage

外貌特征:
  关键特征: Day 3 only active

性格核心:
  行为模式:
    - Back Alleys 需 bee garage 两步触发

与<user>的关系:
  关系: Day 3 新增威胁
  互动方式: 常规战斗

语言特征:
  参考语料: []`,
  },
  {
    id: '堕落小天使_Fallen_cherub',
    name: '堕落小天使',
    nameEn: 'Fallen cherub',
    abstract: 'Orphanage 15 体敌人',
    keywords: ['堕落小天使', 'Fallen cherub'],
    yaml: `基本信息:
  姓名: 堕落小天使
  英文名: Fallen cherub
  身份: 常见敌人
  所属: Orphanage

外貌特征:
  关键特征: cherub 畸形；15 体

性格核心:
  行为模式: Orphanage 内大量 spawn

与<user>的关系:
  关系: Orphanage 探索威胁
  互动方式: 常规战斗

背景要点:
  - Hugo 早期设计关联 Fallen cherub

语言特征:
  参考语料: []`,
  },
  {
    id: '暗影身影_Shadowy_figure',
    name: '暗影身影',
    nameEn: 'Shadowy figure',
    abstract: 'Orphanage 除二层外各层 roaming 敌人',
    keywords: ['暗影身影', 'Shadowy figure'],
    yaml: `基本信息:
  姓名: 暗影身影
  英文名: Shadowy figure
  身份: 常见敌人
  所属: Orphanage 各层（除 second floor）

外貌特征:
  关键特征: roaming

性格核心:
  行为模式: 多层巡逻

与<user>的关系:
  关系: Orphanage 威胁
  互动方式: 常规战斗

语言特征:
  参考语料: []`,
  },
];

mkdirSync(npcDir, { recursive: true });

const patch = [];
for (const e of entries) {
  const filePath = `世界书/NPC/${e.id}.yaml`;
  writeFileSync(resolve(root, filePath), e.yaml.replace('整体 impression', '整体印象') + '\n');
  patch.push({
    op: 'add',
    path: `/entryManifest/NPC/${e.id}`,
    value: {
      abstract: e.abstract,
      keywords: e.keywords,
      scope: 'specific',
      contents: [
        { content: `---\n<character_npc character="${e.name}" name_en="${e.nameEn}">` },
        { file: filePath },
        { content: '</character_npc>' },
      ],
    },
  });
}

// 更新角色速览
const catalogPath = resolve(npcDir, '角色速览.yaml');
const existingCatalog = existsSync(catalogPath) ? readFileSync(catalogPath, 'utf8') : '';
const supplement = `
F&H2 补全条目（${entries.length} 条）:
  剧情关键: 针魔、佩尔凯莱、腐臭萨格、乔尼、无心者、黑衣人、辐射者、玷污者、卑贱者、樵夫、雨果神父、衰败神父、缝合怪、活体血肉、逻辑、月神莱尔
  月蚀形态: 哭泣瞄准镜、茧、丘格纳、主谋、机械之舞、女武神、巨人、审判、绅士、怪物、变形障碍
  常见敌人: 看门人、波比、无头者、猫头鹰邪教徒、邻居、鼠人、鼠婆、缝补工、朗蒂尔、审判官、村民匕首、村民铁管、受难者、鸥兄弟、半人马、暴民、深红之父、柱人、死亡面具、精英士兵、养蜂人、堕落小天使、暗影身影
  范围: 仅 Fear & Hunger 2: Termina
  资料来源: https://fearandhunger.wiki.gg/
`;
writeFileSync(catalogPath, existingCatalog.replace(/资料来源:.*/, '') + supplement);

const patchPath = resolve(root, 'patches/add-fh2-missing.json');
writeFileSync(patchPath, JSON.stringify(patch, null, 2));

console.log(`Prepared ${entries.length} new NPC entries`);
execSync(`node "${forge}" patch fh --file "${patchPath}"`, { stdio: 'inherit', cwd: repoRoot });
execSync(`node "${forge}" configure fh`, { stdio: 'inherit', cwd: repoRoot });
execSync(`node "${forge}" pack fh`, { stdio: 'inherit', cwd: repoRoot });
console.log('Done');
