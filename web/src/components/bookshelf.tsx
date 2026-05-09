"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { Work } from "@/lib/types";
import { api } from "@/lib/api-client";

const GENRE_LABELS: Record<string, string> = {
  fantasy: "奇幻",
  scifi: "科幻",
  romance: "言情",
  mystery: "悬疑",
  history: "历史",
  modern: "现代",
  other: "其他",
};

const STAGE_COLORS: Record<string, string> = {
  planning: "bg-blue-100 text-blue-700",
  drafting: "bg-yellow-100 text-yellow-700",
  polishing: "bg-purple-100 text-purple-700",
  completed: "bg-green-100 text-green-700",
};

const STAGE_LABELS: Record<string, string> = {
  planning: "构思中",
  drafting: "写作中",
  polishing: "润色中",
  completed: "已完成",
};

export default function Bookshelf() {
  const router = useRouter();
  const [works, setWorks] = useState<Work[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [creating, setCreating] = useState(false);

  // 新建作品表单
  const [form, setForm] = useState({
    title: "",
    genre: "fantasy",
    summary: "",
    userId: "",
  });

  const loadWorks = useCallback(async () => {
    try {
      // TODO: 从登录状态获取真实 userId
      const data = await api.works.list(); // 暂时获取全部
      setWorks(data);
    } catch (err) {
      console.error("加载作品失败:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadWorks();
  }, [loadWorks]);

  async function handleCreate() {
    if (!form.title.trim()) return;
    setCreating(true);
    try {
      await api.works.create({
        ...form,
        stage: "planning",
        theme: "obsidian",
        userId: form.userId || "default-user", // TODO: 替换为真实用户 ID
      });
      setShowCreateModal(false);
      setForm({ title: "", genre: "fantasy", summary: "", userId: "" });
      await loadWorks();
    } catch (err) {
      console.error("创建作品失败:", err);
    } finally {
      setCreating(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("确定要删除这个作品吗？此操作不可恢复！")) return;
    try {
      await api.works.delete(id);
      setWorks((prev) => prev.filter((w) => w.id !== id));
    } catch (err) {
      console.error("删除作品失败:", err);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900">
      {/* 顶部导航 */}
      <header className="border-b border-white/10 backdrop-blur-sm bg-black/20 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            📚 PlotForge · 作品书架
          </h1>
          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="text-sm text-white/60 hover:text-white transition-colors"
            >
              登录
            </Link>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-sm font-medium transition-colors cursor-pointer"
            >
              ✨ 新建作品
            </button>
          </div>
        </div>
      </header>

      {/* 主内容区 */}
      <main className="max-w-7xl mx-auto px-6 py-10">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : works.length === 0 ? (
          /* 空状态 */
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="text-7xl mb-6">📖</div>
            <h2 className="text-2xl font-semibold text-white/80 mb-3">还没有作品</h2>
            <p className="text-white/50 mb-8 max-w-md">
              创建你的第一个作品，开始构建属于你的故事世界吧。
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-8 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-medium transition-all cursor-pointer shadow-lg shadow-purple-500/25"
            >
              创建第一个作品
            </button>
          </div>
        ) : (
          /* 作品网格 */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {works.map((work) => (
              <div
                key={work.id}
                onClick={() => router.push(`/work/${work.id}`)}
                className="group relative rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-6 hover:border-purple-500/40 hover:bg-white/10 transition-all duration-300 cursor-pointer overflow-hidden"
              >
                {/* 阶段标签 */}
                <div className="absolute top-4 right-4">
                  <span
                    className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium ${
                      STAGE_COLORS[work.stage] ?? "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {STAGE_LABELS[work.stage] ?? work.stage}
                  </span>
                </div>

                {/* 封面区域 */}
                <div className="h-36 rounded-xl mb-4 bg-gradient-to-br from-purple-800/30 to-pink-800/30 flex items-center justify-center group-hover:scale-[1.02] transition-transform duration-300">
                  <span className="text-5xl opacity-60">📕</span>
                </div>

                {/* 信息 */}
                <h3 className="text-lg font-semibold text-white truncate mb-1">{work.title}</h3>
                <p className="text-sm text-white/50 mb-3">
                  {GENRE_LABELS[work.genre] ?? work.genre} ·{" "}
                  {new Date(work.updatedAt).toLocaleDateString("zh-CN")}
                </p>
                {work.summary && (
                  <p className="text-sm text-white/40 line-clamp-2">{work.summary}</p>
                )}

                {/* 操作按钮 */}
                <div className="mt-4 pt-4 border-t border-white/10 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/work/${work.id}`);
                    }}
                    className="flex-1 px-3 py-1.5 rounded-lg bg-purple-600/80 hover:bg-purple-500 text-white text-xs font-medium transition-colors cursor-pointer"
                  >
                    打开
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(work.id);
                    }}
                    className="px-3 py-1.5 rounded-lg bg-red-600/30 hover:bg-red-500/50 text-red-300 text-xs font-medium transition-colors cursor-pointer"
                  >
                    删除
                  </button>
                </div>
              </div>
            ))}

            {/* 新建卡片 */}
            <div
              onClick={() => setShowCreateModal(true)}
              className="rounded-2xl border border-dashed border-white/20 bg-white/[0.02] p-6 flex flex-col items-center justify-center min-h-[280px] hover:border-purple-500/40 hover:bg-white/5 transition-all duration-300 cursor-pointer"
            >
              <span className="text-4xl mb-3 opacity-40">+</span>
              <span className="text-sm text-white/40">新建作品</span>
            </div>
          </div>
        )}
      </main>

      {/* 新建作品弹窗 */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50" onClick={() => setShowCreateModal(false)}>
          <div
            className="bg-slate-800 rounded-2xl border border-white/10 p-8 w-full max-w-md shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold text-white mb-6">✨ 创建新作品</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-white/70 mb-1.5">作品名称 *</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="输入你的作品名..."
                  className="w-full px-4 py-2.5 rounded-lg bg-slate-900 border border-white/10 text-white placeholder:text-white/30 focus:border-purple-500 focus:outline-none transition-colors"
                  autoFocus
                  onKeyDown={(e) => e.key === "Enter" && handleCreate()}
                />
              </div>

              <div>
                <label className="block text-sm text-white/70 mb-1.5">类型</label>
                <select
                  value={form.genre}
                  onChange={(e) => setForm({ ...form, genre: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg bg-slate-900 border border-white/10 text-white focus:border-purple-500 focus:outline-none transition-colors"
                >
                  {Object.entries(GENRE_LABELS).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm text-white/70 mb-1.5">简介</label>
                <textarea
                  value={form.summary}
                  onChange={(e) => setForm({ ...form, summary: e.target.value })}
                  placeholder="简单描述一下你的作品..."
                  rows={3}
                  className="w-full px-4 py-2.5 rounded-lg bg-slate-900 border border-white/10 text-white placeholder:text-white/30 focus:border-purple-500 focus:outline-none transition-colors resize-none"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-8">
              <button
                onClick={() => setShowCreateModal(false)}
                className="flex-1 px-4 py-2.5 rounded-lg border border-white/10 text-white/70 hover:bg-white/5 transition-colors cursor-pointer"
              >
                取消
              </button>
              <button
                onClick={handleCreate}
                disabled={!form.title.trim() || creating}
                className="flex-1 px-4 py-2.5 rounded-lg bg-purple-600 hover:bg-purple-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-medium transition-colors cursor-pointer"
              >
                {creating ? "创建中..." : "创建"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
