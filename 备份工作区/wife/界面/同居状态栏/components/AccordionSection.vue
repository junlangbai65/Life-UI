<template>
  <section class="ios-group" :aria-labelledby="titleId">
    <button
      :id="triggerId"
      type="button"
      class="ios-accordion-trigger"
      :aria-expanded="open"
      :aria-controls="bodyId"
      @click="ui.toggleSection(sectionId)"
    >
      <span class="ios-accordion-trigger__title">
        <Icon :name="icon" size="md" />
        <span :id="titleId">{{ title }}</span>
      </span>
      <svg
        class="ios-accordion-chevron"
        :class="{ 'ios-accordion-chevron--open': open }"
        viewBox="0 0 12 12"
        aria-hidden="true"
      >
        <path d="M4 2l4 4-4 4" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
      </svg>
    </button>
    <Transition name="accordion">
      <div v-if="open" :id="bodyId" class="ios-accordion-body" role="region" :aria-labelledby="triggerId">
        <slot />
      </div>
    </Transition>
  </section>
</template>

<script setup lang="ts">
import { Icon, type IconName } from './icons';
import { useUiStore } from '../stores/uiStore';

const props = defineProps<{
  sectionId: string;
  title: string;
  icon: IconName;
}>();

const ui = useUiStore();

const open = computed(() => ui.isOpen(props.sectionId));
const triggerId = computed(() => `wife-status-accordion-${props.sectionId}`);
const bodyId = computed(() => `wife-status-accordion-body-${props.sectionId}`);
const titleId = computed(() => `wife-status-accordion-title-${props.sectionId}`);
</script>
