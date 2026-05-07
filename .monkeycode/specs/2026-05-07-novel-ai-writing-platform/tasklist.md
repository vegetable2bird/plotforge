# 需求实施计划

- [x] 1. 初始化 Next.js 全栈项目基础骨架
  - 创建 `app`、`components`、`lib`、`domains`、`styles`、`prisma` 等目录，落实设计文档中的 `app/domain/infra/ui` 分层。
  - 配置基础工程能力，包括 TypeScript、Lint、路径别名、环境变量模板与护眼主题入口。
  - 配置开发服务器 `allowedHosts` 以满足预览环境要求，关联 Requirement 11 与设计文档 Architecture。

- [ ] 2. 实现核心领域类型与种子数据模型
  - [x] 2.1 定义作品、角色、章节、剧情分支、场景、世界观、势力、快照、AI 记录与冲突记录的 TypeScript 类型
    - 覆盖 Requirement 1 至 Requirement 12 对应的核心实体。
    - 对齐设计文档 Data Models 与 Correctness Properties 1。
  - [x] 2.2 建立首版内存数据源与示例数据装配器
    - 先以本地假数据支撑 UI 开发，后续再切换数据库实现。
    - 覆盖 Requirement 1、2、4、5、6、7、8、9。
  - [ ]* 2.3 为核心类型校验与数据装配编写单元测试
    - 覆盖设计文档 Correctness Properties 1 与 5。

- [ ] 3. 实现作品工作台与全局信息架构
  - [x] 3.1 创建首页与作品总览工作台
    - 展示作品列表、作品摘要、最近章节、设定统计与快捷入口。
    - 覆盖 Requirement 1、11。
  - [x] 3.2 创建全局侧边导航与模块路由骨架
    - 包含角色、人物关系、章节创作、场景沙盘、世界观、势力、快照中心等模块入口。
    - 覆盖 Requirement 1、11。
  - [ ]* 3.3 为工作台数据映射与导航状态编写单元测试
    - 覆盖 Requirement 1 的作品隔离展示语义。

- [x] 4. 实现角色模块首版
  - [x] 4.1 创建角色列表页与角色档案详情页
    - 支持展示外貌、性格、背景、习惯、口头禅、弱点、使命、禁忌、成长弧光与头像。
    - 覆盖 Requirement 2、3。
  - [x] 4.2 创建角色档案编辑表单与小传展示区
    - 支持草稿保存态与 AI 小传区域占位。
    - 覆盖 Requirement 2.1-2.4、Requirement 3.2-3.5。
  - [ ]* 4.3 为角色档案表单与字段映射编写单元测试
    - 覆盖 Requirement 2 与 Requirement 3。

- [x] 5. 实现 2D 关系图与场景沙盘首版
  - [x] 5.1 集成 2D 图谱基础组件并实现人物关系图页面
    - 使用 `React Flow` 搭建人物关系节点、关系边与布局状态展示。
    - 覆盖 Requirement 4 与设计文档 Correctness Properties 2、5。

- [x] 6. 实现章节创作与 AI 辅助首版界面
  - [x] 6.1 创建章节列表与章节编辑器页面
    - 实现正文编辑区、章节元信息区、剧情分支侧栏与最近快照入口。
    - 覆盖 Requirement 5、9、11。
  - [x] 6.2 创建 AI 剧情辅助交互面板
    - 展示多分支建议卡片、定点续写入口与冲突提示占位。
    - 覆盖 Requirement 5、12。
  - [ ]* 6.3 为剧情分支保存语义编写单元测试
    - 覆盖设计文档 Correctness Properties 3。

- [ ] 7. 检查点 - 确保所有测试通过
  - 确保所有测试通过,如有疑问请询问用户

- [x] 8. 实现场景沙盘页面与势力关系图
  - [x] 8.1 实现场景沙盘页面与角色位置分布视图
    - 展示章节场景、角色位置和空间冲突提示占位。
    - 覆盖 Requirement 6。
  - [x] 8.2 实现势力关系图页面
    - 复用图谱能力展示势力节点、关系边和章节事件摘要。
    - 覆盖 Requirement 8。
  - [ ]* 8.3 为章节状态隔离与图谱布局序列化编写单元测试
    - 覆盖设计文档 Correctness Properties 2 与 5。

