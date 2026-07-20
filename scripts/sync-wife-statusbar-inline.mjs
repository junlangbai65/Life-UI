/**
 * 将 dist/wife/界面/同居状态栏/index.html 写入正则替换文件。
 *
 * TH 渲染器要求代码块内同时含 <style>、</body>、<script>，且推荐顺序为 style → body → script（勿包 <head>）。
 * 须用无语言标识的 ``` 包裹。
 *
 * 用法：pnpm build && node scripts/sync-wife-statusbar-inline.mjs
 * 可选：WIFE_STATUSBAR_MODE=load WIFE_STATUSBAR_URL=... node ...
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const distHtml = path.join(root, 'dist/wife/界面/同居状态栏/index.html');
const distBoot = path.join(root, 'dist/wife/脚本/状态栏挂载/index.js');
const bootTxt = path.join(root, 'cards/wife/脚本/状态栏挂载.txt');
const mode = process.env.WIFE_STATUSBAR_MODE ?? 'inline';
const loadUrl =
  process.env.WIFE_STATUSBAR_URL ??
  'http://127.0.0.1:6622/wife/界面/同居状态栏/index.html';

const targets = [path.join(root, 'cards/wife/正则/状态栏界面.html')];

/** 将 webpack 产物整理为 TH 渲染器易识别的结构 */
export function normalizeForThRenderer(html) {
  const styleBlocks = [...html.matchAll(/<style[^>]*>[\s\S]*?<\/style>/gi)].map(m => m[0]);
  const scriptBlocks = [...html.matchAll(/<script[\s\S]*?<\/script>/gi)].map(m => m[0]);
  const bodyInner = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i)?.[1] ?? '';
  const bodyWithoutScript = bodyInner.replace(/<script[\s\S]*?<\/script>/gi, '').trim();

  if (!styleBlocks.length || !scriptBlocks.length || !bodyWithoutScript.includes('id="app"')) {
    throw new Error('无法从 dist HTML 提取 style/body/script');
  }

  return `${styleBlocks.join('\n')}\n<body>${bodyWithoutScript}</body>\n${scriptBlocks.join('\n')}\n`;
}

if (!fs.existsSync(distHtml)) {
  console.error('[sync-wife-statusbar] 缺少构建产物，请先运行: pnpm build');
  console.error('  期望路径:', distHtml);
  process.exit(1);
}

const distContent = fs.readFileSync(distHtml, 'utf8').trim();

/** markdownOnly 正则：无语言标识代码块，供 TH 识别并渲染 iframe */
const wrapped =
  mode === 'load'
    ? `\`\`\`\n<style>/* wife-status-loader */</style>\n<body>\n<script>\n$('body').load('${loadUrl}')\n</script>\n</body>\n\`\`\`\n`
    : `\`\`\`\n${normalizeForThRenderer(distContent)}\`\`\`\n`;

if (mode === 'inline' && /\$\(['"]body['"]\)\.load\s*\(/.test(distContent)) {
  console.error('[sync-wife-statusbar] inline 模式：dist 不应含 body.load');
  process.exit(1);
}

for (const target of targets) {
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, wrapped, 'utf8');
  console.log('[sync-wife-statusbar] 已写入', path.relative(root, target));
}

if (fs.existsSync(distBoot)) {
  const bootJs = fs.readFileSync(distBoot, 'utf8').replace(/\n\/\/# sourceMappingURL=.*$/s, '').trim();
  fs.writeFileSync(bootTxt, `${bootJs}\n`, 'utf8');
  console.log('[sync-wife-statusbar] 已写入', path.relative(root, bootTxt));
} else {
  console.warn('[sync-wife-statusbar] 缺少 boot 脚本产物，请先 pnpm build');
}
console.log('[sync-wife-statusbar] mode:', mode, 'bytes:', wrapped.length);
if (mode === 'load') console.log('[sync-wife-statusbar] load URL:', loadUrl);
