<template>
  <section id="goth-section-relation" class="goth-backstage-section goth-backstage-section--relation" aria-labelledby="goth-rel-h">
    <BackstageSectionHeader section="relation" :title="meta.title" :desc="meta.desc" heading-id="goth-rel-h" />
    <RelationPanelView />
  </section>
</template>

<script setup lang="ts">
import BackstageSectionHeader from '../../backstage/BackstageSectionHeader.vue';
import { backstageNavItems } from '../../backstageNav';
import RelationPanelView from '../../panels/RelationPanelView.vue';

const meta = backstageNavItems.find((i) => i.section === 'relation')!;
</script>
