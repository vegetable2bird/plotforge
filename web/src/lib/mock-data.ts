import type {
  AiGenerationRecord,
  AiSuggestion,
  Chapter,
  ChapterContent,
  Character,
  ConflictRecord,
  Faction,
  LoreEntry,
  NavItem,
  PlotBranch,
  RelationEdge,
  RelationNode,
  Scene,
  Snapshot,
  WorkSummary,
} from "@/lib/types";

export const navItems: NavItem[] = [
  { key: "dashboard", label: "作品总览", description: "总控台与创作节奏" },
  { key: "characters", label: "角色档案", description: "角色设定与小传" },
  { key: "relations", label: "人物关系", description: "章节化关系演进" },
  { key: "chapters", label: "章节创作", description: "正文与 AI 分支" },
  { key: "scenes", label: "场景沙盘", description: "空间调度与位置" },
  { key: "lore", label: "世界观库", description: "设定词条与冲突" },
  { key: "factions", label: "势力体系", description: "格局变化与事件" },
  { key: "snapshots", label: "快照中心", description: "版本回溯与导出" },
];

export const works: WorkSummary[] = [
  {
    id: "work-1",
    title: "天穹烬海录",
    genre: "东方幻想",
    stage: "连载中",
    summary: "围绕坠海天城、旧王朝遗脉与修行禁术展开的群像史诗。",
    theme: "obsidian",
    chapterCount: 128,
    characterCount: 47,
    loreCount: 216,
    factionCount: 12,
    updatedAt: "2 分钟前",
  },
  {
    id: "work-2",
    title: "玻璃月蚀",
    genre: "都市悬疑",
    stage: "大纲期",
    summary: "一座被舆论与记忆操控的城市里，众人都在寻找被删掉的真相。",
    theme: "ember",
    chapterCount: 23,
    characterCount: 19,
    loreCount: 58,
    factionCount: 4,
    updatedAt: "昨天",
  },
];

export const featuredCharacters: Character[] = [
  {
    id: "char-1",
    workId: "work-1",
    name: "裴照夜",
    role: "主角",
    appearance: "乌发冷眸，左耳悬银羽坠，常着深海纹黑氅。",
    personality: "克制、敏感、极强自省能力，擅长在沉默中观察局势。",
    backstory: "幼年流落海祠，成年后被卷入王朝遗脉与禁术复苏的漩涡。",
    habits: ["夜半抄录旧籍", "焦虑时以指节敲桌", "不喝热茶"],
    catchphrase: "先别急着信命。",
    weakness: "面对旧日亲缘真相时容易短暂失控。",
    mission: "找回母亲失踪的真相，并阻止天穹坠落。",
    taboo: "无法容忍无辜者被当作祭品。",
    arc: "从被命运追赶的幸存者成长为主动改写规则的人。",
    biography: "裴照夜是旧海祠里长大的异类少年，天生能听见潮声里残留的亡者回响。",
    avatar: "裴",
    tags: ["宿命", "禁术", "成长型主角"],
  },
  {
    id: "char-2",
    workId: "work-1",
    name: "闻灯",
    role: "女主",
    appearance: "肤白如瓷，墨金异瞳，常披半透明羽纱。",
    personality: "理性外冷，内里极度护短，判断果决。",
    backstory: "出身被流放的司天一脉，背负改写星图的禁忌天赋。",
    habits: ["记录梦境", "说谎时会停顿半拍"],
    catchphrase: "规则若错，就该被重写。",
    weakness: "过度理性，容易低估情感代价。",
    mission: "重建真正的天穹秩序。",
    taboo: "绝不让天命替人做决定。",
    arc: "从只信规则的执行者成长为能为众生担责的制定者。",
    biography: "闻灯曾在流放群岛抄写星历，她比任何人都更清楚这个世界的法则正在崩裂。",
    avatar: "闻",
    tags: ["冷感女主", "规则改写", "高智"],
  },
  {
    id: "char-3",
    workId: "work-1",
    name: "白砚侯",
    role: "反派",
    appearance: "面容温雅，常佩白玉骨扇，袖口绣有暗羽纹。",
    personality: "温文尔雅却心机深沉，擅长借他人之手达成目的。",
    backstory: "旧王朝遗臣之后，以辅佐为名暗中布局复辟。",
    habits: ["拂袖掩笑", "说话前必轻叩骨扇三下"],
    catchphrase: "棋局才刚摆好。",
    weakness: "对旧主遗愿的执念，易被情感牵制。",
    mission: "在灰烬中重建旧秩序。",
    taboo: "不容许有人践踏旧日王朝的尊严。",
    arc: "从忠诚的棋手走向极端，最终被自己布下的局反噬。",
    biography: "白砚侯表面温润如玉，背地里却是将无数棋子推向深渊的执棋者。",
    avatar: "白",
    tags: ["反派", "谋局", "旧朝遗脉"],
  },
];

