<template>
  <svg
    class="goth-backstage-icon"
    :class="`goth-backstage-icon--${section}`"
    viewBox="0 0 40 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <!-- attributes: shield crest -->
    <g v-if="section === 'attributes'">
      <path
        d="M20 4l12 6v10c0 7-5 13-12 16-7-3-12-9-12-16V10l12-6z"
        stroke="currentColor"
        stroke-width="1.35"
        stroke-linejoin="round"
      />
      <path d="M20 11v12M15 17h10" stroke="currentColor" stroke-width="1.1" stroke-linecap="round" />
    </g>
    <!-- skills: ribbon medal -->
    <g v-else-if="section === 'skills'">
      <path d="M8 8h24v6l-8 10-4-6-4 6-8-10V8z" stroke="currentColor" stroke-width="1.25" stroke-linejoin="round" />
      <circle cx="20" cy="11" r="3" stroke="currentColor" stroke-width="1.1" />
    </g>
    <!-- physiology: stethoscope hint -->
    <g v-else-if="section === 'physiology'">
      <path
        d="M10 14c0-4 3.5-7 8-7s8 3 8 7v6c0 2-1.5 3.5-3.5 3.5S19 28 19 30"
        stroke="currentColor"
        stroke-width="1.35"
        stroke-linecap="round"
      />
      <circle cx="25" cy="29" r="4" stroke="currentColor" stroke-width="1.25" />
      <path d="M12 22h6" stroke="currentColor" stroke-width="1.1" stroke-linecap="round" />
    </g>
    <!-- status: wax seal -->
    <g v-else-if="section === 'status'">
      <circle cx="20" cy="18" r="10" stroke="currentColor" stroke-width="1.25" />
      <path d="M14 28h12l-2 6H16l-2-6z" stroke="currentColor" stroke-width="1.15" stroke-linejoin="round" />
      <path d="M20 13v6M17 16h6" stroke="currentColor" stroke-width="1" stroke-linecap="round" />
    </g>
    <!-- inventory: trunk -->
    <g v-else-if="section === 'inventory'">
      <rect x="8" y="14" width="24" height="18" rx="2" stroke="currentColor" stroke-width="1.25" />
      <path d="M8 20h24M14 14v-4h12v4" stroke="currentColor" stroke-width="1.15" stroke-linecap="round" />
      <circle cx="20" cy="23" r="2" stroke="currentColor" stroke-width="1" />
    </g>
    <!-- case: folder -->
    <g v-else-if="section === 'case'">
      <path
        d="M8 14h9l3 3h12v16H8V14z"
        stroke="currentColor"
        stroke-width="1.25"
        stroke-linejoin="round"
      />
      <circle cx="26" cy="22" r="3" stroke="currentColor" stroke-width="1" />
    </g>
    <!-- map: compass -->
    <g v-else-if="section === 'map'">
      <circle cx="20" cy="20" r="13" stroke="currentColor" stroke-width="1.2" />
      <path d="M20 11l2.5 9L20 29l-2.5-9L20 11z" stroke="currentColor" stroke-width="1.1" stroke-linejoin="round" />
      <circle cx="20" cy="20" r="1.8" fill="currentColor" />
      <path d="M20 7v3M20 30v3M7 20h3M30 20h3" stroke="currentColor" stroke-width="1" stroke-linecap="round" />
    </g>
    <!-- relation: linked nodes -->
    <g v-else-if="section === 'relation'">
      <circle cx="12" cy="14" r="4" stroke="currentColor" stroke-width="1.2" />
      <circle cx="28" cy="14" r="4" stroke="currentColor" stroke-width="1.2" />
      <circle cx="20" cy="26" r="4" stroke="currentColor" stroke-width="1.2" />
      <path d="M15 17l5 6M25 17l-5 6M16 14h8" stroke="currentColor" stroke-width="1" stroke-linecap="round" />
    </g>
  </svg>
</template>

<script setup lang="ts">
import type { BackstageSectionKey } from '../goth.types';

defineProps<{
  section: BackstageSectionKey;
}>();
</script>
