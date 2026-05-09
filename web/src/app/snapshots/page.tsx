"use client";

import { motion } from "framer-motion";
import { Clock, RotateCcw, Eye, Trash2, ArrowDownToLine, Plus } from "lucide-react";
import { useState, useEffect, useCallback } from "react";

import { fadeUp, staggerDelay } from "@/lib/motion-config";
import { api } from "@/lib/api-client";
import type { Snapshot } from "@/lib/types";

export default function SnapshotsPage() {
  const [snapshots, setSnapshots] = useState<Snapshot[]>([]);
  const [selectedSnapshotId, setSelectedSnapshotId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const loadSnapshots = useCallback(async () => {
    try {
      const data = await api.snapshots.list(); // TODO: 传入当前 workId
      setSnapshots(data);
    } catch (err) {
      console.error("加载快照失败:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSnapshots();
  }, [loadSnapshots]);

  const selectedSnapshot = snapshots.find((item) => item.id === selectedSnapshotId) ?? null;

  async function handleCreateSnapshot() {
    try {
      const newSnapshot = await api.snapshots.create({
        workId: "default-work", // TODO: 从上下文获取
        scopeType: "工作区",
        title: `手动工作区快照 ${new Date().toLocaleString("zh-CN")}`,
        summary: "保留当前工作区状态，便于在大改或试验前快速回退。",
      });
      await loadSnapshots();
      setSelectedSnapshotId(newSnapshot.id);
    } catch (err) {
      console.error("创建快照失败:", err);
    }
  }

  async function handleDeleteSnapshot(snapshotId: string) {
    try {
      // 快照删除 API（如果有的话），目前先从前端列表移除
      setSnapshots((prev) => prev.filter((item) => item.id !== snapshotId));
      if (selectedSnapshot?.id === snapshotId) {
        setSelectedSnapshotId(null);
      }
    } catch (err) {
      console.error("删除快照失败:", err);
    }
  }

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
        {/* Header */}
        <div className="mb-6 flex flex-col gap-3 sm:mb-8 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-xl font-semibold text-gradient sm:text-2xl">快照中心</h1>
            <p className="mt-1 text-xs sm:text-sm" style={{ color: "var(--muted)" }}>这里负责安全试错。大改章节、重写人物弧光或尝试激进分支前，先留一个快照，避免改崩后无处回退。</p>
          </div>
          <button type="button" onClick={handleCreateSnapshot} className="btn-accent flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium sm:px-5 cursor-pointer">
            <Plus size={14} />
            创建快照
          </button>
        </div>

        <div className="glass mb-5 rounded-2xl p-4 sm:mb-6 sm:p-5">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-sm font-semibold" style={{ color: "var(--text)" }}>快照模块怎么用</p>
              <p className="mt-1 text-sm leading-6" style={{ color: "var(--text-secondary)" }}>推荐在三种时候创建快照：大改前、定稿前、尝试平行分支前。这样你可以放心试错，写崩时也能快速回到稳定版本。</p>
            </div>
            <span className="rounded-full px-2.5 py-1 text-[10px] font-medium" style={{ background: "color-mix(in srgb, var(--accent-gradient) 12%, transparent)", color: "var(--text-secondary)" }}>
              推荐顺序：先快照 → 再大改 → 不满意就回退
            </span>
          </div>
        </div>

        {/* Snapshot List */}
        <div className="space-y-4 sm:space-y-5">
          {snapshots.map((snapshot, i) => (
            <motion.div
              key={snapshot.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={fadeUp(staggerDelay(i))}
              className={`glass rounded-xl p-5 sm:rounded-2xl sm:p-6 ${selectedSnapshot?.id === snapshot.id ? "border-[var(--panel-border-hover)]" : ""}`}
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex flex-1 items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg" style={{ background: "color-mix(in srgb, var(--accent-gradient) 12%, transparent)", color: "var(--text-secondary)" }}>
                    <Clock size={18} />
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-sm font-semibold sm:text-base" style={{ color: "var(--text)" }}>{snapshot.title}</h3>
                      <span className="rounded-full px-2.5 py-0.5 text-[10px] font-medium" style={{ background: "color-mix(in srgb, var(--accent-gradient) 12%, transparent)", color: "var(--text-secondary)" }}>
                        {snapshot.scopeType}
                      </span>
                    </div>
                    <p className="mt-2 text-[11px] leading-relaxed sm:text-xs" style={{ color: "var(--text-secondary)" }}>{snapshot.summary}</p>
                    <p className="mt-2 text-[10px] font-medium" style={{ color: "var(--muted)" }}>创建于 {new Date(snapshot.createdAt).toLocaleString("zh-CN")}</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <button type="button" onClick={() => setSelectedSnapshotId(snapshot.id)} className="glass hover-lift rounded-lg p-2 transition-all duration-200 cursor-pointer" style={{ color: "var(--text-secondary)" }}>
                    <Eye size={16} />
                  </button>
                  <button type="button" className="glass hover-lift rounded-lg p-2 transition-all duration-200 cursor-pointer" style={{ color: "var(--text-secondary)" }}>
                    <RotateCcw size={16} />
                  </button>
                  <button type="button" className="glass hover-lift rounded-lg p-2 transition-all duration-200 cursor-pointer" style={{ color: "var(--text-secondary)" }}>
                    <ArrowDownToLine size={16} />
                  </button>
                  <button type="button" onClick={() => handleDeleteSnapshot(snapshot.id)} className="glass hover-lift rounded-lg p-2 transition-all duration-200 cursor-pointer" style={{ color: "var(--text-secondary)" }}>
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}

          {snapshots.length === 0 && (
            <div className="glass rounded-2xl px-5 py-10 text-center">
              <Clock size={28} className="mx-auto" style={{ color: "var(--muted)" }} />
              <p className="mt-3 text-sm font-medium" style={{ color: "var(--text)" }}>还没有可用快照</p>
              <p className="mt-1 text-sm" style={{ color: "var(--muted)" }}>建议在大改章节前先创建一个快照，后续试错会更安心。</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
