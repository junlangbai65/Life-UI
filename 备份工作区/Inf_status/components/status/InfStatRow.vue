<template>
  <article
    :id="id"
    class="inf-stat-row inf-glass-interactive inf-stagger-item"
    :class="fieldToneClass"
    :data-field="fieldKey"
    :style="{ '--stagger': stagger }"
  >
    <span class="inf-stat-row__icon-box" aria-hidden="true">
      <InfIcon :name="icon" size="sm" />
    </span>
    <div class="inf-stat-row__body">
      <span class="inf-stat-row__label inf-section-label">{{ label }}</span>
      <p class="inf-stat-row__value inf-text-value">
        {{ displayValue }}
        <span v-if="changed" class="inf-stat-row__changed" aria-label="相对上一楼层已变更">已变更</span>
      </p>
    </div>
  </article>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import InfIcon from '../ui/InfIcon.vue';

const props = withDefaults(
  defineProps<{
    icon: string;
    label: string;
    value?: string;
    changed?: boolean;
    stagger?: number;
    rowId?: string;
    fieldKey?: string;
  }>(),
  { value: '', changed: false, stagger: 0, rowId: undefined, fieldKey: undefined },
);

const FIELD_TONE_CLASS: Record<string, string> = {
  姿态: 'inf-stat-row--field-posture',
  上身: 'inf-stat-row--field-upper',
  下身: 'inf-stat-row--field-lower',
  鞋袜: 'inf-stat-row--field-footwear',
};

const displayValue = computed(() => props.value?.trim() || '未记录');
const id = computed(() => props.rowId || `inf-stat-${props.label}`);
const fieldKey = computed(() => props.fieldKey || props.label);
const fieldToneClass = computed(() => FIELD_TONE_CLASS[fieldKey.value] ?? '');
</script>

<style scoped lang="scss">
.inf-stat-row {
  display: flex;
  align-items: flex-start;
  gap: 0.65rem;
  padding: 0.7rem 0.8rem;
  margin-bottom: 0.5rem;
  border-radius: var(--inf-radius-sm);
  border-left: 2px solid transparent;
  transition:
    transform var(--inf-transition),
    border-color var(--inf-transition),
    box-shadow var(--inf-transition);

  &:hover {
    transform: translateY(-2px);
    border-left-color: var(--inf-accent);
    box-shadow: 0 8px 18px color-mix(in srgb, var(--inf-accent) 8%, transparent);
  }
}

.inf-stat-row__icon-box {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 32px;
  height: 32px;
  border-radius: 10px;
  color: var(--inf-accent);
  background: color-mix(in srgb, var(--inf-accent-soft) 80%, transparent);
  border: 1px solid var(--inf-border);
  transition: transform var(--inf-transition-fast);

  .inf-stat-row:hover & {
    transform: scale(1.08);
  }
}

.inf-stat-row__body {
  min-width: 0;
  flex: 1;
}

.inf-stat-row__value {
  margin: 0.35rem 0 0;
}

.inf-stat-row--field-posture .inf-stat-row__label {
  color: var(--inf-accent);
}

.inf-stat-row--field-upper .inf-stat-row__label {
  color: var(--inf-info);
}

.inf-stat-row--field-lower .inf-stat-row__label {
  color: color-mix(in srgb, var(--inf-desire-accent) 85%, var(--inf-text-secondary));
}

.inf-stat-row--field-footwear .inf-stat-row__label {
  color: var(--inf-warning);
}

.inf-stat-row__changed {
  display: inline-flex;
  align-items: center;
  margin-left: 0.35rem;
  padding: 0.05rem 0.35rem;
  font-size: 0.5625rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--inf-accent);
  background: var(--inf-accent-soft);
  border-radius: 999px;
  vertical-align: middle;
}
</style>
