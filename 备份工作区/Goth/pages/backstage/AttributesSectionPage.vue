<template>
  <section class="goth-backstage-section goth-backstage-section--attributes" aria-labelledby="goth-h-attrs">
    <BackstageSectionHeader section="attributes" :title="meta.title" :desc="meta.desc" heading-id="goth-h-attrs" />
    <CharacterAttributesSection />
  </section>
</template>

<script setup lang="ts">
import BackstageSectionHeader from '../../backstage/BackstageSectionHeader.vue';
import { backstageNavItems } from '../../backstageNav';
import CharacterAttributesSection from '../../panels/character/CharacterAttributesSection.vue';

const meta = backstageNavItems.find((i) => i.section === 'attributes')!;
</script>
