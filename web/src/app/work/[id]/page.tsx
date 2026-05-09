"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import type { Work, Character, Chapter, LoreEntry, Faction, Scene, Snapshot, ConflictRecord, AiGenerationRecord } from "@/lib/types";
import { api } from "@/lib/api-client";

/** 统计数据聚合接口 */
interface DashboardStats {
  work: Work | null;
  chapterCount: number;
  characterCount: number;
  loreCount: number;
  factionCount: number;
  sceneCount: number;
  snapshotCount: number;
  conflictCount: number;
  aiRecordCount: number;
  recentConflicts: ConflictRecord[];
  recentAiRecords: AiGenerationRecord[];
}

export default function WorkHomePage() {
  const params = useParams();
  const router = useRouter();
  const workId = params.id as string;

  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  const loadDashboardData = useCallback(async () => {
    try {
      // 并行加载所有数据
      const [work, chapters, characters, lore, factions, scenes, snapshots, conflicts, aiRecords] =
        await Promise.allSettled([
          api.works.get(workId),
          api.chapters.list(workId),
          api.characters.list(workId),
          api.lore.list(workId),
          api.factions.list(workId),
          api.scenes.list(workId),
          api.snapshots.list(workId), // 需要确认此 API 存在
          api.conflicts?.list(workId) ?? Promise.resolve([] as unknown as PromiseFulfilledResult<ConflictRecord[]>),
          api.aiRecords?.list(workId) ?? Promise.resolve([] as unknown as PromiseFulfilledResult<AiGenerationRecord[]>),
        ]);

      setStats({
        work: work.status === "fulfilled" ? work.value : null,
        chapterCount: chapters.status === "fulfilled" ? chapters.value.length : 0,
        characterCount: characters.status === "fulfilled" ? characters.value.length : 0,
        loreCount: lore.status === "fulfilled" ? lore.value.length : 0,
        factionCount: factions.status === "fulfilled" ? factions.value.length : 0,
        sceneCount: scenes.status === "fulfilled" ? scenes.value.length : 0,
        snapshotCount: snapshots.status === "fulfilled" ? (snapshots.value as unknown as []).length : 0,
        conflictCount: conflicts.status === "fulfilled" ? (conflicts.value as unknown as ConflictRecord[]).length : 0,
        aiRecordCount: aiRecords.status === "fulfilled" ? (aiRecords.value as unknown as AiGenerationRecord[]).length : 0,
        recentConflicts: (conflicts.status === "fulfilled" ? conflicts.value : []) as unknown as ConflictRecord[],
        recentAiRecords: (aiRecords.status === "fulfilled" ? aiRecords.value : []) as unknown as AiGenerationRecord[],
      });
    } catch (err) {
      console.error("加载数据失败:", err);
    } finally {
      setLoading(false);
    }
  }, [workId]);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!stats?.work) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <p className="text-white/60 text-lg">作品不存在或已被删除</p>
          <button
            onClick={() => router.push("/")}
            className="mt-4 px-6 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white transition-colors cursor-pointer"
          >
            返回书架
          </button>
        </div>
      </div>
    );
  }

  const statCards = [
    { label: "章节", value: stats.chapterCount, icon: "📖", href: `/work/${workId}/chapters`, color: "from-blue-600/20 to-blue-800/20 border-blue-500/20" },
    { label: "角色", value: stats.characterCount, icon: "👤", href: `/work/${workId}/characters`, color: "from-green-600/20 to-green-800/20 border-green-500/20" },
    { label: "世界观", value: stats.loreCount, icon: "🌍", href: `/work/${workId}/lore`, color: "from-amber-600/20 to-amber-800/20 border-amber-500/20" },
    { label: "阵营", value: stats.factionCount, icon: "⚔️", href: `/work/${workId}/factions`, color: "from-red-600/20 to-red-800/20 border-red-500/20" },
    { label: "场景", value: stats.sceneCount, icon: "🏰", href: `/work/${workId}/scenes`, color: "from-cyan-600/20 to-cyan-800/20 border-cyan-500/20" },
    { label: "快照", value: stats.snapshotCount, icon: "📸", href: `/work/${workId}/snapshots`, color: "from-purple-600/20 to-purple-800/20 border-purple-500/20" },
    { label: "冲突记录", value: stats.conflictCount, icon: "⚠️", href: "#", color: "from-orange-600/20 to-orange-800/20 border-orange-500/20" },
    { label: "AI 记录", value: stats.aiRecordCount, icon: "🤖", href: "#", color: "from-pink-600/20 to-pink-800/20 border-pink-500/20" },
  ];

  return (
    <div className="min-h-screen bg-slate-950">
      {/* 顶部导航 */}
      <header className="border-b border-white/10 bg-black/30 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push("/")}
              className="text-white/40 hover:text-white transition-colors cursor-pointer"
            >
              ← 返回书架
            </button>
            <span className="text-white/20">|</span>
            <h1 className="text-lg font-semibold text-white">{stats.work.title}</h1>
            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
              stats.work.stage === "planning" ? "bg-blue-100 text-blue-700" :
              stats.work.stage === "drafting" ? "bg-yellow-100 text-yellow-700" :
              stats.work.stage === "polishing" ? "bg-purple-100 text-purple-700" :
              "bg-green-100 text-green-700"
            }`}>
              {{
                planning: "构思中",
                drafting: "写作中",
                polishing: "润色中",
                completed: "已完成",
              }[stats.work.stage] ?? stats.work.stage}
            </span>
          </div>
          <nav className="flex items-center gap-1">
            {[
              { label: "概览", href: `/work/${workId}` },
              { label: "章节", href: `/work/${workId}/chapters` },
              { label: "角色", href: `/work/${workId}/characters` },
              { label: "世界观", href: `/work/${workId}/lore` },
              { label: "阵营", href: `/work/${workId}/factions` },
              { label: "场景", href: `/work/${workId}/scenes` },
              { label: "快照", href: `/work/${workId}/snapshots` },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="px-3 py-1.5 rounded-lg text-sm text-white/60 hover:text-white hover:bg-white/10 transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      {/* 主内容 */}
      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* 统计卡片网格 */}
        <section>
          <h2 className="text-lg font-semibold text-white mb-4">📊 数据概览</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
            {statCards.map((card) => (
              <Link
                key={card.label}
                href={card.href}
                className={`rounded-xl border bg-gradient-to-br ${card.color} p-4 hover:scale-105 transition-transform duration-200`}
              >
                <div className="text-2xl mb-1">{card.icon}</div>
                <div className="text-2xl font-bold text-white">{card.value}</div>
                <div className="text-xs text-white/50">{card.label}</div>
              </Link>
            ))}
          </div>
        </section>

        {/* 作品信息 + 最近动态 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 作品信息卡片 */}
          <section className="rounded-xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-lg font-semibold text-white mb-4">📕 作品信息</h2>
            <div className="space-y-3">
              <InfoRow label="名称" value={stats.work.title} />
              <InfoRow label="类型" value={stats.work.genre} />
              <InfoRow label="阶段" value={{
                planning: "构思中", drafting: "写作中", polishing: "润色中", completed: "已完成",
              }[stats.work.stage]} />
              <InfoRow label="主题" value={stats.work.theme} />
              {stats.work.summary && <InfoRow label="简介" value={stats.work.summary} />}
              <InfoRow label="创建时间" value={new Date(stats.work.createdAt).toLocaleString("zh-CN")} />
              <InfoRow label="更新时间" value={new Date(stats.work.updatedAt).toLocaleString("zh-CN")} />
            </div>
          </section>

          {/* 最近冲突 / AI 记录 */}
          <section className="rounded-xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-lg font-semibold text-white mb-4">🔔 最近动态</h2>
            {stats.recentConflicts.length > 0 ? (
              <div className="space-y-2">
                {stats.recentConflicts.slice(0, 5).map((c) => (
                  <div key={c.id} className="flex items-start gap-2 p-2 rounded-lg bg-red-500/10 border border-red-500/20">
                    <span className="text-sm">⚠️</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white/80 truncate">{c.title}</p>
                      <p className="text-xs text-white/40">{c.severity}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : stats.recentAiRecords.length > 0 ? (
              <div className="space-y-2">
                {(stats.recentAiRecords.slice(0, 5) as unknown as Array<{ id: string; moduleType: string; createdAt: string }>).map((r) => (
                  <div key={r.id} className="flex items-start gap-2 p-2 rounded-lg bg-pink-500/10 border border-pink-500/20">
                    <span className="text-sm">🤖</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white/80 truncate">{r.moduleType}</p>
                      <p className="text-xs text-white/40">{new Date(r.createdAt).toLocaleString("zh-CN")}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-white/30 text-sm text-center py-8">暂无动态</p>
            )}
          </section>
        </div>

        {/* 快捷入口 */}
        <section className="rounded-xl border border-white/10 bg-gradient-to-r from-purple-900/20 to-pink-900/20 p-6">
          <h2 className="text-lg font-semibold text-white mb-4">🚀 快捷操作</h2>
          <div className="flex flex-wrap gap-3">
            <QuickAction label="新建章节" icon="📝" href={`/work/${workId}/chapters`} />
            <QuickAction label="创建角色" icon="🧑" href={`/work/${workId}/characters`} />
            <QuickAction label="添加世界观" icon="📜" href={`/work/${workId}/lore`} />
            <QuickAction label="AI 续写" icon="✨" href="#" disabled />
            <QuickAction label="冲突检测" icon="🔍" href="#" disabled />
          </div>
        </section>
      </main>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-2 text-sm">
      <span className="text-white/40 shrink-0 w-16">{label}</span>
      <span className="text-white/80 break-all">{value || "-"}</span>
    </div>
  );
}

function QuickAction({ label, icon, href, disabled }: { label: string; icon: string; href: string; disabled?: boolean }) {
  if (disabled) {
    return (
      <span className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white/30 text-sm cursor-not-allowed">
        {icon} {label}
      </span>
    );
  }
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 hover:border-purple-500/40 hover:bg-white/10 text-white/70 hover:text-white text-sm transition-colors"
    >
      {icon} {label}
    </Link>
  );
}
