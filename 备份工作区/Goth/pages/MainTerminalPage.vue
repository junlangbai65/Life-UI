<template>
  <main id="goth-page-main" class="goth-terminal" aria-labelledby="goth-main-heading">
    <h1 id="goth-main-heading" class="visually-hidden">主终端·叙事与指令</h1>

    <div class="goth-terminal__body">
      <aside class="goth-terminal__sidebar goth-terminal__sidebar--rail" aria-label="调查员登记与案卷">
        <GothCoreStatsSidebar />
      </aside>

      <div class="goth-terminal__center goth-terminal__center--search-anchor">
        <div class="goth-terminal__center-head">
          <span class="goth-terminal__lane-label" aria-hidden="true">叙事终端</span>
        </div>
        <GothSearchDiscoveryBeacon />
        <div class="goth-terminal__chat-frame">
          <section class="goth-chat-section goth-terminal__chat-section" aria-label="叙事与输入">
            <div class="goth-terminal__chat-stack">
              <GothNarrativePane />
              <GothInputDock />
            </div>
          </section>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import GothCoreStatsSidebar from '../GothCoreStatsSidebar.vue';
import GothSearchDiscoveryBeacon from '../GothSearchDiscoveryBeacon.vue';
import GothInputDock from '../GothInputDock.vue';
import GothNarrativePane from '../GothNarrativePane.vue';
</script>
