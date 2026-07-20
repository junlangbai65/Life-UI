<template>
  <svg
    class="inf-icon"
    :class="[`inf-icon--${name}`, sizeClass]"
    viewBox="0 0 24 24"
    aria-hidden="true"
    fill="none"
    stroke="currentColor"
    stroke-width="1.75"
    stroke-linecap="round"
    stroke-linejoin="round"
  >
    <template v-if="name === 'user'">
      <circle cx="12" cy="8" r="4" />
      <path d="M5 20c0-4 3.5-7 7-7s7 3 7 7" />
    </template>
    <template v-else-if="name === 'box'">
      <path d="M12 3 4 7v10l8 4 8-4V7l-8-4Z" />
      <path d="M4 7l8 4 8-4M12 11v10" />
    </template>
    <template v-else-if="name === 'map'">
      <path d="M9 4 3 7v13l6-3 6 3 6-3V4l-6 3-6-3Z" />
      <path d="M9 4v13M15 7v13" />
    </template>
    <template v-else-if="name === 'radar'">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 12 16 8" />
      <circle cx="12" cy="12" r="3" />
    </template>
    <template v-else-if="name === 'users'">
      <circle cx="9" cy="8" r="3" />
      <path d="M3 20c0-3 2.5-5 6-5" />
      <circle cx="17" cy="9" r="2.5" />
      <path d="M14 20c0-2.5 2-4 5-4" />
    </template>
    <template v-else-if="name === 'star'">
      <path d="m12 3 2.2 4.5 5 .7-3.6 3.5.9 5-4.5-2.4-4.5 2.4.9-5L4.8 8.2l5-.7L12 3Z" />
    </template>
    <template v-else-if="name === 'flag'">
      <path d="M5 3v18" />
      <path d="M5 4h11l-2 4 2 4H5" />
    </template>
    <template v-else-if="name === 'heart'">
      <path d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2 4 4 0 0 1 7 2c0 5.5-7 10-7 10Z" />
    </template>
    <template v-else-if="name === 'gear'">
      <circle cx="12" cy="12" r="3" />
      <path
        d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"
      />
    </template>
    <template v-else-if="name === 'book'">
      <path d="M5 4h10a3 3 0 0 1 3 3v13H8a3 3 0 0 0-3 3V4Z" />
      <path d="M8 4v17" />
    </template>
    <template v-else-if="name === 'grid'">
      <rect x="4" y="4" width="6" height="6" rx="1" />
      <rect x="14" y="4" width="6" height="6" rx="1" />
      <rect x="4" y="14" width="6" height="6" rx="1" />
      <rect x="14" y="14" width="6" height="6" rx="1" />
    </template>
    <template v-else-if="name === 'send'">
      <path d="M22 2 11 13" />
      <path d="M22 2 15 22l-4-9-9-4 20-7Z" />
    </template>
    <template v-else-if="name === 'close'">
      <path d="M6 6l12 12M18 6 6 18" />
    </template>
    <template v-else-if="name === 'check'">
      <path d="M5 12l5 5L20 7" />
    </template>
    <template v-else-if="name === 'warning'">
      <path d="M12 3 2 21h20L12 3Z" />
      <path d="M12 10v4M12 18h.01" />
    </template>
    <template v-else-if="name === 'info'">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 10v6M12 7h.01" />
    </template>
    <template v-else-if="name === 'clock'">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </template>
    <template v-else-if="name === 'location'">
      <path d="M12 21s-6-5.2-6-10a6 6 0 1 1 12 0c0 4.8-6 10-6 10Z" />
      <circle cx="12" cy="11" r="2.5" />
    </template>
    <template v-else-if="name === 'chevron-left'">
      <path d="M14 6l-6 6 6 6" />
    </template>
    <template v-else-if="name === 'chevron'">
      <path d="M9 6l6 6-6 6" />
    </template>
    <template v-else-if="name === 'forward'">
      <path d="M5 12h12M13 7l5 5-5 5" />
    </template>
    <template v-else-if="name === 'replay'">
      <path d="M3 12a9 9 0 1 0 3-6.7" />
      <path d="M3 4v5h5" />
    </template>
    <template v-else-if="name === 'narrative'">
      <path d="M6 4h12v16H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z" />
      <path d="M8 8h8M8 12h6M8 16h4" />
    </template>
    <template v-else-if="name === 'spinner'">
      <path d="M12 3a9 9 0 1 0 9 9" opacity="0.25" />
      <path d="M12 3a9 9 0 0 1 9 9" />
    </template>
    <template v-else-if="name === 'activity'">
      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
    </template>
    <template v-else-if="name === 'layers'">
      <path d="M12 2 2 7l10 5 10-5-10-5Z" />
      <path d="m2 17 10 5 10-5M2 12l10 5 10-5" />
    </template>
    <template v-else-if="name === 'shoe'">
      <path d="M4 14h16l-1.5-5.5a2 2 0 0 0-1.9-1.5H7.4a2 2 0 0 0-1.9 1.5L4 14Z" />
      <path d="M4 14v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3" />
    </template>
    <template v-else-if="name === 'flame'">
      <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1.5-3.5C8 7 8 4 12 2c4 2 4 5 2.5 6.5S13 12 13 12a2.5 2.5 0 0 0 2.5 2.5c0 2.5-2.5 4.5-5 4.5S8 17 8.5 14.5Z" />
    </template>
    <template v-else-if="name === 'sun'">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </template>
    <template v-else-if="name === 'moon'">
      <path d="M20 14.5A8.5 8.5 0 0 1 9.5 4 7 7 0 1 0 20 14.5Z" />
    </template>
    <template v-else-if="name === 'eye'">
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </template>
    <template v-else-if="name === 'eye-off'">
      <path d="M9.9 9.9A3 3 0 0 0 12 15a3 3 0 0 0 2.1-5.1" />
      <path d="M6.7 6.7C4.6 8.1 3 10.2 2 12s3.5 7 10 7c1.8 0 3.4-.5 4.8-1.2M17.3 17.3 21 21M3 3l18 18" />
    </template>
    <template v-else-if="name === 'quote-open'">
      <path d="M7.5 12.5c0-2.2 1.2-4.2 3.2-5.2L9 5C5.8 6.6 4 9.6 4 13c0 2.2 1.2 3.8 3 3.8 1.6 0 2.8-1.2 2.8-2.8 0-1.6-1.1-2.7-2.3-2.7-.3 0-.6 0-.8.2Z" fill="currentColor" stroke="none" />
      <path d="M16.5 12.5c0-2.2 1.2-4.2 3.2-5.2L18 5c-3.2 1.6-5 4.6-5 8 0 2.2 1.2 3.8 3 3.8 1.6 0 2.8-1.2 2.8-2.8 0-1.6-1.1-2.7-2.3-2.7-.3 0-.6 0-.8.2Z" fill="currentColor" stroke="none" />
    </template>
    <template v-else-if="name === 'quote-close'">
      <path d="M7.5 11.5c0 2.2 1.2 4.2 3.2 5.2L9 19c-3.2-1.6-5-4.6-5-8 0-2.2 1.2-3.8 3-3.8 1.6 0 2.8 1.2 2.8 2.8 0 1.6-1.1 2.7-2.3 2.7-.3 0-.6 0-.8-.2Z" fill="currentColor" stroke="none" />
      <path d="M16.5 11.5c0 2.2 1.2 4.2 3.2 5.2L18 19c-3.2-1.6-5-4.6-5-8 0-2.2 1.2-3.8 3-3.8 1.6 0 2.8 1.2 2.8 2.8 0 1.6-1.1 2.7-2.3 2.7-.3 0-.6 0-.8-.2Z" fill="currentColor" stroke="none" />
    </template>
  </svg>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = withDefaults(
  defineProps<{
    name: string;
    size?: 'sm' | 'md' | 'lg';
  }>(),
  { size: 'md' },
);

const sizeClass = computed(() => `inf-icon--size-${props.size}`);
</script>

<style scoped lang="scss">
.inf-icon {
  display: block;
  flex-shrink: 0;
}

.inf-icon--size-sm {
  width: 14px;
  height: 14px;
}

.inf-icon--size-md {
  width: 18px;
  height: 18px;
}

.inf-icon--size-lg {
  width: 22px;
  height: 22px;
}
</style>
