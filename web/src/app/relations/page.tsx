"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

import { smoothEase } from "@/lib/motion-config";
import { RelationGraph } from "@/components/relation-graph";
import { chapters, relationEdges, relationNodes } from "@/lib/mock-data";
import type { RelationEdge, RelationNode } from "@/lib/types";

export default function RelationsPage() {
  const [selectedChapter, setSelectedChapter] = useState(chapters[1].id);
  const [nodes] = useState<RelationNode[]>(relationNodes);
  const [edges] = useState<RelationEdge[]>(relationEdges);
  const [selectedNode, setSelectedNode] = useState<RelationNode | null>(null);

  const activeEdges = selectedNode
    ? edges.filter((e) => e.source === selectedNode.id || e.target === selectedNode.id)
    : [];

  return (
    <div className="flex h-full flex-col">
      <header className="glass sticky top-0 z-10 flex flex-col gap-3 border-b px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-4" style={{ backdropFilter: "blur(24px) saturate(1.3)", WebkitBackdropFilter: "blur(24px) saturate(1.3)" }}>
        <div>
          <h1 className="text-lg font-semibold text-gradient sm:text-xl">人物关系图</h1>
          <p className="mt-1 text-xs sm:text-sm" style={{ color: "var(--muted)" }}>写完章节后来这里复盘情感张力、阵营站位和敌友变化，避免角色关系悄悄写偏。</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {chapters.map((chapter) => (
            <button
              key={chapter.id}
              type="button"
              onClick={() => { setSelectedChapter(chapter.id); setSelectedNode(null); }}
              className="glass rounded-lg px-2.5 py-1.5 text-[11px] font-medium transition-all duration-200 sm:px-3 sm:py-1.5 sm:text-sm"
              style={{
                borderColor: selectedChapter === chapter.id ? "var(--panel-border-hover)" : "transparent",
                background: selectedChapter === chapter.id ? "var(--panel-bg-hover)" : "transparent",
                color: selectedChapter === chapter.id ? "var(--text)" : "var(--muted)",
              }}
            >
              {chapter.title}
            </button>
          ))}
        </div>
      </header>

      <div className="px-3 pt-3 sm:px-4 sm:pt-4 lg:px-4">
        <div className="glass rounded-2xl p-4 sm:p-5">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-sm font-semibold" style={{ color: "var(--text)" }}>关系模块怎么用</p>
              <p className="mt-1 text-sm leading-6" style={{ color: "var(--text-secondary)" }}>先切到刚写完的章节，再点角色查看他和其他人的亲密度、冲突度与关系注释。这里更适合写后复盘，不建议当成写作起点。</p>
            </div>
            <span className="rounded-full px-2.5 py-1 text-[10px] font-medium" style={{ background: "color-mix(in srgb, var(--accent-gradient) 12%, transparent)", color: "var(--text-secondary)" }}>
              推荐顺序：写章节 → 看关系变化 → 修正文案
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-1 flex-col overflow-hidden p-3 sm:p-4 lg:flex-row">
        {/* Graph */}
        <div className="flex-1">
          <div className="glass h-64 min-h-[280px] overflow-hidden rounded-xl sm:h-full sm:rounded-2xl">
            <RelationGraph nodes={nodes} edges={edges} onNodeClick={setSelectedNode} />
          </div>
        </div>

        {/* Detail Panel */}
        <AnimatePresence mode="wait">
          {selectedNode ? (
            <motion.aside
              key={`node-${selectedNode.id}`}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 16 }}
              transition={smoothEase}
              className="glass mt-3 w-full shrink-0 overflow-y-auto rounded-xl lg:mt-0 lg:w-80 lg:rounded-none lg:border-l"
              style={{ backdropFilter: "blur(24px) saturate(1.3)", WebkitBackdropFilter: "blur(24px) saturate(1.3)" }}
            >
              <div className="p-4 sm:p-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-semibold text-white sm:h-12 sm:w-12 sm:text-base" style={{ background: "var(--accent-gradient)", boxShadow: "0 4px 16px color-mix(in srgb, var(--accent-gradient) 35%, transparent)" }}>{selectedNode.avatar}</div>
                  <div>
                    <h2 className="text-base font-semibold sm:text-lg" style={{ color: "var(--text)" }}>{selectedNode.label}</h2>
                    <p className="text-xs sm:text-sm" style={{ color: "var(--muted)" }}>关系详情</p>
                  </div>
                </div>

                <div className="mt-5 space-y-3 sm:mt-6 sm:space-y-4">
                  {activeEdges.length === 0 ? (
                    <p className="text-sm" style={{ color: "var(--muted)" }}>暂无关系边</p>
                  ) : (
                    activeEdges.map((edge) => {
                      const isSource = edge.source === selectedNode.id;
                      const otherId = isSource ? edge.target : edge.source;
                      const other = relationNodes.find((n) => n.id === otherId);

                      return (
                        <div key={edge.id} className="glass-soft rounded-xl p-3 sm:p-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-xs font-semibold sm:h-10 sm:w-10 sm:text-sm" style={{ background: "color-mix(in srgb, var(--accent-gradient) 15%, transparent)", color: "var(--text-secondary)" }}>{other?.avatar}</div>
                            <div className="flex-1">
                              <p className="text-sm font-medium" style={{ color: "var(--text)" }}>{other?.label}</p>
                              <p className="text-[11px]" style={{ color: "var(--muted)" }}>{edge.relationType}</p>
                            </div>
                          </div>
                          <div className="mt-2 flex flex-wrap gap-2">
                            <span className="rounded-full bg-emerald-100/60 px-2 py-0.5 text-[10px] font-medium text-emerald-700">亲密 {edge.intimacyLevel}/5</span>
                            <span className="rounded-full bg-rose-100/60 px-2 py-0.5 text-[10px] font-medium text-rose-700">冲突 {edge.conflictLevel}/5</span>
                          </div>
                          <p className="mt-2 text-[11px] leading-relaxed sm:mt-3 sm:text-sm" style={{ color: "var(--text-secondary)" }}>{edge.note}</p>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </motion.aside>
          ) : (
            <motion.aside
              key="empty"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 16 }}
              transition={smoothEase}
              className="glass mt-3 hidden w-full shrink-0 overflow-y-auto rounded-xl lg:mt-0 lg:block lg:w-80 lg:rounded-none lg:border-l"
              style={{ backdropFilter: "blur(24px) saturate(1.3)", WebkitBackdropFilter: "blur(24px) saturate(1.3)" }}
            >
              <div className="p-4 sm:p-6">
                <h2 className="text-base font-semibold sm:text-lg" style={{ color: "var(--text)" }}>关系类型</h2>
                <p className="mt-1 text-xs sm:text-sm" style={{ color: "var(--muted)" }}>当前作品已定义的关系标签</p>
                <div className="mt-4 grid gap-2">
                  {["亲情", "友情", "爱情", "敌对", "师徒", "利用", "共谋", "暧昧"].map((type) => (
                    <div key={type} className="glass-soft rounded-xl px-3 py-2.5 text-xs sm:px-4 sm:py-3 sm:text-sm font-medium" style={{ color: "var(--text-secondary)" }}>{type}</div>
                  ))}
                </div>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
