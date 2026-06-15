<template>
  <section id="llm-interaction-main-section" class="chat-section pixel-card">
    <section class="narrative-main-grid">
      <section class="narrative-left-column narrative-left-column--story">
        <article id="maintext-content-panel" class="maintext-panel pixel-card" aria-live="polite">
          <header class="maintext-header compact">
            <div class="maintext-header-left">
              <h3 class="icon-title" aria-label="正文框">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M5 4h14v16H5zM8 8h8M8 12h8M8 16h6" />
                </svg>
              </h3>
              <small class="typing-status">{{ isTyping ? '正在显现中…' : '阅读就绪' }}</small>
            </div>
            <div id="maintext-layer-switch-row" class="maintext-layer-switch-row">
              <button
                v-for="tab in maintextLayerTabs"
                :id="`maintext-layer-switch-${tab.key}`"
                :key="tab.key"
                type="button"
                class="history-tab-btn"
                :class="{ active: selectedMaintextLayerOffset === tab.key }"
                :disabled="!tab.available"
                @click="$emit('switch-maintext-layer', tab.key)"
              >
                {{ tab.label }}
              </button>
            </div>
            <div class="type-controls">
              <button id="maintext-fast-forward-btn" type="button" class="history-tab-btn" :disabled="!isTyping" @click="fastForwardMaintext">
                快进
              </button>
              <button id="maintext-replay-btn" type="button" class="history-tab-btn" :disabled="!maintextContent.trim()" @click="replayMaintext">
                重播
              </button>
            </div>
          </header>
          <div id="maintext-content-text" class="maintext-content notebook-paper" :style="maintextNotebookStyle">
            <template v-if="formattedSegments.length > 0">
              <template v-for="(segment, index) in formattedSegments" :key="`${segment.kind}-${index}`">
                <p
                  v-if="segment.kind === 'narration'"
                  class="maintext-line"
                  :class="{ 'maintext-line-first': index === firstNarrationIndex }"
                >
                  {{ segment.text }}<span
                    v-if="isTyping && index === typingCaretSegmentIndex"
                    class="maintext-type-cursor"
                    aria-hidden="true"
                  />
                </p>
                <p v-else class="maintext-line dialogue-mark" :data-jp="segment.japaneseText">
                  <span class="dialogue-zh">{{ segment.chineseText }}</span><span
                    v-if="isTyping && index === typingCaretSegmentIndex"
                    class="maintext-type-cursor"
                    aria-hidden="true"
                  />
                </p>
              </template>
            </template>
            <p v-else-if="isTyping" class="maintext-empty maintext-empty--typing">
              <span class="maintext-type-cursor" aria-hidden="true" />
            </p>
            <p v-else class="maintext-empty">暂无正文内容</p>
          </div>
          <div v-if="maintextDice.length > 0" id="maintext-dice-list" class="dice-row">
            <article
              v-for="(dice, index) in maintextDice"
              :id="`maintext-dice-${index}`"
              :key="`${dice}-${index}`"
              class="dice-chip"
              :class="`dice-chip--${getDiceTone(dice)}`"
            >
              <span class="dice-loader" :class="`dice-loader--${getDiceTone(dice)}`" aria-hidden="true"></span>
              <div class="dice-chip-meta">
                <small>{{ getDiceToneLabel(dice) }}</small>
                <strong>{{ dice }}</strong>
              </div>
            </article>
          </div>
        </article>

        <section id="interest-panel" class="compact-block pixel-card interest-panel-premium" aria-labelledby="interest-panel-title">
          <header class="compact-block-header interest-panel-premium__head">
            <h3 id="interest-panel-title" class="icon-title interest-panel-premium__title" aria-label="有趣的地方">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 3l7 4v10l-7 4-7-4V7zM9 11h6M9 14h4" />
              </svg>
            </h3>
            <button
              id="interest-panel-toggle"
              class="compact-toggle-btn panel-collapse-btn"
              type="button"
              :aria-expanded="String(!isInterestCollapsed)"
              aria-controls="interest-panel-content"
              :aria-label="isInterestCollapsed ? '展开有趣的地方' : '收起有趣的地方'"
              @click="isInterestCollapsed = !isInterestCollapsed"
            >
              <svg class="panel-collapse-btn__chev" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2.2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M6 9l6 6 6-6"
                />
              </svg>
            </button>
          </header>
          <p class="compact-block-hint interest-panel-premium__hint">有趣的地方~</p>
          <ul
            id="interest-panel-content"
            class="compact-list interest-panel-premium__list"
            :class="{ collapsed: isInterestCollapsed }"
          >
            <li
              v-for="point in interestPoints"
              :key="`${point.target}-${point.description}`"
              class="interest-panel-premium__row"
            >
              <span class="interest-panel-premium__key">{{ point.target }}</span>
              <strong class="interest-panel-premium__value">{{ point.description || '暂无描述' }}</strong>
            </li>
            <li v-if="interestPoints.length === 0" class="interest-panel-premium__row interest-panel-premium__row--empty">
              <span class="interest-panel-premium__empty">暂时没发现~</span>
            </li>
          </ul>
        </section>

        <section id="options-panel" class="compact-block pixel-card options-panel-premium">
          <header class="compact-block-header options-panel-premium__head">
            <h3 class="icon-title options-panel-premium__title" aria-label="该怎么办呢">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M4 6h16M4 12h16M4 18h16M7 6v12" />
              </svg>
            </h3>
            <button
              id="options-panel-toggle"
              class="compact-toggle-btn panel-collapse-btn"
              type="button"
              :aria-expanded="String(!isOptionsCollapsed)"
              aria-controls="options-panel-content"
              :aria-label="isOptionsCollapsed ? '展开该怎么办呢' : '收起该怎么办呢'"
              @click="isOptionsCollapsed = !isOptionsCollapsed"
            >
              <svg class="panel-collapse-btn__chev" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2.2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M6 9l6 6 6-6"
                />
              </svg>
            </button>
          </header>
          <p class="compact-block-hint options-panel-premium__hint">该怎么办呢~</p>
          <div id="options-panel-content" class="option-grid options-panel-premium__grid" :class="{ collapsed: isOptionsCollapsed }">
            <button
              v-for="option in narrativeOptions"
              :id="`narrative-option-${option.id}`"
              :key="option.id"
              class="quick-action-btn option-btn options-panel-premium__choice"
              type="button"
              @click="$emit('apply-option', option.text)"
            >
              <strong class="option-id">{{ option.id }}.</strong>
              <span class="option-text">{{ option.text }}</span>
            </button>
            <div v-if="narrativeOptions.length === 0" class="empty-note options-panel-premium__empty">先看看局势再决定~</div>
          </div>
        </section>

        <footer id="llm-input-compose-panel" class="compose-panel">
          <textarea
            id="llm-input-area"
            :value="draftInput"
            class="compose-input"
            rows="3"
            aria-label="行动输入"
            @input="$emit('update:draft-input', ($event.target as HTMLTextAreaElement).value)"
          ></textarea>
          <div class="compose-row">
            <div class="send-mode-switch" role="group" aria-label="发送方式">
              <button
                id="send-mode-stream-btn"
                class="quick-action-btn send-mode-btn"
                :class="{ active: sendMode === 'stream' }"
                type="button"
                :disabled="isGenerating"
                @click="$emit('update:send-mode', 'stream')"
              >
                流式
              </button>
              <button
                id="send-mode-normal-btn"
                class="quick-action-btn send-mode-btn"
                :class="{ active: sendMode === 'normal' }"
                type="button"
                :disabled="isGenerating"
                @click="$emit('update:send-mode', 'normal')"
              >
                非流式
              </button>
            </div>
            <button
              id="send-llm-message-button"
              class="pixel-btn send-btn"
              type="button"
              :disabled="isGenerating"
              @click="$emit('submit-message')"
            >
              好！就这么做！
            </button>
          </div>
        </footer>

        <AdvenEnemyBriefing :enemies="enemyList" />
      </section>

      <aside class="narrative-right-column">
        <section class="portrait-card pixel-card">
          <h3 class="strip-title">
            <span class="strip-title__left">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 4a4 4 0 1 1 0 8 4 4 0 0 1 0-8M4 20a8 8 0 0 1 16 0" />
              </svg>
              <span>角色状态</span>
            </span>
          </h3>
          <div class="portrait-frame">
            <img v-if="userAvatarSrc" :src="userAvatarSrc" alt="用户头像" class="portrait-avatar" />
            <span v-else>未找到头像</span>
          </div>
          <div class="name-stack">
            <p class="portrait-name main">麦露</p>
            <p class="portrait-name jp">マイル</p>
            <p class="portrait-name sub">阿黛尔·冯·阿斯卡姆</p>
            <p class="portrait-name jp-sub">アデール・フォン・アスカム</p>
            <p class="dogtag-slogan">目标是平均值！</p>
          </div>

          <AdvenNarrativeQuestCard :quests="quests" />

          <div class="vitals vitals--integrated">
            <div class="vitals-level-row" aria-label="等级与升级">
              <div class="vitals-level-main">
                <span class="vitals-level-badge">Lv.{{ levelSystem.level }}</span>
                <span class="vitals-level-caption">等级</span>
              </div>
              <div class="vitals-level-meta">
                <span class="vitals-level-meta__label">距下一级</span>
                <span class="vitals-level-meta__value">{{ expToNextLevel }} EXP</span>
              </div>
            </div>
            <AdvenStatBar
              label="HP"
              :value-text="hpValueText"
              :percent="hpProgress"
              variant="hp"
              :tier="hpTier"
            />
            <AdvenStatBar
              label="MP"
              :value-text="mpValueText"
              :percent="mpProgress"
              variant="mp"
              :tier="mpTier"
            />
            <AdvenStatBar
              label="EXP"
              :value-text="expValueText"
              :percent="expProgress"
              variant="exp"
            />
          </div>
          <section class="title-switch">
            <header>
              <span>称号</span>
            </header>
            <select id="title-select" v-model="selectedTitle" class="title-select">
              <option v-for="title in titleOptions" :key="title" :value="title">
                {{ title }}
              </option>
            </select>
          </section>
          <div class="money-strip">
            <span class="coin-chip coin-gold">
              <i aria-hidden="true">G</i>
              <b>金币</b>
              <strong>{{ character.money.gold }}</strong>
            </span>
            <span class="coin-chip coin-silver">
              <i aria-hidden="true">S</i>
              <b>银币</b>
              <strong>{{ character.money.silver }}</strong>
            </span>
            <span class="coin-chip coin-copper">
              <i aria-hidden="true">C</i>
              <b>铜币</b>
              <strong>{{ character.money.copper }}</strong>
            </span>
          </div>
        </section>
      </aside>
    </section>
  </section>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch, watchEffect } from 'vue';
