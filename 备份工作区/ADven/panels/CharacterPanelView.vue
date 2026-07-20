<template>
  <article id="character-panel-content" class="panel-content panel-v2 character-v2">
    <section class="character-overview pixel-card">
      <h3>角色总览</h3>
      <div class="core-stats">
        <div class="core-pill"><span>HP</span><strong>{{ character.hp }}</strong></div>
        <div class="core-pill"><span>MP</span><strong>{{ character.mp }}</strong></div>
        <div class="core-pill"><span>ATK</span><strong>{{ character.atk }}</strong></div>
        <div class="core-pill"><span>DEF</span><strong>{{ character.def }}</strong></div>
      </div>
    </section>

    <section class="character-attributes pixel-card">
      <h3>基础属性</h3>
      <div class="attribute-radar-grid">
        <div v-for="item in character.baseAttributes" :key="item.name" class="attribute-rune">
          <span>{{ item.name }}</span>
          <strong>{{ item.value }}</strong>
        </div>
      </div>
    </section>

    <section id="character-money-box" class="character-wallet pixel-card">
      <h3>财产账本</h3>
      <div class="wallet-grid">
        <div class="wallet-cell gold">
          <span>金币</span>
          <strong>{{ character.money.gold }}</strong>
        </div>
        <div class="wallet-cell silver">
          <span>银币</span>
          <strong>{{ character.money.silver }}</strong>
        </div>
        <div class="wallet-cell copper">
          <span>铜币</span>
          <strong>{{ character.money.copper }}</strong>
        </div>
      </div>
    </section>
  </article>
</template>

<script setup lang="ts">
defineProps<{
  character: {
    baseAttributes: Array<{ name: string; value: number }>;
    hp: string;
    mp: string;
    atk: number;
    def: number;
    money: { gold: number; silver: number; copper: number };
  };
}>();
</script>
