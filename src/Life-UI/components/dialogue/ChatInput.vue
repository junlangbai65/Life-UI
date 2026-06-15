<template>
  <form class="lf-input" @submit.prevent="submit">
    <button
      id="lf-input-back"
      type="button"
      class="lf-input__side"
      aria-label="返回选项"
      @click="$emit('toggle')"
    >
      <AppIcon :name="mode === 'choices' ? 'edit' : 'menu'" size="sm" bold />
    </button>

    <div class="lf-input__field">
      <input
        id="lf-input-text"
        v-model="text"
        type="text"
        class="lf-input__el"
        :placeholder="placeholder"
        :disabled="disabled"
        autocomplete="off"
        @keydown.enter.prevent="submit"
      />
    </div>

    <button
      id="lf-input-send"
      type="submit"
      class="lf-input__send"
      :class="{ 'lf-input__send--ready': canSend }"
      :disabled="!canSend"
      aria-label="发送"
    >
      <AppIcon name="send" size="sm" bold />
    </button>
  </form>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import AppIcon from '../base/AppIcon.vue';

const props = withDefaults(
  defineProps<{ disabled?: boolean; mode?: 'choices' | 'input'; placeholder?: string }>(),
  { disabled: false, mode: 'input', placeholder: '写下你想说的话……' },
);

const emit = defineEmits<{ (e: 'send', text: string): void; (e: 'toggle'): void }>();

const text = ref('');
const canSend = computed(() => !props.disabled && text.value.trim().length > 0);

function submit() {
  if (!canSend.value) return;
  emit('send', text.value.trim());
  text.value = '';
}
</script>

<style scoped lang="scss">
.lf-input {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px calc(10px + env(safe-area-inset-bottom, 0px));
  background: var(--lf-surface);
  border-top: 2.5px solid var(--lf-ink);
}
.lf-input__side {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  flex-shrink: 0;
  border: 2.5px solid var(--lf-ink);
  border-radius: var(--lf-radius-pill);
  background: var(--lf-surface-soft);
  color: var(--lf-ink);
  box-shadow: var(--lf-shadow-chunky-sm);
  transition: transform var(--lf-dur) var(--lf-ease-bounce), background var(--lf-dur);
}
.lf-input__side:hover { background: var(--lf-butter); transform: translateY(-2px); }
.lf-input__side:active { transform: translateY(1px); }

.lf-input__field {
  flex: 1;
  min-width: 0;
}
.lf-input__el {
  width: 100%;
  padding: 11px 15px;
  border: 2.5px solid var(--lf-ink);
  border-radius: var(--lf-radius-pill);
  background: var(--lf-surface-soft);
  font-size: 14px;
  color: var(--lf-text);
  transition: background var(--lf-dur), box-shadow var(--lf-dur);
}
.lf-input__el::placeholder { color: var(--lf-text-muted); }
.lf-input__el:focus {
  outline: none;
  background: var(--lf-surface);
  box-shadow: inset 0 0 0 1px var(--lf-strawberry);
}
.lf-input__el:disabled { opacity: 0.55; }

.lf-input__send {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  flex-shrink: 0;
  border: 2.5px solid var(--lf-ink);
  border-radius: var(--lf-radius-pill);
  background: var(--lf-surface-sunken);
  color: var(--lf-text-muted);
  box-shadow: var(--lf-shadow-chunky-sm);
  transition: transform var(--lf-dur) var(--lf-ease-bounce), background var(--lf-dur), color var(--lf-dur);
}
.lf-input__send--ready {
  background: var(--lf-peach);
  color: var(--lf-ink);
}
.lf-input__send--ready:hover { transform: translate(-1.5px, -1.5px) rotate(-8deg); box-shadow: var(--lf-shadow-chunky); }
.lf-input__send:active { transform: translate(1px, 1px); }
.lf-input__send:disabled { cursor: not-allowed; }
</style>
