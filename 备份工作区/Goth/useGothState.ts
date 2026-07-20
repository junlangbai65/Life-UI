import { computed, ref } from 'vue';
import type {
  BackpackItem,
  CharacterState,
  ChatMessage,
  EquipmentSlotKey,
  EquipmentSlots,
  GothGameSnapshot,
  InventoryCategoryFilter,
  MergeGothStateFromMessage,
  SearchResultItem,
} from './goth.types';
import {
  accessoryItemToBackpackItem,
  backpackItemToAccessoryItem,
  backpackItemToEquipmentPiece,
  equipmentPieceToBackpackItem,
} from './panels/inventory/inventoryHelpers';
import { phraseEquip, phrasePickSearch, phraseUnequip, phraseUse } from './panels/inventory/inventoryPhrases';
import { resolveWearTargetSlot } from './utils/inventoryWearRules';
import { createDemoSnapshot } from './utils/demoData';
import type { GothNarrativeInterest, GothParsedOption } from './utils/messageParser';
import { getAssistantMessageIdsSorted, loadFromMessage } from './utils/messageParser';
import { computeCarriedWeightKg } from './utils/carryWeight';
import {
  EMPTY_CHARACTER_MVU_DELTAS,
  computeCharacterMvuDeltas,
  type CharacterMvuNumericDeltas,
} from './utils/characterMvuDelta';
import {
  mergeGothSnapshot,
  readGothUiPartialForAssistantFloor,
  readGothUiPartialFromTavern,
  readMergedCharacterFromAssistantFloor,
} from './utils/variableReader';

