import { defineStore } from 'pinia';
import { klona } from 'klona';
import { computed, ref } from 'vue';
import { characters } from '../data/characters';
import type { Character, CharacterId } from '../types';

export const useCharacterStore = defineStore('lf-character', () => {
  const list = ref<Character[]>(klona(characters));
  const focusedId = ref<CharacterId>('qinghe');

  const focused = computed(() => list.value.find(c => c.id === focusedId.value) ?? list.value[0]);

  function getById(id: string) {
    return list.value.find(c => c.id === id);
  }

  function setFocus(id: CharacterId) {
    focusedId.value = id;
  }

  function cycleFocus(dir = 1) {
    const idx = list.value.findIndex(c => c.id === focusedId.value);
    const next = (idx + dir + list.value.length) % list.value.length;
    focusedId.value = list.value[next].id;
  }

  function adjustAffinity(id: string, delta: number) {
    const c = getById(id);
    if (!c) return;
    c.affinity = Math.max(0, Math.min(100, c.affinity + delta));
  }

  return { list, focusedId, focused, getById, setFocus, cycleFocus, adjustAffinity };
});
