import { computed } from 'vue';
import { useGameStore } from '../stores/useGameStore';
import { useMvuStore } from '../stores/useMvuStore';
import {
  compareCharacter,
  didDesireRollbackToZero,
  getPreviousAssistantMessageId,
  readStatDataForFloor,
  resolvePreviousCharacter,
  type CharacterCompareResult,
  type NumericDeltaKey,
} from '../utils/statCompare';

const emptyResult = (): CharacterCompareResult => ({
  numericDeltas: {},
  changedFields: new Set<string>(),
  hasDelta: false,
});

export function useCharacterDelta() {
  const game = useGameStore();
  const mvu = useMvuStore();

  const previousCharacter = computed(() => {
    void mvu.data;

    const resolvedId = game.resolvedAssistantMessageId;
    if (resolvedId < 0) return null;

    const active = game.activeCharacter;
    if (!active) return null;

    const prevId = getPreviousAssistantMessageId(resolvedId);
    if (prevId === null) return null;

    const prevStat = readStatDataForFloor(prevId);
    return resolvePreviousCharacter(prevStat, active.key);
  });

  const compareResult = computed<CharacterCompareResult>(() => {
    void mvu.data;

    if (game.resolvedAssistantMessageId < 0) return emptyResult();

    const active = game.activeCharacter;
    if (!active) return emptyResult();

    const prevChar = previousCharacter.value;
    if (!prevChar) return emptyResult();

    return compareCharacter(active.data, prevChar);
  });

  const numericDeltas = computed(() => compareResult.value.numericDeltas);
  const changedFields = computed(() => compareResult.value.changedFields);
  const hasDelta = computed(() => compareResult.value.hasDelta);

  const desireRollbackToZero = computed(() => {
    const active = game.activeCharacter;
    if (!active) return false;
    return didDesireRollbackToZero(active.data, previousCharacter.value);
  });

  function isFieldChanged(field: string): boolean {
    return changedFields.value.has(field);
  }

  function getNumericDelta(field: NumericDeltaKey): number | undefined {
    return numericDeltas.value[field];
  }

  return {
    numericDeltas,
    changedFields,
    hasDelta,
    desireRollbackToZero,
    isFieldChanged,
    getNumericDelta,
  };
}
