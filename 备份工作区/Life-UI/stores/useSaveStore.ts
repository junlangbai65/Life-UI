import { defineStore } from 'pinia';
import { klona } from 'klona';
import { ref } from 'vue';
import { saveSlots } from '../data/saves';
import { useGameStore } from './useGameStore';
import type { SaveSlot } from '../types';

export const useSaveStore = defineStore('lf-save', () => {
  const slots = ref<SaveSlot[]>(klona(saveSlots));

  function writeSlot(id: string, name?: string) {
    const game = useGameStore();
    const slot = slots.value.find(s => s.id === id);
    if (!slot) return;
    slot.empty = false;
    slot.name = name ?? (slot.isAuto ? slot.name : `手动存档 · Day ${game.env.day}`);
    slot.branch = slot.branch === '——' ? '主线' : slot.branch;
    slot.branchColor = slot.branchColor === 'neutral' && !slot.isAuto ? 'strawberry' : slot.branchColor;
    slot.day = game.env.day;
    slot.time = game.env.timeOfDay;
    slot.scene = game.currentScene.name;
    slot.summary = '在此刻保存了你的故事进度。';
    slot.savedAt = '刚刚';
    slot.thumbnailChar = slot.thumbnailChar ?? 'qinghe';
  }

  function clearSlot(id: string) {
    const slot = slots.value.find(s => s.id === id);
    if (!slot || slot.isAuto) return;
    Object.assign(slot, {
      name: '空存档位',
      branch: '——',
      branchColor: 'neutral',
      day: 0,
      time: '',
      scene: '',
      summary: '',
      savedAt: '',
      thumbnailChar: undefined,
      empty: true,
    } satisfies Partial<SaveSlot>);
  }

  return { slots, writeSlot, clearSlot };
});
