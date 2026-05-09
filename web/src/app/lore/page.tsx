"use client";

import { motion } from "framer-motion";
import { BookMarked, Search, Tag, AlertTriangle, Link, Plus } from "lucide-react";
import { useState, useEffect, useCallback } from "react";

import { fadeUp, staggerDelay } from "@/lib/motion-config";
import { api } from "@/lib/api-client";
import type { LoreEntry } from "@/lib/types";

const categories = ["全部", "世界法则", "历史事件", "地理风貌", "修行体系", "器物秘宝"];

export default function LorePage() {
  const [loreEntries, setLoreEntries] = useState<LoreEntry[]>([]);
  const [activeCategory, setActiveCategory] = useState("全部");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLore, setSelectedLore] = useState<LoreEntry | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.lore.list() // TODO: 传入当前 workId
      .then((data) => setLoreEntries(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = loreEntries.filter((entry) => {
    const matchCategory = activeCategory === "全部" || entry.category === activeCategory;
    const matchSearch = !searchQuery || entry.title.includes(searchQuery) || entry.summary.includes(searchQuery);
    return matchCategory && matchSearch;
  });

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-sm" style={{ color: "var(--muted)" }}>加载中...</p>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col overflow-y-auto">
      <div className="mx-auto w-full max-w-5xl p-4 sm:p-6 lg:p-8">
        <div className="mb-6 flex flex-col gap-3 sm:mb-8 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-xl font-semibold text-gradient sm:text-2xl">世界观库</h1>
            <p className="mt-1 text-xs sm:text-sm" style={{ color: "var(--muted)" }}>这里用来兜住设定底盘。把法则、历史、器物和地理先写清楚，避免正文推进到一半再返工补设定。</p>
          </div>
          <button type="button" className="btn-accent flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium sm:px-5">
            <Plus size={14} />
            新建词条
          </button>
        </div>

        <div className="glass mb-5 rounded-2xl p-4 sm:mb-6 sm:p-5">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-sm font-semibold" style={{ color: "var(--text)" }}>世界观模块怎么用</p>
              <p className="mt-1 text-sm leading-6" style={{ color: "var(--text-secondary)" }}>先补会反复被引用的世界规则，再补地理、历史和器物。出现冲突标记时，优先修正词条，再回章节里改引用内容。</p>
            </div>
            <span className="rounded-full px-2.5 py-1 text-[10px] font-medium" style={{ background: "color-mix(in srgb, var(--accent-gradient) 12%, transparent)", color: "var(--text-secondary)" }}>
              推荐顺序：核心法则 → 引用设定 → 冲突修正
            </span>
          </div>
        </div>

        <div className="mb-6 space-y-4 sm:mb-8">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--muted)" }} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="搜索词条名称或内容..."
              className="glass hover-lift w-full rounded-xl border border-[var(--panel-border)] py-2.5 pl-10 pr-4 text-sm backdrop-blur-sm transition-all duration-200 focus:border-[color-mix(in_srgb,var(--accent-gradient)_60%,transparent)] focus:outline-none focus:ring-2 focus:ring-[color-mix(in_srgb,var(--accent-gradient)_20%,transparent)]"
              style={{ background: "var(--panel-bg)" }}
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className="glass rounded-lg px-3 py-1.5 text-[11px] font-medium transition-all duration-200 sm:px-4 sm:py-2 sm:text-sm"
                style={{
                  borderColor: activeCategory === cat ? "var(--panel-border-hover)" : "transparent",
                  background: activeCategory === cat ? "var(--panel-bg-hover)" : "transparent",
                  color: activeCategory === cat ? "var(--text)" : "var(--muted)",
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-4 sm:gap-5 md:grid-cols-2">
          {filtered.map((entry, i) => (
            <motion.button
              key={entry.id}
              type="button"
              onClick={() => setSelectedLore(selectedLore?.id === entry.id ? null : entry)}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={fadeUp(staggerDelay(i, 0.07))}
              className={`glass hover-lift w-full rounded-xl p-5 text-left sm:rounded-2xl sm:p-6 ${selectedLore?.id === entry.id ? "border-[var(--panel-border-hover)]" : ""} ${entry.riskLevel === "warning" ? "border-[color-mix(in_srgb,#f59e0b_30%,var(--panel-border))]" : ""}`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <BookMarked size={16} style={{ color: "var(--muted)" }} />
                    <h3 className="text-sm font-semibold sm:text-base" style={{ color: "var(--text)" }}>{entry.title}</h3>
                    {entry.riskLevel === "warning" && (
                      <span className="flex items-center gap-1 rounded-full bg-amber-100/60 px-2 py-0.5 text-[10px] font-medium text-amber-700">
                        <AlertTriangle size={10} />
                        冲突
                      </span>
                    )}
                  </div>
                  <span className="mt-2 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium" style={{ background: "color-mix(in srgb, var(--accent-gradient) 12%, transparent)", color: "var(--text-secondary)" }}>
                    <Tag size={10} />
                    {entry.category}
                  </span>
                </div>
              </div>

              <p className="mt-3 text-[11px] leading-relaxed sm:text-xs" style={{ color: "var(--text-secondary)" }}>{entry.summary}</p>

              {entry.linkedTitles.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {entry.linkedTitles.map((linked) => (
                    <span key={linked} className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-medium" style={{ background: "color-mix(in srgb, var(--panel-bg) 80%, transparent)", color: "var(--text-secondary)" }}>
                      <Link size={10} />
                      {linked}
                    </span>
                  ))}
                </div>
              )}
            </motion.button>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="py-12 text-center">
            <BookMarked size={32} className="mx-auto mb-3" style={{ color: "var(--muted)" }} />
            <p className="text-sm" style={{ color: "var(--muted)" }}>没有找到匹配的词条</p>
          </div>
        )}
      </div>
    </div>
  );
}
