<template>
  <div class="goth-equip" role="region" aria-label="当前装备">
    <div class="goth-equip__surface goth-inset-slot">
      <section v-for="sec in EQUIP_SECTIONS" :key="sec.title" class="goth-equip__section">
        <h4 class="goth-equip__section-title">{{ sec.title }}</h4>
        <ul class="goth-equip__grid" role="list">
          <li v-for="slot in sec.slots" :key="slot" class="goth-equip__cell">
            <button
              type="button"
              class="goth-equip-card"
              :class="{
                'goth-equip-card--on': armed(slot),
                'goth-equip-card--off': !armed(slot),
              }"
              :aria-label="ariaForSlot(slot)"
              :disabled="!armed(slot)"
              :title="detailTitle(slot)"
              @click="onClick(slot)"
            >
              <span class="goth-equip-card__rail" aria-hidden="true" />
              <span class="goth-equip-card__body">
                <span class="goth-equip-card__label">{{ labels[slot] }}</span>
                <Transition name="goth-slot-state">
                  <span :key="equipStateKey(slot)" class="goth-equip-card__main">
                    <template v-if="armed(slot)">
                      <strong class="goth-equip-card__name">{{ primaryName(slot) }}</strong>
                      <span v-if="statsLine(slot)" class="goth-equip-card__stats goth-mono">{{ statsLine(slot) }}</span>
                    </template>
                    <span v-else class="goth-equip-card__empty">未穿戴</span>
                  </span>
                </Transition>
              </span>
            </button>
          </li>
        </ul>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, inject } from 'vue';
import type { EquipmentPiece, EquipmentSlotKey } from '../../goth.types';
import { gothStateKey } from '../../gothStateContext';

const EQUIP_SECTIONS: { title: string; slots: EquipmentSlotKey[] }[] = [
  { title: '上身与配饰', slots: ['head', 'accessory', 'body', 'gloves', 'underwear_top', 'underwear_bottom'] },
  { title: '下身与足部', slots: ['legs', 'socks', 'shoes'] },
  { title: '武装', slots: ['weapon'] },
];

const state = inject(gothStateKey);
if (!state) throw new Error('未找到 Goth 状态上下文。');

const { snapshot, unequipToBackpack } = state;

const labels = computed(() => snapshot.value.equipmentSlotLabels);
const equipment = computed(() => snapshot.value.equipmentSlots);
const accessoryList = computed(() => snapshot.value.accessoryItems);

function armed(slot: EquipmentSlotKey): boolean {
  if (slot === 'accessory') {
    return accessoryList.value.length > 0 || !!equipment.value.accessory;
  }
  return !!equipment.value[slot];
}

function equipStateKey(slot: EquipmentSlotKey): string {
  if (slot === 'accessory') {
    if (accessoryList.value.length)
      return accessoryList.value
        .map(a => a.id)
        .sort()
        .join('+');
    if (equipment.value.accessory) return equipment.value.accessory.id;
    return 'empty';
  }
  return equipment.value[slot]?.id ?? 'empty';
}

function ariaForSlot(slot: EquipmentSlotKey): string {
  const name = labels.value[slot] ?? slot;
  return armed(slot) ? `${name}，已穿戴，点击卸下` : `${name}，未穿戴`;
}

function pieceFor(slot: EquipmentSlotKey): EquipmentPiece | null {
  return equipment.value[slot];
}

function primaryName(slot: EquipmentSlotKey): string {
  if (slot !== 'accessory') return pieceFor(slot)?.name ?? '';
  if (accessoryList.value.length) {
    const names = accessoryList.value.map(a => a.name);
    if (names.length <= 2) return names.join('、');
    return `${names[0]} 等 ${names.length} 件`;
  }
  return equipment.value.accessory?.name ?? '';
}

function statsLine(slot: EquipmentSlotKey): string {
  if (slot === 'accessory') {
    if (equipment.value.accessory) {
      const p = equipment.value.accessory;
      return `ATK ${p.atk} · DEF ${p.def} · ${p.weight} kg`;
    }
    if (accessoryList.value.length === 1) return `负重 ${accessoryList.value[0].weight}`;
    if (accessoryList.value.length > 1) return `共 ${accessoryList.value.length} 件`;
    return '';
  }
  const p = pieceFor(slot);
  return p ? `ATK ${p.atk} · DEF ${p.def} · ${p.weight} kg` : '';
}

function detailTitle(slot: EquipmentSlotKey): string {
  if (!armed(slot)) return '';
  if (slot === 'accessory') {
    if (accessoryList.value.length) {
      return accessoryList.value.map(a => `${a.name}（${a.itemType}）· ${a.specialEffects}`).join('\n');
    }
    const p = equipment.value.accessory;
    return p ? `${p.name} · ${p.specialEffects}` : '';
  }
  const p = pieceFor(slot);
  return p ? `${p.name} · ${p.specialEffects}` : '';
}

