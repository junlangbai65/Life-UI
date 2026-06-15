# Tavern Card Knowledge Reference

Converted from the original worldbook-style knowledge base. Repository rules and current @types files take precedence if they differ from this reference.


## 索引

- uid: 850787
- displayIndex: 0
- order: 1
- position: 0

写卡知识库索引

按需Read对应条目获取详细内容。

EJS/
  EJS知识库          EJS基础语法、标签、变量读写、条件控制、装饰器、内置常量、模板库、多阶段人设
  EJS动态内容控制器  @@preprocessing控制器实例（根据变量/地点/角色名动态加载条目）

酒馆助手接口/
  00_接口索引        按功能分类的接口速查目录
  01_消息楼层操作    getChatMessages/setChatMessages等
  02_变量读写        getVariables/replaceVariables等
  03_世界书操作      getWorldbook/replaceWorldbook等
  04_AI生成请求      generate/generateRaw
  05_楼层显示        getMessageDiv/formatAsDisplayedMessage等
  06_事件监听        eventOn/tavern_events
  07_提示词注入      injectPrompts
  08_预设操作        getPreset/setPreset等
  09_角色卡信息      getCharacterData等
  10_宏与正则        registerMacroLike/formatAsTavernRegexedString
  11_音频播放        playAudio等
  12_脚本与按钮      getScriptId/appendInexistentScriptButtons
  13_扩展管理        installExtension等
  14_导入原始数据    importRaw等
  15_工具函数        getLastMessageId/replaceMacro/getIframeName
  16_MVU变量框架     Mvu对象/getMvuData/parseMessage/事件
  17_Slash命令       triggerSlash
  18_版本信息        getVersion
  19_角色卡管理      createCharacter/editCharacter等

MVU/
  MVU_ZOD指南        完整MVU ZOD工作流（结构脚本→初始变量→提示词→正则→脚本→界面）

世界书配置/
  世界书配置指南     触发策略（蓝灯/绿灯）、位置、顺序、深度、递归、各类条目推荐配置、LorebookToolCall参数对照表

自查/
  一般条目自查       角色卡制作审查（外貌差异化/八股化/绝对零度/语料纯净度/格式）+ 故事内容审查
  前端美化自查       正则配置/HTML基础/标签一致性/模式A正文美化/模式B结构化数据
  世界书评估         评估原则/条目配置检查/写作质量抽查/评估输出格式
  世界观自查         通用检查（废话/零度/白描/配置）+ 路径A/B/C专项+ EJS+MVU联动检查
  MVU自查            变量结构脚本/初始变量/变量列表/变量更新规则/变量输出格式/变量输出格式强调
  MVU前端状态栏自查  HTML结构/CSS样式/变量获取/初始化逻辑/常见错误


## 00_接口索引

- uid: 260696
- displayIndex: 1
- order: 2
- position: 0

酒馆助手（TavernHelper）接口分类索引

根据你想做的事情，找到对应的文件名，然后去读那个文件的详细内容。

═══════════════════════════════════════
【消息楼层】读取、修改、新建、删除聊天消息
→ 01_消息楼层操作.txt
关键词：获取聊天记录、读消息、改消息、删楼层、新建楼层、移动楼层、换页

【变量存取】读写酒馆变量（全局/角色卡/脚本/聊天/消息楼层变量）
→ 02_变量读写.txt
关键词：getVariables、replaceVariables、存数据、读数据、好感度、状态栏数据

【世界书】操作世界书和条目（增删改查、启用禁用）
→ 03_世界书操作.txt
关键词：世界书、知识书、lorebook、条目、entry、添加条目、删除条目、修改条目

【AI生成】请求AI生成回复（带预设或裸请求）
→ 04_AI生成请求.txt
关键词：generate、生成回复、请求AI、自动生成、generateRaw、流式

【楼层显示】操作消息楼层的前端显示（JQuery、格式化）
→ 05_楼层显示与格式化.txt
关键词：楼层JQuery、显示美化、格式化文本、HTML渲染

【事件监听】监听酒馆事件（消息接收、世界书更新等）
→ 06_事件监听.txt
关键词：eventOn、监听消息、监听事件、消息发送完毕、世界书更新、聊天切换

【提示词注入】向AI请求中注入额外提示词
→ 07_提示词注入.txt
关键词：inject、注入提示词、添加系统提示、深度注入

【预设操作】切换预设、调整AI参数（温度、提示词等）
→ 08_预设操作.txt
关键词：切换预设、修改温度、修改参数、提示词设置

【角色卡信息】获取角色卡的基本信息
→ 09_角色卡信息.txt
关键词：角色名、角色描述、角色卡数据、头像、聊天文件

【宏与正则】注册自定义宏、操作酒馆正则
→ 10_宏与正则.txt
关键词：宏替换、registerMacroLike、正则替换、formatAsTavernRegexedString

【音频播放】播放音频文件
→ 11_音频播放.txt
关键词：播放音乐、BGM、音效、audio

【脚本管理】脚本自身信息、按钮、全局共享
→ 12_脚本与全局共享.txt
关键词：脚本ID、脚本按钮、全局函数共享、getScriptId

【扩展管理】安装、卸载、更新酒馆扩展
→ 13_扩展管理.txt
关键词：安装扩展、卸载扩展、更新扩展、extension

【导入数据】导入角色卡、聊天记录、世界书等原始数据
→ 14_导入原始数据.txt
关键词：导入角色卡、导入聊天、导入世界书、importRaw

【工具函数】获取最新楼层号、替换宏、iframe相关
→ 15_工具函数.txt
关键词：getLastMessageId、replaceMacro、getIframeName、getCurrentMessageId

【MVU变量框架】与MVU交互（获取/修改/解析MVU变量）
→ 16_MVU变量框架.txt
关键词：Mvu、MVU变量、stat_data、parseMessage、变量更新

【酒馆原生接口】SillyTavern原生导出的低级接口
→ 17_酒馆原生接口.txt
关键词：SillyTavern.getContext、底层API、原生函数

【版本信息】获取酒馆和酒馆助手的版本号
→ 18_版本信息.txt
关键词：版本号、version、酒馆版本、助手版本

【角色卡管理】创建、修改、删除角色卡
→ 19_角色卡管理.txt
关键词：创建角色卡、修改角色卡、删除角色卡、切换角色卡


## 01_消息楼层操作

- uid: 57907
- displayIndex: 2
- order: 3
- position: 0

【消息楼层操作】
来源: @types/function/chat_message.d.ts
用途: 获取、修改、创建、删除、移动聊天消息楼层

════════════════════════════════════════
一、数据类型
════════════════════════════════════════

ChatMessage {
  message_id: number        // 楼层号
  name: string              // 发言者名称
  role: 'system'|'assistant'|'user'  // 角色
  is_hidden: boolean        // 是否隐藏
  message: string           // 消息正文
  data: Record<string,any>  // 楼层变量(用于MVU等)
  extra: Record<string,any> // 额外数据
}

ChatMessageSwiped 额外包含:
  swipe_id: number          // 当前选中的消息页索引
  swipes: string[]          // 所有消息页的正文
  swipes_data: Record[]     // 所有消息页的变量
  swipes_info: Record[]     // 所有消息页的信息

════════════════════════════════════════
二、获取消息
════════════════════════════════════════

getChatMessages(range, option?) → ChatMessage[] 或 ChatMessageSwiped[]

  range: 楼层号或范围
    - 数字: 0, 10, -1(最新), -2(倒数第二)
    - 字符串范围: '0-{{lastMessageId}}'

  option:
    - role: 'all'|'system'|'assistant'|'user' (默认'all')
    - hide_state: 'all'|'hidden'|'unhidden' (默认'all')
    - include_swipes: boolean (默认false, true返回ChatMessageSwiped)

  示例:
    const msg = getChatMessages(-1)[0];              // 最新一楼
    const all = getChatMessages('0-{{lastMessageId}}');  // 所有楼层
    const swiped = getChatMessages(0, {include_swipes:true}); // 含消息页

════════════════════════════════════════
三、修改消息
════════════════════════════════════════

setChatMessages(messages, option?) → Promise<void>

  messages: [{message_id, ...要修改的字段}]
  option.refresh: 'none'|'affected'|'all' (默认'affected')

  示例:
    // 修改正文
    await setChatMessages([{message_id:10, message:'新内容'}]);
    // 设置多个开局
    await setChatMessages([{message_id:0, swipes:['开局1','开局2']}]);
    // 切换到开局3
    await setChatMessages([{message_id:0, swipe_id:2}]);
    // 重新渲染第4楼的前端界面
    await setChatMessages([{message_id:4}]);
    // 隐藏所有楼层
    await setChatMessages(_.range(getLastMessageId()+1).map(id=>({message_id:id, is_hidden:true})));

════════════════════════════════════════
四、创建消息
════════════════════════════════════════

createChatMessages(messages, option?) → Promise<void>

  messages: [{role, message, name?, is_hidden?, data?, extra?}]
  option:
    - insert_before: number|'end' (默认末尾)
    - refresh: 'none'|'affected'|'all'

  示例:
    await createChatMessages([{role:'user', message:'你好'}]);
    await createChatMessages([{role:'assistant', message:'你好'}], {insert_before:10});

════════════════════════════════════════
五、删除消息
════════════════════════════════════════

deleteChatMessages(message_ids, option?) → Promise<void>

  示例:
    await deleteChatMessages([10, 15, -2, getLastMessageId()]);
    await deleteChatMessages(_.range(getLastMessageId()+1)); // 删除全部

════════════════════════════════════════
六、移动消息(旋转)
════════════════════════════════════════

rotateChatMessages(begin, middle, end, option?) → Promise<void>

  将 [begin,middle) [middle,end) 旋转为 [middle,end) [begin,middle)

  示例:
    // 将最后一楼移到第5楼前
    await rotateChatMessages(5, getLastMessageId(), getLastMessageId()+1);
    // 将前3楼放到最后
    await rotateChatMessages(0, 3, getLastMessageId()+1);



## 02_变量读写

- uid: 597289
- displayIndex: 3
- order: 4
- position: 0

【变量读写】
来源: @types/function/variables.d.ts, @types/iframe/variables.d.ts
用途: 读取、修改、删除酒馆中各种作用域的变量

════════════════════════════════════════
一、变量类型(作用域)
════════════════════════════════════════

{type:'global'}      全局变量，无论哪张角色卡都共享
{type:'character'}   角色卡变量，绑定在角色卡上
{type:'chat'}        聊天变量，绑定在当前聊天文件
{type:'preset'}      预设变量，绑定在当前预设
{type:'message', message_id?:number|'latest'}  消息楼层变量，绑定在某楼层
  message_id: 负数为深度(-1最新,-2倒数第二), 默认'latest'
{type:'script', script_id?:string}  脚本变量，绑定在某脚本
{type:'extension', extension_id:string}  扩展变量

════════════════════════════════════════
二、获取变量
════════════════════════════════════════

getVariables(option) → Record<string,any>

  示例:
    const vars = getVariables({type:'chat'});
    const msgVars = getVariables({type:'message', message_id:-1});
    const scriptVars = getVariables({type:'script'});
    // 检查变量是否存在
    if (_.has(vars, '神乐光.好感度')) { ... }

getAllVariables() → Record<string,any>
  获取合并后的变量表(全局→角色卡→聊天→各楼层合并)
  仅在 iframe 内可用

════════════════════════════════════════
三、替换变量(整体覆盖)
════════════════════════════════════════

replaceVariables(variables, option) → void

  示例:
    replaceVariables({角色:{好感度:5}}, {type:'chat'});

════════════════════════════════════════
四、函数式更新
════════════════════════════════════════

updateVariablesWith(updater, option) → Record | Promise<Record>

  updater: (variables) => 返回新的变量表

  示例:
    updateVariablesWith(v => {
      _.unset(v, '神乐光.好感度');
      return v;
    }, {type:'chat'});

════════════════════════════════════════
五、插入/合并变量
════════════════════════════════════════

insertOrAssignVariables(variables, option) → Record
  已存在的key会被覆盖，不存在的会新增

  示例:
    // 前: {华恋:{好感度:5}}
    insertOrAssignVariables({华恋:{好感度:10}, 光:{好感度:5}}, {type:'chat'});
    // 后: {华恋:{好感度:10}, 光:{好感度:5}}

insertVariables(variables, option) → Record
  仅插入不存在的key，已存在的不动

  示例:
    // 前: {华恋:{好感度:5}}
    insertVariables({华恋:{好感度:10}, 光:{好感度:5}}, {type:'chat'});
    // 后: {华恋:{好感度:5}, 光:{好感度:5}}  ← 华恋不变

════════════════════════════════════════
六、删除变量
════════════════════════════════════════

deleteVariable(path, option) → {variables, delete_occurred}

  示例:
    deleteVariable('华恋.好感度', {type:'chat'});

════════════════════════════════════════
七、注册变量结构(仅UI用)
════════════════════════════════════════

registerVariableSchema(schema, option) → void
  注册zod结构后，变量管理器UI会按结构校验变量，对代码无影响

  示例:
    registerVariableSchema(z.object({
      stat_data: z.object({ 好感度: z.number() })
    }), {type:'message'});



## 03_世界书操作

- uid: 623221
- displayIndex: 4
- order: 5
- position: 0

【世界书操作】
来源: @types/function/worldbook.d.ts
用途: 获取、创建、删除、修改世界书及其条目，管理世界书绑定

════════════════════════════════════════
一、世界书条目结构 WorldbookEntry
════════════════════════════════════════

{
  uid: number              // 条目ID(世界书内部唯一)
  name: string             // 条目名称
  enabled: boolean         // 是否启用
  content: string          // 条目内容(发给AI的提示词)
  probability: number      // 激活概率%

  strategy: {              // 激活策略
    type: 'constant'|'selective'|'vectorized'
      // constant=蓝灯(常驻) selective=绿灯(需关键词) vectorized=向量化
    keys: (string|RegExp)[]           // 主要关键字
    keys_secondary: {                  // 次要关键字
      logic: 'and_any'|'and_all'|'not_all'|'not_any'
      keys: (string|RegExp)[]
    }
    scan_depth: 'same_as_global'|number  // 扫描深度
  }

  position: {              // 插入位置
    type: 'before_character_definition'|'after_character_definition'
         |'before_example_messages'|'after_example_messages'
         |'before_author_note'|'after_author_note'|'at_depth'
    role: 'system'|'assistant'|'user'  // 仅at_depth时有效
    depth: number                       // 仅at_depth时有效
    order: number
  }

  recursion: {             // 递归设置
    prevent_incoming: boolean   // 禁止被其他条目递归激活
    prevent_outgoing: boolean   // 禁止递归激活其他条目
    delay_until: null|number    // 延迟到第n级递归
  }

  effect: {                // 时效设置
    sticky: null|number    // 黏性(激活后持续n轮)
    cooldown: null|number  // 冷却(激活后冷却n轮)
    delay: null|number     // 延迟(至少n楼后才激活)
  }
}

