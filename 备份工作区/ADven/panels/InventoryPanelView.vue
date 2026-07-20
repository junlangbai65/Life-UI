<template>
  <article id="inventory-panel-content" class="panel-content panel-v2 inventory-v2">
    <section class="inventory-equipment-stage pixel-card">
      <h3>装备舞台</h3>
      <div id="equipment-slot-grid" class="equip-grid v2">
        <div
          v-for="slot in equipmentSlotList"
          :id="`equipment-slot-${slot.key}`"
          :key="slot.key"
          class="equip-slot v2"
          @dragover.prevent
          @drop="$emit('drop-to-equip', slot.key)"
        >
          <span class="slot-label">{{ slot.label }}</span>
          <div
            v-if="equipmentSlots[slot.key]"
            class="equip-item v2"
            draggable="true"
            @dragstart="$emit('drag-start-equipment', slot.key)"
          >
            <div class="inventory-item__icon-main">
              <svg class="inventory-item__icon-primary" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  v-for="(path, idx) in iconPathList(itemSemantic(equipmentSlots[slot.key]).primary)"
                  :key="`primary-eq-${slot.key}-${idx}`"
                  :d="path"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.8"
                  stroke-linecap="square"
                  stroke-linejoin="miter"
                />
              </svg>
              <div class="inventory-item__icon-secondary" v-if="itemSemantic(equipmentSlots[slot.key]).secondary.length > 0">
                <svg
                  v-for="icon in itemSemantic(equipmentSlots[slot.key]).secondary"
                  :key="`secondary-eq-${slot.key}-${icon}`"
                  class="inventory-item__icon-chip"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    v-for="(path, idx) in iconPathList(icon)"
                    :key="`secondary-eq-path-${slot.key}-${icon}-${idx}`"
                    :d="path"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="1.75"
                    stroke-linecap="square"
                    stroke-linejoin="miter"
                  />
                </svg>
              </div>
            </div>
            <strong class="inventory-item__name">{{ equipmentSlots[slot.key]?.name }}</strong>
            <small class="inventory-item__meta">
              <AdvenItemCategoryBadge category="装备" compact />
              <span v-if="showStatLine(equipmentSlots[slot.key]?.baseATK)">ATK {{ safeNum(equipmentSlots[slot.key]?.baseATK) }}</span>
              <span v-if="showStatLine(equipmentSlots[slot.key]?.baseDEF)">DEF {{ safeNum(equipmentSlots[slot.key]?.baseDEF) }}</span>
            </small>
            <div class="inventory-item-hover-panel" role="note" aria-live="polite">
              <h4>{{ equipmentSlots[slot.key]?.name }}</h4>
              <div class="inventory-item-hover-panel__icons">
                <svg class="inventory-item__icon-chip inventory-item__icon-chip--large" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    v-for="(path, idx) in iconPathList(itemSemantic(equipmentSlots[slot.key]).primary)"
                    :key="`hover-eq-primary-${slot.key}-${idx}`"
                    :d="path"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="1.8"
                    stroke-linecap="square"
                    stroke-linejoin="miter"
                  />
                </svg>
                <svg
                  v-for="icon in itemSemantic(equipmentSlots[slot.key]).secondary"
                  :key="`hover-eq-secondary-${slot.key}-${icon}`"
                  class="inventory-item__icon-chip"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    v-for="(path, idx) in iconPathList(icon)"
                    :key="`hover-eq-secondary-path-${slot.key}-${icon}-${idx}`"
                    :d="path"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="1.75"
                    stroke-linecap="square"
                    stroke-linejoin="miter"
                  />
                </svg>
              </div>
              <p>{{ equipmentSlots[slot.key]?.description || '暂无描述' }}</p>
              <ul>
                <li v-if="showStatLine(equipmentSlots[slot.key]?.baseATK)">ATK：{{ safeNum(equipmentSlots[slot.key]?.baseATK) }}</li>
                <li v-if="showStatLine(equipmentSlots[slot.key]?.baseDEF)">DEF：{{ safeNum(equipmentSlots[slot.key]?.baseDEF) }}</li>
                <li v-if="(equipmentSlots[slot.key]?.entries?.length ?? 0) > 0">词条：{{ equipmentSlots[slot.key]?.entries?.join('、') }}</li>
              </ul>
            </div>
          </div>
          <div v-else class="empty-note">拖入可装备道具</div>
        </div>
      </div>
    </section>

    <section class="inventory-storage-stage pixel-card">
      <h3>背包仓储</h3>
      <div id="inventory-category-tabs" class="category-row">
        <button
          v-for="category in inventoryCategories"
          :id="`inventory-category-${category}`"
          :key="category"
          class="quick-action-btn"
          type="button"
          :class="{ active: activeInventoryCategory === category }"
          @click="$emit('update:active-category', category)"
        >
          <AdvenItemCategoryBadge :category="category" compact />
        </button>
      </div>
      <div id="inventory-grid-panel" class="inventory-grid v2" @dragover.prevent @drop="$emit('drop-to-inventory')">
        <div
          v-for="item in filteredInventoryItems"
          :id="`inventory-item-${item.id}`"
          :key="item.id"
          class="inventory-item v2"
          draggable="true"
          @dragstart="$emit('drag-start-inventory', item.id)"
        >
          <div class="inventory-item__icon-main">
            <svg class="inventory-item__icon-primary" viewBox="0 0 24 24" aria-hidden="true">
              <path
                v-for="(path, idx) in iconPathList(itemSemantic(item).primary)"
                :key="`primary-item-${item.id}-${idx}`"
                :d="path"
                fill="none"
                stroke="currentColor"
                stroke-width="1.8"
                stroke-linecap="square"
                stroke-linejoin="miter"
              />
            </svg>
            <div class="inventory-item__icon-secondary" v-if="itemSemantic(item).secondary.length > 0">
              <svg
                v-for="icon in itemSemantic(item).secondary"
                :key="`secondary-item-${item.id}-${icon}`"
                class="inventory-item__icon-chip"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  v-for="(path, idx) in iconPathList(icon)"
                  :key="`secondary-item-path-${item.id}-${icon}-${idx}`"
                  :d="path"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.75"
                  stroke-linecap="square"
                  stroke-linejoin="miter"
                />
              </svg>
            </div>
          </div>
          <strong class="inventory-item__name">{{ item.name }}</strong>
          <small class="inventory-item__meta">
            <AdvenItemCategoryBadge :category="item.category" compact />
            <span>{{ item.quality }}</span>
            <span v-if="showStatLine(item.baseATK)">ATK {{ safeNum(item.baseATK) }}</span>
            <span v-if="showStatLine(item.baseDEF)">DEF {{ safeNum(item.baseDEF) }}</span>
          </small>
          <div class="inventory-item-hover-panel" role="note" aria-live="polite">
            <h4>{{ item.name }}</h4>
            <div class="inventory-item-hover-panel__icons">
              <svg class="inventory-item__icon-chip inventory-item__icon-chip--large" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  v-for="(path, idx) in iconPathList(itemSemantic(item).primary)"
                  :key="`hover-item-primary-${item.id}-${idx}`"
                  :d="path"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.8"
                  stroke-linecap="square"
                  stroke-linejoin="miter"
                />
              </svg>
              <svg
                v-for="icon in itemSemantic(item).secondary"
                :key="`hover-item-secondary-${item.id}-${icon}`"
                class="inventory-item__icon-chip"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  v-for="(path, idx) in iconPathList(icon)"
                  :key="`hover-item-secondary-path-${item.id}-${icon}-${idx}`"
                  :d="path"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.75"
                  stroke-linecap="square"
                  stroke-linejoin="miter"
                />
              </svg>
            </div>
            <p>{{ item.description || '暂无描述' }}</p>
            <ul>
              <li v-if="item.quantity !== undefined">数量：{{ item.quantity }}</li>
              <li v-if="showStatLine(item.baseATK)">ATK：{{ safeNum(item.baseATK) }}</li>
              <li v-if="showStatLine(item.baseDEF)">DEF：{{ safeNum(item.baseDEF) }}</li>
              <li v-if="(item.entries?.length ?? 0) > 0">词条：{{ item.entries?.join('、') }}</li>
            </ul>
          </div>
        </div>
        <div v-if="filteredInventoryItems.length === 0" class="empty-note">该分类背包为空</div>
      </div>
      <p id="inventory-feedback-text" class="feedback-text">{{ inventoryFeedback }}</p>
    </section>
  </article>
