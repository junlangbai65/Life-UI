<template>
  <section class="lf-title" aria-label="开始界面">
    <div class="lf-title__sky" aria-hidden="true">
      <span class="lf-title__cloud lf-title__cloud--1"><AppIcon name="cloud" size="xl" /></span>
      <span class="lf-title__cloud lf-title__cloud--2"><AppIcon name="cloud" size="lg" /></span>
      <span class="lf-title__sparkle lf-title__sparkle--1"><AppIcon name="sparkle" size="md" /></span>
      <span class="lf-title__sparkle lf-title__sparkle--2"><AppIcon name="star" size="sm" /></span>
      <span class="lf-title__sparkle lf-title__sparkle--3"><AppIcon name="heart" size="sm" /></span>
    </div>

    <div class="lf-title__crew" aria-hidden="true">
      <CharacterAvatar id="chenzhou" size="lg" ring ring-color="var(--lf-sky)" bob class="lf-title__crew-a" />
      <CharacterAvatar id="qinghe" size="xl" ring ring-color="var(--lf-lavender)" bob class="lf-title__crew-b" />
      <CharacterAvatar id="suqing" size="lg" ring ring-color="var(--lf-peach)" bob class="lf-title__crew-c" />
    </div>

    <div class="lf-title__brand">
      <span class="lf-title__kicker">云町日记 · 恋爱模拟</span>
      <h1 class="lf-title__logo">Life<span class="lf-title__logo-accent">UI</span></h1>
      <p class="lf-title__sub">在云町咖啡屋，写下属于你们的夏天</p>
    </div>

    <ClayButton id="lf-title-start" size="lg" variant="primary" class="lf-title__start" @click="$emit('start')">
      <template #icon><AppIcon name="play" size="sm" bold /></template>
      轻触开始
    </ClayButton>

    <p class="lf-title__hint">前端原型 · 仅界面演示 · v0.1</p>
  </section>
</template>

<script setup lang="ts">
import AppIcon from '../components/base/AppIcon.vue';
import CharacterAvatar from '../components/base/CharacterAvatar.vue';
import ClayButton from '../components/base/ClayButton.vue';

defineEmits<{ (e: 'start'): void }>();
</script>

<style scoped lang="scss">
.lf-title {
  position: absolute;
  inset: 0;
  z-index: var(--lf-z-overlay);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 18px;
  padding: 24px;
  text-align: center;
  background:
    radial-gradient(circle at 30% 20%, #ffe3ee, transparent 55%),
    radial-gradient(circle at 75% 75%, #d9eefb, transparent 55%),
    linear-gradient(160deg, #fff7f0, #ffeede);
  overflow: hidden;
}

.lf-title__sky {
  position: absolute;
  inset: 0;
  color: rgba(91, 74, 82, 0.18);
  pointer-events: none;
}
.lf-title__cloud,
.lf-title__sparkle {
  position: absolute;
  display: inline-flex;
}
.lf-title__cloud--1 { top: 12%; left: 12%; color: rgba(174, 223, 247, 0.7); animation: lf-float-bob 5s ease-in-out infinite; }
.lf-title__cloud--2 { top: 22%; right: 14%; color: rgba(255, 227, 163, 0.8); animation: lf-float-bob 6.5s ease-in-out infinite; }
.lf-title__sparkle--1 { top: 16%; right: 30%; color: var(--lf-strawberry); animation: lf-wiggle 3s ease-in-out infinite; }
.lf-title__sparkle--2 { bottom: 24%; left: 18%; color: var(--lf-butter-deep); animation: lf-wiggle 4s ease-in-out infinite; }
.lf-title__sparkle--3 { bottom: 30%; right: 20%; color: var(--lf-strawberry-deep); animation: lf-float-bob 4.5s ease-in-out infinite; }

.lf-title__crew {
  display: flex;
  align-items: flex-end;
  justify-content: center;
  margin-bottom: 2px;
}
.lf-title__crew-a { transform: translateY(8px) rotate(-6deg); margin-right: -10px; z-index: 1; }
.lf-title__crew-b { z-index: 2; }
.lf-title__crew-c { transform: translateY(8px) rotate(6deg); margin-left: -10px; z-index: 1; }

.lf-title__brand {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  z-index: 1;
}
.lf-title__kicker {
  padding: 4px 14px;
  border: 2.5px solid var(--lf-ink);
  border-radius: var(--lf-radius-pill);
  background: var(--lf-surface);
  font-family: var(--lf-font-display);
  font-weight: 600;
  font-size: 12px;
  color: var(--lf-text);
  box-shadow: var(--lf-shadow-chunky-sm);
  transform: rotate(-2deg);
}
.lf-title__logo {
  font-family: var(--lf-font-display);
  font-size: 64px;
  font-weight: 700;
  line-height: 1;
  color: var(--lf-strawberry-deep);
  -webkit-text-stroke: 3px var(--lf-ink);
  text-shadow: 4px 4px 0 var(--lf-ink-shadow);
  letter-spacing: 1px;
}
.lf-title__logo-accent {
  color: var(--lf-sky-deep);
}
.lf-title__sub {
  font-family: var(--lf-font-hand);
  font-size: 19px;
  color: var(--lf-ink-soft);
}
.lf-title__start {
  z-index: 1;
  animation: lf-float-bob 2.6s ease-in-out infinite;
}
.lf-title__hint {
  position: absolute;
  bottom: 16px;
  font-size: 11px;
  color: var(--lf-text-muted);
  letter-spacing: 0.5px;
}
</style>
