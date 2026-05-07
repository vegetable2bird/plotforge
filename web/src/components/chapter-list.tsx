"use client";

import { Edit3, FileText, Plus } from "lucide-react";
import { motion } from "framer-motion";

import { fadeUp, staggerDelay } from "@/lib/motion-config";
import type { Chapter } from "@/lib/types";

interface Props {
  chapters: Chapter[];
  onEditChapter: (chapterId: string) => void;
  onCreateChapter: () => void;
}

export function ChapterList({ chapters, onEditChapter, onCreateChapter }: Props) {
  const statusBadge = (status: string) => {
    if (status === "locked") return "bg-amber-100/60 text-amber-700";
    if (status === "polish") return "bg-emerald-100/60 text-emerald-700";
    return "bg-sky-100/60 text-sky-700";
  };

  const statusLabel = (status: string) => {
    if (status === "locked") return "已锁定";
    if (status === "polish") return "精修中";
    return "草稿";
  };

  return (
    <div className="flex h-full flex-col overflow-y-auto">
      <div className="mx-auto w-full max-w-4xl p-4 sm:p-6 lg:p-8">
        <div className="mb-6 flex flex-col gap-3 sm:mb-8 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-xl font-semibold text-gradient sm:text-2xl">章节创作</h1>
            <p className="mt-1 text-xs sm:text-sm" style={{ color: "var(--muted)" }}>这里是正文推进中心。先定本章目标，再写正文，需要时再拉 AI 分支协助拆解卡点。</p>
          </div>
          <button type="button" onClick={onCreateChapter} className="btn-accent flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium sm:px-5">
            <Plus size={14} />
            新建章节
          </button>
        </div>

        <div className="glass mb-5 rounded-2xl p-4 sm:mb-6 sm:p-5">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-sm font-semibold" style={{ color: "var(--text)" }}>章节模块怎么用</p>
              <p className="mt-1 text-sm leading-6" style={{ color: "var(--text-secondary)" }}>推荐流程是先写核心钩子，再进入正文编辑。只有当节奏、转折或人物行为卡住时，再让 AI 生成分支，不要把它当成默认入口。</p>
            </div>
            <span className="rounded-full px-2.5 py-1 text-[10px] font-medium" style={{ background: "color-mix(in srgb, var(--accent-gradient) 12%, transparent)", color: "var(--text-secondary)" }}>
              推荐顺序：本章目标 → 正文 → AI 分支 → 回收定稿
            </span>
          </div>
        </div>

        <div className="space-y-4 sm:space-y-5">
          {chapters.map((chapter, i) => (
            <motion.div
              key={chapter.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={fadeUp(staggerDelay(i))}
              className="glass hover-lift border-gradient-hover rounded-xl p-4 sm:rounded-2xl sm:p-6"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg transition-all duration-300 sm:h-12 sm:w-12 sm:rounded-xl" style={{ background: "color-mix(in srgb, var(--accent-gradient) 12%, transparent)", color: "var(--text-secondary)" }}>
                    <FileText size={18} />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold sm:text-base" style={{ color: "var(--text)" }}>{chapter.title}</h3>
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold sm:px-2.5 sm:py-0.5 sm:text-[11px] ${statusBadge(chapter.status)}`}>
                        {statusLabel(chapter.status)}
                      </span>
                      <span className="text-[10px] sm:text-xs" style={{ color: "var(--muted)" }}>更新于 {chapter.updatedAt}</span>
                      <span className="text-[10px] sm:text-xs" style={{ color: "var(--muted)" }}>· {chapter.branchCount} 条分支</span>
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => onEditChapter(chapter.id)}
                  className="glass hover-lift flex items-center gap-1.5 rounded-lg px-3 py-2 text-[11px] font-medium sm:rounded-xl sm:px-4 sm:py-2 sm:text-xs"
                >
                  <Edit3 size={13} />
                  进入编辑
                </button>
              </div>

              <div className="mt-4 grid gap-3 sm:mt-5 sm:gap-4 sm:grid-cols-2">
                <div className="glass-soft rounded-lg p-3 sm:rounded-xl sm:p-4">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--muted)" }}>核心钩子</p>
                  <p className="mt-1.5 text-[11px] leading-relaxed sm:mt-2 sm:text-xs" style={{ color: "var(--text-secondary)" }}>{chapter.hook}</p>
                </div>
                <div className="glass-soft rounded-lg p-3 sm:rounded-xl sm:p-4">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--muted)" }}>内容预览</p>
                  <p className="mt-1.5 text-[11px] leading-relaxed sm:mt-2 sm:text-xs" style={{ color: "var(--text-secondary)" }}>{chapter.contentPreview}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
