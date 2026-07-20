<template>
  <span class="lf-avatar" :class="[`lf-avatar--${size}`, { 'lf-avatar--ring': ring, 'lf-avatar--bob': bob }]" :style="ringStyle">
    <svg class="lf-avatar__svg" viewBox="0 0 100 100" role="img" :aria-label="`${id} 头像`">
      <defs>
        <clipPath :id="`clip-${uidKey}`">
          <circle cx="50" cy="50" r="46" />
        </clipPath>
      </defs>
      <circle cx="50" cy="50" r="47" :fill="bg" stroke="var(--lf-ink)" stroke-width="3" />
      <g :clip-path="`url(#clip-${uidKey})`">
        <!-- 林清和：温柔长发 · 薰衣草 -->
        <template v-if="id === 'qinghe'">
          <path d="M16 64C12 36 28 18 50 18s34 18 30 46c-4-10-8-14-8-14 1 8-2 14-2 14H26s-3-6-2-14c0 0-4 4-8 14Z" fill="#c9b8ee" stroke="var(--lf-ink)" stroke-width="2.5" />
          <path d="M30 84c0-14 9-22 20-22s20 8 20 22Z" fill="#ffe2cf" stroke="var(--lf-ink)" stroke-width="2.5" />
          <path d="M28 40c-3 16 0 30 0 30l-9 16c-3-22-2-38 9-46Z" fill="#c9b8ee" stroke="var(--lf-ink)" stroke-width="2.5" />
          <path d="M72 40c3 16 0 30 0 30l9 16c3-22 2-38-9-46Z" fill="#c9b8ee" stroke="var(--lf-ink)" stroke-width="2.5" />
          <path d="M34 40c4-8 24-8 32 0" fill="none" stroke="var(--lf-ink)" stroke-width="2.5" stroke-linecap="round" />
          <circle cx="40" cy="54" r="3.6" fill="var(--lf-ink)" />
          <circle cx="60" cy="54" r="3.6" fill="var(--lf-ink)" />
          <circle cx="41.4" cy="52.8" r="1.1" fill="#fff" />
          <circle cx="61.4" cy="52.8" r="1.1" fill="#fff" />
          <path d="M44 64c3 2.5 9 2.5 12 0" fill="none" stroke="var(--lf-ink)" stroke-width="2.4" stroke-linecap="round" />
        </template>

        <!-- 苏晴：元气双马尾 · 蜜桃 -->
        <template v-else-if="id === 'suqing'">
          <path d="M22 30 12 20l14 2-6-12 14 8 4-12 8 12 8-8 2 12 12-4-8 12 12 2-12 8Z" fill="#ffc79a" stroke="var(--lf-ink)" stroke-width="2.5" stroke-linejoin="round" />
          <path d="M30 84c0-14 9-22 20-22s20 8 20 22Z" fill="#ffe2cf" stroke="var(--lf-ink)" stroke-width="2.5" />
          <path d="M22 44c-6 6-8 18-2 26 0 0-2-16 6-22Z" fill="#ffc79a" stroke="var(--lf-ink)" stroke-width="2.5" />
          <path d="M78 44c6 6 8 18 2 26 0 0 2-16-6-22Z" fill="#ffc79a" stroke="var(--lf-ink)" stroke-width="2.5" />
          <circle cx="24" cy="46" r="4" fill="#ff9d6b" stroke="var(--lf-ink)" stroke-width="2" />
          <circle cx="76" cy="46" r="4" fill="#ff9d6b" stroke="var(--lf-ink)" stroke-width="2" />
          <path d="M34 42c4-7 24-7 32 0" fill="#ffc79a" stroke="var(--lf-ink)" stroke-width="2.5" />
          <path d="M38 53c0 3-2 5-4.5 5M62 53c0 3 2 5 4.5 5" fill="none" stroke="var(--lf-ink)" stroke-width="2.4" stroke-linecap="round" />
          <circle cx="40" cy="53" r="4" fill="var(--lf-ink)" />
          <circle cx="60" cy="53" r="4" fill="var(--lf-ink)" />
          <circle cx="41.6" cy="51.4" r="1.3" fill="#fff" />
          <circle cx="61.6" cy="51.4" r="1.3" fill="#fff" />
          <path d="M42 63c4 4 12 4 16 0" fill="#ff8f8f" stroke="var(--lf-ink)" stroke-width="2.4" stroke-linejoin="round" />
        </template>

        <!-- 顾沉舟：清冷侧分 · 海蓝 -->
        <template v-else>
          <path d="M22 58C16 34 28 16 50 16s34 18 28 42c-3-8-6-12-6-12 0 6-2 10-2 10l-6-22-10 10-8-8-6 8-6-6-2 18s-2-4-2-10c0 0-3 4-6 12Z" fill="#8fb9e8" stroke="var(--lf-ink)" stroke-width="2.5" stroke-linejoin="round" />
          <path d="M30 84c0-14 9-22 20-22s20 8 20 22Z" fill="#ffe2cf" stroke="var(--lf-ink)" stroke-width="2.5" />
          <path d="M30 40c2-2 14-4 18 2-6-1-12-1-18 4Z" fill="#8fb9e8" stroke="var(--lf-ink)" stroke-width="2" />
          <path d="M36 42h8M58 42h8" fill="none" stroke="var(--lf-ink)" stroke-width="2.4" stroke-linecap="round" />
          <path d="M37 55c1.5-2 5-2 6.5 0" fill="none" stroke="var(--lf-ink)" stroke-width="3" stroke-linecap="round" />
          <path d="M56.5 55c1.5-2 5-2 6.5 0" fill="none" stroke="var(--lf-ink)" stroke-width="3" stroke-linecap="round" />
          <path d="M44 66h12" fill="none" stroke="var(--lf-ink)" stroke-width="2.4" stroke-linecap="round" />
        </template>

        <!-- 通用腮红 -->
        <ellipse cx="32" cy="62" rx="5" ry="3" :fill="blush" opacity="0.7" />
        <ellipse cx="68" cy="62" rx="5" ry="3" :fill="blush" opacity="0.7" />
      </g>
    </svg>
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { CharacterId } from '../../types';

