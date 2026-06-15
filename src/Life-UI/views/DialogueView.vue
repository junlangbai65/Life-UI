<template>
  <div class="lf-dlg">
    <header class="lf-dlg__scene">
      <span class="lf-dlg__scene-icon" aria-hidden="true"><AppIcon :name="game.currentScene.icon" size="sm" bold /></span>
      <div class="lf-dlg__scene-info">
        <span class="lf-dlg__scene-name">{{ game.currentScene.name }}</span>
        <span class="lf-dlg__scene-sub">{{ game.env.timeOfDay }} · {{ game.env.weather.label }}</span>
      </div>
      <div class="lf-dlg__scene-cast">
        <CharacterAvatar
          v-for="cid in game.currentScene.presentCharacters"
          :key="cid"
          :id="cid"
          size="xs"
          ring
          :ring-color="charColor(cid)"
        />
      </div>
    </header>

    <div ref="scrollEl" class="lf-dlg__stream lf-scroll">
      <MessageBubble v-for="m in dialogue.messages" :key="m.id" :message="m" />
      <ThinkingBubble v-if="dialogue.showThinking" :speaker="thinkingSpeaker" />
      <div class="lf-dlg__anchor" />
    </div>

    <div class="lf-dlg__dock">
      <Transition name="lf-dock" mode="out-in">
        <div v-if="dialogue.isGenerating" key="gen" class="lf-dlg__gen">
          <span class="lf-dlg__gen-spin" aria-hidden="true"><AppIcon name="spark" size="sm" bold /></span>
          <span class="lf-dlg__gen-text">剧情正在生成…</span>
          <ClayButton id="lf-dlg-cancel" variant="ghost" size="sm" @click="dialogue.cancel()">停下</ClayButton>
        </div>

        <ChoiceOptions
          v-else-if="mode === 'choices' && dialogue.choices.length"
          key="choices"
          :choices="dialogue.choices"
          @pick="onPick"
        />

        <div v-else key="empty" class="lf-dlg__empty">
          <p class="lf-dlg__empty-text">轮到你了，自由地回应吧～</p>
        </div>
      </Transition>

      <ChatInput
        :disabled="dialogue.isGenerating"
        :mode="mode"
        @send="onSend"
        @toggle="toggleMode"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { nextTick, ref, watch } from 'vue';
import AppIcon from '../components/base/AppIcon.vue';
import CharacterAvatar from '../components/base/CharacterAvatar.vue';
import ClayButton from '../components/base/ClayButton.vue';
import ChatInput from '../components/dialogue/ChatInput.vue';
import ChoiceOptions from '../components/dialogue/ChoiceOptions.vue';
import MessageBubble from '../components/dialogue/MessageBubble.vue';
import ThinkingBubble from '../components/dialogue/ThinkingBubble.vue';
import { useNotify } from '../composables/useNotify';
import { getCharacter } from '../data/characters';
import { useDialogueStore } from '../stores/useDialogueStore';
import { useGameStore } from '../stores/useGameStore';
import type { CharacterId, DialogueChoice } from '../types';

const dialogue = useDialogueStore();
const game = useGameStore();
const notify = useNotify();

const mode = ref<'choices' | 'input'>('choices');
const scrollEl = ref<HTMLElement | null>(null);
const thinkingSpeaker = ref<CharacterId>('qinghe');

function charColor(id: CharacterId) {
  return getCharacter(id)?.color ?? 'var(--lf-strawberry)';
}

function scrollToBottom() {
  nextTick(() => {
    const el = scrollEl.value;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
  });
}

watch(() => dialogue.messages.map(m => m.text).join('|'), scrollToBottom);
watch(() => dialogue.showThinking, scrollToBottom);

watch(
  () => dialogue.isGenerating,
  (now, prev) => {
    if (prev && !now) {
      notify.success('剧情已更新', '好感与状态已随你的选择变化');
    }
  },
);

function onPick(choice: DialogueChoice) {
  if (choice.text.includes('自定义')) {
    mode.value = 'input';
    return;
  }
  dialogue.send({ choiceId: choice.id, text: choice.text });
}

function onSend(text: string) {
  dialogue.send({ text });
  mode.value = 'choices';
}

function toggleMode() {
  mode.value = mode.value === 'choices' ? 'input' : 'choices';
}
</script>

<style scoped lang="scss">
.lf-dlg {
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 0;
}

.lf-dlg__scene {
  display: flex;
  align-items: center;
  gap: 9px;
  padding: 9px 12px;
  margin: 10px 12px 0;
  border: 2.5px solid var(--lf-ink);
  border-radius: var(--lf-radius-lg);
  background: var(--lf-surface);
  box-shadow: var(--lf-shadow-chunky-sm);
}
.lf-dlg__scene-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: 2px solid var(--lf-ink);
  border-radius: var(--lf-radius-sm);
  background: var(--lf-mint);
  color: var(--lf-ink);
}
.lf-dlg__scene-info { display: flex; flex-direction: column; min-width: 0; }
.lf-dlg__scene-name { font-family: var(--lf-font-display); font-weight: 700; font-size: 14px; }
.lf-dlg__scene-sub { font-size: 11px; color: var(--lf-text-secondary); font-weight: 600; }
.lf-dlg__scene-cast { display: flex; gap: 3px; margin-left: auto; }

.lf-dlg__stream {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 13px;
  padding: 14px 12px;
}
.lf-dlg__anchor { height: 1px; }

.lf-dlg__dock {
  padding: 10px 12px 0;
  background: var(--lf-bg-deep);
  border-top: 2.5px dashed var(--lf-line-strong);
}

.lf-dlg__gen {
  display: flex;
  align-items: center;
  gap: 9px;
  padding: 10px 13px;
  border: 2.5px solid var(--lf-ink);
  border-radius: var(--lf-radius-lg);
  background: var(--lf-butter);
  box-shadow: var(--lf-shadow-chunky-sm);
}
.lf-dlg__gen-spin {
  display: inline-flex;
  color: var(--lf-ink);
  animation: lf-spin 1s linear infinite;
}
.lf-dlg__gen-text {
  flex: 1;
  font-family: var(--lf-font-display);
  font-weight: 700;
  font-size: 13px;
  color: var(--lf-text);
}

.lf-dlg__empty {
  padding: 14px;
  text-align: center;
}
.lf-dlg__empty-text {
  font-family: var(--lf-font-hand);
  font-size: 16px;
  color: var(--lf-text-secondary);
}

.lf-dlg__dock > .lf-input,
:deep(.lf-input) {
  margin: 10px -12px 0;
}

.lf-dock-enter-active { transition: opacity var(--lf-dur) var(--lf-ease-out), transform var(--lf-dur) var(--lf-ease-bounce); }
.lf-dock-leave-active { transition: opacity 120ms var(--lf-ease-soft); }
.lf-dock-enter-from { opacity: 0; transform: translateY(10px); }
.lf-dock-leave-to { opacity: 0; }
</style>
