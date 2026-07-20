<template>
  <svg
    class="goth-item-type-icon"
    :class="`goth-item-type-icon--${typeClass}`"
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <!-- 物品：匣 -->
    <g v-if="type === '物品'">
      <rect x="7" y="9" width="18" height="16" rx="2" stroke="currentColor" stroke-width="1.35" />
      <path d="M7 14h18M16 9v5" stroke="currentColor" stroke-width="1.1" stroke-linecap="round" />
      <circle cx="16" cy="19" r="2" stroke="currentColor" stroke-width="1" />
    </g>
    <!-- 工具：扳手 -->
    <g v-else-if="type === '工具'">
      <path
        d="M10 22l10-10M14 12l2 2M18 16l2 2"
        stroke="currentColor"
        stroke-width="1.35"
        stroke-linecap="round"
      />
      <path d="M8 24l4-4" stroke="currentColor" stroke-width="1.35" stroke-linecap="round" />
      <circle cx="21" cy="11" r="3.5" stroke="currentColor" stroke-width="1.2" />
    </g>
    <!-- 材料：晶体 -->
    <g v-else-if="type === '材料'">
      <path d="M16 5l9 9-9 14-9-14 9-9z" stroke="currentColor" stroke-width="1.25" stroke-linejoin="round" />
      <path d="M16 5v23M7 14h18M11 10l10 10M21 10L11 20" stroke="currentColor" stroke-width="0.9" opacity="0.55" />
    </g>
    <!-- 消耗品：药剂 -->
    <g v-else-if="type === '消耗品'">
      <path d="M13 6h6v4h-6V6z" stroke="currentColor" stroke-width="1.15" />
      <path d="M11 10h10l-1 18H12L11 10z" stroke="currentColor" stroke-width="1.25" stroke-linejoin="round" />
      <path d="M14 16h4M14 21h4" stroke="currentColor" stroke-width="1" stroke-linecap="round" opacity="0.6" />
    </g>
  </svg>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { InventoryCategoryFilter } from '../../goth.types';

const props = defineProps<{
  type: InventoryCategoryFilter;
}>();

const typeClass = computed(() =>
  props.type === '物品' ? 'goods' : props.type === '工具' ? 'tool' : props.type === '材料' ? 'mat' : 'cons',
);
</script>

<style scoped>
.goth-item-type-icon {
  width: 1.65rem;
  height: 1.65rem;
  flex-shrink: 0;
  display: block;
  color: var(--g-text-muted);
}

.goth-item-type-icon--goods {
  color: rgba(184, 168, 130, 0.95);
}

.goth-item-type-icon--tool {
  color: rgba(138, 155, 171, 0.95);
}

.goth-item-type-icon--mat {
  color: rgba(143, 158, 134, 0.95);
}

.goth-item-type-icon--cons {
  color: rgba(168, 124, 108, 0.95);
}
</style>
