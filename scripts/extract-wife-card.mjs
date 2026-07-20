import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const sourcePath = path.join(root, '素材', '住进我家的未婚妻.json');
const card = JSON.parse(fs.readFileSync(sourcePath, 'utf8'));
const data = card.data ?? card;
const entries = data.character_book?.entries ?? [];

const cardsRoot = path.join(root, 'cards', 'wife');
const srcRoot = path.join(root, '备份工作区', 'wife');

const entryTypeMap = {
  '[InitVar]初始化': { type: 'MVU', part: 'initvar', dir: '变量' },
  '核心变量（MVU模式）': { type: 'MVU', part: 'update_rules', dir: '变量' },
  '凌月-角色信息': { type: '角色', part: 'basic', dir: '角色/凌月' },
  '凌月-对话补充': { type: '角色', part: 'personality', dir: '角色/凌月' },
  '凌月-亲密档案': { type: '角色', part: 'other', dir: '角色/凌月' },
  '凌月-角色采访': { type: '角色', part: 'other', dir: '角色/凌月', rephrase: true },
  '世界观-同居考验：月度生活费规则': { type: '世界观', dir: '世界观' },
  '世界观-真实的物价体系': { type: '世界观', dir: '世界观' },
  '扮演指导-核心扮演指导': { type: '扮演准则', dir: '扮演准则' },
  '扮演指导-反女王化行为矫正协议': { type: '扮演准则', dir: '扮演准则', rephrase: true },
  '扮演指导-财务行为准则': { type: '扮演准则', dir: '扮演准则' },
  '[主控制器]多阶段人设': { type: 'EJS预处理', dir: 'EJS' },
  '分阶段人设-观察试探': { type: '角色', part: 'personality', dir: '角色/凌月/阶段' },
  '分阶段人设-友达以上': { type: '角色', part: 'personality', dir: '角色/凌月/阶段' },
  '分阶段人设-心意萌动': { type: '角色', part: 'personality', dir: '角色/凌月/阶段' },
  '分阶段人设-默契相伴': { type: '角色', part: 'personality', dir: '角色/凌月/阶段' },
};

function safeName(comment) {
  return comment
    .replace(/^\[.*?\]/, '')
    .replace(/[：:]/g, '_')
    .replace(/[^\w\u4e00-\u9fff_-]/g, '')
    .trim();
}

function writeFile(relDir, filename, content) {
  for (const base of [path.join(cardsRoot, '世界书', relDir), path.join(srcRoot, '世界书', relDir)]) {
    fs.mkdirSync(base, { recursive: true });
    fs.writeFileSync(path.join(base, filename), content, 'utf8');
  }
}

// source archive
fs.mkdirSync(path.join(cardsRoot, 'source'), { recursive: true });
fs.copyFileSync(sourcePath, path.join(cardsRoot, 'source', '住进我家的未婚妻.json'));

// initvar from entry 0
const initEntry = entries.find(e => e.comment?.includes('[InitVar]'));
if (initEntry) {
  const initObj = JSON.parse(initEntry.content);
  const initYaml = `# yaml-language-server: $schema=../../schema.json\n# 从素材 JSON 提取，MVU 数组格式 [值, 描述]\n${JSON.stringify(initObj, null, 2).replace(/^/gm, '').trim()}\n`;
  // keep as JSON-compatible yaml structure - use JSON in yaml file for MVU array format
  fs.mkdirSync(path.join(srcRoot, '世界书', '变量'), { recursive: true });
  fs.mkdirSync(path.join(cardsRoot, '世界书', '变量'), { recursive: true });
  const initContent = `# yaml-language-server: $schema=../../schema.json\n# 从素材「住进我家的未婚妻.json」提取\n${toYamlLike(initObj)}\n`;
  fs.writeFileSync(path.join(srcRoot, '世界书', '变量', 'initvar.yaml'), initContent);
  fs.writeFileSync(path.join(cardsRoot, '世界书', '变量', 'initvar.yaml'), initContent);
}

