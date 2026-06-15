<template>
  <li class="lf-tree__li">
    <div class="lf-tree__row" :class="{ 'lf-tree__row--leaf': !hasChildren }" :style="{ paddingLeft: depth * 14 + 'px' }">
      <button
        v-if="hasChildren"
        :id="`lf-tree-toggle-${node.key}`"
        type="button"
        class="lf-tree__toggle"
        :class="{ 'lf-tree__toggle--open': open }"
        :aria-expanded="open"
        :aria-label="open ? '折叠' : '展开'"
        @click="open = !open"
      >
        <AppIcon name="chevron-right" size="xs" bold />
      </button>
      <span v-else class="lf-tree__bullet" aria-hidden="true" />

      <span class="lf-tree__key">{{ node.label }}</span>
      <span v-if="node.badge" class="lf-tree__badge">{{ node.badge }}</span>
      <span v-if="node.value !== undefined" class="lf-tree__value">{{ node.value }}</span>
    </div>

    <Transition name="lf-expand">
      <ul v-if="hasChildren && open" class="lf-tree__children">
        <TreeNode v-for="child in node.children" :key="child.key" :node="child" :depth="depth + 1" />
      </ul>
    </Transition>
  </li>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import AppIcon from '../base/AppIcon.vue';
import type { TreeNode as TreeNodeType } from '../../types';

const props = withDefaults(defineProps<{ node: TreeNodeType; depth?: number }>(), { depth: 0 });

const open = ref(props.depth < 1);
const hasChildren = computed(() => !!props.node.children && props.node.children.length > 0);
</script>

<style scoped lang="scss">
.lf-tree__li {
  list-style: none;
}
.lf-tree__row {
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 7px 8px;
  margin-bottom: 4px;
  border: 2px solid var(--lf-ink);
  border-radius: var(--lf-radius-sm);
  background: var(--lf-surface);
  transition: background var(--lf-dur);
}
.lf-tree__row:hover { background: var(--lf-surface-soft); }
.lf-tree__row--leaf { background: var(--lf-surface-soft); border-style: dashed; }

.lf-tree__toggle {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  flex-shrink: 0;
  border: 2px solid var(--lf-ink);
  border-radius: var(--lf-radius-xs);
  background: var(--lf-butter);
  color: var(--lf-ink);
  transition: transform var(--lf-dur) var(--lf-ease-bounce);
}
.lf-tree__toggle--open { transform: rotate(90deg); }
.lf-tree__bullet {
  width: 8px;
  height: 8px;
  flex-shrink: 0;
  margin: 0 7px;
  border: 2px solid var(--lf-ink);
  border-radius: var(--lf-radius-pill);
  background: var(--lf-strawberry);
}
.lf-tree__key {
  font-family: var(--lf-font-display);
  font-weight: 600;
  font-size: 13px;
  color: var(--lf-text);
}
.lf-tree__badge {
  padding: 1px 7px;
  border: 1.5px solid var(--lf-ink);
  border-radius: var(--lf-radius-pill);
  background: var(--lf-mint);
  font-size: 10px;
  font-weight: 700;
  color: var(--lf-ink);
}
.lf-tree__value {
  margin-left: auto;
  font-family: var(--lf-font-display);
  font-weight: 700;
  font-size: 12px;
  color: var(--lf-strawberry-deep);
}
.lf-tree__children {
  margin: 0;
  padding: 0;
  overflow: hidden;
}

.lf-expand-enter-active { transition: opacity var(--lf-dur) var(--lf-ease-out), max-height var(--lf-dur) var(--lf-ease-out); max-height: 600px; }
.lf-expand-leave-active { transition: opacity 140ms var(--lf-ease-soft), max-height 140ms var(--lf-ease-soft); max-height: 600px; }
.lf-expand-enter-from,
.lf-expand-leave-to { opacity: 0; max-height: 0; }
</style>
