import { mkdirSync, writeFileSync, readFileSync, existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const npcDir = resolve(root, '世界书/NPC');
const worldviewDir = resolve(root, '世界书/世界观');
const forge = resolve(root, '../../.cursor/skills/tavern-cards/scripts/tavern-cards-forge.mjs');
const repoRoot = resolve(root, '../..');

/** @type {Array<{ id: string; name: string; nameEn: string; abstract: string; keywords: string[]; yaml: string; kind?: 'npc' | 'worldview' }>} */
const entries = [
  {
    id: '魄_Poe',
    name: '魄',
    nameEn: 'Poe',
    abstract: '科菲尔灯触发后现身的 genie 敌人，Grasp of a genie coin flip',
    keywords: ['魄', 'Poe', 'genie'],
    yaml: `基本信息:
  姓名: 魄
  英文名: Poe
  身份: 独特敌人
  所属: Prehevil 多区（灯激活后）

外貌特征:
  整体印象: 自虚无中显现的人形 genie
  关键特征: 区域收音机闪烁异响预警

性格核心:
  行为模式:
    - Easy/F&H 模式需先互动 Dr. Kefer 地下室灯才激活；Maso 模式默认激活
    - 离开地图后该处 Poe 永久消失
    - 首只使用 Grasp 后，其余 Poe 首回合也会用

与<user>的关系:
  关系: 随机伏击
  互动方式: 离开屏幕再返回可驱离；仅 Otherworldly 有效伤害

背景要点:
  - 名源中文「魄」——尸身旁徘徊的精魂
  - 战胜后无尸体可搜

语言特征:
  说话风格: 呻吟、耸肩
  参考语料:
    - "The poe shrugs. It looks like it means harm regardless of your intentions."`,
  },
  {
    id: '铃端_Bellend',
    name: '铃端',
    nameEn: 'Bellend',
    abstract: '屋顶跃下追击的 exoskeleton 敌人，Harden 大幅减伤',
    keywords: ['铃端', 'Bellend'],
    yaml: `基本信息:
  姓名: 铃端
  英文名: Bellend
  身份: 常见/独特敌人
  所属: Mausoleum Alley、Church 通道、Temple Site 等

外貌特征:
  关键特征: 持 iron spear；硬化皮革般 exoskeleton；头部形似 phallic

性格核心:
  行为模式:
    - Maso 模式多区屋顶跳下追击，落地可造成 Can't do shit 3
    - 首回合 Harden：+20 Defense、非 Otherworldly 减伤 70%
    - Persuade 道歉可 +Hesitation

与<user>的关系:
  关系: 屋顶伏击者
  互动方式: 首回合集火；穿刺/Otherworldly 穿透壳

背景要点:
  - 设计名 Bellend（英式俚语）
  - Temple Site Tower 1 体不可 overworld 眩晕

语言特征:
  参考语料: []`,
  },
  {
    id: '卑劣者_Vile',
    name: '卑劣者',
    nameEn: 'Vile',
    abstract: 'Old Town 戴猪面具 gas mask 的 moonscorched 村民，Talk 可秒杀',
    keywords: ['卑劣者', 'Vile', '猪面具'],
    yaml: `基本信息:
  姓名: 卑劣者
  英文名: Vile
  身份: 独特敌人
  所属: Old Town - Gate

外貌特征:
  关键特征: 猪形 gas mask 与脸融合；pesticide 罐持续泄漏；蹄足、尖牙

性格核心:
  行为模式:
    - 默认非 hostile，靠近或经 Mayor's Manor 出入则追击
    - Talk 连选三次「What was that?」→ coin flip 成功则吸入农药自尽

与<user>的关系:
  关系: Old Town 威胁
  互动方式: Talk 秒杀或打腿+头；早期建议回避

背景要点:
  - 或曾为 fishmonger/exterminator
  - 失败 coin flip：「ONLY - THE VILE - SURVIVE! RHER - T-TAKE ME!」暗示曾为参赛者

语言特征:
  说话风格: 面具 muffled *breathe*
  参考语料:
    - "ONLY - THE VILE--"`,
  },
  {
    id: '步枪手_Rifleman',
    name: '步枪手',
    nameEn: 'Rifleman',
    abstract: 'moonscorched 持步枪村民，Mob 成员之一',
    keywords: ['步枪手', 'Rifleman'],
    yaml: `基本信息:
  姓名: 步枪手
  英文名: Rifleman
  身份: 常见敌人
  所属: Riverside、Central、Ruined Streets、Derelict House、Mob

外貌特征:
  关键特征: 面部 severe burns 致盲；.303 步枪

性格核心:
  行为模式:
    - Central 卡车上可互动开战
    - Riverside 仅 Execute 或 12.5% Rifle 可 overworld 击杀
    - Mob 部分地图仅 Trenchgun/Rifle 可射杀

与<user>的关系:
  关系: 远程 moonscorched
  互动方式: 直攻 torso；Talk 可 +Hesitation

背景要点:
  - 设计受 Francis Bacon 绘画影响

语言特征:
  参考语料:
    - "I'm sorry... but... everyone must die."
    - "The great trickster... He demands this..."`,
  },
  {
    id: '半茧人_Half-cocooned',
    name: '半茧人',
    nameEn: 'Half-cocooned',
    abstract: '半 cocoon 化 moonscorched，持 meat mallet，Mob 成员',
    keywords: ['半茧人', 'Half-cocooned', '半茧'],
    yaml: `基本信息:
  姓名: 半茧人
  英文名: Half-cocooned
  身份: 常见敌人
  所属: News Agency、North-West（August cutscene）、Mob

外貌特征:
  关键特征: 壳状 crust 半 metamorphosis；meat mallet 臂

性格核心:
  行为模式:
    - 冲锋 6.67 秒加速，接战首回合 coin flip Meat tenderizer
    - 打掉 lower mallet 下回合 head  vulnerable
    - Half-cocooned 7 开局随机 spawn 点（含 Mob）

与<user>的关系:
  关系: 追击型威胁
  互动方式: 先破 mallet 再斩头；避免冲锋接战

背景要点:
  - August cutscene 专用体不可战
  - Deeper Woods 路线 Maso 早期可双攻击杀

语言特征:
  参考语料:
    - "You're... dead."`,
  },
  {
    id: '绞肉机手_Meat_grinder',
    name: '绞肉机手',
    nameEn: 'Meat grinder',
    abstract: 'Mob 第三成员，持 bench grinder 与 saw blade',
    keywords: ['绞肉机手', 'Meat grinder', 'Mob'],
    yaml: `基本信息:
  姓名: 绞肉机手
  英文名: Meat grinder
  身份: Mob 事件敌人（非可制作武器同名条目）
  所属: Prehevil 多区 Mob 追击

外貌特征:
  关键特征: 与 Rifleman、Half-cocooned 组队出现

性格核心:
  行为模式:
    - 掷瓶 trigger 后与其他 Mob 成员 chase
    - 部分地图不可枪击或 Trenchgun 无法眩晕

与<user>的关系:
  关系: Mob 组合威胁
  互动方式: 见暴民条目；掉落 Bench grinder、Saw blade

背景要点:
  - Easy 模式无 Mob 事件

语言特征:
  参考语料: []`,
  },
  {
    id: '非理性方尖碑_Irrational_Obelisk',
    name: '非理性方尖碑',
    nameEn: 'Irrational Obelisk',
    abstract: 'Clothing Store 999999 HP 方尖碑，Shivers 精神攻击',
    keywords: ['非理性方尖碑', 'Irrational Obelisk', '方尖碑'],
    yaml: `基本信息:
  姓名: 非理性方尖碑
  英文名: Irrational Obelisk
  身份: 独特敌人
  所属: Prehevil - Shopping Street Clothing Store

外貌特征:
  关键特征: 高耸 obelisk，灵感来自赫尔辛基艺术装置

性格核心:
  行为模式:
    - 999999 HP，击败后 overworld 仍存在
    - Shivers 1/2 各 19-21 Mind damage，可叠多种 phobia

与<user>的关系:
  关系: 可选遭遇
  互动方式: 无实战收益；Leechmonger/Ring of wraiths 可刷 body 但易 panophobia

背景要点:
  - 推测为玩家 party 攻击衣堆的妄想具现

语言特征:
  参考语料: []`,
  },
  {
    id: '粪便猎犬_Fecal_hound',
    name: '粪便猎犬',
    nameEn: 'Fecal hound',
    abstract: 'Deep Woods 恶臭 infected hound，开战即 Nausea',
    keywords: ['粪便猎犬', 'Fecal hound'],
    yaml: `基本信息:
  姓名: 粪便猎犬
  英文名: Fecal hound
  身份: 常见敌人
  所属: Deep Woods

外貌特征:
  关键特征: 脱毛、 burns/boils 皮肤；极强 stench

性格核心:
  行为模式:
    - 接战立刻 Nausea 2，次回合 Nausea 1
    - overworld 一枪可秒；August cutscene 1 体不可战

与<user>的关系:
  关系: Deep Woods 威胁
  互动方式: 优先枪杀；Infected bite 可致 limb infection

语言特征:
  参考语料: []`,
  },
  {
    id: '火焰兵_Flame_Trooper',
    name: '火焰兵',
    nameEn: 'Flame Trooper',
    abstract: 'White Bunker Bremen 喷火兵，overworld flamethrower 即死',
    keywords: ['火焰兵', 'Flame Trooper'],
    yaml: `基本信息:
  姓名: 火焰兵
  英文名: Flame Trooper
  身份: 常见敌人
  所属: White Bunker 一、二层

外貌特征:
  关键特征: Thraex 式头盔；manica 护肩；flamethrower

性格核心:
  行为模式:
    - 静止时每 1.67 秒随机转向；发现玩家 overworld 喷火即 incinerate
    - 近身或枪击后开始移动并停 overworld 喷火
    - 战内次回合起 Flamethrower 全场 40-60 Fire

与<user>的关系:
  关系: Bunker 守卫
  互动方式: 远距离 Rifle 断臂；断臂后仅 Tackle

背景要点:
  - 体格 uncanny valley，疑 Bremen 实验产物

语言特征:
  参考语料: []`,
  },
  {
    id: '排级炮_Platoon',
    name: '排级炮',
    nameEn: 'Platoon',
    abstract: 'White Bunker Boss 之一，Sylvian Marriage of Flesh 式 amalgam 炮兽',
    keywords: ['排级炮', 'Platoon', 'Spank tank'],
    yaml: `基本信息:
  姓名: 排级炮
  英文名: Platoon
  身份: Boss（与西尔维安女官搭档）
  所属: White Bunker 三层

外貌特征:
  关键特征: 多人体 amalgam 人头炮管，四足爬行

性格核心:
  行为模式:
    - 女官存活时每两回合 Order Charge coin flip
    - 女官死后 Heavy mortar 160-240 typeless 或 Platoon charge
    - HP 10000；免疫多数 debuff

与<user>的关系:
  关系: Bunker Boss
  互动方式: 先秒 Sylvian Trooper；Black Orb/Hurting/Pheromones

背景要点:
  - Discord 怪物设计赛作品 vladstori；原设名 Spank tank

语言特征:
  参考语料:
    - "Grroumph... groumph..."`,
  },
  {
    id: '西尔维安女官_Sylvian_Trooper',
    name: '西尔维安女官',
    nameEn: 'Sylvian Trooper',
    abstract: 'White Bunker Boss，latex 女军官骑排级炮',
    keywords: ['西尔维安女官', 'Sylvian Trooper'],
    yaml: `基本信息:
  姓名: 西尔维安女官
  英文名: Sylvian Trooper
  身份: Boss（与排级炮搭档）
  所属: White Bunker 三层；Bremen 军

外貌特征:
  关键特征: latex suit、兔耳饰；持 whip

性格核心:
  核心特质: 知 Kaiser 计划、求「最后一舞」
  行为模式:
    - 每两回合令 Platoon coin flip
    - Whip 32-48 Slashing + Bleed
    - 抢先接触可首回合击杀跳过 Platoon 入场

与<user>的关系:
  关系: Bunker Boss
  互动方式: Hurting/Black Orb 秒 torso；断 whip 臂停 coin flip

背景要点:
  - 疑 Sylvian Marriage of Flesh 产物
  - 「From the blood soaked soil a new sprout rises」

语言特征:
  参考语料:
    - "Hm. Aren't you impatient."
    - "Let's make it count, shall we~?"`,
  },
  {
    id: '排级炮Maso_Platoon_Maso',
    name: '排级炮Maso',
    nameEn: 'Platoon (Masoχ-S/M)',
    abstract: 'Maso 独占 Ruined Streets 超强 Platoon，每回合 coin flip',
    keywords: ['排级炮Maso', 'Platoon Maso', 'Maso Platoon'],
    yaml: `基本信息:
  姓名: 排级炮（Maso）
  英文名: Platoon (Masoχ-S/M)
  身份: Maso 模式 Boss
  所属: Prehevil - Ruined Streets（Tunnel 1 望远镜开启后）

外貌特征:
  关键特征: 同排级炮；Torso 7000-10000 HP

性格核心:
  行为模式:
    - 每回合 coin flip Heavy mortar，另有两臂 slam
    - 无 Sylvian Trooper 搭档

与<user>的关系:
  关系: Maso superboss
  互动方式: 延迟开 Tunnel 1 望远镜；Hardened heart + One-winged；Black Orb 叠伤

背景要点:
  - F&H 模式不可战

语言特征:
  参考语料:
    - "Grroumph... groumph..."`,
  },
  {
    id: '利维仿身_Levi_Doppelganger',
    name: '利维仿身',
    nameEn: 'Levi (Doppelgänger)',
    abstract: 'Sewers Western Tunnels 模仿利维的 doppelgänger',
    keywords: ['利维仿身', 'Levi Doppelgänger', 'Doppelgänger'],
    yaml: `基本信息:
  姓名: 利维仿身
  英文名: Levi (Doppelgänger)
  身份: 独特敌人
  所属: Sewers - Western Tunnels

外貌特征:
  关键特征: Incomplete——jaws 代脸；Janitor 式畸形臂

性格核心:
  行为模式:
    - 先自称 Levi 后突然 charge
    - Shoot 29-44 Piercing

与<user>的关系:
  关系: 伪装伏击
  互动方式: 直攻 torso；头可换 Pocketcat 物品

背景要点:
  - Doppelgänger 头仍计作对应参赛者头

语言特征:
  参考语料: []`,
  },
  {
    id: '玛丽娜仿身_Marina_Doppelganger',
    name: '玛丽娜仿身',
    nameEn: 'Marina (Doppelgänger)',
    abstract: 'Book Store 完美模仿玛丽娜的 doppelgänger',
    keywords: ['玛丽娜仿身', 'Marina Doppelgänger'],
    yaml: `基本信息:
  姓名: 玛丽娜仿身
  英文名: Marina (Doppelgänger)
  身份: 独特敌人
  所属: Book Store（招募真 Marina 后）

外貌特征:
  关键特征: overworld 与 Marina 难辨；战内扭曲脸

性格核心:
  行为模式:
    - 不主动开战；Flesh Puppetry、Black Smog 双臂各一技
    - 真 Marina 死亡后消失；主控 Marina 不可战

与<user>的关系:
  关系: 书店替身
  互动方式: 防 Blindness；双臂或 torso 速杀

语言特征:
  参考语料:
    - "SWALLOW! SWALLOW YOU WHOLE!"`,
  },
  {
    id: '奥莉薇娅仿身_Olivia_Doppelganger',
    name: '奥莉薇娅仿身',
    nameEn: 'Olivia (Doppelgänger)',
    abstract: 'Deep Woods 无轮椅狂奔模仿 Olivia 的 doppelgänger',
    keywords: ['奥莉薇娅仿身', 'Olivia Doppelgänger'],
    yaml: `基本信息:
  姓名: 奥莉薇娅仿身
  英文名: Olivia (Doppelgänger)
  身份: 独特敌人
  所属: Deep Woods - West Prehevil

外貌特征:
  关键特征: 外观同 Olivia 但 sprint 无轮椅

性格核心:
  行为模式:
    - 重复火车对话片段；非 hostile 直至挑衅
    - Toxic mist、Nettle mist（永久 Irritation）、Scratch

与<user>的关系:
  关系:  woods 替身
  互动方式: 首回合杀 torso 或 stun 臂；Maso 难一击 625

背景要点:
  - 击杀不重置 moonscorch 计时

语言特征:
  参考语料:
    - "You think this is a fair fight!?"`,
  },
  {
    id: '田中仿身_Tanaka_Doppelganger',
    name: '田中仿身',
    nameEn: 'Tanaka (Doppelgänger)',
    abstract: 'Tunnel 4 bunker 模仿田中的 doppelgänger',
    keywords: ['田中仿身', 'Tanaka Doppelgänger'],
    yaml: `基本信息:
  姓名: 田中仿身
  英文名: Tanaka (Doppelgänger)
  身份: 独特敌人
  所属: Foundations of Decay - Tunnel 4 bunker 底层

外貌特征:
  关键特征: 外观 speech 正常；异常 head turn；战内扭曲脸

性格核心:
  行为模式:
    - Suitcase Smash 22-34 Blunt
    - Talk 和平可 skip 1-2  turn，重复说服则 +Attack

与<user>的关系:
  关系: bunker 替身
  互动方式: 直攻 torso

语言特征:
  参考语料:
    - "We live in the 1940s. We are civilized people..."
    - "良い。 I knew you were a sensible one..."`,
  },
  {
    id: '月蚀食尸鬼_Moonscorched_Ghoul',
    name: '月蚀食尸鬼',
    nameEn: 'Moonscorched (Ghoul)',
    abstract: '与可招募食尸鬼不同——moonscorched 剥肤狂战士，Talk 可化敌',
    keywords: ['月蚀食尸鬼', 'Moonscorched Ghoul', 'moonscorched ghoul'],
    yaml: `基本信息:
  姓名: 月蚀食尸鬼
  英文名: Moonscorched (Ghoul)
  身份: 常见敌人（moonscorched 变种）
  所属: Slums、Sewers、Church basement、Filthy Shack

外貌特征:
  关键特征: 上半身皮挂腰；自挖双眼；硬化 crispy 肌肉

性格核心:
  行为模式:
    - 多数可 Talk 化 friendly 得 Lucky coin/Cloth fragment
    - Clawing 33-41；部分 sewer 体不可 Talk

与<user>的关系:
  关系: moonscorched 幸存者
  互动方式: Talk truce；weak slashing/fire/otherworldly

背景要点:
  - 系列少数 Talk 结束战斗的敌人之一

语言特征:
  参考语料:
    - "The festival of Termina... We can call it a truce for now..."`,
  },
  {
    id: '月蚀男_Moonscorched_Male',
    name: '月蚀男',
    nameEn: 'Moonscorched (Male)',
    abstract: 'Eastern Outskirts 被动 moonscorched，撕脸不攻击',
    keywords: ['月蚀男', 'Moonscorched Male'],
    yaml: `基本信息:
  姓名: 月蚀男
  英文名: Moonscorched (Male)
  身份: 被动敌人
  所属: Prehevil - Eastern Outskirts

外貌特征:
  关键特征:  frenzy 撕自己脸皮；severe burns

性格核心:
  行为模式:
    - 不攻击；cutscene 中 1 被 Elite Trooper 射杀
    - 可 Betel's stone 等刷 heal

与<user>的关系:
  关系: 背景惨剧
  互动方式: 任意击杀

语言特征:
  参考语料:
    - "T-take it off! TAKE IT OFF PLEASE!"
    - "I-I can feel it inside me! It crawled under my skin!"`,
  },
  {
    id: '月蚀女_Moonscorched_Female',
    name: '月蚀女',
    nameEn: 'Moonscorched (Female)',
    abstract: 'Eastern Outskirts 被动 moonscorched 女性村民',
    keywords: ['月蚀女', 'Moonscorched Female'],
    yaml: `基本信息:
  姓名: 月蚀女
  英文名: Moonscorched (Female)
  身份: 被动敌人
  所属: Prehevil - Eastern Outskirts

外貌特征:
  关键特征: 条撕脸皮；爪痕遍体

性格核心:
  行为模式:
    - 不攻击；cutscene 被 Elite Trooper 射杀

与<user>的关系:
  关系: 背景惨剧
  互动方式: 可 farm heal/items

语言特征:
  参考语料:
    - "Look at the sky... Is it full moon yet?"
    - "Before... I lose myself completely."`,
  },
  {
    id: '口袋猫达安_Pocketcat_Daan',
    name: '口袋猫达安',
    nameEn: 'Pocketcat (Daan)',
    abstract: '达安 Day 3 月蚀形态，Museum Guernica 前 Boss',
    keywords: ['口袋猫达安', 'Pocketcat Daan', 'Daan moonscorch'],
    yaml: `基本信息:
  姓名: 口袋猫（达安）
  英文名: Pocketcat (Daan)
  身份: Boss；达安 moonscorched 形态
  所属: Museum（Guernica 画前）

外貌特征:
  关键特征: Pocketcat 面具与脸融合

性格核心:
  行为模式:
    - Day 3 Morning 未 recruit/杀死达安则出现
    - 随机选队员要求 Gentle dismember/beheading
    - Fluted armor/salmonsnake 防断肢；致盲 head 速杀

与<user>的关系:
  关系: 参赛者堕落 Boss
  互动方式: 同口袋猫 meta 对话 déjà vu

背景要点:
  - 唯一 moonscorched 参赛者 battle theme 非 Desperation

语言特征:
  参考语料:
    - "There's something awfully familiar about all of this, don't you think old sport?"`,
  },
  {
    id: '鼠人帮_Ratkin_gang',
    name: '鼠人帮',
    nameEn: 'Ratkin gang',
    abstract: 'Foundations of Decay 六鼠 Boss 伏击',
    keywords: ['鼠人帮', 'Ratkin gang'],
    yaml: `基本信息:
  姓名: 鼠人帮
  英文名: Ratkin gang
  身份: Boss（6 体 ratkin）
  所属: Foundations of Decay

外貌特征:
  关键特征: 跟随单鼠入 chest _room 后集体涌入

性格核心:
  行为模式:
    - 6 体共 5400+ HP；Rat scratch fever 多段
    - Mastery over vermin 可听懂辱骂

与<user>的关系:
  关系: Decay 伏击
  互动方式: AoE 法术/道具； infection 常备 cure

背景要点:
  - Discord 用户 Артур 概念

语言特征:
  参考语料:
    - "Death to the grounddweller!"
    - "Dibs on their liver!"`,
  },
  {
    kind: 'worldview',
    id: '月蚀机制',
    name: '月蚀机制',
    nameEn: 'Moonscorch',
    abstract: 'Rher 对 Termina 参赛者的 moonlight cancer 惩罚与三日进程',
    keywords: ['月蚀', 'Moonscorch', 'moonscorched', '月蚀机制'],
    yaml: `机制名称: 月蚀（Moonscorch / moonlight cancer）

定义:
  月神 Rher 对拒绝/fast 完成 Termina 杀戮者的惩罚性病变，1942 Prehevil 全民与 Bremen 军曾整体中招。

症状:
  - 灼烧色 discoloration、干裂、异常增生、疤痕
  - 面部拉伸扭曲；晚期 animalistic 或超自然能力
  - 心理：攻击性强、妄想寄生虫、语无伦次；少数保留理智（如 Gentleman/Jeeves）

Termina 进程:
  - 三日时间线内参赛者 gradual moonscorch
  - Day 3 Night 除玩家外参赛者皆变（August/Pav 例外死亡）
  - Hollow Tower 门：队内参赛者 instant mutate
  - 睡到 Day 4：玩家 moonscorch → game over
  - Reveal Aura 可定位 moonscorched 参赛者

Maso 模式:
  - 全程 Day 3 Night；户外 67 秒连续即玩家 moonscorch

弱点:
  - moonscorched 身体 weak slashing、fire、otherworldly

参赛者对应形态:
  达安→口袋猫、阿贝拉→丘格纳、奥撒→主谋、奥莉薇娅→机械之舞、卡琳→女武神、马尔科→巨人、利维→哭泣瞄准镜、玛丽娜→茧、田中→审判、亨利克→绅士、萨玛丽→变形障碍、卡里古拉→怪物

已知 moonscorched 敌人:
  绷带男、波比、算命师、半茧人、审判官、吉夫斯、月蚀食尸鬼/男/女、邻居、鼠婆、步枪手、卑劣者、镰刀/匕首/铁管村民、樵夫、卑贱者等`,
  },
];

mkdirSync(npcDir, { recursive: true });
mkdirSync(worldviewDir, { recursive: true });

const patch = [];
for (const e of entries) {
  if (e.kind === 'worldview') {
    const filePath = `世界书/世界观/${e.id}.yaml`;
    writeFileSync(resolve(root, filePath), e.yaml + '\n');
    patch.push({
      op: 'add',
      path: `/entryManifest/世界观/${e.id}`,
      value: {
        abstract: e.abstract,
        keywords: e.keywords,
        path: filePath,
      },
    });
    continue;
  }

  const filePath = `世界书/NPC/${e.id}.yaml`;
  writeFileSync(resolve(root, filePath), e.yaml + '\n');
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

const catalogPath = resolve(npcDir, '角色速览.yaml');
const existingCatalog = existsSync(catalogPath) ? readFileSync(catalogPath, 'utf8') : '';
const npcNames = entries.filter(e => e.kind !== 'worldview').map(e => e.name).join('、');
const supplement = `
F&H2 第三批补全（${entries.filter(e => e.kind !== 'worldview').length} 条 NPC + 月蚀机制）:
  剩余敌人: ${npcNames}
  世界观: 月蚀机制
  说明: 无月兽即无月(Moonless)；神秘人即萨玛丽；Kassara 为看门人掉落武器非独立敌人
  范围: 仅 Fear & Hunger 2: Termina
  资料来源: https://fearandhunger.wiki.gg/
`;
writeFileSync(
  catalogPath,
  existingCatalog.replace(/\nF&H2 第三批补全[\s\S]*?(?=\n  范围:|$)/, '').replace(/资料来源:.*/, '') + supplement,
);

const patchPath = resolve(root, 'patches/add-fh2-remaining.json');
writeFileSync(patchPath, JSON.stringify(patch, null, 2));

console.log(`Prepared ${entries.length} entries (${entries.filter(e => e.kind !== 'worldview').length} NPC + worldview)`);
execSync(`node "${forge}" patch fh --file "${patchPath}"`, { stdio: 'inherit', cwd: repoRoot });
execSync(`node "${forge}" configure fh`, { stdio: 'inherit', cwd: repoRoot });
execSync(`node "${forge}" pack fh`, { stdio: 'inherit', cwd: repoRoot });
console.log('Done');
