<template>
  <BaseModal
    v-model="ui.saveManagerOpen"
    title="存档管理"
    subtitle="多分支保存与读取"
    icon="save"
    tone="cream"
    size="lg"
    id-base="lf-save"
  >
    <nav class="lf-save__branches" aria-label="分支筛选">
      <button
        v-for="b in branches"
        :id="`lf-save-branch-${b}`"
        :key="b"
        type="button"
        class="lf-save__branch"
        :class="{ 'lf-save__branch--on': branch === b }"
        @click="branch = b"
      >
        {{ b }}
      </button>
    </nav>

    <div class="lf-save__list">
      <article
        v-for="slot in filtered"
        :id="`lf-save-slot-${slot.id}`"
        :key="slot.id"
        class="lf-save__slot"
        :class="[`lf-save__slot--${slot.branchColor}`, { 'lf-save__slot--empty': slot.empty }]"
      >
        <template v-if="!slot.empty">
          <div class="lf-save__thumb" aria-hidden="true">
            <CharacterAvatar v-if="slot.thumbnailChar" :id="slot.thumbnailChar" size="md" ring :ring-color="charColor(slot.thumbnailChar)" />
            <span v-else class="lf-save__thumb-fallback"><AppIcon name="coffee" size="md" bold /></span>
          </div>
          <div class="lf-save__info">
            <div class="lf-save__info-top">
              <span class="lf-save__name">{{ slot.name }}</span>
              <span v-if="slot.isAuto" class="lf-save__auto">自动</span>
              <TagChip v-else :tone="slot.branchColor === 'neutral' ? 'neutral' : slot.branchColor" size="xs" icon="branch">{{ slot.branch }}</TagChip>
            </div>
            <p class="lf-save__meta">Day {{ slot.day }} · {{ slot.time }} · {{ slot.scene }}</p>
            <p class="lf-save__summary">{{ slot.summary }}</p>
            <div class="lf-save__row">
              <span class="lf-save__time"><AppIcon name="clock" size="xs" /> {{ slot.savedAt }}</span>
              <div class="lf-save__actions">
                <button :id="`lf-save-load-${slot.id}`" type="button" class="lf-save__act lf-save__act--load" @click="load(slot)">
                  <AppIcon name="play" size="xs" bold /> 读取
                </button>
                <button v-if="!slot.isAuto" :id="`lf-save-over-${slot.id}`" type="button" class="lf-save__act" @click="overwrite(slot)">
                  <AppIcon name="save" size="xs" bold /> 覆盖
                </button>
                <button v-if="!slot.isAuto" :id="`lf-save-del-${slot.id}`" type="button" class="lf-save__act lf-save__act--del" aria-label="删除存档" @click="remove(slot)">
                  <AppIcon name="trash" size="xs" bold />
                </button>
              </div>
            </div>
          </div>
        </template>

        <button v-else :id="`lf-save-new-${slot.id}`" type="button" class="lf-save__empty-btn" @click="overwrite(slot)">
          <span class="lf-save__empty-icon"><AppIcon name="plus" size="lg" bold /></span>
          <span class="lf-save__empty-text">保存到此空位</span>
        </button>
      </article>
    </div>
  </BaseModal>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import AppIcon from '../base/AppIcon.vue';
import BaseModal from '../base/BaseModal.vue';
import CharacterAvatar from '../base/CharacterAvatar.vue';
import TagChip from '../base/TagChip.vue';
import { useNotify } from '../../composables/useNotify';
import { getCharacter } from '../../data/characters';
import { useSaveStore } from '../../stores/useSaveStore';
import { useUiStore } from '../../stores/useUiStore';
import type { CharacterId, SaveSlot } from '../../types';

const ui = useUiStore();
const save = useSaveStore();
const notify = useNotify();

const branch = ref('全部');
const branches = ['全部', '主线', '林清和线', '苏晴线', '顾沉舟线'];

const filtered = computed(() => {
  if (branch.value === '全部') return save.slots;
  return save.slots.filter(s => s.branch === branch.value || s.empty || s.isAuto);
});

function charColor(id: CharacterId) {
  return getCharacter(id)?.color ?? 'var(--lf-strawberry)';
}

async function load(slot: SaveSlot) {
  const ok = await notify.confirm({
    title: '读取存档？',
    message: `将读取「${slot.name}」（Day ${slot.day}）。当前未保存的进度会丢失。`,
    confirmText: '读取',
    icon: 'play',
  });
  if (ok) {
    ui.saveManagerOpen = false;
    notify.success('读取成功', `欢迎回到 Day ${slot.day}`);
  }
}

async function overwrite(slot: SaveSlot) {
  if (!slot.empty) {
    const ok = await notify.confirm({
      title: '覆盖存档？',
      message: `「${slot.name}」将被当前进度覆盖，原内容无法恢复。`,
      confirmText: '覆盖',
      tone: 'danger',
      icon: 'save',
    });
    if (!ok) return;
  }
  save.writeSlot(slot.id);
  notify.success('已保存', slot.empty ? '新建了一个存档' : '存档已更新');
}

