"use client";

import { BookOpen, Sparkles, TriangleAlert } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

import { smoothQuick, staggerDelay } from "@/lib/motion-config";
import type { AiSuggestion, PlotBranch } from "@/lib/types";

interface Props {
  branches: PlotBranch[];
  suggestions: AiSuggestion[];
  onApplySuggestion: () => void;
  onCreateBranch: () => void;
}

export function AiPlotPanel({ branches, suggestions, onApplySuggestion, onCreateBranch }: Props) {
  const [activeTab, setActiveTab] = useState<"branches" | "suggestions">("branches");

  const tensionColor = (tension: string) => {
    if (tension === "high") return "text-rose-600 bg-rose-100/60";
    if (tension === "medium") return "text-amber-600 bg-amber-100/60";
    return "text-emerald-600 bg-emerald-100/60";
  };

  const typeIcon = (type: string) => {
    if (type === "continuation") return <Sparkles size={14} />;
    if (type === "conflict") return <TriangleAlert size={14} />;
    return <BookOpen size={14} />;
  };

  const typeLabel = (type: string) => {
    if (type === "continuation") return "定点续写";
    if (type === "conflict") return "冲突提示";
    return "改写建议";
  };

  return (
    <div className="glass h-full overflow-hidden rounded-xl sm:rounded-2xl">
      <div className="border-b border-[var(--panel-border)] px-4 py-3 sm:px-5 sm:py-4">
        <h3 className="text-sm font-semibold" style={{ color: "var(--text)" }}>AI 剧情辅助</h3>
        <p className="mt-0.5 text-[11px]" style={{ color: "var(--muted)" }}>当正文卡住、节奏不稳或角色动机拿不准时，再从这里借力。</p>
      </div>

      <div className="border-b border-[var(--panel-border)] px-4 py-3 sm:px-5">
        <div className="glass-soft rounded-xl p-3">
          <p className="text-[11px] font-semibold" style={{ color: "var(--text)" }}>建议使用时机</p>
          <p className="mt-1 text-[11px] leading-6" style={{ color: "var(--text-secondary)" }}>
            先自己把本章目标和当前场面写到一半，再用 AI 补分支、续写或冲突提醒。这样建议会更贴近你已经建立的节奏，而不是把整章交给生成。
          </p>
        </div>
      </div>

      <div className="flex border-b border-[var(--panel-border)]">
        {(["branches", "suggestions"] as const).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className="flex-1 px-3 py-2.5 text-[11px] font-medium transition-all duration-200 sm:px-4 sm:text-xs"
            style={{
              color: activeTab === tab ? "var(--text)" : "var(--muted)",
              borderBottom: activeTab === tab ? "2px solid var(--accent-gradient)" : "2px solid transparent",
            }}
          >
            {tab === "branches" ? "剧情分支" : "AI 建议"}
          </button>
        ))}
      </div>

      <div className="h-[calc(100%-7rem)] overflow-y-auto p-3 sm:h-[calc(100%-7.5rem)] sm:p-4">
        {activeTab === "branches" && (
          <div className="space-y-2.5 sm:space-y-3">
            <div className="rounded-xl border border-dashed px-3 py-2.5 text-[11px] leading-6" style={{ borderColor: "color-mix(in srgb, var(--panel-border) 85%, transparent)", color: "var(--muted)" }}>
              分支更适合测试不同走向，不一定直接并入正文。先看哪条最能服务本章目标，再决定是否采纳。
            </div>
            {branches.map((branch, i) => (
              <motion.div
                key={branch.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ ...smoothQuick, delay: staggerDelay(i, 0.06) }}
                className="glass hover-lift rounded-lg p-3 sm:rounded-xl sm:p-4"
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="text-xs font-medium sm:text-sm" style={{ color: "var(--text)" }}>{branch.title}</p>
                  <span className={`shrink-0 rounded-full px-1.5 py-0.5 text-[10px] font-semibold sm:px-2 ${tensionColor(branch.tension)}`}>
                    {branch.tension === "high" ? "高张力" : branch.tension === "medium" ? "中张力" : "低张力"}
                  </span>
                </div>
                <p className="mt-1.5 text-[11px] leading-relaxed sm:mt-2 sm:text-xs" style={{ color: "var(--muted)" }}>{branch.summary}</p>
                {branch.aiGenerated && (
                  <span className="mt-1.5 inline-block rounded-lg px-2 py-0.5 text-[10px] font-medium sm:mt-2" style={{ background: "color-mix(in srgb, var(--accent-gradient) 12%, transparent)", color: "var(--text-secondary)" }}>AI 生成</span>
                )}
              </motion.div>
            ))}

            <button
              type="button"
              onClick={onCreateBranch}
              className="glass hover-lift w-full rounded-lg border border-dashed p-3 text-xs font-medium transition-all sm:rounded-xl sm:p-4 sm:text-sm"
              style={{ borderColor: "var(--muted)", color: "var(--muted)" }}
            >
              + 新建剧情分支
            </button>
          </div>
        )}

        {activeTab === "suggestions" && (
          <div className="space-y-2.5 sm:space-y-3">
            <div className="rounded-xl border border-dashed px-3 py-2.5 text-[11px] leading-6" style={{ borderColor: "color-mix(in srgb, var(--panel-border) 85%, transparent)", color: "var(--muted)" }}>
              建议主要用来补一小段、抬一次冲突或修一次人物情绪，不建议整章无脑套用。
            </div>
            {suggestions.map((suggestion, i) => (
              <motion.div
                key={suggestion.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ ...smoothQuick, delay: staggerDelay(i, 0.06) }}
                className="glass hover-lift rounded-lg p-3 sm:rounded-xl sm:p-4"
              >
                <div className="flex items-center gap-2">
                  <span style={{ color: "var(--text-secondary)" }}>{typeIcon(suggestion.type)}</span>
                  <p className="text-xs font-medium sm:text-sm" style={{ color: "var(--text)" }}>{suggestion.label}</p>
                </div>
                <span className={`mt-1.5 inline-block rounded-full px-1.5 py-0.5 text-[10px] font-semibold sm:mt-2 sm:px-2 ${tensionColor(suggestion.tension)}`}>
                  {typeLabel(suggestion.type)}
                </span>
                <p className="mt-1.5 text-[11px] leading-relaxed sm:mt-2 sm:text-xs" style={{ color: "var(--text-secondary)" }}>{suggestion.content}</p>
                <button
                  type="button"
                  onClick={() => onApplySuggestion()}
                  className="mt-2 rounded-lg px-2.5 py-1.5 text-[11px] font-medium transition-all duration-200 sm:mt-3 sm:px-3 sm:text-xs"
                  style={{ background: "color-mix(in srgb, var(--accent-gradient) 15%, transparent)", color: "var(--text-secondary)" }}
                >
                  应用建议
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