import AdvenEnemyBriefing from './AdvenEnemyBriefing.vue';
import AdvenNarrativeQuestCard from './AdvenNarrativeQuestCard.vue';
import AdvenStatBar from './AdvenStatBar.vue';
import type { EnemyEntry, LevelSystem, QuestEntry } from './adven.types';
import { formatMaintextSegments } from './utils/maintextFormatter';

const props = defineProps<{
  maintextContent: string;
  maintextDice: string[];
  interestPoints: Array<{ target: string; description: string }>;
  narrativeOptions: Array<{ id: string; text: string }>;
  maintextLayerTabs: Array<{ key: 0 | 1 | 2; label: string; available: boolean }>;
  selectedMaintextLayerOffset: 0 | 1 | 2;
  draftInput: string;
  sendMode: 'stream' | 'normal';
  isGenerating: boolean;
  character: {
    hp: string;
    mp: string;
    money: { gold: number; silver: number; copper: number };
  };
  achievements: Array<{ title: string; condition: string }>;
  levelSystem: LevelSystem;
  enemyList: EnemyEntry[];
  quests: QuestEntry[];
}>();

defineEmits<{
  'switch-maintext-layer': [offset: 0 | 1 | 2];
  'apply-option': [optionText: string];
  'update:draft-input': [value: string];
  'update:send-mode': [value: 'stream' | 'normal'];
  'submit-message': [];
}>();

