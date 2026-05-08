# 用户指令记忆

本文件记录了用户的指令、偏好和教导，用于在未来的交互中提供参考。

## 格式

### 用户指令条目
用户指令条目应遵循以下格式：

[用户指令摘要]
- Date: [YYYY-MM-DD]
- Context: [提及的场景或时间]
- Instructions:
  - [用户教导或指示的内容，逐行描述]

### 项目知识条目
Agent 在任务执行过程中发现的条目应遵循以下格式：

[项目知识摘要]
- Date: [YYYY-MM-DD]
- Context: Agent 在执行 [具体任务描述] 时发现
- Category: [代码结构|代码模式|代码生成|构建方法|测试方法|依赖关系|环境配置]
- Instructions:
  - [具体的知识点，逐行描述]

## 去重策略
- 添加新条目前，检查是否存在相似或相同的指令
- 若发现重复，跳过新条目或与已有条目合并
- 合并时，更新上下文或日期信息
- 这有助于避免冗余条目，保持记忆文件整洁

## 条目

[用户希望搭建小说 AI 创作平台]
- Date: 2026-05-07
- Context: 用户提出完整的平台建设需求
- Instructions:
  - 为小说创作者设计专业的 AI 辅助创作平台。
  - 平台需覆盖角色、人物关系、章节创作、AI 剧情辅助、场景沙盘、世界观知识库、势力体系及通用能力。
  - 图谱类能力优先使用 2D 可视化实现，不做 3D。
  - 界面需要兼顾护眼、美观、流畅与低代码可视化体验。

[用户强调界面质感与换肤能力]
- Date: 2026-05-07
- Context: 用户要求直接开始实现并补充前端体验要求
- Instructions:
  - 页面风格需要美观、高端、大气，不要做普通模板化界面。
  - 交互需要顺滑，并加入丝滑的动画效果。
  - 平台必须支持切换网页皮肤或主题。

[用户强调 PlotForge 必须围绕小说写作流程]
- Date: 2026-05-07
- Context: 用户要求重新梳理 PlotForge 的整体逻辑并优化全局产品体验
- Instructions:
  - PlotForge 的定位是帮助小说作者保持人设统一、梳理角色关系、解决卡文、管理世界观的专业创作工具。
  - 所有功能必须围绕小说写作流程设计，避免功能堆砌和界面混乱。
  - 界面需要清爽、层次清晰、操作丝滑，并加入新手引导。
  - 需要同时给出模块级设计方案，并把核心方案直接落实到界面和交互中。

[PlotForge 当前采用工作流分组导航与模块引导]
- Date: 2026-05-07
- Context: Agent 在执行 PlotForge 工作流化重构时发现
- Category: 代码模式
- Instructions:
  - 全局导航已按写作流程分组为开始写作、准备设定、检查逻辑、版本管理，而非平铺模块列表。
  - 主要模块页正在统一补充“模块怎么用”和“推荐顺序”引导区，以突出先做什么、什么时候进入该模块。
  - 首页工作台与模块说明文案应继续围绕“先设定、后写作、再校验、最后快照”的创作顺序保持一致。

[章节编辑页采用先目标后正文的创作路径]
- Date: 2026-05-07
- Context: Agent 在执行章节编辑区工作流重构时发现
- Category: 代码模式
- Instructions:
  - 章节编辑页需要先展示本章目标和写作步骤，再进入正文编辑区，避免用户一进来就陷入工具面板。
  - AI 面板文案应强调“卡住时再用”，把 AI 定位成补分支、续写和冲突提醒的辅助工具，而不是默认主流程。
  - 章节编辑区的视觉层级应以正文为中心，左右侧栏只承担导航和补充信息角色。

[章节数据当前使用浏览器本地存储持久化]
- Date: 2026-05-07
- Context: Agent 在执行章节编辑持久化与跨模块跳转时发现
- Category: 代码模式
- Instructions:
  - 章节列表与章节正文当前通过 localStorage 持久化，键名为 `plotforge-chapters` 和 `plotforge-chapter-contents`。
  - 章节编辑变更通过浏览器事件 `plotforge-chapter-storage-changed` 同步刷新页面状态，而不是依赖单一组件内存状态。
  - 若后续接入服务端存储，需要保留“正文为中心、AI 为辅助、关系与快照为后置校验”的交互顺序。

[快照与章节编辑已接入统一工作区存储]
- Date: 2026-05-07
- Context: Agent 在执行章节快照联动时发现
- Category: 代码模式
- Instructions:
  - 工作区存储已抽到 `src/lib/workspace-storage.ts`，统一管理章节、正文片段和快照的 localStorage 读写与订阅。
  - 快照列表使用 `plotforge-snapshots` 持久化，章节编辑页可直接创建"当前章节快照"并跳转到快照中心。
  - 从章节页跳转到快照页时，当前新建快照通过 sessionStorage 高亮选中，便于用户立即确认是否创建成功。

[PlotForge 数据层已接入 SQLite + Prisma，采用 Repository 模式]
- Date: 2026-05-08
- Context: Agent 在执行数据库接入和 CRUD 接口开发时发现
- Category: 代码结构
- Instructions:
  - 数据库使用 SQLite，通过 Prisma 7 + @prisma/adapter-better-sqlite3 适配器连接
  - 数据库文件位于 `prisma/dev.db`，迁移和 schema 在 `prisma/schema.prisma`
  - Repository 模式已实现在 `src/lib/repositories/`，每个实体有独立的 repository
  - 统一入口在 `src/lib/repositories/index.ts` 导出 `repositories` 对象
  - 前端 API 客户端在 `src/lib/api-client.ts`，封装了所有 CRUD 调用
  - API Routes 在 `src/app/api/` 下，使用 Next.js App Router
  - 数组字段（如 habits、tags、dangerZones）在数据库中存储为 JSON 字符串
  - Prisma 配置在 `prisma.config.ts`，使用 defineConfig 定义 datasource URL
  - 种子脚本 `prisma/seed.ts` 用于初始化示例数据，使用 `npx tsx prisma/seed.ts` 执行
