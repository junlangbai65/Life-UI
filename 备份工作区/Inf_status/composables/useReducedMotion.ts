import { usePreferredReducedMotion } from '@vueuse/core';
import { computed } from 'vue';

export function useReducedMotion() {
  const preferred = usePreferredReducedMotion();
  const wantsReducedMotion = computed(() => preferred.value === 'reduce');
  return { wantsReducedMotion };
}
