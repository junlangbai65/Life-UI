<template>
  <section class="lf-stage" :class="`lf-stage--${char.accent}`" aria-label="角色立绘舞台">
    <div class="lf-stage__deco" aria-hidden="true">
      <span class="lf-stage__blob" />
      <span class="lf-stage__sparkle lf-stage__sparkle--1"><AppIcon name="sparkle" size="sm" /></span>
      <span class="lf-stage__sparkle lf-stage__sparkle--2"><AppIcon name="star" size="xs" /></span>
    </div>

    <button
      id="lf-stage-prev"
      type="button"
      class="lf-stage__arrow lf-stage__arrow--prev"
      aria-label="上一位角色"
      @click="character.cycleFocus(-1)"
    >
      <AppIcon name="chevron-left" size="md" bold />
    </button>
    <button
      id="lf-stage-next"
      type="button"
      class="lf-stage__arrow lf-stage__arrow--next"
      aria-label="下一位角色"
      @click="character.cycleFocus(1)"
    >
      <AppIcon name="chevron-right" size="md" bold />
    </button>

    <Transition name="lf-stage-fade" mode="out-in">
      <button
        :key="char.id"
        :id="`lf-stage-portrait-${char.id}`"
        type="button"
        class="lf-stage__portrait"
        :aria-label="`查看 ${char.fullName} 的角色卡`"
        @click="ui.openCharacterCard(char.id)"
      >
        <img v-if="portrait" :src="portrait" :alt="`${char.fullName} 立绘`" class="lf-stage__img" />
        <CharacterAvatar v-else :id="char.id" size="xl" bob class="lf-stage__avatar" />
        <span class="lf-stage__tap">
          <AppIcon name="eye" size="xs" /> 查看角色卡
        </span>
      </button>
    </Transition>

    <div class="lf-stage__nameplate">
      <div class="lf-stage__name-row">
        <h2 class="lf-stage__name">{{ char.fullName }}</h2>
        <TagChip :tone="char.accent" :icon="'mood'" sticker>{{ char.mood }}</TagChip>
      </div>
      <p class="lf-stage__title">{{ char.title }}</p>
      <div class="lf-stage__affinity">
        <span class="lf-stage__hearts" :aria-label="`好感度 ${char.affinity}`">
          <AppIcon
            v-for="i in 5"
            :key="i"
            name="heart"
            size="sm"
            :bold="i <= heartCount"
            :class="{ 'lf-stage__heart--full': i <= heartCount }"
          />
        </span>
        <span class="lf-stage__stage">{{ char.affinityStage }}</span>
      </div>
    </div>

    <nav class="lf-stage__dots" aria-label="切换角色">
      <button
        v-for="c in character.list"
        :id="`lf-stage-dot-${c.id}`"
        :key="c.id"
        type="button"
        class="lf-stage__dot"
        :class="{ 'lf-stage__dot--on': c.id === char.id }"
        :style="{ '--lf-dot': c.color }"
        :aria-label="`切换到 ${c.fullName}`"
        :aria-current="c.id === char.id"
        @click="character.setFocus(c.id)"
      />
    </nav>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import AppIcon from '../base/AppIcon.vue';
import CharacterAvatar from '../base/CharacterAvatar.vue';
import TagChip from '../base/TagChip.vue';
import { portraits } from '../../data/portraits';
import { useCharacterStore } from '../../stores/useCharacterStore';
import { useUiStore } from '../../stores/useUiStore';

const character = useCharacterStore();
const ui = useUiStore();

const char = computed(() => character.focused);
const portrait = computed(() => portraits[char.value.id]);
const heartCount = computed(() => Math.round((char.value.affinity / 100) * 5));
</script>

