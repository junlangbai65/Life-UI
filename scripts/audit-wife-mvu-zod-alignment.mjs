/**
 * 静态审计：wife MVU/Zod 脚本与 schema/initvar 对齐（写入 debug NDJSON）
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import yaml from 'yaml';
import _ from 'lodash';
import { z } from 'zod';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const logPath = path.join(repoRoot, 'debug-4b0b7d.log');
const sessionId = '4b0b7d';

function log(hypothesisId, location, message, data = {}) {
  const line = JSON.stringify({
    sessionId,
    runId: 'static-audit',
    hypothesisId,
    location,
    message,
    data,
    timestamp: Date.now(),
  });
  fs.appendFileSync(logPath, line + '\n', 'utf8');
}

globalThis._ = _;
globalThis.z = z;

const zodTxt = fs.readFileSync(path.join(repoRoot, 'cards/wife/脚本/Zod.txt'), 'utf8');
const mvuTxt = fs.readFileSync(path.join(repoRoot, 'cards/wife/脚本/MVU.txt'), 'utf8');
const initYaml = fs.readFileSync(path.join(repoRoot, 'cards/wife/世界书/变量/initvar.yaml'), 'utf8');
const init = yaml.parse(initYaml);

const schemaUrl = new URL('../src/wife/schema.ts', import.meta.url).href;
const { Schema } = await import(schemaUrl);

// H-D: Zod.txt 无 TS 残留
const tsPatterns = [/export const Schema/, /: unknown/, /<T extends/, /export type/];
const tsHits = tsPatterns.filter(p => p.test(zodTxt)).map(p => p.source);
log('D', 'audit:Zod.txt', 'typescript residue check', { clean: tsHits.length === 0, hits: tsHits });

// H-D: 关键字段名与 initvar 对齐
const initKeys = Object.keys(init);
const parsed = Schema.parse(init);
const statKeys = Object.keys(parsed);
log('D', 'audit:initvar', 'top-level keys', { initKeys, statKeys, match: _.isEqual(initKeys.sort(), statKeys.sort()) });

// H-C: 脚本加载约定
log('C', 'audit:scripts', 'load contract', {
  mvuBundle: mvuTxt.trim(),
  zodHasWaitMvu: zodTxt.includes("waitGlobalInitialized('Mvu')"),
  zodHasRegister: zodTxt.includes('registerMvuSchema'),
  zodIsAsync: /\$\(async/.test(zodTxt),
});

// H-B: parse 后元组形态（本地 Schema 代表 Zod 注册后的期望形态）
const aff = parsed.凌月.对user的好感度;
log('B', 'audit:Schema.parse', 'tuple shape after parse', {
  affection: aff,
  isTuple: Array.isArray(aff) && aff.length === 2,
  derived: parsed.凌月.$好感阶段,
});

// H-E: MVU bundle URL 与 mvu_zod 配对
log('E', 'audit:cdn', 'external deps', {
  mvu: mvuTxt.includes('MagVarUpdate/artifact/bundle.js'),
  zod: zodTxt.includes('tavern_resource/dist/util/mvu_zod.js'),
});

console.info('[audit-wife-mvu-zod] 已写入', logPath);
