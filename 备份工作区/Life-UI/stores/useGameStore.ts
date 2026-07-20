import { defineStore } from 'pinia';
import { klona } from 'klona';
import { computed, ref } from 'vue';
import { environment, playerProfile, playerStats } from '../data/playerState';
import { scenes } from '../data/scenes';
import type { StatDef } from '../types';

export const useGameStore = defineStore('lf-game', () => {
  const stats = ref<StatDef[]>(klona(playerStats));
  const env = ref(klona(environment));
  const profile = ref(klona(playerProfile));
  const currentSceneId = ref('cafe');

  const currentScene = computed(() => scenes.find(s => s.id === currentSceneId.value) ?? scenes[0]);

  function statBy(key: string) {
    return stats.value.find(s => s.key === key);
  }

  function adjustStat(key: string, delta: number) {
    const stat = statBy(key);
    if (!stat) return;
    stat.value = Math.max(0, Math.min(stat.max, stat.value + delta));
  }

  function travelTo(sceneId: string) {
    const scene = scenes.find(s => s.id === sceneId);
    if (!scene || !scene.unlocked) return false;
    currentSceneId.value = sceneId;
    return true;
  }

  return { stats, env, profile, currentSceneId, currentScene, statBy, adjustStat, travelTo };
});
