<template>
  <component
    :is="as"
    class="lf-clay"
    :class="[
      `lf-clay--${tone}`,
      {
        'lf-clay--chunky': chunky,
        'lf-clay--flat': !chunky,
        'lf-clay--interactive': interactive,
        'lf-clay--taped': taped,
      },
    ]"
    :style="rotateStyle"
  >
    <span v-if="taped" class="lf-clay__tape" aria-hidden="true" />
    <slot />
  </component>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = withDefaults(
  defineProps<{
    as?: string;
    tone?: 'paper' | 'cream' | 'strawberry' | 'mint' | 'sky' | 'butter' | 'lavender' | 'peach';
    chunky?: boolean;
    interactive?: boolean;
    taped?: boolean;
    rotate?: number;
  }>(),
  { as: 'div', tone: 'paper', chunky: true, interactive: false, taped: false, rotate: 0 },
);

const rotateStyle = computed(() => (props.rotate ? { '--lf-clay-rot': `${props.rotate}deg` } : {}));
</script>

<style scoped lang="scss">
.lf-clay {
  --lf-clay-bg: var(--lf-surface);
  --lf-clay-rot: 0deg;
  position: relative;
  border: var(--lf-outline) solid var(--lf-ink);
  border-radius: var(--lf-radius-lg);
  background: var(--lf-clay-bg);
  transform: rotate(var(--lf-clay-rot));
  transition:
    transform var(--lf-dur) var(--lf-ease-bounce),
    box-shadow var(--lf-dur) var(--lf-ease-out),
    background var(--lf-dur) var(--lf-ease-soft);
}

.lf-clay--chunky {
  box-shadow: var(--lf-shadow-chunky);
}
.lf-clay--flat {
  box-shadow: var(--lf-shadow-soft-sm);
}

.lf-clay--paper { --lf-clay-bg: var(--lf-surface); }
.lf-clay--cream { --lf-clay-bg: var(--lf-surface-soft); }
.lf-clay--strawberry { --lf-clay-bg: #fde4ee; }
.lf-clay--mint { --lf-clay-bg: #e2f7ee; }
.lf-clay--sky { --lf-clay-bg: #e3f3fd; }
.lf-clay--butter { --lf-clay-bg: #fff3d6; }
.lf-clay--lavender { --lf-clay-bg: #efe9fb; }
.lf-clay--peach { --lf-clay-bg: #ffe8da; }

.lf-clay--interactive {
  cursor: pointer;
}
.lf-clay--interactive:hover {
  transform: rotate(var(--lf-clay-rot)) translate(-2px, -2px);
  box-shadow: var(--lf-shadow-chunky-lg);
}
.lf-clay--interactive:active {
  transform: rotate(var(--lf-clay-rot)) translate(2px, 2px);
  box-shadow: var(--lf-shadow-chunky-sm);
}

.lf-clay__tape {
  position: absolute;
  top: -12px;
  left: 50%;
  width: 64px;
  height: 22px;
  transform: translateX(-50%) rotate(-3deg);
  background: repeating-linear-gradient(
    -45deg,
    rgba(255, 224, 178, 0.85),
    rgba(255, 224, 178, 0.85) 6px,
    rgba(255, 211, 150, 0.85) 6px,
    rgba(255, 211, 150, 0.85) 12px
  );
  border: 1.5px solid rgba(91, 74, 82, 0.25);
  border-radius: 3px;
  pointer-events: none;
}
</style>
