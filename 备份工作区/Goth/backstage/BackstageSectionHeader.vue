<template>
  <header class="goth-backstage-section__header">
    <span class="goth-backstage-section__icon-wrap" aria-hidden="true">
      <BackstageSectionIcon :section="section" />
    </span>
    <div class="goth-backstage-section__headlines">
      <h2 :id="headingId" class="goth-backstage-section__title">{{ title }}</h2>
      <p class="goth-backstage-section__desc">{{ desc }}</p>
    </div>
  </header>
</template>

<script setup lang="ts">
import type { BackstageSectionKey } from '../goth.types';
import BackstageSectionIcon from './BackstageSectionIcon.vue';

defineProps<{
  section: BackstageSectionKey;
  title: string;
  desc: string;
  headingId: string;
}>();
</script>
