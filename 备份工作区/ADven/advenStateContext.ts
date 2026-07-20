import type { InjectionKey } from 'vue';
import type { AdvenState } from './useAdvenState';

export const advenStateKey: InjectionKey<AdvenState> = Symbol('adven-state');
