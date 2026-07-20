<template>
  <Teleport to="#lf-overlay-root">
    <Transition name="lf-modal">
      <div v-if="char" class="lf-cc" role="dialog" aria-modal="true" :aria-label="`${char.fullName} 角色卡`">
        <div class="lf-cc__scrim" @click="close" />
        <div class="lf-cc__stage">
          <div class="lf-cc__flip" :class="{ 'lf-cc__flip--back': flipped }">
            <!-- 正面 -->
            <article class="lf-cc__face lf-cc__face--front" :class="`lf-cc--${char.accent}`">
              <button id="lf-cc-close" type="button" class="lf-cc__close" aria-label="关闭" @click="close">
                <AppIcon name="close" size="sm" bold />
              </button>
              <span class="lf-cc__washi" aria-hidden="true" />

              <div class="lf-cc__portrait">
                <CharacterAvatar :id="char.id" size="xl" ring :ring-color="char.color" bob />
              </div>

              <h2 class="lf-cc__name">{{ char.fullName }}</h2>
              <p class="lf-cc__title">{{ char.title }}</p>
              <p class="lf-cc__cv">{{ char.cv }}</p>

              <div class="lf-cc__tags">
                <TagChip v-for="(t, i) in char.statusTags" :key="i" :tone="t.tone" :icon="t.icon" sticker :rotate="i % 2 ? 2 : -2">
                  {{ t.label }}
                </TagChip>
              </div>

              <div class="lf-cc__aff">
                <div class="lf-cc__aff-head">
                  <span class="lf-cc__aff-label"><AppIcon name="heart" size="sm" bold /> 好感度</span>
                  <span class="lf-cc__aff-stage">{{ char.affinityStage }}</span>
                </div>
                <div class="lf-cc__aff-track">
                  <span class="lf-cc__aff-fill" :style="{ width: char.affinity + '%', background: char.color }" />
                  <span class="lf-cc__aff-num">{{ char.affinity }}</span>
                </div>
              </div>

              <ClayButton id="lf-cc-flip" block variant="lavender" size="sm" @click="flipped = true">
                <template #icon><AppIcon name="book" size="sm" bold /></template>
                查看档案
              </ClayButton>
            </article>

            <!-- 背面 -->
            <article class="lf-cc__face lf-cc__face--back" :class="`lf-cc--${char.accent}`">
              <button id="lf-cc-close-back" type="button" class="lf-cc__close" aria-label="关闭" @click="close">
                <AppIcon name="close" size="sm" bold />
              </button>

              <h3 class="lf-cc__section"><AppIcon name="info" size="sm" /> 简介</h3>
              <p class="lf-cc__bio">{{ char.bio }}</p>

              <h3 class="lf-cc__section"><AppIcon name="star" size="sm" /> 属性</h3>
              <div class="lf-cc__attrs">
                <div v-for="a in char.attributes" :key="a.key" class="lf-cc__attr">
                  <span class="lf-cc__attr-label">{{ a.label }}</span>
                  <div class="lf-cc__attr-track">
                    <span class="lf-cc__attr-fill" :style="{ width: a.value + '%', background: char.color }" />
                  </div>
                  <span class="lf-cc__attr-val">{{ a.value }}</span>
                </div>
              </div>

              <h3 class="lf-cc__section"><AppIcon name="gift" size="sm" /> 喜欢</h3>
              <div class="lf-cc__likes">
                <TagChip v-for="(l, i) in char.likes" :key="i" tone="peach" icon="heart">{{ l }}</TagChip>
              </div>

              <ClayButton id="lf-cc-flip-back" block variant="secondary" size="sm" @click="flipped = false">
                <template #icon><AppIcon name="chevron-left" size="sm" bold /></template>
                返回正面
              </ClayButton>
            </article>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import AppIcon from '../base/AppIcon.vue';
import CharacterAvatar from '../base/CharacterAvatar.vue';
import ClayButton from '../base/ClayButton.vue';
import TagChip from '../base/TagChip.vue';
import { useCharacterStore } from '../../stores/useCharacterStore';
import { useUiStore } from '../../stores/useUiStore';

const ui = useUiStore();
const character = useCharacterStore();
const flipped = ref(false);

const char = computed(() => (ui.characterCardId ? character.getById(ui.characterCardId) : undefined));

watch(
  () => ui.characterCardId,
  () => {
    flipped.value = false;
  },
);

function close() {
  ui.closeCharacterCard();
}
</script>

<style scoped lang="scss">
.lf-cc {
  position: absolute;
  inset: 0;
  z-index: var(--lf-z-modal);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 22px;
}
.lf-cc__scrim {
  position: absolute;
  inset: 0;
  background: rgba(91, 74, 82, 0.4);
  backdrop-filter: blur(4px);
}
.lf-cc__stage {
  position: relative;
  width: 100%;
  max-width: 330px;
  height: 520px;
  max-height: 90%;
  perspective: 1600px;
}
.lf-cc__flip {
  position: relative;
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
  transition: transform 0.62s var(--lf-ease-bounce);
  animation: lf-pop-in var(--lf-dur) var(--lf-ease-bounce);
}
.lf-cc__flip--back {
  transform: rotateY(180deg);
}

