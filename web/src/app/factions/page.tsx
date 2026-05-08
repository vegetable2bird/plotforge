"use client";

import { motion } from "framer-motion";
import { Shield, ChevronRight, Users, Scale, Zap, Plus } from "lucide-react";
import { useState, useEffect, useCallback } from "react";

import { fadeUp, staggerDelay, expandHeight, growWidth } from "@/lib/motion-config";
import { api } from "@/lib/api-client";
import { FactionEditor } from "@/components/faction-editor";
import type { Faction } from "@/lib/types";

type FactionEdge = {
  id: string;
  sourceId: string;
  targetId: string;
  edgeType: string;
  note: string;
};

export default function FactionsPage() {
  const [factions, setFactions] = useState<Faction[]>([]);
  const [factionEdges, setFactionEdges] = useState<FactionEdge[]>([]);
  const [selectedFaction, setSelectedFaction] = useState<Faction | null>(null);
  const [editingFaction, setEditingFaction] = useState<Faction | null>(null);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    try {
      const [factionsData, edgesData] = await Promise.all([
        api.factions.list("work-1"),
        api.factions.listEdges(),
      ]);
      setFactions(factionsData);
      setFactionEdges(edgesData);
    } catch (err) {
      console.error("Failed to load factions:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const handleSave = async (updated: Faction) => {
    try {
      const result = await api.factions.update(updated.id, updated);
      setEditingFaction(null);
      setSelectedFaction(result);
      await loadData();
    } catch (err) {
      console.error("Failed to save faction:", err);
    }
  };

  const handleCreate = async () => {
    try {
      const newFaction = await api.factions.create({
        workId: "work-1",
        name: "新势力",
        stance: "",
        doctrine: "",
        leader: "",
        influence: 0,
      });
      await loadData();
      setSelectedFaction(newFaction);
      setEditingFaction(newFaction);
    } catch (err) {
      console.error("Failed to create faction:", err);
    }
  };

  const stanceColor = (stance: string) => {
    if (stance.includes("中立")) return "text-emerald-600 bg-emerald-100/60";
    if (stance.includes("对抗")) return "text-rose-600 bg-rose-100/60";
    return "text-sky-600 bg-sky-100/60";
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-sm" style={{ color: "var(--muted)" }}>加载中...</p>
      </div>
    );
  }

  if (editingFaction) {
    return (
      <div className="flex h-full flex-col overflow-y-auto">
        <div className="mx-auto w-full max-w-5xl p-4 sm:p-6 lg:p-8">
          <FactionEditor faction={editingFaction} onSave={handleSave} onCancel={() => setEditingFaction(null)} />
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col overflow-y-auto">
      <div className="mx-auto w-full max-w-5xl p-4 sm:p-6 lg:p-8">
        <div className="mb-6 flex flex-col gap-3 sm:mb-8 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-xl font-semibold text-gradient sm:text-2xl">势力体系</h1>
            <p className="mt-1 text-xs sm:text-sm" style={{ color: "var(--muted)" }}>这里管理宏观格局。涉及阵营对抗、资源争夺或立场摇摆时，先看势力层面的变化，再落到具体角色与章节。</p>
          </div>
          <button type="button" onClick={handleCreate} className="btn-accent flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium sm:px-5">
            <Plus size={14} />
            新建势力
          </button>
        </div>

        <div className="glass mb-5 rounded-2xl p-4 sm:mb-6 sm:p-5">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-sm font-semibold" style={{ color: "var(--text)" }}>势力模块怎么用</p>
              <p className="mt-1 text-sm leading-6" style={{ color: "var(--text-secondary)" }}>先确认每个势力的信条、领袖和当前立场，再检查影响力变化是否会反推角色动机。它更适合处理大局，不适合替代人物关系细节。</p>
            </div>
            <span className="rounded-full px-2.5 py-1 text-[10px] font-medium" style={{ background: "color-mix(in srgb, var(--accent-gradient) 12%, transparent)", color: "var(--text-secondary)" }}>
              推荐顺序：势力格局 → 角色立场 → 章节冲突
            </span>
          </div>
        </div>

        <div className="grid gap-5 lg:grid-cols-5">
          <div className="space-y-4 sm:space-y-5 lg:col-span-3">
            {factions.map((faction, i) => (
              <motion.button
                key={faction.id}
                type="button"
                onClick={() => setSelectedFaction(selectedFaction?.id === faction.id ? null : faction)}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={fadeUp(staggerDelay(i))}
                className={`glass hover-lift w-full rounded-xl p-5 text-left sm:rounded-2xl sm:p-6 ${selectedFaction?.id === faction.id ? "border-[var(--panel-border-hover)]" : ""}`}
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-lg font-semibold text-white" style={{ background: "var(--accent-gradient)", boxShadow: "0 4px 16px color-mix(in srgb, var(--accent-gradient) 30%, transparent)" }}>
                    <Shield size={22} />
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-base font-semibold" style={{ color: "var(--text)" }}>{faction.name}</h3>
                      <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${stanceColor(faction.stance)}`}>
                        {faction.stance}
                      </span>
                    </div>
                    <p className="mt-2 text-xs leading-relaxed" style={{ color: "var(--text-secondary)" }}>{faction.doctrine}</p>

                    <div className="mt-4">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--muted)" }}>影响力</span>
                        <span className="text-xs font-semibold" style={{ color: "var(--text)" }}>{faction.influence}%</span>
                      </div>
                      <div className="mt-2 h-2.5 overflow-hidden rounded-full" style={{ background: "color-mix(in srgb, var(--panel-bg) 80%, transparent)" }}>
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${faction.influence}%` }}
                          transition={growWidth(0.2 + staggerDelay(i, 0.1))}
                          className="h-full rounded-full"
                          style={{ background: "var(--accent-gradient)", boxShadow: "0 0 8px color-mix(in srgb, var(--accent-gradient) 50%, transparent)" }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {selectedFaction?.id === faction.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={expandHeight}
                    className="mt-5 border-t pt-4"
                    style={{ borderColor: "var(--panel-border)" }}
                  >
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className="flex items-center gap-3">
                        <Users size={16} style={{ color: "var(--muted)" }} />
                        <div>
                          <p className="text-[10px] font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--muted)" }}>首领</p>
                          <p className="text-sm font-medium" style={{ color: "var(--text)" }}>{faction.leader}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Scale size={16} style={{ color: "var(--muted)" }} />
                        <div>
                          <p className="text-[10px] font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--muted)" }}>立场</p>
                          <p className="text-sm font-medium" style={{ color: "var(--text)" }}>{faction.stance}</p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--muted)" }}>势力关系</p>
                      <div className="mt-2 space-y-2">
                        {factionEdges.filter((e) => e.sourceId === faction.id || e.targetId === faction.id).map((edge) => (
                          <div key={edge.id} className="glass-soft flex items-center justify-between rounded-lg px-3 py-2 text-xs">
                            <div className="flex items-center gap-2">
                              <Zap size={14} className="text-amber-500" />
                              <span style={{ color: "var(--text-secondary)" }}>{edge.edgeType}</span>
                            </div>
                            <ChevronRight size={14} style={{ color: "var(--muted)" }} />
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="mt-4 flex gap-2">
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); setEditingFaction(faction); }}
                        className="btn-accent rounded-lg px-3 py-2 text-xs font-medium"
                      >
                        编辑势力
                      </button>
                    </div>
                  </motion.div>
                )}
              </motion.button>
            ))}
          </div>

          <div className="glass hidden h-fit rounded-xl p-4 sm:rounded-2xl sm:p-5 lg:col-span-2 lg:block">
            <h3 className="text-sm font-semibold" style={{ color: "var(--text)" }}>势力总览</h3>
            <p className="mt-1 text-[11px]" style={{ color: "var(--muted)" }}>当前世界观中的势力分布</p>
            <div className="mt-4 space-y-3">
              {factions.map((f) => (
                <div key={f.id} className="glass-soft rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-medium" style={{ color: "var(--text)" }}>{f.name}</p>
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${stanceColor(f.stance)}`}>
                      {f.stance}
                    </span>
                  </div>
                  <p className="mt-1.5 text-[11px]" style={{ color: "var(--text-secondary)" }}>领袖: {f.leader}</p>
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full" style={{ background: "color-mix(in srgb, var(--panel-bg) 80%, transparent)" }}>
                    <div className="h-full rounded-full" style={{ width: `${f.influence}%`, background: "var(--accent-gradient)" }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
