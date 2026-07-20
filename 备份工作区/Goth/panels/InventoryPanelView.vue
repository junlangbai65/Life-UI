<template>
  <div id="goth-panel-inventory" class="goth-panel-inventory goth-panel--inventory">
    <section class="goth-card goth-card--spaced-bottom goth-inv-shell" aria-labelledby="goth-inv-equip-title">
      <h3 id="goth-inv-equip-title">装备检视</h3>
      <p class="muted small goth-inv-lead">
        已穿戴条目可点击卸下并写入输入框；空置槽未启用点击。背包内物品可试穿，消耗品需确认使用。
      </p>
      <GothInventorySilhouette />
    </section>

    <section class="goth-card goth-card--spaced-bottom">
      <GothBackpackPanel />
    </section>

    <section class="goth-card goth-inv-storage-wrap" aria-labelledby="goth-inv-storage-title">
      <h3 id="goth-inv-storage-title">仓储</h3>
      <p v-if="snapshot.storageLocations.length === 0" class="muted storage-empty">当前未知</p>
      <div v-else class="goth-columns-2 goth-inv-storage-grid">
        <article
          v-for="loc in snapshot.storageLocations"
          :id="`goth-storage-${loc.id}`"
          :key="loc.id"
          class="storage-card goth-inset-slot"
        >
          <h4>{{ loc.name }}</h4>
          <ul class="item-list compact">
            <li v-for="it in loc.items" :key="it.id" class="storage-line">
              <GothItemTypeIcon class="storage-line__icon" :type="it.type" />
              <span>{{ it.name }} ×{{ it.quantity }}</span>
            </li>
            <li v-if="loc.items.length === 0" class="muted">当前未知</li>
          </ul>
        </article>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { inject } from 'vue';
import GothBackpackPanel from './inventory/GothBackpackPanel.vue';
import GothInventorySilhouette from './inventory/GothInventorySilhouette.vue';
import GothItemTypeIcon from './inventory/GothItemTypeIcon.vue';
import { gothStateKey } from '../gothStateContext';

const state = inject(gothStateKey);
if (!state) throw new Error('未找到 Goth 状态上下文。');

const { snapshot } = state;
</script>

<style scoped>
.goth-card--spaced-bottom {
  margin-bottom: 0.65rem;
}

.goth-inv-lead {
  margin: 0 0 0.55rem;
  line-height: 1.4;
}

.goth-inv-shell h3,
.goth-inv-storage-wrap h3 {
  margin: 0 0 0.35rem;
  font-family: var(--g-font-display);
  font-size: 0.98rem;
  color: var(--g-text-accent);
}

.storage-empty {
  margin: 0;
  font-size: 0.85rem;
}

.storage-card {
  padding: 0.5rem 0.55rem;
  transition: box-shadow 0.22s ease;
}

.storage-card:hover {
  box-shadow:
    var(--g-depth-chip),
    0 6px 18px rgba(12, 10, 8, 0.18);
}

.storage-card h4 {
  margin: 0 0 0.4rem;
  font-size: 0.9rem;
}

.item-list {
  margin: 0;
  padding: 0;
  list-style: none;
}

.storage-line {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.82rem;
  margin-bottom: 0.25rem;
}

.storage-line__icon {
  width: 1.35rem !important;
  height: 1.35rem !important;
}

.item-list.compact li {
  font-size: 0.82rem;
}

.muted {
  color: var(--g-text-muted);
}

.small {
  font-size: 0.8rem;
}

@media (prefers-reduced-motion: reduce) {
  .storage-card {
    transition: none;
  }
}
</style>
