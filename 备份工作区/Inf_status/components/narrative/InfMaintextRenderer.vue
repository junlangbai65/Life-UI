<template>
  <div
    id="inf-maintext-content"
    class="inf-maintext-renderer inf-body inf-body--narrative"
    role="article"
    :aria-busy="showCaret"
  >
    <template v-for="(block, index) in blocks" :key="index">
      <p v-if="block.kind === 'prose'" class="inf-prose-block">
        <span
          v-if="showDropCap && index === firstProseIndex && dropCap"
          class="inf-prose-block__dropcap"
          aria-hidden="true"
        >{{ dropCap }}</span>{{ proseBody(block, index) }}<span
          v-if="showCaret && index === lastBlockIndex"
          class="inf-reading-caret"
          aria-hidden="true"
        />
      </p>
      <div v-else class="inf-quote-block-wrap">
        <InfQuoteBlock :text="block.text" :quote-style="block.style" />
        <span v-if="showCaret && index === lastBlockIndex" class="inf-reading-caret" aria-hidden="true" />
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { MaintextBlock } from '../../utils/maintextLayout';
import InfQuoteBlock from './InfQuoteBlock.vue';

const props = defineProps<{
  blocks: MaintextBlock[];
  showDropCap: boolean;
  showCaret: boolean;
}>();

const firstProseIndex = computed(() => props.blocks.findIndex(block => block.kind === 'prose'));

const lastBlockIndex = computed(() => Math.max(0, props.blocks.length - 1));

const dropCap = computed(() => {
  const first = props.blocks[firstProseIndex.value];
  if (!first || first.kind !== 'prose') return '';
  const trimmed = first.text.trim();
  if (!trimmed) return '';
  const char = trimmed.charAt(0);
  return /[\p{L}\p{N}]/u.test(char) ? char : '';
});

function proseBody(block: Extract<MaintextBlock, { kind: 'prose' }>, index: number): string {
  if (!props.showDropCap || index !== firstProseIndex.value || !dropCap.value) {
    return block.text;
  }
  const trimmed = block.text.trimStart();
  return trimmed.slice(1);
}
</script>

<style scoped lang="scss">
.inf-maintext-renderer {
  width: 100%;
}

.inf-quote-block-wrap {
  position: relative;
}

.inf-quote-block-wrap .inf-reading-caret {
  display: block;
  width: 2px;
  height: calc(var(--inf-reading-line-step) * 0.72);
  margin-top: calc(var(--inf-reading-line-step) * -0.42);
  margin-left: var(--inf-reading-text-pad-x, 0.5rem);
}
</style>
