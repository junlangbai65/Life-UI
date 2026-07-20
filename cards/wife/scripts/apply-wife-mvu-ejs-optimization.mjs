/**
 * 应用 wife MVU/EJS 优化：@@if 门控、快照分层注入。
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const wifeRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const statePath = path.join(wifeRoot, 'tavern-cards-state.json');
const state = JSON.parse(fs.readFileSync(statePath, 'utf8'));

const CORE = '世界书/EJS/变量快照_核心.txt';
const CAL = '世界书/EJS/变量快照_校历.txt';

const G = {
  ntr1: "(Array.isArray(v=getvar('stat_data.凌月.NTR阶段',{defaults:0}))?v[0]:v)>=1",
  aff101:
    "(Array.isArray(v=getvar('stat_data.凌月.对user的好感度',{defaults:0}))?v[0]:v)>=101",
  aff201:
    "(Array.isArray(v=getvar('stat_data.凌月.对user的好感度',{defaults:0}))?v[0]:v)>=201",
  lib40: "(Array.isArray(v=getvar('stat_data.凌月.性欲',{defaults:0}))?v[0]:v)>=40",
  corr20: "(Array.isArray(v=getvar('stat_data.凌月.堕落',{defaults:0}))?v[0]:v)>=20",
  grad0:
    "(Array.isArray(v=getvar('stat_data.世界.距毕业天数',{defaults:652}))?v[0]:v)<=0",
};

function replaceSnapshotFiles(contents, { calendar = false } = {}) {
  const files = contents.filter(p => p.file).map(p => p.file);
  const nonSnap = contents.filter(p => !p.file || !p.file.includes('变量快照'));
  const snapParts = [{ file: CORE }];
  if (calendar) snapParts.push({ file: CAL });
  const contentParts = nonSnap.filter(p => p.content !== undefined);
  const fileParts = nonSnap.filter(p => p.file && !p.file.includes('变量快照'));
  const firstContent = contentParts.find(p => p.content?.includes('@@if') || p.content?.startsWith('<'));
  const otherContent = contentParts.filter(p => p !== firstContent);
  const out = [];
  if (firstContent) out.push(firstContent);
  out.push(...snapParts);
  out.push(...fileParts);
  out.push(...otherContent);
  return out;
}

function setGateOnOpenTag(contents, gateExpr, openTag) {
  const idx = contents.findIndex(p => p.content === openTag || p.content?.startsWith(openTag));
  if (idx >= 0) {
    contents[idx] = { content: `@@if ${gateExpr}\n${openTag}` };
  }
  return contents;
}

const role = state.entryManifest.角色;

// 快照：角色条目仅核心
for (const name of [
  '凌月_性格调色盘',
  '凌月_三面性',
  '凌月_二次解释',
  '凌月_亲密情感需求',
  '凌月_NTR状态调制',
  '凌月_风险轴调制',
]) {
  role[name].contents = replaceSnapshotFiles(role[name].contents, { calendar: false });
}

role['凌月_二次解释'].contents = setGateOnOpenTag(
  role['凌月_二次解释'].contents,
  `${G.aff101} || matchChatMessages(['捉弄','足','脚','NTR','越界','出轨','偷情','隔壁'])`,
  '<凌月_二次解释>',
);

role['凌月_亲密情感需求'].contents = setGateOnOpenTag(
  role['凌月_亲密情感需求'].contents,
  `${G.aff201} || ${G.lib40}`,
  '<凌月_亲密情感需求>',
);

role['凌月_NTR状态调制'].contents = setGateOnOpenTag(
  role['凌月_NTR状态调制'].contents,
  G.ntr1,
  '<凌月_NTR状态调制>',
);
role['凌月_NTR状态调制'].keywords = ['凌月', 'NTR', '越界', '出轨', '隔壁', '偷情'];

role['凌月_风险轴调制'].contents = setGateOnOpenTag(
  role['凌月_风险轴调制'].contents,
  `${G.lib40} || ${G.corr20} || ${G.ntr1}`,
  '<凌月_风险轴调制>',
);

// EJS预处理：核心+校历
const ejsPrep = state.entryManifest['EJS预处理']['EJS预处理'];
ejsPrep.contents = [
  { content: '@@generate_before' },
  { file: CORE },
  { file: CAL },
  { file: '世界书/EJS/EJS预处理.txt' },
];

// getvar诊断
state.entryManifest['EJS预处理']['getvar诊断'].contents = [
  { file: CORE },
  { file: CAL },
  { file: '世界书/EJS/getvar诊断.txt' },
];

// 玩法指导：核心+校历
state.entryManifest['阶段指导']['玩法指导'].contents = [
  { file: CORE },
  { file: CAL },
  { file: '世界书/阶段指导/玩法指导.txt' },
];

// 毕业结局：@@if + 核心
state.entryManifest['阶段指导']['毕业结局指引'].contents = [
  { content: `@@if ${G.grad0}` },
  { file: CORE },
  { file: '世界书/阶段指导/毕业结局指引.txt' },
];

// 世界观-NTR原型：@@if + path→contents
const ntrProto = state.entryManifest['世界观']['世界观-NTR原型'];
delete ntrProto.path;
ntrProto.contents = [
  {
    content: `@@if ${G.ntr1} || matchChatMessages(['NTR','越界','出轨','偷情','隔壁','暧昧','隔壁房','偷听'])`,
  },
  { file: '世界书/世界观/世界观-NTR原型.yaml' },
];

fs.writeFileSync(statePath, JSON.stringify(state, null, 2) + '\n', 'utf8');
console.log('apply-wife-mvu-ejs-optimization: state updated');
