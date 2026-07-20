<template>
  <section id="inf-input-dock" class="inf-input-dock" aria-label="指令输入">
    <div
      class="inf-input-dock__field"
      :class="{ 'is-focused': focused, 'is-filled': ui.composeText.length > 0, 'is-disabled': ui.isGenerating }"
    >
      <label id="inf-compose-label" class="inf-input-dock__label inf-section-label" for="inf-compose-textarea">
        Command Input
      </label>
      <textarea
        id="inf-compose-textarea"
        v-model="ui.composeText"
        class="inf-input-dock__textarea inf-scrollbar"
        rows="2"
        aria-labelledby="inf-compose-label"
        :disabled="ui.isGenerating"
        @focus="focused = true"
        @blur="focused = false"
      />
    </div>

    <div class="inf-input-dock__actions">
      <button
        id="inf-btn-clear-compose"
        type="button"
        class="inf-btn inf-btn--ghost"
        :disabled="ui.isGenerating || !ui.composeText"
        @click="clearCompose"
      >
        清空
      </button>
      <button
        id="inf-btn-send-narrative"
        type="button"
        class="inf-btn inf-btn--primary inf-input-dock__send"
        :class="{ 'is-busy': ui.isGenerating }"
        :disabled="ui.isGenerating || !ui.composeText.trim()"
        @click="send"
      >
        <InfIcon :name="ui.isGenerating ? 'spinner' : 'send'" size="sm" />
        {{ ui.isGenerating ? '传输中…' : '发送指令' }}
      </button>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useUiStore } from '../../stores/useUiStore';
import InfIcon from '../ui/InfIcon.vue';

const ui = useUiStore();
const focused = ref(false);

function clearCompose() {
  ui.composeText = '';
}

function send() {
  if (!ui.composeText.trim()) return;
  ui.simulateGenerate();
}
</script>

<style scoped lang="scss">
.inf-input-dock {
  display: flex;
  flex-direction: column;
  min-height: 0;
  width: 100%;
  overflow: hidden;
}

.inf-input-dock__field {
  position: relative;
  border-radius: var(--inf-radius-md);
  background: var(--inf-bg-elevated);
  border: 1px solid var(--inf-border);
  transition:
    border-color var(--inf-transition),
    box-shadow var(--inf-transition),
    background var(--inf-transition);

  &.is-focused {
    border-color: color-mix(in srgb, var(--inf-accent) 45%, var(--inf-border));
    box-shadow: 0 0 0 3px var(--inf-accent-soft), var(--inf-shadow-sm);
  }

  &.is-filled:not(.is-focused) {
    border-color: var(--inf-border-strong);
  }

  &.is-disabled {
    opacity: 0.65;
  }
}

.inf-input-dock__label {
  position: absolute;
  top: 0.55rem;
  left: 0.85rem;
  pointer-events: none;
  transition:
    transform var(--inf-transition),
    color var(--inf-transition),
    font-size var(--inf-transition);
}

.inf-input-dock__field.is-focused .inf-input-dock__label,
.inf-input-dock__field.is-filled .inf-input-dock__label {
  transform: translateY(-0.35rem) scale(0.88);
  color: var(--inf-accent);
}

.inf-input-dock__textarea {
  width: 100%;
  padding: 1.35rem 0.85rem 0.65rem;
  font-family: var(--inf-font-ui);
  font-size: 0.9rem;
  line-height: 1.58;
  color: var(--inf-text);
  background: transparent;
  border: none;
  border-radius: inherit;
  resize: none;
  min-height: 64px;

  &:focus {
    outline: none;
  }

  &:disabled {
    cursor: not-allowed;
  }
}

.inf-input-dock__actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  margin-top: 0.625rem;
}

.inf-input-dock__send.is-busy {
  pointer-events: none;

  :deep(svg) {
    animation: inf-spin 0.8s linear infinite;
  }
}

@keyframes inf-spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
