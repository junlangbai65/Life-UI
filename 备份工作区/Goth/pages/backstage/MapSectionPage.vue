<template>
  <section id="goth-section-map" class="goth-backstage-section goth-backstage-section--map" aria-labelledby="goth-map-h">
    <BackstageSectionHeader section="map" :title="meta.title" :desc="meta.desc" heading-id="goth-map-h" />
    <MapPanelView />
  </section>
</template>

<script setup lang="ts">
import BackstageSectionHeader from '../../backstage/BackstageSectionHeader.vue';
import { backstageNavItems } from '../../backstageNav';
import MapPanelView from '../../panels/MapPanelView.vue';

const meta = backstageNavItems.find((i) => i.section === 'map')!;
</script>
