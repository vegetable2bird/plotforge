"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight, BookOpen, Compass, FileText, Sparkles, TriangleAlert, Users, ScrollText, Clock3, ShieldAlert } from "lucide-react";

import { smoothQuick, staggerDelay, smoothEase } from "@/lib/motion-config";
import { api } from "@/lib/api-client";
import type { Work, Chapter, Character, ConflictRecord, AiGenerationRecord } from "@/lib/types";

const workflowCards = [
  {
    title: "继续正文创作",
    desc: "回到正在推进的章节，把今天的写作节奏续上。",
    meta: "推荐起点",
    icon: FileText,
  },
  {
    title: "补强角色动机",
    desc: "先稳住角色弧光、口头禅和禁忌，再推进关键情节。",
    meta: "人设一致性",
    icon: Users,
  },
  {
    title: "梳理世界观引用",
    desc: "检查设定是否够用，避免写到中途才发现规则冲突。",
    meta: "设定准备",
    icon: ScrollText,
  },
  {
    title: "查看关系变化",
    desc: "核对当前章节的情感张力和阵营站位有没有写偏。",
    meta: "逻辑校验",
    icon: Compass,
  },
];

const beginnerSteps = [
  "先完善核心角色和世界观，再开始写第一章。",
  "每一章先写目标或钩子，再进入正文编辑器。",
  "卡文时再调用 AI 分支与定点续写，不要一开始就依赖生成。",
  "写完关键章节后，用人物关系和快照检查有没有写崩。",
];

interface DashboardProps {
  workId?: string;
}