function parseBarPercent(text: string): number {
  const matches = text.match(/\d+/g);
  if (!matches || matches.length < 2) return 0;
  const current = Number(matches[0]);
  const max = Number(matches[1]);
  if (!Number.isFinite(current) || !Number.isFinite(max) || max <= 0) return 0;
  const ratio = (current / max) * 100;
  return Math.max(0, Math.min(100, ratio));
}

const hpProgress = computed(() => parseBarPercent(props.character.hp));
const mpProgress = computed(() => parseBarPercent(props.character.mp));

const expProgress = computed(() => {
  const req = props.levelSystem.requiredExp;
  if (req <= 0) return 0;
  return Math.min(100, Math.round((props.levelSystem.currentExp / req) * 100));
});

const expToNextLevel = computed(() => {
  const req = props.levelSystem.requiredExp;
  const cur = props.levelSystem.currentExp;
  if (req <= 0) return 0;
  return Math.max(0, Math.round(req - cur));
});

function parseSlashPair(text: string): { cur: number; max: number } {
  const m = text.match(/(\d+)\s*\/\s*(\d+)/);
  if (m) {
    const cur = Number(m[1]);
    const max = Math.max(1, Number(m[2]));
    return { cur: Number.isFinite(cur) ? cur : 0, max };
  }
  const matches = text.match(/\d+/g);
  if (!matches || matches.length < 2) return { cur: 0, max: 1 };
  const cur = Number(matches[0]);
  const max = Math.max(1, Number(matches[1]));
  return {
    cur: Number.isFinite(cur) ? cur : 0,
    max: Number.isFinite(max) ? max : 1,
  };
}

