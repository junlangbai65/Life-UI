<template>
  <div
    v-if="switchable"
    id="inf-character-switch-btn"
    class="inf-character-switch-btn"
    :class="{ 'is-open': menuOpen }"
  >
    <button
      id="inf-btn-character-switch"
      type="button"
      class="inf-character-switch-btn__trigger inf-btn inf-btn--ghost"
      :aria-expanded="menuOpen"
      aria-haspopup="listbox"
      aria-label="切换角色"
      title="切换角色"
      @click="toggleMenu"
    >
      <InfIcon name="users" size="sm" />
      <span class="inf-character-switch-btn__label">切换</span>
    </button>

    <div
      v-if="menuOpen"
      id="inf-character-switch-menu"
      class="inf-character-switch-btn__menu"
      role="listbox"
      aria-label="选择角色"
    >
      <button
        v-for="key in keys"
        :key="key"
        :id="`inf-char-option-${key}`"
        type="button"
        role="option"
        class="inf-character-switch-btn__option"
        :class="{ 'is-active': modelValue === key }"
        :aria-selected="modelValue === key"
        @click="selectKey(key)"
      >
        <span class="inf-character-switch-btn__option-name">{{ optionName(key) }}</span>
        <span v-if="optionSubtitle(key)" class="inf-character-switch-btn__option-key inf-caption">
          {{ optionSubtitle(key) }}
        </span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { useMvuStore } from '../../stores/useMvuStore';
import InfIcon from '../ui/InfIcon.vue';

const props = defineProps<{
  modelValue: string;
  keys: string[];
}>();

const emit = defineEmits<{ 'update:modelValue': [value: string] }>();

const mvu = useMvuStore();
const menuOpen = ref(false);

const switchable = computed(() => props.keys.length > 1);

function optionName(key: string) {
  return mvu.data.角色[key]?.姓名?.trim() || key;
}

function optionSubtitle(key: string) {
  const name = mvu.data.角色[key]?.姓名?.trim();
  return name && name !== key ? key : '';
}

function toggleMenu() {
  menuOpen.value = !menuOpen.value;
}

function selectKey(key: string) {
  emit('update:modelValue', key);
  menuOpen.value = false;
}

function onDocumentClick(event: MouseEvent) {
  const root = document.getElementById('inf-character-switch-btn');
  if (!root || root.contains(event.target as Node)) return;
  menuOpen.value = false;
}

onMounted(() => {
  document.addEventListener('click', onDocumentClick);
});

onBeforeUnmount(() => {
  document.removeEventListener('click', onDocumentClick);
});
</script>

<style scoped lang="scss">
.inf-character-switch-btn {
  position: relative;
  flex-shrink: 0;
}

.inf-character-switch-btn__trigger {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  min-height: 2rem;
  padding: 0.35rem 0.55rem;
  font-family: var(--inf-font-tech);
  font-size: 0.68rem;
  letter-spacing: 0.06em;
}

.inf-character-switch-btn__label {
  font-weight: 600;
}

.inf-character-switch-btn.is-open .inf-character-switch-btn__trigger {
  color: var(--inf-accent);
  background: var(--inf-accent-soft);
  border-color: color-mix(in srgb, var(--inf-accent) 30%, var(--inf-border));
}

.inf-character-switch-btn__menu {
  position: absolute;
  top: calc(100% + 0.35rem);
  right: 0;
  z-index: 20;
  min-width: 9.5rem;
  max-width: 14rem;
  padding: 0.35rem;
  border-radius: var(--inf-radius-sm);
  border: 1px solid var(--inf-border-strong);
  background: color-mix(in srgb, var(--inf-bg-elevated) 96%, transparent);
  box-shadow: var(--inf-shadow-md);
  backdrop-filter: blur(var(--inf-blur));
}

.inf-character-switch-btn__option {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.1rem;
  width: 100%;
  padding: 0.45rem 0.55rem;
  font-family: var(--inf-font-ui);
  text-align: left;
  color: var(--inf-text-secondary);
  background: transparent;
  border: none;
  border-radius: var(--inf-radius-xs);
  cursor: pointer;
  transition:
    color var(--inf-transition-fast),
    background var(--inf-transition-fast);

  &:hover {
    color: var(--inf-text);
    background: var(--inf-accent-soft);
  }

  &.is-active {
    color: var(--inf-accent);
    background: color-mix(in srgb, var(--inf-accent-soft) 80%, transparent);
  }

  &:focus-visible {
    outline: 2px solid var(--inf-accent);
    outline-offset: -2px;
  }
}

.inf-character-switch-btn__option-name {
  font-size: 0.8125rem;
  font-weight: 600;
  line-height: 1.3;
}

.inf-character-switch-btn__option-key {
  font-size: 0.68rem;
  line-height: 1.2;
}
</style>
