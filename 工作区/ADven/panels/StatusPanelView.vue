<template>
  <article id="status-panel-content" class="panel-content panel-v2 status-v2">
    <section class="status-depth-stage pixel-card">
      <h3 class="panel-heading">
        <svg viewBox="0 0 24 24" aria-hidden="true" class="panel-heading-icon">
          <path d="M6 6H18V18H6z" fill="none" stroke="currentColor" stroke-width="2" />
          <path d="M9 10H15M9 14H13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
        </svg>
        <span>体征分层</span>
      </h3>
      <div class="tag-row">
        <span v-for="tag in statusDepthTags.shallow" :key="`shallow-${tag}`" class="tag shallow">{{ tag }}</span>
        <span v-for="tag in statusDepthTags.middle" :key="`middle-${tag.name}`" class="tag middle">
          {{ tag.name }}: {{ tag.value }}
        </span>
        <span v-for="tag in statusDepthTags.deep" :key="`deep-${tag}`" class="tag deep">{{ tag }}</span>
        <span
          v-if="
            statusDepthTags.shallow.length === 0 &&
            statusDepthTags.middle.length === 0 &&
            statusDepthTags.deep.length === 0
          "
          class="empty-note"
        >
          当前无标签
        </span>
      </div>
    </section>

    <section class="status-body-stage pixel-card">
      <h3 class="panel-heading">
        <svg viewBox="0 0 24 24" aria-hidden="true" class="panel-heading-icon">
          <path d="M12 4V20M4 12H20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
          <circle cx="12" cy="12" r="7" fill="none" stroke="currentColor" stroke-width="1.6" />
        </svg>
        <span>生理状态</span>
      </h3>
      <div class="status-fluid-layout">
        <article class="semen-bottle-card">
          <header>
            <span>体内精液量</span>
            <strong>{{ bodyStatus.internalSemenVolume }}ml / 1000ml</strong>
          </header>
          <div class="semen-bottle-shell" :style="{ '--fill-percent': `${semenFillPercent}%` }">
            <div class="semen-bottle-glass">
              <div class="semen-liquid">
                <i class="wave wave-a" />
                <i class="wave wave-b" />
                <i class="bubble bubble-a" />
                <i class="bubble bubble-b" />
                <i class="bubble bubble-c" />
              </div>
              <span class="semen-percent">{{ semenFillPercent }}%</span>
            </div>
          </div>
        </article>

        <div class="stat-grid two">
          <div class="stat-card"><span>sex总次数</span><strong>{{ bodyStatus.sexCount }}</strong></div>
        </div>
      </div>
    </section>

    <section class="status-pregnancy-stage pixel-card">
      <h3 class="panel-heading">
        <svg viewBox="0 0 24 24" aria-hidden="true" class="panel-heading-icon">
          <path d="M12 5C14.8 5 17 7.2 17 10V12.5C17 16.1 14.1 19 10.5 19H9" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
          <circle cx="8.5" cy="9" r="1.5" fill="none" stroke="currentColor" stroke-width="1.6" />
        </svg>
        <span>怀孕状态</span>
      </h3>
      <div class="stat-grid two">
        <div class="stat-card"><span>是否怀孕</span><strong>{{ bodyStatus.pregnancy.isPregnant ? '是' : '否' }}</strong></div>
        <div class="stat-card"><span>父亲</span><strong>{{ bodyStatus.pregnancy.father || '无' }}</strong></div>
        <div class="stat-card"><span>孕期进度</span><strong>{{ bodyStatus.pregnancy.progress }}</strong></div>
        <div class="stat-card"><span>预产期</span><strong>{{ bodyStatus.pregnancy.eta }}</strong></div>
      </div>
    </section>
  </article>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  statusDepthTags: { shallow: string[]; middle: Array<{ name: string; value: string }>; deep: string[] };
  bodyStatus: {
    internalSemenVolume: number;
    sexCount: number;
    pregnancy: {
      isPregnant: boolean;
      father: string;
      progress: number;
      eta: number;
    };
  };
}>();

const semenFillPercent = computed(() => {
  const ratio = (props.bodyStatus.internalSemenVolume / 1000) * 100;
  const clamped = Math.max(0, Math.min(100, Math.round(ratio)));
  return clamped;
});
</script>
