import { defineStore } from 'pinia';
import { computed, ref, watch } from 'vue';
import type { UiSettings } from '../types/game.types';
import { getInfectionTier } from '../utils/mvuDisplay';
import {
  getAssistantMessageIdsSorted,
  resolveAssistantMessageId,
} from '../utils/messageParser';
import { useMvuStore } from './useMvuStore';
import { useNarrativeStore } from './useNarrativeStore';

const UI_SETTINGS_KEY = 'inf_status:ui_settings';

const defaultUiSettings = (): UiSettings => ({
  theme: 'light',
  motionEnabled: true,
  fontScale: 'md',
  hideChatRawText: true,
});

function loadUiSettings(): UiSettings {
  try {
    const raw = localStorage.getItem(UI_SETTINGS_KEY);
    if (raw) return { ...defaultUiSettings(), ...JSON.parse(raw) };
  } catch {
    /* ignore */
  }
  return defaultUiSettings();
}

export const useGameStore = defineStore('inf-game', () => {
  const uiSettings = ref<UiSettings>(loadUiSettings());
  const activeCharacterKey = ref('');
  /** null = 跟随最新 assistant 楼层；非 null = 手动锚定某一 assistant message_id */
  const pinnedAssistantMessageId = ref<number | null>(null);

  const characterKeys = computed(() => {
    const mvu = useMvuStore();
    return Object.keys(mvu.data.角色 ?? {});
  });

  const activeCharacter = computed(() => {
    const mvu = useMvuStore();
    const keys = characterKeys.value;
    if (keys.length === 0) return null;
    const key = keys.includes(activeCharacterKey.value) ? activeCharacterKey.value : keys[0];
    return { key, data: mvu.data.角色[key] };
  });

  const infectionTier = computed(() => {
    const progress = activeCharacter.value?.data.感染进程 ?? 0;
    return getInfectionTier(progress);
  });

  const currentFloor = computed(() => getCurrentMessageId());

  const resolvedAssistantMessageId = computed(() =>
    resolveAssistantMessageId(pinnedAssistantMessageId.value),
  );

  const floorNavCanPrev = computed(() => {
    const ids = getAssistantMessageIdsSorted();
    if (ids.length < 2) return false;
    const pin = pinnedAssistantMessageId.value;
    const idx = pin === null ? ids.length - 1 : ids.indexOf(pin);
    const i = idx >= 0 ? idx : ids.length - 1;
    return i > 0;
  });

  const floorNavCanNext = computed(() => {
    const ids = getAssistantMessageIdsSorted();
    if (ids.length < 2) return false;
    const pin = pinnedAssistantMessageId.value;
    const idx = pin === null ? ids.length - 1 : ids.indexOf(pin);
    const i = idx >= 0 ? idx : ids.length - 1;
    return i < ids.length - 1;
  });

  function resetFloorNavigation() {
    pinnedAssistantMessageId.value = null;
  }

  function navigateFloorPrev() {
    const ids = getAssistantMessageIdsSorted();
    if (ids.length < 2) return;
    let idx =
      pinnedAssistantMessageId.value === null
        ? ids.length - 1
        : ids.indexOf(pinnedAssistantMessageId.value);
    if (idx < 0) idx = ids.length - 1;
    if (idx <= 0) return;
    pinnedAssistantMessageId.value = ids[idx - 1];
    refreshFromTavern();
  }

  function navigateFloorNext() {
    const ids = getAssistantMessageIdsSorted();
    if (ids.length < 2) return;
    let idx =
      pinnedAssistantMessageId.value === null
        ? ids.length - 1
        : ids.indexOf(pinnedAssistantMessageId.value);
    if (idx < 0) idx = ids.length - 1;
    if (idx >= ids.length - 1) return;
    idx += 1;
    pinnedAssistantMessageId.value = idx === ids.length - 1 ? null : ids[idx];
    refreshFromTavern();
  }

  watch(
    characterKeys,
    keys => {
      if (keys.length === 0) {
        activeCharacterKey.value = '';
        return;
      }
      if (!keys.includes(activeCharacterKey.value)) {
        activeCharacterKey.value = keys[0];
      }
    },
    { immediate: true },
  );

  watch(
    () => uiSettings.value.theme,
    theme => {
      document.documentElement.setAttribute('data-inf-theme', theme);
    },
    { immediate: true },
  );

  watch(
    uiSettings,
    settings => {
      localStorage.setItem(UI_SETTINGS_KEY, JSON.stringify(settings));
    },
    { deep: true },
  );

  watch(
    infectionTier,
    tier => {
      document.documentElement.setAttribute('data-inf-infection-tier', tier);
    },
    { immediate: true },
  );

  function setActiveCharacterKey(key: string) {
    activeCharacterKey.value = key;
  }

  function toggleTheme() {
    uiSettings.value.theme = uiSettings.value.theme === 'light' ? 'dark' : 'light';
  }

  function setMotionEnabled(enabled: boolean) {
    uiSettings.value.motionEnabled = enabled;
  }

  function setFontScale(scale: UiSettings['fontScale']) {
    uiSettings.value.fontScale = scale;
  }

  function toggleHideChatRawText() {
    uiSettings.value.hideChatRawText = !uiSettings.value.hideChatRawText;
  }

  let messageListeners: EventOnReturn[] = [];
  let chatListener: EventOnReturn | null = null;

  function refreshFromTavern() {
    const ids = getAssistantMessageIdsSorted();
    let pin = pinnedAssistantMessageId.value;
    if (pin !== null && !ids.includes(pin)) {
      pinnedAssistantMessageId.value = null;
      pin = null;
    }

    const resolvedId = resolveAssistantMessageId(pin);
    const mvu = useMvuStore();
    const narrative = useNarrativeStore();

    if (resolvedId < 0) {
      narrative.clearMessage();
      mvu.syncFromMessage(-1);
      return;
    }

    narrative.refreshFromMessage(resolvedId);
    mvu.syncFromMessage(resolvedId);
  }

  function bindMessageEvents() {
    messageListeners.forEach(listener => listener.stop());
    chatListener?.stop();
    messageListeners = [];

    const refresh = () => refreshFromTavern();

    messageListeners = [
      eventOn(tavern_events.MESSAGE_UPDATED, refresh),
      eventOn(tavern_events.MESSAGE_RECEIVED, refresh),
      eventOn(tavern_events.MESSAGE_SWIPED, refresh),
      eventOn(tavern_events.MESSAGE_DELETED, refresh),
      eventOn(tavern_events.CHARACTER_MESSAGE_RENDERED, refresh),
    ];

    void waitGlobalInitialized('Mvu')
      .then(() => {
        messageListeners.push(eventOn(Mvu.events.VARIABLE_UPDATE_ENDED, refresh));
      })
      .catch(() => {
        /* 非 MVU 环境 */
      });

    chatListener = eventOn(tavern_events.CHAT_CHANGED, () => {
      resetFloorNavigation();
      refresh();
    });

    refresh();
  }

  function unbindMessageEvents() {
    messageListeners.forEach(listener => listener.stop());
    messageListeners = [];
    chatListener?.stop();
    chatListener = null;
  }

  return {
    uiSettings,
    activeCharacterKey,
    characterKeys,
    activeCharacter,
    infectionTier,
    currentFloor,
    pinnedAssistantMessageId,
    resolvedAssistantMessageId,
    floorNavCanPrev,
    floorNavCanNext,
    setActiveCharacterKey,
    toggleTheme,
    setMotionEnabled,
    toggleHideChatRawText,
    resetFloorNavigation,
    navigateFloorPrev,
    navigateFloorNext,
    refreshFromTavern,
    bindMessageEvents,
    unbindMessageEvents,
  };
});