function uid() {
  return `goth-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function decrementBackpackRow(items: BackpackItem[], itemId: string): BackpackItem[] {
  const idx = items.findIndex(i => i.id === itemId);
  if (idx < 0) return items;
  const row = items[idx];
  if (row.quantity > 1) {
    const next = [...items];
    next[idx] = { ...row, quantity: row.quantity - 1 };
    return next;
  }
  return items.filter((_, i) => i !== idx);
}

export function useGothState() {
  const snapshot = ref<GothGameSnapshot>(createDemoSnapshot());
  const draftInput = ref('');
  const isGenerating = ref(false);
  const chatMessages = ref<ChatMessage[]>([]);

  const tavernMaintext = ref('');
  const narrativeOptions = ref<GothParsedOption[]>([]);
  /** 最新楼层 AI 正文中 `<time>` 解析结果（`HH:MM` / `HH:MM:SS`），无标签则为 null */
  const narrativeClock = ref<string | null>(null);
  /** 最新楼层 AI 正文中 `<degree>` 解析结果（如 `24℃`），无标签则为 null */
  const narrativeDegree = ref<string | null>(null);
  /** 最新楼层 AI 正文中 `<presence>` 解析出的在场名称（已去符号） */
  const narrativePresence = ref<string[]>([]);
  /** 最新楼层 `<interest>` 解析结果 */
  const narrativeInterests = ref<GothNarrativeInterest[]>([]);

  /** null = 跟随最新 assistant 楼层；非 null = 手动锚定在某一 assistant message_id */
  const pinnedAssistantMessageId = ref<number | null>(null);

  /** 当前展示楼层相对「上一条 assistant 楼层」MVU 的角色数值差（静态标签，非动画） */
  const characterMvuDeltas = ref<CharacterMvuNumericDeltas>({ ...EMPTY_CHARACTER_MVU_DELTAS });

  const inventoryCategory = ref<InventoryCategoryFilter | '全部'>('全部');

  const filteredBackpackItems = computed(() => {
    const list = snapshot.value.backpackItems;
    if (inventoryCategory.value === '全部') return list;
    return list.filter(i => i.type === inventoryCategory.value);
  });

  /** MVU「负重追踪·当前负重」应与之一致：已穿戴 + 背包 */
  const carriedWeightTotalKg = computed(() => computeCarriedWeightKg(snapshot.value));

  function toggleCombatDemo() {
    snapshot.value.inCombat = !snapshot.value.inCombat;
  }

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
    let idx = pinnedAssistantMessageId.value === null ? ids.length - 1 : ids.indexOf(pinnedAssistantMessageId.value);
    if (idx < 0) idx = ids.length - 1;
    if (idx <= 0) return;
    pinnedAssistantMessageId.value = ids[idx - 1];
    void refreshFromTavern();
  }

  function navigateFloorNext() {
    const ids = getAssistantMessageIdsSorted();
    if (ids.length < 2) return;
    let idx = pinnedAssistantMessageId.value === null ? ids.length - 1 : ids.indexOf(pinnedAssistantMessageId.value);
    if (idx < 0) idx = ids.length - 1;
    if (idx >= ids.length - 1) return;
    idx += 1;
    pinnedAssistantMessageId.value = idx === ids.length - 1 ? null : ids[idx];
    void refreshFromTavern();
  }

  function refreshCharacterMvuDeltas(resolvedAssistantId: number) {
    const ids = getAssistantMessageIdsSorted();
    const idx = ids.indexOf(resolvedAssistantId);
    if (idx <= 0) {
      characterMvuDeltas.value = { ...EMPTY_CHARACTER_MVU_DELTAS };
      return;
    }
    const prevAssistantId = ids[idx - 1];
    const baseline = readMergedCharacterFromAssistantFloor(prevAssistantId);
    if (!baseline?.patchHadCharacter) {
      characterMvuDeltas.value = { ...EMPTY_CHARACTER_MVU_DELTAS };
      return;
    }
    characterMvuDeltas.value = computeCharacterMvuDeltas(baseline.character, snapshot.value.character);
  }

  async function refreshFromTavern() {
    try {
      const ids = getAssistantMessageIdsSorted();
      const lastId = ids.length ? ids[ids.length - 1] : -1;

      let pin = pinnedAssistantMessageId.value;
      if (pin !== null && !ids.includes(pin)) {
        pinnedAssistantMessageId.value = null;
        pin = null;
      }

      const resolvedId = pin !== null ? pin : lastId;

      if (resolvedId < 0) {
        tavernMaintext.value = '';
        narrativeOptions.value = [];
        narrativeClock.value = null;
        narrativeDegree.value = null;
        narrativePresence.value = [];
        narrativeInterests.value = [];
        characterMvuDeltas.value = { ...EMPTY_CHARACTER_MVU_DELTAS };
        return;
      }

      const loaded = loadFromMessage(resolvedId);
      tavernMaintext.value = loaded.maintext;
      narrativeOptions.value = loaded.options;
      narrativeClock.value = loaded.narrativeTime;
      narrativeDegree.value = loaded.narrativeDegree;
      narrativePresence.value = loaded.narrativePresence;
      narrativeInterests.value = loaded.narrativeInterests;

      const browsing = pin !== null;
      if (browsing) {
        const patch = readGothUiPartialForAssistantFloor(resolvedId);
        if (patch && Object.keys(patch).length > 0) {
          snapshot.value = mergeGothSnapshot(createDemoSnapshot(), patch);
        } else {
          snapshot.value = createDemoSnapshot();
        }
      } else {
        const patch = readGothUiPartialFromTavern();
        if (patch && Object.keys(patch).length > 0) {
          snapshot.value = mergeGothSnapshot(snapshot.value, patch);
        }
      }

      refreshCharacterMvuDeltas(resolvedId);
    } catch (e) {
      console.warn('[Goth] refreshFromTavern 失败:', e);
      characterMvuDeltas.value = { ...EMPTY_CHARACTER_MVU_DELTAS };
    }
  }

  const mergeFromMessage: MergeGothStateFromMessage = raw => {
    if (!raw || typeof raw !== 'object') return null;
    return raw as Partial<GothGameSnapshot>;
  };

  function applyPartial(update: Partial<GothGameSnapshot>) {
    snapshot.value = { ...snapshot.value, ...update };
  }

  function patchCharacter(patch: Partial<CharacterState>) {
    snapshot.value.character = { ...snapshot.value.character, ...patch };
  }

  function appendDraft(line: string) {
    const cur = draftInput.value.trim();
    draftInput.value = cur ? `${cur}\n${line}` : line;
  }

  function unequipToBackpack(slot: EquipmentSlotKey) {
    const snap = snapshot.value;
    if (slot === 'accessory') {
      if (snap.accessoryItems.length > 0) {
        const [first, ...rest] = snap.accessoryItems;
        appendDraft(phraseUnequip(first.name));
        snapshot.value = {
          ...snap,
          accessoryItems: rest,
          backpackItems: [...snap.backpackItems, accessoryItemToBackpackItem(first)],
        };
        return;
      }
      const piece = snap.equipmentSlots.accessory;
      if (!piece) return;
      appendDraft(phraseUnequip(piece.name));
      snapshot.value = {
        ...snap,
        equipmentSlots: { ...snap.equipmentSlots, accessory: null },
        backpackItems: [...snap.backpackItems, equipmentPieceToBackpackItem(piece)],
      };
      return;
    }

    const piece = snap.equipmentSlots[slot];
    if (!piece) return;
    appendDraft(phraseUnequip(piece.name));
    snapshot.value = {
      ...snap,
      equipmentSlots: { ...snap.equipmentSlots, [slot]: null },
      backpackItems: [...snap.backpackItems, equipmentPieceToBackpackItem(piece)],
    };
  }

  function tryEquipFromBackpack(item: BackpackItem) {
    const snap = snapshot.value;
    if (!snap.backpackItems.some(i => i.id === item.id)) return;
    const slot = resolveWearTargetSlot(item);
    if (!slot) return;

    appendDraft(phraseEquip(item.name));
    const slots = snap.equipmentSlots;

    if (slot === 'accessory') {
      const acc = backpackItemToAccessoryItem(item);
      snapshot.value = {
        ...snap,
        accessoryItems: [...snap.accessoryItems, acc],
        backpackItems: decrementBackpackRow(snap.backpackItems, item.id),
      };
      return;
    }

    const prev = slots[slot];
    let backpack = decrementBackpackRow(snap.backpackItems, item.id);
    const nextPiece = backpackItemToEquipmentPiece(item, slot);
    const equipmentSlots = { ...slots, [slot]: nextPiece };
    if (prev) {
      backpack = [...backpack, equipmentPieceToBackpackItem(prev)];
    }
    snapshot.value = {
      ...snap,
      equipmentSlots,
      backpackItems: backpack,
    };
  }

  /** 消耗品扣减（调用前由 UI 完成确认）；并写入「使用了…」 */
  function tryConsumeItem(itemId: string): boolean {
    const snap = snapshot.value;
    const row = snap.backpackItems.find(i => i.id === itemId);
    if (!row || row.type !== '消耗品') return false;
    appendDraft(phraseUse(row.name));
    snapshot.value = {
      ...snap,
      backpackItems: decrementBackpackRow(snap.backpackItems, itemId),
    };
    return true;
  }

  async function submitUserLine(text: string) {
    const t = text.trim();
    if (!t || isGenerating.value) return;
    chatMessages.value.push({
      id: uid(),
      role: 'user',
      content: t,
      createdAt: Date.now(),
    });
    isGenerating.value = true;
    try {
      const reply = await generate({
        user_input: t,
        should_stream: false,
      });
      chatMessages.value.push({
        id: uid(),
        role: 'assistant',
        content: reply || '（生成返回为空）',
        createdAt: Date.now(),
      });
    } catch (e) {
      console.warn('[Goth] generate 不可用或失败，使用占位回复', e);
      chatMessages.value.push({
        id: uid(),
        role: 'assistant',
        content: '（酒馆生成接口暂不可用：请稍后在联网环境下重试，或由叙事楼层驱动剧情。）',
        createdAt: Date.now(),
      });
    } finally {
      isGenerating.value = false;
      await refreshFromTavern();
    }
  }

  async function submitMessage() {
    const text = draftInput.value.trim();
    if (!text || isGenerating.value) return;
    draftInput.value = '';
    await submitUserLine(text);
  }

  /** 选项点击：写入底部输入框（不自动发送），便于修改后再提交 */
  function submitOptionChoice(option: GothParsedOption) {
    draftInput.value = option.text.trim();
    queueMicrotask(() => {
      document.getElementById('goth-chat-input')?.focus();
    });
  }

  /** 地图「前往」：追加一行 `前往地点名` 并聚焦输入框（与背包短语写入草稿一致） */
  function queueTravelDraft(placeName: string) {
    const name = placeName.trim();
    if (!name) return;
    appendDraft(`前往${name}`);
    queueMicrotask(() => {
      document.getElementById('goth-chat-input')?.focus();
    });
  }

  function pickSearchItem(item: SearchResultItem) {
    appendDraft(phrasePickSearch(item.name));
    snapshot.value.searchResults = snapshot.value.searchResults.filter(i => i.id !== item.id);
    const next: BackpackItem = {
      id: item.id,
      name: item.name,
      description: item.description,
      type: item.type,
      quantity: item.quantity,
      weight: item.weight,
      ...(item.equipSlot !== undefined ? { equipSlot: item.equipSlot } : {}),
      ...(item.atk !== undefined ? { atk: item.atk } : {}),
      ...(item.def !== undefined ? { def: item.def } : {}),
      ...(item.specialEffects !== undefined ? { specialEffects: item.specialEffects } : {}),
      ...(item.itemType !== undefined ? { itemType: item.itemType } : {}),
    };
    snapshot.value.backpackItems = [...snapshot.value.backpackItems, next];
  }

  function discardSearchItem(item: SearchResultItem) {
    snapshot.value.searchResults = snapshot.value.searchResults.filter(i => i.id !== item.id);
  }

  return {
    snapshot,
    characterMvuDeltas,
    draftInput,
    isGenerating,
    chatMessages,
    tavernMaintext,
    narrativeOptions,
    narrativeClock,
    narrativeDegree,
    narrativePresence,
    narrativeInterests,
    floorNavCanPrev,
    floorNavCanNext,
    navigateFloorPrev,
    navigateFloorNext,
    resetFloorNavigation,
    refreshFromTavern,
    submitMessage,
    submitOptionChoice,
    queueTravelDraft,
    inventoryCategory,
    filteredBackpackItems,
    carriedWeightTotalKg,
    toggleCombatDemo,
    mergeFromMessage,
    applyPartial,
    patchCharacter,
    pickSearchItem,
    discardSearchItem,
    appendDraft,
    unequipToBackpack,
    tryEquipFromBackpack,
    tryConsumeItem,
  };
}

export type GothState = ReturnType<typeof useGothState>;
