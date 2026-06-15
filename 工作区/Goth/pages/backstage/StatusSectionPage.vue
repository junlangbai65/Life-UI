<template>
  <section class="goth-backstage-section goth-backstage-section--status" aria-labelledby="goth-h-status">
    <BackstageSectionHeader section="status" :title="meta.title" :desc="meta.desc" heading-id="goth-h-status" />
    <CharacterStatusSection />
  </section>
</template>

<script setup lang="ts">
import BackstageSectionHeader from '../../backstage/BackstageSectionHeader.vue';
import { backstageNavItems } from '../../backstageNav';
import CharacterStatusSection from '../../panels/character/CharacterStatusSection.vue';

const meta = backstageNavItems.find((i) => i.section === 'status')!;
</script>
