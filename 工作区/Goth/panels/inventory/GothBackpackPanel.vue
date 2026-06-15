<template>
  <section class="goth-bp" aria-labelledby="goth-inv-backpack-title">
    <h3 id="goth-inv-backpack-title" class="goth-bp__heading">背包</h3>
    <div class="filter-row" role="tablist" aria-label="物品分类筛选">
      <button
        v-for="cat in categories"
        :id="`goth-inv-filter-${cat}`"
        :key="cat"
        type="button"
        role="tab"
        class="filter-btn"
        :class="{ active: inventoryCategory === cat }"
        @click="setCategory(cat)"
      >
        {{ cat }}
      </button>
    </div>
    <p class="goth-mono weight-line">
      当前负重 {{ carriedWeight.toFixed(2) }} / {{ snapshot.backpackWeightLimit }} kg
    </p>

    <Transition name="goth-inv-filter-fade" mode="out-in">
      <TransitionGroup
        :key="String(inventoryCategory)"
        name="goth-inv-card"
        tag="ul"
        class="goth-bp-grid"
        role="list"
      >
        <li v-for="it in filteredItems" :id="`goth-bp-${it.id}`" :key="it.id" class="goth-bp-card goth-inset-slot">
          <div class="goth-bp-card__head">
            <GothItemTypeIcon :type="it.type" />
            <div class="goth-bp-card__titles">
              <strong>{{ it.name }}</strong>
              <span class="goth-tag">{{ it.type }}</span>
            </div>
          </div>
          <p v-if="it.description" class="muted desc">{{ it.description }}</p>
          <div class="goth-mono meta">数量 {{ it.quantity }} · 单重 {{ it.weight }}</div>
          <div v-if="wearSlotLabel(it)" class="slot-hint goth-mono">穿戴部位 {{ wearSlotLabel(it) }}</div>
          <div class="goth-bp-card__actions">
            <Transition name="goth-bp-wear">
              <button
                v-if="canWearBackpackItem(it)"
                type="button"
                class="goth-btn-primary goth-bp-btn"
                @click="tryEquipFromBackpack(it)"
              >
                穿戴
              </button>
            </Transition>
            <button
              v-if="it.type === '消耗品'"
              type="button"
              class="goth-btn-primary goth-bp-btn"
              @click="openConsumeDialog(it)"
            >
              使用
            </button>
          </div>
        </li>
        <li v-if="filteredItems.length === 0" key="_empty" class="goth-bp-empty muted">当前分类无物品</li>
      </TransitionGroup>
    </Transition>

    <dialog
      ref="consumeDlg"
      class="goth-inv-dialog"
      @cancel.prevent="closeConsumeDialog(false)"
    >
      <div class="goth-inv-dialog__panel">
        <p v-if="pendingConsume" class="goth-inv-dialog__msg">
          确认使用「{{ pendingConsume.name }}」？
        </p>
        <div class="goth-inv-dialog__menu">
          <button type="button" class="goth-btn-primary" @click="closeConsumeDialog(true)">确认</button>
          <button type="button" class="goth-btn-ghost" @click="closeConsumeDialog(false)">取消</button>
        </div>
      </div>
    </dialog>
  </section>
</template>

<script setup lang="ts">
import { inject, ref } from 'vue';
import type { BackpackItem, EquipmentSlotKey, InventoryCategoryFilter } from '../../goth.types';
import { gothStateKey } from '../../gothStateContext';
import { canWearBackpackItem, resolveWearTargetSlot } from '../../utils/inventoryWearRules';
import GothItemTypeIcon from './GothItemTypeIcon.vue';

const state = inject(gothStateKey);
if (!state) throw new Error('未找到 Goth 状态上下文。');

const {
  snapshot,
  filteredBackpackItems,
  carriedWeightTotalKg,
  inventoryCategory,
  tryEquipFromBackpack,
  tryConsumeItem,
} = state;

const categories = ['全部', '物品', '工具', '材料', '消耗品'] as const;

function setCategory(cat: (typeof categories)[number]) {
  state.inventoryCategory.value = cat as InventoryCategoryFilter | '全部';
}

const filteredItems = filteredBackpackItems;
const carriedWeight = carriedWeightTotalKg;

function slotLabel(slot: EquipmentSlotKey) {
  return snapshot.value.equipmentSlotLabels[slot] ?? slot;
}

function wearSlotLabel(it: BackpackItem): string {
  const slot = resolveWearTargetSlot(it);
  return slot ? slotLabel(slot) : '';
}

const consumeDlg = ref<HTMLDialogElement | null>(null);
const pendingConsume = ref<BackpackItem | null>(null);

function openConsumeDialog(it: BackpackItem) {
  pendingConsume.value = it;
  consumeDlg.value?.showModal();
}

function closeConsumeDialog(confirmed: boolean) {
  const item = pendingConsume.value;
  pendingConsume.value = null;
  consumeDlg.value?.close();
  if (confirmed && item) {
    tryConsumeItem(item.id);
  }
}
</script>