════════════════════════════════════════
二、世界书列表与绑定
════════════════════════════════════════

getWorldbookNames() → string[]              // 获取所有世界书名
getGlobalWorldbookNames() → string[]        // 获取全局开启的世界书
rebindGlobalWorldbooks(names) → Promise     // 重新绑定全局世界书

getCharWorldbookNames('current') → {primary, additional}  // 角色卡绑定的世界书
rebindCharWorldbooks('current', {primary, additional})     // 重新绑定角色卡世界书

getChatWorldbookName('current') → string|null              // 聊天绑定的世界书
rebindChatWorldbook('current', name) → Promise             // 重新绑定聊天世界书
getOrCreateChatWorldbook('current', name?) → Promise<string> // 获取或新建聊天世界书

════════════════════════════════════════
三、世界书CRUD
════════════════════════════════════════

createWorldbook(name, entries?) → Promise<boolean>
  创建世界书，返回true(新建)/false(替换)

createOrReplaceWorldbook(name, entries?, {render?}) → Promise<boolean>
  创建或替换世界书

deleteWorldbook(name) → Promise<boolean>

getWorldbook(name) → Promise<WorldbookEntry[]>
  获取世界书全部条目

replaceWorldbook(name, entries, {render?}) → Promise<void>
  整体替换世界书内容
  render: 'debounced'(默认)|'immediate'

updateWorldbookWith(name, updater, {render?}) → Promise<WorldbookEntry[]>
  函数式更新

  示例:
    // 禁止所有条目递归
    await updateWorldbookWith('书名', wb => wb.map(e => ({
      ...e, recursion:{prevent_incoming:true, prevent_outgoing:true, delay_until:null}
    })));

    // 删除含"神乐光"的条目
    await updateWorldbookWith('书名', wb => {
      _.remove(wb, e => e.name.includes('神乐光'));
      return wb;
    });

════════════════════════════════════════
四、条目级操作
════════════════════════════════════════

createWorldbookEntries(name, newEntries, {render?})
  → Promise<{worldbook, new_entries}>
  新增条目，不设置的字段用默认值

  示例:
    await createWorldbookEntries('书名', [{name:'神乐光'}, {}]);

deleteWorldbookEntries(name, predicate, {render?})
  → Promise<{worldbook, deleted_entries}>
  按条件删除条目

  示例:
    await deleteWorldbookEntries('书名', e => e.name.includes('神乐光'));



## 04_AI生成请求

- uid: 764266
- displayIndex: 5
- order: 6
- position: 0

【AI生成请求】
来源: @types/function/generate.d.ts
用途: 请求AI生成回复，支持流式传输、自定义提示词、自定义API

════════════════════════════════════════
一、携带预设生成
════════════════════════════════════════

generate(config) → Promise<string>

  使用酒馆当前预设(含所有提示词、世界书等)请求AI生成

  config:
    user_input?: string          // 用户输入
    should_stream?: boolean      // 流式传输(默认false)
    should_silence?: boolean     // 静默生成(默认false,true不影响停止按钮)
    image?: File|string|(File|string)[]  // 图片输入
    overrides?: Overrides        // 覆盖指定提示词
    injects?: InjectionPrompt[]  // 额外注入提示词
    max_chat_history?: 'all'|number  // 最多使用多少条历史
    custom_api?: CustomApiConfig // 自定义API
    generation_id?: string       // 唯一标识(用于停止特定生成)

  示例:
    const result = await generate({user_input:'你好'});
    const result = await generate({user_input:'描述图片', image:'https://...'});

════════════════════════════════════════
二、不携带预设生成(自定义提示词顺序)
════════════════════════════════════════

generateRaw(config) → Promise<string>

  额外参数:
    ordered_prompts?: (BuiltinPrompt|RolePrompt)[]
      自定义提示词顺序，未列出的内置提示词不会被使用

  BuiltinPrompt可选值:
    'world_info_before'|'persona_description'|'char_description'
    |'char_personality'|'scenario'|'world_info_after'
    |'dialogue_examples'|'chat_history'|'user_input'

  RolePrompt: {role:'system'|'assistant'|'user', content:string}

  示例:
    const result = await generateRaw({
      user_input: '你好',
      ordered_prompts: [
        'char_description',
        {role:'system', content:'系统提示'},
        'chat_history',
        'user_input',
      ]
    });

════════════════════════════════════════
三、覆盖选项 Overrides
════════════════════════════════════════

overrides: {
  world_info_before?: string
  persona_description?: string
  char_description?: string
  char_personality?: string
  scenario?: string
  world_info_after?: string
  dialogue_examples?: string
  chat_history?: {
    with_depth_entries?: boolean  // 是否用深度插入条目
    author_note?: string         // 覆盖作者注释
    prompts?: RolePrompt[]       // 覆盖聊天历史
  }
}

════════════════════════════════════════
四、流式传输
════════════════════════════════════════

需先监听事件再调用generate:

  eventOn(iframe_events.STREAM_TOKEN_RECEIVED_FULLY, text => {
    // text: 完整累积文本 "这是","这是一条","这是一条流式"
  });
  eventOn(iframe_events.STREAM_TOKEN_RECEIVED_INCREMENTALLY, text => {
    // text: 增量文本 "这是","一条","流式"
  });
  const result = await generate({user_input:'你好', should_stream:true});

════════════════════════════════════════
五、自定义API
════════════════════════════════════════

custom_api: {
  apiurl: string       // API地址
  key?: string         // API密钥
  model: string        // 模型名称
  source?: string      // API源(默认'openai')
  max_tokens?: 'same_as_preset'|'unset'|number
  temperature?: 'same_as_preset'|'unset'|number
  frequency_penalty?: 'same_as_preset'|'unset'|number
  presence_penalty?: 'same_as_preset'|'unset'|number
  top_p?: 'same_as_preset'|'unset'|number
  top_k?: 'same_as_preset'|'unset'|number
}

════════════════════════════════════════
六、其他函数
════════════════════════════════════════

getModelList({apiurl, key?}) → Promise<string[]>  // 获取模型列表
stopGenerationById(generation_id) → boolean        // 停止特定生成
stopAllGeneration() → boolean                      // 停止所有生成
builtin_prompt_default_order → BuiltinPrompt[]     // 默认提示词顺序



## 05_楼层显示

- uid: 996202
- displayIndex: 6
- order: 7
- position: 0

【楼层显示与格式化】
来源: @types/function/displayed_message.d.ts
用途: 获取楼层的DOM元素、将文本格式化为酒馆显示格式、刷新楼层显示

════════════════════════════════════════
一、获取楼层DOM
════════════════════════════════════════

retrieveDisplayedMessage(message_id) → JQuery<HTMLDivElement>

  获取某楼层的消息内容JQuery实例(需该楼层已在页面上显示)

  示例:
    const text = retrieveDisplayedMessage(0).text();         // 获取文本
    retrieveDisplayedMessage(0).text('新内容');               // 临时修改显示
    retrieveDisplayedMessage(0).append('<pre>追加</pre>');    // 追加内容

  注意: 这样的修改只影响当前显示，不会保存到消息文件。
  要实际修改消息请用 setChatMessages。

════════════════════════════════════════
二、文本→显示HTML
════════════════════════════════════════

formatAsDisplayedMessage(text, {message_id?}) → string

  将字符串处理为酒馆用于显示的html:
  1. 替换酒馆宏 (如 {{char}})
  2. 应用酒馆正则
  3. 转换为html格式

  option:
    message_id: 'last'|'last_user'|'last_char'|number (默认最新楼层)

  示例:
    const html = formatAsDisplayedMessage('{{char}} speaks in {{lastMessageId}}');
    // → "<p>少女歌剧 speaks in 5</p>"

════════════════════════════════════════
三、刷新单个楼层显示
════════════════════════════════════════

refreshOneMessage(message_id, $mes?) → Promise<void>

  刷新或替换单个楼层的显示(如果该楼层没显示在网页上则无操作)

  示例:
    await refreshOneMessage(0);                    // 刷新第0楼
    await refreshOneMessage(getLastMessageId());   // 刷新最新楼层
    // 强行让第5楼显示第0楼的消息(仅影响网页显示)
    await refreshOneMessage(0, $('#chat > .mes[mesid="5"]'));



## 06_事件监听

- uid: 988249
- displayIndex: 7
- order: 8
- position: 0

【事件监听】
来源: @types/iframe/event.d.ts
用途: 监听酒馆事件(消息收发、聊天切换等)和自定义事件，发送事件

════════════════════════════════════════
一、注册/取消监听
════════════════════════════════════════

eventOn(event_type, listener) → {stop}
  持续监听事件。前端界面/脚本关闭时自动卸载。
  返回 {stop()} 可手动取消。

eventOnce(event_type, listener) → {stop}
  只监听一次，触发后自动取消。

eventMakeFirst(event_type, listener) → {stop}
  注册为最先执行的监听器。

eventMakeLast(event_type, listener) → {stop}
  注册为最后执行的监听器。

eventRemoveListener(event_type, listener)   // 取消某个监听
eventClearEvent(event_type)                 // 取消某事件的所有监听
eventClearListener(listener)                // 取消某函数的所有监听
eventClearAll()                             // 取消本iframe所有监听

════════════════════════════════════════
二、发送事件
════════════════════════════════════════

eventEmit(event_type, ...data) → Promise<void>
  发送事件并等待所有listener执行完毕

eventEmitAndWait(event_type, ...data) → void
  同步发送事件

════════════════════════════════════════
三、iframe事件 (iframe_events)
════════════════════════════════════════

iframe_events.MESSAGE_IFRAME_RENDER_STARTED  // 前端界面开始渲染
iframe_events.MESSAGE_IFRAME_RENDER_ENDED    // 前端界面渲染完毕
iframe_events.GENERATION_STARTED             // generate()开始生成
iframe_events.STREAM_TOKEN_RECEIVED_FULLY    // 流式完整文本
iframe_events.STREAM_TOKEN_RECEIVED_INCREMENTALLY // 流式增量文本
iframe_events.GENERATION_ENDED               // generate()生成完毕

════════════════════════════════════════
四、常用酒馆事件 (tavern_events)
════════════════════════════════════════

消息相关:
  MESSAGE_SENT        (message_id)            // 用户发送消息
  MESSAGE_RECEIVED    (message_id, type)      // AI回复收到
  MESSAGE_EDITED      (message_id)            // 消息被编辑
  MESSAGE_DELETED     (message_id)            // 消息被删除
  MESSAGE_UPDATED     (message_id)            // 消息被更新
  MESSAGE_SWIPED      (message_id)            // 消息被切换页
  USER_MESSAGE_RENDERED    (message_id)       // 用户消息渲染完成
  CHARACTER_MESSAGE_RENDERED (message_id, type) // AI消息渲染完成

聊天/生成相关:
  CHAT_CHANGED        (chat_file_name)        // 聊天文件切换
  CHAT_CREATED                                // 新建聊天
  CHAT_DELETED        (chat_file_name)        // 删除聊天
  GENERATION_STARTED  (type, option, dry_run) // 酒馆生成开始
  GENERATION_ENDED    (message_id)            // 酒馆生成结束
  GENERATION_STOPPED                          // 酒馆生成被停止

世界书相关:
  WORLDINFO_UPDATED   (name, data)            // 世界书更新
  WORLDINFO_SETTINGS_UPDATED                  // 世界书设置更新
  WORLD_INFO_ACTIVATED (entries)              // 世界书条目被激活

角色/设置相关:
  CHARACTER_EDITED    ({detail:{id,character}}) // 角色卡被编辑
  CHARACTER_DELETED   ({id,character})          // 角色卡被删除
  SETTINGS_LOADED                               // 设置加载完毕
  PRESET_CHANGED      ({apiId,name})            // 预设切换

流式传输:
  STREAM_TOKEN_RECEIVED  (text)               // 酒馆原生流式token
  STREAM_REASONING_DONE  (reasoning,duration,message_id,state) // 思维链完成

提示词处理:
  GENERATE_BEFORE_COMBINE_PROMPTS             // 合并提示词前
  GENERATE_AFTER_COMBINE_PROMPTS ({prompt,dryRun}) // 合并提示词后
  GENERATE_AFTER_DATA (generate_data,dry_run)  // 发送数据后
  CHAT_COMPLETION_PROMPT_READY ({chat,dryRun}) // 提示词就绪

示例:
  // 监听消息接收
  eventOn(tavern_events.MESSAGE_RECEIVED, (id, type) => {
    console.log(`收到第${id}楼消息，类型:${type}`);
  });

  // 聊天切换时重载
  eventOn(tavern_events.CHAT_CHANGED, () => window.location.reload());

  // 自定义事件
  eventEmit('my_custom_event', {data:'hello'});
  eventOn('my_custom_event', data => console.log(data));



## 07_提示词注入

- uid: 649302
- displayIndex: 8
- order: 9
- position: 0

【提示词注入】
来源: @types/function/inject.d.ts
用途: 向AI请求中注入额外提示词(如思维链、系统指令等)

════════════════════════════════════════
一、注入提示词
════════════════════════════════════════

injectPrompts(prompts, options?) → {uninject}

  prompts: InjectionPrompt[]
  options:
    once?: boolean  // 是否仅下一次生成有效(默认false)

  返回 {uninject()} 可取消注入

  InjectionPrompt:
    id: string                      // 唯一标识
    position: 'in_chat'|'none'      // in_chat插入聊天, none仅用于激活世界书
    depth: number                   // 插入深度(0=最底部)
    role: 'system'|'assistant'|'user'
    content: string                 // 提示词内容
    filter?: ()=>boolean            // 过滤条件(返回true才启用)
    should_scan?: boolean           // 是否加入世界书扫描文本

  示例:
    // 注入思维链提示
    const {uninject} = injectPrompts([{
      id: 'cot',
      role: 'system',
      content: '请先在<thinking>中思考...',
      position: 'in_chat',
      depth: 0,
      should_scan: true
    }]);

    // 仅下一次生成有效
    injectPrompts([{
      id: 'temp_hint',
      role: 'system',
      content: '这次请用日语回复',
      position: 'in_chat',
      depth: 0
    }], {once: true});

  注意:
    - 注入的提示词仅在当前聊天文件中有效
    - 切换聊天后需重新注入，可监听 tavern_events.CHAT_CHANGED
    - 也可监听 tavern_events.GENERATION_AFTER_COMMANDS 在生成前注入