export function Dashboard({ workId: propWorkId }: DashboardProps) {
  const router = useRouter();
  const params = useParams();
  const workId = propWorkId ?? (params?.id as string);

  // 数据状态
  const [work, setWork] = useState<Work | null>(null);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [characters, setCharacters] = useState<Character[]>([]);
  const [conflicts, setConflicts] = useState<ConflictRecord[]>([]);
  const [aiRecords, setAiRecords] = useState<AiGenerationRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!workId) return;

    async function loadData() {
      try {
        const [workData, chaptersData, charactersData, conflictsData, aiRecordsData] =
          await Promise.allSettled([
            api.works.get(workId),
            api.chapters.list(workId),
            api.characters.list(workId),
            api.conflicts.list(workId),
            api.aiRecords.list(workId),
          ]);

        if (workData.status === "fulfilled") setWork(workData.value);
        if (chaptersData.status === "fulfilled") setChapters(chaptersData.value);
        if (charactersData.status === "fulfilled") setCharacters(charactersData.value);
        if (conflictsData.status === "fulfilled") setConflicts(conflictsData.value);
        if (aiRecordsData.status === "fulfilled") setAiRecords(aiRecordsData.value);
      } catch (err) {
        console.error("加载 Dashboard 数据失败:", err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [workId]);

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!work) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-white/60">作品不存在</p>
      </div>
    );
  }

  // 取前 3 个角色作为"核心角色"
  const featuredCharacters = characters.slice(0, 3);

  const workspaceStats = [
    { label: "待继续章节", value: String(chapters.length), icon: BookOpen, bg: "bg-sky-100/60", color: "text-sky-600" },
    { label: "一致性风险", value: String(conflicts.length), icon: ShieldAlert, bg: "bg-rose-100/60", color: "text-rose-600" },
    { label: "核心角色", value: String(characters.length), icon: Users, bg: "bg-violet-100/60", color: "text-violet-600" },
    { label: "最近 AI 记录", value: String(aiRecords.length), icon: Sparkles, bg: "bg-amber-100/60", color: "text-amber-600" },
  ];

  const stageLabel = {
    planning: "构思中",
    drafting: "写作中",
    polishing: "润色中",
    completed: "已完成",
  }[work.stage] ?? work.stage;

  return (
    <div className="flex h-full flex-col overflow-y-auto">
      <div className="mx-auto w-full max-w-7xl space-y-6 p-4 sm:space-y-8 sm:p-6 lg:p-8">
        {/* 主卡片 */}
        <div className="grid gap-5 xl:grid-cols-[1.4fr_0.8fr]">
          <div className="glass rounded-3xl p-6 sm:p-7 lg:p-8">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
              <div className="max-w-3xl">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em]" style={{ background: "color-mix(in srgb, var(--accent-gradient) 14%, transparent)", color: "var(--text-secondary)" }}>
                    PlotForge 创作工作台
                  </span>
                  <span className="rounded-full bg-emerald-100/60 px-2.5 py-1 text-[10px] font-medium text-emerald-700">{stageLabel}</span>
                </div>
                <h1 className="mt-4 text-2xl font-semibold text-gradient sm:text-3xl lg:text-4xl">{work.title}</h1>
                <p className="mt-3 max-w-2xl text-sm leading-7 sm:text-[15px]" style={{ color: "var(--text-secondary)" }}>
                  PlotForge 现在优先帮助你完成三件事：稳住人设、推进正文、及时发现设定和关系冲突。
                  {chapters.length > 0 ? ` 当前共有 ${chapters.length} 章，${characters.length} 个角色。` : " 先创建你的第一个角色或章节吧！"}
                </p>
                <div className="mt-5 flex flex-wrap items-center gap-3">
                  <button type="button" onClick={() => router.push(`/work/${workId}/chapters`)} className="btn-accent flex items-center gap-2 rounded-2xl px-5 py-3 text-sm font-medium cursor-pointer">
                    继续写作
                    <ArrowRight size={15} />
                  </button>
                  <button type="button" onClick={() => router.push(`/work/${workId}/relations`)} className="glass hover-lift rounded-2xl px-4 py-3 text-sm font-medium cursor-pointer" style={{ color: "var(--text-secondary)" }}>
                    检查关系与冲突
                  </button>
                </div>
              </div>

              <div className="glass-soft min-w-[220px] rounded-2xl p-4 sm:p-5">
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em]" style={{ color: "var(--muted)" }}>当前写作状态</p>
                <div className="mt-3 space-y-3">
                  <div>
                    <p className="text-xs font-medium" style={{ color: "var(--text)" }}>总章节数</p>
                    <p className="mt-1 text-sm" style={{ color: "var(--text-secondary)" }}>{chapters.length} 章</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium" style={{ color: "var(--text)" }}>当前风险</p>
                    <p className="mt-1 text-sm leading-6" style={{ color: "var(--text-secondary)" }}>
                      {conflicts.length > 0
                        ? `发现 ${conflicts.length} 条潜在冲突`
                        : "暂未发现冲突"}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-xs" style={{ color: "var(--muted)" }}>
                    <Clock3 size={13} />
                    更新于 {new Date(work.updatedAt).toLocaleDateString("zh-CN")}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 新手引导（保持不变） */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={smoothEase}
            className="glass rounded-3xl p-5 sm:p-6"
          >
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold" style={{ color: "var(--text)" }}>新手引导</p>
                <p className="mt-1 text-xs leading-6" style={{ color: "var(--muted)" }}>PlotForge 推荐你按下面的顺序使用。</p>
              </div>
            </div>
            <div className="mt-4 space-y-3">
              {beginnerSteps.map((step, index) => (
                <div key={step} className="glass-soft rounded-2xl p-3.5">
                  <div className="flex items-start gap-3">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold text-white" style={{ background: "var(--accent-gradient)" }}>
                      {index + 1}
                    </div>
                    <p className="text-sm leading-6" style={{ color: "var(--text-secondary)" }}>{step}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* 统计卡片 */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4 lg:gap-5">
          {workspaceStats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...smoothQuick, delay: staggerDelay(i, 0.07) }}
              className="stat-card glass hover-lift rounded-2xl p-4 sm:p-5"
            >
              <div className="flex items-center gap-3">
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${stat.bg}`}>
                  <stat.icon size={18} className={stat.color} />
                </div>
                <div>
                  <p className="text-xl font-semibold" style={{ color: "var(--text)" }}>{stat.value}</p>
                  <p className="text-[11px] font-medium" style={{ color: "var(--muted)" }}>{stat.label}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* 推荐路径 + 最近章节 + 风险 + 角色 + AI 记录 */}
        <div className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-5">
            {/* 写作路径 */}
            <div>
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold" style={{ color: "var(--text)" }}>推荐写作路径</h2>
                  <p className="mt-1 text-sm" style={{ color: "var(--muted)" }}>按小说创作流程组织。</p>
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                {workflowCards.map((card, i) => (
                  <motion.button
                    key={card.title}
                    type="button"
                    onClick={() => router.push(`/work/${workId}/${card.meta === "推荐起点" ? "chapters" : card.meta === "人设一致性" ? "characters" : card.meta === "设定准备" ? "lore" : "relations"}`)}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ ...smoothEase, delay: 0.18 + staggerDelay(i, 0.06) }}
                    className="glass hover-lift rounded-2xl p-5 text-left cursor-pointer"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ background: "color-mix(in srgb, var(--accent-gradient) 14%, transparent)", color: "var(--text-secondary)" }}>
                        <card.icon size={18} />
                      </div>
                      <span className="rounded-full px-2.5 py-1 text-[10px] font-medium" style={{ background: "color-mix(in srgb, var(--accent-gradient) 12%, transparent)", color: "var(--text-secondary)" }}>
                        {card.meta}
                      </span>
                    </div>
                    <p className="mt-4 text-base font-semibold" style={{ color: "var(--text)" }}>{card.title}</p>
                    <p className="mt-2 text-sm leading-6" style={{ color: "var(--text-secondary)" }}>{card.desc}</p>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* 最近章节 */}
            <div>
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold" style={{ color: "var(--text)" }}>最近章节</h2>
                  <p className="mt-1 text-sm" style={{ color: "var(--muted)" }}>{chapters.length > 0 ? "从这里继续推进正文。" : "还没有章节，去创建第一章吧。"}</p>
                </div>
                <button type="button" onClick={() => router.push(`/work/${workId}/chapters`)} className="text-xs font-medium cursor-pointer" style={{ color: "var(--text-secondary)" }}>
                  进入章节创作
                </button>
              </div>
              <div className="space-y-3">
                {chapters.slice(0, 5).map((chapter, i) => (
                  <motion.button
                    key={chapter.id}
                    type="button"
                    onClick={() => router.push(`/work/${workId}/chapters`)}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ ...smoothEase, delay: 0.28 + staggerDelay(i, 0.06) }}
                    className="glass hover-lift w-full rounded-2xl p-4 text-left sm:p-5 cursor-pointer"
                  >
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="text-sm font-semibold" style={{ color: "var(--text)" }}>{chapter.title}</p>
                          <span className="rounded-full bg-indigo-100/60 px-2 py-0.5 text-[10px] font-medium text-indigo-700">{chapter.branchCount} 分支</span>
                        </div>
                        <p className="mt-2 text-[12px] leading-6 sm:text-sm" style={{ color: "var(--text-secondary)" }}>{chapter.hook || "建议先补充本章目标或核心冲突。"}</p>
                      </div>
                      <span className="text-[11px] font-medium" style={{ color: "var(--muted)" }}>{chapter.updatedAt}</span>
                    </div>
                  </motion.button>
                ))}
                {chapters.length === 0 && (
                  <div className="glass rounded-2xl p-8 text-center">
                    <p className="text-white/40">暂无章节</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 右侧：风险 + 角色 + AI */}
          <div className="space-y-5">
            {/* 冲突记录 */}
            <div>
              <h2 className="mb-4 text-lg font-semibold" style={{ color: "var(--text)" }}>当前风险与提醒</h2>
              <div className="space-y-3">
                {conflicts.slice(0, 5).map((conflict, i) => (
                  <motion.div
                    key={conflict.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ ...smoothQuick, delay: 0.3 + staggerDelay(i, 0.08) }}
                    className="glass hover-lift rounded-2xl p-4"
                    style={{ borderColor: conflict.severity === "high" ? "color-mix(in srgb, #f43f5e 25%, var(--panel-border))" : undefined }}
                  >
                    <div className="flex items-center gap-2">
                      <TriangleAlert size={15} className={conflict.severity === "high" ? "text-rose-500" : "text-amber-500"} />
                      <p className="text-sm font-medium" style={{ color: "var(--text)" }}>{conflict.title}</p>
                    </div>
                    <p className="mt-2 text-sm leading-6" style={{ color: "var(--text-secondary)" }}>{conflict.message}</p>
                  </motion.div>
                ))}
                {conflicts.length === 0 && (
                  <div className="glass rounded-2xl p-8 text-center">
                    <p className="text-white/40">暂无冲突记录 ✨</p>
                  </div>
                )}
              </div>
            </div>

            {/* 核心角色 + AI 记录 */}
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-1">
              <div>
                <h2 className="mb-4 text-lg font-semibold" style={{ color: "var(--text)" }}>核心角色</h2>
                <div className="space-y-3">
                  {featuredCharacters.map((char, i) => (
                    <motion.button
                      key={char.id}
                      type="button"
                      onClick={() => router.push(`/work/${workId}/characters`)}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ ...smoothQuick, delay: 0.38 + staggerDelay(i, 0.08) }}
                      className="glass hover-lift w-full rounded-2xl p-3.5 text-left cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-semibold text-white" style={{ background: "var(--accent-gradient)" }}>{char.avatar || char.name.charAt(0)}</div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium" style={{ color: "var(--text)" }}>{char.name}</p>
                          <p className="truncate text-[11px]" style={{ color: "var(--muted)" }}>{char.role} · {char.arc}</p>
                        </div>
                      </div>
                    </motion.button>
                  ))}
                  {characters.length === 0 && (
                    <div className="glass rounded-2xl p-6 text-center">
                      <p className="text-white/40 text-sm">暂无角色</p>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h2 className="mb-4 text-lg font-semibold" style={{ color: "var(--text)" }}>最近 AI 记录</h2>
                <div className="space-y-3">
                  {aiRecords.slice(0, 5).map((record, i) => (
                    <motion.div
                      key={record.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ ...smoothQuick, delay: 0.45 + staggerDelay(i, 0.08) }}
                      className="glass hover-lift rounded-2xl p-4"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-xs font-medium" style={{ color: "var(--text)" }}>{record.moduleType}</p>
                        <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${record.status === "ready" ? "bg-emerald-100/60 text-emerald-700" : "bg-amber-100/60 text-amber-700"}`}>
                          {record.status === "ready" ? "可查看" : "待处理"}
                        </span>
                      </div>
                      <p className="mt-2 text-sm leading-6" style={{ color: "var(--text-secondary)" }}>{record.promptDigest}</p>
                    </motion.div>
                  ))}
                  {aiRecords.length === 0 && (
                    <div className="glass rounded-2xl p-6 text-center">
                      <p className="text-white/40 text-sm">暂无 AI 记录</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
