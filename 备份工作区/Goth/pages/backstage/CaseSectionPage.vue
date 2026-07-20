<template>
  <section id="goth-section-case" class="goth-backstage-section goth-backstage-section--case" aria-labelledby="goth-case-h">
    <BackstageSectionHeader section="case" :title="meta.title" :desc="meta.desc" heading-id="goth-case-h" />
    <CasePanelView />
  </section>
</template>

<script setup lang="ts">
import BackstageSectionHeader from '../../backstage/BackstageSectionHeader.vue';
import { backstageNavItems } from '../../backstageNav';
import CasePanelView from '../../panels/CasePanelView.vue';

const meta = backstageNavItems.find((i) => i.section === 'case')!;
</script>
