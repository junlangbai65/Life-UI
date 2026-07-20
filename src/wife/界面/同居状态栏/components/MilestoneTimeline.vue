<template>
  <ul class="milestone-timeline" role="list" aria-label="关系里程碑">
    <li
      v-for="item in relation.milestones"
      :key="item.key"
      class="milestone-timeline__item"
      :class="{ 'milestone-timeline__item--done': item.done }"
      role="listitem"
    >
      <span class="milestone-timeline__marker" :aria-label="item.done ? '已完成' : '未完成'">
        <Icon v-if="item.done" name="check-circle" size="sm" class="milestone-timeline__check" />
        <span v-else class="milestone-timeline__dot" />
      </span>
      <span class="milestone-timeline__label">{{ item.label }}</span>
    </li>
  </ul>
  <p v-if="relation.showRelationForm" class="relation-badge">
    <Icon name="heart-handshake" size="sm" />
    {{ relation.relationForm }}
  </p>
</template>

<script setup lang="ts">
import { Icon } from './icons';
import { useMvuSlices } from '../composables/useMvuSlices';

const { relationSlice: relation } = useMvuSlices();
</script>

<style scoped>
.milestone-timeline {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.milestone-timeline__item {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 13px;
  color: var(--c-label-secondary);
  transition: color var(--duration-fast) var(--ease-ios);
}

.milestone-timeline__item--done {
  color: var(--c-label);
  font-weight: 500;
}

.milestone-timeline__marker {
  width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.milestone-timeline__dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--c-fill);
  transition: transform var(--duration-fast) var(--ease-ios);
}

.milestone-timeline__check {
  color: var(--c-accent-affection);
  transition: transform var(--duration-fast) var(--ease-ios);
}

.milestone-timeline__item--done .milestone-timeline__check {
  transform: scale(1.1);
}

.relation-badge {
  margin-top: 12px;
  font-size: 12px;
  font-weight: 600;
  color: var(--c-ntr-cross);
  padding: 6px 10px;
  border-radius: 8px;
  background: color-mix(in srgb, var(--c-ntr-cross) 12%, transparent);
  display: inline-flex;
  align-items: center;
  gap: 6px;
}
</style>
