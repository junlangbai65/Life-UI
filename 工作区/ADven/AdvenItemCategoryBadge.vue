<template>
  <span class="adven-item-category-badge" :class="badgeClasses">
    <svg class="adven-item-category-badge__icon" viewBox="0 0 24 24" aria-hidden="true">
      <path
        v-if="category === '装备'"
        d="M5 18l6-6 2 2 6-6M10 7l2-2 2 2M4 20h16"
        fill="none"
        stroke="currentColor"
        stroke-width="1.8"
        stroke-linecap="square"
        stroke-linejoin="miter"
      />
      <path
        v-else-if="category === '物品'"
        d="M5 7h14v12H5zM9 7V5h6v2M8 12h8M8 15h5"
        fill="none"
        stroke="currentColor"
        stroke-width="1.8"
        stroke-linecap="square"
        stroke-linejoin="miter"
      />
      <path
        v-else-if="category === '消耗品'"
        d="M10 4h4M11 4v4l-3 5a4 4 0 0 0 3.4 6h1.2A4 4 0 0 0 16 13l-3-5V4M9 14h6"
        fill="none"
        stroke="currentColor"
        stroke-width="1.8"
        stroke-linecap="square"
        stroke-linejoin="miter"
      />
      <path
        v-else
        d="M12 4l6 4v8l-6 4-6-4V8zM12 8v8M8.5 10.5l7 5M15.5 10.5l-7 5"
        fill="none"
        stroke="currentColor"
        stroke-width="1.8"
        stroke-linecap="square"
        stroke-linejoin="miter"
      />
    </svg>
    <span class="adven-item-category-badge__label">{{ category }}</span>
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { InventoryItem } from './adven.types';

const props = withDefaults(
  defineProps<{
    category: InventoryItem['category'];
    compact?: boolean;
  }>(),
  { compact: false },
);

const badgeClasses = computed(() => [
  `adven-item-category-badge--${props.category}`,
  { 'adven-item-category-badge--compact': props.compact },
]);
</script>
