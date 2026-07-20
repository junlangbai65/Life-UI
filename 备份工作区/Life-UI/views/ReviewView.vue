<template>
  <div class="lf-rv">
    <header class="lf-rv__head">
      <h2 class="lf-rv__title"><AppIcon name="review" size="md" bold /> 回顾浏览器</h2>
      <p class="lf-rv__sub">珍藏在手账里的每一段时光</p>
    </header>

    <nav class="lf-rv__filters" aria-label="回顾分类">
      <button
        v-for="f in filters"
        :id="`lf-rv-filter-${f.key}`"
        :key="f.key"
        type="button"
        class="lf-rv__filter"
        :class="{ 'lf-rv__filter--on': filter === f.key }"
        @click="filter = f.key"
      >
        <AppIcon :name="f.icon" size="xs" bold />
        {{ f.label }}
      </button>
    </nav>

    <div class="lf-rv__line">
      <TransitionGroup name="lf-rv-card">
        <article
          v-for="(entry, i) in filtered"
          :id="`lf-rv-entry-${entry.id}`"
          :key="entry.id"
          class="lf-rv__entry"
          :style="{ animationDelay: `${i * 60}ms` }"
        >
          <div class="lf-rv__bead" aria-hidden="true">
            <AppIcon :name="entry.icon" size="sm" bold />
          </div>
          <button
            type="button"
            class="lf-rv__card"
            :class="{ 'lf-rv__card--open': openId === entry.id }"
            :aria-expanded="openId === entry.id"
            @click="toggle(entry.id)"
          >
            <span v-if="entry.pinned" class="lf-rv__pin" aria-hidden="true"><AppIcon name="star" size="xs" bold /></span>
            <div class="lf-rv__card-top">
              <span class="lf-rv__time">{{ entry.time }}</span>
              <TagChip :tone="categoryTone(entry.category)" size="xs">{{ entry.category }}</TagChip>
            </div>
            <h3 class="lf-rv__name">{{ entry.title }}</h3>
            <p class="lf-rv__summary">{{ entry.summary }}</p>

            <Transition name="lf-expand">
              <div v-if="openId === entry.id" class="lf-rv__detail">
                <p class="lf-rv__detail-text">{{ entry.detail }}</p>
                <div v-if="entry.relatedCharacter" class="lf-rv__rel">
                  <CharacterAvatar :id="entry.relatedCharacter" size="xs" ring :ring-color="charColor(entry.relatedCharacter)" />
                  <span>{{ charName(entry.relatedCharacter) }}</span>
                </div>
              </div>
            </Transition>

            <span class="lf-rv__more">{{ openId === entry.id ? '收起' : '展开回忆' }}</span>
          </button>
        </article>
      </TransitionGroup>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import AppIcon, { type IconName } from '../components/base/AppIcon.vue';
import CharacterAvatar from '../components/base/CharacterAvatar.vue';
import TagChip from '../components/base/TagChip.vue';
import { getCharacter } from '../data/characters';
import { reviewEntries } from '../data/review';
import type { CharacterId, ReviewEntry } from '../types';

type FilterKey = 'all' | ReviewEntry['category'];

const filters: { key: FilterKey; label: string; icon: IconName }[] = [
  { key: 'all', label: '全部', icon: 'grid' },
  { key: '剧情', label: '剧情', icon: 'book' },
  { key: '回忆', label: '回忆', icon: 'camera' },
  { key: '里程碑', label: '里程碑', icon: 'flag' },
];

const filter = ref<FilterKey>('all');
const openId = ref<string | null>(reviewEntries.find(e => e.pinned)?.id ?? null);

const filtered = computed(() =>
  filter.value === 'all' ? reviewEntries : reviewEntries.filter(e => e.category === filter.value),
);

function toggle(id: string) {
  openId.value = openId.value === id ? null : id;
}
function categoryTone(cat: ReviewEntry['category']) {
  return ({ 剧情: 'sky', 回忆: 'lavender', 里程碑: 'peach' } as const)[cat];
}
function charColor(id: CharacterId) {
  return getCharacter(id)?.color ?? 'var(--lf-strawberry)';
}
function charName(id: CharacterId) {
  return getCharacter(id)?.fullName ?? '';
}
</script>

<style scoped lang="scss">
.lf-rv {
  padding: 12px 12px 20px;
}
.lf-rv__head { margin-bottom: 12px; }
.lf-rv__title {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  font-size: 18px;
  font-weight: 700;
}
.lf-rv__sub { margin-top: 3px; font-size: 12px; color: var(--lf-text-secondary); font-weight: 600; }

