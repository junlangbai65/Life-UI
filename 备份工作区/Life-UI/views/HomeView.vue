<template>
  <div class="lf-home">
    <CharacterStage />
    <OverviewCards />

    <section class="lf-home__entries" aria-label="功能入口">
      <h3 class="lf-home__entries-title"><AppIcon name="sparkle" size="sm" bold /> 去哪儿呢？</h3>
      <div class="lf-home__grid">
        <button
          v-for="(entry, i) in entries"
          :id="`lf-home-entry-${entry.key}`"
          :key="entry.key"
          type="button"
          class="lf-home__entry"
          :class="`lf-home__entry--${entry.tone}`"
          :style="{ '--lf-entry-rot': `${entry.rot}deg`, animationDelay: `${i * 60}ms` }"
          @click="entry.action"
        >
          <span class="lf-home__entry-icon"><AppIcon :name="entry.icon" size="lg" bold /></span>
          <span class="lf-home__entry-label">{{ entry.label }}</span>
          <span class="lf-home__entry-desc">{{ entry.desc }}</span>
        </button>
      </div>
    </section>

    <footer class="lf-home__footer">
      <span class="lf-home__footer-tape" aria-hidden="true" />
      <p class="lf-home__footer-text">
        云町的故事，由你书写。每一次选择，都会留在这本手账里。
      </p>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import AppIcon, { type IconName } from '../components/base/AppIcon.vue';
import CharacterStage from '../components/home/CharacterStage.vue';
import OverviewCards from '../components/home/OverviewCards.vue';
import { useUiStore } from '../stores/useUiStore';

const router = useRouter();
const ui = useUiStore();

interface Entry {
  key: string;
  label: string;
  desc: string;
  icon: IconName;
  tone: string;
  rot: number;
  action: () => void;
}

const entries: Entry[] = [
  { key: 'dialogue', label: '对话', desc: '继续今天的故事', icon: 'chat', tone: 'strawberry', rot: -1.5, action: () => router.push('/dialogue') },
  { key: 'map', label: '地图', desc: '云町四处走走', icon: 'map', tone: 'mint', rot: 1.5, action: () => router.push('/map') },
  { key: 'timeline', label: '时间轴', desc: '回看与预告', icon: 'timeline', tone: 'sky', rot: 1, action: () => router.push('/timeline') },
  { key: 'review', label: '回顾', desc: '珍藏的回忆', icon: 'review', tone: 'lavender', rot: -1, action: () => router.push('/review') },
  { key: 'data', label: '数据详情', desc: '变量与历史', icon: 'book', tone: 'butter', rot: 1.5, action: () => (ui.dataPanelOpen = true) },
  { key: 'save', label: '存档', desc: '保存与读取', icon: 'save', tone: 'peach', rot: -1.5, action: () => (ui.saveManagerOpen = true) },
];
</script>

<style scoped lang="scss">
.lf-home {
  padding-bottom: 16px;
}

.lf-home__entries {
  margin: 0 12px;
}
.lf-home__entries-title {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 10px;
  font-size: 15px;
  font-weight: 700;
}
.lf-home__grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}
.lf-home__entry {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3px;
  padding: 13px 6px 11px;
  border: 2.5px solid var(--lf-ink);
  border-radius: var(--lf-radius-lg);
  background: var(--lf-surface);
  box-shadow: var(--lf-shadow-chunky-sm);
  transform: rotate(var(--lf-entry-rot));
  animation: lf-pop-in var(--lf-dur) var(--lf-ease-bounce) both;
  transition: transform var(--lf-dur) var(--lf-ease-bounce), box-shadow var(--lf-dur) var(--lf-ease-out);
}
.lf-home__entry:hover {
  transform: rotate(0deg) translate(-2px, -2px);
  box-shadow: var(--lf-shadow-chunky-lg);
}
.lf-home__entry:active {
  transform: rotate(0deg) translate(1px, 1px);
  box-shadow: var(--lf-shadow-chunky-sm);
}
.lf-home__entry-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border: 2.5px solid var(--lf-ink);
  border-radius: var(--lf-radius-md);
  color: var(--lf-ink);
}
.lf-home__entry--strawberry .lf-home__entry-icon { background: var(--lf-strawberry); }
.lf-home__entry--mint .lf-home__entry-icon { background: var(--lf-mint); }
.lf-home__entry--sky .lf-home__entry-icon { background: var(--lf-sky); }
.lf-home__entry--lavender .lf-home__entry-icon { background: var(--lf-lavender); }
.lf-home__entry--butter .lf-home__entry-icon { background: var(--lf-butter); }
.lf-home__entry--peach .lf-home__entry-icon { background: var(--lf-peach); }

.lf-home__entry-label {
  margin-top: 4px;
  font-family: var(--lf-font-display);
  font-weight: 700;
  font-size: 14px;
  color: var(--lf-text);
}
.lf-home__entry-desc {
  font-size: 10px;
  color: var(--lf-text-secondary);
  text-align: center;
}

.lf-home__footer {
  position: relative;
  margin: 18px 20px 4px;
  padding: 14px 16px;
  border: 2.5px dashed var(--lf-line-strong);
  border-radius: var(--lf-radius-lg);
  background: var(--lf-surface-soft);
}
.lf-home__footer-tape {
  position: absolute;
  top: -11px;
  left: 50%;
  width: 72px;
  height: 20px;
  transform: translateX(-50%) rotate(-2deg);
  background: repeating-linear-gradient(-45deg, rgba(247, 168, 196, 0.7), rgba(247, 168, 196, 0.7) 6px, rgba(255, 176, 136, 0.7) 6px, rgba(255, 176, 136, 0.7) 12px);
  border: 1.5px solid rgba(91, 74, 82, 0.22);
  border-radius: 3px;
}
.lf-home__footer-text {
  font-family: var(--lf-font-hand);
  font-size: 17px;
  text-align: center;
  color: var(--lf-ink-soft);
  line-height: 1.4;
}
</style>
