<template>
  <article id="skills-panel-content" class="panel-content panel-v2 skills-v2">
    <section class="skills-growth-stage pixel-card">
      <h3 class="panel-heading">
        <svg viewBox="0 0 24 24" aria-hidden="true" class="panel-heading-icon">
          <path d="M4 16L9 11L13 14L20 7" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
          <path d="M19 7H15M20 7V11" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
        </svg>
        <span>成长轨迹</span>
      </h3>
      <div class="skills-columns">
        <section>
          <h4>生活技能</h4>
          <ul class="line-list">
            <li v-for="skill in skills.life" :key="`life-${skill.name}`">
              <div class="metric-head">
                <span class="skill-name">
                  <svg viewBox="0 0 24 24" aria-hidden="true" class="skill-icon">
                    <path :d="skillIconPath(skill.name, 'life')" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                  {{ skill.name }}
                </span>
                <strong>Lv.{{ skill.level }} · 经验 {{ skill.exp }}</strong>
              </div>
              <div class="metric-track">
                <i :style="{ width: `${toPercent(skill.exp)}%` }" />
              </div>
            </li>
          </ul>
        </section>
        <section>
          <h4>生产技能</h4>
          <ul class="line-list">
            <li v-for="skill in skills.production" :key="`prod-${skill.name}`">
              <div class="metric-head">
                <span class="skill-name">
                  <svg viewBox="0 0 24 24" aria-hidden="true" class="skill-icon">
                    <path :d="skillIconPath(skill.name, 'production')" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                  {{ skill.name }}
                </span>
                <strong>Lv.{{ skill.level }} · 经验 {{ skill.exp }}</strong>
              </div>
              <div class="metric-track">
                <i :style="{ width: `${toPercent(skill.exp)}%` }" />
              </div>
            </li>
          </ul>
        </section>
      </div>
    </section>

    <section class="skills-body-stage pixel-card">
      <h3 class="panel-heading">
        <svg viewBox="0 0 24 24" aria-hidden="true" class="panel-heading-icon">
          <path d="M7 5H17V9H7zM5 11H19V19H5z" fill="none" stroke="currentColor" stroke-width="2" />
          <path d="M9 14H15M9 17H13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
        </svg>
        <span>身体开发</span>
      </h3>
      <div class="skills-tag-grid">
        <div v-for="entry in skills.bodyDevelopment" :key="entry.name" class="skills-tag">
          <span>{{ entry.name }}</span>
          <strong>{{ entry.value }}</strong>
        </div>
      </div>
    </section>

    <section class="skills-record-stage pixel-card">
      <h3 class="panel-heading">
        <svg viewBox="0 0 24 24" aria-hidden="true" class="panel-heading-icon">
          <path d="M6 4H18V20H6z" fill="none" stroke="currentColor" stroke-width="2" />
          <path d="M9 8H15M9 12H15M9 16H13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
        </svg>
        <span>属性成长记录</span>
      </h3>
      <ul class="line-list">
        <li v-for="record in skills.growthRecords" :key="record.name">
          <span>{{ record.name }}</span>
          <strong>{{ record.value }}</strong>
        </li>
      </ul>
    </section>
  </article>
</template>

<script setup lang="ts">
defineProps<{
  skills: {
    life: Array<{ name: string; level: number; exp: number }>;
    production: Array<{ name: string; level: number; exp: number }>;
    bodyDevelopment: Array<{ name: string; value: number }>;
    growthRecords: Array<{ name: string; value: number }>;
  };
}>();

function toPercent(exp: number) {
  return Math.max(6, Math.min(100, Math.round(exp)));
}

const lifeIconMap: Record<string, string> = {
  采集: 'M5 18L8 11L12 6L16 11L19 18M8 11H16M12 6V3',
  潜行: 'M4 12C6.8 8.5 9.5 7 12 7C14.5 7 17.2 8.5 20 12C17.2 15.5 14.5 17 12 17C9.5 17 6.8 15.5 4 12M12 10.8A1.2 1.2 0 1 1 12 13.2A1.2 1.2 0 0 1 12 10.8',
  交涉: 'M4 6H14V12H9L6 15V12H4zM12 10H20V16H17V19L14 16H12z',
  急救: 'M9 4H15V9H20V15H15V20H9V15H4V9H9z',
};

const productionIconMap: Record<string, string> = {
  锻造: 'M5 18L12 11L14 13L7 20M13 6L18 11M16 3L21 8L18 11L13 6z',
  调和: 'M9 3H15M10 3V8L6 15A4 4 0 0 0 9.6 21H14.4A4 4 0 0 0 18 15L14 8V3',
  烹饪: 'M5 10H19M7 10V6M17 10V6M6 14H18A3 3 0 0 1 15 17H9A3 3 0 0 1 6 14z',
};

const fallbackLifeIcon = 'M5 6H19V18H5zM8 10H16M8 14H13';
const fallbackProductionIcon = 'M6 18L18 6M9 6H18V15';

function skillIconPath(name: string, kind: 'life' | 'production') {
  if (kind === 'life') {
    return lifeIconMap[name] ?? fallbackLifeIcon;
  }
  return productionIconMap[name] ?? fallbackProductionIcon;
}
</script>
