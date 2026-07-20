<template>
  <div class="goth-input-dock">
    <details v-if="chatMessages.length > 0" id="goth-local-chat-details" class="goth-local-details">
      <summary>本地指令记录（iframe 内 generate 调试）</summary>
      <div id="goth-chat-log" ref="logEl" class="goth-chat-log" role="log" aria-live="polite">
        <article
          v-for="m in chatMessages"
          :id="`goth-chat-msg-${m.id}`"
          :key="m.id"
          class="goth-chat-bubble"
          :class="bubbleClass(m.role)"
        >
          <div class="goth-chat-meta">{{ roleLabel(m.role) }} · {{ formatTime(m.createdAt) }}</div>
          <div class="goth-chat-body">{{ m.content }}</div>
        </article>
      </div>
    </details>

    <div class="goth-chat-input-row">
      <label class="visually-hidden" for="goth-chat-input">输入调查指令或对白</label>
      <textarea
        id="goth-chat-input"
        v-model="draftInput"
        rows="2"
        placeholder="输入调查指令、对白或向叙事提出的追问……"
        :disabled="isGenerating"
        @keydown.enter.exact.prevent="onEnterSend"
      />
      <button
        id="goth-chat-send"
        type="button"
        class="goth-btn-primary goth-dock-send"
        :disabled="isGenerating || !draftInput.trim()"
        @click="submitMessage"
      >
        发送
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ChatRole } from './goth.types';
import { inject, nextTick, ref, watch } from 'vue';
import { gothStateKey } from './gothStateContext';

const state = inject(gothStateKey);
if (!state) throw new Error('未找到 Goth 状态上下文。');

const { draftInput, isGenerating, chatMessages, submitMessage } = state;

const logEl = ref<HTMLElement | null>(null);

function bubbleClass(role: ChatRole) {
  if (role === 'user') return 'goth-chat-bubble--user';
  if (role === 'system') return 'goth-chat-bubble--system';
  return 'goth-chat-bubble--assistant';
}

function roleLabel(role: ChatRole) {
  if (role === 'user') return '调查员';
  if (role === 'system') return '系统';
  return '叙事';
}

function formatTime(ts: number) {
  try {
    return new Date(ts).toLocaleString('zh-CN', { hour12: false });
  } catch {
    return '';
  }
}

function onEnterSend() {
  void submitMessage();
}

watch(
  () => chatMessages.value.length,
  async () => {
    await nextTick();
    logEl.value?.scrollTo({ top: logEl.value.scrollHeight, behavior: 'smooth' });
  },
);
</script>

<style scoped>
.goth-input-dock {
  flex-shrink: 0;
}

.goth-chat-body {
  white-space: pre-wrap;
}

.goth-local-details {
  padding: 0.35rem 0.75rem;
  font-size: 0.78rem;
  color: var(--g-text-muted);
}

.goth-local-details summary {
  cursor: pointer;
  color: var(--g-text-accent);
}
</style>
