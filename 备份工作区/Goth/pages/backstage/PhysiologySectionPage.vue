<template>
  <section class="goth-backstage-section goth-backstage-section--physiology" aria-labelledby="goth-h-physiology">
    <BackstageSectionHeader section="physiology" :title="meta.title" :desc="meta.desc" heading-id="goth-h-physiology" />
    <CharacterPhysiologySection />
  </section>
</template>

<script setup lang="ts">
import BackstageSectionHeader from '../../backstage/BackstageSectionHeader.vue';
import { backstageNavItems } from '../../backstageNav';
import CharacterPhysiologySection from '../../panels/character/CharacterPhysiologySection.vue';

const meta = backstageNavItems.find((i) => i.section === 'physiology')!;
</script>
