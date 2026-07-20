<template>
  <div class="lf-tl">
    <header class="lf-tl__head">
      <h2 class="lf-tl__title"><AppIcon name="timeline" size="md" bold /> 故事时间轴</h2>
      <p class="lf-tl__sub">已走过 {{ doneCount }} 个节点 · 还有 {{ upcomingCount }} 个在前方</p>
    </header>

    <ol class="lf-tl__list">
      <li
        v-for="(ev, i) in events"
        :key="ev.id"
        class="lf-tl__item"
        :class="[`lf-tl__item--${ev.status}`, { 'lf-tl__item--open': openId === ev.id }]"
        :style="{ animationDelay: `${i * 50}ms` }"
      >
        <div class="lf-tl__spine" aria-hidden="true">
          <span class="lf-tl__node">
            <AppIcon :name="nodeIcon(ev)" size="sm" bold />
          </span>
        </div>

        <button
          :id="`lf-tl-item-${ev.id}`"
          type="button"
          class="lf-tl__card"
          :aria-expanded="openId === ev.id"
          @click="toggle(ev.id)"
        >
          <div class="lf-tl__card-top">
            <div class="lf-tl__when">
              <span class="lf-tl__day">Day {{ ev.day }}</span>
              <span class="lf-tl__time">{{ ev.time }}</span>
            </div>
            <span class="lf-tl__status">{{ statusLabel(ev.status) }}</span>
          </div>
          <h3 class="lf-tl__name">{{ ev.title }}</h3>

          <Transition name="lf-expand">
            <div v-if="openId === ev.id" class="lf-tl__detail">
              <p class="lf-tl__desc">{{ ev.description }}</p>
              <div v-if="ev.relatedCharacter" class="lf-tl__rel">
                <CharacterAvatar :id="ev.relatedCharacter" size="xs" ring :ring-color="charColor(ev.relatedCharacter)" />
                <span>相关：{{ charName(ev.relatedCharacter) }}</span>
              </div>
            </div>
          </Transition>

          <span class="lf-tl__chevron" :class="{ 'lf-tl__chevron--open': openId === ev.id }" aria-hidden="true">
            <AppIcon name="chevron-down" size="sm" bold />
          </span>
        </button>
      </li>
    </ol>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import AppIcon, { type IconName } from '../components/base/AppIcon.vue';
import CharacterAvatar from '../components/base/CharacterAvatar.vue';
import { getCharacter } from '../data/characters';
import { timelineEvents } from '../data/timeline';
import type { CharacterId, TimelineEvent } from '../types';

const events = timelineEvents;
const openId = ref<string | null>(timelineEvents.find(e => e.status === 'current')?.id ?? null);

const doneCount = computed(() => events.filter(e => e.status === 'done').length);
const upcomingCount = computed(() => events.filter(e => e.status === 'upcoming' || e.status === 'preview').length);

function toggle(id: string) {
  openId.value = openId.value === id ? null : id;
}
function nodeIcon(ev: TimelineEvent): IconName {
  if (ev.status === 'done') return 'check';
  if (ev.status === 'preview') return 'sparkle';
  return ev.icon;
}
function statusLabel(status: TimelineEvent['status']) {
  return { done: '已完成', current: '进行中', upcoming: '即将到来', preview: '预告' }[status];
}
function charColor(id: CharacterId) {
  return getCharacter(id)?.color ?? 'var(--lf-strawberry)';
}
function charName(id: CharacterId) {
  return getCharacter(id)?.fullName ?? '';
}
</script>

<style scoped lang="scss">
.lf-tl {
  padding: 12px 12px 20px;
}
.lf-tl__head {
  margin-bottom: 14px;
}
.lf-tl__title {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  font-size: 18px;
  font-weight: 700;
}
.lf-tl__sub {
  margin-top: 4px;
  font-size: 12px;
  color: var(--lf-text-secondary);
  font-weight: 600;
}