</template>

<script setup lang="ts">
import AdvenItemCategoryBadge from '../AdvenItemCategoryBadge.vue';
import type { EquipmentSlotInfo, EquipmentSlots, InventoryItem } from '../adven.types';
import type { ItemSemanticIcon } from '../utils/itemKeywordIcons';
import { iconPaths, resolveItemSemanticIcons } from '../utils/itemKeywordIcons';

defineProps<{
  equipmentSlotList: EquipmentSlotInfo[];
  equipmentSlots: EquipmentSlots;
  inventoryCategories: Array<InventoryItem['category']>;
  activeInventoryCategory: InventoryItem['category'];
  filteredInventoryItems: InventoryItem[];
  inventoryFeedback: string;
}>();

defineEmits<{
  'update:active-category': [category: InventoryItem['category']];
  'drag-start-inventory': [itemId: string];
  'drag-start-equipment': [slot: keyof EquipmentSlots];
  'drop-to-equip': [slot: keyof EquipmentSlots];
  'drop-to-inventory': [];
}>();

function showStatLine(value: number | undefined) {
  return typeof value === 'number' && Number.isFinite(value) && value !== 0;
}

function safeNum(value: number | undefined) {
  return typeof value === 'number' && Number.isFinite(value) ? value : 0;
}

function itemSemantic(item: InventoryItem | null | undefined) {
  if (!item) return resolveItemSemanticIcons('', '', '物品');
  return resolveItemSemanticIcons(item.name, item.description ?? '', item.category);
}

function iconPathList(icon: ItemSemanticIcon) {
  return iconPaths(icon);
}
</script>
