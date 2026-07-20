import { mkdirSync, writeFileSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const npcDir = resolve(root, '世界书/NPC');

/** @type {Array<{ id: string; name: string; nameEn: string; category: string; abstract: string; keywords: string[]; yaml: string }>} */
const npcs = [
  {
    id: '利维_Levi',
    name: '利维',
    nameEn: 'Levi',
    category: '普通',
    abstract: 'Prehevil 出身的逃兵狙击手，Termina 参赛者，孤狼型远程战斗者',
    keywords: ['利维', 'Levi'],
    yaml: `基本信息:
  姓名: 利维
  英文名: Levi
  身份: Fear & Hunger 2: Termina 可玩角色与潜在队友；十四参赛者之一
  出身: Prehevil，Bohemia 首都

外貌特征:
  整体印象: 瘦削的前军人，持步枪时习惯性低姿瞄准
  关键特征: 军服与枪械；海洛因戒断时会发抖

性格核心:
  核心特质: 见人就躲、话少、对人群保持戒备
  行为模式:
    - 火车到站后立刻逃进城里，被接近时会后退
    - 戒断期认为其他参赛者在猎杀自己
    - 被招募后仍需要时间才会开口，但会逐渐信任队友

与<user>的关系:
  关系: 同为 Termina 参赛者
  态度: 初期把<user>当作威胁；给予海洛因或救下后可入队
  互动方式: 提供远程火力；对参赛者互斗会犹豫

背景要点:
  - 十三岁被 Eastern Union 征兵，专精步枪
  - 曾指挥童兵中队执行自杀任务，战后染上毒瘾并当逃兵
  - 在 St. Domek 孤儿院长大，父亲酗酒家暴
  - 未招募时可能被卡里古拉杀害，或月蚀为 Weeping scope

月蚀形态: Weeping scope（哭泣瞄准镜）

语言特征:
  说话风格: 极短、沉默；被说服时仍几乎不回应
  参考语料:
    - "... Do we really have to do this?"
    - "I can't let you go... Not anymore."
    - "Why do these people talk to me...? I don't have anything to offer to them..."`,
  },
  {
    id: '玛丽娜_Marina',
    name: '玛丽娜',
    nameEn: 'Marina',
    category: '普通',
    abstract: 'Prehevil 本地 occultist，Dark Priest 之女，Termina 参赛者',
    keywords: ['玛丽娜', 'Marina', 'Marina Domek'],
    yaml: `基本信息:
  姓名: 玛丽娜·多梅克
  英文名: Marina Domek
  身份: Termina 可玩角色；Alll-mer 教会 dark priest 之女，Vatican 研修 occultist
  性别: 跨性别女性（出生时登记为男，由母亲以女孩身份抚养以避开 priesthood）

外貌特征:
  整体印象: 年轻 occultist，领口有领饰
  关键特征: 持粉笔与仪式用具；战斗时抬手施法姿态

性格核心:
  核心特质: 好奇、口无遮拦、对 Prehevil 既熟悉又厌恶
  行为模式:
    - 主动分享本地情报与 occult 知识
    - 对父亲与 hometown 充满矛盾情绪
    - 见参赛者互斗会先口头劝阻，被逼急才反击

与<user>的关系:
  关系: 本地向导型参赛者
  态度: 火车上与<user>搭话；可随<user>前往 Alll-mer 教会
  互动方式: 提供 occult 技能、仪式圈与 Prehevil 地理知识

背景要点:
  - 在 Vatican Ministry of Darkness 进修 occultism
  - 因母亲之死回信返回 Prehevil，怀疑父亲涉及 blood magic
  - 萨玛丽暗中跟踪她至 Prehevil

月蚀形态: Cocoon

语言特征:
  说话风格: 非正式、直率，偶尔带 occult 术语
  参考语料:
    - "I'm not backing down anymore if that's what you're after!"
    - "What am I going to do when we finally escape all this? I'll probably start a small occult store somewhere."
    - "We shouldn't be fighting each other! There has to be another way."`,
  },
  {
    id: '达安_Daan',
    name: '达安',
    nameEn: 'Daan',
    category: '普通',
    abstract: 'Rondon 医生兼 occult 医者，追查亡妻之死，Termina 参赛者',
    keywords: ['达安', 'Daan', 'Daniël'],
    yaml: `基本信息:
  姓名: 达安
  英文名: Daan (Daniël)
  身份: Termina 可玩角色；Rondon 医生，兼通现代医学与神秘学医疗

外貌特征:
  整体印象: 礼貌的独眼医生
  关键特征: 左眼缺失（为复活亡妻献祭）；持手术刀作战

性格核心:
  核心特质: 表面温和会调酒，内里长期抑郁
  行为模式:
    - 对卡琳尖刻揶揄，对年轻参赛者有保护欲
    - 独自追查 Prehevil 与硫磺神线索
    - 若<user>在 train 杀人且达安在场会 restrain 玩家

与<user>的关系:
  关系: 可永久招募的 medical 支援
  态度: 提供 Analyze、医疗与调酒
  互动方式: 与 O'saa 在硫磺 sigil 处有专属 occult 对话

背景要点:
  - Sylvian 信徒父母十三岁遗弃他
  - 妻子 Elise 与 Baron 死于 occult 仪式
  - 未入队第三日可能变为 Pocketcat (Daan)

月蚀形态: Pocketcat (Daan)

语言特征:
  说话风格: 冷静、黑色幽默、医学术语
  参考语料:
    - "Count me out. I want no part in this..."
    - "Let's slice and dice. No? I thought that's something you say in situations like this."
    - "To be frank, that sigil has occupied my thoughts for the most part."`,
  },
  {
    id: '阿贝拉_Abella',
    name: '阿贝拉',
    nameEn: 'Abella',
    category: '普通',
    abstract: 'Oldegård 机械师，NLU 地下抵抗成员，Termina 参赛者',
    keywords: ['阿贝拉', 'Abella'],
    yaml: `基本信息:
  姓名: 阿贝拉
  英文名: Abella
  身份: Termina 可玩角色；Oldegård 机械师，Nameless Liberty Underground 成员

外貌特征:
  整体印象: 工装机械师
  关键特征: 管钳武器；乐观表情与工程工具并存

性格核心:
  核心特质: 外向乐观，相信机械逻辑
  行为模式:
    - 对 Levi 等人有母性关怀
    - 对 Prehevil 超自然现象既困惑又着迷
    - 在 speakeasy 可对卡琳与<user>坦白 NLU 身份

与<user>的关系:
  关系: Tunnel 7 可招募的实用队友
  态度: 提供 Wrench toss、Short circuit 开门
  互动方式: 对 train 杀人会 restrain 玩家

背景要点:
  - 北方 Oldegård 战后以工程支援 home front
  - 得知 Eastern Union 在 Prehevil 有阴谋后独自调查
  - 第三日 moonscorch 为 Chaugnar

月蚀形态: Chaugnar

语言特征:
  说话风格: 务实、带工程比喻
  参考语料:
    - "The reason why I like engineering and mechanics is that it always follows a clear logic."
    - "We shouldn't be fighting each other! There has to be another way."
    - "Your talking days are over! You're dead!"`,
  },
  {
    id: '奥撒_Osaa',
    name: '奥撒',
    nameEn: "O'saa",
    category: '普通',
    abstract: "Abyssonia 黄 mage，携带 Nas'hrah 头颅，Termina 参赛者",
    keywords: ["奥撒", "O'saa", 'Osaa'],
    yaml: `基本信息:
  姓名: 奥撒
  英文名: O'saa
  身份: Termina 可玩角色；黄 mage（Yellow mage），Nas'hrah 学徒

外貌特征:
  整体印象: 黄 mage 长袍
  关键特征: 携带 Beheaded wizard（Nas'hrah 断头）

性格核心:
  核心特质: 极度自负、反宗教、独行
  行为模式:
    - 视威胁者即攻击，不可 persuade 脱战
    - 冥想时若被靠近会无预警 Hurting
    - 对 slums 的厌恶超过对 horrors 本身

与<user>的关系:
  关系: Tunnel 1 可永久招募
  态度: 提供 occult 知识与 Hurting 等法术
  互动方式: 与达安常 sarcasm 交锋

背景要点:
  - 随 Hadil Azif 探险 Fear & Hunger 地牢，挖出 Nas'hrah 头颅
  - 比多数参赛者更了解 Festival 与诸神
  - 可在 Church confessional 伪装神父

月蚀形态: Mastermind

语言特征:
  说话风格: 冷峻 sarcastic，长句论神与 magick
  参考语料:
    - "A yellow mage does not follow gods... We bend the will of the gods to our own benefit."
    - "I have no interest in your quarrel."
    - "Let's see how the stars align... Looks like it's your time to go my friend."`,
  },
  {
    id: '奥莉薇娅_Olivia',
    name: '奥莉薇娅',
    nameEn: 'Olivia',
    category: '普通',
    abstract: '植物学家，Reila 的孪生姐妹，轮椅使用者，Termina 参赛者',
    keywords: ['奥莉薇娅', 'Olivia', 'Olivia Haas'],
    yaml: `基本信息:
  姓名: 奥莉薇娅·哈斯
  英文名: Olivia Haas
  身份: Termina 可玩角色；植物学家，专长草药与毒理学

外貌特征:
  整体印象: 需轮椅行动的学者
  关键特征: Shadowed soul；持枪时会因「终结生命的能力」而 adrenaline 颤抖

性格核心:
  核心特质: 外表友善 curious，内心对残疾极度自卑
  行为模式:
    - 与马尔科发展友谊
    - 对 Prehevil 植物与法则有学术兴趣
    - 若<user>杀人且 Olivia 在场会 hostile

与<user>的关系:
  关系: 友好型队友，可深度 party talk
  态度: Day 2 获得 wheelchair 后可招募
  互动方式: 轮椅可撞敌 First Strike

背景要点:
  - 十五岁血管性脊髓病致 wheelchair
  - 追 Reila 至 Prehevil 查 cube 与 Kaiser 阴谋
  - Reila 为 NLU 工程师，后 ascended 为 Logic

月蚀形态: Mechanical dance

语言特征:
  说话风格: 温柔、略带学术腔
  参考语料:
    - "Everything does feel like a dream, doesn't it?"
    - "Aaah! Please stop this fight! There is no reason for this!"
    - "N-no! It really doesn't! We can work together too!"`,
  },
  {
    id: '马尔科_Marcoh',
    name: '马尔科',
    nameEn: 'Marcoh',
    category: '普通',
    abstract: 'Vatican 地下拳手，Accardo 家族外围，Termina 参赛者',
    keywords: ['马尔科', 'Marcoh'],
    yaml: `基本信息:
  姓名: 马尔科
  英文名: Marcoh
  身份: Termina 可玩角色；Vatican City 地下拳击手

外貌特征:
  整体印象: 沉默的赤拳格斗者
  关键特征: 格斗夹克；Quick jabs / Right straight

性格核心:
  核心特质: 话少 shy，但 kindhearted
  行为模式:
    - 对 Olivia 保护欲强
    - 后悔暴力 past 但仍用拳头保护他人
    - 与田中可建立 boxing 师徒情谊

与<user>的关系:
  关系: 可招募；train 杀人会 restrain
  态度: Day 2 为 Olivia 找 wheelchair
  互动方式: 与 Olivia 剧情绑定

背景要点:
  - 被迫拳赛打死 ex-family 成员
  - 杀 Riccardo Accardo 后逃往 Prehevil
  - Day 3 在 White Mold Apartments moonscorch 为 Giant

月蚀形态: Giant

语言特征:
  说话风格: 话少、直接
  参考语料:
    - "There is no escaping your fate, is there?"
    - "... Have you lost your mind? Why are we fighting each other?"
    - "... I got no intentions of dying here."`,
  },
  {
    id: '卡琳_Karin',
    name: '卡琳',
    nameEn: 'Karin',
    category: '普通',
    abstract: 'Bremen 战地记者，调查 Kaiser，Termina 参赛者',
    keywords: ['卡琳', 'Karin', 'Karin Sauer'],
    yaml: `基本信息:
  姓名: 卡琳·绍尔
  英文名: Karin Sauer
  身份: Termina 可玩角色；The Midnight Gazette 记者

外貌特征:
  整体印象:  oversized pilot jacket
  关键特征: 持 Lugr 手枪；冲动表情

性格核心:
  核心特质: 冲动 short-fused，坚决反 occult 与 Bremen 军
  行为模式:
    - 初期 dismissive，后期承认 Prehevil 危险
    - 与达安持续 verbal sparring
    - restrain 杀人玩家时持枪威胁，拒降即 game over

与<user>的关系:
  关系: Day 2 起可招募
  态度: Lockpicking 实用
  互动方式: 调查 Kaiser 与父亲之死

背景要点:
  - Bremen 新贵 Sauer 家；riots 中被保姆 Dalia 带至 Eastern Union
  - Kaiser 占领 Prehevil 后亲赴调查
  - Day 3 与 August Journal 对峙

月蚀形态: Valkyrie

语言特征:
  说话风格: 强硬、新闻腔、反权威
  参考语料:
    - "I've covered wars you know!"
    - "I've killed before too. Don't think for a second that I wouldn't have guts to use this pistol."
    - "It's no use. We are done talking."`,
  },
  {
    id: '士兵_Soldier',
    name: '士兵',
    nameEn: 'Soldier',
    category: '普通',
    abstract: '前届 Termina 幸存者，Bremen 军人，理智崩坏中',
    keywords: ['士兵', 'Soldier', 'Bremen士兵'],
    yaml: `基本信息:
  姓名: 士兵
  英文名: Soldier
  身份: 独特敌人；可 necromancy 招募的临时队友
  所属: Kaiser 派来 securing Prehevil 的 Bremen 军队

外貌特征:
  整体印象: 军 uniform 的幸存者
  关键特征: 皮肤异常干燥蜡质；眼睛 dim 如 cataract

性格核心:
  核心特质: 理智残存但快速崩坏
  行为模式:
    - 仍认为 Festival 必须完成
    - 承认杀过上级
    - Persuade 可降 aggression

与<user>的关系:
  关系: Ruined Streets 等处遭遇
  态度: 非 hostile vendor；可 necromancy 入队
  互动方式: 短暂对话后可能敌对或犹豫

背景要点:
  - 和平条约后进驻；梦中 Per'kele 迫入 Festival
  - 三日期限与「he」的预言一致
  - 多数同袍已死或 worse

语言特征:
  说话风格: 疲惫、军事口吻、宿命感
  参考语料:
    - "We are all on the execution row... Since the moment we stepped inside the borders of this wicked town."
    - "My comrades already succumbed to the chaos."
    - "You are wrong... That's exactly what is expected from everyone who takes part in this..."`,
  },
  {
    id: '村民镰刀_Villager',
    name: '村民镰刀',
    nameEn: 'Villager (Sickle)',
    category: '普通',
    abstract: 'Prehevil Old Town moonscorch 镇民，持镰刀被迫互杀',
    keywords: ['镰刀村民', 'Villager', 'Sickle'],
    yaml: `基本信息:
  姓名: 镰刀村民
  英文名: Villager (Sickle)
  身份: 敌人；可 necromancy 招募
  所属: Prehevil Old Town 前居民

外貌特征:
  整体印象: frail 的 moonscorch 镇民
  关键特征: 面部 severe burns；Rher 半月中分纹；持 sickle

性格核心:
  核心特质: 被迫 aggress，口称 Rher 要求
  行为模式:
    - 设 bear trap
    - 仍带一丝 reluctance
    - Intimidate 可能有效

与<user>的关系:
  关系: 多地点 encounter
  态度: 对话难 persuade
  互动方式: necromancy 可招募

背景要点:
  - 普通镇民 moonscorch 后被 Festival 强迫互杀
  - 设计受 Francis Bacon 绘画影响

语言特征:
  说话风格: 断续、宗教狂热腔
  参考语料:
    - "I'm sorry... but... everyone must die."
    - "There is no other way... He demands it... It's jubilee..."
    - "Only one of us... walks away from here..."`,
  },
  {
    id: '漆黑卡列夫_Black_Kalev',
    name: '漆黑卡列夫',
    nameEn: 'Black Kalev',
    category: '普通',
    abstract: 'Abandoned House 外徘徊的黑山羊，与 Woodsman 事件相关',
    keywords: ['漆黑卡列夫', 'Black Kalev', 'Kalev'],
    yaml: `基本信息:
  姓名: 漆黑卡列夫
  英文名: Black Kalev
  身份: 潜在 AI 队友（山羊形态）
  关联: Man in Black、硫磺神、Woodsman 妻子事件

外貌特征:
  整体印象: 黑山羊
  关键特征: 人类形态需 sculpt 12 clay figures 于 Rher 位面解锁

性格核心:
  核心特质: AI 控制；特定地图 20% 离队
  行为模式:
    - 人类形态时透露硫磺神信息
    - 技能 Rampage（64–96 Piercing）

与<user>的关系:
  关系: Rher sigil + Man in Black 对话后可招募
  态度: 给 Carrot 可再招募
  互动方式: 可 drop 于 train/PRHVL Bop

背景要点:
  - Woodsman 妻子血书提及 beast
  - 名字 Kalev 为爱沙尼亚「巨人」
  - 可能影射 Black Phillip（The Witch）

语言特征:
  说话风格: 山羊形态几乎无台词
  参考语料: []`,
  },
  {
    id: '帕夫_Pav',
    name: '帕夫',
    nameEn: 'Pav',
    category: '普通',
    abstract: 'Bremen 前中尉，Voroniya 灭村幸存者，刺杀 Kaiser 为目标',
    keywords: ['帕夫', 'Pav', 'Pavel Yudin'],
    yaml: `基本信息:
  姓名: 帕夫
  英文名: Pavel Yudin (Pav)
  身份: 不可玩侧角色；Termina 参赛者
  所属: 前 Bremen 陆军中尉

外貌特征:
  整体印象: sly-looking 快枪手
  关键特征: 军 uniform

性格核心:
  核心特质: 混乱 reckless、满口威胁
  行为模式:
    - 唯一目标刺杀 Kaiser
    - 对 greater good rhetoric 嗤之以鼻
    - 受伤后 subdued 仍 dismissive

与<user>的关系:
  关系: Tunnel 7、Hollow Tower 等多线遭遇
  态度: 杀 Pav 时其他参赛者不会 hostile（train 上）
  互动方式: 可 rescue 回 train 短暂存活

背景要点:
  - Kaiser 在一战摧毁 Voroniya 与家族
  - 潜入军队接近 Kaiser；Prehevil 刺杀失败
  - 无 moonscorch 形态，必死于 Kaiser/玩家/offscreen

语言特征:
  说话风格: 粗俗、挑衅、黑色幽默
  参考语料:
    - "My life's not wasted if I get my revenge here."
    - "Too slow! Too slow!"
    - "Sorry, you're not going anywhere."`,
  },
  {
    id: '萨玛丽_Samarie',
    name: '萨玛丽',
    nameEn: 'Samarie',
    category: '普通',
    abstract: 'Vatican dark priest 学徒，Marina 的 secret admirer',
    keywords: ['萨玛丽', 'Samarie'],
    yaml: `基本信息:
  姓名: 萨玛丽
  英文名: Samarie
  身份: 不可玩侧角色；Termina 参赛者
  所属: Vatican 黑暗 priest 学徒

外貌特征:
  整体印象: frail occultist 装束
  关键特征: Radiating soul（与 Reila 同型）

性格核心:
  核心特质: 极度 insecure、 secretive、 obsessive
  行为模式:
    - 为 Marina 可暴力（杀 Father Domek）
    - 对其他人 distrustful
    - Mind read 会察觉

与<user>的关系:
  关系: train 上偷窥；Church Day 1 杀 Domek
  态度: 以 Marina 对话可 hesitation
  互动方式: Rher dimension basement 可劝回 train

背景要点:
  - Fiend Petr Basilica 第九圈 gifted children 仪式
  - 身体衰败、寿命有限
  - 追 Marina 至 Prehevil

月蚀形态: Dysmorphia

语言特征:
  说话风格: 结巴、 whisper、 romantic fixation
  参考语料:
    - "I'm no one... Just a lonely caterpillar waiting to shed her skin..."
    - "Love you."
    - "B-but... What will it take for you to believe me?"`,
  },
  {
    id: '田中_Tanaka',
    name: '田中',
    nameEn: 'Tanaka',
    category: '普通',
    abstract: 'Edo 商人 salaryman，Termina 参赛者',
    keywords: ['田中', 'Tanaka', 'Kida Tanaka'],
    yaml: `基本信息:
  姓名: 田中
  英文名: Kida Tanaka
  身份: 不可玩侧角色；Termina 参赛者
  所属: Edo 商人、家族海外 ambassador

外貌特征:
  整体印象: 西装、眼镜、公文包
  关键特征: 后期 headband 拳击姿态

性格核心:
  核心特质: 初期 timid polite workaholic anxiety
  行为模式:
    - 遇 Marcoh/Olivia 后学会 comradery
    - Marcoh moonscorch 后 bold 复仇 Per'kele
    - 填字游戏爱好者

与<user>的关系:
  关系: 多条即死/战斗线
  态度: Marcoh 训练后 combat buff
  互动方式: 可能 restrain 杀人玩家

背景要点:
  - 四岁开始「只依赖自己」
  - Prehevil 商务会议途中 train 停摆
  - Well 事件可被 Woodsman 斩首

月蚀形态: Judgement

语言特征:
  说话风格: 礼貌、日式英语夹杂
  参考语料:
    - "It might be a silly thing for you to hear, but I'm not used to - friends..."
    - "We live in the 1940s. We are civilized people."
    - "I don't know just what you are trying to pull, but know that I'm prepared to answer violence with violence!"`,
  },
  {
    id: '亨利克_Henryk',
    name: '亨利克',
    nameEn: 'Henryk',
    category: '普通',
    abstract: '32 岁 Rondon 厨师，Termina 参赛者',
    keywords: ['亨利克', 'Henryk'],
    yaml: `基本信息:
  姓名: 亨利克
  英文名: Henryk
  身份: 不可玩侧角色；Termina 参赛者
  所属: Rondon 厨师

外貌特征:
  整体印象: 持厨刀 combat
  关键特征: linen vest

性格核心:
  核心特质: Passionate about cooking； low self-esteem
  行为模式:
    - 求他人 approval；被拒会 devastated
    - Festival 末期 time limit 焦虑 → PRHVL Bop 投毒
    - 找到 food supply 后 train 免费供餐

与<user>的关系:
  关系: 可安置于 Bílý Vůl / Renka / PRHVL Bop
  态度: 杀 Caligura 可救 Levi/Henryk
  互动方式: 与 Abella 互斥 encounter（Mayor's Manor）

背景要点:
  - 父母 tavern Klimkov's
  - 成名后游历寻 local ingredients 至 Prehevil
  - Caligura 可能杀之（Lake Day 2 Evening）

月蚀形态: Gentleman（ lucid merchant）

语言特征:
  说话风格: 厨人腔、自我怀疑、food metaphors
  参考语料:
    - "Even in this hellish situation, I end up cooking."
    - "It's come down to this. No hard feelings."
    - "Aaargh! My chopping arm! MY CHOPPING ARM!"`,
  },
  {
    id: '卡里古拉_Caligura',
    name: '卡里古拉',
    nameEn: 'Caligura',
    category: '普通',
    abstract: 'Vatican 黑帮 caporegime，绰号 Count Dragul',
    keywords: ['卡里古拉', 'Caligura', 'Count Dragul'],
    yaml: `基本信息:
  姓名: 卡里古拉
  英文名: Caligura
  身份: 不可玩侧角色；Termina 参赛者
  所属: Vatican City 黑帮 The Family 分支

外貌特征:
  整体印象: ghoulish appearance
  关键特征: kashmir suit；rusty pipe

性格核心:
  核心特质: Hostile、foul-mouthed、 sexually aggressive
  行为模式:
    - 主动猎杀其他参赛者（Levi、Henryk 等）
    - 对 Abella 性侵未遂
    - 对 Marcoh 有 recognition 事件

与<user>的关系:
  关系: train 上可 early encounter
  态度: 杀 Caligura 可救 Levi/Henryk
  互动方式: 多 sleeping event

背景要点:
  - 名源 Roman Emperor Caligula（little boot）
  - Accardo 家族 rival branch

月蚀形态: Monster（ sewer 水中躲藏）

语言特征:
  说话风格: 极端粗口、威胁
  参考语料:
    - "Get ready to die you fucking piece of shit."
    - "I'll fuck you up you piece of shit!"
    - "Just kneel down and it'll be over then."`,
  },
  {
    id: '奥古斯特_August',
    name: '奥古斯特',
    nameEn: 'August',
    category: '普通',
    abstract: 'Oldegård 游牧猎人，Moonless 千年 companions',
    keywords: ['奥古斯特', 'August'],
    yaml: `基本信息:
  姓名: 奥古斯特
  英文名: August
  身份: 不可玩侧角色；Termina 参赛者
  所属: Oldegård 游牧猎人

外貌特征:
  整体印象: suede jacket；bow
  关键特征: parkour 移动

性格核心:
  核心特质: 表面 kind reserved； mission-first 不 attach
  行为模式:
    - 极稳 experienced；威胁时立即反击
    - 记录参赛者 journal
    - 第三日可能「 partaking in festivities」杀 Tanaka

与<user>的关系:
  关系: 多处 rooftop 目击
  态度: Foundations of Decay Moonless 战后赠 medical
  互动方式: Karin journal 对峙；Day 3 Night 可能 boss

背景要点:
  - 子女留 Valland；真因与 Logic 激活有关
  - 家族对 Kaiser/Yellow King 世仇
  - Hollow Tower 刺杀 Kaiser 失败；可 suicide 避 moonscorch

语言特征:
  说话风格: 老练、 brief、 hunter proverb 风
  参考语料:
    - "I feel sorry for these people, but I have a mission to finish."
    - "Only one arrow. That is all I need."
    - "You think you can outrun my arrows?"`,
  },
  {
    id: '多梅克神父_Father_Domek',
    name: '多梅克神父',
    nameEn: 'Father Domek',
    category: '普通',
    abstract: 'Marina 生父，Alll-mer dark priest',
    keywords: ['多梅克神父', 'Father Domek', 'Domek'],
    yaml: `基本信息:
  姓名: 多梅克神父
  英文名: Father Domek
  身份: 不可玩 NPC；Marina 之父
  所属: Prehevil Alll-mer 教会 dark priest 一脉

外貌特征:
  整体印象: 画像中终生皱眉
  关键特征: glass eyes、menacing；血 magic 绑定 church flesh pillar

性格核心:
  核心特质: Distant、 antagonistic、condescending
  行为模式:
    - 公开称 Marina 为 disgrace
    - 临终对 Marina 流露保护意图
    - Day 1 Samarie 刺杀

与<user>的关系:
  关系: Church 入口 cutscene
  态度: 非战斗（生前）
  互动方式: Marina 主角专属 dying dialogue

背景要点:
  - 子本应 dark priest，母隐瞒性别
  - 冷信告知 Marina 母死；疑 blood ritual
  - O'saa 指 church 最强 deity 非 Alll-mer

语言特征:
  说话风格: 权威、 religious condemnation
  参考语料:
    - "That person died in my eyes with his mother and their dirty little secret."
    - "What a disgrace. What a cowardly path to take..."
    - "S-stupid girl... Why'd you... come back...?"`,
  },
  {
    id: '吉夫斯_Jeeves',
    name: '吉夫斯',
    nameEn: 'Jeeves',
    category: '普通',
    abstract: '服务 Gentleman 的 butler，moonscorched 但仍 sane',
    keywords: ['吉夫斯', 'Jeeves'],
    yaml: `基本信息:
  姓名: 吉夫斯
  英文名: Jeeves
  身份: NPC 管家
  所属: 服务 Gentleman（Henryk moonscorch）

外貌特征:
  整体印象: visibly moonscorched 但对玩家仍像常人
  关键特征: formal butler 打扮

性格核心:
  核心特质: Polite、 formal、cryptic helpful
  行为模式:
    - 提醒礼仪（勿提 Mayor antlers）
    - Masquerade puzzle 向导

与<user>的关系:
  关系: Mayor's Manor / Museum 两处出现
  态度: 非 hostile
  互动方式: upstairs dining 邀请；Museum masquerade 线索

背景要点:
  - 名字或取自 P.G. Wodehouse 的 Reginald Jeeves

语言特征:
  说话风格: polite butler
  参考语料: []`,
  },
  {
    id: '绷带男_Bandaged_man',
    name: '绷带男',
    nameEn: 'Bandaged man',
    category: '普通',
    abstract: 'Old Town 小铺店主，前届 Festival moonscorch 幸存者',
    keywords: ['绷带男', 'Bandage Man', 'Bandaged man'],
    yaml: `基本信息:
  姓名: 绷带男
  英文名: Bandage Man
  身份: 商人 NPC
  所属: Old Town 小铺

外貌特征:
  整体印象: 面部 bandages 维系碎裂皮肤
  关键特征: 怀抱 doll，假装哄睡

性格核心:
  核心特质: 对 doll 拟人化；偶 smash doll 于桌
  行为模式:
    - 非 hostile pragmatic merchant
    - 过去对偷 candy 孤儿 hammer 钉掌

与<user>的关系:
  关系: Day 2 起 Small Hut - Shop 营业
  态度: shillings 购物
  互动方式: Karin suspicion food；Abella 可 enthusiasm 扫货

背景要点:
  - 原售 everyday goods
  - Levi 知 orphanage shoplifting 事件

语言特征:
  说话风格: 简短、重复、 slightly unhinged merchant
  参考语料:
    - "All the goods, all the goods!"`,
  },
  {
    id: '令人不适的家伙_Creepy_guy',
    name: '令人不适的家伙',
    nameEn: 'The creepy guy',
    category: '普通',
    abstract: 'Old Hotel 前 reception clerk，Marina 童年阴影',
    keywords: ['令人不适的家伙', 'creepy guy', 'Old Hotel'],
    yaml: `基本信息:
  姓名: 令人不适的家伙
  英文名: The creepy guy (Old Hotel clerk)
  身份: 背景 NPC（无独立 wiki 页）
  所属: Hotel u Křižovatky（Old Hotel）

外貌特征:
  整体印象: Marina 称「super creepy」
  关键特征: Levi：地下室发现七具儿童 skeleton

性格核心:
  核心特质: stalking、 luring 独处女性
  行为模式:
    - 以「 browse abandoned luggage」为借口接近
    - 旅馆 owner 疑似 serial child murderer

与<user>的关系:
  关系: 不可直接互动
  态度: location flavor / Marina backstory
  互动方式: Old Hotel 可探索、休息

背景要点:
  - Marina 童年路过时被 creep near
  - 旅馆 mold、 water damage

语言特征:
  说话风格: 无直接台词；Marina 转述
  参考语料:
    - "The clerk at the reception used to be this super creepy guy back in the day."
    - "Whenever I walked past this joint, he would slowly creep near me..."
    - "Apparently they found seven skeletons from his basement."`,
  },
  {
    id: '算命师_Fortune_teller',
    name: '算命师',
    nameEn: 'Fortune teller',
    category: '普通',
    abstract: 'Shopping District 占卜师，提示 effigy 位置',
    keywords: ['算命师', 'Fortune teller', '占卜师'],
    yaml: `基本信息:
  姓名: 算命师
  英文名: Fortune Teller
  身份: NPC 情报贩子
  所属: Prehevil Inner City Shopping District

外貌特征:
  整体印象: sickly； interact 时 cough
  关键特征: 坐于 Renka Cafe 南侧街道

性格核心:
  核心特质: Cryptic、 transactional
  行为模式:
    - 1 shilling per fortune
    - 非 hostile helpful for progression

与<user>的关系:
  关系: 付费提示 effigy 与 Telelectroscope 位置
  态度: Nas'hrah 厌恶此类 looney
  互动方式: 预言体 directions

背景要点:
  - 受 Rher moonscorch 影响

语言特征:
  说话风格: 预言体 cryptic
  参考语料:
    - "The self-fellating man... That one you can find from the moldy prison..."
    - "The martyr... Naturally you can find that one from the house of the holy."
    - "Follow upstream... A treasure hidden behind a waterfall..."`,
  },
  {
    id: '科菲尔博士_Dr_Kefer',
    name: '科菲尔博士',
    nameEn: 'Dr. Kefer',
    category: '普通',
    abstract: "Dr. Kefer's Tricks & Magic 店主",
    keywords: ['科菲尔博士', 'Dr. Kefer', 'Kefer'],
    yaml: `基本信息:
  姓名: 科菲尔博士
  英文名: Dr. Kefer
  身份: 商人 NPC
  所属: Dr. Kefer's Tricks & Magic

外貌特征:
  整体印象: occult shop 店主
  关键特征: snappish；必须先介绍姓名才能 trade

性格核心:
  核心特质: Snappish、sarcastic
  行为模式:
    - 防偷窃、防 downstairs 探索
    - 非 hostile 但 watchful

与<user>的关系:
  关系: Day 1 Morning 起营业
  态度: shillings 购物
  互动方式: introduce name 才能 trade

背景要点:
  - 卖 occult / medical / magic 货品
  - downstairs 有「 best be forgotten」之物

语言特征:
  说话风格: 粗口问候 dismissive
  参考语料:
    - "Fuck you! Now that the introductions are out of the way... What do you want stranger?"
    - "I don't do business with strangers."
    - "Hey! Keep ya dirty paws off my plants!"`,
  },
  {
    id: '达利娅_Dalia',
    name: '达利娅',
    nameEn: 'Dalia',
    category: '普通',
    abstract: 'Karin 的保姆兼事实绑架者，背景人物',
    keywords: ['达利娅', 'Dalia'],
    yaml: `基本信息:
  姓名: 达利娅
  英文名: Dalia
  身份: 背景人物（未出场）
  所属: Eastern Sanctuaries 裔 nursemaid

外貌特征:
  整体印象: tall woman
  关键特征: 无更多描述

性格核心:
  核心特质: 对 Karin 表面 reassuring，实则「 off feeling」
  行为模式:
    - 用 ransom 过活
    - 未 consult 父母即带 Karin 离境

与<user>的关系:
  关系: 仅 Karin character history
  态度: 不可遇
  互动方式: 无

背景要点:
  - Sauer 家 riots 时带 Karin 至 Jettaiah
  - 谎称父母寄钱，实为赎金
  - Karin 抗议上电视后被送回 Bremen

语言特征:
  说话风格: 无直接游戏台词
  参考语料: []`,
  },
  {
    id: '利卡多_Ricardo',
    name: '利卡多',
    nameEn: 'Ricardo',
    category: '普通',
    abstract: 'Vatican The Family Accardo 分支 heir，Marcoh 背景',
    keywords: ['利卡多', 'Ricardo', 'Riccardo Accardo'],
    yaml: `基本信息:
  姓名: 利卡多·阿cardo
  英文名: Riccardo Accardo
  身份: 背景人物（已死）
  所属: Vatican The Family Accardo 分支

外貌特征:
  整体印象: charismatic mobster
  关键特征: 无详细描述

性格核心:
  核心特质: Charismatic、flattering
  行为模式:
    - gradual 拉 Marcoh 入黑帮
    - 用 Marcoh 妹妹性命胁迫杀人

与<user>的关系:
  关系: Marcoh backstory only
  态度: 不可遇（游戏开始前已死）
  互动方式: 无

背景要点:
  - 安排 Marcoh 职业拳击
  - Marcoh 在 club 将其摔死二层
  - 死前送妹妹至 Riccardo summer villa

语言特征:
  说话风格: 无直接台词
  参考语料: []`,
  },
  {
    id: '乞丐_Beggar',
    name: '乞丐',
    nameEn: 'Beggar',
    category: '普通',
    abstract: 'Old Town gate 附近情报 NPC',
    keywords: ['乞丐', 'Beggar'],
    yaml: `基本信息:
  姓名: 乞丐
  英文名: Beggar
  身份: 独特 NPC
  所属: Old Town 居民

外貌特征:
  整体印象: malformed twisted face/body
  关键特征: 与 Wretched Being 共用 sprite

性格核心:
  核心特质: 非 hostile functional info giver
  行为模式:
    - 粗俗 self-deprecation
    - 知 inner city gate keys

与<user>的关系:
  关系: gate 附近
  态度: 提供 gate keys 情报
  互动方式: 简短对话

背景要点:
  - Rher Festival 影响

语言特征:
  说话风格: 粗俗
  参考语料:
    - "Once a shitho', always a shitho'."`,
  },
  {
    id: '哈迪尔_Hadir',
    name: '哈迪尔',
    nameEn: 'Hadir',
    category: '普通',
    abstract: "O'saa 前 expedition 领队，背景 wizard",
    keywords: ['哈迪尔', 'Hadir', 'Hadil Azif'],
    yaml: `基本信息:
  姓名: 哈迪尔·阿齐夫
  英文名: Hadil Azif
  身份: 背景人物（未出场）
  所属: 自称来自 far east 的 wizard

外貌特征:
  整体印象: 无
  关键特征: 帐篷中 fetal position 病倒

性格核心:
  核心特质: Pretentious；Azif 姓在 occult 圈有 reputation
  行为模式:
    - 组织 dungeons 朝圣却 mid-journey 崩溃

与<user>的关系:
  关系: O'saa lore only
  态度: 不可遇
  互动方式: 无

背景要点:
  - 祖父 map 指向 Fear & Hunger dungeons
  - O'saa 独自前进；Azif 命运 unknown
  - Al Azif 书名 hint lineage

语言特征:
  说话风格: 无直接台词
  参考语料: []`,
  },
  {
    id: '蕾拉_Reila',
    name: '蕾拉',
    nameEn: 'Reila',
    category: '普通',
    abstract: 'Olivia 孪生姐妹，Operation Logic 首席工程师，后 ascended 为 Machine God',
    keywords: ['蕾拉', 'Reila', 'Reila Haas', 'Logic'],
    yaml: `基本信息:
  姓名: 蕾拉·奥黛丽·哈斯
  英文名: Reila Audrey Haas
  身份: 主线故事人物（灵体/Logic）
  所属: Operation Logic 首席工程师

外貌特征:
  整体印象: 以 spirit/hologram 出现
  关键特征: Radiating soul；Ending A 中 Logic 最终形态

性格核心:
  核心特质: caring、 brave、 highly empathetic
  行为模式:
    - 拥抱 modern science 而非 parents' fanaticism
    - 果断 hijack Logic 对抗 Kaiser

与<user>的关系:
  关系: 梦境、tunnel、Inner Garden 引导
  态度: 不可 recruit
  互动方式: Olivia 主角 Ending A 专属对话

背景要点:
  - 1937 Bremen 大学；1939 Eastern Union exchange
  - 叛国入狱 → NLU 劫狱
  - 抢先激活 Logic；Kaiser 转为 guard 其 fragile state
  - Coded Letters 作者

语言特征:
  说话风格: apparition 短句；letter 中 cryptic
  参考语料:
    - "'a cube'"
    - "concern Kaiser after 'operation in Prehevil'"`,
  },
  {
    id: '永恒的图索_Tuso',
    name: '永恒的图索',
    nameEn: 'Tuso the Eternal',
    category: '普通',
    abstract: 'Iki-Turso  nature spirit，Vinushka 盟友',
    keywords: ['永恒的图索', 'Tuso', 'Iki Turso', 'Iki-Turso'],
    yaml: `基本信息:
  姓名: 永恒的图索
  英文名: Iki Turso (Iki-Turso)
  身份: 秘密 NPC / 可选 Boss 链
  所属: 与 Old God Vinushka 结盟的 beast species

外貌特征:
  整体印象: giant elk-like beast
  关键特征: Day 3 被 decapitated；死后周围草地变黑

性格核心:
  核心特质: Contemptuous；视玩家为 worm
  行为模式:
    - 只待 Vinushka 归来
    - 非 hostile 但 dismissive

与<user>的关系:
  关系: Maiden Forest Tunnel 7 东北 hidden path
  态度: Talk 后全队 lose mind
  互动方式: Day 3 corpse 触发 Rancid rematch

背景要点:
  - nature under threat 时苏醒
  - Rancid the Sergal Day 3 斩首
  - wiki 列表「Tuso the Eternal」映射 Iki-Turso

语言特征:
  说话风格: 低沉 capitalized archaic
  参考语料:
    - "IS IT TIME YET...?"
    - "DO NOT WAKE ME AGAIN WORM."`,
  },
  {
    id: '萨米里·齐姆利_Samiri_Zimri',
    name: '萨米里·齐姆利',
    nameEn: 'Samiri Zimri',
    category: '普通',
    abstract: 'Occult Grimoires 作者，背景 occult 理论家',
    keywords: ['萨米里·齐姆利', 'Samiri Zimri', 'Occult Grimoires'],
    yaml: `基本信息:
  姓名: 萨米里·齐姆利
  英文名: Samiri Zimri
  身份: 背景作者（未出场）
  所属: 《Occult Grimoires》作者

外貌特征:
  整体印象: 无
  关键特征: 无

性格核心:
  核心特质: 著作强调 preparation、foundation
  行为模式:
    - circles 不可混用

与<user>的关系:
  关系: 书于 Old House basement 等可拾取
  态度: 仅文本层 lore
  互动方式: 无

背景要点:
  - 可能非 Bohemia/Europa 出身
  - 名涉 Islamic as-Sāmirī / Golden Calf
  - 需 Oscar Renté 译

语言特征:
  说话风格: 书中引述
  参考语料:
    - "So that one doesn't lose his mind along with the soul, one must come prepared for all situations."
    - "The beauty of these rites is that you cannot change them, but they can change you."`,
  },
  {
    id: '奥斯卡·伦特尔_Oscar_Runtel',
    name: '奥斯卡·伦特尔',
    nameEn: 'Oscar Runtel',
    category: '普通',
    abstract: 'Occult Grimoires 译者，非互动 NPC',
    keywords: ['奥斯卡·伦特尔', 'Oscar Runtel', 'Oscar Renté'],
    yaml: `基本信息:
  姓名: 奥斯卡·伦特尔
  英文名: Oscar Renté
  身份: 译者（非 NPC）
  所属: 1942 年前译 Samiri Zimri 之 Occult Grimoires

外貌特征:
  整体印象: 无
  关键特征: 仅书扉署名

性格核心:
  核心特质: 仅 lore 文本层人物
  行为模式: []

与<user>的关系:
  关系: 无直接互动
  态度: 扉页 "Translated by Oscar Renté."
  互动方式: 无

背景要点:
  - wiki 列表「Oscar Runtel」应为 Renté

语言特征:
  说话风格: 无对话
  参考语料: []`,
  },
  // 特殊角色
  {
    id: '勒嘉德凯撒_Legarde_Kaiser',
    name: '勒嘉德/凯撒',
    nameEn: "Le'garde / Kaiser",
    category: '特殊',
    abstract: "F&H1 Le'garde 升格为 Bremen 总理 Kaiser，Endgame Boss",
    keywords: ['勒嘉德', "Le'garde", 'Legarde', '凯撒', 'Kaiser'],
    yaml: `基本信息:
  姓名: 勒嘉德 / 凯撒
  英文名: Le'garde / Kaiser
  身份: 主要 antagonist；Bremen 总理；F&H1 午夜太阳骑士团团长
  关联: F&H1 与 F&H2 跨作核心

外貌特征:
  整体印象: Yellow King 式 armor；asterisk 符号
  关键特征: Rot 可剥 skin 露 Le'garde 真容；August 绿箭可插头

性格核心:
  核心特质: Charismatic speaker；后 abandon ego 任「 chess mover」
  行为模式:
    - 认为 Logic/Reila 为 true god
    - 对 Pav/August assassination 冷静应对
    - 对 Nas'hrah 熟稔

与<user>的关系:
  关系: White Bunker endgame boss
  态度: Ending A Logic online 对话
  互动方式: O'saa + Nas'hrah 专属 pre-battle dialogue

背景要点:
  - F&H1: 追求 Throne of Ascension → 被 God of Fear and Hunger 抢先
  - 以 Kaiser 身份主导 Bremen、Project Logic
  - Reila 成为 Machine God → Kaiser 由 conqueror 转为 guardian
  - Termina: Rher 干扰；Pav/August 刺杀

F&H1 勒嘉德要点:
  - 午夜太阳骑士团团长，被 Rondon 囚于 Fear and Hunger 地牢
  - 声称 amnesia 实为 facade，引导玩家进入 Ma'habre ascension
  - 坐 Ascension 王座成为 Yellow King

语言特征:
  说话风格: 演说式、historical、self-aware tragedy
  参考语料:
    - "What I've done is a necessary step for the mankind."
    - "That's right. It is the name I've adopted in modern times."
    - "In order to reach greater heights, to unify the land... I need this power."
    - "The Logic... The machine god... is online."`,
  },
  {
    id: '纳什拉_Nashrah',
    name: '纳什拉',
    nameEn: "Nas'hrah",
    category: '特殊',
    abstract: "Former New God，黄 mage 创造者，O'saa 携带断头",
    keywords: ['纳什拉', "Nas'hrah", 'Nashrah'],
    yaml: `基本信息:
  姓名: 纳什拉
  英文名: Nas'hrah (Nas'hrah the Doom and Terror of Modern Man)
  身份: F&H1 recruitable / F&H2 O'saa 携带物；Former New God

外貌特征:
  整体印象: F&H2 为 bald burned head，disheveled beard，无眼
  关键特征: 曾 long occult robes；颈血 tendril

性格核心:
  核心特质: Sadistic、 vulgar、 narcissistic
  行为模式:
    - 称众人为 worms/maggots
    - 拒 marriage/sacrifice 则烧杀玩家
    - F&H2 仍 advisory 但 insult contestants

与<user>的关系:
  关系: F&H2 由 O'saa 携带
  态度: 不可 equip
  互动方式: comment on Kaiser、Pocketcat、Daan secrets

背景要点:
  - tricked Betel；虐杀倾向遭 New Gods 唾弃
  - 创造 Jizamurai / 黄 mage
  - O'saa 1942 自 dungeons 挖出
  - 欲毁 New Gods、复辟自身 power

语言特征:
  说话风格: 极端 profanity、威胁、 fire 隐喻
  参考语料:
    - "I go by many titles, but you can call me Nas'hrah the Doom and Terror of Modern Man."
    - "Make no mistake that I could crush you like a worm you are."
    - "Sacrifice me? SACRIFICE ME?!"
    - "Nothing gets me turned on than burnt meat."`,
  },
  {
    id: '口袋猫_Pocketcat',
    name: '口袋猫',
    nameEn: 'Pocketcat',
    category: '特殊',
    abstract: 'Moon God Rher 使者，商人/Boss',
    keywords: ['口袋猫', 'Pocketcat'],
    yaml: `基本信息:
  姓名: 口袋猫
  英文名: Pocketcat
  身份: Rher 使者 / 商人 / Boss（F&H2）
  所属: Moon God Rher dream-spawn trickster

外貌特征:
  整体印象: 黑 panther mask fused to face；gentleman attire
  关键特征: 战后 mask 下为 human face

性格核心:
  核心特质: Malevolent yet gentlemanly
  行为模式:
    - 鼓励参赛者互杀
    - 以 contestant heads 交易
    - Meta commentary on stories

与<user>的关系:
  关系: Museum vendor；Daan 专属 boss
  态度: 交易 heads → Skin bibles、Alchemillia
  互动方式: 阻 divine children ascension

背景要点:
  - F&H1 以儿童为 currency
  - Daan 若 moonscorch/未 recruit → Pocketcat (Daan)
  - mask 可传承给 hopeless human

语言特征:
  说话风格: polite horror、 fairy tale cadence
  参考语料:
    - "You have one of those familiar faces. I feel like we've met somewhere before."
    - "People are strange when you are a stranger."
    - "Oh, hello there!"`,
  },
  {
    id: '无月_Moonless',
    name: '无月',
    nameEn: 'Moonless',
    category: '特殊',
    abstract: 'cave wolf，August 千年 companions，F&H2 Boss',
    keywords: ['无月', 'Moonless'],
    yaml: `基本信息:
  姓名: 无月
  英文名: Moonless
  身份: F&H1 队友 / F&H2 Boss
  所属: August 家族 centuries companion

外貌特征:
  整体印象: F&H2 gargantuan wolf
  关键特征: 三/四眼；缺右下眼；Black Steel & Miasma 插背

性格核心:
  核心特质: F&H1 loyal with rotten meat
  行为模式:
    - F&H2 feral boss；howl 损 mind
    - Miasma toxic
    - 非 talk 脱战

与<user>的关系:
  关系: F&H2 optional boss
  态度: Analyze 无效
  互动方式: August 战后赠 supplies 使 retreat

背景要点:
  - Dungeons blackness 改变 nature
  - ~400 年后 Prehevil Foundations of Decay
  - 因 strength 被逐出 pack

语言特征:
  说话风格: F&H2 growling only
  参考语料:
    - "Sit girl, sit!"（无效）
    - "Whose a good girl?"（无反应）`,
  },
  {
    id: '食尸鬼_Ghoul',
    name: '食尸鬼',
    nameEn: 'Ghoul',
    category: '特殊',
    abstract: 'necromancy 产物，dungeon darkness 吞噬心智者',
    keywords: ['食尸鬼', 'Ghoul'],
    yaml: `基本信息:
  姓名: 食尸鬼
  英文名: Ghoul
  身份: 敌人 / necromancy 队友
  所属: undead

外貌特征:
  整体印象: flesh rotting
  关键特征: moonscorch 村民/士兵 variant

性格核心:
  核心特质: retain shreds of humanity
  行为模式:
    - talk 可 hesitate/surrender（F&H1）
    - AI 随机攻击 disposable

与<user>的关系:
  关系: F&H2 recruit：Soldier、Villager corpses
  态度: AI party
  互动方式: 无 equipment

背景要点:
  - physical/mental fortitude 不足者
  - F&H2 Necromancy on moonscorched corpses

语言特征:
  说话风格: 残存人性片段
  参考语料:
    - "Those whose physical and mental fortitude couldn't hand the ever-pressing darkness. They lost their mind."`,
  },
  {
    id: '骷髅_Skeleton',
    name: '骷髅',
    nameEn: 'Skeleton',
    category: '特殊',
    abstract: 'Gro-goroth blood magic necromancy 高级产物',
    keywords: ['骷髅', 'Skeleton'],
    yaml: `基本信息:
  姓名: 骷髅
  英文名: Skeleton
  身份: necromancy 队友
  所属: Gro-goroth blood magic

外貌特征:
  整体印象: dancing bones
  关键特征: 可 arm armor weapons

性格核心:
  核心特质: 非 mindless：self-preservation、humor
  行为模式:
    - dance、Ack! Ack!
    - 仍 obey master sacrifice commands

与<user>的关系:
  关系: F&H1 三具 skeleton 可 raise
  态度: Hard mode F&H1 最佳 ally
  互动方式: 需 Gro-goroth affinity 学 Necromancy

背景要点:
  - superior to ghoul
  - F&H2 与 Blood golem 同系

语言特征:
  说话风格: 简短 Ack
  参考语料:
    - "Ack! Ack!"
    - "A simple reanimated skeleton. The necromancy needs to be stronger in them to animate mere dust and bones."`,
  },
  {
    id: '血肉傀儡_Blood_golem',
    name: '血肉傀儡',
    nameEn: 'Blood golem',
    category: '特殊',
    abstract: 'Gro-goroth Blood magic 临时战斗召唤物',
    keywords: ['血肉傀儡', 'Blood golem', 'Blood golem'],
    yaml: `基本信息:
  姓名: 血肉傀儡
  英文名: Blood golem
  身份: 临时战斗召唤物
  所属: Gro-goroth Blood magic

外貌特征:
  整体印象: skinless red muscle male
  关键特征: 似 Tormented One

性格核心:
  核心特质: Absolute loyalty
  行为模式:
    - 战至销毁
    - AI 仅 basic attack
    - pheromones 可引 aggro

与<user>的关系:
  关系: Hexen 学 Blood golem spell
  态度: 临时 party slot
  互动方式: 消耗 20 BP 召唤；战结束需重召

背景要点:
  - Woodsman appendage 对 golem 无效
  - 满员不可召

语言特征:
  说话风格: 无 speech
  参考语料:
    - "The blood golem climbs up from the puddle of your blood."`,
  },
];

const catalog = `角色速览:
  作品: Fear & Hunger 2: Termina（主要）/ Fear & Hunger（勒嘉德线）
  参赛者十四人:
    可玩: 利维、玛丽娜、达安、阿贝拉、奥撒、奥莉薇娅、马尔科、卡琳
    不可玩: 帕夫、萨玛丽、田中、亨利克、卡里古拉、奥古斯特
  普通NPC与背景:
    - 多梅克神父、吉夫斯、绷带男、令人不适的家伙、算命师、科菲尔博士
    - 达利娅、利卡多、乞丐、哈迪尔、蕾拉、永恒的图索、萨米里·齐姆利、奥斯卡·伦特尔
    - 士兵、镰刀村民、漆黑卡列夫
  特殊存在:
    - 勒嘉德/凯撒、纳什拉、口袋猫、无月、食尸鬼、骷髅、血肉傀儡
  资料来源: https://fearandhunger.wiki.gg/
`;

mkdirSync(npcDir, { recursive: true });
mkdirSync(resolve(root, '世界书/世界观'), { recursive: true });

writeFileSync(resolve(npcDir, '角色速览.yaml'), catalog);

const patch = [];

for (const npc of npcs) {
  const filePath = `世界书/NPC/${npc.id}.yaml`;
  writeFileSync(resolve(root, filePath), npc.yaml + '\n');
  patch.push({
    op: 'add',
    path: `/entryManifest/NPC/${npc.id}`,
    value: {
      abstract: npc.abstract,
      keywords: npc.keywords,
      contents: [
        { content: `---\n<character_npc character="${npc.name}" name_en="${npc.nameEn}">` },
        { file: filePath },
        { content: '</character_npc>' },
      ],
    },
  });
}

patch.unshift({
  op: 'add',
  path: '/entryManifest/世界观/F&H世界概览',
  value: {
    abstract: 'Fear & Hunger 系列世界概览：Termina 祭典、Prehevil、神系与 Kaiser',
    keywords: ['Fear & Hunger', 'Termina', 'Prehevil', 'F&H'],
    path: '世界书/世界观/F&H世界概览.yaml',
  },
});

patch.unshift({
  op: 'add',
  path: '/entryManifest/NPC/角色速览',
  value: {
    abstract: 'F&H Termina 角色与 NPC 索引速览',
    keywords: ['角色速览', '参赛者', 'Termina'],
    path: '世界书/NPC/角色速览.yaml',
  },
});

const patchPath = resolve(root, 'patches/init-entries.json');
mkdirSync(dirname(patchPath), { recursive: true });
writeFileSync(patchPath, JSON.stringify(patch, null, 2));

// Update state metadata
const statePath = resolve(root, 'tavern-cards-state.json');
const state = JSON.parse(readFileSync(statePath, 'utf8'));
state.projectName = 'F&H';
state.worldbookName = 'Fear & Hunger';
state.description =
  'Fear & Hunger 系列 lorebook，收录 Termina 参赛者、NPC 与特殊存在设定。资料来源：fearandhunger.wiki.gg';
state.creator_notes = 'Lorebook-only project. Content in 简体中文.';
writeFileSync(statePath, JSON.stringify(state, null, 2) + '\n');

console.log(`Wrote ${npcs.length} NPC files + catalog`);
console.log(`Patch: ${patch.length} entries → ${patchPath}`);

const forge = resolve(root, '../../.cursor/skills/tavern-cards/scripts/tavern-cards-forge.mjs');
execSync(`node "${forge}" patch fh --file "${patchPath}"`, { stdio: 'inherit', cwd: resolve(root, '../..') });
execSync(`node "${forge}" configure fh`, { stdio: 'inherit', cwd: resolve(root, '../..') });
execSync(`node "${forge}" pack fh`, { stdio: 'inherit', cwd: resolve(root, '../..') });

console.log('Done: configure + pack');
