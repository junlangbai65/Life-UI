<template>
  <ul class="list">
    <li v-for="(it, i) in items" :key="`${tier}-${i}`" class="item" :class="`item--tier-${tier}`">
      <div class="status-head">
        <strong :id="`goth-status-${tier}-${i}-name`">{{ it.name }}</strong>
        <span v-if="it.kind" class="goth-tag status-kind">{{ it.kind }}</span>
      </div>
      <p class="desc">{{ it.description }}</p>
      <p class="effect">效果：{{ it.effect }}</p>
      <small v-if="it.remainingDays !== null" class="goth-mono remain">剩余 {{ it.remainingDays }} 日</small>
      <small v-else class="goth-mono remain remain-open">无期限</small>
    </li>
    <li v-if="items.length === 0" class="empty">当前未知</li>
  </ul>
</template>

<script setup lang="ts">
import type { StatusEntry } from '../goth.types';

defineProps<{
  items: StatusEntry[];
  tier: string;
}>();
</script>

<style scoped>
.list {
  margin: 0;
  padding: 0;
  list-style: none;
}

.item {
  position: relative;
  margin-bottom: 0.55rem;
  padding-bottom: 0.45rem;
  border-bottom: none;
}

.item:not(:last-child)::after {
  content: '';
  position: absolute;
  left: 3%;
  right: 3%;
  bottom: 0;
  height: 1px;
  background: var(--g-divider-fade-subtle);
  opacity: 0.85;
  pointer-events: none;
}

.status-head {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.35rem;
}

.status-kind {
  font-size: 0.68rem;
}

.desc {
  margin: 0.2rem 0;
  font-size: 0.82rem;
  color: var(--g-text-muted);
}

.effect {
  margin: 0;
  font-size: 0.8rem;
}

.remain {
  color: var(--g-text-accent);
}

.remain-open {
  color: var(--g-text-muted);
}

.empty {
  color: var(--g-text-muted);
  font-size: 0.85rem;
}

.item--tier-shallow .status-head strong {
  text-decoration: underline;
  text-decoration-color: rgba(168, 124, 108, 0.35);
  text-underline-offset: 3px;
}

.item--tier-mid .status-kind {
  border-color: rgba(148, 118, 98, 0.45);
}

.item--tier-deep .desc {
  color: rgba(180, 160, 150, 0.85);
}

.item--tier-deep .effect {
  border-left: 2px solid rgba(120, 88, 82, 0.35);
  padding-left: 0.45rem;
}
</style>
