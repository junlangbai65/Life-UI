<template>
  <article id="production-panel-content" class="panel-content panel-v2 production-v2">
    <section class="production-control-stage pixel-card">
      <h3>锻造工序面板</h3>
      <div v-if="production.items.length > 0" class="category-row">
        <button
          v-for="(item, index) in production.items"
          :id="`production-item-${index}`"
          :key="item.name + index"
          class="quick-action-btn"
          type="button"
          :class="{ active: production.selectedIndex === index }"
          @click="$emit('select-production-item', index)"
        >
          {{ item.name }}
        </button>
      </div>
      <div class="forge-box pixel-card v2">
        <p><strong>当前锻造：</strong>{{ production.currentItem }}</p>
        <p v-if="production.items[production.selectedIndex]">
          <strong>配方：</strong>{{ production.items[production.selectedIndex].recipeName || '未命名配方' }}
        </p>
        <p v-if="production.items[production.selectedIndex]">
          <strong>已消耗材料：</strong>
          {{
            production.items[production.selectedIndex].consumed.length > 0
              ? production.items[production.selectedIndex].consumed.join('，')
              : '暂无'
          }}
        </p>
        <ul class="forge-steps">
          <li v-for="step in production.steps" :key="step.name">
            <span>{{ step.name }}</span>
            <div class="progress-track">
              <div class="progress-fill" :style="{ width: `${step.progress}%` }"></div>
            </div>
            <strong>{{ step.progress }}%</strong>
          </li>
          <li v-if="production.steps.length === 0">
            <span>暂无锻造工序</span>
          </li>
        </ul>
      </div>
    </section>
  </article>
</template>

<script setup lang="ts">
defineProps<{
  production: {
    currentItem: string;
    steps: Array<{ name: string; progress: number }>;
    items: Array<{ name: string; recipeName: string; currentStep: number; totalSteps: number; progress: number; consumed: string[] }>;
    selectedIndex: number;
  };
}>();

defineEmits<{
  'select-production-item': [index: number];
}>();
</script>
