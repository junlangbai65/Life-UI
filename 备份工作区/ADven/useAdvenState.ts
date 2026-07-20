import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import type {
  ChatMessage,
  EnemyEntry,
  EquipmentSlotInfo,
  EquipmentSlots,
  InterestPoint,
  InventoryItem,
  LevelSystem,
  NarrativeOption,
  PanelDefinition,
  PanelKey,
  RecipeEntry,
  RecipesBundle,
  WorldState,
} from './adven.types';
import {
  loadFromLatestMessage,
  parseInterest,
  parseMaintext,
  parseMaintextWithDice,
  parseOptions,
  parsePresence,
  parseWorld,
} from './utils/messageParser';
import { isUsableStatData, resolveStatDataFromMvuOrMessage } from './utils/mvuStatData';
import { parseStatDataFromMessage, replaceStatDataInMessage } from './utils/statDataParser';

type DragPayload =
  | { source: 'inventory'; itemId: string }
  | { source: 'equipment'; slot: keyof EquipmentSlots };

type NarrativeLayer = {
  messageId: number;
  maintext: string;
  dice: string[];
  world: WorldState | null;
  presence: string[];
  interests: InterestPoint[];
  options: NarrativeOption[];
};

const ADVEN_ACTIVE_INSTANCE_KEY = '__ADVEN_ACTIVE_INSTANCE__';

function asRecord<T = unknown>(value: unknown): Record<string, T> {
  if (value && typeof value === 'object' && !Array.isArray(value)) {
    return value as Record<string, T>;
  }
  return {};
}

function toNum(value: unknown, fallback = 0): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function clampSkillExp(value: unknown, fallback = 0): number {
  return Math.max(0, Math.min(100, toNum(value, fallback)));
}

function toStr(value: unknown, fallback = ''): string {
  if (typeof value === 'string') return value;
  if (value === null || value === undefined) return fallback;
  return String(value);
}

function toBool(value: unknown, fallback = false): boolean {
  if (typeof value === 'boolean') return value;
  return fallback;
}

