import { defineStore } from 'pinia';
import { klona } from 'klona';
import { ref } from 'vue';
import { initialChoices, initialDialogue, nextChoices } from '../data/dialogue';
import { streamReply } from '../services/llmService';
import type { DialogueChoice, DialogueMessage } from '../types';
import { useCharacterStore } from './useCharacterStore';
import { useGameStore } from './useGameStore';

let msgSeq = 0;
const uid = () => `u${++msgSeq}`;

export const useDialogueStore = defineStore('lf-dialogue', () => {
  const messages = ref<DialogueMessage[]>(klona(initialDialogue));
  const choices = ref<DialogueChoice[]>(klona(initialChoices));
  const isGenerating = ref(false);
  const showThinking = ref(false);

  let signal: { canceled: boolean } | null = null;

  function pushPlayerMessage(text: string) {
    messages.value.push({ id: uid(), speaker: 'player', name: '你', text });
  }

  async function send(payload: { choiceId?: string; text: string }) {
    if (isGenerating.value) return;

    pushPlayerMessage(payload.text);
    choices.value = [];
    isGenerating.value = true;
    showThinking.value = true;
    signal = { canceled: false };

    await streamReply(
      { choiceId: payload.choiceId, userInput: payload.text, signal },
      {
        onMessageStart: message => {
          showThinking.value = false;
          messages.value.push({ ...message });
        },
        onToken: (id, full) => {
          const m = messages.value.find(x => x.id === id);
          if (m) m.text = full;
        },
        onMessageEnd: id => {
          const m = messages.value.find(x => x.id === id);
          if (m) m.streaming = false;
        },
        onComplete: () => {
          isGenerating.value = false;
          showThinking.value = false;
          choices.value = klona(nextChoices());
          applyAftermath(payload.choiceId);
        },
      },
    );
  }

  // 选项产生的数值/好感联动
  function applyAftermath(choiceId?: string) {
    const game = useGameStore();
    const character = useCharacterStore();
    if (choiceId === 'c1') {
      character.adjustAffinity('qinghe', 4);
      game.adjustStat('inspiration', 6);
      game.adjustStat('mood', 3);
    } else if (choiceId === 'c2') {
      character.adjustAffinity('qinghe', 1);
    } else if (choiceId === 'c3') {
      game.adjustStat('mood', -2);
    } else {
      character.adjustAffinity('qinghe', 2);
      game.adjustStat('inspiration', 2);
    }
    game.adjustStat('stamina', -3);
  }

  function cancel() {
    if (signal) signal.canceled = true;
    isGenerating.value = false;
    showThinking.value = false;
    // 移除未完成的流式消息
    messages.value = messages.value.filter(m => !m.streaming);
    if (choices.value.length === 0) choices.value = klona(nextChoices());
  }

  return { messages, choices, isGenerating, showThinking, send, cancel };
});
