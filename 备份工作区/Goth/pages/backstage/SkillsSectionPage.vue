<template>
  <section class="goth-backstage-section goth-backstage-section--skills" aria-labelledby="goth-h-skills">
    <BackstageSectionHeader section="skills" :title="meta.title" :desc="meta.desc" heading-id="goth-h-skills" />
    <CharacterSkillsSection />
  </section>
</template>

<script setup lang="ts">
import BackstageSectionHeader from '../../backstage/BackstageSectionHeader.vue';
import { backstageNavItems } from '../../backstageNav';
import CharacterSkillsSection from '../../panels/character/CharacterSkillsSection.vue';

const meta = backstageNavItems.find((i) => i.section === 'skills')!;
</script>