const hpPair = computed(() => parseSlashPair(props.character.hp));
const mpPair = computed(() => parseSlashPair(props.character.mp));

const hpValueText = computed(() => `${hpPair.value.cur} / ${hpPair.value.max}`);
const mpValueText = computed(() => `${mpPair.value.cur} / ${mpPair.value.max}`);
const expValueText = computed(
  () => `${props.levelSystem.currentExp} / ${props.levelSystem.requiredExp}`,
);

function toTier(percent: number): 'high' | 'medium' | 'low' | 'critical' {
  if (percent >= 70) return 'high';
  if (percent >= 35) return 'medium';
  if (percent >= 15) return 'low';
  return 'critical';
}

const hpTier = computed(() => toTier(hpProgress.value));
const mpTier = computed(() => toTier(mpProgress.value));

const titleOptions = computed(() => {
  if (props.achievements.length === 0) return ['暂无称号'];
  return props.achievements.map(item => item.title);
});
const selectedTitle = ref('暂无称号');

watchEffect(() => {
  if (!titleOptions.value.includes(selectedTitle.value)) {
    selectedTitle.value = titleOptions.value[0] ?? '暂无称号';
  }
});

function getUserAvatarFromDom(root: Document): string {
  const selectors = [
    '#user_avatar_block img',
    '.drawer-content .avatar img',
    '.mes[is_user="true"] .avatar img',
    '.mes[is_user] .avatar img',
    '.avatar-container img',
  ];
  for (const selector of selectors) {
    const src = root.querySelector<HTMLImageElement>(selector)?.getAttribute('src');
    if (src && src.trim().length > 0) return src;
  }
  return '';
}

const userAvatarSrc = computed(() => {
  const currentDoc = getUserAvatarFromDom(document);
  if (currentDoc) return currentDoc;
  const parentDoc = window.parent?.document;
  if (parentDoc) {
    const fromParent = getUserAvatarFromDom(parentDoc);
    if (fromParent) return fromParent;
  }
  return getCharAvatarPath('current') ?? '';
});

const visibleMaintext = ref('');
const isInterestCollapsed = ref(false);
const isOptionsCollapsed = ref(false);
const isTyping = ref(false);
const typingCursor = ref(0);
let typingTimer: ReturnType<typeof setTimeout> | null = null;
const dropCapColor = ref('hsl(16deg 68% 44%)');

const dropCapPalette = [
  'hsl(16deg 68% 44%)',
  'hsl(355deg 58% 46%)',
  'hsl(29deg 72% 38%)',
  'hsl(202deg 56% 36%)',
  'hsl(273deg 42% 46%)',
  'hsl(134deg 38% 34%)',
];

function pickRandomDropCapColor() {
  const index = Math.floor(Math.random() * dropCapPalette.length);
  dropCapColor.value = dropCapPalette[index] ?? dropCapPalette[0];
}

const formattedSegments = computed(() => formatMaintextSegments(visibleMaintext.value));
const firstNarrationIndex = computed(() => formattedSegments.value.findIndex(segment => segment.kind === 'narration'));

/** 案例「打字效果」式光标：挂在当前最后一个片段末尾 */
const typingCaretSegmentIndex = computed(() => Math.max(0, formattedSegments.value.length - 1));

const maintextNotebookStyle = computed(() => ({
  '--dropcap-color': dropCapColor.value,
}));

type DiceTone = 'neutral' | 'success' | 'failure' | 'critical-success' | 'critical-failure';

function getDiceToneByKeyword(raw: string): DiceTone {
  const text = raw.toLowerCase();
  if (/大成功|极限成功|完美|critical success|crit success/.test(text)) {
    return 'critical-success';
  }
  if (/大失败|灾难|翻车|fumble|critical fail|crit fail/.test(text)) {
    return 'critical-failure';
  }
  if (/成功|通过|命中|success|pass/.test(text)) {
    return 'success';
  }
  if (/失败|未通过|未命中|fail|miss/.test(text)) {
    return 'failure';
  }
  return 'neutral';
}