════════════════════════════════════════
二、移除注入
════════════════════════════════════════

uninjectPrompts(ids) → void

  示例:
    uninjectPrompts(['cot', 'temp_hint']);



## 08_预设操作

- uid: 907197
- displayIndex: 9
- order: 10
- position: 0

【预设操作】
来源: @types/function/preset.d.ts
用途: 获取、创建、修改、切换预设(包括提示词列表、温度等参数)

════════════════════════════════════════
一、预设结构 Preset
════════════════════════════════════════

{
  settings: {
    max_context: number              // 最大上下文token数
    max_completion_tokens: number    // 最大回复token数
    should_stream: boolean           // 流式传输
    temperature: number              // 温度
    frequency_penalty: number        // 频率惩罚
    presence_penalty: number         // 存在惩罚
    top_p / top_k / min_p / top_a    // 采样参数
    seed: number                     // 种子(-1随机)
    squash_system_messages: boolean  // 压缩系统消息
    reasoning_effort: 'auto'|'min'|'low'|'medium'|'high'|'max'  // 推理强度
    request_thoughts: boolean        // 请求思维链
    request_images: boolean          // 请求图片
    enable_function_calling: boolean // 函数调用
    enable_web_search: boolean       // 网络搜索
    allow_sending_images: 'disabled'|'auto'|'low'|'high'
    character_name_prefix: 'none'|'default'|'content'|'completion'
  }
  prompts: PresetPrompt[]            // 已添加的提示词
  prompts_unused: PresetPrompt[]     // 未添加的提示词
  extensions: { ... }                // 扩展字段(正则、酒馆助手等)
}

提示词类型:
  普通提示词: 用户手动添加的, id为自定义字符串
  系统提示词: id为 'main'|'nsfw'|'jailbreak'|'enhanceDefinitions'
  占位符提示词: id为 'worldInfoBefore'|'charDescription'|'chatHistory'等

════════════════════════════════════════
二、预设列表与切换
════════════════════════════════════════

getPresetNames() → string[]           // 获取所有预设名
getLoadedPresetName() → string        // 当前加载的预设名
loadPreset(name) → boolean            // 切换预设

════════════════════════════════════════
三、预设CRUD
════════════════════════════════════════

getPreset(name) → Preset
  name可为 'in_use' 获取当前使用中的预设

createPreset(name, preset?) → Promise<boolean>
deletePreset(name) → Promise<boolean>
renamePreset(name, new_name) → Promise<boolean>
createOrReplacePreset(name, preset?, {render?}) → Promise<boolean>

════════════════════════════════════════
四、修改预设
════════════════════════════════════════

replacePreset(name, preset, {render?}) → Promise<void>
  整体替换

updatePresetWith(name, updater, {render?}) → Promise<Preset>
  函数式更新

setPreset(name, partial_preset, {render?}) → Promise<Preset>
  部分更新(未给出的字段保持原值)

  render: 'debounced'(默认)|'immediate'|'none'

  示例:
    // 开启流式传输
    await setPreset('in_use', {settings:{should_stream:true}});

    // 关闭含"COT"的条目
    await updatePresetWith('in_use', preset => {
      preset.prompts.filter(p => p.name.includes('COT')).forEach(p => p.enabled=false);
      return preset;
    });

    // 添加提示词条目
    await updatePresetWith('in_use', preset => {
      preset.prompts.push({
        id:'new', name:'新提示词', enabled:true,
        position:{type:'relative'}, role:'user', content:'内容'
      });
      return preset;
    });

════════════════════════════════════════
五、工具函数
════════════════════════════════════════

isPresetNormalPrompt(prompt) → boolean     // 是否普通提示词
isPresetSystemPrompt(prompt) → boolean     // 是否系统提示词
isPresetPlaceholderPrompt(prompt) → boolean // 是否占位符提示词
default_preset → Preset                     // 默认预设内容



## 09_角色卡信息

- uid: 982393
- displayIndex: 10
- order: 11
- position: 0

【角色卡信息(只读)】
来源: @types/function/raw_character.d.ts
用途: 获取角色卡底层数据、头像路径、聊天历史摘要(只读，不修改)

════════════════════════════════════════
一、获取角色卡原始数据
════════════════════════════════════════

getCharData(name) → SillyTavern.v1CharData | null
  获取角色卡的原始数据对象
  name: 角色名或 'current'(当前角色卡)

getCharAvatarPath(name) → string | null
  获取角色卡头像路径

════════════════════════════════════════
二、聊天历史
════════════════════════════════════════

getChatHistoryBrief(name, allowAvatar?) → Promise<any[]|null>
  获取角色的聊天历史摘要列表

getChatHistoryDetail(data, isGroupChat?) → Promise<Record|null>
  获取聊天历史详情

════════════════════════════════════════
三、RawCharacter 类
════════════════════════════════════════

RawCharacter 类提供更多底层方法:

  RawCharacter.find({name:'current'}) → v1CharData
    按名称查找角色卡数据

  RawCharacter.findCharacterIndex(name) → number
    查找角色卡在数组中的索引

  RawCharacter.getChatsFromFiles(data, isGroupChat) → Promise<Record>
    从聊天文件获取聊天内容

  实例方法(需 new RawCharacter(charData)):
    .getCardData() → v1CharData         // 完整角色数据
    .getAvatarId() → string             // 头像ID
    .getRegexScripts() → RegexScript[]   // 局部正则脚本
    .getCharacterBook() → Book|null      // 角色书(内嵌世界书)
    .getWorldName() → string             // 角色世界书名称

注意: 如果要修改角色卡，请使用 19_角色卡管理.txt 中的接口。



## 10_宏与正则

- uid: 181197
- displayIndex: 11
- order: 12
- position: 0

【宏与正则】
来源: @types/function/macro_like.d.ts, @types/function/tavern_regex.d.ts
用途: 注册自定义宏(文本替换)、操作酒馆正则(显示/提示词替换规则)

════════════════════════════════════════
一、注册助手宏
════════════════════════════════════════

registerMacroLike(regex, replace) → {unregister}

  注册后，酒馆提示词和楼层显示中匹配到的文本会被替换

  regex: 匹配的正则表达式
  replace: (context, substring, ...args) => string
    context: {message_id?, role?}

  示例:
    // 统计行数的宏
    registerMacroLike(
      /<count_lines>(.*?)<count_lines>/gi,
      (ctx, content) => content.split('\n').length.toString()
    );

unregisterMacroLike(regex) → void
  取消注册

════════════════════════════════════════
二、酒馆正则结构 TavernRegex
════════════════════════════════════════

{
  id: string
  script_name: string        // 正则名称
  enabled: boolean
  scope: 'global'|'character'  // 全局或局部

  find_regex: string         // 查找正则
  replace_string: string     // 替换内容
  trim_strings: string       // 修剪字符串

  source: {                  // 作用于什么来源的文本
    user_input: boolean
    ai_output: boolean
    slash_command: boolean
    world_info: boolean
  }
  destination: {             // 用于什么目的
    display: boolean         // 仅格式显示
    prompt: boolean          // 仅格式提示词
  }
  run_on_edit: boolean       // 编辑时是否运行
  min_depth / max_depth: number|null  // 深度范围
}

════════════════════════════════════════
三、获取/修改正则
════════════════════════════════════════

isCharacterTavernRegexesEnabled() → boolean   // 局部正则是否启用

getTavernRegexes({scope?, enable_state?}) → TavernRegex[]
  scope: 'all'|'global'|'character'(默认'all')
  enable_state: 'all'|'enabled'|'disabled'(默认'all')

replaceTavernRegexes(regexes, {scope?}) → Promise<void>
  整体替换(很慢!会重载聊天)

updateTavernRegexesWith(updater, {scope?}) → Promise<TavernRegex[]>
  函数式更新

  示例:
    // 开启所有名字含"舞台少女"的正则
    await updateTavernRegexesWith(regexes => {
      regexes.forEach(r => {
        if (r.script_name.includes('舞台少女')) r.enabled = true;
      });
      return regexes;
    });

════════════════════════════════════════
四、应用正则到文本
════════════════════════════════════════

formatAsTavernRegexedString(text, source, destination, {depth?, character_name?})
  source: 'user_input'|'ai_output'|'slash_command'|'world_info'|'reasoning'
  destination: 'display'|'prompt'

  示例:
    const msg = getChatMessages(-1)[0];
    const result = formatAsTavernRegexedString(msg.message, 'ai_output', 'display', {depth:0});



## 11_音频播放

- uid: 248130
- displayIndex: 12
- order: 13
- position: 0

【音频播放】
来源: @types/function/audio.d.ts
用途: 播放/暂停背景音乐和音效，管理播放列表和音频设置

════════════════════════════════════════
一、播放/暂停
════════════════════════════════════════

playAudio(type, audio) → void
  type: 'bgm'(背景音乐) | 'ambient'(音效)
  audio: {url:string, title?:string}  // title不填则从url提取文件名

  示例:
    playAudio('bgm', {url:'http://example.com/music.mp3'});
    playAudio('bgm', {title:'战斗BGM', url:'http://example.com/battle.mp3'});

pauseAudio(type) → void
  暂停播放

════════════════════════════════════════
二、播放列表
════════════════════════════════════════

getAudioList(type) → Audio[]             // 获取播放列表
replaceAudioList(type, list) → void      // 整体替换播放列表
appendAudioList(type, list) → void       // 追加不重复的音频

  示例:
    // 设置3首BGM
    replaceAudioList('bgm', [
      {title:'晨曲', url:'http://.../morning.mp3'},
      {title:'午后', url:'http://.../afternoon.mp3'},
      {title:'夜曲', url:'http://.../night.mp3'},
    ]);
    // 追加一首(已存在则不重复)
    appendAudioList('bgm', [{url:'http://.../new.mp3'}]);

════════════════════════════════════════
三、音频设置
════════════════════════════════════════

getAudioSettings(type) → AudioSettings
setAudioSettings(type, settings) → void

  AudioSettings:
    enabled: boolean                    // 是否启用
    mode: 'repeat_one'|'repeat_all'|'shuffle'|'play_one_and_stop'
    muted: boolean                      // 是否静音
    volume: number                      // 音量(0-100)

  示例:
    setAudioSettings('bgm', {mode:'repeat_one'});   // 单曲循环
    setAudioSettings('ambient', {muted:true});        // 静音音效
    setAudioSettings('bgm', {volume:50});             // 音量50%



## 12_脚本与按钮

- uid: 662154
- displayIndex: 13
- order: 14
- position: 0

【脚本与按钮】
来源: @types/iframe/script.d.ts, @types/function/script.d.ts, @types/function/global.d.ts
用途: 脚本按钮管理、脚本信息获取、全局接口共享

════════════════════════════════════════
一、脚本按钮(仅脚本中可用)
════════════════════════════════════════

getScriptButtons() → ScriptButton[]
  获取当前脚本的按钮列表
  ScriptButton: {name:string, visible:boolean}

replaceScriptButtons(buttons) → void
  整体替换按钮列表

updateScriptButtonsWith(updater) → ScriptButton[]
  函数式更新按钮列表

appendInexistentScriptButtons(buttons) → void
  追加不存在的按钮(同名不重复添加)

  示例:
    appendInexistentScriptButtons([{name:'重新开始', visible:true}]);

════════════════════════════════════════
二、按钮事件(仅脚本中可用)
════════════════════════════════════════

getButtonEvent(button_name) → string
  获取按钮对应的事件类型，配合eventOn使用

  示例:
    eventOn(getButtonEvent('开始游戏'), () => {
      console.log('按钮被点击了');
    });

════════════════════════════════════════
三、脚本信息(仅脚本中可用)
════════════════════════════════════════

getScriptName() → string          // 脚本名称
getScriptInfo() → string          // 脚本作者注释
replaceScriptInfo(info) → void    // 替换脚本作者注释

════════════════════════════════════════
四、全部启用脚本的按钮
════════════════════════════════════════

getAllEnabledScriptButtons() → {[script_id]: [{button_id, button_name}]}
  获取所有启用脚本的按钮列表

════════════════════════════════════════
五、全局接口共享
════════════════════════════════════════

initializeGlobal(name, value) → void
  将接口共享到全局，使其他前端界面/脚本可用

  示例:
    initializeGlobal('Mvu', Mvu);

waitGlobalInitialized(name) → Promise<T>
  等待其他脚本共享出来的全局接口初始化完毕

  示例:
    await waitGlobalInitialized('Mvu');
    // 此后可直接使用 Mvu 对象

════════════════════════════════════════
六、iframe工具函数
════════════════════════════════════════

getIframeName() → string
  获取当前前端界面/脚本的标识名称
  前端界面: 'TH-message--楼层号--序号'
  脚本: 'TH-script--脚本名--脚本id'

getCurrentMessageId() → number
  获取前端界面所在楼层的楼层号(仅前端界面可用)

getScriptId() → string
  获取脚本的脚本库id(仅脚本可用)

reloadIframe() → void
  重新加载当前前端界面/脚本(等同于window.location.reload())



## 13_扩展管理

- uid: 526466
- displayIndex: 14
- order: 15
- position: 0

【扩展管理】
来源: @types/function/extension.d.ts
用途: 安装、卸载、更新酒馆扩展，检查扩展状态

════════════════════════════════════════
一、查询扩展
════════════════════════════════════════

isAdmin() → boolean
  当前用户是否为管理员(只有管理员能操作全局扩展)

getTavernHelperExtensionId() → string
  获取酒馆助手的扩展id

isInstalledExtension(extension_id) → boolean
  检查是否已安装某扩展

getExtensionType(extension_id) → 'local'|'global'|'system'|null
  获取扩展类型
  local=本地(仅当前用户), global=全局(所有用户), system=内置

getExtensionInstallationInfo(extension_id) → Promise<Info|null>
  获取扩展安装信息
  返回: {current_branch_name, current_commit_hash, is_up_to_date, remote_url}

════════════════════════════════════════
二、安装/卸载/更新
════════════════════════════════════════

注意: 所有操作完成后需刷新页面才生效!

installExtension(url, type) → Promise<Response>
  type: 'local'|'global'

  示例:
    const resp = await installExtension('https://github.com/n0vi028/JS-Slash-Runner', 'local');
    if (resp.ok) {
      toastr.success('安装成功，准备刷新...');
      _.delay(() => triggerSlash('/reload-page'), 3000);
    }