.lf-cc__face {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 18px 16px 16px;
  border: 3px solid var(--lf-ink);
  border-radius: var(--lf-radius-xl);
  background: var(--lf-surface);
  box-shadow: var(--lf-shadow-float);
  backface-visibility: hidden;
  overflow-y: auto;
}
.lf-cc__face--front {
  background: linear-gradient(170deg, #fffdfb, #fff2ea);
}
.lf-cc--lavender.lf-cc__face--front { background: linear-gradient(170deg, #fbf7ff, #efe9fb); }
.lf-cc--peach.lf-cc__face--front { background: linear-gradient(170deg, #fffaf6, #ffe8da); }
.lf-cc--sky.lf-cc__face--front { background: linear-gradient(170deg, #f6fbff, #e3f3fd); }
.lf-cc__face--back {
  transform: rotateY(180deg);
  align-items: stretch;
  background: var(--lf-surface);
}

.lf-cc__close {
  position: absolute;
  top: 12px;
  right: 12px;
  z-index: 2;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border: 2.5px solid var(--lf-ink);
  border-radius: var(--lf-radius-pill);
  background: var(--lf-surface);
  color: var(--lf-ink);
  box-shadow: var(--lf-shadow-chunky-sm);
  transition: transform var(--lf-dur) var(--lf-ease-bounce), background var(--lf-dur);
}
.lf-cc__close:hover { background: var(--lf-strawberry); transform: rotate(90deg); }

.lf-cc__washi {
  position: absolute;
  top: -10px;
  left: 28px;
  width: 84px;
  height: 22px;
  transform: rotate(-4deg);
  background: repeating-linear-gradient(-45deg, rgba(214, 200, 245, 0.85) 0 7px, rgba(174, 223, 247, 0.85) 7px 14px);
  border: 1.5px solid rgba(91, 74, 82, 0.25);
  border-radius: 3px;
}

.lf-cc__portrait { margin: 6px 0 8px; }
.lf-cc__name { font-size: 22px; font-weight: 700; }
.lf-cc__title { margin-top: 2px; font-size: 13px; color: var(--lf-text-secondary); font-weight: 600; }
.lf-cc__cv { margin-top: 1px; font-size: 11px; color: var(--lf-text-muted); }

.lf-cc__tags {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 6px;
  margin: 11px 0;
}

.lf-cc__aff {
  width: 100%;
  margin-bottom: 12px;
  padding: 11px 12px;
  border: 2.5px solid var(--lf-ink);
  border-radius: var(--lf-radius-md);
  background: var(--lf-surface);
  box-shadow: var(--lf-shadow-chunky-sm);
}
.lf-cc__aff-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 7px;
}
.lf-cc__aff-label {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-family: var(--lf-font-display);
  font-weight: 700;
  font-size: 13px;
  color: var(--lf-strawberry-deep);
}
.lf-cc__aff-stage { font-size: 11px; color: var(--lf-text-secondary); font-weight: 600; }
.lf-cc__aff-track {
  position: relative;
  height: 18px;
  border: 2.5px solid var(--lf-ink);
  border-radius: var(--lf-radius-pill);
  background: var(--lf-surface-sunken);
  overflow: hidden;
}
.lf-cc__aff-fill { display: block; height: 100%; border-radius: var(--lf-radius-pill); transition: width 0.7s var(--lf-ease-out); }
.lf-cc__aff-num {
  position: absolute;
  top: 50%;
  right: 9px;
  transform: translateY(-50%);
  font-family: var(--lf-font-display);
  font-weight: 700;
  font-size: 11px;
  color: var(--lf-ink);
}

.lf-cc__section {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin: 12px 0 8px;
  font-size: 14px;
  font-weight: 700;
  color: var(--lf-text);
}
.lf-cc__section:first-of-type { margin-top: 4px; }
.lf-cc__bio { font-size: 13px; line-height: 1.7; color: var(--lf-text-secondary); }

.lf-cc__attrs { display: flex; flex-direction: column; gap: 8px; }
.lf-cc__attr { display: flex; align-items: center; gap: 8px; }
.lf-cc__attr-label { width: 36px; font-family: var(--lf-font-display); font-weight: 600; font-size: 12px; }
.lf-cc__attr-track {
  flex: 1;
  height: 11px;
  border: 2px solid var(--lf-ink);
  border-radius: var(--lf-radius-pill);
  background: var(--lf-surface-sunken);
  overflow: hidden;
}
.lf-cc__attr-fill { display: block; height: 100%; border-radius: var(--lf-radius-pill); transition: width 0.7s var(--lf-ease-out); }
.lf-cc__attr-val { width: 24px; text-align: right; font-family: var(--lf-font-display); font-weight: 700; font-size: 12px; color: var(--lf-text); }

.lf-cc__likes { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 14px; }

.lf-cc__face--back :last-child { margin-top: auto; }

.lf-modal-enter-active,
.lf-modal-leave-active { transition: opacity var(--lf-dur) var(--lf-ease-soft); }
.lf-modal-enter-from,
.lf-modal-leave-to { opacity: 0; }
</style>