export function useAdvenState() {
  const instanceToken = `adven-instance-${Date.now()}-${Math.random().toString(36).slice(2)}`;

  function getHostWindow(): (Window & typeof globalThis & Record<string, unknown>) | null {
    try {
      const parentWindow = window.parent;
      if (parentWindow && parentWindow !== window) {
        return parentWindow as Window & typeof globalThis & Record<string, unknown>;
      }
    } catch {
      // Cross-origin parent is inaccessible; fallback to current window.
    }
    return window as Window & typeof globalThis & Record<string, unknown>;
  }

  function claimActiveInstance() {
    const hostWindow = getHostWindow();
    if (!hostWindow) return;
    hostWindow[ADVEN_ACTIVE_INSTANCE_KEY] = instanceToken;
  }

  function isActiveInstance(): boolean {
    const hostWindow = getHostWindow();
    if (!hostWindow) return true;
    return hostWindow[ADVEN_ACTIVE_INSTANCE_KEY] === instanceToken;
  }

  function releaseActiveInstance() {
    const hostWindow = getHostWindow();
    if (!hostWindow) return;
    if (hostWindow[ADVEN_ACTIVE_INSTANCE_KEY] === instanceToken) {
      delete hostWindow[ADVEN_ACTIVE_INSTANCE_KEY];
    }
  }

  const panelDefinitions: PanelDefinition[] = [
    { key: 'character', title: '角色面板', desc: '查看基础属性、核心状态与战斗数值。', tip: '力量、敏捷、体质、感知、意志、魅力', icon: 'M12 2l3 5 6 1-4 4 1 6-6-3-6 3 1-6-4-4 6-1z' },
    { key: 'skills', title: '技能面板', desc: '管理生活技能、生产技能与成长记录。', tip: '采集、潜行、交涉、急救、锻造、调和、烹饪', icon: 'M4 4h16v4H4zm0 6h10v10H4zm12 0h4v10h-4z' },
    { key: 'inventory', title: '背包装备', desc: '拖拽装备完成穿戴和卸下。', tip: '装备栏与背包合并交互', icon: 'M4 7h16v13H4z M8 7V5h8v2' },
    { key: 'pet', title: '魔宠面板', desc: '查看魔宠属性、忠诚与疲劳状态。', tip: '魔宠列表与战斗能力', icon: 'M12 3l4 4h3v4l-3 3 1 5-5-2-5 2 1-5-3-3V7h3z' },
    { key: 'npc', title: 'NPC面板', desc: '查看NPC列表、关系与状态。', tip: 'NPC当前状态与关系', icon: 'M12 4a4 4 0 1 0 0.01 0z M4 21a8 8 0 0 1 16 0' },
    { key: 'social', title: '社交面板', desc: '追踪NPC关系网络、道德与声望。', tip: '好感度网络与阵营倾向', icon: 'M6 10a3 3 0 1 1 0-6 3 3 0 0 1 0 6m12 0a3 3 0 1 1 0-6 3 3 0 0 1 0 6M2 20a5 5 0 0 1 8-4m4 4a5 5 0 0 1 8-4' },
    { key: 'quest', title: '任务面板', desc: '查看任务目标与剧情描述。', tip: '主线、支线、探索目标', icon: 'M5 3h12l2 2v16H5z M8 8h8M8 12h8M8 16h5' },
    { key: 'status', title: '状态面板', desc: '查看浅中深标签与生理状态。', tip: '深度标签、体征记录、怀孕状态', icon: 'M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2m-1 5h2v6h-2zm0 8h2v2h-2z' },
    { key: 'achievement', title: '成就面板', desc: '追踪称号成就进展。', tip: '称号收集与达成条件', icon: 'M12 3l2.5 5 5.5.8-4 3.9.9 5.5L12 16l-4.9 2.2.9-5.5-4-3.9 5.5-.8z' },
    { key: 'recipe', title: '配方面板', desc: '查看掌握的图纸、秘方与食谱。', tip: '装备图纸、炼金秘方、秘传食谱', icon: 'M4 4h16v16H4z M8 8h8M8 12h8M8 16h6' },
    { key: 'production', title: '生产面板', desc: '跟踪锻造流程与工序进度。', tip: '当前锻造物与步骤进度', icon: 'M3 18l6-6 3 3 7-7 2 2-7 7 3 3-6 6z' },
  ];

  const activePanel = ref<PanelKey | null>(null);
  const autoScrollEnabled = ref(true);
  const draftInput = ref('');
  const sendMode = ref<'stream' | 'normal'>('stream');
  const isGenerating = ref(false);
  const composeStatusText = ref('状态：待命，可发送行动指令。');
  const refreshListeners = ref<EventOnReturn[]>([]);
  const selectedMaintextLayerOffset = ref<0 | 1 | 2>(0);
  const lastSyncedAssistantMessageId = ref<number | null>(null);
  const lastSyncedAssistantMessage = ref<string>('');
  const latestStatDataRoot = ref<Record<string, unknown> | null>(null);
  const maintextLayerEntries = ref<NarrativeLayer[]>([]);
  const maintextContent = ref('等待解析最新 assistant 楼层的 <maintext> 正文...');
  const maintextDice = ref<string[]>([]);
  const worldState = ref<WorldState | null>(null);
  const presenceList = ref<string[]>([]);
  const interestPoints = ref<InterestPoint[]>([]);
  const narrativeOptions = ref<NarrativeOption[]>([]);
  /** 当前「周围人物/世界信息等」所对应的 assistant 楼层 id，供界面 key 与调试 */
  const narrativeLayerSourceMessageId = ref<number | null>(null);

  const quickActions = [
    { id: 'scan', label: '环境观察', content: '我先仔细观察周围环境，寻找可互动线索。' },
    { id: 'stealth', label: '潜行推进', content: '我压低身位，沿阴影缓慢潜行前进。' },
    { id: 'negotiate', label: '尝试交涉', content: '我先放下武器，用平和语气尝试交涉。' },
    { id: 'camp', label: '营地整备', content: '我在安全处建立临时营地，整理物资并恢复体力。' },
  ];

  const chatMessages = ref<ChatMessage[]>([]);

  const character = ref({
    baseAttributes: [
      { name: '力量', value: 15 },
      { name: '敏捷', value: 12 },
      { name: '体质', value: 11 },
      { name: '感知', value: 10 },
      { name: '意志', value: 10 },
      { name: '魅力', value: 14 },
    ],
    hp: '30 / 30',
    mp: '20 / 20',
    atk: 5,
    def: 3,
    money: { gold: 0, silver: 50, copper: 0 },
  });

  const skills = ref({
    life: [
      { name: '采集', level: 1, exp: 0 },
      { name: '潜行', level: 1, exp: 0 },
      { name: '交涉', level: 1, exp: 0 },
      { name: '急救', level: 1, exp: 0 },
    ],
    production: [
      { name: '锻造', level: 1, exp: 0 },
      { name: '调和', level: 1, exp: 0 },
      { name: '烹饪', level: 1, exp: 0 },
    ],
    bodyDevelopment: [
      { name: '口技', value: 1 },
      { name: '手技', value: 1 },
      { name: '胸技', value: 1 },
      { name: '小穴', value: 1 },
      { name: '后庭', value: 1 },
      { name: '足技', value: 1 },
    ],
    growthRecords: [
      { name: '通过训练获得的HP', value: 0 },
      { name: '通过冥想获得的MP', value: 0 },
      { name: '初始HP', value: 30 },
      { name: '初始MP', value: 20 },
    ],
  });

  const equipmentSlotList: EquipmentSlotInfo[] = [
    { key: 'weapon', label: '武器栏' },
    { key: 'armor', label: '防具栏' },
    { key: 'accessory', label: '饰品栏' },
  ];

  const equipmentSlots = ref<EquipmentSlots>({
    weapon: {
      id: 'eq-weapon-initial',
      name: '学院制式单手剑',
      category: '装备',
      quality: '初始装备',
      description: '艾克兰德学园发放的标准武器，剑身笔直，适合初学者使用',
      baseATK: 5,
      entries: [],
      equipType: 'weapon',
    },
    armor: {
      id: 'eq-armor-initial',
      name: '轻便布甲',
      category: '装备',
      quality: '初始装备',
      description: '简单的布质护甲，提供基础防护，不影响行动',
      baseDEF: 3,
      entries: [],
      equipType: 'armor',
    },
    accessory: null,
  });

  const inventoryCategories: Array<InventoryItem['category']> = ['装备', '物品', '消耗品', '材料'];
  const activeInventoryCategory = ref<InventoryItem['category']>('装备');
  const inventoryFeedback = ref('拖拽装备到装备栏可穿戴；将装备栏道具拖回背包可卸下。');
  const inventoryItems = ref<InventoryItem[]>([]);
  const filteredInventoryItems = computed(() => inventoryItems.value.filter(item => item.category === activeInventoryCategory.value));

  const pets = ref<Array<{ name: string; brief: string; race: string; tier: string; hp: string; mp: string; loyalty: string; fatigue: string; atk: number; def: number }>>([]);
  const npcList = ref<Array<{ name: string; hp: string; mp: string; relation: number; status: string[] }>>([]);
  const social = ref<{ npcNetwork: Array<{ name: string; role: string; favorability: number }>; morality: string; reputation: string }>({ npcNetwork: [], morality: '0', reputation: '0' });
  const quests = ref<Array<{ name: string; type: string; objective: string; description: string }>>([]);
  const statusDepthTags = ref<{ shallow: string[]; middle: Array<{ name: string; value: string }>; deep: string[] }>({ shallow: [], middle: [], deep: [] });
  const bodyStatus = ref<{ internalSemenVolume: number; sexCount: number; pregnancy: { isPregnant: boolean; father: string; progress: number; eta: number } }>({
    internalSemenVolume: 0,
    sexCount: 0,
    pregnancy: { isPregnant: false, father: '', progress: 0, eta: 0 },
  });
  const achievements = ref<Array<{ title: string; condition: string }>>([]);
  const recipes = ref<RecipesBundle>({ blueprints: [], alchemy: [], cooking: [] });
  const levelSystem = ref<LevelSystem>({ level: 1, currentExp: 0, requiredExp: 100 });
  const enemyList = ref<EnemyEntry[]>([]);
  const production = ref<{
    currentItem: string;
    steps: Array<{ name: string; progress: number }>;
    items: Array<{ name: string; recipeName: string; currentStep: number; totalSteps: number; progress: number; consumed: string[] }>;
    selectedIndex: number;
  }>({ currentItem: '暂无', steps: [], items: [], selectedIndex: 0 });

  const currentPanel = computed(() => panelDefinitions.find(panel => panel.key === activePanel.value));
  const dragPayload = ref<DragPayload | null>(null);
  const maintextLayerTabs = computed(() => {
    const count = maintextLayerEntries.value.length;
    return [
      { key: 0 as const, label: '现在', available: count >= 1 },
      { key: 1 as const, label: '之前的事', available: count >= 2 },
      { key: 2 as const, label: '再之前的事', available: count >= 3 },
    ];
  });

  function openPanel(panelKey: PanelKey) {
    activePanel.value = panelKey;
  }

  function closePanel() {
    activePanel.value = null;
  }

  function applyQuickAction(content: string) {
    draftInput.value = content;
    composeStatusText.value = '状态：已填入快捷行动，可直接发送。';
  }

  function applyNarrativeOption(optionText: string) {
    draftInput.value = optionText;
    composeStatusText.value = '状态：已填入选项，可发送。';
  }

  function refreshChatMessagesFromTavern() {
    const lastMessageId = getLastMessageId();
    if (lastMessageId < 0) {
      chatMessages.value = [];
      return;
    }
    const begin = Math.max(0, lastMessageId - 15);
    const messages = getChatMessages(`${begin}-${lastMessageId}`, { role: 'all', hide_state: 'unhidden' });
    chatMessages.value = messages.map(message => ({
      id: String(message.message_id),
      role: message.role === 'assistant' ? 'assistant' : message.role === 'system' ? 'system' : 'user',
      content: message.message ?? '',
    }));
  }

  function syncMaintextContentBySelectedLayer() {
    const selectedEntry = maintextLayerEntries.value[selectedMaintextLayerOffset.value];
    if (!selectedEntry) {
      narrativeLayerSourceMessageId.value = null;
      maintextContent.value = '未在最近三楼中检测到 <maintext> 标签内容。';
      maintextDice.value = [];
      worldState.value = null;
      presenceList.value = [];
      interestPoints.value = [];
      narrativeOptions.value = [];
      return;
    }
    narrativeLayerSourceMessageId.value = selectedEntry.messageId;
    maintextContent.value = selectedEntry.maintext;
    // 与 maintextLayerEntries 内对象脱钩，避免深度响应式代理共享导致切换楼层时界面不刷新
    maintextDice.value = [...selectedEntry.dice];
    worldState.value = selectedEntry.world ? { ...selectedEntry.world } : null;
    presenceList.value = [...selectedEntry.presence];
    interestPoints.value = selectedEntry.interests.map(p => ({ ...p }));
    narrativeOptions.value = selectedEntry.options.map(o => ({ ...o }));
  }

  function refreshMaintextLayersFromTavern() {
    const lastMessageId = getLastMessageId();
    if (lastMessageId < 0) {
      maintextLayerEntries.value = [];
      syncMaintextContentBySelectedLayer();
      return;
    }

    const begin = Math.max(0, lastMessageId - 60);
    // Structured assistant floors are intentionally hidden in chat UI,
    // but they still need to be included for parser-driven rendering.
    const assistantMessages = getChatMessages(`${begin}-${lastMessageId}`, { role: 'assistant', hide_state: 'all' });
    const parsedLayers = assistantMessages
      .map(message => {
        const content = message.message ?? '';
        const { maintext, dices } = parseMaintextWithDice(content);
        return {
          messageId: message.message_id,
          maintext,
          dice: dices,
          world: parseWorld(content),
          presence: parsePresence(content),
          interests: parseInterest(content),
          options: parseOptions(content),
        };
      })
      .filter(layer => !!layer.maintext)
      .slice(-3)
      .reverse();

    maintextLayerEntries.value = parsedLayers;
    if (selectedMaintextLayerOffset.value >= maintextLayerEntries.value.length) {
      selectedMaintextLayerOffset.value = 0;
    }
    syncMaintextContentBySelectedLayer();
  }

  function switchMaintextLayer(offset: 0 | 1 | 2) {
    if (offset >= maintextLayerEntries.value.length) return;
    selectedMaintextLayerOffset.value = offset;
    syncMaintextContentBySelectedLayer();
  }

  async function submitMessage() {
    if (!isActiveInstance()) {
      composeStatusText.value = '状态：当前楼层不是活动实例，请在最新楼层操作。';
      return;
    }
    const trimmed = draftInput.value.trim();
    if (!trimmed || isGenerating.value) return;
    const backupInput = draftInput.value;
    let createdUserMessageId: number | null = null;
    let assistantCreated = false;
    isGenerating.value = true;
    composeStatusText.value = '状态：发送中，等待模型回复...';

    try {
      const lastBeforeCreate = getLastMessageId();
      await createChatMessages([{ role: 'user', message: trimmed }], { refresh: 'affected' });
      const lastAfterCreate = getLastMessageId();
      if (lastAfterCreate > lastBeforeCreate) {
        createdUserMessageId = lastAfterCreate;
      }
      draftInput.value = '';
      refreshChatMessagesFromTavern();

      const assistantMessage = (await generate({ should_stream: sendMode.value === 'stream' })).trim();
      if (!assistantMessage) {
        throw new Error('模型返回为空，无法创建 assistant 消息。');
      }

      await createChatMessages([{ role: 'assistant', message: assistantMessage }], { refresh: 'affected' });
      assistantCreated = true;
      composeStatusText.value = '状态：回合完成，等待下一步行动。';

      const latestMessageId = getLastMessageId();
      if (latestMessageId >= 0) {
        refreshFromAssistantMessage(latestMessageId);
      }
      refreshChatMessagesFromTavern();
    } catch (error) {
      console.error('[ADven] 发送指令失败:', error);
      composeStatusText.value = '状态：发送失败，已回滚到发送前。';
      if (!assistantCreated && createdUserMessageId !== null) {
        try {
          await deleteChatMessages([createdUserMessageId], { refresh: 'affected' });
        } catch (rollbackError) {
          console.error('[ADven] 回滚 user 消息失败:', rollbackError);
        }
      }
      draftInput.value = backupInput;
      refreshChatMessagesFromTavern();
    } finally {
      isGenerating.value = false;
    }
  }

  function applyStatData(statDataRoot: Record<string, unknown>) {
    const protagonist = asRecord(statDataRoot['主角']);

    const basic = asRecord(protagonist['基础属性']);
    character.value = {
      baseAttributes: [
        { name: '力量', value: toNum(basic['力量'], character.value.baseAttributes[0].value) },
        { name: '敏捷', value: toNum(basic['敏捷'], character.value.baseAttributes[1].value) },
        { name: '体质', value: toNum(basic['体质'], character.value.baseAttributes[2].value) },
        { name: '感知', value: toNum(basic['感知'], character.value.baseAttributes[3].value) },
        { name: '意志', value: toNum(basic['意志'], character.value.baseAttributes[4].value) },
        { name: '魅力', value: toNum(basic['魅力'], character.value.baseAttributes[5].value) },
      ],
      hp: `${toNum(asRecord(protagonist['核心状态'])['当前HP'], 0)} / ${toNum(asRecord(protagonist['核心状态'])['最大HP'], 1)}`,
      mp: `${toNum(asRecord(protagonist['核心状态'])['当前MP'], 0)} / ${toNum(asRecord(protagonist['核心状态'])['最大MP'], 1)}`,
      atk: toNum(asRecord(protagonist['战斗属性'])['基础ATK'], 0),
      def: toNum(asRecord(protagonist['战斗属性'])['基础DEF'], 0),
      money: {
        gold: toNum(asRecord(protagonist['金钱'])['金币'], 0),
        silver: toNum(asRecord(protagonist['金钱'])['银币'], 0),
        copper: toNum(asRecord(protagonist['金钱'])['铜币'], 0),
      },
    };

    const levelBlock = asRecord(protagonist['等级系统']);
    levelSystem.value = {
      level: toNum(levelBlock['当前等级'], levelSystem.value.level),
      currentExp: toNum(levelBlock['当前经验值'], 0),
      requiredExp: Math.max(1, toNum(levelBlock['升级所需经验值'], 100)),
    };

    const lifeRecord = asRecord<Record<string, unknown>>(protagonist['生活技能']);
    const productionRecord = asRecord<Record<string, unknown>>(protagonist['生产技能']);
    const bodyRecord = asRecord<number>(protagonist['身体部位开发度']);
    const growthRecord = asRecord<number>(protagonist['属性成长记录']);

    skills.value = {
      life: ['采集', '潜行', '交涉', '急救'].map(name => {
        const item = asRecord(lifeRecord[name]);
        return { name, level: toNum(item['LV'], 1), exp: clampSkillExp(item['经验'], 0) };
      }),
      production: ['锻造', '调和', '烹饪'].map(name => {
        const item = asRecord(productionRecord[name]);
        return { name, level: toNum(item['LV'], 1), exp: clampSkillExp(item['经验'], 0) };
      }),
      bodyDevelopment: ['口技', '手技', '胸技', '小穴', '后庭', '足技'].map(name => ({ name, value: toNum(bodyRecord[name], 1) })),
      growthRecords: [
        { name: '通过训练获得的HP', value: toNum(growthRecord['通过训练获得的HP'], 0) },
        { name: '通过冥想获得的MP', value: toNum(growthRecord['通过冥想获得的MP'], 0) },
        { name: '初始HP', value: toNum(growthRecord['初始HP'], 0) },
        { name: '初始MP', value: toNum(growthRecord['初始MP'], 0) },
      ],
    };

    const equipment = asRecord(protagonist['装备栏']);
    const weapon = asRecord(equipment['武器']);
    const armor = asRecord(equipment['防具']);
    const accessory = asRecord(equipment['饰品']);
    equipmentSlots.value = {
      weapon: toStr(weapon['名称'])
        ? {
            id: 'slot-weapon',
            name: toStr(weapon['名称']),
            category: '装备',
            quality: '已装备',
            description: toStr(weapon['描述']),
            baseATK: toNum(weapon['基础ATK'], 0),
            entries: Array.isArray(weapon['词条']) ? (weapon['词条'] as string[]) : [],
            equipType: 'weapon',
          }
        : null,
      armor: toStr(armor['名称'])
        ? {
            id: 'slot-armor',
            name: toStr(armor['名称']),
            category: '装备',
            quality: '已装备',
            description: toStr(armor['描述']),
            baseDEF: toNum(armor['基础DEF'], 0),
            entries: Array.isArray(armor['词条']) ? (armor['词条'] as string[]) : [],
            equipType: 'armor',
          }
        : null,
      accessory: toStr(accessory['名称'])
        ? {
            id: 'slot-accessory',
            name: toStr(accessory['名称']),
            category: '装备',
            quality: '已装备',
            description: toStr(accessory['描述']),
            entries: Array.isArray(accessory['词条']) ? (accessory['词条'] as string[]) : [],
            equipType: 'accessory',
          }
        : null,
    };

    const bagEquip = asRecord<Record<string, unknown>>(protagonist['背包_装备']);
    const bagItems = asRecord<Record<string, unknown>>(protagonist['背包_物品']);
    const bagConsumables = asRecord<Record<string, unknown>>(protagonist['背包_消耗品']);
    const bagMaterials = asRecord<Record<string, unknown>>(protagonist['背包_材料']);
    const mergedInventory: InventoryItem[] = [];

    Object.entries(bagEquip).forEach(([name, raw], index) => {
      const item = asRecord(raw);
      const type = toStr(item['类型'], '武器');
      mergedInventory.push({
        id: `bag-equip-${index}-${name}`,
        name,
        category: '装备',
        quality: '背包装备',
        description: toStr(item['描述']),
        baseATK: toNum(item['基础ATK'], 0),
        baseDEF: toNum(item['基础DEF'], 0),
        entries: Array.isArray(item['词条']) ? (item['词条'] as string[]) : [],
        equipType: type === '防具' ? 'armor' : type === '饰品' ? 'accessory' : 'weapon',
      });
    });

    Object.entries(bagItems).forEach(([name, raw], index) => {
      const item = asRecord(raw);
      const quantity = toNum(item['数量'], 0);
      mergedInventory.push({
        id: `bag-item-${index}-${name}`,
        name,
        category: '物品',
        quality: `数量 ${quantity}`,
        quantity,
        description: toStr(item['描述']),
      });
    });

    Object.entries(bagConsumables).forEach(([name, raw], index) => {
      const item = asRecord(raw);
      const quantity = toNum(item['数量'], 0);
      mergedInventory.push({
        id: `bag-consume-${index}-${name}`,
        name,
        category: '消耗品',
        quality: `数量 ${quantity}`,
        quantity,
        description: toStr(item['效果描述'] ?? item['描述']),
      });
    });

    Object.entries(bagMaterials).forEach(([name, raw], index) => {
      const item = asRecord(raw);
      const quantity = toNum(item['数量'], 0);
      mergedInventory.push({
        id: `bag-material-${index}-${name}`,
        name,
        category: '材料',
        quality: `数量 ${quantity}`,
        quantity,
        description: toStr(item['描述']),
      });
    });
    inventoryItems.value = mergedInventory;

    const petRecord = asRecord<Record<string, unknown>>(protagonist['魔宠列表']);
    pets.value = Object.entries(petRecord).map(([name, raw]) => {
      const pet = asRecord(raw);
      return {
        name,
        brief: toStr(pet['简介']),
        race: toStr(pet['种族']),
        tier: `T${toNum(pet['T级'], 1)}`,
        hp: `${toNum(pet['当前HP'], 0)} / ${toNum(pet['最大HP'], 1)}`,
        mp: `${toNum(pet['当前MP'], 0)} / ${toNum(pet['最大MP'], 1)}`,
        loyalty: `${toNum(pet['忠诚度'], 0)}%`,
        fatigue: `${toNum(pet['疲劳度'], 0)}%`,
        atk: toNum(pet['基础ATK'], 0),
        def: toNum(pet['基础DEF'], 0),
      };
    });

    const relationRecord = asRecord<Record<string, unknown>>(protagonist['NPC关系网络']);
    social.value = {
      npcNetwork: Object.entries(relationRecord).map(([name, raw]) => {
        const relation = asRecord(raw);
        return { name, role: 'NPC', favorability: toNum(relation['好感度'], 0) };
      }),
      morality: String(toNum(protagonist['道德倾向'], 0)),
      reputation: String(toNum(protagonist['声望'], 0)),
    };

    const questRecord = asRecord<Record<string, unknown>>(statDataRoot['任务列表']);
    quests.value = Object.entries(questRecord).map(([name, raw]) => {
      const item = asRecord(raw);
      return {
        name,
        type: '任务',
        objective: toStr(item['当前目标']),
        description: toStr(item['描述']),
      };
    });

    const npcRecord = asRecord<Record<string, unknown>>(statDataRoot['NPC列表']);
    npcList.value = Object.entries(npcRecord).map(([name, raw]) => {
      const npc = asRecord(raw);
      const status = Array.isArray(npc['状态']) ? (npc['状态'] as string[]) : [];
      return {
        name,
        hp: `${toNum(npc['当前HP'], 0)} / ${toNum(npc['最大HP'], 1)}`,
        mp: `${toNum(npc['当前MP'], 0)} / ${toNum(npc['最大MP'], 1)}`,
        relation: toNum(npc['关系'], 0),
        status,
      };
    });

    const enemyRecord = asRecord<Record<string, unknown>>(statDataRoot['敌人列表']);
    enemyList.value = Object.entries(enemyRecord).map(([name, raw]) => {
      const e = asRecord(raw);
      const statusBar = e['状态栏'];
      return {
        name,
        race: toStr(e['种族']),
        tier: toNum(e['T级'], 1),
        level: toNum(e['等级'], 1),
        currentHp: toNum(e['当前HP'], 0),
        maxHp: Math.max(1, toNum(e['最大HP'], 1)),
        currentMp: toNum(e['当前MP'], 0),
        maxMp: Math.max(1, toNum(e['最大MP'], 1)),
        atk: toNum(e['基础ATK'], 0),
        def: toNum(e['基础DEF'], 0),
        status: Array.isArray(statusBar) ? (statusBar as string[]) : [],
      };
    });

    const shallow = Array.isArray(protagonist['浅层标签']) ? (protagonist['浅层标签'] as string[]) : [];
    const deep = Array.isArray(protagonist['深层标签']) ? (protagonist['深层标签'] as string[]) : [];
    const middleRecord = asRecord<Record<string, unknown>>(protagonist['中层标签']);
    statusDepthTags.value = {
      shallow,
      middle: Object.entries(middleRecord).map(([name, raw]) => {
        const item = asRecord(raw);
        return { name, value: `${toNum(item['获得天数'], 0)}天` };
      }),
      deep,
    };

    const physiology = asRecord(protagonist['生理状态']);
    const pregnancy = asRecord(protagonist['怀孕状态']);
    bodyStatus.value = {
      internalSemenVolume: toNum(physiology['体内精液量'], 0),
      sexCount: toNum(physiology['sex总次数'], 0),
      pregnancy: {
        isPregnant: toBool(pregnancy['是否怀孕'], false),
        father: toStr(pregnancy['父亲']),
        progress: toNum(pregnancy['孕期进度'], 0),
        eta: toNum(pregnancy['预产期'], 0),
      },
    };

    const titleRecord = asRecord<Record<string, unknown>>(protagonist['称号成就']);
    achievements.value = Object.entries(titleRecord).map(([title, raw]) => {
      const item = asRecord(raw);
      const days = toNum(item['获得天数'], 0);
      const desc = toStr(item['描述'], '无描述');
      return { title, condition: `获得天数 ${days} · ${desc}` };
    });

    const recipeRecord = asRecord(protagonist['掌握配方']);
    function mapRecipeBook(raw: unknown): RecipeEntry[] {
      return Object.entries(asRecord(raw)).map(([recipeName, value]) => {
        const meta = asRecord(value);
        return { name: recipeName, description: toStr(meta['描述']) };
      });
    }
    recipes.value = {
      blueprints: mapRecipeBook(recipeRecord['装备图纸']),
      alchemy: mapRecipeBook(recipeRecord['炼金秘方']),
      cooking: mapRecipeBook(recipeRecord['秘传食谱']),
    };

    const forgeRecord = asRecord<Record<string, unknown>>(protagonist['锻造进度']);
    const forgeItems = Object.entries(forgeRecord).map(([itemName, raw]) => {
      const forge = asRecord(raw);
      const currentStep = toNum(forge['当前工序'], 1);
      const totalStep = Math.max(1, toNum(forge['总工序数'], 1));
      const progress = toNum(forge['工序进度'], 0);
      const consumed = Object.entries(asRecord<number>(forge['已消耗材料'])).map(([mat, count]) => `${mat} x${toNum(count, 0)}`);
      return {
        name: itemName,
        recipeName: toStr(forge['配方名'], ''),
        currentStep,
        totalSteps: totalStep,
        progress,
        consumed,
      };
    });
    if (forgeItems.length > 0) {
      const selected = Math.min(production.value.selectedIndex, forgeItems.length - 1);
      const activeForge = forgeItems[selected];
      production.value = {
        currentItem: activeForge.name,
        steps: Array.from({ length: activeForge.totalSteps }, (_, idx) => {
          const stepNo = idx + 1;
          return {
            name: `工序 ${stepNo}`,
            progress: stepNo < activeForge.currentStep ? 100 : stepNo === activeForge.currentStep ? activeForge.progress : 0,
          };
        }),
        items: forgeItems,
        selectedIndex: selected,
      };
    } else {
      production.value = { currentItem: '暂无', steps: [], items: [], selectedIndex: 0 };
    }
  }

  function selectProductionItem(index: number) {
    if (index < 0 || index >= production.value.items.length) return;
    production.value.selectedIndex = index;
    const item = production.value.items[index];
    production.value.currentItem = item.name;
    production.value.steps = Array.from({ length: item.totalSteps }, (_, idx) => {
      const stepNo = idx + 1;
      return {
        name: `工序 ${stepNo}`,
        progress: stepNo < item.currentStep ? 100 : stepNo === item.currentStep ? item.progress : 0,
      };
    });
  }

  function refreshMaintextAndStatDataFromLatestAssistant() {
    const { fullMessage, messageId } = loadFromLatestMessage();
    refreshMaintextLayersFromTavern();
    syncHiddenRawTextForStructuredAssistant();

    if (!fullMessage) return;
    if (typeof messageId === 'number') {
      lastSyncedAssistantMessageId.value = messageId;
    }
    lastSyncedAssistantMessage.value = fullMessage;
    const statData = resolveStatDataFromMvuOrMessage(
      fullMessage,
      getCurrentMessageId(),
      typeof messageId === 'number' ? messageId : null,
    );
    if (statData) {
      latestStatDataRoot.value = statData;
      applyStatData(statData);
      void eventEmit('adven:state_updated');
    }
  }

  function hasStatusPlaceholder(message: string) {
    return /<StatusPlaceHolderImpl\s*\/>/i.test(message);
  }

  function hasRenderableTag(message: string) {
    return /<(maintext|stat_data|option|options|world|presence|interest|dice)\b[^>]*>/i.test(message)
      || hasStatusPlaceholder(message);
  }

  function hasRenderablePayload(message: string) {
    if (!message) return false;
    if (hasStatusPlaceholder(message)) return true;
    if (parseMaintext(message).trim()) return true;
    if (parseOptions(message).length > 0) return true;
    if (parsePresence(message).length > 0) return true;
    if (parseInterest(message).length > 0) return true;
    if (parseWorld(message)) return true;
    if (parseStatDataFromMessage(message)) return true;
    return false;
  }

  function getPossibleHostDocuments(): Document[] {
    const docs: Document[] = [document];
    try {
      const parentWindow = window.parent;
      if (parentWindow && parentWindow !== window) {
        const parentDoc = parentWindow.document;
        if (parentDoc && parentDoc !== document) docs.push(parentDoc);
      }
    } catch (error) {
      console.warn('[ADven] 无法访问父页面文档，跳过父页面纯文本隐藏:', error);
    }
    return docs;
  }

  function applyHiddenStateToMesText($mesText: JQuery<HTMLElement>, shouldHide: boolean) {
    $mesText.each((_, mesTextElement) => {
      // 兼容旧版本: 恢复错误地隐藏了整个 `.mes_text` 的情况
      if (mesTextElement.getAttribute('data-adven-hidden-raw-text') === '1') {
        mesTextElement.classList.remove('adven-hidden-raw-text');
        mesTextElement.removeAttribute('data-adven-hidden-raw-text');
        mesTextElement.style.removeProperty('display');
      }

      const allNodes = Array.from(mesTextElement.querySelectorAll<HTMLElement>('*'));
      const keepNodes = new Set<HTMLElement>();
      const iframeNodes = mesTextElement.querySelectorAll<HTMLElement>('iframe');

      iframeNodes.forEach(iframeElement => {
        keepNodes.add(iframeElement);
        let cursor = iframeElement.parentElement;
        while (cursor && cursor !== mesTextElement) {
          keepNodes.add(cursor);
          cursor = cursor.parentElement;
        }
      });

      allNodes.forEach(node => {
        const hiddenByAdven = node.getAttribute('data-adven-hidden-raw-node') === '1';
        if (shouldHide) {
          if (keepNodes.has(node)) return;
          node.setAttribute('data-adven-hidden-raw-node', '1');
          node.classList.add('adven-hidden-raw-text');
          node.style.setProperty('display', 'none', 'important');
          return;
        }
        if (hiddenByAdven) {
          node.removeAttribute('data-adven-hidden-raw-node');
          node.classList.remove('adven-hidden-raw-text');
          node.style.removeProperty('display');
        }
      });
    });
  }

  function setRawTextHiddenState(messageId: number, shouldHide: boolean) {
    if (!isActiveInstance()) return;
    getPossibleHostDocuments().forEach(hostDoc => {
      const $host = $(hostDoc);
      const $mesText = $host.find(`#chat .mes[mesid='${messageId}'] .mes_text`);
      if ($mesText.length > 0) applyHiddenStateToMesText($mesText as JQuery<HTMLElement>, shouldHide);
    });
  }

  function syncHiddenRawTextForStructuredAssistant() {
    if (!isActiveInstance()) return;
    const lastMessageId = getLastMessageId();
    if (lastMessageId < 0) return;
    const begin = Math.max(0, lastMessageId - 160);
    const assistantMessages = getChatMessages(`${begin}-${lastMessageId}`, { role: 'assistant', hide_state: 'all' });
    if (!assistantMessages || assistantMessages.length === 0) return;

    assistantMessages.forEach(message => {
      const content = message.message ?? '';
      const shouldHide = hasRenderableTag(content) && hasRenderablePayload(content);
      setRawTextHiddenState(message.message_id, shouldHide);
    });
  }

  function restoreAllHiddenRawText() {
    if (!isActiveInstance()) return;
    getPossibleHostDocuments().forEach(hostDoc => {
      const $host = $(hostDoc);
      const $mesText = $host.find('#chat .mes .mes_text');
      if ($mesText.length > 0) applyHiddenStateToMesText($mesText as JQuery<HTMLElement>, false);
    });
  }

  function refreshFromAssistantMessage(messageId: number) {
    if (!isActiveInstance()) return;
    const messages = getChatMessages(messageId, { role: 'assistant' });
    if (!messages || messages.length === 0) return;
    const latestAssistant = messages[0];
    if (latestAssistant.message_id === lastSyncedAssistantMessageId.value) return;

    const content = latestAssistant.message || '';
    const shouldHideRawText = hasRenderableTag(content) && hasRenderablePayload(content);
    setRawTextHiddenState(latestAssistant.message_id, shouldHideRawText);
    if (!shouldHideRawText) return;
    refreshMaintextLayersFromTavern();

    const statData = resolveStatDataFromMvuOrMessage(content, latestAssistant.message_id, getCurrentMessageId());
    if (statData) {
      latestStatDataRoot.value = statData;
      applyStatData(statData);
      void eventEmit('adven:state_updated', latestAssistant.message_id);
    }

    lastSyncedAssistantMessageId.value = latestAssistant.message_id;
    lastSyncedAssistantMessage.value = content;
  }

  function buildStatDataForPersistence(): Record<string, unknown> | null {
    if (!latestStatDataRoot.value) return null;
    const root = JSON.parse(JSON.stringify(latestStatDataRoot.value)) as Record<string, unknown>;
    const protagonist = asRecord(root['主角']);
    root['主角'] = protagonist;

    const equipRoot = asRecord(protagonist['装备栏']);
    protagonist['装备栏'] = equipRoot;
    const weapon = equipmentSlots.value.weapon;
    const armor = equipmentSlots.value.armor;
    const accessory = equipmentSlots.value.accessory;
    equipRoot['武器'] = {
      名称: weapon?.name ?? '',
      描述: weapon?.description ?? '',
      基础ATK: toNum(weapon?.baseATK, 0),
      词条: weapon?.entries ?? [],
    };
    equipRoot['防具'] = {
      名称: armor?.name ?? '',
      描述: armor?.description ?? '',
      基础DEF: toNum(armor?.baseDEF, 0),
      词条: armor?.entries ?? [],
    };
    equipRoot['饰品'] = {
      名称: accessory?.name ?? '',
      描述: accessory?.description ?? '',
      词条: accessory?.entries ?? [],
    };

    const bagEquip: Record<string, unknown> = {};
    for (const item of inventoryItems.value.filter(item => item.category === '装备')) {
      bagEquip[item.name] = {
        描述: item.description ?? '',
        类型: item.equipType === 'armor' ? '防具' : item.equipType === 'accessory' ? '饰品' : '武器',
        基础ATK: toNum(item.baseATK, 0),
        基础DEF: toNum(item.baseDEF, 0),
        词条: item.entries ?? [],
      };
    }
    protagonist['背包_装备'] = bagEquip;
    return root;
  }

  async function persistEquipmentStateToStatData() {
    const targetMessageId = lastSyncedAssistantMessageId.value;
    const targetMessage = lastSyncedAssistantMessage.value;
    if (!targetMessageId || !targetMessage) {
      inventoryFeedback.value = '无法同步：未找到可回写的 assistant 楼层。';
      return;
    }
    const updatedRoot = buildStatDataForPersistence();
    if (!updatedRoot) {
      inventoryFeedback.value = '无法同步：最新楼层没有可解析的 stat_data。';
      return;
    }
    const updatedMessage = replaceStatDataInMessage(targetMessage, updatedRoot);
    try {
      await setChatMessages([{ message_id: targetMessageId, message: updatedMessage }], { refresh: 'none' });
      try {
        updateVariablesWith(
          variables => {
            _.set(variables, 'stat_data', updatedRoot);
            return variables;
          },
          { type: 'message', message_id: targetMessageId },
        );
      } catch (varError) {
        console.warn('[ADven] 写入消息楼层 stat_data 变量失败（MVU 可能未同步）:', varError);
      }
      latestStatDataRoot.value = updatedRoot;
      lastSyncedAssistantMessage.value = updatedMessage;
      void eventEmit('adven:state_updated', targetMessageId);
    } catch (error) {
      console.error('[ADven] 同步装备到 stat_data 失败:', error);
      inventoryFeedback.value = '同步失败：已触发重新同步，请稍后重试。';
      void eventEmit('adven:request_refresh');
    }
  }

  function onDragStartInventory(itemId: string) {
    dragPayload.value = { source: 'inventory', itemId };
  }

  function onDragStartEquipment(slot: keyof EquipmentSlots) {
    if (!equipmentSlots.value[slot]) return;
    dragPayload.value = { source: 'equipment', slot };
  }

  async function onDropToEquip(slot: keyof EquipmentSlots) {
    if (!dragPayload.value || dragPayload.value.source !== 'inventory') return;
    const payload = dragPayload.value;
    const itemIndex = inventoryItems.value.findIndex(entry => entry.id === payload.itemId);
    if (itemIndex < 0) return;
    const item = inventoryItems.value[itemIndex];
    if (item.equipType !== slot) {
      inventoryFeedback.value = `穿戴失败：${item.name} 不能放入 ${slotLabel(slot)}。`;
      dragPayload.value = null;
      return;
    }
    const currentEquipped = equipmentSlots.value[slot];
    equipmentSlots.value[slot] = item;
    inventoryItems.value.splice(itemIndex, 1);
    if (currentEquipped) inventoryItems.value.push(currentEquipped);
    inventoryFeedback.value = `穿戴成功：${item.name} 已装备到 ${slotLabel(slot)}。`;
    dragPayload.value = null;
    await persistEquipmentStateToStatData();
  }

  async function onDropToInventory() {
    if (!dragPayload.value || dragPayload.value.source !== 'equipment') return;
    const slot = dragPayload.value.slot;
    const equippedItem = equipmentSlots.value[slot];
    if (!equippedItem) {
      dragPayload.value = null;
      return;
    }
    equipmentSlots.value[slot] = null;
    inventoryItems.value.push(equippedItem);
    inventoryFeedback.value = `卸下成功：${equippedItem.name} 已回到背包。`;
    dragPayload.value = null;
    await persistEquipmentStateToStatData();
  }

  function slotLabel(slot: keyof EquipmentSlots) {
    const map: Record<keyof EquipmentSlots, string> = { weapon: '武器栏', armor: '防具栏', accessory: '饰品栏' };
    return map[slot];
  }

  onMounted(() => {
    claimActiveInstance();
    refreshChatMessagesFromTavern();
    if (isActiveInstance()) {
      refreshMaintextAndStatDataFromLatestAssistant();
      syncHiddenRawTextForStructuredAssistant();
    }
    refreshListeners.value = [
      eventOn(tavern_events.MESSAGE_RECEIVED, messageId => {
        if (!isActiveInstance()) return;
        refreshChatMessagesFromTavern();
        refreshFromAssistantMessage(messageId);
      }),
      eventOn(tavern_events.MESSAGE_UPDATED, messageId => {
        if (!isActiveInstance()) return;
        refreshChatMessagesFromTavern();
        refreshFromAssistantMessage(messageId);
      }),
      eventOn(tavern_events.GENERATION_ENDED, messageId => {
        if (!isActiveInstance()) return;
        refreshChatMessagesFromTavern();
        refreshFromAssistantMessage(messageId);
      }),
      eventOn(tavern_events.CHAT_CHANGED, () => {
        if (!isActiveInstance()) return;
        lastSyncedAssistantMessageId.value = null;
        refreshChatMessagesFromTavern();
        refreshMaintextAndStatDataFromLatestAssistant();
        syncHiddenRawTextForStructuredAssistant();
      }),
      eventOn('adven:request_refresh', () => {
        if (!isActiveInstance()) return;
        refreshChatMessagesFromTavern();
        refreshMaintextAndStatDataFromLatestAssistant();
        syncHiddenRawTextForStructuredAssistant();
      }),
      eventOn(tavern_events.CHARACTER_MESSAGE_RENDERED, messageId => {
        if (!isActiveInstance()) return;
        refreshFromAssistantMessage(messageId);
      }),
    ];

    void waitGlobalInitialized('Mvu')
      .then(() => {
        const mvuListener = eventOn(Mvu.events.VARIABLE_UPDATE_ENDED, mvuData => {
          if (!isActiveInstance()) return;
          const sd = _.get(mvuData, 'stat_data');
          if (isUsableStatData(sd)) {
            latestStatDataRoot.value = sd;
            applyStatData(sd);
            void eventEmit('adven:state_updated');
          }
        });
        refreshListeners.value.push(mvuListener);
      })
      .catch(() => {
        console.info('[ADven] 未加载 MVU 全局对象，仍可从消息楼层变量读取 stat_data');
      });
  });

  onBeforeUnmount(() => {
    restoreAllHiddenRawText();
    releaseActiveInstance();
    refreshListeners.value.forEach(listener => listener.stop());
    refreshListeners.value = [];
  });

  return {
    panelDefinitions,
    activePanel,
    autoScrollEnabled,
    draftInput,
    sendMode,
    isGenerating,
    composeStatusText,
    maintextContent,
    maintextDice,
    worldState,
    presenceList,
    interestPoints,
    narrativeOptions,
    narrativeLayerSourceMessageId,
    maintextLayerTabs,
    selectedMaintextLayerOffset,
    quickActions,
    chatMessages,
    character,
    skills,
    equipmentSlotList,
    equipmentSlots,
    inventoryCategories,
    activeInventoryCategory,
    inventoryFeedback,
    filteredInventoryItems,
    pets,
    npcList,
    social,
    quests,
    statusDepthTags,
    bodyStatus,
    achievements,
    recipes,
    levelSystem,
    enemyList,
    production,
    selectProductionItem,
    currentPanel,
    openPanel,
    closePanel,
    applyQuickAction,
    applyNarrativeOption,
    switchMaintextLayer,
    submitMessage,
    refreshMaintextAndStatDataFromLatestAssistant,
    onDragStartInventory,
    onDragStartEquipment,
    onDropToEquip,
    onDropToInventory,
  };
}

export type AdvenState = ReturnType<typeof useAdvenState>;