uninstallExtension(extension_id) → Promise<Response>
reinstallExtension(extension_id) → Promise<Response>
updateExtension(extension_id) → Promise<Response>

  示例:
    const resp = await updateExtension('JS-Slash-Runner');
    if (resp.ok) {
      toastr.success('更新成功，准备刷新...');
      _.delay(() => triggerSlash('/reload-page'), 3000);
    }



## 14_导入原始数据

- uid: 505645
- displayIndex: 15
- order: 16
- position: 0

【导入原始数据】
来源: @types/function/import_raw.d.ts
用途: 像酒馆界面里那样导入角色卡、聊天记录、预设、世界书、正则

════════════════════════════════════════

importRawCharacter(filename, content:Blob) → Promise<Response>
  导入角色卡(新建/更新)
  示例:
    const resp = await fetch(角色卡链接);
    await importRawCharacter('角色名.png', await resp.blob());

importRawChat(filename, content:string) → Promise<Response>
  导入聊天文件(仅能导入到当前角色卡)
  注意: filename实际不会作为最终文件名
  示例:
    const resp = await fetch(聊天文件链接);
    await importRawChat('chat.jsonl', await resp.text());

importRawPreset(filename, content:string) → Promise<boolean>
  导入预设(新建/更新)
  示例:
    const resp = await fetch(预设链接);
    await importRawPreset('预设名.json', await resp.text());

importRawWorldbook(filename, content:string) → Promise<Response>
  导入世界书(新建/更新)
  示例:
    const resp = await fetch(世界书链接);
    await importRawWorldbook('世界书名.json', await resp.text());

importRawTavernRegex(filename, content:string) → boolean
  导入酒馆正则
  示例:
    const resp = await fetch(正则链接);
    importRawTavernRegex('正则名.json', await resp.text());



## 15_工具函数

- uid: 684549
- displayIndex: 16
- order: 17
- position: 0

【工具函数与内置接口】
来源: @types/function/util.d.ts, @types/function/builtin.d.ts
用途: 宏替换、获取楼层号、错误处理、剪贴板、markdown渲染等工具

════════════════════════════════════════
一、酒馆助手工具函数
════════════════════════════════════════

substitudeMacros(text) → string
  替换字符串中的酒馆宏
  示例: substitudeMacros('{{char}} in {{lastMessageId}}') → '少女歌剧 in 5'

getLastMessageId() → number
  获取最新楼层id

getMessageId(iframe_name) → number
  从前端界面iframe标识名称获取楼层号(仅对前端界面iframe可用)

errorCatched(fn) → fn
  包装函数，使其报错时通过酒馆通知弹窗显示
  示例:
    function init() { throw Error('出错了'); }
    $(() => { errorCatched(init)(); });

════════════════════════════════════════
二、酒馆内置接口 (builtin对象)
════════════════════════════════════════

builtin.addOneMessage(mes, options?)
  向网页添加一条楼层渲染(底层操作，一般用createChatMessages代替)

builtin.copyText(text)
  复制文本到剪贴板

builtin.duringGenerating() → boolean
  当前是否正在生成中

builtin.renderMarkdown(text) → string
  将markdown渲染为html

builtin.uuidv4() → string
  生成UUID

builtin.saveSettings() → Promise<void>
  保存酒馆设置

builtin.getImageTokenCost(data_url, quality) → Promise<number>
  获取图片的token消耗
  quality: 'low'|'auto'|'high'

builtin.getVideoTokenCost(data_url) → Promise<number>
  获取视频的token消耗

builtin.parseRegexFromString(regex) → RegExp|null
  将正则字符串解析为RegExp对象

builtin.reloadAndRenderChatWithoutEvents() → Promise<void>
  刷新当前聊天并触发渲染事件

builtin.reloadChatWithoutEvents() → Promise<void>
  刷新当前聊天但不触发事件

builtin.reloadEditor(file, load_if_not_selected?)
  刷新世界书编辑器显示

builtin.reloadEditorDebounced(file, load_if_not_selected?)
  刷新世界书编辑器显示(防抖)

builtin.renderPromptManager(after_try_generate?)
  刷新预设提示词列表

builtin.renderPromptManagerDebounced(after_try_generate?)
  刷新预设提示词列表(防抖)

builtin.promptManager
  预设提示词管理器的底层对象，可用于获取提示词集合等



## 16_MVU变量框架

- uid: 374798
- displayIndex: 17
- order: 18
- position: 0

【MVU变量框架】
来源: @types/iframe/exported.mvu.d.ts
用途: 与MVU变量框架交互——获取/修改MVU变量、解析变量更新命令、监听变量事件
前提: 必须先 await waitGlobalInitialized('Mvu') 才能使用

════════════════════════════════════════
一、获取MVU数据
════════════════════════════════════════

Mvu.getMvuData(option) → MvuData

  option: 与变量读写相同的VariableOption
  MvuData: {
    initialized_lorebooks: Record     // 已初始化的世界书
    stat_data: Record<string,any>     // 实际变量数据(核心!)
    ...
  }

  示例:
    await waitGlobalInitialized('Mvu');
    // 获取最新楼层的MVU数据
    const data = Mvu.getMvuData({type:'message', message_id:'latest'});
    const stat = data.stat_data;  // 这就是变量

    // 获取前端界面所在楼层
    const data = Mvu.getMvuData({type:'message', message_id:getCurrentMessageId()});

════════════════════════════════════════
二、替换MVU数据
════════════════════════════════════════

Mvu.replaceMvuData(mvu_data, option) → Promise<void>

  示例:
    const data = Mvu.getMvuData({type:'message', message_id:'latest'});
    _.set(data, 'stat_data.角色.好感度', 30);
    await Mvu.replaceMvuData(data, {type:'message', message_id:'latest'});

════════════════════════════════════════
三、解析变量更新命令
════════════════════════════════════════

Mvu.parseMessage(message, old_data) → Promise<MvuData>

  解析包含 _.set() 等命令的消息字符串，更新变量
  用于自行调用generate后手动更新变量(因为不会自动触发MVU)

  示例:
    const old_data = Mvu.getMvuData({type:'message', message_id:getCurrentMessageId()});
    const message = await generate({user_input:'你好'});
    const new_data = await Mvu.parseMessage(message, old_data);
    await Mvu.replaceMvuData(new_data, {type:'message', message_id:getCurrentMessageId()});

════════════════════════════════════════
四、MVU事件
════════════════════════════════════════

Mvu.events.VARIABLE_INITIALIZED
  新开聊天时变量初始化完成
  listener: (variables, swipe_id) => void

Mvu.events.VARIABLE_UPDATE_STARTED
  变量更新开始
  listener: (variables) => void

Mvu.events.COMMAND_PARSED
  变量更新命令解析完成(可修复命令!)
  listener: (variables, commands, message_content) => void

  命令类型: set|insert|delete|add|move
  每个命令: {type, full_match, args:[], reason}

  示例:
    // 修复gemini在中文间加的'-'
    eventOn(Mvu.events.COMMAND_PARSED, (vars, commands) => {
      commands.forEach(cmd => { cmd.args[0] = cmd.args[0].replaceAll('-',''); });
    });

Mvu.events.VARIABLE_UPDATE_ENDED
  变量更新结束(可修改最终结果!)
  listener: (new_variables, old_variables) => void

  示例:
    // 限制好感度0~100
    eventOn(Mvu.events.VARIABLE_UPDATE_ENDED, vars => {
      _.update(vars, 'stat_data.角色.好感度', v => _.clamp(v, 0, 100));
    });

    // 限制变动幅度不超过3
    eventOn(Mvu.events.VARIABLE_UPDATE_ENDED, (newV, oldV) => {
      const oldVal = _.get(oldV, 'stat_data.角色.好感度');
      _.update(newV, 'stat_data.角色.好感度', v => _.clamp(v, oldVal-3, oldVal+3));
    });

Mvu.events.BEFORE_MESSAGE_UPDATE
  即将用更新后的变量更新楼层
  listener: ({variables, message_content}) => void

════════════════════════════════════════
五、其他
════════════════════════════════════════

Mvu.isDuringExtraAnalysis() → boolean
  酒馆是否正在进行额外模型解析



## 17_Slash命令

- uid: 323727
- displayIndex: 18
- order: 19
- position: 0

【Slash命令】
来源: @types/function/slash.d.ts
用途: 运行酒馆的STScript命令(如弹窗提示、刷新页面、触发AI回复等)

════════════════════════════════════════

triggerSlash(command) → Promise<string>

  运行酒馆Slash命令，返回管道结果
  命令写错不会有反馈，出错会抛出异常

  注意: 优先使用酒馆助手接口而非Slash命令!
  Slash命令难以与代码结合，仅在没有对应接口时使用。

  常用命令示例:

    // 弹出通知(但更建议用 toastr.success('成功!'))
    triggerSlash('/echo severity=success 运行成功!');

    // 触发AI回复(先创建用户消息，再触发)
    await createChatMessages([{role:'user', message:'你好'}]);
    await triggerSlash('/trigger');

    // 刷新页面
    triggerSlash('/reload-page');

    // 获取最后一条消息的id(但更建议用 getLastMessageId())
    const id = await triggerSlash('/pass {{lastMessageId}}');

  完整命令列表请参考项目中的 slash_command.txt 文件。



## 18_版本信息

- uid: 891156
- displayIndex: 19
- order: 20
- position: 0

【版本信息】
来源: @types/function/version.d.ts
用途: 获取酒馆和酒馆助手的版本号，用于兼容性判断

════════════════════════════════════════

getTavernVersion() → Promise<string>
  获取SillyTavern酒馆的版本号
  示例返回值: "1.12.9"

getTavernHelperVersion() → Promise<string>
  获取酒馆助手(TavernHelper)插件的版本号
  示例返回值: "1.5.0"

使用场景:
  - 检查酒馆版本是否支持某个功能
  - 检查酒馆助手版本是否满足脚本最低要求
  - 在脚本启动时进行版本兼容性校验



## 19_角色卡管理

- uid: 50316
- displayIndex: 20
- order: 21
- position: 0

【角色卡管理】
来源: @types/function/character.d.ts
用途: 创建、获取、修改、删除角色卡，获取角色卡列表

════════════════════════════════════════
一、角色卡数据结构 (Character)
════════════════════════════════════════

主要字段:
  name          角色名
  personality   性格
  description   描述
  scenario      场景
  first_mes     第一条消息
  mes_example   对话示例
  creator_notes 创作者笔记
  system_prompt 系统提示词
  post_history_instructions  越权提示词(角色备注)
  tags          标签数组
  creator       创作者
  extensions.depth_prompt     深度提示词 (含 prompt, depth, role)
  data.extensions.regex_scripts  角色正则表达式数组

════════════════════════════════════════
二、查询角色卡
════════════════════════════════════════

getCharacterNames() → Promise<string[]>
  获取所有已导入角色卡的名称列表

getCurrentCharacterName() → Promise<string>
  获取当前选中的角色卡名称

getCharacter(name?) → Promise<Character>
  获取角色卡完整数据
  name: 角色卡名称(可选，默认当前角色)

════════════════════════════════════════
三、创建角色卡
════════════════════════════════════════

createCharacter(character) → Promise<void>
  创建新角色卡
  character: 至少需要 name 字段

  示例:
    await createCharacter({
      name: '测试角色',
      personality: '开朗活泼',
      description: '一个测试用角色',
      first_mes: '你好！我是测试角色！',
    });

════════════════════════════════════════
四、修改角色卡
════════════════════════════════════════

replaceCharacter(character, name?) → Promise<void>
  整体替换角色卡数据
  character: 完整的角色卡数据
  name: 要替换的角色卡名(可选，默认当前角色)

updateCharacterWith(updater, name?) → Promise<void>
  局部修改角色卡数据(推荐)
  updater: 接收当前角色卡数据，直接修改即可
  name: 角色卡名(可选，默认当前角色)

  示例:
    // 修改性格描述
    await updateCharacterWith(char => {
      char.personality = '沉稳冷静';
    });

    // 添加标签
    await updateCharacterWith(char => {
      char.tags.push('原创角色');
    });

════════════════════════════════════════
五、删除角色卡
════════════════════════════════════════

deleteCharacter(name?, delete_chats?) → Promise<void>
  删除角色卡
  name: 角色卡名(可选，默认当前角色)
  delete_chats: 是否同时删除聊天记录(可选，默认false)



## 世界书配置指南

- uid: 885238
- displayIndex: 21
- order: 22
- position: 0

世界书配置指南
==========

本指南供秋青子（AI助手）和用户共同使用。秋青子用它来自动配置世界书条目，用户用它来理解为什么这样配置。

注意事项：
- 世界书名字不要带emoji，太老版本的Node处理不了，会导致世界书消失
- 对世界书的改动会自动保存，改了别的条目后上一个不支持ctrl+z撤回，容易误删内容
- 建议在VSCode或其他编辑工具里写好再粘贴到酒馆
- 删除操作不可撤销，务必小心

==========

一、触发策略

世界书条目有三种触发方式：

蓝灯（常驻激活）
- 只要世界书开着且条目开关开着，内容就一直发给AI
- 适用于：世界观设定、背景设定、角色速览等必须始终存在的内容

绿灯（关键词触发）
- 只在最近的正文中出现"绿灯关键词"时才触发
- "最近"的范围由"扫描深度"决定（推荐设为2，即最后一条user消息和最后一条AI消息）
- 关键词必须用英文逗号","分隔，不能用空格、中文逗号、分号
- 适用于：角色详细信息、NPC、场景、事件等按需加载的内容

绿灯的两个已知问题（互相矛盾）：
1. 遗漏触发：剧情要写某角色但上文刚好没提到关键词，导致AI缺少资料，开始已读乱回
2. 过度触发：引入角色后AI一直写相关内容，每次回复都有关键词，越写越多无法推进

因此现在很多角色卡放弃绿灯，转用变量系统（如MVU+EJS）实现更精细的提示词控制。但对于简单的角色卡，绿灯仍然够用。

==========

二、位置

位置决定条目内容在整段提示词中的放置位置。只需要用三个位置：

角色定义前（World Info before）
- 放"大"世界观：设定、机制、地点、历史、背景等宏观内容
- 这些是AI理解世界的基础框架

角色定义后（World Info after）
- 放"小"世界观：角色详细信息、物品、事件等具体内容
- 这些是具体的角色和事物信息

D齿轮深度0（D0）
- 放直接指导AI行为的内容，效果最强
- 这里不写设定，而是写"指导"。例如不写"他习惯每天喝牛奶"，而写"情节进展到早上时，写该角色喝牛奶的情节"
- 典型用途：二次解释（纠正AI对角色的误解）
- 注意：role选D齿轮即system

