const characterDefaults = {
  姓名: '',
  上身: '',
  下身: '',
  鞋袜: '',
  姿态: '',
  感染进程: 0,
  性欲: 0,
  感染状态: '未感染' as const,
};

export const Schema = z.object({
  世界: z
    .object({
      日期与时间: z.string().prefault(''),
      天气: z.string().prefault(''),
      地点: z.string().prefault(''),
    })
    .prefault({}),

  角色: z
    .record(
      z.string().describe('角色名'),
      z
        .object({
          姓名: z.string().prefault(''),
          上身: z.string().prefault(''),
          下身: z.string().prefault(''),
          鞋袜: z.string().prefault(''),
          姿态: z.string().prefault(''),
          感染进程: z.coerce
            .number()
            .transform(v => _.clamp(v, 0, 100))
            .prefault(0),
          性欲: z.coerce
            .number()
            .transform(v => _.clamp(v, 0, 100))
            .prefault(0),
          感染状态: z.enum(['未感染', '感染中', '已感染']).prefault('未感染'),
        })
        .prefault(characterDefaults),
    )
    .prefault({}),
});

export type MvuStatData = z.output<typeof Schema>;
export type MvuCharacter = MvuStatData['角色'][string];
export type InfectionStatus = MvuCharacter['感染状态'];
