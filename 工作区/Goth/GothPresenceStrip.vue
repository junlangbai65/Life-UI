<template>
  <div
    class="goth-presence"
    role="group"
    :aria-label="ariaLabel"
  >
    <div class="goth-presence__rail" aria-hidden="true">
      <span class="goth-presence__rivet" /><span class="goth-presence__rivet" />
    </div>
    <div class="goth-presence__plate">
      <p class="goth-presence__caption">在场</p>
      <ul class="goth-presence__list">
        <li v-for="(name, i) in names" :key="`${name}-${i}`" class="goth-presence__item">
          <span class="goth-presence__slot" aria-hidden="true" />
          <span class="goth-presence__name">{{ name }}</span>
        </li>
      </ul>
    </div>
    <div class="goth-presence__rail goth-presence__rail--end" aria-hidden="true">
      <span class="goth-presence__rivet" /><span class="goth-presence__rivet" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  names: string[];
}>();

const ariaLabel = computed(() =>
  props.names.length ? `在场：${props.names.join('、')}` : '在场：无',
);
</script>

<style scoped>
/* 档案登记卡：两侧压条铆钉 + 内嵌纸槽名单（与 LOCATION 烫金字同源） */
.goth-presence {
  display: flex;
  align-items: stretch;
  gap: 0;
  margin-top: 0.38rem;
  padding-top: 0.35rem;
}

.goth-presence__rail {
  flex-shrink: 0;
  width: 7px;
  border-radius: 2px;
  background: linear-gradient(
    90deg,
    rgba(52, 46, 40, 0.95) 0%,
    rgba(28, 24, 20, 0.98) 45%,
    rgba(42, 36, 30, 0.92) 100%
  );
  box-shadow:
    inset 0 1px 0 rgba(118, 108, 92, 0.12),
    inset 2px 0 4px rgba(4, 3, 2, 0.35),
    inset -1px 0 2px rgba(255, 248, 236, 0.04);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  padding: 0.28rem 0;
}

.goth-presence__rail--end {
  background: linear-gradient(
    270deg,
    rgba(52, 46, 40, 0.95) 0%,
    rgba(28, 24, 20, 0.98) 45%,
    rgba(42, 36, 30, 0.92) 100%
  );
  box-shadow:
    inset 0 1px 0 rgba(118, 108, 92, 0.12),
    inset -2px 0 4px rgba(4, 3, 2, 0.35),
    inset 1px 0 2px rgba(255, 248, 236, 0.04);
}

.goth-presence__rivet {
  width: 3px;
  height: 3px;
  border-radius: 50%;
  background: radial-gradient(circle at 30% 28%, rgba(132, 118, 98, 0.55), rgba(18, 16, 14, 0.92));
  box-shadow:
    0 0 0 1px rgba(12, 10, 8, 0.65),
    inset 0 1px 0 rgba(255, 248, 236, 0.12);
}

.goth-presence__plate {
  flex: 1;
  min-width: 0;
  padding: 0.28rem 0.42rem 0.32rem;
  border-radius: 3px;
  background: linear-gradient(
    178deg,
    rgba(38, 34, 30, 0.42) 0%,
    rgba(14, 12, 10, 0.72) 100%
  );
  border: 1px solid rgba(14, 12, 10, 0.72);
  box-shadow:
    inset 0 2px 8px rgba(4, 3, 2, 0.42),
    inset 0 1px 0 rgba(92, 82, 72, 0.08),
    inset 0 0 0 1px rgba(196, 182, 150, 0.05);
}

.goth-presence__caption {
  margin: 0 0 0.28rem;
  font-family: var(--g-font-ui);
  font-size: 0.62rem;
  font-weight: 600;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: rgba(118, 112, 102, 0.72);
  text-shadow: 0 1px 0 rgba(4, 3, 2, 0.45);
}

.goth-presence__list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem 0.42rem;
}

.goth-presence__item {
  display: inline-flex;
  align-items: center;
  gap: 0.28rem;
  max-width: 100%;
}

.goth-presence__slot {
  flex-shrink: 0;
  width: 6px;
  height: 6px;
  border-radius: 1px;
  background: linear-gradient(145deg, rgba(72, 64, 54, 0.65) 0%, rgba(22, 18, 14, 0.88) 100%);
  box-shadow:
    inset 0 1px 1px rgba(255, 248, 236, 0.06),
    inset 0 -1px 2px rgba(4, 3, 2, 0.55),
    0 0 0 1px rgba(12, 10, 8, 0.45);
}

.goth-presence__name {
  font-family: var(--g-font-display);
  font-size: 0.78rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  line-height: 1.35;
  overflow-wrap: anywhere;
  background: linear-gradient(
    168deg,
    #f4ebd8 0%,
    #dccaaa 26%,
    #b89a68 48%,
    #8f7648 68%,
    #d2c29a 100%
  );
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  filter: drop-shadow(0 1px 0 rgba(255, 252, 245, 0.2)) drop-shadow(0 -1px 1px rgba(0, 0, 0, 0.58));
}
</style>