export const chapters: Chapter[] = [
  {
    id: "chapter-88",
    workId: "work-1",
    title: "第 88 章 海城夜雨",
    orderIndex: 88,
    status: "polish",
    hook: "裴照夜在旧王仓库里发现与母亲名字有关的封漆名单。",
    contentPreview: "夜雨把海城的灯光拉成细长的金线，仓库深处却像一只沉默的兽。",
    branchCount: 3,
    updatedAt: "5 分钟前",
  },
  {
    id: "chapter-89",
    workId: "work-1",
    title: "第 89 章 灰塔开门",
    orderIndex: 89,
    status: "draft",
    hook: "闻灯要在众目睽睽下开启灰塔，但代价远超预估。",
    contentPreview: "塔门上的铜纹像活了一样，从她的指尖一圈圈亮起。",
    branchCount: 5,
    updatedAt: "刚刚",
  },
];

export const plotBranches: PlotBranch[] = [
  {
    id: "branch-1",
    chapterId: "chapter-89",
    title: "分支 A: 灰塔提前暴走",
    summary: "强化危机，把势力冲突与旧案真相提前撞在同一幕。",
    tension: "high",
    aiGenerated: true,
  },
  {
    id: "branch-2",
    chapterId: "chapter-89",
    title: "分支 B: 闻灯主动自曝身份",
    summary: "牺牲角色安全感，换取情感与阵营重排。",
    tension: "high",
    aiGenerated: true,
  },
  {
    id: "branch-3",
    chapterId: "chapter-89",
    title: "分支 C: 假开门诱敌",
    summary: "保留灰塔谜底，把焦点转向裴照夜的即兴布局。",
    tension: "medium",
    aiGenerated: false,
  },
];

export const chapterContents: Record<string, ChapterContent[]> = {
  "chapter-89": [
    {
      id: "content-89-1",
      title: "塔门铜纹",
      content:
        "塔门上的铜纹像活了一样，从她的指尖一圈圈亮起。闻灯站在灰塔最外层的风廊上，听见身后司天卫整齐划一的脚步声。\n\n「退后三步。」她低声说。\n\n没有人动。\n\n铜纹已经爬到她的手肘，像是从皮肤下渗出来的光。她知道自己没有太多时间——灰塔的封印正在松动，旧王朝留在塔底的禁术刻痕已经苏醒。",
    },
    {
      id: "content-89-2",
      title: "对峙前夜",
      content: "裴照夜比她预想的更早出现。\n\n他站在风廊尽头，深海纹黑氅被高空的风掀起一角。两人隔着整条回廊对望，谁都没有先开口。\n\n「你不该来。」闻灯终于说。\n\n「你也不该开门。」他答。",
    },
  ],
};

export const aiSuggestions: AiSuggestion[] = [
  {
    id: "ai-sug-1",
    chapterId: "chapter-89",
    type: "continuation",
    label: "灰塔内部视角",
    content:
      "切换至塔内视角，描写禁术刻痕的激活过程。铜纹从塔基向塔尖蔓延，每一层封印都在发出低沉的共鸣。可以在这里插入一段关于旧王朝封缄仪式的回忆闪回。",
    tension: "high",
  },
  {
    id: "ai-sug-2",
    chapterId: "chapter-89",
    type: "conflict",
    label: "司天卫内部意见分歧",
    content:
      "在闻灯开门的过程中，司天卫内部出现分歧：一部分人认为应该保护闻灯完成仪式，另一部分人则认为灰塔开启过于危险。这个冲突可以为后续势力站队埋下伏笔。",
    tension: "medium",
  },
  {
    id: "ai-sug-3",
    chapterId: "chapter-89",
    type: "rewrite",
    label: "闻灯情感线改写",
    content:
      "当前版本中闻灯显得过于冷静。建议在她触摸铜纹的瞬间插入一段关于司天府流放的童年记忆，让她的情绪有一个短暂的失控瞬间，随后恢复理性。这样能增强角色立体感。",
    tension: "low",
  },
];

export const relationNodes: RelationNode[] = [
  { id: "char-1", characterId: "char-1", label: "裴照夜", avatar: "裴", x: 120, y: 180 },
  { id: "char-2", characterId: "char-2", label: "闻灯", avatar: "闻", x: 420, y: 120 },
  { id: "char-3", characterId: "char-3", label: "白砚侯", avatar: "白", x: 680, y: 240 },
];