<style scoped lang="scss">
.lf-stage {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px 16px 14px;
  margin: 12px;
  border: 3px solid var(--lf-ink);
  border-radius: var(--lf-radius-xl);
  background: linear-gradient(165deg, #fffdfb, #fff2ea);
  box-shadow: var(--lf-shadow-chunky);
  overflow: hidden;
}
.lf-stage--lavender { background: linear-gradient(165deg, #fbf7ff, #efe9fb); }
.lf-stage--peach { background: linear-gradient(165deg, #fffaf6, #ffe8da); }
.lf-stage--sky { background: linear-gradient(165deg, #f6fbff, #e3f3fd); }

.lf-stage__deco {
  position: absolute;
  inset: 0;
  pointer-events: none;
}
.lf-stage__blob {
  position: absolute;
  top: -40px;
  left: 50%;
  width: 220px;
  height: 220px;
  transform: translateX(-50%);
  background: radial-gradient(circle, rgba(255, 255, 255, 0.7), transparent 70%);
}
.lf-stage__sparkle {
  position: absolute;
  color: var(--lf-strawberry);
}
.lf-stage__sparkle--1 { top: 18px; right: 56px; animation: lf-wiggle 3s ease-in-out infinite; }
.lf-stage__sparkle--2 { top: 64px; left: 48px; color: var(--lf-butter-deep); animation: lf-float-bob 4s ease-in-out infinite; }

.lf-stage__arrow {
  position: absolute;
  top: 44%;
  z-index: 3;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border: 2.5px solid var(--lf-ink);
  border-radius: var(--lf-radius-pill);
  background: var(--lf-surface);
  color: var(--lf-ink);
  box-shadow: var(--lf-shadow-chunky-sm);
  transition: transform var(--lf-dur) var(--lf-ease-bounce), background var(--lf-dur);
}
.lf-stage__arrow--prev { left: 8px; }
.lf-stage__arrow--next { right: 8px; }
.lf-stage__arrow:hover { background: var(--lf-butter); transform: scale(1.1); }
.lf-stage__arrow:active { transform: scale(0.95); }

.lf-stage__portrait {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 8px;
  border: none;
  background: transparent;
  z-index: 2;
}
.lf-stage__img {
  width: 168px;
  height: 200px;
  object-fit: contain;
  filter: drop-shadow(4px 6px 0 var(--lf-ink-shadow));
}
.lf-stage__avatar {
  width: 132px;
  height: 132px;
}
.lf-stage__tap {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 3px 11px;
  border: 2px solid var(--lf-ink);
  border-radius: var(--lf-radius-pill);
  background: var(--lf-surface);
  font-family: var(--lf-font-display);
  font-size: 11px;
  font-weight: 600;
  color: var(--lf-text-secondary);
  box-shadow: var(--lf-shadow-chunky-sm);
  transition: background var(--lf-dur), color var(--lf-dur);
}
.lf-stage__portrait:hover .lf-stage__tap {
  background: var(--lf-strawberry);
  color: var(--lf-ink);
}

.lf-stage__nameplate {
  width: 100%;
  margin-top: 6px;
  padding: 11px 14px;
  border: 2.5px solid var(--lf-ink);
  border-radius: var(--lf-radius-lg);
  background: var(--lf-surface);
  box-shadow: var(--lf-shadow-chunky-sm);
  z-index: 2;
}
.lf-stage__name-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}
.lf-stage__name {
  font-size: 19px;
  font-weight: 700;
}
.lf-stage__title {
  margin-top: 2px;
  font-size: 12px;
  color: var(--lf-text-secondary);
  font-weight: 600;
}
.lf-stage__affinity {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 8px;
}
.lf-stage__hearts {
  display: inline-flex;
  gap: 2px;
  color: var(--lf-line-strong);
}
.lf-stage__heart--full {
  color: var(--lf-strawberry-deep);
  animation: lf-float-bob 2.4s ease-in-out infinite;
}
.lf-stage__stage {
  font-family: var(--lf-font-display);
  font-size: 12px;
  font-weight: 700;
  color: var(--lf-strawberry-deep);
}

.lf-stage__dots {
  display: flex;
  gap: 8px;
  margin-top: 12px;
  z-index: 2;
}
.lf-stage__dot {
  width: 14px;
  height: 14px;
  border: 2.5px solid var(--lf-ink);
  border-radius: var(--lf-radius-pill);
  background: var(--lf-surface);
  transition: transform var(--lf-dur) var(--lf-ease-bounce), background var(--lf-dur);
}
.lf-stage__dot:hover { transform: scale(1.2); }
.lf-stage__dot--on {
  background: var(--lf-dot);
  transform: scale(1.25);
}

.lf-stage-fade-enter-active {
  transition: opacity var(--lf-dur) var(--lf-ease-out), transform var(--lf-dur) var(--lf-ease-bounce);
}
.lf-stage-fade-leave-active {
  transition: opacity 140ms var(--lf-ease-soft), transform 140ms var(--lf-ease-soft);
}
.lf-stage-fade-enter-from {
  opacity: 0;
  transform: translateX(30px) scale(0.94);
}
.lf-stage-fade-leave-to {
  opacity: 0;
  transform: translateX(-30px) scale(0.94);
}
</style>
