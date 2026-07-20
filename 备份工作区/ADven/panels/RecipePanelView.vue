<template>
  <article id="recipe-panel-content" class="panel-content panel-v2 recipe-v2">
    <section class="recipe-blueprint-stage pixel-card">
      <h3 class="panel-heading">
        <svg viewBox="0 0 24 24" aria-hidden="true" class="panel-heading-icon">
          <path d="M5 5H19V19H5z" fill="none" stroke="currentColor" stroke-width="2" />
          <path d="M8 9H16M8 13H14M8 17H12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
        </svg>
        <span>工坊图纸</span>
      </h3>
      <div class="recipe-columns workshop">
        <section>
          <h4>装备图纸</h4>
          <ul class="line-list compact recipe-entry-list">
            <li v-for="entry in recipes.blueprints" :key="entry.name">
              <div class="recipe-entry-head">
                <span class="recipe-entry-name">{{ entry.name }}</span>
              </div>
              <p v-if="entry.description.trim()" class="recipe-entry-desc">{{ entry.description }}</p>
              <p v-else class="recipe-entry-desc recipe-entry-desc--empty">暂无描述</p>
            </li>
            <li v-if="recipes.blueprints.length === 0"><span>暂无图纸</span></li>
          </ul>
        </section>
        <section>
          <h4>炼金秘方</h4>
          <ul class="line-list compact recipe-entry-list">
            <li v-for="entry in recipes.alchemy" :key="entry.name">
              <div class="recipe-entry-head">
                <span class="recipe-entry-name">{{ entry.name }}</span>
              </div>
              <p v-if="entry.description.trim()" class="recipe-entry-desc">{{ entry.description }}</p>
              <p v-else class="recipe-entry-desc recipe-entry-desc--empty">暂无描述</p>
            </li>
            <li v-if="recipes.alchemy.length === 0"><span>暂无秘方</span></li>
          </ul>
        </section>
        <section>
          <h4>秘传食谱</h4>
          <ul class="line-list compact recipe-entry-list">
            <li v-for="entry in recipes.cooking" :key="entry.name">
              <div class="recipe-entry-head">
                <span class="recipe-entry-name">{{ entry.name }}</span>
              </div>
              <p v-if="entry.description.trim()" class="recipe-entry-desc">{{ entry.description }}</p>
              <p v-else class="recipe-entry-desc recipe-entry-desc--empty">暂无描述</p>
            </li>
            <li v-if="recipes.cooking.length === 0"><span>暂无食谱</span></li>
          </ul>
        </section>
      </div>
    </section>
  </article>
</template>

<script setup lang="ts">
import type { RecipesBundle } from '../adven.types';

defineProps<{
  recipes: RecipesBundle;
}>();
</script>
