/**
 * 本地探针：MVU ZOD 解析后 stat_data 字段在消息变量中的实际形态。
 * EJS getvar 基于 lodash _.get；若存储为 [value, description] 元组，
 * 直接比较 `getvar(...) < 101` 会失效，须 mvuGet 解包。
 */
import fs from 'fs';
import yaml from 'yaml';
import _ from 'lodash';
import { z } from 'zod';

globalThis._ = _;
globalThis.z = z;

const { Schema } = await import('../src/wife/schema.ts');
const init = yaml.parse(fs.readFileSync('cards/wife/世界书/变量/initvar.yaml', 'utf8'));
const stat_data = Schema.parse(init);

function lodashGet(path) {
  return _.get({ stat_data }, path);
}

const samples = [
  ['stat_data.凌月.对user的好感度', 'number compare'],
  ['stat_data.世界.当前场景', 'string includes'],
  ['stat_data.NTR对象', 'object or literal'],
  ['stat_data.凌月.NTR阶段', 'number compare'],
];

console.log('=== MVU ZOD 消息变量形态探针 (wife) ===\n');
for (const [path, note] of samples) {
  const raw = lodashGet(path);
  const isTuple = Array.isArray(raw) && raw.length === 2 && typeof raw[1] === 'string';
  const scalar = isTuple ? raw[0] : raw;
  console.log(path);
  console.log('  raw:', JSON.stringify(raw), '| typeof:', typeof raw, '| isTuple:', isTuple);
  console.log('  scalar[0]:', JSON.stringify(scalar), '| typeof:', typeof scalar);
  if (note === 'number compare' && isTuple) {
    console.log('  raw < 101 =>', raw < 101, '(broken if NaN)');
    console.log('  scalar < 101 =>', scalar < 101);
  }
  if (note === 'string includes' && isTuple) {
    console.log("  raw.includes('卧室') =>", typeof raw.includes === 'function' ? raw.includes('卧室') : 'N/A');
    console.log("  String(scalar).includes('卧室') =>", String(scalar).includes('卧室'));
  }
  console.log('');
}

console.log('结论: Schema.parse 后叶子字段均为 [value, description] 元组。');
console.log('EJS 须用 mvuGet() 解包后再做数值/字符串比较（除非实机 getvar 已自动解包）。');
