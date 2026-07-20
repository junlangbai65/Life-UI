/**
 * 完整迁移 wife 项目：
 * 1. 从备份工作区恢复 tavern-cards 标准目录与 state
 * 2. 用新版本角色卡（unpack 扁平条目）覆盖各条目文件内容
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..');
const backupRoot = path.join(repoRoot, '备份工作区/wife');
const cardsRoot = path.join(repoRoot, 'cards/wife');
const srcRoot = path.join(repoRoot, 'src/wife');
const newCardJson = String.raw`c:\Users\Administrator\Downloads\指腹为婚的幼小娇妻 New.json`;
const unpackTemp = path.join(cardsRoot, '.unpack-temp');

/** 新版本 unpack 条目名 → tavern-cards 标准文件路径 */
const ENTRY_TARGETS = {
  凌月_基础信息: '世界书/角色/凌月/基础信息.yaml',
  凌月_性格调色盘: '世界书/角色/凌月/性格调色盘.txt',
  凌月_三面性: '世界书/角色/凌月/三面性.yaml',
  凌月_二次解释: '世界书/角色/凌月/二次解释.yaml',
  凌月_亲密偏好: '世界书/角色/凌月/亲密偏好.yaml',
  凌月_亲密情感需求: '世界书/角色/凌月/亲密情感需求.yaml',
  凌月_NTR状态调制: '世界书/角色/凌月/NTR状态调制.txt',
  凌月_风险轴调制: '世界书/角色/凌月/风险轴调制.txt',
  经济系统: '世界书/扮演准则/经济系统.yaml',
  '[mvu_update]变量输出格式': '世界书/变量/变量输出格式.txt',
  变量列表: '世界书/变量/变量列表.txt',
  '[mvu_update]MVU规则总纲': '世界书/变量/MVU规则总纲.yaml',
  '[InitVar]变量初始值': '世界书/变量/initvar.yaml',
  EJS预处理: '世界书/EJS/EJS预处理.merged.txt',
  getvar诊断: '世界书/EJS/getvar诊断.txt',
  玩法指导: '世界书/阶段指导/玩法指导.txt',
  毕业结局指引: '世界书/阶段指导/毕业结局指引.txt',
  '世界观-节日与校历': '世界书/世界观/世界观-节日与校历.yaml',
  '世界观-NTR原型': '世界书/世界观/世界观-NTR原型.yaml',
};

const REGEX_TARGETS = {
  变量更新中美化: '正则/变量更新中美化.html',
  变量更新美化: '正则/变量更新美化.html',
};

function copyRecursive(src, dest, { exclude = [], excludeDirs = [] } = {}) {
  if (!fs.existsSync(src)) return;
  fs.mkdirSync(dest, { recursive: true });
  for (const name of fs.readdirSync(src)) {
    if (exclude.includes(name)) continue;
    const s = path.join(src, name);
    const d = path.join(dest, name);
    if (fs.statSync(s).isDirectory()) {
      if (excludeDirs.includes(name)) continue;
      copyRecursive(s, d, { exclude, excludeDirs });
    } else fs.copyFileSync(s, d);
  }
}

function stripEntryWrapper(text, entryName) {
  const open = new RegExp(`^<${entryName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}>\\s*`, 'm');
  const close = new RegExp(`\\s*</${entryName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}>\\s*$`, 'm');
  return text.replace(open, '').replace(close, '').trim();
}

function normalizeUserMacros(text) {
  return text
    .replace(/\bUser\b/g, '<user>')
    .replace(/搬进<user>家/g, '搬进<user>家');
}

function readUnpackEntry(name) {
  const file = path.join(unpackTemp, '世界书', `${name}.txt`);
  if (!fs.existsSync(file)) throw new Error(`缺少 unpack 条目: ${name}`);
  return fs.readFileSync(file, 'utf8');
}

function splitEjsMerged(merged) {
  const defineIdx = merged.indexOf("<%_\ndefine('mvuGet'");
  if (defineIdx < 0) throw new Error('无法拆分 EJS 合并内容');
  const snapshot = merged.slice(0, defineIdx).replace(/^@@generate_before\s*/m, '').trim();
  const defines = merged.slice(defineIdx).trim();
  return { snapshot, defines };
}

console.info('[migrate] 1/6 unpack 新版本角色卡到临时目录');
fs.rmSync(unpackTemp, { recursive: true, force: true });
execSync(
  `node "${path.join(repoRoot, '.cursor/skills/tavern-cards/scripts/tavern-cards-forge.mjs')}" unpack adhoc --file "${newCardJson}" --output "${unpackTemp}"`,
  { stdio: 'inherit', cwd: repoRoot },
);

console.info('[migrate] 2/6 恢复 tavern-cards 标准目录结构');
for (const dir of ['世界书', '开场白', '正则', '脚本', 'source']) {
  const p = path.join(cardsRoot, dir);
  if (fs.existsSync(p)) fs.rmSync(p, { recursive: true, force: true });
  copyRecursive(path.join(backupRoot, dir), p, {
    excludeDirs: dir === '脚本' ? ['MVU', '变量结构', '状态栏挂载'] : [],
  });
}
for (const file of ['tavern-cards-state.json', 'index.yaml']) {
  fs.copyFileSync(path.join(backupRoot, file), path.join(cardsRoot, file));
}

