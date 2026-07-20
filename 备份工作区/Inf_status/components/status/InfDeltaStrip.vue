<template>
  <div
    v-if="items.length > 0"
    id="inf-delta-strip"
    class="inf-delta-strip"
    aria-live="polite"
    :aria-label="`相对上一楼层 ${items.length} 项变化`"
  >
    <span class="inf-delta-strip__beacon" aria-hidden="true" />
    <InfIcon name="radar" size="sm" class="inf-delta-strip__icon" />
    <div class="inf-delta-strip__rail">
      <span
        v-for="(item, index) in items"
        :key="item.key"
        class="inf-delta-strip__node"
        :class="[
          item.kind === 'numeric' && item.delta !== undefined && item.delta > 0
            ? 'inf-delta-strip__node--up'
            : item.kind === 'numeric' && item.delta !== undefined && item.delta < 0
              ? 'inf-delta-strip__node--down'
              : '',
        ]"
        :style="{ '--stagger': index }"
        :title="item.label"
      >
        <InfIcon :name="item.icon" size="sm" />
        <span v-if="item.delta !== undefined" class="inf-mono">{{ formatDelta(item.delta) }}</span>
        <span v-else class="inf-delta-strip__dot" aria-hidden="true" />
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { NumericDeltaKey } from '../../utils/statCompare';
import { formatDelta } from '../../utils/mvuDisplay';
import InfIcon from '../ui/InfIcon.vue';

export type DeltaStripItem = {
  key: string;
  label: string;
  icon: string;
  kind: 'numeric' | 'text';
  delta?: number;
};

const props = defineProps<{
  numericDeltas: Partial<Record<NumericDeltaKey, number>>;
  changedFields: Set<string>;
}>();

const numericMeta: Record<NumericDeltaKey, { label: string; icon: string }> = {
  感染进程: { label: '感染进程', icon: 'activity' },
  性欲: { label: '性欲', icon: 'heart' },
};

const textMeta: Record<string, { label: string; icon: string }> = {
  姿态: { label: '姿态', icon: 'user' },
  上身: { label: '上身', icon: 'box' },
  下身: { label: '下身', icon: 'layers' },
  鞋袜: { label: '鞋袜', icon: 'shoe' },
  感染状态: { label: '感染状态', icon: 'warning' },
};

const items = computed<DeltaStripItem[]>(() => {
  const result: DeltaStripItem[] = [];

  for (const [key, delta] of Object.entries(props.numericDeltas) as [NumericDeltaKey, number][]) {
    if (delta === 0) continue;
    const meta = numericMeta[key];
    result.push({
      key,
      label: meta.label,
      icon: meta.icon,
      kind: 'numeric',
      delta,
    });
  }

  for (const [key, meta] of Object.entries(textMeta)) {
    if (props.numericDeltas[key as NumericDeltaKey] !== undefined) continue;
    if (!props.changedFields.has(key)) continue;
    result.push({
      key,
      label: meta.label,
      icon: meta.icon,
      kind: 'text',
    });
  }

  return result;
});
</script>

<style scoped lang="scss">
.inf-delta-strip {
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0.5rem 0 0.75rem;
  padding: 0.45rem 0.55rem;
  border-radius: var(--inf-radius-sm);
  border: 1px solid color-mix(in srgb, var(--inf-accent) 18%, var(--inf-border));
  background: linear-gradient(90deg, var(--inf-accent-soft), transparent 85%);
  overflow: hidden;

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.12), transparent);
    animation: inf-drift-scan 3.2s ease-in-out infinite;
    pointer-events: none;
  }
}

.inf-delta-strip__beacon {
  position: absolute;
  left: 0.35rem;
  top: 50%;
  width: 6px;
  height: 6px;
  margin-top: -3px;
  border-radius: 50%;
  background: var(--inf-accent);
  box-shadow: 0 0 8px var(--inf-accent-glow);
  animation: inf-drift-beacon 1.8s ease-in-out infinite;
}

.inf-delta-strip__icon {
  position: relative;
  z-index: 1;
  margin-left: 0.75rem;
  color: var(--inf-accent);
  flex-shrink: 0;
}

.inf-delta-strip__rail {
  position: relative;
  z-index: 1;
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
  min-width: 0;
}

.inf-delta-strip__node {
  display: inline-flex;
  align-items: center;
  gap: 0.2rem;
  padding: 0.18rem 0.45rem;
  font-family: var(--inf-font-tech);
  font-size: 0.68rem;
  font-weight: 600;
  color: var(--inf-text-secondary);
  background: color-mix(in srgb, var(--inf-surface-glass-strong) 88%, transparent);
  border: 1px solid var(--inf-border);
  border-radius: 999px;
  animation: inf-drift-beacon 2.9s ease-in-out infinite;
  animation-delay: calc(var(--stagger, 0) * 0.45s);
}

.inf-delta-strip__node--up {
  color: var(--inf-delta-up);
  border-color: color-mix(in srgb, var(--inf-delta-up) 25%, var(--inf-border));
}

.inf-delta-strip__node--down {
  color: var(--inf-delta-down);
  border-color: color-mix(in srgb, var(--inf-delta-down) 25%, var(--inf-border));
}

.inf-delta-strip__dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: var(--inf-accent);
}
</style>