.lf-rv__filters {
  display: flex;
  gap: 7px;
  margin-bottom: 16px;
  flex-wrap: wrap;
}
.lf-rv__filter {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 6px 12px;
  border: 2px solid var(--lf-ink);
  border-radius: var(--lf-radius-pill);
  background: var(--lf-surface);
  font-family: var(--lf-font-display);
  font-size: 12px;
  font-weight: 600;
  color: var(--lf-text-secondary);
  box-shadow: var(--lf-shadow-chunky-sm);
  transition: transform var(--lf-dur) var(--lf-ease-bounce), background var(--lf-dur), color var(--lf-dur);
}
.lf-rv__filter:hover { transform: translateY(-2px); }
.lf-rv__filter--on {
  background: var(--lf-strawberry);
  color: var(--lf-ink);
}

.lf-rv__line {
  position: relative;
  padding-left: 4px;
}
.lf-rv__entry {
  position: relative;
  display: flex;
  gap: 12px;
  padding-bottom: 14px;
  animation: lf-pop-in var(--lf-dur) var(--lf-ease-bounce) both;
}
.lf-rv__bead {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  flex-shrink: 0;
  margin-top: 4px;
  border: 2.5px solid var(--lf-ink);
  border-radius: var(--lf-radius-pill);
  background: var(--lf-lavender);
  color: var(--lf-ink);
  box-shadow: var(--lf-shadow-chunky-sm);
}
.lf-rv__entry::before {
  content: '';
  position: absolute;
  left: 18px;
  top: 40px;
  bottom: -2px;
  width: 3px;
  background: repeating-linear-gradient(var(--lf-line-strong) 0 6px, transparent 6px 11px);
}
.lf-rv__entry:last-child::before { display: none; }

.lf-rv__card {
  position: relative;
  flex: 1;
  min-width: 0;
  padding: 12px 13px;
  border: 2.5px solid var(--lf-ink);
  border-radius: var(--lf-radius-lg);
  background: var(--lf-surface);
  text-align: left;
  box-shadow: var(--lf-shadow-chunky-sm);
  transition: transform var(--lf-dur) var(--lf-ease-bounce), box-shadow var(--lf-dur) var(--lf-ease-out);
}
.lf-rv__card:hover { transform: translate(-2px, -2px); box-shadow: var(--lf-shadow-chunky); }
.lf-rv__pin {
  position: absolute;
  top: -9px;
  right: 12px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border: 2px solid var(--lf-ink);
  border-radius: var(--lf-radius-pill);
  background: var(--lf-butter);
  color: var(--lf-ink);
  box-shadow: var(--lf-shadow-chunky-sm);
  transform: rotate(8deg);
}
.lf-rv__card-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 5px;
}
.lf-rv__time { font-family: var(--lf-font-display); font-weight: 700; font-size: 12px; color: var(--lf-text-secondary); }
.lf-rv__name { font-size: 15px; font-weight: 700; }
.lf-rv__summary { margin-top: 3px; font-size: 12.5px; color: var(--lf-text-secondary); line-height: 1.5; }

.lf-rv__detail { overflow: hidden; }
.lf-rv__detail-text {
  margin-top: 9px;
  padding-top: 9px;
  border-top: 2px dashed var(--lf-line-strong);
  font-size: 13px;
  line-height: 1.75;
  color: var(--lf-text);
}
.lf-rv__rel {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-top: 9px;
  padding: 3px 10px 3px 3px;
  border: 2px solid var(--lf-ink);
  border-radius: var(--lf-radius-pill);
  background: var(--lf-surface-soft);
  font-family: var(--lf-font-display);
  font-size: 11px;
  font-weight: 600;
}
.lf-rv__more {
  display: inline-block;
  margin-top: 8px;
  font-family: var(--lf-font-display);
  font-size: 11px;
  font-weight: 700;
  color: var(--lf-strawberry-deep);
}

.lf-expand-enter-active { transition: opacity var(--lf-dur) var(--lf-ease-out), max-height var(--lf-dur) var(--lf-ease-out); max-height: 240px; }
.lf-expand-leave-active { transition: opacity 140ms var(--lf-ease-soft), max-height 140ms var(--lf-ease-soft); max-height: 240px; }
.lf-expand-enter-from,
.lf-expand-leave-to { opacity: 0; max-height: 0; }

.lf-rv-card-move { transition: transform var(--lf-dur) var(--lf-ease-soft); }
</style>
