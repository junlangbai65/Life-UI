<template>
  <div class="inf-reading-canvas inf-reading-canvas--horizontal">
    <div class="inf-reading-canvas__frame">
      <div class="inf-reading-canvas__page">
        <div class="inf-reading-canvas__ambient" aria-hidden="true" />
        <div class="inf-reading-canvas__scroll inf-scrollbar" @scroll="onScroll">
          <div class="inf-reading-canvas__content">
            <div class="inf-reading-canvas__sheet" aria-hidden="true" />
            <div class="inf-reading-canvas__body">
              <slot />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const emit = defineEmits<{
  scroll: [progress: number];
}>();

function onScroll(event: Event) {
  const el = event.target as HTMLElement;
  const max = el.scrollHeight - el.clientHeight;
  const progress = max <= 0 ? 100 : Math.round((el.scrollTop / max) * 100);
  emit('scroll', progress);
}
</script>
