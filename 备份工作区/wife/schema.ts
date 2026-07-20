function normalizeMvuTuple(input: unknown): [unknown, string] {
  if (Array.isArray(input)) {
    return [input[0], typeof input[1] === 'string' ? input[1] : ''];
  }
  return [input, ''];
}

const mvuField = <T extends z.ZodTypeAny>(value: T) =>
  z.preprocess(normalizeMvuTuple, z.tuple([value, z.string()]));

const clamp0to100 = (v: number) => _.clamp(v, 0, 100);

const 星期 = z.enum(['一', '二', '三', '四', '五', '六', '日']);
const 场景类型 = z.enum(['校内', '居家', '外出', '其他']);
const 关系形态 = z.enum(['默认', 'user知情', '默许', '开放边界']);
const 破处对象 = z.enum(['无', 'user', 'ntr']);
const 原型类型 = z.enum([
  'neet_uncle',
  'muscular_male',
  'shota',
  'bestie_friend',
  'house_dog',
]);

const NTR对象值 = z.union([
  z.literal('无'),
  z.object({
    姓名: z.string(),
    原型类型: 原型类型,
    熟悉度: z.coerce.number().transform(clamp0to100),
  }),
]);

function derive好感阶段(affection: number) {
  if (affection < 101) return '观察试探';
  if (affection < 201) return '友达以上';
  if (affection < 301) return '心意萌动';
  return '默契相伴';
}

function deriveNTR阶段名(stage: number) {
  if (stage <= 0) return '安全';
  if (stage === 1) return '预警';
  if (stage === 2) return '越界';
  return '暴露';
}

export const Schema = z
  .object({
    世界: z.object({
      年: mvuField(z.coerce.number()),
      月: mvuField(z.coerce.number().transform(v => _.clamp(v, 1, 12))),
      日: mvuField(z.coerce.number().transform(v => _.clamp(v, 1, 31))),
      星期: mvuField(星期),
      时间: mvuField(z.string()),
      当前场景: mvuField(z.string()),
      场景类型: mvuField(场景类型),
      天气: mvuField(z.string()),
      距毕业天数: mvuField(z.coerce.number().transform(v => _.clamp(v, 0, 999))),
    }),
    user: z.object({
      生活费: mvuField(z.coerce.number()),
    }),
    凌月: z.object({
      穿着: z.object({
        上身: mvuField(z.string()),
        下身: mvuField(z.string()),
        鞋袜: mvuField(z.string()),
      }),
      对user的好感度: mvuField(z.coerce.number().transform(v => _.clamp(v, 0, 400))),
      性欲: mvuField(z.coerce.number().transform(clamp0to100)),
      堕落: mvuField(z.coerce.number().transform(clamp0to100)),
      暴露度: mvuField(z.coerce.number().transform(clamp0to100)),
      是否处女: mvuField(z.boolean()),
      破处对象: mvuField(破处对象),
      性爱次数: z.object({
        与user: mvuField(z.coerce.number().transform(v => _.clamp(v, 0, 9999))),
        越界: mvuField(z.coerce.number().transform(v => _.clamp(v, 0, 9999))),
      }),
      体内精液量: mvuField(z.coerce.number().transform(clamp0to100)),
      NTR阶段: mvuField(z.coerce.number().transform(v => _.clamp(v, 0, 3))),
      NTR冷却: mvuField(z.coerce.number().transform(v => _.clamp(v, 0, 999))),
      关系形态: mvuField(关系形态),
      里程碑: z.object({
        首次共进晚餐: mvuField(z.boolean()),
        首次向user求助: mvuField(z.boolean()),
        首次维护user: mvuField(z.boolean()),
        首次谈未来: mvuField(z.boolean()),
        首次与user性爱: mvuField(z.boolean()),
        首次默许: mvuField(z.boolean()),
      }),
    }),
    NTR对象: mvuField(NTR对象值),
  })
  .transform(data => {
    const affection = data.凌月.对user的好感度[0];
    const ntrStage = data.凌月.NTR阶段[0];
    return {
      ...data,
      凌月: {
        ...data.凌月,
        $好感阶段: derive好感阶段(affection),
        $NTR阶段名: deriveNTR阶段名(ntrStage),
      },
    };
  });
export type Schema = z.output<typeof Schema>;
