<template>
  <article id="wife-cohab-status-panel" class="status-panel" aria-label="同居状态">
    <div v-if="!ready" class="status-fixed">
      <div class="skeleton-pulse" style="height: 36px; margin-bottom: 8px" />
      <div class="skeleton-grid">
        <div class="skeleton-pulse" style="height: 88px" />
        <div class="skeleton-pulse" style="height: 88px" />
      </div>
      <div class="skeleton-pulse" style="height: 52px; margin-bottom: 8px" />
    </div>
    <template v-else>
      <div class="status-fixed">
        <StatusHeader />
        <EndgameBanner />
        <div class="status-hero-grid">
          <SceneHero />
          <AffectionHero />
        </div>
        <WalletRow />
      </div>
      <div class="status-scroll">
        <AccordionSection section-id="relationship" title="关系" icon="heart">
          <MilestoneTimeline />
        </AccordionSection>
        <AccordionSection section-id="risk" title="风险" icon="alert-triangle">
          <RiskPanel />
        </AccordionSection>
        <AccordionSection section-id="intimate" title="私密" icon="lock">
          <IntimatePanel />
        </AccordionSection>
      </div>
    </template>
  </article>
</template>

<script setup lang="ts">
import AccordionSection from './components/AccordionSection.vue';
import AffectionHero from './components/AffectionHero.vue';
import EndgameBanner from './components/EndgameBanner.vue';
import IntimatePanel from './components/IntimatePanel.vue';
import MilestoneTimeline from './components/MilestoneTimeline.vue';
import RiskPanel from './components/RiskPanel.vue';
import SceneHero from './components/SceneHero.vue';
import StatusHeader from './components/StatusHeader.vue';
import WalletRow from './components/WalletRow.vue';
import { useMvuSlices } from './composables/useMvuSlices';
import { useThemeStore } from './stores/themeStore';

useThemeStore();
const { ready } = useMvuSlices();
</script>