export const relationEdges: RelationEdge[] = [
  {
    id: "edge-1-2",
    source: "char-1",
    target: "char-2",
    relationType: "共谋",
    intimacyLevel: 4,
    conflictLevel: 3,
    note: "因灰塔开启方案出现分歧，关系从隐性盟友转为高压共谋。",
  },
  {
    id: "edge-1-3",
    source: "char-1",
    target: "char-3",
    relationType: "利用",
    intimacyLevel: 1,
    conflictLevel: 5,
    note: "白砚侯试图利用裴照夜的禁术能力，双方互不信任。",
  },
  {
    id: "edge-2-3",
    source: "char-2",
    target: "char-3",
    relationType: "敌对",
    intimacyLevel: 1,
    conflictLevel: 5,
    note: "司天府与白砚侯旧朝遗脉存在根本对立。",
  },
];

export const scenes: Scene[] = [
  {
    id: "scene-1",
    workId: "work-1",
    name: "旧海祠后殿",
    environment: "潮湿、低照度、祭纹残缺，墙面遍布海盐剥落痕迹。",
    weather: "暴雨",
    timeSetting: "子夜",
    dangerZones: ["祭井", "塌陷回廊"],
    residents: ["裴照夜", "闻灯"],
  },
  {
    id: "scene-2",
    workId: "work-1",
    name: "灰塔外环",
    environment: "高空风廊、机械星盘、军阵封锁。",
    weather: "阴云压城",
    timeSetting: "黎明前",
    dangerZones: ["观测台边缘", "禁术刻痕区"],
    residents: ["司天卫", "白砚侯"],
  },
];

export const loreEntries: LoreEntry[] = [
  {
    id: "lore-1",
    workId: "work-1",
    category: "世界法则",
    title: "潮汐回响",
    summary: "亡者记忆会在特定潮位短暂映照于海风与铜器共振中。",
    linkedTitles: ["海祠祭法", "亡潮季"],
    riskLevel: "stable",
  },
  {
    id: "lore-2",
    workId: "work-1",
    category: "历史事件",
    title: "第三次天穹坠裂",
    summary: "导致旧王朝彻底失去制空权，并封禁灰塔核心。",
    linkedTitles: ["灰塔封缄令", "司天一脉流放"],
    riskLevel: "warning",
  },
];

export const factions: Faction[] = [
  {
    id: "faction-1",
    workId: "work-1",
    name: "司天府",
    stance: "秩序中立",
    doctrine: "凡星图可测之事，皆须纳入控制。",
    leader: "闻灯",
    influence: 84,
  },
  {
    id: "faction-2",
    workId: "work-1",
    name: "沉羽会",
    stance: "隐秘对抗",
    doctrine: "在旧秩序彻底坍塌前，把秘密留给活人。",
    leader: "裴照夜",
    influence: 61,
  },
];

export const snapshots: Snapshot[] = [
  {
    id: "snapshot-1",
    workId: "work-1",
    scopeType: "章节",
    title: "第 89 章定点续写前",
    summary: "保留灰塔开门前的正文、关系与场景状态。",
    createdAt: "10:24",
  },
  {
    id: "snapshot-2",
    workId: "work-1",
    scopeType: "人物关系",
    title: "雨夜仓库冲突版",
    summary: "裴照夜与闻灯信任度下降 12%，白砚侯敌意上升。",
    createdAt: "昨天 22:16",
  },
];

export const aiRecords: AiGenerationRecord[] = [
  {
    id: "ai-1",
    workId: "work-1",
    moduleType: "剧情分支",
    model: "gateway/story-planner-v1",
    promptDigest: "第 89 章灰塔开启前分支预测",
    status: "ready",
    createdAt: "刚刚",
  },
  {
    id: "ai-2",
    workId: "work-1",
    moduleType: "角色小传",
    model: "gateway/biography-v1",
    promptDigest: "闻灯人物小传二次改写",
    status: "blocked",
    createdAt: "12 分钟前",
  },
];

export const conflictRecords: ConflictRecord[] = [
  {
    id: "conflict-1",
    workId: "work-1",
    sourceType: "世界观",
    title: "灰塔封缄时间冲突",
    message: "第 34 章设定为三十年前封缄，但历史词条记录为二十八年前。",
    severity: "high",
  },
  {
    id: "conflict-2",
    workId: "work-1",
    sourceType: "剧情辅助",
    title: "角色动机偏移提醒",
    message: "分支 B 中闻灯主动示弱与既有人设冷静压抑设定不一致。",
    severity: "medium",
  },
];
