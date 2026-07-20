import type { DialogueChoice, DialogueMessage } from '../types';

// 预置的可交互对话流（旁白 + 角色 + 玩家 + 选项）
export const initialDialogue: DialogueMessage[] = [
  {
    id: 'm1',
    speaker: 'narration',
    text: '午后三点，阳光被窗棂裁成细长的金色。云町咖啡屋里飘着现磨咖啡豆的香气，门口的风铃轻轻晃了一下。',
  },
  {
    id: 'm2',
    speaker: 'qinghe',
    name: '林清和',
    emotion: '微笑',
    text: '「今天的拿铁，拉花是只小猫呢。是苏晴的手艺吧？……还是说，是你特意学的？」',
  },
  {
    id: 'm3',
    speaker: 'suqing',
    name: '苏晴',
    emotion: '雀跃',
    text: '「嘿嘿，被发现啦！店长昨晚偷偷练到打烊哦——清和姐姐你可要好好夸夸他！」',
  },
  {
    id: 'm4',
    speaker: 'narration',
    text: '林清和抬起眼，目光落在你身上，像是在等你说点什么。吧台后的苏晴也探出半个脑袋，一脸期待。',
  },
];

export const initialChoices: DialogueChoice[] = [
  { id: 'c1', text: '「其实……是想让你尝到更好喝的拿铁。」', hint: '好感 ↑', tone: 'strawberry' },
  { id: 'c2', text: '「只是刚好练手而已，别想多了。」', hint: '稳妥', tone: 'sky' },
  { id: 'c3', text: '（把话题转向窗外的天气）', hint: '回避', tone: 'mint' },
  { id: 'c4', text: '自定义你的回应……', hint: '自由输入', tone: 'lavender' },
];

// 模拟 LLM 针对不同选项的流式回复（旁白 + 角色）
export const mockResponses: Record<string, DialogueMessage[]> = {
  c1: [
    {
      id: 'r1a',
      speaker: 'qinghe',
      name: '林清和',
      emotion: '脸颊微红',
      text: '「……真是的，怎么能这么自然地说出这种话。」她低头抿了一口拿铁，耳尖却悄悄红了，「不过……谢谢你。今天的味道，我会记很久。」',
    },
    {
      id: 'r1b',
      speaker: 'narration',
      text: '空气里有什么东西轻轻晃动了一下。苏晴在吧台后比了个胜利的手势，又赶紧装作擦杯子。',
    },
  ],
  c2: [
    {
      id: 'r2a',
      speaker: 'qinghe',
      name: '林清和',
      emotion: '促狭一笑',
      text: '「是吗？可是练手也会练到打烊呢。」她合上书，意味深长地看着你，「好吧，就当我信了。」',
    },
  ],
  c3: [
    {
      id: 'r3a',
      speaker: 'narration',
      text: '你不动声色地把话题引向窗外。林清和顺着你的目光望去，轻声说了句「要下雨了呢」。苏晴却在背后小声嘀咕：「逃避可耻……但有用。」',
    },
  ],
  default: [
    {
      id: 'rdef',
      speaker: 'qinghe',
      name: '林清和',
      emotion: '认真倾听',
      text: '她安静地听你把话说完，指尖在杯壁上轻轻画着圈，然后弯起眼睛：「原来你是这么想的呀。我喜欢听你讲这些。」',
    },
  ],
};

// 给定选项/输入，生成跟随的新一轮选项
export function nextChoices(): DialogueChoice[] {
  return [
    { id: 'n1', text: '「要不要一起，等这场雨停？」', hint: '好感 ↑', tone: 'strawberry' },
    { id: 'n2', text: '「我去给你续杯热的。」', hint: '体贴', tone: 'peach' },
    { id: 'n3', text: '（回到吧台帮苏晴的忙）', hint: '经营', tone: 'mint' },
    { id: 'n4', text: '自定义你的回应……', hint: '自由输入', tone: 'lavender' },
  ];
}