D1、D2、D3等其他深度：不要放任何东西！
- 预设会把聊天记录框起来告诉AI"这是互动历史"
- 往D0以外的深度放东西会破坏互动历史的完整性
- AI看来剧情走着走着突然插进来一大段设定说明书，负面影响很大

==========

三、顺序

在位置相同的前提下，条目之间的前后顺序由"顺序"决定。
顺序越大越靠后。可以理解为"第几个"。

推荐顺序分配：
- 世界观总纲：顺序1
- 区域速览/背景设定：顺序2-3
- 角色速览：顺序4
- 场景/事件详情：顺序50-98
- 核心角色详细信息：顺序99
- NPC/EJS控制器：顺序100

==========

四、深度（仅D齿轮位置使用）

深度是控制条目在聊天记录中相对位置的概念：
- 从聊天记录最底部往上数
- 第N条消息与第N+1条消息之间的位置就是深度N
- 深度0 = 整个聊天记录的最底部（最后一条消息下方），影响最大
- 深度越大越靠上，影响越小
- D999 = 比第一条消息还靠上

==========

五、递归设置（必读）

所有世界书条目必须同时勾选：
- 不可递归
- 防止进一步递归

原因：防止绿灯激活绿灯，防止TOKEN爆炸。无论蓝灯还是绿灯都必须勾选。

==========

六、单角色卡 vs 多角色卡（配置前必须先判断）

在配置任何条目之前，必须先判断世界书属于哪种类型。
判断依据：世界书中有几个不同的核心角色（主要人设角色，不是NPC）。

关键区分：
- 同一角色的拆分条目（基础/外貌/性格/背景/技能/NSFW...）≠ 不同角色
- 即使一个角色的人设拆成了10个条目，只要都是同一个角色，就是单角色卡
- 只有当条目描述的是不同的独立角色时，才算多角色卡

单角色卡（只有1个核心角色）：
- 该角色的所有条目全部蓝灯常驻，无论拆成多少个
- 绝对禁止把单角色卡拆分的条目改成绿灯关键词触发
- 原因：这些都是同一个角色的设定，缺一不可，必须始终存在

多角色卡（有2个及以上核心角色）：
- 角色速览：蓝灯（常驻）
- 各角色详细信息：绿灯（关键词触发）
- 原理：AI看到速览→决定用哪个角色→关键词触发对应角色的详细信息

==========

七、各类条目的推荐配置

以下是秋青子自动配置世界书条目时使用的默认值：

【世界观/背景设定】
位置：角色定义前
触发：蓝灯常驻
顺序：1-3（按重要性排序）
递归：不可递归 + 防止进一步递归

【角色速览】
位置：角色定义前
触发：蓝灯常驻
顺序：4
递归：不可递归 + 防止进一步递归

【核心角色详细信息】（基础/调色盘/三面性/衣柜/NSFW调色盘/外貌/背景/技能等拆分条目）
位置：角色定义后
触发：
  - 单角色卡 → 全部蓝灯（无论拆成多少个条目，都是同一个角色，必须常驻）
  - 多角色卡 → 绿灯（关键词=角色名,昵称,外号）
顺序：99（单角色卡的拆分条目可按逻辑排列，如基础10→外貌20→性格30→背景40）
递归：不可递归 + 防止进一步递归

【二次解释】
位置：D齿轮深度0（role=system）
触发：绿灯（关键词=角色名）
顺序：1（多角色按顺序排：角色A=1，角色B=2...）
递归：不可递归 + 防止进一步递归
说明：二次解释放在D0是因为它是对AI的直接指导纠正，需要最强影响力

【NPC】
位置：角色定义后
触发：绿灯（关键词=NPC名,外号,昵称,职务）
顺序：100
递归：不可递归 + 防止进一步递归

【场景/事件】
位置：角色定义后
触发：绿灯（关键词=场景名,地点名,事件名,相关词）
顺序：50-98
递归：不可递归 + 防止进一步递归

【EJS控制器】
位置：角色定义后
触发：蓝灯常驻
顺序：100
递归：不可递归 + 防止进一步递归

【EJS被加载条目（多阶段人设等）】
状态：禁用（enabled=false）
说明：这些条目由EJS控制器通过getwi()动态加载，不要手动开启！
手动开启会导致所有阶段内容同时出现在AI上下文中，造成角色行为混乱。

【MVU条目】
各有特定的D齿轮深度配置，参考MVU相关知识库

==========

八、完整配置示例

示例A：单角色卡（林小雨，拆分为多个条目）

所有条目全蓝灯，因为只有一个核心角色：

蓝灯-角色定义后：
1. 林小雨_角色基础（顺序10）
2. 林小雨_外貌（顺序20）
3. 林小雨_性格调色盘（顺序30）
4. 林小雨_背景故事（顺序40）
5. 林小雨_NSFW调色盘（顺序50）

蓝灯-D齿轮深度0：
6. 林小雨_二次解释（顺序1）

所有条目都勾选：不可递归 + 防止进一步递归
注意：虽然拆成了5个条目，但都是林小雨一个人的设定，全部蓝灯常驻。

---

示例B：多角色卡（林小雨+赵明月，带世界观和NPC）

蓝灯-角色定义前（顺序1-4）：
1. 世界观设定（顺序1）
2. 学校背景（顺序2）
3. 角色速览（顺序4）

绿灯-角色定义后（顺序50-98）：
4. 场景_学校图书馆（顺序80，关键词：图书馆）
5. 场景_林小雨家（顺序80，关键词：林小雨家,小雨家）

绿灯-D齿轮深度0：
6. 林小雨_二次解释（顺序1，关键词：林小雨,小雨）
7. 赵明月_二次解释（顺序2，关键词：赵明月,明月）

绿灯-角色定义后（顺序99）：
8. 林小雨_基础信息（关键词：林小雨,小雨）
9. 林小雨_性格调色盘（关键词：林小雨,小雨）
10. 赵明月_基础信息（关键词：赵明月,明月）
11. 赵明月_性格调色盘（关键词：赵明月,明月）

绿灯-角色定义后（顺序100）：
12. NPC_王老师（关键词：王老师,王静,班主任）

所有条目都勾选：不可递归 + 防止进一步递归

==========

九、关键词设计原则

关键词要覆盖所有可能的提及方式：
- 势力条目：势力全名,简称,所在地名（如：天剑圣地,天剑峰,天剑）
- 场景条目：场景名,所在区域名,别称（如：红尘酒家,酒家,红尘）
- NPC条目：全名,昵称,外号,职务（如：林小雨,小雨,班长）
- 角色条目：全名,昵称,外号（如：秋明月,明月）

关键词之间必须用英文逗号","隔开：
- 正确：林小雨,小雨,班长
- 错误：林小雨，小雨，班长（中文逗号）
- 错误：林小雨 小雨 班长（空格）

==========

十、概率/黏性/冷却

这些选项基本用不到，保持默认即可。

==========

十一、LorebookToolCall 配置参数对照表

当使用 SetAttribute 工具配置条目时，以下是各配置项对应的参数：

蓝灯常驻：
  strategy: { type: "constant" }

绿灯关键词触发：
  strategy: { type: "selective", keys: ["关键词1", "关键词2"] }

位置-角色定义前：
  position: { type: "before_character_definition", order: 顺序值 }

位置-角色定义后：
  position: { type: "after_character_definition", order: 顺序值 }

位置-D齿轮深度0：
  position: { type: "at_depth", depth: 0, role: "system", order: 顺序值 }

递归设置：
  recursion: { prevent_incoming: true, prevent_outgoing: true }

禁用条目：
  enabled: false

==========

这就是世界书配置的全部要点。记住核心原则：
1. 配置前先判断世界书类型（单角色卡/多角色卡），同一角色的拆分条目≠不同角色
2. 单角色卡全蓝灯（无论拆成多少个条目），绝对禁止改成绿灯
3. 多角色卡速览蓝灯+详细绿灯
4. "大"世界观放角色定义前，"小"世界观放角色定义后
5. D0放直接指导AI的内容，D1及以上不放任何东西
6. 所有条目都勾选两个递归选项
7. 关键词用英文逗号分隔，覆盖所有可能的称呼



## 前端美化自查

- uid: 245099
- displayIndex: 22
- order: 23
- position: 0

前端美化系统自查标准

本文件供AI在完成前端美化创作后自动审查使用。
先判断使用的是模式A（正文美化）还是模式B（结构化数据美化），然后按对应清单检查。

═══════════════════════════════════════
通用检查项（两种模式都要检查）
═══════════════════════════════════════

1. 酒馆正则配置检查
- 正则是否能匹配到标签区域？
- 是否使用 [\s\S]*? 匹配内容？（不能用 .* ）
- 是否没有用捕获组 ()？（新写法不需要 $1）
- 是否勾选了"AI输出、在编辑时运行、仅格式显示"？

错误示例：
<story>([\s\S]*?)</story>  /* 不应该用捕获组 */
<story>.*</story>  /* .* 无法匹配换行 */

正确示例：
<story>[\s\S]*?</story>
<char_status>[\s\S]*?</char_status>

2. HTML文件基础检查
必需部分：
- <!DOCTYPE html>声明
- <head>部分（charset、style）
- <body>部分
- getMessageData() 函数（通过 getChatMessages 获取消息）
- init() 主函数
- $(function() { init(); }); 加载方式

检查要点：
- 是否使用 getChatMessages(getCurrentMessageId()) 获取消息？（必须）
- 是否没有使用 $1 获取数据？（禁止）
- 是否没有使用 DOMContentLoaded？（禁止）
- 是否使用 $(function() {}) 作为加载时机？（必须）
- 注释是否全部使用 /* */ 格式？（禁止使用 //）
- 是否有错误处理（try-catch）？

3. 标签一致性检查
检查标签是否在所有文件中完全一致：
- 正则中的标签名
- HTML中 messageText.match() 里的标签名
- 如有源文件，源文件中的标签名

4. 代码规范检查
- 注释是否全部使用 /* */ ？
- 加载方式是否使用 $(function() {}) ？
- 是否避免使用 vh 单位？
- 是否避免使用 position: absolute ？
- 页面是否适配容器宽度？

═══════════════════════════════════════
模式A（正文美化）专项检查
═══════════════════════════════════════

5A. 正文提取检查
- 从消息中正确提取标签内的文本
- 有合理的文本处理（如换行转段落）
- 渲染后可读性好

6A. 文件完整性
模式A只需要2个文件：
- 酒馆正则配置
- 前端界面HTML代码
不需要世界书条目（除非有关键词触发需求）。

═══════════════════════════════════════
模式B（结构化数据美化）专项检查
═══════════════════════════════════════

5B. 源文件结构检查
必需部分：
- <页面名称相关>开头
- <FORMAT_RULE>部分
- Format: 标签
- 数据格式示例
- # 注意部分
- # 触发词部分

检查要点：
- 是否强调禁用<think>、<thinking>、<content>标签？
- 是否列出触发词？
- 闭合标签后是否说明禁止输出其他内容？

6B. 解析函数检查
检查 parseData() 是否：
- 先从消息中提取外层标签内容
- 根据选用的数据格式正确解析
- 如果用 [字段|值] 格式，是否用 \[字段\|([^\]]+)\] 捕获？
- 多值字段是否用 split('|') 分割？
- 列表字段是否用 while 循环？
- 有错误处理？

7B. 渲染函数检查
检查 renderPage() 是否：
- 接收解析后的数据
- 有空值处理（|| '' 或 || '默认值'）
- 更新DOM

8B. 文件完整性
模式B需要3个文件：
- 酒馆正则配置
- 源文件（世界书条目）
- 前端界面HTML代码

═══════════════════════════════════════
常见错误速查
═══════════════════════════════════════

1. 使用了旧写法 $1 传数据 → 改用 getChatMessages 获取消息
2. 使用了 DOMContentLoaded → 改用 $(function() {})
3. 使用了 // 注释 → 改用 /* 注释 */
4. 标签不一致（正则、HTML、源文件中不同）
5. 使用了禁用标签（<think>等）
6. 多值字段解析错误（在第一个|停止）
7. 正则使用了捕获组 () → 去掉括号
8. 模式A却写了源文件 → 正文美化不需要源文件
9. 模式B却没有源文件 → 结构化数据需要告诉AI输出格式



## 世界观自查

- uid: 324506
- displayIndex: 23
- order: 24
- position: 0

世界书完整度评估指南

本文件供AI在用户要求评估世界书时使用。

═══════════════════════════════════════
评估原则
═══════════════════════════════════════

1. 有什么评什么
- 不套用固定清单
- 世界书里有角色基础就评角色基础，有调色盘就评调色盘
- 没有的内容不强求，但如果按流程应该有而缺失，要提醒
- 可选模块（三面性、NSFW调色盘、NPC）没有不算缺失

2. 评价态度
好的地方要具体夸:
- 不是"写得不错"，而是"外貌部分只写了3个差异特征就锁定了角色，这正是特征差异化原则的正确运用"
- 不是"衍生写得好"，而是"叛逆衍生三的变奏描写让角色在舞台上的行为有了不可预测性，这种手写衍生是AI写不出来的"

不好的地方要引导:
- 不是"这里不好"，而是"这段外貌写了'精致的五官'，这是万能描写，放在谁身上都行。建议改成只属于你角色的具体特征"
- 不是"衍生太少"，而是"[底色]目前只有1条衍生，建议至少写2-3条，可以想想这个性格在[具体场景]里会怎么表现"

3. 不评估的内容
- 不评估调色盘的衍生内容本身（那是用户的创意）
- 不评估二次解释的内容本身（那是作者的私人注释）
- 只评估结构完整性、格式规范、写作原则遵守情况

═══════════════════════════════════════
前置步骤：世界书构成结构分析（必须先做）
═══════════════════════════════════════

在检查任何配置之前，必须先分析世界书的整体构成结构。
这一步决定了后续所有配置检查的判断基准。

分析方法：
1. 列出所有条目名称
2. 阅读条目内容，判断每个条目的用途（角色基础/调色盘/外貌/世界观/NPC/事件/脚本/...）
3. 统计有几个不同的核心角色（主要人设角色，不是NPC）
4. 判断世界书类型

世界书类型判断规则：

A. 单角色卡（只有1个核心角色）
   特征：所有条目都在描述同一个角色的不同方面
   例如：角色基础、外貌、性格调色盘、背景故事、NSFW档案——这些都是同一个角色的拆分
   配置原则：全部蓝灯（constant），因为这些条目都是这一个角色的设定，必须常驻

