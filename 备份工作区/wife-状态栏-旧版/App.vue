<template>
  <div class="status-card rounded-lg border border-[#40444b] bg-[#2c2f33] p-3 text-sm shadow-lg">
    <h2 class="mb-3 border-b border-[#40444b] pb-2 text-base font-semibold">同居状态面板</h2>
    <div class="space-y-2">
      <div class="flex justify-between">
        <span class="text-[#b9bbbe]">当前时日</span>
        <span>{{ datetime }}</span>
      </div>
      <div class="flex justify-between">
        <span class="text-[#b9bbbe]">当前场景</span>
        <span class="max-w-[60%] truncate text-right">{{ scene }}</span>
      </div>
      <div class="flex justify-between">
        <span class="text-[#b9bbbe]">{{ userName }}的生活费</span>
        <span class="text-[#88c0d0]">¥ {{ userFunds }}</span>
      </div>
      <div>
        <div class="mb-1 flex justify-between">
          <span class="text-[#b9bbbe]">凌月的好感度</span>
          <span>{{ affection }} / 400</span>
        </div>
        <div class="h-2 overflow-hidden rounded bg-[#4f545c]">
          <div class="h-full bg-[#ff8fab] transition-all" :style="{ width: affectionPercent + '%' }" />
        </div>
        <p class="mt-1 text-xs italic text-[#b9bbbe]">{{ affectionStage }}</p>
      </div>
      <div class="flex justify-between">
        <span class="text-[#b9bbbe]">NTR阶段</span>
        <span>{{ ntrStageLabel }}</span>
      </div>
      <div class="flex justify-between gap-2">
        <span class="shrink-0 text-[#b9bbbe]">穿着</span>
        <span class="truncate text-right text-xs">{{ outfit }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useDataStore } from './store';

const store = useDataStore();
const { data } = storeToRefs(store);

const userName = typeof user_name !== 'undefined' ? user_name : '{{user}}';

const datetime = computed(() => {
  const w = data.value.世界;
  if (!w) return '----年--月--日 星期- --:--';
  return `${w.年?.[0] ?? '----'}年${w.月?.[0] ?? '--'}月${w.日?.[0] ?? '--'}日 星期${w.星期?.[0] ?? '-'} ${w.时间?.[0] ?? '--:--'}`;
});

const scene = computed(() => data.value.世界?.当前场景?.[0] ?? '--');
const userFunds = computed(() => data.value.user?.生活费?.[0] ?? 0);
const affection = computed(() => data.value.凌月?.对user的好感度?.[0] ?? 0);
const affectionPercent = computed(() => Math.min(100, Math.max(0, (affection.value / 400) * 100)));
const affectionStage = computed(() => {
  const derived = (data.value.凌月 as { $好感阶段?: string })?.$好感阶段;
  if (derived) return derived;
  const v = affection.value;
  if (v < 101) return '观察试探';
  if (v < 201) return '友达以上';
  if (v < 301) return '心意萌动';
  return '默契相伴';
});

const ntrStageNames = ['安全', '预警', '越界', '暴露'];
const ntrStageLabel = computed(() => {
  const stage = data.value.凌月?.NTR阶段?.[0] ?? 0;
  return `${stage} ${ntrStageNames[stage] ?? '安全'}`;
});

const outfit = computed(() => {
  const c = data.value.凌月?.穿着;
  if (!c) return '--';
  return [c.上身?.[0], c.下身?.[0], c.鞋袜?.[0]].filter(Boolean).join(' / ') || '--';
});
</script>
