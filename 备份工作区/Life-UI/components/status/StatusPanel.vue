<template>
  <Teleport to="#lf-overlay-root">
    <Transition name="lf-scrim-fade">
      <div v-if="ui.statusPanelOpen" class="lf-status__scrim" @click="ui.toggleStatusPanel(false)" />
    </Transition>
    <Transition name="lf-slide">
      <aside v-if="ui.statusPanelOpen" class="lf-status lf-scroll" aria-label="状态面板">
        <header class="lf-status__head">
          <h2 class="lf-status__title"><AppIcon name="mood" size="md" bold /> 状态面板</h2>
          <button id="lf-status-close" type="button" class="lf-status__close" aria-label="收起面板" @click="ui.toggleStatusPanel(false)">
            <AppIcon name="chevron-right" size="sm" bold />
          </button>
        </header>

        <section class="lf-status__block">
          <h3 class="lf-status__label"><AppIcon name="sun" size="sm" /> 环境</h3>
          <div class="lf-status__tags">
            <TagChip tone="sky" :icon="game.env.weather.icon" sticker>{{ game.env.weather.label }}</TagChip>
            <TagChip tone="butter" icon="sun" sticker>{{ game.env.season }}</TagChip>
            <TagChip tone="lavender" icon="clock" sticker>{{ game.env.timeOfDay }}</TagChip>
            <TagChip tone="mint" icon="leaf" sticker>{{ game.env.ambiance }}</TagChip>
            <TagChip tone="peach" icon="location" sticker>{{ game.currentScene.name }}</TagChip>
          </div>
        </section>

        <section class="lf-status__block">
          <h3 class="lf-status__label"><AppIcon name="energy" size="sm" /> 数值</h3>
          <div class="lf-status__stats">
            <StatBar
              v-for="stat in game.stats"
              :key="stat.key"
              :label="stat.label"
              :icon="stat.icon"
              :value="stat.value"
              :max="stat.max"
              :color="stat.color"
              :suffix="stat.key === 'funds' ? '' : ''"
              :show-raw="stat.max === 100"
            />
          </div>
        </section>

        <section class="lf-status__block">
          <h3 class="lf-status__label"><AppIcon name="heart" size="sm" /> 羁绊</h3>
          <div class="lf-status__bonds">
            <button
              v-for="c in character.list"
              :id="`lf-status-bond-${c.id}`"
              :key="c.id"
              type="button"
              class="lf-status__bond"
              @click="openCard(c.id)"
            >
              <CharacterAvatar :id="c.id" size="sm" ring :ring-color="c.color" />
              <div class="lf-status__bond-info">
                <div class="lf-status__bond-top">
                  <span class="lf-status__bond-name">{{ c.fullName }}</span>
                  <span class="lf-status__bond-stage">{{ c.affinityStage }}</span>
                </div>
                <div class="lf-status__bond-track">
                  <span class="lf-status__bond-fill" :style="{ width: c.affinity + '%', background: c.color }" />
                </div>
              </div>
              <span class="lf-status__bond-aff">{{ c.affinity }}</span>
            </button>
          </div>
        </section>
      </aside>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import AppIcon from '../base/AppIcon.vue';
import CharacterAvatar from '../base/CharacterAvatar.vue';
import StatBar from '../base/StatBar.vue';
import TagChip from '../base/TagChip.vue';
import { useCharacterStore } from '../../stores/useCharacterStore';
import { useGameStore } from '../../stores/useGameStore';
import { useUiStore } from '../../stores/useUiStore';
import type { CharacterId } from '../../types';

const ui = useUiStore();
const game = useGameStore();
const character = useCharacterStore();

function openCard(id: CharacterId) {
  ui.toggleStatusPanel(false);
  ui.openCharacterCard(id);
}
</script>

<style scoped lang="scss">
.lf-status__scrim {
  position: absolute;
  inset: 0;
  z-index: var(--lf-z-panel);
  background: rgba(91, 74, 82, 0.3);
  backdrop-filter: blur(2px);
}
.lf-status {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  z-index: calc(var(--lf-z-panel) + 1);
  width: 84%;
  max-width: 340px;
  overflow-y: auto;
  padding: 16px 14px 24px;
  background: var(--lf-bg);
  border-left: 3px solid var(--lf-ink);
  box-shadow: -10px 0 30px rgba(91, 74, 82, 0.2);
}
.lf-status__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14px;
}
.lf-status__title {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  font-size: 18px;
  font-weight: 700;
}
.lf-status__close {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  border: 2.5px solid var(--lf-ink);
  border-radius: var(--lf-radius-pill);
  background: var(--lf-surface);
  color: var(--lf-ink);
  box-shadow: var(--lf-shadow-chunky-sm);
  transition: transform var(--lf-dur) var(--lf-ease-bounce), background var(--lf-dur);
}
.lf-status__close:hover { background: var(--lf-strawberry); transform: translateX(2px); }

.lf-status__block {
  margin-bottom: 16px;
  padding: 13px;
  border: 2.5px solid var(--lf-ink);
  border-radius: var(--lf-radius-lg);
  background: var(--lf-surface);
  box-shadow: var(--lf-shadow-chunky-sm);
}
.lf-status__label {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 11px;
  font-size: 13px;
  color: var(--lf-text-secondary);
}
.lf-status__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 7px;
}
.lf-status__stats {
  display: flex;
  flex-direction: column;
  gap: 13px;
}

.lf-status__bonds {
  display: flex;
  flex-direction: column;
  gap: 9px;
}
.lf-status__bond {
  display: flex;
  align-items: center;
  gap: 9px;
  padding: 8px 9px;
  border: 2px solid var(--lf-ink);
  border-radius: var(--lf-radius-md);
  background: var(--lf-surface-soft);
  text-align: left;
  transition: transform var(--lf-dur) var(--lf-ease-bounce), background var(--lf-dur);
}
.lf-status__bond:hover { transform: translateX(3px); background: var(--lf-butter); }
.lf-status__bond-info { flex: 1; min-width: 0; }
.lf-status__bond-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 6px;
  margin-bottom: 5px;
}
.lf-status__bond-name { font-family: var(--lf-font-display); font-weight: 700; font-size: 13px; }
.lf-status__bond-stage { font-size: 10px; color: var(--lf-text-secondary); font-weight: 600; }
.lf-status__bond-track {
  height: 9px;
  border: 2px solid var(--lf-ink);
  border-radius: var(--lf-radius-pill);
  background: var(--lf-surface-sunken);
  overflow: hidden;
}
.lf-status__bond-fill {
  display: block;
  height: 100%;
  border-radius: var(--lf-radius-pill);
  transition: width 0.6s var(--lf-ease-out);
}
.lf-status__bond-aff {
  font-family: var(--lf-font-display);
  font-weight: 700;
  font-size: 15px;
  color: var(--lf-strawberry-deep);
}

.lf-slide-enter-active { transition: transform var(--lf-dur) var(--lf-ease-bounce); }
.lf-slide-leave-active { transition: transform var(--lf-dur) var(--lf-ease-soft); }
.lf-slide-enter-from,
.lf-slide-leave-to { transform: translateX(100%); }

.lf-scrim-fade-enter-active,
.lf-scrim-fade-leave-active { transition: opacity var(--lf-dur) var(--lf-ease-soft); }
.lf-scrim-fade-enter-from,
.lf-scrim-fade-leave-to { opacity: 0; }
</style>
