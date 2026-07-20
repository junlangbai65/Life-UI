<template>
  <div class="goth-file-panel" role="region" aria-label="案卷">
    <div class="goth-file-panel__paper">
      <div class="goth-file-panel__scroll">
        <section class="goth-file-panel__section" aria-labelledby="goth-file-panel-interest-heading">
          <h3 id="goth-file-panel-interest-heading" class="goth-file-panel__section-title">
            <span class="goth-file-panel__section-mark" aria-hidden="true" />
            兴趣点
          </h3>
          <ul v-if="interests.length > 0" class="goth-file-panel__interest-list">
            <li v-for="(row, i) in interests" :key="i" class="goth-file-panel__interest-row">
              <span class="goth-file-panel__interest-bullet" aria-hidden="true" />
              <div class="goth-file-panel__interest-body">
                <p class="goth-file-panel__interest-title">{{ row.title }}</p>
                <p v-if="row.description" class="goth-file-panel__interest-desc">{{ row.description }}</p>
              </div>
            </li>
          </ul>
          <p v-else class="goth-file-panel__empty">本楼层未标注兴趣点。</p>
        </section>

        <section class="goth-file-panel__section" aria-labelledby="goth-file-panel-options-heading">
          <h3 id="goth-file-panel-options-heading" class="goth-file-panel__section-title">
            <span class="goth-file-panel__section-mark goth-file-panel__section-mark--options" aria-hidden="true" />
            选项栏
          </h3>
          <div v-if="options.length > 0" class="goth-file-panel__options-grid">
            <button
              v-for="opt in options"
              :key="`${opt.id}-${opt.text.slice(0, 20)}`"
              type="button"
              class="goth-option-chip goth-file-panel__opt-chip"
              :disabled="isGenerating"
              @click="emit('selectOption', opt)"
            >
              <span class="goth-option-id">{{ opt.id }}</span>
              <span class="goth-option-text">{{ opt.text }}</span>
            </button>
          </div>
          <p v-else class="goth-file-panel__empty">暂无分支选项。</p>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { GothNarrativeInterest, GothParsedOption } from './utils/messageParser';

defineProps<{
  interests: GothNarrativeInterest[];
  options: GothParsedOption[];
  isGenerating: boolean;
}>();

const emit = defineEmits<{
  selectOption: [opt: GothParsedOption];
}>();
</script>

<style scoped>
.goth-file-panel {
  --file-fg: rgba(236, 228, 216, 0.96);
  --file-fg-muted: rgba(196, 186, 168, 0.92);
  --file-fg-soft: rgba(168, 158, 142, 0.88);
  --file-paper-top: rgba(48, 42, 38, 0.72);
  --file-paper-bot: rgba(22, 18, 16, 0.92);

  min-height: 0;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.goth-file-panel__paper {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  margin: 0;
  padding: 1px;
  border-radius: 5px;
  background: linear-gradient(
    165deg,
    rgba(92, 82, 70, 0.35) 0%,
    rgba(38, 32, 28, 0.55) 50%,
    rgba(22, 18, 15, 0.72) 100%
  );
  box-shadow:
    inset 0 1px 0 rgba(255, 248, 236, 0.06),
    0 2px 10px rgba(4, 3, 2, 0.28);
}

.goth-file-panel__scroll {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding: 0.65rem 0.58rem 0.72rem;
  border-radius: 4px;
  background: linear-gradient(178deg, var(--file-paper-top) 0%, var(--file-paper-bot) 100%);
  box-shadow: inset 0 2px 12px rgba(4, 3, 2, 0.35);
}

.goth-file-panel__section + .goth-file-panel__section {
  margin-top: 0.95rem;
  padding-top: 0.9rem;
  border-top: 1px solid rgba(72, 62, 52, 0.45);
}

.goth-file-panel__section-title {
  display: flex;
  align-items: center;
  gap: 0.38rem;
  margin: 0 0 0.48rem;
  font-family: var(--g-font-ui);
  font-size: 0.62rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--file-fg-muted);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.45);
}

