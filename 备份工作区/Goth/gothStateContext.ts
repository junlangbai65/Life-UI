import type { InjectionKey } from 'vue';
import type { GothState } from './useGothState';

export const gothStateKey: InjectionKey<GothState> = Symbol('goth-state');
