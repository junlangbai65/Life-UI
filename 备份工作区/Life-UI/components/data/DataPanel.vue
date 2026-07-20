<template>
  <BaseModal
    v-model="ui.dataPanelOpen"
    title="数据详情"
    subtitle="存档变量与变化历史"
    icon="book"
    tone="cream"
    size="lg"
    id-base="lf-data"
  >
    <nav class="lf-data__tabs" role="tablist" aria-label="数据视图切换">
      <button
        v-for="tab in tabs"
        :id="`lf-data-tab-${tab.key}`"
        :key="tab.key"
        type="button"
        class="lf-data__tab"
        :class="{ 'lf-data__tab--on': active === tab.key }"
        role="tab"
        :aria-selected="active === tab.key"
        @click="active = tab.key"
      >
        <AppIcon :name="tab.icon" size="sm" bold />
        {{ tab.label }}
      </button>
    </nav>

    <Transition name="lf-tab-swap" mode="out-in">
      <!-- 树状结构 -->
      <ul v-if="active === 'tree'" key="tree" class="lf-data__tree">
        <TreeNode v-for="node in dataTree" :key="node.key" :node="node" />
      </ul>

      <!-- 历史记录 -->
      <div v-else key="history" class="lf-data__history">
        <div
          v-for="rec in historyRecords"
          :id="`lf-data-rec-${rec.id}`"
          :key="rec.id"
          class="lf-data__rec"
        >
          <span class="lf-data__rec-icon" :class="`lf-data__rec-icon--${rec.direction}`" aria-hidden="true">
            <AppIcon :name="rec.icon" size="sm" bold />
          </span>
          <div class="lf-data__rec-body">
            <span class="lf-data__rec-label">{{ rec.label }}</span>
            <span class="lf-data__rec-time">{{ rec.time }}</span>
          </div>
          <span class="lf-data__rec-delta" :class="`lf-data__rec-delta--${rec.direction}`">
            <AppIcon v-if="rec.direction !== 'flat'" :name="rec.direction === 'up' ? 'chevron-down' : 'chevron-down'" size="xs" bold :class="rec.direction === 'up' ? 'lf-data__rec-up' : ''" />
            {{ rec.delta }}
          </span>
        </div>
      </div>
    </Transition>
  </BaseModal>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import AppIcon, { type IconName } from '../base/AppIcon.vue';
import BaseModal from '../base/BaseModal.vue';
import TreeNode from './TreeNode.vue';
import { dataTree, historyRecords } from '../../data/details';
import { useUiStore } from '../../stores/useUiStore';

const ui = useUiStore();
const active = ref<'tree' | 'history'>('tree');

const tabs: { key: 'tree' | 'history'; label: string; icon: IconName }[] = [
  { key: 'tree', label: '变量结构', icon: 'branch' },
  { key: 'history', label: '变化历史', icon: 'history' },
];
</script>

<style scoped lang="scss">
.lf-data__tabs {
  display: flex;
  gap: 8px;
  margin-bottom: 14px;
}
.lf-data__tab {
  flex: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  padding: 9px;
  border: 2.5px solid var(--lf-ink);
  border-radius: var(--lf-radius-md);
  background: var(--lf-surface);
  font-family: var(--lf-font-display);
  font-size: 13px;
  font-weight: 600;
  color: var(--lf-text-secondary);
  box-shadow: var(--lf-shadow-chunky-sm);
  transition: transform var(--lf-dur) var(--lf-ease-bounce), background var(--lf-dur), color var(--lf-dur);
}
.lf-data__tab:hover { transform: translateY(-2px); }
.lf-data__tab--on {
  background: var(--lf-sky);
  color: var(--lf-ink);
}

.lf-data__tree {
  margin: 0;
  padding: 0;
}

.lf-data__history {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.lf-data__rec {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 9px 11px;
  border: 2.5px solid var(--lf-ink);
  border-radius: var(--lf-radius-md);
  background: var(--lf-surface);
  box-shadow: var(--lf-shadow-chunky-sm);
}
.lf-data__rec-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  flex-shrink: 0;
  border: 2px solid var(--lf-ink);
  border-radius: var(--lf-radius-pill);
  color: var(--lf-ink);
}
.lf-data__rec-icon--up { background: var(--lf-mint); }
.lf-data__rec-icon--down { background: var(--lf-strawberry); }
.lf-data__rec-icon--flat { background: var(--lf-surface-sunken); }
.lf-data__rec-body { display: flex; flex-direction: column; min-width: 0; flex: 1; }
.lf-data__rec-label { font-family: var(--lf-font-display); font-weight: 700; font-size: 13px; color: var(--lf-text); }
.lf-data__rec-time { font-size: 11px; color: var(--lf-text-secondary); font-weight: 600; }
.lf-data__rec-delta {
  display: inline-flex;
  align-items: center;
  gap: 1px;
  padding: 3px 10px;
  border: 2px solid var(--lf-ink);
  border-radius: var(--lf-radius-pill);
  font-family: var(--lf-font-display);
  font-weight: 700;
  font-size: 12px;
}
.lf-data__rec-delta--up { background: var(--lf-mint); color: #2f7a55; }
.lf-data__rec-delta--down { background: #fde4ee; color: var(--lf-strawberry-deep); }
.lf-data__rec-delta--flat { background: var(--lf-surface-soft); color: var(--lf-text-secondary); }
.lf-data__rec-up { transform: rotate(180deg); }

.lf-tab-swap-enter-active { transition: opacity var(--lf-dur) var(--lf-ease-out), transform var(--lf-dur) var(--lf-ease-bounce); }
.lf-tab-swap-leave-active { transition: opacity 120ms var(--lf-ease-soft); }
.lf-tab-swap-enter-from { opacity: 0; transform: translateX(16px); }
.lf-tab-swap-leave-to { opacity: 0; }
</style>