- [x] 9. 实现世界观知识库与快照中心首版
  - [x] 9.1 创建世界观词条列表、详情和关联面板
    - 支持分类展示、搜索入口、词条引用和冲突标签占位。
    - 覆盖 Requirement 7。
  - [x] 9.2 创建快照中心与版本历史页
    - 展示对象范围、版本摘要、恢复按钮和差异预览占位。
    - 覆盖 Requirement 9、10。
  - [ ]* 9.3 为快照展示映射与冲突标签规则编写单元测试
    - 覆盖设计文档 Correctness Properties 4。

- [ ] 10. 接入数据库与服务层基础设施
  - [ ] 10.1 配置 Prisma、数据库 schema 与基础仓储接口
    - 将核心实体映射到持久化层，为后续替换内存数据源做准备。
    - 覆盖 Requirement 1 至 Requirement 12 与设计文档 Data Models。
  - [ ] 10.2 创建服务层接口与服务器端数据读取入口
    - 对齐 `WorkService`、`CharacterService`、`ChapterService` 等接口。
    - 覆盖设计文档 Components and Interfaces。
  - [ ]* 10.3 为仓储层与服务层编写集成测试
    - 覆盖设计文档 Correctness Properties 1、2、4。

- [ ] 11. 实现 AI 网关、一致性校验与导出骨架
  - [ ] 11.1 创建 AI Gateway 抽象、PromptContextBuilder 与占位 Provider Adapter
    - 支持角色小传、剧情分支与定点续写三类请求对象。
    - 覆盖 Requirement 3、5、12。
  - [ ] 11.2 创建一致性校验与冲突记录服务骨架
    - 输出角色、世界观、关系与章节级冲突说明结构。
    - 覆盖 Requirement 5、7、12。
  - [ ] 11.3 创建导出服务骨架
    - 预留正文、设定、图谱图片导出接口。
    - 覆盖 Requirement 10。
  - [ ]* 11.4 为 AI 请求构造与冲突输出结构编写单元测试
    - 覆盖设计文档 Correctness Properties 3。

- [ ] 12. 检查点 - 确保所有测试通过
  - 确保所有测试通过,如有疑问请询问用户

- [x] 13. 全局动画丝滑优化
  - [x] 13.1 创建 `motion-config.ts` 全局动画预设库
    - 提供 `smoothEntrance`、`smoothEase`、`smoothQuick`、`fadeUp`、`fadeScale`、`expandHeight`、`growWidth`、`staggerDelay` 等预设。
    - 使用 spring 物理模型和 `cubic-bezier(0.34, 1.56, 0.64, 1)` 缓动曲线实现丝滑入场。
  - [x] 13.2 优化全局 CSS 过渡曲线与时间
    - `.glass` 过渡从 300ms 提升至 400ms，使用 `cubic-bezier(0.25, 0.1, 0.25, 1)`。
    - `.hover-lift` 使用 spring 曲线 `cubic-bezier(0.34, 1.56, 0.64, 1)`，增加轻微过冲效果。
    - `.btn-accent` 增强 hover 位移和缩放，active 态缩短至 150ms。
    - 渐变动画从 4s 延长至 6s 更自然。
- [x] 13.3 统一所有页面和组件的动画配置
  - 更新 Dashboard、Character 模块、Chapter 模块、Relations、Scenes、Factions、Lore、Snapshots、ThemeShell。
  - 所有入场动画使用 `fadeUp` + `staggerDelay` 实现级联效果。
  - 展开/折叠动画使用 `expandHeight` spring 预设。
  - 进度条动画使用 `growWidth` spring 预设。

- [ ] 14. 围绕小说写作流程重构 PlotForge 信息架构
  - [x] 14.1 输出写作流程驱动的需求与设计文档
    - 新增 `plotforge-writing-workflow-redesign` 规格，明确产品定位、工作流与导航分组。
  - [ ] 14.2 重构首页为创作工作台
    - 强化“继续写作”“当前风险”“推荐下一步”和“最近章节”结构。
  - [ ] 14.3 重构全局导航为写作路径分组
    - 将模块按“开始写作/准备设定/检查逻辑/版本管理”分组展示。
  - [ ] 14.4 引入新手引导与模块用途提示
    - 在首页和关键模块加入首访引导与任务导向说明。
