<template>
  <nav class="lf-nav" aria-label="主导航">
    <RouterLink
      v-for="item in navItems"
      :id="`lf-nav-${item.name}`"
      :key="item.name"
      :to="item.path"
      class="lf-nav__item"
      :class="{ 'lf-nav__item--active': route.name === item.name }"
      :aria-label="`${item.label}（快捷键 ${item.key}）`"
    >
      <span class="lf-nav__icon">
        <AppIcon :name="item.icon" size="md" :bold="route.name === item.name" />
      </span>
      <span class="lf-nav__label">{{ item.label }}</span>
      <span v-if="route.name === item.name" class="lf-nav__dot" aria-hidden="true" />
    </RouterLink>
  </nav>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';
import AppIcon from '../base/AppIcon.vue';
import { navItems } from '../../router';

const route = useRoute();
</script>

<style scoped lang="scss">
.lf-nav {
  display: flex;
  align-items: stretch;
  gap: 4px;
  padding: 8px 8px calc(8px + env(safe-area-inset-bottom, 0px));
  background: var(--lf-surface);
  border-top: 2.5px solid var(--lf-ink);
  z-index: 2;
}
.lf-nav__item {
  position: relative;
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
  padding: 6px 2px;
  border-radius: var(--lf-radius-md);
  color: var(--lf-text-secondary);
  text-decoration: none;
  transition: color var(--lf-dur) var(--lf-ease-soft), transform var(--lf-dur) var(--lf-ease-bounce);
}
.lf-nav__item:hover {
  color: var(--lf-text);
  transform: translateY(-2px);
}
.lf-nav__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 32px;
  border-radius: var(--lf-radius-pill);
  transition: background var(--lf-dur) var(--lf-ease-soft);
}
.lf-nav__label {
  font-family: var(--lf-font-display);
  font-size: 11px;
  font-weight: 600;
}
.lf-nav__item--active {
  color: var(--lf-ink);
}
.lf-nav__item--active .lf-nav__icon {
  background: var(--lf-strawberry);
  border: 2.5px solid var(--lf-ink);
  box-shadow: var(--lf-shadow-chunky-sm);
}
.lf-nav__dot {
  position: absolute;
  top: 2px;
  right: calc(50% - 18px);
  width: 7px;
  height: 7px;
  background: var(--lf-peach);
  border: 1.5px solid var(--lf-ink);
  border-radius: var(--lf-radius-pill);
}
</style>
