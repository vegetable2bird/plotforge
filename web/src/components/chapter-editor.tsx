"use client";

import { ArrowLeft, ArrowRight, Clock, Lock, Sparkles, Users, History } from "lucide-react";
import { useRouter } from "next/navigation";

import type { Chapter, ChapterContent, PlotBranch } from "@/lib/types";

const writingSteps = ["先确认本章钩子", "再推进正文场面", "卡住时再开 AI 分支", "写完后回关系与快照复盘"];

interface Props {
  chapter: Chapter;
  branches: PlotBranch[];
  contents: ChapterContent[];
  onBack: () => void;
  onNavigateContent: (contentId: string) => void;
  activeContentId: string;
  onUpdateContent: (contentId: string, content: string) => void;
  onCreateSnapshot: () => void;
}

export function ChapterEditor({ chapter, branches, contents, onBack, onNavigateContent, activeContentId, onUpdateContent, onCreateSnapshot }: Props) {
  const router = useRouter();
  const activeContent = contents.find((c) => c.id === activeContentId) ?? contents[0];

  const statusColor = (status: string) => {
    if (status === "locked") return "text-amber-600";
    if (status === "polish") return "text-emerald-600";
    return "text-sky-600";
  };

  const statusLabel = (status: string) => {
    if (status === "locked") return "已锁定";
    if (status === "polish") return "精修中";
    return "草稿";
  };

  const statusIcon = (status: string) => {
    if (status === "locked") return <Lock size={14} />;
    return <Clock size={14} />;
  };

  return (
    <div className="h-full overflow-hidden">
      <div className="glass flex h-12 items-center justify-between border-b px-3 sm:h-14 sm:px-6" style={{ backdropFilter: "blur(24px) saturate(1.3)", WebkitBackdropFilter: "blur(24px) saturate(1.3)", borderColor: "color-mix(in srgb, var(--panel-border) 78%, transparent)" }}>
        <div className="flex items-center gap-2 sm:gap-4">
          <button type="button" onClick={onBack} className="flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-[11px] font-medium transition-all duration-200 hover:bg-black/[0.06] sm:px-2.5 sm:text-xs" style={{ color: "var(--text-secondary)" }}>
            <ArrowLeft size={13} />
            <span className="hidden sm:inline">返回章节列表</span>
          </button>
          <h2 className="truncate text-sm font-semibold sm:text-base" style={{ color: "var(--text)" }}>{chapter.title}</h2>
        </div>
        <div className="flex items-center gap-1.5 sm:gap-2">
          <span className={`hidden items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium sm:flex ${statusColor(chapter.status)}`}>
            {statusIcon(chapter.status)}
            {statusLabel(chapter.status)}
          </span>
          <button type="button" className="btn-accent flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-[11px] font-medium sm:px-3 sm:text-xs">
            <Sparkles size={13} />
            <span className="hidden sm:inline">AI 辅助续写</span>
          </button>
        </div>
      </div>

      <div className="flex h-[calc(100%-3rem)] sm:h-[calc(100%-3.5rem)]">
        {/* Content Outline Sidebar - hidden on mobile, visible on md+ */}
        <div className="hidden w-44 shrink-0 overflow-y-auto border-r p-3 md:block md:w-52 md:p-4" style={{ borderColor: "color-mix(in srgb, var(--panel-border) 72%, transparent)" }}>
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--muted)" }}>章节内容</p>
          <div className="mt-3 space-y-1.5">
            {contents.map((content) => (
                <button
                  key={content.id}
                  type="button"
                  onClick={() => { onNavigateContent(content.id); }}
                  className="hover-lift w-full rounded-lg px-2.5 py-1.5 text-left text-[11px] font-medium transition-all duration-200 md:px-3 md:py-2 md:text-xs"
                  style={
                  activeContentId === content.id
                    ? { background: "color-mix(in srgb, var(--accent-gradient) 15%, transparent)", color: "var(--text)" }
                    : { color: "var(--text-secondary)" }
                }
              >
                {content.title}
              </button>
            ))}
          </div>

          <div className="mt-5 md:mt-6">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--muted)" }}>剧情分支</p>
            <div className="mt-2.5 space-y-1.5 md:mt-3">
              {branches.map((branch) => (
                <div key={branch.id} className="rounded-lg px-2.5 py-1.5 text-[11px] font-medium md:px-3 md:py-2 md:text-xs" style={{ color: "var(--text-secondary)" }}>
                  {branch.title}
                  {branch.aiGenerated && <span className="ml-1 rounded px-1.5 py-0.5 text-[10px]" style={{ background: "color-mix(in srgb, var(--accent-gradient) 12%, transparent)" }}>AI</span>}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Editor */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-6">
          <div className="mx-auto max-w-3xl space-y-4 sm:space-y-5">
            <div className="glass rounded-xl p-4 sm:rounded-2xl sm:p-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-sm font-semibold" style={{ color: "var(--text)" }}>本章写作路径</p>
                  <p className="mt-1 text-sm leading-6" style={{ color: "var(--text-secondary)" }}>这一步先把本章目标钉住，再进入正文。AI 辅助是卡点工具，不是默认主入口。</p>
                </div>
                <span className="rounded-full px-2.5 py-1 text-[10px] font-medium" style={{ background: "color-mix(in srgb, var(--accent-gradient) 12%, transparent)", color: "var(--text-secondary)" }}>
                  当前目标：{chapter.hook || "先补充本章钩子"}
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => router.push("/relations")}
                  className="glass hover-lift flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium"
                  style={{ color: "var(--text-secondary)" }}
                >
                  <Users size={14} />
                  去检查关系变化
                  <ArrowRight size={13} />
                </button>
                <button
                  type="button"
                  onClick={onCreateSnapshot}
                  className="glass hover-lift flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium"
                  style={{ color: "var(--text-secondary)" }}
                >
                  <History size={14} />
                  创建当前章节快照
                  <ArrowRight size={13} />
                </button>
              </div>
              <div className="mt-4 grid gap-2 sm:grid-cols-2">
                {writingSteps.map((step, index) => (
                  <div key={step} className="glass-soft rounded-xl p-3">
                    <div className="flex items-start gap-3">
                      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold text-white" style={{ background: "var(--accent-gradient)" }}>
                        {index + 1}
                      </div>
                      <p className="text-sm leading-6" style={{ color: "var(--text-secondary)" }}>{step}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass rounded-xl p-5 sm:rounded-2xl sm:p-8" style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.06), 0 1px 4px rgba(0,0,0,0.04)" }}>
              <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-sm font-semibold" style={{ color: "var(--text)" }}>正文编辑区</p>
                  <p className="mt-1 text-sm leading-6" style={{ color: "var(--text-secondary)" }}>先把眼前这一段写顺，再决定要不要切去看 AI 分支或建议。</p>
                </div>
                <span className="rounded-full px-2.5 py-1 text-[10px] font-medium" style={{ background: "color-mix(in srgb, var(--panel-bg) 82%, transparent)", color: "var(--muted)" }}>
                  当前片段：{activeContent?.title || "未选择片段"}
                </span>
              </div>

            <textarea
              value={activeContent?.content ?? ""}
              onChange={(e) => {
                if (activeContent?.id) {
                  onUpdateContent(activeContent.id, e.target.value);
                }
              }}
              className="h-[calc(100vh-10rem)] w-full resize-none bg-transparent text-sm leading-[2] focus:outline-none sm:h-[60vh]"
              placeholder="在此输入正文内容..."
              style={{ color: "var(--text)" }}
            />
            </div>
          </div>
        </div>

        {/* Chapter Metadata - hidden on small screens, visible on lg+ */}
        <div className="hidden w-64 shrink-0 overflow-y-auto border-l p-4 lg:block lg:w-72 lg:p-5" style={{ borderColor: "color-mix(in srgb, var(--panel-border) 72%, transparent)" }}>
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--muted)" }}>章节元信息</p>
          <div className="mt-3 space-y-3 lg:mt-4 lg:space-y-4">
            <div className="glass-soft rounded-lg p-2.5 lg:rounded-xl lg:p-3">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--muted)" }}>核心钩子</p>
              <p className="mt-1.5 text-[11px] leading-relaxed lg:text-xs" style={{ color: "var(--text-secondary)" }}>{chapter.hook}</p>
            </div>
            <div className="glass-soft rounded-lg p-2.5 lg:rounded-xl lg:p-3">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--muted)" }}>内容预览</p>
              <p className="mt-1.5 text-[11px] leading-relaxed lg:text-xs" style={{ color: "var(--muted)" }}>{chapter.contentPreview}</p>
            </div>
            <div className="glass-soft rounded-lg p-2.5 lg:rounded-xl lg:p-3">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--muted)" }}>最近更新</p>
              <p className="mt-1.5 text-[11px] lg:text-xs" style={{ color: "var(--text-secondary)" }}>{chapter.updatedAt}</p>
            </div>
            <div className="glass-soft rounded-lg p-2.5 lg:rounded-xl lg:p-3">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--muted)" }}>分支数量</p>
              <p className="mt-1.5 text-[11px] lg:text-xs" style={{ color: "var(--text-secondary)" }}>{chapter.branchCount} 条</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
