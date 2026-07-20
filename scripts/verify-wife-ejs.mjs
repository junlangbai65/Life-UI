/**
 * wife 项目 EJS 自查：@@if 条件、mvuGet 解包、变量快照分层注入。
 * ST 按世界书条目分块编译 EJS，define() 不跨条目；使用门控变量的条目须注入 变量快照_核心.txt。
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const wifeRoot = path.join(root, 'cards/wife');
const statePath = path.join(wifeRoot, 'tavern-cards-state.json');
const corePath = path.join(wifeRoot, '世界书/EJS/变量快照_核心.txt');
const calPath = path.join(wifeRoot, '世界书/EJS/变量快照_校历.txt');
const coreMarker = "if (typeof mvuGet === 'undefined')";
const calMarker = 'if (typeof resolveFestival === \'undefined\')';
const coreFragment = '世界书/EJS/变量快照_核心.txt';
const calFragment = '世界书/EJS/变量快照_校历.txt';
const calendarEntries = new Set(['EJS预处理', '玩法指导', 'getvar诊断']);
const tupleUnwrapPattern = /Array\.isArray\(v=getvar\(/;
const defineVarPattern =
  /<%[_\s=].*\b(affection|gradDays|ntrStage|sceneType|libido|corruption|exposure|vacation|festival|weekday|relationForm|ntrTarget|virginityTo|ntrCooldown|libidoTier|corruptionTier|isNtrTargetRecord|sceneIncludes|userSexCount|ntrCrossCount)\b/;

const VARIABLE_GATE_ENTRIES = new Set([
  '凌月_NTR状态调制',
  '凌月_风险轴调制',
  '凌月_亲密情感需求',
]);

const DUPLICATE_GUARD_PATTERNS = [
  { gate: /ntrStage/, body: /if\s*\(\s*ntrStage\s*>=\s*1/ },
  { gate: /gradDays/, body: /if\s*\(\s*gradDays\s*<=\s*0/ },
  {
    gate: /libido|corruption|ntrStage/,
    body: /if\s*\(\s*libido\s*>=\s*40\s*\|\|\s*corruption\s*>=\s*20\s*\|\|\s*ntrStage\s*>=\s*1/,
  },
  {
    gate: /ntrCooldown|NTR对象/,
    body: /if\s*\(\s*ntrStage\s*>=\s*1\s*\|\|\s*ntrCooldown\s*>\s*0\s*\|\|\s*isNtrTargetRecord/,
  },
];

const errors = [];
const warnings = [];

function hasCoreBootstrap(text) {
  return text.includes(coreMarker);
}

function needsSnapshotBootstrap(text) {
  return defineVarPattern.test(text);
}

function walkEjsFiles(dir) {
  const out = [];
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) out.push(...walkEjsFiles(p));
    else if (/\.(txt|yaml|yml)$/.test(ent.name) && !p.includes(`${path.sep}EJS${path.sep}`)) {
      const text = fs.readFileSync(p, 'utf8');
      if (/<%|<%-|<%=|@@if/.test(text)) out.push({ rel: path.relative(wifeRoot, p), text });
    }
  }
  return out;
}

const coreText = fs.readFileSync(corePath, 'utf8');
const calText = fs.readFileSync(calPath, 'utf8');
if (!hasCoreBootstrap(coreText)) {
  errors.push('世界书/EJS/变量快照_核心.txt：缺少 mvuGet 守卫定义');
}
if (!coreText.includes("mvuGet('stat_data.凌月.对user的好感度'")) {
  errors.push('世界书/EJS/变量快照_核心.txt：变量读取须通过 mvuGet()');
}
if (!calText.includes(calMarker)) {
  errors.push('世界书/EJS/变量快照_校历.txt：缺少 resolveFestival 守卫定义');
}

for (const { rel, text } of walkEjsFiles(path.join(wifeRoot, '世界书'))) {
  if (/\[0\]'/.test(text)) {
    errors.push(`${rel}：getvar 含 [0] 后缀，应改用 mvuGet()`);
  }
  if (/getvar\s*\(\s*['"]stat_data\./.test(text) && !rel.includes('变量列表')) {
    errors.push(`${rel}：条目正文禁止直接 getvar(stat_data.*)，应使用 EJS预处理 define 的变量名`);
  }
  if (/^\s*const\s+(year|month|day|affection|festival|vacation)\s*=/m.test(text)) {
    errors.push(`${rel}：顶层 const 变量声明会与共享作用域冲突`);
  }
  if (/^\s*function\s+(resolveFestival|resolveVacation|tierLibido|tierCorruption)\s*\(/m.test(text)) {
    errors.push(`${rel}：顶层 function 声明会与共享作用域冲突，应集中在 变量快照_校历.txt / _核心.txt`);
  }
  if (/typeof ntrTarget === 'object'/.test(text)) {
    errors.push(`${rel}：ntrTarget 应用 isNtrTargetRecord(ntrTarget) 判断`);
  }
  if (/scenePlace\.includes\(/.test(text)) {
    errors.push(`${rel}：scenePlace.includes 对 MVU 元组不安全，应改用 sceneIncludes()`);
  }
  if (/switch\s*\(/.test(text)) {
    errors.push(`${rel}：含 switch 语句，ST EJS 分块编译时易报错，应改用 if/else if`);
  }
  if (/\bfestival\b|\bvacation\b/.test(text) && !rel.includes('玩法指导') && !rel.includes('节日')) {
    // 玩法指导等使用 festival/vacation 须通过 define
  }
}

const playGuidePath = path.join(wifeRoot, '世界书/阶段指导/玩法指导.txt');
const playGuideText = fs.readFileSync(playGuidePath, 'utf8');

const state = JSON.parse(fs.readFileSync(statePath, 'utf8'));

if (
  playGuideText.includes('graduation_endgame:') &&
  state.entryManifest?.['阶段指导']?.['毕业结局指引']
) {
  warnings.push('玩法指导.txt 仍含 graduation_endgame 正文，与毕业结局指引条目重复');
}

function entryText(entry) {
  if (entry.contents) {
    return entry.contents
      .map(part => {
        if (part.file) return fs.readFileSync(path.join(wifeRoot, part.file), 'utf8');
        return part.content || '';
      })
      .join('\n');
  }
  if (entry.path) return fs.readFileSync(path.join(wifeRoot, entry.path), 'utf8');
  return '';
}

function entryFiles(entry) {
  return (entry.contents || []).filter(p => p.file).map(p => p.file);
}

function scanManifest(manifest, prefix = '') {
  for (const [name, entry] of Object.entries(manifest || {})) {
    const label = prefix ? `${prefix}.${name}` : name;
    const body = entryText(entry);
    const files = entryFiles(entry);
    const usesCore = files.includes(coreFragment);
    const usesCal = files.includes(calFragment);
    const hasGenerateBefore = entry.contents?.some(p => p.content?.includes('@@generate_before')) ?? false;
    const needsCal =
      calendarEntries.has(name) ||
      (prefix === '阶段指导' && name === '玩法指导') ||
      (prefix === 'EJS预处理' && (name === 'EJS预处理' || name === 'getvar诊断'));

    if (entry.contents) {
      for (const part of entry.contents) {
        if (part.content?.includes('@@if')) {
          const line = part.content.split('\n')[0];
          if (/@@if\s+(sceneType|affection|libido|ntrStage|corruption|exposure|gradDays|festival|vacation|weekday|relationForm|ntrTarget|virginityTo)\b/.test(line)) {
            errors.push(`${label}：@@if 使用了 define 变量名，应改为 getvar + 元组解包`);
          }
          if (/@@if[^\n]*getvar\([^\n]+\)[^\n]*>=|@@if[^\n]*getvar\([^\n]+\)[^\n]*===|@@if[^\n]*getvar\([^\n]+\)[^\n]*<=/.test(line) && !tupleUnwrapPattern.test(line)) {
            errors.push(`${label}：@@if 中 getvar 比较须解包 MVU 元组`);
          }
        }
      }
    }

    if (hasGenerateBefore && !hasCoreBootstrap(body)) {
      errors.push(`${label}：须注入 变量快照_核心.txt 并含 mvuGet 守卫`);
    }

    if (needsSnapshotBootstrap(body) && !usesCore && !hasCoreBootstrap(body)) {
      errors.push(`${label}：使用 EJS 门控变量但缺少 变量快照_核心.txt 注入`);
    }

    if (needsCal && !usesCal) {
      errors.push(`${label}：需要 festival/vacation 但未注入 变量快照_校历.txt`);
    }

    if (!needsCal && usesCal) {
      errors.push(`${label}：不应注入 变量快照_校历.txt（仅需核心快照）`);
    }

    if (entry.path && needsSnapshotBootstrap(body)) {
      errors.push(`${label}：path 条目含 EJS 门控变量，应改为 contents 并前置 变量快照_核心.txt`);
    }

    const hasEntryIf = entry.contents?.some(p => p.content?.includes('@@if')) ?? false;
    if (hasEntryIf) {
      const gateLine =
        entry.contents?.find(p => p.content?.includes('@@if'))?.content?.split('\n')[0] ?? '';
      for (const { gate, body: bodyPat } of DUPLICATE_GUARD_PATTERNS) {
        if (gate.test(gateLine) && bodyPat.test(body)) {
          warnings.push(`${label}：@@if 与正文外层 <% if %> 条件可能重复，建议仅保留条目门控`);
        }
      }
    }

    if (
      VARIABLE_GATE_ENTRIES.has(name) &&
      entry.strategy?.type === 'selective' &&
      (entry.strategy?.keys?.length ?? 0) <= 2
    ) {
      warnings.push(
        `${label}：变量门控条目仍为 selective 且关键词过窄，建议 constant + @@if`,
      );
    }

    if (entry.part === 'variable_gate' && entry.strategy?.type !== 'constant') {
      warnings.push(`${label}：part=variable_gate 但 strategy 非 constant`);
    }
  }
}

for (const [type, manifest] of Object.entries(state.entryManifest || {})) {
  scanManifest(manifest, type);
}

if (errors.length) {
  console.error('verify-wife-ejs: FAILED');
  for (const e of errors) console.error('  ✗', e);
  process.exit(1);
}

console.log('verify-wife-ejs: OK');
if (warnings.length) {
  console.warn('  warnings:');
  for (const w of warnings) console.warn('  ⚠', w);
}