function onClick(slot: EquipmentSlotKey) {
  if (!armed(slot)) return;
  unequipToBackpack(slot);
}
</script>

<style scoped>
.goth-equip {
  margin-bottom: 0.35rem;
}

.goth-equip__surface {
  padding: 0.65rem 0.7rem 0.55rem;
  background: linear-gradient(
    165deg,
    rgba(36, 32, 28, 0.42) 0%,
    rgba(22, 20, 18, 0.55) 48%,
    rgba(28, 26, 22, 0.38) 100%
  );
  border-radius: var(--g-radius, 10px);
}

.goth-equip__section {
  margin-bottom: 0.75rem;
}

.goth-equip__section:last-child {
  margin-bottom: 0;
}

.goth-equip__section-title {
  margin: 0 0 0.4rem;
  padding-bottom: 0.28rem;
  font-family: var(--g-font-display);
  font-size: 0.68rem;
  font-weight: 600;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--g-text-accent);
  border-bottom: 1px solid rgba(108, 96, 76, 0.22);
  opacity: 0.92;
}

.goth-equip__grid {
  margin: 0;
  padding: 0;
  list-style: none;
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.42rem;
}

@media (min-width: 400px) {
  .goth-equip__grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  /* 武装单列占满一行更清晰 */
  .goth-equip__section:last-child .goth-equip__grid {
    grid-template-columns: 1fr;
  }
}

.goth-equip__cell {
  margin: 0;
  min-width: 0;
}

.goth-equip-card {
  display: flex;
  align-items: stretch;
  width: 100%;
  min-height: 3.35rem;
  padding: 0;
  border: none;
  border-radius: 8px;
  text-align: left;
  cursor: default;
  color: inherit;
  background: rgba(14, 12, 10, 0.22);
  box-shadow: inset 0 1px 0 rgba(120, 108, 88, 0.06);
  overflow: hidden;
  transition:
    background 0.2s ease,
    box-shadow 0.2s ease,
    transform 0.18s ease;
}

.goth-equip-card--on {
  cursor: pointer;
  background: rgba(157, 136, 104, 0.09);
  box-shadow:
    inset 0 1px 0 rgba(157, 136, 104, 0.12),
    0 2px 10px rgba(8, 6, 5, 0.18);
}

.goth-equip-card--on:hover {
  background: rgba(196, 182, 150, 0.12);
  box-shadow:
    inset 0 1px 0 rgba(196, 182, 150, 0.18),
    0 4px 14px rgba(8, 6, 5, 0.22);
}

.goth-equip-card--on:focus-visible {
  background: rgba(196, 182, 150, 0.12);
  box-shadow:
    inset 0 1px 0 rgba(196, 182, 150, 0.18),
    0 4px 14px rgba(8, 6, 5, 0.22),
    0 0 0 2px rgba(157, 136, 104, 0.42);
  outline: none;
}

.goth-equip-card--on:active {
  transform: translateY(1px);
}

.goth-equip-card--off {
  opacity: 0.92;
}

.goth-equip-card__rail {
  flex: 0 0 3px;
  background: rgba(108, 96, 76, 0.35);
  align-self: stretch;
}

.goth-equip-card--on .goth-equip-card__rail {
  background: linear-gradient(180deg, rgba(196, 182, 150, 0.65), rgba(157, 136, 104, 0.45));
}

.goth-equip-card__body {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 0.22rem;
  padding: 0.42rem 0.48rem 0.4rem 0.52rem;
}

.goth-equip-card__label {
  font-family: var(--g-font-ui);
  font-size: 0.62rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--g-text-muted);
  line-height: 1.2;
}

.goth-equip-card__main {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
  min-height: 1.45rem;
}

.goth-equip-card__name {
  font-family: var(--g-font-display);
  font-size: 0.82rem;
  font-weight: 600;
  line-height: 1.25;
  color: var(--g-text-title);
  overflow-wrap: anywhere;
}

.goth-equip-card__stats {
  font-size: 0.65rem;
  color: var(--g-text-muted);
  letter-spacing: 0.02em;
}

.goth-equip-card__empty {
  font-size: 0.78rem;
  font-style: italic;
  color: var(--g-text-muted);
  opacity: 0.72;
}

.goth-equip-card:disabled {
  cursor: default;
}

.goth-equip-card:disabled:active {
  transform: none;
}

.goth-slot-state-enter-active,
.goth-slot-state-leave-active {
  transition:
    opacity 0.24s ease,
    transform 0.24s ease;
}

.goth-slot-state-enter-from,
.goth-slot-state-leave-to {
  opacity: 0;
  transform: translateY(4px);
}

@media (prefers-reduced-motion: reduce) {
  .goth-equip-card,
  .goth-slot-state-enter-active,
  .goth-slot-state-leave-active {
    transition: none;
  }

  .goth-slot-state-enter-from,
  .goth-slot-state-leave-to {
    opacity: 1;
    transform: none;
  }

  .goth-equip-card--on:active {
    transform: none;
  }
}
</style>