async function remove(slot: SaveSlot) {
  const ok = await notify.confirm({
    title: '删除存档？',
    message: `确定要删除「${slot.name}」吗？此操作无法撤销。`,
    confirmText: '删除',
    cancelText: '再想想',
    tone: 'danger',
    icon: 'trash',
  });
  if (ok) {
    save.clearSlot(slot.id);
    notify.warning('已删除', '存档位已清空');
  }
}
</script>

<style scoped lang="scss">
.lf-save__branches {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 14px;
}
.lf-save__branch {
  padding: 5px 11px;
  border: 2px solid var(--lf-ink);
  border-radius: var(--lf-radius-pill);
  background: var(--lf-surface);
  font-family: var(--lf-font-display);
  font-size: 11.5px;
  font-weight: 600;
  color: var(--lf-text-secondary);
  box-shadow: var(--lf-shadow-chunky-sm);
  transition: transform var(--lf-dur) var(--lf-ease-bounce), background var(--lf-dur), color var(--lf-dur);
}
.lf-save__branch:hover { transform: translateY(-2px); }
.lf-save__branch--on { background: var(--lf-lavender); color: var(--lf-ink); }

.lf-save__list {
  display: flex;
  flex-direction: column;
  gap: 11px;
}
.lf-save__slot {
  display: flex;
  gap: 11px;
  padding: 12px;
  border: 2.5px solid var(--lf-ink);
  border-radius: var(--lf-radius-lg);
  background: var(--lf-surface);
  box-shadow: var(--lf-shadow-chunky-sm);
  border-left-width: 7px;
}
.lf-save__slot--strawberry { border-left-color: var(--lf-strawberry); }
.lf-save__slot--peach { border-left-color: var(--lf-peach); }
.lf-save__slot--mint { border-left-color: var(--lf-mint-deep); }
.lf-save__slot--sky { border-left-color: var(--lf-sky-deep); }
.lf-save__slot--lavender { border-left-color: var(--lf-lavender-deep); }
.lf-save__slot--neutral { border-left-color: var(--lf-line-strong); }
.lf-save__slot--empty {
  border-style: dashed;
  border-left-width: 2.5px;
  background: var(--lf-surface-soft);
  padding: 0;
}

.lf-save__thumb { flex-shrink: 0; }
.lf-save__thumb-fallback {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  border: 2.5px solid var(--lf-ink);
  border-radius: var(--lf-radius-pill);
  background: var(--lf-butter);
  color: var(--lf-ink);
}
.lf-save__info { flex: 1; min-width: 0; }
.lf-save__info-top {
  display: flex;
  align-items: center;
  gap: 7px;
  margin-bottom: 3px;
}
.lf-save__name {
  font-family: var(--lf-font-display);
  font-weight: 700;
  font-size: 14px;
  color: var(--lf-text);
}
.lf-save__auto {
  padding: 1px 8px;
  border: 1.5px solid var(--lf-ink);
  border-radius: var(--lf-radius-pill);
  background: var(--lf-mint);
  font-size: 10px;
  font-weight: 700;
  color: var(--lf-ink);
}
.lf-save__meta { font-size: 11px; color: var(--lf-text-secondary); font-weight: 600; }
.lf-save__summary {
  margin: 4px 0 8px;
  font-size: 12px;
  color: var(--lf-text-secondary);
  line-height: 1.45;
}
.lf-save__row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}
.lf-save__time {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  font-size: 10.5px;
  color: var(--lf-text-muted);
  font-weight: 600;
}
.lf-save__actions { display: flex; gap: 6px; }
.lf-save__act {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  padding: 5px 10px;
  border: 2px solid var(--lf-ink);
  border-radius: var(--lf-radius-pill);
  background: var(--lf-surface-soft);
  font-family: var(--lf-font-display);
  font-size: 11px;
  font-weight: 700;
  color: var(--lf-text);
  box-shadow: var(--lf-shadow-chunky-sm);
  transition: transform var(--lf-dur) var(--lf-ease-bounce), background var(--lf-dur);
}
.lf-save__act:hover { transform: translateY(-2px); background: var(--lf-butter); }
.lf-save__act:active { transform: translateY(1px); box-shadow: none; }
.lf-save__act--load:hover { background: var(--lf-mint); }
.lf-save__act--del { padding: 5px 8px; }
.lf-save__act--del:hover { background: var(--lf-error); color: #fff; }

.lf-save__empty-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 9px;
  width: 100%;
  padding: 20px;
  border: none;
  background: transparent;
  color: var(--lf-text-secondary);
  font-family: var(--lf-font-display);
  font-weight: 700;
  font-size: 14px;
  transition: color var(--lf-dur);
}
.lf-save__empty-btn:hover { color: var(--lf-strawberry-deep); }
.lf-save__empty-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border: 2.5px dashed var(--lf-line-strong);
  border-radius: var(--lf-radius-pill);
  transition: border-color var(--lf-dur), transform var(--lf-dur) var(--lf-ease-bounce);
}
.lf-save__empty-btn:hover .lf-save__empty-icon { border-color: var(--lf-strawberry); transform: rotate(90deg); }
</style>