function toYamlLike(obj, indent = 0) {
  const pad = '  '.repeat(indent);
  if (Array.isArray(obj)) {
    if (obj.length === 2 && typeof obj[1] === 'string') {
      return `[${typeof obj[0] === 'number' ? obj[0] : JSON.stringify(obj[0])}, ${JSON.stringify(obj[1])}]`;
    }
    return `[${obj.map(v => (typeof v === 'object' ? '\n' + pad + '  ' + toYamlLike(v, indent + 1) : JSON.stringify(v))).join(', ')}]`;
  }
  if (obj && typeof obj === 'object') {
    return Object.entries(obj)
      .map(([k, v]) => {
        if (typeof v === 'object' && v !== null) {
          return `${pad}${k}:\n${toYamlLike(v, indent + 1)
            .split('\n')
            .map((line, i) => (i === 0 && !line.startsWith('  ') ? pad + '  ' + line.trim() : line))
            .join('\n')}`;
        }
        return `${pad}${k}: ${JSON.stringify(v)}`;
      })
      .join('\n');
  }
  return JSON.stringify(obj);
}

// worldbook entries
const planningEntries = [];
for (const entry of entries) {
  const comment = entry.comment ?? `entry_${entry.id}`;
  const meta = entryTypeMap[comment] ?? { type: '事件', dir: '提取' };
  const baseName = safeName(comment) || `entry_${entry.id}`;
  const ext = meta.type === 'EJS预处理' || comment.includes('主控制器') ? 'txt' : 'yaml';
  const filename = `${baseName}.${ext}`;
  const relDir = meta.dir ?? '提取';

  let content = entry.content;
  if (meta.part === 'initvar') continue;
  if (comment === '核心变量（MVU模式）') {
    fs.mkdirSync(path.join(srcRoot, '世界书', '变量'), { recursive: true });
    fs.mkdirSync(path.join(cardsRoot, '世界书', '变量'), { recursive: true });
    fs.writeFileSync(path.join(srcRoot, '世界书', '变量', '变量更新规则.yaml'), content.trim() + '\n');
    fs.writeFileSync(path.join(cardsRoot, '世界书', '变量', '变量更新规则.yaml'), content.trim() + '\n');
  } else {
    writeFile(relDir, filename, content.trim() + '\n');
  }

  planningEntries.push({
    name: baseName,
    type: meta.type,
    path: `世界书/${relDir}/${filename}`,
    ...(meta.part ? { part: meta.part } : {}),
    ...(meta.rephrase ? { rephrase: true } : {}),
    purpose: comment,
    keywords: entry.keys?.length ? entry.keys : undefined,
    enabled: entry.enabled !== false,
    constant: entry.constant === true,
    source_id: entry.id,
  });
}

// first message
const firstMes = data.first_mes ?? card.first_mes ?? '';
fs.mkdirSync(path.join(srcRoot, '第一条消息'), { recursive: true });
fs.mkdirSync(path.join(cardsRoot, '开场白'), { recursive: true });
fs.writeFileSync(path.join(srcRoot, '第一条消息', '0.txt'), firstMes);
fs.writeFileSync(path.join(cardsRoot, '开场白', '0.txt'), firstMes);

// status bar regex html extract
const statusRegex = data.extensions?.regex_scripts?.find(r => r.scriptName === '状态栏');
if (statusRegex) {
  const m = statusRegex.replaceString.match(/```html\n([\s\S]*?)```/);
  if (m) {
    fs.mkdirSync(path.join(srcRoot, '正则'), { recursive: true });
    fs.mkdirSync(path.join(cardsRoot, '正则'), { recursive: true });
    fs.writeFileSync(path.join(srcRoot, '正则', '状态栏界面.html'), m[1]);
    fs.writeFileSync(path.join(cardsRoot, '正则', '状态栏界面.html'), m[1]);
  }
}

