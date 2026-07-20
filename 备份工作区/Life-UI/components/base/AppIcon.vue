<template>
  <svg
    class="lf-icon"
    :class="`lf-icon--${size}`"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    :stroke-width="strokeWidth"
    stroke-linecap="round"
    stroke-linejoin="round"
    role="img"
    :aria-label="label"
    :aria-hidden="label ? undefined : 'true'"
  >
    <template v-if="name === 'home'">
      <path d="M4 11 12 4l8 7" />
      <path d="M6 10v9h12v-9" />
      <path d="M10 19v-5h4v5" />
    </template>
    <template v-else-if="name === 'chat'">
      <path d="M5 5h14a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H9l-4 3v-3a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z" />
      <path d="M8 10h8M8 13h5" />
    </template>
    <template v-else-if="name === 'map'">
      <path d="M9 4 4 6v14l5-2 6 2 5-2V4l-5 2-6-2Z" />
      <path d="M9 4v14M15 6v14" />
    </template>
    <template v-else-if="name === 'timeline'">
      <path d="M6 4v16" />
      <circle cx="6" cy="8" r="2" />
      <circle cx="6" cy="16" r="2" />
      <path d="M10 8h9M10 16h6" />
    </template>
    <template v-else-if="name === 'review'">
      <path d="M5 4h14v16l-7-3-7 3V4Z" />
      <path d="M9 9h6M9 12h4" />
    </template>
    <template v-else-if="name === 'save'">
      <path d="M5 4h11l3 3v13H5V4Z" />
      <path d="M8 4v5h7V4M8 20v-6h8v6" />
    </template>
    <template v-else-if="name === 'gear'">
      <circle cx="12" cy="12" r="3.2" />
      <path
        d="M12 3v2.2M12 18.8V21M5.2 5.2l1.6 1.6M17.2 17.2l1.6 1.6M3 12h2.2M18.8 12H21M5.2 18.8l1.6-1.6M17.2 6.8l1.6-1.6"
      />
    </template>
    <template v-else-if="name === 'close'">
      <path d="M6 6l12 12M18 6 6 18" />
    </template>
    <template v-else-if="name === 'check'">
      <path d="M5 12.5l4.5 4.5L19 7" />
    </template>
    <template v-else-if="name === 'send'">
      <path d="M4 12 20 5l-4 15-4-6-8-2Z" />
      <path d="m12 14 4-5" />
    </template>
    <template v-else-if="name === 'chevron-left'">
      <path d="M14 6l-6 6 6 6" />
    </template>
    <template v-else-if="name === 'chevron-right'">
      <path d="M10 6l6 6-6 6" />
    </template>
    <template v-else-if="name === 'chevron-down'">
      <path d="M6 10l6 6 6-6" />
    </template>
    <template v-else-if="name === 'heart'">
      <path d="M12 20s-7-4.6-7-10a3.8 3.8 0 0 1 7-2 3.8 3.8 0 0 1 7 2c0 5.4-7 10-7 10Z" />
    </template>
    <template v-else-if="name === 'star'">
      <path d="m12 3 2.3 4.7 5.2.8-3.8 3.6.9 5.1-4.6-2.4-4.6 2.4.9-5.1L4.5 8.5l5.2-.8L12 3Z" />
    </template>
    <template v-else-if="name === 'coffee'">
      <path d="M5 8h12v5a5 5 0 0 1-5 5H10a5 5 0 0 1-5-5V8Z" />
      <path d="M17 9h2a2 2 0 0 1 0 5h-2" />
      <path d="M8 3c-.6.8-.6 1.6 0 2.4M12 3c-.6.8-.6 1.6 0 2.4" />
    </template>
    <template v-else-if="name === 'coin'">
      <circle cx="12" cy="12" r="8" />
      <circle cx="12" cy="12" r="4.5" />
      <path d="M12 9v6" />
    </template>
    <template v-else-if="name === 'spark'">
      <path d="M12 3v4M12 17v4M3 12h4M17 12h4" />
      <path d="M12 8.5 13.4 11l2.6 1-2.6 1L12 15.5 10.6 13 8 12l2.6-1L12 8.5Z" />
    </template>
    <template v-else-if="name === 'mood'">
      <circle cx="12" cy="12" r="8.5" />
      <path d="M8.5 10h.01M15.5 10h.01" />
      <path d="M8.5 14.5c1 1.2 2.2 1.8 3.5 1.8s2.5-.6 3.5-1.8" />
    </template>
    <template v-else-if="name === 'energy'">
      <path d="M13 3 5 13h6l-1 8 8-10h-6l1-8Z" />
    </template>
    <template v-else-if="name === 'people'">
      <circle cx="9" cy="8" r="3" />
      <path d="M3.5 19c0-3.2 2.6-5.2 5.5-5.2s5.5 2 5.5 5.2" />
      <circle cx="17" cy="9" r="2.4" />
      <path d="M15 13.6c3 .2 5 2.2 5 5.4" />
    </template>
    <template v-else-if="name === 'sun'">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2.4M12 19.6V22M4.2 4.2l1.7 1.7M18.1 18.1l1.7 1.7M2 12h2.4M19.6 12H22M4.2 19.8l1.7-1.7M18.1 5.9l1.7-1.7" />
    </template>
    <template v-else-if="name === 'moon'">
      <path d="M20 14.5A8.5 8.5 0 0 1 9.5 4 7 7 0 1 0 20 14.5Z" />
    </template>
    <template v-else-if="name === 'cloud'">
      <path d="M7 18a4 4 0 0 1-.4-8A5 5 0 0 1 16 9.2 3.6 3.6 0 0 1 18 18H7Z" />
    </template>
    <template v-else-if="name === 'rain'">
      <path d="M7 15a4 4 0 0 1-.4-8A5 5 0 0 1 16 6.2 3.6 3.6 0 0 1 18 15H7Z" />
      <path d="M8 18l-1 2M12 18l-1 2M16 18l-1 2" />
    </template>
    <template v-else-if="name === 'leaf'">
      <path d="M5 19C4 12 9 5 19 5c0 10-7 15-14 14Z" />
      <path d="M5 19c3-5 6-8 11-10" />
    </template>
    <template v-else-if="name === 'clock'">
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7v5.2l3.2 2" />
    </template>
    <template v-else-if="name === 'location'">
      <path d="M12 21s-6-5.2-6-10a6 6 0 1 1 12 0c0 4.8-6 10-6 10Z" />
      <circle cx="12" cy="11" r="2.4" />
    </template>
    <template v-else-if="name === 'info'">
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 11v5M12 8h.01" />
    </template>
    <template v-else-if="name === 'warning'">
      <path d="M12 4 2.5 20h19L12 4Z" />
      <path d="M12 10v4.5M12 18h.01" />
    </template>
    <template v-else-if="name === 'error'">
      <circle cx="12" cy="12" r="8.5" />
      <path d="M9 9l6 6M15 9l-6 6" />
    </template>
    <template v-else-if="name === 'plus'">
      <path d="M12 5v14M5 12h14" />
    </template>
    <template v-else-if="name === 'minus'">
      <path d="M5 12h14" />
    </template>
    <template v-else-if="name === 'edit'">
      <path d="M5 19h14" />
      <path d="M14 5l4 4-9 9H5v-4l9-9Z" />
    </template>
    <template v-else-if="name === 'trash'">
      <path d="M5 7h14M9 7V5h6v2M7 7l1 13h8l1-13" />
      <path d="M10 11v6M14 11v6" />
    </template>
    <template v-else-if="name === 'eye'">
      <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z" />
      <circle cx="12" cy="12" r="3" />
    </template>
    <template v-else-if="name === 'sparkle'">
      <path d="M12 3c.4 4.6 1.4 5.6 6 6-4.6.4-5.6 1.4-6 6-.4-4.6-1.4-5.6-6-6 4.6-.4 5.6-1.4 6-6Z" />
      <path d="M18.5 13c.2 1.8.6 2.2 2.4 2.4-1.8.2-2.2.6-2.4 2.4-.2-1.8-.6-2.2-2.4-2.4 1.8-.2 2.2-.6 2.4-2.4Z" />
    </template>
    <template v-else-if="name === 'bell'">
      <path d="M6 16V11a6 6 0 0 1 12 0v5l2 2H4l2-2Z" />
      <path d="M10 20a2 2 0 0 0 4 0" />
    </template>
    <template v-else-if="name === 'book'">
      <path d="M5 4h9a3 3 0 0 1 3 3v13H8a3 3 0 0 0-3 3V4Z" />
      <path d="M5 4v19M9 9h4" />
    </template>
    <template v-else-if="name === 'flag'">
      <path d="M6 3v18" />
      <path d="M6 4h11l-2.2 4L17 12H6" />
    </template>
    <template v-else-if="name === 'lock'">
      <rect x="5" y="11" width="14" height="9" rx="2.5" />
      <path d="M8 11V8a4 4 0 0 1 8 0v3" />
      <path d="M12 15v2" />
    </template>
    <template v-else-if="name === 'music'">
      <path d="M9 18V6l10-2v12" />
      <circle cx="6.5" cy="18" r="2.5" />
      <circle cx="16.5" cy="16" r="2.5" />
    </template>
    <template v-else-if="name === 'camera'">
      <path d="M4 8h3l1.5-2h7L17 8h3v11H4V8Z" />
      <circle cx="12" cy="13" r="3.2" />
    </template>
    <template v-else-if="name === 'tree'">
      <path d="M12 3 6 11h3l-4 6h6v4h2v-4h6l-4-6h3L12 3Z" />
    </template>
    <template v-else-if="name === 'history'">
      <path d="M3.5 12a8.5 8.5 0 1 0 2.6-6.1" />
      <path d="M3.5 4v4h4" />
      <path d="M12 8v4.3l3 1.7" />
    </template>
    <template v-else-if="name === 'branch'">
      <circle cx="7" cy="5" r="2.4" />
      <circle cx="7" cy="19" r="2.4" />
      <circle cx="17" cy="9" r="2.4" />
      <path d="M7 7.4v9.2M7 12h4a3 3 0 0 0 3-3" />
    </template>
    <template v-else-if="name === 'menu'">
      <path d="M4 7h16M4 12h16M4 17h16" />
    </template>
    <template v-else-if="name === 'grid'">
      <rect x="4" y="4" width="7" height="7" rx="1.6" />
      <rect x="13" y="4" width="7" height="7" rx="1.6" />
      <rect x="4" y="13" width="7" height="7" rx="1.6" />
      <rect x="13" y="13" width="7" height="7" rx="1.6" />
    </template>
    <template v-else-if="name === 'play'">
      <path d="M7 5l12 7-12 7V5Z" />
    </template>
    <template v-else-if="name === 'gift'">
      <rect x="4" y="9" width="16" height="11" rx="2" />
      <path d="M4 13h16M12 9v11" />
      <path d="M12 9C9 9 7 8 7 6.5S9 4 12 6c3-2 5-1 5 .5S15 9 12 9Z" />
    </template>
    <template v-else>
      <circle cx="12" cy="12" r="8.5" />
    </template>
  </svg>
