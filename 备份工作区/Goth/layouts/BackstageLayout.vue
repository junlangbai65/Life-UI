<template>
  <div id="goth-backstage" class="goth-backstage" :data-active-section="activeSection">
    <button
      id="goth-backstage-nav-toggle"
      type="button"
      class="goth-backstage__nav-toggle goth-btn-ghost"
      :aria-expanded="navOpen"
      aria-controls="goth-backstage-nav"
      @click="navOpen = !navOpen"
    >
      {{ navOpen ? '收起分区菜单' : '展开分区菜单' }}
    </button>

    <nav
      id="goth-backstage-nav"
      class="goth-backstage__nav"
      :class="{ 'is-open': navOpen }"
      aria-label="档案后台分区"
    >
      <RouterLink
        v-for="item in backstageNavItems"
        :key="item.section"
        :to="`/backstage/${item.section}`"
        class="goth-backstage__link"
        active-class="is-active"
        :data-section="item.section"
        @click="closeNavOnNavigate"
      >
        <span class="goth-backstage__link-icon" aria-hidden="true">
          <BackstageSectionIcon :section="item.section" />
        </span>
        <span class="goth-backstage__link-text">
          <strong>{{ item.title }}</strong>
          <small>{{ item.desc }}</small>
        </span>
      </RouterLink>
    </nav>

    <div id="goth-backstage-content" class="goth-backstage__content">
      <RouterView v-slot="{ Component }">
        <Transition name="goth-page" mode="out-in">
          <component :is="Component" />
        </Transition>
      </RouterView>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { RouterLink, RouterView, useRoute } from 'vue-router';
import BackstageSectionIcon from '../backstage/BackstageSectionIcon.vue';
import { backstageNavItems } from '../backstageNav';
import type { BackstageSectionKey } from '../goth.types';

const route = useRoute();
const navOpen = ref(false);

const activeSection = computed<BackstageSectionKey>(() => {
  const s = route.params.section;
  const valid: BackstageSectionKey[] = [
    'attributes',
    'skills',
    'physiology',
    'status',
    'inventory',
    'case',
    'map',
    'relation',
  ];
  if (typeof s === 'string' && valid.includes(s as BackstageSectionKey)) return s as BackstageSectionKey;
  return 'attributes';
});

function closeNavOnNavigate() {
  if (typeof window !== 'undefined' && window.matchMedia('(max-width: 900px)').matches) {
    navOpen.value = false;
  }
}

watch(
  () => route.fullPath,
  () => {
    closeNavOnNavigate();
  },
);
</script>

<style scoped>
.goth-backstage__nav-toggle {
  display: none;
  width: 100%;
  margin-bottom: 0.45rem;
}

@media (max-width: 900px) {
  .goth-backstage__nav-toggle {
    display: inline-flex;
    justify-content: center;
  }

  .goth-backstage__nav:not(.is-open) {
    display: none;
  }

  .goth-backstage__nav.is-open {
    display: flex;
  }
}
</style>