.lf-tl__list {
  position: relative;
}
.lf-tl__item {
  position: relative;
  display: flex;
  gap: 12px;
  padding-bottom: 12px;
  animation: lf-pop-in var(--lf-dur) var(--lf-ease-bounce) both;
}
.lf-tl__spine {
  position: relative;
  display: flex;
  justify-content: center;
  width: 40px;
  flex-shrink: 0;
}
.lf-tl__spine::before {
  content: '';
  position: absolute;
  top: 0;
  bottom: -12px;
  width: 3px;
  background: repeating-linear-gradient(var(--lf-line-strong) 0 6px, transparent 6px 11px);
}
.lf-tl__item:last-child .lf-tl__spine::before { display: none; }
.lf-tl__node {
  position: relative;
  z-index: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  margin-top: 2px;
  border: 2.5px solid var(--lf-ink);
  border-radius: var(--lf-radius-pill);
  background: var(--lf-surface);
  color: var(--lf-ink);
  box-shadow: var(--lf-shadow-chunky-sm);
}
.lf-tl__item--done .lf-tl__node { background: var(--lf-mint); }
.lf-tl__item--current .lf-tl__node {
  background: var(--lf-strawberry);
  animation: lf-float-bob 2s ease-in-out infinite;
}
.lf-tl__item--upcoming .lf-tl__node { background: var(--lf-sky); }
.lf-tl__item--preview .lf-tl__node {
  background: var(--lf-butter);
  border-style: dashed;
}

.lf-tl__card {
  flex: 1;
  min-width: 0;
  position: relative;
  padding: 12px 36px 12px 13px;
  border: 2.5px solid var(--lf-ink);
  border-radius: var(--lf-radius-lg);
  background: var(--lf-surface);
  text-align: left;
  box-shadow: var(--lf-shadow-chunky-sm);
  transition: transform var(--lf-dur) var(--lf-ease-bounce), box-shadow var(--lf-dur) var(--lf-ease-out);
}
.lf-tl__card:hover { transform: translate(-2px, -2px); box-shadow: var(--lf-shadow-chunky); }
.lf-tl__item--current .lf-tl__card { background: #fff4f8; }
.lf-tl__item--preview .lf-tl__card { background: #fff8e8; border-style: dashed; }

.lf-tl__card-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 4px;
}
.lf-tl__when {
  display: inline-flex;
  align-items: baseline;
  gap: 6px;
}
.lf-tl__day { font-family: var(--lf-font-display); font-weight: 700; font-size: 13px; color: var(--lf-strawberry-deep); }
.lf-tl__time { font-size: 11px; color: var(--lf-text-secondary); font-weight: 600; }
.lf-tl__status {
  padding: 1px 8px;
  border: 1.5px solid var(--lf-line-strong);
  border-radius: var(--lf-radius-pill);
  font-size: 10px;
  font-weight: 700;
  color: var(--lf-text-secondary);
  background: var(--lf-surface-soft);
}
.lf-tl__name { font-size: 15px; font-weight: 700; }

.lf-tl__detail { overflow: hidden; }
.lf-tl__desc {
  margin-top: 8px;
  font-size: 13px;
  line-height: 1.7;
  color: var(--lf-text-secondary);
}
.lf-tl__rel {
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

.lf-tl__chevron {
  position: absolute;
  top: 12px;
  right: 11px;
  color: var(--lf-text-muted);
  transition: transform var(--lf-dur) var(--lf-ease-bounce);
}
.lf-tl__chevron--open { transform: rotate(180deg); }

.lf-expand-enter-active { transition: opacity var(--lf-dur) var(--lf-ease-out), max-height var(--lf-dur) var(--lf-ease-out); max-height: 200px; }
.lf-expand-leave-active { transition: opacity 140ms var(--lf-ease-soft), max-height 140ms var(--lf-ease-soft); max-height: 200px; }
.lf-expand-enter-from,
.lf-expand-leave-to { opacity: 0; max-height: 0; }
</style>