B. 多角色卡（有2个及以上核心角色）
   特征：条目中有多个不同角色的详细人设
   配置原则：角色速览蓝灯，各角色详细信息绿灯（selective）

C. 世界观型（以世界设定为主）
   特征：大量世界设定条目（地理/势力/规则等），角色条目较少
   配置原则：总纲/速览蓝灯，详情绿灯

D. 混合型（角色+世界观+NPC等）
   特征：既有核心角色人设，也有世界设定和NPC
   配置原则：核心角色和世界总纲蓝灯，NPC/场景/事件绿灯

关键区分：
- 同一角色的拆分条目（外貌/性格/背景/技能...）≠ 不同角色
- 即使一个角色的人设拆成了10个条目，只要都是同一个角色，就是单角色卡，全蓝灯
- 只有当条目描述的是不同的独立角色时，才考虑用绿灯

═══════════════════════════════════════
世界书条目配置检查规则
═══════════════════════════════════════

注意：以下规则必须结合上面的"构成结构分析"结果来应用。
不同类型的世界书，配置规则不同。

1. 递归设置检查
- 所有条目必须同时勾选"不可递归"和"防止进一步递归"
- 无论蓝灯还是绿灯都必须勾选

2. 蓝灯/绿灯检查（必须基于结构分析结果）
- 单角色卡 → 该角色的所有条目（无论怎么拆分）全部蓝灯
- 多角色卡 → 角色速览蓝灯，各角色详细信息绿灯
- 世界观/背景设定/角色速览 → 蓝灯（常驻）
- NPC → 绿灯
- 场景/事件（非核心角色相关） → 绿灯
- 绝对禁止：把单角色卡拆分的条目改成绿灯关键词触发

3. 顺序检查
- 世界观/背景（1-3）→ 速览（4）→ 场景事件（50-98）→ 核心角色（99）→ NPC/EJS（100）
- 二次解释特殊：系统提示词后（深度0），顺序1~10
- 单角色卡的拆分条目：按逻辑顺序排列即可（如基础→外貌→性格→背景→技能），无需特定区间

4. 位置检查
- "大"世界观（世界设定、力量体系等）→ 角色定义前
- "小"世界观（角色、NPC、事件、EJS等）→ 角色定义后
- 二次解释 → 系统提示词后（深度0）

5. 关键词检查（仅绿灯条目需要）
- 同一角色的所有文件关键词应一致
- 关键词用英文逗号隔开
- 应包含角色名、外号、昵称等
- 单角色卡的蓝灯条目不需要关键词

═══════════════════════════════════════
写作质量抽查
═══════════════════════════════════════

1. 八股化检查
- 模糊词（似乎/仿佛/宛如）
- 劣质比喻（像小兽/投石入湖）
- 微表情（嘴角上扬/眼里闪过）
- 极端情绪词（极度/陷入极大的）
- 否定转折句（不是...而是...）
- 过度心理描写

2. 特征差异化检查（角色基础的外貌部分）
- 是否写了AI数据库默认就知道的内容
- 是否有万能美人描写
- 遮住名字能否认出角色

3. 白描原则检查
- 是否有不必要的形容词
- 是否有主观评价

═══════════════════════════════════════
评估输出格式
═══════════════════════════════════════

根据世界书中实际存在的内容，动态生成评估报告：

世界书完整度评估报告

═══════════════════════════════════════
[部分名称]
═══════════════════════════════════════
  [子项名称]:
    状态: [✅ 完成 / ⚠️ 需改进 / ❌ 缺失]
    评价: [具体评价]
    [如果需改进:]
    问题: [具体问题]
    建议: [具体改进方向]

═══════════════════════════════════════
世界书条目配置检查
═══════════════════════════════════════
  条目「[条目名]」:
    位置: [当前位置] → [✅ 正确 / ❌ 应为xxx]
    触发方式: [蓝灯/绿灯] → [✅ 正确 / ❌ 应为xxx]
    顺序: [当前顺序] → [✅ 正确 / ❌ 应为xxx]
    递归选项: [✅ 已勾选两项 / ❌ 未勾选]
    关键词: [当前关键词] → [✅ 正确 / ⚠️ 建议补充xxx]

═══════════════════════════════════════
总评
═══════════════════════════════════════
  已完成的部分: ...
  亮点: ...
  需要改进: ...
  配置问题: ...
  缺失项（如有）: ...
  下一步建议: ...



## 世界书评估

- uid: 372524
- displayIndex: 24
- order: 25
- position: 0

世界书完整度评估指南

本文件供AI在用户要求评估世界书时使用。

═══════════════════════════════════════
评估原则
═══════════════════════════════════════

1. 有什么评什么
- 不套用固定清单
- 世界书里有角色基础就评角色基础，有调色盘就评调色盘
- 没有的内容不强求，但如果按流程应该有而缺失，要提醒
- 可选模块（三面性、NSFW调色盘、NPC）没有不算缺失

2. 评价态度
好的地方要具体夸:
- 不是"写得不错"，而是"外貌部分只写了3个差异特征就锁定了角色，这正是特征差异化原则的正确运用"
- 不是"衍生写得好"，而是"叛逆衍生三的变奏描写让角色在舞台上的行为有了不可预测性，这种手写衍生是AI写不出来的"

不好的地方要引导:
- 不是"这里不好"，而是"这段外貌写了'精致的五官'，这是万能描写，放在谁身上都行。建议改成只属于你角色的具体特征"
- 不是"衍生太少"，而是"[底色]目前只有1条衍生，建议至少写2-3条，可以想想这个性格在[具体场景]里会怎么表现"

3. 不评估的内容
- 不评估调色盘的衍生内容本身（那是用户的创意）
- 不评估二次解释的内容本身（那是作者的私人注释）
- 只评估结构完整性、格式规范、写作原则遵守情况

═══════════════════════════════════════
世界书条目配置检查规则
═══════════════════════════════════════

1. 递归设置检查
- 所有条目必须同时勾选"不可递归"和"防止进一步递归"
- 无论蓝灯还是绿灯都必须勾选

2. 蓝灯/绿灯检查
- 世界观、背景设定、角色速览 → 应为蓝灯（常驻）
- 单角色卡 → 全部蓝灯即可
- 多角色卡 → 角色速览蓝灯，各角色详细信息绿灯
- NPC → 绿灯
- 场景/事件 → 绿灯

3. 顺序检查
- 世界观/背景（1-3）→ 速览（4）→ 场景事件（50-98）→ 核心角色（99）→ NPC/EJS（100）
- 二次解释特殊：系统提示词后（深度0），顺序1~10

4. 位置检查
- "大"世界观（世界设定、力量体系等）→ 角色定义前
- "小"世界观（角色、NPC、事件、EJS等）→ 角色定义后
- 二次解释 → 系统提示词后（深度0）

5. 关键词检查（绿灯条目）
- 同一角色的所有文件关键词应一致
- 关键词用英文逗号隔开
- 应包含角色名、外号、昵称等

6. 单角色vs多角色判断
- 如果只有一个核心角色 → 全蓝灯
- 如果有多个核心角色 → 速览蓝灯+详细绿灯

═══════════════════════════════════════
写作质量抽查
═══════════════════════════════════════

1. 八股化检查
- 模糊词（似乎/仿佛/宛如）
- 劣质比喻（像小兽/投石入湖）
- 微表情（嘴角上扬/眼里闪过）
- 极端情绪词（极度/陷入极大的）
- 否定转折句（不是...而是...）
- 过度心理描写

2. 特征差异化检查（角色基础的外貌部分）
- 是否写了AI数据库默认就知道的内容
- 是否有万能美人描写
- 遮住名字能否认出角色

3. 白描原则检查
- 是否有不必要的形容词
- 是否有主观评价

═══════════════════════════════════════
评估输出格式
═══════════════════════════════════════

根据世界书中实际存在的内容，动态生成评估报告：

世界书完整度评估报告

═══════════════════════════════════════
[部分名称]
═══════════════════════════════════════
  [子项名称]:
    状态: [✅ 完成 / ⚠️ 需改进 / ❌ 缺失]
    评价: [具体评价]
    [如果需改进:]
    问题: [具体问题]
    建议: [具体改进方向]

═══════════════════════════════════════
世界书条目配置检查
═══════════════════════════════════════
  条目「[条目名]」:
    位置: [当前位置] → [✅ 正确 / ❌ 应为xxx]
    触发方式: [蓝灯/绿灯] → [✅ 正确 / ❌ 应为xxx]
    顺序: [当前顺序] → [✅ 正确 / ❌ 应为xxx]
    递归选项: [✅ 已勾选两项 / ❌ 未勾选]
    关键词: [当前关键词] → [✅ 正确 / ⚠️ 建议补充xxx]

═══════════════════════════════════════
总评
═══════════════════════════════════════
  已完成的部分: ...
  亮点: ...
  需要改进: ...
  配置问题: ...
  缺失项（如有）: ...
  下一步建议: ...



## 一般条目自查

- uid: 764098
- displayIndex: 25
- order: 26
- position: 0

角色卡与故事内容自查标准

本文件供AI在完成创作后自动审查使用。

═══════════════════════════════════════
角色卡制作审查标准
═══════════════════════════════════════

必查项目：

0. 外貌特征差异化检查（角色基础信息专用）
如果是角色基础信息：
- 是否写了AI数据库默认就知道的内容？（如中国角色写"黑发黑瞳"、日本角色写"黑发"、18岁写"年轻"）→ 删除
- 是否有"万能美人"描写？（精致、白皙、好看等放在谁身上都行的词）→ 删除
- 遮住名字，只靠外貌描写能认出角色吗？→ 不能则需要补充真正的特征或删除废话
- 是否用"描写美感"代替了"描写特征"？→ 改成具体特征
- 判断标准："蓝头发马尾辫琥珀瞳羽丘校服"能认出角色，"精致的脸蛋白皙的皮肤桃花眼柳叶眉"不能

1. 八股化检查
扫描以下八股化表达，发现后删除或改写：
- 模糊词：似乎、几乎、仿佛、如同、宛如、好像
- 陈旧比喻：像小兽、像小兔子、投石入湖、心湖泛起涟漪
- 八股微表情：嘴角微微上扬、眼中闪过一丝XX、指尖微微泛白（注意：正常使用"笑了""皱眉""攥拳"等常见动作词不算八股，不要矫正过度把正常表达改成物理性肌肉描述）
- 语气声线描写：带着xx的口吻、用xx的语气、充满xx的味道
- 极端情绪词：陷入极大的恐惧、极度羞耻、万念俱灰
- 否定转折句式：不是...而是...的固定句式
- 过度心理描写：大段内心活动、"此子绝非常人"式评价
- 性格标签化："她很温柔""她很善良"等标签式定义

2. 绝对零度原则检查
- 是否有主观评价和判断？删除
- 是否用了陈旧/劣质比喻？改成直接描述（注意：不是禁止一切比喻，而是禁止AI常用的陈词滥调比喻）
- 是否堆砌了无意义的形容词？精简（注意：不是删除一切形容词，"红色的""破旧的"等提供信息的形容词应保留，"精致的""美丽的"等不提供具体信息的才删除）
- 是否用了代词和意象词导致含义模糊？改成具体本意

3. 语料纯净度检查
如果内容包含语料/台词：
- 是否混入了动作描写？删除
- 是否混入了表情神态？删除
- 是否混入了心理活动？删除
- 只保留纯对话

4. 具体性检查
- 是否有抽象描述？改成具体行为
- 是否有笼统表述？改成具体细节
- 是否贴标签？改成行为展现

5. 真实感检查
如果是三面性：
- 每张面是否有完整的五个部件（触发条件、能量状态、语料、身体行为模式、功能）？
- 语料是否从调色盘移出来了？
- 是否混入了二次解释的内容（出现"因为""本质上""其实""内心"）？
- 面与面之间是否写了过渡和渗透？
- 每张面的压力性质是否真的不同？

如果是二次解释：
- 是否是作者的私人注释，而非角色定义？
- 是否针对具体的调色盘衍生进行了解释？
- 是否防止了AI的某种可能的误解？
- 是否和调色盘衍生形成了联动？

如果是NSFW调色盘：
- 是否从"为什么做"而不是"做什么"的角度写的？
- 是否把性和人格连接起来了？
- 是否避免了清单式的"敏感部位""喜欢的姿势"写法？
- 衍生是否有具体的动机和原因？

6. 格式检查
- 是否用YAML中文格式？
- 是否用代码块包裹？
- 是否有合适的标签包裹（如果需要）？
- 缩进是否正确（2空格）？
- 冒号后是否有空格？

7. 角色一致性检查
- 性格是否前后矛盾？
- 行为是否符合设定？
- 语料是否符合性格？

常见问题修改示例：

错误："她的眼神似乎有些迷离，仿佛陷入了回忆"
修改："她盯着墙壁发呆"

错误："带着羞涩的口吻说"
修改：删除，只保留对话

错误："性格温柔善良"
修改："遇到受伤的小动物会带回家照顾，会把零花钱分给流浪汉"

错误：语料中混入"她低下头，小声说："
修改：删除动作，只保留"..."（对话内容）

⚠️ 矫正过度示例（不要这样改）：
原文："她笑了"
错误修改："她的颧骨肌和嘴角肌肉同时收缩"← 这是矫正过度，白描不是物理学描述
正确做法：保留"她笑了"，这本身就是简洁直接的白描

═══════════════════════════════════════
故事内容审查标准
═══════════════════════════════════════

必查项目：

1. 八股化检查
扫描以下八股化表达，发现后删除或改写：
- 模糊词：似乎、几乎、仿佛、如同、宛如、好像
- 陈旧比喻：像小兽、像小兔子、投石入湖、心湖泛起涟漪
- 八股微表情：嘴角微微上扬、眼中闪过一丝XX（正常动作词"笑了""皱眉"不算八股）
- 固定句式：不是...而是...、与其说...不如说...
- 极端情绪词：极度、万分、无比、深深的
- 意识流心理描写：长篇内心独白

2. 白描原则检查
- 精简堆砌的无意义形容词（"红色的门"可以保留，"精美绝伦的门"需要精简）
- 删除主观评价和感受判断
- 用具体行为代替抽象描述
- 不要矫正过度：白描是简洁直接，不是把正常表达改成物理性肌肉描写

3. 对话质量检查
- 对话是否符合角色性格？
- 是否有"XX地说"的多余描述？
- 对话是否自然，不做作？

4. 场景描写检查
- 是否堆砌形容词？
- 是否用具体细节而非抽象描述？
- 是否简洁干净？

5. 情节合理性检查
- 角色行为是否符合设定？
- 是否有逻辑漏洞？
- 是否有OOC（脱离人设）？