console.info('[migrate] 3/6 覆盖条目内容（新版本 → 标准路径）');
for (const [entryName, relTarget] of Object.entries(ENTRY_TARGETS)) {
  const raw = readUnpackEntry(entryName);
  const inner = normalizeUserMacros(stripEntryWrapper(raw, entryName));
  const target = path.join(cardsRoot, relTarget);
  fs.mkdirSync(path.dirname(target), { recursive: true });

  if (relTarget === '世界书/EJS/EJS预处理.merged.txt') {
    const { snapshot, defines } = splitEjsMerged(inner.startsWith('@@generate_before') ? inner : `@@generate_before\n${inner}`);
    fs.writeFileSync(path.join(cardsRoot, '世界书/EJS/变量快照.txt'), snapshot + '\n', 'utf8');
    fs.writeFileSync(path.join(cardsRoot, '世界书/EJS/EJS预处理.txt'), defines + '\n', 'utf8');
    continue;
  }

  if (relTarget === '世界书/变量/initvar.yaml') {
    const body = inner.startsWith('# yaml-language-server')
      ? inner
      : `# yaml-language-server: $schema=../../schema.json\n${inner}`;
    fs.writeFileSync(target, body + '\n', 'utf8');
    continue;
  }

  if (relTarget.endsWith('.yaml') || relTarget.endsWith('.txt')) {
    const stripped = inner.replace(/^@@if[^\n]*\n/, '');
    fs.writeFileSync(target, stripped + '\n', 'utf8');
    continue;
  }

  fs.writeFileSync(target, inner + '\n', 'utf8');
}

const firstMes = fs.readFileSync(path.join(unpackTemp, '开场白/0.txt'), 'utf8');
fs.writeFileSync(path.join(cardsRoot, '开场白/0.txt'), firstMes, 'utf8');

for (const [name, rel] of Object.entries(REGEX_TARGETS)) {
  const src = path.join(unpackTemp, '正则', `${name}.txt`);
  if (fs.existsSync(src)) {
    fs.writeFileSync(path.join(cardsRoot, rel), fs.readFileSync(src, 'utf8'), 'utf8');
  }
}

for (const script of ['MVU.txt', 'Zod.txt']) {
  const src = path.join(unpackTemp, '脚本', script);
  if (fs.existsSync(src)) fs.copyFileSync(src, path.join(cardsRoot, '脚本', script));
}

console.info('[migrate] 4/6 同步 schema 与 state 元数据');
if (fs.existsSync(path.join(srcRoot, 'schema.json'))) {
  fs.copyFileSync(path.join(srcRoot, 'schema.json'), path.join(cardsRoot, 'schema.json'));
}
if (fs.existsSync(path.join(srcRoot, 'schema.ts'))) {
  fs.copyFileSync(path.join(srcRoot, 'schema.ts'), path.join(cardsRoot, 'schema.ts'));
}

const state = JSON.parse(fs.readFileSync(path.join(cardsRoot, 'tavern-cards-state.json'), 'utf8'));
const newState = JSON.parse(fs.readFileSync(path.join(unpackTemp, 'tavern-cards-state.json'), 'utf8'));

state.first_messages = ['开场白/0.txt'];
state.create_date = newState.create_date ?? state.create_date;
if (newState.extensions?.tavern_helper?.scripts) {
  state.extensions ??= {};
  state.extensions.tavern_helper ??= { scripts: {} };
  for (const [k, v] of Object.entries(newState.extensions.tavern_helper.scripts)) {
    const existing = state.extensions.tavern_helper.scripts[k] ?? {};
    state.extensions.tavern_helper.scripts[k] = {
      ...existing,
      ...v,
      script_file: existing.script_file ?? v.script_file?.replace(/\\/g, '/'),
    };
  }
}
if (newState.regex_scripts) {
  state.regex_scripts ??= {};
  for (const [k, v] of Object.entries(newState.regex_scripts)) {
    const existing = state.regex_scripts[k] ?? {};
    state.regex_scripts[k] = {
      ...existing,
      ...v,
      replace_file: existing.replace_file ?? v.replace_file?.replace(/\\/g, '/'),
    };
  }
  if (state.regex_scripts['状态栏界面']) {
    state.regex_scripts['状态栏界面'].replace_file = '正则/状态栏界面.html';
  }
  for (const k of ['变量更新中美化', '变量更新美化']) {
    if (state.regex_scripts[k]) state.regex_scripts[k].replace_file = REGEX_TARGETS[k];
  }
}

fs.writeFileSync(path.join(cardsRoot, 'tavern-cards-state.json'), JSON.stringify(state, null, 2) + '\n', 'utf8');

let indexYaml = fs.readFileSync(path.join(cardsRoot, 'index.yaml'), 'utf8');
indexYaml = indexYaml
  .replace(/备份工作区\/wife/g, 'cards/wife')
  .replace(/创作仓库：.*$/m, "备注: 'cards/wife — forge 打包源'");
fs.writeFileSync(path.join(cardsRoot, 'index.yaml'), indexYaml, 'utf8');

console.info('[migrate] 5/6 清理临时目录');
fs.rmSync(unpackTemp, { recursive: true, force: true });

console.info('[migrate] 6/6 完成；请运行 configure / sync Zod / validate-mvu / pack');
