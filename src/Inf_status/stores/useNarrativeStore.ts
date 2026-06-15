import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { GameOption } from '../types/game.types';
import { getAssistantMessageContent, parseMaintext, parseOptions } from '../utils/messageParser';

export const useNarrativeStore = defineStore('inf-narrative', () => {
  const maintext = ref('');
  const options = ref<GameOption[]>([]);

  function refreshFromMessage(messageId: number = getCurrentMessageId()) {
    const content = getAssistantMessageContent(messageId);
    maintext.value = parseMaintext(content);
    options.value = parseOptions(content);
  }

  function clearMessage() {
    maintext.value = '';
    options.value = [];
  }

  return { maintext, options, refreshFromMessage, clearMessage };
});
