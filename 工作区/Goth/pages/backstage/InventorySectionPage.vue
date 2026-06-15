<template>
  <section id="goth-section-inventory" class="goth-backstage-section goth-backstage-section--inventory" aria-labelledby="goth-inv-h">
    <BackstageSectionHeader section="inventory" :title="meta.title" :desc="meta.desc" heading-id="goth-inv-h" />
    <InventoryPanelView />
  </section>
</template>

<script setup lang="ts">
import BackstageSectionHeader from '../../backstage/BackstageSectionHeader.vue';
import { backstageNavItems } from '../../backstageNav';
import InventoryPanelView from '../../panels/InventoryPanelView.vue';

const meta = backstageNavItems.find((i) => i.section === 'inventory')!;
</script>