<style scoped>
.goth-bp__heading {
  margin: 0 0 0.45rem;
  font-family: var(--g-font-display);
  font-size: 0.98rem;
  color: var(--g-text-accent);
}

.filter-row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
  margin-bottom: 0.45rem;
}

.filter-btn {
  font-family: var(--g-font-ui);
  font-size: 0.72rem;
  padding: 0.35rem 0.5rem;
  border-radius: 999px;
  border: none;
  background: rgba(28, 24, 20, 0.28);
  box-shadow: var(--g-depth-chip);
  color: var(--g-text-muted);
  cursor: pointer;
  min-height: 40px;
  transition:
    background 0.2s ease,
    color 0.2s ease,
    box-shadow 0.2s ease;
}

.filter-btn.active {
  background: rgba(42, 38, 34, 0.52);
  box-shadow:
    var(--g-depth-chip),
    inset 0 2px 10px rgba(8, 6, 5, 0.32),
    inset 0 1px 0 rgba(108, 96, 76, 0.06);
  color: var(--g-text-title);
  border: 1px solid rgba(157, 136, 104, 0.25);
}

.weight-line {
  margin: 0 0 0.55rem;
  font-size: 0.82rem;
}

.goth-bp-grid {
  margin: 0;
  padding: 0;
  list-style: none;
}

.goth-bp-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(168px, 1fr));
  gap: 0.5rem;
}

.goth-bp-card {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  padding: 0.5rem 0.55rem;
  font-size: 0.82rem;
  transition:
    transform 0.22s ease,
    box-shadow 0.22s ease;
}

.goth-bp-card:hover {
  transform: translateY(-2px);
  box-shadow:
    var(--g-depth-chip),
    0 10px 22px rgba(12, 10, 8, 0.22);
}

.goth-bp-card__head {
  display: flex;
  align-items: flex-start;
  gap: 0.45rem;
}

.goth-bp-card__titles {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.goth-bp-card__titles strong {
  font-size: 0.84rem;
  line-height: 1.25;
}

.desc {
  margin: 0;
  font-size: 0.74rem;
  line-height: 1.35;
}

.meta {
  font-size: 0.72rem;
}

.slot-hint {
  font-size: 0.68rem;
  color: var(--g-text-muted);
}

.goth-bp-card__actions {
  display: flex;
  gap: 0.35rem;
  margin-top: auto;
  padding-top: 0.25rem;
}

.goth-bp-btn {
  font-size: 0.72rem !important;
  padding: 0.35rem 0.55rem !important;
  min-height: 38px !important;
}

.goth-bp-empty {
  grid-column: 1 / -1;
  padding: 0.65rem 0;
  font-size: 0.85rem;
}

.muted {
  color: var(--g-text-muted);
}

.goth-inv-filter-fade-enter-active,
.goth-inv-filter-fade-leave-active {
  transition: opacity 0.22s ease;
}

.goth-inv-filter-fade-enter-from,
.goth-inv-filter-fade-leave-to {
  opacity: 0;
}

.goth-inv-card-move,
.goth-inv-card-enter-active,
.goth-inv-card-leave-active {
  transition:
    opacity 0.28s ease,
    transform 0.28s ease;
}

.goth-inv-card-enter-from {
  opacity: 0;
  transform: translateY(8px);
}

.goth-inv-card-leave-to {
  opacity: 0;
  transform: scale(0.98);
}

.goth-bp-wear-enter-active,
.goth-bp-wear-leave-active {
  transition:
    opacity 0.22s ease,
    transform 0.22s ease;
}

.goth-bp-wear-enter-from,
.goth-bp-wear-leave-to {
  opacity: 0;
  transform: translateY(4px);
}

@media (prefers-reduced-motion: reduce) {
  .filter-btn,
  .goth-bp-card,
  .goth-inv-filter-fade-enter-active,
  .goth-inv-filter-fade-leave-active,
  .goth-inv-card-move,
  .goth-inv-card-enter-active,
  .goth-inv-card-leave-active,
  .goth-bp-wear-enter-active,
  .goth-bp-wear-leave-active {
    transition: none;
  }

  .goth-bp-card:hover {
    transform: none;
  }

  .goth-bp-wear-enter-from,
  .goth-bp-wear-leave-to {
    transform: none;
  }
}

.goth-inv-dialog {
  padding: 0;
  border: none;
  border-radius: var(--g-radius);
  background: transparent;
  max-width: calc(100vw - 2rem);
}

.goth-inv-dialog::backdrop {
  background: rgba(12, 10, 8, 0.55);
}

.goth-inv-dialog__panel {
  padding: 0.85rem 1rem;
  background: linear-gradient(165deg, rgba(52, 48, 42, 0.98), rgba(26, 24, 22, 0.99));
  border: 1px solid rgba(108, 96, 76, 0.28);
  border-radius: var(--g-radius);
  box-shadow: 0 16px 40px rgba(8, 6, 5, 0.45);
}

.goth-inv-dialog__msg {
  margin: 0 0 0.75rem;
  font-size: 0.88rem;
}

.goth-inv-dialog__menu {
  display: flex;
  gap: 0.45rem;
  justify-content: flex-end;
}
</style>
