/**
 * 将 src/wife/schema.ts 编译为 cards/wife/脚本/Zod.txt（见 build-zod-script.mjs）
 * @deprecated 请运行: node cards/wife/scripts/build-zod-script.mjs
 */
import { spawnSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const script = path.join(path.dirname(fileURLToPath(import.meta.url)), 'build-zod-script.mjs');
spawnSync(process.execPath, [script], { stdio: 'inherit' });
