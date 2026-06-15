<template>
  <!-- 旁白 -->
  <div v-if="message.speaker === 'narration'" class="lf-msg lf-msg--narration">
    <span class="lf-msg__narr-line" aria-hidden="true" />
    <p class="lf-msg__narr-text">{{ message.text }}<span v-if="message.streaming" class="lf-msg__caret" /></p>
    <span class="lf-msg__narr-line" aria-hidden="true" />
  </div>

  <!-- 玩家 -->
  <div v-else-if="message.speaker === 'player'" class="lf-msg lf-msg--player">
    <div class="lf-msg__bubble lf-msg__bubble--player">
      <p class="lf-msg__text">{{ message.text }}</p>
    </div>
    <span class="lf-msg__me" aria-hidden="true"><AppIcon name="heart" size="sm" bold /></span>
  </div>

  <!-- 角色 -->
  <div v-else class="lf-msg lf-msg--char" :class="`lf-msg--${accent}`">
    <CharacterAvatar :id="message.speaker as CharacterId" size="sm" ring :ring-color="charColor" />
    <div class="lf-msg__col">
      <div class="lf-msg__meta">
        <span class="lf-msg__name">{{ message.name }}</span>
        <TagChip v-if="message.emotion" :tone="accent" size="xs">{{ message.emotion }}</TagChip>
      </div>
      <div class="lf-msg__bubble lf-msg__bubble--char">
        <p class="lf-msg__text">{{ message.text }}<span v-if="message.streaming" class="lf-msg__caret" /></p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import AppIcon from '../base/AppIcon.vue';
import CharacterAvatar from '../base/CharacterAvatar.vue';
import TagChip from '../base/TagChip.vue';
import { getCharacter } from '../../data/characters';
import type { CharacterId, DialogueMessage } from '../../types';

const props = defineProps<{ message: DialogueMessage }>();

const charMeta = computed(() =>
  props.message.speaker !== 'narration' && props.message.speaker !== 'player'
    ? getCharacter(props.message.speaker)
    : undefined,
);
const accent = computed(() => charMeta.value?.accent ?? 'strawberry');
const charColor = computed(() => charMeta.value?.color ?? 'var(--lf-strawberry)');
</script>

<style scoped lang="scss">
.lf-msg {
  animation: lf-pop-in var(--lf-dur) var(--lf-ease-bounce);
}

// —— 旁白 ——
.lf-msg--narration {
  display: flex;
  align-items: center;
  gap: 9px;
  margin: 4px 8px;
}
.lf-msg__narr-line {
  flex: 1;
  height: 2px;
  background: repeating-linear-gradient(90deg, var(--lf-line-strong) 0 6px, transparent 6px 12px);
}
.lf-msg__narr-text {
  flex-shrink: 1;
  max-width: 78%;
  font-family: var(--lf-font-body);
  font-size: 13px;
  font-style: italic;
  text-align: center;
  color: var(--lf-text-secondary);
  line-height: 1.6;
}

// —— 玩家 ——
.lf-msg--player {
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
  gap: 7px;
}
.lf-msg__me {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  flex-shrink: 0;
  border: 2.5px solid var(--lf-ink);
  border-radius: var(--lf-radius-pill);
  background: var(--lf-peach);
  color: var(--lf-ink);
  box-shadow: var(--lf-shadow-chunky-sm);
}

// —— 角色 ——
.lf-msg--char {
  display: flex;
  align-items: flex-start;
  gap: 8px;
}
.lf-msg__col {
  min-width: 0;
  max-width: 80%;
}
.lf-msg__meta {
  display: flex;
  align-items: center;
  gap: 6px;
  margin: 0 0 4px 4px;
}
.lf-msg__name {
  font-family: var(--lf-font-display);
  font-weight: 700;
  font-size: 13px;
  color: var(--lf-text);
}

.lf-msg__bubble {
  padding: 10px 13px;
  border: 2.5px solid var(--lf-ink);
  border-radius: var(--lf-radius-lg);
  box-shadow: var(--lf-shadow-chunky-sm);
}
.lf-msg__bubble--char {
  background: var(--lf-surface);
  border-top-left-radius: 6px;
}
.lf-msg--lavender .lf-msg__bubble--char { background: #f6f2fe; }
.lf-msg--peach .lf-msg__bubble--char { background: #fff2ea; }
.lf-msg--sky .lf-msg__bubble--char { background: #eef7fe; }

.lf-msg__bubble--player {
  background: var(--lf-strawberry);
  border-top-right-radius: 6px;
}
.lf-msg__text {
  font-size: 14px;
  line-height: 1.65;
  color: var(--lf-text);
  white-space: pre-wrap;
  word-break: break-word;
}

.lf-msg__caret {
  display: inline-block;
  width: 8px;
  height: 16px;
  margin-left: 2px;
  vertical-align: -2px;
  background: var(--lf-strawberry-deep);
  border-radius: 2px;
  animation: lf-blink 1s steps(1) infinite;
}
</style>
