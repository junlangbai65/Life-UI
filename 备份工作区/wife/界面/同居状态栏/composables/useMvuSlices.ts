import { storeToRefs } from 'pinia';
import { useDataStore } from '../store';

const NTR_STAGE_NAMES = ['安全', '预警', '越界', '暴露'] as const;
const PROTOTYPE_LABELS: Record<string, string> = {
  neet_uncle: '肥宅大叔',
  muscular_male: '健壮男性',
  shota: '正太',
  bestie_friend: '闺蜜朋友',
  house_dog: '家犬',
};

const MILESTONE_LABELS: Record<string, string> = {
  首次共进晚餐: '首次共进晚餐',
  首次向user求助: '首次向user求助',
  首次维护user: '首次维护user',
  首次谈未来: '首次谈未来',
  首次与user性爱: '首次与user性爱',
  首次默许: '首次默许',
};

export function useMvuSlices() {
  const { data } = storeToRefs(useDataStore());

  const worldSlice = computed(() => {
    const w = data.value.世界;
    const gradDays = w?.距毕业天数?.[0] ?? 0;
    return {
      year: w?.年?.[0],
      month: w?.月?.[0],
      day: w?.日?.[0],
      weekday: w?.星期?.[0],
      time: w?.时间?.[0],
      weather: w?.天气?.[0]?.trim() ?? '',
      scene: w?.当前场景?.[0]?.trim() ?? '',
      sceneType: w?.场景类型?.[0] ?? '其他',
      sceneIconName: (() => {
        const type = w?.场景类型?.[0] ?? '其他';
        const map: Record<string, 'school' | 'home' | 'map-pin'> = {
          校内: 'school',
          居家: 'home',
          外出: 'map-pin',
          其他: 'map-pin',
        };
        return map[type] ?? 'map-pin';
      })(),
      gradDays,
      isEndgame: gradDays <= 0,
      gradUrgent: gradDays > 0 && gradDays <= 14,
      datetimeLine: w
        ? `${w.年?.[0]}年${w.月?.[0]}月${w.日?.[0]}日 周${w.星期?.[0]} ${w.时间?.[0]}`
        : '',
    };
  });

  const economySlice = computed(() => {
    const funds = data.value.user?.生活费?.[0] ?? 0;
    const budget = 2000;
    return {
      funds,
      budget,
      ratio: Math.min(100, Math.max(0, (funds / budget) * 100)),
    };
  });

  const relationSlice = computed(() => {
    const ling = data.value.凌月;
    const affection = ling?.对user的好感度?.[0] ?? 0;
    const stage =
      (ling as { $好感阶段?: string } | undefined)?.$好感阶段 ??
      (affection < 101 ? '观察试探' : affection < 201 ? '友达以上' : affection < 301 ? '心意萌动' : '默契相伴');
    const relationForm = ling?.关系形态?.[0] ?? '默认';
    const milestones = ling?.里程碑
      ? Object.entries(ling.里程碑).map(([key, tuple]) => ({
          key,
          label: MILESTONE_LABELS[key] ?? key,
          done: tuple[0] as boolean,
        }))
      : [];
    const outfit = ling?.穿着;
    const chips = [outfit?.上身?.[0]?.trim(), outfit?.下身?.[0]?.trim(), outfit?.鞋袜?.[0]?.trim()].filter(
      (v): v is string => Boolean(v),
    );
    return {
      affection,
      affectionPercent: Math.min(100, (affection / 400) * 100),
      stage,
      relationForm,
      showRelationForm: relationForm !== '默认',
      milestones,
      outfitChips: chips,
    };
  });

  const riskSlice = computed(() => {
    const ling = data.value.凌月;
    const ntrStage = ling?.NTR阶段?.[0] ?? 0;
    const stageName =
      (ling as { $NTR阶段名?: string } | undefined)?.$NTR阶段名 ?? NTR_STAGE_NAMES[ntrStage] ?? '安全';
    return {
      libido: ling?.性欲?.[0] ?? 0,
      corruption: ling?.堕落?.[0] ?? 0,
      exposure: ling?.暴露度?.[0] ?? 0,
      ntrStage,
      stageName,
      ntrCooldown: ling?.NTR冷却?.[0] ?? 0,
    };
  });

  const ntrObjectSlice = computed(() => {
    const raw = data.value.NTR对象?.[0];
    if (raw === '无' || raw == null || typeof raw !== 'object') return null;
    return {
      name: raw.姓名,
      prototype: raw.原型类型,
      prototypeLabel: PROTOTYPE_LABELS[raw.原型类型] ?? raw.原型类型,
      familiarity: raw.熟悉度,
    };
  });

  const intimateSlice = computed(() => {
    const ling = data.value.凌月;
    return {
      isVirgin: ling?.是否处女?.[0] ?? true,
      virginityTo: ling?.破处对象?.[0] ?? '无',
      sexWithUser: ling?.性爱次数?.与user?.[0] ?? 0,
      sexNtr: ling?.性爱次数?.越界?.[0] ?? 0,
      fluidTrace: ling?.体内精液量?.[0] ?? 0,
    };
  });

  const userName = typeof user_name !== 'undefined' ? user_name : '{{user}}';

  return {
    worldSlice,
    economySlice,
    relationSlice,
    riskSlice,
    ntrObjectSlice,
    intimateSlice,
    userName,
    ready: computed(() => Boolean(data.value.世界?.年)),
  };
}