</template>

<script setup lang="ts">
import { computed } from 'vue';

export type IconName =
  | 'home' | 'chat' | 'map' | 'timeline' | 'review' | 'save' | 'gear'
  | 'close' | 'check' | 'send' | 'chevron-left' | 'chevron-right' | 'chevron-down'
  | 'heart' | 'star' | 'coffee' | 'coin' | 'spark' | 'mood' | 'energy' | 'people'
  | 'sun' | 'moon' | 'cloud' | 'rain' | 'leaf' | 'clock' | 'location'
  | 'info' | 'warning' | 'error' | 'plus' | 'minus' | 'edit' | 'trash' | 'eye'
  | 'sparkle' | 'bell' | 'book' | 'flag' | 'lock' | 'music' | 'camera' | 'tree'
  | 'history' | 'branch' | 'menu' | 'play' | 'gift' | 'grid';

const props = withDefaults(
  defineProps<{
    name: IconName;
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
    bold?: boolean;
    label?: string;
  }>(),
  { size: 'md', bold: false },
);

const strokeWidth = computed(() => (props.bold ? 2.4 : 2));
</script>

<style scoped lang="scss">
.lf-icon {
  display: block;
  flex-shrink: 0;
}
.lf-icon--xs { width: 14px; height: 14px; }
.lf-icon--sm { width: 18px; height: 18px; }
.lf-icon--md { width: 22px; height: 22px; }
.lf-icon--lg { width: 28px; height: 28px; }
.lf-icon--xl { width: 36px; height: 36px; }
</style>