6. 格式检查
- 是否用YAML中文格式（如果是设定类）？
- 是否用代码块包裹？
- 是否有合适的标签（如果需要）？

常见问题修改示例：

错误："她的心情似乎有些复杂"
修改："她皱着眉，咬着嘴唇"

错误："房间里弥漫着一股温馨的气息"
修改："房间里有炖汤的香味"

错误："他温柔地说"
修改：删除"温柔地"，只保留"他说"或直接对话


## MVU前端状态栏自查

- uid: 60264
- displayIndex: 26
- order: 27
- position: 0

MVU前端状态栏自查标准

本文件供AI在完成MVU前端状态栏创作后自动审查使用。

═══════════════════════════════════════
检查清单
═══════════════════════════════════════

1. HTML结构完整性
- 有 <head> 和 <body>
- <head> 里有 <script type="module">
- <body> 里有HTML内容（结构可以任意）

2. CSS样式检查（必须严格检查）
- body 必须有 margin: 0; padding: 0;
- 重要：不能是 padding: 10px 或其他任何非0的值
- 如果需要边距，应该给容器元素加 margin，而不是给 body 加 padding
- 样式符合用户要求的UI风格
- 样式不会导致布局错乱或显示异常

3. 变量获取检查（重点！）
- 使用了 getAllVariables()
- 所有变量路径都以 'stat_data.' 开头（必须！）
- 使用了 _.get(all_variables, 'stat_data.xxx', '默认值')

对于数组类型变量（如背包、记忆列表）：
- 正确遍历并显示数组内容

对于嵌套对象（如用户信息.背包.材料）：
- 使用 _.get 访问嵌套路径

4. 初始化检查（核心逻辑，必须严格检查）
- 必须使用 await waitGlobalInitialized('Mvu')
- 必须使用 $(errorCatched(init))
- populateCharacterData() 在 init 里调用
- 必须有 eventOn(Mvu.events.VARIABLE_UPDATE_ENDED, ...) 监听变量更新
- 监听回调中必须调用 populateCharacterData()

═══════════════════════════════════════
核心检查重点
═══════════════════════════════════════

最重要的检查点：

1. 所有变量路径必须以 'stat_data.' 开头
- 错误：_.get(all_variables, '角色.年龄', ...)
- 正确：_.get(all_variables, 'stat_data.角色.年龄', ...)

2. 防御性编程（重要，提高代码健壮性）
- 使用 _.get 访问嵌套路径

═══════════════════════════════════════
常见错误
═══════════════════════════════════════

1. body 的 padding 不是 0
   错误：body { padding: 10px; }
   正确：body { margin: 0; padding: 0; }
   如果需要边距：#container { margin: 10px; }

2. 缺少 stat_data 前缀
   错误：_.get(all_variables, '角色.年龄', 'N/A')
   正确：_.get(all_variables, 'stat_data.角色.年龄', 'N/A')

3. 缺少变量更新监听
   必须有 eventOn(Mvu.events.VARIABLE_UPDATE_ENDED, ...) 并在回调中重新渲染



## MVU自查

- uid: 664485
- displayIndex: 27
- order: 28
- position: 0

MVU变量系统自查标准

本文件供AI在完成MVU相关创作后自动审查使用。
涵盖：变量结构脚本、初始变量、变量列表、变量更新规则、变量输出格式、变量输出格式强调。

═══════════════════════════════════════
一、变量结构脚本自查
═══════════════════════════════════════

1. 头尾检查
变量结构脚本必须原封不动地包含：

开头：
import { registerMvuSchema } from 'https://testingcf.jsdelivr.net/gh/StageDog/tavern_resource/dist/util/mvu_zod.js';

结尾：
$(() => {
  registerMvuSchema(Schema);
})

2. javascript语法检查
- javascript语法正确（括号、逗号、引号配对）
- 数组和对象的嵌套层级正确

3. zod 4使用检查
- 没有使用任何 .strict() 或 .passthrough()
- 没有滥用 .optional()
- 没有对根变量的字段使用 .optional() 或 .prefault()
- .prefault/catch(value | () => value) 使用正确
- 针对复杂 .object 有使用 .or(z.literal('待初始化')).prefault('待初始化') 等手段保证变量能有效更新
- 只对必要的键使用了 .describe() 解释用途
- 尽量地使用了 z.object() 而不是 z.array()

4. 代码导入检查
确保代码中仅导入了 registerMvuSchema，没有导入 zod 或 lodash 库。
zod 和 lodash 库已经默认可用，在代码中导入它们反而会导致问题。

5. 常见错误检查
- 数组、对象嵌套层级混乱
- 过分使用了 .optional() 或 .prefault()
- 错误使用了繁体字！需要把所有繁体字改为简体字！

═══════════════════════════════════════
二、初始变量自查
═══════════════════════════════════════

1. YAML格式检查
- YAML语法正确（括号、逗号、引号配对）
- 数组和对象的嵌套层级正确

2. 变量结构检查
- 变量初始值的类型符合变量结构要求

3. 常见错误检查
- 错误使用了繁体字！需要把所有繁体字改为简体字！

4. 条目配置
- 条目名：[initvar]变量初始化勿开
- 位置：D齿轮在深度
- 深度：4
- 顺序：200

═══════════════════════════════════════
三、变量列表自查
═══════════════════════════════════════

变量列表是固定格式，必须与以下完全一致：

```yaml
---
<status_current_variables>
{{format_message_variable::stat_data}}
</status_current_variables>
```

条目配置：
- 条目名：变量列表（不要添加[mvu_update]）
- 位置：D齿轮在深度
- 深度：0
- 顺序：200

═══════════════════════════════════════
四、变量更新规则自查
═══════════════════════════════════════

1. 精简性检查
- 是否对变量名已经解释清楚该如何更新的自明变量填写了大量更新规则
- 是否有变量还能够合并变量更新规则

2. 变量更新结构
检查每个变量mapping：
- z.record 变量是否正确区分了变量路径和 type 中的键名
- type 是否与变量结构脚本中的定义一致
- 是否有 check 字段

3. 特殊规则检查（如有）
如果有特殊系统（傲娇、敌意等），检查：
- 数值范围
- 变化步长
- 特殊条件
- 边界处理

4. 条目配置
- 条目名：[mvu_update]变量更新规则（一定不要忘记[mvu_update]）
- 位置：D齿轮在深度
- 深度：0
- 顺序：200

═══════════════════════════════════════
五、变量输出格式自查
═══════════════════════════════════════

变量输出格式是固定格式，必须与以下完全一致：

```yaml
---
变量输出格式:
  rule:
    - you must output the update analysis and the actual update commands at once in the end of the next reply
    - the update commands works like the **JSON Patch (RFC 6902)** standard, must be a valid JSON array containing operation objects, but supports the following operations instead:
      - replace: replace the value of existing paths
      - delta: update the value of existing number paths by a delta value
      - insert: insert new items into an object or array (using `-` as array index intends appending to the end)
      - remove
      - move
    - don't update field names starts with `_` as they are readonly, such as `_变量`
  format: |-
    <UpdateVariable>
    <Analysis>$(IN ENGLISH, no more than 80 words)
    - ${calculate time passed: ...}
    - ${decide whether dramatic updates are allowed as it's in a special case or the time passed is more than usual: yes/no}
    - ${analyze every variable based on its corresponding `check`, according only to current reply instead of previous plots: ...}
    </Analysis>
    <JSONPatch>
    [
      { "op": "replace", "path": "${/path/to/variable}", "value": "${new_value}" },
      { "op": "delta", "path": "${/path/to/number/variable}", "value": "${positive_or_negative_delta}" },
      { "op": "insert", "path": "${/path/to/object/new_key}", "value": "${new_value}" },
      { "op": "insert", "path": "${/path/to/array/-}", "value": "${new_value}" },
      { "op": "remove", "path": "${/path/to/object/key}" },
      { "op": "remove", "path": "${/path/to/array/0}" },
      { "op": "move", "from": "${/path/to/variable}", "to": "${/path/to/another/path}" },
      ...
    ]
    </JSONPatch>
    </UpdateVariable>
```

条目配置：
- 条目名：[mvu_update]变量输出格式（一定不要忘记[mvu_update]）
- 位置：D齿轮在深度
- 深度：Gemini设置成0 / Claude设置成4
- 顺序：200

═══════════════════════════════════════
六、变量输出格式强调自查
═══════════════════════════════════════

变量输出格式强调是固定格式，必须与以下完全一致：

```yaml
---
变量输出格式强调:
  rule: The following must be inserted to the end of reply, and cannot be omitted
  format: |-
    <UpdateVariable>
    ...
    </UpdateVariable>
```

注意：这个条目只在最后测试角色卡时，发现AI经常不输出变量更新（即<UpdateVariable>块）时才需要。

条目配置：
- 条目名：[mvu_update]变量输出格式强调（一定不要忘记[mvu_update]）
- 位置：D齿轮在深度
- 深度：0
- 顺序：200

═══════════════════════════════════════
通用自查原则
═══════════════════════════════════════

1. 只检查结构和格式正确性，不检查内容丰富度
2. 如果正确就说正确，不要为了检查而找问题
3. 给出具体错误位置和修正方案
4. 发现错误时直接输出修正后的完整代码



## EJS动态内容控制器

- uid: 887811
- displayIndex: 28
- order: 29
- position: 0

动态内容控制器示例（@@preprocessing + getwi）

用途：根据MVU变量值（地点、角色、事件等）动态加载对应世界书条目，避免所有条目同时激活浪费token。

结构：
@@preprocessing
<%
// 读取变量
if (typeof currentDomain === 'undefined') var currentDomain = getvar('stat_data.世界定位.当前大域', { defaults: '中央神州' });
if (typeof currentArea === 'undefined') var currentArea = getvar('stat_data.世界定位.当前区域', { defaults: '' });
if (typeof currentScene === 'undefined') var currentScene = getvar('stat_data.世界定位.当前场景', { defaults: '' });
if (typeof presentCharacters === 'undefined') var presentCharacters = getvar('stat_data.在场人物', { defaults: {} });
if (typeof messageText === 'undefined') {
  const userMessages = getChatMessages(-1, -1, 'user');
  var messageText = userMessages.length > 0 ? userMessages[userMessages.length - 1].message : '';
}
%>

// 跳过第0楼（开局消息）
<% if (!isFloorZero) { %>

// 根据大域加载地图
<% if (currentDomain.includes('中央神州')) { %>
<%- await getwi('地图_中央神州') %>
<% } else if (currentDomain.includes('东荒妖域')) { %>
<%- await getwi('地图_东荒妖域') %>
<% } %>

// 根据场景加载具体地点
<% if (currentArea.includes('万剑山脉') || currentScene.includes('剑宗')) { %>
<%- await getwi('剑宗') %>
<% } %>

// 根据事件加载指南
<% if (currentEvent === '炼丹' || messageText.includes('炼丹')) { %>
<%- await getwi('动态事件_炼丹指南') %>
<% } %>

// 根据在场角色加载人设（别名映射）
<%
if (typeof detectedCharacters === 'undefined') {
  const aliasMap = { '冬雪': '殷冬雪', '疏影': '卫疏影' /* ... */ };
  var detectedCharacters = new Set();
  if (presentCharacters && typeof presentCharacters === 'object') {
    for (const name of Object.keys(presentCharacters)) {
      detectedCharacters.add(aliasMap[name] || name);
    }
  }
  for (const alias of Object.keys(aliasMap)) {
    if (messageText.includes(alias)) detectedCharacters.add(aliasMap[alias]);
  }
  detectedCharacters = Array.from(detectedCharacters);
}
%>
<% for (const charName of detectedCharacters) { %>
<%- await getwi(charName.trim()) %>
<% } %>

<% } %>

配置：蓝灯顺序100，不勾防递归
要点：
1. 必须@@preprocessing开头
2. 用getvar读MVU变量，用getChatMessages读用户消息文本
3. 用.includes()做模糊匹配
4. 角色别名用Map映射到标准名
5. 加载的条目可以是禁用或绿灯



## EJS知识库

- uid: 550161
- displayIndex: 29
- order: 30
- position: 0

EJS提示词模板知识库（SillyTavern + ST-Prompt-Template扩展）

运行环境：世界书条目、预设提示词、角色卡定义、消息中均可执行EJS代码。
核心用途：根据变量值动态控制哪些提示词发送给AI，实现多阶段人设、条件分支、状态栏渲染等。

═══════════════════════════════════════
一、标签语法
═══════════════════════════════════════

<%_ 代码 _%>    执行代码，不输出，自动去空白（推荐）
<%= 表达式 %>    输出值（HTML转义）
<%- 表达式 %>    输出值（原样，不转义）
<%# 注释 %>      注释，不执行

标签外的文本是普通提示词，会直接发送给AI。

═══════════════════════════════════════
二、条件控制（if/else）
═══════════════════════════════════════

<%_ if (getvar('stat_data.角色.好感度') < 30) { _%>
好感度低时AI看到的提示词
<%_ } else if (getvar('stat_data.角色.好感度') < 60) { _%>
中等好感度提示词
<%_ } else { _%>
高好感度提示词
<%_ } _%>