// 创作规划.yaml
const planning = {
  project: {
    name: 'wife',
    worldbookName: '住进我家的未婚妻',
    form: 'charactercard',
    mvu: true,
    ejs: true,
    source: '素材/住进我家的未婚妻.json',
    displayName: data.name ?? card.name,
  },
  world: {
    overview:
      '现代都市高中背景，指腹为婚的未婚妻凌月搬入<user>家中同居。父母每月各给2000元生活费作为独立生活考验，物价锚定2024年中国二线城市现实标准。',
    regions: [{ name: '<user>家', scenes: ['客厅', '玄关', '厨房', '卧室'], description: '两人同居的主要活动空间' }],
  },
  characters: [
    {
      name: '凌月',
      basic: {
        age: 18,
        gender: '女',
        identity: '高中生，<user>的同班同学兼未婚妻',
        relationship: '指腹为婚，刚搬入同居',
      },
      appearance: ['黑色齐耳短发', '墨黑眼瞳', '158cm娇小身材', '外貌显幼'],
      personality: {
        base: '聪明',
        main: ['坦率', '腹黑', '爱捉弄'],
        accent: ['好奇'],
        stages: [
          { name: '观察试探', threshold: '<101', main: ['警惕', '试探'] },
          { name: '友达以上', threshold: '101-200', main: ['倾诉', '笨拙关心'] },
          { name: '心意萌动', threshold: '201-300', main: ['主动付出', '索求亲昵'] },
          { name: '默契相伴', threshold: '>=301', main: ['默契', '信任'] },
        ],
      },
      tri_faceted: { needed: true, facets: [{ trigger: '学校/面对追求者', mode: '礼貌疏远' }, { trigger: '家中/与<user>独处', mode: '爱捉弄的小恶魔' }] },
    },
  ],
  style: {
    perspective: '第三人称',
    tone: '口语化、日常',
    mood: '温馨带捉弄',
  },
  mvu: {
    structure: `顶层结构：
├── 世界
│   ├── 年份
│   ├── 日期
│   └── 时间
├── user
│   └── 生活费
└── 凌月
    ├── 生活费
    └── 对user的好感度`,
    variables: [
      { path: '世界.年份[0]', type: 'number', description: '公元年份' },
      { path: '世界.日期[0]', type: 'string', description: 'mm月dd日' },
      { path: '世界.时间[0]', type: 'string', description: '24小时制 hh:mm' },
      { path: 'user.生活费[0]', type: 'number', description: 'user当月剩余生活费' },
      { path: '凌月.生活费[0]', type: 'number', description: '凌月当月剩余生活费' },
      { path: '凌月.对user的好感度[0]', type: 'number', range: '0~400', description: '好感度，驱动多阶段人设' },
    ],
  },
  ejs: {
    entries: [
      {
        name: '多阶段人设主控制器',
        complexity: '条目显隐',
        condition: '根据凌月.对user的好感度[0]加载对应阶段条目',
        stages: ['观察试探', '友达以上', '心意萌动', '默契相伴'],
      },
    ],
  },
  first_messages: [{ format: 'narrative', file: '开场白/0.txt', scene: '凌月搬入当天午后' }],
  entries: planningEntries,
};

fs.writeFileSync(path.join(cardsRoot, '创作规划.yaml'), stringifyPlanning(planning));

function stringifyPlanning(obj) {
  const lines = [];
  lines.push('# wife 角色卡创作规划');
  lines.push('# 从 素材/住进我家的未婚妻.json 结构化提取');
  lines.push('# 状态：已提取原文，待按 tavern-cards 规则改写与注册');
  lines.push('');
  lines.push(`project:`);
  lines.push(`  name: ${planning.project.name}`);
  lines.push(`  worldbookName: ${planning.project.worldbookName}`);
  lines.push(`  form: ${planning.project.form}`);
  lines.push(`  mvu: true`);
  lines.push(`  ejs: true`);
  lines.push(`  source: ${planning.project.source}`);
  lines.push('');
  lines.push('world:');
  lines.push(`  overview: ${JSON.stringify(planning.world.overview)}`);
  lines.push('');
  lines.push('characters:');
  for (const c of planning.characters) {
    lines.push(`  - name: ${c.name}`);
    lines.push(`    basic:`);
    for (const [k, v] of Object.entries(c.basic)) lines.push(`      ${k}: ${JSON.stringify(v)}`);
  }
  lines.push('');
  lines.push('style:');
  for (const [k, v] of Object.entries(planning.style)) lines.push(`  ${k}: ${JSON.stringify(v)}`);
  lines.push('');
  lines.push('entries:');
  for (const e of planningEntries) {
    lines.push(`  - name: ${e.name}`);
    lines.push(`    type: ${e.type}`);
    lines.push(`    path: ${e.path}`);
    if (e.part) lines.push(`    part: ${e.part}`);
    if (e.rephrase) lines.push(`    rephrase: true`);
    lines.push(`    purpose: ${JSON.stringify(e.purpose)}`);
    if (e.keywords) lines.push(`    keywords: [${e.keywords.map(k => JSON.stringify(k)).join(', ')}]`);
  }
  return lines.join('\n') + '\n';
}

// cleanup wrongly placed files from partial template copy
const wrongVarDir = path.join(srcRoot, '变量');
if (fs.existsSync(wrongVarDir)) {
  fs.rmSync(wrongVarDir, { recursive: true, force: true });
}

console.log('Extracted', planningEntries.length, 'worldbook entries to 备份工作区/wife');