function extractDicePair(raw: string): { roll: number; max: number } | null {
  const pairPatterns = [
    /(\d+)\s*[dD]\s*(\d+)\s*[=:：]\s*(\d+)/,
    /(\d+)\s*\/\s*(\d+)/,
  ];
  for (const pattern of pairPatterns) {
    const match = raw.match(pattern);
    if (!match) continue;
    if (pattern === pairPatterns[0]) {
      const max = Number.parseInt(match[2] ?? '', 10);
      const roll = Number.parseInt(match[3] ?? '', 10);
      if (Number.isFinite(max) && Number.isFinite(roll) && max > 0) {
        return { roll, max };
      }
      continue;
    }
    const roll = Number.parseInt(match[1] ?? '', 10);
    const max = Number.parseInt(match[2] ?? '', 10);
    if (Number.isFinite(max) && Number.isFinite(roll) && max > 0) {
      return { roll, max };
    }
  }

  const d100Single = raw.match(/[dD]\s*100[^0-9]{0,8}(\d{1,3})|(\d{1,3})[^0-9]{0,8}[dD]\s*100/);
  if (d100Single) {
    const roll = Number.parseInt((d100Single[1] || d100Single[2] || '').trim(), 10);
    if (Number.isFinite(roll)) {
      return { roll, max: 100 };
    }
  }
  return null;
}

function getDiceToneByNumber(raw: string): DiceTone | null {
  const pair = extractDicePair(raw);
  if (!pair) return null;
  const roll = Math.max(0, pair.roll);
  const max = pair.max;
  const ratio = roll / max;

  if (ratio <= 0.05) return 'critical-success';
  if (ratio >= 0.96) return 'critical-failure';
  if (ratio <= 0.5) return 'success';
  return 'failure';
}

function getDiceTone(raw: string): DiceTone {
  const keywordTone = getDiceToneByKeyword(raw);
  const numberTone = getDiceToneByNumber(raw);
  if (!numberTone) return keywordTone;

  // Numeric criticals always win as secondary calibration.
  if (numberTone === 'critical-success' || numberTone === 'critical-failure') {
    return numberTone;
  }
  // If no keyword clue, trust numeric inference.
  if (keywordTone === 'neutral') {
    return numberTone;
  }
  // For non-critical conflict, keep textual intent.
  return keywordTone;
}

function getDiceToneLabel(raw: string): string {
  const tone = getDiceTone(raw);
  if (tone === 'critical-success') return '大成功';
  if (tone === 'critical-failure') return '大失败';
  if (tone === 'success') return '成功';
  if (tone === 'failure') return '失败';
  return '判定';
}

function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined' || !window.matchMedia) return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function clearTypingTimer() {
  if (typingTimer) {
    clearTimeout(typingTimer);
    typingTimer = null;
  }
}

/**
 * 逐字打字（回归）；无障碍：prefers-reduced-motion 时直接展示全文。
 * 光标样式参考 `样式库/案例/打字效果/typing.css`（闪烁竖线，非横向遮罩）。
 */
function runTypewriter(rawText: string) {
  clearTypingTimer();
  pickRandomDropCapColor();
  const source = rawText ?? '';
  visibleMaintext.value = '';
  typingCursor.value = 0;
  if (!source.trim()) {
    isTyping.value = false;
    return;
  }

  if (prefersReducedMotion()) {
    visibleMaintext.value = source;
    typingCursor.value = source.length;
    isTyping.value = false;
    return;
  }

  const step = () => {
    const nextCursor = Math.min(source.length, typingCursor.value + 1);
    typingCursor.value = nextCursor;
    visibleMaintext.value = source.slice(0, nextCursor);
    if (nextCursor >= source.length) {
      isTyping.value = false;
      typingTimer = null;
      return;
    }
    typingTimer = setTimeout(step, 18);
  };

  isTyping.value = true;
  typingTimer = setTimeout(step, 18);
}

function fastForwardMaintext() {
  clearTypingTimer();
  typingCursor.value = props.maintextContent.length;
  visibleMaintext.value = props.maintextContent;
  isTyping.value = false;
}

function replayMaintext() {
  runTypewriter(props.maintextContent);
}

watch(
  () => props.maintextContent,
  content => {
    runTypewriter(content);
  },
  { immediate: true },
);

watch(
  () => props.selectedMaintextLayerOffset,
  () => {
    runTypewriter(props.maintextContent);
  },
);

onBeforeUnmount(() => {
  clearTypingTimer();
});
</script>

