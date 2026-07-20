/**
 * 将 src/wife/schema.ts 转为酒馆可执行的纯 JS（cards/wife + src/wife 脚本/Zod.txt）
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..');
const schemaPath = path.join(repoRoot, 'src/wife/schema.ts');

function schemaTsToJs(source) {
  return source
    .replace(/^export type.*$/gm, '')
    .replace(/export const Schema/, 'const Schema')
    .replace(/function normalizeMvuTuple\(input: unknown\): \[unknown, string\]/, 'function normalizeMvuTuple(input)')
    .replace(
      /const mvuField = <T extends z\.ZodTypeAny>\(value: T\) =>/,
      'const mvuField = value =>',
    )
    .replace(/\(v: number\)/g, '(v)')
    .replace(/\(affection: number\)/g, '(affection)')
    .replace(/\(stage: number\)/g, '(stage)');
}

const header = `import { registerMvuSchema } from 'https://testingcf.jsdelivr.net/gh/StageDog/tavern_resource/dist/util/mvu_zod.js';

`;

const footer = `
function wifeMvuDebugLog(hypothesisId, location, message, data) {
  // #region agent log
  fetch('http://127.0.0.1:7916/ingest/5cc9860e-d008-4f2a-9009-20ad4e396a2e', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Debug-Session-Id': '4b0b7d' },
    body: JSON.stringify({
      sessionId: '4b0b7d',
      runId: 'tavern-runtime',
      hypothesisId,
      location,
      message,
      data,
      timestamp: Date.now(),
    }),
  }).catch(() => {});
  // #endregion
  console.info('[wife/debug]', hypothesisId, message, data);
}

function wifeSampleStatShape(stat_data) {
  const aff = _.get(stat_data, '凌月.对user的好感度');
  return {
    affectionJson: JSON.stringify(aff),
    affectionIsTuple: Array.isArray(aff) && aff.length === 2 && typeof aff[1] === 'string',
    derivedStage: _.get(stat_data, '凌月.$好感阶段'),
    weekdayJson: JSON.stringify(_.get(stat_data, '世界.星期')),
  };
}

$(async () => {
  wifeMvuDebugLog('A', 'Zod.txt:entry', 'script bootstrap', {
    hasZ: typeof z !== 'undefined',
    hasRegisterFn: typeof registerMvuSchema === 'function',
  });
  try {
    await waitGlobalInitialized('Mvu');
    wifeMvuDebugLog('C', 'Zod.txt:post-wait', 'Mvu initialized', { hasMvu: typeof Mvu !== 'undefined' });
    registerMvuSchema(Schema);
    wifeMvuDebugLog('A', 'Zod.txt:registered', 'registerMvuSchema ok', {});
    console.info('[wife/Zod] registerMvuSchema 完成');

    eventOn('mag_variable_initialized', (variables, swipeId) => {
      wifeMvuDebugLog('B', 'event:init', 'mag_variable_initialized', {
        swipeId,
        hasDisplay: Object.prototype.hasOwnProperty.call(variables, 'display_data'),
        hasDelta: Object.prototype.hasOwnProperty.call(variables, 'delta_data'),
        ...wifeSampleStatShape(variables.stat_data),
      });
    });
    eventOn('mag_command_parsed_for_zod', (variables, commands) => {
      wifeMvuDebugLog('E', 'event:patch-zod', 'mag_command_parsed_for_zod', {
        cmdCount: commands?.length ?? 0,
        paths: (commands ?? []).slice(0, 5).map(c => c?.args?.[0]),
      });
    });
    eventOn('mag_variable_update_ended_for_zod', variables => {
      wifeMvuDebugLog('B', 'event:update-zod', 'mag_variable_update_ended_for_zod', {
        hasDisplay: Object.prototype.hasOwnProperty.call(variables, 'display_data'),
        hasDelta: Object.prototype.hasOwnProperty.call(variables, 'delta_data'),
        schemaField: variables.schema,
        ...wifeSampleStatShape(variables.stat_data),
      });
    });
    eventOn(Mvu.events.VARIABLE_UPDATE_ENDED, (variables, before) => {
      wifeMvuDebugLog('E', 'event:update-flat', 'VARIABLE_UPDATE_ENDED', {
        hasDisplay: Object.prototype.hasOwnProperty.call(variables, 'display_data'),
        hasDelta: Object.prototype.hasOwnProperty.call(variables, 'delta_data'),
        ...wifeSampleStatShape(variables.stat_data),
        beforeAffection: JSON.stringify(_.get(before, 'stat_data.凌月.对user的好感度')),
      });
    });
  } catch (err) {
    wifeMvuDebugLog('A', 'Zod.txt:error', 'bootstrap failed', { error: String(err) });
    console.error('[wife/Zod] bootstrap failed', err);
  }
});
`;

const schemaJs = schemaTsToJs(fs.readFileSync(schemaPath, 'utf8'));
const out = header + schemaJs + footer;

for (const rel of ['cards/wife/脚本/Zod.txt', 'src/wife/脚本/Zod.txt']) {
  const outPath = path.join(repoRoot, rel);
  fs.writeFileSync(outPath, out, 'utf8');
  console.info('[build-zod-script] 已写入', rel);
}
