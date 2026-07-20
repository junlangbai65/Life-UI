<template>
  <blockquote
    class="inf-quote-block"
    :class="`inf-quote-block--${quoteStyle}`"
    aria-label="引用"
  >
    <div class="inf-quote-block__edge" aria-hidden="true" />
    <div class="inf-quote-block__inner">
      <InfIcon name="quote-open" size="md" class="inf-quote-block__mark" aria-hidden="true" />
      <p class="inf-quote-block__text">{{ text }}</p>
    </div>
  </blockquote>
</template>

<script setup lang="ts">
import type { QuoteStyle } from '../../utils/maintextLayout';
import InfIcon from '../ui/InfIcon.vue';

defineProps<{
  text: string;
  quoteStyle: QuoteStyle;
}>();
</script>