文本相等用 ===：
<%_ if (getvar('stat_data.天气') === '晴天') { _%>

多条件用 && 和 ||：
<%_ if (getvar('stat_data.好感度') > 50 && getvar('stat_data.信任') > 30) { _%>

═══════════════════════════════════════
三、变量读写
═══════════════════════════════════════

【读取变量】
getvar('路径')                              → 值
getvar('路径', { defaults: 0 })             → 不存在时返回0
getvar('stat_data.角色.好感度')             → MVU变量（stat_data前缀必写）
getvar('stat_data.角色.好感度') !== undefined → 判断是否存在

【设置变量】
setvar('key', value, { scope: 'local' })     → 写入聊天变量
setvar('key', value, { scope: 'message' })   → 写入消息变量（默认）
setvar('key', value, { flags: 'nx' })        → 仅不存在时写入
setvar('key', value, 'global')               → scope快捷写法
setvar('key', value, 'nx')                   → flags快捷写法

【增减变量】
incvar('好感度', 5, { scope: 'local', min: 0, max: 100 })  → +5，限制范围
decvar('金币', 100, { scope: 'local', min: 0 })             → -100，不低于0

【删除/插入】
delvar('key')                    → 删除变量
delvar('key', '属性名')          → 删除对象属性
insvar('数组', '新元素')         → 追加到数组末尾

【作用域】
global   全局变量，持久化，跨角色跨对话共享
local    聊天变量，持久化，当前聊天记录
message  消息变量，持久化，绑定到具体消息楼层（默认）
cache    临时变量，不持久化（默认读取源）
initial  初始变量，只读

优先级（高→低）：消息变量(最新→最旧) → 聊天变量 → 全局变量
合并后的变量在 variables 对象中可直接访问。

═══════════════════════════════════════
四、输出与世界书条目加载
═══════════════════════════════════════

【print输出】
<%_
if (getvar('stat_data.天气') === '晴天') {
  print('【阳光明媚，适合出门】');
}
_%>

【getwi加载其他条目】必须加await
<%_
if (getvar('stat_data.好感度') < 30) {
  print(await getwi('角色_阶段01'));
} else {
  print(await getwi('角色_阶段02'));
}
_%>

等价写法：<%- await getwi('条目名') %>

getwi参数：
await getwi('条目名')                → 自动推断世界书
await getwi('世界书名', '条目名')     → 指定世界书
await getwi('条目名', { key: value }) → 传递数据

【activewi激活条目】让酒馆原生处理（遵循绿灯/向量化等）
await activewi('条目名')         → 普通激活
await activewi('条目名', true)   → 强制激活
※ 必须在 [GENERATE:BEFORE] 或 @@generate_before 条目中使用

【填入变量值】
<%= getvar('stat_data.好感度') %>
<%= YAML.stringify(getvar('stat_data'), { blockQuote: 'literal' }) %>
<%= JSON.stringify(getvar('stat_data')) %>

═══════════════════════════════════════
五、装饰器（条目内容开头，每行一个，不能有空行）
═══════════════════════════════════════

@@activate              视为蓝灯永久激活
@@dont_activate         完全禁止激活
@@generate_before       注入到提示词开头
@@generate_after        注入到提示词末尾
@@render_before         渲染到消息开头（不发给AI）
@@render_after          渲染到消息末尾（不发给AI）
@@preprocessing         在世界书处理前执行（用于动态激活绿灯）
@@initial_variables     将内容视为初始变量
@@private               自动包裹作用域，避免变量重复声明
@@if 条件               条件为false时排除此条目
@@iframe                创建iframe包裹，避免样式污染
@@iframe 标题文字       自动折叠的iframe

@@if 示例：
@@if variables.好感度 >= 90
好感度很高时才发送的内容

═══════════════════════════════════════
六、内容注入（条目标题/备忘前缀）
═══════════════════════════════════════

[GENERATE:BEFORE]     提示词开头（仅蓝灯）
[GENERATE:AFTER]      提示词末尾（蓝灯和绿灯）
[RENDER:BEFORE]       消息开头渲染（不发给AI）
[RENDER:AFTER]        消息末尾渲染（不发给AI）
[InitialVariables]    初始变量（标准JSON）

═══════════════════════════════════════
七、@INJECT注入（条目必须设为禁用）
═══════════════════════════════════════

以独立 {role, content} 消息插入Prompt（比世界书合并更精确）。

@INJECT pos=1,role=system              绝对位置
@INJECT pos=-1,role=user               最后位置
@INJECT target=user,index=1,at=before,role=system    目标消息前
@INJECT target=assistant,index=-1,at=after,role=user  最后助手消息后
@INJECT regex=你好,at=before,role=system              正则匹配

═══════════════════════════════════════
八、injectPrompt（依赖倒置注入）
═══════════════════════════════════════

世界书中定义：
<% injectPrompt("CoT", `思考步骤内容`) %>

预设中使用：
<%- getPromptsInjected("CoT") %>

用途：世界书定义提示词片段，在预设指定位置精确注入。

═══════════════════════════════════════
九、多阶段人设系统
═══════════════════════════════════════

结构：
  控制器条目（蓝灯永久激活）→ 读变量 → getwi加载对应阶段条目
  阶段条目（禁用）→ 被控制器按需加载

控制器写法：
<%_
if (typeof goodwill === 'undefined') var goodwill = getvar('stat_data.好感度', { defaults: 0 });
_%>
<%_ if (goodwill < 30) { _%>
<%- await getwi('角色_阶段01') %>
<%_ } else if (goodwill < 60) { _%>
<%- await getwi('角色_阶段02') %>
<%_ } else { _%>
<%- await getwi('角色_阶段03') %>
<%_ } _%>

条目配置：
  控制器   → 蓝灯永久激活，顺序100
  阶段条目 → 禁用，顺序98~800

防重复声明（多条目共享变量名时必用）：
if (typeof value === 'undefined') var value = getvar('路径', { defaults: 0 });

或使用 @@private 装饰器自动包裹作用域。

═══════════════════════════════════════
十、聊天消息操作
═══════════════════════════════════════

getChatMessage(idx)                  → 指定楼层消息内容
getChatMessages(count)               → 最后N条消息
getChatMessages(start, end)          → 范围内消息
matchChatMessages(['关键词'])         → 最后2楼是否包含关键词
matchChatMessages(['关键词'], { start: -4 })  → 扩大扫描范围
matchChatMessages([/正则/s])         → 正则匹配

═══════════════════════════════════════
十一、正则激活
═══════════════════════════════════════

activateRegex(/<think>[\s\S]*?<\/think>/gi, "");   → 隐藏思维链
activateRegex(/pattern/gi, '替换', { message: true, html: true });  → 楼层HTML替换

═══════════════════════════════════════
十二、常用内置常量
═══════════════════════════════════════

variables         合并后的所有变量对象
_                 Lodash库
$                 jQuery库
toastr            通知库（toastr.info/success/warning/error）
userName          用户名
charName          角色名
lastMessageId     最后消息ID
lastUserMessage   最后用户消息内容
lastCharMessage   最后角色消息内容
generateType      生成类型：normal/continue/regenerate/swipe
runType           当前阶段：generate/preparation/render

仅渲染时（runType='render'）：
message_id        消息楼层号
is_last           是否最后一条
is_user           是否用户消息
is_system         是否系统消息

═══════════════════════════════════════
十三、调试方法
═══════════════════════════════════════

提示词查看器：输入框左下角魔棒 → 提示词查看器（查看实际发送内容）
弹窗：alert('消息')
通知：toastr.info('消息')
控制台：console.log('消息')（F12 → Console）
断点：<%_ debugger; _%>（F12打开后暂停执行）

═══════════════════════════════════════
十四、易错点
═══════════════════════════════════════

1. getwi必须加await：
   ✅ <%- await getwi('条目名') %>
   ❌ <%- getwi('条目名') %>

2. MVU变量路径必须带stat_data前缀：
   ✅ getvar('stat_data.角色.好感度')
   ❌ getvar('角色.好感度')

3. 不需要[0]索引：
   ✅ getvar('stat_data.角色.好感度')
   ❌ getvar('stat_data.角色.好感度[0]')

4. 多条目共享变量名用typeof防重复声明：
   ✅ if (typeof v === 'undefined') var v = getvar('路径');
   ❌ const v = getvar('路径');  // 第二个条目会报错

5. activewi必须在[GENERATE:BEFORE]或@@generate_before中使用

6. @INJECT条目必须设为禁用状态

7. 装饰器之间不能有空行

8. define函数内必须用this访问getvar/setvar等：
   ✅ define('fn', function() { return this.getvar('key'); })
   ❌ define('fn', () => getvar('key'))

9. @@preprocessing不能和@@generate_before/@@generate_after同时使用

10. setvar后立即读取需要 { noCache: true }

═══════════════════════════════════════
十五、@@iframe状态栏示例
═══════════════════════════════════════

@@render_after
@@iframe
@@if !is_user && !is_system
<html>
<head></head>
<body>
<div>
好感度：<%- variables.stat_data.角色.好感度 %>
</div>
</body>
</html>

折叠版：
@@render_after
@@iframe 状态栏（点击展开）
@@if !is_user && !is_system
<html>...内容...</html>

═══════════════════════════════════════
十六、@@preprocessing动态激活示例
═══════════════════════════════════════

@@preprocessing
<%_ if (getvar('stat_data.天气') === '晴天') { _%>
晴天关键词
<%_ } _%>

条目内容处理后变为"晴天关键词"，激活以此为绿灯关键词的其他条目。
要求：SillyTavern 1.13.4+

═══════════════════════════════════════
十七、完整函数速查
═══════════════════════════════════════

变量：getvar setvar incvar decvar delvar insvar define patchVariables
世界书：await getwi  await activewi  await getEnabledWorldInfoEntries
角色/预设：await getchar  await getpreset  await getqr  await getCharData
消息：getChatMessage  getChatMessages  matchChatMessages
输出：print  injectPrompt  getPromptsInjected  hasPromptsInjected
正则：activateRegex
工具：parseJSON  jsonPatch  await evalTemplate  await execute



## MVU_ZOD指南

- uid: 211694
- displayIndex: 30
- order: 31
- position: 0

MVU ZOD 变量框架工作流

系统组成：
- 变量结构脚本（Zod Schema，角色脚本）→ 定义类型和约束
- [initvar]初始变量（世界书条目，禁用）→ YAML初始值
- 变量列表（世界书条目）→ 让AI看到当前值
- [mvu_update]变量更新规则（世界书条目）→ 告诉AI何时更新
- [mvu_update]变量输出格式（世界书条目）→ 告诉AI用JSON Patch输出
- 酒馆正则 → 隐藏<UpdateVariable>块
- 脚本/界面（可选）→ 后台控制/显示变量

一、变量结构脚本

z和_已全局可用，不要import。放在角色脚本中。

import { registerMvuSchema } from 'https://testingcf.jsdelivr.net/gh/StageDog/tavern_resource/dist/util/mvu_zod.js';
export const Schema = z.object({
  角色: z.object({
    好感度: z.coerce.number().transform(v => _.clamp(v, 0, 100)),
    物品栏: z.record(z.string().describe('物品名'), z.object({
      描述: z.string(),
      数量: z.coerce.number().prefault(1),
    })).transform(data => _.pickBy(data, ({数量}) => 数量 > 0)),
  }),
});
$(() => { registerMvuSchema(Schema); });

Zod 4规则：
- z.coerce.number() 优于 z.number()
- z.prefault 优于 z.default
- z.transform做约束（clamp而非min/max）
- 对象优于数组（z.record优于z.array）
- 不用z.strict/z.passthrough（不存在）
- transform只接受一个参数(value)=>...
- 保持幂等：Schema.parse(Schema.parse(x)) === Schema.parse(x)

二、初始变量

条目名：[initvar]变量初始化勿开，禁用状态
YAML格式，与Schema对应：
角色:
  好感度: 35
  物品栏:
    创可贴:
      描述: 卡通创可贴
      数量: 1

不同开局方案：
- 全量：开局消息中<UpdateVariable><initvar>完整YAML</initvar></UpdateVariable>
- 增量：<UpdateVariable><JSONPatch>[{"op":"replace","path":"/角色/好感度","value":50}]</JSONPatch></UpdateVariable>

三、变量列表

条目名：变量列表（不加[mvu_update]），D0/D1，顺序200
固定内容：
---
<status_current_variable>
{{format_message_variable::stat_data}}
</status_current_variable>

四、变量更新规则

条目名：[mvu_update]变量更新规则，D0，顺序200
---
变量更新规则:
  角色:
    好感度:
      type: number
      range: 0~100
      check:
        - 根据角色反应调整±(3~6)
    物品栏:
      type: |-
        { [物品名: string]: { 描述: string; 数量?: number } }
      check:
        - 获取/消耗物品时更新

编写技巧：自明变量省略规则，同类变量合并，_开头只读变量不写

五、变量输出格式

条目名：[mvu_update]变量输出格式，D0(Gemini)/D4(Claude)，顺序200
固定内容（英文或中文版均可）：
---
变量输出格式:
  rule:
    - you must output the update analysis and the actual update commands at once in the end of the next reply
    - the update commands works like **JSON Patch (RFC 6902)**, supports: replace/delta/insert/remove/move
    - don't update fields starting with `_`
  format: |-
    <UpdateVariable>
    <Analysis>$(IN ENGLISH, no more than 80 words)
    - ${calculate time passed}
    - ${decide dramatic updates allowed: yes/no}
    - ${analyze every variable based on check}
    </Analysis>
    <JSONPatch>
    [
      { "op": "replace", "path": "${/path}", "value": "${new}" },
      { "op": "delta", "path": "${/path}", "value": "${delta}" },
      { "op": "insert", "path": "${/path/new_key}", "value": "${new}" },
      { "op": "remove", "path": "${/path}" },
      ...
    ]
    </JSONPatch>
    </UpdateVariable>

JSON Patch路径：用/分隔，不需要stat_data前缀

六、正则配置

导入三个正则（美化/折叠/仅提示版）：
- [不发送]去除变量更新：仅格式提示词，替换<UpdateVariable>为空
- [美化/折叠]变量更新中：仅格式显示，美化显示
- [美化/折叠]完整变量更新：仅格式显示

七、脚本控制变量

前置：await waitGlobalInitialized('Mvu');

获取变量：
const vars = Mvu.getMvuData({type:'message', message_id:-1});
const stat = _.get(vars, 'stat_data');

写回变量：
await Mvu.replaceMvuData(vars, {type:'message', message_id:id});

监听更新命令解析：
eventOn(Mvu.events.COMMAND_PARSED, commands => {
  commands.forEach(cmd => { cmd.args[0] = cmd.args[0].replaceAll('-',''); });
});

监听更新结束：
eventOn(Mvu.events.VARIABLE_UPDATE_ENDED, (new_vars, old_vars) => {
  // 限制变动幅度
  const old = _.get(old_vars, 'stat_data.好感度');
  _.update(new_vars, 'stat_data.好感度', v => _.clamp(v, old-3, old+3));
});

解析AI生成结果中的命令：
const data = await Mvu.parseMessage(message, old_data);
await Mvu.replaceMvuData(data, {type:'message', message_id:id});

八、界面显示

MVU自动附加<StatusPlaceHolderImpl/>，配合正则：
- [不发送]界面占位符：仅格式提示词，替换为空
- [界面]状态栏：仅格式显示，替换为界面代码

纯文本示例：
💖 好感度: {{format_message_variable::stat_data.角色.好感度}}

前端界面须在init中：
await waitGlobalInitialized('Mvu');
populateCharacterData();
eventOn(Mvu.events.VARIABLE_UPDATE_ENDED, () => populateCharacterData());

九、特殊前缀

无前缀：AI可见可更新
_前缀：AI可见不可更新（只读）
$前缀：AI不可见，脚本/提示词可更新

十、EJS读取 vs AI更新路径

EJS/状态栏：stat_data.角色.好感度
AI JSON Patch：/角色/好感度（无stat_data）