const props = withDefaults(
  defineProps<{
    id: CharacterId;
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
    ring?: boolean;
    ringColor?: string;
    bob?: boolean;
  }>(),
  { size: 'md', ring: false, bob: false },
);

const uidKey = computed(() => `${props.id}-${props.size}-${props.ring ? 'r' : 'n'}`);

const bgMap: Record<CharacterId, string> = {
  qinghe: '#efe9fb',
  suqing: '#ffe8da',
  chenzhou: '#e3f3fd',
};
const blushMap: Record<CharacterId, string> = {
  qinghe: '#f7a8c4',
  suqing: '#ff9d6b',
  chenzhou: '#f7a8c4',
};
const bg = computed(() => bgMap[props.id]);
const blush = computed(() => blushMap[props.id]);
const ringStyle = computed(() => (props.ring ? { '--lf-ring-color': props.ringColor ?? 'var(--lf-strawberry)' } : {}));
</script>

<style scoped lang="scss">
.lf-avatar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  border-radius: var(--lf-radius-pill);
}
.lf-avatar__svg {
  width: 100%;
  height: 100%;
  display: block;
}
.lf-avatar--xs { width: 30px; height: 30px; }
.lf-avatar--sm { width: 40px; height: 40px; }
.lf-avatar--md { width: 56px; height: 56px; }
.lf-avatar--lg { width: 80px; height: 80px; }
.lf-avatar--xl { width: 120px; height: 120px; }

.lf-avatar--ring {
  padding: 3px;
  background: var(--lf-ring-color);
  border: 2.5px solid var(--lf-ink);
  box-shadow: var(--lf-shadow-chunky-sm);
}
.lf-avatar--bob {
  animation: lf-float-bob 3.4s var(--lf-ease-soft) infinite;
}
</style>
