<template>
  <div class="lf-map">
    <header class="lf-map__head">
      <h2 class="lf-map__title"><AppIcon name="map" size="md" bold /> 云町地图</h2>
      <TagChip tone="peach" icon="location" sticker>当前：{{ game.currentScene.name }}</TagChip>
    </header>

    <section class="lf-map__canvas" aria-label="场景地图">
      <svg class="lf-map__paths" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
        <path
          v-for="(p, i) in paths"
          :key="i"
          :d="p"
          fill="none"
          stroke="var(--lf-line-strong)"
          stroke-width="0.8"
          stroke-dasharray="2 2"
          stroke-linecap="round"
        />
      </svg>

      <button
        v-for="scene in scenes"
        :id="`lf-map-node-${scene.id}`"
        :key="scene.id"
        type="button"
        class="lf-map__node"
        :class="[
          `lf-map__node--${scene.tone}`,
          { 'lf-map__node--active': scene.id === game.currentSceneId, 'lf-map__node--locked': !scene.unlocked },
        ]"
        :style="{ left: scene.x + '%', top: scene.y + '%' }"
        :disabled="!scene.unlocked"
        :aria-label="`${scene.name}${scene.unlocked ? '' : '（未解锁）'}`"
        :aria-current="scene.id === game.currentSceneId"
        @click="select(scene.id)"
      >
        <span class="lf-map__pin">
          <AppIcon :name="scene.unlocked ? scene.icon : 'lock'" size="md" bold />
        </span>
        <span class="lf-map__node-name">{{ scene.name }}</span>
        <span v-if="scene.id === game.currentSceneId" class="lf-map__here" aria-hidden="true" />
      </button>
    </section>

    <Transition name="lf-card-swap" mode="out-in">
      <ClayCard :key="active.id" tone="paper" class="lf-map__detail" taped>
        <div class="lf-map__detail-head">
          <span class="lf-map__detail-icon" :class="`lf-map__node--${active.tone}`" aria-hidden="true">
            <AppIcon :name="active.icon" size="md" bold />
          </span>
          <div>
            <h3 class="lf-map__detail-name">{{ active.name }}</h3>
            <p class="lf-map__detail-sub">{{ active.subtitle }}</p>
          </div>
        </div>
        <p class="lf-map__detail-desc">{{ active.description }}</p>

        <div v-if="active.presentCharacters.length" class="lf-map__cast">
          <span class="lf-map__cast-label">此刻在场：</span>
          <button
            v-for="cid in active.presentCharacters"
            :id="`lf-map-cast-${cid}`"
            :key="cid"
            type="button"
            class="lf-map__cast-chip"
            @click="ui.openCharacterCard(cid)"
          >
            <CharacterAvatar :id="cid" size="xs" ring :ring-color="charColor(cid)" />
            <span>{{ charName(cid) }}</span>
          </button>
        </div>
        <p v-else class="lf-map__empty">这里暂时没有人……</p>

        <ClayButton
          :id="`lf-map-go-${active.id}`"
          block
          variant="primary"
          :disabled="!active.unlocked || active.id === game.currentSceneId"
          @click="travel"
        >
          <template #icon><AppIcon name="chevron-right" size="sm" bold /></template>
          {{ active.id === game.currentSceneId ? '已在此处' : active.unlocked ? `前往${active.name}` : '尚未解锁' }}
        </ClayButton>
      </ClayCard>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import AppIcon from '../components/base/AppIcon.vue';
import CharacterAvatar from '../components/base/CharacterAvatar.vue';
import ClayButton from '../components/base/ClayButton.vue';
import ClayCard from '../components/base/ClayCard.vue';
import TagChip from '../components/base/TagChip.vue';
import { useNotify } from '../composables/useNotify';
import { getCharacter } from '../data/characters';
import { scenes } from '../data/scenes';
import { useGameStore } from '../stores/useGameStore';
import { useUiStore } from '../stores/useUiStore';
import type { CharacterId } from '../types';

const game = useGameStore();
const ui = useUiStore();
const notify = useNotify();

const selectedId = ref(game.currentSceneId);
const active = computed(() => scenes.find(s => s.id === selectedId.value) ?? scenes[0]);

// 场景之间的手账风虚线路径
const paths = [
  'M38 52 L20 30',
  'M38 52 L66 34',
  'M66 34 L80 66',
  'M38 52 L52 80',
];

function charColor(id: CharacterId) {
  return getCharacter(id)?.color ?? 'var(--lf-strawberry)';
}
function charName(id: CharacterId) {
  return getCharacter(id)?.fullName ?? '';
}

function select(id: string) {
  selectedId.value = id;
}

function travel() {
  if (game.travelTo(active.value.id)) {
    notify.success('已抵达', `你来到了${active.value.name}`);
  }
}
</script>

