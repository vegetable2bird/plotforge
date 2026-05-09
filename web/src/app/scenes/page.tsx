"use client";

import { motion } from "framer-motion";
import { Map, CloudRain, Clock, AlertTriangle, Users, Plus } from "lucide-react";
import { useState, useEffect, useCallback } from "react";

import { fadeUp, staggerDelay, expandHeight } from "@/lib/motion-config";
import { api } from "@/lib/api-client";
import { SceneEditor } from "@/components/scene-editor";
import type { Scene, Chapter } from "@/lib/types";

export default function ScenesPage() {
  const [scenes, setScenes] = useState<Scene[]>([]);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [selectedChapter, setSelectedChapter] = useState<string | null>(null);
  const [selectedScene, setSelectedScene] = useState<Scene | null>(null);
  const [editingScene, setEditingScene] = useState<Scene | null>(null);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    try {
      const [scenesData, chaptersData] = await Promise.all([
        api.scenes.list(), // TODO: 传入当前 workId
        api.chapters.list(), // TODO: 传入当前 workId
      ]);
      setScenes(scenesData);
      setChapters(chaptersData);
      if (chaptersData.length > 0 && !selectedChapter) {
        setSelectedChapter(chaptersData[0].id);
      }
    } catch (err) {
      console.error("Failed to load data:", err);
    } finally {
      setLoading(false);
    }
  }, [selectedChapter]);

  useEffect(() => { loadData(); }, [loadData]);

  const handleSave = async (updated: Scene) => {
    try {
      const result = await api.scenes.update(updated.id, updated);
      setEditingScene(null);
      setSelectedScene(result);
      await loadData();
    } catch (err) {
      console.error("Failed to save scene:", err);
    }
  };

  const handleCreate = async () => {
    try {
      const newScene = await api.scenes.create({
        workId: "default-work", // TODO: 从上下文获取
        name: "新场景",
        environment: "",
        weather: "",
        timeSetting: "",
        dangerZones: [],
        residents: [],
      });
      await loadData();
      setSelectedScene(newScene);
      setEditingScene(newScene);
    } catch (err) {
      console.error("Failed to create scene:", err);
    }
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-sm" style={{ color: "var(--muted)" }}>加载中...</p>
      </div>
    );
  }

  if (editingScene) {
    return (
      <div className="flex h-full flex-col overflow-y-auto">
        <div className="mx-auto w-full max-w-5xl p-4 sm:p-6 lg:p-8">
          <SceneEditor scene={editingScene} onSave={handleSave} onCancel={() => setEditingScene(null)} />
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col overflow-y-auto">
      <div className="mx-auto w-full max-w-5xl p-4 sm:p-6 lg:p-8">
        <div className="mb-6 flex flex-col gap-3 sm:mb-8 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-xl font-semibold text-gradient sm:text-2xl">场景沙盘</h1>
            <p className="mt-1 text-xs sm:text-sm" style={{ color: "var(--muted)" }}>这里负责空间调度。打戏、追逐、潜入和多人同场时，先在这里把位置关系和危险区理顺，再写正文。</p>
          </div>
          <button type="button" onClick={handleCreate} className="btn-accent flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium sm:px-5">
            <Plus size={14} />
            新建场景
          </button>
        </div>

        <div className="glass mb-5 rounded-2xl p-4 sm:mb-6 sm:p-5">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-sm font-semibold" style={{ color: "var(--text)" }}>场景模块怎么用</p>
              <p className="mt-1 text-sm leading-6" style={{ color: "var(--text-secondary)" }}>当一章里有人物走位、空间遮挡、埋伏点或危险区时，先确认场景，再回正文落实细节。简单对话章可以少用，复杂调度章要优先用。</p>
            </div>
            <span className="rounded-full px-2.5 py-1 text-[10px] font-medium" style={{ background: "color-mix(in srgb, var(--accent-gradient) 12%, transparent)", color: "var(--text-secondary)" }}>
              推荐顺序：选章节 → 定场景 → 看危险区 → 写动作
            </span>
          </div>
        </div>

        {chapters.length > 0 && (
          <div className="mb-6 flex flex-wrap items-center gap-2 sm:mb-8">
            {chapters.map((chapter) => (
              <button
                key={chapter.id}
                type="button"
                onClick={() => { setSelectedChapter(chapter.id); setSelectedScene(null); }}
                className="glass rounded-lg px-3 py-1.5 text-[11px] font-medium transition-all duration-200 sm:px-4 sm:py-2 sm:text-sm"
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
        )}

        <div className="grid gap-4 sm:gap-5 md:grid-cols-2">
          {scenes.map((scene, i) => (
            <motion.button
              key={scene.id}
              type="button"
              onClick={() => setSelectedScene(selectedScene?.id === scene.id ? null : scene)}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={fadeUp(staggerDelay(i))}
              className={`glass hover-lift w-full rounded-xl p-5 text-left sm:rounded-2xl ${selectedScene?.id === scene.id ? "border-[var(--panel-border-hover)]" : ""}`}
            >
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg" style={{ background: "color-mix(in srgb, var(--accent-gradient) 12%, transparent)", color: "var(--text-secondary)" }}>
                  <Map size={18} />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-semibold sm:text-base" style={{ color: "var(--text)" }}>{scene.name}</h3>
                  <p className="mt-2 text-[11px] leading-relaxed sm:text-xs" style={{ color: "var(--text-secondary)" }}>{scene.environment}</p>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-3 gap-3">
                <div className="flex items-center gap-2">
                  <CloudRain size={14} style={{ color: "var(--muted)" }} />
                  <span className="text-[11px]" style={{ color: "var(--text-secondary)" }}>{scene.weather}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={14} style={{ color: "var(--muted)" }} />
                  <span className="text-[11px]" style={{ color: "var(--text-secondary)" }}>{scene.timeSetting}</span>
                </div>
                <div className="flex items-center gap-2">
                  <AlertTriangle size={14} className="text-amber-500" />
                  <span className="text-[11px]" style={{ color: "var(--text-secondary)" }}>{scene.dangerZones.length} 危险区</span>
                </div>
              </div>

              <div className="mt-4">
                <div className="flex items-center gap-2">
                  <Users size={14} style={{ color: "var(--muted)" }} />
                  <span className="text-[10px] font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--muted)" }}>在场角色</span>
                </div>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {scene.residents.map((resident) => (
                    <span key={resident} className="rounded-full px-2.5 py-1 text-[10px] font-medium" style={{ background: "color-mix(in srgb, var(--accent-gradient) 15%, transparent)", color: "var(--text-secondary)" }}>{resident}</span>
                  ))}
                </div>
              </div>

              {selectedScene?.id === scene.id && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={expandHeight}
                  className="mt-4 border-t pt-4"
                  style={{ borderColor: "var(--panel-border)" }}
                >
                  <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--muted)" }}>危险区域详情</p>
                  <div className="space-y-2">
                    {scene.dangerZones.map((zone) => (
                      <div key={zone} className="glass-soft rounded-lg px-3 py-2 text-xs" style={{ color: "var(--text-secondary)" }}>
                        <AlertTriangle size={12} className="mr-1.5 inline text-amber-500" />
                        {zone}
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 flex gap-2">
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); setEditingScene(scene); }}
                      className="btn-accent rounded-lg px-3 py-2 text-xs font-medium"
                    >
                      编辑场景
                    </button>
                  </div>
                </motion.div>
              )}
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}
