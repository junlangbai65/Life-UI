import fs from 'fs';
import yaml from 'yaml';
import _ from 'lodash';
import { z } from 'zod';

globalThis._ = _;
globalThis.z = z;

const { Schema } = await import('../src/wife/schema.ts');
const init = yaml.parse(fs.readFileSync('cards/wife/世界书/变量/initvar.yaml', 'utf8'));
const parsed = Schema.safeParse(init);
if (!parsed.success) {
  console.error('Schema.parse(initvar) FAILED:', parsed.error.message);
  process.exit(1);
}

const d = parsed.data;
const requiredPaths = [
  ['世界', '年'],
  ['世界', '距毕业天数'],
  ['user', '生活费'],
  ['凌月', '对user的好感度'],
  ['凌月', 'NTR阶段'],
  ['NTR对象'],
];

for (const path of requiredPaths) {
  let cur = d;
  for (const key of path) cur = cur?.[key];
  if (cur === undefined) {
    console.error('Missing path:', path.join('.'));
    process.exit(1);
  }
}

const distHtml = 'dist/wife/界面/同居状态栏/index.html';
const regexHtml = 'cards/wife/正则/状态栏界面.html';
if (!fs.existsSync(distHtml)) {
  console.error('Missing build output:', distHtml);
  process.exit(1);
}
if (!fs.existsSync(regexHtml)) {
  console.error('Missing regex file:', regexHtml);
  process.exit(1);
}

const regexContent = fs.readFileSync(regexHtml, 'utf8');
const isLoadMode = /\$\(['"]body['"]\)\.load\s*\(/.test(regexContent);
const isInlineMode = regexContent.includes('<div id="app"');
if (!isLoadMode && !isInlineMode) {
  console.error('状态栏界面.html 无效，请运行: pnpm wife:statusbar:inline');
  process.exit(1);
}
if (isLoadMode && !regexContent.includes('同居状态栏/index.html')) {
  console.error('状态栏界面.html load URL 路径不正确（应为 同居状态栏/index.html）');
  process.exit(1);
}
if (!/^```\n[\s\S]*<body[\s\S]*```\s*$/.test(regexContent.trim())) {
  console.error('状态栏界面.html 应用无语言标识的 ``` 代码块包裹含 <body> 的 HTML');
  process.exit(1);
}
if (/^```html/m.test(regexContent.trim())) {
  console.error('状态栏界面.html 勿用 ```html，应使用无语言标识的 ```');
  process.exit(1);
}
if (!regexContent.includes('<style') || !regexContent.includes('<script') || !regexContent.includes('</body>')) {
  console.error('状态栏界面.html 须同时含 <style>、<script>、</body>（TH 渲染器要求）');
  process.exit(1);
}
if (regexContent.includes('<head>')) {
  console.warn('verify-wife-mvu-statusbar: 警告：仍含 <head>，建议重新 sync 以整理为 style/body/script 结构');
}

console.log('verify-wife-mvu-statusbar: OK');
console.log('  initvar parses with Schema');
console.log('  derived:', d.凌月.$好感阶段, d.凌月.$NTR阶段名);
console.log('  dist:', distHtml, fs.statSync(distHtml).size, 'bytes');
console.log('  regex loader:', regexHtml, regexContent.length, 'bytes');