<style scoped lang="scss">
.lf-map {
  padding: 12px 12px 18px;
}
.lf-map__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 12px;
}
.lf-map__title {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  font-size: 18px;
  font-weight: 700;
}

.lf-map__canvas {
  position: relative;
  width: 100%;
  aspect-ratio: 1 / 1;
  margin-bottom: 14px;
  border: 3px solid var(--lf-ink);
  border-radius: var(--lf-radius-xl);
  background:
    radial-gradient(circle at 30% 25%, rgba(168, 230, 207, 0.35), transparent 45%),
    radial-gradient(circle at 75% 70%, rgba(174, 223, 247, 0.35), transparent 45%),
    linear-gradient(160deg, #f3fbf6, #eaf5fc);
  box-shadow: var(--lf-shadow-chunky);
  overflow: hidden;
}
.lf-map__paths {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}

.lf-map__node {
  position: absolute;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3px;
  border: none;
  background: transparent;
  transition: transform var(--lf-dur) var(--lf-ease-bounce);
}
.lf-map__node:hover:not(:disabled) { transform: translate(-50%, -50%) scale(1.08); z-index: 3; }
.lf-map__node--locked { cursor: not-allowed; opacity: 0.7; }

.lf-map__pin {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 46px;
  height: 46px;
  border: 3px solid var(--lf-ink);
  border-radius: var(--lf-radius-pill);
  background: var(--lf-surface);
  color: var(--lf-ink);
  box-shadow: var(--lf-shadow-chunky-sm);
}
.lf-map__node--strawberry .lf-map__pin { background: var(--lf-strawberry); }
.lf-map__node--mint .lf-map__pin { background: var(--lf-mint); }
.lf-map__node--sky .lf-map__pin { background: var(--lf-sky); }
.lf-map__node--butter .lf-map__pin { background: var(--lf-butter); }
.lf-map__node--lavender .lf-map__pin { background: var(--lf-lavender); }
.lf-map__node--peach .lf-map__pin { background: var(--lf-peach); }

.lf-map__node-name {
  padding: 1px 8px;
  border: 2px solid var(--lf-ink);
  border-radius: var(--lf-radius-pill);
  background: var(--lf-surface);
  font-family: var(--lf-font-display);
  font-size: 10px;
  font-weight: 700;
  color: var(--lf-text);
  white-space: nowrap;
  box-shadow: var(--lf-shadow-chunky-sm);
}
.lf-map__node--active .lf-map__pin {
  animation: lf-float-bob 2.2s ease-in-out infinite;
}
.lf-map__here {
  position: absolute;
  top: -8px;
  width: 54px;
  height: 54px;
  border: 2.5px dashed var(--lf-strawberry-deep);
  border-radius: var(--lf-radius-pill);
  animation: lf-spin 8s linear infinite;
}

.lf-map__detail {
  padding: 14px;
}
.lf-map__detail-head {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}
.lf-map__detail-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border: 2.5px solid var(--lf-ink);
  border-radius: var(--lf-radius-md);
  color: var(--lf-ink);
  box-shadow: var(--lf-shadow-chunky-sm);
}
.lf-map__detail-name { font-size: 17px; font-weight: 700; }
.lf-map__detail-sub { font-size: 12px; color: var(--lf-text-secondary); font-weight: 600; }
.lf-map__detail-desc { font-size: 13px; line-height: 1.7; color: var(--lf-text-secondary); margin-bottom: 12px; }

.lf-map__cast {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 7px;
  margin-bottom: 13px;
}
.lf-map__cast-label { font-size: 12px; font-weight: 600; color: var(--lf-text); }
.lf-map__cast-chip {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 3px 9px 3px 3px;
  border: 2px solid var(--lf-ink);
  border-radius: var(--lf-radius-pill);
  background: var(--lf-surface-soft);
  font-family: var(--lf-font-display);
  font-size: 11px;
  font-weight: 600;
  color: var(--lf-text);
  transition: transform var(--lf-dur) var(--lf-ease-bounce), background var(--lf-dur);
}
.lf-map__cast-chip:hover { transform: translateY(-2px); background: var(--lf-butter); }
.lf-map__empty {
  margin-bottom: 13px;
  font-family: var(--lf-font-hand);
  font-size: 15px;
  color: var(--lf-text-muted);
}

.lf-card-swap-enter-active { transition: opacity var(--lf-dur) var(--lf-ease-out), transform var(--lf-dur) var(--lf-ease-bounce); }
.lf-card-swap-leave-active { transition: opacity 120ms var(--lf-ease-soft); }
.lf-card-swap-enter-from { opacity: 0; transform: translateY(12px); }
.lf-card-swap-leave-to { opacity: 0; }
</style>