.goth-file-panel__section-mark {
  flex-shrink: 0;
  width: 3px;
  height: 12px;
  border-radius: 1px;
  background: linear-gradient(
    180deg,
    rgba(218, 192, 148, 0.65) 0%,
    rgba(132, 108, 72, 0.55) 100%
  );
  box-shadow:
    0 0 0 1px rgba(18, 14, 12, 0.55),
    inset 0 1px 0 rgba(255, 248, 236, 0.15);
}

.goth-file-panel__section-mark--options {
  background: linear-gradient(
    180deg,
    rgba(168, 188, 212, 0.55) 0%,
    rgba(92, 108, 128, 0.5) 100%
  );
}

.goth-file-panel__interest-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.48rem;
}

.goth-file-panel__interest-row {
  display: flex;
  gap: 0.45rem;
  align-items: flex-start;
  padding: 0.48rem 0.52rem;
  border-radius: 4px;
  background: linear-gradient(
    165deg,
    rgba(56, 48, 42, 0.72) 0%,
    rgba(26, 22, 18, 0.88) 100%
  );
  border: 1px solid rgba(72, 62, 52, 0.42);
  box-shadow:
    inset 0 1px 0 rgba(255, 248, 236, 0.07),
    inset 0 -6px 16px rgba(4, 3, 2, 0.22);
}

.goth-file-panel__interest-bullet {
  flex-shrink: 0;
  width: 6px;
  height: 6px;
  margin-top: 0.38rem;
  border-radius: 2px;
  background: linear-gradient(145deg, rgba(200, 178, 148, 0.35), rgba(42, 36, 30, 0.92));
  box-shadow:
    inset 0 1px 1px rgba(255, 248, 236, 0.12),
    0 0 0 1px rgba(14, 12, 10, 0.55);
}

.goth-file-panel__interest-body {
  min-width: 0;
}

.goth-file-panel__interest-title {
  margin: 0;
  font-family: var(--g-font-display);
  font-size: 0.82rem;
  font-weight: 700;
  letter-spacing: 0.03em;
  line-height: 1.38;
  color: var(--file-fg);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.35);
}

.goth-file-panel__interest-desc {
  margin: 0.28rem 0 0;
  font-family: var(--g-font-narration);
  font-size: 0.74rem;
  line-height: 1.55;
  letter-spacing: 0.02em;
  color: var(--file-fg-muted);
}

.goth-file-panel__empty {
  margin: 0;
  padding: 0.28rem 0;
  font-family: var(--g-font-serif);
  font-size: 0.76rem;
  font-style: italic;
  line-height: 1.5;
  color: var(--file-fg-soft);
  opacity: 0.88;
}

.goth-file-panel__options-grid {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.goth-file-panel__opt-chip {
  min-height: 44px;
  padding: 0.45rem 0.52rem;
  font-size: 0.82rem;
  line-height: 1.35;
  color: var(--file-fg) !important;
  background: linear-gradient(175deg, rgba(72, 62, 54, 0.95), rgba(34, 28, 24, 0.98)) !important;
  border: 1px solid rgba(62, 54, 46, 0.65);
  box-shadow:
    var(--g-depth-chip),
    inset 0 1px 0 rgba(132, 118, 98, 0.1);
}

.goth-file-panel__opt-chip:hover:not(:disabled) {
  background: linear-gradient(175deg, rgba(82, 72, 62, 0.98), rgba(38, 32, 28, 1)) !important;
  border-color: rgba(118, 102, 82, 0.45);
}

.goth-file-panel__opt-chip .goth-option-id {
  font-size: 0.74rem;
  font-weight: 700;
  color: rgba(228, 206, 168, 0.98) !important;
}

.goth-file-panel__opt-chip .goth-option-text {
  color: rgba(238, 230, 218, 0.96) !important;
}
</style>
