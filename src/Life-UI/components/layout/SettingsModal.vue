<template>
  <BaseModal
    v-model="ui.settingsOpen"
    title="设置"
    subtitle="个性化你的云町体验"
    icon="gear"
    tone="cream"
    size="md"
    id-base="lf-settings"
  >
    <section class="lf-set">
      <h3 class="lf-set__group">偏好</h3>

      <label class="lf-set__row" for="lf-set-typing">
        <span class="lf-set__label"><AppIcon name="chat" size="sm" /> 流式打字效果</span>
        <span class="lf-set__switch" :class="{ 'lf-set__switch--on': typing }">
          <input id="lf-set-typing" v-model="typing" type="checkbox" class="lf-set__checkbox" />
          <span class="lf-set__knob" />
        </span>
      </label>

      <label class="lf-set__row" for="lf-set-sound">
        <span class="lf-set__label"><AppIcon name="music" size="sm" /> 界面提示音</span>
        <span class="lf-set__switch" :class="{ 'lf-set__switch--on': sound }">
          <input id="lf-set-sound" v-model="sound" type="checkbox" class="lf-set__checkbox" />
          <span class="lf-set__knob" />
        </span>
      </label>

      <div class="lf-set__row lf-set__row--col">
        <span class="lf-set__label"><AppIcon name="clock" size="sm" /> 文本速度</span>
        <input id="lf-set-speed" v-model.number="speed" type="range" min="1" max="5" step="1" class="lf-set__range" />
        <span class="lf-set__speed">{{ speedLabel }}</span>
      </div>

      <h3 class="lf-set__group">主题点缀</h3>
      <div class="lf-set__accents" role="radiogroup" aria-label="主题点缀颜色">
        <button
          v-for="a in accents"
          :id="`lf-set-accent-${a.key}`"
          :key="a.key"
          type="button"
          class="lf-set__accent"
          :class="{ 'lf-set__accent--on': accent === a.key }"
          :style="{ background: a.color }"
          :aria-label="a.label"
          :aria-pressed="accent === a.key"
          @click="setAccent(a.key, a.color)"
        >
          <AppIcon v-if="accent === a.key" name="check" size="sm" bold />
        </button>
      </div>

      <h3 class="lf-set__group">关于</h3>
      <p class="lf-set__about">
        Life-UI 是一个面向 LLM 互动游戏的前端原型，所有数据均为本地演示内容。
        美学融合 Claymorphism、粗描边与手账贴纸风格。
      </p>
    </section>

    <template #footer>
      <ClayButton id="lf-settings-reset" variant="ghost" size="sm" @click="reset">恢复默认</ClayButton>
      <ClayButton id="lf-settings-done" variant="primary" size="sm" @click="ui.settingsOpen = false">完成</ClayButton>
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import AppIcon from '../base/AppIcon.vue';
import BaseModal from '../base/BaseModal.vue';
import ClayButton from '../base/ClayButton.vue';
import { useNotify } from '../../composables/useNotify';
import { useUiStore } from '../../stores/useUiStore';

const ui = useUiStore();
const notify = useNotify();

const typing = ref(true);
const sound = ref(true);
const speed = ref(3);
const accent = ref('strawberry');

const speedLabel = computed(() => ['', '很慢', '慢', '适中', '快', '很快'][speed.value]);

const accents = [
  { key: 'strawberry', label: '草莓粉', color: '#f7a8c4' },
  { key: 'peach', label: '蜜桃橙', color: '#ffb088' },
  { key: 'mint', label: '薄荷绿', color: '#a8e6cf' },
  { key: 'sky', label: '天空蓝', color: '#aedff7' },
  { key: 'lavender', label: '薰衣草', color: '#d6c8f5' },
];

function setAccent(key: string, color: string) {
  accent.value = key;
  document.documentElement.style.setProperty('--lf-strawberry', color);
}

function reset() {
  typing.value = true;
  sound.value = true;
  speed.value = 3;
  setAccent('strawberry', '#f7a8c4');
  notify.info('已恢复默认设置');
}
</script>

<style scoped lang="scss">
.lf-set__group {
  margin: 14px 0 8px;
  font-family: var(--lf-font-display);
  font-size: 13px;
  color: var(--lf-text-secondary);
}
.lf-set__group:first-child { margin-top: 0; }

.lf-set__row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 11px 13px;
  margin-bottom: 8px;
  border: 2.5px solid var(--lf-ink);
  border-radius: var(--lf-radius-md);
  background: var(--lf-surface);
  box-shadow: var(--lf-shadow-chunky-sm);
}
.lf-set__row--col {
  flex-wrap: wrap;
}
.lf-set__label {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  font-family: var(--lf-font-display);
  font-weight: 600;
  font-size: 14px;
  color: var(--lf-text);
}

.lf-set__switch {
  position: relative;
  width: 50px;
  height: 28px;
  border: 2.5px solid var(--lf-ink);
  border-radius: var(--lf-radius-pill);
  background: var(--lf-surface-sunken);
  transition: background var(--lf-dur) var(--lf-ease-soft);
  cursor: pointer;
}
.lf-set__switch--on {
  background: var(--lf-mint);
}
.lf-set__checkbox {
  position: absolute;
  inset: 0;
  margin: 0;
  opacity: 0;
  cursor: pointer;
}
.lf-set__knob {
  position: absolute;
  top: 2px;
  left: 2px;
  width: 20px;
  height: 20px;
  background: var(--lf-surface);
  border: 2px solid var(--lf-ink);
  border-radius: var(--lf-radius-pill);
  transition: transform var(--lf-dur) var(--lf-ease-bounce);
}
.lf-set__switch--on .lf-set__knob {
  transform: translateX(22px);
}

.lf-set__range {
  flex: 1;
  min-width: 140px;
  accent-color: var(--lf-strawberry);
}
.lf-set__speed {
  font-family: var(--lf-font-display);
  font-weight: 700;
  font-size: 13px;
  color: var(--lf-text);
}

.lf-set__accents {
  display: flex;
  gap: 10px;
}
.lf-set__accent {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border: 2.5px solid var(--lf-ink);
  border-radius: var(--lf-radius-pill);
  color: var(--lf-ink);
  box-shadow: var(--lf-shadow-chunky-sm);
  transition: transform var(--lf-dur) var(--lf-ease-bounce);
}
.lf-set__accent:hover { transform: translateY(-2px) scale(1.05); }
.lf-set__accent--on { transform: scale(1.1); }

.lf-set__about {
  font-size: 13px;
  line-height: 1.7;
  color: var(--lf-text-secondary);
}
</style>
